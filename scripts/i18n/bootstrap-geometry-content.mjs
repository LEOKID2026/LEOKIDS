/**
 * Bootstrap geometry English content pack.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const mod = await import("../../utils/learning-content-en/geometry.js");

const out = {
  labelOptions: mod.GEOMETRY_EN_LABEL_OPTIONS,
  solidNames: mod.GEOMETRY_SOLID_NAMES_EN,
};

const outPath = path.join(root, "content-packs/en/learning/geometry-content.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log("geometry-content written");
