import { useCallback } from "react";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { globalBurnDownCopyForLocale } from "../lib/i18n/global-burn-down-copy.js";

/**
 * Locale-aware global burn-down copy for React components.
 * @returns {(slug: string, key: string) => string}
 */
export function useGlobalBurnDownCopy() {
  const { locale } = useI18n();
  return useCallback(
    (slug, key) => globalBurnDownCopyForLocale(locale, slug, key),
    [locale]
  );
}
