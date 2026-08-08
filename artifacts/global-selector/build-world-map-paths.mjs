/**
 * Build compact SVG path data for the global coverage map (CSP-local asset).
 * Source: Natural Earth 110m admin-0 countries (one-time offline generation).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const input = path.join(__dirname, "ne_110m_admin_0_countries.geojson");
const outDir = path.join(repoRoot, "lib", "i18n", "data");
const outFile = path.join(outDir, "world-countries.json");

const WIDTH = 1000;
const HEIGHT = 500;

/** Tiny markets missing from NE 110m polygons → marker centroids [lon, lat]. */
const MARKER_CENTROIDS = {
  BH: [50.55, 26.07],
  CV: [-23.61, 16.0],
  MU: [57.5, -20.2],
  SG: [103.82, 1.35],
};

function project(lon, lat) {
  const x = ((Number(lon) + 180) / 360) * WIDTH;
  const y = ((90 - Number(lat)) / 180) * HEIGHT;
  return [round(x), round(y)];
}

function round(n) {
  return Math.round(n * 10) / 10;
}

function ringToPath(ring, startWithM) {
  if (!ring || ring.length < 2) return "";
  let d = "";
  for (let i = 0; i < ring.length; i += 1) {
    const [x, y] = project(ring[i][0], ring[i][1]);
    if (i === 0) d += `${startWithM ? "M" : "L"}${x} ${y}`;
    else d += `L${x} ${y}`;
  }
  return `${d}Z`;
}

function geomToPath(geometry) {
  if (!geometry) return "";
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring, idx) => ringToPath(ring, true)).join("");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((poly) => poly.map((ring) => ringToPath(ring, true)).join(""))
      .join("");
  }
  return "";
}

function resolveIso2(props) {
  const a2 = String(props.ISO_A2 || "").toUpperCase();
  if (a2 && a2 !== "-99") return a2;
  const eh = String(props.ISO_A2_EH || "").toUpperCase();
  if (eh && eh !== "-99") return eh;
  return "";
}

const geo = JSON.parse(fs.readFileSync(input, "utf8"));
/** @type {Map<string, string[]>} */
const pathsById = new Map();

for (const feature of geo.features) {
  const id = resolveIso2(feature.properties || {});
  if (!id) continue;
  // Skip non-countries we never highlight; still keep for muted base (all included).
  const d = geomToPath(feature.geometry);
  if (!d) continue;
  if (!pathsById.has(id)) pathsById.set(id, []);
  pathsById.get(id).push(d);
}

const countries = [...pathsById.entries()]
  .map(([id, parts]) => ({ id, d: parts.join("") }))
  .sort((a, b) => a.id.localeCompare(b.id));

const markers = Object.entries(MARKER_CENTROIDS)
  .map(([id, [lon, lat]]) => {
    const [cx, cy] = project(lon, lat);
    return { id, cx, cy };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

fs.mkdirSync(outDir, { recursive: true });
const payload = {
  viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
  width: WIDTH,
  height: HEIGHT,
  source: "Natural Earth 110m admin-0 (paths generated offline)",
  countries,
  markers,
};
fs.writeFileSync(outFile, JSON.stringify(payload), "utf8");
console.log(
  `Wrote ${countries.length} countries + ${markers.length} markers → ${path.relative(repoRoot, outFile)} (${fs.statSync(outFile).size} bytes)`
);
