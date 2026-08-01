import Layout from "../../../../../components/Layout";
import LearningBookShell from "../../../../../components/learning-book/LearningBookShell";
import LearningPageBody from "../../../../../components/learning-book/LearningPageBody";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import { createLearningBookNav } from "../../../../../lib/learning-book/learning-book-nav";
import {
  getGeometryG4PageNeighbors,
  isValidGeometryG4PageId,
  GEOMETRY_G4_BOOK_META,
} from "../../../../../lib/learning-book/geometry-g4-registry";
import { useMemo } from "react";
import { resolveBookRequestContentLocale } from "../../../../../lib/learning-book/resolve-book-request-content-locale";

const SUBJECT = "geometry";
const GRADE = "g4";

export default function GeometryG4BookPage({
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
        bookMeta={GEOMETRY_G4_BOOK_META}
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
  const { loadGeometryG4Page, loadGeometryG4TocEntries } = await import("../../../../../lib/learning-book/load-geometry-g4-pages");
  const pageId = params.pageId;
  if (!isValidGeometryG4PageId(pageId)) {
    return { notFound: true };
  }

  const page = loadGeometryG4Page(pageId, { contentLocale });
  if (!page) {
    return { notFound: true };
  }

  const batches = loadGeometryG4TocEntries({ contentLocale });
  const { prev, next } = getGeometryG4PageNeighbors(pageId);

  const prevPage = prev ? loadGeometryG4Page(prev, { contentLocale }) : null;
  const nextPage = next ? loadGeometryG4Page(next, { contentLocale }) : null;

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
