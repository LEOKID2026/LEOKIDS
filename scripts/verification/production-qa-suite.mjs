/**
 * Production QA suite — middleware, route crawl, print, books, games, guest.
 * Requires: npm run build && npm run start -- -p 3010
 * Run: PLAYWRIGHT_BASE_URL=http://127.0.0.1:3010 node scripts/verification/production-qa-suite.mjs
 */
import { chromium, devices } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { ACTIVE_LEARNING_BOOK_PAGES } from "../../tests/i18n/learning-book-active-pages.mjs";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3010";
const OUT = path.join(process.cwd(), "tmp", "verification", "production-qa");
fs.mkdirSync(OUT, { recursive: true });

const HE = /[\u0590-\u05FF]/;

const MIDDLEWARE_CASES = [
  { path: "/learning/curriculum.he", expectStatus: 308, expectPath: "/learning/curriculum", qs: "" },
  { path: "/student/games/bingo.he", expectStatus: 308, expectPath: "/student/games/bingo", qs: "?room=123" },
  { path: "/parent/school-inbox.he", expectStatus: 308, expectPath: "/parent/school-inbox", qs: "?child=123" },
  { path: "/student/offline/educational/example.he", expectStatus: 308, expectPath: "/student/offline/educational/example", qs: "" },
  { path: "/api/example.he", expectStatus: 404, expectPath: null, qs: "", note: "API should not redirect" },
  { path: "/_next/static/example.he.js", expectStatus: 404, expectPath: null, qs: "" },
  { path: "/admin/example.he", expectStatus: [200, 302, 307, 308, 404], expectPath: null, qs: "", note: "Admin unchanged" },
];

/** @type {object} */
const report = {
  base: BASE,
  timestamp: new Date().toISOString(),
  middleware: [],
  routes: [],
  guest: {},
  print: [],
  books: [],
  games: [],
  errors: [],
};

async function fetchHead(url, opts = {}) {
  const res = await fetch(url, { redirect: "manual", ...opts });
  return res;
}

async function testMiddleware() {
  for (const c of MIDDLEWARE_CASES) {
    const url = `${BASE}${c.path}${c.qs || ""}`;
    const res = await fetchHead(url);
    const loc = res.headers.get("location") || "";
    const expectedStatuses = Array.isArray(c.expectStatus) ? c.expectStatus : [c.expectStatus];
    const pass = expectedStatuses.includes(res.status);
    let pathOk = true;
    if (c.expectPath && res.status >= 300 && res.status < 400) {
      const dest = new URL(loc, BASE);
      pathOk = dest.pathname === c.expectPath && (c.qs ? dest.search === c.qs : true);
    }
    report.middleware.push({
      url,
      expected: c,
      actual: { status: res.status, location: loc },
      pass: pass && pathOk,
    });
  }
}

function pickBookSamples() {
  const byKey = new Map();
  for (const p of ACTIVE_LEARNING_BOOK_PAGES) {
    const k = `${p.subject}:${p.grade}`;
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(p);
  }
  /** @type {{ subject: string, grade: string, pageId: string, route: string, kind: string }[]} */
  const samples = [];
  for (const [k, pages] of byKey) {
    const [subject, grade] = k.split(":");
    const sorted = [...pages].sort((a, b) => a.pageId.localeCompare(b.pageId));
    const first = sorted[0];
    const complex = sorted.find((p) => p.pageId.includes("wp_") || p.pageId.includes("div")) || sorted[Math.min(1, sorted.length - 1)];
    for (const [p, kind] of [
      [first, "first"],
      [complex, "complex"],
    ]) {
      if (!p) continue;
      samples.push({
        subject,
        grade,
        pageId: p.pageId,
        kind,
        route: `/student/learning/book/${subject}/${grade}/${p.pageId}`,
      });
    }
  }
  return samples;
}

const EDUCATIONAL_GAMES = [
  "leo-bakery",
  "leo-gifts",
  "leo-lab",
  "leo-number-path",
  "leo-pizzeria",
  "leo-supermarket",
  "leo-word-detective",
  "leo-word-train",
  "recycling-factory",
];

