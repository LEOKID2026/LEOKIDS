#!/usr/bin/env node
/**
 * Final EN logged-in deep crawl: teacher/parent/student/school.
 * Accepts consent, mirrors e2e selectors, falls back to Supabase token inject.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = String(process.env.BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const HE = /[\u0590-\u05FF]/;
const OUT = path.join(ROOT, "docs/reports/en-final-loggedin-deep-crawl.json");

function loadEnvFile(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
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
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

const ENV = { ...loadEnvFile(".env.local"), ...loadEnvFile(".env.e2e.local"), ...process.env };

async function acceptConsent(page) {
  const btn = page.getByRole("button", { name: /^(Accept|accept|I agree|Agree|OK|Allow)$/i });
  if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await btn.click().catch(() => {});
    await page.waitForTimeout(400);
    return true;
  }
  // common cookie banners
  for (const name of [/accept all/i, /accept cookies/i, /agree/i]) {
    const b = page.getByRole("button", { name });
    if (await b.isVisible({ timeout: 400 }).catch(() => false)) {
      await b.click().catch(() => {});
      await page.waitForTimeout(300);
      return true;
    }
  }
  return false;
}

async function harvest(page) {
  return page.evaluate((src) => {
    const RE = new RegExp(src);
    const hits = [];
    const push = (where, text) => {
      const t = String(text || "");
      if (!RE.test(t)) return;
      hits.push({
        where,
        sample: (t.match(/[\u0590-\u05FF][\s\S]{0,80}/) || [t]).slice(0, 1)[0].slice(0, 160),
      });
    };
    push("title", document.title);
    push("meta.description", document.querySelector('meta[name="description"]')?.content || "");
    push("body", document.body?.innerText || "");
    return hits;
  }, HE.source);
}

async function supabasePasswordToken(email, password) {
  const url = ENV.NEXT_PUBLIC_LEARNING_SUPABASE_URL;
  const anon = ENV.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY;
  if (!url || !anon) return { ok: false, reason: "missing NEXT_PUBLIC_LEARNING_SUPABASE_URL/ANON_KEY" };
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anon, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      reason: `supabase auth failed status=${res.status} msg=${json?.error_description || json?.msg || json?.error || "unknown"}`,
    };
  }
  return {
    ok: true,
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_in: json.expires_in,
    user: json.user,
  };
}

async function injectSupabaseSession(page, session) {
  const url = ENV.NEXT_PUBLIC_LEARNING_SUPABASE_URL || "";
  // Derive project ref for storage key if possible
  let ref = "learning";
  try {
    ref = new URL(url).hostname.split(".")[0] || "learning";
  } catch {
    /* ignore */
  }
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await acceptConsent(page);
  await page.evaluate(
    ({ refName, access_token, refresh_token }) => {
      const payload = {
        access_token,
        refresh_token,
        token_type: "bearer",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      };
      // Common supabase-js localStorage keys
      const keys = [
        `sb-${refName}-auth-token`,
        "supabase.auth.token",
        "leo-learning-auth",
      ];
      for (const k of keys) {
        try {
          localStorage.setItem(k, JSON.stringify(payload));
        } catch {
          /* ignore */
        }
      }
    },
    {
      refName: ref,
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    }
  );
}

