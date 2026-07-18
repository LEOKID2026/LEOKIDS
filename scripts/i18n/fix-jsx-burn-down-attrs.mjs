/**
 * Fix JSX/HTML attributes broken by string-literal burn-down migration.
 * Converts prop=burnDownCopy(...) → prop={burnDownCopy(...)}
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCAN_ROOTS } from "./hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const COPY_FNS = ["globalBurnDownCopy", "gamePackCopy", "burnDownCopy", "reportPackCopy", "copilotStaticMessage"];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(abs, out);
    } else if (/\.(jsx|js)$/.test(name)) out.push(abs);
  }
  return out;
}

/** @param {string} src */
function fixAttributes(src) {
  let out = src;
  for (const fn of COPY_FNS) {
    out = out.replace(new RegExp(`([a-zA-Z_:][a-zA-Z0-9_:-]*)=${fn}\\(`, "g"), `$1={${fn}(`);
    out = out.replace(
      new RegExp(`\\{${fn}\\("([^"]+)",\\s*"([^"]+)"\\)(?!\\})`, "g"),
      `{${fn}("$1", "$2")}`
    );
  }
  return out;
}

let changed = 0;
for (const scanRoot of SCAN_ROOTS) {
  for (const abs of walk(path.join(root, scanRoot))) {
    const before = fs.readFileSync(abs, "utf8");
    const after = fixAttributes(before);
    if (after !== before) {
      fs.writeFileSync(abs, after, "utf8");
      changed += 1;
    }
  }
}
console.log("fixed files", changed);
