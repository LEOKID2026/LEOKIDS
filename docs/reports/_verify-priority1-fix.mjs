#!/usr/bin/env node
/** Quick verify Priority-1 fixes on master locales */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:3001";
const MASTERS = [
  { id: "fr-FR", prefix: "/fr" },
  { id: "de-DE", prefix: "/de" },
  { id: "nl-NL", prefix: "/nl" },
  { id: "es-419", prefix: "/es-419" },
  { id: "it-IT", prefix: "/it" },
  { id: "ru-RU", prefix: "/ru" },
  { id: "pt-BR", prefix: "/br" },
  { id: "pt-PT", prefix: "/pt" },
  { id: "ar-001", prefix: "/ar-001" },
];
const EN = ["Privacy policy", "Printable worksheets"];
const HE = /[\u0590-\u05FF]/;

const browser = await chromium.launch({ headless: true });
for (const m of MASTERS) {
  const page = await browser.newPage();
  for (const route of ["/contact", "/practice/worksheets"]) {
    await page.goto(`${BASE}${m.prefix}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);
    const body = await page.locator("body").innerText();
    const hits = EN.filter((s) => body.includes(s));
    const he = HE.test(body);
    console.log(`${he ? "HE" : hits.length ? "EN" : "OK"} [${m.id}] ${route} ${hits.join("|") || "-"}`);
  }
  await page.close();
}
await browser.close();
