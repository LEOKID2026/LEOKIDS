import { useMemo } from "react";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { getLegalPolicyBundleForLocale } from "../lib/legal/locale-legal-content.js";

export function useLegalPolicyBundle() {
  const { locale } = useI18n();
  return useMemo(() => getLegalPolicyBundleForLocale(locale), [locale]);
}
