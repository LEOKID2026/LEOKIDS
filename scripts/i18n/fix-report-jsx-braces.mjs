import fs from "node:fs";
import path from "node:path";

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next") continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs, out);
    else if (/\.(jsx|js)$/.test(ent.name)) out.push(abs);
  }
  return out;
}

let fixed = 0;
for (const abs of walk(".")) {
  let src = fs.readFileSync(abs, "utf8");
  const next = src.replace(
    /(\b(?:title|aria-label|message|customRangeLabel|name|placeholder|alt|label))=reportPackCopy\(("(?:\\.|[^"\\])*",\s*"(?:\\.|[^"\\])*")\)/g,
    "$1={reportPackCopy($2)}"
  );
  if (next !== src) {
    fs.writeFileSync(abs, next, "utf8");
    fixed += 1;
    console.log(path.relative(".", abs));
  }
}
console.log("fixed", fixed);
