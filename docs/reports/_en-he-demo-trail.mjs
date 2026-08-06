#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://127.0.0.1:3001";
const HE = /[\u0590-\u05FF]/;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ locale: "en-US" });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  const trail = [];

  async function snap(label) {
    await page.waitForTimeout(600);
    const text = await page.locator("body").innerText().catch(() => "");
    const title = await page.title().catch(() => "");
    const hebrew = HE.test(text) || HE.test(title);
    trail.push({
      label,
      url: page.url(),
      hebrew,
      title,
      sample: hebrew ? (text.match(/[\u0590-\u05FF].{0,100}/) || [""])[0] : "",
    });
    console.log(hebrew ? "HE" : "OK", label, page.url().replace(BASE, ""));
  }

  await page.goto(`${BASE}/demo/enter`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await snap("demo-enter");

  // Prefer testids from source
  const testids = [
    "demo-enter-start-student",
    "demo-enter-start-parent",
    "demo-grade-g1",
    "parent-demo-enter-button",
  ];
  for (const id of testids) {
    const el = page.getByTestId(id);
    if (await el.isVisible({ timeout: 500 }).catch(() => false)) {
      await el.click().catch(() => {});
      await snap(`testid:${id}`);
    }
  }

  // Grade buttons then student start
  const gradeBtn = page.locator("[data-testid^='demo-grade-']").first();
  if (await gradeBtn.isVisible({ timeout: 500 }).catch(() => false)) {
    await gradeBtn.click().catch(() => {});
    await snap("picked-grade");
  }
  for (const name of [/start/i, /enter/i, /continue/i, /parent/i, /student/i]) {
    const btn = page.getByRole("button", { name }).first();
    if (await btn.isVisible({ timeout: 400 }).catch(() => false)) {
      await btn.click().catch(() => {});
      await snap(`role-button:${name}`);
    }
  }

  await page.goto(`${BASE}/demo/parent/enter`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await snap("demo-parent-enter");
  const parentStart = page.getByTestId("parent-demo-enter-button");
  if (await parentStart.isVisible({ timeout: 800 }).catch(() => false)) {
    await parentStart.click().catch(() => {});
    await snap("parent-demo-started");
  }

  for (const r of [
    "/demo/enter",
    "/parent/dashboard",
    "/student/home",
    "/student/cards",
    "/learning/parent-report",
    "/help",
  ]) {
    await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
    await snap(`direct:${r}`);
  }

  await browser.close();
  const out = {
    generatedAt: new Date().toISOString(),
    hebrewStops: trail.filter((t) => t.hebrew).length,
    trail,
  };
  fs.writeFileSync("docs/reports/en-hebrew-independent-demo-trail.json", JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ stops: trail.length, hebrew: out.hebrewStops }, null, 2));
  process.exit(out.hebrewStops ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
