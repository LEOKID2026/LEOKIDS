/**
 * Central speech/TTS locale resolver — separates UI, content, and report speech.
 */

import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { resolveContentLocale, resolveInterfaceLocale, resolveReportLocale } from "../i18n/locale-resolution.js";

/**
 * @param {{
 *   interfaceLocale?: string|null,
 *   contentLocale?: string|null,
 *   reportLocale?: string|null,
 *   kind?: 'ui'|'content'|'report',
 * }} [opts]
 */
export function resolveSpeechLocale(opts = {}) {
  const kind = opts.kind || "ui";
  if (kind === "content") {
    const cl = resolveContentLocale({
      contentLocale: opts.contentLocale,
      interfaceLocale: opts.interfaceLocale,
    });
    return resolveLocaleDefinition(cl).textToSpeechLocale;
  }
  if (kind === "report") {
    const rl = resolveReportLocale({
      reportLocale: opts.reportLocale,
      interfaceLocale: opts.interfaceLocale,
    });
    return resolveLocaleDefinition(rl).textToSpeechLocale;
  }
  const il = resolveInterfaceLocale({
    profileInterfaceLocale: opts.interfaceLocale,
    preferCookie: false,
  });
  return resolveLocaleDefinition(il).textToSpeechLocale;
}

/**
 * @param {{
 *   interfaceLocale?: string|null,
 *   contentLocale?: string|null,
 *   reportLocale?: string|null,
 * }} [opts]
 */
export function resolveSpeechLocales(opts = {}) {
  return {
    uiSpeechLocale: resolveSpeechLocale({ ...opts, kind: "ui" }),
    contentSpeechLocale: resolveSpeechLocale({ ...opts, kind: "content" }),
    reportSpeechLocale: resolveSpeechLocale({ ...opts, kind: "report" }),
  };
}

/**
 * Build cache key segment for audio artifacts.
 * @param {string} logicalKey
 * @param {string} contentLocale
 */
export function buildAudioCacheKey(logicalKey, contentLocale) {
  const loc = resolveContentLocale({ contentLocale });
  return `${loc}:${logicalKey}`;
}

/**
 * Resolve browser speechSynthesis lang tag.
 * @param {string|null|undefined} locale
 */
export function resolveBrowserSpeechLang(locale) {
  return resolveLocaleDefinition(locale).textToSpeechLocale;
}
