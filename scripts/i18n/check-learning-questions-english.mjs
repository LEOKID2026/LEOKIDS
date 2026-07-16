#!/usr/bin/env node
/**
 * Smoke: generated/bank learning questions must be English in student-facing fields.
 * Run: node scripts/i18n/check-learning-questions-english.mjs
 */
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const mod = (rel) => import(pathToFileURL(join(ROOT, rel)).href);

const HEBREW_RE = /[\u0590-\u05FF]/;
const SAMPLES_PER_CELL = 8;
const GRADES = ["g1", "g2", "g3", "g4", "g5", "g6"];
const LEVELS = ["easy", "medium", "hard"];

const FIELD_KEYS = [
  "question",
  "exerciseText",
  "questionLabel",
  "stem",
  "explanation",
  "feedback",
  "correctAnswer",
  "answers",
  "options",
  "acceptedAnswers",
  "theoryLines",
];

function collectFields(q) {
  const out = [];
  if (!q || typeof q !== "object") return out;
  for (const key of FIELD_KEYS) {
    const v = q[key];
    if (typeof v === "string" && v.trim()) out.push({ key, text: v });
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === "string" && item.trim()) {
          out.push({ key: `${key}[${i}]`, text: item });
        }
      });
    }
  }
  return out;
}

function recordFailure(failures, ctx, q, field) {
  failures.push({
    ...ctx,
    field: field.key,
    sample: field.text.slice(0, 120),
  });
}

async function loadCurriculumTopics(subject) {
  const topics = new Set();
  for (const grade of GRADES) {
    const file = join(ROOT, "curriculum/international", subject, `${grade}.json`);
    const rows = JSON.parse((await import("node:fs")).readFileSync(file, "utf8"));
    for (const row of rows) {
      if (row.topic && row.topic !== "mixed") topics.add(row.topic);
    }
  }
  return [...topics];
}

async function checkMath(failures) {
  const { generateQuestion } = await mod("utils/math-question-generator.js");
  const { getLevelConfig } = await mod("utils/math-storage.js");
  const { GRADES: MATH_GRADES } = await mod("utils/math-constants.js");
  for (const grade of GRADES) {
    const ops = (MATH_GRADES[grade]?.operations || []).filter((o) => o !== "mixed");
    for (const topic of ops) {
      for (const level of LEVELS) {
        for (let i = 0; i < SAMPLES_PER_CELL; i++) {
          const lc = getLevelConfig(parseInt(grade.slice(1), 10), level);
          const q = generateQuestion(lc, topic, grade, null);
          const ctx = { subject: "math", grade, topic, level, i };
          for (const field of collectFields(q)) {
            if (HEBREW_RE.test(field.text)) recordFailure(failures, ctx, q, field);
          }
        }
      }
    }
  }
}

async function checkGeometry(failures) {
  const { generateQuestion } = await mod("utils/geometry-question-generator.js");
  const { GRADES: GEO_GRADES, LEVELS: GLEVELS } = await mod("utils/geometry-constants.js");
  for (const grade of GRADES) {
    const topics = (GEO_GRADES[grade]?.topics || []).filter((t) => t !== "mixed");
    for (const topic of topics) {
      for (const level of LEVELS) {
        for (let i = 0; i < SAMPLES_PER_CELL; i++) {
          const q = generateQuestion(GLEVELS[level], topic, grade, null);
          const ctx = { subject: "geometry", grade, topic, level, i };
          for (const field of collectFields(q)) {
            if (HEBREW_RE.test(field.text)) recordFailure(failures, ctx, q, field);
          }
        }
      }
    }
  }
}

async function checkEnglish(failures) {
  const { generateQuestion, ENGLISH_LEVELS } = await mod("utils/english-question-generator.js");
  const { ENGLISH_GRADES } = await mod("data/english-curriculum.js");
  for (const grade of GRADES) {
    const topics = (ENGLISH_GRADES[grade]?.topics || []).filter((t) => t !== "mixed");
    for (const topic of topics) {
      for (const level of LEVELS) {
        for (let i = 0; i < SAMPLES_PER_CELL; i++) {
          const q = generateQuestion(ENGLISH_LEVELS[level], topic, grade, null);
          const ctx = { subject: "english", grade, topic, level, i };
          for (const field of collectFields(q)) {
            if (HEBREW_RE.test(field.text)) recordFailure(failures, ctx, q, field);
          }
        }
      }
    }
  }
}

async function checkScience(failures) {
  const { SCIENCE_QUESTIONS } = await mod("data/science-questions.js");
  const LEVEL_RANK = { easy: 0, medium: 1, hard: 2 };
  const topics = await loadCurriculumTopics("science");
  for (const grade of GRADES) {
    for (const topic of topics) {
      for (const level of LEVELS) {
        const req = LEVEL_RANK[level];
        const pool = SCIENCE_QUESTIONS.filter((row) => {
          if (row.topic !== topic) return false;
          if (!Array.isArray(row.grades) || !row.grades.includes(grade)) return false;
          const lo = LEVEL_RANK[String(row.minLevel || "easy")] ?? 0;
          const hi = LEVEL_RANK[String(row.maxLevel || "hard")] ?? 2;
          return req >= lo && req <= hi;
        });
        if (!pool.length) continue;
        for (let i = 0; i < SAMPLES_PER_CELL; i++) {
          const q = pool[i % pool.length];
          const ctx = { subject: "science", grade, topic, level, i, id: q.id };
          for (const field of collectFields(q)) {
            if (HEBREW_RE.test(field.text)) recordFailure(failures, ctx, q, field);
          }
        }
      }
    }
  }
}

async function main() {
  const failures = [];
  await checkMath(failures);
  await checkGeometry(failures);
  await checkEnglish(failures);
  await checkScience(failures);

  if (failures.length) {
    console.error(
      `[i18n:learning-questions] FAIL — ${failures.length} Hebrew field(s) in student-facing content`
    );
    for (const f of failures.slice(0, 60)) {
      console.error(
        `  ${f.subject} ${f.grade}/${f.topic}/${f.level} [${f.field}] id=${f.id || "-"} :: ${f.sample}`
      );
    }
    if (failures.length > 60) {
      console.error(`  … +${failures.length - 60} more`);
    }
    process.exit(1);
  }
  console.log("[i18n:learning-questions] OK — math/geometry/english/science samples are English");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
