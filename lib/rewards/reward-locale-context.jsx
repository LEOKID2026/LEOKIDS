import { useMemo } from "react";
import { useI18n } from "../i18n/I18nProvider.jsx";
import { createRewardUiCopy } from "./reward-pack-copy.js";

/** Locale-aware reward UI copy bound to interface locale (chrome), with content fallback. */
export function useRewardUiCopy() {
  const { locale, contentLocale } = useI18n();
  const copyLocale = locale || contentLocale || "en";
  return useMemo(() => createRewardUiCopy(copyLocale), [copyLocale]);
}

export { createRewardUiCopy, rewardUiCopyForLocale, resolveRewardCardEntry, loadRewardCardCatalog } from "./reward-pack-copy.js";
