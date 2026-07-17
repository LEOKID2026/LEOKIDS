/**
 * Compare each deleted .he file from HEAD with English counterpart.
 * Run: node scripts/verification/compare-deleted-he-files.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "tmp", "verification");
fs.mkdirSync(outDir, { recursive: true });

function gitShow(file) {
  try {
    return execSync(`git show HEAD:"${file.replace(/\\/g, "/")}"`, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

function englishCounterpart(hePath) {
  return hePath.replace(/\.he(\.(js|jsx|ts|tsx))$/, "$1");
}

function extractSignals(text) {
  if (!text) return {};
  const imports = [...text.matchAll(/(?:import|from)\s+['"][^'"]+['"]|require\s*\(\s*['"][^'"]+['"]\s*\)/g)].map((m) => m[0]);
  const exports = [...text.matchAll(/export\s+(?:default\s+)?(?:function|const|class|async|\{)/g)].length;
  const hooks = [...text.matchAll(/\buse[A-Z][a-zA-Z]+\s*\(/g)].map((m) => m[0]);
  const apiCalls = [...text.matchAll(/fetch\s*\(|\/api\/[a-z0-9/_-]+/gi)].map((m) => m[0]);
  const hebrew = (text.match(/[\u0590-\u05FF]/g) || []).length;
  return {
    lines: text.split(/\r?\n/).length,
    chars: text.length,
    importCount: imports.length,
    exportCount: exports,
    hooks: [...new Set(hooks)],
    apiPatterns: [...new Set(apiCalls)].slice(0, 20),
    hebrewChars: hebrew,
  };
}

function diffSignals(a, b) {
  /** @type {string[]} */
  const missing = [];
  if (!b && a) return ["English counterpart missing entirely"];
  if (!a || !b) return missing;
  if (Math.abs(a.lines - b.lines) / Math.max(a.lines, 1) > 0.25) {
    missing.push(`line count delta ${a.lines} vs ${b.lines}`);
  }
  const hookDiff = a.hooks.filter((h) => !b.hooks.includes(h));
  if (hookDiff.length) missing.push(`hooks only in .he: ${hookDiff.join(", ")}`);
  if (a.apiPatterns.length > b.apiPatterns.length + 2) {
    const onlyHe = a.apiPatterns.filter((x) => !b.apiPatterns.includes(x));
    if (onlyHe.length) missing.push(`api patterns only in .he: ${onlyHe.slice(0, 5).join("; ")}`);
  }
  return missing;
}

const nameStatus = execSync("git diff --name-status HEAD", { cwd: root, encoding: "utf8" })
  .trim()
  .split(/\r?\n/)
  .filter((l) => l.startsWith("D\t") && /\.he\.(js|jsx|ts|tsx)$/.test(l));

/** @type {object[]} */
const rows = [];

for (const line of nameStatus) {
  const heFile = line.slice(2).trim();
  const enFile = englishCounterpart(heFile);
  const heContent = gitShow(heFile);
  const enExists = fs.existsSync(path.join(root, enFile));
  const enContent = enExists ? fs.readFileSync(path.join(root, enFile), "utf8") : null;
  const heSig = heContent ? extractSignals(heContent) : null;
  const enSig = enContent ? extractSignals(enContent) : null;
  const missing = diffSignals(heSig, enSig);
  const isPagesRoute = heFile.startsWith("pages/");

  rows.push({
    deletedFile: heFile,
    englishCounterpart: enExists ? enFile : "(missing)",
    isPageRoute: isPagesRoute,
    logicIdentical: missing.length === 0 && enExists,
    missingLogicFound: missing.join("; ") || (isPagesRoute ? "page route removed intentionally" : ""),
    action:
      isPagesRoute
        ? "Route removed; redirect via middleware"
        : missing.length
          ? "Review required"
          : enExists
            ? "Archive twin removed; English retained"
            : "Restore or merge logic into English",
  });
}

const needsReview = rows.filter((r) => r.action === "Review required" || r.englishCounterpart === "(missing)");

fs.writeFileSync(path.join(outDir, "he-deletion-comparison.json"), JSON.stringify(rows, null, 2));

console.log("Deleted .he files compared:", rows.length);
console.log("Identical/archive twins:", rows.filter((r) => r.logicIdentical).length);
console.log("Page routes removed:", rows.filter((r) => r.isPageRoute).length);
console.log("Needs review:", needsReview.length);
if (needsReview.length) {
  console.log("\nReview list (first 20):");
  needsReview.slice(0, 20).forEach((r) => {
    console.log(`  ${r.deletedFile}`);
    console.log(`    → ${r.englishCounterpart}: ${r.missingLogicFound || r.action}`);
  });
}
console.log(`\nWrote ${path.join(outDir, "he-deletion-comparison.json")}`);
