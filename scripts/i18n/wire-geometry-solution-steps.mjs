import fs from "fs";
import crypto from "crypto";

const SRC = "utils/geometry-explanations.js";
const SLUG = "utils__geometry-explanations";
let src = fs.readFileSync(SRC, "utf8");

function keyFor(en) {
  const base = String(en)
    .toLowerCase()
    .replace(/\{m\d+\}/g, "m")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return `${base || "geo"}_${crypto.createHash("sha1").update(en).digest("hex").slice(0, 8)}`;
}

function arFor(en) {
  return en
    .replace(/^(\d+)\.\s*Identify:/gi, "$1. حدّد:")
    .replace(/^(\d+)\.\s*Formula:/gi, "$1. الصيغة:")
    .replace(/^(\d+)\.\s*Substitute:/gi, "$1. عوّض:")
    .replace(/^(\d+)\.\s*Calculate:/gi, "$1. احسب:")
    .replace(/^(\d+)\.\s*Conclusion:/gi, "$1. الخلاصة:")
    .replace(/\bIdentify:/gi, "حدّد:")
    .replace(/\bFormula:/gi, "الصيغة:")
    .replace(/\bSubstitute:/gi, "عوّض:")
    .replace(/\bCalculate:/gi, "احسب:")
    .replace(/\bConclusion:/gi, "الخلاصة:")
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
    .replace(/\bbase\b/gi, "القاعدة")
    .replace(/\bside\b/gi, "الضلع")
    .replace(/\bradius\b/gi, "نصف القطر")
    .replace(/\blength\b/gi, "الطول")
    .replace(/\bwidth\b/gi, "العرض")
    .replace(/\bperpendicular\b/gi, "عمودي")
    .replace(/\bdo not confuse them\b/gi, "لا تخلط بينهما")
    .replace(/\bnot the\b/gi, "وليس")
    .replace(/\binstead of\b/gi, "بدلًا من");
}

const enPack = {};
const arPack = {};

function register(template) {
  const key = keyFor(template);
  if (!enPack[key]) {
    enPack[key] = template;
    arPack[key] = arFor(template);
  }
  return key;
}

function tokenize(body) {
  const exprs = [];
  const template = body.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    // Keep M("...") math islands
    const m = expr.match(/^M\((["'`])(.*?)\1\)$/);
    if (m) {
      const i = exprs.length;
      exprs.push({ kind: "M", value: m[2] });
      return `{m${i}}`;
    }
    // Other interpolations — keep as opaque token via String()
    const i = exprs.length;
    exprs.push({ kind: "expr", value: expr.trim() });
    return `{m${i}}`;
  });
  return { template, exprs };
}

// Convert toSpan(mix`...`, "n") and bare mix`...` still remaining
src = src.replace(/toSpan\(\s*mix`((?:\\.|[^`\\]|\$\{[^}]*\})*)`\s*,\s*(["'`])(.*?)\2\s*\)/g, (full, body, _q, step) => {
  const { template, exprs } = tokenize(body);
  const key = register(template);
  if (!exprs.length) return `toSpan(geCopy(${JSON.stringify(key)}), ${JSON.stringify(step)})`;
  const list = exprs
    .map((e) => (e.kind === "M" ? JSON.stringify(e.value) : e.value))
    .join(", ");
  return `toSpan(geMix(${JSON.stringify(key)}, [${list}]), ${JSON.stringify(step)})`;
});

// mix`...` alone still used as children of toSpan without being caught? also standalone in arrays
src = src.replace(/(?<!ge)mix`((?:\\.|[^`\\]|\$\{[^}]*\})*)`/g, (full, body) => {
  if (full.startsWith("ge")) return full;
  const { template, exprs } = tokenize(body);
  const key = register(template);
  if (!exprs.length) return `geCopy(${JSON.stringify(key)})`;
  const list = exprs
    .map((e) => (e.kind === "M" ? JSON.stringify(e.value) : e.value))
    .join(", ");
  return `geMix(${JSON.stringify(key)}, [${list}])`;
});

fs.writeFileSync(SRC, src);

function merge(loc, pack) {
  const indexPath = `content-packs/${loc}/learning/burn-down-index.json`;
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  index[SLUG] = { ...(index[SLUG] || {}), ...pack };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");
  const leaf = `content-packs/${loc}/learning/burn-down/${SLUG}.json`;
  fs.writeFileSync(leaf, JSON.stringify({ [SLUG]: index[SLUG] }, null, 2) + "\n");
}

const enIndex = JSON.parse(fs.readFileSync("content-packs/en/learning/burn-down-index.json", "utf8"));
const arIndex = JSON.parse(fs.readFileSync("content-packs/ar-001/learning/burn-down-index.json", "utf8"));
merge("en", { ...(enIndex[SLUG] || {}), ...enPack });
merge("ar-001", { ...(arIndex[SLUG] || {}), ...arPack });
console.log(JSON.stringify({ newKeys: Object.keys(enPack).length }));
