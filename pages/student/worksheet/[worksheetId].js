import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import StudentAnswerSheet from "../../../components/worksheet-activities/StudentAnswerSheet";
import { worksheetGradingStatusLabelHe } from "../../../lib/worksheet-activities/worksheet-labels.client.js";

export async function getServerSideProps(context) {
  return { props: { worksheetId: String(context.params?.worksheetId || "").trim() } };
}

export default function StudentWorksheetPage({ worksheetId }) {
  const [worksheet, setWorksheet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [studentStatus, setStudentStatus] = useState(null);
  const [answers, setAnswers] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch(`/api/student/worksheet-activities/${encodeURIComponent(worksheetId)}`, {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Error");
        return;
      }
      setWorksheet(json.worksheet);
      setQuestions(json.questions || []);
      setStudentStatus(json.studentStatus);
    } catch {
      setError("Network error");
    }
  }, [worksheetId]);

  useEffect(() => {
    void load();
  }, [load]);

  const openPdf = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/student/worksheet-activities/${encodeURIComponent(worksheetId)}/pdf-url`,
        { credentials: "include" }
      );
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.signedUrl) {
        window.open(json.signedUrl, "_blank", "noopener");
        await load();
      } else {
        setError(json?.error || "Unable to open");
      }
    } finally {
      setBusy(false);
    }
  }, [worksheetId, load]);

  const markComplete = useCallback(async () => {
    if (!window.confirm("Mark this worksheet as finished?")) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(
        `/api/student/worksheet-activities/${encodeURIComponent(worksheetId)}/mark-complete`,
        { method: "POST", credentials: "include" }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Error");
        return;
      }
      setMsg("Submission received. Please turn in the physical worksheet to your teacher by the due date.");
      await load();
    } finally {
      setBusy(false);
    }
  }, [worksheetId, load]);

  const submitAnswers = useCallback(async () => {
    if (!window.confirm("Submit your answers?")) return;
    setBusy(true);
    setMsg("");
    setError("");
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionIndex: q.questionIndex,
          answerValue: answers[q.questionIndex] ?? "",
        })),
      };
      const res = await fetch(
        `/api/student/worksheet-activities/${encodeURIComponent(worksheetId)}/submit`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Error");
        return;
      }
      setMsg(
        json.hasManualQuestions
          ? "Great job — your submission was received and will be reviewed by your teacher."
          : "Submission received and waiting for teacher approval."
      );
      await load();
    } finally {
      setBusy(false);
    }
  }, [worksheetId, questions, answers, load]);

  if (!worksheet) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center text-white/70">
          {error || "Loading…"}
        </div>
      </Layout>
    );
  }

  const submitted = Boolean(studentStatus?.digitalSubmittedAt || studentStatus?.markedCompletedAt);
  const published = studentStatus?.gradingStatus === "published";
  const waiting = studentStatus?.gradingStatus && !published && submitted;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8 text-right">
        <Link href="/student/home" className="text-sm text-cyan-300 hover:underline">
          ← Back to home
        </Link>

        <h1 className="text-2xl font-bold text-white mt-4">Worksheet: {worksheet.title}</h1>
        <p className="text-white/65 text-sm mt-1">
          {worksheetGradingStatusLabelHe(studentStatus?.gradingStatus || "not_submitted")}
          {worksheet.physicalDueAt
            ? ` · Physical due date: ${new Date(worksheet.physicalDueAt).toLocaleString("en-US")}`
            : ""}
        </p>

        {worksheet.instructions ? (
          <p className="mt-4 text-white/85 whitespace-pre-wrap">{worksheet.instructions}</p>
        ) : null}

        {error ? <p className="text-red-300 text-sm mt-4">{error}</p> : null}
        {msg ? <p className="text-emerald-300 text-sm mt-4">{msg}</p> : null}

        <button
          type="button"
          disabled={busy}
          onClick={() => void openPdf()}
          className="mt-6 w-full py-3 rounded-xl bg-violet-500/90 text-black font-bold hover:bg-violet-400"
        >
          Open / download worksheet
        </button>

        {published && studentStatus?.finalScorePct != null ? (
          <p className="mt-6 text-xl font-bold text-amber-200">Score: {studentStatus.finalScorePct}%</p>
        ) : null}

        {waiting ? (
          <p className="mt-6 text-white/80">Waiting for teacher review</p>
        ) : null}

        {worksheet.worksheetMode === "pdf_only" && !studentStatus?.markedCompletedAt ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void markComplete()}
            className="mt-4 w-full py-3 rounded-xl border border-white/25 text-white font-semibold hover:bg-white/10"
          >
            I finished this worksheet
          </button>
        ) : null}

        {worksheet.worksheetMode !== "pdf_only" && questions.length > 0 && !studentStatus?.digitalSubmittedAt ? (
          <>
            <div className="mt-8">
              <StudentAnswerSheet
                questions={questions}
                answers={answers}
                onChange={(idx, val) => setAnswers((prev) => ({ ...prev, [idx]: val }))}
                disabled={busy}
              />
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void submitAnswers()}
              className="mt-4 w-full py-3 rounded-xl bg-cyan-500/90 text-black font-bold hover:bg-cyan-400"
            >
              Submit answers
            </button>
          </>
        ) : null}
      </div>
    </Layout>
  );
}
