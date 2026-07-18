"use client";

import Head from "next/head";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/**
 * @param {{ gameTitleKey: string }} props
 */
export default function ArcadeStudentGamePageHead({ gameTitleKey }) {
  const t = useT();
  const gameName = t(gameTitleKey);
  const pageTitle = t("ui.student.arcadePageTitle", { game: gameName });

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  );
}
