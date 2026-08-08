import { globalBurnDownCopy } from "../../../lib/i18n/global-burn-down-copy.js";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import TeacherPortalShell from "../../../components/teacher-portal/TeacherPortalShell";
import PdfUploader from "../../../components/worksheet-activities/PdfUploader";
import TeacherQuestionBuilder from "../../../components/worksheet-activities/TeacherQuestionBuilder";
import TeacherStudentSelector from "../../../components/worksheet-activities/TeacherStudentSelector";
import { getLearningSupabaseBrowserClient } from "../../../lib/learning-supabase/client";
import { resolveTeacherAccessToken } from "../../../lib/teacher-portal/use-teacher-portal-session";
import { apiErrorMessageHe, teacherAuthFetch } from "../../../lib/teacher-portal/teacher-ui.js";
import { REPORT_SUBJECTS, subjectLabel } from "../../../lib/teacher-portal/teacher-ui.js";
import { worksheetModeLabelHe } from "../../../lib/worksheet-activities/worksheet-labels.client.js";

const SLUG = "pages__teacher__worksheets__new";
const c = (key) => globalBurnDownCopy(SLUG, key);

const MODES = ["pdf_only", "digital_answers", "manual_grading"];

export default function TeacherNewDirectWorksheetPage() {
  const router = useRouter();
  const preselectedStudentId =
    typeof router.query?.studentId === "string" ? router.query.studentId : "";

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("math");
  const [instructions, setInstructions] = useState("");
  const [worksheetMode, setWorksheetMode] = useState("pdf_only");
  const [physicalDueAt, setPhysicalDueAt] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [worksheetId, setWorksheetId] = useState("");
  const [hasPdf, setHasPdf] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const uploadPdf = useCallback(
    async (file) => {
      if (!worksheetId) return { ok: false, error: c("save_draft_first") };
      const supabase = getLearningSupabaseBrowserClient();
      const session = await resolveTeacherAccessToken(supabase);
      if (!session.ok) return { ok: false, error: c("not_signed_in") };

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
        return { ok: false, error: apiErrorMessageHe(body?.error, c("upload_failed")) };
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
      setError(c("please_enter_title"));
      return null;
    }
    if (!selectedStudentIds.length) {
      setError(c("please_select_at_least_one_student"));
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
        studentIds: selectedStudentIds,
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
          setError(apiErrorMessageHe(body?.error, c("error_saving")));
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
            body: JSON.stringify({
              title: payload.title,
              subject: payload.subject,
              instructions: payload.instructions,
              worksheetMode: payload.worksheetMode,
              physicalDueAt: payload.physicalDueAt,
              questionCount: payload.questionCount,
            }),
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
      setError(c("network_error"));
      return null;
    } finally {
      setBusy(false);
    }
  }, [
    title,
    subject,
    instructions,
    worksheetMode,
    physicalDueAt,
    questions,
    worksheetId,
    selectedStudentIds,
    router,
  ]);

  const activate = useCallback(async () => {
    const id = worksheetId || (await saveDraft());
    if (!id) return;
    if (!hasPdf) {
      setError(c("upload_pdf_before_launch"));
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
        setError(apiErrorMessageHe(body?.error, c("launch_failed")));
        return;
      }
      router.push(`/teacher/worksheets/${encodeURIComponent(id)}`);
    } catch {
      setError(c("network_error"));
    } finally {
      setBusy(false);
    }
  }, [worksheetId, saveDraft, hasPdf, router]);

  return (
    <Layout>
      <TeacherPortalShell title={c("page_title")} backHref="/teacher/worksheets">
        <div className="max-w-2xl mx-auto space-y-5 text-start">
          {error ? <p className="text-red-300 text-sm">{error}</p> : null}

          <TeacherStudentSelector
            selectedStudentIds={selectedStudentIds}
            onChange={setSelectedStudentIds}
            preselectedStudentId={preselectedStudentId}
            disabled={busy || Boolean(worksheetId)}
          />

          <label className="block text-sm text-white/80">
            {c("title")}
            <input
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="block text-sm text-white/80">
            {c("subject")}
            <select
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {REPORT_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {subjectLabel(s)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-white/80">
            {c("instructions_for_students")}
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </label>

          <label className="block text-sm text-white/80">
            {c("physical_due_date")}
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white"
              value={physicalDueAt}
              onChange={(e) => setPhysicalDueAt(e.target.value)}
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm text-white/80 mb-2">{c("activity_mode")}</legend>
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
              {c("save_as_draft")}
            </button>
          </div>

          {worksheetId ? (
            <PdfUploader disabled={busy} uploadFn={uploadPdf} onUploaded={() => setHasPdf(true)} />
          ) : (
            <p className="text-sm text-white/50">{c("save_draft_before_pdf")}</p>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => void activate()}
            className="w-full py-3 rounded-xl bg-violet-500/90 text-black font-bold hover:bg-violet-400"
            data-testid="teacher-worksheet-activate-selected-students"
          >
            {c("launch_selected")}
          </button>
        </div>
      </TeacherPortalShell>
    </Layout>
  );
}
