/**
 * School manager report view models — compact English summaries from teacher report payloads.
 */

import {
  schoolActivityModeHe,
  schoolActivityStatusHe,
  schoolSubjectLabelHe,
  sanitizeActivityTitleHe,
} from "./school-ui.js";
import { SCHOOL_SUBJECT_ORDER } from "./school-drilldown.js";
import {
  actionTypeLabelHe,
  canShowClassCalmWeakTopicsMessage,
  canShowStudentCalmFocusMessage,
  classGuidanceSeverityTierHe,
  classHealthHe,
  CLASS_WEAK_TOPICS_FALLBACK_BANNER,
  HUB_CLASS_WEAK_TOPICS_CALM_MESSAGE,
  HUB_STUDENT_FOCUS_CALM_MESSAGE,
  dedupeTeacherRecommendationItems,
  formatStudentSubjectFallbackEvidenceHe,
  formatTopicLineHe,
  formatTopicRecommendationLineHe,
  groupTierHe,
  attentionReasonHe,
  guidanceSeverityTierHe,
  resolveTopicLabelHe,
  STUDENT_FOCUS_CALM_MESSAGE,
  STUDENT_FOCUS_FALLBACK_BANNER,
  supportSuggestionHe,
} from "../teacher-portal/teacher-ui.js";
import {
  classOrCohortLearningStatusLabelHe,
  deriveStudentLearningStatusLabelHe,
} from "../teacher-portal/student-learning-status.js";

export { classOrCohortLearningStatusLabelHe, deriveStudentLearningStatusLabelHe };

const SCHOOL_REPORT_SUBJECTS = [...SCHOOL_SUBJECT_ORDER];

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatPercent(v) {
  if (v == null || !Number.isFinite(Number(v))) return "-";
  return `${Number(v).toFixed(0)}%`;
}

function formatDateHe(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "-";
  }
}

/** @param {{ title?: string|null, subject?: string|null }} a */
function classroomActivityTitleHe(a) {
  return sanitizeActivityTitleHe(a?.title, a?.subject);
}

/** @param {unknown} daily */
function lastDateFromDaily(daily) {
  if (!Array.isArray(daily) || daily.length === 0) return null;
  const sorted = [...daily].sort((a, b) =>
    String(b?.date || "").localeCompare(String(a?.date || ""))
  );
  return sorted[0]?.date || null;
}

function studentRowFromPayload(s, extraDetail) {
  const sum = s.summary || {};
  const answers = safeNum(sum.totalAnswers);
  const acc = sum.accuracy != null ? formatPercent(sum.accuracy) : null;
  const tier =
    s.guidanceSeverityTier ||
    s.teacherGuidance?.guidanceSeverityTier ||
    null;
  const learningStatusBadge = deriveStudentLearningStatusLabelHe(sum, tier);
  return {
    id: s.studentId,
    studentId: s.studentId,
    name: s.studentFullNameMasked || s.studentFullName || "Student",
    detail:
      extraDetail ||
      (answers > 0 ? `${answers} answers${acc ? ` · accuracy ${acc}` : ""}` : null),
    learningStatusBadge,
  };
}

function studentRowFromGroupItem(s) {
  const answers = safeNum(s.totalAnswers);
  const acc = s.accuracy != null ? formatPercent(s.accuracy) : null;
  const learningStatusBadge = deriveStudentLearningStatusLabelHe({
    totalAnswers: s.totalAnswers,
    totalSessions: s.totalSessions,
    accuracy: s.accuracy,
  });

  return {
    id: s.studentId,
    studentId: s.studentId,
    name: s.studentFullNameMasked || s.studentFullName || "Student",
    detail: answers > 0 ? `${answers} answers${acc ? ` · accuracy ${acc}` : ""}` : "No data in this period",
    learningStatusBadge,
  };
}

/**
 * @param {Array<Record<string, unknown>>} weaknessSource
 * @param {{ version?: string }} guidance
 * @param {Map<string, Record<string, unknown>>} rosterById
 * @param {(subject: string) => string|null|undefined} subjectLabelFn
 */
