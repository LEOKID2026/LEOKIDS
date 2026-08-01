import Layout from "../../../../../components/Layout";
import LearningBookShell from "../../../../../components/learning-book/LearningBookShell";
import LearningBookIndexContent from "../../../../../components/learning-book/LearningBookIndexContent";
import { useIOSViewportFix } from "../../../../../hooks/useIOSViewportFix";
import { createLearningBookNav } from "../../../../../lib/learning-book/learning-book-nav";
import { GEOMETRY_G2_BOOK_META } from "../../../../../lib/learning-book/geometry-g2-registry";
import { useMemo } from "react";
import { resolveBookRequestContentLocale } from "../../../../../lib/learning-book/resolve-book-request-content-locale";

const SUBJECT = "geometry";
const GRADE = "g2";

export default function GeometryG2BookIndex({ batches }) {
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
        bookMeta={GEOMETRY_G2_BOOK_META}
        nav={bookNav}
        batches={batches}
      >
        <LearningBookIndexContent
          batches={batches}
          routeBase={GEOMETRY_G2_BOOK_META.routeBase}
        />
      </LearningBookShell>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { params, req, resolvedUrl, query } = ctx;
  const contentLocale = resolveBookRequestContentLocale({ req, resolvedUrl, query });
  const { loadGeometryG2TocEntries } = await import("../../../../../lib/learning-book/load-geometry-g2-pages");
  const batches = loadGeometryG2TocEntries({ contentLocale });
  return { props: { batches } };
}
