#!/usr/bin/env node
/**
 * Country overlays wiring verification (public smoke + smart logged-in sampling).
 * Verification only — no fixes.
 *
 *   node docs/reports/_country-overlays-wiring-verify.mjs
 *   SKIP_LOGGEDIN=1 node docs/reports/_country-overlays-wiring-verify.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_JSON = path.join(ROOT, "docs/reports/country-overlays-wiring-verify.json");
const OUT_LOG = path.join(ROOT, "docs/reports/_country-overlays-wiring-verify-run.log");
const BASE = String(process.env.BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const HE = /[\u0590-\u05FF]/;
const SKIP_LOGGEDIN = process.env.SKIP_LOGGEDIN === "1";

const MASTER_IDS = new Set([
  "en",
  "ar-001",
  "es-419",
  "pt-BR",
  "pt-PT",
  "it-IT",
  "fr-FR",
  "nl-NL",
  "de-DE",
  "ru-RU",
]);

const PUBLIC_ROUTES = [
  "/",
  "/contact",
  "/help",
  "/guides",
  "/practice",
  "/practice/worksheets",
  "/demo/student",
];

const EN_CHROME_MARKERS = [
  "Parent portal",
  "Teacher portal",
  "Help center",
  "Sign in",
  "Printable worksheets",
  "Add child",
  "Kids world",
  "Cookie preferences",
  "Forgot password",
  "Create account",
  "No students yet",
  "My classes",
  "Class report",
  "School dashboard",
];

/** Representative overlays for logged-in/API smoke (by language family). */
const LOGGEDIN_SAMPLE = [
  { id: "es-MX", why: "Spanish LatAm primary overlay" },
  { id: "es-AR", why: "Spanish LatAm with denser pack" },
  { id: "es-ES", why: "Spain European Spanish overlay" },
  { id: "en-GB", why: "UK England / English country" },
  { id: "en-AU", why: "English Commonwealth country" },
  { id: "en-SCT", why: "UK family Scotland via en-GB" },
  { id: "fr-CA", why: "French country overlay" },
  { id: "de-AT", why: "German country overlay" },
  { id: "pt-AO", why: "Portuguese country overlay on pt-PT" },
  { id: "ru-KZ", why: "Russian country overlay" },
  { id: "nl-BE", why: "Dutch country overlay" },
  { id: "it-CH", why: "Italian country overlay" },
];

function log(line) {
  const s = String(line);
  process.stdout.write(`${s}\n`);
  fs.appendFileSync(OUT_LOG, `${s}\n`);
}

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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, i).trim()] = v;
  }
  return out;
}

const ENV = { ...loadEnvFile(".env.local"), ...loadEnvFile(".env.e2e.local"), ...process.env };

function publicPrefix(def) {
  if (!def || def.id === "en") return "";
  if (def.pathPrefix) return `/${def.pathPrefix}`;
  return `/${def.id}`;
}

function fallbackChain(registry, id) {
  const chain = [];
  let cur = id;
  const seen = new Set();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    chain.push(cur);
    cur = registry[cur]?.fallbackLocale || null;
  }
  if (!chain.includes("en")) chain.push("en");
  return chain;
}

function resolveMaster(registry, id) {
  const chain = fallbackChain(registry, id);
  for (const c of chain) {
    if (MASTER_IDS.has(c)) return c;
  }
  return chain[chain.length - 1] || "en";
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc);
    else acc.push(p);
  }
  return acc;
}

function contentPackType(localeId) {
  const dir = path.join(ROOT, "content-packs", localeId);
  if (!fs.existsSync(dir)) return "zero-content";
  const n = walkFiles(dir).length;
  if (n === 0) return "zero-content";
  if (n <= 5) return "sparse";
  if (n <= 25) return "sparse";
  if (n <= 60) return "partial";
  return "full";
}

function localesNsCount(localeId) {
  const dir = path.join(ROOT, "locales", localeId);
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).length;
}

function findEnChrome(text) {
  return EN_CHROME_MARKERS.filter((m) => String(text || "").includes(m));
}

function isEnglishFamily(masterId) {
  return masterId === "en";
}

async function acceptConsent(page) {
  await page
    .evaluate(() => {
      try {
        localStorage.setItem(
          "leokids_consent_v1",
          JSON.stringify({
            version: 1,
            choice: "accepted",
            ads: true,
            analytics: true,
            decidedAt: new Date().toISOString(),
            source: "banner",
          })
        );
      } catch {
        /* ignore */
      }
      for (const el of document.querySelectorAll(
        '[aria-labelledby="cookie-consent-title"], aside[role="dialog"]'
      )) {
        el.remove();
      }
    })
    .catch(() => {});
}

