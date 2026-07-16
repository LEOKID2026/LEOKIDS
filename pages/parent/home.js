import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import PortalLoadingPanel from "../../components/ui/PortalLoadingPanel.jsx";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";

/** Parent home alias — keep a continuous non-black loading screen while routing to dashboard. */
export default function ParentHomePage() {
  const router = useRouter();
  const { theme } = useStudentTheme();
  const { direction, locale } = useI18n();
  const t = useT();
  const isBright = theme !== "classic";
  const layoutProps = { studentTheme: theme, studentShell: "home" };

  useEffect(() => {
    if (!router.isReady) return;
    router.replace("/parent/dashboard");
  }, [router]);

  return (
    <Layout {...layoutProps}>
      <div className="max-w-md mx-auto px-4 py-8" dir={direction} lang={locale}>
        <PortalLoadingPanel
          isBright={isBright}
          message={t("parent.checkingSession")}
          dir={direction}
          lang={locale}
        />
      </div>
    </Layout>
  );
}
