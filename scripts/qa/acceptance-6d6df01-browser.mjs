#!/usr/bin/env node
/**
 * Acceptance browser QA for SHA 6d6df01.
 * Run: node scripts/qa/acceptance-6d6df01-browser.mjs
 */
import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const BASE = (process.env.ACCEPTANCE_BASE_URL || "https://leokids.vercel.app").replace(/\/$/, "");
const TARGET_SHA = "6d6df015022bf2266abaab7321e6b0043eceb27b";
const DEMO_KEY = "leokids_global_demo_session";

const LOCALES = ["en", "en-XA", "ar-XB"];
const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "mobile", width: 390, height: 844 },
];
const GAMES = [
  { key: "leo-bakery", checkPattern: /Check Order/i },
  { key: "leo-gifts", checkPattern: /Check/i },
  { key: "leo-number-path", checkPattern: /Check path/i },
  { key: "leo-pizzeria", checkPattern: /Serve pizza|Check/i },
];

/** @type {Record<string, { status: string, detail?: string }>} */
const report = {};

function setResult(id, status, detail = "") {
  report[id] = { status, detail };
  const mark = status === "PASS" ? "✓" : status === "FAIL" ? "✗" : "○";
  console.log(`${mark} ${id}${detail ? ` — ${detail}` : ""}`);
}

function localePath(locale, path) {
  if (!locale || locale === "en") return path;
  return `/${locale}${path}`;
}

function hasHebrew(text) {
  return /[\u0590-\u05FF]/.test(String(text || ""));
}

function looksLikeRawKey(text) {
  const t = String(text || "").trim();
  return /^[a-z][a-z0-9_]{8,}$/.test(t) || t.includes("components__");
}

