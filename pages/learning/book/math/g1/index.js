import Layout from "../../../../../components/Layout";
import MathG1BookShell from "../../../../../components/learning-book/MathG1BookShell";
import LearningBookIndexContent from "../../../../../components/learning-book/LearningBookIndexContent";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import { MATH_G1_BOOK_META } from "../../../../../lib/learning-book/math-g1-registry";
import { resolveBookRequestContentLocale } from "../../../../../lib/learning-book/resolve-book-request-content-locale";

export default function MathG1BookIndex({ batches }) {
  useIOSViewportFix();

  return (
    <Layout>
      <MathG1BookShell batches={batches}>
        <LearningBookIndexContent
          batches={batches}
          routeBase={MATH_G1_BOOK_META.routeBase}
        />
      </MathG1BookShell>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { params, req, resolvedUrl, query } = ctx;
  const contentLocale = resolveBookRequestContentLocale({ req, resolvedUrl, query });
  const { loadMathG1TocEntries } = await import("../../../../../lib/learning-book/load-math-g1-pages");
  const batches = loadMathG1TocEntries({ contentLocale });
  return { props: { batches } };
}
