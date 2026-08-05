/**
 * Public indexable page data for ready question worksheets (30).
 * @module lib/worksheets/worksheet-ready-public-page.server
 */

import { READY_WORKSHEET_CATALOG, getReadyWorksheetBySlug } from "./worksheet-ready-catalog.js";
import { readyWorksheetPublicPath } from "./worksheet-ready-public-paths.js";
import {
  generateWorksheetForParent,
  publicWorksheetPayload,
} from "./worksheet-generate.server.js";
import {
  buildWorksheetPayloadMeta,
  worksheetGradeLabel,
  worksheetLevelLabel,
  worksheetSubjectLabel,
  worksheetTopicLabel,
} from "./worksheet-meta-labels.server.js";
import { mathPracticeFormatTitleHe } from "./worksheet-math-practice-format.js";

/** @typedef {import("./worksheet-ready-catalog.js").ReadyWorksheetCatalogEntry} ReadyWorksheetCatalogEntry */

/**
 * @param {string} slug
 * @returns {string}
 */
export { readyWorksheetPublicPath } from "./worksheet-ready-public-paths.js";

/**
 * @returns {string[]}
 */
export function listReadyWorksheetPublicPaths() {
  return READY_WORKSHEET_CATALOG.map((entry) => readyWorksheetPublicPath(entry.slug));
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @returns {string}
 */
function resolveTopicLabel(entry) {
  if (entry.title) return entry.title;
  if (entry.mathPracticeFormat) {
    return mathPracticeFormatTitleHe(
      entry.mathPracticeFormat,
      entry.topicKey,
      entry.gradeKey
    );
  }
  return worksheetTopicLabel(entry.subjectId, entry.topicKey);
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 */
function buildPageLabels(entry) {
  const subject = worksheetSubjectLabel(entry.subjectId);
  const grade = worksheetGradeLabel(entry.subjectId, entry.gradeKey);
  const topic = resolveTopicLabel(entry);
  const level = worksheetLevelLabel(entry.subjectId, entry.levelKey);
  return { subject, grade, topic, level };
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subject: string, grade: string, topic: string, level: string }} labels
 * @returns {string}
 */
function buildH1(entry, labels) {
  const levelSuffix =
    entry.levelKey === "advanced" ? ` (${labels.level})` : "";
  return `${labels.topic} worksheet${levelSuffix} for ${labels.grade}`;
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subject: string, grade: string, topic: string, level: string }} labels
 * @returns {string}
 */
function buildSeoTitle(entry, labels) {
  return `${buildH1(entry, labels)} · Printable || Leo Kids`;
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subject: string, grade: string, topic: string, level: string }} labels
 * @returns {string}
 */
function buildSeoDescription(entry, labels) {
  return (
    `Ready ${labels.subject} worksheet for ${labels.grade}: ${labels.topic}, ${labels.level} level, ${entry.count} questions. ` +
    "Great for homework, review, and easy printing — with an optional answer key."
  );
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subject: string, grade: string, topic: string, level: string }} labels
 * @returns {string}
 */
function buildShortDescription(entry, labels) {
  return (
    `${labels.subject} worksheet for ${labels.grade} on ${labels.topic} — ${entry.count} questions at ${labels.level} level, ` +
    "ready to print for home practice."
  );
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subject: string, grade: string, topic: string, level: string }} labels
 * @returns {string[]}
 */
