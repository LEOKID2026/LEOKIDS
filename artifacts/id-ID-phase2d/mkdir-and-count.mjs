import fs from "fs";

const help = JSON.parse(fs.readFileSync("artifacts/id-ID-phase2d/en-help-dump.json", "utf8"));
const seo = JSON.parse(fs.readFileSync("artifacts/id-ID-phase2d/en-seo-dump.json", "utf8"));
const legal = JSON.parse(fs.readFileSync("artifacts/id-ID-phase2d/en-legal-dump.json", "utf8"));

function leafCount(v) {
  if (typeof v === "string") return 1;
  if (Array.isArray(v)) return v.reduce((n, x) => n + leafCount(x), 0);
  if (v && typeof v === "object") return Object.values(v).reduce((n, x) => n + leafCount(x), 0);
  return 0;
}

for (const d of [
  "data/help-center/id-ID",
  "content-packs/id-ID/public-seo/guides",
  "content-packs/id-ID/public-seo/practice",
  "content-packs/id-ID/public-seo/marketing",
  "content-packs/id-ID/public-seo/legal",
]) {
  fs.mkdirSync(d, { recursive: true });
}

console.log({
  helpLeaves: leafCount(help),
  seoLeaves: leafCount(seo),
  legalLeaves: leafCount(legal),
});
