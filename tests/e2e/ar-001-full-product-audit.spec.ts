/**
 * ar-001 full product runtime audit — authenticated demos, help 40/40, learning, PWA.
 *
 * Run:
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002 npx playwright test tests/e2e/ar-001-full-product-audit.spec.ts --config=playwright.no-webserver.config.ts --project=chromium
 */
import { test, expect, type Page } from "@playwright/test";
import {
  AR_001_HELP_ARTICLE_PATHS,
  AR_001_LEARNING_SUBJECT_PATHS,
  AR_001_PREFIX,
  assertArabicDocumentShell,
  auditVisibleEnglish,
  collectAuditableBodyText,
  hasArabicContent,
} from "./helpers/ar-001-english-audit";
import { loginSchoolManager, loginTeacherDan } from "./helpers/ar-001-auth";

const PARENT_DEMO_SESSION_KEY = "leokids_global_parent_demo_session";
const STUDENT_DEMO_SESSION_KEY = "leokids_global_demo_session";
const DEMO_CHILD_ID = "demo-parent-child-noam-g2";

async function auditPage(page: Page, url: string, opts?: Parameters<typeof auditVisibleEnglish>[1]) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  const status = response?.status() ?? 0;
  expect(status, `${url} HTTP`).toBeGreaterThanOrEqual(200);
  expect(status, `${url} must not be 404`).toBeLessThan(400);

  const lang = await page.locator("html").getAttribute("lang");
  const dir = await page.locator("html").getAttribute("dir");
  expect(assertArabicDocumentShell(lang, dir), `${url} document shell`).toEqual([]);

  const bodyText = await collectAuditableBodyText(page);
  expect(bodyText).not.toMatch(/This page could not be found|404|الصفحة غير موجودة/i);
  expect(hasArabicContent(bodyText) || opts?.allowEnglishLearningBody, `${url} missing Arabic`).toBeTruthy();

  const forbidden = auditVisibleEnglish(bodyText, opts);
  expect(forbidden, `${url} forbidden English: ${forbidden.join(", ")}`).toEqual([]);
}