function buildFocusAreasFromWeaknessSource(weaknessSource, guidance, rosterById, subjectLabelFn) {
  const isV2 = guidance?.version === "v2";
  const candidates = [];

  for (const t of weaknessSource || []) {
    const subject = String(t.subject || "");
    const topicLabelHe =
      t.topicLabelHe || t.headlineHe || resolveTopicLabelHe(subject, t.topic) || null;
    if (!topicLabelHe) continue;

    const subjectHe = subjectLabelFn(subject);
    const headline =
      t.level === "subject"
        ? topicLabelHe
        : t.subtopicLabelHe
          ? `${topicLabelHe} - ${t.subtopicLabelHe}`
          : topicLabelHe;
    const line = subjectHe && t.level !== "subject" ? `${subjectHe} - ${headline}` : headline;

    const err =
      t.cohortAccuracyPct != null
        ? formatPercent(100 - t.cohortAccuracyPct)
        : safeNum(t.answers) > 0
          ? formatPercent((safeNum(t.wrong) / safeNum(t.answers)) * 100)
          : null;

    const drilldownKey = `${subject}::${normalizeTopicKeyForDrilldown(t.topic)}`;
    const affectedIds = Array.isArray(t.affectedStudentIds)
      ? t.affectedStudentIds
      : Array.isArray(t.studentIds)
        ? t.studentIds
        : [];

    candidates.push({
      subject,
      topic: t.topic,
      topicLabelHe,
      recommendedActionType: t.recommendedActionType || "",
      label: line,
      err,
      drilldownKey,
      affectedIds,
      studentCount: safeNum(t.affectedStudentCount ?? t.studentCount),
      isV2,
    });
  }

  const deduped = dedupeTeacherRecommendationItems(candidates);
  const focusDrilldowns = {};
  const focusAreas = deduped.map((t) => {
    const affectedStudents = (t.affectedIds || [])
      .map((sid) => rosterById.get(sid))
      .filter(Boolean)
      .map((s) => studentRowFromPayload(s));
    focusDrilldowns[t.drilldownKey] = {
      title: t.label,
      subtitle: t.err
        ? `Error rate ${t.err} · ${t.studentCount} children`
        : null,
      items: affectedStudents,
    };
    return {
      label: t.label,
      detail: t.err ? `Error rate ${t.err}` : null,
      count:
        affectedStudents.length > 0 ? affectedStudents.length : t.studentCount > 0 ? t.studentCount : null,
      drilldownKey: t.drilldownKey,
    };
  });

  return { focusAreas, focusDrilldowns };
}

/**
 * Merge reinforcement units from per-subject guidance blocks (physical class report).
 * Uses the same classRecommendationUnits source as subject-specific class reports.
 * @param {Array<{ subjectFocus?: string, classRecommendationUnits?: unknown[] }>} subjectGuidanceBlocks
 * @param {number} [maxTotal]
 */
export function mergeSubjectGuidanceReinforcementUnits(subjectGuidanceBlocks, maxTotal = 24) {
  const out = [];
  for (const block of subjectGuidanceBlocks || []) {
    const units = (block.classRecommendationUnits || []).filter(
      (u) => u && (u.topicLabelHe || u.headlineHe)
    );
    for (const u of units) {
      out.push({
        ...u,
        subject: u.subject || block.subjectFocus,
        topicLabelHe: u.topicLabelHe || u.headlineHe || null,
      });
      if (out.length >= maxTotal) return out;
    }
  }
  return out.slice(0, maxTotal);
}

/**
 * @param {Record<string, unknown>} guidance
 * @param {Record<string, unknown>} report
 * @param {number} focusItemCount
 */
function resolveClassFocusPreambleHe(guidance, report, focusItemCount) {
  if (focusItemCount === 0 || canShowClassCalmWeakTopicsMessage(guidance, report)) return null;
  const tier =
    guidance?.guidanceSeverityTier || guidance?.cohortStats?.guidanceSeverityTier;
  if (
    tier === "critical_class" ||
    tier === "class_needs_reinforcement" ||
    tier === "class_monitor"
  ) {
    return CLASS_WEAK_TOPICS_FALLBACK_BANNER;
  }
  const cohort = report?.cohortSummary || {};
  const acc = Number(cohort.accuracy);
  const totalAnswers = Number(cohort.totalAnswers);
  if (Number.isFinite(acc) && acc < 65 && totalAnswers >= 10) {
    return CLASS_WEAK_TOPICS_FALLBACK_BANNER;
  }
  return null;
}

function classFocusEmptyMessageHe(guidance, report) {
  if (canShowClassCalmWeakTopicsMessage(guidance, report)) {
    return HUB_CLASS_WEAK_TOPICS_CALM_MESSAGE;
  }
  return CLASS_WEAK_TOPICS_FALLBACK_BANNER;
}

function classFocusNavBadgeHe(focusItemCount, preamble) {
  if (focusItemCount > 0) return `${focusItemCount} topics`;
  if (preamble) return "Support recommended";
  return "None";
}

/**
 * @param {{ focusAreas: unknown[], guidance: Record<string, unknown>, report: Record<string, unknown> }} args
 */
function buildClassFocusSectionMeta({ focusAreas, guidance, report }) {
  const preamble = resolveClassFocusPreambleHe(guidance, report, focusAreas.length);
  return {
    title: "Topics to strengthen",
    preamble,
    empty: focusAreas.length > 0 ? null : classFocusEmptyMessageHe(guidance, report),
    items: focusAreas,
    navBadge: classFocusNavBadgeHe(focusAreas.length, preamble),
  };
}

function normalizeTopicKeyForDrilldown(topic) {
  const raw = String(topic || "general").trim() || "general";
  const i = raw.indexOf("::grade:");
  return i === -1 ? raw : raw.slice(0, i);
}

