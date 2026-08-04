import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const map = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), "utf8"));
const scopes = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
const part15 = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-15-de-map.json"), "utf8"));
const part14 = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-14-de-map.json"), "utf8"));
const part12 = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-12-de-map.json"), "utf8"));
Object.assign(map, scopes, part12, part14, part15);

// Chrome / README Grade + EN instructional leftovers (infra allowed German)
const chrome = {
  "Important: don't count the start day. No clock or dates in the month.":
    "Wichtig: Zähle den Starttag nicht mit. Keine Uhr und keine Daten im Monat.",
  "Link Grade 3: 7 + 3 = 10 → 67 + 33 = 100 (same idea with tens).":
    "Verbindung 3. Klasse: 7 + 3 = 10 → 67 + 33 = 100 (dieselbe Idee mit Zehnern).",
  "**Do not proceed to Grade 2 or implementation until the Grade 1 signoff document is reviewed.**":
    "**Nicht zur 2. Klasse oder zur Umsetzung übergehen, bis das Freigabedokument der 1. Klasse geprüft ist.**",
  "> **Grade 2 UI is implemented for dev preview only.** Do not deploy or treat draft content as owner-approved until sign-off.":
    "> **Die UI der 2. Klasse ist nur für die Entwicklungsvorschau umgesetzt.** Nicht bereitstellen oder Entwurfsinhalt als freigegeben behandeln, bis die Freigabe vorliegt.",
  "- Grade 5 fraction/percent skills (`frac_add_sub`, `frac_reduce`, etc.) are **not** in G6 spine scope — assumed covered in G5 book.":
    "- Bruch-/Prozentfähigkeiten der 5. Klasse (`frac_add_sub`, `frac_reduce` usw.) sind **nicht** im G6-Spine-Umfang — als in der 5. Klasse abgedeckt angenommen.",
  "**Note:** Grade 2 is the first grade with `experiments` (spine `minGrade = 2`).":
    "**Hinweis:** Die 2. Klasse ist die erste Klasse mit `experiments` (Spine `minGrade = 2`).",
  "- From 12 to 3 — that is a quarter turn": "- Von 12 nach 3 — das ist eine Vierteldrehung",
};
Object.assign(map, chrome);
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), JSON.stringify(map, null, 2));

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], { cwd: ROOT, stdio: "inherit" });
if (r.status) process.exit(r.status);
fs.copyFileSync(
  path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
  path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
);

// Fix content-pack Grade display (English educational titles may stay; Grade chrome → Klasse)
const packPath = path.join(ROOT, "content-packs/de-DE/books/english-page-skills.json");
let pack = fs.readFileSync(packPath, "utf8");
pack = pack.replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse");
fs.writeFileSync(packPath, pack);

// Patch README Grade leftovers directly if rebuild missed variants
for (const rel of [
  "docs/learning-book/de-DE/math/g1/drafts/README.md",
  "docs/learning-book/de-DE/math/g2/drafts/README.md",
  "docs/learning-book/de-DE/math/g6/drafts/README.md",
  "docs/learning-book/de-DE/science/g2/drafts/README.md",
  "docs/learning-book/de-DE/math/g3/drafts/ns_complement10.md",
]) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let t = fs.readFileSync(p, "utf8");
  t = t
    .replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse")
    .replace(/\bDo nicht proceed\b/g, "Nicht übergehen zu")
    .replace(/\bDo not proceed\b/gi, "Nicht übergehen zu")
    .replace(/\boder implementation until\b/g, "oder zur Umsetzung, bis")
    .replace(/\bsignoff document ist reviewed\b/g, "Freigabedokument geprüft ist")
    .replace(/\bgleich idea mit tens\b/g, "dieselbe Idee mit Zehnern")
    .replace(/\bare \*\*nicht\*\* in G6 spine scope\b/g, "sind **nicht** im G6-Spine-Umfang")
    .replace(/\bassumed covered in G5 book\b/g, "als in der 5. Klasse abgedeckt angenommen")
    .replace(/\bis first grade mit\b/g, "ist die erste Klasse mit")
    .replace(/\bLink 3\. Klasse:/g, "Verbindung 3. Klasse:");
  fs.writeFileSync(p, t);
}

spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], { cwd: ROOT, stdio: "inherit" });
spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-bad.mjs")], { cwd: ROOT, stdio: "inherit" });
spawnSync(process.execPath, [path.join(__dirname, "_audit-de-DE-closure.mjs")], { cwd: ROOT, stdio: "inherit" });
