import { useMemo } from "react";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { getMarketingLandingContentForLocale } from "../lib/seo/locale-public-seo-content.js";

/**
 * @param {"kids"|"parents"|"teachers"|"schools"} audience
 */
export function useMarketingLandingContent(audience) {
  const { locale } = useI18n();
  return useMemo(() => getMarketingLandingContentForLocale(locale, audience), [locale, audience]);
}
