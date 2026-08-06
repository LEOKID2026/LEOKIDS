import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = "http://127.0.0.1:3001";
const OUT = path.join(ROOT, "docs/reports/master-loggedin-api-retry-flakes.json");
const HE = /[\u0590-\u05FF]/;
const EN_MARKERS = ["Sign out", "My classes", "Class report"];

async function open(browser, localeId, prefix) {
  const ctx = await browser.newContext({
    locale: localeId,
    extraHTTPHeaders: { "Accept-Language": `${localeId},en;q=0.4` },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: localeId, url: BASE }]);
  await ctx.addInitScript(() => {
    localStorage.setItem(
      "leokids_consent_v1",
      JSON.stringify({
        version: 1,
        choice: "accepted",
        ads: true,
        analytics: true,
        decidedAt: new Date().toISOString(),
        source: "banner",
      })
    );
  });
  return { ctx, page: await ctx.newPage(), prefix };
}

async function harvest(page) {
  await page.waitForTimeout(1200);
  const body = await page.locator("body").innerText().catch(() => "");
  return {
    url: page.url(),
    hebrew: HE.test(body),
    en: EN_MARKERS.filter((m) => body.includes(m)),
    sample: body.slice(0, 200),
  };
}

const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), checks: [] };

// Retry ru-RU parent login + routes
{
  const { ctx, page, prefix } = await open(browser, "ru-RU", "/ru");
  await page.goto(`${BASE}${prefix}/parent/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.getByTestId("parent-login-identifier").fill("eran1@leokids.com");
  await page.locator('input[type="password"]').fill("747975");
  await page.locator("form").first().evaluate((form) => form.requestSubmit());
  try {
    await page.waitForURL(/\/parent\/(?!login)/, { timeout: 60000 });
  } catch {
    await page.waitForTimeout(10000);
  }
  const loginOk = !/parent\/login/.test(page.url());
  const rows = [];
  if (loginOk) {
    for (const route of ["/parent/dashboard", "/parent/worksheets", "/learning/parent-report"]) {
      await page.goto(`${BASE}${prefix}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
      rows.push({ route, ...(await harvest(page)) });
    }
  }
  report.checks.push({ locale: "ru-RU", role: "parent", loginOk, url: page.url(), rows });
  await ctx.close();
}

// Retry pt-BR school teachers (+ dashboard/students)
{
  const { ctx, page, prefix } = await open(browser, "pt-BR", "/br");
  await page.goto(`${BASE}${prefix}/teacher/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator('[data-testid="teacher-login-root"][data-state="ready"]').waitFor({ timeout: 60000 });
  await page.getByTestId("teacher-login-tab").click().catch(() => {});
  await page
    .locator('[data-testid="teacher-login-root"][data-state="ready"] input[type="email"]')
    .first()
    .fill("eran3@leokids.com", { force: true });
  await page.getByTestId("teacher-login-password").fill("747975", { force: true });
  await page.locator('[data-testid="teacher-login-root"] form button[type="submit"]').click({ force: true });
  try {
    await page.waitForURL(/\/(teacher|school)\/(?!login)/, { timeout: 60000 });
  } catch {
    await page.waitForTimeout(8000);
  }
  if (!/school\//.test(page.url())) {
    await page.goto(`${BASE}${prefix}/school/dashboard`, { waitUntil: "domcontentloaded", timeout: 90000 });
  }
  const rows = [];
  for (const route of ["/school/dashboard", "/school/students", "/school/teachers"]) {
    let attempt = 0;
    let h = null;
    while (attempt < 3) {
      try {
        await page.goto(`${BASE}${prefix}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
        await page.waitForLoadState("networkidle").catch(() => {});
        h = await harvest(page);
        break;
      } catch (err) {
        attempt += 1;
        h = { error: String(err?.message || err).slice(0, 160) };
        await page.waitForTimeout(1500);
      }
    }
    rows.push({ route, ...h });
  }
  report.checks.push({
    locale: "pt-BR",
    role: "school",
    loginOk: !/teacher\/login/.test(page.url()),
    rows,
  });
  await ctx.close();
}

await browser.close();
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
