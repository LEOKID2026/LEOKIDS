import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3001";

async function dismiss(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll(
      '[aria-labelledby="cookie-consent-title"], aside[role="dialog"]'
    )) {
      const btn = el.querySelector("button");
      if (btn) btn.click();
      el.remove();
    }
  }).catch(() => {});
  await page.waitForTimeout(400);
}

async function tryLogin(label, prefix) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    locale: label,
    extraHTTPHeaders: { "Accept-Language": `${label},en;q=0.4` },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: label, url: BASE }]);
  const page = await ctx.newPage();
  await page.goto(`${BASE}${prefix}/parent/login`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await dismiss(page);
  await page.getByTestId("parent-login-identifier").fill("eran1@leokids.com");
  await page.locator('input[type="password"]').fill("747975");
  await dismiss(page);
  await page.getByTestId("parent-login-submit").click({ force: true });
  try {
    await page.waitForURL(/\/parent\/(?!login)/, { timeout: 45000 });
  } catch {
    await page.waitForTimeout(5000);
  }
  const alert = await page.locator('[role="alert"]').innerText().catch(() => "");
  console.log(
    JSON.stringify({
      label,
      url: page.url(),
      ok: !/parent\/login/.test(page.url()),
      alert: alert.slice(0, 200),
    })
  );
  await browser.close();
}

await tryLogin("es-419", "/es-419");
await tryLogin("pt-PT", "/pt");
