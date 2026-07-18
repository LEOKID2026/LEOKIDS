import Link from "next/link";
import Layout from "../Layout";
import { demoPackCopyForLocale } from "../../lib/demo/demo-pack-copy.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";

export default function DemoOnlineGameUnavailable() {
  const { theme } = useStudentTheme();
  const { locale, direction } = useI18n();
  const copy = (group, key) => demoPackCopyForLocale(locale, group, key);

  return (
    <Layout studentTheme={theme} studentShell="home">
      <div
        className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-12 text-center"
        dir={direction}
        lang={locale}
        data-testid="demo-online-game-unavailable"
      >
        <p className="text-4xl" aria-hidden="true">
          🎮
        </p>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {copy("onlineGameUnavailable", "title")}
        </h1>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {copy("onlineGameUnavailable", "body")}
        </p>
        <Link
          href="/student/arcade"
          className="mt-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          {copy("onlineGameUnavailable", "backToArcade")}
        </Link>
      </div>
    </Layout>
  );
}
