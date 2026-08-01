import Layout from "../../../../../components/Layout";
import LearningBookShell from "../../../../../components/learning-book/LearningBookShell";
import LearningPageBody from "../../../../../components/learning-book/LearningPageBody";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import { createLearningBookNav } from "../../../../../lib/learning-book/learning-book-nav";
import {
  getGeometryG5PageNeighbors,
  isValidGeometryG5PageId,
  GEOMETRY_G5_BOOK_META,
} from "../../../../../lib/learning-book/geometry-g5-registry";
import { useMemo } from "react";
import { resolveBookRequestContentLocale } from "../../../../../lib/learning-book/resolve-book-request-content-locale";

const SUBJECT = "geometry";
const GRADE = "g5";

export default function GeometryG5BookPage({
  page,
  batches,
  prevPageId,
  nextPageId,
  prevTitle,
  nextTitle,
}) {
  useIOSViewportFix();
  const bookNav = useMemo(
    () => createLearningBookNav(SUBJECT, GRADE, "/learning/geometry-master"),
    []
  );

  return (
    <Layout>
      <LearningBookShell
        subject={SUBJECT}
        grade={GRADE}
        bookMeta={GEOMETRY_G5_BOOK_META}
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
          bookSubject={SUBJECT}
          bookGrade={GRADE}
        />
      </LearningBookShell>
    </Layout>
  );
}

export async function getServerSideProps({ params, req, resolvedUrl, query }) {
  const contentLocale = resolveBookRequestContentLocale({ req, resolvedUrl, query });
  const { loadGeometryG5Page, loadGeometryG5TocEntries } = await import("../../../../../lib/learning-book/load-geometry-g5-pages");
  const pageId = params.pageId;
  if (!isValidGeometryG5PageId(pageId)) {
    return { notFound: true };
  }

  const page = loadGeometryG5Page(pageId, { contentLocale });
  if (!page) {
    return { notFound: true };
  }

  const batches = loadGeometryG5TocEntries({ contentLocale });
  const { prev, next } = getGeometryG5PageNeighbors(pageId);

  const prevPage = prev ? loadGeometryG5Page(prev, { contentLocale }) : null;
  const nextPage = next ? loadGeometryG5Page(next, { contentLocale }) : null;

  return {
    props: {
      page,
      batches,
      prevPageId: prev,
      nextPageId: next,
      prevTitle: prevPage?.displayTitle || null,
      nextTitle: nextPage?.displayTitle || null,
    },
  };
}
