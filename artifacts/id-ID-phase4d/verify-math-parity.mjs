import fs from "fs";

const en = fs.readFileSync("utils/learning-content-en/math.js", "utf8");
const id = fs.readFileSync("utils/learning-content-id-ID/math.js", "utf8");

const kindRe = /kind === "([^"]+)"/g;
const enKinds = [...en.matchAll(kindRe)].map((m) => m[1]);
const idKinds = [...id.matchAll(kindRe)].map((m) => m[1]);
const enSet = new Set(enKinds);
const idSet = new Set(idKinds);

console.log("EN kind count", enKinds.length, "unique", enSet.size);
console.log("ID kind count", idKinds.length, "unique", idSet.size);
console.log("only EN", [...enSet].filter((k) => !idSet.has(k)));
console.log("only ID", [...idSet].filter((k) => !enSet.has(k)));

const orderMismatch = enKinds.filter((k, i) => idKinds[i] !== k);
console.log("order mismatch count", orderMismatch.length);

// Compare ${...} tokens inside rebuild/presentation functions roughly
function extractTemplates(src) {
  return [...src.matchAll(/`([^`]*)`/gs)].map((m) => m[1]);
}
function extractExprs(tpl) {
  return [...tpl.matchAll(/\$\{[^}]+\}/g)].map((m) => m[0]);
}

const enExprs = extractTemplates(en).flatMap(extractExprs);
const idExprs = extractTemplates(id).flatMap(extractExprs);
const enExprSet = new Set(enExprs);
const idExprSet = new Set(idExprs);
console.log("EN expr unique", enExprSet.size, "ID", idExprSet.size);
console.log(
  "exprs only in EN (sample)",
  [...enExprSet].filter((e) => !idExprSet.has(e)).slice(0, 30)
);
console.log(
  "exprs only in ID (sample)",
  [...idExprSet].filter((e) => !enExprSet.has(e)).slice(0, 30)
);

for (const name of [
  "rebuildMathStemIdId",
  "applyMathLevelPresentationIdId",
  "localizeMathQuestionIdId",
]) {
  console.log(name, id.includes("export function " + name));
}
console.log("Selesaikan.", id.includes("Selesaikan."));
console.log("Berapa generic", id.includes("Berapa ${a}"));
console.log("dolar count", (id.match(/dolar/g) || []).length);
console.log("murid count", (id.match(/murid/g) || []).length);
console.log("has GCD form", id.includes("GCD(${a}, ${b})"));

// Syntax check
await import("../../utils/learning-content-id-ID/math.js").catch((e) => {
  console.error("IMPORT FAIL", e);
  process.exit(1);
});
console.log("import ok");
