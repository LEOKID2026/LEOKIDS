import { useMemo } from "react";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { getWorksheetsPageContentForLocale } from "../lib/seo/locale-public-seo-content.js";

export function useWorksheetsPageContent() {
  const { locale } = useI18n();
  return useMemo(() => getWorksheetsPageContentForLocale(locale), [locale]);
}
