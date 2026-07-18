import { globalBurnDownCopy } from "../../../../../lib/i18n/global-burn-down-copy.js";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../../../components/Layout";
import TeacherPortalShell from "../../../../../components/teacher-portal/TeacherPortalShell";
import TeacherClassActivitiesNav from "../../../../../components/teacher-portal/TeacherClassActivitiesNav";
import { getLearningSupabaseBrowserClient } from "../../../../../lib/learning-supabase/client";
import { resolveTeacherAccessToken } from "../../../../../lib/teacher-portal/use-teacher-portal-session";
import {
  activityModeLabelHe,
  activityStatusLabelHe,
} from "../../../../../lib/classroom-activities/classroom-activities-labels.client.js";
import { teacherAuthFetch } from "../../../../../lib/teacher-portal/teacher-ui.js";

export async function getServerSideProps(context) {
  const classId = String(context.params?.classId || "").trim();
  return { props: { classId } };
}

export default function TeacherClassActivitiesPage({ classId }) {
  const router = useRouter();
  const [phase, setPhase] = useState("loading");
  const [activities, setActivities] = useState([]);
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
      const res = await teacherAuthFetch(
        session.token,
        `/api/teacher/activities?classId=${encodeURIComponent(classId)}`
      );
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
      setActivities(body?.data?.activities || []);
      setPhase("ready");
    } catch {
      setError("Network error");
      setPhase("error");
    }
  }, [classId, router]);

  useEffect(() => {
    if (classId) load();
  }, [classId, load]);

  return (
    <Layout>
      <TeacherPortalShell
        title={globalBurnDownCopy("pages__teacher__class__[classId]__activities__index", "class_activities")}
        backHref="/teacher/dashboard"
        backLabel="← Back to dashboard"
      >
        <TeacherClassActivitiesNav classId={classId} />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-white/70 text-sm">Create, launch, and track class activities.</p>
          <Link
            href={`/teacher/class/${encodeURIComponent(classId)}/activities/new`}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-500/90 text-black font-semibold text-sm hover:bg-amber-400"
          >
            New activity
          </Link>
        </div>

        {phase === "loading" ? (
          <p className="text-white/70">Loading activities…</p>
        ) : null}
        {phase === "error" ? (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-100">
            <p>{error}</p>
            <button type="button" onClick={load} className="mt-2 text-sm underline">
              Try again
            </button>
          </div>
        ) : null}
        {phase === "forbidden" ? (
          <p className="text-red-200">You do not have permission to view this class's activities.</p>
        ) : null}

        {phase === "ready" && activities.length === 0 ? (
          <p className="text-white/60 text-sm">No activities yet. Create a new activity.</p>
        ) : null}

        {phase === "ready" && activities.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-white/70">
                <tr>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Progress</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => {
                  const href =
                    a.status === "closed" || a.status === "archived"
                      ? `/teacher/class/${encodeURIComponent(classId)}/activities/${encodeURIComponent(a.activityId)}/report`
                      : `/teacher/class/${encodeURIComponent(classId)}/activities/${encodeURIComponent(a.activityId)}/monitor`;
                  const prog = a.progressSummary || {};
                  return (
                    <tr key={a.activityId} className="border-t border-white/10 hover:bg-white/[0.03]">
                      <td className="px-3 py-2 font-medium">{a.title}</td>
                      <td className="px-3 py-2">{activityStatusLabelHe(a.status)}</td>
                      <td className="px-3 py-2">{activityModeLabelHe(a.mode)}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {prog.submittedCount ?? 0}/{prog.rosterCount ?? 0}
                      </td>
                      <td className="px-3 py-2">
                        <Link href={href} className="text-amber-300 hover:underline">
                          {a.status === "draft" ? "Edit / launch" : "View"}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </TeacherPortalShell>
    </Layout>
  );
}
