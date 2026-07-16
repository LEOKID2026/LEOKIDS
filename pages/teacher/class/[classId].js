import { useMemo } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import ReportDateRangeControl from "../../../components/reporting/ReportDateRangeControl.jsx";
import SubjectSummaryCards from "../../../components/teacher-portal/SubjectSummaryCards";
import TeacherPortalShell from "../../../components/teacher-portal/TeacherPortalShell";
import TeacherClassActivitiesNav from "../../../components/teacher-portal/TeacherClassActivitiesNav";
import {
  TeacherReportError,
  TeacherReportForbidden,
  TeacherReportLoading,
} from "../../../components/teacher-portal/TeacherReportPageStates";
import {
  isTeacherClassReportResponse,
  useTeacherPortalLoad,
} from "../../../lib/teacher-portal/use-teacher-portal-session";
import { useReportDateRange } from "../../../hooks/useReportDateRange.js";
import {
  actionTypeLabelHe,
  attentionReasonHe,
  canShowClassCalmWeakTopicsMessage,
  classGuidanceSeverityTierHe,
  classHealthHe,
  CLASS_WEAK_TOPICS_FALLBACK_BANNER,
  formatPercent,
  formatTopicLineHe,
  groupTierHe,
  subjectLabelHe,
} from "../../../lib/teacher-portal/teacher-ui.js";

export async function getServerSideProps(context) {
  const classId = String(context.params?.classId || "").trim();
  return { props: { classId } };
}

