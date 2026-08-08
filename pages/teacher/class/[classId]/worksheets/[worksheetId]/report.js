import { globalBurnDownCopy } from "../../../../../../lib/i18n/global-burn-down-copy.js";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../../../components/Layout";
import TeacherPortalShell from "../../../../../../components/teacher-portal/TeacherPortalShell";
import TeacherClassActivitiesNav from "../../../../../../components/teacher-portal/TeacherClassActivitiesNav";
import TeacherWorksheetReport from "../../../../../../components/worksheet-activities/TeacherWorksheetReport";
import { getLearningSupabaseBrowserClient } from "../../../../../../lib/learning-supabase/client";
import { resolveTeacherAccessToken } from "../../../../../../lib/teacher-portal/use-teacher-portal-session";
import { apiErrorMessageHe, teacherAuthFetch } from "../../../../../../lib/teacher-portal/teacher-ui.js";

const SLUG = "pages__teacher__class__[classId]__worksheets__[worksheetId]__report";
const c = (key) => globalBurnDownCopy(SLUG, key);

export async function getServerSideProps(context) {
  return {
    props: {
      classId: String(context.params?.classId || "").trim(),
      worksheetId: String(context.params?.worksheetId || "").trim(),
    },
  };
}

export default function TeacherWorksheetReportPage({ classId, worksheetId }) {
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const supabase = getLearningSupabaseBrowserClient();
      const session = await resolveTeacherAccessToken(supabase);
      if (!session.ok) {
        router.replace("/teacher/login");
        return;
      }
      const res = await teacherAuthFetch(
        session.token,
        `/api/teacher/worksheet-activities/${encodeURIComponent(worksheetId)}/report`
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(apiErrorMessageHe(body?.error, c("error_generic")));
        return;
      }
      setReport(body.data.report);
    } catch {
      setError(c("network_error"));
    }
  }, [worksheetId, router]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Layout>
      <TeacherPortalShell title={c("worksheet_report")} backHref={`/teacher/class/${classId}/worksheets/${worksheetId}`}>
        <TeacherClassActivitiesNav classId={classId} active="worksheets" />
        {error ? <p className="text-red-300">{error}</p> : null}
        {report ? (
          <TeacherWorksheetReport classId={classId} worksheetId={worksheetId} report={report} />
        ) : (
          <p className="text-white/60">{c("loading")}</p>
        )}
      </TeacherPortalShell>
    </Layout>
  );
}