async function teacherLoginUi(page, email, password) {
  await page.goto(`${BASE}/teacher/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await acceptConsent(page);
  await page.waitForSelector('[data-testid="teacher-login-root"], form, input[type="password"]', {
    timeout: 30000,
  }).catch(() => {});
  // Ensure login tab
  const tab = page.getByTestId("teacher-login-tab");
  if (await tab.isVisible({ timeout: 1000 }).catch(() => false)) await tab.click().catch(() => {});

  // Match e2e: placeholder often a space / translated label
  const emailCandidates = [
    page.getByPlaceholder(" "),
    page.locator('input[type="email"]'),
    page.locator('input[name="email"]'),
    page.locator('input[autocomplete="username"]'),
    page.locator("form input").first(),
  ];
  let filled = false;
  for (const c of emailCandidates) {
    if (await c.first().isVisible({ timeout: 800 }).catch(() => false)) {
      await c.first().fill(email);
      filled = true;
      break;
    }
  }
  if (!filled) return { ok: false, reason: "email field not found" };
  await page.locator('input[type="password"]').first().fill(password);

  // Submit: e2e uses empty-name button; also try type=submit
  const submitCandidates = [
    page.locator('button[type="submit"]'),
    page.getByRole("button", { name: /sign in|log in|login|enter|continue/i }),
    page.locator("form button").last(),
  ];
  for (const s of submitCandidates) {
    if (await s.first().isVisible({ timeout: 500 }).catch(() => false)) {
      await s.first().click();
      break;
    }
  }
  await page.waitForTimeout(4000);
  try {
    await page.waitForURL(/\/teacher\/(dashboard|class)/, { timeout: 45000 });
  } catch {
    /* continue check */
  }
  if (/teacher\/login/.test(page.url())) {
    const err = await page.locator('[role="alert"], .text-red-600, .text-rose-600, [data-testid*="error"]').first().innerText().catch(() => "");
    return { ok: false, reason: `UI login stayed on login. err=${err.slice(0, 120)} url=${page.url()}` };
  }
  return { ok: true, method: "ui", url: page.url() };
}

async function parentLoginUi(page, email, password) {
  await page.goto(`${BASE}/parent/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await acceptConsent(page);
  const emailField = page.locator('input[type="email"], input[name="email"], input[autocomplete="username"], form input').first();
  const passField = page.locator('input[type="password"]').first();
  if (!(await emailField.isVisible({ timeout: 5000 }).catch(() => false))) {
    return { ok: false, reason: "parent email field missing" };
  }
  await emailField.fill(email);
  await passField.fill(password);
  await page.locator('button[type="submit"]').first().click().catch(async () => {
    await page.getByRole("button", { name: /sign|log|enter|continue/i }).first().click();
  });
  await page.waitForTimeout(4000);
  if (/parent\/login/.test(page.url())) {
    return { ok: false, reason: `parent UI login failed url=${page.url()}` };
  }
  return { ok: true, method: "ui", url: page.url() };
}

async function studentLoginUi(page, username, pin) {
  await page.goto(`${BASE}/student/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await acceptConsent(page);
  const userField = page.locator('input[name="username"], input[autocomplete="username"], input[type="text"]').first();
  const pinField = page.locator('input[name="pin"], input[type="password"], input[inputmode="numeric"]').first();
  if (!(await userField.isVisible({ timeout: 5000 }).catch(() => false))) {
    return { ok: false, reason: "student username field missing" };
  }
  await userField.fill(username);
  await pinField.fill(pin);
  await page.locator('button[type="submit"]').first().click().catch(async () => {
    await page.getByRole("button", { name: /enter|log|sign|continue/i }).first().click();
  });
  await page.waitForTimeout(4000);
  if (/student\/login/.test(page.url())) {
    return { ok: false, reason: `student UI login failed url=${page.url()}` };
  }
  return { ok: true, method: "ui", url: page.url() };
}

async function crawlRoutes(page, role, routes) {
  const rows = [];
  for (const route of routes) {
    const row = {
      route,
      role,
      status: 0,
      hebrew: false,
      hits: [],
      notes: [],
      errors: [],
      finalUrl: "",
    };
    try {
      const resp = await page.goto(`${BASE}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      row.status = resp?.status() || 0;
      await page.waitForTimeout(800);
      await acceptConsent(page);
      const buttons = page.locator("button:visible");
      const n = Math.min(await buttons.count(), 6);
      for (let i = 0; i < n; i++) {
        const b = buttons.nth(i);
        const t = ((await b.innerText().catch(() => "")) || "").trim().slice(0, 40);
        if (!t || /logout|sign out|delete|remove/i.test(t)) continue;
        await b.click({ timeout: 700 }).catch(() => {});
        await page.waitForTimeout(250);
        row.notes.push(`btn:${t}`);
      }
      await page.keyboard.press("Escape").catch(() => {});
      row.hits = await harvest(page);
      row.hebrew = row.hits.length > 0;
      row.finalUrl = page.url();
    } catch (e) {
      row.errors.push(String(e?.message || e));
    }
    rows.push(row);
    console.log(`${row.hebrew ? "HE" : "OK"} [${role}] ${row.status} ${route} hits=${row.hits.length}`);
  }
  return rows;
}

