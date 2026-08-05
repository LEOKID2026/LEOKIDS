#!/usr/bin/env node
/**
 * Local API + lightweight DOM-ish JSON crawl for GLOBAL cards surfaces.
 * Usage: node scripts/i18n/crawl-global-cards-zero-hebrew.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || process.env.CRAWL_BASE || "http://127.0.0.1:3000";
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

const FORBIDDEN_KEYS = [
  "achievement_hebrew_star",
  "achievement_moledet_explorer",
  "event_hanukkah",
  "event_independence_day",
  "event_purim",
  "event_rosh_hashana",
  "event_shavuot",
  "event_sukkot",
];

function countHebrew(value) {
  const s = typeof value === "string" ? value : JSON.stringify(value);
  return (s.match(HE) || []).length;
}

function collectHeKeys(obj, path = "", out = []) {
  if (!obj || typeof obj !== "object") return out;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => collectHeKeys(v, `${path}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (/He$|_he$/.test(k)) out.push(`${path}.${k}`);
    collectHeKeys(v, `${path}.${k}`, out);
  }
  return out;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _raw: text.slice(0, 500) };
  }
  return { status: res.status, json, text };
}

const results = [];
for (const locale of LOCALES) {
  const paths = [
    `/api/demo/cards/catalog?locale=${encodeURIComponent(locale)}`,
    `/api/demo/cards/collection?locale=${encodeURIComponent(locale)}`,
    `/api/demo/cards/shop?locale=${encodeURIComponent(locale)}`,
  ];
  for (const p of paths) {
    const url = BASE.replace(/\/$/, "") + p;
    let row;
    try {
      const { status, json, text } = await fetchJson(url);
      const cards = json?.cards || json?.items || json?.catalog || [];
      const list = Array.isArray(cards) ? cards : [];
      const israel = list.filter((c) => FORBIDDEN_KEYS.includes(c.cardKey || c.card_key)).length;
      const emptyName = list.filter((c) => !String(c.name || "").trim()).length;
      const emptyReq = list.filter(
        (c) => c.requirementText != null && !String(c.requirementText || "").trim()
      ).length;
      const heFieldNames = collectHeKeys(json);
      const forbiddenEnReq =
        locale !== "en" && !String(locale).startsWith("en-")
          ? list.filter((c) => {
              const r = String(c.requirementText || "");
              return r === "Answer 20 questions in total" || r === "Available in the shop";
            }).length
          : 0;
      row = {
        locale,
        path: p,
        status,
        catalogLoaded: status >= 200 && status < 500,
        cardCount: list.length,
        hebrewInApi: countHebrew(text),
        heFieldNames: heFieldNames.length,
        israelResidue: israel,
        emptyNames: emptyName,
        emptyRequirements: emptyReq,
        forbiddenEnglishRequirements: forbiddenEnReq,
      };
    } catch (e) {
      row = {
        locale,
        path: p,
        status: 0,
        error: String(e?.message || e),
        catalogLoaded: false,
        hebrewInApi: -1,
      };
    }
    results.push(row);
    console.log(JSON.stringify(row));
  }
}

const out = path.join(
  process.env.TEMP || process.cwd(),
  "leo-kids-global-audits",
  "cards-api-crawl.json"
);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ base: BASE, results }, null, 2));
const fail = results.some(
  (r) =>
    !r.catalogLoaded ||
    r.hebrewInApi > 0 ||
    (r.heFieldNames || 0) > 0 ||
    (r.israelResidue || 0) > 0 ||
    (r.emptyNames || 0) > 0
);
console.log(fail ? "CRAWL_FAIL" : "CRAWL_OK", "wrote", out);
process.exit(fail ? 1 : 0);
