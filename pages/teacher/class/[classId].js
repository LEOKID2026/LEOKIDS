import { globalBurnDownCopy } from "../../../lib/i18n/global-burn-down-copy.js";
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
import { useT } from "../../../lib/i18n/I18nProvider.jsx";
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
  subjectLabel,
} from "../../../lib/teacher-portal/teacher-ui.js";

const SLUG = "pages__teacher__class__[classId]";

function c(key, vars) {
  let text = globalBurnDownCopy(SLUG, key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.split(`{${k}}`).join(String(v));
    }
  }
  return text;
}

export async function getServerSideProps(context) {
  const classId = String(context.params?.classId || "").trim();
  return { props: { classId } };
}

export default function TeacherClassReportPage({ classId }) {
  const t = useT();
  const reportRange = useReportDateRange();
  const classReportTitle = t("ui.teacherShell.classReportTitle");

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
          title={classReportTitle}
          message={c("invalid_class_id")}
        />
      </Layout>
    );
  }

  if (phase === "loading") {
    return (
      <Layout>
        <TeacherReportLoading
          backHref="/teacher/dashboard"
          title={classReportTitle}
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
          title={classReportTitle}
          message={c("you_do_not_have_permission_to_view_this_class_report")}
        />
      </Layout>
    );
  }

  if (phase === "error") {
    return (
      <Layout>
        <TeacherReportError
          backHref="/teacher/dashboard"
          title={classReportTitle}
          message={errorMessage}
          onRetry={reload}
        />
      </Layout>
    );
  }

  const className = report.class?.name || c("class_fallback_name");
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
    : (report.weaknessTopics || guidance.priorityTopics || []).filter((topic) =>
        formatTopicLineHe(topic.subject, topic.topic)
      );
  const groups = guidance.suggestedGroups || {};
  const memberCount = report.roster?.activeMemberCount ?? 0;

  const reinforcement = isGuidanceV2
    ? []
    : (guidance.reinforcementSuggestions || [])
        .map((topic) => {
          const line = formatTopicLineHe(topic.subject, topic.topic);
          return line ? c("recommended_to_reinforce", { line }) : null;
        })
        .filter(Boolean);
  const extension = isGuidanceV2
    ? []
    : (guidance.extensionSuggestions || [])
        .map((topic) => {
          const line = formatTopicLineHe(topic.subject, topic.topic);
          if (!line) return null;
          return c("strong_class_performance", {
            line,
            accuracy: formatPercent(topic.accuracy),
          });
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
        <TeacherPortalShell backHref="/teacher/dashboard" title={`${classReportTitle}: ${className}`}>
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
              if (!result.ok) alert(c("please_select_valid_dates"));
            }}
            className="mb-4"
          />
          <p className="text-white/60 text-sm mb-2">
            {c("active_students", { count: memberCount })}
          </p>

          {memberCount === 0 ? (
            <p className="text-amber-200 text-sm mb-6">
              {c("empty_class_hint")}
            </p>
          ) : null}

          <section className="rounded-xl border border-white/15 bg-black/30 p-5 mb-6">
            <h2 className="text-lg font-semibold mb-3">{c("class_summary")}</h2>
            {guidance.insufficientData && cohort.totalAnswers < 10 ? (
              <p className="text-white/70 text-sm">
                {c("insufficient_data")}
              </p>
            ) : (
              <>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <dt className="text-white/60">{c("total_practice_sessions")}</dt>
                    <dd>{cohort.totalSessions ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">{c("total_answers")}</dt>
                    <dd>{cohort.totalAnswers ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">{c("average_success_rate")}</dt>
                    <dd>{formatPercent(cohort.accuracy)}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">{c("students_with_data")}</dt>
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
            <h2 className="text-lg font-semibold mb-3">{c("class_performance_by_subject")}</h2>
            <SubjectSummaryCards subjects={report.subjects} showTopics />
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{c("topics_need_reinforcement")}</h2>
            {weaknessTopics.length ? (
              <ul className="text-sm text-white/80 space-y-2">
                {weaknessTopics.slice(0, 10).map((topic, i) => {
                  if (isGuidanceV2) {
                    if (topic.level === "subject" && topic.headlineHe) {
                      const action = actionTypeLabelHe(topic.recommendedActionType);
                      const actionSuffix = topic.actionHe
                        ? c("action_suffix", { action: topic.actionHe })
                        : action
                          ? c("action_suffix", { action })
                          : "";
                      return (
                        <li
                          key={topic.unitId || i}
                          className="rounded border border-white/10 px-3 py-2"
                        >
                          {c("topic_line_subject_level", {
                            headline: topic.headlineHe,
                            affected: topic.affectedStudentCount ?? 0,
                            memberCount,
                            accuracy: formatPercent(topic.cohortAccuracyPct),
                            actionSuffix,
                          })}
                        </li>
                      );
                    }
                    const subj = subjectLabel(topic.subject);
                    const headline = topic.subtopicLabelHe
                      ? `${topic.topicLabelHe} - ${topic.subtopicLabelHe}`
                      : topic.topicLabelHe;
                    const errPct =
                      topic.cohortAccuracyPct != null
                        ? formatPercent(100 - topic.cohortAccuracyPct)
                        : "-";
                    const action = actionTypeLabelHe(topic.recommendedActionType);
                    const actionSuffix = action ? c("action_suffix", { action }) : "";
                    const headlineText = subj ? `${subj} - ${headline}` : headline;
                    return (
                      <li
                        key={topic.unitId || i}
                        className="rounded border border-white/10 px-3 py-2"
                      >
                        {c("topic_line_v2", {
                          headline: headlineText,
                          affected: topic.affectedStudentCount ?? 0,
                          memberCount,
                          accuracy: formatPercent(topic.cohortAccuracyPct),
                          errPct,
                          actionSuffix,
                        })}
                      </li>
                    );
                  }
                  const line = formatTopicLineHe(topic.subject, topic.topic);
                  if (!line) return null;
                  const acc =
                    topic.answers > 0
                      ? formatPercent(((topic.wrong || 0) / topic.answers) * 100)
                      : "-";
                  const studentsSuffix = topic.studentCount
                    ? c("students_count_suffix", { count: topic.studentCount })
                    : "";
                  return (
                    <li key={i}>
                      {c("topic_line_legacy", { line, acc, studentsSuffix })}
                    </li>
                  );
                }).filter(Boolean)}
              </ul>
            ) : (
              <p className="text-white/60 text-sm">
                {showCalmWeakTopics
                  ? c("no_problematic_topics")
                  : CLASS_WEAK_TOPICS_FALLBACK_BANNER}
              </p>
            )}
          </section>

          {isGuidanceV2 && smallGroupClusters.length > 0 ? (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{c("suggested_support_groups")}</h2>
              <ul className="text-sm text-white/80 space-y-2">
                {smallGroupClusters
                  .filter((cluster) => cluster.topicLabelHe)
                  .map((cluster, i) => (
                  <li key={i} className="rounded border border-white/10 px-3 py-2">
                    {c("support_group_line", {
                      topic: cluster.topicLabelHe,
                      names: (cluster.studentNamesMasked || []).join(", "),
                      avgSuffix:
                        cluster.avgAccuracyPct != null
                          ? c("support_group_avg", {
                              accuracy: formatPercent(cluster.avgAccuracyPct),
                            })
                          : "",
                    })}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{c("students_need_monitoring")}</h2>
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
                      <span className="text-white/50 me-2 block sm:inline">
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
                      {c("view_report")}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : memberCount > 0 ? (
              <p className="text-white/60 text-sm">
                {c("all_students_on_track")}
              </p>
            ) : null}
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{c("suggested_work_groups")}</h2>
            {["struggling", "on_track", "advanced"].map((tier) => {
              const list = groups[tier] || [];
              if (!list.length) return null;
              return (
                <div key={tier} className="mb-2 text-sm">
                  <span className="font-semibold text-amber-200">
                    {c("work_group_header", {
                      tier: groupTierHe(tier),
                      count: list.length,
                    })}
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
                  ? c("not_enough_students_for_groups")
                  : c("not_enough_data_for_groups")}
              </p>
            ) : (
              <p className="text-xs text-white/50 mt-2">
                {c("groups_disclaimer")}
              </p>
            )}
          </section>

          {!isGuidanceV2 ? (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{c("focus_for_next_lesson")}</h2>
            {(guidance.nextLessonFocus || []).length ? (
              <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
                {guidance.nextLessonFocus
                  .map((f, i) => {
                    const line = formatTopicLineHe(f.subject, f.topic);
                    if (!line) return null;
                    return (
                      <li key={i}>
                        {f.affectedStudents
                          ? c("next_lesson_topic_line", {
                              line,
                              count: f.affectedStudents,
                            })
                          : line}
                      </li>
                    );
                  })
                  .filter(Boolean)}
              </ul>
            ) : (
              <p className="text-white/60 text-sm">
                {c("no_standout_topic")}
              </p>
            )}
          </section>
          ) : null}

          {!isGuidanceV2 ? (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{c("reinforcement_suggestions")}</h2>
            {reinforcement.length ? (
              <ul className="list-disc list-inside text-sm text-white/80">
                {reinforcement.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60 text-sm">{c("no_reinforcement_suggestions")}</p>
            )}
          </section>
          ) : null}

          {!isGuidanceV2 ? (
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{c("enrichment_suggestions")}</h2>
            {extension.length ? (
              <ul className="list-disc list-inside text-sm text-white/80">
                {extension.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-white/60 text-sm">{c("no_enrichment_suggestions")}</p>
            )}
          </section>
          ) : null}
        </TeacherPortalShell>
      </div>
    </Layout>
  );
}
