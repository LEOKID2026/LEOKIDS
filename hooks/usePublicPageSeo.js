import { useMemo } from "react";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { getPublicPageSeoForLocale } from "../lib/site/public-page-seo.js";

/**
 * Resolved public marketing SEO for the active interface locale.
 * @param {string} pageKey
 */
export function usePublicPageSeo(pageKey) {
  const { locale } = useI18n();
  return useMemo(() => getPublicPageSeoForLocale(locale, pageKey), [locale, pageKey]);
}
