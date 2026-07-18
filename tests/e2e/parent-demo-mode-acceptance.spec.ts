import { test, expect } from "@playwright/test";

const DEMO_SESSION_STORAGE_KEY = "leokids_global_demo_session";

async function clearDemoSession(page) {  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate((key) => localStorage.removeItem(key), DEMO_SESSION_STORAGE_KEY);
}

async function enterDemoDirect(page, grade = "g3") {
  await page.goto("/demo/enter", { waitUntil: "domcontentloaded" });
  const idx = { g1: 0, g2: 1, g3: 2, g4: 3, g5: 4, g6: 5 }[grade] ?? 2;
  await page.locator("fieldset button").nth(idx).click();
  await page.getByRole("button", { name: /Enter the kids world|Entering/i }).click();
  await page.waitForURL("**/student/home**", { timeout: 30_000 });
  await expect(page.getByTestId("demo-mode-bar")).toBeVisible({ timeout: 30_000 });
}

test.describe("Parent demo mode — catalog API", () => {
  test("GET /api/demo/catalog returns 200 with expected shape", async ({ request }) => {
    const res = await request.get("/api/demo/catalog?gradeLevel=g3");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.gradeLevel).toBe("g3");
    expect(Array.isArray(json.games)).toBe(true);
    expect(json.games.length).toBeGreaterThan(0);
    expect(Array.isArray(json.subjects)).toBe(true);
    expect(json.subjects.length).toBeGreaterThan(0);
    expect(json.subjectAccess?.subjectPermissions).toBeTruthy();
    expect(json).not.toHaveProperty("studentId");
  });
});

test.describe("Parent demo mode — entry and tour", () => {
  test.beforeEach(async ({ page }) => {
    await clearDemoSession(page);
  });

  test("homepage demo button visible and dismissible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-demo-button")).toHaveCount(1);
    await page.getByTestId("home-demo-button-dismiss").click();
    await expect(page.getByTestId("home-demo-button")).toHaveCount(0);
  });

  test("grade pick enters student home without /api/student/me", async ({ page }) => {
    const meCalls = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/student/me")) meCalls.push(req.url());
    });
    await enterDemoDirect(page, "g3");
    await page.waitForTimeout(1500);
    expect(meCalls).toHaveLength(0);
  });

  test("online game direct URL shows block screen", async ({ page }) => {
    await enterDemoDirect(page, "g3");
    await page.goto("/student/games/chess", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("demo-online-game-unavailable")).toBeVisible({ timeout: 20_000 });
  });
});

test.describe("Parent demo mode — regression", () => {
  test("guest start works without demo bar", async ({ page }) => {
    await clearDemoSession(page);
    await page.goto("/student/login", { waitUntil: "domcontentloaded" });
    await page.getByTestId("student-guest-start").click();
    await page.waitForURL("**/student/home**", { timeout: 30_000 });
    await expect(page.getByTestId("demo-mode-bar")).toHaveCount(0);
  });
});
