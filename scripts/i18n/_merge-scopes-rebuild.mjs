import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const scopesDe = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
Object.assign(map, scopesDe);
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
console.log({ scopes: Object.keys(scopesDe).length, mapSize: Object.keys(map).length });

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], { cwd: ROOT, stdio: "inherit" });
if (r.status) process.exit(r.status);
fs.copyFileSync(
  path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
  path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
);
r = spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(r.status || 0);
