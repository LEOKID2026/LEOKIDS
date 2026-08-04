import { useMemo } from "react";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import {
  getDefaultPublicSeoFooterCta,
  getWorksheetsPublicSeoFooterCta,
} from "../components/seo/public-seo-wide-defaults.js";

export function useDefaultPublicSeoFooterCta() {
  const { locale } = useI18n();
  return useMemo(() => getDefaultPublicSeoFooterCta(locale), [locale]);
}

export function useWorksheetsPublicSeoFooterCta() {
  const { locale } = useI18n();
  return useMemo(() => getWorksheetsPublicSeoFooterCta(locale), [locale]);
}
