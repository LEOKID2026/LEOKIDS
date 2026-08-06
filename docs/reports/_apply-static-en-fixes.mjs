#!/usr/bin/env node
/**
 * Apply non-identical UI translations for master static EN leaves.
 * Brand / ICU / english-subject / technical / true cognates stay.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** locale → { "ns.key": translatedValue } — translation must differ from EN */
const APPLY = {
  "fr-FR": {
    "learning.correct": "Correct !",
    "learning.master.streakFeedback.correct": "Correct !",
    "learning.master.feedback.excellent": "Excellent ! ✅",
    "learning.master.badges.topic_expert": "🔬 Expert {topic}",
    "learning.master.badges.topic_expert_legacy": "🔬 Expert {topic}",
    "worksheets.writingCategoryPrewriting": "Pré-écriture",
    "worksheets.writingNumberModeBeforeAfter": "Avant/après",
    "seo.contactTitle": "Nous contacter · Leo Kids",
  },
  "de-DE": {
    "learning.master.start": "▶️ Starten",
    "learning.master.levelLabel": "Stufe {level}",
    "learning.master.streakEncouragement.champion": "👑 Meister!",
    "learning.master.dailyStreakChampion": "👑 Meister!",
  },
  "nl-NL": {
    "ui.public.contact.social.instagram": "Instagram van Leo",
    "ui.public.contact.social.youtube": "YouTube van Leo",
    "ui.public.contact.social.facebook": "Facebook van Leo",
    "ui.parent.detailsTitle": "Gegevens — {name}",
    "learning.master.streakFeedback.correct": "Goed zo!",
    "learning.master.mistakeRow":
      "{question} = {wrong} ❌ (juist: {correct})",
    "worksheets.writingCategoryPrewriting": "Voorschrijven",
    "school.portal.navDashboard": "Overzicht",
  },
  "es-419": {
    // EN was "Personal" → Spanish "Individual"
    "teacher.activities.individualBadge": "Individual",
    // EN "{game} — Arcade" → localized label
    "ui.student.arcadePageTitle": "{game} — Juegos",
    // EN "⚠️ Error:" → Spanish form
    "learning.master.remainderWarning": "⚠️ ¡Error!",
  },
  "it-IT": {
    "ui.parent.curriculum": "Programma",
    "learning.master.curriculum": "📋 Programma",
    "worksheets.writingCategoryPrewriting": "Pre-scrittura",
    "worksheets.writingNumberModeBeforeAfter": "Prima/dopo",
  },
};

function setByPath(obj, dotted, value) {
  const parts = dotted.replace(/\[(\d+)\]/g, ".$1").split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur) || typeof cur[p] !== "object" || cur[p] === null) {
      if (!(p in cur)) cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    }
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

function getByPath(obj, dotted) {
  const parts = dotted.replace(/\[(\d+)\]/g, ".$1").split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

const report = { applied: [], skippedIdentical: [], missing: [] };

for (const [locale, map] of Object.entries(APPLY)) {
  const byNs = {};
  for (const [full, val] of Object.entries(map)) {
    const i = full.indexOf(".");
    (byNs[full.slice(0, i)] ||= []).push([full.slice(i + 1), val, full]);
  }
  for (const [ns, pairs] of Object.entries(byNs)) {
    const file = path.join(ROOT, "locales", locale, `${ns}.json`);
    if (!fs.existsSync(file)) {
      report.missing.push(`${locale}/${ns}`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    let dirty = false;
    for (const [key, val, full] of pairs) {
      const prev = getByPath(data, key);
      if (prev === undefined) {
        report.missing.push(`${locale}:${full}`);
        continue;
      }
      if (prev === val) {
        report.skippedIdentical.push({ locale, key: full, value: val });
        continue;
      }
      setByPath(data, key, val);
      dirty = true;
      report.applied.push({ locale, key: full, from: prev, to: val });
      console.log(`[${locale}] ${full}: ${JSON.stringify(prev)} → ${JSON.stringify(val)}`);
    }
    if (dirty) fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  }
}

fs.writeFileSync(
  path.join(ROOT, "docs/reports/non-en-static-sweep-applied.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), ...report }, null, 2)
);
console.log(
  JSON.stringify(
    {
      applied: report.applied.length,
      skippedIdentical: report.skippedIdentical.length,
      missing: report.missing,
    },
    null,
    2
  )
);
