import { test, expect, type Page } from "@playwright/test";

const PARENT_DEMO_SESSION_KEY = "leokids_global_parent_demo_session";
const DEMO_CHILD_ID = "demo-parent-child-noam-g2";

function trackParentDemoNetwork(page: Page) {
  const nonDemoParentApi: string[] = [];
  const supabaseAuth: string[] = [];
  const writes: string[] = [];

  page.on("request", (req) => {
    const url = req.url();
    const method = req.method();
    const path = new URL(url).pathname;

    if (path.startsWith("/api/parent/") && !path.startsWith("/api/demo/parent/")) {
      nonDemoParentApi.push(`${method} ${path}`);
    }
    if (/supabase\.co/.test(url) && /auth/.test(url)) {
      supabaseAuth.push(`${method} ${url}`);
    }
    if (
      method !== "GET" &&
      method !== "HEAD" &&
      method !== "OPTIONS" &&
      !path.startsWith("/api/demo/parent/copilot-turn")
    ) {
      if (path.startsWith("/api/parent/") || path.startsWith("/api/demo/parent/")) {
        if (method !== "GET" && method !== "HEAD") {
          writes.push(`${method} ${path}`);
        }
      }
    }
  });

  return { nonDemoParentApi, supabaseAuth, writes };
}

async function enterParentDemoFromHome(page: Page) {
  await page.goto("/demo/parent/enter", { waitUntil: "domcontentloaded" });
  await page.evaluate((key) => localStorage.removeItem(key), PARENT_DEMO_SESSION_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByTestId("parent-demo-enter-button").click();
  await page.waitForURL("**/parent/dashboard**", { timeout: 30_000 });
  await expect(page.getByTestId("parent-demo-mode-bar")).toBeVisible({ timeout: 30_000 });
}

test.describe("parent portal public demo @parent-portal-demo", () => {
  test("enter from public button → dashboard with 3 children", async ({ page }) => {
    const net = trackParentDemoNetwork(page);
    await enterParentDemoFromHome(page);
    await expect(page.getByRole("heading", { name: "" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "" })).toBeVisible();
    expect(net.supabaseAuth, "no Supabase auth in demo").toHaveLength(0);
  });

  test("open report, change date range, ask Copilot — Hebrew response", async ({ page }) => {
    const net = trackParentDemoNetwork(page);
    await enterParentDemoFromHome(page);

    await page.goto(
      `/parent/parent-report?studentId=${encodeURIComponent(DEMO_CHILD_ID)}&source=parent`,
      { waitUntil: "domcontentloaded" },
    );

    await expect(page.getByTestId("report-date-range-control")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("report-range-preset-month").click({ force: true });
    await expect(page.locator("table.parent-report-subject-table").first()).toBeVisible({
      timeout: 30_000,
    });

    const copilotInput = page.getByPlaceholder("  …");
    await expect(copilotInput).toBeVisible({ timeout: 30_000 });
    await copilotInput.fill("     ?");
    const copilotResponse = page.waitForResponse(
      (res) => res.request().method() === "POST" && /copilot-turn/.test(res.url()),
    );
    await copilotInput.press("Enter");
    const response = await copilotResponse;
    expect(response.status()).toBe(200);
    await expect(
      page.getByText("      "),
    ).toBeVisible({ timeout: 30_000 });

    expect(net.nonDemoParentApi, "no /api/parent/* (non-demo) calls").toHaveLength(0);
    expect(net.supabaseAuth, "no Supabase auth").toHaveLength(0);
  });

  test("attempt add child — demo readonly message, still 3 children", async ({ page }) => {
    const net = trackParentDemoNetwork(page);
    await enterParentDemoFromHome(page);

    await page.getByRole("button", { name: " " }).click();
    await page.getByPlaceholder(" ").fill(" ");
    await page.locator("select").first().selectOption({ index: 1 });
    await page.getByRole("button", { name: " " }).click();

    await expect(
      page.getByText("  -  .    ."),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("heading", { name: "" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "" })).toBeVisible();

    const blockedWrites = net.writes.filter(
      (w) => !w.includes("/api/demo/parent/copilot-turn"),
    );
    expect(blockedWrites, "no successful parent write APIs").toHaveLength(0);
  });

  test("worksheets entry opens public generator anchor and keeps parent demo", async ({ page }) => {
    await enterParentDemoFromHome(page);
    await page.getByTestId("parent-demo-worksheets-entry").click();
    await page.waitForURL(/\/practice\/worksheets/, {
      timeout: 20_000,
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByTestId("parent-demo-mode-bar")).toBeVisible();
    await expect(page.getByTestId("public-seo-worksheets-slot")).toBeVisible({ timeout: 15_000 });
    await page.getByTestId("seo-nav-back-history").click();
    await page.waitForURL("**/parent/dashboard**", { timeout: 20_000 });
    await expect(page.getByTestId("parent-demo-mode-bar")).toBeVisible();
  });

  test("short report shows non-zero learning time when activity exists", async ({ page }) => {
    await enterParentDemoFromHome(page);
    await page.goto(
      `/parent/parent-report?studentId=${encodeURIComponent(DEMO_CHILD_ID)}&source=parent&period=week`,
      { waitUntil: "domcontentloaded" },
    );
    await expect(page.locator("table.parent-report-subject-table").first()).toBeVisible({
      timeout: 30_000,
    });
    const timeCard = page
      .locator(".parent-report-print-summary-card")
      .filter({ hasText: " " });
    await expect(timeCard).toBeVisible();
    await expect(timeCard).not.toHaveText(/^0\s*/);
  });

  test("detailed report loads in demo without real parent login", async ({ page }) => {
    const net = trackParentDemoNetwork(page);
    await enterParentDemoFromHome(page);
    await page.goto(
      `/parent/parent-report-detailed?period=week&studentId=${encodeURIComponent(DEMO_CHILD_ID)}&source=parent`,
      { waitUntil: "domcontentloaded" },
    );
    await expect(page.getByText("  ")).toHaveCount(0);
    await expect(page.getByText(" ").first()).toBeVisible({ timeout: 30_000 });
    expect(net.supabaseAuth, "no Supabase auth in demo detailed report").toHaveLength(0);
  });
});
