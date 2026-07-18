import { globalBurnDownCopy } from "../../../lib/i18n/global-burn-down-copy.js";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import TeacherPortalShell from "../../../components/teacher-portal/TeacherPortalShell";
import { getLearningSupabaseBrowserClient } from "../../../lib/learning-supabase/client";
import { resolveTeacherAccessToken } from "../../../lib/teacher-portal/use-teacher-portal-session";
import { teacherAuthFetch } from "../../../lib/teacher-portal/teacher-ui.js";
import {
  worksheetModeLabelHe,
  worksheetStatusLabelHe,
} from "../../../lib/worksheet-activities/worksheet-labels.client.js";

export default function TeacherWorksheetsListPage() {
  const router = useRouter();
  const [phase, setPhase] = useState("loading");
  const [worksheets, setWorksheets] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setPhase("loading");
    setError("");
    try {
      const supabase = getLearningSupabaseBrowserClient();
      const session = await resolveTeacherAccessToken(supabase);
      if (!session.ok) {
        router.replace("/teacher/login");
        return;
      }
      const res = await teacherAuthFetch(session.token, "/api/teacher/worksheet-activities");
      const body = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403) {
        setPhase("forbidden");
        return;
      }
      if (!res.ok) {
        setError(body?.error?.message || body?.error?.code || "Error loading");
        setPhase("error");
        return;
      }
      setWorksheets(body?.data?.worksheets || []);
      setPhase("ready");
    } catch {
      setError("Network error");
      setPhase("error");
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const manageHref = (w) => {
    if (w.assignmentScope === "selected_students" || !w.classId) {
      return `/teacher/worksheets/${encodeURIComponent(w.worksheetId)}`;
    }
    return `/teacher/class/${encodeURIComponent(w.classId)}/worksheets/${encodeURIComponent(w.worksheetId)}`;
  };

  const reportHref = (w) => {
    if (w.assignmentScope === "selected_students" || !w.classId) {
      return `/teacher/worksheets/${encodeURIComponent(w.worksheetId)}/report`;
    }
    return `/teacher/class/${encodeURIComponent(w.classId)}/worksheets/${encodeURIComponent(w.worksheetId)}/report`;
  };

  return (
    <Layout>
      <TeacherPortalShell
        title={globalBurnDownCopy("pages__teacher__worksheets__index", "worksheets")}
        backHref="/teacher/dashboard"
        backLabel="← Back to dashboard"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-white/70 text-sm">All your worksheets — whole class or selected students.</p>
          <Link
            href="/teacher/worksheets/new"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-violet-500/90 text-black font-semibold text-sm hover:bg-violet-400"
            data-testid="teacher-worksheets-new-link"
          >
            Create new worksheet
          </Link>
        </div>

        {phase === "loading" ? <p className="text-white/60">Loading…</p> : null}
        {phase === "error" ? <p className="text-red-300">{error}</p> : null}

        {phase === "ready" && worksheets.length === 0 ? (
          <p className="text-white/60">No worksheets yet.</p>
        ) : null}

        {phase === "ready" && worksheets.length > 0 ? (
          <div className="grid gap-3">
            {worksheets.map((w) => (
              <div
                key={w.worksheetId}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left"
              >
                <div>
                  <h3 className="font-bold text-white">{w.title}</h3>
                  <p className="text-sm text-white/65 mt-1">
                    {worksheetModeLabelHe(w.worksheetMode)} · {worksheetStatusLabelHe(w.status)}
                    {w.assignmentScope === "selected_students" ? " · selected students" : " · class"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Link
                    href={manageHref(w)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-white/20 text-white/90 hover:bg-white/10"
                  >
                    Manage
                  </Link>
                  <Link
                    href={reportHref(w)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-100 border border-violet-400/30"
                  >
                    Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </TeacherPortalShell>
    </Layout>
  );
}