function studentRowFromAttention(s) {
  const reasons = Array.isArray(s.reasons)
    ? s.reasons.map((r) => attentionReasonHe(r)).filter(Boolean)
    : [];
  const reasonText = reasons.length ? reasons.join(" · ") : null;
  const answers = safeNum(s.totalAnswers);
  const learningStatusBadge = deriveStudentLearningStatusLabelHe({
    totalAnswers: s.totalAnswers,
    totalSessions: s.totalSessions,
    accuracy: s.accuracy,
  });
  return {
    id: s.studentId || s.studentFullNameMasked || s.studentFullName,
    studentId: s.studentId || null,
    name: s.studentFullNameMasked || s.studentFullName || "Student",
    detail:
      reasonText ||
      (answers > 0 ? `${answers} answers` : "Needs attention"),
    learningStatusBadge,
  };
}

function classInsightText(body) {
  const guidance = body?.teacherGuidanceBlock || {};
  const cohort = body?.cohortSummary || {};
  const totalAnswers = safeNum(cohort.totalAnswers);
  const studentsWithActivity = safeNum(cohort.studentsWithActivity);
  const tier = guidance?.guidanceSeverityTier || guidance?.cohortStats?.guidanceSeverityTier;
  const signal = guidance?.teacherSummary?.classHealthSignal;

  if (guidance.insufficientData || (totalAnswers < 10 && studentsWithActivity === 0)) {
    return "Not enough answers yet for an in-depth analysis. We recommend tracking class activities and student submissions.";
  }

  const base =
    (tier && classGuidanceSeverityTierHe(tier)) ||
    classHealthHe(signal) ||
    "Recent practice data is available";

  if (guidance.version === "v2" && (guidance.classRecommendationUnits || []).length > 0) {
    const top = guidance.classRecommendationUnits[0];
    if (top.headlineHe) {
      return `${base}. ${top.headlineHe} (${top.affectedStudentCount ?? 0} Children · ${formatPercent(top.cohortAccuracyPct)} Success).`;
    }
    if (top.topicLabelHe) {
      return `${base}. Main theme for reinforcement: ${top.topicLabelHe} (${top.affectedStudentCount} children · ${formatPercent(top.cohortAccuracyPct)} success).`;
    }
  }

  if (
    tier === "critical_class" ||
    tier === "class_needs_reinforcement" ||
    tier === "class_monitor"
  ) {
    return `${base}. Further follow-up in this profession and targeted reinforcement is required.`;
  }

  if (tier === "class_on_track" || signal === "strong") {
    return `${base}. The class shows good practice data in recent times.`;
  }

  if (totalAnswers > 0) {
    return "The class is active and there is recent practice data.";
  }
  return "Not enough data has been collected yet - it is recommended to open class activities.";
}

function studentInsightText(body) {
  const guidance = body?.teacherGuidanceBlock || {};
  const summary = body?.summary || {};
  const totalAnswers = safeNum(summary.totalAnswers);

  if (guidance.insufficientData || totalAnswers < 5) {
    return "There is not yet enough data for an in-depth analysis. It is recommended to encourage practice and follow activities.";
  }

  if (guidance.version === "v2" && (guidance.recommendationUnits || []).length > 0) {
    const u = guidance.recommendationUnits[0];
    const ev = u.evidenceSummary || {};
    if (u.headlineHe) {
      const action = actionTypeLabelHe(u.recommendedActionType);
      const parts = [
        `${u.headlineHe} (${formatPercent(ev.accuracyPct)} success · ${ev.wrongCount ?? 0} mistakes)`,
      ];
      if (action) parts.push(action);
      return `${parts.join(" · ")}.`;
    }
    if (u.topicLabelHe) {
      const action = actionTypeLabelHe(u.recommendedActionType);
      const parts = [
        `Monitoring in ${u.topicLabelHe} is recommended (${formatPercent(ev.accuracyPct)} success · ${ev.wrongCount ?? 0} mistakes)`,
      ];
      if (action) parts.push(action);
      return `${parts.join(" · ")}.`;
    }
  }

  const tier = guidance?.guidanceSeverityTier;
  if (tier === "critical" || tier === "needs_reinforcement") {
    const tierHe = guidanceSeverityTierHe(tier);
    if (tierHe && summary.accuracy != null) {
      return `${tierHe}. General accuracy ${formatPercent(summary.accuracy)} in recent times.`;
    }
  }

  const strengths = guidance.strengthsForTeacher || [];
  const support = guidance.supportSuggestions || [];
  const parts = [];

  if (strengths.length) {
    const s = strengths[0];
    const subj = schoolSubjectLabelHe(s.subject);
    if (subj && s.accuracy != null) {
      parts.push(`Relative strength in ${subj} (${formatPercent(s.accuracy)}).`);
    }
  }

  if (guidance.version !== "v2") {
    const weak = (guidance.nextPracticeFocus || [])[0];
    if (weak) {
      const line = formatTopicRecommendationLineHe(weak.subject, weak.topic);
      if (line) parts.push(`Follow-up on ${line} is recommended.`);
    } else if (support.length) {
      parts.push("It is recommended to support guided practice and track progress.");
    }
  } else if (summary.accuracy != null) {
    parts.push(`General accuracy ${formatPercent(summary.accuracy)} in recent times.`);
  }

  return parts.length ? parts.join(" ") : "There are learning data - it is recommended to continue regular monitoring.";
}

