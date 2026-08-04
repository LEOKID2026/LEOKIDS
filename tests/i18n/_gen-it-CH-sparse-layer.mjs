/**
 * One-shot generator for it-CH sparse content packs from it-IT authority.
 * Run: node tests/i18n/_gen-it-CH-sparse-layer.mjs
 * Does not touch shared wiring, it-IT, de-CH, or fr-CH.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "it-CH";
const BASE = "it-IT";

const GRADES = {
  g1: "1ª elementare",
  g2: "2ª elementare",
  g3: "3ª elementare",
  g4: "4ª elementare",
  g5: "5ª elementare",
  g6: "1ª media",
};

const BANDS = {
  g12: "1ª–2ª elementare",
  g34: "3ª–4ª elementare",
  g56: "5ª elementare–1ª media",
};

/** @param {string} s */
function swissifyGradeText(s) {
  let out = s;
  // Longer / more specific patterns first
  out = out.replace(/5ª primaria–6/g, "5ª elementare–1ª media");
  out = out.replace(/3ª primaria–4/g, "3ª–4ª elementare");
  out = out.replace(/5ª–6ª primaria/g, "5ª elementare–1ª media");
  out = out.replace(/3ª–4ª primaria/g, "3ª–4ª elementare");
  out = out.replace(/1ª–2ª primaria/g, "1ª–2ª elementare");
  out = out.replace(/dalla 1ª primaria alla 1ª secondaria/g, "dalla 1ª elementare alla 1ª media");
  out = out.replace(/1ª primaria/g, "1ª elementare");
  out = out.replace(/2ª primaria/g, "2ª elementare");
  out = out.replace(/3ª primaria/g, "3ª elementare");
  out = out.replace(/4ª primaria/g, "4ª elementare");
  out = out.replace(/5ª primaria/g, "5ª elementare");
  out = out.replace(/6ª primaria/g, "1ª media");
  out = out.replace(/1ª secondaria/g, "1ª media");
  out = out.replace(/Classi 1–2/g, BANDS.g12);
  out = out.replace(/Classi 3–4/g, BANDS.g34);
  out = out.replace(/Classi 5–6/g, BANDS.g56);
  return out;
}

function writeJson(rel, obj) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, `${JSON.stringify(obj, null, 2)}\n`, "utf8");
  console.log("wrote", rel);
}

// --- grade-aware report pack ---
{
  const basePath = path.join(
    ROOT,
    `content-packs/${BASE}/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json`
  );
  const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
  const copy = base.copy || base;
  /** @type {Record<string, string>} */
  const overlay = {};
  for (const [k, v] of Object.entries(copy)) {
    if (typeof v !== "string") continue;
    // Only remap strings that already carry Italy primaria/secondaria (or Classi bands).
    // Leave English null-guards to inherit from it-IT — no artificial full rewrite.
    if (!/primaria|secondaria|Classi [0-9]/.test(v)) continue;
    let next = swissifyGradeText(v);
    // Parent/report adult surface: prefer Lei when rewriting these strings
    next = next
      .replace(/Questa settimana, concentrati /g, "Questa settimana, si concentri ")
      .replace(/chiedi a tuo figlio/g, "chieda a Suo figlio");
    if (next !== v) overlay[k] = next;
  }
  writeJson(
    `content-packs/${LOCALE}/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json`,
    { copy: overlay }
  );
  writeJson(`content-packs/${LOCALE}/reports/burn-down-index.json`, {
    "utils__parent-report-language__grade-aware-recommendation-templates": overlay,
    "components__parent-report-detailed-surface": { grade: "Classe" },
  });
}

writeJson(`content-packs/${LOCALE}/reports/burn-down/components__parent-report-detailed-surface.json`, {
  copy: { grade: "Classe" },
});

writeJson(`content-packs/${LOCALE}/books/ui.json`, { grades: { ...GRADES } });
writeJson(`content-packs/${LOCALE}/rewards/ui.json`, { gradeBands: { ...BANDS } });
writeJson(`content-packs/${LOCALE}/demo/ui.json`, {
  bar: {
    gradeLabel: "Classe",
    changeGrade: "Cambia classe",
  },
  enter: {
    intro:
      "Scegli una classe ed esplora il mondo dei bambini. {minutes} minuti di gioco e apprendimento — senza registrarti.",
    activeSessionNote:
      "Hai una demo attiva: cambiare classe non azzera il cronometro.",
    chooseGradeLegend: "Scegli una classe",
  },
  grades: { ...GRADES },
});

// registry titles
{
  const base = JSON.parse(
    fs.readFileSync(path.join(ROOT, `content-packs/${BASE}/books/registry-titles.json`), "utf8")
  );
  /** @type {Record<string, { bookTitle: string }>} */
  const meta = {};
  for (const [id, row] of Object.entries(base.meta || {})) {
    const title = row?.bookTitle;
    if (typeof title !== "string") continue;
    const next = swissifyGradeText(title);
    if (next !== title) meta[id] = { bookTitle: next };
  }
  writeJson(`content-packs/${LOCALE}/books/registry-titles.json`, { meta });
}

