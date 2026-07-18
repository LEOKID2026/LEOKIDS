import Layout from "../../../../../components/Layout";
import MathG1BookShell from "../../../../../components/learning-book/MathG1BookShell";
import LearningPageBody from "../../../../../components/learning-book/LearningPageBody";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import {
  getMathG1PageNeighbors,
  isValidMathG1PageId,
} from "../../../../../lib/learning-book/math-g1-registry";

export default function MathG1BookPage({
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
      <MathG1BookShell
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
        />
      </MathG1BookShell>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { loadMathG1Page, loadMathG1TocEntries } = await import("../../../../../lib/learning-book/load-math-g1-pages");
  const pageId = params.pageId;
  if (!isValidMathG1PageId(pageId)) {
    return { notFound: true };
  }

  const page = loadMathG1Page(pageId);
  if (!page) {
    return { notFound: true };
  }

  const batches = loadMathG1TocEntries();
  const { prev, next } = getMathG1PageNeighbors(pageId);

  const prevPage = prev ? loadMathG1Page(prev) : null;
  const nextPage = next ? loadMathG1Page(next) : null;

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
