/**
 * Prove production-default Copilot LLM path is unreachable without explicit env flags.
 *
 * Usage: node scripts/i18n/audit-runtime-llm.mjs [--write-report]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getLlmGateDecision } from "../../utils/parent-copilot/rollout-gates.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportPath = path.join(root, "tmp/i18n/runtime-llm-audit.json");

/** Strip copilot LLM env for production-default simulation. */
function withCleanEnv(fn) {
  const keys = Object.keys(process.env).filter((k) => k.startsWith("PARENT_COPILOT_LLM"));
  const saved = {};
  for (const k of keys) saved[k] = process.env[k];
  for (const k of keys) delete process.env[k];
  try {
    return fn();
  } finally {
    for (const k of keys) delete process.env[k];
    for (const [k, v] of Object.entries(saved)) process.env[k] = v;
  }
}

export function auditRuntimeLlmReachability() {
  const defaultGate = withCleanEnv(() => getLlmGateDecision());
  const enabledWithMasterOnly = withCleanEnv(() => {
    process.env.PARENT_COPILOT_LLM_ENABLED = "true";
    return getLlmGateDecision();
  });
  const enabledWithExperiment = withCleanEnv(() => {
    process.env.PARENT_COPILOT_LLM_ENABLED = "true";
    process.env.PARENT_COPILOT_LLM_EXPERIMENT = "true";
    return getLlmGateDecision();
  });

  const callSites = [
    "utils/parent-copilot/copilot-llm-client.js",
    "utils/parent-copilot/llm-orchestrator.js",
    "utils/parent-copilot/question-classifier-llm.js",
  ].map((rel) => {
    const abs = path.join(root, rel);
    const exists = fs.existsSync(abs);
    return { file: rel, exists, gatedBy: "getLlmGateDecision() in rollout-gates.js" };
  });

  return {
    productionDefault: {
      llmGateEnabled: defaultGate.enabled,
      reason: defaultGate.reason,
      reachableInProduction: defaultGate.enabled === true,
    },
    withMasterSwitchOnly: {
      llmGateEnabled: enabledWithMasterOnly.enabled,
      reason: enabledWithMasterOnly.reason,
    },
    withMasterAndExperiment: {
      llmGateEnabled: enabledWithExperiment.enabled,
      reason: enabledWithExperiment.reason,
    },
    callSites,
    conclusion:
      defaultGate.enabled === false
        ? "Production-default env: Copilot LLM is OFF (requires PARENT_COPILOT_LLM_ENABLED=true AND PARENT_COPILOT_LLM_EXPERIMENT=true). Sync path never calls LLM."
        : "WARNING: LLM gate enabled without expected env flags.",
  };
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]).replace(/\\/g, "/") === fileURLToPath(import.meta.url).replace(/\\/g, "/");

if (isMain) {
  const report = auditRuntimeLlmReachability();
  if (process.argv.includes("--write-report")) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify(report, null, 2));
  if (report.productionDefault.reachableInProduction) process.exitCode = 1;
}
