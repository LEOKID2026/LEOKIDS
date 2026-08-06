#!/usr/bin/env node
/**
 * Full EN SoT role crawl after QA account provision.
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
const OUT = "docs/reports/en-sot-qa-roles-crawl.json";

async function accept(page) {
  const b = page.getByRole("button", { name: /^(Accept|accept|Agree)$/i });
  if (await b.isVisible({ timeout: 1200 }).catch(() => false)) await b.click().catch(() => {});
}

async function harvest(page) {
  await page.waitForTimeout(1200);
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

async function teacherUiLogin(page, email, password) {
  try {
    await page.goto(`${BASE}/teacher/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await accept(page);
    await page.keyboard.press("Escape").catch(() => {});
    // Wait until session check finishes and login form is ready.
    await page
      .locator('[data-testid="teacher-login-root"][data-state="ready"]')
      .waitFor({ timeout: 60000 });
    await accept(page);
    await page.getByTestId("teacher-login-tab").click().catch(() => {});
    const emailInput = page
      .locator(
        '[data-testid="teacher-login-root"][data-state="ready"] input[name="email"], [data-testid="teacher-login-root"][data-state="ready"] input[type="email"]'
      )
      .first();
    await emailInput.waitFor({ state: "attached", timeout: 20000 });
    await emailInput.fill(email, { force: true });
    await page.getByTestId("teacher-login-password").fill(password, { force: true });
    await page
      .locator('[data-testid="teacher-login-root"] form button[type="submit"]')
      .click({ force: true });
    try {
      await page.waitForURL(/\/(teacher|school)\/(?!login)/, { timeout: 60000 });
    } catch {
      await page.waitForTimeout(8000);
    }
    return !/teacher\/login/.test(page.url());
  } catch (err) {
    console.error("teacherUiLogin error:", err?.message || err);
    return false;
  }
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

// Parent
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
    reason = uiOk ? "ok" : `still on ${page.url()}`;
  }
  const rows = uiOk
    ? await crawlRoutes(page, "parent", [
        "/parent/dashboard",
        "/parent/worksheets",
        "/learning/parent-report",
      ])
    : [];
  const apis = tok.ok
    ? [
        await apiCheck("/api/parent/list-students", tok.token),
        await apiCheck("/api/parent/me", tok.token).catch(async () =>
          apiCheck("/api/parent/list-students", tok.token)
        ),
      ]
    : [];
  report.roles.parent = { email, uiOk, supabaseOk: tok.ok, reason };
  report.rows.push(...rows);
  report.apis.push(...apis.map((a) => ({ role: "parent", ...a })));
  await ctx.close();
}

// Student
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
    ? await crawlRoutes(page, "student", [
        "/student/home",
        "/student/cards",
        "/student/profile",
      ])
    : [];
  report.roles.student = {
    username,
    uiOk,
    apiOk,
    reason: uiOk ? "ok" : `apiStatus=${loginApi.status} url=${page.url()}`,
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

// Teacher
{
  const email = ENV.TEACHER_PORTAL_VERIFY_EMAIL;
  const password = ENV.TEACHER_PORTAL_VERIFY_PASSWORD;
  const tok = await supabaseToken(email, password);
  const ctx = await browser.newContext({
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  let uiOk = false;
  let reason = "";
  let classId = null;
  if (!tok.ok) {
    reason = `supabase: ${tok.reason}`;
  } else {
    uiOk = await teacherUiLogin(page, email, password);
    reason = uiOk ? "ok" : `still on ${page.url()}`;
    const classes = await apiCheck("/api/teacher/classes", tok.token);
    report.apis.push({ role: "teacher", ...classes });
    try {
      const j = JSON.parse(
        await (
          await fetch(`${BASE}/api/teacher/classes`, {
            headers: { Authorization: `Bearer ${tok.token}` },
          })
        ).text()
      );
      classId = j?.data?.classes?.[0]?.classId || null;
    } catch {
      /* ignore */
    }
    report.apis.push({ role: "teacher", ...(await apiCheck("/api/teacher/me", tok.token)) });
    report.apis.push({
      role: "teacher",
      ...(await apiCheck("/api/teacher/dashboard", tok.token)),
    });
    if (classId) {
      report.apis.push({
        role: "teacher",
        ...(await apiCheck(
          `/api/teacher/classes/${classId}/report-data?from=2026-07-07&to=2026-08-06`,
          tok.token
        )),
      });
    }
  }
  const routes = ["/teacher/dashboard"];
  if (classId) routes.push(`/teacher/class/${classId}`);
  const rows = uiOk ? await crawlRoutes(page, "teacher", routes) : [];
  // preferredLanguage check
  let preferredLanguage = null;
  let displayName = null;
  if (tok.ok) {
    try {
      const me = await (
        await fetch(`${BASE}/api/teacher/me`, {
          headers: { Authorization: `Bearer ${tok.token}` },
        })
      ).json();
      const t = me?.data?.teacher || me?.teacher;
      preferredLanguage = t?.preferredLanguage || null;
      displayName = t?.displayName || null;
    } catch {
      preferredLanguage = null;
      displayName = null;
    }
  }
  report.roles.teacher = {
    email,
    uiOk,
    supabaseOk: tok.ok,
    reason,
    classId,
    preferredLanguage,
    displayName,
  };
  report.rows.push(...rows);
  await ctx.close();
}

