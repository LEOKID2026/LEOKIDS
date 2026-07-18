import { useMemo } from "react";
import { useI18n } from "../i18n/I18nProvider.jsx";
import { createBookUiCopy } from "./book-pack-copy.js";

/** Locale-aware learning book UI copy bound to content locale. */
export function useBookUiCopy() {
  const { contentLocale } = useI18n();
  return useMemo(() => createBookUiCopy(contentLocale), [contentLocale]);
}

export {
  createBookUiCopy,
  bookUiCopyForLocale,
  bookUiCopy,
  resolveRegistryTitleKey,
  resolveBookTitleKey,
  resolveSectionDisplayTitle,
  getLearningBookSubjectLabelCopy,
} from "./book-pack-copy.js";