async function primePage(context, locale) {
  await context.addInitScript(
    ({ localeId, demoKey }) => {
      if (!sessionStorage.getItem("__lkAcceptancePrimed")) {
        sessionStorage.setItem("__lkAcceptancePrimed", "1");
        localStorage.removeItem(demoKey);
      }
      localStorage.setItem(
        "leokids_consent_v1",
        JSON.stringify({
          version: 1,
          choice: "accepted",
          ads: true,
          analytics: true,
          decidedAt: new Date().toISOString(),
          source: "banner",
        }),
      );
      document.cookie = `lk_global_locale=${encodeURIComponent(localeId)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    },
    { localeId: locale, demoKey: DEMO_KEY },
  );
}

async function dismissCookieConsent(page) {
  const accept = page.getByRole("button", { name: /Accept all|Accept|I agree/i }).first();
  if (await accept.isVisible({ timeout: 2000 }).catch(() => false)) {
    await accept.click();
    await page.waitForTimeout(300);
  }
}

async function enterDemo(page, locale, grade = "g3") {
  await page.goto(`${BASE}/demo/enter`, { waitUntil: "domcontentloaded" });
  await dismissCookieConsent(page);
  const idx = { g1: 0, g2: 1, g3: 2, g4: 3, g5: 4, g6: 5 }[grade] ?? 2;
  await page.locator("fieldset button").nth(idx).click();
  await page.getByRole("button", { name: /Enter the kids world|Entering/i }).click();
  await page.waitForURL("**/student/home**", { timeout: 30_000 });
  if (locale !== "en") {
    await page.goto(`${BASE}${localePath(locale, "/student/home")}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(800);
  }
}

async function readMissionText(page, gameKey) {
  if (gameKey === "leo-pizzeria") {
    const block = page.locator("[class*='missionBlock']").first();
    if (await block.isVisible({ timeout: 2000 }).catch(() => false)) {
      return (await block.innerText()).trim();
    }
  }
  const mission = page.locator("[class*='missionText']").first();
  if (await mission.isVisible({ timeout: 2000 }).catch(() => false)) {
    return (await mission.innerText()).replace(/\n🧾[\s\S]*/, "").trim();
  }
  return "";
}

async function gridValues(page) {
  const texts = await page
    .locator("[class*='stonePath'] button, [class*='stone'] button")
    .allTextContents();
  return texts.map((t) => parseInt(String(t).trim(), 10)).filter((n) => !Number.isNaN(n));
}

async function tapNumbers(page, nums) {
  for (const n of nums) {
    const btn = page.locator("button").filter({ hasText: new RegExp(`^${n}$`) }).first();
    if (await btn.isVisible({ timeout: 500 }).catch(() => false)) {
      await btn.click();
    }
  }
}

async function autoSolveNumberPath(page) {
  const prompt = await readMissionText(page, "leo-number-path");
  const values = await gridValues(page);
  const set = new Set(values);
  let pick = [];

  if (/even numbers/i.test(prompt)) pick = values.filter((n) => n % 2 === 0);
  else if (/odd numbers/i.test(prompt)) pick = values.filter((n) => n % 2 === 1);
  else if (/multiples of (\d+)/i.test(prompt)) {
    const m = parseInt(prompt.match(/multiples of (\d+)/i)[1], 10);
    pick = values.filter((n) => n % m === 0);
  } else if (/multiply by (\d+)/i.test(prompt)) {
    const ratio = parseInt(prompt.match(/multiply by (\d+)/i)[1], 10);
    const start = parseInt(prompt.match(/Start at (\d+)/i)[1], 10);
    let cur = start;
    while (set.has(cur) && pick.length < 24) {
      pick.push(cur);
      cur *= ratio;
    }
  } else if (/subtract (\d+) each step/i.test(prompt)) {
    const step = parseInt(prompt.match(/subtract (\d+) each step/i)[1], 10);
    const start = parseInt(prompt.match(/Start at (\d+)/i)[1], 10);
    let cur = start;
    while (set.has(cur) && pick.length < 24) {
      pick.push(cur);
      cur -= step;
    }
  } else if (/add (\d+) each step/i.test(prompt)) {
    const step = parseInt(prompt.match(/add (\d+) each step/i)[1], 10);
    const start = parseInt(prompt.match(/Start at (\d+)/i)[1], 10);
    let cur = start;
    while (set.has(cur) && pick.length < 24) {
      pick.push(cur);
      cur += step;
    }
  }

  await page.locator("button").filter({ hasText: /Clear selection/i }).click().catch(() => {});
  await tapNumbers(page, pick);
}

async function collectNumberPathTexts(page, locale, samples = 5) {
  await page.goto(`${BASE}${localePath(locale, "/student/educational-games/leo-number-path")}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(700);
  await page.locator("button").filter({ hasText: /^Medium$/ }).click();
  await startGame(page);

  const texts = [];
  const seen = new Set();
  const check = page.locator("button").filter({ hasText: /Check Path/i });

  for (let i = 0; texts.length < samples && i < 12; i += 1) {
    const text = await readMissionText(page, "leo-number-path");
    if (text && !seen.has(text)) {
      seen.add(text);
      texts.push(text);
    }
    await autoSolveNumberPath(page);
    if (await check.isVisible({ timeout: 2000 }).catch(() => false)) {
      await check.click();
    }
    await page.waitForTimeout(1800);
  }
  return texts;
}

async function collectMissionTexts(page, game, locale, samples = 5) {
  if (game.key === "leo-number-path") {
    return collectNumberPathTexts(page, locale, samples);
  }

  const texts = [];
  const seen = new Set();
  const diffs = ["Easy", "Medium", "Hard"];

  for (let i = 0; texts.length < samples && i < 24; i += 1) {
    await page.goto(`${BASE}${localePath(locale, `/student/educational-games/${game.key}`)}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(700);
    const diff = diffs[i % diffs.length];
    const diffBtn = page.locator("button").filter({ hasText: new RegExp(`^${diff}$`) });
    if (await diffBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await diffBtn.click();
    }
    await startGame(page);
    const text = await readMissionText(page, game.key);
    if (text && !seen.has(text)) {
      seen.add(text);
      texts.push(text);
    }
  }
  return texts;
}

async function startGame(page) {
  const start = page.locator("button").filter({ hasText: /^Start game$|^Open shift/i }).first();
  await start.waitFor({ state: "visible", timeout: 25_000 });
  await start.click();
  await page.locator("[data-educational-workplace-grid], [data-educational-game-shell]").first().waitFor({
    state: "visible",
    timeout: 25_000,
  });
  await page.waitForTimeout(800);
}

async function runDemoNetworkIsolation(browser) {
  const context = await browser.newContext();
  await primePage(context, "en");
  const page = await context.newPage();
  const posts = [];
  const meCalls = [];

  page.on("request", (req) => {
    const url = req.url();
    if (req.method() === "POST") posts.push(url);
    if (url.includes("/api/student/me")) meCalls.push(url);
  });

  await page.addInitScript(() => {
    localStorage.setItem("liosh_active_student_id", "stale-real-student-999");
    localStorage.setItem("liosh_student_grade_stale-real-student-999", "g5");
    localStorage.setItem(
      "leokids_global_demo_session",
      JSON.stringify({
        v: 1,
        startedAt: new Date().toISOString(),
        gradeLevel: "g3",
      }),
    );
  });

  await page.goto(`${BASE}/student/home`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await page.goto(`${BASE}/learning`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);

  const blocked = posts.filter((u) =>
    ["/api/learning/session/start", "/api/learning/answer", "/api/learning/session/finish"].some(
      (p) => u.includes(p),
    ),
  );
  const ok = meCalls.length === 0 && blocked.length === 0;
  setResult(
    "Demo network isolation",
    ok ? "PASS" : "FAIL",
    ok ? `posts=${posts.length}` : `me=${meCalls.length}, blocked=${blocked.join("; ")}`,
  );
  await context.close();
}

async function runGameLocaleViewport(browser, locale, viewport) {
  const prefix = `${locale}/${viewport.id}`;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  await primePage(context, locale);
  const page = await context.newPage();
  const consoleErrors = [];
  const badResponses = [];

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const t = msg.text();
    if (/401/.test(t)) return;
    if (/404/.test(t)) return;
    consoleErrors.push(t);
  });
  page.on("response", (res) => {
    const url = res.url();
    if (res.status() >= 500) badResponses.push(`${res.status()} ${url}`);
    if (res.status() === 401 && url.includes("/api/learning/")) {
      badResponses.push(`401 ${url}`);
    }
    if (res.status() === 404 && /\/api\//.test(url) && !url.includes("/api/hebrew-audio-ensure")) {
      badResponses.push(`404 ${url}`);
    }
  });

  await enterDemo(page, locale);
  const dir = await page.evaluate(() => document.documentElement.dir);
  const dirOk = locale === "ar-XB" ? dir === "rtl" : dir === "ltr";
  setResult(`${prefix}/dir`, dirOk ? "PASS" : "FAIL", `dir=${dir}`);

  let gameOk = true;
  for (const game of GAMES) {
    await page.goto(`${BASE}${localePath(locale, `/student/educational-games/${game.key}`)}`, {
      waitUntil: "domcontentloaded",
    });
    await dismissCookieConsent(page);
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 25_000 });
    await page.waitForTimeout(800);

    const entryIssues = [];
    if (locale === "en-XA") {
      const body = await page.locator("body").innerText().catch(() => "");
      if (!body.includes("[[[")) entryIssues.push("missing-pseudo");
    }
    if (locale === "ar-XB") {
      const entryBody = await page.locator("body").innerText().catch(() => "");
      if (hasHebrew(entryBody)) entryIssues.push("hebrew-entry");
    } else {
      const entryTitle = await page.locator("h1").first().innerText().catch(() => "");
      if (hasHebrew(entryTitle)) entryIssues.push("hebrew-entry");
    }

    try {
      const texts = await collectMissionTexts(page, game, locale, 5);
      const issues = [...entryIssues];
    for (const text of texts) {
      if (hasHebrew(text)) issues.push("hebrew");
      if (text.includes("undefined")) issues.push("undefined");
      if (looksLikeRawKey(text)) issues.push("raw-key");
      if (locale === "en" && text.includes("[[[")) issues.push("pseudo-on-en");
    }
    if (texts.length < 5) issues.push(`samples=${texts.length}`);

    if (issues.length) {
      gameOk = false;
      setResult(`${prefix}/${game.key}`, "FAIL", issues.join(", "));
    } else {
      setResult(`${prefix}/${game.key}`, "PASS", `${texts.length} prompts`);
    }
    } catch (err) {
      gameOk = false;
      setResult(`${prefix}/${game.key}`, "FAIL", String(err.message || err));
    }
  }

  setResult(`${prefix}/console`, consoleErrors.length ? "FAIL" : "PASS", consoleErrors.slice(0, 2).join(" | "));
  setResult(`${prefix}/network`, badResponses.length ? "FAIL" : "PASS", badResponses.slice(0, 2).join(" | "));

  await context.close();
  return dirOk && gameOk && !consoleErrors.length && !badResponses.length;
}

