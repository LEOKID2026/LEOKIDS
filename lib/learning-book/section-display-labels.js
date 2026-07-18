/**
 * Resolve section display title from markdown heading via book pack.
 */

import { resolveSectionDisplayTitle as resolveFromPack } from "./book-pack-copy.js";

/** @param {string} rawTitle @param {string|null|undefined} [contentLocale] */
export function getSectionDisplayTitle(rawTitle, contentLocale = "en") {
  return resolveFromPack(rawTitle, contentLocale);
}
