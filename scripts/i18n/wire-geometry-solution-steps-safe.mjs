import fs from "fs";
import crypto from "crypto";

const SRC = "utils/geometry-explanations.js";
const SLUG = "utils__geometry-explanations";
let src = fs.readFileSync(SRC, "utf8");

function keyFor(en) {
  const base = String(en)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return `sol_${base || "step"}_${crypto.createHash("sha1").update(en).digest("hex").slice(0, 8)}`;
}

function arFor(en) {
  return en
    .replace(/^(\d+)\.\s*Identify:/gi, "$1. حدّد:")
    .replace(/^(\d+)\.\s*Formula:/gi, "$1. الصيغة:")
    .replace(/^(\d+)\.\s*substitute:/gi, "$1. عوّض:")
    .replace(/^(\d+)\.\s*Substitute:/gi, "$1. عوّض:")
    .replace(/^(\d+)\.\s*compute:/gi, "$1. احسب:")
    .replace(/^(\d+)\.\s*Calculate:/gi, "$1. احسب:")
    .replace(/^(\d+)\.\s*Conclusion:/gi, "$1. الخلاصة:")
    .replace(/\bsquare\b/gi, "المربع")
    .replace(/\brectangle\b/gi, "المستطيل")
    .replace(/\btriangle\b/gi, "المثلث")
    .replace(/\bcircle\b/gi, "الدائرة")
    .replace(/\bparallelogram\b/gi, "متوازي الأضلاع")
    .replace(/\btrapezoid\b/gi, "شبه المنحرف")
    .replace(/\bpyramid\b/gi, "الهرم")
    .replace(/\bcone\b/gi, "المخروط")
    .replace(/\bprism\b/gi, "المنشور")
    .replace(/\bcube\b/gi, "المكعب")
    .replace(/\bcylinder\b/gi, "الأسطوانة")
    .replace(/\bsphere\b/gi, "الكرة")
    .replace(/\barea\b/gi, "المساحة")
    .replace(/\bperimeter\b/gi, "المحيط")
    .replace(/\bcircumference\b/gi, "المحيط")
    .replace(/\bvolume\b/gi, "الحجم")
    .replace(/\bheight\b/gi, "الارتفاع")
    .replace(/\bbases?\b/gi, "القاعدة")
    .replace(/\bside\b/gi, "الضلع")
    .replace(/\bradius\b/gi, "نصف القطر")
    .replace(/\blength\b/gi, "الطول")
    .replace(/\bwidth\b/gi, "العرض")
    .replace(/\bperpendicular\b/gi, "عمودي")
    .replace(/\bFormula:\b/gi, "الصيغة:")
    .replace(/\bIdentify:\b/gi, "حدّد:");
}

const enPack = {};
const arPack = {};

// Only static mix templates (no ${)
src = src.replace(/toSpan\(\s*mix`([^`$]*)`\s*,\s*(["'`])(.*?)\2\s*\)/g, (full, body, _q, step) => {
  const key = keyFor(body);
  enPack[key] = body;
  arPack[key] = arFor(body);
  return `toSpan(geCopy(${JSON.stringify(key)}), ${JSON.stringify(step)})`;
});

// Static prefixes before dynamic M: mix`2. substitute: ${M(...)}.`
src = src.replace(
  /toSpan\(\s*mix`([^`$]*):\s*\$\{M\(`([^`]*)`\)\}\.`\s*,\s*(["'`])(.*?)\3\s*\)/g,
  (full, prefix, inner, _q, step) => {
    const key = keyFor(prefix.trim() + ": {m0}.");
    enPack[key] = prefix.trim() + ": {m0}.";
    arPack[key] = arFor(prefix.trim()) + ": {m0}.";
    return `toSpan(geMix(${JSON.stringify(key)}, [\`${inner}\`]), ${JSON.stringify(step)})`;
  },
);

fs.writeFileSync(SRC, src);

function merge(loc, pack) {
  const indexPath = `content-packs/${loc}/learning/burn-down-index.json`;
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index[SLUG] = { ...(index[SLUG] || {}), ...pack };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");
  fs.writeFileSync(
    `content-packs/${loc}/learning/burn-down/${SLUG}.json`,
    JSON.stringify({ [SLUG]: index[SLUG] }, null, 2) + "\n",
  );
}
merge("en", enPack);
merge("ar-001", arPack);
console.log(JSON.stringify({ keys: Object.keys(enPack).length }));
