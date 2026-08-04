import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

const extra = {
  "# Volume of a Prism — Triangular Base": "# Volumen eines Prismas — dreieckige Grundfläche",
  "Is the force a push or a pull?": "Ist die Kraft ein Druck oder ein Zug?",
  "Three-Dimensional Solids — Names and Introduction":
    "Dreidimensionale Körper — Namen und Einführung",
};
Object.assign(map, extra);
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));

const patches = {
  "docs/learning-book/de-DE/geometry/g6/drafts/prism_volume_triangle.md": [
    ["# Volume of a Prism — Triangular Base", "# Volumen eines Prismas — dreieckige Grundfläche"],
  ],
  "docs/learning-book/de-DE/science/g3/drafts/materials.md": [
    ["Is the force a push or a pull?", "Ist die Kraft ein Druck oder ein Zug?"],
  ],
  "docs/learning-book/de-DE/geometry/g2/drafts/solids.md": [
    ["Three-Dimensional Solids — Names and Introduction", "Dreidimensionale Körper — Namen und Einführung"],
    ["[DRAFT — not owner-approved]", "[ENTWURF — nicht freigegeben]"],
  ],
};

for (const [rel, pairs] of Object.entries(patches)) {
  const p = path.join(ROOT, rel);
  let t = fs.readFileSync(p, "utf8");
  for (const [a, b] of pairs) t = t.split(a).join(b);
  fs.writeFileSync(p, t);
}

spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
spawnSync(process.execPath, [path.join(__dirname, "_audit-de-DE-closure.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
spawnSync(process.execPath, ["--test", path.join(ROOT, "tests/i18n/de-DE-content-layer.test.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
