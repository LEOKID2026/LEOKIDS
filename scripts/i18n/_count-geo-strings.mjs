import fs from "fs";
const s = fs.readFileSync("utils/geometry-explanations.js", "utf8");
const dq = [...s.matchAll(/return\s+"((?:\\.|[^"\\])*)"/g)].map((m) => m[1]).filter((x) => x.length > 8);
const mix = [...s.matchAll(/return\s+mix`([^`]*)`/g)].map((m) => m[1]);
console.log({ dq: dq.length, mix: mix.length, totalApprox: dq.length + mix.length });