/**
 * @param {unknown} body
 * @param {{ name?: string|null, gradeLevel?: string|null, subjectFocus?: string|null, teacherName?: string|null, memberCount?: number, activityCount?: number, classId?: string }} cls
 * @param {{ recentClassroomActivities?: unknown[], classroomActivityCount?: number }} [extras]
 */
export function parseClassReportViewModel(body, cls, extras = {}) {
  const cohort = body?.cohortSummary || {};
  const roster = body?.roster || {};
  const guidance = body?.teacherGuidanceBlock || {};
  const studentCount = safeNum(roster.activeMemberCount ?? roster.studentCount ?? cls.memberCount);
  const activityCount = safeNum(extras.classroomActivityCount ?? cls.activityCount);
  const totalAnswers = safeNum(cohort.totalAnswers);
  const lastDaily = lastDateFromDaily(body?.recentActivity?.daily);
  const hasCohortData =
    totalAnswers > 0 &&
    cohort.accuracy != null &&
    Number.isFinite(Number(cohort.accuracy));

  const classStatusLabel = classOrCohortLearningStatusLabelHe(
    hasCohortData
      ? guidance.guidanceSeverityTier || guidance.cohortStats?.guidanceSeverityTier
      : null,
    hasCohortData ? cohort.accuracy : null
  );

  const header = {
    title: cls.name || body?.class?.name || "Class report",
    subtitle: [
      schoolSubjectLabelHe(cls.subjectFocus || body?.class?.subjectFocus),
      cls.teacherName ? `Teacher: ${cls.teacherName}` : null,
      cls.gradeLevel ? `Grade ${cls.gradeLevel}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    chips: [
      { label: "Students", value: String(studentCount) },
      { label: "Activities", value: String(activityCount) },
      classStatusLabel ? { label: "Class status", value: classStatusLabel } : null,
    ].filter(Boolean),
  };

  const summaryCards = [
    { label: "Students in class", value: String(studentCount) },
    { label: "Answers / submissions", value: String(totalAnswers) },
    { label: "Average accuracy", value: formatPercent(cohort.accuracy) },
    { label: "Students with activity", value: String(safeNum(cohort.studentsWithActivity)) },
    { label: "Class activities", value: String(activityCount) },
    { label: "Last activity", value: formatDateHe(lastDaily) },
  ];

  const classroomActs = (extras.recentClassroomActivities || []).map((a) => ({
    id: a.id,
    title: classroomActivityTitleHe(a),
    subject: schoolSubjectLabelHe(a.subject),
    mode: schoolActivityModeHe(a.mode),
    status: schoolActivityStatusHe(a.status),
    date: formatDateHe(a.activated_at || a.created_at),
    meta: schoolActivityModeHe(a.mode) || null,
  }));

  const dailyActs = (body?.recentActivity?.daily || [])
    .slice(-5)
    .reverse()
    .map((d, i) => ({
      id: `daily-${d.date || i}`,
      title: `Daily practice`,
      subject: schoolSubjectLabelHe(cls.subjectFocus),
      mode: "Practice",
      status: safeNum(d.answers) > 0 ? "Active" : "No data",
      date: formatDateHe(d.date),
      meta: `${safeNum(d.answers)} answers`,
    }));

  const activityItems = classroomActs.length ? classroomActs : dailyActs;

  const groups = guidance.suggestedGroups || {};
  const rosterStudentsRaw = body?.students || [];
  const rosterStudents = rosterStudentsRaw.map((s) => studentRowFromPayload(s));
  const activeStudents = rosterStudentsRaw
    .filter((s) => safeNum(s.summary?.totalAnswers) > 0)
    .map((s) => studentRowFromPayload(s));
  const inactiveStudents = rosterStudentsRaw
    .filter((s) => safeNum(s.summary?.totalAnswers) === 0)
    .map((s) => studentRowFromPayload(s, "No data in this period"));

  const distributionDrilldowns = {
    struggling: {
      title: groupTierHe("struggling") || "Support group",
      items: (groups.struggling || []).map((s) => studentRowFromGroupItem(s)),
    },
    on_track: {
      title: groupTierHe("on_track") || "Support group",
      items: (groups.on_track || []).map((s) => studentRowFromGroupItem(s)),
    },
    advanced: {
      title: groupTierHe("advanced") || "Advance group",
      items: (groups.advanced || []).map((s) => studentRowFromGroupItem(s)),
    },
    active: {
      title: "Submitted / active",
      items: activeStudents,
    },
    inactive: {
      title: "No data in period",
      items: inactiveStudents,
    },
  };

  const weaknessSource =
    guidance.version === "v2"
      ? guidance.classRecommendationUnits || []
      : body?.weaknessTopics || guidance.priorityTopics || [];
  const rosterById = new Map(rosterStudentsRaw.map((s) => [s.studentId, s]));
  const { focusAreas, focusDrilldowns } = buildFocusAreasFromWeaknessSource(
    weaknessSource.slice(0, 8),
    guidance,
    rosterById,
    schoolSubjectLabelHe
  );
  const focusSection = buildClassFocusSectionMeta({ focusAreas, guidance, report: body });

  const distribution = [
    { tier: groupTierHe("struggling") || "Support group", count: (groups.struggling || []).length, drilldownKey: "struggling" },
    { tier: groupTierHe("on_track") || "Support group", count: (groups.on_track || []).length, drilldownKey: "on_track" },
    { tier: groupTierHe("advanced") || "Advance group", count: (groups.advanced || []).length, drilldownKey: "advanced" },
  ];

  const submitted = safeNum(cohort.studentsWithActivity);
  const notSubmitted = Math.max(0, studentCount - submitted);
  if (studentCount > 0) {
    distribution.unshift(
      { tier: "Submitted / active", count: submitted, drilldownKey: "active" },
      { tier: "No data in period", count: notSubmitted, drilldownKey: "inactive" }
    );
  }

  const attentionStudents = (guidance.attentionStudents || body?.attentionList || [])
    .slice(0, 12)
    .map((s) => ({
      ...studentRowFromAttention(s),
      actions: s.studentId ? [studentReportActionMeta(s.studentId)] : [],
    }));

  const navigation = [
    {
      id: "activities",
      label: "Class activities",
      badge: activityItems.length ? `${activityItems.length} activities` : "No activities",
    },
    {
      id: "students",
      label: "Students in class",
      badge: rosterStudents.length ? `${rosterStudents.length} children` : "No children",
    },
    {
      id: "focus",
      label: "Topics to strengthen",
      badge: focusSection.navBadge,
    },
    {
      id: "attention",
      label: "Students who need attention",
      badge: attentionStudents.length ? `${attentionStudents.length} children` : "None",
    },
    {
      id: "distribution",
      label: "Student distribution",
      badge: distribution.some((d) => d.count > 0) ? "Details" : "No data",
    },
  ];

  return {
    kind: "class",
    header,
    summaryCards,
    insight: classInsightText(body),
    navigation,
    sections: {
      activities: {
        title: "Class activities",
        empty: "No class activities to show for this period.",
        items: activityItems,
      },
      students: {
        title: "Students in class",
        empty: "No children are registered in this class.",
        items: rosterStudents.map((s) => ({
          ...s,
          actions: s.studentId ? [studentReportActionMeta(s.studentId)] : [],
        })),
      },
      distribution: {
        title: "Student distribution",
        empty: "Not enough data for a distribution breakdown.",
        items: distribution.filter((d) => d.count > 0),
      },
      focus: focusSection,
      attention: {
        title: "Students who need attention",
        empty: "No children have been flagged for attention.",
        items: attentionStudents,
      },
    },
    drilldowns: {
      distribution: distributionDrilldowns,
      focus: focusDrilldowns,
    },
    actions: [],
  };
}

/**
 * @param {unknown} body
 * @param {{ displayName?: string|null, physicalClassName?: string|null, gradeLevel?: string|null, studentId?: string }} student
 * @param {{ schoolName?: string|null, subjectFocus?: string|null }} [ctx]
 */
export function parseStudentReportViewModel(body, student, ctx = {}) {
  const summary = body?.summary || {};
  const guidance = body?.teacherGuidanceBlock || {};
  const totalAnswers = safeNum(summary.totalAnswers);
  const lastDate = lastDateFromDaily(body?.dailyActivity);

  const header = {
    title:
      student.displayName ||
      body?.student?.full_name ||
      body?.student?.fullName ||
      "Student",
    subtitle: [
      student.physicalClassName || null,
      student.gradeLevel ? `Grade ${student.gradeLevel}` : null,
      ctx.schoolName || null,
      ctx.subjectFocus ? schoolSubjectLabelHe(ctx.subjectFocus) : null,
    ]
      .filter(Boolean)
      .join(" · "),
    chips: [],
  };

  const summaryCards = [
    { label: "Answers / submissions", value: String(totalAnswers) },
    { label: "Accuracy", value: formatPercent(summary.accuracy) },
    { label: "Practice sessions", value: String(safeNum(summary.totalSessions)) },
    { label: "Last activity", value: formatDateHe(lastDate) },
    {
      label: "Learning status",
      value:
        totalAnswers === 0 || safeNum(summary.accuracy) == null
          ? "Not enough data"
          : safeNum(summary.accuracy) >= 90
            ? "Strong"
            : safeNum(summary.accuracy) >= 75
              ? "On track"
              : safeNum(summary.accuracy) >= 65
                ? "Watching"
                : safeNum(summary.accuracy) >= 50
                  ? "Needs support"
                  : "Needs intervention",
    },
  ];

  const subjectsMap = body?.subjects && typeof body.subjects === "object" ? body.subjects : {};
  const subjectRows = SCHOOL_REPORT_SUBJECTS.map((sid) => {
    const subj = subjectsMap[sid];
    const answers = safeNum(subj?.answers);
    const sessions = safeNum(subj?.sessions);
    if (!answers && !sessions) {
      return { subject: schoolSubjectLabelHe(sid), status: "No data yet", detail: null };
    }
    return {
      subject: schoolSubjectLabelHe(sid),
      status: answers > 0 ? formatPercent(subj.accuracy) : `${sessions} sessions`,
      detail: `${answers} answers`,
    };
  });

  const recentFromDaily = (body?.dailyActivity || [])
    .slice(-6)
    .reverse()
    .map((d, i) => ({
      id: `d-${d.date || i}`,
      title: "Practice day",
      subject: "-",
      mode: "Practice",
      status: safeNum(d.answers) > 0 ? "Active" : "No data",
      date: formatDateHe(d.date),
      meta: `${safeNum(d.sessions)} sessions · ${safeNum(d.answers)} answers`,
    }));

  const recentFromMistakes = (body?.recentMistakes || []).slice(0, 5).map((m, i) => ({
    id: `m-${i}`,
    title: formatTopicRecommendationLineHe(m.subject, m.topic) || "Practice mistake",
    subject: schoolSubjectLabelHe(m.subject),
    mode: "Practice",
    status: "Mistake",
    date: formatDateHe(m.answeredAt || m.date),
    meta: m.topic ? null : null,
  }));

  const recentItems = recentFromDaily.length ? recentFromDaily : recentFromMistakes;

  const focusItems =
    guidance.version === "v2"
      ? dedupeTeacherRecommendationItems(guidance.recommendationUnits || [])
          .filter((u) => u.topicLabelHe || u.headlineHe)
          .slice(0, 6)
          .map((u) => {
            if (u.level === "subject" && u.headlineHe) {
              const ev = u.evidenceSummary || {};
              return {
                label: u.headlineHe,
                detail: formatStudentSubjectFallbackEvidenceHe(
                  ev.accuracyPct,
                  ev.totalAnswers
                ),
              };
            }
            const subj = schoolSubjectLabelHe(u.subject);
            const headline = u.subtopicLabelHe
              ? `${u.topicLabelHe} - ${u.subtopicLabelHe}`
              : u.topicLabelHe;
            const ev = u.evidenceSummary || {};
            return {
              label: subj ? `${subj} - ${headline}` : headline,
              detail: `${ev.wrongCount ?? 0} mistakes out of ${ev.totalAnswers ?? 0} · ${formatPercent(ev.accuracyPct)}`,
            };
          })
      : (guidance.nextPracticeFocus || [])
          .map((t) => {
            const label = formatTopicRecommendationLineHe(t.subject, t.topic);
            if (!label) return null;
            return {
              label,
              detail: t.accuracy != null ? `Accuracy ${formatPercent(t.accuracy)}` : null,
            };
          })
          .filter(Boolean)
          .slice(0, 6);

  const recommendationItems =
    guidance.version === "v2"
      ? dedupeTeacherRecommendationItems(guidance.supportSuggestionsV2 || [])
          .filter((s) => s.topicLabelHe)
          .slice(0, 5)
          .map((s) => {
            const action = actionTypeLabelHe(s.code);
            return {
              label: action ? `${action} in ${s.topicLabelHe}` : s.topicLabelHe,
              detail: null,
            };
          })
      : (guidance.supportSuggestions || [])
          .slice(0, 5)
          .map((s, i) => {
            const code = typeof s === "string" ? s : s.label || s.code || "";
            const label =
              supportSuggestionHe(code) ||
              (typeof s === "object" ? s.label : null) ||
              `Recommendation ${i + 1}`;
            if (!label || label === "Keep monitoring progress") return null;
            return {
              label,
              detail: typeof s === "object" ? s.detail || null : null,
            };
          })
          .filter(Boolean);

  const navigation = [
    {
      id: "subjects",
      label: "Breakdown by subject",
      badge: subjectRows.some((r) => r.status !== "No data yet") ? "Has data" : "No data",
    },
    {
      id: "activities",
      label: "Recent activities",
      badge: recentItems.length ? `${recentItems.length} records` : "No activity",
    },
    {
      id: "focus",
      label: "Topics to strengthen",
      badge: focusItems.length ? `${focusItems.length} topics` : "None",
    },
    {
      id: "recommendations",
      label: "Follow-up recommendations",
      badge: recommendationItems.length ? `${recommendationItems.length} recommendations` : "None",
    },
  ];

  return {
    kind: "student",
    meta: {
      studentId: student.studentId || body?.student?.id || null,
      displayName: student.displayName || body?.student?.full_name || null,
    },
    header,
    summaryCards,
    insight: studentInsightText(body),
    navigation,
    sections: {
      subjects: {
        title: "Breakdown by subject",
        empty: "No data by subject.",
        items: subjectRows.map((r) => ({
          label: r.subject,
          status: r.status,
          detail: r.detail,
        })),
      },
      activities: {
        title: "Recent activities",
        empty: "No learning activity recently.",
        items: recentItems,
      },
      focus: {
        title: "Topics to strengthen",
        empty: canShowStudentCalmFocusMessage(guidance, body)
          ? HUB_STUDENT_FOCUS_CALM_MESSAGE
          : STUDENT_FOCUS_FALLBACK_BANNER,
        items: focusItems,
      },
      recommendations: {
        title: "Follow-up recommendations",
        empty: "No further recommendations at this time.",
        items: recommendationItems,
      },
    },
    actions: [],
  };
}

function physicalClassInsightText(body) {
  const cohort = body?.cohortSummary || {};
  const totalAnswers = safeNum(cohort.totalAnswers);
  const studentsWithActivity = safeNum(cohort.studentsWithActivity);
  const studentCount = safeNum(body?.rosterSummary?.studentCount ?? body?.roster?.length);
  const tier = body?.physicalClassGuidanceSeverityTier;
  const blocks = Array.isArray(body?.subjectGuidanceBlocks) ? body.subjectGuidanceBlocks : [];

  if (totalAnswers < 10 && studentsWithActivity === 0) {
    return "Not enough data yet for an in-depth analysis across all subjects. We recommend tracking class activities and student submissions.";
  }

  if (tier && blocks.length) {
    const tierHe = classGuidanceSeverityTierHe(tier);
    const worst = blocks[0];
    const worstUnit = worst?.classRecommendationUnits?.[0];
    const subjHe =
      worst?.subjectLabelHe || schoolSubjectLabelHe(worst?.subjectFocus || "");
    if (tierHe && worstUnit?.headlineHe) {
      return `${tierHe} · ${subjHe}: ${worstUnit.headlineHe}`;
    }
    if (tierHe) return tierHe;
  }

  if (totalAnswers > 0) {
    return `General class summary across all subjects: ${studentsWithActivity} out of ${studentCount} children with activity, ${totalAnswers} answers/submissions.`;
  }
  return "Not enough data has been collected yet - we recommend launching class activities.";
}

function subjectReportAction(classId) {
  return { id: "subject_report", label: "Subject report", classId };
}

function teacherCardAction(teacherId, teacherName) {
  return { id: "teacher_card", label: "Teacher card", teacherId, teacherName };
}

function studentReportActionMeta(studentId) {
  return { id: "student_report", label: "Student report", studentId };
}

/**
 * @param {unknown} body
 * @param {{ schoolName?: string|null, gradeLevel?: string|null, physicalClassName?: string|null }} [ctx]
 */
export function parsePhysicalClassReportViewModel(body, ctx = {}) {
  const cohort = body?.cohortSummary || {};
  const rosterSummary = body?.rosterSummary || {};
  const studentCount = safeNum(rosterSummary.studentCount ?? body?.roster?.length);
  const subjectBreakdown = Array.isArray(body?.subjectBreakdown) ? body.subjectBreakdown : [];
  const totalAnswers = safeNum(cohort.totalAnswers);
  const lastDaily = lastDateFromDaily(body?.recentActivity?.daily);
  const physName = body?.physicalClass?.name || ctx.physicalClassName || "Class";
  const gradeLevel = body?.physicalClass?.gradeLevel || ctx.gradeLevel || "";
  const hasCohortData =
    totalAnswers > 0 &&
    cohort.accuracy != null &&
    Number.isFinite(Number(cohort.accuracy));

  const physicalStatusLabel = classOrCohortLearningStatusLabelHe(
    hasCohortData ? body?.physicalClassGuidanceSeverityTier : null,
    hasCohortData ? cohort.accuracy : null
  );

  const header = {
    title: physName,
    subtitle: "General class report · all subjects",
    chips: [
      ctx.schoolName ? { label: "School", value: ctx.schoolName } : null,
      gradeLevel ? { label: "Grade", value: gradeLevel } : null,
      { label: "Students", value: String(studentCount) },
      { label: "Subjects", value: String(subjectBreakdown.length) },
      physicalStatusLabel ? { label: "Class status", value: physicalStatusLabel } : null,
    ].filter(Boolean),
  };

  const summaryCards = [
    { label: "Students", value: String(studentCount) },
    { label: "Answers", value: String(totalAnswers) },
    { label: "Accuracy", value: formatPercent(cohort.accuracy) },
    { label: "Active", value: String(safeNum(cohort.studentsWithActivity)) },
    { label: "Last activity", value: formatDateHe(lastDaily) },
  ];

  const subjectItems = subjectBreakdown.map((row) => {
    const acc = row.accuracy != null ? formatPercent(row.accuracy) : null;
    return {
      id: row.classId,
      classId: row.classId,
      teacherId: row.teacherId,
      label: row.subjectLabelHe || schoolSubjectLabelHe(row.subjectFocus),
      detail: [
        row.teacherName ? `Teacher: ${row.teacherName}` : null,
        `${safeNum(row.memberCount)} children`,
        `${safeNum(row.activityCount)} activities`,
        row.totalAnswers ? `${safeNum(row.totalAnswers)} answers` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      status: acc,
      actions: [
        subjectReportAction(row.classId),
        row.teacherId ? teacherCardAction(row.teacherId, row.teacherName) : null,
      ].filter(Boolean),
    };
  });

  const recentActivities = Array.isArray(body?.recentActivities) ? body.recentActivities : [];
  const activityItems = recentActivities.map((a) => ({
    id: a.activityId,
    classId: a.classId,
    title: sanitizeActivityTitleHe(a.title, a.subjectFocus || a.subject),
    subject: a.subjectLabelHe || schoolSubjectLabelHe(a.subjectFocus || a.subject),
    teacherName: a.teacherName,
    mode: schoolActivityModeHe(a.mode),
    status: schoolActivityStatusHe(a.status),
    date: formatDateHe(a.activatedAt || a.createdAt),
    meta: [
      a.teacherName ? `Teacher: ${a.teacherName}` : null,
      safeNum(a.submittedCount) > 0 ? `${safeNum(a.submittedCount)} submitted` : null,
      a.accuracy != null ? `Accuracy ${formatPercent(a.accuracy)}` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    actions: a.classId ? [subjectReportAction(a.classId)] : [],
  }));

  const rosterStudentsRaw = body?.students || [];
  const rosterStudents = rosterStudentsRaw.map((s) => studentRowFromPayload(s));

  const rosterById = new Map(rosterStudentsRaw.map((s) => [s.studentId, s]));
  const isPhysicalV2 =
    body?.reportMeta?.version === "v2" &&
    Array.isArray(body?.subjectGuidanceBlocks) &&
    body.subjectGuidanceBlocks.length > 0;
  const mergedSubjectUnits = isPhysicalV2
    ? mergeSubjectGuidanceReinforcementUnits(body.subjectGuidanceBlocks, 24)
    : [];
  const physicalGuidance = isPhysicalV2
    ? {
        version: "v2",
        guidanceSeverityTier: body.physicalClassGuidanceSeverityTier,
        classRecommendationUnits: mergedSubjectUnits,
      }
    : { version: "v1" };
  const physicalWeaknessSource =
    mergedSubjectUnits.length > 0
      ? mergedSubjectUnits
      : (body?.weaknessTopics || []).slice(0, 12);
  const { focusAreas, focusDrilldowns } = buildFocusAreasFromWeaknessSource(
    physicalWeaknessSource,
    physicalGuidance,
    rosterById,
    schoolSubjectLabelHe
  );
  const focusSection = buildClassFocusSectionMeta({
    focusAreas,
    guidance: physicalGuidance,
    report: body,
  });
  for (const key of Object.keys(focusDrilldowns)) {
    focusDrilldowns[key].items = (focusDrilldowns[key].items || []).map((s) => ({
      ...s,
      actions: s.studentId ? [studentReportActionMeta(s.studentId)] : [],
    }));
  }

  const attentionStudents = (body?.attentionList || []).slice(0, 15).map((s) => {
    const reasons = Array.isArray(s.reasons)
      ? s.reasons.map((r) => attentionReasonHe(r)).filter(Boolean)
      : [];
    const reasonText = reasons.length ? reasons.join(" · ") : null;
    const actions = [studentReportActionMeta(s.studentId)];

    const learningStatusBadge = deriveStudentLearningStatusLabelHe({
      totalAnswers: s.totalAnswers,
      totalSessions: s.totalSessions,
      accuracy: s.accuracy,
    });

    return {
      id: s.studentId,
      studentId: s.studentId,
      name: s.studentFullNameMasked || s.studentFullName || "Student",
      detail: reasonText || "Needs attention",
      subjects: ["All subjects"],
      learningStatusBadge,
      actions,
    };
  });

  const navigation = [
    {
      id: "subjects",
      label: "Breakdown by subject",
      badge: subjectItems.length ? `${subjectItems.length} subjects` : "None",
    },
    {
      id: "activities",
      label: "Recent activities",
      badge: activityItems.length ? `${activityItems.length} activities` : "None",
    },
    {
      id: "students",
      label: "Students in class",
      badge: rosterStudents.length ? `${rosterStudents.length} children` : "None",
    },
    {
      id: "focus",
      label: "Topics to strengthen",
      badge: focusSection.navBadge,
    },
    {
      id: "attention",
      label: "Students who need attention",
      badge: attentionStudents.length ? `${attentionStudents.length} children` : "None",
    },
  ];

  return {
    kind: "physical_class",
    header,
    summaryCards,
    insight: physicalClassInsightText(body),
    navigation,
    sections: {
      subjects: {
        title: "Breakdown by subject",
        empty: "No subjects to display.",
        items: subjectItems,
      },
      activities: {
        title: "Recent activities",
        empty: "No class activities to show for this period.",
        items: activityItems,
      },
      students: {
        title: "Students in class",
        empty: "No children are registered in this class.",
        items: rosterStudents.map((s) => ({
          ...s,
          actions: s.studentId ? [studentReportActionMeta(s.studentId)] : [],
        })),
      },
      focus: focusSection,
      attention: {
        title: "Students who need attention",
        empty: "No children have been flagged for attention.",
        items: attentionStudents,
      },
    },
    drilldowns: {
      focus: focusDrilldowns,
    },
    actions: [],
  };
}