const SOLO_GAMES = ["balloons", "catcher", "flyer", "fruit-slice", "jump", "maze", "memory", "picture-puzzle", "puzzle", "sort-shapes", "target-tap"];

const OFFLINE_PUBLIC = [
  "/offline/tic-tac-toe",
  "/offline/memory-match",
  "/offline/rock-paper-scissors",
  "/offline/tap-battle",
];

const ARCADE_ROUTES = [
  "/student/arcade",
  "/student/games/bingo",
  "/student/games/checkers",
  "/student/games/chess",
  "/student/games/dominoes",
  "/student/games/fourline",
  "/student/games/ludo",
  "/student/games/snakes-and-ladders",
  "/learning/curriculum.he",
];

const STATIC_ROUTES = [
  "/",
  "/student/login",
  "/parent/login",
  "/practice",
  "/practice/worksheets",
  "/practice/worksheets/preview",
  "/guides",
  "/learning/curriculum",
  "/offline",
];

async function auditRoute(page, route, label) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedResources = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err.message || err)));
  page.on("response", (res) => {
    const ct = res.headers()["content-type"] || "";
    if (res.status() >= 400 && !res.url().includes("favicon")) {
      failedResources.push({ url: res.url(), status: res.status(), ct });
    }
    if (res.status() >= 200 && res.status() < 300 && ct.includes("text/html") && res.url().includes("/_next/static/")) {
      failedResources.push({ url: res.url(), status: res.status(), ct, mimeError: true });
    }
  });

  let status = 0;
  try {
    const resp = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    status = resp?.status() ?? 0;
    await page.waitForTimeout(1200);
  } catch (e) {
    pageErrors.push(String(e));
  }

  const dir = await page.evaluate(() => document.documentElement.getAttribute("dir") || "ltr");
  const bodyDir = await page.evaluate(() => getComputedStyle(document.body).direction);
  const visible = await page.locator("body").innerText().catch(() => "");
  const heCount = (visible.match(HE) || []).length;
  const nextDataHe = await page
    .evaluate(() => {
      const el = document.getElementById("__NEXT_DATA__");
      if (!el) return 0;
      return (el.textContent?.match(/[\u0590-\u05FF]/g) || []).length;
    })
    .catch(() => 0);
  const overflow = await page
    .evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
    .catch(() => false);

  return {
    route,
    label,
    status,
    dir,
    computedDirection: bodyDir,
    hebrewVisible: heCount,
    hebrewNextData: nextDataHe,
    horizontalOverflow: overflow,
    consoleErrors: consoleErrors.slice(0, 8),
    pageErrors: pageErrors.slice(0, 5),
    failedResources: failedResources.slice(0, 8),
    pass: heCount === 0 && dir !== "rtl" && bodyDir !== "rtl" && pageErrors.length === 0,
  };
}

