import Layout from "../../../../../components/Layout";
import MathG3BookShell from "../../../../../components/learning-book/MathG3BookShell";
import LearningPageBody from "../../../../../components/learning-book/LearningPageBody";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import { resolveBookRequestContentLocale } from "../../../../../lib/learning-book/resolve-book-request-content-locale";
import {
  getMathG3PageNeighbors,
  isValidMathG3PageId,
} from "../../../../../lib/learning-book/math-g3-registry";

export default function MathG3BookPage({
  page,
  batches,
  prevPageId,
  nextPageId,
  prevTitle,
  nextTitle,
}) {
  useIOSViewportFix();

  return (
    <Layout>
      <MathG3BookShell
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
          bookGrade="g3"
        />
      </MathG3BookShell>
    </Layout>
  );
}

export async function getServerSideProps({ params, req, resolvedUrl, query }) {
  const contentLocale = resolveBookRequestContentLocale({ req, resolvedUrl, query });
  const { loadMathG3Page, loadMathG3TocEntries } = await import("../../../../../lib/learning-book/load-math-g3-pages");
  const pageId = params.pageId;
  if (!isValidMathG3PageId(pageId)) {
    return { notFound: true };
  }

  const page = loadMathG3Page(pageId, { contentLocale });
  if (!page) {
    return { notFound: true };
  }

  const batches = loadMathG3TocEntries({ contentLocale });
  const { prev, next } = getMathG3PageNeighbors(pageId);

  const prevPage = prev ? loadMathG3Page(prev, { contentLocale }) : null;
  const nextPage = next ? loadMathG3Page(next, { contentLocale }) : null;

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
