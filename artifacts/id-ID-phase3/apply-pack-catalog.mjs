import fs from "fs";

const snippet = fs.readFileSync("artifacts/id-ID-phase3/pack-catalog-id-ID-snippet.txt", "utf8");
const parts = snippet.split('"id-ID":');
const imports = parts[0]
  .split(/\r?\n/)
  .filter((l) => l.startsWith("import "))
  .join("\n");
const entry = `"id-ID":${parts[1]}`.trim().replace(/\r\n/g, "\n");

let src = fs.readFileSync("lib/content/pack-catalog.js", "utf8");
if (src.includes("PublicSeoGuidesHubJson_idID")) {
  console.log("already wired");
  process.exit(0);
}

const marker = "export const CONTENT_PACK_CATALOG = {";
if (!src.includes(marker)) throw new Error("catalog marker missing");
src = src.replace(marker, `${imports}\n\n${marker}`);

const re = /(\s*"rewards\/ui\.json": RewardsUiJson_arBH,\r?\n\s*\}\),\r?\n\};)/;
if (!re.test(src)) throw new Error("ar-BH end missing");
src = src.replace(re, `\n    "rewards/ui.json": RewardsUiJson_arBH,\n  }),\n  ${entry}\n};`);

fs.writeFileSync("lib/content/pack-catalog.js", src);
console.log("pack-catalog updated");