export default function TeacherClassReportPage({ classId }) {
  const reportRange = useReportDateRange();

  const fetchPath = useMemo(() => {
    if (!classId) return "";
    const params = reportRange.buildSearchParams();
    return `/api/teacher/classes/${encodeURIComponent(classId)}/report-data?${params.toString()}`;
  }, [classId, reportRange.appliedRange.from, reportRange.appliedRange.to, reportRange.buildSearchParams]);

  const { phase, loadingHint, errorMessage, data: report, reload } = useTeacherPortalLoad({
    enabled: Boolean(classId),
    fetchPath,
    fetchTimeoutMs: 120_000,
    isValidResponse: isTeacherClassReportResponse,
  });

  if (!classId) {
    return (
      <Layout>
        <TeacherReportForbidden
          backHref="/teacher/dashboard"
          title="Class report"
          message="Invalid class ID."
        />
      </Layout>
    );
  }

  if (phase === "loading") {
    return (
      <Layout>
        <TeacherReportLoading
          backHref="/teacher/dashboard"
          title="Class report"
          hint={loadingHint}
        />
      </Layout>
    );
  }

  if (phase === "forbidden") {
    return (
      <Layout>
        <TeacherReportForbidden
          backHref="/teacher/dashboard"
          title="Class report"
          message="You do not have permission to view this class report."
        />
      </Layout>
    );
  }

  if (phase === "error") {
    return (
      <Layout>
        <TeacherReportError
          backHref="/teacher/dashboard"
          title="Class report"
          message={errorMessage}
          onRetry={reload}
        />
      </Layout>
    );
  }

  const className = report.class?.name || "Class";
  const cohort = report.cohortSummary || {};
  const guidance = report.teacherGuidanceBlock || {};
  const teacherSummary = guidance.teacherSummary || {};
  const attentionList = guidance.attentionStudents || report.attentionList || [];
  const isGuidanceV2 = guidance.version === "v2";
  const classRecommendationUnits = isGuidanceV2
    ? guidance.classRecommendationUnits || []
    : [];
  const smallGroupClusters = isGuidanceV2 ? guidance.smallGroupClusters || [] : [];
  const classTier =
    guidance.guidanceSeverityTier ||
    guidance.cohortStats?.guidanceSeverityTier ||
    null;
  const classTierHe =
    (classTier && classGuidanceSeverityTierHe(classTier)) ||
    classHealthHe(teacherSummary.classHealthSignal);
  const showCalmWeakTopics = canShowClassCalmWeakTopicsMessage(guidance, report);

  const weaknessTopics = isGuidanceV2
    ? classRecommendationUnits.filter((u) => u.topicLabelHe || u.headlineHe)
    : (report.weaknessTopics || guidance.priorityTopics || []).filter((t) =>
        formatTopicLineHe(t.subject, t.topic)
      );
  const groups = guidance.suggestedGroups || {};
  const memberCount = report.roster?.activeMemberCount ?? 0;

  const reinforcement = isGuidanceV2
    ? []
    : (guidance.reinforcementSuggestions || [])
        .map((t) => {
          const line = formatTopicLineHe(t.subject, t.topic);
          return line ? `Recommended to reinforce: ${line}` : null;
        })
        .filter(Boolean);
  const extension = isGuidanceV2
    ? []
    : (guidance.extensionSuggestions || [])
        .map((t) => {
          const line = formatTopicLineHe(t.subject, t.topic);
          if (!line) return null;
          return `${line} - strong class performance (${formatPercent(t.accuracy)})`;
        })
        .filter(Boolean);

  return (
    <Layout>
      <div
        data-testid="teacher-class-report-root"
        data-state="ready"
        data-class-id={classId}
        data-report-ok="true"
        data-member-count={String(memberCount)}
      >
        <TeacherPortalShell backHref="/teacher/dashboard" title={`Class report: ${className}`}>
          <TeacherClassActivitiesNav classId={classId} />
          <ReportDateRangeControl
            presetDays={reportRange.presetDays}
            customDates={reportRange.customDates}
            startDate={reportRange.startDate}
            endDate={reportRange.endDate}
            onStartDateChange={reportRange.setStartDate}
            onEndDateChange={reportRange.setEndDate}
            rangeLabel={reportRange.rangeLabel}
            disabled={phase === "loading"}
            onPreset={(days) => reportRange.applyPreset(days)}
            onEnableCustom={() => reportRange.setCustomDates(true)}
            onApplyCustom={() => {
              const result = reportRange.applyCustom();
              if (!result.ok) alert("Please select valid dates");
            }}
            className="mb-4"
          />
          <p className="text-white/60 text-sm mb-2">
            {memberCount} active students
          </p>

          {memberCount === 0 ? (
            <p className="text-amber-200 text-sm mb-6">
              This class is empty — add students to see a report.
            </p>
          ) : null}

          <section className="rounded-xl border border-white/15 bg-black/30 p-5 mb-6">
            <h2 className="text-lg font-semibold mb-3">Class summary</h2>
            {guidance.insufficientData && cohort.totalAnswers < 10 ? (
              <p className="text-white/70 text-sm">
                Cannot compute recommendations — not enough data in this period.
              </p>
            ) : (
              <>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <dt className="text-white/60">Total practice sessions</dt>
                    <dd>{cohort.totalSessions ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">Total answers</dt>
                    <dd>{cohort.totalAnswers ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">Average success rate</dt>
                    <dd>{formatPercent(cohort.accuracy)}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">Students with data</dt>
                    <dd>{cohort.studentsWithActivity ?? 0}</dd>
                  </div>
                </dl>
                {classTierHe ? (
                  <p className="text-amber-200 text-sm">{classTierHe}</p>
                ) : null}
              </>
            )}
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Class performance by subject</h2>
            <SubjectSummaryCards subjects={report.subjects} showTopics />
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Topics that need reinforcement</h2>
            {weaknessTopics.length ? (
              <ul className="text-sm text-white/80 space-y-2">
                {weaknessTopics.slice(0, 10).map((t, i) => {
                  if (isGuidanceV2) {
                    if (t.level === "subject" && t.headlineHe) {
                      const action = actionTypeLabelHe(t.recommendedActionType);
                      return (
                        <li
                          key={t.unitId || i}
                          className="rounded border border-white/10 px-3 py-2"
                        >
                          <span className="font-medium">{t.headlineHe}</span>
                          : {t.affectedStudentCount ?? 0}/{memberCount} Students ·{" "}
                          {formatPercent(t.cohortAccuracyPct)} Success
                          {t.actionHe ? ` · ${t.actionHe}` : action ? ` · ${action}` : ""}
                        </li>
                      );
                    }
                    const subj = subjectLabelHe(t.subject);
                    const headline = t.subtopicLabelHe
                      ? `${t.topicLabelHe} - ${t.subtopicLabelHe}`
                      : t.topicLabelHe;
                    const errPct =
                      t.cohortAccuracyPct != null
                        ? formatPercent(100 - t.cohortAccuracyPct)
                        : "-";
                    const action = actionTypeLabelHe(t.recommendedActionType);
                    return (
                      <li
                        key={t.unitId || i}
                        className="rounded border border-white/10 px-3 py-2"
                      >
                        <span className="font-medium">
                          {subj ? `${subj} - ${headline}` : headline}
                        </span>
                        : {t.affectedStudentCount ?? 0}/{memberCount} Students ·{" "}
                        {formatPercent(t.cohortAccuracyPct)} success · error rate {errPct}
                        {action ? ` · ${action}` : ""}
                      </li>
                    );
                  }
                  const line = formatTopicLineHe(t.subject, t.topic);
                  if (!line) return null;
                  const acc =
                    t.answers > 0
                      ? formatPercent(((t.wrong || 0) / t.answers) * 100)
                      : "-";
                  return (
                    <li key={i}>
                      {line}: {acc} avg errors
                      {t.studentCount ? ` · ${t.studentCount} students` : ""}
                    </li>
                  );
                }).filter(Boolean)}
              </ul>
            ) : (
              <p className="text-white/60 text-sm">
                {showCalmWeakTopics
                  ? "No problematic topics found in this period."
                  : CLASS_WEAK_TOPICS_FALLBACK_BANNER}
              </p>
            )}
          </section>

          {isGuidanceV2 && smallGroupClusters.length > 0 ? (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Suggested support groups</h2>
              <ul className="text-sm text-white/80 space-y-2">
                {smallGroupClusters
                  .filter((c) => c.topicLabelHe)
                  .map((c, i) => (
                  <li key={i} className="rounded border border-white/10 px-3 py-2">
                    <span className="font-medium">{c.topicLabelHe}</span>
                    : {(c.studentNamesMasked || []).join(", ")}
                    {c.avgAccuracyPct != null
                      ? ` · avg ${formatPercent(c.avgAccuracyPct)}`
                      : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Students who need monitoring</h2>
            {attentionList.length ? (
              <ul className="space-y-2">
                {attentionList.map((s) => (
                  <li
                    key={s.studentId}
                    className="flex flex-wrap justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="font-medium break-words">
                        {s.studentFullName || s.studentFullNameMasked}
                      </span>
                      <span className="text-white/50 mr-2 block sm:inline">
                        {(s.reasons || [])
                          .map(attentionReasonHe)
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                    <Link
                      href={`/teacher/student/${s.studentId}`}
                      className="text-amber-300 hover:underline shrink-0"
                    >
                      View report
                    </Link>
                  </li>
                ))}
              </ul>
            ) : memberCount > 0 ? (
              <p className="text-white/60 text-sm">
                All students in the class are on track — no special intervention needed.
              </p>
            ) : null}
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Suggested work groups</h2>
            {["struggling", "on_track", "advanced"].map((tier) => {
              const list = groups[tier] || [];
              if (!list.length) return null;
              return (
                <div key={tier} className="mb-2 text-sm">
                  <span className="font-semibold text-amber-200">
                    {groupTierHe(tier)} ({list.length} Students):
                  </span>{" "}
                  <span className="text-white/70 break-words">
                    {list.map((x) => x.studentFullName || x.studentFullNameMasked).join("، ")}
                  </span>
                </div>
              );
            })}
            {!groups.struggling?.length &&
            !groups.on_track?.length &&
            !groups.advanced?.length ? (
              <p className="text-white/60 text-sm">
                {memberCount < 3
                  ? "Not enough students with data to form groups."
                  : "Not enough data to form groups."}
              </p>
            ) : (
              <p className="text-xs text-white/50 mt-2">
                *Groups are computed from performance — the teacher makes the final call.
              </p>
            )}
          </section>

          {!isGuidanceV2 ? (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Focus for next lesson</h2>
            {(guidance.nextLessonFocus || []).length ? (
              <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                {guidance.nextLessonFocus
                  .map((f, i) => {
                    const line = formatTopicLineHe(f.subject, f.topic);
                    if (!line) return null;
                    return (
                      <li key={i}>
                        {line}
                        {f.affectedStudents
                          ? ` - ${f.affectedStudents} students struggled with this topic`
                          : ""}
                      </li>
                    );
                  })
                  .filter(Boolean)}
              </ul>
            ) : (
              <p className="text-white/60 text-sm">
                No standout topic for the next lesson — continue with the curriculum.
              </p>
            )}
          </section>
          ) : null}

          {!isGuidanceV2 ? (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Reinforcement suggestions</h2>
            {reinforcement.length ? (
              <ul className="list-disc list-inside text-sm text-white/80">
                {reinforcement.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60 text-sm">No special reinforcement suggestions for this period.</p>
            )}
          </section>
          ) : null}

          {!isGuidanceV2 ? (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Enrichment suggestions</h2>
            {extension.length ? (
              <ul className="list-disc list-inside text-sm text-white/80">
                {extension.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60 text-sm">No enrichment suggestions for this period.</p>
            )}
          </section>
          ) : null}
        </TeacherPortalShell>
      </div>
    </Layout>
  );
}