// english-page-skills sparse (only real grade-label diffs + clean mash)
writeJson(`content-packs/${LOCALE}/books/english-page-skills.json`, {
  grades: {
    g2: {
      sentence_base: {
        title: "Frasi brevi — 2ª elementare",
      },
    },
    g6: {
      grammar_comparatives: {
        description: "the best / the most interesting — 1ª media",
      },
    },
  },
});

// games bands
writeJson(`content-packs/${LOCALE}/games/burn-down-index.json`, {
  "components__educational-games__leo-lab__leo-lab-data": {
    grades_1_2: BANDS.g12,
  },
  "components__educational-games__leo-word-detective__leo-word-detective-data": {
    grades_1_2: BANDS.g12,
    grades_3_4: BANDS.g34,
    grades_5_6: BANDS.g56,
  },
  "components__educational-games__leo-word-train__leo-word-train-data": {
    grades_1_2: BANDS.g12,
    grades_3_4: BANDS.g34,
    grades_5_6: BANDS.g56,
  },
});
writeJson(
  `content-packs/${LOCALE}/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json`,
  { copy: { grades_1_2: BANDS.g12 } }
);
writeJson(
  `content-packs/${LOCALE}/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json`,
  {
    copy: {
      grades_1_2: BANDS.g12,
      grades_3_4: BANDS.g34,
      grades_5_6: BANDS.g56,
    },
  }
);
writeJson(
  `content-packs/${LOCALE}/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json`,
  {
    copy: {
      grades_1_2: BANDS.g12,
      grades_3_4: BANDS.g34,
      grades_5_6: BANDS.g56,
    },
  }
);

// global burn-down grade labels + SEO framing
writeJson(`content-packs/${LOCALE}/global-burn-down/burn-down-index.json`, {
  "lib__teacher-portal__teacher-class-grade": {
    grade_1: GRADES.g1,
    grade_2: GRADES.g2,
    grade_3: GRADES.g3,
    grade_4: GRADES.g4,
    grade_5: GRADES.g5,
    grade_6: GRADES.g6,
  },
  "lib__teacher-server__teacher-dashboard.server": {
    grade_1: GRADES.g1,
    grade_2: GRADES.g2,
    grade_3: GRADES.g3,
    grade_4: GRADES.g4,
    grade_5: GRADES.g5,
    grade_6: GRADES.g6,
  },
  "lib__worksheets__worksheet-meta-labels-en.server": {
    grade_1: GRADES.g1,
    grade_2: GRADES.g2,
    grade_3: GRADES.g3,
    grade_4: GRADES.g4,
    grade_5: GRADES.g5,
    grade_6: GRADES.g6,
  },
  "lib__site__public-page-seo": {
    digital_practice_for_elementary_learners_in_math_geometry_english_and_sc:
      "Esercitazione digitale per allievi della scuola elementare e della scuola media in Svizzera: matematica, geometria, inglese e scienze.",
    leo_kids_practice_for_elementary_learners:
      "Leo Kids — esercitazione per allievi della scuola elementare e della 1ª media in Svizzera.",
  },
});
writeJson(`content-packs/${LOCALE}/global-burn-down/lib__teacher-portal__teacher-class-grade.json`, {
  copy: {
    grade_1: GRADES.g1,
    grade_2: GRADES.g2,
    grade_3: GRADES.g3,
    grade_4: GRADES.g4,
    grade_5: GRADES.g5,
    grade_6: GRADES.g6,
  },
});
writeJson(
  `content-packs/${LOCALE}/global-burn-down/lib__teacher-server__teacher-dashboard.server.json`,
  {
    copy: {
      grade_1: GRADES.g1,
      grade_2: GRADES.g2,
      grade_3: GRADES.g3,
      grade_4: GRADES.g4,
      grade_5: GRADES.g5,
      grade_6: GRADES.g6,
    },
  }
);
writeJson(
  `content-packs/${LOCALE}/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json`,
  {
    copy: {
      grade_1: GRADES.g1,
      grade_2: GRADES.g2,
      grade_3: GRADES.g3,
      grade_4: GRADES.g4,
      grade_5: GRADES.g5,
      grade_6: GRADES.g6,
    },
  }
);
writeJson(`content-packs/${LOCALE}/global-burn-down/lib__site__public-page-seo.json`, {
  copy: {
    digital_practice_for_elementary_learners_in_math_geometry_english_and_sc:
      "Esercitazione digitale per allievi della scuola elementare e della scuola media in Svizzera: matematica, geometria, inglese e scienze.",
    leo_kids_practice_for_elementary_learners:
      "Leo Kids — esercitazione per allievi della scuola elementare e della 1ª media in Svizzera.",
  },
});

console.log("it-CH content-pack generation complete");
