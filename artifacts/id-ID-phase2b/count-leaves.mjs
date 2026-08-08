import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function leaves(o, p = [], a = []) {
  if (o === null || typeof o !== "object") {
    a.push({ path: p.join("."), value: o });
    return a;
  }
  if (Array.isArray(o)) {
    o.forEach((x, i) => leaves(x, p.concat(String(i)), a));
    return a;
  }
  for (const k of Object.keys(o)) leaves(o[k], p.concat(k), a);
  return a;
}

for (const ns of ["learning", "worksheets", "games"]) {
  const j = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en", `${ns}.json`), "utf8"));
  const L = leaves(j);
  console.log(ns, L.length);
}
