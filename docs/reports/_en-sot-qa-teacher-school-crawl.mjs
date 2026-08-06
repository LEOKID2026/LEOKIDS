#!/usr/bin/env node
/**
 * Teacher + School EN SoT crawl (run on a fresh Next server; avoid student learning routes first).
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
const OUT = "docs/reports/en-sot-qa-teacher-school-crawl.json";

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

async function teacherUiLogin(page, email, password) {
  await page.goto(`${BASE}/teacher/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await accept(page);
  await page.keyboard.press("Escape").catch(() => {});
  await page
    .locator('[data-testid="teacher-login-root"][data-state="ready"]')
    .waitFor({ timeout: 60000 });
  await accept(page);
  await page.getByTestId("teacher-login-tab").click().catch(() => {});
  const emailInput = page
    .locator('[data-testid="teacher-login-root"][data-state="ready"] input[name="email"]')
    .first();
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

// Teacher first
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
  let preferredLanguage = null;
  let displayName = null;
  if (!tok.ok) {
    reason = `supabase: ${tok.reason}`;
  } else {
    uiOk = await teacherUiLogin(page, email, password);
    reason = uiOk ? `ok ${page.url()}` : `still on ${page.url()}`;
    report.apis.push({ role: "teacher", ...(await apiCheck("/api/teacher/classes", tok.token)) });
    report.apis.push({ role: "teacher", ...(await apiCheck("/api/teacher/me", tok.token)) });
    report.apis.push({
      role: "teacher",
      ...(await apiCheck("/api/teacher/dashboard", tok.token)),
    });
    try {
      const classesText = await (
        await fetch(`${BASE}/api/teacher/classes`, {
          headers: { Authorization: `Bearer ${tok.token}` },
        })
      ).text();
      const j = JSON.parse(classesText);
      classId = j?.data?.classes?.[0]?.classId || null;
    } catch {
      /* ignore */
    }
    if (classId) {
      report.apis.push({
        role: "teacher",
        ...(await apiCheck(
          `/api/teacher/classes/${classId}/report-data?from=2026-07-07&to=2026-08-06`,
          tok.token
        )),
      });
    }
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
      /* ignore */
    }
  }
  const routes = ["/teacher/dashboard"];
  if (classId) routes.push(`/teacher/class/${classId}`);
  const rows = uiOk ? await crawlRoutes(page, "teacher", routes) : [];
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

// School manager
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
      ...(await apiCheck("/api/school/me", tok.token)),
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
    await sp.locator("input").first().fill(staffCode);
    await sp.locator('input[type="password"], input').nth(1).fill(staffPin);
    await sp.locator('button[type="submit"]').first().click();
    try {
      await sp.waitForURL((u) => !/staff\/login/.test(u.pathname), { timeout: 45000 });
    } catch {
      await sp.waitForTimeout(6000);
    }
    staffOk = !/staff\/login/.test(sp.url());
    staffReason = staffOk ? `ok ${sp.url()}` : `still ${sp.url()}`;
    if (staffOk) {
      report.rows.push({
        role: "school-staff",
        route: "/school/staff/login→session",
        ...(await harvest(sp)),
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
report.summary = {
  allRolesOk: report.roles.teacher?.uiOk && report.roles.school?.uiOk,
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
if (!report.summary.allRolesOk) process.exit(2);
process.exit(0);
