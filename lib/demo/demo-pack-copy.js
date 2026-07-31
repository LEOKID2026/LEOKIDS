import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../i18n/message-format.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { resolveRegisteredContentPack } from "../content/resolve-registered-pack.js";

/**
 * @param {string|null|undefined} locale
 */
function demoUiSource(locale) {
  return resolveRegisteredContentPack(locale, "demo", "ui.json") || {};
}

/**
 * @param {string} text
 * @param {string|null|undefined} locale
 */
export function applyDemoLocaleTransform(text, locale) {
  const id = resolveLocaleDefinition(locale || "en").id;
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
 * @param {string|null|undefined} locale
 * @param {string} group
 * @param {string} key
 */
function lookupUiString(locale, group, key) {
  const groupNode = demoUiSource(locale)[group];
  if (!groupNode || typeof groupNode !== "object") return String(key || "");
  if (String(key).includes(".")) {
    const nested = getNested(groupNode, String(key).split("."));
    if (typeof nested === "string") return nested;
    return String(key || "");
  }
  if (typeof groupNode[key] === "string") {
    return groupNode[key];
  }
  return String(key || "");
}

/**
 * @param {string} group
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function demoPackCopy(group, key, vars) {
  const raw = lookupUiString("en", group, key);
  return formatMessage(raw, vars, "en");
}

/**
 * @param {string|null|undefined} locale
 * @param {string} group
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function demoPackCopyForLocale(locale, group, key, vars) {
  const localeId = resolveLocaleDefinition(locale || "en").id;
  const raw = lookupUiString(localeId, group, key);
  const formatted = formatMessage(raw, vars, localeId);
  return applyDemoLocaleTransform(formatted, localeId);
}

/**
 * @param {string|null|undefined} locale
 */
export function createDemoPackCopy(locale) {
  return (group, key, vars) => demoPackCopyForLocale(locale, group, key, vars);
}

/**
 * @param {string|null|undefined} locale
 * @param {string} gradeKey
 */
export function demoGradeLabelForLocale(locale, gradeKey) {
  const key = String(gradeKey || "g3").trim().toLowerCase();
  const label = lookupUiString(locale, "grades", key);
  if (label !== key) {
    return demoPackCopyForLocale(locale, "grades", key);
  }
  return demoPackCopyForLocale(locale, "display", "studentName");
}