// School manager (email/password via teacher login → school dashboard)
{
  const email = ENV.E2E_SCHOOL_EMAIL || ENV.SCHOOL_QA_EMAIL;
  const password = ENV.E2E_SCHOOL_PASSWORD || ENV.SCHOOL_QA_PASSWORD;
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
    uiOk = await teacherUiLogin(page, email, password);
    // expect school dashboard
    if (uiOk && !/school\//.test(page.url())) {
      await page.goto(`${BASE}/school/dashboard`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await page.waitForTimeout(2000);
    }
    uiOk = uiOk && !/teacher\/login/.test(page.url());
    reason = uiOk ? `ok landed ${page.url()}` : `failed ${page.url()}`;
    report.apis.push({
      role: "school",
      ...(await apiCheck("/api/school/dashboard", tok.token)),
    });
    report.apis.push({
      role: "school",
      ...(await apiCheck("/api/teacher/me", tok.token)),
    });
  }
  const rows = uiOk
    ? await crawlRoutes(page, "school", [
        "/school/dashboard",
        "/school/students",
        "/school/teachers",
      ])
    : [];

  // Also try staff code login page (separate context)
  let staffOk = false;
  let staffReason = "";
  const staffCode = ENV.E2E_SCHOOL_STAFF_CODE;
  const staffPin = ENV.E2E_SCHOOL_STAFF_PIN;
  if (staffCode && staffPin) {
    const sctx = await browser.newContext({ locale: "en-US" });
    await sctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
    const sp = await sctx.newPage();
    await sp.goto(`${BASE}/school/staff/login`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await accept(sp);
    const codeInput = sp.locator('input').first();
    const pinInput = sp.locator('input[type="password"], input').nth(1);
    await codeInput.fill(staffCode);
    await pinInput.fill(staffPin);
    await sp.locator('button[type="submit"]').first().click();
    try {
      await sp.waitForURL((u) => !/staff\/login/.test(u.pathname), { timeout: 45000 });
    } catch {
      await sp.waitForTimeout(6000);
    }
    staffOk = !/staff\/login/.test(sp.url());
    staffReason = staffOk ? `ok ${sp.url()}` : `still ${sp.url()}`;
    if (staffOk) {
      const staffHarvest = await harvest(sp);
      report.rows.push({
        role: "school-staff",
        route: "/school/staff/login→session",
        ...staffHarvest,
      });
    }
    await sctx.close();
  }

  report.roles.school = {
    email,
    uiOk,
    supabaseOk: tok.ok,
    reason,
    staffLoginOk: staffOk,
    staffReason,
  };
  report.rows.push(...rows);
  await ctx.close();
}

await browser.close();

const hebrewRows = report.rows.filter((r) => r.hebrew);
const hebrewApis = report.apis.filter((a) => a.hebrew);
const allRolesOk =
  report.roles.parent?.uiOk &&
  report.roles.student?.uiOk &&
  report.roles.teacher?.uiOk &&
  report.roles.school?.uiOk;

report.summary = {
  allRolesOk,
  hebrewRoutes: hebrewRows.length,
  hebrewApis: hebrewApis.length,
  teacherPreferredLanguage: report.roles.teacher?.preferredLanguage,
  teacherDisplayName: report.roles.teacher?.displayName,
  roles: Object.fromEntries(
    Object.entries(report.roles).map(([k, v]) => [
      k,
      { uiOk: v.uiOk, reason: v.reason, staffLoginOk: v.staffLoginOk },
    ])
  ),
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));

if (hebrewRows.length || hebrewApis.length) process.exit(1);
if (!allRolesOk) process.exit(2);
process.exit(0);
