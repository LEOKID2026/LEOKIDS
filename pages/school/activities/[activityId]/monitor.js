import { globalBurnDownCopy } from "../../../../lib/i18n/global-burn-down-copy.js";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import SchoolPortalShell from "../../../../components/school-portal/SchoolPortalShell";
import TeacherActivityStudentAnswersModal from "../../../../components/teacher-portal/TeacherActivityStudentAnswersModal.jsx";
import { studentActivityStatusLabelHe } from "../../../../lib/classroom-activities/classroom-activities-labels.client.js";
import { useSchoolPortalLoad } from "../../../../lib/school-portal/use-school-portal-session";
import {
  apiErrorMessageHe,
  schoolAuthFetch,
  schoolUiFill,
  SCHOOL_BACK_TO_ACTIVITIES,
  SCHOOL_CLASS_ACCURACY,
  SCHOOL_COL_ANSWERS,
  SCHOOL_COL_CORRECT,
  SCHOOL_COL_STUDENT,
  SCHOOL_LOAD_ERROR,
  SCHOOL_MONITOR_CHILDREN_QUESTIONS,
  SCHOOL_NETWORK_ERROR,
  SCHOOL_STATUS_LABEL,
  SCHOOL_VIEW_ANSWERS,
  SCHOOL_VIEW_DETAILS,
} from "../../../../lib/school-portal/school-ui.js";

export async function getServerSideProps(context) {
  return {
    props: {
      activityId: String(context.params?.activityId || ""),
    },
  };
}

export default function SchoolActivityMonitorPage({ activityId }) {
  const router = useRouter();
  const { state, accessToken } = useSchoolPortalLoad();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [answersStudent, setAnswersStudent] = useState(null);

  useEffect(() => {
    if (state === "unauthenticated") router.replace("/teacher/login");
    if (state === "forbidden") router.replace("/teacher/dashboard");
    if (state === "pending") router.replace("/school/pending");
    if (state === "ready" && accessToken) {
      /* loaded below */
    }
  }, [state, accessToken, router]);

  const load = useCallback(async () => {
    if (!accessToken || !activityId) return;
    try {
      const res = await schoolAuthFetch(
        accessToken,
        `/api/school/activities/${encodeURIComponent(activityId)}/monitor`
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(apiErrorMessageHe(body?.error, SCHOOL_LOAD_ERROR));
        setData(null);
        return;
      }
      setData(body.data);
    } catch {
      setError(SCHOOL_NETWORK_ERROR);
    }
  }, [accessToken, activityId]);

  useEffect(() => {
    if (state === "ready" && accessToken) {
      void load();
    }
  }, [state, accessToken, load]);

  const activity = data?.activity;
  const students = Array.isArray(data?.students) ? data.students : [];

  return (
    <Layout title={globalBurnDownCopy("pages__school__activities__[activityId]__monitor", "activity_monitor")}>
      <SchoolPortalShell title={globalBurnDownCopy("pages__school__activities__[activityId]__monitor", "activity_monitor")}>
        <div className="space-y-4 text-start">
          <Link href="/school/dashboard#activities" className="text-sm text-amber-300 hover:underline">
            {SCHOOL_BACK_TO_ACTIVITIES}
          </Link>

          {error ? <p className="text-red-300 text-sm">{error}</p> : null}

          {activity ? (
            <div className="rounded-lg border border-white/10 bg-black/25 p-4 space-y-1">
              <h1 className="text-lg font-semibold text-white">{activity.title}</h1>
              <p className="text-sm text-white/70">
                {schoolUiFill(SCHOOL_MONITOR_CHILDREN_QUESTIONS, {
                  children: students.length,
                  questions: activity.questionCount ?? "-",
                })}
              </p>
              {data?.summary?.classAccuracy != null ? (
                <p className="text-sm text-white/70">
                  {schoolUiFill(SCHOOL_CLASS_ACCURACY, { pct: data.summary.classAccuracy })}
                </p>
              ) : null}
            </div>
          ) : null}

          {students.length ? (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[640px] text-sm text-start">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="px-3 py-2">{SCHOOL_COL_STUDENT}</th>
                    <th className="px-3 py-2">{SCHOOL_STATUS_LABEL}</th>
                    <th className="px-3 py-2">{SCHOOL_COL_ANSWERS}</th>
                    <th className="px-3 py-2">{SCHOOL_COL_CORRECT}</th>
                    <th className="px-3 py-2">{SCHOOL_VIEW_DETAILS}</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.studentId} className="border-t border-white/10">
                      <td className="px-3 py-2">{s.studentFullNameMasked}</td>
                      <td className="px-3 py-2">{studentActivityStatusLabelHe(s.status)}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {s.answersCount}/{activity?.questionCount ?? "-"}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {s.answersCount > 0
                          ? `${Math.round((s.correctCount / s.answersCount) * 100)}%`
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          className="text-amber-200/90 hover:text-amber-100 text-sm underline-offset-2 hover:underline"
                          data-testid="school-view-student-answers"
                          onClick={() => setAnswersStudent(s)}
                        >
                          {SCHOOL_VIEW_ANSWERS}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        <TeacherActivityStudentAnswersModal
          open={Boolean(answersStudent)}
          onClose={() => setAnswersStudent(null)}
          accessToken={accessToken}
          activityId={activityId}
          student={answersStudent}
          activityTitle={activity?.title}
          authFetch={schoolAuthFetch}
          answersApiPath={
            answersStudent
              ? `/api/school/activities/${encodeURIComponent(activityId)}/students/${encodeURIComponent(answersStudent.studentId)}/answers`
              : undefined
          }
        />
      </SchoolPortalShell>
    </Layout>
  );
}
