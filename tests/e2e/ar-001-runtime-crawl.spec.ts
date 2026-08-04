/**
 * ar-001 comprehensive public + auth runtime crawl.
 *
 * Run (fresh dev server recommended):
 *   npm run dev:run-button
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002 npx playwright test tests/e2e/ar-001-runtime-crawl.spec.ts --config=playwright.no-webserver.config.ts --project=chromium
 */
import { test, expect } from "@playwright/test";
import {
  findForbiddenChromeSnippets,
  getVisibleBodyText,
  hasHebrewOrIsraeliResidue,
} from "./helpers/ar-001-forbidden-english";

const PREFIX = "/ar-001";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/parents",
  "/kids",
  "/teachers",
  "/games",
  "/gallery",
  "/learning",
  "/help",
  "/legal",
  "/privacy",
  "/terms",
  "/accessibility",
  "/ai-disclosure",
  "/data-deletion",
  "/security",
  "/guides",
  "/guides/math-practice-at-home",
  "/guides/reading-practice-at-home",
  "/guides/no-print-worksheets",
  "/guides/learning-games-at-home",
  "/guides/parent-progress-tracking",
  "/guides/home-practice-routine",
  "/guides/math-games-for-kids",
  "/guides/reading-comprehension-at-home",
  "/guides/english-vocabulary-practice",
  "/guides/how-to-follow-child-progress",
  "/practice",
  "/practice/math",
  "/practice/reading",
  "/practice/english",
  "/practice/geometry",
  "/practice/science",
  "/practice/games",
  "/practice/no-print",
  "/practice/parent-reports",
  "/parent/login",
  "/teacher/login",
  "/school/staff/login",
  "/student/home",
];

async function crawlRoute(page, route: string) {
  const url = route === "/" ? `${PREFIX}/` : `${PREFIX}${route}`;
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  const status = response?.status() ?? 0;
  // 404 must never pass — require a real 2xx surface.
  expect(status, `${url} HTTP`).toBeGreaterThanOrEqual(200);
  expect(status, `${url} must not be 404/error`).toBeLessThan(400);

  const lang = await page.locator("html").getAttribute("lang");
  expect(lang === "ar" || lang === "ar-001", `${url} html lang`).toBeTruthy();

  const bodyText = await getVisibleBodyText(page);
  expect(bodyText).not.toMatch(/This page could not be found|404|الصفحة غير موجودة/i);
  expect(hasHebrewOrIsraeliResidue(bodyText), `${url} Hebrew/IL residue`).toBe(false);

  const forbidden = findForbiddenChromeSnippets(bodyText);
  expect(forbidden, `${url} forbidden English: ${forbidden.join(", ")}`).toEqual([]);
}

test.describe("ar-001 runtime crawl — public + auth surfaces", () => {
  test.describe.configure({ mode: "serial" });

  for (const route of PUBLIC_ROUTES) {
    test(`route ${route || "/"}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await crawlRoute(page, route);
    });
  }
});
