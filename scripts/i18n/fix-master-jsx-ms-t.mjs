#!/usr/bin/env node
import fs from "node:fs";

const files = [
  "pages/learning/math-master.js",
  "pages/learning/geometry-master.js",
  "pages/learning/english-master.js",
  "pages/learning/science-master.js",
];

for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  let n = 0;
  // `{ms.t("key")` or `{ms.t("key", {...})` missing final `}` before `</`
  s = s.replace(/(\{ms\.t\([^\n]*\))\s*\n(\s*)<\//g, (_m, expr, indent) => {
    n += 1;
    return `${expr}}\n${indent}</`;
  });
  s = s.replace(/(\{ms\.t\([^\n]*\))\s*<\//g, (_m, expr) => {
    n += 1;
    return `${expr}}</`;
  });
  fs.writeFileSync(f, s);
  console.log(f, "fixes", n);
}

// Rewrite curriculum.js as pure ASCII UTF-8
const curriculum = `import Layout from "../../components/Layout";
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
`;
fs.writeFileSync("pages/learning/curriculum.js", curriculum, "utf8");
fs.writeFileSync(
  "pages/learning/geometry-curriculum.js",
  'import CurriculumPage from "./curriculum.js";\nexport default CurriculumPage;\n',
  "utf8"
);
console.log("curriculum rewritten");
