/**
 * Remove Hebrew Unicode escapes (\u0590-\u05FF) from Global parent-facing sources
 * so they cannot match Hebrew at runtime. English matchers remain.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOTS = [
  "utils/parent-copilot",
  "utils/parent-report-language",
  "utils/parent-narrative-safety",
  "utils/learning-pattern-decision",
];

const HE_ESCAPE = /\\u05[0-9a-fA-F]{2}/g;

function cleanSource(src) {
  let out = src.replace(HE_ESCAPE, "");
  out = out.replace(/\|{2,}/g, "|");
  out = out.replace(/\(\|/g, "(");
  out = out.replace(/\|\)/g, ")");
  out = out.replace(/\|\//g, "/");
  out = out.replace(/\/\|/g, "/");
  out = out.replace(/,\s*,/g, ",");
  out = out.replace(/\[\s*,/g, "[");
  out = out.replace(/,\s*\]/g, "]");
  return out;
}

const results = [];
for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
    if (!ent.isFile() || !/\.(js|mjs)$/.test(ent.name)) continue;
    const p = path.join(root, ent.name);
    const raw = fs.readFileSync(p, "utf8");
    if (!/\\u05[0-9a-fA-F]{2}/.test(raw)) continue;
    const next = cleanSource(raw);
    fs.writeFileSync(p, next, "utf8");
    const check = spawnSync(process.execPath, ["--check", p], { encoding: "utf8" });
    results.push({
      file: p.replace(/\\/g, "/"),
      ok: check.status === 0,
      err: check.status === 0 ? null : (check.stderr || "").slice(0, 200),
    });
  }
}

const failed = results.filter((r) => !r.ok);
console.log(JSON.stringify({ rewritten: results.length, failed: failed.length, failedFiles: failed }, null, 2));
if (failed.length) process.exit(1);
