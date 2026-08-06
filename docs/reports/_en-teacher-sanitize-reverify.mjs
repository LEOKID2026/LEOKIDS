#!/usr/bin/env node
/**
 * Post-sanitize teacher EN verification: APIs + UI.
 */
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
const BASE = process.env.BASE_URL || "http://127.0.0.1:3001";
const HE = /[\u0590-\u05FF]/;
const email = ENV.TEACHER_PORTAL_VERIFY_EMAIL || "teacher@leo.com";
const password = ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975";
const OUT = "docs/reports/en-teacher-sanitize-reverify.json";

const tokRes = await fetch(
  `${ENV.NEXT_PUBLIC_LEARNING_SUPABASE_URL}/auth/v1/token?grant_type=password`,
  {
    method: "POST",
    headers: {
      apikey: ENV.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }
);
const tok = await tokRes.json();
if (!tok.access_token) {
  console.error("token fail", tok);
  process.exit(1);
}

const apis = [];
for (const p of ["/api/teacher/me", "/api/teacher/classes", "/api/teacher/dashboard"]) {
  const r = await fetch(`${BASE}${p}`, {
    headers: {
      Authorization: `Bearer ${tok.access_token}`,
      Accept: "application/json",
      "Accept-Language": "en-US",
    },
  });
  const text = await r.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* ignore */
  }
  apis.push({
    path: p,
    status: r.status,
    hebrew: HE.test(text),
    samples: (text.match(/[\u0590-\u05FF][^\n"]{0,50}/g) || []).slice(0, 8),
    preferredLanguage:
      json?.data?.profile?.preferredLanguage ||
      json?.profile?.preferredLanguage ||
      json?.data?.preferredLanguage ||
      null,
    displayName:
      json?.data?.profile?.displayName ||
      json?.profile?.displayName ||
      null,
    classNames: (json?.data?.classes || json?.classes || []).map((c) => c.name),
  });
}

const classId =
  apis.find((a) => a.path === "/api/teacher/classes")?.classNames?.length >= 0
    ? (
        await (async () => {
          const r = await fetch(`${BASE}/api/teacher/classes`, {
            headers: { Authorization: `Bearer ${tok.access_token}` },
          });
          const j = await r.json();
          return j?.data?.classes?.[0]?.classId || j?.classes?.[0]?.classId;
        })()
      )
    : null;

if (classId) {
  const reportPath = `/api/teacher/classes/${classId}/report-data?from=2026-07-07&to=2026-08-05`;
  const r = await fetch(`${BASE}${reportPath}`, {
    headers: {
      Authorization: `Bearer ${tok.access_token}`,
      Accept: "application/json",
    },
  });
  const text = await r.text();
  apis.push({
    path: reportPath,
    status: r.status,
    hebrew: HE.test(text),
    samples: (text.match(/[\u0590-\u05FF][^\n"]{0,50}/g) || []).slice(0, 8),
  });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "en-US",
  extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
});
await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
const page = await context.newPage();
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

async function snap(label) {
  const body = await page.locator("body").innerText();
  const html = await page.content();
  return {
    label,
    url: page.url(),
    hebrewBody: HE.test(body),
    hebrewHtml: HE.test(html),
    samples: (body.match(/[\u0590-\u05FF][^\n]{0,60}/g) || []).slice(0, 10),
  };
}

const ui = [];
ui.push(await snap("dashboard"));
if (classId) {
  await page.goto(`${BASE}/teacher/class/${classId}`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(4000);
  await page.waitForLoadState("networkidle").catch(() => {});
  ui.push(await snap("class"));
}
await browser.close();

const out = {
  generatedAt: new Date().toISOString(),
  apis,
  ui,
  hebrewApis: apis.filter((a) => a.hebrew).length,
  hebrewUi: ui.filter((u) => u.hebrewBody || u.hebrewHtml).length,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
process.exit(out.hebrewApis || out.hebrewUi ? 1 : 0);
