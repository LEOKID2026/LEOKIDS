import React, { createContext, useContext, useMemo } from "react";
import { createTranslator } from "./create-translator.js";
import { FALLBACK_LOCALE, resolveLocaleDefinition } from "./locale-registry.js";

const I18nContext = createContext(null);

/**
 * @param {{ locale?: string, children: React.ReactNode }} props
 */
export function I18nProvider({ locale = FALLBACK_LOCALE, children }) {
  const value = useMemo(() => {
    const def = resolveLocaleDefinition(locale);
    const translator = createTranslator(def.id);
    return {
      locale: def.id,
      direction: def.direction,
      t: translator.t,
      getMissingKeys: translator.getMissingKeys,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const fallback = createTranslator(FALLBACK_LOCALE);
    return {
      locale: FALLBACK_LOCALE,
      direction: "ltr",
      t: fallback.t,
      getMissingKeys: fallback.getMissingKeys,
    };
  }
  return ctx;
}

/**
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
export function useT() {
  const { t } = useI18n();
  return t;
}
