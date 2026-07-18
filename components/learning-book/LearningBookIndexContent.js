import Link from "next/link";
import { useMemo } from "react";
import { useBookGradeTheme } from "./BookGradeThemeContext";
import MixedHebrewMathText from "./MixedHebrewMathText";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { resolveRegistryTitleKey } from "../../lib/learning-book/book-pack-copy.js";

export default function LearningBookIndexContent({ batches, routeBase }) {
  const { classes: theme } = useBookGradeTheme();
  const { contentLocale } = useI18n();
  const resolvedBatches = useMemo(
    () =>
      (batches || []).map((batch) => ({
        ...batch,
        titleHe: batch.titleKey
          ? resolveRegistryTitleKey(String(batch.titleKey), contentLocale)
          : batch.titleHe || batch.title || "",
      })),
    [batches, contentLocale],
  );

  return (
    <div className="space-y-8" dir="ltr">
      {resolvedBatches.map((batch) => (
        <section key={batch.id}>
          <h2
            className={`mb-4 text-left text-lg font-bold sm:text-xl ${theme.indexBatchHeading}`}
          >
            {batch.titleHe}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {batch.pages.map((entry) => (
              <li key={entry.pageId}>
                <Link
                  href={`${routeBase}/${entry.pageId}`}
                  className={`flex min-h-[3.25rem] items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left shadow-sm transition ${theme.indexTopicTile}`}
                >
                  <span className="text-base font-semibold text-[color:var(--book-text)] sm:text-lg">
                    <MixedHebrewMathText text={entry.displayTitle} />
                  </span>
                  <span
                    className={`shrink-0 text-lg ${theme.indexTopicIcon}`}
                    aria-hidden="true"
                  >
                    📖
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
