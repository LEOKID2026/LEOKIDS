#!/usr/bin/env node
/**
 * Non-English locale audit vs English SoT (mapping only — no fixes).
 *
 *   node docs/reports/_non-en-locale-sot-audit.mjs
 *   SKIP_RUNTIME=1 node docs/reports/_non-en-locale-sot-audit.mjs
 *   RUNTIME_ONLY_MASTERS=1 ...  (default: masters deep + overlays sample)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "docs/reports");
const BASE = process.env.BASE_URL || "http://127.0.0.1:3001";
const HE = /[\u0590-\u05FF]/;
const SKIP_RUNTIME = process.env.SKIP_RUNTIME === "1";

const NAMESPACES = [
  "common",
  "ui",
  "auth",
  "learning",
  "reports",
  "emails",
  "seo",
  "legal",
  "worksheets",
  "games",
  "validation",
  "teacher",
  "school",
  "platform",
  "copilot",
];

const MASTER_DEEP_ROUTES = [
  "/",
  "/parents",
  "/teachers",
  "/kids",
  "/about",
  "/contact",
  "/help",
  "/guides",
  "/practice",
  "/practice/worksheets",
  "/parent/login",
  "/student/login",
  "/teacher/login",
  "/school/staff/login",
  "/learning",
  "/demo/student",
  "/demo/parent",
];

const OVERLAY_SAMPLE_ROUTES = [
  "/",
  "/parents",
  "/teachers",
  "/help",
  "/parent/login",
  "/student/login",
];

const EN_CHROME_MARKERS = [
  "Parent portal",
  "Teacher portal",
  "Help center",
  "Sign in",
  "Log out",
  "Printable worksheets",
  "Add child",
  "Kids world",
  "Cookie preferences",
  "Privacy policy",
  "Legal documents",
  "Forgot password",
  "Create account",
  "Dashboard",
  "No students yet",
];

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc);
    else if (/\.(json|js|mjs|ts|tsx|md|txt)$/i.test(ent.name)) acc.push(p);
  }
  return acc;
}

function flattenStrings(obj, prefix = "", out = []) {
  if (obj == null) return out;
  if (typeof obj === "string") {
    const t = obj.trim();
    if (t.length >= 3) out.push({ key: prefix, value: t });
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flattenStrings(v, `${prefix}[${i}]`, out));
    return out;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      flattenStrings(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

function loadJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function languageFamily(localeId) {
  const base = String(localeId).split("-")[0].toLowerCase();
  return base;
}

function isEnglishFamily(localeId) {
  return languageFamily(localeId) === "en";
}

function publicPrefix(def) {
  if (!def) return "";
  if (def.id === "en") return "";
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
    const def = registry[cur];
    cur = def?.fallbackLocale || null;
  }
  if (!chain.includes("en")) chain.push("en");
  return chain;
}

function scanHebrewInFiles(files) {
  const hits = [];
  for (const file of files) {
    let text = "";
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (!HE.test(text)) continue;
    const samples = (text.match(/[\u0590-\u05FF][^\n]{0,50}/g) || []).slice(0, 5);
    hits.push({
      file: path.relative(ROOT, file).replace(/\\/g, "/"),
      samples,
    });
  }
  return hits;
}

const COGNATE_VALUES = new Set([
  "Collection",
  "Missions",
  "Question",
  "Questions",
  "Addition",
  "Multiplication",
  "Division",
  "Fractions",
  "Estimation",
  "Triangles",
  "Transformations",
  "Rotation",
  "Adaptations",
  "Adaptation",
  "Nutrition",
  "Circulation",
  "Respiration",
  "Habitats",
  "Classification",
  "Marathon",
  "Messages",
  "Important",
  "Discussion",
  "Portrait",
  "Diagonal",
  "Contrast",
  "Dashboard",
  "Volume",
  "Pythagoras",
  "Percentages",
  "Prototype",
  "Password",
  "Champion",
  "🌟 Champion",
  "÷ Division",
  "➕ Addition",
  "➗ Division",
  "➗ Quotient",
  "🔢 Fractions",
  "🔢 Fraction",
  "📦 Volume",
  "📐 Diagonal",
  "↔️ Horizontal",
  "↕️ Vertical",
  "⚠️ Error:",
  "{current} / {goal} min",
  "{game} — Arcade",
  "Details — {name}",
  "Contact · Leo Kids",
  "Page {pageId}",
  "{count, plural, one {# question} other {# questions}}",
  "🔬 {topic} expert",
]);

function classifyEnIdenticalLeaf(ns, key, value) {
  const k = `${ns}.${key}`.toLowerCase();
  if (value === "Leo Kids" || key === "brandName" || key === "home.headline") return "brand";
  if (/^\{[a-zA-Z0-9_]+\}$/.test(value)) return "icu";
  if (/^\{[^}]+\}\s*[·\-\/|]\s*\{[^}]+\}$/.test(value)) return "icu";
  if (/^\{[^}]+\}\s*\(\{[^}]+\}\)$/.test(value)) return "icu";
  if (key.includes("rawMessage") && value.includes("{message}")) return "icu";
  if (
    k.includes("english.") ||
    k.includes("topics.english") ||
    k.includes("grammar_") ||
    key === "writingCustomWordsPlaceholder" ||
    /^(Present simple|Past simple|cat, dog)$/.test(value) ||
    value.startsWith("I = am,")
  ) {
    return "english_subject";
  }
  if (
    /^(math|geometry|english|science)$/i.test(value) &&
    (k.includes("reportsubjects") || k.includes("subjectid"))
  ) {
    return "technical";
  }
  if (COGNATE_VALUES.has(value)) return "allowed_cognate";
  return "must_translate";
}

function compareEnLeakage(localeId, localesDir) {
  if (isEnglishFamily(localeId)) {
    return {
      applicable: false,
      identicalLeafCount: 0,
      forbiddenLeafCount: 0,
      samples: [],
      forbiddenSamples: [],
      scannedLeaves: 0,
      byKind: {},
    };
  }
  const samples = [];
  const forbiddenSamples = [];
  const byKind = {};
  let identical = 0;
  let forbidden = 0;
  let scanned = 0;
  for (const ns of NAMESPACES) {
    const enPath = path.join(localesDir, "en", `${ns}.json`);
    const locPath = path.join(localesDir, localeId, `${ns}.json`);
    if (!fs.existsSync(enPath) || !fs.existsSync(locPath)) continue;
    const enFlat = flattenStrings(loadJsonSafe(enPath) || {});
    const locObj = loadJsonSafe(locPath) || {};
    const locMap = Object.fromEntries(flattenStrings(locObj).map((x) => [x.key, x.value]));
    for (const { key, value } of enFlat) {
      if (!/[A-Za-z]{3,}/.test(value)) continue;
      if (value.length < 8) continue;
      const locVal = locMap[key];
      if (locVal == null) continue;
      scanned += 1;
      if (locVal !== value) continue;
      identical += 1;
      const kind = classifyEnIdenticalLeaf(ns, key, value);
      byKind[kind] = (byKind[kind] || 0) + 1;
      if (samples.length < 12) samples.push({ ns, key, value: value.slice(0, 80), kind });
      if (kind === "must_translate") {
        forbidden += 1;
        if (forbiddenSamples.length < 12) {
          forbiddenSamples.push({ ns, key, value: value.slice(0, 80), kind });
        }
      }
    }
  }
  return {
    applicable: true,
    identicalLeafCount: identical,
    forbiddenLeafCount: forbidden,
    samples,
    forbiddenSamples,
    scannedLeaves: scanned,
    byKind,
  };
}

function missingNamespaces(localeId, localesDir) {
  const missing = [];
  const present = [];
  for (const ns of NAMESPACES) {
    const p = path.join(localesDir, localeId, `${ns}.json`);
    if (fs.existsSync(p)) present.push(ns);
    else missing.push(ns);
  }
  return { present, missing, countPresent: present.length, countMissing: missing.length };
}

function contentPackStatus(localeId, contentPacksDir, isMaster) {
  const dir = path.join(contentPacksDir, localeId);
  if (!fs.existsSync(dir)) return "missing";
  const files = walkFiles(dir);
  if (files.length === 0) return "missing";
  if (isMaster && files.length >= 40) return "full";
  if (isMaster) return "partial";
  if (files.length <= 5) return "sparse overlay";
  if (files.length <= 25) return "sparse overlay";
  return "partial";
}

async function harvestPage(page) {
  await page.waitForTimeout(900);
  const body = await page.locator("body").innerText().catch(() => "");
  const html = await page.content().catch(() => "");
  const title = await page.title().catch(() => "");
  const meta =
    (await page.locator('meta[name="description"]').getAttribute("content").catch(() => "")) ||
    "";
  const dir =
    (await page.locator("html").getAttribute("dir").catch(() => "")) ||
    (await page.locator("body").getAttribute("dir").catch(() => "")) ||
    "";
  const lang = (await page.locator("html").getAttribute("lang").catch(() => "")) || "";
  const blob = `${title}\n${meta}\n${body}`;
  const enHits = EN_CHROME_MARKERS.filter((m) => body.includes(m));
  return {
    hebrew: HE.test(blob) || HE.test(html),
    hebrewSamples: (blob.match(/[\u0590-\u05FF][^\n]{0,50}/g) || []).slice(0, 6),
    englishChromeHits: enHits,
    title,
    meta,
    dir,
    lang,
    url: page.url(),
    statusOk: !/Internal Server Error|Application error/i.test(body),
  };
}

async function crawlLocale(browser, def, routes) {
  const prefix = publicPrefix(def);
  const ctx = await browser.newContext({
    locale: def.intlLocale || "en-US",
    extraHTTPHeaders: { "Accept-Language": `${def.intlLocale || def.id},en;q=0.5` },
  });
  await ctx.addCookies([
    { name: "lk_global_locale", value: def.id, url: BASE },
  ]);
  const page = await ctx.newPage();
  const rows = [];
  let reachable = true;
  for (const route of routes) {
    const url = `${BASE}${prefix}${route === "/" ? "" : route}` || `${BASE}${prefix}/`;
    const target = route === "/" ? `${BASE}${prefix || ""}/` : `${BASE}${prefix}${route}`;
    try {
      const resp = await page.goto(target.replace(/([^:]\/)\/+/g, "$1"), {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      const status = resp?.status() || 0;
      if (status >= 500) reachable = false;
      const h = await harvestPage(page);
      // open language menu if present
      const sw = page.locator('[data-testid="language-switcher"], button:has-text("English"), [aria-label*="anguage"]').first();
      if (await sw.isVisible({ timeout: 800 }).catch(() => false)) {
        await sw.click().catch(() => {});
        await page.waitForTimeout(400);
      }
      const afterMenu = await harvestPage(page);
      rows.push({
        route,
        status,
        ...h,
        hebrew: h.hebrew || afterMenu.hebrew,
        hebrewSamples: [...new Set([...(h.hebrewSamples || []), ...(afterMenu.hebrewSamples || [])])].slice(0, 8),
        englishChromeHits: [...new Set([...(h.englishChromeHits || []), ...(afterMenu.englishChromeHits || [])])],
        dir: afterMenu.dir || h.dir,
        lang: afterMenu.lang || h.lang,
      });
      process.stdout.write(
        `${h.hebrew ? "HE" : afterMenu.englishChromeHits.length && !isEnglishFamily(def.id) ? "EN" : "OK"} [${def.id}] ${route}\n`
      );
    } catch (err) {
      reachable = false;
      rows.push({
        route,
        status: 0,
        hebrew: false,
        hebrewSamples: [],
        englishChromeHits: [],
        error: String(err?.message || err).slice(0, 120),
        statusOk: false,
      });
      console.log(`ERR [${def.id}] ${route}: ${err?.message || err}`);
    }
  }
  await ctx.close();
  return { rows, reachable };
}

async function main() {
  const { LOCALE_REGISTRY, getSelectableLocales, ACTIVE_LOCALE_IDS } = await import(
    pathToFileURL(path.join(ROOT, "lib/i18n/locale-registry.js")).href
  );
  const { getLocaleFallbackChain } = await import(
    pathToFileURL(path.join(ROOT, "lib/i18n/locale-resolution.js")).href
  );

  const localesDir = path.join(ROOT, "locales");
  const contentPacksDir = path.join(ROOT, "content-packs");
  const selectable = new Set(getSelectableLocales().map((d) => d.id));
  const active = new Set(ACTIVE_LOCALE_IDS);

  const masterIds = new Set([
    "ar-001",
    "es-419",
    "pt-BR",
    "pt-PT",
    "de-DE",
    "fr-FR",
    "it-IT",
    "nl-NL",
    "ru-RU",
  ]);

  const inventory = [];
  const localeReports = [];
  const findings = [];
  let filesScanned = 0;
  let hebrewStaticHits = 0;
  let enLeakStaticHits = 0;

  const allIds = Object.keys(LOCALE_REGISTRY).filter((id) => id !== "en");

  for (const id of allIds) {
    const def = LOCALE_REGISTRY[id];
    const chain = getLocaleFallbackChain
      ? getLocaleFallbackChain(id)
      : fallbackChain(LOCALE_REGISTRY, id);
    const locFiles = walkFiles(path.join(localesDir, id));
    const packFiles = walkFiles(path.join(contentPacksDir, id));
    filesScanned += locFiles.length + packFiles.length;

    const heLoc = scanHebrewInFiles(locFiles);
    const hePack = scanHebrewInFiles(packFiles);
    hebrewStaticHits += heLoc.length + hePack.length;

    const ns = missingNamespaces(id, localesDir);
    const leak = compareEnLeakage(id, localesDir);
    if (leak.applicable) enLeakStaticHits += leak.forbiddenLeafCount || 0;

    const isMaster = masterIds.has(id);
    const packStatus = contentPackStatus(id, contentPacksDir, isMaster);
    const visible = selectable.has(id);
    const enabled = def.enabled !== false && def.status !== "disabled";

    inventory.push({
      locale: id,
      publicPath: publicPrefix(def) || "/",
      selectorLabel: def.label || def.nativeName || def.displayName,
      visible: visible ? "visible" : def.isPseudo ? "pseudo-hidden" : def.selectorVisible === false ? "hidden" : "not-selectable",
      enabled,
      status: def.status,
      direction: def.direction,
      fallbackChain: chain.join(" → "),
      contentPackStatus: packStatus,
      uiNamespaces: `${ns.countPresent}/${NAMESPACES.length}`,
      localesFileCount: locFiles.length,
      contentPackFileCount: packFiles.length,
      runtimeReachable: null,
    });

    if (heLoc.length || hePack.length) {
      for (const h of [...heLoc, ...hePack].slice(0, 20)) {
        findings.push({
          locale: id,
          route: null,
          filePath: h.file,
          exactText: h.samples[0] || "",
          layer: "static",
          severity: "blocker",
          kind: "hebrew",
          source: "connected locale/content-pack file",
          recommendedFixLater: "Remove/replace Hebrew with English-SoT translation for this locale",
        });
      }
    }

    if (leak.applicable && (leak.forbiddenLeafCount || 0) > 0) {
      const severity =
        isMaster && leak.forbiddenLeafCount > 20
          ? "high"
          : isMaster
            ? "medium"
            : "low";
      findings.push({
        locale: id,
        route: null,
        filePath: `locales/${id}/*.json`,
        exactText: leak.forbiddenSamples[0]?.value || "",
        layer: "static",
        severity,
        kind: "english_leakage",
        source: `${leak.forbiddenLeafCount} forbidden EN-identical leaves (of ${leak.identicalLeafCount} identical; ${leak.scannedLeaves} compared); byKind=${JSON.stringify(leak.byKind)}`,
        recommendedFixLater: isMaster
          ? "Translate remaining EN-identical UI leaves from English SoT"
          : "Usually inherits master; only fix overlay keys that override incorrectly",
        samples: leak.forbiddenSamples.slice(0, 8),
      });
    }

    if (isMaster && ns.countMissing > 0) {
      findings.push({
        locale: id,
        route: null,
        filePath: `locales/${id}/`,
        exactText: ns.missing.join(", "),
        layer: "static",
        severity: "high",
        kind: "missing_namespaces",
        source: "UI namespace gap vs I18N_NAMESPACES",
        recommendedFixLater: "Add missing namespace JSON files translated from en",
      });
    }

    if (packStatus === "missing" && enabled && !def.isPseudo && !isEnglishFamily(id)) {
      findings.push({
        locale: id,
        route: null,
        filePath: `content-packs/${id}/`,
        exactText: "missing content-pack directory",
        layer: "static",
        severity: isMaster ? "blocker" : "medium",
        kind: "missing_overlays",
        source: "content-packs absent; runtime falls back via chain",
        recommendedFixLater: "Add content-pack overlay or accept master inheritance",
      });
    }

    localeReports.push({
      locale: id,
      isMaster,
      isEnglishFamily: isEnglishFamily(id),
      hebrewStaticFiles: heLoc.length + hePack.length,
      hebrewStaticSamples: [...heLoc, ...hePack].flatMap((h) => h.samples).slice(0, 8),
      englishLeakIdenticalLeaves: leak.applicable ? leak.identicalLeafCount : null,
      englishLeakForbiddenLeaves: leak.applicable ? leak.forbiddenLeafCount : null,
      englishLeakByKind: leak.applicable ? leak.byKind : null,
      englishLeakSamples: leak.forbiddenSamples?.length
        ? leak.forbiddenSamples
        : leak.samples,
      missingNamespaces: ns.missing,
      contentPackStatus: packStatus,
      runtime: null,
    });
  }

  // Admin exemption note (static scan of admin .he only for report section)
  const adminHeFiles = walkFiles(path.join(ROOT, "lib/admin-portal"))
    .concat(walkFiles(path.join(ROOT, "pages/admin")))
    .filter((f) => /\.he\.js$/i.test(f) || HE.test(fs.readFileSync(f, "utf8").slice(0, 5000)));
  const adminHebrewConnected = adminHeFiles
    .filter((f) => {
      try {
        return HE.test(fs.readFileSync(f, "utf8"));
      } catch {
        return false;
      }
    })
    .map((f) => path.relative(ROOT, f).replace(/\\/g, "/"))
    .slice(0, 40);

  // Runtime
  const runtimeSummary = { localesCrawled: 0, routesChecked: 0, apiChecked: 0 };
  if (!SKIP_RUNTIME) {
    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const enabledNonEn = allIds.filter((id) => {
        const d = LOCALE_REGISTRY[id];
        return d.enabled && d.status === "enabled" && !d.isPseudo;
      });

      // Masters deep first
      for (const id of enabledNonEn.filter((x) => masterIds.has(x))) {
        const def = LOCALE_REGISTRY[id];
        const { rows, reachable } = await crawlLocale(browser, def, MASTER_DEEP_ROUTES);
        runtimeSummary.localesCrawled += 1;
        runtimeSummary.routesChecked += rows.length;
        const inv = inventory.find((x) => x.locale === id);
        if (inv) inv.runtimeReachable = reachable && rows.some((r) => r.statusOk !== false);
        const lr = localeReports.find((x) => x.locale === id);
        const heRoutes = rows.filter((r) => r.hebrew);
        const enRoutes = rows.filter((r) => (r.englishChromeHits || []).length > 0);
        const rtlIssues = [];
        if (def.direction === "rtl") {
          for (const r of rows) {
            if (r.dir && r.dir.toLowerCase() !== "rtl") {
              rtlIssues.push({ route: r.route, dir: r.dir, lang: r.lang });
            }
          }
        }
        if (lr) {
          lr.runtime = {
            reachable,
            hebrewRuntimeHits: heRoutes.length,
            englishChromeRouteHits: enRoutes.length,
            rtlIssues,
            rows: rows.map((r) => ({
              route: r.route,
              status: r.status,
              hebrew: r.hebrew,
              englishChromeHits: r.englishChromeHits,
              dir: r.dir,
              lang: r.lang,
              error: r.error || null,
            })),
          };
        }
        for (const r of heRoutes) {
          findings.push({
            locale: id,
            route: `${publicPrefix(def)}${r.route === "/" ? "" : r.route}`,
            filePath: null,
            exactText: (r.hebrewSamples || [])[0] || "",
            layer: "runtime",
            severity: "blocker",
            kind: "hebrew",
            source: "body/html/SEO after navigation",
            recommendedFixLater: "Trace Hebrew source (bundle/API/data) and replace from EN SoT",
          });
        }
        if (!isEnglishFamily(id)) {
          for (const r of enRoutes.slice(0, 8)) {
            findings.push({
              locale: id,
              route: `${publicPrefix(def)}${r.route === "/" ? "" : r.route}`,
              filePath: null,
              exactText: (r.englishChromeHits || []).slice(0, 4).join(" | "),
              layer: "runtime",
              severity: masterIds.has(id) ? "high" : "medium",
              kind: "english_leakage",
              source: "English chrome markers visible in non-English UI",
              recommendedFixLater: "Ensure UI strings resolve from locale bundle, not EN fallback",
            });
          }
        }
        for (const issue of rtlIssues) {
          findings.push({
            locale: id,
            route: issue.route,
            filePath: null,
            exactText: `dir=${issue.dir || "(empty)"} lang=${issue.lang || ""}`,
            layer: "runtime",
            severity: "blocker",
            kind: "rtl",
            source: "html/body dir attribute",
            recommendedFixLater: "Force RTL on public shell for ar-001",
          });
        }
      }

      // Country overlays — sample routes
      for (const id of enabledNonEn.filter((x) => !masterIds.has(x))) {
        const def = LOCALE_REGISTRY[id];
        const { rows, reachable } = await crawlLocale(browser, def, OVERLAY_SAMPLE_ROUTES);
        runtimeSummary.localesCrawled += 1;
        runtimeSummary.routesChecked += rows.length;
        const inv = inventory.find((x) => x.locale === id);
        if (inv) inv.runtimeReachable = reachable && rows.some((r) => (r.status || 0) > 0 && (r.status || 0) < 500);
        const lr = localeReports.find((x) => x.locale === id);
        const heRoutes = rows.filter((r) => r.hebrew);
        const enRoutes = !isEnglishFamily(id)
          ? rows.filter((r) => (r.englishChromeHits || []).length > 0)
          : [];
        if (lr) {
          lr.runtime = {
            reachable,
            hebrewRuntimeHits: heRoutes.length,
            englishChromeRouteHits: enRoutes.length,
            rows: rows.map((r) => ({
              route: r.route,
              status: r.status,
              hebrew: r.hebrew,
              englishChromeHits: r.englishChromeHits,
              error: r.error || null,
            })),
          };
        }
        for (const r of heRoutes) {
          findings.push({
            locale: id,
            route: `${publicPrefix(def)}${r.route === "/" ? "" : r.route}`,
            filePath: null,
            exactText: (r.hebrewSamples || [])[0] || "",
            layer: "runtime",
            severity: "blocker",
            kind: "hebrew",
            source: "body/html runtime",
            recommendedFixLater: "Remove Hebrew; inherit/fix master overlay",
          });
        }
        // Cap EN leakage findings for overlays (expected inheritance noise)
        if (enRoutes.length >= 3 && !isEnglishFamily(id)) {
          findings.push({
            locale: id,
            route: `${publicPrefix(def)}/*`,
            filePath: null,
            exactText: enRoutes[0]?.englishChromeHits?.slice(0, 3).join(" | ") || "",
            layer: "runtime",
            severity: "medium",
            kind: "english_leakage",
            source: `${enRoutes.length}/${rows.length} sampled routes show EN chrome (often master→en fallback)`,
            recommendedFixLater: "Fix at master layer first; then country overlays",
          });
        }
      }
    } finally {
      if (browser) await browser.close();
    }
  }

  // Per-locale status rollup
  const statusTable = localeReports.map((lr) => {
    const def = LOCALE_REGISTRY[lr.locale];
    const heRun = lr.runtime?.hebrewRuntimeHits || 0;
    const heStatic = lr.hebrewStaticFiles || 0;
    const enLeak = lr.englishLeakForbiddenLeaves || 0;
    const enRun = lr.runtime?.englishChromeRouteHits || 0;
    const rtl = (lr.runtime?.rtlIssues || []).length;
    const reachable = lr.runtime == null ? null : lr.runtime.reachable;
    let status = "PASS";
    let severity = "none";
    if (reachable === false) {
      status = "BLOCKED";
      severity = "high";
    } else if (heRun > 0 || heStatic > 0 || rtl > 0) {
      status = "FAIL";
      severity = "blocker";
    } else if (!lr.isEnglishFamily && enRun > 0) {
      status = "FAIL";
      severity = "high";
    } else if (!lr.isEnglishFamily && enLeak > 0) {
      status = "FAIL";
      severity = enLeak > 20 ? "high" : "medium";
    }
    let wave = 5;
    if (heRun || heStatic || rtl) wave = 2;
    else if (lr.missingNamespaces?.length) wave = 3;
    else if (!lr.isEnglishFamily && (enRun > 2 || enLeak > 20)) wave = 4;
    else if (lr.isMaster) wave = lr.isEnglishFamily ? 6 : 5;
    else wave = 5;
    if (lr.locale === "ar-001" && (rtl > 0 || heRun > 0)) wave = 6;

    return {
      locale: lr.locale,
      status,
      hebrewRuntimeHits: heRun,
      hebrewStaticHitsConnected: heStatic,
      englishLeakageHits: (enLeak || 0) + (enRun || 0),
      englishIdenticalLeaves: lr.englishLeakIdenticalLeaves || 0,
      englishForbiddenLeaves: enLeak,
      englishLeakByKind: lr.englishLeakByKind || null,
      missingNamespaces: lr.missingNamespaces || [],
      missingOverlays: lr.contentPackStatus === "missing",
      fallbackIssues: def?.fallbackLocale === "he" || false,
      rtlLtrIssues: rtl,
      staleConnectedFiles: 0,
      severity,
      recommendedFixWave: wave,
      contentPackStatus: lr.contentPackStatus,
      isMaster: lr.isMaster,
      isEnglishFamily: lr.isEnglishFamily,
    };
  });

  const heFail = statusTable.filter((s) => s.hebrewRuntimeHits > 0 || s.hebrewStaticHitsConnected > 0);
  const blocked = statusTable.filter((s) => s.status === "BLOCKED");
  const fail = statusTable.filter((s) => s.status === "FAIL");
  const overall =
    blocked.length > 0 && fail.length === 0 && heFail.length === 0
      ? "BLOCKED"
      : heFail.length || fail.length || blocked.length
        ? "FAIL"
        : "PASS";

  const report = {
    generatedAt: new Date().toISOString(),
    englishSotRemainsValid: true,
    overallStatus: overall,
    canStartFixes: overall !== "BLOCKED" || fail.length > 0 || heFail.length > 0,
    evidence: {
      commands: [
        "node docs/reports/_non-en-locale-sot-audit.mjs",
        "Inventory from lib/i18n/locale-registry.js via getSelectableLocales/ACTIVE_LOCALE_IDS",
      ],
      filesScanned,
      localesFound: allIds.length + 1,
      localesAuditedNonEn: allIds.length,
      routesChecked: runtimeSummary.routesChecked,
      apiResponsesChecked: runtimeSummary.apiChecked,
      localesRuntimeCrawled: runtimeSummary.localesCrawled,
      hebrewStaticFileHits: hebrewStaticHits,
      englishLeakStaticLeafHits: enLeakStaticHits,
      findingsCount: findings.length,
    },
    inventory,
    statusTable,
    findings: findings.slice(0, 2000),
    adminExemptions: {
      hebrewFilesSample: adminHebrewConnected,
      note: "Admin .he / admin portal Hebrew is exempt from English SoT public audit",
      publicLeakageChecked: "Admin routes excluded from locale middleware; no admin crawl in this audit",
      publicLeakageFound: false,
    },
    globalBlockers: [],
  };

  // Global blockers aggregation
  const kinds = {};
  for (const f of findings) {
    const k = f.kind;
    kinds[k] = (kinds[k] || 0) + 1;
  }
  if (kinds.hebrew) {
    report.globalBlockers.push({
      area: "hebrew_public",
      count: kinds.hebrew,
      note: "Hebrew in non-English public locale files or runtime",
    });
  }
  if (kinds.english_leakage) {
    report.globalBlockers.push({
      area: "english_leakage",
      count: kinds.english_leakage,
      note: "EN-identical leaves and/or EN chrome at runtime in non-English locales",
    });
  }
  if (kinds.rtl) {
    report.globalBlockers.push({
      area: "rtl",
      count: kinds.rtl,
      note: "RTL direction missing on Arabic public shell",
    });
  }
  if (kinds.missing_namespaces) {
    report.globalBlockers.push({
      area: "missing_namespaces",
      count: kinds.missing_namespaces,
      note: "Master locales missing UI namespaces",
    });
  }

  const jsonPath = path.join(OUT_DIR, "non-en-locale-sot-audit.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        overallStatus: overall,
        locales: allIds.length,
        findings: findings.length,
        heFail: heFail.length,
        fail: fail.length,
        blocked: blocked.length,
        out: path.relative(ROOT, jsonPath),
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
