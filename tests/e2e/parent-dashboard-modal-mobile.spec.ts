import { test, expect, devices } from "@playwright/test";

const email = process.env.E2E_PARENT_EMAIL || "";
const password = process.env.E2E_PARENT_PASSWORD || "";

test.use({
  ...devices["iPhone 13"],
});

test.describe("Parent dashboard modals - mobile input stability", () => {
  test.skip(!email || !password, "Set E2E_PARENT_EMAIL + E2E_PARENT_PASSWORD");

  async function loginParent(page: import("@playwright/test").Page) {
    await page.goto("/parent/login");
    await page.getByPlaceholder("      ").fill(email);
    await page.getByPlaceholder("    ").fill(password);
    await page.locator("form").getByRole("button", { name: "" }).click();
    await page.waitForURL("**/parent/dashboard", { timeout: 20_000 });
    const policyApprove = page.getByRole("button", { name: " " });
    if (await policyApprove.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await page.getByRole("checkbox").check({ force: true });
      await policyApprove.click();
      await expect(page.getByRole("heading", { name: " " })).toBeVisible({
        timeout: 15_000,
      });
    }
  }

  test("add-child modal keeps focus while typing name", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await loginParent(page);
    await page.getByRole("button", { name: " " }).click();
    const nameInput = page.getByPlaceholder(" ");
    await expect(nameInput).toBeVisible();
    await nameInput.click();
    await nameInput.fill(" ");

    await expect(nameInput).toBeFocused();
    await expect(nameInput).toHaveValue(" ");
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("details modal keeps focus while typing PIN", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await loginParent(page);
    const detailsBtn = page.getByRole("button", { name: "" }).first();
    if ((await detailsBtn.count()) === 0) return;

    await detailsBtn.click();
    const pinInput = page.getByPlaceholder("4 ").first();
    await expect(pinInput).toBeVisible({ timeout: 10_000 });
    await pinInput.click();
    await pinInput.pressSequentially("1234", { delay: 80 });

    await expect(pinInput).toBeFocused();
    await expect(pinInput).toHaveValue("1234");
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(errors).toEqual([]);
  });
});
