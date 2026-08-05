#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:3001";
const HE = /[\u0590-\u05FF\uFB1D-\uFB4F]/;
const LOCALES = [
  "en",
  "ar-001",
  "es-419",
  "es-MX",
  "es-ES",
  "pt-BR",
  "pt-PT",
  "en-GB",
  "de-DE",
  "ru-RU",
  "fr-FR",
  "it-IT",
  "nl-NL",
];
const FORBIDDEN_IL = [
  "achievement_hebrew_star",
  "achievement_moledet_explorer",
  "event_hanukkah",
  "event_independence_day",
  "event_purim",
  "event_rosh_hashana",
  "event_shavuot",
  "event_sukkot",
];

function countHe(s) {
  return (String(s || "").match(HE) || []).length;
}
function collectHeKeys(obj, out = []) {
  if (!obj || typeof obj !== "object") return out;
  if (Array.isArray(obj)) {
    for (const v of obj) collectHeKeys(v, out);
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (/He$|_he$/.test(k)) out.push(k);
    collectHeKeys(v, out);
  }
  return out;
}

async function dismissOverlays(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page
    .locator("nextjs-portal")
    .evaluateAll((els) => els.forEach((el) => el.remove()))
    .catch(() => {});
  for (const name of [/Reject optional/i, /Essential only/i, /Accept all/i, /Accept/i]) {
    const b = page.getByRole("button", { name });
    if (await b.count()) {
      await b.first().click({ force: true }).catch(() => {});
      break;
    }
  }
}

async function ensureDemoSession(page, locale) {
  await page.goto(`${BASE}/demo/enter?locale=${encodeURIComponent(locale)}&grade=g3`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await dismissOverlays(page);
  try {
    await page.waitForURL(/\/student\//, { timeout: 15000 });
  } catch {
    const cta = page.getByRole("button", { name: /start|enter|play|begin|demo/i }).first();
    if (await cta.count()) await cta.click({ force: true, timeout: 8000 });
    await page.waitForURL(/\/student\//, { timeout: 20000 }).catch(() => {});
  }
}

const rows = [];
const browser = await chromium.launch({ headless: true });

for (const locale of LOCALES) {
  const context = await browser.newContext();
  await context.addCookies([
    { name: "lk_global_locale", value: locale, url: BASE },
  ]);
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err?.message || err)));
  await page.setExtraHTTPHeaders({ "x-lk-interface-locale": locale });

  let apiPayload = null;
  page.on("response", async (res) => {
    try {
      if (res.url().includes("/api/demo/cards/catalog") && res.ok()) {
        apiPayload = await res.json();
      }
    } catch {
      /* ignore */
    }
  });

  const row = {
    locale,
    pageStatus: 0,
    tabClicked: false,
    catalogLoaded: false,
    catalogCardCount: 0,
    HebrewDOMCount: 0,
    HebrewAPIValueCount: 0,
    HeFieldNameCount: 0,
    IsraelResidueCount: 0,
    emptyNameCount: 0,
    emptyRequirementCount: 0,
    forbiddenEnglishRequirementCount: 0,
    visibleTranslationKeyCount: 0,
    consoleErrorCount: 0,
    pageErrorCount: 0,
    errors: [],
  };

  try {
    await ensureDemoSession(page, locale);
    const cardsRes = await page.goto(
      `${BASE}/student/cards?locale=${encodeURIComponent(locale)}`,
      { waitUntil: "domcontentloaded", timeout: 90000 }
    );
    row.pageStatus = cardsRes?.status() || 0;
    if (row.pageStatus >= 500) throw new Error(`student_cards_${row.pageStatus}`);
    await page.waitForTimeout(1500);
    await dismissOverlays(page);

    const catalogTab = page.locator("[data-testid='student-cards-tab-catalog']");
    await catalogTab.first().click({ force: true, timeout: 15000 });
    row.tabClicked = true;
    await page.waitForTimeout(1500);
    await dismissOverlays(page);

    const bodyText = await page.locator("body").innerText();
    row.HebrewDOMCount = countHe(bodyText);
    row.visibleTranslationKeyCount = (
      bodyText.match(/\b(?:cardsPage|shop|requirements)\.[a-zA-Z0-9_.]+/g) || []
    ).length;

    if (!apiPayload) {
      const api = await page.request.get(
        `${BASE}/api/demo/cards/catalog?locale=${encodeURIComponent(locale)}`
      );
      apiPayload = await api.json();
    }
    const list = apiPayload?.cards || apiPayload?.catalog || [];
    row.catalogCardCount = Array.isArray(list) ? list.length : 0;
    row.catalogLoaded = row.catalogCardCount > 0;
    row.HebrewAPIValueCount = countHe(JSON.stringify(apiPayload));
    row.HeFieldNameCount = collectHeKeys(apiPayload).length;
    row.IsraelResidueCount = list.filter((c) =>
      FORBIDDEN_IL.includes(c.cardKey || c.card_key)
    ).length;
    row.emptyNameCount = list.filter((c) => !String(c.name || "").trim()).length;
    row.emptyRequirementCount = list.filter(
      (c) => c.requirementText != null && !String(c.requirementText || "").trim()
    ).length;
    if (locale !== "en" && !String(locale).startsWith("en-")) {
      row.forbiddenEnglishRequirementCount = list.filter(
        (c) => String(c.requirementText || "") === "Answer 20 questions in total"
      ).length;
    }

    const tile = page.locator("[data-testid^='student-card-'], [data-card-key]").first();
    if (await tile.count()) {
      await tile.click({ force: true, timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(600);
    }
    for (const id of ["collection", "shop"]) {
      const t = page.locator(`[data-testid='student-cards-tab-${id}']`);
      if (await t.count()) await t.click({ force: true, timeout: 5000 }).catch(() => {});
    }
  } catch (e) {
    row.errors.push(String(e?.message || e));
  }

  const noise =
    /Content Security Policy|vercel-scripts|Suspense boundary received an update|Text content does not match server-rendered HTML|Hydration failed because the initial UI|error while hydrating|Prop `%s` did not match|An error occurred during hydration/i;
  row.consoleErrorCount = consoleErrors.filter((t) => !noise.test(t)).length;
  row.pageErrorCount = pageErrors.filter((t) => !noise.test(t)).length;
  rows.push(row);
  console.log(JSON.stringify(row));
  await context.close();
}

await browser.close();
const outPath = path.join(
  process.env.TEMP || process.cwd(),
  "leo-kids-global-audits",
  "ui-crawl-student-cards.json"
);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ base: BASE, rows }, null, 2));
const bad = rows.filter(
  (r) =>
    r.pageStatus >= 500 ||
    !r.tabClicked ||
    !r.catalogLoaded ||
    r.HebrewDOMCount > 0 ||
    r.HebrewAPIValueCount > 0 ||
    r.HeFieldNameCount > 0 ||
    r.IsraelResidueCount > 0 ||
    r.emptyNameCount > 0 ||
    r.pageErrorCount > 0
);
console.log(JSON.stringify({ outPath, locales: rows.length, bad: bad.length }, null, 2));
process.exit(bad.length ? 1 : 0);
