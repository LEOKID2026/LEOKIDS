import Link from "next/link";
import { MATH_G1_BOOK_META } from "../../lib/learning-book/math-g1-registry";
import { appendReturnQueryToHref } from "../../lib/learning-book/math-g1-book-nav";
import { useBookGradeTheme } from "./BookGradeThemeContext";
import MixedHebrewMathText from "./MixedHebrewMathText";
import { useBookUiCopy } from "../../lib/learning-book/book-locale-context.jsx";

export default function BookTocModal({
  open,
  onClose,
  batches,
  activePageId,
  returnQuerySuffix = "",
  routeBase = MATH_G1_BOOK_META.routeBase,
}) {
  const { classes: theme } = useBookGradeTheme();
  const copy = useBookUiCopy();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-toc-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label={copy("shell", "tocCloseAria")}
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex max-h-[min(92vh,40rem)] w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl border shadow-2xl ${theme.tocModalPanel}`}
        dir="ltr"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--book-divider)] px-5 py-4">
          <h2 id="book-toc-title" className="text-lg font-bold text-[color:var(--book-text)]">
            {copy("shell", "tocTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${theme.tocCloseButton}`}
          >
            {copy("shell", "tocClose")}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <nav className="space-y-5" aria-label={copy("shell", "tocAria")}>
            {batches.map((batch) => (
              <div key={batch.id}>
                <h3 className={`mb-2 text-sm font-bold ${theme.tocBatchHeading}`}>
                  {batch.titleHe}
                </h3>
                <ul className="space-y-1.5">
                  {batch.pages.map((entry) => {
                    const isActive = entry.pageId === activePageId;
                    return (
                      <li key={entry.pageId}>
                        <Link
                          href={appendReturnQueryToHref(
                            `${routeBase}/${entry.pageId}`,
                            returnQuerySuffix
                          )}
                          onClick={onClose}
                          className={`block rounded-xl px-4 py-2.5 text-left text-sm transition ${
                            isActive
                              ? theme.tocActiveItem
                              : "bg-[color:var(--book-surface-soft)] text-[color:var(--book-text)] hover:bg-[color:var(--book-accent-muted)]"
                          }`}
                        >
                          <MixedHebrewMathText text={entry.displayTitle} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="border-t border-[color:var(--book-divider)] px-5 py-3">
          <Link
            href={appendReturnQueryToHref(routeBase, returnQuerySuffix)}
            onClick={onClose}
            className={`block text-center text-sm font-semibold ${theme.tocFooterLink}`}
          >
            {copy("shell", "tocBackHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
