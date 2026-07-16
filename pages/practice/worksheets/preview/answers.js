import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import PageSeo from "../../../../components/seo/PageSeo";
import WorksheetAnswerKeyPage from "../../../../components/worksheets/WorksheetAnswerKeyPage.jsx";
import { useStudentTheme } from "../../../../contexts/StudentThemeContext.jsx";
import {
  clearWorksheetPublicAnswerKeySession,
  loadWorksheetPublicAnswerKeySession,
  loadWorksheetPublicPreviewSession,
} from "../../../../lib/worksheets/worksheet-public-preview-session.client.js";
import { validateStoredAnswerKeyForWorksheet } from "../../../../lib/worksheets/worksheet-fingerprint.js";
import { useWorksheetShellAttrs, useWorksheetUi } from "../../../../hooks/useWorksheetUi.js";

const PREVIEW_HREF = "/practice/worksheets/preview";
const BACK_HREF = "/practice/worksheets";

export default function PublicWorksheetAnswerKeyRoute() {
  const router = useRouter();
  const { theme } = useStudentTheme();
  const layoutProps = { studentTheme: theme, studentShell: "home" };
  const ui = useWorksheetUi();
  const shell = useWorksheetShellAttrs();

  const [answerKeyPayload, setAnswerKeyPayload] = useState(null);
  const [staleMessage, setStaleMessage] = useState("");
  const [lostSession, setLostSession] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const previewSession = loadWorksheetPublicPreviewSession();
    if (!previewSession) {
      setLostSession(true);
      setSessionChecked(true);
      return;
    }

    if (!previewSession.includeAnswers) {
      router.replace(PREVIEW_HREF);
      return;
    }

    const stored = loadWorksheetPublicAnswerKeySession();
    const validation = validateStoredAnswerKeyForWorksheet(
      previewSession.worksheetPayload,
      previewSession.generation,
      stored
    );
    if (!validation.ok) {
      clearWorksheetPublicAnswerKeySession();
      setStaleMessage(ui.answerKeyStale);
      setSessionChecked(true);
      return;
    }
    setAnswerKeyPayload(stored);
    setSessionChecked(true);
  }, [router, ui.answerKeyStale]);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") window.print();
  }, []);

  if (!sessionChecked) {
    return (
      <Layout {...layoutProps}>
        <div {...shell} className="p-4 text-center text-slate-500">
          {ui.loading}
        </div>
      </Layout>
    );
  }

  if (lostSession) {
    return (
      <>
        <PageSeo
          title={ui.seoAnswerKeyTitle}
          description={ui.seoAnswerKeyDescription}
          canonicalPath="/practice/worksheets/preview/answers"
          noindex
        />
        <Layout {...layoutProps}>
          <div {...shell} className="mx-auto max-w-lg px-4 py-10 text-center">
            <p className="mb-6 text-base text-slate-700">{ui.publicPreviewLost}</p>
            <Link
              href={BACK_HREF}
              className="inline-flex rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {ui.publicPreviewLostCta}
            </Link>
          </div>
        </Layout>
      </>
    );
  }

  if (staleMessage) {
    return (
      <>
        <PageSeo
          title={ui.seoAnswerKeyTitle}
          description={ui.seoAnswerKeyDescription}
          canonicalPath="/practice/worksheets/preview/answers"
          noindex
        />
        <Layout {...layoutProps}>
          <div {...shell} className="mx-auto max-w-lg px-4 py-10 text-center">
            <p className="mb-6 text-base text-slate-700">{staleMessage}</p>
            <button
              type="button"
              className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white"
              onClick={() => router.push(PREVIEW_HREF)}
            >
              {ui.back}
            </button>
          </div>
        </Layout>
      </>
    );
  }

  if (!answerKeyPayload) {
    return (
      <Layout {...layoutProps}>
        <div {...shell} className="p-4 text-center text-slate-500">
          {ui.loading}
        </div>
      </Layout>
    );
  }

  return (
    <>
      <PageSeo
        title={ui.seoAnswerKeyTitle}
        description={ui.seoAnswerKeyDescription}
        canonicalPath="/practice/worksheets/preview/answers"
        noindex
      />
      <Layout {...layoutProps}>
        <div className="worksheet-preview-container px-4 py-4 md:px-6 md:py-6">
          <WorksheetAnswerKeyPage
            answerKeyPayload={answerKeyPayload}
            onPrint={handlePrint}
            backHref={PREVIEW_HREF}
          />
        </div>
      </Layout>
    </>
  );
}
