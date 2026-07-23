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
  worksheetGradeLabelHe,
  worksheetLevelLabelHe,
  worksheetSubjectLabelHe,
  worksheetTopicLabelHe,
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
  if (entry.titleHe) return entry.titleHe;
  if (entry.mathPracticeFormat) {
    return mathPracticeFormatTitleHe(
      entry.mathPracticeFormat,
      entry.topicKey,
      entry.gradeKey
    );
  }
  return worksheetTopicLabelHe(entry.subjectId, entry.topicKey);
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 */
function buildPageLabels(entry) {
  const subjectHe = worksheetSubjectLabelHe(entry.subjectId);
  const gradeHe = worksheetGradeLabelHe(entry.subjectId, entry.gradeKey);
  const topicHe = resolveTopicLabel(entry);
  const levelHe = worksheetLevelLabelHe(entry.subjectId, entry.levelKey);
  return { subjectHe, gradeHe, topicHe, levelHe };
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subjectHe: string, gradeHe: string, topicHe: string, levelHe: string }} labels
 * @returns {string}
 */
function buildH1(entry, labels) {
  const levelSuffix =
    entry.levelKey === "advanced" ? ` (${labels.levelHe})` : "";
  return `${labels.topicHe} worksheet${levelSuffix} for ${labels.gradeHe}`;
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subjectHe: string, gradeHe: string, topicHe: string, levelHe: string }} labels
 * @returns {string}
 */
function buildSeoTitle(entry, labels) {
  return `${buildH1(entry, labels)} · Printable | Leo Kids`;
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subjectHe: string, gradeHe: string, topicHe: string, levelHe: string }} labels
 * @returns {string}
 */
function buildSeoDescription(entry, labels) {
  return (
    `Ready ${labels.subjectHe} worksheet for ${labels.gradeHe}: ${labels.topicHe}, ${labels.levelHe} level, ${entry.count} questions. ` +
    "Great for homework, review, and easy printing — with an optional answer key."
  );
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subjectHe: string, gradeHe: string, topicHe: string, levelHe: string }} labels
 * @returns {string}
 */
function buildShortDescription(entry, labels) {
  return (
    `${labels.subjectHe} worksheet for ${labels.gradeHe} on ${labels.topicHe} — ${entry.count} questions at ${labels.levelHe} level, ` +
    "ready to print for home practice."
  );
}

/**
 * @param {ReadyWorksheetCatalogEntry} entry
 * @param {{ subjectHe: string, gradeHe: string, topicHe: string, levelHe: string }} labels
 * @returns {string[]}
 */
function buildLearningGoals(entry, labels) {
  /** @type {string[]} */
  const goals = [
    `Focused practice on ${labels.topicHe} in ${labels.subjectHe} for ${labels.gradeHe}`,
    `Build fluency and accuracy at ${labels.levelHe} level with ${entry.count} ready-made questions`,
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
    subjectHe: labels.subjectHe,
    gradeKey: entry.gradeKey,
    gradeHe: labels.gradeHe,
    topicKey: entry.topicKey,
    topicHe: labels.topicHe,
    levelKey: entry.levelKey,
    levelHe: labels.levelHe,
    count: entry.count,
    inkSave: entry.inkSave === true,
  };
}

/**
 * @param {string} slug
 * @returns {Promise<
 *   | { ok: true, page: ReturnType<typeof buildReadyWorksheetPublicPageMeta>, worksheetPayload: import("./worksheet-question-types.js").WorksheetPayload, generation: Record<string, unknown> }
 *   | { ok: false, status: number }
 * >}
 */
export async function buildReadyWorksheetPublicPage(slug) {
  const entry = getReadyWorksheetBySlug(slug);
  if (!entry) {
    return { ok: false, status: 404 };
  }

  const page = buildReadyWorksheetPublicPageMeta(entry);
  const titleHe = entry.titleHe
    ? entry.titleHe
    : buildWorksheetPayloadMeta({
        subjectId: entry.subjectId,
        gradeKey: entry.gradeKey,
        topicKey: entry.topicKey,
        levelKey: entry.levelKey,
        inkSave: entry.inkSave,
        mathPracticeFormat: entry.mathPracticeFormat,
      }).titleHe;

  const generated = await generateWorksheetForParent({
    subjectId: entry.subjectId,
    gradeKey: entry.gradeKey,
    topicKey: entry.topicKey,
    levelKey: entry.levelKey,
    count: entry.count,
    seed: entry.seed,
    inkSave: entry.inkSave,
    titleHe,
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
 * @returns {ReturnType<typeof buildReadyWorksheetPublicPageMeta> | null}
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
