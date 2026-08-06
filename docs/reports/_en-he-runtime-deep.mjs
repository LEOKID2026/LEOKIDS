#!/usr/bin/env node
/**
 * Deeper EN runtime Hebrew probe: help articles, demo, worksheets, APIs.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = String(process.env.BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const HEBREW_RE = /[\u0590-\u05FF]/;
const OUT = path.join(process.cwd(), "docs/reports/en-hebrew-independent-runtime-deep.json");

async function harvest(page) {
  const text = await page.locator("body").innerText().catch(() => "");
  const title = await page.title().catch(() => "");
  const meta = await page
    .locator('meta[name="description"]')
    .getAttribute("content")
    .catch(() => "");
  const blob = `${title}\n${meta}\n${text}`;
  const hebrew = HEBREW_RE.test(blob);
  let sample = "";
  if (hebrew) {
    const m = blob.match(/[\u0590-\u05FF][^]*?(.{0,80})/);
    sample = (m && m[0] ? m[0] : blob).slice(0, 200);
  }
  return { hebrew, sample, title };
}

async function checkUrl(browser, route, interact) {
  const context = await browser.newContext({
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await context.newPage();
  const row = { route, status: 0, hebrew: false, sample: "", title: "", notes: [], errors: [] };
  try {
    const resp = await page.goto(`${BASE}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    row.status = resp?.status() || 0;
    await page.waitForTimeout(600);
    if (typeof interact === "function") {
      row.notes = (await interact(page)) || [];
      await page.waitForTimeout(500);
    }
    Object.assign(row, await harvest(page));
  } catch (e) {
    row.errors.push(String(e?.message || e));
  }
  await context.close();
  return row;
}

async function apiJson(pathname) {
  try {
    const res = await fetch(`${BASE}${pathname}`, {
      headers: { Accept: "application/json", "Accept-Language": "en-US" },
    });
    const text = await res.text();
    const hebrew = HEBREW_RE.test(text);
    return {
      route: pathname,
      status: res.status,
      hebrew,
      sample: hebrew ? text.match(/[\u0590-\u05FF].{0,120}/)?.[0] || "" : "",
      bytes: text.length,
    };
  } catch (e) {
    return { route: pathname, status: 0, hebrew: false, errors: [String(e?.message || e)] };
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const pageRows = [];

  // Discover a few help article links from /help
  {
    const context = await browser.newContext({ locale: "en-US" });
    await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
    const page = await context.newPage();
    await page.goto(`${BASE}/help`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(700);
    const hrefs = await page.$$eval("a[href*='/help/']", (as) =>
      [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))].slice(0, 8)
    );
    pageRows.push({ ...(await harvest(page)), route: "/help", status: 200, notes: [`links:${hrefs.length}`] });
    await context.close();
    for (const href of hrefs) {
      const route = href.startsWith("http") ? new URL(href).pathname : href;
      pageRows.push(await checkUrl(browser, route));
    }
  }

  // Guides index → sample guide already covered; click first guide card if any
  pageRows.push(
    await checkUrl(browser, "/guides", async (page) => {
      const notes = [];
      const link = page.locator("a[href^='/guides/']").first();
      if (await link.isVisible({ timeout: 800 }).catch(() => false)) {
        await link.click();
        notes.push("clicked-first-guide");
        await page.waitForTimeout(700);
      }
      return notes;
    })
  );

  // Worksheets hub + first worksheet slug if present
  pageRows.push(
    await checkUrl(browser, "/practice/worksheets", async (page) => {
      const notes = [];
      const link = page.locator("a[href*='/practice/worksheets/']").first();
      if (await link.isVisible({ timeout: 1000 }).catch(() => false)) {
        const href = await link.getAttribute("href");
        notes.push(`worksheet-link:${href}`);
        await link.click();
        await page.waitForTimeout(900);
      } else {
        notes.push("no-worksheet-link-visible");
      }
      // empty / error states often visible without auth
      return notes;
    })
  );

  // Demo enter — try to advance
  pageRows.push(
    await checkUrl(browser, "/demo/enter", async (page) => {
      const notes = [];
      for (const label of ["Continue", "Start", "Enter", "Parent", "Student", "Try"]) {
        const btn = page.getByRole("button", { name: new RegExp(label, "i") }).first();
        if (await btn.isVisible({ timeout: 400 }).catch(() => false)) {
          await btn.click().catch(() => {});
          notes.push(`clicked-btn:${label}`);
          await page.waitForTimeout(700);
        }
      }
      const link = page.locator("a[href*='/demo']").first();
      if (await link.isVisible({ timeout: 400 }).catch(() => false)) {
        notes.push(`demo-link:${await link.getAttribute("href")}`);
      }
      return notes;
    })
  );

  // Learning masters — open subject chips/menus if any
  for (const route of [
    "/learning/math-master",
    "/learning/english-master",
    "/student/login",
    "/parent/login",
    "/teacher/login",
  ]) {
    pageRows.push(
      await checkUrl(browser, route, async (page) => {
        const notes = [];
        // open first few buttons
        const buttons = page.locator("button");
        const count = Math.min(await buttons.count(), 5);
        for (let i = 0; i < count; i++) {
          const b = buttons.nth(i);
          if (await b.isVisible().catch(() => false)) {
            await b.click({ timeout: 800 }).catch(() => {});
            notes.push(`btn-${i}`);
            await page.waitForTimeout(200);
          }
        }
        return notes;
      })
    );
  }

  await browser.close();

  const apis = [];
  for (const p of [
    "/api/public/worksheets/catalog",
    "/api/demo/cards/catalog",
    "/api/demo/cards/series",
    "/api/arcade/games",
  ]) {
    apis.push(await apiJson(p));
  }

  const hebrewPages = pageRows.filter((r) => r.hebrew);
  const hebrewApis = apis.filter((r) => r.hebrew);
  const payload = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    pagesChecked: pageRows.length,
    apisChecked: apis.length,
    hebrewPages: hebrewPages.length,
    hebrewApis: hebrewApis.length,
    pageRows,
    apis,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(
    JSON.stringify(
      {
        pagesChecked: pageRows.length,
        hebrewPages: hebrewPages.length,
        apisChecked: apis.length,
        hebrewApis: hebrewApis.length,
        apiStatuses: apis.map((a) => ({ route: a.route, status: a.status, hebrew: a.hebrew })),
      },
      null,
      2
    )
  );
  process.exit(hebrewPages.length || hebrewApis.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
