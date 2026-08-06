#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs";

function load(rel) {
  const o = {};
  for (const line of fs.readFileSync(rel, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    o[t.slice(0, i).trim()] = v;
  }
  return o;
}
const ENV = { ...load(".env.local"), ...load(".env.e2e.local"), ...process.env };
const BASE = "http://127.0.0.1:3001";
const HE = /[\u0590-\u05FF]/;
const email = ENV.TEACHER_PORTAL_VERIFY_EMAIL || "teacher@leo.com";
const password = ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "en-US",
  extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
});
await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
const page = await context.newPage();
const apiBodies = [];
page.on("response", async (res) => {
  try {
    if (!res.url().includes("/api/teacher/")) return;
    const text = await res.text();
    if (HE.test(text)) {
      apiBodies.push({
        url: res.url().replace(BASE, ""),
        status: res.status(),
        samples: (text.match(/[\u0590-\u05FF][^\n"]{0,40}/g) || []).slice(0, 5),
      });
    }
  } catch {
    /* ignore */
  }
});

await page.goto(`${BASE}/teacher/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
const accept = page.getByRole("button", { name: /^(Accept|accept|Agree)$/i });
if (await accept.isVisible({ timeout: 1500 }).catch(() => false)) await accept.click();
await page.getByTestId("teacher-login-tab").click().catch(() => {});
await page.getByPlaceholder(" ").fill(email).catch(async () => {
  await page.locator("form input").first().fill(email);
});
await page.locator('input[type="password"]').fill(password);
await page.locator('button[type="submit"]').first().click().catch(async () => {
  await page.locator("form button").last().click();
});
await page.waitForURL(/\/teacher\/dashboard/, { timeout: 45000 });
await page.waitForTimeout(5000);
await page.waitForLoadState("networkidle").catch(() => {});

const bodyText = await page.locator("body").innerText();
const html = await page.content();
const bodyHe = HE.test(bodyText);
const htmlHe = HE.test(html);
const bodySamples = (bodyText.match(/[\u0590-\u05FF][^\n]{0,60}/g) || []).slice(0, 15);
const htmlSamples = (html.match(/[\u0590-\u05FF][^\n<]{0,60}/g) || []).slice(0, 15);

// Try opening class via text containing Grade or any class card
const classId = "eb24c41d-34e6-4bc3-a395-1a7e26db8a36";
await page.goto(`${BASE}/teacher/class/${classId}`, {
  waitUntil: "networkidle",
  timeout: 90000,
}).catch(async () => {
  await page.goto(`${BASE}/teacher/class/${classId}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(4000);
});
const classBody = await page.locator("body").innerText();
const classHtml = await page.content();
const classBodyHe = HE.test(classBody);
const classHtmlHe = HE.test(classHtml);
const classBodySamples = (classBody.match(/[\u0590-\u05FF][^\n]{0,60}/g) || []).slice(0, 15);
const classHtmlSamples = (classHtml.match(/[\u0590-\u05FF][^\n<]{0,60}/g) || []).slice(0, 15);

const out = {
  generatedAt: new Date().toISOString(),
  dashboard: { bodyHe, htmlHe, bodySamples, htmlSamples },
  classPage: {
    classBodyHe,
    classHtmlHe,
    classBodySamples,
    classHtmlSamples,
  },
  apiBodiesSeen: apiBodies,
};
fs.writeFileSync("docs/reports/en-final-teacher-dom-hebrew.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
await browser.close();
process.exit(bodyHe || htmlHe || classBodyHe || classHtmlHe || apiBodies.length ? 1 : 0);
