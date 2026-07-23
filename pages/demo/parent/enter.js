import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageSeo from "../../../components/seo/PageSeo";
import {
  createParentDemoSession,
  hasParentDemoSession,
} from "../../../lib/demo/parent-demo-mode.client.js";
import { clearDemoSession } from "../../../lib/demo/demo-mode.client.js";
import { demoPackCopyForLocale } from "../../../lib/demo/demo-pack-copy.js";
import { useStudentTheme } from "../../../contexts/StudentThemeContext.jsx";
import { useI18n } from "../../../lib/i18n/I18nProvider.jsx";
import { getParentPortalTheme } from "../../../lib/parent-ui/parent-portal-theme.client.js";

export default function ParentDemoEnterPage() {
  const router = useRouter();
  const { theme, isBright } = useStudentTheme();
  const { locale, direction } = useI18n();
  const T = getParentPortalTheme(isBright);
  const copy = (key, vars) => demoPackCopyForLocale(locale, "parentPortal", key, vars);
  const [busy, setBusy] = useState(false);
  const [hasActiveDemo, setHasActiveDemo] = useState(false);

  useEffect(() => {
    setHasActiveDemo(hasParentDemoSession());
  }, []);

  const enterDemo = useCallback(async () => {
    setBusy(true);
    try {
      clearDemoSession();
      createParentDemoSession();
      await router.replace("/parent/dashboard");
    } finally {
      setBusy(false);
    }
  }, [router]);

  return (
    <Layout homepage studentTheme={theme} studentShell="home">
      <PageSeo
        title={copy("enterPageTitle")}
        description={copy("enterPageDescription")}
        canonicalPath="/demo/parent/enter"
        noindex
      />
      <div
        className="mx-auto max-w-md px-4 py-3 md:py-10"
        dir={direction}
        lang={locale}
        data-testid="parent-demo-enter-page"
      >
        <div className="mb-3 flex min-w-0 items-center justify-between gap-2 md:mb-6">
          <h1 className={`min-w-0 text-xl font-bold leading-tight md:text-2xl ${T.heading}`}>
            {copy("enterHeading")}
          </h1>
          <Link href="/" className={`${T.secondaryBtn} inline-flex shrink-0`} data-testid="parent-demo-enter-back">
            {copy("enterBack")}
          </Link>
        </div>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 py-6">
          <p className="text-center text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {copy("enterIntro")}
          </p>
          {hasActiveDemo ? (
            <p className="text-xs text-teal-700 dark:text-teal-300">{copy("enterActiveSessionNote")}</p>
          ) : null}
          <p className="text-xs text-slate-500 dark:text-slate-400">{copy("enterReadOnlyNote")}</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void enterDemo()}
            className="w-full rounded-xl bg-teal-600 px-6 py-3 text-base font-bold text-white shadow hover:bg-teal-700 disabled:opacity-60"
            data-testid="parent-demo-enter-button"
          >
            {busy ? copy("enteringButton") : copy("enterButton")}
          </button>
          <Link
            href="/"
            className="text-sm font-semibold text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
            data-testid="parent-demo-enter-back-home"
          >
            {copy("enterBackHome")}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
