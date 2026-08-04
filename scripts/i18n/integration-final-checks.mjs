import fs from "fs";
import path from "path";

const HE = /[\u0590-\u05FF]/;
const files = [
  "locales/ar-001/school.json",
  "content-packs/ar-001/global-burn-down/pages__teacher__worksheets__index.json",
  "content-packs/ar-001/global-burn-down/pages__teacher__class__[classId]__worksheets__index.json",
  "content-packs/ar-001/global-burn-down/pages__parent__school-inbox.json",
  "content-packs/ar-001/global-burn-down/burn-down-index.json",
];

const wrong =
  "التحم" + String.fromCodePoint(0x05d9) + "ل"; // Hebrew yod

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.log("MISSING", f);
    continue;
  }
  const t = fs.readFileSync(f, "utf8");
  console.log("file", f, "hasHebrew", HE.test(t), "hasWrongGlyph", t.includes(wrong));
  const re = /"loading"\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(t))) {
    const s = m[1];
    console.log(
      "  loading=",
      s,
      "codepoints=",
      [...s].map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(" ")
    );
    console.log("  loadingHasHebrew", HE.test(s));
  }
}

function listIndexes(root) {
  const out = [];
  function walk(d) {
    for (const n of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, n.name);
      if (n.isDirectory()) walk(p);
      else if (n.name === "burn-down-index.json") out.push(p.replace(/\\/g, "/"));
    }
  }
  walk(root);
  return out;
}
console.log("indexes ar-001", listIndexes("content-packs/ar-001"));
console.log("indexes en", listIndexes("content-packs/en").filter((p) => /reports|learning|games|global-burn-down|public-seo/.test(p)));
