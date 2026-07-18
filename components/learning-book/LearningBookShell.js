import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { getBookGradeTheme } from "../../lib/learning-book/book-grade-themes";
import { formatBookShellTitle } from "../../lib/learning-book/format-book-shell-title";
import { BookGradeThemeProvider } from "./BookGradeThemeContext";
import BookShellHeader from "./BookShellHeader";
import BookTocModal from "./BookTocModal";
import StudentAdSlot from "../student/StudentAdSlot.jsx";
import { useBookUiCopy } from "../../lib/learning-book/book-locale-context.jsx";
import { resolveBookTitleKey, resolveRegistryTitleKey } from "../../lib/learning-book/book-pack-copy.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Shared learning book shell for all subjects/grades.
 */
export default function LearningBookShell({
  children,
  batches,
  activePageId = null,
  pageMeta = null,
  subject,
  grade,
  bookMeta,
  nav,
}) {
  const router = useRouter();
  const [tocOpen, setTocOpen] = useState(false);
  const isIndex = activePageId === null;
  const copy = useBookUiCopy();
  const { contentLocale } = useI18n();

  const fromLearning = nav.isLearningReturn(router.query);
  const returnQuerySuffix = nav.getReturnQuerySuffix(router.query);
  const theme = getBookGradeTheme(grade);

  const returnLabel = fromLearning
    ? copy("shell", "backClose")
    : subject === "geometry"
      ? copy("shell", "backGeometry")
      : subject === "science"
        ? copy("shell", "backScience")
        : subject === "hebrew"
          ? copy("shell", "backHebrew")
          : subject === "english"
            ? copy("shell", "backEnglish")
            : subject === "moledet"
              ? copy("shell", "backHomeland")
              : subject === "geography"
                ? copy("shell", "backGeography")
                : subject === "history"
                  ? copy("shell", "backHistory")
                  : copy("shell", "backMath");

  const shellTitle = useMemo(() => {
    const raw = bookMeta.bookTitleKey
      ? resolveBookTitleKey(String(bookMeta.bookTitleKey), contentLocale)
      : bookMeta.bookTitle || bookMeta.bookTitleHe || "";
    return formatBookShellTitle(raw);
  }, [bookMeta, contentLocale]);

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

  const handleReturnClick = () => {
    if (fromLearning) {
      nav.handleClose(router);
      return;
    }
    router.push(nav.masterPath);
  };

  return (
    <BookGradeThemeProvider grade={grade}>
      <main
        className={`min-h-screen overflow-x-hidden text-[color:var(--book-text)] ${theme.classes.pageBg}`}
      >
        <header
          className={`sticky top-0 z-50 border-b border-[color:var(--book-accent-border)] backdrop-blur-md ${theme.classes.headerBg}`}
          dir="ltr"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <BookShellHeader
            fromLearning={fromLearning}
            onReturn={handleReturnClick}
            onOpenToc={() => setTocOpen(true)}
            themeClasses={theme.classes}
            title={shellTitle}
            isIndex={isIndex}
            pageMeta={pageMeta}
            indexSubtitle={copy("shell", "indexSubtitle", {
              grade: bookMeta.gradeShortLabel || bookMeta.grade,
            })}
            activePageTitleClass={theme.classes.activePageTitle}
          />
        </header>

        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6">
          <div className="min-w-0">{children}</div>

          {isIndex ? (
            <footer className="mt-8 pb-6 text-center" dir="ltr">
              <button
                type="button"
                onClick={handleReturnClick}
                className={`text-sm ${theme.classes.indexFooterLink}`}
              >
                {returnLabel}
              </button>
            </footer>
          ) : null}
        </div>

        <BookTocModal
          open={tocOpen}
          onClose={() => setTocOpen(false)}
          batches={resolvedBatches}
          activePageId={activePageId}
          returnQuerySuffix={returnQuerySuffix}
          routeBase={bookMeta.routeBase}
        />
        <StudentAdSlot variant="inline" theme="classic" />
      </main>
    </BookGradeThemeProvider>
  );
}
