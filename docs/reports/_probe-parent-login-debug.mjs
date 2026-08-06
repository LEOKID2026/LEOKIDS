import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3001";

async function dismiss(page) {
  await page
    .evaluate(() => {
      for (const el of document.querySelectorAll(
        '[aria-labelledby="cookie-consent-title"], aside[role="dialog"]'
      )) {
        const btn = el.querySelector("button");
        if (btn) btn.click();
        el.remove();
      }
    })
    .catch(() => {});
}

async function probe(label, prefix) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    locale: label,
    extraHTTPHeaders: { "Accept-Language": `${label},en;q=0.4` },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: label, url: BASE }]);
  const page = await ctx.newPage();
  const api = [];
  page.on("response", async (res) => {
    const u = res.url();
    if (/\/api\/parent\//.test(u) || /supabase\.co\/auth/.test(u) || /login/.test(u)) {
      let body = "";
      try {
        body = (await res.text()).slice(0, 300);
      } catch {
        /* ignore */
      }
      api.push({ status: res.status(), url: u.replace(BASE, ""), body });
    }
  });
  const consoleMsgs = [];
  page.on("console", (m) => consoleMsgs.push(`${m.type()}: ${m.text()}`.slice(0, 200)));

  await page.goto(`${BASE}${prefix}/parent/login`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await dismiss(page);
  await page.waitForTimeout(1000);
  const state = await page.evaluate(() => ({
    id: !!document.querySelector('[data-testid="parent-login-identifier"]'),
    submit: !!document.querySelector('[data-testid="parent-login-submit"]'),
    disabled: document.querySelector('[data-testid="parent-login-submit"]')?.disabled,
    bodySample: (document.body?.innerText || "").slice(0, 400),
  }));
  await page.getByTestId("parent-login-identifier").fill("eran1@leokids.com");
  await page.locator('input[type="password"]').fill("747975");
  await dismiss(page);
  await page.getByTestId("parent-login-submit").click({ force: true });
  await page.waitForTimeout(10000);
  console.log(
    JSON.stringify(
      {
        label,
        finalUrl: page.url(),
        state,
        api: api.slice(-8),
        console: consoleMsgs.slice(-10),
      },
      null,
      2
    )
  );
  await browser.close();
}

await probe("fr-FR", "/fr");
await probe("es-419", "/es-419");
await probe("pt-PT", "/pt");
