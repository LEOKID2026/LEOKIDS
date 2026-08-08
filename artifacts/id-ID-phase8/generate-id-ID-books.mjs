/**
 * Generate docs/learning-book/id-ID/** from artifacts EN SoT + translation engine/maps.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translateMarkdown } from "./id-book-engine.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EN = path.join(ROOT, "artifacts/id-ID-phase8/en-sot");
const OUT = path.join(ROOT, "docs/learning-book/id-ID");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let wrote = 0;
for (const enFile of walk(EN)) {
  const rel = path.relative(EN, enFile).replace(/\\/g, "/");
  const dest = path.join(OUT, rel);
  const md = fs.readFileSync(enFile, "utf8");
  const englishSubject = rel.startsWith("english/");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, translateMarkdown(md, { englishSubject }), "utf8");
  wrote += 1;
}

const slots = [];
for (const subject of ["math", "geometry", "science", "english"]) {
  for (const grade of ["g1", "g2", "g3", "g4", "g5", "g6"]) {
    const drafts = path.join(OUT, subject, grade, "drafts");
    const files = fs.existsSync(drafts)
      ? fs.readdirSync(drafts).filter((x) => x.endsWith(".md"))
      : [];
    const nonEmpty = files.filter((f) => fs.readFileSync(path.join(drafts, f), "utf8").trim().length > 0);
    slots.push({
      subject,
      grade,
      files: files.length,
      nonEmpty: nonEmpty.length,
      ok: files.length > 0 && nonEmpty.length === files.length,
    });
  }
}

console.log(
  JSON.stringify(
    {
      wrote,
      slotsOk: slots.filter((s) => s.ok).length,
      slotsMissing: slots.filter((s) => !s.ok),
    },
    null,
    2
  )
);
