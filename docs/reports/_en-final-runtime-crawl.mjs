#!/usr/bin/env node
/**
 * Final EN runtime crawl including logged-in student/parent/teacher/school.
 * Uses .env.e2e.local credentials. Does not print secrets.
 * Output: docs/reports/en-final-runtime-crawl.json
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = String(process.env.BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const HE = /[\u0590-\u05FF]/;
const OUT = path.join(ROOT, "docs/reports/en-final-runtime-crawl.json");

function loadEnvFile(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const ENV = { ...loadEnvFile(".env.local"), ...loadEnvFile(".env.e2e.local"), ...process.env };

async function harvest(page) {
  return page.evaluate((src) => {
    const RE = new RegExp(src);
    const hits = [];
    const push = (where, text) => {
      const t = String(text || "");
      if (!t || !RE.test(t)) return;
      const m = t.match(/[\u0590-\u05FF][^]*?(.{0,60})/);
      hits.push({ where, sample: (m ? m[0] : t).slice(0, 160) });
    };
    push("title", document.title);
    push(
      "meta.description",
      document.querySelector('meta[name="description"]')?.getAttribute("content")
    );
    push("og:title", document.querySelector('meta[property="og:title"]')?.content);
    push(
      "og:description",
      document.querySelector('meta[property="og:description"]')?.content
    );
    push("body", document.body?.innerText || "");
    document.querySelectorAll("[placeholder],[aria-label],[title],[alt]").forEach((el, idx) => {
      for (const a of ["placeholder", "aria-label", "title", "alt"]) {
        push(`${el.tagName}.${a}#${idx}`, el.getAttribute(a));
      }
    });
    return hits;
  }, HE.source);
}

async function openChrome(page) {
  const notes = [];
  const sels = [
    'button[aria-label*="menu" i]',
    'button[aria-haspopup="menu"]',
    'button:has-text("Menu")',
  ];
  for (const s of sels) {
    const loc = page.locator(s).first();
    if (await loc.isVisible({ timeout: 250 }).catch(() => false)) {
      await loc.click({ timeout: 1000 }).catch(() => {});
      notes.push(`menu:${s}`);
      await page.waitForTimeout(250);
    }
  }
  return notes;
}

async function checkPage(browser, { route, role, interact }) {
  const context = await browser.newContext({
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await context.newPage();
  /** @type {any} */
  const row = {
    route,
    role: role || "public",
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
    await page.waitForTimeout(600);
    row.notes.push(...(await openChrome(page)));
    if (typeof interact === "function") {
      const extra = await interact(page);
      if (Array.isArray(extra)) row.notes.push(...extra);
    }
    row.hits = await harvest(page);
    row.hebrew = row.hits.length > 0;
    row.finalUrl = page.url();
  } catch (e) {
    row.errors.push(String(e?.message || e));
  }
  await context.close();
  return row;
}

