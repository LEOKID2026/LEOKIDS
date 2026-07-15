#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const TRY = "C:/Users/ERAN YOSEF/Desktop/final projects/FINAL-WEB/LEO-KIDS-FINAL/LEO-KIDS-WEB-TRY";
const PROD = "C:/Users/ERAN YOSEF/Desktop/final projects/FINAL-WEB/LEO-KIDS-FINAL/LEO-KIDS";

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
}

function shouldSkip(path) {
  if (path.startsWith(".cursor/")) return true;
  if (path.startsWith("docs/audits/")) return true;
  if (/^sync-audit/i.test(path)) return true;
  if (path.startsWith("node_modules/")) return true;
  if (path.startsWith(".next/")) return true;
  if (path.startsWith(".tmp-zip-preview/")) return true;
  return false;
}

/** @returns {Map<string, string>} path -> blob hash */
function headTreeMap(cwd) {
  const raw = git(cwd, ["ls-tree", "-r", "-z", "HEAD"]);
  const parts = raw.split("\0").filter(Boolean);
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const line of parts) {
    const sp = line.indexOf(" ");
    const tab = line.indexOf("\t");
    if (tab < 0) continue;
    const hash = line.slice(sp + 1, tab);
    const path = line.slice(tab + 1);
    if (shouldSkip(path)) continue;
    map.set(path, hash);
  }
  return map;
}

const tryHead = git(TRY, ["rev-parse", "HEAD"]).trim();
const prodHead = git(PROD, ["rev-parse", "HEAD"]).trim();
const tryMap = headTreeMap(TRY);
const prodMap = headTreeMap(PROD);

const missingInProd = [];
const different = [];
let identical = 0;

for (const [file, tryHash] of tryMap) {
  const prodHash = prodMap.get(file);
  if (!prodHash) {
    missingInProd.push(file);
    continue;
  }
  if (tryHash === prodHash) identical++;
  else different.push(file);
}

const onlyInProd = [...prodMap.keys()].filter((f) => !tryMap.has(f)).sort();
missingInProd.sort();
different.sort();

const parentReportDifferent = different.filter((f) => /parent-report/i.test(f));
const scriptsTestsDifferent = different.filter(
  (f) => /^(scripts|tests)\//.test(f) || /\.(test|selftest)\./i.test(f) || f.startsWith("lib/learning/")
);

const tryV = tryMap.get(".vercelignore") || null;
const prodV = prodMap.get(".vercelignore") || null;

console.log(JSON.stringify({
  tryHead,
  prodHead,
  tryFileCount: tryMap.size,
  prodFileCount: prodMap.size,
  identical,
  missingInProdCount: missingInProd.length,
  differentCount: different.length,
  onlyInProdCount: onlyInProd.length,
  missingInProd,
  different,
  onlyInProd,
  vercelignore: { try: tryV, prod: prodV, same: tryV === prodV },
  parentReportDifferent,
  scriptsTestsDifferent,
}, null, 2));
