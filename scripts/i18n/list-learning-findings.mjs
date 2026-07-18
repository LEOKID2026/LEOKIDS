import { scanRepository } from "./hardcoded-ui-core.mjs";

const { findings } = scanRepository();
const learningRe = /diagnostic-|taxonomy-|probe-map|math-animations|pages\/learning|learning-/;

/** @type {Map<string, number>} */
const byFile = new Map();
for (const f of findings) {
  if (!learningRe.test(f.file)) continue;
  byFile.set(f.file, (byFile.get(f.file) || 0) + 1);
}

for (const [file, count] of [...byFile.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`${count}\t${file}`);
}
console.log("total", [...byFile.values()].reduce((a, b) => a + b, 0));
