/**
 * Global browser QA — guest flow, .he redirects, books, worksheets.
 * Run: PLAYWRIGHT_USE_START=1 node scripts/global-browser-qa.mjs
 */
import { chromium, devices } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3001";
const OUT = path.join(process.cwd(), "tmp", "global-browser-qa");
const HE = /[\u0590-\u05FF]/g;

const BOOK_SAMPLES = [
  { subject: "math", grade: "g1", page: "add_two", route: "/student/learning/book/math/g1/add_two" },
  { subject: "geometry", grade: "g1", page: "shapes_basic_rectangle", route: "/student/learning/book/geometry/g1/shapes_basic_rectangle" },
  { subject: "science", grade: "g1", page: "animals", route: "/student/learning/book/science/g1/animals" },
  { subject: "english", grade: "g1", page: "grammar_be", route: "/student/learning/book/english/g1/grammar_be" },
];

const REDIRECTS = [
  ["/learning/curriculum.he", "/learning/curriculum"],
  ["/student/games/bingo.he", "/student/games/bingo"],
  ["/parent/school-inbox.he", "/parent/school-inbox"],
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, ...devices["iPhone 13"] },
];

fs.mkdirSync(OUT, { recursive: true });

/** @type {object[]} */
const evidence = [];

function countHebrew(text) {
  return (String(text || "").match(HE) || []).length;
}

async function auditPage(page, route, label, viewportName) {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  const dir = await page.evaluate(() => document.documentElement.getAttribute("dir") || "ltr");
  const bodyDir = await page.evaluate(() => getComputedStyle(document.body).direction);
  const visible = await page.locator("body").innerText();
  const heCount = countHebrew(visible);
  const shot = path.join(OUT, `${label}-${viewportName}.png`.replace(/[^\w.-]+/g, "_"));
  await page.screenshot({ path: shot, fullPage: false });
  evidence.push({
    route,
    viewport: viewportName,
    screenshot: shot,
    consoleErrors: errors.slice(0, 5),
    hebrewCount: heCount,
    dir,
    computedDirection: bodyDir,
  });
  return { heCount, dir, bodyDir, errors };
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ locale: "en-US" });

  // Guest session
  const guestPage = await context.newPage();
  await guestPage.goto(`${BASE}/student/login`, { waitUntil: "networkidle" });
  const guestRes = await guestPage.request.post(`${BASE}/api/student/guest/start`, {
    data: {},
    headers: { "Content-Type": "application/json" },
  });
  const guestOk = guestRes.ok();
  evidence.push({ route: "/api/student/guest/start", guestOk, status: guestRes.status() });

  for (const vp of VIEWPORTS) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const [from, to] of REDIRECTS) {
      const resp = await page.goto(`${BASE}${from}`, { waitUntil: "networkidle" });
      evidence.push({
        route: from,
        viewport: vp.name,
        status: resp?.status(),
        finalUrl: page.url(),
        expected: `${BASE}${to}`,
        redirectOk: page.url().includes(to),
      });
    }
    await auditPage(page, "/student/home", "student-home", vp.name);
    await auditPage(page, "/student/learning", "learning-hub", vp.name);
    for (const book of BOOK_SAMPLES) {
      await auditPage(page, book.route, `book-${book.subject}`, vp.name);
      const nextHref = await page.locator('a[rel="next"], a:has-text("Next")').first().getAttribute("href").catch(() => null);
      if (nextHref) {
        await auditPage(page, nextHref.startsWith("http") ? new URL(nextHref).pathname : nextHref, `book-${book.subject}-p2`, vp.name);
      }
    }
    await auditPage(page, "/student/educational-games", "edu-games", vp.name);
    await auditPage(page, "/practice/worksheets", "worksheets", vp.name);
    await auditPage(page, "/practice/worksheets/preview?subject=math&grade=g2&topic=addition&level=regular&count=5", "worksheets-preview", vp.name);
    await page.close();
  }

  await browser.close();
  const reportPath = path.join(OUT, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(evidence, null, 2));
  const bad = evidence.filter((e) => (e.hebrewCount ?? 0) > 0 || e.redirectOk === false);
  console.log(`Wrote ${reportPath}`);
  console.log(`Evidence items: ${evidence.length}, issues: ${bad.length}`);
  if (bad.length) {
    console.error(JSON.stringify(bad.slice(0, 10), null, 2));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
