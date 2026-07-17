import { useRouter } from "next/router";
import { useState } from "react";
import { getBookGradeTheme } from "../../lib/learning-book/book-grade-themes";
import { formatBookShellTitle } from "../../lib/learning-book/format-book-shell-title";
import { BookGradeThemeProvider } from "./BookGradeThemeContext";
import BookShellHeader from "./BookShellHeader";
import BookTocModal from "./BookTocModal";
import StudentAdSlot from "../student/StudentAdSlot.jsx";

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

  const fromLearning = nav.isLearningReturn(router.query);
  const returnQuerySuffix = nav.getReturnQuerySuffix(router.query);
  const theme = getBookGradeTheme(grade);

  const returnLabel = fromLearning
    ? "Close"
    : subject === "geometry"
      ? "Back to Geometry"
      : subject === "science"
        ? "Back to Science"
        : subject === "hebrew"
          ? "Back to Hebrew"
          : subject === "english"
            ? "Back to English"
            : subject === "moledet"
              ? "Back to Homeland"
              : subject === "geography"
                ? "Back to Geography"
                : subject === "history"
                  ? "Back to History"
                  : "Back to Math";

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
            title={formatBookShellTitle(bookMeta.bookTitle || bookMeta.bookTitleHe)}
            isIndex={isIndex}
            pageMeta={pageMeta}
            indexSubtitle={`${bookMeta.gradeShortLabel} · Pick a topic and read page by page`}
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
          batches={batches}
          activePageId={activePageId}
          returnQuerySuffix={returnQuerySuffix}
          routeBase={bookMeta.routeBase}
        />
        <StudentAdSlot variant="inline" theme="classic" />
      </main>
    </BookGradeThemeProvider>
  );
}
