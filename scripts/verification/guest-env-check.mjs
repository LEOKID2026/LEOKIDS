/**
 * Check guest-related env var names (SET/UNSET only — no values).
 * Run: node scripts/verification/guest-env-check.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

/** @type {Record<string, string>} */
const loaded = {};
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    loaded[key] = val;
    if (!(key in process.env)) process.env[key] = val;
  }
}

const REQUIRED = [
  "NEXT_PUBLIC_LEARNING_SUPABASE_URL",
  "NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY",
  "LEARNING_SUPABASE_SERVICE_ROLE_KEY",
  "LEARNING_STUDENT_ACCESS_SECRET",
];

const OPTIONAL = [
  "GUEST_SYSTEM_PARENT_EMAIL_GLOBAL",
  "GUEST_SYSTEM_PARENT_EMAIL",
  "GUEST_SYSTEM_PARENT_EMAIL_IL",
];

/** @type {string[]} */
const missing = [];
for (const name of REQUIRED) {
  const v = process.env[name];
  if (!v || !String(v).trim()) missing.push(name);
}

const report = {
  envLocalExists: fs.existsSync(envPath),
  envLocalLoadedKeys: Object.keys(loaded).length,
  required: Object.fromEntries(
    REQUIRED.map((n) => [n, Boolean(process.env[n]?.trim())]),
  ),
  optional: Object.fromEntries(
    OPTIONAL.map((n) => [n, Boolean(process.env[n]?.trim())]),
  ),
  missingRequired: missing,
};

const outDir = path.join(root, "tmp", "verification");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "guest-env-check.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report, null, 2));
if (missing.length) {
  console.log("\nMissing required env var names:", missing.join(", "));
  process.exitCode = 1;
}
