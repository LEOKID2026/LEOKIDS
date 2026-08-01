import Layout from "../../../../../components/Layout";
import MathG4BookShell from "../../../../../components/learning-book/MathG4BookShell";
import LearningBookIndexContent from "../../../../../components/learning-book/LearningBookIndexContent";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import { MATH_G4_BOOK_META } from "../../../../../lib/learning-book/math-g4-registry";
import { resolveBookRequestContentLocale } from "../../../../../lib/learning-book/resolve-book-request-content-locale";

export default function MathG4BookIndex({ batches }) {
  useIOSViewportFix();

  return (
    <Layout>
      <MathG4BookShell batches={batches}>
        <LearningBookIndexContent
          batches={batches}
          routeBase={MATH_G4_BOOK_META.routeBase}
        />
      </MathG4BookShell>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { params, req, resolvedUrl, query } = ctx;
  const contentLocale = resolveBookRequestContentLocale({ req, resolvedUrl, query });
  const { loadMathG4TocEntries } = await import("../../../../../lib/learning-book/load-math-g4-pages");
  const batches = loadMathG4TocEntries({ contentLocale });
  return { props: { batches } };
}
