#!/usr/bin/env node
import fs from "node:fs";
import { chromium } from "playwright";

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
const BASE = "http://127.0.0.1:3001";
const HE = /[\u0590-\u05FF]/;
const OUT = "docs/reports/en-post-fix-roles-crawl.json";

async function accept(page) {
  const b = page.getByRole("button", { name: /^(Accept|accept|Agree)$/i });
  if (await b.isVisible({ timeout: 1200 }).catch(() => false)) await b.click().catch(() => {});
}

async function harvest(page) {
  const body = await page.locator("body").innerText().catch(() => "");
  const html = await page.content().catch(() => "");
  return {
    hebrewBody: HE.test(body),
    hebrewHtml: HE.test(html),
    samples: (body.match(/[\u0590-\u05FF][^\n]{0,50}/g) || []).slice(0, 8),
    url: page.url(),
  };
}

// Confirm teacher preferredLanguage
const teacherEmail = ENV.TEACHER_PORTAL_VERIFY_EMAIL || "teacher@leo.com";
const teacherPassword = ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975";
const tokRes = await fetch(
  `${ENV.NEXT_PUBLIC_LEARNING_SUPABASE_URL}/auth/v1/token?grant_type=password`,
  {
    method: "POST",
    headers: {
      apikey: ENV.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: teacherEmail, password: teacherPassword }),
  }
);
const tok = await tokRes.json();
const meRes = await fetch(`${BASE}/api/teacher/me`, {
  headers: { Authorization: `Bearer ${tok.access_token}` },
});
const meJson = await meRes.json();
const teacherMe = {
  preferredLanguage:
    meJson?.data?.profile?.preferredLanguage ??
    meJson?.data?.preferredLanguage ??
    meJson?.profile?.preferredLanguage ??
    null,
  displayName:
    meJson?.data?.profile?.displayName ??
    meJson?.profile?.displayName ??
    null,
  hebrew: HE.test(JSON.stringify(meJson)),
  rawProfile: meJson?.data?.profile || meJson?.profile || meJson?.data || null,
};

const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  teacherMe,
  parent: null,
  student: null,
  school: null,
};

