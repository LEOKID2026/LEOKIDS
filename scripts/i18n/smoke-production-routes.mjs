#!/usr/bin/env node
/**
 * Browser smoke for Global Production / local production server.
 * Usage:
 *   BASE_URL=https://... node scripts/i18n/smoke-production-routes.mjs
 *   BASE_URL=http://127.0.0.1:3001 node scripts/i18n/smoke-production-routes.mjs
 */
import { chromium } from "playwright";

const BASE = String(process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3001").replace(
  /\/$/,
  ""
);

const ROUTES = [
  "/",
  "/kids",
  "/parents",
  "/teachers",
  "/about",
  "/contact",
  "/help",
  "/guides",
  "/practice",
  "/parent/login",
  "/student/login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/practice/worksheets",
  "/learning",
  "/learning/math-master",
  "/learning/geometry-master",
  "/learning/english-master",
  "/learning/science-master",
  "/404",
];

const HEBREW_RE = /[\u0590-\u05FF]/;
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 412, height: 799 },
];

const results = [];

async function checkRoute(browser, route, viewport) {
  const context = await browser.newContext({
    viewport,
    locale: "en-US",
  });
  const page = await context.newPage();
  /** @type {string[]} */
  const consoleErrors = [];
  /** @type {string[]} */
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err?.message || err)));

  const url = `${BASE}${route}`;
  let status = 0;
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    status = resp?.status() || 0;
    await page.waitForTimeout(800);
  } catch (e) {
    pageErrors.push(`navigation: ${e.message}`);
  }

  const bodyText = await page.locator("body").innerText().catch(() => "");
  const hebrew = HEBREW_RE.test(bodyText);
  const appError = /Application error: a client-side exception/i.test(bodyText);
  const failedChunks = consoleErrors.some((t) => /Loading chunk|ChunkLoadError|Failed to fetch/i.test(t));

  const pass =
    status > 0 &&
    status < 500 &&
    !appError &&
    pageErrors.length === 0 &&
    !failedChunks &&
    !hebrew;

  results.push({
    route,
    viewport: `${viewport.width}x${viewport.height}`,
    status,
    pass,
    appError,
    hebrew,
    pageErrors: pageErrors.slice(0, 3),
    consoleErrors: consoleErrors.filter((t) => !/favicon|third-party|gtag|ads/i.test(t)).slice(0, 3),
  });

  await context.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      await checkRoute(browser, route, vp);
    }
  }
} finally {
  await browser.close();
}

const fails = results.filter((r) => !r.pass);
console.log(`BASE_URL=${BASE}`);
console.log("route\tviewport\tstatus\tPASS/FAIL\tnotes");
for (const r of results) {
  const notes = [
    r.appError ? "client-exception" : "",
    r.hebrew ? "hebrew" : "",
    r.pageErrors[0] || "",
    r.consoleErrors[0] || "",
  ]
    .filter(Boolean)
    .join("; ");
  console.log(`${r.route}\t${r.viewport}\t${r.status}\t${r.pass ? "PASS" : "FAIL"}\t${notes}`);
}

if (fails.length) {
  console.error(`\n[smoke] FAIL — ${fails.length}/${results.length} checks failed`);
  process.exit(1);
}
console.log(`\n[smoke] OK — ${results.length} checks passed`);
