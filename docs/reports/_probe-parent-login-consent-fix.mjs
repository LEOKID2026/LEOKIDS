import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3001";

async function tryLogin(label, prefix) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    locale: label,
    extraHTTPHeaders: { "Accept-Language": `${label},en;q=0.4` },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: label, url: BASE }]);
  await ctx.addInitScript(() => {
    localStorage.setItem(
      "leokids_consent_v1",
      JSON.stringify({
        version: 1,
        choice: "accepted",
        ads: true,
        analytics: true,
        decidedAt: new Date().toISOString(),
        source: "banner",
      })
    );
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}${prefix}/parent/login`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.getByTestId("parent-login-identifier").fill("eran1@leokids.com");
  await page.locator('input[type="password"]').fill("747975");
  await page.locator("form").first().evaluate((form) => {
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  try {
    await page.waitForURL(/\/parent\/(?!login)/, { timeout: 60000 });
  } catch {
    await page.waitForTimeout(8000);
  }
  console.log(JSON.stringify({ label, url: page.url(), ok: !/parent\/login/.test(page.url()) }));
  await browser.close();
}

await tryLogin("es-419", "/es-419");
await tryLogin("pt-PT", "/pt");
await tryLogin("fr-FR", "/fr");
