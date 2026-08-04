import fs from "fs";
import path from "path";

const roots = ["content-packs/ar-001", "locales/ar-001", "data/help-center/ar-001"];
let files = 0;

function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(json|js|md)$/.test(e.name)) {
      let t = fs.readFileSync(p, "utf8");
      const o = t;
      t = t.split("يدورانون والمتعة.").join("تبادلوا الأدوار واستمتعوا.");
      t = t.split("يدورانون والمتعة").join("تبادلوا الأدوار واستمتعوا");
      t = t.split("يتناوبون والمتعة.").join("تبادلوا الأدوار واستمتعوا.");
      t = t.split("منطقة لتعزيز").join("مجال للتعزيز");
      t = t.split('"Powers/exponents"').join('"مقدمة في القوى"');
      t = t.split("Powers/exponents").join("مقدمة في القوى");
      if (t !== o) {
        fs.writeFileSync(p, t);
        files += 1;
        console.log(p);
      }
    }
  }
}

for (const r of roots) {
  if (fs.existsSync(r)) walk(r);
}
console.log({ files });
