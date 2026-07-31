/**
 * English user-facing labels for writing worksheet validation errors.
 * Resolves via locales/en/worksheets.json — do not hardcode display strings here.
 * @module lib/writing/writing-error-labels.en
 */

import { createTranslator } from "../i18n/create-translator.js";

/** @type {Record<string, string>} */
export const WRITING_ERROR_I18N_KEYS = Object.freeze({
  INVALID_NON_ENGLISH_CHARACTERS: "worksheets.writingErrorInvalidNonEnglishCharacters",
  INVALID_ENGLISH_CHARACTERS: "worksheets.writingErrorInvalidEnglishCharacters",
  INVALID_LETTER_CASE: "worksheets.writingErrorInvalidLetterCase",
  INVALID_NUMBER_RANGE: "worksheets.writingErrorInvalidNumberRange",
  INVALID_NUMBER_MODE: "worksheets.writingErrorInvalidNumberMode",
  INVALID_PREWRITING_PATH: "worksheets.writingErrorInvalidPrewritingPath",
  INVALID_WORD_PACK: "worksheets.writingErrorInvalidWordPack",
  INVALID_CUSTOM_WORDS: "worksheets.writingErrorInvalidCustomWords",
  INVALID_ENGLISH_WORDS: "worksheets.writingErrorInvalidEnglishWords",
  INVALID_CUSTOM_TEXT: "worksheets.writingErrorInvalidCustomText",
  INVALID_CUSTOM_TEXT_KIND: "worksheets.writingErrorInvalidCustomTextKind",
  CUSTOM_TEXT_TOO_LONG: "worksheets.writingErrorCustomTextTooLong",
  ADDRESS_BLOCKED: "worksheets.writingErrorAddressBlocked",
  PHONE_BLOCKED: "worksheets.writingErrorPhoneBlocked",
  BIDI_OVERRIDE_BLOCKED: "worksheets.writingErrorUnsupportedCharacters",
  CONTROL_CHAR_BLOCKED: "worksheets.writingErrorUnsupportedCharacters",
  INVALID_BODY: "worksheets.writingErrorInvalidBody",
  BODY_TOO_LARGE: "worksheets.writingErrorBodyTooLarge",
  INVALID_WRITING_CATEGORY: "worksheets.writingErrorInvalidWritingCategory",
  PUBLIC_DEMO_CONTENT_NOT_ALLOWED: "worksheets.writingErrorPublicDemoContentNotAllowed",
  no_printable_pages: "worksheets.writingErrorNoPrintablePages",
});

/**
 * @param {string | undefined | null} code
 * @param {string} [locale]
 * @returns {string}
 */
export function writingErrorLabelEn(code, locale = "en") {
  const key = String(code || "").trim();
  const i18nKey = WRITING_ERROR_I18N_KEYS[key];
  if (!i18nKey) return "";
  const { t } = createTranslator(locale);
  return t(i18nKey);
}

/** @deprecated Use WRITING_ERROR_I18N_KEYS + writingErrorLabelEn */
export const WRITING_ERROR_LABELS_EN = new Proxy(
  {},
  {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      return writingErrorLabelEn(prop);
    },
    ownKeys() {
      return Reflect.ownKeys(WRITING_ERROR_I18N_KEYS);
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (typeof prop !== "string" || !(prop in WRITING_ERROR_I18N_KEYS)) return undefined;
      return { configurable: true, enumerable: true, value: writingErrorLabelEn(prop) };
    },
  }
);
