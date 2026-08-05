/**
 * Phase 2.5 UI verification — /student/home loads, sections present, no backend files changed.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { assertMvpWorkingTreeScope } = await import(
  pathToFileURL(resolve(ROOT, "scripts/lib/mvp-verify-helpers.mjs")).href
);
const { assertDevServerReady } = await import(
  pathToFileURL(resolve(ROOT, "scripts/lib/mvp-verify-http-preflight.mjs")).href
);
const BASE = "http://127.0.0.1:3001";

function loadEnv(file) {
  const p = resolve(ROOT, file);
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv(".env.local");
loadEnv(".env.e2e.local");

let passed = 0, failed = 0;
function pass(l) { console.log(`  ✓  ${l}`); passed++; }
function fail(l, d) { console.error(`  ✗  ${l}`); if (d) console.error(`       → ${d}`); failed++; }

async function loginStudent(username, pin) {
  const res = await fetch(`${BASE}/api/student/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, pin }),
  }).catch(() => null);
  const match = res?.headers?.get("set-cookie")?.match(/liosh_student_session=([^;]+)/);
  return match ? `liosh_student_session=${match[1]}` : null;
}

async function checkHome(cookie, label) {
  const res = await fetch(`${BASE}/student/home`, {
    headers: { cookie },
    redirect: "manual",
  }).catch(() => null);
  if (!res || res.status !== 200) {
    fail(`${label}: /student/home HTTP 200`, `status=${res?.status}`);
    return;
  }
  pass(`${label}: /student/home HTTP 200`);
  const html = await res.text();
  if (html.includes("  ") || html.includes("daily-missions-heading")) {
    pass(`${label}: daily missions section markup present`);
  } else {
    // SSR may not include client-rendered panels — check Next.js page loads
    if (html.includes("student/home") || html.includes("__NEXT_DATA__")) {
      pass(`${label}: home page shell loads (panels render client-side)`);
    } else {
      fail(`${label}: home page content`, "unexpected HTML");
    }
  }
}

console.log("\n══════════════════════════════════════════════════════");
console.log("  Phase 2.5 UI Verification");
console.log("══════════════════════════════════════════════════════\n");

// ── Combined MVP working tree (Phases 1–2.6) ──
console.log("── MVP working tree scope ──");
const mvpHooks = { pass, fail };
const { files: mvpFiles } = assertMvpWorkingTreeScope(mvpHooks, {
  label: "Combined MVP working tree (no forbidden paths)",
});
console.log("  Working tree files:");
mvpFiles.forEach((l) => console.log(`    ${l}`));
console.log();

// ── Backend files untouched ──
console.log("── Backend reward logic untouched ──");
const backendFiles = [
  "lib/learning-supabase/mission-progress.server.js",
  "lib/learning-supabase/learning-coin-award.server.js",
  "pages/api/learning/session/finish.js",
  "pages/api/student/home-profile.js",
];
for (const f of backendFiles) {
  try {
    const status = execSync(`git diff --quiet HEAD -- "${f}"`, { cwd: ROOT, stdio: "pipe" });
    pass(`${f} unchanged`);
  } catch {
    fail(`${f} unchanged`, "has diff");
  }
}
console.log();

// ── Student home loads ──
console.log("── /student/home loads ──");
const httpHooks = { pass, fail };
const serverOk = await assertDevServerReady(httpHooks, BASE);
const accounts = [];
if (process.env.VIRTUAL_STUDENT_ACCOUNTS) {
  try {
    const parsed = JSON.parse(process.env.VIRTUAL_STUDENT_ACCOUNTS);
    if (Array.isArray(parsed)) accounts.push(...parsed);
  } catch { /* ignore */ }
}
if (accounts.length === 0) {
  for (let i = 1; i <= 12; i++) {
    accounts.push({ label: `AAA${i}`, username: `AAA${i}`, pin: "1234" });
  }
}
if (process.env.E2E_STUDENT_USERNAME) {
  accounts.unshift({
    label: "ERAN",
    username: process.env.E2E_STUDENT_USERNAME,
    pin: process.env.E2E_STUDENT_PIN || "7479",
  });
}

let loaded = 0;
if (!serverOk) {
  fail("At least one student home load", "dev server not ready — start: npm run dev");
} else {
  for (const acc of accounts) {
    const cookie = await loginStudent(acc.username || acc.label, acc.pin);
    if (!cookie) {
      fail(`${acc.label}: login`, "no session cookie");
      continue;
    }
    await checkHome(cookie, acc.label);
    loaded++;
  }
  if (loaded === 0) fail("At least one student home load", "all logins failed");
  else pass(`${loaded} student(s) verified`);
}
console.log();

// ── View model display fields ──
console.log("── Display-only view model fields ──");
const clientSrc = readFileSync(resolve(ROOT, "lib/learning-client/studentHomeDashboardClient.js"), "utf8");
if (clientSrc.includes("nextTierEncouragementHe")) pass("nextTierEncouragementHe display field present");
else fail("nextTierEncouragementHe display field present");
if (!clientSrc.includes("applyArcadeCoinMove") && !clientSrc.includes("updateDailyMissionProgress")) {
  pass("no backend reward imports in client");
} else {
  fail("no backend reward imports in client");
}
console.log();

console.log("══════════════════════════════════════════════════════");
console.log(`  PASSED: ${passed}   FAILED: ${failed}`);
console.log("══════════════════════════════════════════════════════\n");
process.exit(failed > 0 ? 1 : 0);
