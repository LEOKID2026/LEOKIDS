import fs from "fs";

const index = JSON.parse(
  fs.readFileSync("content-packs/ar-001/learning/burn-down-index.json", "utf8"),
);
const pack = index["utils__geometry-explanations"] || {};
const remaining = Object.entries(pack).filter(([, v]) =>
  /\b(the|and|area|Check|It looks|Result|Perimeter|Volume|Focus|Try|Compare|Match|Sort|Rotation|How many|All points|Connect|Think|Identify|From the|In a|In tiling)\b/i.test(
    v,
  ),
);
console.log("remaining", remaining.length);
for (const [k, v] of remaining.slice(0, 40)) {
  console.log("---");
  console.log(k);
  console.log(v);
}
