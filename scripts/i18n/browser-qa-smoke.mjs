/**
 * Expanded HTTP smoke matrix — verifies SSR html lang/dir from first response.
 * Run after: npm run build && npm run start
 */
const base = process.env.BROWSER_QA_BASE || "http://localhost:3000";

/** @type {{ locale: string, route: string, cookie?: string, expectLang: string, expectDir: string }[]} */
const MATRIX = [];

const coreRoutes = [
  "/",
  "/kids",
  "/parents",
  "/teachers",
  "/practice",
  "/guides",
  "/contact",
  "/privacy",
  "/terms",
  "/games",
  "/parent/login",
  "/parent/dashboard",
  "/learning/parent-report",
  "/learning/parent-report-detailed",
  "/student/login",
  "/student/home",
  "/student/learning",
  "/student/educational-games",
  "/student/games",
  "/student/cards",
  "/parent/worksheets",
  "/teacher/login",
  "/teacher/dashboard",
  "/school/dashboard",
  "/guardian/login",
  "/practice/worksheets",
  "/404-test-route",
  "/api/pwa/manifest?portal=student",
];

const educationalRoutes = [
  "/student/educational-games",
  "/student/educational-games/recycling-factory",
  "/student/educational-games/leo-supermarket",
  "/student/educational-games/leo-lab",
  "/student/educational-games/leo-gifts",
  "/student/educational-games/leo-bakery",
  "/student/educational-games/leo-number-path",
  "/student/educational-games/leo-pizzeria",
  "/student/educational-games/leo-word-train",
  "/student/educational-games/leo-word-detective",
];

const soloRoutes = [
  "/student/solo-games",
  "/student/solo-games/catcher",
  "/student/solo-games/puzzle",
  "/student/solo-games/memory",
  "/student/solo-games/maze",
  "/student/solo-games/flyer",
  "/student/solo-games/balloons",
  "/student/solo-games/leo-jump",
  "/student/solo-games/picture-puzzle",
  "/student/solo-games/target-tap",
  "/student/solo-games/sort-shapes",
  "/student/solo-games/smart-blocks",
  "/student/solo-games/fruit-slice",
  "/student/solo-games/leo-miners",
];

const arcadeRoutes = [
  "/student/games",
  "/student/games/fourline",
  "/student/games/ludo",
  "/student/games/snakes-and-ladders",
  "/student/games/checkers",
  "/student/games/chess",
  "/student/games/dominoes",
  "/student/games/bingo",
  "/student/arcade",
];

const offlineRoutes = [
  "/student/offline",
  "/student/offline/tic-tac-toe",
  "/student/offline/rock-paper-scissors",
  "/student/offline/tap-battle",
  "/student/offline/memory-match",
  "/student/offline/solo/catcher",
  "/student/offline/educational/leo-lab",
];

const rewardsRoutes = ["/student/cards", "/student/home"];

const booksRoutes = [
  "/learning",
  "/student/learning/book/math/g1",
  "/student/learning/book/geometry/g1",
  "/student/learning/book/english/g1",
  "/learning/book/math/g1",
  "/learning/book/math/g1/ns_counting_forward",
  "/learning/book/geometry/g1/shapes_basic_square",
  "/learning/book/english/g1/letters_upper",
];

/** @type {Record<string, string[]>} */
const ROUTE_FAMILIES = {
  chrome: coreRoutes,
  educational: educationalRoutes,
  solo: soloRoutes,
  arcade: arcadeRoutes,
  offline: offlineRoutes,
  rewards: rewardsRoutes,
  books: booksRoutes,
};

const routes = [
  ...coreRoutes,
  ...educationalRoutes,
  ...soloRoutes,
  ...arcadeRoutes,
  ...offlineRoutes,
  ...rewardsRoutes,
  ...booksRoutes,
];

const localePrefixes = [
  { prefix: "", locale: "en", lang: "en", dir: "ltr" },
  { prefix: "/en-XA", locale: "en-XA", lang: "en-XA", dir: "ltr" },
  { prefix: "/ar-XB", locale: "ar-XB", lang: "ar-XB", dir: "rtl" },
];

for (const lp of localePrefixes) {
  for (const route of routes) {
    const path = lp.prefix ? `${lp.prefix}${route === "/" ? "/" : route}` : route;
    MATRIX.push({
      locale: lp.locale,
      route: path,
      expectLang: route.includes("manifest") ? "n/a" : lp.lang,
      expectDir: route.includes("manifest") ? "n/a" : lp.dir,
    });
  }
}

/** @type {Record<string, unknown>[]} */
const rows = [];

for (const c of MATRIX) {
  try {
    const res = await fetch(`${base}${c.route}`, { redirect: "follow" });
    const body = await res.text();
    const langMatch = body.match(/<html[^>]*\slang=["']([^"']+)["']/i);
    const dirMatch = body.match(/<html[^>]*\sdir=["']([^"']+)["']/i);
    const titleMatch = body.match(/<title[^>]*>([^<]+)/i);
    const canonicalMatch = body.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    const hreflangCount = (body.match(/rel=["']alternate["'][^>]*hreflang=/gi) || []).length;
    const rawKeyHit = /components__|lib__|pages__/.test(body);
    const localeOk =
      c.expectLang === "n/a"
        ? res.ok
        : langMatch?.[1] === c.expectLang && dirMatch?.[1] === c.expectDir;
    rows.push({
      locale: c.locale,
      route: c.route,
      result: localeOk && !rawKeyHit ? "PASS" : "FAIL",
      status: res.status,
      htmlLang: langMatch?.[1] || (c.expectLang === "n/a" ? "n/a" : "missing"),
      htmlDir: dirMatch?.[1] || (c.expectDir === "n/a" ? "n/a" : "missing"),
      title: titleMatch?.[1]?.trim().slice(0, 80) || "",
      canonical: canonicalMatch?.[1] || "",
      hreflangCount,
      rawKeyHit,
      notes: c.route.includes("manifest") ? "JSON manifest" : "",
    });
  } catch (err) {
    rows.push({ locale: c.locale, route: c.route, result: "FAIL", notes: String(err.message || err) });
  }
}

const pass = rows.filter((r) => r.result === "PASS").length;

/** @param {string} route */
function routeFamily(route) {
  const bare = route.replace(/^\/(en-XA|ar-XB)/, "") || "/";
  for (const [family, list] of Object.entries(ROUTE_FAMILIES)) {
    if (list.some((r) => bare === r || bare.startsWith(`${r}/`))) return family;
  }
  return null;
}

/** @type {Record<string, { pass: number, fail: number, total: number }>} */
const familySummary = {};
for (const row of rows) {
  const family = routeFamily(row.route);
  if (!family) continue;
  if (!familySummary[family]) familySummary[family] = { pass: 0, fail: 0, total: 0 };
  familySummary[family].total += 1;
  if (row.result === "PASS") familySummary[family].pass += 1;
  else familySummary[family].fail += 1;
}

console.log(
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      base,
      pass,
      total: rows.length,
      familySummary,
      rows,
    },
    null,
    2,
  ),
);
