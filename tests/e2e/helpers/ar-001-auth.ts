/**
 * Auth helpers for ar-001 deep portal audits.
 * Uses documented demo-school credentials (seed password) or env overrides.
 * Does not change production auth.
 */
import { type Page, expect } from "@playwright/test";
import { AR_001_PREFIX } from "./ar-001-english-audit";

/** Documented demo-school password from FULL_SCHOOL_SIMULATION_PLAN.md — not a production secret. */
const DEMO_SCHOOL_DOCUMENTED_PASSWORD = "leo7479";

export function resolveDemoSchoolPassword(): string {
  return (
    process.env.SCHOOL_QA_PASSWORD ||
    process.env.DEMO_TEACHER_PASSWORD ||
    process.env.SCHOOL_SECURITY_TEST_PASSWORD ||
    DEMO_SCHOOL_DOCUMENTED_PASSWORD
  );
}

export function resolvePrivateTeacherPassword(): string {
  return (
    process.env.TEACHER_PORTAL_VERIFY_PASSWORD ||
    process.env.SCHOOL_QA_PASSWORD ||
    process.env.DEMO_TEACHER_PASSWORD ||
    DEMO_SCHOOL_DOCUMENTED_PASSWORD
  );
}

async function dismissCookieBanner(page: Page) {
  const accept = page.getByRole("button", { name: /^(يقبل|Accept|accept)$/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click().catch(() => {});
  }
}

/**
 * Login via /teacher/login (email+password) — works for teachers and school managers.
 */
export async function loginTeacherPortal(
  page: Page,
  email: string,
  password = resolveDemoSchoolPassword()
) {
  await page.goto(`${AR_001_PREFIX}/teacher/login`, { waitUntil: "domcontentloaded" });
  await dismissCookieBanner(page);
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  await expect(emailInput).toBeVisible({ timeout: 20_000 });
  await emailInput.fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('[data-testid="teacher-login-root"] form button[type="submit"]').click();
}

export async function loginTeacherDan(page: Page) {
  await loginTeacherPortal(page, "dan@leo-k.com");
  await page.waitForURL(/\/(teacher\/dashboard|school\/dashboard)/, { timeout: 45_000 });
}

export async function loginSchoolManager(page: Page) {
  await loginTeacherPortal(page, "school@leo-k.com");
  await page.waitForURL(/\/school\/dashboard/, { timeout: 45_000 });
}

/**
 * Resolve a real teacher classId from the authenticated session fixture.
 * Hard-fails when the API does not return a class — never invents routes/IDs.
 */
export async function resolveTeacherClassId(page: Page): Promise<string> {
  const res = await page.request.get("/api/teacher/classes");
  expect(res.ok(), `teacher classes HTTP ${res.status()}`).toBeTruthy();
  const body = await res.json();
  const classId = body?.data?.classes?.[0]?.classId || body?.data?.classes?.[0]?.id;
  expect(classId, "teacher fixture must expose a real classId").toBeTruthy();
  return String(classId);
}
