/**
 * Focused language-switcher HUD check (desktop + mobile screenshots).
 * Not part of the broad e2e suite — run manually:
 *   PLAYWRIGHT_USE_START=1 npx playwright test tests/e2e/language-switcher-hud.spec.ts --project=chromium
 */
import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const outDir = path.join(process.cwd(), "artifacts", "language-switcher-hud");

test.describe("HUD language switcher", () => {
  test.beforeAll(() => {
    fs.mkdirSync(outDir, { recursive: true });
  });

  test("desktop + mobile: switch locale keeps path/query/hash", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/parents?ref=hud#cta");

    const switcher = page.locator('[data-language-switcher="hud"]');
    await expect(switcher).toBeVisible();
    await switcher.getByRole("button", { name: /language|idioma/i }).click();
    await expect(page.getByRole("option", { name: /English/i })).toBeVisible();
    await expect(page.getByRole("option", { name: /Español/i })).toBeVisible();

    await page.screenshot({
      path: path.join(outDir, "hud-desktop.png"),
      clip: { x: 0, y: 0, width: 1280, height: 90 },
    });

    await page.getByRole("option", { name: /Español/i }).click();
    await expect(page).toHaveURL(/\/es-419\/parents\?ref=hud#cta/);

    const cookie = (await page.context().cookies()).find((c) => c.name === "lk_global_locale");
    expect(cookie?.value).toBe("es-419");

    await page.reload();
    await expect(page).toHaveURL(/\/es-419\/parents/);
    await expect(page.locator('[data-language-switcher="hud"]')).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es-419/parents?ref=hud#cta");
    const mobileSwitcher = page.locator('[data-language-switcher="hud"]');
    await expect(mobileSwitcher).toBeVisible();
    await mobileSwitcher.getByRole("button", { name: /idioma|language/i }).click();
    await expect(page.getByRole("option", { name: /English/i })).toBeVisible();

    await page.screenshot({
      path: path.join(outDir, "hud-mobile.png"),
      clip: { x: 0, y: 0, width: 390, height: 120 },
    });

    await page.getByRole("option", { name: /English/i }).click();
    await expect(page).toHaveURL(/http:\/\/[^/]+\/parents\?ref=hud#cta/);

    await page.goto("/admin/schools");
    await expect(page.locator('[data-language-switcher="hud"]')).toHaveCount(0);
  });
});
