/**
 * Rebuild canonical burn-down-index.json from leaf packs.
 *
 * Domain layout A (reports/learning/games):
 *   content-packs/<loc>/<domain>/burn-down/*.json
 *   → content-packs/<loc>/<domain>/burn-down-index.json
 *
 * Domain layout B (global-burn-down):
 *   content-packs/<loc>/global-burn-down/*.json
 *   → content-packs/<loc>/global-burn-down/burn-down-index.json
 */
import fs from "node:fs";
import path from "node:path";

function loadCopy(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (raw && typeof raw === "object" && raw.copy && typeof raw.copy === "object") {
    return raw.copy;
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
  return null;
}

function rebuildLeafDir(leafDir, canonicalIndexPath) {
  if (!fs.existsSync(leafDir)) {
    console.log("MISSING", leafDir);
    return { packs: 0, unregistered: 0 };
  }
  /** @type {Record<string, Record<string, string>>} */
  const index = {};
  for (const name of fs.readdirSync(leafDir)) {
    if (!name.endsWith(".json")) continue;
    if (name === "burn-down-index.json") continue;
    const slug = name.slice(0, -".json".length);
    const copy = loadCopy(path.join(leafDir, name));
    if (!copy) continue;
    index[slug] = copy;
  }
  fs.mkdirSync(path.dirname(canonicalIndexPath), { recursive: true });
  fs.writeFileSync(canonicalIndexPath, JSON.stringify(index, null, 2) + "\n");
  // Remove accidental nested index inside leaf dir
  const nested = path.join(leafDir, "burn-down-index.json");
  if (fs.existsSync(nested) && path.resolve(nested) !== path.resolve(canonicalIndexPath)) {
    fs.unlinkSync(nested);
  }
  let unregistered = 0;
  for (const name of fs.readdirSync(leafDir)) {
    if (!name.endsWith(".json") || name === "burn-down-index.json") continue;
    const slug = name.slice(0, -".json".length);
    if (!index[slug]) unregistered += 1;
  }
  console.log(
    path.relative(process.cwd(), canonicalIndexPath),
    "packs=",
    Object.keys(index).length,
    "unregistered=",
    unregistered,
    "badSlug=",
    Object.keys(index).some((k) => k.endsWith(".json"))
  );
  return { packs: Object.keys(index).length, unregistered };
}

const locales = ["en", "ar-001"];
for (const loc of locales) {
  for (const domain of ["reports", "learning", "games"]) {
    rebuildLeafDir(
      path.join("content-packs", loc, domain, "burn-down"),
      path.join("content-packs", loc, domain, "burn-down-index.json")
    );
  }
  rebuildLeafDir(
    path.join("content-packs", loc, "global-burn-down"),
    path.join("content-packs", loc, "global-burn-down", "burn-down-index.json")
  );
}