async function main() {
  // Health check
  try {
    const h = await fetch(`${BASE}/student/login`, { redirect: "manual" });
    if (!h.ok && h.status !== 302 && h.status !== 200) {
      report.errors.push(`Server not healthy at ${BASE}: ${h.status}`);
      fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
      console.error("Server not ready:", h.status);
      process.exit(1);
    }
  } catch (e) {
    report.errors.push(String(e));
    fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
    process.exit(1);
  }

  await testMiddleware();

  const browser = await chromium.launch();
  const desktop = await browser.newContext({ locale: "en-US", viewport: { width: 1440, height: 900 } });
  const mobile = await browser.newContext({ locale: "en-US", ...devices["iPhone 13"] });

  // Guest
  const guestPage = await desktop.newPage();
  const guestRes = await guestPage.request.post(`${BASE}/api/student/guest/start`, {
    data: {},
    headers: { "Content-Type": "application/json" },
  });
  let guestBody = {};
  try {
    guestBody = await guestRes.json();
  } catch {
    guestBody = { parseError: true };
  }
  report.guest = {
    status: guestRes.status(),
    ok: guestRes.ok(),
    code: guestBody.code || null,
    error: guestBody.error || null,
  };

  // Route crawl
  const crawlRoutes = [...STATIC_ROUTES, ...OFFLINE_PUBLIC, ...ARCADE_ROUTES];
  const page = await desktop.newPage();
  for (const route of crawlRoutes) {
    report.routes.push(await auditRoute(page, route, "desktop-crawl"));
  }
  await page.close();

  // Book samples (48)
  const bookSamples = pickBookSamples();
  const bookPage = await desktop.newPage();
  for (const s of bookSamples) {
    const r = await auditRoute(bookPage, s.route, `book-${s.subject}-${s.grade}-${s.kind}`);
    report.books.push({ ...s, ...r });
  }
  await bookPage.close();

  // Games
  const gamePageDesk = await desktop.newPage();
  const gamePageMob = await mobile.newPage();
  for (const g of EDUCATIONAL_GAMES) {
    const route = `/student/game?game=${g}`;
    const desk = await auditRoute(gamePageDesk, route, `edu-${g}-desktop`);
    const mob = await auditRoute(gamePageMob, route, `edu-${g}-mobile`);
    report.games.push({
      game: g,
      type: "educational",
      desktop: desk,
      mobile: mob,
      entry: desk.status < 500,
      gameplay: desk.pageErrors.length === 0,
      english: desk.hebrewVisible === 0 && mob.hebrewVisible === 0,
      ltr: desk.dir !== "rtl" && mob.dir !== "rtl",
    });
  }
  for (const g of SOLO_GAMES.slice(0, 6)) {
    const route = `/student/game?solo=${g}`;
    const desk = await auditRoute(gamePageDesk, route, `solo-${g}`);
    report.games.push({
      game: g,
      type: "solo",
      desktop: desk,
      entry: desk.status < 500,
      english: desk.hebrewVisible === 0,
    });
  }
  for (const route of OFFLINE_PUBLIC) {
    const desk = await auditRoute(gamePageDesk, route, `offline-${route}`);
    report.games.push({ game: route, type: "offline-public", desktop: desk, entry: desk.status < 500 });
  }
  await gamePageDesk.close();
  await gamePageMob.close();

  // Print QA
  const printRoutes = [
    "/practice/worksheets",
    "/practice/worksheets/preview?subject=english&grade=g3&topic=vocabulary&count=6",
    "/practice/worksheets/preview/answers?subject=math&grade=g4&topic=addition&count=6&layout=horizontal",
  ];
  const printPage = await desktop.newPage();
  await printPage.emulateMedia({ media: "print" });
  for (const route of printRoutes) {
    await printPage.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 90000 });
    await printPage.waitForTimeout(1500);
    const dir = await printPage.evaluate(() => document.documentElement.getAttribute("dir") || "ltr");
    const text = await printPage.locator("body").innerText();
    const heCount = (text.match(HE) || []).length;
    const shot = path.join(OUT, `print-${route.replace(/[^\w.-]+/g, "_").slice(0, 80)}.png`);
    await printPage.screenshot({ path: shot, fullPage: true });
    report.print.push({
      route,
      dir,
      hebrewCount: heCount,
      screenshot: shot,
      hasOptions: /Options:/i.test(text),
      hasAnswer: /Answer:/i.test(text),
      pass: dir !== "rtl" && heCount === 0,
    });
  }
  await printPage.close();
  await browser.close();

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log("Production QA written to", path.join(OUT, "report.json"));
  console.log("Middleware pass:", report.middleware.filter((m) => m.pass).length, "/", report.middleware.length);
  console.log("Routes with Hebrew:", report.routes.filter((r) => r.hebrewVisible > 0).length);
  console.log("Guest:", report.guest.status, report.guest.code || "");
  console.log("Book samples:", report.books.length, "flagged:", report.books.filter((b) => !b.pass).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
