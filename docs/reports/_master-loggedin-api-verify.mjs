#!/usr/bin/env node
/**
 * Master logged-in + API locale verification (9 masters only).
 * Verification only — no fixes.
 *
 *   node docs/reports/_master-loggedin-api-verify.mjs
 *   LOCALES=fr-FR,ar-001 node docs/reports/_master-loggedin-api-verify.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_JSON = path.join(ROOT, "docs/reports/master-loggedin-api-verify.json");
const OUT_LOG = path.join(ROOT, "docs/reports/_master-loggedin-api-verify-run.log");
const BASE = String(process.env.BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const HE = /[\u0590-\u05FF]/;
const AR = /[\u0600-\u06FF]/;
const WESTERN_DIGITS = /[0-9]/;
const ARABIC_INDIC_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/;

const MASTER_IDS = (
  process.env.LOCALES ||
  "ar-001,es-419,pt-BR,pt-PT,de-DE,fr-FR,it-IT,nl-NL,ru-RU"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const PUBLIC_ROUTES = [
  "/",
  "/contact",
  "/help",
  "/guides",
  "/practice",
  "/practice/worksheets",
  "/games",
  "/demo/student",
  "/demo/parent",
];

const EN_CHROME_MARKERS = [
  "Parent portal",
  "Teacher portal",
  "Help center",
  "Sign in",
  "Log out",
  "Sign out",
  "Printable worksheets",
  "Add child",
  "Kids world",
  "Cookie preferences",
  "Privacy policy",
  "Legal documents",
  "Forgot password",
  "Create account",
  "No students yet",
  "My classes",
  "Welcome back",
  "Continue learning",
  "School dashboard",
  "Staff login",
  "Your collection",
  "Surprise box",
  "Learning home",
  "Class report",
];

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
    ) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

const ENV = { ...loadEnvFile(".env.local"), ...loadEnvFile(".env.e2e.local"), ...process.env };

const CREDENTIALS = {
  parent: {
    email: ENV.E2E_PARENT_EMAIL || "eran1@leokids.com",
    password: ENV.E2E_PARENT_PASSWORD || "747975",
  },
  teacher: {
    email: ENV.TEACHER_PORTAL_VERIFY_EMAIL || "eran2@leokids.com",
    password: ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975",
  },
  school: {
    email: ENV.E2E_SCHOOL_EMAIL || ENV.SCHOOL_QA_EMAIL || "eran3@leokids.com",
    password: ENV.E2E_SCHOOL_PASSWORD || ENV.SCHOOL_QA_PASSWORD || "747975",
  },
  student: {
    username: ENV.E2E_STUDENT_USERNAME || "qa-student",
    pin: ENV.E2E_STUDENT_PIN || "7479",
  },
  staff: {
    code: ENV.E2E_SCHOOL_STAFF_CODE || "leoq-t0001",
    pin: ENV.E2E_SCHOOL_STAFF_PIN || "7479",
  },
};

function log(line) {
  const s = String(line);
  process.stdout.write(`${s}\n`);
  fs.appendFileSync(OUT_LOG, `${s}\n`);
}

function publicPrefix(def) {
  if (!def || def.id === "en") return "";
  if (def.pathPrefix) return `/${def.pathPrefix}`;
  return `/${def.id}`;
}

function withPrefix(prefix, route) {
  if (route === "/") return prefix ? `${prefix}/` : "/";
  return `${prefix}${route}`;
}

function findEnChrome(text) {
  const body = String(text || "");
  return EN_CHROME_MARKERS.filter((m) => body.includes(m));
}

function severityOf(finding) {
  if (!finding) return "none";
  if (finding.kind === "hebrew" || finding.kind === "hebrew_fallback" || finding.kind === "route") {
    return "critical";
  }
  if (finding.kind === "rtl" || finding.kind === "locale_inactive") return "high";
  if (finding.kind === "english_leakage") return "medium";
  if (finding.kind === "data_english" || finding.kind === "preferred_language") return "low";
  return "medium";
}

async function acceptConsent(page) {
  // Persist consent so the banner does not keep intercepting login submits.
  await page
    .evaluate(() => {
      const record = {
        version: 1,
        choice: "accepted",
        ads: true,
        analytics: true,
        decidedAt: new Date().toISOString(),
        source: "banner",
      };
      try {
        localStorage.setItem("leokids_consent_v1", JSON.stringify(record));
        window.dispatchEvent(new Event("leokids:consent-changed"));
      } catch {
        /* ignore */
      }
      for (const el of document.querySelectorAll(
        '[aria-labelledby="cookie-consent-title"], aside[role="dialog"], [class*="z-[55]"]'
      )) {
        el.remove();
      }
    })
    .catch(() => {});

  const dialog = page.locator('aside[role="dialog"][aria-labelledby="cookie-consent-title"]');
  if (await dialog.isVisible({ timeout: 800 }).catch(() => false)) {
    const acceptBtn = dialog.locator("button").last();
    await acceptBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(300);
  }

  const named = [
    /^(Accept|accept|I agree|Agree|OK|Allow)$/i,
    /accept all/i,
    /accept cookies/i,
    /aceptar/i,
    /aceitar/i,
    /accepter/i,
    /akzeptieren/i,
    /accetta/i,
    /accepteren|akkoord/i,
    /принять|соглас/i,
    /موافق|قبول/i,
  ];
  for (const name of named) {
    const b = page.getByRole("button", { name });
    if (await b.first().isVisible({ timeout: 300 }).catch(() => false)) {
      await b.first().click({ force: true }).catch(() => {});
    }
  }

  await page
    .evaluate(() => {
      for (const el of document.querySelectorAll(
        '[aria-labelledby="cookie-consent-title"], aside[role="dialog"]'
      )) {
        el.style.display = "none";
        el.style.pointerEvents = "none";
        el.remove();
      }
    })
    .catch(() => {});
  await page.waitForTimeout(200);
}

