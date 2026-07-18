import { useMemo } from "react";
import { useI18n } from "../i18n/I18nProvider.jsx";
import { createRewardUiCopy } from "./reward-pack-copy.js";

/** Locale-aware reward UI copy bound to content locale. */
export function useRewardUiCopy() {
  const { contentLocale } = useI18n();
  return useMemo(() => createRewardUiCopy(contentLocale), [contentLocale]);
}

export { createRewardUiCopy, rewardUiCopyForLocale, resolveRewardCardEntry, loadRewardCardCatalog } from "./reward-pack-copy.js";
