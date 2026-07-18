import Layout from "../../../../../components/Layout";
import MathG5BookShell from "../../../../../components/learning-book/MathG5BookShell";
import LearningPageBody from "../../../../../components/learning-book/LearningPageBody";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import {
  getMathG5PageNeighbors,
  isValidMathG5PageId,
} from "../../../../../lib/learning-book/math-g5-registry";

export default function MathG5BookPage({
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
      <MathG5BookShell
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
          bookGrade="g5"
        />
      </MathG5BookShell>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { loadMathG5Page, loadMathG5TocEntries } = await import("../../../../../lib/learning-book/load-math-g5-pages");
  const pageId = params.pageId;
  if (!isValidMathG5PageId(pageId)) {
    return { notFound: true };
  }

  const page = loadMathG5Page(pageId);
  if (!page) {
    return { notFound: true };
  }

  const batches = loadMathG5TocEntries();
  const { prev, next } = getMathG5PageNeighbors(pageId);

  const prevPage = prev ? loadMathG5Page(prev) : null;
  const nextPage = next ? loadMathG5Page(next) : null;

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
