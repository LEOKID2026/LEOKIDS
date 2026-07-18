/**
 * Copilot runtime certification audit — no LLM calls.
 * Run: node scripts/i18n/audit-copilot-runtime.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportPath = path.join(root, "tmp/i18n/copilot-runtime-audit.json");

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const warnings = [];

const RUNTIME_ROOTS = [
  "lib/parent-copilot",
  "utils/parent-copilot",
  "pages/api/parent/copilot-turn.js",
  "components/parent-copilot",
];

const TEST_PATH_RE =
  /(^|\/)(tests?|__tests__|scripts\/|\.test\.|\.spec\.|fixtures?|launch-readiness|parent-copilot-qa)/;

function walkFiles(relRoot, out = []) {
  const abs = path.join(root, relRoot);
  if (!fs.existsSync(abs)) return out;
  const st = fs.statSync(abs);
  if (st.isFile()) {
    out.push(relRoot.replace(/\\/g, "/"));
    return out;
  }
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    walkFiles(path.join(relRoot, ent.name).replace(/\\/g, "/"), out);
  }
  return out;
}

function isRuntimeFile(rel) {
  if (TEST_PATH_RE.test(rel)) return false;
  return /\.(js|jsx|mjs|cjs|ts|tsx)$/.test(rel);
}

/** Scan runtime textHe string literals (not property access fallbacks). */
function scanRuntimeTextHeLiterals() {
  /** @type {Array<{ file: string, line: number, snippet: string }>} */
  const hits = [];
  const literalRe = /(?:textHe\s*:\s*["'`]|["'`][^"'`]*["'`]\s*,\s*\/\/.*textHe)/;
  const assignRe = /\btextHe\s*=\s*["'`]/;
  for (const relRoot of RUNTIME_ROOTS) {
    for (const rel of walkFiles(relRoot)) {
      if (!isRuntimeFile(rel)) continue;
      const src = fs.readFileSync(path.join(root, rel), "utf8");
      const lines = src.split("\n");
      lines.forEach((line, i) => {
        if (!/\btextHe\b/.test(line)) return;
        if (literalRe.test(line) || assignRe.test(line)) {
          if (/block\.textHe|b\?\.textHe|legacy/.test(line)) return;
          hits.push({ file: rel, line: i + 1, snippet: line.trim().slice(0, 120) });
        }
      });
    }
  }
  return hits;
}

// Default env — both LLM flags must be OFF for production-safe default
const savedLlm = process.env.PARENT_COPILOT_LLM_ENABLED;
const savedExp = process.env.PARENT_COPILOT_LLM_EXPERIMENT;
const savedForce = process.env.PARENT_COPILOT_FORCE_DETERMINISTIC;
delete process.env.PARENT_COPILOT_LLM_ENABLED;
delete process.env.PARENT_COPILOT_LLM_EXPERIMENT;
delete process.env.PARENT_COPILOT_FORCE_DETERMINISTIC;

const rolloutMod = await import(
  pathToFileURL(path.join(root, "utils/parent-copilot/rollout-gates.js")).href
);
const gate = rolloutMod.getLlmGateDecision();
if (gate.enabled) {
  errors.push(`LLM gate enabled with default env: ${JSON.stringify(gate.reasonCodes)}`);
}
if (!gate.reasonCodes.includes("llm_env_disabled")) {
  errors.push("expected llm_env_disabled in default gate reasonCodes");
}
if (!gate.reasonCodes.includes("llm_experiment_flag_missing")) {
  errors.push("expected llm_experiment_flag_missing in default gate reasonCodes");
}

if (savedLlm === undefined) delete process.env.PARENT_COPILOT_LLM_ENABLED;
else process.env.PARENT_COPILOT_LLM_ENABLED = savedLlm;
if (savedExp === undefined) delete process.env.PARENT_COPILOT_LLM_EXPERIMENT;
else process.env.PARENT_COPILOT_LLM_EXPERIMENT = savedExp;
if (savedForce === undefined) delete process.env.PARENT_COPILOT_FORCE_DETERMINISTIC;
else process.env.PARENT_COPILOT_FORCE_DETERMINISTIC = savedForce;

const resolverMod = await import(
  pathToFileURL(path.join(root, "lib/parent-copilot/copilot-response-resolver.js")).href
);
const sample = resolverMod.resolveCopilotAnswerBlockText(
  { answerText: "Practice math for ten minutes.", explanationCode: "general_practice_tip" },
  "en"
);
if (!sample || !/practice/i.test(sample)) {
  errors.push("resolveCopilotAnswerBlockText failed for answerText sample");
}

const composerMod = await import(
  pathToFileURL(path.join(root, "utils/parent-copilot/pattern-answer-composers.js")).href
);
const composerNames = Object.keys(composerMod).filter((k) => /compose|Composer|build.*Answer/i.test(k));
let composersChecked = 0;
for (const name of composerNames.slice(0, 12)) {
  const fn = composerMod[name];
  if (typeof fn !== "function") continue;
  composersChecked++;
}

const textHeLiterals = scanRuntimeTextHeLiterals();
if (textHeLiterals.length > 0) {
  for (const hit of textHeLiterals.slice(0, 15)) {
    errors.push(`runtime textHe literal ${hit.file}:${hit.line} — ${hit.snippet}`);
  }
}

// Verify orchestrator does not call LLM when gate disabled
const orchSrc = fs.readFileSync(path.join(root, "utils/parent-copilot/llm-orchestrator.js"), "utf8");
if (!orchSrc.includes("getLlmGateDecision")) {
  warnings.push("llm-orchestrator.js may not consult LLM gate");
}

const indexSrc = fs.readFileSync(path.join(root, "utils/parent-copilot/index.js"), "utf8");
if (/fetch\([^)]*openai|generativelanguage\.googleapis/i.test(indexSrc)) {
  warnings.push("utils/parent-copilot/index.js contains direct LLM fetch — verify gate wrapping");
}

const result = {
  executedAt: new Date().toISOString(),
  status: errors.length === 0 ? "PASS" : "FAIL",
  defaultLlmGate: gate,
  runtimeTextHeLiteralCount: textHeLiterals.length,
  composersSampled: composersChecked,
  errors,
  warnings,
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(result, null, 2), "utf8");
console.log(
  `audit-copilot-runtime: ${result.status} (textHe literals=${textHeLiterals.length}, composers=${composersChecked})`
);
if (errors.length) {
  for (const e of errors.slice(0, 15)) console.error("  ERROR:", e);
  process.exitCode = 2;
}
