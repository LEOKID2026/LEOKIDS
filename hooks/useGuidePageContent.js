import { useMemo } from "react";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { getGuidePageContentForLocale } from "../lib/seo/locale-public-seo-content.js";

/**
 * @param {string} slug
 */
export function useGuidePageContent(slug) {
  const { locale } = useI18n();
  return useMemo(() => getGuidePageContentForLocale(locale, slug), [locale, slug]);
}
