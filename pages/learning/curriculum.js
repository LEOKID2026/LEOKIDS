import Layout from "../../components/Layout";
import Link from "next/link";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";

export default function CurriculumPage() {
  const { direction, locale } = useI18n();
  const t = useT();
  return (
    <Layout>
      <main className="mx-auto max-w-3xl px-4 py-10" dir={direction} lang={locale}>
        <h1 className="text-3xl font-bold mb-3">{t("learning.hubTitle")}</h1>
        <p className="text-slate-600 mb-6">
          International curriculum packs cover math, geometry, English, and science for grades 1-6.
        </p>
        <ul className="list-disc ps-5 space-y-2 text-slate-800">
          <li>
            <Link href="/learning/math-master" className="underline">
              {t("learning.subjects.math")}
            </Link>
          </li>
          <li>
            <Link href="/learning/geometry-master" className="underline">
              {t("learning.subjects.geometry")}
            </Link>
          </li>
          <li>
            <Link href="/learning/english-master" className="underline">
              {t("learning.subjects.english")}
            </Link>
          </li>
          <li>
            <Link href="/learning/science-master" className="underline">
              {t("learning.subjects.science")}
            </Link>
          </li>
        </ul>
      </main>
    </Layout>
  );
}