function buildLearningGoals(entry, labels) {
  /** @type {string[]} */
  const goals = [
    `Focused practice on ${labels.topic} in ${labels.subject} for ${labels.grade}`,
    `Build fluency and accuracy at ${labels.level} level with ${entry.count} ready-made questions`,
    "Easy to print for classroom, home, or weekend review",
  ];

  if (entry.subjectId === "math" || entry.subjectId === "geometry") {
    goals.push("Work through problems at your own pace and check answers with the answer key");
  } else if (entry.subjectId === "english") {
    goals.push("Practice vocabulary, grammar, and sentence skills in English");
  }

  return goals.slice(0, 4);
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @returns {string[]}
 */
export function pickRelatedWorksheetSlugs(entry) {
  const sameSubject = READY_WORKSHEET_CATALOG.filter(
    (e) => e.subjectId === entry.subjectId && e.slug !== entry.slug
  );
  const sameGrade = READY_WORKSHEET_CATALOG.filter(
    (e) =>
      e.gradeKey === entry.gradeKey &&
      e.slug !== entry.slug &&
      e.subjectId !== entry.subjectId
  );

  /** @type {string[]} */
  const picked = [];
  for (const candidate of sameSubject) {
    if (picked.length >= 4) break;
    picked.push(candidate.slug);
  }
  for (const candidate of sameGrade) {
    if (picked.length >= 6) break;
    if (!picked.includes(candidate.slug)) picked.push(candidate.slug);
  }
  return picked;
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 */
export function buildReadyWorksheetPublicPageMeta(entry) {
  const labels = buildPageLabels(entry);
  const slug = entry.slug;
  const h1 = buildH1(entry, labels);
  return {
    slug,
    canonicalPath: readyWorksheetPublicPath(slug),
    h1,
    seoTitle: buildSeoTitle(entry, labels),
    seoDescription: buildSeoDescription(entry, labels),
    shortDescription: buildShortDescription(entry, labels),
    learningGoals: buildLearningGoals(entry, labels),
    relatedWorksheetSlugs: pickRelatedWorksheetSlugs(entry),
    subjectId: entry.subjectId,
    subject: labels.subject,
    gradeKey: entry.gradeKey,
    grade: labels.grade,
    topicKey: entry.topicKey,
    topic: labels.topic,
    levelKey: entry.levelKey,
    level: labels.level,
    count: entry.count,
    inkSave: entry.inkSave === true,
  };
}

/**
 * @param {string} slug
 * @returns {Promise<
 *   || { ok: true, page: ReturnType<typeof buildReadyWorksheetPublicPageMeta>, worksheetPayload: import("./worksheet-question-types.js").WorksheetPayload, generation: Record<string, unknown> }
 *   || { ok: false, status: number }
 * >}
 */
export async function buildReadyWorksheetPublicPage(slug) {
  const entry = getReadyWorksheetBySlug(slug);
  if (!entry) {
    return { ok: false, status: 404 };
  }

  const page = buildReadyWorksheetPublicPageMeta(entry);
  const title = entry.title
    ? entry.title
    : buildWorksheetPayloadMeta({
        subjectId: entry.subjectId,
        gradeKey: entry.gradeKey,
        topicKey: entry.topicKey,
        levelKey: entry.levelKey,
        inkSave: entry.inkSave,
        mathPracticeFormat: entry.mathPracticeFormat,
      }).title;

  const generated = await generateWorksheetForParent({
    subjectId: entry.subjectId,
    gradeKey: entry.gradeKey,
    topicKey: entry.topicKey,
    levelKey: entry.levelKey,
    count: entry.count,
    seed: entry.seed,
    inkSave: entry.inkSave,
    title,
    mathPracticeFormat: entry.mathPracticeFormat,
  });

  if (!generated.ok) {
    return { ok: false, status: generated.status || 500 };
  }

  return {
    ok: true,
    page,
    worksheetPayload: publicWorksheetPayload(generated.worksheetPayload),
    generation: generated.generation,
  };
}

/**
 * @param {string} slug
 * @returns {ReturnType<typeof buildReadyWorksheetPublicPageMeta> || null}
 */
export function getReadyWorksheetPublicPageMeta(slug) {
  const entry = getReadyWorksheetBySlug(slug);
  if (!entry) return null;
  return buildReadyWorksheetPublicPageMeta(entry);
}

/**
 * @param {string[]} slugs
 * @returns {Array<ReturnType<typeof buildReadyWorksheetPublicPageMeta>>}
 */
export function listReadyWorksheetPublicPageMetaBySlugs(slugs) {
  return slugs
    .map((slug) => getReadyWorksheetPublicPageMeta(slug))
    .filter(Boolean);
}
