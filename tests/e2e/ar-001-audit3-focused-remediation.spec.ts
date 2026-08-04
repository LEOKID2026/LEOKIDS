/**
 * Focused ar-001 audit-#3 remediation checks.
 * Short suites only — not the multi-hour full audits.
 *
 *   $env:PLAYWRIGHT_BASE_URL="http://127.0.0.1:3002"
 *   npx playwright test tests/e2e/ar-001-audit3-focused-remediation.spec.ts --config=playwright.no-webserver.config.ts --project=chromium
 */
import { test, expect, type Page } from "@playwright/test";
import {
  AR_001_PREFIX,
  auditVisibleEnglish,
  collectAuditableBodyText,
} from "./helpers/ar-001-english-audit";
import { loginTeacherDan } from "./helpers/ar-001-auth";

const PARENT_DEMO_SESSION_KEY = "leokids_global_parent_demo_session";
const STUDENT_DEMO_SESSION_KEY = "leokids_global_demo_session";
const DEMO_CHILD_ID = "demo-parent-child-noam-g2";

async function dismissCookieBanner(page: Page) {
  const accept = page.getByRole("button", { name: /^(يقبل|Accept|accept)$/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click().catch(() => {});
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
}

async function enterStudentDemo(page: Page, grade = "g3") {
  await clearPersonaSessions(page);
  await page.goto(`${AR_001_PREFIX}/demo/enter?grade=${grade}`, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  await page.waitForURL(`**${AR_001_PREFIX}/student/home**`, { timeout: 30_000 });
}

async function auditReadySurface(page: Page) {
  const bodyText = await collectAuditableBodyText(page);
  expect(auditVisibleEnglish(bodyText), `forbidden: ${auditVisibleEnglish(bodyText).join(", ")}`).toEqual(
    []
  );
}

test.describe("ar-001 audit3 focused remediation", () => {
  test("parent report loading → ready (summary + detailed)", async ({ page }) => {
    await enterParentDemo(page);
    for (const mode of ["", "&mode=summary"]) {
      await page.goto(
        `${AR_001_PREFIX}/parent/parent-report-detailed?studentId=${encodeURIComponent(
          DEMO_CHILD_ID
        )}&source=parent&period=week${mode}`,
        { waitUntil: "domcontentloaded" }
      );
      await expect(page.getByTestId("parent-report-detailed-ready")).toBeVisible({ timeout: 60_000 });
      await expect(page.getByTestId("parent-report-detailed-loading")).toHaveCount(0);
      await auditReadySurface(page);
    }
  });

  test("parent school inbox chrome Arabic", async ({ page }) => {
    await enterParentDemo(page);
    await page.goto(`${AR_001_PREFIX}/parent/school-inbox`, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByTestId("parent-school-inbox-list").or(page.getByTestId("parent-school-inbox-empty"))
    ).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId("parent-school-inbox-back")).toBeVisible();
    await auditReadySurface(page);
  });

  test("teacher worksheets ready + no English chrome", async ({ page }) => {
    await loginTeacherDan(page);
    await page.goto(`${AR_001_PREFIX}/teacher/worksheets`, { waitUntil: "domcontentloaded" });
    await expect(
      page
        .getByTestId("teacher-worksheets-ready")
        .or(page.getByTestId("teacher-worksheets-empty"))
        .or(page.getByTestId("teacher-worksheets-list"))
    ).toBeVisible({ timeout: 45_000 });
    await auditReadySurface(page);
  });

  test("teacher private activity form Arabic chrome", async ({ page }) => {
    await loginTeacherDan(page);
    await page.goto(`${AR_001_PREFIX}/teacher/students/activities/new`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByTestId("teacher-activity-form-ready")).toBeVisible({ timeout: 45_000 });
    await auditReadySurface(page);
  });

  test("shop + surprise box open with hard asserts", async ({ page }) => {
    await enterStudentDemo(page);

    await page.goto(`${AR_001_PREFIX}/student/cards`, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("student-cards-tab-shop")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("student-cards-tab-shop").click();
    await expect(page.getByTestId("student-cards-shop-panel")).toBeVisible({ timeout: 30_000 });
    const shopTabText = await page.getByTestId("student-cards-tab-shop").innerText();
    expect(shopTabText, "shop tab must render Arabic label").toMatch(/متجر/);
    expect(auditVisibleEnglish(shopTabText)).toEqual([]);
    await auditReadySurface(page);

    await page.goto(`${AR_001_PREFIX}/student/home`, { waitUntil: "domcontentloaded" });
    const surpriseOpen = page
      .getByTestId("student-world-dock-surprise-box")
      .or(page.getByTestId("student-surprise-box-open"));
    await expect(surpriseOpen.first()).toBeVisible({ timeout: 30_000 });
    await surpriseOpen.first().click({ force: true });
    await expect(page.getByTestId("student-surprise-box-modal")).toBeVisible({ timeout: 15_000 });
    const modalText = await page.getByTestId("student-surprise-box-modal").innerText();
    expect(auditVisibleEnglish(modalText)).toEqual([]);
  });

  test("session isolation: parent demo cleared before student games", async ({ page }) => {
    await enterParentDemo(page);
    const parentKeyBefore = await page.evaluate((k) => localStorage.getItem(k), PARENT_DEMO_SESSION_KEY);
    expect(parentKeyBefore).toBeTruthy();

    await enterStudentDemo(page);
    const parentKeyAfter = await page.evaluate((k) => localStorage.getItem(k), PARENT_DEMO_SESSION_KEY);
    expect(parentKeyAfter).toBeNull();
    await expect(page).toHaveURL(new RegExp(`${AR_001_PREFIX}/student/home`));
  });

  test("sort-shapes gameplay after Start", async ({ page }) => {
    await enterStudentDemo(page);
    await page.goto(`${AR_001_PREFIX}/student/solo-games/sort-shapes`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const start = page.getByRole("button", { name: /ابدأ|بدء|تشغيل|Start|Play/i }).first();
    await expect(start).toBeVisible({ timeout: 30_000 });
    await start.click({ force: true });
    await expect(page.getByTestId("sort-shapes-gameplay")).toBeVisible({ timeout: 20_000 });
    await auditReadySurface(page);
  });

  test("memory difficulty Arabic + gameplay", async ({ page }) => {
    await enterStudentDemo(page);
    await page.goto(`${AR_001_PREFIX}/student/solo-games/memory`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("button", { name: /^سهل$/ })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: /^متوسط$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^صعب$/ })).toBeVisible();
    const start = page.getByRole("button", { name: /ابدأ|بدء|تشغيل|Start|Play/i }).first();
    await expect(start).toBeVisible({ timeout: 30_000 });
    await start.click({ force: true });
    await expect(page.getByTestId("memory-gameplay")).toBeVisible({ timeout: 30_000 });
    await auditReadySurface(page);
  });
});
