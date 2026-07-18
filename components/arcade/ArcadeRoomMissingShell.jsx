"use client";

import Head from "next/head";
import Link from "next/link";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";
import { withLocalePath } from "../../lib/i18n/locale-path.js";

/**
 * Student arcade route shell when `roomId` is missing from the URL.
 *
 * @param {{ gameTitleKey: string }} props
 */
export default function ArcadeRoomMissingShell({ gameTitleKey }) {
  const t = useT();
  const { locale } = useI18n();
  const gameName = t(gameTitleKey);
  const pageTitle = t("ui.student.arcadePageTitle", { game: gameName });

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-300 space-y-3">
        <p>{t("ui.student.arcadeMissingRoom")}</p>
        <Link href={withLocalePath(locale, "/student/arcade")} className="text-sky-400 underline">
          {t("ui.student.arcadeBackToArcade")}
        </Link>
      </div>
    </>
  );
}
