import { useMemo } from "react";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { getPracticePageContentForLocale } from "../lib/seo/locale-public-seo-content.js";

/**
 * @param {string} slug
 */
export function usePracticePageContent(slug) {
  const { locale } = useI18n();
  return useMemo(() => getPracticePageContentForLocale(locale, slug), [locale, slug]);
}