async function apiAuthed(pathname, token) {
  const res = await fetch(`${BASE}${pathname}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": "en-US",
    },
  });
  const text = await res.text();
  return {
    route: pathname,
    role: "api-authed",
    status: res.status,
    hebrew: HE.test(text),
    sample: HE.test(text) ? (text.match(/[\u0590-\u05FF].{0,100}/) || [""])[0] : "",
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  /** @type {any} */
  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    logins: {},
    rows: [],
    apis: [],
    blocked: [],
  };

  // --- TEACHER ---
  const teacherEmail = ENV.TEACHER_PORTAL_VERIFY_EMAIL || "teacher@leo.com";
  const teacherPassword = ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975";
  const teacherTok = await supabasePasswordToken(teacherEmail, teacherPassword);
  report.logins.teacherSupabase = {
    ok: teacherTok.ok,
    reason: teacherTok.ok ? "ok" : teacherTok.reason,
    emailSet: Boolean(teacherEmail),
  };

  {
    const context = await browser.newContext({
      locale: "en-US",
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
    const page = await context.newPage();
    let login = await teacherLoginUi(page, teacherEmail, teacherPassword);
    if (!login.ok && teacherTok.ok) {
      // Fallback: set session via supabase storage then navigate
      await injectSupabaseSession(page, teacherTok);
      await page.goto(`${BASE}/teacher/dashboard`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await page.waitForTimeout(2000);
      if (!/teacher\/login/.test(page.url())) {
        login = { ok: true, method: "token-inject", url: page.url() };
      } else {
        login = {
          ok: false,
          reason: `UI failed (${login.reason}); token-inject still on login`,
        };
      }
    }
    report.logins.teacher = login;
    if (!login.ok) {
      report.blocked.push({ role: "teacher", reason: login.reason });
    } else {
      const baseRoutes = [
        "/teacher/dashboard",
        "/teacher/worksheets",
        "/teacher/worksheets/new",
        "/teacher/students/activities/new",
        "/teacher/school-messages",
      ];
      report.rows.push(...(await crawlRoutes(page, "teacher", baseRoutes)));

      // Discover class/student deep links
      await page.goto(`${BASE}/teacher/dashboard`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await page.waitForTimeout(1000);
      const classLinks = await page.$$eval("a[href*='/teacher/class/']", (as) =>
        [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))]
          .map((h) => (h.startsWith("http") ? new URL(h).pathname : h))
          .slice(0, 4)
      );
      const studentLinks = await page.$$eval("a[href*='/teacher/student/']", (as) =>
        [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))]
          .map((h) => (h.startsWith("http") ? new URL(h).pathname : h))
          .slice(0, 3)
      );
      const deep = [];
      for (const c of classLinks) {
        deep.push(
          c,
          `${c.replace(/\/$/, "")}/activities`,
          `${c.replace(/\/$/, "")}/activities/new`,
          `${c.replace(/\/$/, "")}/worksheets`,
          `${c.replace(/\/$/, "")}/worksheets/new`,
          `${c.replace(/\/$/, "")}/discussion/new`
        );
      }
      deep.push(...studentLinks);
      report.logins.teacherDeepDiscovery = { classLinks, studentLinks, deepCount: deep.length };
      if (deep.length === 0) {
        report.blocked.push({
          role: "teacher-deep",
          reason: "Teacher logged in but no class/student links found on dashboard — cannot complete deep flow coverage",
        });
      } else {
        report.rows.push(...(await crawlRoutes(page, "teacher-deep", deep)));
      }

      if (teacherTok.ok) {
        for (const p of ["/api/teacher/classes", "/api/teacher/me"]) {
          report.apis.push(await apiAuthed(p, teacherTok.access_token));
        }
      }
    }
    await context.close();
  }

  // --- PARENT ---
  const parentEmail = ENV.E2E_PARENT_EMAIL || "";
  const parentPassword = ENV.E2E_PARENT_PASSWORD || "";
  {
    const context = await browser.newContext({
      locale: "en-US",
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
    const page = await context.newPage();
    let login = { ok: false, reason: "missing E2E_PARENT_EMAIL/PASSWORD" };
    if (parentEmail && parentPassword) {
      const tok = await supabasePasswordToken(parentEmail, parentPassword);
      report.logins.parentSupabase = { ok: tok.ok, reason: tok.ok ? "ok" : tok.reason };
      login = await parentLoginUi(page, parentEmail, parentPassword);
      if (!login.ok && tok.ok) {
        await injectSupabaseSession(page, tok);
        await page.goto(`${BASE}/parent/dashboard`, {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });
        await page.waitForTimeout(2000);
        login = /parent\/login/.test(page.url())
          ? { ok: false, reason: "parent token-inject failed" }
          : { ok: true, method: "token-inject", url: page.url() };
      }
      if (login.ok) {
        report.rows.push(
          ...(await crawlRoutes(page, "parent", [
            "/parent/dashboard",
            "/parent/worksheets",
            "/learning/parent-report",
            "/learning/parent-report-detailed",
            "/parent/school-inbox",
          ]))
        );
        if (tok.ok) {
          report.apis.push(await apiAuthed("/api/parent/me", tok.access_token).catch(async () => {
            // try common parent endpoints
            return apiAuthed("/api/parent/students", tok.access_token);
          }));
        }
      }
    }
    report.logins.parent = login;
    if (!login.ok) report.blocked.push({ role: "parent", reason: login.reason });
    await context.close();
  }

  // --- STUDENT ---
  const studentUser = ENV.E2E_STUDENT_USERNAME || ENV.ACTIVITY_SIM_STUDENT_USER || "";
  const studentPin = ENV.E2E_STUDENT_PIN || ENV.ACTIVITY_SIM_STUDENT_PIN || "";
  {
    const context = await browser.newContext({
      locale: "en-US",
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
    const page = await context.newPage();
    let login = { ok: false, reason: "missing E2E_STUDENT_USERNAME/PIN" };
    if (studentUser && studentPin) {
      login = await studentLoginUi(page, studentUser, studentPin);
      if (login.ok) {
        report.rows.push(
          ...(await crawlRoutes(page, "student", [
            "/student/home",
            "/student/cards",
            "/student/game",
            "/learning/math-master",
            "/learning/english-master",
            "/learning/science-master",
            "/learning/geometry-master",
          ]))
        );
      }
    }
    report.logins.student = login;
    if (!login.ok) report.blocked.push({ role: "student", reason: login.reason });
    await context.close();
  }

  // --- SCHOOL ---
  const schoolEmail = ENV.E2E_SCHOOL_EMAIL || ENV.SCHOOL_MANAGER_EMAIL || "school@leo-k.com";
  const schoolPassword =
    ENV.SCHOOL_QA_PASSWORD || ENV.DEMO_TEACHER_PASSWORD || ENV.E2E_SCHOOL_PASSWORD || "";
  {
    const context = await browser.newContext({
      locale: "en-US",
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
    const page = await context.newPage();
    let login = { ok: false, reason: "missing SCHOOL_QA_PASSWORD/DEMO_TEACHER_PASSWORD" };
    if (schoolPassword) {
      const tok = await supabasePasswordToken(schoolEmail, schoolPassword);
      report.logins.schoolSupabase = { ok: tok.ok, reason: tok.ok ? "ok" : tok.reason };
      await page.goto(`${BASE}/school/staff/login`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      await acceptConsent(page);
      const emailField = page.locator('input[type="email"], input[name="email"], input[type="text"]').first();
      const passField = page.locator('input[type="password"]').first();
      if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
        await emailField.fill(schoolEmail);
        await passField.fill(schoolPassword);
        await page.locator('button[type="submit"]').first().click().catch(() => {});
        await page.waitForTimeout(4000);
        login = /login/.test(page.url())
          ? { ok: false, reason: `school UI login failed url=${page.url()}` }
          : { ok: true, method: "ui", url: page.url() };
      }
      if (!login.ok && tok.ok) {
        await injectSupabaseSession(page, tok);
        await page.goto(`${BASE}/school/dashboard`, {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });
        await page.waitForTimeout(2000);
        login = /login/.test(page.url())
          ? { ok: false, reason: "school token-inject failed" }
          : { ok: true, method: "token-inject", url: page.url() };
      }
      if (login.ok) {
        report.rows.push(
          ...(await crawlRoutes(page, "school", [
            "/school/dashboard",
            "/school/students",
            "/school/teachers",
            "/school/classes",
            "/school/messages",
            "/school/operators",
          ]))
        );
      }
    }
    report.logins.school = login;
    if (!login.ok) report.blocked.push({ role: "school", reason: login.reason });
    await context.close();
  }

  await browser.close();

  const hebrewRows = report.rows.filter((r) => r.hebrew);
  const hebrewApis = report.apis.filter((a) => a.hebrew);
  report.summary = {
    routesChecked: report.rows.length,
    hebrewRoutes: hebrewRows.length,
    apisChecked: report.apis.length,
    hebrewApis: hebrewApis.length,
    blockedCount: report.blocked.length,
    teacherOk: Boolean(report.logins.teacher?.ok),
    parentOk: Boolean(report.logins.parent?.ok),
    studentOk: Boolean(report.logins.student?.ok),
    schoolOk: Boolean(report.logins.school?.ok),
  };
  report.hebrewRows = hebrewRows;
  report.hebrewApis = hebrewApis;

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ summary: report.summary, blocked: report.blocked, logins: report.logins }, null, 2));

  if (hebrewRows.length || hebrewApis.length) process.exit(1);
  if (!report.logins.teacher?.ok) process.exit(2);
  if (report.blocked.length) process.exit(3);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
