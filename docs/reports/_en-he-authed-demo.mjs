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
    await page.waitForTimeout(700);
    const text = await page.locator("body").innerText().catch(() => "");
    const title = await page.title().catch(() => "");
    const hebrew = HE.test(`${title}\n${text}`);
    trail.push({
      label,
      url: page.url(),
      hebrew,
      title,
      sample: hebrew ? (text.match(/[\u0590-\u05FF].{0,120}/) || [""])[0] : "",
    });
    console.log(hebrew ? "HE" : "OK", label, page.url().replace(BASE, ""));
  }

  // Auto-enter via query
  await page.goto(`${BASE}/demo/enter?grade=g3`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await snap("auto-enter-g3");

  const studentRoutes = [
    "/student/home",
    "/student/cards",
    "/student/game",
    "/learning",
    "/learning/math-master",
    "/learning/english-master",
    "/learning/science-master",
    "/learning/geometry-master",
    "/games",
  ];
  for (const r of studentRoutes) {
    await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await snap(`student:${r}`);
    // open first modal-ish button if any
    const dialogTriggers = page.locator("button");
    const n = Math.min(await dialogTriggers.count(), 4);
    for (let i = 0; i < n; i++) {
      const b = dialogTriggers.nth(i);
      const label = ((await b.innerText().catch(() => "")) || "").slice(0, 40);
      if (!label) continue;
      await b.click({ timeout: 600 }).catch(() => {});
      await page.waitForTimeout(350);
    }
    await snap(`student-interacted:${r}`);
  }

  // Parent demo
  await page.goto(`${BASE}/demo/parent/enter`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await snap("parent-enter-page");
  const start = page.getByTestId("parent-demo-enter-button");
  if (await start.isVisible({ timeout: 2000 }).catch(() => false)) {
    await start.click();
    await page.waitForTimeout(1500);
    await snap("after-parent-start");
  }
  for (const r of [
    "/parent/dashboard",
    "/parent/worksheets",
    "/learning/parent-report",
    "/parent/school-inbox",
  ]) {
    await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await snap(`parent:${r}`);
  }

  await browser.close();
  const out = {
    generatedAt: new Date().toISOString(),
    hebrewStops: trail.filter((t) => t.hebrew).length,
    trail,
  };
  fs.writeFileSync(
    "docs/reports/en-hebrew-independent-authed-demo-crawl.json",
    JSON.stringify(out, null, 2)
  );
  console.log(JSON.stringify({ stops: trail.length, hebrew: out.hebrewStops }, null, 2));
  process.exit(out.hebrewStops ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