async function apiCheck(pathname, headers = {}) {
  try {
    const res = await fetch(`${BASE}${pathname}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US",
        ...headers,
      },
    });
    const text = await res.text();
    return {
      route: pathname,
      role: "api",
      status: res.status,
      hebrew: HE.test(text),
      sample: HE.test(text) ? (text.match(/[\u0590-\u05FF].{0,100}/) || [""])[0] : "",
      bytes: text.length,
    };
  } catch (e) {
    return { route: pathname, role: "api", status: 0, hebrew: false, errors: [String(e)] };
  }
}

async function loginTeacher(page) {
  const email = ENV.TEACHER_PORTAL_VERIFY_EMAIL || "";
  const password = ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "";
  if (!email || !password) return { ok: false, reason: "missing TEACHER_PORTAL_VERIFY_EMAIL/PASSWORD in .env.e2e.local" };
  await page.goto(`${BASE}/teacher/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(500);
  // Fill email/password fields flexibly
  const emailInput = page.locator('input[type="email"], input[name="email"], input[autocomplete="username"]').first();
  const passInput = page.locator('input[type="password"]').first();
  if (!(await emailInput.isVisible({ timeout: 3000 }).catch(() => false))) {
    return { ok: false, reason: "teacher login email field not found" };
  }
  await emailInput.fill(email);
  await passInput.fill(password);
  const submit = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in"), button:has-text("Login")').first();
  await submit.click();
  await page.waitForTimeout(2500);
  const url = page.url();
  if (/teacher\/login/.test(url)) {
    const body = await page.locator("body").innerText().catch(() => "");
    return { ok: false, reason: `still on login after submit; body snippet: ${body.slice(0, 120)}` };
  }
  return { ok: true, url };
}

async function loginParent(page) {
  const email = ENV.E2E_PARENT_EMAIL || "";
  const password = ENV.E2E_PARENT_PASSWORD || "";
  if (!email || !password) return { ok: false, reason: "missing E2E_PARENT_EMAIL/PASSWORD" };
  await page.goto(`${BASE}/parent/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(500);
  const emailInput = page.locator('input[type="email"], input[name="email"], input[autocomplete="username"]').first();
  const passInput = page.locator('input[type="password"]').first();
  if (!(await emailInput.isVisible({ timeout: 3000 }).catch(() => false))) {
    return { ok: false, reason: "parent login email field not found" };
  }
  await emailInput.fill(email);
  await passInput.fill(password);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(2500);
  if (/parent\/login/.test(page.url())) {
    return { ok: false, reason: "parent still on login" };
  }
  return { ok: true, url: page.url() };
}

async function loginStudent(page) {
  const user = ENV.E2E_STUDENT_USERNAME || ENV.ACTIVITY_SIM_STUDENT_USER || "";
  const pin = ENV.E2E_STUDENT_PIN || ENV.ACTIVITY_SIM_STUDENT_PIN || "";
  if (!user || !pin) return { ok: false, reason: "missing E2E_STUDENT_USERNAME/PIN" };
  await page.goto(`${BASE}/student/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(500);
  // student login often username + pin
  const inputs = page.locator("input");
  const count = await inputs.count();
  if (count < 1) return { ok: false, reason: "no inputs on student login" };
  // Prefer named fields
  const userField = page.locator('input[name="username"], input[name="user"], input[autocomplete="username"], input[type="text"]').first();
  const pinField = page.locator('input[name="pin"], input[type="password"], input[inputmode="numeric"]').first();
  await userField.fill(user).catch(async () => {
    await inputs.nth(0).fill(user);
  });
  await pinField.fill(pin).catch(async () => {
    if (count > 1) await inputs.nth(1).fill(pin);
  });
  await page.locator('button[type="submit"]').first().click().catch(async () => {
    await page.getByRole("button", { name: /log|sign|enter|continue/i }).first().click();
  });
  await page.waitForTimeout(2500);
  if (/student\/login/.test(page.url())) {
    return { ok: false, reason: "student still on login" };
  }
  return { ok: true, url: page.url() };
}

async function loginSchoolStaff(page) {
  // Prefer manager email if password available via DEMO/SCHOOL_QA
  const email =
    ENV.SCHOOL_MANAGER_EMAIL ||
    ENV.E2E_SCHOOL_EMAIL ||
    "school@leo-k.com";
  const password =
    ENV.SCHOOL_QA_PASSWORD ||
    ENV.DEMO_TEACHER_PASSWORD ||
    ENV.E2E_SCHOOL_PASSWORD ||
    "";
  const pin = ENV.SCHOOL_STAFF_PIN || ENV.E2E_SCHOOL_PIN || "";
  if (!password && !pin) {
    return { ok: false, reason: "missing SCHOOL_QA_PASSWORD / DEMO_TEACHER_PASSWORD / staff PIN for school login" };
  }
  await page.goto(`${BASE}/school/staff/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(600);
  const emailInput = page.locator('input[type="email"], input[name="email"], input[type="text"]').first();
  if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await emailInput.fill(email);
  }
  const passInput = page.locator('input[type="password"]').first();
  if (password && (await passInput.isVisible({ timeout: 1000 }).catch(() => false))) {
    await passInput.fill(password);
  } else if (pin && (await passInput.isVisible({ timeout: 1000 }).catch(() => false))) {
    await passInput.fill(pin);
  }
  await page.locator('button[type="submit"]').first().click().catch(async () => {
    await page.getByRole("button", { name: /log|sign|enter|continue/i }).first().click();
  });
  await page.waitForTimeout(2500);
  if (/school\/staff\/login|school\/login/.test(page.url())) {
    return { ok: false, reason: `school still on login (${page.url()})` };
  }
  return { ok: true, url: page.url() };
}

async function crawlWithSession(browser, loginFn, role, routes) {
  const context = await browser.newContext({
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
  const page = await context.newPage();
  const login = await loginFn(page);
  /** @type {any[]} */
  const rows = [];
  if (!login.ok) {
    rows.push({
      route: `(login:${role})`,
      role,
      status: 0,
      hebrew: false,
      hits: [],
      errors: [login.reason],
      blocked: true,
      notes: [],
      finalUrl: page.url(),
    });
    await context.close();
    return { login, rows };
  }
  rows.push({
    route: `(login-ok:${role})`,
    role,
    status: 200,
    hebrew: false,
    hits: await harvest(page),
    notes: [`landed:${login.url}`],
    errors: [],
    finalUrl: page.url(),
  });
  rows[rows.length - 1].hebrew = rows[rows.length - 1].hits.length > 0;

  for (const route of routes) {
    /** @type {any} */
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
      await page.waitForTimeout(700);
      row.notes.push(...(await openChrome(page)));
      // click a few visible buttons to surface modals/empty actions
      const buttons = page.locator("button:visible");
      const n = Math.min(await buttons.count(), 5);
      for (let i = 0; i < n; i++) {
        const b = buttons.nth(i);
        const t = ((await b.innerText().catch(() => "")) || "").trim().slice(0, 40);
        if (!t || /logout|sign out|delete|remove/i.test(t)) continue;
        await b.click({ timeout: 800 }).catch(() => {});
        await page.waitForTimeout(300);
        row.notes.push(`btn:${t || i}`);
      }
      // Escape any modal
      await page.keyboard.press("Escape").catch(() => {});
      row.hits = await harvest(page);
      row.hebrew = row.hits.length > 0;
      row.finalUrl = page.url();
    } catch (e) {
      row.errors.push(String(e?.message || e));
    }
    rows.push(row);
    console.log(
      `${row.hebrew ? "HE" : "OK"} [${role}] ${row.status} ${route} hits=${row.hits.length}`
    );
  }
  await context.close();
  return { login, rows };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  /** @type {any[]} */
  const publicRows = [];

  const publicRoutes = [
    "/",
    "/en",
    "/kids",
    "/parents",
    "/teachers",
    "/schools",
    "/about",
    "/contact",
    "/gallery",
    "/games",
    "/help",
    "/guides",
    "/guides/math-practice-at-home",
    "/guides/home-practice-routine",
    "/guides/how-to-follow-child-progress",
    "/guides/learning-games-at-home",
    "/practice",
    "/practice/math",
    "/practice/english",
    "/practice/science",
    "/practice/geometry",
    "/practice/games",
    "/practice/worksheets",
    "/practice/reading",
    "/parent/login",
    "/student/login",
    "/teacher/login",
    "/school/register",
    "/school/staff/login",
    "/auth/forgot-password",
    "/demo/enter",
    "/demo/parent/enter",
    "/learning",
    "/learning/curriculum",
    "/learning/math-master",
    "/learning/geometry-master",
    "/learning/english-master",
    "/learning/science-master",
    "/offline",
    "/404",
  ];

  for (const route of publicRoutes) {
    const row = await checkPage(browser, { route, role: "public" });
    publicRows.push(row);
    console.log(`${row.hebrew ? "HE" : "OK"} [public] ${row.status} ${route} hits=${row.hits.length}`);
  }

  // Help article discovery
  {
    const context = await browser.newContext({ locale: "en-US" });
    await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
    const page = await context.newPage();
    await page.goto(`${BASE}/help`, { waitUntil: "domcontentloaded", timeout: 90000 });
    const hrefs = await page.$$eval("a[href*='/help/']", (as) =>
      [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))]
        .map((h) => (h.startsWith("http") ? new URL(h).pathname : h))
        .slice(0, 10)
    );
    await context.close();
    for (const route of hrefs) {
      const row = await checkPage(browser, { route, role: "public-help" });
      publicRows.push(row);
      console.log(`${row.hebrew ? "HE" : "OK"} [help] ${row.status} ${route}`);
    }
  }

  // Demo student
  const demoStudent = await crawlWithSession(
    browser,
    async (page) => {
      await page.goto(`${BASE}/demo/enter?grade=g3`, {
        waitUntil: "networkidle",
        timeout: 90000,
      });
      await page.waitForTimeout(1200);
      if (!/student\//.test(page.url())) {
        return { ok: false, reason: `demo did not land on student: ${page.url()}` };
      }
      return { ok: true, url: page.url() };
    },
    "demo-student",
    [
      "/student/home",
      "/student/cards",
      "/student/game",
      "/learning/math-master",
      "/learning/english-master",
      "/learning/science-master",
      "/learning/geometry-master",
      "/games",
    ]
  );

  // Demo parent
  const demoParent = await crawlWithSession(
    browser,
    async (page) => {
      await page.goto(`${BASE}/demo/parent/enter`, {
        waitUntil: "domcontentloaded",
        timeout: 90000,
      });
      const btn = page.getByTestId("parent-demo-enter-button");
      if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(2000);
      }
      // Even if still on enter, try dashboard
      return { ok: true, url: page.url() };
    },
    "demo-parent",
    [
      "/parent/dashboard",
      "/parent/worksheets",
      "/learning/parent-report",
      "/learning/parent-report-detailed",
      "/parent/school-inbox",
    ]
  );

  const teacher = await crawlWithSession(browser, loginTeacher, "teacher", [
    "/teacher/dashboard",
    "/teacher/worksheets",
    "/teacher/worksheets/new",
    "/teacher/students/activities/new",
    "/teacher/school-messages",
  ]);

  // After teacher login, try to open first class if linked from dashboard
  let teacherDeepExtra = [];
  if (teacher.login.ok) {
    const context = await browser.newContext({
      locale: "en-US",
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
    const page = await context.newPage();
    await loginTeacher(page);
    await page.goto(`${BASE}/teacher/dashboard`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await page.waitForTimeout(1000);
    const classLinks = await page.$$eval("a[href*='/teacher/class/']", (as) =>
      [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))]
        .map((h) => (h.startsWith("http") ? new URL(h).pathname : h))
        .slice(0, 3)
    );
    const deepRoutes = [];
    for (const base of classLinks) {
      deepRoutes.push(
        base,
        `${base}/activities`,
        `${base}/activities/new`,
        `${base}/worksheets`,
        `${base}/worksheets/new`,
        `${base}/discussion/new`
      );
    }
    // student detail links
    const studentLinks = await page.$$eval("a[href*='/teacher/student/']", (as) =>
      [...new Set(as.map((a) => a.getAttribute("href")).filter(Boolean))]
        .map((h) => (h.startsWith("http") ? new URL(h).pathname : h))
        .slice(0, 2)
    );
    deepRoutes.push(...studentLinks);

    for (const route of deepRoutes) {
      /** @type {any} */
      const row = {
        route,
        role: "teacher-deep",
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
        row.notes.push(...(await openChrome(page)));
        const buttons = page.locator("button:visible");
        const n = Math.min(await buttons.count(), 6);
        for (let i = 0; i < n; i++) {
          const b = buttons.nth(i);
          const t = ((await b.innerText().catch(() => "")) || "").trim().slice(0, 40);
          if (!t || /logout|sign out|delete|remove/i.test(t)) continue;
          await b.click({ timeout: 800 }).catch(() => {});
          await page.waitForTimeout(350);
          row.notes.push(`btn:${t}`);
        }
        await page.keyboard.press("Escape").catch(() => {});
        row.hits = await harvest(page);
        row.hebrew = row.hits.length > 0;
        row.finalUrl = page.url();
      } catch (e) {
        row.errors.push(String(e?.message || e));
      }
      teacherDeepExtra.push(row);
      console.log(
        `${row.hebrew ? "HE" : "OK"} [teacher-deep] ${row.status} ${route} hits=${row.hits.length}`
      );
    }
    await context.close();
  }

  const parent = await crawlWithSession(browser, loginParent, "parent", [
    "/parent/dashboard",
    "/parent/worksheets",
    "/learning/parent-report",
    "/learning/parent-report-detailed",
    "/parent/school-inbox",
  ]);

  const student = await crawlWithSession(browser, loginStudent, "student", [
    "/student/home",
    "/student/cards",
    "/student/game",
    "/learning/math-master",
    "/learning/english-master",
  ]);

  const school = await crawlWithSession(browser, loginSchoolStaff, "school", [
    "/school/dashboard",
    "/school/students",
    "/school/teachers",
    "/school/classes",
    "/school/messages",
  ]);

  const apis = [];
  for (const p of [
    "/api/public/worksheets/catalog",
    "/api/demo/cards/catalog",
    "/api/demo/cards/series",
    "/api/demo/cards/shop",
    "/api/demo/cards/collection",
    "/api/arcade/games",
  ]) {
    apis.push(await apiCheck(p));
  }

  await browser.close();

  const allRows = [
    ...publicRows,
    ...demoStudent.rows,
    ...demoParent.rows,
    ...teacher.rows,
    ...teacherDeepExtra,
    ...parent.rows,
    ...student.rows,
    ...school.rows,
  ];
  const hebrewRows = allRows.filter((r) => r.hebrew);
  const blockedLogins = [
    !demoStudent.login.ok && { role: "demo-student", reason: demoStudent.login.reason },
    !demoParent.login.ok && { role: "demo-parent", reason: demoParent.login.reason },
    !teacher.login.ok && { role: "teacher", reason: teacher.login.reason },
    !parent.login.ok && { role: "parent", reason: parent.login.reason },
    !student.login.ok && { role: "student", reason: student.login.reason },
    !school.login.ok && { role: "school", reason: school.login.reason },
  ].filter(Boolean);

  const payload = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    counts: {
      routesChecked: allRows.length,
      hebrewRoutes: hebrewRows.length,
      apisChecked: apis.length,
      hebrewApis: apis.filter((a) => a.hebrew).length,
      loggedInFlowsAttempted: 6,
      loggedInFlowsOk: [
        demoStudent.login.ok,
        demoParent.login.ok,
        teacher.login.ok,
        parent.login.ok,
        student.login.ok,
        school.login.ok,
      ].filter(Boolean).length,
      teacherDeepRoutes: teacherDeepExtra.length,
    },
    loginStatus: {
      demoStudent: demoStudent.login,
      demoParent: demoParent.login,
      teacher: teacher.login,
      parent: parent.login,
      student: student.login,
      school: school.login,
    },
    blockedLogins,
    hebrewRows,
    hebrewApis: apis.filter((a) => a.hebrew),
    apis,
    rows: allRows,
  };

  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(
    JSON.stringify(
      {
        routesChecked: allRows.length,
        hebrewRoutes: hebrewRows.length,
        apisChecked: apis.length,
        hebrewApis: apis.filter((a) => a.hebrew).length,
        loginOk: payload.counts.loggedInFlowsOk,
        blocked: blockedLogins,
        teacherDeep: teacherDeepExtra.length,
      },
      null,
      2
    )
  );

  // Exit code: hebrew found => 1; teacher blocked => 2; other login blocked => 3
  if (hebrewRows.length || apis.some((a) => a.hebrew)) process.exit(1);
  if (!teacher.login.ok) process.exit(2);
  if (blockedLogins.length) process.exit(3);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