async function harvest(page, localeId) {
  await page.waitForTimeout(900);
  await page.waitForLoadState("networkidle").catch(() => {});
  const data = await page.evaluate(() => {
    const title = document.title || "";
    const meta = document.querySelector('meta[name="description"]')?.content || "";
    const body = document.body?.innerText || "";
    const html = document.documentElement?.outerHTML?.slice(0, 200000) || "";
    const dir =
      document.documentElement?.getAttribute("dir") ||
      document.body?.getAttribute("dir") ||
      "";
    const lang = document.documentElement?.getAttribute("lang") || "";
    return { title, meta, body, html, dir, lang, url: location.href };
  });
  const blob = `${data.title}\n${data.meta}\n${data.body}`;
  const hebrew = HE.test(blob) || HE.test(data.html);
  const enHits = findEnChrome(data.body);
  const cookies = await page.context().cookies();
  const localeCookie = cookies.find((c) => c.name === "lk_global_locale")?.value || null;
  const arabicDigits = ARABIC_INDIC_DIGITS.test(data.body);
  const westernDigits = WESTERN_DIGITS.test(data.body);
  return {
    ...data,
    hebrew,
    hebrewSamples: (blob.match(/[\u0590-\u05FF][^\n]{0,50}/g) || []).slice(0, 6),
    englishChromeHits: enHits,
    localeCookie,
    hasArabicScript: AR.test(data.body),
    arabicIndicDigits: arabicDigits,
    westernDigits,
    statusOk: !/Internal Server Error|Application error/i.test(data.body),
    localeIdExpected: localeId,
  };
}

async function supabaseToken(email, password) {
  const url = ENV.NEXT_PUBLIC_LEARNING_SUPABASE_URL;
  const anon = ENV.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY;
  if (!url || !anon) return { ok: false, reason: "missing supabase env" };
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anon, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    return {
      ok: false,
      reason: `status=${res.status} ${json?.error_description || json?.msg || json?.error || "auth fail"}`,
    };
  }
  return { ok: true, token: json.access_token, refresh: json.refresh_token, user: json.user };
}