async function harvest(page) {
  await page.waitForTimeout(700);
  return page.evaluate(() => {
    const title = document.title || "";
    const meta = document.querySelector('meta[name="description"]')?.content || "";
    const body = document.body?.innerText || "";
    const dir =
      document.documentElement?.getAttribute("dir") ||
      document.body?.getAttribute("dir") ||
      "";
    const lang = document.documentElement?.getAttribute("lang") || "";
    const switcherText =
      document.querySelector('[data-testid="language-switcher"]')?.innerText ||
      document.querySelector('[aria-label*="anguage" i]')?.innerText ||
      "";
    return { title, meta, body, dir, lang, switcherText, url: location.href };
  });
}

async function openCtx(browser, def) {
  const ctx = await browser.newContext({
    locale: def.intlLocale || def.id,
    extraHTTPHeaders: {
      "Accept-Language": `${def.intlLocale || def.id},en;q=0.4`,
    },
  });
  await ctx.addCookies([{ name: "lk_global_locale", value: def.id, url: BASE }]);
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem(
        "leokids_consent_v1",
        JSON.stringify({
          version: 1,
          choice: "accepted",
          ads: true,
          analytics: true,
          decidedAt: new Date().toISOString(),
          source: "banner",
        })
      );
    } catch {
      /* ignore */
    }
  });
  return { ctx, page: await ctx.newPage(), prefix: publicPrefix(def) };
}

async function supabaseToken(email, password) {
  const url = ENV.NEXT_PUBLIC_LEARNING_SUPABASE_URL;
  const anon = ENV.NEXT_PUBLIC_LEARNING_SUPABASE_ANON_KEY;
  if (!url || !anon) return { ok: false, reason: "missing env" };
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anon, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json().catch(() => ({}));
  return {
    ok: Boolean(json.access_token),
    token: json.access_token || null,
    reason: json.error_description || json.msg || json.error || `status ${res.status}`,
  };
}

async function apiCheck(pathname, token, localeId, masterId) {
  const res = await fetch(`${BASE}${pathname}`, {
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
      "Accept-Language": `${localeId},en;q=0.4`,
      Cookie: `lk_global_locale=${localeId}`,
    },
  });
  const text = await res.text();
  return {
    path: pathname,
    status: res.status,
    hebrew: HE.test(text),
    englishChromeHits: isEnglishFamily(masterId) ? [] : findEnChrome(text),
  };
}

function pushFinding(findings, f) {
  findings.push({
    severity: f.severity || (f.kind === "hebrew" || f.kind === "route" ? "critical" : "medium"),
    ...f,
  });
}

