#!/usr/bin/env node
/**
 * Parent + Student EN SoT crawl (avoid /learning/math-master — crashes Next SSR).
 */
import { chromium } from "playwright";
import fs from "node:fs";

function load(rel) {
  const o = {};
  if (!fs.existsSync(rel)) return o;
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
const OUT = "docs/reports/en-sot-qa-parent-student-crawl.json";

async function accept(page) {
  const b = page.getByRole("button", { name: /^(Accept|accept|Agree)$/i });
  if (await b.isVisible({ timeout: 1200 }).catch(() => false)) await b.click().catch(() => {});
}

async function harvest(page) {
  await page.waitForTimeout(1500);
  const body = await page.locator("body").innerText().catch(() => "");
  const html = await page.content().catch(() => "");
  const title = await page.title().catch(() => "");
  const meta =
    (await page.locator('meta[name="description"]').getAttribute("content").catch(() => "")) ||
    "";
  const blob = `${title}\n${meta}\n${body}`;
  return {
    hebrew: HE.test(blob) || HE.test(html),
    samples: (blob.match(/[\u0590-\u05FF][^\n]{0,60}/g) || []).slice(0, 8),
    url: page.url(),
    title,
  };
}

async function supabaseToken(email, password) {
  const res = await fetch(
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
  const json = await res.json().catch(() => ({}));
  return {
    ok: Boolean(json.access_token),
    token: json.access_token || null,
    reason: json.error_description || json.msg || json.error || `status ${res.status}`,
  };
}

async function apiCheck(pathname, token) {
  const res = await fetch(`${BASE}${pathname}`, {
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
      "Accept-Language": "en-US",
    },
  });
  const text = await res.text();
  return {
    path: pathname,
    status: res.status,
    hebrew: HE.test(text),
    samples: (text.match(/[\u0590-\u05FF][^\n"]{0,40}/g) || []).slice(0, 5),
  };
}

async function parentUiLogin(page, email, password) {
  await page.goto(`${BASE}/parent/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await accept(page);
  await page.keyboard.press("Escape").catch(() => {});
  const id = page.getByTestId("parent-login-identifier");
  await id.waitFor({ timeout: 30000 });
  await id.fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByTestId("parent-login-submit").click();
  try {
    await page.waitForURL(/\/parent\/(?!login)/, { timeout: 60000 });
  } catch {
    await page.waitForTimeout(8000);
  }
  return !/parent\/login/.test(page.url());
}

async function studentUiLogin(page, username, pin) {
  await page.goto(`${BASE}/student/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await accept(page);
  await page.waitForSelector('[data-testid="student-login-username"]', { timeout: 30000 });
  await page.getByTestId("student-login-username").fill(username);
  await page.getByTestId("student-login-pin").fill(pin);
  await page.getByTestId("student-login-submit").click();
  try {
    await page.waitForURL(/\/student\/(?!login)/, { timeout: 60000 });
  } catch {
    await page.waitForTimeout(8000);
  }
  return !/student\/login/.test(page.url());
}

async function crawlRoutes(page, role, routes) {
  const rows = [];
  for (const route of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(1500);
    await page.waitForLoadState("networkidle").catch(() => {});
    const h = await harvest(page);
    rows.push({ role, route, ...h });
    console.log(`${h.hebrew ? "HE" : "OK"} [${role}] ${route} → ${h.url.replace(BASE, "")}`);
  }
  return rows;
}

const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  roles: {},
  rows: [],
  apis: [],
};

{
  const email = ENV.E2E_PARENT_EMAIL;
  const password = ENV.E2E_PARENT_PASSWORD;
  const tok = await supabaseToken(email, password);
  const ctx = await browser.newContext({
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  let uiOk = false;
  let reason = "";
  if (!tok.ok) {
    reason = `supabase: ${tok.reason}`;
  } else {
    uiOk = await parentUiLogin(page, email, password);
    reason = uiOk ? `ok ${page.url()}` : `still on ${page.url()}`;
  }
  const rows = uiOk
    ? await crawlRoutes(page, "parent", [
        "/parent/dashboard",
        "/parent/worksheets",
        "/learning/parent-report",
      ])
    : [];
  const apis = tok.ok
    ? [await apiCheck("/api/parent/list-students", tok.token)]
    : [];
  report.roles.parent = { email, uiOk, supabaseOk: tok.ok, reason };
  report.rows.push(...rows);
  report.apis.push(...apis.map((a) => ({ role: "parent", ...a })));
  await ctx.close();
}

{
  const username = ENV.E2E_STUDENT_USERNAME;
  const pin = ENV.E2E_STUDENT_PIN;
  const ctx = await browser.newContext({
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  const loginApi = await fetch(`${BASE}/api/student/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: BASE,
      Referer: `${BASE}/student/login`,
    },
    body: JSON.stringify({ username, pin }),
  });
  const loginBody = await loginApi.text();
  const apiOk = loginApi.status === 200 && !HE.test(loginBody);
  const uiOk = await studentUiLogin(page, username, pin);
  const rows = uiOk
    ? await crawlRoutes(page, "student", ["/student/home", "/student/cards", "/student/profile"])
    : [];
  if (uiOk) {
    try {
      const meRes = await fetch(`${BASE}/api/student/me`, {
        headers: {
          Accept: "application/json",
          Cookie: (await ctx.cookies()).map((c) => `${c.name}=${c.value}`).join("; "),
        },
      });
      const meText = await meRes.text();
      report.apis.push({
        role: "student",
        path: "/api/student/me",
        status: meRes.status,
        hebrew: HE.test(meText),
        samples: (meText.match(/[\u0590-\u05FF][^\n"]{0,40}/g) || []).slice(0, 5),
      });
    } catch (err) {
      report.apis.push({
        role: "student",
        path: "/api/student/me",
        status: 0,
        hebrew: false,
        samples: [String(err?.message || err).slice(0, 80)],
      });
    }
  }
  report.roles.student = {
    username,
    pin,
    uiOk,
    apiOk,
    reason: uiOk ? `ok ${page.url()}` : `apiStatus=${loginApi.status} url=${page.url()}`,
    apiHebrew: HE.test(loginBody),
  };
  report.rows.push(...rows);
  report.apis.push({
    role: "student",
    path: "/api/student/login",
    status: loginApi.status,
    hebrew: HE.test(loginBody),
    samples: [],
  });
  await ctx.close();
}

await browser.close();

const hebrewRows = report.rows.filter((r) => r.hebrew);
const hebrewApis = report.apis.filter((a) => a.hebrew);
report.summary = {
  allRolesOk: report.roles.parent?.uiOk && report.roles.student?.uiOk,
  hebrewRoutes: hebrewRows.length,
  hebrewApis: hebrewApis.length,
  roles: Object.fromEntries(
    Object.entries(report.roles).map(([k, v]) => [k, { uiOk: v.uiOk, reason: v.reason }])
  ),
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
if (hebrewRows.length || hebrewApis.length) process.exit(1);
if (!report.summary.allRolesOk) process.exit(2);
process.exit(0);