async function apiProbe({ pathName, token, localeId, method = "GET", body = null }) {
  const headers = {
    Accept: "application/json",
    "Accept-Language": `${localeId},en;q=0.4`,
    Cookie: `lk_global_locale=${localeId}`,
    Origin: BASE,
    Referer: `${BASE}/`,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(`${BASE}${pathName}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        /* ignore */
      }
      const hebrew = HE.test(text);
      const enHits = findEnChrome(text);
      const softEn = [];
      const softMarkers = [
        "No students yet",
        "Add child",
        "Parent portal",
        "Teacher portal",
        "Welcome back",
        "Continue learning",
        "Printable worksheets",
        "Surprise box",
        "Your collection",
        "School dashboard",
      ];
      for (const m of softMarkers) {
        if (text.includes(m)) softEn.push(m);
      }
      return {
        path: pathName,
        status: res.status,
        hebrew,
        hebrewSamples: (text.match(/[\u0590-\u05FF][^\n"]{0,40}/g) || []).slice(0, 5),
        englishChromeHits: [...new Set([...enHits, ...softEn])],
        preferredLanguage:
          json?.data?.teacher?.preferredLanguage ||
          json?.teacher?.preferredLanguage ||
          json?.data?.parent?.preferredLanguage ||
          json?.preferredLanguage ||
          null,
        sample: text.slice(0, 220),
      };
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastErr || new Error(`apiProbe failed for ${pathName}`);
}

async function openLocaleContext(browser, def) {
  const ctx = await browser.newContext({
    locale: def.intlLocale || def.id,
    extraHTTPHeaders: {
      "Accept-Language": `${def.intlLocale || def.id},en;q=0.4`,
    },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: def.id, url: BASE }]);
  await ctx.addInitScript(() => {
    const record = {
      version: 1,
      choice: "accepted",
      ads: true,
      analytics: true,
      decidedAt: new Date().toISOString(),
      source: "banner",
    };
    try {
      localStorage.setItem("leokids_consent_v1", JSON.stringify(record));
    } catch {
      /* ignore */
    }
  });
  const page = await ctx.newPage();
  return { ctx, page, prefix: publicPrefix(def) };
}

async function parentUiLogin(page, prefix, email, password) {
  try {
    await page.goto(`${BASE}${withPrefix(prefix, "/parent/login")}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await acceptConsent(page);
    await page.keyboard.press("Escape").catch(() => {});
    await acceptConsent(page);
    const id = page.getByTestId("parent-login-identifier");
    await id.waitFor({ timeout: 30000 });
    await id.fill(email);
    await page.locator('input[type="password"]').fill(password);
    await acceptConsent(page);
    // Prefer real form submit over button click (cookie overlays intercept clicks).
    await page.locator("form").first().evaluate((form) => {
      if (typeof form.requestSubmit === "function") form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    try {
      await page.waitForURL(/\/parent\/(?!login)/, { timeout: 60000 });
    } catch {
      await page.waitForTimeout(10000);
    }
    if (/parent\/login/.test(page.url())) {
      // Retry once via forced button click after consent wipe.
      await acceptConsent(page);
      await page.getByTestId("parent-login-submit").click({ force: true });
      try {
        await page.waitForURL(/\/parent\/(?!login)/, { timeout: 45000 });
      } catch {
        await page.waitForTimeout(8000);
      }
    }
    return !/parent\/login/.test(page.url());
  } catch (err) {
    return { ok: false, error: String(err?.message || err).slice(0, 180) };
  }
}

async function studentUiLogin(page, prefix, username, pin) {
  try {
    await page.goto(`${BASE}${withPrefix(prefix, "/student/login")}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await acceptConsent(page);
    await acceptConsent(page);
    await page.waitForSelector('[data-testid="student-login-username"]', { timeout: 30000 });
    await page.getByTestId("student-login-username").fill(username);
    await page.getByTestId("student-login-pin").fill(pin);
    await acceptConsent(page);
    await page.getByTestId("student-login-submit").click({ force: true });
    try {
      await page.waitForURL(/\/student\/(?!login)/, { timeout: 60000 });
    } catch {
      await page.waitForTimeout(8000);
    }
    return !/student\/login/.test(page.url());
  } catch (err) {
    return { ok: false, error: String(err?.message || err).slice(0, 180) };
  }
}

async function teacherUiLogin(page, prefix, email, password) {
  try {
    await page.goto(`${BASE}${withPrefix(prefix, "/teacher/login")}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    await acceptConsent(page);
    await page.keyboard.press("Escape").catch(() => {});
    await page
      .locator('[data-testid="teacher-login-root"][data-state="ready"]')
      .waitFor({ timeout: 60000 });
    await acceptConsent(page);
    await page.getByTestId("teacher-login-tab").click().catch(() => {});
    const emailInput = page
      .locator(
        '[data-testid="teacher-login-root"][data-state="ready"] input[name="email"], [data-testid="teacher-login-root"][data-state="ready"] input[type="email"]'
      )
      .first();
    await emailInput.waitFor({ state: "attached", timeout: 20000 });
    await emailInput.fill(email, { force: true });
    await page.getByTestId("teacher-login-password").fill(password, { force: true });
    await acceptConsent(page);
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
    return { ok: false, error: String(err?.message || err).slice(0, 160) };
  }
}

function pushFinding(findings, base) {
  findings.push({
    ...base,
    severity: severityOf(base),
  });
}

function analyzeHarvest(findings, { localeId, role, route, h, isRtlExpected }) {
  if (!h.statusOk) {
    pushFinding(findings, {
      locale: localeId,
      role,
      route,
      kind: "route",
      exactText: "page looks broken / server error",
      source: "runtime",
      recommendedFix: "Investigate route crash for this locale path",
    });
  }
  if (h.hebrew) {
    pushFinding(findings, {
      locale: localeId,
      role,
      route,
      kind: "hebrew",
      exactText: (h.hebrewSamples || []).join(" | ").slice(0, 200),
      source: "runtime UI",
      recommendedFix: "Remove Hebrew from public/logged-in UI for this locale",
    });
  }
  if (h.localeCookie && h.localeCookie !== localeId) {
    pushFinding(findings, {
      locale: localeId,
      role,
      route,
      kind: "locale_inactive",
      exactText: `cookie=${h.localeCookie} expected=${localeId}`,
      source: "lk_global_locale",
      recommendedFix: "Ensure locale cookie/path resolver keeps master locale active",
    });
  }
  if (isRtlExpected) {
    if (String(h.dir || "").toLowerCase() !== "rtl") {
      pushFinding(findings, {
        locale: localeId,
        role,
        route,
        kind: "rtl",
        exactText: `dir=${h.dir || "(empty)"} lang=${h.lang || ""}`,
        source: "html dir",
        recommendedFix: "Force dir=rtl for ar-001 public + logged-in shells",
      });
    }
    // parent-report may be empty/data-heavy; only flag missing Arabic when English chrome also present
    // or when body has substantial Latin UI chrome without Arabic script.
    const bodyLen = String(h.body || "").trim().length;
    const hasEnChrome = (h.englishChromeHits || []).length > 0;
    if (
      !h.hasArabicScript &&
      role !== "api" &&
      (hasEnChrome || (bodyLen > 80 && route !== "/learning/parent-report"))
    ) {
      pushFinding(findings, {
        locale: localeId,
        role,
        route,
        kind: "locale_inactive",
        exactText: "no Arabic script detected in body",
        source: "runtime UI",
        recommendedFix: "Confirm Arabic messages load for ar-001",
      });
    }
    if (!h.hasArabicScript && route === "/learning/parent-report" && !hasEnChrome) {
      // Documented as allowed empty/data state — no finding.
    }
    if (h.arabicIndicDigits) {
      pushFinding(findings, {
        locale: localeId,
        role,
        route,
        kind: "rtl",
        exactText: "Arabic-Indic digits found (expected Western 0-9)",
        source: "runtime UI digits",
        recommendedFix: "Keep Western digits 0-9 in ar-001",
      });
    }
  }
  if ((h.englishChromeHits || []).length) {
    pushFinding(findings, {
      locale: localeId,
      role,
      route,
      kind: "english_leakage",
      exactText: h.englishChromeHits.join(", "),
      source: "EN chrome markers in visible text",
      recommendedFix: "Translate/wire UI chrome keys for this locale/role shell",
    });
  }
}

async function crawlRoutes(page, prefix, routes, localeId, role, findings, counters) {
  const rows = [];
  for (const route of routes) {
    const target = `${BASE}${withPrefix(prefix, route)}`.replace(/([^:]\/)\/+/g, "$1");
    try {
      const resp = await page.goto(target, { waitUntil: "domcontentloaded", timeout: 90000 });
      const status = resp?.status() || 0;
      if (status >= 500) {
        pushFinding(findings, {
          locale: localeId,
          role,
          route,
          kind: "route",
          exactText: `HTTP ${status}`,
          source: "runtime",
          recommendedFix: "Fix 5xx for this locale route",
        });
      }
      if (status === 404 && !route.startsWith("/demo/")) {
        pushFinding(findings, {
          locale: localeId,
          role,
          route,
          kind: "route",
          exactText: `HTTP 404`,
          source: "runtime",
          recommendedFix: "Confirm route exists under locale prefix",
        });
      }
      const h = await harvest(page, localeId);
      h.status = status;
      analyzeHarvest(findings, {
        localeId,
        role,
        route,
        h,
        isRtlExpected: localeId === "ar-001",
      });
      rows.push({ role, route, status, ...h, englishChromeHits: h.englishChromeHits });
      counters.routes += 1;
      const tag = h.hebrew
        ? "HE"
        : h.englishChromeHits.length
          ? "EN"
          : status >= 500
            ? "ERR"
            : "OK";
      log(`${tag} [${localeId}/${role}] ${route} → ${String(h.url || "").replace(BASE, "")}`);
    } catch (err) {
      counters.routes += 1;
      pushFinding(findings, {
        locale: localeId,
        role,
        route,
        kind: "route",
        exactText: String(err?.message || err).slice(0, 180),
        source: "runtime navigation",
        recommendedFix: "Restore reachability for this locale route",
      });
      rows.push({ role, route, error: String(err?.message || err).slice(0, 180) });
      log(`ERR [${localeId}/${role}] ${route}: ${err?.message || err}`);
    }
  }
  return rows;
}

async function verifyLocale(browser, def, tokens, classId) {
  const localeId = def.id;
  const findings = [];
  const roleSummary = {};
  const rows = [];
  const apis = [];
  const counters = { routes: 0, apis: 0, loggedInFlows: 0 };
  const isRtl = localeId === "ar-001";

  // --- Public ---
  {
    const { ctx, page, prefix } = await openLocaleContext(browser, def);
    const publicRows = await crawlRoutes(
      page,
      prefix,
      PUBLIC_ROUTES,
      localeId,
      "public",
      findings,
      counters
    );
    rows.push(...publicRows);
    roleSummary.public = {
      loginOk: true,
      routesChecked: PUBLIC_ROUTES.length,
      hebrew: publicRows.some((r) => r.hebrew),
      englishLeakage: publicRows.some((r) => (r.englishChromeHits || []).length > 0),
    };
    await ctx.close();
  }

  // --- Parent ---
  {
    const { ctx, page, prefix } = await openLocaleContext(browser, def);
    let loginOk = false;
    let blockedReason = "";
    if (!tokens.parent.ok) {
      blockedReason = `supabase: ${tokens.parent.reason}`;
    } else {
      const ui = await parentUiLogin(
        page,
        prefix,
        CREDENTIALS.parent.email,
        CREDENTIALS.parent.password
      );
      loginOk = ui === true;
      if (!loginOk) {
        blockedReason =
          typeof ui === "object"
            ? ui.error || "parent login failed"
            : `still on ${page.url()}`;
      }
    }
    counters.loggedInFlows += 1;
    const parentRoutes = ["/parent/dashboard", "/parent/worksheets", "/learning/parent-report"];
    const roleRows = loginOk
      ? await crawlRoutes(page, prefix, parentRoutes, localeId, "parent", findings, counters)
      : [];
    rows.push(...roleRows);
    const parentApis = tokens.parent.ok
      ? [
          await apiProbe({
            pathName: "/api/parent/list-students",
            token: tokens.parent.token,
            localeId,
          }),
          await apiProbe({
            pathName: "/api/parent/worksheets/catalog",
            token: tokens.parent.token,
            localeId,
          }),
          await apiProbe({
            pathName: "/api/parent/worksheets/coloring-catalog",
            token: tokens.parent.token,
            localeId,
          }),
          await apiProbe({
            pathName: "/api/parent/session/ready",
            token: tokens.parent.token,
            localeId,
          }),
        ]
      : [];
    for (const a of parentApis) {
      counters.apis += 1;
      apis.push({ role: "parent", locale: localeId, ...a });
      if (a.hebrew) {
        pushFinding(findings, {
          locale: localeId,
          role: "parent",
          route: a.path,
          api: a.path,
          kind: "hebrew",
          exactText: (a.hebrewSamples || []).join(" | "),
          source: "API response",
          recommendedFix: "Sanitize Hebrew from parent API payloads",
        });
      }
      if ((a.englishChromeHits || []).length) {
        pushFinding(findings, {
          locale: localeId,
          role: "parent",
          route: a.path,
          api: a.path,
          kind: "english_leakage",
          exactText: a.englishChromeHits.join(", "),
          source: "API response labels",
          recommendedFix: "Localize parent API UI labels for locale",
        });
      }
    }
    roleSummary.parent = {
      loginOk,
      blockedReason: loginOk ? null : blockedReason,
      routesChecked: roleRows.length,
      apisChecked: parentApis.length,
      hebrew: roleRows.some((r) => r.hebrew) || parentApis.some((a) => a.hebrew),
      englishLeakage:
        roleRows.some((r) => (r.englishChromeHits || []).length > 0) ||
        parentApis.some((a) => (a.englishChromeHits || []).length > 0),
    };
    await ctx.close();
  }

  // --- Student ---
  {
    const { ctx, page, prefix } = await openLocaleContext(browser, def);
    const loginApi = await apiProbe({
      pathName: "/api/student/login",
      token: null,
      localeId,
      method: "POST",
      body: {
        username: CREDENTIALS.student.username,
        pin: CREDENTIALS.student.pin,
      },
    });
    counters.apis += 1;
    apis.push({ role: "student", locale: localeId, ...loginApi });
    if (loginApi.hebrew) {
      pushFinding(findings, {
        locale: localeId,
        role: "student",
        route: "/api/student/login",
        api: "/api/student/login",
        kind: "hebrew",
        exactText: (loginApi.hebrewSamples || []).join(" | "),
        source: "API response",
        recommendedFix: "Remove Hebrew from student login API",
      });
    }
    let loginOk = false;
    let blockedReason = "";
    {
      const ui = await studentUiLogin(
        page,
        prefix,
        CREDENTIALS.student.username,
        CREDENTIALS.student.pin
      );
      loginOk = ui === true;
      if (!loginOk) {
        blockedReason =
          typeof ui === "object"
            ? ui.error || "student login failed"
            : `still on ${page.url()} apiStatus=${loginApi.status}`;
      }
    }
    counters.loggedInFlows += 1;
    const studentRoutes = ["/student/home", "/student/cards", "/learning"];
    const roleRows = loginOk
      ? await crawlRoutes(page, prefix, studentRoutes, localeId, "student", findings, counters)
      : [];
    rows.push(...roleRows);

    // Authed student APIs via cookie jar from page
    const studentApis = [];
    if (loginOk) {
      const cookieHeader = (await page.context().cookies())
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
      for (const pth of [
        "/api/student/me",
        "/api/student/home-profile/summary",
        "/api/student/rewards/cards/collection",
        "/api/student/rewards/cards/summary",
        "/api/student/diamonds/balance",
      ]) {
        const res = await fetch(`${BASE}${pth}`, {
          headers: {
            Accept: "application/json",
            "Accept-Language": `${localeId},en;q=0.4`,
            Cookie: `${cookieHeader}; lk_global_locale=${localeId}`,
          },
        });
        const text = await res.text();
        const row = {
          path: pth,
          status: res.status,
          hebrew: HE.test(text),
          hebrewSamples: (text.match(/[\u0590-\u05FF][^\n"]{0,40}/g) || []).slice(0, 5),
          englishChromeHits: findEnChrome(text),
          sample: text.slice(0, 220),
        };
        counters.apis += 1;
        studentApis.push(row);
        apis.push({ role: "student", locale: localeId, ...row });
        if (row.hebrew) {
          pushFinding(findings, {
            locale: localeId,
            role: "student",
            route: pth,
            api: pth,
            kind: "hebrew",
            exactText: (row.hebrewSamples || []).join(" | "),
            source: "API response",
            recommendedFix: "Sanitize Hebrew from student API",
          });
        }
        if (row.englishChromeHits.length) {
          pushFinding(findings, {
            locale: localeId,
            role: "student",
            route: pth,
            api: pth,
            kind: "english_leakage",
            exactText: row.englishChromeHits.join(", "),
            source: "API response labels",
            recommendedFix: "Localize student API labels",
          });
        }
      }
    }
    roleSummary.student = {
      loginOk,
      blockedReason: loginOk ? null : blockedReason,
      routesChecked: roleRows.length,
      apisChecked: 1 + studentApis.length,
      hebrew: roleRows.some((r) => r.hebrew) || loginApi.hebrew || studentApis.some((a) => a.hebrew),
      englishLeakage:
        roleRows.some((r) => (r.englishChromeHits || []).length > 0) ||
        studentApis.some((a) => (a.englishChromeHits || []).length > 0),
    };
    await ctx.close();
  }

  // --- Teacher ---
  {
    const { ctx, page, prefix } = await openLocaleContext(browser, def);
    let loginOk = false;
    let blockedReason = "";
    if (!tokens.teacher.ok) {
      blockedReason = `supabase: ${tokens.teacher.reason}`;
    } else {
      const ui = await teacherUiLogin(
        page,
        prefix,
        CREDENTIALS.teacher.email,
        CREDENTIALS.teacher.password
      );
      loginOk = ui === true;
      if (!loginOk) {
        blockedReason =
          typeof ui === "object"
            ? ui.error || "teacher login failed"
            : `still on ${page.url()}`;
      }
    }
    counters.loggedInFlows += 1;
    const teacherRoutes = ["/teacher/dashboard"];
    if (classId) teacherRoutes.push(`/teacher/class/${classId}`);
    const roleRows = loginOk
      ? await crawlRoutes(page, prefix, teacherRoutes, localeId, "teacher", findings, counters)
      : [];
    rows.push(...roleRows);

    const teacherApis = [];
    if (tokens.teacher.ok) {
      const paths = [
        "/api/teacher/me",
        "/api/teacher/classes",
        "/api/teacher/dashboard",
        "/api/teacher/students",
      ];
      if (classId) {
        paths.push(
          `/api/teacher/classes/${classId}/report-data?from=2026-07-07&to=2026-08-06`
        );
      }
      for (const pth of paths) {
        const a = await apiProbe({ pathName: pth, token: tokens.teacher.token, localeId });
        counters.apis += 1;
        teacherApis.push(a);
        apis.push({ role: "teacher", locale: localeId, ...a });
        if (a.hebrew) {
          pushFinding(findings, {
            locale: localeId,
            role: "teacher",
            route: pth,
            api: pth,
            kind: "hebrew",
            exactText: (a.hebrewSamples || []).join(" | "),
            source: "API response",
            recommendedFix: "Sanitize Hebrew from teacher API",
          });
        }
        if ((a.englishChromeHits || []).length) {
          pushFinding(findings, {
            locale: localeId,
            role: "teacher",
            route: pth,
            api: pth,
            kind: "english_leakage",
            exactText: a.englishChromeHits.join(", "),
            source: "API response labels",
            recommendedFix: "Localize teacher API labels",
          });
        }
        if (a.preferredLanguage && a.preferredLanguage !== localeId && pth.endsWith("/me")) {
          pushFinding(findings, {
            locale: localeId,
            role: "teacher",
            route: pth,
            api: pth,
            kind: "preferred_language",
            exactText: `preferredLanguage=${a.preferredLanguage}`,
            source: "API /api/teacher/me",
            recommendedFix:
              "Informational: QA teacher preferredLanguage is en; confirm UI follows interface locale not only profile language",
          });
        }
      }
    }
    roleSummary.teacher = {
      loginOk,
      blockedReason: loginOk ? null : blockedReason,
      routesChecked: roleRows.length,
      apisChecked: teacherApis.length,
      hebrew: roleRows.some((r) => r.hebrew) || teacherApis.some((a) => a.hebrew),
      englishLeakage:
        roleRows.some((r) => (r.englishChromeHits || []).length > 0) ||
        teacherApis.some((a) => (a.englishChromeHits || []).length > 0),
      preferredLanguageNotes: teacherApis
        .filter((a) => a.preferredLanguage)
        .map((a) => a.preferredLanguage),
    };
    await ctx.close();
  }

  // --- School ---
  {
    const { ctx, page, prefix } = await openLocaleContext(browser, def);
    let loginOk = false;
    let blockedReason = "";
    if (!tokens.school.ok) {
      blockedReason = `supabase: ${tokens.school.reason}`;
    } else {
      const ui = await teacherUiLogin(
        page,
        prefix,
        CREDENTIALS.school.email,
        CREDENTIALS.school.password
      );
      loginOk = ui === true;
      if (loginOk && !/school\//.test(page.url())) {
        await page.goto(`${BASE}${withPrefix(prefix, "/school/dashboard")}`, {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });
        await page.waitForTimeout(1500);
      }
      loginOk = loginOk && !/teacher\/login/.test(page.url());
      if (!loginOk) blockedReason = `failed ${page.url()}`;
    }
    counters.loggedInFlows += 1;
    const schoolRoutes = ["/school/dashboard", "/school/students", "/school/teachers"];
    const roleRows = loginOk
      ? await crawlRoutes(page, prefix, schoolRoutes, localeId, "school", findings, counters)
      : [];
    rows.push(...roleRows);

    const schoolApis = [];
    if (tokens.school.ok) {
      for (const pth of [
        "/api/school/dashboard",
        "/api/school/students",
        "/api/school/teachers",
        "/api/school/me",
        "/api/teacher/me",
      ]) {
        const a = await apiProbe({ pathName: pth, token: tokens.school.token, localeId });
        counters.apis += 1;
        schoolApis.push(a);
        apis.push({ role: "school", locale: localeId, ...a });
        if (a.hebrew) {
          pushFinding(findings, {
            locale: localeId,
            role: "school",
            route: pth,
            api: pth,
            kind: "hebrew",
            exactText: (a.hebrewSamples || []).join(" | "),
            source: "API response",
            recommendedFix: "Sanitize Hebrew from school API",
          });
        }
        if ((a.englishChromeHits || []).length) {
          pushFinding(findings, {
            locale: localeId,
            role: "school",
            route: pth,
            api: pth,
            kind: "english_leakage",
            exactText: a.englishChromeHits.join(", "),
            source: "API response labels",
            recommendedFix: "Localize school API labels",
          });
        }
      }
    }
    roleSummary.school = {
      loginOk,
      blockedReason: loginOk ? null : blockedReason,
      routesChecked: roleRows.length,
      apisChecked: schoolApis.length,
      hebrew: roleRows.some((r) => r.hebrew) || schoolApis.some((a) => a.hebrew),
      englishLeakage:
        roleRows.some((r) => (r.englishChromeHits || []).length > 0) ||
        schoolApis.some((a) => (a.englishChromeHits || []).length > 0),
    };
    await ctx.close();
  }

  // Catalog / demo / worksheets public APIs
  for (const pth of [
    "/api/public/worksheets/catalog",
    "/api/public/worksheets/coloring-catalog",
    "/api/demo/catalog",
    "/api/demo/cards/catalog",
    "/api/arcade/games",
  ]) {
    const a = await apiProbe({ pathName: pth, token: null, localeId });
    counters.apis += 1;
    apis.push({ role: "public-api", locale: localeId, ...a });
    if (a.hebrew) {
      pushFinding(findings, {
        locale: localeId,
        role: "public-api",
        route: pth,
        api: pth,
        kind: "hebrew",
        exactText: (a.hebrewSamples || []).join(" | "),
        source: "API response",
        recommendedFix: "Remove Hebrew from public/demo/catalog API",
      });
    }
    if ((a.englishChromeHits || []).length) {
      pushFinding(findings, {
        locale: localeId,
        role: "public-api",
        route: pth,
        api: pth,
        kind: "english_leakage",
        exactText: a.englishChromeHits.join(", "),
        source: "API response labels",
        recommendedFix: "Localize catalog/demo API chrome labels",
      });
    }
  }

  const heUi = findings.filter((f) => f.kind === "hebrew" && f.role !== "public-api" && !f.api);
  const heApi = findings.filter((f) => f.kind === "hebrew" && (f.api || f.role === "public-api"));
  const enUi = findings.filter(
    (f) => f.kind === "english_leakage" && !f.api && f.role !== "public-api"
  );
  const enApi = findings.filter(
    (f) => f.kind === "english_leakage" && (f.api || f.role === "public-api")
  );
  const fallbacks = findings.filter(
    (f) => f.kind === "locale_inactive" || f.kind === "hebrew_fallback"
  );
  const routes = findings.filter((f) => f.kind === "route");
  const rtl = findings.filter((f) => f.kind === "rtl");

  const blockedRoles = Object.entries(roleSummary).filter(
    ([k, v]) => k !== "public" && v && v.loginOk === false
  );
  let status = "PASS";
  const critical = findings.filter((f) => ["critical", "high"].includes(f.severity));
  const medium = findings.filter((f) => f.severity === "medium");
  if (blockedRoles.length) status = "BLOCKED";
  else if (critical.length || medium.length) status = "FAIL";

  // preferred_language alone should not FAIL
  if (status === "FAIL") {
    const actionable = findings.filter(
      (f) => f.kind !== "preferred_language" && f.severity !== "low"
    );
    if (!actionable.length) status = "PASS";
  }

  return {
    localeId,
    status,
    direction: def.direction,
    prefix: publicPrefix(def),
    counters,
    roleSummary,
    findings,
    rows: rows.map((r) => ({
      role: r.role,
      route: r.route,
      status: r.status,
      hebrew: r.hebrew,
      englishChromeHits: r.englishChromeHits,
      dir: r.dir,
      lang: r.lang,
      localeCookie: r.localeCookie,
      url: r.url,
      error: r.error || null,
    })),
    apis: apis.map((a) => ({
      role: a.role,
      path: a.path,
      status: a.status,
      hebrew: a.hebrew,
      englishChromeHits: a.englishChromeHits,
      preferredLanguage: a.preferredLanguage,
    })),
    metrics: {
      publicHebrew: rows.filter((r) => r.role === "public" && r.hebrew).length,
      publicEnglish: rows.filter(
        (r) => r.role === "public" && (r.englishChromeHits || []).length
      ).length,
      loggedInHebrew: rows.filter((r) => r.role !== "public" && r.hebrew).length,
      loggedInEnglish: rows.filter(
        (r) => r.role !== "public" && (r.englishChromeHits || []).length
      ).length,
      apiHebrew: heApi.length,
      apiEnglish: enApi.length,
      fallbackIssues: fallbacks.length,
      routeIssues: routes.length,
      rtlIssues: rtl.length,
      heUi: heUi.length,
      enUi: enUi.length,
    },
  };
}

async function main() {
  fs.writeFileSync(OUT_LOG, "");
  log(`BASE=${BASE}`);
  log(`LOCALES=${MASTER_IDS.join(",")}`);

  const registryMod = await import(
    pathToFileURL(path.join(ROOT, "lib/i18n/locale-registry.js")).href
  );
  const registry = registryMod.LOCALE_REGISTRY;

  // health
  try {
    const ping = await fetch(`${BASE}/`);
    log(`health status=${ping.status}`);
  } catch (err) {
    const report = {
      generatedAt: new Date().toISOString(),
      overallStatus: "BLOCKED",
      reason: `dev server unreachable: ${err?.message || err}`,
      base: BASE,
    };
    fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
    log(JSON.stringify(report, null, 2));
    process.exit(2);
  }

  const tokens = {
    parent: await supabaseToken(CREDENTIALS.parent.email, CREDENTIALS.parent.password),
    teacher: await supabaseToken(CREDENTIALS.teacher.email, CREDENTIALS.teacher.password),
    school: await supabaseToken(CREDENTIALS.school.email, CREDENTIALS.school.password),
  };
  log(
    `tokens parent=${tokens.parent.ok} teacher=${tokens.teacher.ok} school=${tokens.school.ok}`
  );

  let classId = null;
  if (tokens.teacher.ok) {
    try {
      const classes = await apiProbe({
        pathName: "/api/teacher/classes",
        token: tokens.teacher.token,
        localeId: "en",
      });
      const j = JSON.parse(
        (
          await (
            await fetch(`${BASE}/api/teacher/classes`, {
              headers: { Authorization: `Bearer ${tokens.teacher.token}` },
            })
          ).text()
        )
      );
      classId = j?.data?.classes?.[0]?.classId || null;
      log(`teacher classId=${classId} classesStatus=${classes.status}`);
    } catch (err) {
      log(`classId resolve failed: ${err?.message || err}`);
    }
  }

  const browser = await chromium.launch({ headless: true });
  const locales = [];
  for (const id of MASTER_IDS) {
    const def = registry[id];
    if (!def) {
      locales.push({
        localeId: id,
        status: "BLOCKED",
        findings: [
          {
            locale: id,
            kind: "route",
            exactText: "locale missing from registry",
            severity: "critical",
          },
        ],
      });
      continue;
    }
    log(`\n=== ${id} prefix=${publicPrefix(def)} ===`);
    try {
      const result = await verifyLocale(browser, def, tokens, classId);
      locales.push(result);
      log(`STATUS [${id}] ${result.status} findings=${result.findings.length}`);
      // Persist partial progress after each locale.
      fs.writeFileSync(
        OUT_JSON,
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            overallStatus: "RUNNING",
            localesPartial: locales.map((l) => ({
              localeId: l.localeId,
              status: l.status,
              findingsCount: (l.findings || []).length,
            })),
            locales,
          },
          null,
          2
        )
      );
    } catch (err) {
      log(`CRASH [${id}] ${err?.message || err}`);
      locales.push({
        localeId: id,
        status: "BLOCKED",
        findings: [
          {
            locale: id,
            role: "runner",
            route: "(verifyLocale)",
            kind: "route",
            exactText: String(err?.message || err).slice(0, 240),
            severity: "critical",
            source: "script crash",
            recommendedFix: "Re-run after stabilizing consent/login automation",
          },
        ],
        roleSummary: {},
        counters: { routes: 0, apis: 0, loggedInFlows: 0 },
        metrics: {},
      });
    }
  }
  await browser.close();

  const allFindings = locales.flatMap((l) => l.findings || []);
  const actionable = allFindings.filter(
    (f) => f.kind !== "preferred_language" && f.severity !== "low"
  );
  const blocked = locales.filter((l) => l.status === "BLOCKED").length;
  const failed = locales.filter((l) => l.status === "FAIL").length;
  let overallStatus = "PASS";
  if (blocked) overallStatus = "BLOCKED";
  else if (failed || actionable.length) overallStatus = "FAIL";

  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    overallStatus,
    englishSoTRemainsValid: true,
    canProceedToCountryOverlays: overallStatus === "PASS",
    mastersChecked: MASTER_IDS,
    totals: {
      locales: locales.length,
      routes: locales.reduce((n, l) => n + (l.counters?.routes || 0), 0),
      loggedInFlows: locales.reduce((n, l) => n + (l.counters?.loggedInFlows || 0), 0),
      apiResponses: locales.reduce((n, l) => n + (l.counters?.apis || 0), 0),
      findings: allFindings.length,
      actionableFindings: actionable.length,
    },
    roleRollup: ["parent", "student", "teacher", "school"].map((role) => {
      const per = locales.map((l) => ({
        locale: l.localeId,
        ...(l.roleSummary?.[role] || {}),
      }));
      return {
        role,
        loginOkAll: per.every((p) => p.loginOk),
        hebrewFound: per.some((p) => p.hebrew),
        englishLeakageFound: per.some((p) => p.englishLeakage),
        blockedLocales: per.filter((p) => p.loginOk === false).map((p) => p.locale),
        perLocale: per,
      };
    }),
    locales: locales.map((l) => ({
      localeId: l.localeId,
      status: l.status,
      metrics: l.metrics,
      roleSummary: l.roleSummary,
      findingsCount: (l.findings || []).length,
      findings: l.findings,
      counters: l.counters,
    })),
    findings: actionable,
    informational: allFindings.filter(
      (f) => f.kind === "preferred_language" || f.severity === "low"
    ),
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
  log(`\nWROTE ${OUT_JSON}`);
  log(
    JSON.stringify(
      {
        overallStatus: report.overallStatus,
        totals: report.totals,
        localeStatuses: Object.fromEntries(locales.map((l) => [l.localeId, l.status])),
      },
      null,
      2
    )
  );

  if (overallStatus === "PASS") process.exit(0);
  if (overallStatus === "BLOCKED") process.exit(2);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        overallStatus: "BLOCKED",
        reason: String(err?.stack || err),
      },
      null,
      2
    )
  );
  process.exit(2);
});
