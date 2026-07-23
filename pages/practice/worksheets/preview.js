import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import PageSeo from "../../../components/seo/PageSeo";
import WorksheetPreviewPage from "../../../components/worksheets/WorksheetPreviewPage.jsx";
import { useStudentTheme } from "../../../contexts/StudentThemeContext.jsx";
import {
  clearWorksheetPublicAnswerKeySession,
  loadWorksheetPublicPreviewSession,
  saveWorksheetPublicAnswerKeySession,
  saveWorksheetPublicPreviewSession,
} from "../../../lib/worksheets/worksheet-public-preview-session.client.js";
import { buildWorksheetSessionFingerprint } from "../../../lib/worksheets/worksheet-fingerprint.js";
import { useWorksheetShellAttrs, useWorksheetUi } from "../../../hooks/useWorksheetUi.js";

const BACK_HREF = "/practice/worksheets";

export default function PublicWorksheetPreviewRoute() {
  const router = useRouter();
  const { theme } = useStudentTheme();
  const layoutProps = { studentTheme: theme, studentShell: "home" };
  const ui = useWorksheetUi();
  const shell = useWorksheetShellAttrs();
  const previewSeo = {
    title: ui.seoPreviewTitle,
    description: ui.seoPreviewDescription,
    canonicalPath: "/practice/worksheets/preview",
  };

  const [previewData, setPreviewData] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [answerKeyLoading, setAnswerKeyLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const [answerKeyError, setAnswerKeyError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = loadWorksheetPublicPreviewSession();
    setPreviewData(stored);
    setSessionChecked(true);
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") window.print();
  }, []);

  const handleAnswerKey = useCallback(async () => {
    if (!previewData?.generation || !previewData.includeAnswers) return;
    setAnswerKeyError("");
    clearWorksheetPublicAnswerKeySession();
    setAnswerKeyLoading(true);
    try {
      const expectedWorksheetFingerprint = buildWorksheetSessionFingerprint(
        previewData.worksheetPayload,
        previewData.generation
      );

      /** @type {Record<string, unknown>} */
      const body = {
        includeAnswers: true,
        expectedWorksheetFingerprint,
      };

      if (previewData.source === "public-ready" && previewData.slug) {
        body.source = "public-ready";
        body.slug = previewData.slug;
      } else {
        Object.assign(body, previewData.generation);
      }

      const res = await fetch("/api/public/worksheets/answer-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setAnswerKeyError(data.message || ui.answerKeyStale);
        return;
      }
      saveWorksheetPublicAnswerKeySession(data.answerKeyPayload);
      router.push("/practice/worksheets/preview/answers");
    } catch {
      setAnswerKeyError(ui.errorGeneric);
    } finally {
      setAnswerKeyLoading(false);
    }
  }, [previewData, router, ui.answerKeyStale, ui.errorGeneric]);

  const handleRefresh = useCallback(async () => {
    if (previewData?.source !== "public-demo" || !previewData?.generation) return;
    setRefreshError("");
    setRefreshLoading(true);
    try {
      const gen = previewData.generation;
      const newSeed = Math.floor(Math.random() * 1_000_000);
      const res = await fetch("/api/public/worksheets/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: gen.subjectId,
          gradeKey: gen.gradeKey,
          topicKey: gen.topicKey,
          levelKey: gen.levelKey,
          seed: newSeed,
          inkSave: gen.inkSave === true,
          mathPracticeFormat:
            typeof gen.mathPracticeFormat === "string" ? gen.mathPracticeFormat : undefined,
          ...(typeof gen.preferMcq === "boolean" ? { preferMcq: gen.preferMcq } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setRefreshError(data.message || ui.refreshQuestionsError);
        return;
      }

      clearWorksheetPublicAnswerKeySession();
      const next = {
        worksheetPayload: data.worksheetPayload,
        generation: data.generation,
        includeAnswers: previewData.includeAnswers === true,
        source: "public-demo",
      };
      saveWorksheetPublicPreviewSession(next);
      setPreviewData(next);
    } catch {
      setRefreshError(ui.refreshQuestionsError);
    } finally {
      setRefreshLoading(false);
    }
  }, [previewData, ui.refreshQuestionsError]);

  let body;

  if (!sessionChecked) {
    body = (
      <Layout {...layoutProps}>
        <div {...shell} className="p-4 text-center text-slate-500">
          {ui.loading}
        </div>
      </Layout>
    );
  } else if (!previewData) {
    body = (
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
    );
  } else {
    const backHref =
      typeof previewData.returnPath === "string" && previewData.returnPath.startsWith("/")
        ? previewData.returnPath
        : BACK_HREF;
    const showRefresh = previewData.source === "public-demo";

    body = (
      <Layout {...layoutProps}>
        <div className="worksheet-preview-container px-4 py-4 md:px-6 md:py-6">
          {refreshError ? (
            <p {...shell} className="mb-3 text-center text-sm text-red-600">
              {refreshError}
            </p>
          ) : null}
          {answerKeyError ? (
            <p {...shell} className="mb-3 text-center text-sm text-red-600">
              {answerKeyError}
            </p>
          ) : null}
          <WorksheetPreviewPage
            worksheetPayload={previewData.worksheetPayload}
            includeAnswers={previewData.includeAnswers === true}
            onPrint={handlePrint}
            onAnswerKey={previewData.includeAnswers ? handleAnswerKey : undefined}
            answerKeyLoading={answerKeyLoading}
            onRefresh={showRefresh ? handleRefresh : undefined}
            refreshLoading={refreshLoading}
            backHref={backHref}
          />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <PageSeo {...previewSeo} noindex />
      {body}
    </>
  );
}
