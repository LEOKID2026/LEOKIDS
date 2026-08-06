#!/usr/bin/env node
/**
 * Independent EN runtime Hebrew crawl — writes under docs/reports only.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = String(process.env.BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const HEBREW_RE = /[\u0590-\u05FF]/;
const OUT = path.join(process.cwd(), "docs/reports/en-hebrew-independent-runtime-crawl.json");

const ROUTES = [
  "/",
  "/en",
  "/kids",
  "/parents",
  "/teachers",
  "/schools",
  "/about",
  "/contact",
  "/gallery",
  "/games",
  "/help",
  "/guides",
  "/guides/math-practice-at-home",
  "/guides/home-practice-routine",
  "/guides/how-to-follow-child-progress",
  "/practice",
  "/practice/math",
  "/practice/english",
  "/practice/science",
  "/practice/geometry",
  "/practice/games",
  "/practice/worksheets",
  "/parent/login",
  "/student/login",
  "/teacher/login",
  "/school/register",
  "/school/staff/login",
  "/auth/forgot-password",
  "/demo/enter",
  "/learning",
  "/learning/curriculum",
  "/learning/math-master",
  "/learning/geometry-master",
  "/learning/english-master",
  "/learning/science-master",
  "/offline",
  "/404",
];

async function waitForServer(url, attempts = 90) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status > 0) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

async function harvestHebrew(page) {
  return page.evaluate((heSource) => {
    const HE = new RegExp(heSource);
    const hits = [];
    const push = (where, text) => {
      const t = String(text || "").trim();
      if (!t || !HE.test(t)) return;
      hits.push({ where, sample: t.slice(0, 200) });
    };
    push("document.title", document.title);
    push("meta.description", document.querySelector('meta[name="description"]')?.content);
    push("html.lang", document.documentElement.getAttribute("lang"));
    push("body.innerText", document.body?.innerText || "");
    document.querySelectorAll("[placeholder],[aria-label],[title],[alt]").forEach((el, i) => {
      for (const attr of ["placeholder", "aria-label", "title", "alt"]) {
        push(`${el.tagName.toLowerCase()}[${i}].${attr}`, el.getAttribute(attr));
      }
    });
    return hits;
  }, HEBREW_RE.source);
}

async function interactPublicChrome(page) {
  const notes = [];
  // Open common menus / dialogs if present
  const selectors = [
    'button[aria-label*="menu" i]',
    'button[aria-label*="Menu" i]',
    '[data-testid="mobile-menu"]',
    'button:has-text("Menu")',
    'button:has-text("Language")',
    'button:has-text("Sign in")',
    'a:has-text("Help")',
    'button:has-text("Try demo")',
    'button:has-text("Demo")',
  ];
  for (const sel of selectors) {
    try {
      const loc = page.locator(sel).first();
      if (await loc.isVisible({ timeout: 400 })) {
        await loc.click({ timeout: 1500 }).catch(() => {});
        notes.push(`clicked:${sel}`);
        await page.waitForTimeout(400);
      }
    } catch {
      /* ignore */
    }
  }
  return notes;
}

async function main() {
  const ready = await waitForServer(BASE);
  if (!ready) {
    const payload = { ok: false, error: `Server not ready at ${BASE}`, base: BASE };
    fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
    console.error(JSON.stringify(payload));
    process.exit(2);
  }

  const browser = await chromium.launch({ headless: true });
  /** @type {any[]} */
  const results = [];
  let hebrewRoutes = 0;

  for (const route of ROUTES) {
    const context = await browser.newContext({
      locale: "en-US",
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    await context.addCookies([
      {
        name: "lk_global_locale",
        value: "en",
        url: BASE,
      },
    ]);
    const page = await context.newPage();
    const url = `${BASE}${route}`;
    /** @type {any} */
    const row = {
      route,
      url,
      status: 0,
      hebrew: false,
      hits: [],
      interactions: [],
      errors: [],
    };
    try {
      const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      row.status = resp?.status() || 0;
      await page.waitForTimeout(700);
      row.interactions = await interactPublicChrome(page);
      row.hits = await harvestHebrew(page);
      row.hebrew = row.hits.length > 0;
      if (row.hebrew) hebrewRoutes += 1;
    } catch (e) {
      row.errors.push(String(e?.message || e));
    }
    results.push(row);
    await context.close();
    console.log(
      `${row.hebrew ? "HE" : "OK"} ${row.status} ${route} hits=${row.hits.length} err=${row.errors.length}`
    );
  }

  await browser.close();

  const payload = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    routesChecked: ROUTES.length,
    hebrewRoutes,
    hebrewFree: hebrewRoutes === 0 && results.every((r) => r.errors.length === 0 || r.status > 0),
    results,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(JSON.stringify({ routesChecked: ROUTES.length, hebrewRoutes, out: OUT }, null, 2));
  process.exit(hebrewRoutes === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
