/**
 * Git diff safety report — deleted/added files, top deletions, .he counts.
 * Run: node scripts/verification/diff-safety-report.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "verification");
fs.mkdirSync(outDir, { recursive: true });

function git(args) {
  return execSync(`git ${args}`, { cwd: root, encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
}

const numstat = git("diff --numstat HEAD").trim().split(/\r?\n/).filter(Boolean);
/** @type {{ status: string, file: string }[]} */
const nameStatus = git("diff --name-status HEAD")
  .trim()
  .split(/\r?\n/)
  .filter((l) => /^[AMDRTU]/.test(l))
  .map((line) => {
    const m = line.match(/^([AMDRTU])\t(.+)$/);
    return m ? { status: m[1], file: m[2] } : null;
  })
  .filter(Boolean);

const deleted = nameStatus.filter((x) => x.status === "D").map((x) => x.file);
const added = nameStatus.filter((x) => x.status === "A").map((x) => x.file);
const modified = nameStatus.filter((x) => x.status === "M").map((x) => x.file);

const deletionsByFile = numstat
  .map((line) => {
    const [add, del, file] = line.split("\t");
    return { file, added: Number(add) || 0, deleted: Number(del) || 0 };
  })
  .filter((x) => x.deleted > 0)
  .sort((a, b) => b.deleted - a.deleted);

const top50 = deletionsByFile.slice(0, 50);

const heDeletedByDir = {};
for (const f of deleted.filter((f) => /\.he\.(js|jsx|ts|tsx)$/.test(f))) {
  const dir = f.includes("/") ? f.split("/").slice(0, 2).join("/") : path.dirname(f);
  heDeletedByDir[dir] = (heDeletedByDir[dir] || 0) + 1;
}

const report = {
  head: git("rev-parse HEAD").trim(),
  summary: {
    filesChanged: nameStatus.length,
    deleted: deleted.length,
    added: added.length,
    modified: modified.length,
    heDeleted: deleted.filter((f) => /\.he\.(js|jsx|ts|tsx)$/.test(f)).length,
  },
  deletedFiles: deleted.sort(),
  addedFiles: added.sort(),
  top50Deletions: top50,
  heDeletedByDir,
};

fs.writeFileSync(path.join(outDir, "diff-safety-report.json"), JSON.stringify(report, null, 2));

console.log("HEAD:", report.head);
console.log("Changed:", report.summary.filesChanged);
console.log("Deleted:", report.summary.deleted, "| Added:", report.summary.added, "| Modified:", report.summary.modified);
console.log(".he deleted:", report.summary.heDeleted);
console.log("\n.he deleted by folder:");
Object.entries(heDeletedByDir)
  .sort((a, b) => b[1] - a[1])
  .forEach(([d, n]) => console.log(`  ${n}\t${d}`));
console.log("\nTop 10 deletions:");
top50.slice(0, 10).forEach((x) => console.log(`  -${x.deleted} +${x.added}\t${x.file}`));
console.log(`\nWrote ${path.join(outDir, "diff-safety-report.json")}`);
