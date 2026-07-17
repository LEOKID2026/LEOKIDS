#!/usr/bin/env node
/**
 * Set all LEO-KIDS-GLOBAL product enablement flags on Vercel (non-secret values only).
 * Usage: node scripts/vercel-set-product-flags.mjs
 */
import { execSync } from "node:child_process";

const ENVS = ["production", "preview", "development"];

/** @type {Record<string, string>} */
const FLAGS = {
  GLOBAL_DATA_WRITES_ENABLED: "true",
  GLOBAL_MOCK_MODE: "false",
  NEXT_PUBLIC_GLOBAL_MOCK_MODE: "false",
  CARD_REWARDS_ENABLED: "true",
  NEXT_PUBLIC_CARD_REWARDS_ENABLED: "true",
  REWARD_ECONOMY_SETTINGS_ENABLED: "true",
  NEXT_PUBLIC_REWARD_ECONOMY_SETTINGS_ENABLED: "true",
  ENABLE_SESSION_COIN_AWARDS: "true",
  ENABLE_ADMIN_MANUAL_COIN_CREDIT: "true",
  NEXT_PUBLIC_ENABLE_ADMIN_MANUAL_COIN_CREDIT: "true",
  ENABLE_MONTHLY_PERSISTENCE_REWARD_ADMIN: "true",
  ENABLE_MONTHLY_PERSISTENCE_CRON: "true",
  NEXT_PUBLIC_ACTIVITIES_ENABLED: "true",
  NEXT_PUBLIC_LEARNING_BOOK_AUDIO_ENABLED: "true",
  LEARNING_BOOK_AUDIO_ENABLED: "true",
  NEXT_PUBLIC_MATH_SCRATCHPAD_V1: "true",
  NEXT_PUBLIC_LEARNING_TIME_FAIRNESS_V1: "true",
  NEXT_PUBLIC_ENABLE_ADAPTIVE_PLANNER_RECOMMENDATION: "true",
  ENABLE_ADAPTIVE_PLANNER_RECOMMENDATION: "true",
  NEXT_PUBLIC_ENABLE_ADAPTIVE_PLANNER_AI_EXPLAINER: "true",
  ENABLE_ADAPTIVE_PLANNER_AI_EXPLAINER: "true",
  DIAGNOSTIC_METADATA_SUBSKILL_ENABLED: "true",
  DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED: "true",
  DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED: "true",
  NEXT_PUBLIC_ENABLE_PARENT_COPILOT_ON_SHORT: "true",
  NEXT_PUBLIC_PARENT_COPILOT_V1: "1",
  PARENT_COPILOT_LLM_ENABLED: "true",
  PARENT_COPILOT_LLM_EXPERIMENT: "true",
  PARENT_COPILOT_FORCE_DETERMINISTIC: "false",
  PARENT_COPILOT_ROLLOUT_STAGE: "full",
  PARENT_REPORT_NARRATIVE_LLM_ENABLED: "true",
  PARENT_REPORT_NARRATIVE_FORCE_DETERMINISTIC: "false",
  ARCADE_ALLOW_FOUNDATION_ACTIONS: "true",
  TEACHER_PORTAL_ENABLED: "true",
  TEACHER_PORTAL_LINK_ENABLED: "true",
  TEACHER_PORTAL_INVITE_ONLY: "false",
  GUARDIAN_PORTAL_ENABLED: "true",
  NEXT_PUBLIC_STUDENT_AD_EXTERNAL_ENABLED: "true",
  NEXT_PUBLIC_ENABLE_ENGINE_REVIEW_ADMIN: "true",
  ADMIN_FULL_ACCOUNT_DELETE_ENABLED: "true",
  NEXT_PUBLIC_AI_HYBRID_ROLLOUT: "live",
  NEXT_PUBLIC_HELP_CENTER_ALLOW_MISSING_SCREENSHOTS: "1",
  HELP_CENTER_ALLOW_MISSING_SCREENSHOTS: "1",
  NEXT_PUBLIC_CONTACT_FORM_ENABLED: "true",
};

function setFlag(name, value, envName) {
  try {
    execSync(`vercel env rm ${name} ${envName} --yes`, { stdio: "ignore" });
  } catch {
    /* may not exist */
  }
  execSync(`vercel env add ${name} ${envName} --force`, {
    input: `${value}\n`,
    stdio: ["pipe", "pipe", "pipe"],
    encoding: "utf8",
  });
  console.log(`OK ${name}=${value} (${envName})`);
}

for (const envName of ENVS) {
  for (const [name, value] of Object.entries(FLAGS)) {
    try {
      setFlag(name, value, envName);
    } catch (e) {
      console.error(`FAIL ${name} (${envName}):`, e?.message || e);
      process.exitCode = 1;
    }
  }
}

console.log("Done.");