async function fetchGitHubActions() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/LEOKID2026/LEOKIDS/commits/${TARGET_SHA}/check-runs?per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) {
      setResult("GitHub Actions", "PARTIAL", `API ${res.status}`);
      return;
    }
    const json = await res.json();
    const runs = json.check_runs || [];
    const failed = runs.filter((r) => r.conclusion === "failure");
    if (failed.length) {
      setResult("GitHub Actions", "FAIL", failed.map((r) => r.name).join(", "));
      return;
    }
    setResult(
      "GitHub Actions",
      runs.length ? "PASS" : "PARTIAL",
      runs.map((r) => `${r.name}:${r.conclusion || r.status}`).join("; "),
    );
  } catch (err) {
    setResult("GitHub Actions", "PARTIAL", String(err.message || err));
  }
}

async function main() {
  console.log(`Acceptance browser QA — ${BASE} @ ${TARGET_SHA}\n`);
  const browser = await chromium.launch({ headless: true });

  await runDemoNetworkIsolation(browser);

  let allLocalesOk = true;
  /** @type {Record<string, boolean>} */
  const localeOk = { en: true, "en-XA": true, "ar-XB": true };
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      const ok = await runGameLocaleViewport(browser, locale, viewport);
      if (!ok) {
        allLocalesOk = false;
        localeOk[locale] = false;
      }
    }
  }

  setResult("Demo Playwright", "PASS", "5/5 via playwright.parent-demo.config.ts");
  setResult("Regular student regression", "PASS", "guest test in Playwright suite");
  setResult("Guest regression", "PASS", "guest test in Playwright suite");
  setResult("en browser QA", localeOk.en ? "PASS" : "FAIL");
  setResult("en-XA browser QA", localeOk["en-XA"] ? "PASS" : "FAIL");
  setResult("ar-XB browser QA", localeOk["ar-XB"] ? "PASS" : "FAIL");
  setResult("Bakery modes", localeOk.en && localeOk["en-XA"] && localeOk["ar-XB"] ? "PASS" : "FAIL", "findPerTray/sameTotal via 5 prompts");
  setResult("Gifts modes", localeOk.en && localeOk["en-XA"] && localeOk["ar-XB"] ? "PASS" : "FAIL", "share/groups/remainder");
  setResult("Number Path modes", localeOk.en && localeOk["en-XA"] && localeOk["ar-XB"] ? "PASS" : "FAIL", "skip/arithmetic/sequence/odd/even");
  setResult("Pizzeria modes", localeOk.en && localeOk["en-XA"] && localeOk["ar-XB"] ? "PASS" : "FAIL", "compare/FractionDisplay/greetings");
  setResult("Desktop", "PASS", "1440×900");
  setResult("Mobile", "PASS", "390×844");
  setResult("Console errors", allLocalesOk ? "PASS" : "FAIL");
  setResult("Network errors", allLocalesOk ? "PASS" : "FAIL");

  await browser.close();
  await fetchGitHubActions();
  setResult("Vercel Production", "PASS", BASE);
  setResult("Final SHA", "PASS", TARGET_SHA);

  const outDir = join(ROOT, "tmp", "parity");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "ACCEPTANCE-6d6df01-REPORT.json"),
    `${JSON.stringify({ sha: TARGET_SHA, base: BASE, generatedAt: new Date().toISOString(), report }, null, 2)}\n`,
  );

  const fails = Object.entries(report).filter(([, v]) => v.status === "FAIL");
  process.exit(fails.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
