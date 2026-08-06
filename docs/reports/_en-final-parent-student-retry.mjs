#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs";

function load(rel) {
  const o = {};
  for (const line of fs.readFileSync(rel, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    o[t.slice(0, i).trim()] = v;
  }
  return o;
}
const ENV = { ...load(".env.local"), ...load(".env.e2e.local"), ...process.env };
const BASE = "http://127.0.0.1:3001";
const HE = /[\u0590-\u05FF]/;

async function accept(page) {
  const b = page.getByRole("button", { name: /^(Accept|accept|Agree)$/i });
  if (await b.isVisible({ timeout: 1200 }).catch(() => false)) await b.click();
}

async function harvest(page) {
  const body = await page.locator("body").innerText();
  const html = await page.content();
  return {
    hebrewBody: HE.test(body),
    hebrewHtml: HE.test(html),
    samples: (body.match(/[\u0590-\u05FF][^\n]{0,50}/g) || []).slice(0, 8),
    url: page.url(),
  };
}

const browser = await chromium.launch({ headless: true });
const out = { generatedAt: new Date().toISOString(), flows: {} };

// Parent via demo (credentials invalid for real parent)
{
  const ctx = await browser.newContext({ locale: "en-US" });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/demo/parent/enter`, { waitUntil: "domcontentloaded" });
  await accept(page);
  const btn = page.getByTestId("parent-demo-enter-button");
  if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(2500);
  }
  const routes = [
    "/parent/dashboard",
    "/parent/worksheets",
    "/learning/parent-report",
    "/learning/parent-report-detailed",
  ];
  const rows = [];
  for (const r of routes) {
    await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(1500);
    rows.push({ route: r, ...(await harvest(page)) });
  }
  // try real parent login with testid
  await page.goto(`${BASE}/parent/login`, { waitUntil: "domcontentloaded" });
  await accept(page);
  await page.waitForTimeout(2000);
  const id = page.getByTestId("parent-login-identifier");
  const real = { attempted: false, ok: false, reason: "" };
  if (ENV.E2E_PARENT_EMAIL && (await id.isVisible({ timeout: 5000 }).catch(() => false))) {
    real.attempted = true;
    await id.fill(ENV.E2E_PARENT_EMAIL);
    await page.locator('input[type="password"]').fill(ENV.E2E_PARENT_PASSWORD || "");
    await page.getByTestId("parent-login-submit").click();
    await page.waitForTimeout(3000);
    real.ok = !/parent\/login/.test(page.url());
    real.reason = real.ok ? "ok" : `still login url=${page.url()}`;
  } else {
    real.reason = "identifier field not visible or missing env";
  }
  out.flows.parent = { demoRows: rows, realLogin: real };
  await ctx.close();
}

// Student demo + real via testid
{
  const ctx = await browser.newContext({ locale: "en-US" });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/demo/enter?grade=g3`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  const demoRows = [];
  for (const r of ["/student/home", "/student/cards", "/learning/math-master"]) {
    await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(1200);
    demoRows.push({ route: r, ...(await harvest(page)) });
  }
  await page.goto(`${BASE}/student/login`, { waitUntil: "domcontentloaded" });
  await accept(page);
  await page.waitForSelector('[data-testid="student-login-username"]', { timeout: 30000 }).catch(() => {});
  const real = { attempted: false, ok: false, reason: "" };
  const user = page.getByTestId("student-login-username");
  if (
    ENV.E2E_STUDENT_USERNAME &&
    (await user.isVisible({ timeout: 8000 }).catch(() => false))
  ) {
    real.attempted = true;
    await user.fill(ENV.E2E_STUDENT_USERNAME);
    await page.getByTestId("student-login-pin").fill(ENV.E2E_STUDENT_PIN || "");
    await page.getByTestId("student-login-submit").click();
    await page.waitForTimeout(3000);
    real.ok = !/student\/login/.test(page.url());
    real.reason = real.ok ? "ok" : `still login url=${page.url()}`;
    if (real.ok) {
      for (const r of ["/student/home", "/student/cards"]) {
        await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1200);
        demoRows.push({ route: `real:${r}`, ...(await harvest(page)) });
      }
    }
  } else {
    real.reason = "username field not visible or missing env";
  }
  out.flows.student = { rows: demoRows, realLogin: real };
  await ctx.close();
}

await browser.close();
const he =
  (out.flows.parent.demoRows || []).some((r) => r.hebrewBody || r.hebrewHtml) ||
  (out.flows.student.rows || []).some((r) => r.hebrewBody || r.hebrewHtml);
fs.writeFileSync("docs/reports/en-final-parent-student-retry.json", JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      parentReal: out.flows.parent.realLogin,
      studentReal: out.flows.student.realLogin,
      hebrewFound: he,
      parentDemoHe: (out.flows.parent.demoRows || []).filter((r) => r.hebrewBody).map((r) => r.route),
      studentHe: (out.flows.student.rows || []).filter((r) => r.hebrewBody).map((r) => r.route),
    },
    null,
    2
  )
);
