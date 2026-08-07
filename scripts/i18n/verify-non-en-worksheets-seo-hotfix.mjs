import { buildQuestionCatalogItems } from "../../lib/worksheets/worksheet-public-catalog.server.js";
import { loadLocaleBundles, lookupMessage } from "../../lib/i18n/load-messages.js";
import fs from "node:fs";
import path from "node:path";

const forbiddenExact = new Set([
  "Horizontal addition",
  "Horizontal subtraction",
  "Vertical addition",
  "Word problems",
  "Equations",
  "Long division",
  "Long multiplication",
  "Percentages",
  "Fractions",
  "Area",
  "Basic multiplication",
  "Ratio",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Regular",
  "Advanced",
  "Math",
  "Practice areas and parent guides",
  "Practice areas",
  "Parent guides",
]);

const forbiddenSubstring = ["Want to explore Leo Kids practice areas"];

/** Identical spelling that is the correct local word (not EN leakage). */
const cognateAllowed = {
  "fr-FR": new Set(["Fractions"]),
  "it-IT": new Set(["Area"]),
};

const locales = [
  "es-MX",
  "es-CL",
  "es-419",
  "fr-FR",
  "ar-001",
  "de-DE",
  "it-IT",
  "nl-NL",
  "pt-BR",
  "pt-PT",
  "ru-RU",
];

const report = {
  generatedAt: new Date().toISOString(),
  catalog: {},
  seo: {},
  samples: {},
};

let fail = 0;
for (const loc of locales) {
  const items = buildQuestionCatalogItems(loc);
  const visible = items.flatMap((i) =>
    [i.subject, i.level, i.grade, i.topic, i.title].filter(Boolean).map(String)
  );
  const allowed = cognateAllowed[loc] || new Set();
  const hits = [...new Set(visible.filter((v) => forbiddenExact.has(v) && !allowed.has(v)))];
  report.catalog[loc] = { itemCount: items.length, enHits: hits };
  console.log(loc, "catalog EN_hits", hits.length ? hits.join(" | ") : "NONE");
  if (hits.length) fail += 1;
}

const seoKeys = [
  "ui.public.homepage.seoEntry.title",
  "ui.public.homepage.seoEntry.body",
  "ui.public.homepage.seoEntry.practiceAreasCta",
  "ui.public.homepage.seoEntry.parentGuidesCta",
  "ui.public.homepage.seoEntry.quickLinks.math",
  "ui.public.homepage.seoEntry.quickLinks.geometry",
  "ui.public.homepage.seoEntry.quickLinks.parentReports",
];

for (const loc of locales) {
  const bundles = loadLocaleBundles(loc);
  const vals = Object.fromEntries(seoKeys.map((k) => [k, lookupMessage(bundles, k)]));
  const hits = Object.values(vals).filter(
    (v) =>
      forbiddenExact.has(String(v)) ||
      forbiddenSubstring.some((f) => String(v).includes(f))
  );
  report.seo[loc] = { values: vals, enHits: hits };
  console.log(loc, "seo title=", vals[seoKeys[0]], "| EN_hits", hits.length ? hits.join(" || ") : "NONE");
  if (hits.length) fail += 1;
}

for (const loc of ["es-MX", "es-CL", "fr-FR", "ar-001", "de-DE", "it-IT", "nl-NL", "pt-BR", "pt-PT", "ru-RU"]) {
  report.samples[loc] = buildQuestionCatalogItems(loc)
    .slice(0, 12)
    .map((i) => ({
      subject: i.subject,
      level: i.level,
      grade: i.grade,
      topic: i.topic,
    }));
  console.log("\nSAMPLE", loc);
  for (const row of report.samples[loc]) {
    console.log(`  ${row.subject} | ${row.level} | ${row.grade} | ${row.topic}`);
  }
}

report.pass = fail === 0;
const out = path.join("docs", "reports", "hotfix-non-en-worksheets-seo-verify.json");
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log("\nPASS=", report.pass, "wrote", out);
process.exitCode = fail ? 1 : 0;