async function dismissCookieBanner(page: Page) {
  const accept = page.getByRole("button", { name: /^(يقبل|Accept|accept)$/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }
}

async function clearPersonaSessions(page: Page) {
  await page.goto(`${AR_001_PREFIX}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ([parentKey, studentKey]) => {
      localStorage.removeItem(parentKey);
      localStorage.removeItem(studentKey);
      sessionStorage.clear();
    },
    [PARENT_DEMO_SESSION_KEY, STUDENT_DEMO_SESSION_KEY]
  );
}

async function enterParentDemo(page: Page) {
  await clearPersonaSessions(page);
  await page.goto(`${AR_001_PREFIX}/demo/parent/enter`, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await page.evaluate((key) => localStorage.removeItem(key), PARENT_DEMO_SESSION_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByTestId("parent-demo-enter-button").click();
  await page.waitForURL(`**${AR_001_PREFIX}/parent/dashboard**`, { timeout: 30_000 });
  await expect(page.getByTestId("parent-demo-mode-bar")).toBeVisible({ timeout: 30_000 });
}

async function enterStudentDemo(page: Page, grade = "g3") {
  await clearPersonaSessions(page);
  await page.goto(`${AR_001_PREFIX}/demo/enter?grade=${grade}`, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await page.waitForURL(`**${AR_001_PREFIX}/student/home**`, { timeout: 30_000 });
}

test.describe("ar-001 help center — 40/40 articles", () => {
  test.describe.configure({ mode: "serial" });
  for (const path of AR_001_HELP_ARTICLE_PATHS) {
    test(`article ${path}`, async ({ page }) => {
      await auditPage(page, `${AR_001_PREFIX}${path}`);
    });
  }
});

test.describe("ar-001 parent portal demo (authenticated)", () => {
  test.describe.configure({ mode: "serial" });

  test("dashboard with demo children", async ({ page }) => {
    await enterParentDemo(page);
    await auditPage(page, `${AR_001_PREFIX}/parent/dashboard`);
    await expect(page.getByRole("heading", { name: "Noam" })).toBeVisible();
  });

  test("parent report short/regular/detailed surfaces", async ({ page }) => {
    await enterParentDemo(page);
    await page.goto(
      `${AR_001_PREFIX}/parent/parent-report?studentId=${encodeURIComponent(DEMO_CHILD_ID)}&source=parent`,
      { waitUntil: "domcontentloaded" },
    );
    await expect(page.getByTestId("report-date-range-control")).toBeVisible({ timeout: 30_000 });
    const bodyText = await collectAuditableBodyText(page);
    const forbidden = auditVisibleEnglish(bodyText);
    expect(forbidden).toEqual([]);
    expect(hasArabicContent(bodyText)).toBeTruthy();
  });

  test("worksheets hub via demo entry", async ({ page }) => {
    await enterParentDemo(page);
    await page.getByTestId("parent-demo-worksheets-entry").click();
    await page.waitForURL(/\/practice\/worksheets/, { timeout: 20_000 });
    await expect(page.getByTestId("public-seo-worksheets-slot")).toBeVisible({ timeout: 15_000 });
    const bodyText = await collectAuditableBodyText(page);
    expect(auditVisibleEnglish(bodyText)).toEqual([]);
  });

  test("guides hub renders Arabic chrome (not English fallback)", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/guides`);
    const h1Text = (await page.locator("h1").first().innerText()).trim();
    expect(h1Text).toMatch(/[\u0600-\u06FF]/);
    expect(h1Text).not.toMatch(/Practical guides|Home practice/i);
  });

  test("practice hub renders Arabic chrome (not English fallback)", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/practice`);
    const h1Text = (await page.locator("h1").first().innerText()).trim();
    expect(h1Text).toMatch(/[\u0600-\u06FF]/);
    expect(h1Text).not.toMatch(/Practice areas|Choose a subject/i);
  });

  test("parent dashboard worksheets school-inbox install-app", async ({ page }) => {
    await enterParentDemo(page);
    for (const path of ["/parent/dashboard", "/parent/worksheets", "/parent/install-app"]) {
      await auditPage(page, `${AR_001_PREFIX}${path}`);
    }
    await page.goto(`${AR_001_PREFIX}/parent/school-inbox`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByTestId("parent-school-inbox-list").or(page.getByTestId("parent-school-inbox-empty"))
    ).toBeVisible({ timeout: 45_000 });
    const inboxText = await collectAuditableBodyText(page);
    expect(auditVisibleEnglish(inboxText)).toEqual([]);
  });
});

test.describe("ar-001 student portal demo (authenticated)", () => {
  test.describe.configure({ mode: "serial" });

  test("student home after demo enter", async ({ page }) => {
    await enterStudentDemo(page);
    await auditPage(page, `${AR_001_PREFIX}/student/home`);
  });

  test("learning hub and subject entry pages", async ({ page }) => {
    await enterStudentDemo(page);
    await auditPage(page, `${AR_001_PREFIX}/learning`);
    for (const path of AR_001_LEARNING_SUBJECT_PATHS) {
      await auditPage(page, `${AR_001_PREFIX}${path}`, {
        allowEnglishLearningBody: path.endsWith("/english"),
      });
    }
  });

  test("games hub and gallery", async ({ page }) => {
    await enterStudentDemo(page);
    await auditPage(page, `${AR_001_PREFIX}/games`);
    await auditPage(page, `${AR_001_PREFIX}/gallery`);
  });

  test("rewards cards shop tab + home surprise surface + arcade", async ({ page }) => {
    await enterStudentDemo(page);

    await page.goto(`${AR_001_PREFIX}/student/cards`, { waitUntil: "domcontentloaded" });
    expect(
      (await page.locator("html").getAttribute("lang")) === "ar" ||
        (await page.locator("html").getAttribute("lang")) === "ar-001"
    ).toBeTruthy();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByTestId("student-cards-tab-shop")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("student-cards-tab-shop").click();
    await expect(page.getByTestId("student-cards-shop-panel")).toBeVisible({ timeout: 30_000 });
    const cardsText = await collectAuditableBodyText(page);
    expect(hasArabicContent(cardsText)).toBeTruthy();
    expect(auditVisibleEnglish(cardsText)).toEqual([]);

    await page.goto(`${AR_001_PREFIX}/student/home`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const surpriseOpen = page
      .getByTestId("student-world-dock-surprise-box")
      .or(page.getByTestId("student-surprise-box-open"));
    await expect(surpriseOpen.first()).toBeVisible({ timeout: 30_000 });
    await surpriseOpen.first().click({ force: true });
    await expect(page.getByTestId("student-surprise-box-modal")).toBeVisible({ timeout: 15_000 });
    const modalText = await page.getByTestId("student-surprise-box-modal").innerText();
    expect(auditVisibleEnglish(modalText)).toEqual([]);

    await auditPage(page, `${AR_001_PREFIX}/student/arcade`);
  });
});

test.describe("ar-001 learning runtime smoke", () => {
  test("learning index RTL Arabic chrome", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/learning`);
  });
});

test.describe("ar-001 PWA / offline chrome", () => {
  test("student install-app page", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/student/install-app`);
  });
  test("parent install-app page", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/parent/install-app`);
  });
  test("offline page", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/offline`);
  });
});

test.describe("ar-001 teacher + school entry (locale shell)", () => {
  test("teacher login page Arabic", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/teacher/login`);
  });
  test("school staff login Arabic", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/school/staff/login`);
  });
});

test.describe("ar-001 help center hub", () => {
  test("help index Arabic", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/help`);
  });
});

test.describe("ar-001 teacher + school authenticated", () => {
  test("teacher dashboard after login", async ({ page }) => {
    await loginTeacherDan(page);
    await auditPage(page, `${AR_001_PREFIX}/teacher/dashboard`);
  });

  test("school dashboard after manager login", async ({ page }) => {
    await loginSchoolManager(page);
    await auditPage(page, `${AR_001_PREFIX}/school/dashboard`);
  });
});

test.describe("ar-001 public demo enter", () => {
  test("global demo enter page", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/demo/enter`);
  });
  test("parent demo enter page", async ({ page }) => {
    await auditPage(page, `${AR_001_PREFIX}/demo/parent/enter`);
  });
});
