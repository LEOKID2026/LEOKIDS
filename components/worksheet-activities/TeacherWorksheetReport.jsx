import Link from "next/link";
import { worksheetGradingStatusLabelHe } from "../../lib/worksheet-activities/worksheet-labels.client.js";

/**
 * @param {{ classId?: string, worksheetId: string, report: Record<string, unknown>, worksheetRouteBase?: string }} props
 */
export default function TeacherWorksheetReport({ classId, worksheetId, report, worksheetRouteBase }) {
  const base =
    worksheetRouteBase ||
    `/teacher/class/${encodeURIComponent(classId)}/worksheets/${encodeURIComponent(worksheetId)}`;
  const rows = Array.isArray(report.studentRows) ? report.studentRows : [];

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Stat label="Total students" value={report.totalStudents} />
        <Stat label="Opened PDF" value={report.pdfOpenedCount} />
        <Stat label="Completed (PDF)" value={report.markedCompleteCount} />
        <Stat label="Submitted answers" value={report.digitalSubmittedCount} />
        <Stat label="Pending review" value={report.pendingReviewCount} />
        <Stat label="Published" value={report.publishedCount} />
        {report.classAveragePct != null ? (
          <Stat label="Class average" value={`${report.classAveragePct}%`} />
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Opened PDF</th>
              <th className="p-3">Completed</th>
              <th className="p-3">Digital submission</th>
              <th className="p-3">Status</th>
              <th className="p-3">Score</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.studentId} className="border-t border-white/10">
                <td className="p-3 text-white">{row.studentName}</td>
                <td className="p-3 text-white/80">
                  {row.pdfOpenCount > 0 ? "✓" : "-"}
                </td>
                <td className="p-3 text-white/80">
                  {row.markedCompletedAt ? "✓" : "-"}
                </td>
                <td className="p-3 text-white/80">
                  {row.digitalSubmittedAt ? "✓" : "-"}
                </td>
                <td className="p-3 text-white/80">
                  {worksheetGradingStatusLabelHe(row.gradingStatus)}
                </td>
                <td className="p-3 text-white">
                  {row.gradingStatus === "published" && row.finalScorePct != null
                    ? `${row.finalScorePct}%`
                    : "-"}
                </td>
                <td className="p-3">
                  {report.worksheetMode !== "pdf_only" &&
                  row.digitalSubmittedAt &&
                  row.gradingStatus !== "published" ? (
                    <Link
                      href={`${base}/grade/${encodeURIComponent(row.studentId)}`}
                      className="text-amber-300 hover:underline"
                    >
                      Review
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-xl font-bold text-white tabular-nums">{value ?? 0}</p>
    </div>
  );
}
