import fs from "node:fs";
import path from "node:path";

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(json|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

const roots = ["locales/ar-001", "content-packs/ar-001", "data/help-center/ar-001"];
let n = 0;
for (const root of roots) {
  for (const f of walk(root)) {
    let t = fs.readFileSync(f, "utf8");
    const before = t;
    t = t.replace(/آركيد/g, "صالة الألعاب");
    t = t.replace(/أركيد/g, "صالة الألعاب");
    t = t.replace(/الأركيد/g, "صالة الألعاب");
    t = t.replace(/صالة الألعابصالة الألعاب/g, "صالة الألعاب");
    if (t !== before) {
      fs.writeFileSync(f, t);
      n += 1;
      console.log("fixed", f);
    }
  }
}
console.log("files", n);
