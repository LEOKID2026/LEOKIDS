/**
 * Stable ASCII filenames for writing glyph assets (English letters and digits).
 * @module lib/writing/glyph-asset-slugs
 */

/**
 * @param {string} character
 * @returns {string}
 */
export function glyphAssetSlug(character) {
  const ch = String(character || "").trim();
  if (!ch) {
    throw new Error("glyphAssetSlug: empty character");
  }
  if (/^\d$/.test(ch)) {
    return `digit-${ch}`;
  }
  if (/^[A-Za-z]$/.test(ch)) {
    return ch;
  }
  throw new Error(
    `glyphAssetSlug: no ASCII slug for character "${ch}" (U+${ch.codePointAt(0)?.toString(16)})`
  );
}

/**
 * @param {string} slug
 * @returns {boolean}
 */
export function isLegacyEncodedGlyphFilename(name) {
  return /%[0-9A-Fa-f]{2}/.test(String(name || ""));
}

export function allGlyphCharactersForBuild() {
  return {
    englishUpper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    englishLower: "abcdefghijklmnopqrstuvwxyz".split(""),
    digits: "0123456789".split(""),
  };
}
