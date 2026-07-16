import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../components/Layout";
import TeacherPortalShell from "../../../../../components/teacher-portal/TeacherPortalShell";
import TeacherClassActivitiesNav from "../../../../../components/teacher-portal/TeacherClassActivitiesNav";
import PdfUploader from "../../../../../components/worksheet-activities/PdfUploader";
import TeacherQuestionBuilder from "../../../../../components/worksheet-activities/TeacherQuestionBuilder";
import { getLearningSupabaseBrowserClient } from "../../../../../lib/learning-supabase/client";
import { resolveTeacherAccessToken } from "../../../../../lib/teacher-portal/use-teacher-portal-session";
import { teacherAuthFetch } from "../../../../../lib/teacher-portal/teacher-ui.js";
import { REPORT_SUBJECTS, subjectLabelHe } from "../../../../../lib/teacher-portal/teacher-ui.js";
import { worksheetModeLabelHe } from "../../../../../lib/worksheet-activities/worksheet-labels.client.js";

export async function getServerSideProps(context) {
  const classId = String(context.params?.classId || "").trim();
  return { props: { classId } };
}

const MODES = ["pdf_only", "digital_answers", "manual_grading"];

export default function TeacherNewWorksheetPage({ classId }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("math");
  const [instructions, setInstructions] = useState("");
  const [worksheetMode, setWorksheetMode] = useState("pdf_only");
  const [physicalDueAt, setPhysicalDueAt] = useState("");
  const [questions, setQuestions] = useState([]);
  const [worksheetId, setWorksheetId] = useState("");
  const [hasPdf, setHasPdf] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const uploadPdf = useCallback(
    async (file) => {
      if (!worksheetId) return { ok: false, error: "Save a draft first" };
      const supabase = getLearningSupabaseBrowserClient();
      const session = await resolveTeacherAccessToken(supabase);
      if (!session.ok) return { ok: false, error: "Not signed in" };

      const pdfBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || "");
          resolve(result.includes(",") ? result.split(",").pop() : result);
        };
        reader.onerror = () => reject(new Error("read failed"));
        reader.readAsDataURL(file);
      });
      const res = await teacherAuthFetch(
        session.token,
        `/api/teacher/worksheet-activities/${encodeURIComponent(worksheetId)}/upload-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdfBase64,
            originalFilename: file.name,
            fileRole: "worksheet",
          }),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false, error: body?.error?.message || body?.error?.code || "Upload failed" };
      }
      setHasPdf(true);
      return {
        ok: true,
        fileId: body?.data?.fileId,
        originalFilename: body?.data?.originalFilename,
      };
    },
    [worksheetId]
  );

  const saveDraft = useCallback(async () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return null;
    }
    setBusy(true);
    setError("");
    try {
      const supabase = getLearningSupabaseBrowserClient();
      const session = await resolveTeacherAccessToken(supabase);
      if (!session.ok) {
        router.replace("/teacher/login");
        return null;
      }

      const payload = {
        classId,
        title: title.trim(),
        subject,
        instructions: instructions.trim() || null,
        worksheetMode,
        physicalDueAt: physicalDueAt || null,
        questionCount: worksheetMode !== "pdf_only" ? questions.length || 1 : null,
      };

      let id = worksheetId;
      if (!id) {
        const res = await teacherAuthFetch(session.token, "/api/teacher/worksheet-activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(body?.error?.message || body?.error?.code || "Error saving");
          return null;
        }
        id = body?.data?.worksheetId;
        setWorksheetId(id);
      } else {
        await teacherAuthFetch(
          session.token,
          `/api/teacher/worksheet-activities/${encodeURIComponent(id)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      if (worksheetMode !== "pdf_only" && questions.length) {
        await teacherAuthFetch(
          session.token,
          `/api/teacher/worksheet-activities/${encodeURIComponent(id)}/questions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions }),
          }
        );
      }

      return id;
    } catch {
      setError("Network error");
      return null;
    } finally {
      setBusy(false);
    }
  }, [
    classId,
    title,
    subject,
    instructions,
    worksheetMode,
    physicalDueAt,
    questions,
    worksheetId,
    router,
  ]);

  const activate = useCallback(async () => {
    const id = worksheetId || (await saveDraft());
    if (!id) return;
    if (!hasPdf) {
      setError("Upload a PDF before launching");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const supabase = getLearningSupabaseBrowserClient();
      const session = await resolveTeacherAccessToken(supabase);
      if (!session.ok) {
        router.replace("/teacher/login");
        return;
      }
      const res = await teacherAuthFetch(
        session.token,
        `/api/teacher/worksheet-activities/${encodeURIComponent(id)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "activate" }),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error?.message || body?.error?.code || "Launch failed");
        return;
      }
      router.push(`/teacher/class/${encodeURIComponent(classId)}/worksheets/${encodeURIComponent(id)}`);
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }, [worksheetId, saveDraft, hasPdf, classId, router]);

  return (
    <Layout>
      <TeacherPortalShell title="Worksheet activity" backHref={`/teacher/class/${classId}/worksheets`}>
        <TeacherClassActivitiesNav classId={classId} active="worksheets" />

        <div className="max-w-2xl mx-auto space-y-5 text-left">
          {error ? <p className="text-red-300 text-sm">{error}</p> : null}

          <label className="block text-sm text-white/80">
            Title
            <input
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="block text-sm text-white/80">
            Subject
            <select
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {REPORT_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {subjectLabelHe(s)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-white/80">
            Instructions for students
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </label>

          <label className="block text-sm text-white/80">
            Physical submission due date
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white"
              value={physicalDueAt}
              onChange={(e) => setPhysicalDueAt(e.target.value)}
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm text-white/80 mb-2">Activity mode</legend>
            {MODES.map((m) => (
              <label key={m} className="flex items-center gap-2 justify-end cursor-pointer">
                <span className="text-white">{worksheetModeLabelHe(m)}</span>
                <input
                  type="radio"
                  name="worksheetMode"
                  checked={worksheetMode === m}
                  onChange={() => {
                    setWorksheetMode(m);
                    if (m !== "pdf_only" && questions.length === 0) {
                      setQuestions([
                        {
                          questionIndex: 1,
                          questionType: "multiple_choice",
                          points: 1,
                          choices: ["A", "B", "C", "D"],
                        },
                      ]);
                    }
                  }}
                />
              </label>
            ))}
          </fieldset>

          {worksheetMode !== "pdf_only" ? (
            <TeacherQuestionBuilder questions={questions} onChange={setQuestions} disabled={busy} />
          ) : null}

          <div className="flex flex-wrap gap-3 justify-end">
            <button
              type="button"
              disabled={busy}
              onClick={() => void saveDraft()}
              className="px-4 py-2 rounded-xl border border-white/20 text-white"
            >
              Save as draft
            </button>
          </div>

          {worksheetId ? (
            <PdfUploader disabled={busy} uploadFn={uploadPdf} onUploaded={() => setHasPdf(true)} />
          ) : (
            <p className="text-sm text-white/50">Save a draft before uploading a PDF.</p>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => void activate()}
            className="w-full py-3 rounded-xl bg-violet-500/90 text-black font-bold hover:bg-violet-400"
          >
            Launch and send to class
          </button>
        </div>
      </TeacherPortalShell>
    </Layout>
  );
}
