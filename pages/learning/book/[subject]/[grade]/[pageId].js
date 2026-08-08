import Layout from "../../../../../components/Layout";
import LearningBookShell from "../../../../../components/learning-book/LearningBookShell";
import LearningPageBody from "../../../../../components/learning-book/LearningPageBody";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import { createLearningBookNav } from "../../../../../lib/learning-book/learning-book-nav";
import { getLearningBookMasterPath } from "../../../../../lib/learning-book/learning-book-catalog-meta";
import { useMemo } from "react";
import { resolveBookRequestContentLocale } from "../../../../../lib/learning-book/resolve-book-request-content-locale";

export default function DynamicLearningBookPage({
  page,
  batches,
  prevPageId,
  nextPageId,
  prevTitle,
  nextTitle,
  subject,
  grade,
  bookMeta,
}) {
  useIOSViewportFix();
  const bookNav = useMemo(
    () =>
      createLearningBookNav(
        subject,
        grade,
        getLearningBookMasterPath(subject)
      ),
    [subject, grade]
  );

  return (
    <Layout>
      <LearningBookShell
        subject={subject}
        grade={grade}
        bookMeta={bookMeta}
        nav={bookNav}
        batches={batches}
        activePageId={page.pageId}
        pageMeta={page}
      >
        <LearningPageBody
          page={page}
          prevPageId={prevPageId}
          nextPageId={nextPageId}
          prevTitle={prevTitle}
          nextTitle={nextTitle}
          bookSubject={subject}
          bookGrade={grade}
        />
      </LearningBookShell>
    </Layout>
  );
}

export async function getServerSideProps({ params, req, resolvedUrl, query }) {
  const contentLocale = resolveBookRequestContentLocale({ req, resolvedUrl, query });
  const subject = params.subject;
  const grade = params.grade;
  const pageId = params.pageId;
  const { getLearningBookEntry } = await import(
    "../../../../../lib/learning-book/learning-book-catalog.js"
  );
  const { getLearningBookClientMeta } = await import(
    "../../../../../lib/learning-book/learning-book-catalog-meta.js"
  );
  const entry = getLearningBookEntry(subject, grade);
  const clientMeta = getLearningBookClientMeta(subject, grade);
  if (!entry || !clientMeta || !entry.registry.isValidPageId(pageId)) {
    return { notFound: true };
  }

  let page;
  let batches;
  let prevPage = null;
  let nextPage = null;
  let prev = null;
  let next = null;
  try {
    page = entry.loader.loadPage(pageId, { contentLocale });
    if (!page) {
      return { notFound: true };
    }
    batches = entry.loader.loadTocEntries({ contentLocale });
    ({ prev, next } = entry.registry.getPageNeighbors(pageId));
    prevPage = prev ? entry.loader.loadPage(prev, { contentLocale }) : null;
    nextPage = next ? entry.loader.loadPage(next, { contentLocale }) : null;
  } catch {
    return { notFound: true };
  }

  return {
    props: {
      page,
      batches,
      prevPageId: prev,
      nextPageId: next,
      prevTitle: prevPage?.displayTitle || null,
      nextTitle: nextPage?.displayTitle || null,
      subject,
      grade,
      bookMeta: clientMeta.meta,
    },
  };
}
