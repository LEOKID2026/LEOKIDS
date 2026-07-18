import bookUiJson from "../../content-packs/en/books/ui.json" with { type: "json" };
import registryTitles from "../../content-packs/en/books/registry-titles.json" with { type: "json" };
import englishSkills from "../../content-packs/en/books/english-page-skills.json" with { type: "json" };
import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";

/** @type {typeof bookUiJson} */
const BOOK_UI_SOURCE = bookUiJson;

/**
 * @param {string} text
 * @param {string|null|undefined} contentLocale
 */
export function applyBookLocaleTransform(text, contentLocale) {
  const id = resolveLocaleDefinition(contentLocale || "en").id;
  const s = String(text ?? "");
  if (!s) return s;
  if (id === "en-XA") return applyPseudoLong(s);
  if (id === "ar-XB") return applyPseudoRtl(s);
  return s;
}

/**
 * @param {unknown} node
 * @param {string[]} path
 */
function getNested(node, path) {
  let cur = node;
  for (const seg of path) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[seg];
  }
  return cur;
}

/**
 * @param {string} group
 * @param {string} key
 */
function lookupUiString(group, key) {
  const groupNode = BOOK_UI_SOURCE[group];
  if (!groupNode || typeof groupNode !== "object") return String(key || "");
  if (String(key).includes(".")) {
    const nested = getNested(groupNode, String(key).split("."));
    if (typeof nested === "string") return nested;
    return String(key || "");
  }
  if (typeof groupNode[key] === "string") return groupNode[key];
  return String(key || "");
}

/**
 * @param {string} group
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function bookUiCopy(group, key, vars) {
  const raw = lookupUiString(group, key);
  return formatMessage(raw, vars, "en");
}

/**
 * @param {string|null|undefined} contentLocale
 * @param {string} group
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function bookUiCopyForLocale(contentLocale, group, key, vars) {
  const localeId = resolveLocaleDefinition(contentLocale || "en").id;
  const raw = lookupUiString(group, key);
  const formatted = formatMessage(raw, vars, localeId);
  return applyBookLocaleTransform(formatted, localeId);
}

/**
 * @param {string|null|undefined} contentLocale
 */
export function createBookUiCopy(contentLocale) {
  return (group, key, vars) => bookUiCopyForLocale(contentLocale, group, key, vars);
}

/**
 * @param {string} titleKey e.g. math.g1.a or math.g1.bookTitle
 * @param {string|null|undefined} [contentLocale]
 */
export function resolveRegistryTitleKey(titleKey, contentLocale = "en") {
  const key = String(titleKey || "").trim();
  if (!key) return "";

  if (key.endsWith(".bookTitle")) {
    const bookKey = key.replace(/\.bookTitle$/, "");
    const raw = registryTitles.meta?.[bookKey]?.bookTitle || "";
    if (!raw) throw new Error(`missing book title pack entry: ${key}`);
    return applyBookLocaleTransform(raw, contentLocale);
  }

  const parts = key.split(".");
  if (parts.length >= 3) {
    const bookKey = `${parts[0]}.${parts[1]}`;
    const batchId = parts.slice(2).join(".");
    const raw = registryTitles.batches?.[bookKey]?.[batchId]?.title || "";
    if (!raw) return applyBookLocaleTransform(batchId, contentLocale);
    return applyBookLocaleTransform(raw, contentLocale);
  }

  throw new Error(`invalid registry titleKey: ${key}`);
}

/** @param {string} bookTitleKey @param {string|null|undefined} [contentLocale] */
export function resolveBookTitleKey(bookTitleKey, contentLocale = "en") {
  return resolveRegistryTitleKey(bookTitleKey, contentLocale);
}

/**
 * @param {string} rawTitle markdown section heading
 * @param {string|null|undefined} [contentLocale]
 */
export function resolveSectionDisplayTitle(rawTitle, contentLocale = "en") {
  const title = String(rawTitle || "").trim();
  const copy = createBookUiCopy(contentLocale);
  const fromMap = BOOK_UI_SOURCE.sections?.map?.[title];
  if (fromMap) return applyBookLocaleTransform(fromMap, contentLocale);
  if (/visual/i.test(title)) return copy("sections", "visualFallback");
  if (/watch out/i.test(title)) return copy("sections", "watchOutFallback");
  return title;
}

/**
 * @param {string} subject code
 * @param {string|null|undefined} [contentLocale]
 */
export function getLearningBookSubjectLabelCopy(subject, contentLocale = "en") {
  const key = String(subject || "").toLowerCase();
  const copy = createBookUiCopy(contentLocale);
  const label = copy("subjects", key);
  if (label && label !== key) return label;
  return copy("subjects", "math");
}

/**
 * @param {string} grade e.g. g1
 * @param {string} pageKey
 * @param {"title"|"description"} field
 * @param {string|null|undefined} [contentLocale]
 */
export function resolveEnglishSkillCopy(grade, pageKey, field, contentLocale = "en") {
  const entry = englishSkills.grades?.[grade]?.[pageKey];
  if (!entry) return "";
  const raw = field === "title" ? entry.title : entry.description;
  const fieldName = field === "title" ? "title" : "description";
  if (entry.doNotTranslateFields?.includes(fieldName)) {
    return String(raw || "");
  }
  return applyBookLocaleTransform(formatMessage(String(raw || ""), {}, contentLocale), contentLocale);
}

/**
 * @param {string} group
 * @param {string} key
 */
export function assertBookPackKey(group, key) {
  const raw = lookupUiString(group, key);
  if (!raw || raw === key || raw === `${group}.${key}`) {
    throw new Error(`missing book pack key: ${group}.${key}`);
  }
  return raw;
}