// Parent
{
  const ctx = await browser.newContext({ locale: "en-US" });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  const email = ENV.E2E_PARENT_EMAIL || "";
  const password = ENV.E2E_PARENT_PASSWORD || "";
  const result = {
    emailSet: Boolean(email),
    supabaseOk: false,
    uiOk: false,
    reason: "",
    rows: [],
  };
  if (!email || !password) {
    result.reason = "missing E2E_PARENT_EMAIL/PASSWORD";
  } else {
    const pTok = await fetch(
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
    const pJson = await pTok.json();
    result.supabaseOk = Boolean(pJson.access_token);
    if (!result.supabaseOk) {
      result.reason = `supabase: ${pJson.error_description || pJson.msg || pJson.error || pTok.status}`;
    } else {
      await page.goto(`${BASE}/parent/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await accept(page);
      await page.waitForTimeout(1500);
      // dismiss nextjs error overlay if present
      await page.keyboard.press("Escape").catch(() => {});
      const id = page.getByTestId("parent-login-identifier");
      if (!(await id.isVisible({ timeout: 10000 }).catch(() => false))) {
        result.reason = "parent-login-identifier not visible";
      } else {
        await id.fill(email);
        await page.locator('input[type="password"]').fill(password);
        await page.getByTestId("parent-login-submit").click({ force: true }).catch(async () => {
          await page.locator('button[type="submit"]').first().click({ force: true });
        });
        await page.waitForTimeout(4000);
        result.uiOk = !/parent\/login/.test(page.url());
        result.reason = result.uiOk ? "ok" : `still on ${page.url()}`;
        if (result.uiOk) {
          for (const r of [
            "/parent/dashboard",
            "/parent/worksheets",
            "/learning/parent-report",
          ]) {
            await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 90000 });
            await page.waitForTimeout(1500);
            result.rows.push({ route: r, ...(await harvest(page)) });
          }
        }
      }
    }
  }
  report.parent = result;
  await ctx.close();
}

// Student
{
  const ctx = await browser.newContext({ locale: "en-US" });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  const user = ENV.E2E_STUDENT_USERNAME || ENV.ACTIVITY_SIM_STUDENT_USER || "";
  const pin = ENV.E2E_STUDENT_PIN || ENV.ACTIVITY_SIM_STUDENT_PIN || "";
  const result = { userSet: Boolean(user), uiOk: false, reason: "", rows: [] };
  if (!user || !pin) {
    result.reason = "missing E2E_STUDENT_USERNAME/PIN";
  } else {
    await page.goto(`${BASE}/student/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await accept(page);
    await page.waitForSelector('[data-testid="student-login-username"]', { timeout: 30000 }).catch(() => {});
    const u = page.getByTestId("student-login-username");
    if (!(await u.isVisible({ timeout: 8000 }).catch(() => false))) {
      result.reason = "student-login-username not visible (sessionCheck pending?)";
    } else {
      await u.fill(user);
      await page.getByTestId("student-login-pin").fill(pin);
      await page.getByTestId("student-login-submit").click({ force: true });
      await page.waitForTimeout(4000);
      result.uiOk = !/student\/login/.test(page.url());
      result.reason = result.uiOk ? "ok" : `still on ${page.url()}`;
      if (result.uiOk) {
        for (const r of ["/student/home", "/student/cards", "/learning/math-master"]) {
          await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 90000 });
          await page.waitForTimeout(1500);
          result.rows.push({ route: r, ...(await harvest(page)) });
        }
      }
    }
  }
  report.student = result;
  await ctx.close();
}

// School
{
  const ctx = await browser.newContext({ locale: "en-US" });
  await ctx.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await ctx.newPage();
  const email = ENV.E2E_SCHOOL_EMAIL || ENV.SCHOOL_MANAGER_EMAIL || "school@leo-k.com";
  const password =
    ENV.SCHOOL_QA_PASSWORD || ENV.DEMO_TEACHER_PASSWORD || ENV.E2E_SCHOOL_PASSWORD || "";
  const result = {
    email,
    passwordSet: Boolean(password),
    supabaseOk: false,
    uiOk: false,
    reason: "",
    rows: [],
  };
  if (!password) {
    result.reason = "missing SCHOOL_QA_PASSWORD / DEMO_TEACHER_PASSWORD / E2E_SCHOOL_PASSWORD";
  } else {
    const sTok = await fetch(
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
    const sJson = await sTok.json();
    result.supabaseOk = Boolean(sJson.access_token);
    if (!result.supabaseOk) {
      result.reason = `supabase: ${sJson.error_description || sJson.msg || sJson.error || sTok.status}`;
    } else {
      await page.goto(`${BASE}/school/staff/login`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await accept(page);
      await page.waitForTimeout(1000);
      const emailField = page.locator('input[type="email"], input[name="email"], input[type="text"]').first();
      const passField = page.locator('input[type="password"]').first();
      await emailField.fill(email);
      await passField.fill(password);
      await page.locator('button[type="submit"]').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(4000);
      result.uiOk = !/login/.test(page.url());
      result.reason = result.uiOk ? "ok" : `still on ${page.url()}`;
      if (result.uiOk) {
        for (const r of ["/school/dashboard", "/school/students", "/school/teachers"]) {
          await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 90000 });
          await page.waitForTimeout(1500);
          result.rows.push({ route: r, ...(await harvest(page)) });
        }
      }
    }
  }
  report.school = result;
  await ctx.close();
}

await browser.close();

const hebrewRows = [
  ...(report.parent?.rows || []),
  ...(report.student?.rows || []),
  ...(report.school?.rows || []),
].filter((r) => r.hebrewBody || r.hebrewHtml);

report.summary = {
  teacherPreferredLanguage: report.teacherMe.preferredLanguage,
  teacherDisplayName: report.teacherMe.displayName,
  teacherHebrew: report.teacherMe.hebrew,
  parentOk: Boolean(report.parent?.uiOk),
  studentOk: Boolean(report.student?.uiOk),
  schoolOk: Boolean(report.school?.uiOk),
  hebrewInRoleUi: hebrewRows.length,
  blocked: [
    !report.parent?.uiOk && { role: "parent", reason: report.parent?.reason },
    !report.student?.uiOk && { role: "student", reason: report.student?.reason },
    !report.school?.uiOk && { role: "school", reason: report.school?.reason },
  ].filter(Boolean),
};

fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
console.log("teacherMe.raw keys", Object.keys(report.teacherMe.rawProfile || {}));
