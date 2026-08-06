#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs";

function load(rel) {
  const o = {};
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
const email = ENV.TEACHER_PORTAL_VERIFY_EMAIL || "teacher@leo.com";
const password = ENV.TEACHER_PORTAL_VERIFY_PASSWORD || "747975";

async function acceptConsent(page) {
  const btn = page.getByRole("button", { name: /^(Accept|accept|Agree|OK)$/i });
  if (await btn.isVisible({ timeout: 1200 }).catch(() => false)) {
    await btn.click().catch(() => {});
  }
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
        sample: (t.match(/[\u0590-\u05FF][\s\S]{0,100}/) || [t])[0].slice(0, 180),
      });
    };
    push("title", document.title);
    push("meta.description", document.querySelector('meta[name="description"]')?.content || "");
    push("body", document.body?.innerText || "");
    return hits;
  }, HE.source);
}

const tokRes = await fetch(
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
const tok = await tokRes.json();
const classesRes = await fetch(`${BASE}/api/teacher/classes`, {
  headers: { Authorization: `Bearer ${tok.access_token}`, Accept: "application/json" },
});
const classesJson = await classesRes.json();
const meRes = await fetch(`${BASE}/api/teacher/me`, {
  headers: { Authorization: `Bearer ${tok.access_token}`, Accept: "application/json" },
});
const meText = await meRes.text();
const classesText = JSON.stringify(classesJson);
const classList = classesJson?.data?.classes || classesJson?.classes || [];

const apiFindings = {
  meHebrew: HE.test(meText),
  meSamples: (meText.match(/[\u0590-\u05FF][^\n"]{0,60}/g) || []).slice(0, 10),
  classesHebrew: HE.test(classesText),
  classesSamples: (classesText.match(/[\u0590-\u05FF][^\n"]{0,60}/g) || []).slice(0, 10),
  classIds: classList.map((c) => c.classId || c.id).filter(Boolean).slice(0, 5),
  classNames: classList.map((c) => c.name || c.title || c.className).slice(0, 5),
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "en-US",
  extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
});
await context.addCookies([{ name: "lk_global_locale", value: "en", url: BASE }]);
const page = await context.newPage();

await page.goto(`${BASE}/teacher/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
await acceptConsent(page);
await page.getByTestId("teacher-login-tab").click().catch(() => {});
await page.getByPlaceholder(" ").fill(email).catch(async () => {
  await page.locator("form input").first().fill(email);
});
await page.locator('input[type="password"]').fill(password);
await page.locator('button[type="submit"]').first().click().catch(async () => {
  await page.locator("form button").last().click();
});
await page.waitForURL(/\/teacher\//, { timeout: 45000 }).catch(() => {});

const routes = [];
for (const id of apiFindings.classIds.slice(0, 3)) {
  const base = `/teacher/class/${id}`;
  routes.push(
    base,
    `${base}/activities`,
    `${base}/activities/new`,
    `${base}/worksheets`,
    `${base}/worksheets/new`
  );
}
// also try students list endpoints via page if any student ids in classes payload
for (const c of classList.slice(0, 2)) {
  const students = c.students || c.studentIds || [];
  for (const s of students.slice(0, 2)) {
    const sid = typeof s === "string" ? s : s.studentId || s.id;
    if (sid) routes.push(`/teacher/student/${sid}`);
  }
}

const rows = [];
for (const route of routes) {
  const row = { route, role: "teacher-deep-api", status: 0, hebrew: false, hits: [], finalUrl: "" };
  try {
    const resp = await page.goto(`${BASE}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    row.status = resp?.status() || 0;
    await page.waitForTimeout(900);
    // open a couple buttons
    const buttons = page.locator("button:visible");
    const n = Math.min(await buttons.count(), 4);
    for (let i = 0; i < n; i++) {
      const t = ((await buttons.nth(i).innerText().catch(() => "")) || "").trim();
      if (/logout|sign out|delete/i.test(t)) continue;
      await buttons.nth(i).click({ timeout: 600 }).catch(() => {});
      await page.waitForTimeout(200);
    }
    await page.keyboard.press("Escape").catch(() => {});
    row.hits = await harvest(page);
    row.hebrew = row.hits.length > 0;
    row.finalUrl = page.url();
  } catch (e) {
    row.errors = [String(e?.message || e)];
  }
  rows.push(row);
  console.log(`${row.hebrew ? "HE" : "OK"} ${row.status} ${route} hits=${row.hits.length}`);
}

await browser.close();

const out = {
  generatedAt: new Date().toISOString(),
  apiFindings,
  rows,
  hebrewUiRoutes: rows.filter((r) => r.hebrew).length,
};
fs.writeFileSync("docs/reports/en-final-teacher-deep-via-api.json", JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      apiHebrew: apiFindings.meHebrew || apiFindings.classesHebrew,
      classIds: apiFindings.classIds.length,
      routes: rows.length,
      hebrewUi: out.hebrewUiRoutes,
      samples: {
        me: apiFindings.meSamples.slice(0, 3),
        classes: apiFindings.classesSamples.slice(0, 3),
        ui: rows.filter((r) => r.hebrew).slice(0, 3),
      },
    },
    null,
    2
  )
);
process.exit(out.hebrewUiRoutes || apiFindings.meHebrew || apiFindings.classesHebrew ? 1 : 0);
