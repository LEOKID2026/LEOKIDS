/**
 * Extract docs/learning-book/en from pre-deletion commit into artifacts/id-ID-phase8/en-sot.
 * Does not restore into docs/learning-book/en (English SoT ownership stays untouched on HEAD).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const COMMIT = "b08780b15^";
const PREFIX = "docs/learning-book/en/";
const OUT = path.join(ROOT, "artifacts/id-ID-phase8/en-sot");

const list = execFileSync("git", ["ls-tree", "-r", "--name-only", COMMIT, "--", "docs/learning-book/en"], {
  cwd: ROOT,
  encoding: "utf8",
})
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);

fs.mkdirSync(OUT, { recursive: true });
let n = 0;
for (const f of list) {
  if (!f.startsWith(PREFIX)) continue;
  const rel = f.slice(PREFIX.length);
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const buf = execFileSync("git", ["show", `${COMMIT}:${f}`], {
    cwd: ROOT,
    maxBuffer: 32 * 1024 * 1024,
  });
  fs.writeFileSync(dest, buf);
  n += 1;
}

const slots = [];
for (const subject of ["math", "geometry", "science", "english"]) {
  for (const grade of ["g1", "g2", "g3", "g4", "g5", "g6"]) {
    const drafts = path.join(OUT, subject, grade, "drafts");
    const files = fs.existsSync(drafts)
      ? fs.readdirSync(drafts).filter((x) => x.endsWith(".md") && x !== "README.md")
      : [];
    slots.push({ subject, grade, files: files.length, hasDraftsDir: fs.existsSync(drafts) });
  }
}

fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-phase8/en-sot-inventory.json"),
  JSON.stringify({ commit: COMMIT, extracted: n, slots }, null, 2)
);
console.log(JSON.stringify({ extracted: n, slotsOk: slots.filter((s) => s.hasDraftsDir && s.files > 0).length }, null, 2));
