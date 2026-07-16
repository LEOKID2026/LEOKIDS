import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Layout from "../Layout";
import IosInstallHelpModal from "./IosInstallHelpModal.jsx";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import { getPwaInstallPageTheme } from "../../lib/pwa/pwa-install-page-theme.client.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Shared install-page shell — bright/classic via site theme picker.
 * @param {{
 *   portal: 'student' | 'parent' | 'teacher',
 *   badge: string,
 *   title: string,
 *   pageTitle: string,
 *   appleTitle?: string,
 *   appleTouchIcon?: string,
 *   launcher: import('react').ComponentType<{ isBright?: boolean }>,
 * }} props
 */
export default function PwaInstallPageShell({
  portal,
  badge,
  title,
  pageTitle,
  appleTitle,
  appleTouchIcon,
  launcher: Launcher,
}) {
  const t = useT();
  const { theme, isBright } = useStudentTheme();
  const T = getPwaInstallPageTheme(portal, isBright);
  const [iosHelpOpen, setIosHelpOpen] = useState(false);
  const portalHomeHref =
    portal === "parent"
      ? "/parent/dashboard"
      : portal === "teacher"
        ? "/teacher/dashboard"
        : "/student/home";

  return (
    <>
      <Head>
        {appleTitle ? <meta name="apple-mobile-web-app-title" content={appleTitle} /> : null}
        {appleTouchIcon ? <link rel="apple-touch-icon" href={appleTouchIcon} /> : null}
        <title>{pageTitle}</title>
      </Head>
      <Layout studentTheme={theme} studentShell="home">
        <div className={T.pageWrap} dir="ltr" lang="en">
          <p className={T.badge}>{badge}</p>
          <h1 className={T.heading}>{title}</h1>
          <p className={T.body}>{t("ui.pwa.installBody")}</p>
          <div className="flex w-full max-w-xs flex-col items-stretch gap-2">
            <Launcher isBright={isBright} />
            <button
              type="button"
              className={T.iosHelpTrigger}
              onClick={() => setIosHelpOpen(true)}
              data-testid="ios-install-help-trigger"
            >
              {t("ui.pwa.iosHelpTitle")}
            </button>
          </div>
          <IosInstallHelpModal
            open={iosHelpOpen}
            onClose={() => setIosHelpOpen(false)}
            isBright={isBright}
            doneBtnClass={T.iosHelpDoneBtn}
          />
          <Link href={portalHomeHref} className={T.backLink}>
            {t("ui.pwa.backHome")}
          </Link>
        </div>
      </Layout>
    </>
  );
}
