import fs from "fs";

const PAGE = "pages/learning/parent-report.js";
let s = fs.readFileSync(PAGE, "utf8");

function replacePlain(from, to) {
  if (!s.includes(from)) {
    console.warn("MISS", from.slice(0, 80));
    return;
  }
  s = s.split(from).join(to);
  console.log("ok", from.slice(0, 60));
}

const pack = (k) => `reportPackCopy("pages__learning__parent-report", "${k}")`;

replacePlain(
  "Strengths that stood out in practice",
  `{${pack("strengths_that_stood_out")}}`,
);

fs.writeFileSync(PAGE, s);

function sync(loc, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j["pages__learning__parent-report"] = {
    ...(j["pages__learning__parent-report"] || {}),
    ...keys,
  };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}
sync("en", { strengths_that_stood_out: "Strengths that stood out in practice" });
sync("ar-001", { strengths_that_stood_out: "نقاط القوة التي برزت في الممارسة" });
console.log("done");
