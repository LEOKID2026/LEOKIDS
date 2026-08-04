import fs from "fs";
import path from "path";

const ROOT = "content-packs/ar-001";
const replacements = [
  // Geometry area family (math sense of area)
  [/منطقة المربع/g, "مساحة المربع"],
  [/منطقة المثلث/g, "مساحة المثلث"],
  [/منطقة الدائرة/g, "مساحة الدائرة"],
  [/منطقة المستطيل/g, "مساحة المستطيل"],
  [/منطقة متوازي الأضلاع/g, "مساحة متوازي الأضلاع"],
  [/منطقة شبه منحرف/g, "مساحة شبه المنحرف"],
  [/بين المنطقة والمحيط/g, "بين المساحة والمحيط"],
  [/بين النطاق والمنطقة/g, "بين المحيط والمساحة"],
  [/الخلط المتكرر بين النطاق والمنطقة/g, "الخلط المتكرر بين المحيط والمساحة"],
  [/تخطيط منطقة المستطيل/g, "تخطيط مساحة المستطيل"],
  // Subject/topic
  [/التقسيم حسب الموضوع/g, "التوزيع حسب المادة"],
  // Class group vs grade — only clear class-report chrome
  [/جارٍ تحميل تقرير الصف…/g, "جارٍ تحميل تقرير الفصل…"],
  [/تحميل تقرير الصف/g, "تحميل تقرير الفصل"],
];

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

let filesTouched = 0;
let totalReplacements = 0;
for (const file of walk(ROOT)) {
  let text = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const [re, to] of replacements) {
    const before = text;
    text = text.replace(re, to);
    if (text !== before) {
      const matches = before.match(re);
      n += matches ? matches.length : 1;
    }
  }
  if (n > 0) {
    fs.writeFileSync(file, text);
    filesTouched++;
    totalReplacements += n;
    console.log(file, n);
  }
}
console.log(JSON.stringify({ filesTouched, totalReplacements }));
