/**
 * Runtime crawl — ar-001 public homepage must render Arabic chrome with zero forbidden English leaks
 * in the sections fixed in the ar-001 runtime audit (SEO entry, footer legal link, document meta).
 *
 * Run:
 *   PLAYWRIGHT_USE_START=1 npx playwright test tests/e2e/ar-001-public-homepage-runtime.spec.ts --project=chromium
 */
import { test, expect } from "@playwright/test";

const FORBIDDEN_SNIPPETS = [
  "Practice areas and parent guides",
  "Want to explore Leo Kids practice areas?",
  "Terms, privacy & accessibility",
  "Parent login / sign up",
  "Explore the parent portal",
  "Math",
  "Geometry",
  "Digital practice",
  "Home practice routine",
];

test.describe("ar-001 public homepage runtime", () => {
  test("renders Arabic homepage chrome without known English leftovers", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/ar-001/");

    await expect(page.locator("html")).toHaveAttribute("lang", "ar-001");
    await expect(page.locator('[data-testid="home-page"]')).toHaveAttribute("dir", "rtl");

    const seoSection = page.locator('[data-testid="public-seo-entry-section"]');
    await expect(seoSection).toBeVisible();
    const seoText = await seoSection.innerText();
    for (const snippet of FORBIDDEN_SNIPPETS) {
      expect(seoText, `seo section contains forbidden English: ${snippet}`).not.toContain(snippet);
    }
    expect(seoText).toMatch(/[\u0600-\u06FF]/);

    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible({ timeout: 15_000 });
    const footerText = await footer.innerText();
    expect(footerText).not.toContain("Terms, privacy & accessibility");
    expect(footerText).toMatch(/[\u0600-\u06FF]/);

    const title = await page.title();
    expect(title).toMatch(/[\u0600-\u06FF]|ليو|Leo/i);
    expect(title).not.toBe("Leo Kids — Practice for elementary learners");

    const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
    expect(metaDescription || "").toMatch(/[\u0600-\u06FF]/);
  });
});