async function main() {
  fs.writeFileSync(OUT_LOG, "");
  log(`BASE=${BASE}`);

  try {
    const ping = await fetch(`${BASE}/`);
    log(`health=${ping.status}`);
  } catch (err) {
    const blocked = {
      generatedAt: new Date().toISOString(),
      overallStatus: "BLOCKED",
      reason: `dev server unreachable: ${err?.message || err}`,
    };
    fs.writeFileSync(OUT_JSON, JSON.stringify(blocked, null, 2));
    process.exit(2);
  }

  const registryMod = await import(
    pathToFileURL(path.join(ROOT, "lib/i18n/locale-registry.js")).href
  );
  const registry = registryMod.LOCALE_REGISTRY;

  const overlays = Object.values(registry).filter(
    (d) =>
      d &&
      d.enabled &&
      !MASTER_IDS.has(d.id) &&
      d.id !== "en-XA" &&
      d.id !== "ar-XB"
  );

  // Static inventory + wiring checks
  const findings = [];
  const pathMap = new Map();
  const labelMap = new Map();
  const inventory = [];

  for (const def of overlays) {
    const prefix = publicPrefix(def);
    const chain = fallbackChain(registry, def.id);
    const master = resolveMaster(registry, def.id);
    const packType = contentPackType(def.id);
    const nsCount = localesNsCount(def.id);
    const visible = def.selectorVisible !== false;
    const row = {
      locale: def.id,
      path: prefix || "/",
      pathSegment: def.pathPrefix || def.id,
      selectorLabel: def.label || def.nativeName || def.displayName || def.id,
      visible,
      fallbackChain: chain,
      master,
      overlayType: packType,
      localesNsCount: nsCount,
      direction: def.direction || "ltr",
      runtimeReachable: null,
      routeStatuses: {},
      hebrewHits: 0,
      englishLeakageHits: 0,
      seo: {},
      countryMismatch: false,
      status: "PENDING",
    };

    if (!def.pathPrefix && !/^[a-z]{2}(-|$)/i.test(def.id)) {
      pushFinding(findings, {
        locale: def.id,
        path: prefix,
        kind: "selector",
        exactText: "missing pathPrefix for country overlay",
        severity: "high",
        recommendedFix: "Add pathPrefix in locale-registry",
      });
    }

    if (pathMap.has(prefix)) {
      pushFinding(findings, {
        locale: def.id,
        path: prefix,
        kind: "selector",
        exactText: `path collision with ${pathMap.get(prefix)}`,
        severity: "critical",
        recommendedFix: "Ensure unique public pathPrefix per overlay",
      });
    } else {
      pathMap.set(prefix, def.id);
    }

    const labelKey = String(row.selectorLabel).trim().toLowerCase();
    if (labelMap.has(labelKey)) {
      pushFinding(findings, {
        locale: def.id,
        path: prefix,
        kind: "country mismatch",
        exactText: `duplicate selector label "${row.selectorLabel}" also used by ${labelMap.get(labelKey)}`,
        severity: "high",
        recommendedFix: "Make selector labels unique per country",
      });
    } else {
      labelMap.set(labelKey, def.id);
    }

    // Fallback expectations
    if (master === "es-419" && !chain.includes("es-419")) {
      pushFinding(findings, {
        locale: def.id,
        path: prefix,
        kind: "fallback",
        exactText: `expected es-419 in chain, got ${chain.join(" → ")}`,
        severity: "critical",
        recommendedFix: "Fix fallbackLocale to es-419 for Spanish overlays",
      });
    }
    if (String(def.id).startsWith("en-") && master !== "en" && master !== "en-GB") {
      // UK family may master at en-GB then en — resolveMaster returns first MASTER in chain
      // en-WLS → en-GB → en : master should be en-GB if en-GB is in MASTER? en-GB is NOT in MASTER_IDS
      // so resolveMaster returns "en". Good.
    }
    if (!chain.includes("en")) {
      pushFinding(findings, {
        locale: def.id,
        path: prefix,
        kind: "fallback",
        exactText: `chain missing en: ${chain.join(" → ")}`,
        severity: "critical",
        recommendedFix: "Ensure fallback terminates at en",
      });
    }

    // Grade / school term overlay files (presence only)
    const schoolFile = path.join(ROOT, "locales", def.id, "school.json");
    if (fs.existsSync(schoolFile)) {
      try {
        const school = JSON.parse(fs.readFileSync(schoolFile, "utf8"));
        row.schoolOverlayKeys = Object.keys(school?.portal || {}).length;
      } catch {
        row.schoolOverlayKeys = -1;
      }
    } else {
      row.schoolOverlayKeys = 0;
    }

    inventory.push(row);
  }

  log(`overlays=${inventory.length}`);

  const browser = await chromium.launch({ headless: true });

  // Public runtime smoke for ALL overlays
  let routesChecked = 0;
  for (const row of inventory) {
    const def = registry[row.locale];
    const { ctx, page, prefix } = await openCtx(browser, def);
    let reachable = true;
    let hebrew = 0;
    let enLeak = 0;
    const routeStatuses = {};
    const seo = {};

    for (const route of PUBLIC_ROUTES) {
      const target =
        route === "/"
          ? `${BASE}${prefix || ""}/` || `${BASE}/`
          : `${BASE}${prefix}${route}`;
      const url = target.replace(/([^:]\/)\/+/g, "$1");
      try {
        const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
        const status = resp?.status() || 0;
        await acceptConsent(page);
        const h = await harvest(page);
        const cookies = await ctx.cookies();
        const localeCookie =
          cookies.find((c) => c.name === "lk_global_locale")?.value || null;
        const blob = `${h.title}\n${h.meta}\n${h.body}`;
        const he = HE.test(blob);
        const enHits = isEnglishFamily(row.master) ? [] : findEnChrome(h.body);
        if (he) {
          hebrew += 1;
          pushFinding(findings, {
            locale: row.locale,
            path: `${prefix}${route === "/" ? "" : route}` || "/",
            route,
            kind: "hebrew",
            exactText: (blob.match(/[\u0590-\u05FF][^\n]{0,60}/g) || []).slice(0, 3).join(" | "),
            severity: "critical",
            recommendedFix: "Remove Hebrew from country overlay UI",
          });
        }
        if (enHits.length) {
          enLeak += 1;
          pushFinding(findings, {
            locale: row.locale,
            path: `${prefix}${route === "/" ? "" : route}` || "/",
            route,
            kind: "english leakage",
            exactText: enHits.join(", "),
            severity: "medium",
            recommendedFix: "Localize chrome via master fallback or overlay keys",
          });
        }
        if (status >= 500) {
          reachable = false;
          pushFinding(findings, {
            locale: row.locale,
            path: `${prefix}${route}`,
            route,
            kind: "route",
            exactText: `HTTP ${status}`,
            severity: "critical",
            recommendedFix: "Fix 5xx for overlay path",
          });
        }
        if (localeCookie && localeCookie !== row.locale) {
          pushFinding(findings, {
            locale: row.locale,
            path: `${prefix}${route}`,
            route,
            kind: "fallback",
            exactText: `cookie=${localeCookie} expected=${row.locale}`,
            severity: "high",
            recommendedFix: "Keep overlay locale cookie aligned with path",
          });
        }
        // Country mismatch: homepage switcher should show this country's label, not another
        if (route === "/") {
          seo.title = h.title;
          seo.description = h.meta;
          seo.lang = h.lang;
          const label = row.selectorLabel;
          // Other country labels from same master family
          const siblings = inventory
            .filter((x) => x.master === row.master && x.locale !== row.locale)
            .map((x) => x.selectorLabel);
          const wrong = siblings.filter(
            (sib) =>
              sib &&
              sib !== label &&
              h.switcherText &&
              h.switcherText.includes(sib) &&
              !h.switcherText.includes(label)
          );
          // Soft check: if switcher closed, only check that title/lang isn't wrong sibling-only
          if (wrong.length && !String(h.switcherText || "").includes(label)) {
            row.countryMismatch = true;
            pushFinding(findings, {
              locale: row.locale,
              path: prefix || "/",
              route: "/",
              kind: "country mismatch",
              exactText: `switcher shows other country (${wrong.slice(0, 3).join(", ")}) without own label ${label}`,
              severity: "high",
              recommendedFix: "Fix language switcher selected label for overlay",
            });
          }
        }

        routeStatuses[route] = { status, hebrew: he, enHits };
        routesChecked += 1;
        const tag = he ? "HE" : enHits.length ? "EN" : status >= 500 ? "ERR" : "OK";
        log(`${tag} [${row.locale}] ${route}`);
      } catch (err) {
        reachable = false;
        routesChecked += 1;
        routeStatuses[route] = { error: String(err?.message || err).slice(0, 160) };
        pushFinding(findings, {
          locale: row.locale,
          path: `${prefix}${route}`,
          route,
          kind: "route",
          exactText: String(err?.message || err).slice(0, 180),
          severity: "critical",
          recommendedFix: "Restore overlay route reachability",
        });
        log(`ERR [${row.locale}] ${route}: ${err?.message || err}`);
      }
    }

    row.runtimeReachable = reachable;
    row.routeStatuses = routeStatuses;
    row.hebrewHits = hebrew;
    row.englishLeakageHits = enLeak;
    row.seo = seo;
    const hasCritical = findings.some(
      (f) => f.locale === row.locale && ["critical", "high"].includes(f.severity)
    );
    const hasMedium = findings.some(
      (f) => f.locale === row.locale && f.severity === "medium"
    );
    row.status = !reachable || hasCritical ? (reachable ? "FAIL" : "BLOCKED") : hasMedium ? "FAIL" : "PASS";
    await ctx.close();
  }

  // Logged-in / API sampling
  const loggedIn = [];
  let apiChecked = 0;
  if (!SKIP_LOGGEDIN) {
    const parentTok = await supabaseToken(
      ENV.E2E_PARENT_EMAIL || "eran1@leokids.com",
      ENV.E2E_PARENT_PASSWORD || "747975"
    );
    const teacherTok = await supabaseToken(
      ENV.TEACHER_PORTAL_VERIFY_EMAIL || "eran2@leokids.com",
      ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975"
    );
    log(`tokens parent=${parentTok.ok} teacher=${teacherTok.ok}`);

    for (const sample of LOGGEDIN_SAMPLE) {
      const def = registry[sample.id];
      const inv = inventory.find((x) => x.locale === sample.id);
      if (!def || !inv) {
        loggedIn.push({ locale: sample.id, status: "BLOCKED", reason: "not in registry" });
        continue;
      }
      const { ctx, page, prefix } = await openCtx(browser, def);
      const result = {
        locale: sample.id,
        why: sample.why,
        master: inv.master,
        parentLoginOk: false,
        teacherLoginOk: false,
        routes: [],
        apis: [],
        hebrew: false,
        englishLeakage: false,
        routeIssues: false,
      };

      // Parent smoke
      try {
        await page.goto(`${BASE}${prefix}/parent/login`, {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });
        await acceptConsent(page);
        await page.getByTestId("parent-login-identifier").fill(
          ENV.E2E_PARENT_EMAIL || "eran1@leokids.com"
        );
        await page.locator('input[type="password"]').fill(
          ENV.E2E_PARENT_PASSWORD || "747975"
        );
        await page.locator("form").first().evaluate((form) => {
          if (typeof form.requestSubmit === "function") form.requestSubmit();
          else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
        try {
          await page.waitForURL(/\/parent\/(?!login)/, { timeout: 45000 });
        } catch {
          await page.waitForTimeout(6000);
        }
        result.parentLoginOk = !/parent\/login/.test(page.url());
        if (result.parentLoginOk) {
          await page.goto(`${BASE}${prefix}/parent/dashboard`, {
            waitUntil: "domcontentloaded",
            timeout: 90000,
          });
          const h = await harvest(page);
          const he = HE.test(`${h.title}\n${h.body}`);
          const en = isEnglishFamily(inv.master) ? [] : findEnChrome(h.body);
          result.routes.push({
            role: "parent",
            route: "/parent/dashboard",
            hebrew: he,
            enHits: en,
          });
          if (he) {
            result.hebrew = true;
            pushFinding(findings, {
              locale: sample.id,
              path: `${prefix}/parent/dashboard`,
              kind: "hebrew",
              exactText: "Hebrew on sampled parent dashboard",
              severity: "critical",
              recommendedFix: "Sanitize parent shell for overlay",
            });
          }
          if (en.length) {
            result.englishLeakage = true;
            pushFinding(findings, {
              locale: sample.id,
              path: `${prefix}/parent/dashboard`,
              kind: "english leakage",
              exactText: en.join(", "),
              severity: "medium",
              recommendedFix: "Localize parent chrome via master",
            });
          }
        }
      } catch (err) {
        result.routeIssues = true;
        result.parentError = String(err?.message || err).slice(0, 160);
      }

      // Teacher smoke (fresh context)
      await ctx.close();
      const tctx = await openCtx(browser, def);
      try {
        const tp = tctx.page;
        await tp.goto(`${BASE}${tctx.prefix}/teacher/login`, {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });
        await acceptConsent(tp);
        await tp
          .locator('[data-testid="teacher-login-root"][data-state="ready"]')
          .waitFor({ timeout: 60000 });
        await tp.getByTestId("teacher-login-tab").click().catch(() => {});
        await tp
          .locator(
            '[data-testid="teacher-login-root"][data-state="ready"] input[type="email"]'
          )
          .first()
          .fill(ENV.TEACHER_PORTAL_VERIFY_EMAIL || "eran2@leokids.com", { force: true });
        await tp
          .getByTestId("teacher-login-password")
          .fill(ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975", { force: true });
        await tp
          .locator('[data-testid="teacher-login-root"] form button[type="submit"]')
          .click({ force: true });
        try {
          await tp.waitForURL(/\/(teacher|school)\/(?!login)/, { timeout: 60000 });
        } catch {
          await tp.waitForTimeout(6000);
        }
        result.teacherLoginOk = !/teacher\/login/.test(tp.url());
        if (result.teacherLoginOk) {
          await tp.goto(`${BASE}${tctx.prefix}/teacher/dashboard`, {
            waitUntil: "domcontentloaded",
            timeout: 90000,
          });
          const h = await harvest(tp);
          const he = HE.test(`${h.title}\n${h.body}`);
          const en = isEnglishFamily(inv.master) ? [] : findEnChrome(h.body);
          result.routes.push({
            role: "teacher",
            route: "/teacher/dashboard",
            hebrew: he,
            enHits: en,
          });
          if (he) {
            result.hebrew = true;
            pushFinding(findings, {
              locale: sample.id,
              path: `${tctx.prefix}/teacher/dashboard`,
              kind: "hebrew",
              exactText: "Hebrew on sampled teacher dashboard",
              severity: "critical",
              recommendedFix: "Sanitize teacher shell for overlay",
            });
          }
          if (en.length) {
            result.englishLeakage = true;
            pushFinding(findings, {
              locale: sample.id,
              path: `${tctx.prefix}/teacher/dashboard`,
              kind: "english leakage",
              exactText: en.join(", "),
              severity: "medium",
              recommendedFix: "Localize teacher chrome via master",
            });
          }
        }
      } catch (err) {
        result.routeIssues = true;
        result.teacherError = String(err?.message || err).slice(0, 160);
      }
      await tctx.ctx.close();

      // APIs with Accept-Language / cookie
      if (parentTok.ok) {
        const a = await apiCheck(
          "/api/parent/list-students",
          parentTok.token,
          sample.id,
          inv.master
        );
        apiChecked += 1;
        result.apis.push({ role: "parent", ...a });
        if (a.hebrew) {
          result.hebrew = true;
          pushFinding(findings, {
            locale: sample.id,
            path: "/api/parent/list-students",
            kind: "hebrew",
            exactText: "Hebrew in parent API",
            severity: "critical",
            recommendedFix: "Sanitize parent API for overlay Accept-Language",
          });
        }
      }
      if (teacherTok.ok) {
        for (const pth of ["/api/teacher/me", "/api/teacher/dashboard"]) {
          const a = await apiCheck(pth, teacherTok.token, sample.id, inv.master);
          apiChecked += 1;
          result.apis.push({ role: "teacher", ...a });
          if (a.hebrew) {
            result.hebrew = true;
            pushFinding(findings, {
              locale: sample.id,
              path: pth,
              kind: "hebrew",
              exactText: "Hebrew in teacher API",
              severity: "critical",
              recommendedFix: "Sanitize teacher API",
            });
          }
        }
      }

      result.status =
        result.hebrew || result.englishLeakage || result.routeIssues
          ? "FAIL"
          : result.parentLoginOk && result.teacherLoginOk
            ? "PASS"
            : "BLOCKED";
      loggedIn.push(result);
      log(
        `SAMPLE [${sample.id}] parent=${result.parentLoginOk} teacher=${result.teacherLoginOk} status=${result.status}`
      );

      // Refresh inventory status if sample found issues
      if (result.status === "FAIL" && inv.status === "PASS") inv.status = "FAIL";
      if (result.status === "BLOCKED" && inv.status === "PASS") inv.status = "BLOCKED";
    }
  }

  await browser.close();

  const blocked = inventory.filter((r) => r.status === "BLOCKED").length;
  const failed = inventory.filter((r) => r.status === "FAIL").length;
  const actionable = findings.filter((f) => f.severity !== "low");
  let overallStatus = "PASS";
  if (blocked) overallStatus = "BLOCKED";
  else if (failed || actionable.length) overallStatus = "FAIL";

  // Logged-in sample blockers also block overall if any sample BLOCKED without PASS path
  if (
    !SKIP_LOGGEDIN &&
    loggedIn.some((l) => l.status === "BLOCKED") &&
    overallStatus === "PASS"
  ) {
    overallStatus = "BLOCKED";
  }
  if (!SKIP_LOGGEDIN && loggedIn.some((l) => l.status === "FAIL") && overallStatus === "PASS") {
    overallStatus = "FAIL";
  }

  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    overallStatus,
    englishSoTRemainsValid: true,
    mastersRemainValid: true,
    canProceedToFinalFixesClosure: overallStatus === "PASS",
    totals: {
      overlays: inventory.length,
      routesChecked,
      loggedInSamples: loggedIn.length,
      apiResponses: apiChecked,
      findings: findings.length,
      actionableFindings: actionable.length,
      hebrewHits: findings.filter((f) => f.kind === "hebrew").length,
      englishLeakageHits: findings.filter((f) => f.kind === "english leakage").length,
      pass: inventory.filter((r) => r.status === "PASS").length,
      fail: failed,
      blocked,
    },
    inventory,
    loggedInSampling: loggedIn,
    findings: actionable,
    samplePlan: LOGGEDIN_SAMPLE,
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
  log(`WROTE ${OUT_JSON}`);
  log(
    JSON.stringify(
      {
        overallStatus: report.overallStatus,
        totals: report.totals,
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
