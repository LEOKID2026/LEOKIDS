import {
  isIncludedAnalyticsParentProfile,
  isIncludedAnalyticsStudent,
} from "./admin-analytics-production-filter.server.js";
import { normalizeUserEmail } from "./admin-user-delete.server.js";
import { buildPublicWorksheetVisitAnalytics } from "../analytics/public-worksheet-analytics.server.js";
import { PUBLIC_WORKSHEET_ANALYTICS_EVENTS } from "../analytics/public-worksheet-analytics.constants.js";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Cap rows scanned per table per admin analytics request (short-term launch guard). */
const MAX_ROWS_PER_SOURCE = 12000;
/** All-time sessions sample for first-session join metrics (bounded). */
const MAX_ALL_TIME_SESSION_ROWS = 12000;
const ADMIN_ANALYTICS_CACHE_TTL_MS = 90_000;

/** @type {Map<string, { expiresAt: number, payload: unknown }>} */
const adminAnalyticsResponseCache = new Map();

const SUBJECT_LABELS = {
  math: "Math",
  geometry: "Geometry",
  english: "English",

  science: "Science",

  geography: "Geography",
};

const NOT_TRACKED = "Not tracked yet";
const REQUIRES_EVENTS = "Requires event collection";

function isoDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function parseIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || isoDateOnly(date) !== value) return null;
  return date;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

function startOfUtcToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function resolveAdminAnalyticsRange(query = {}) {
  const preset = String(query.preset || "last30").trim();
  const today = startOfUtcToday();
  let from = addDays(today, -29);
  let to = today;
  let label = "Last 30 days";

  if (preset === "today") {
    from = today;
    to = today;
    label = "Today";
  } else if (preset === "last7") {
    from = addDays(today, -6);
    to = today;
    label = "Last 7 days";
  } else if (preset === "currentMonth") {
    from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    to = today;
    label = "Current month";
  } else if (preset === "custom") {
    const customFrom = parseIsoDate(String(query.from || ""));
    const customTo = parseIsoDate(String(query.to || ""));
    if (!customFrom || !customTo || customFrom.getTime() > customTo.getTime()) {
      return { ok: false, status: 400, code: "invalid_date_range" };
    }
    from = customFrom;
    to = customTo;
    label = `${isoDateOnly(from)} to ${isoDateOnly(to)}`;
  }

  return {
    ok: true,
    preset,
    fromDate: from,
    toDate: to,
    fromIso: from.toISOString(),
    toIsoExclusive: addDays(to, 1).toISOString(),
    fromDateOnly: isoDateOnly(from),
    toDateOnly: isoDateOnly(to),
    label,
  };
}

function safeNum(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function round(value, digits = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Number(n.toFixed(digits));
}

function metric(label, value, source, options = {}) {
  return {
    label,
    displayLabel: options.displayLabel || label,
    value,
    status: options.status || "available",
    source,
    unit: options.unit || null,
    note: options.note || null,
    dataReadiness: options.dataReadiness || options.status || "available",
    minimumRequirement: options.minimumRequirement || null,
  };
}

function notTracked(label, source = "analytics_events") {
  return metric(label, null, source, { status: "requires_events", note: REQUIRES_EVENTS, dataReadiness: "requires_events" });
}

function requiresEvents(label) {
  return metric(label, null, "analytics_events", { status: "requires_events", note: REQUIRES_EVENTS, dataReadiness: "requires_events" });
}

function unavailable(label, source, error) {
  return metric(label, null, source, {
    status: "unavailable",
    note: error?.message || "Data source unavailable",
  });
}

function partialMetric(label, value, source, note) {
  return metric(label, value, source, { status: "partial", note });
}

function emptyMetric(label, source, note = "No data yet") {
  return metric(label, null, source, {
    status: "empty",
    note,
    dataReadiness: "empty",
  });
}

function notEnoughMetric(label, source, minimumRequirement) {
  return metric(label, null, source, {
    status: "not_enough_data",
    note: "Not enough data yet",
    dataReadiness: "not_enough_data",
    minimumRequirement,
  });
}

function isMissingSourceError(error) {
  const text = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`.toLowerCase();
  return (
    text.includes("does not exist") ||
    text.includes("schema cache") ||
    text.includes("could not find") ||
    text.includes("relation") ||
    (text.includes("column") && text.includes("not found"))
  );
}

async function fetchAll(serviceRole, table, select, buildQuery, options = {}) {
  const pageSize = options.pageSize || 1000;
  const maxRows = options.maxRows || MAX_ROWS_PER_SOURCE;
  let rows = [];

  for (let from = 0; from < maxRows; from += pageSize) {
    let query = serviceRole.from(table).select(select);
    query = buildQuery ? buildQuery(query) : query;
    const { data, error } = await query.range(from, from + pageSize - 1);
    if (error) return { ok: false, rows: [], error, missing: isMissingSourceError(error) };
    const chunk = data || [];
    rows = rows.concat(chunk);
    if (chunk.length < pageSize) {
      return { ok: true, rows, partial: false };
    }
  }

  return {
    ok: true,
    rows,
    partial: true,
      note: `Returned only the first ${maxRows} rows on the server`,
  };
}

async function fetchAuthUsers(serviceRole) {
  try {
    const users = [];
    for (let page = 1; page <= 50; page += 1) {
      const { data, error } = await serviceRole.auth.admin.listUsers({ page, perPage: 200 });
      if (error) return { ok: false, rows: [], error };
      const chunk = data?.users || [];
      users.push(...chunk);
      if (!chunk.length || chunk.length < 200) break;
    }
    return { ok: true, rows: users };
  } catch (error) {
    return { ok: false, rows: [], error };
  }
}

function filterByStudent(rows, allowedStudentIds) {
  if (!allowedStudentIds) return rows;
  return rows.filter((row) => allowedStudentIds.has(row.student_id));
}

function dateKey(value) {
  if (!value) return "unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "unknown";
  return isoDateOnly(d);
}

function normalizeSubject(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "unknown";
  return raw;
}

function subjectLabel(subject) {
  const key = normalizeSubject(subject);
  return SUBJECT_LABELS[key] || key || "Unknown";
}

function normalizeGrade(value) {
  const raw = String(value || "").trim();
  return raw || "unknown";
}

function extractAnswerSubject(answer) {
  return normalizeSubject(answer?.answer_payload?.subject);
}

function extractAnswerTopic(answer) {
  return String(answer?.answer_payload?.topic || "unknown").trim() || "unknown";
}

function extractAnswerGrade(answer, studentById) {
  const payload = answer?.answer_payload || {};
  return normalizeGrade(
    payload.contentGradeLevel ||
      payload.gradeLevel ||
      payload.registeredGradeLevel ||
      studentById.get(answer.student_id)?.grade_level
  );
}

function increment(map, key, by = 1) {
  map.set(key, (map.get(key) || 0) + by);
}

function topEntries(map, limit = 10) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, label: key, value }));
}

function rate(numerator, denominator) {
  if (!denominator) return null;
  return round((numerator / denominator) * 100, 1);
}

function sum(rows, pick) {
  return rows.reduce((total, row) => total + safeNum(pick(row)), 0);
}

function countDistinct(rows, pick) {
  const set = new Set();
  for (const row of rows) {
    const value = pick(row);
    if (value) set.add(value);
  }
  return set.size;
}

function buildDailySeries(sessions, answers) {
  const days = new Map();
  for (const session of sessions) {
    const key = dateKey(session.started_at || session.created_at);
    if (!days.has(key)) {
      days.set(key, { date: key, sessions: 0, minutes: 0, questions: 0, correct: 0, accuracy: null });
    }
    const row = days.get(key);
    row.sessions += 1;
    row.minutes += safeNum(session.duration_seconds) / 60;
  }
  for (const answer of answers) {
    const key = dateKey(answer.answered_at || answer.created_at);
    if (!days.has(key)) {
      days.set(key, { date: key, sessions: 0, minutes: 0, questions: 0, correct: 0, accuracy: null });
    }
    const row = days.get(key);
    row.questions += 1;
    if (answer.is_correct === true) row.correct += 1;
  }
  return Array.from(days.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((row) => ({
      ...row,
      minutes: round(row.minutes, 1),
      accuracy: rate(row.correct, row.questions),
    }));
}

function buildSubjectTopicUsage(sessions, answers, studentById) {
  const subjectUsage = new Map();
  const topicUsage = new Map();
  const subjectGradeUsage = new Map();
  const topicGradeUsage = new Map();
  const topicAccuracy = new Map();

  for (const session of sessions) {
    const subject = normalizeSubject(session.subject);
    const topic = String(session.topic || "unknown").trim() || "unknown";
    const grade = normalizeGrade(studentById.get(session.student_id)?.grade_level);
    const minutes = safeNum(session.duration_seconds) / 60;
    increment(subjectUsage, subjectLabel(subject), minutes || 1);
    increment(topicUsage, topic, minutes || 1);
    increment(subjectGradeUsage, `${subjectLabel(subject)} · ${grade}`, minutes || 1);
    increment(topicGradeUsage, `${topic} · ${grade}`, minutes || 1);
  }

  for (const answer of answers) {
    const topic = extractAnswerTopic(answer);
    const subject = extractAnswerSubject(answer);
    const grade = extractAnswerGrade(answer, studentById);
    const key = `${subjectLabel(subject)} · ${topic}`;
    if (!topicAccuracy.has(key)) topicAccuracy.set(key, { topic: key, answers: 0, correct: 0 });
    const row = topicAccuracy.get(key);
    row.answers += 1;
    if (answer.is_correct === true) row.correct += 1;
    increment(topicGradeUsage, `${topic} · ${grade}`, 1);
  }

  const accuracyRows = Array.from(topicAccuracy.values()).map((row) => ({
    ...row,
    wrong: row.answers - row.correct,
    accuracy: rate(row.correct, row.answers),
    wrongRate: rate(row.answers - row.correct, row.answers),
  }));

  return {
    topSubjects: topEntries(subjectUsage).map((row) => ({ ...row, value: round(row.value, 1) })),
    topTopics: topEntries(topicUsage).map((row) => ({ ...row, value: round(row.value, 1) })),
    subjectByGrade: topEntries(subjectGradeUsage, 20).map((row) => ({ ...row, value: round(row.value, 1) })),
    topicByGrade: topEntries(topicGradeUsage, 20).map((row) => ({ ...row, value: round(row.value, 1) })),
    highWrongTopics: accuracyRows
      .filter((row) => row.answers >= 3)
      .sort((a, b) => b.wrongRate - a.wrongRate)
      .slice(0, 10),
    highSuccessTopics: accuracyRows
      .filter((row) => row.answers >= 3)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 10),
    lowUsageTopics: accuracyRows.sort((a, b) => a.answers - b.answers).slice(0, 10),
  };
}

function buildChildrenAnalytics(students, sessions, answers) {
  const sessionsByStudent = new Map();
  const answersByStudent = new Map();
  const minutesByStudent = new Map();
  const lastSessionByStudent = new Map();
  const gradeStats = new Map();
  const now = Date.now();

  for (const session of sessions) {
    increment(sessionsByStudent, session.student_id);
    increment(minutesByStudent, session.student_id, safeNum(session.duration_seconds) / 60);
    const ts = new Date(session.started_at || session.created_at || 0).getTime();
    if (Number.isFinite(ts)) {
      lastSessionByStudent.set(session.student_id, Math.max(lastSessionByStudent.get(session.student_id) || 0, ts));
    }
  }

  for (const answer of answers) {
    increment(answersByStudent, answer.student_id);
  }

  for (const student of students) {
    const grade = normalizeGrade(student.grade_level);
    if (!gradeStats.has(grade)) {
      gradeStats.set(grade, {
        grade,
        children: 0,
        activeChildren: 0,
        minutes: 0,
        answers: 0,
        correct: 0,
      });
    }
    const row = gradeStats.get(grade);
    row.children += 1;
    if ((sessionsByStudent.get(student.id) || 0) > 0) row.activeChildren += 1;
    row.minutes += minutesByStudent.get(student.id) || 0;
  }

  for (const answer of answers) {
    const grade = normalizeGrade(students.find((s) => s.id === answer.student_id)?.grade_level);
    const row = gradeStats.get(grade);
    if (!row) continue;
    row.answers += 1;
    if (answer.is_correct === true) row.correct += 1;
  }

  const noSessions = students.filter((student) => !sessionsByStudent.has(student.id)).length;
  const shortSessionStudents = new Set(
    sessions.filter((session) => safeNum(session.duration_seconds) > 0 && safeNum(session.duration_seconds) < 60).map((session) => session.student_id)
  ).size;
  const oneToThreeAnswersNoContinuation = students.filter((student) => {
    const answerCount = answersByStudent.get(student.id) || 0;
    return answerCount >= 1 && answerCount <= 3 && (sessionsByStudent.get(student.id) || 0) <= 1;
  }).length;

  return {
    cards: [
      metric("Children by grade", students.length, "students"),
      metric("Children with no learning sessions in range", noSessions, "students + learning_sessions"),
      metric("Children created who never started learning", noSessions, "students + learning_sessions"),
      metric(
        "Children inactive 7 days",
        students.filter((student) => {
          const last = lastSessionByStudent.get(student.id) || 0;
          return !last || now - last > 7 * DAY_MS;
        }).length,
        "learning_sessions.started_at"
      ),
      metric(
        "Children inactive 30 days",
        students.filter((student) => {
          const last = lastSessionByStudent.get(student.id) || 0;
          return !last || now - last > 30 * DAY_MS;
        }).length,
        "learning_sessions.started_at"
      ),
      metric("Children with very short sessions", shortSessionStudents, "learning_sessions.duration_seconds"),
      metric("Children with 1–3 answers and no continuation", oneToThreeAnswersNoContinuation, "answers + learning_sessions"),
    ],
    byGrade: Array.from(gradeStats.values())
      .sort((a, b) => a.grade.localeCompare(b.grade))
      .map((row) => ({
        ...row,
        minutes: round(row.minutes, 1),
        avgMinutes: row.activeChildren ? round(row.minutes / row.activeChildren, 1) : 0,
        accuracy: rate(row.correct, row.answers),
      })),
  };
}

function eventCount(events, eventName) {
  return events.filter((event) => event.event_name === eventName).length;
}

function eventDistinct(events, eventName, field = "actor_id") {
  return countDistinct(events.filter((event) => event.event_name === eventName), (event) => event[field]);
}

function buildParentAnalytics(students, parentActivities, parentStatuses, events) {
  const parentsWithChildren = new Set(students.map((student) => student.parent_id).filter(Boolean));
  const parentsWithActiveChildren = new Set(
    students.filter((student) => student.is_active === true).map((student) => student.parent_id).filter(Boolean)
  );
  const parentsWithInactiveChildren = new Set(
    students.filter((student) => student.is_active !== true).map((student) => student.parent_id).filter(Boolean)
  );
  const parentsWithActivities = new Set(parentActivities.map((activity) => activity.parent_id).filter(Boolean));
  const startedActivityIds = new Set(
    parentStatuses.filter((status) => status.status === "in_progress" || status.started_at || status.submitted_at).map((status) => status.activity_id)
  );

  return [
    metric("Parents with at least one child", parentsWithChildren.size, "students.parent_id"),
    metric("Parents whose children are active", parentsWithActiveChildren.size, "students.is_active"),
    metric("Parents whose children are inactive", parentsWithInactiveChildren.size, "students.is_active"),
    metric("Parents who created personal activities", parentsWithActivities.size, "parent_assigned_activities"),
    events
      ? metric("Parent dashboard opens", eventCount(events, "parent_dashboard_opened"), "analytics_events.parent_dashboard_opened", {
          status: eventCount(events, "parent_dashboard_opened") ? "available" : "empty",
          note: eventCount(events, "parent_dashboard_opened") ? null : "No data yet",
        })
      : requiresEvents("Parent dashboard opens"),
    metric(
      "Activities created but not started",
      parentActivities.filter((activity) => !startedActivityIds.has(activity.id)).length,
      "parent_assigned_activities + parent_activity_status"
    ),
    events
      ? metric("Parents who opened reports", eventDistinct(events, "parent_report_opened"), "analytics_events.parent_report_opened")
      : notTracked("Parents who opened reports", "parent_report_opened"),
    events
      ? metric("Parents who exported PDF", eventDistinct(events, "parent_report_pdf_exported"), "analytics_events.parent_report_pdf_exported")
      : notTracked("Parents who exported PDF", "parent_report_pdf_exported"),
    events
      ? metric("Personal activity results opened", eventCount(events, "personal_activity_results_opened"), "analytics_events.personal_activity_results_opened", {
          status: eventCount(events, "personal_activity_results_opened") ? "available" : "empty",
          note: eventCount(events, "personal_activity_results_opened") ? null : "No data yet",
        })
      : requiresEvents("Personal activity results opened"),
    requiresEvents("Parents who signed up but did not reach meaningful usage"),
  ];
}

function buildParentActivityAnalytics(activities, statuses, attempts, studentById, events) {
  const submitted = statuses.filter((status) => status.status === "submitted" || status.submitted_at).length;
  const started = statuses.filter((status) => status.status === "in_progress" || status.started_at || status.submitted_at).length;
  const completedScores = statuses.map((status) => safeNum(status.score_pct)).filter((score) => score > 0);
  const bySubject = new Map();
  const byTopic = new Map();
  const byChildGrade = new Map();
  const statusByActivity = new Map(statuses.map((status) => [status.activity_id, status]));

  for (const activity of activities) {
    increment(bySubject, subjectLabel(activity.subject));
    increment(byTopic, activity.topic || "unknown");
    increment(byChildGrade, normalizeGrade(studentById.get(activity.student_id)?.grade_level));
  }

  const startedNotCompleted = statuses.filter((status) => {
    const isStarted = status.status === "in_progress" || status.started_at;
    const isDone = status.status === "submitted" || status.submitted_at;
    return isStarted && !isDone;
  }).length;

  return {
    cards: [
      metric("Activities created", activities.length, "parent_assigned_activities.created_at"),
      metric("Activities started", started, "parent_activity_status.started_at/status"),
      metric("Activities completed", submitted, "parent_activity_status.submitted_at/status"),
      metric("Completion rate", rate(submitted, activities.length), "parent_activity_status", { unit: "%" }),
      metric(
        "Average score",
        completedScores.length ? round(sum(completedScores, (score) => score) / completedScores.length, 1) : 0,
        "parent_activity_status.score_pct",
        { unit: "%" }
      ),
      metric(
        "Created but not started",
        activities.filter((activity) => !statusByActivity.get(activity.id)?.started_at).length,
        "parent_assigned_activities + parent_activity_status"
      ),
      metric("Started but not completed", startedNotCompleted, "parent_activity_status"),
      events
        ? metric("Results opened", eventCount(events, "personal_activity_results_opened"), "analytics_events.personal_activity_results_opened", {
            status: eventCount(events, "personal_activity_results_opened") ? "available" : "empty",
            note: eventCount(events, "personal_activity_results_opened") ? null : "No data yet",
          })
        : requiresEvents("Results opened"),
      metric("Parent activity answers", attempts.length, "parent_activity_attempts"),
      metric(
        "Explanations opened in parent activity",
        attempts.filter((attempt) => attempt.explanation_viewed === true).length,
        "parent_activity_attempts.explanation_viewed"
      ),
      metric("Same/lower/higher than grade", null, "question_snapshot", {
        status: "unavailable",
        note: "Requires payload verification before showing as truth",
      }),
    ],
    bySubject: topEntries(bySubject),
    byTopic: topEntries(byTopic),
    byChildGrade: topEntries(byChildGrade),
  };
}

function buildBooksWorksheetsRewards(bookSessions, bookVisits, worksheetStatuses, coinRows, activeStudentIds, events) {
  const rewardsByDay = new Map();
  const rewardsByReason = new Map();
  const rewardStudents = new Set();

  for (const row of coinRows) {
    if (row.direction !== "earn") continue;
    increment(rewardsByDay, dateKey(row.created_at), safeNum(row.amount));
    increment(rewardsByReason, row.reason || "unknown", safeNum(row.amount));
    if (row.student_id) rewardStudents.add(row.student_id);
  }

  return {
    booksAudioWorksheets: [
      metric("Book opens", bookSessions.length, "book_reading_sessions"),
      metric("Book page opens", bookVisits.length, "book_page_visits"),
      metric(
        "Credited reading minutes",
        round(sum(bookVisits, (row) => safeNum(row.credited_dwell_ms) / 60000), 1),
        "book_page_visits.credited_dwell_ms"
      ),
      metric("Book pages read", bookVisits.filter((row) => row.page_read === true).length, "book_page_visits.page_read"),
      metric("Worksheet opens", sum(worksheetStatuses, (row) => row.pdf_open_count), "worksheet_student_status.pdf_open_count"),
      events
        ? metric("Audio plays", eventCount(events, "audio_played"), "analytics_events.audio_played")
        : requiresEvents("Audio plays"),
      events
        ? metric("Explanation opens", eventCount(events, "explanation_opened"), "analytics_events.explanation_opened", {
            status: eventCount(events, "explanation_opened") ? "available" : "empty",
            note: eventCount(events, "explanation_opened") ? null : "No data yet",
          })
        : requiresEvents("Explanation opens"),
    ],
    topBookPages: topEntries(
      bookVisits.reduce((map, row) => {
        increment(map, `${subjectLabel(row.subject)} · ${row.grade || "unknown"} · ${row.page_id || "unknown"}`);
        return map;
      }, new Map()),
      10
    ),
    rewards: [
      metric("Coins earned", sum(coinRows.filter((row) => row.direction === "earn"), (row) => row.amount), "coin_transactions"),
      events
        ? metric("Reward grant events", eventCount(events, "reward_earned"), "analytics_events.reward_earned", {
            status: eventCount(events, "reward_earned") ? "available" : "empty",
            note: eventCount(events, "reward_earned") ? null : "No data yet",
          })
        : requiresEvents("Reward grant events"),
      metric("Children who earned coins", rewardStudents.size, "coin_transactions.student_id"),
      metric(
        "Active children without coins",
        activeStudentIds ? Array.from(activeStudentIds).filter((id) => !rewardStudents.has(id)).length : 0,
        "learning_sessions + coin_transactions"
      ),
    ],
    rewardsByDay: topEntries(rewardsByDay, 30),
    rewardsByReason: topEntries(rewardsByReason, 10),
  };
}

function buildReportTruth(sessions, answers, parentActivities, parentAttempts, bookVisits, events) {
  const answerSessionIds = new Set(answers.map((answer) => answer.learning_session_id).filter(Boolean));
  const sessionIds = new Set(sessions.map((session) => session.id));
  const studentsWithAnswers = new Set(answers.map((answer) => answer.student_id));
  const studentsWithSessions = new Set(sessions.map((session) => session.student_id));

  const suspicious = [
    metric(
      "Answers with session_id not found in range",
      Array.from(answerSessionIds).filter((id) => !sessionIds.has(id)).length,
      "answers.learning_session_id + learning_sessions.id"
    ),
    metric(
      "Children with answers but no session in range",
      Array.from(studentsWithAnswers).filter((id) => !studentsWithSessions.has(id)).length,
      "answers + learning_sessions"
    ),
    metric(
      "Sessions with answers but 0 minutes",
      sessions.filter((session) => answerSessionIds.has(session.id) && safeNum(session.duration_seconds) === 0).length,
      "learning_sessions.duration_seconds + answers"
    ),
    events
      ? metric("Parent report open", eventCount(events, "parent_report_opened"), "analytics_events.parent_report_opened")
      : notTracked("Parent report open", "parent_report_opened"),
    events
      ? metric("Parent report PDF export", eventCount(events, "parent_report_pdf_exported"), "analytics_events.parent_report_pdf_exported")
      : notTracked("Parent report PDF export", "parent_report_pdf_exported"),
  ];

  return {
    cards: [
      metric("Raw learning sessions", sessions.length, "learning_sessions"),
      metric("Raw answers", answers.length, "answers"),
      metric("Raw learning minutes", round(sum(sessions, (row) => row.duration_seconds) / 60, 1), "learning_sessions.duration_seconds"),
      metric("Parent activities created", parentActivities.length, "parent_assigned_activities"),
      metric("Parent activity answers", parentAttempts.length, "parent_activity_attempts"),
      metric("Credited book minutes", round(sum(bookVisits, (row) => safeNum(row.credited_dwell_ms) / 60000), 1), "book_page_visits"),
      metric("Report source summaries", null, "aggregateParentReportPayload", {
        status: "partial",
        note: "Stage 1 shows a raw source check; full payload comparison will be added in a focused truth gate",
      }),
    ],
    suspicious,
  };
}

function eventRowsOrNull(events) {
  return Array.isArray(events) ? events : null;
}

function buildFunnel(name, steps, events, fallbackCounts = {}) {
  if (!events) {
    return {
      name,
      status: "requires_events",
      note: REQUIRES_EVENTS,
      steps: steps.map((step) => ({
        key: step.event,
        label: step.label,
        value: fallbackCounts[step.event] ?? null,
        status: fallbackCounts[step.event] != null ? "partial" : "requires_events",
        source: fallbackCounts[step.event] != null ? step.fallbackSource || "Existing database data" : "analytics_events",
      })),
    };
  }
  const stepRows = steps.map((step, idx) => {
    const value = eventCount(events, step.event);
    const prev = idx > 0 ? eventCount(events, steps[idx - 1].event) : null;
    return {
      key: step.event,
      label: step.label,
      value,
      status: value > 0 ? "available" : "empty",
      source: `analytics_events.${step.event}`,
      conversionFromPrevious: prev && prev > 0 ? rate(value, prev) : null,
    };
  });
  return {
    name,
    status: stepRows.some((row) => row.value > 0) ? "available" : "empty",
    note: stepRows.some((row) => row.value > 0) ? null : "Will appear after real site usage",
    steps: stepRows,
  };
}

function buildFunnels(events, counts) {
  return [
    buildFunnel(
      "Parent funnel",
      [
        { event: "parent_login", label: "Parent login" },
        { event: "parent_dashboard_opened", label: "Dashboard open" },
        { event: "child_created", label: "Child created" },
        { event: "student_login", label: "Child login" },
        { event: "practice_started", label: "First learning session" },
        { event: "parent_report_opened", label: "Report open" },
        { event: "parent_report_pdf_exported", label: "PDF export" },
      ],
      events,
      counts
    ),
    buildFunnel(
      "Student learning funnel",
      [
        { event: "student_home_opened", label: "Student home" },
        { event: "subject_opened", label: "Subject" },
        { event: "topic_opened", label: "Topic" },
        { event: "practice_started", label: "Practice start" },
        { event: "question_answered", label: "Question answered" },
        { event: "practice_completed", label: "Practice completed" },
      ],
      events,
      counts
    ),
    buildFunnel(
      "Parent activity funnel",
      [
        { event: "personal_activity_created", label: "Created" },
        { event: "personal_activity_started", label: "Started" },
        { event: "personal_activity_completed", label: "Completed" },
        { event: "personal_activity_results_opened", label: "Results opened" },
      ],
      events,
      counts
    ),
    buildFunnel(
      "Reports funnel",
      [
        { event: "parent_dashboard_opened", label: "Parent dashboard" },
        { event: "parent_report_opened", label: "Report opened" },
        { event: "parent_report_pdf_exported", label: "PDF exported" },
      ],
      events,
      counts
    ),
    buildFunnel(
      "Books & audio funnel",
      [
        { event: "book_opened", label: "Book opened" },
        { event: "book_section_opened", label: "Page/section opened" },
        { event: "audio_played", label: "Audio played" },
      ],
      events,
      counts
    ),
  ];
}

function eventTimestamp(event) {
  const ts = new Date(event.created_at).getTime();
  return Number.isFinite(ts) ? ts : null;
}

function buildRetention(events, sessions, studentSessions, range) {
  const rows = eventRowsOrNull(events);
  const now = startOfUtcToday().getTime();
  const rangeStart = range?.fromDate?.getTime?.() ?? now;
  const rangeAgeDays = Math.floor((now - rangeStart) / DAY_MS) + 1;

  const studentActivity = new Map();
  const addStudentActivity = (studentId, ts) => {
    if (!studentId || !Number.isFinite(ts)) return;
    if (!studentActivity.has(studentId)) studentActivity.set(studentId, []);
    studentActivity.get(studentId).push(ts);
  };
  for (const session of sessions) addStudentActivity(session.student_id, new Date(session.started_at || session.created_at).getTime());
  for (const event of rows || []) addStudentActivity(event.student_id, eventTimestamp(event));

  const retentionForDays = (days) => {
    if (rangeAgeDays <= days) {
      return notEnoughMetric(`D${days} child retention`, "analytics_events + learning_sessions", `Requires at least ${days} full days`);
    }
    let cohort = 0;
    let retained = 0;
    for (const timestamps of studentActivity.values()) {
      const sorted = timestamps.filter(Number.isFinite).sort((a, b) => a - b);
      if (!sorted.length) continue;
      cohort += 1;
      const first = sorted[0];
      if (sorted.some((ts) => ts >= first + days * DAY_MS)) retained += 1;
    }
    if (!cohort) return emptyMetric(`D${days} child retention`, "analytics_events + learning_sessions");
    return metric(`D${days} child retention`, rate(retained, cohort), "analytics_events + learning_sessions", { unit: "%" });
  };

  const parentEvents = rows ? rows.filter((event) => event.actor_type === "parent") : [];
  const childEvents = rows ? rows.filter((event) => event.actor_type === "student") : [];
  const studentsWithOneSession = new Set();
  const sessionCounts = new Map();
  for (const session of sessions) increment(sessionCounts, session.student_id);
  for (const [studentId, count] of sessionCounts.entries()) {
    if (count === 1) studentsWithOneSession.add(studentId);
  }

  return [
    retentionForDays(1),
    retentionForDays(7),
    retentionForDays(30),
    rows ? metric("Returning parents", countDistinct(parentEvents, (event) => event.actor_id), "analytics_events actor_type=parent") : requiresEvents("Returning parents"),
    rows ? metric("Returning children", countDistinct(childEvents, (event) => event.student_id), "analytics_events actor_type=student") : requiresEvents("Returning children"),
    metric("Children inactive after first session", studentsWithOneSession.size, "learning_sessions", {
      status: studentsWithOneSession.size > 0 ? "available" : "empty",
      note: studentsWithOneSession.size > 0 ? null : "No data yet",
    }),
    metric("Student logins in range", studentSessions.length, "student_sessions"),
    metric("Weekly active children", countDistinct(sessions.filter((s) => new Date(s.started_at).getTime() >= Date.now() - 7 * DAY_MS), (s) => s.student_id), "learning_sessions"),
    metric("Monthly active children", countDistinct(sessions.filter((s) => new Date(s.started_at).getTime() >= Date.now() - 30 * DAY_MS), (s) => s.student_id), "learning_sessions"),
  ];
}

function buildAbandonment(events, sessions, parentStatuses) {
  const rows = eventRowsOrNull(events);
  const started = rows ? eventCount(rows, "practice_started") : null;
  const completed = rows ? eventCount(rows, "practice_completed") : null;
  const explicitAbandoned = rows ? eventCount(rows, "practice_abandoned") : null;
  const incompleteSessions = sessions.filter((session) => session.status !== "completed").length;
  const shortSessions = sessions.filter((session) => safeNum(session.duration_seconds) > 0 && safeNum(session.duration_seconds) < 60).length;
  const startedNotCompletedActivities = parentStatuses.filter((status) => {
    const isStarted = status.status === "in_progress" || status.started_at;
    const isDone = status.status === "submitted" || status.submitted_at;
    return isStarted && !isDone;
  }).length;

  return [
    rows ? metric("Explicit practice abandonment", explicitAbandoned, "analytics_events.practice_abandoned", { status: explicitAbandoned ? "available" : "empty", note: explicitAbandoned ? null : "No data yet" }) : requiresEvents("Explicit practice abandonment"),
    rows && started
      ? metric("Start vs completion gap", Math.max(0, started - completed), "analytics_events practice_started/practice_completed")
      : notEnoughMetric("Start vs completion gap", "analytics_events", "Start and completion events required"),
    metric("Sessions started and not completed", incompleteSessions, "learning_sessions.status"),
    metric("Very short sessions", shortSessions, "learning_sessions.duration_seconds"),
    metric("Parent activities started and not completed", startedNotCompletedActivities, "parent_activity_status"),
    rows ? metric("Report drop-off before PDF", Math.max(0, eventCount(rows, "parent_report_opened") - eventCount(rows, "parent_report_pdf_exported")), "analytics_events report funnel") : requiresEvents("Report drop-off before PDF"),
    rows ? metric("Book drop-off before audio", Math.max(0, eventCount(rows, "book_opened") - eventCount(rows, "audio_played")), "analytics_events book/audio funnel") : requiresEvents("Book drop-off before audio"),
  ];
}

function buildFeatureUsage(events) {
  const rows = eventRowsOrNull(events);
  if (!rows) {
    return {
      cards: [requiresEvents("Feature usage")],
      mostUsed: [],
      leastUsed: [],
      byGrade: [],
      bySubject: [],
    };
  }
  const byFeature = new Map();
  const byGrade = new Map();
  const bySubject = new Map();
  for (const event of rows) {
    const feature = event.feature_key || event.event_name || "unknown";
    increment(byFeature, feature);
    if (event.grade) increment(byGrade, `${feature} · ${event.grade}`);
    if (event.subject) increment(bySubject, `${feature} · ${subjectLabel(event.subject)}`);
  }
  const all = topEntries(byFeature, 100);
  return {
    cards: [
      metric("Feature usage events", rows.length, "analytics_events"),
      rows.length ? metric("Features in use", byFeature.size, "analytics_events.feature_key") : emptyMetric("Features in use", "analytics_events"),
      metric("Report usage", eventCount(rows, "parent_report_opened"), "analytics_events.parent_report_opened", { status: eventCount(rows, "parent_report_opened") ? "available" : "empty", note: eventCount(rows, "parent_report_opened") ? null : "No data yet" }),
      metric("Audio usage", eventCount(rows, "audio_played"), "analytics_events.audio_played", { status: eventCount(rows, "audio_played") ? "available" : "empty", note: eventCount(rows, "audio_played") ? null : "No data yet" }),
      metric("Book usage", eventCount(rows, "book_opened"), "analytics_events.book_opened", { status: eventCount(rows, "book_opened") ? "available" : "empty", note: eventCount(rows, "book_opened") ? null : "No data yet" }),
      metric("Worksheet usage", eventCount(rows, "worksheet_opened"), "analytics_events.worksheet_opened", { status: eventCount(rows, "worksheet_opened") ? "available" : "empty", note: eventCount(rows, "worksheet_opened") ? null : "No data yet" }),
      metric("Explanation usage", eventCount(rows, "explanation_opened"), "analytics_events.explanation_opened", { status: eventCount(rows, "explanation_opened") ? "available" : "empty", note: eventCount(rows, "explanation_opened") ? null : "No data yet" }),
      metric("Reward usage", eventCount(rows, "reward_earned"), "analytics_events.reward_earned", { status: eventCount(rows, "reward_earned") ? "available" : "empty", note: eventCount(rows, "reward_earned") ? null : "No data yet" }),
      metric("Personal activity usage", eventCount(rows, "personal_activity_created") + eventCount(rows, "personal_activity_started") + eventCount(rows, "personal_activity_completed"), "analytics_events personal_activity_*"),
    ],
    mostUsed: all.slice(0, 10),
    leastUsed: all.slice(-10).reverse(),
    byGrade: topEntries(byGrade, 20),
    bySubject: topEntries(bySubject, 20),
  };
}

function inRange(iso, range) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && t >= range.fromDate.getTime() && t < new Date(range.toIsoExclusive).getTime();
}

function weekKey(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "unknown";
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = start.getUTCDay();
  const diff = (day + 6) % 7;
  start.setUTCDate(start.getUTCDate() - diff);
  return isoDateOnly(start);
}

function monthKey(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "unknown";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function seriesBy(rows, dateField, bucketFn, labelPrefix = "") {
  const map = new Map();
  for (const row of rows || []) {
    const key = bucketFn(row[dateField]);
    if (key !== "unknown") increment(map, key);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => ({ key, label: labelPrefix ? `${labelPrefix} ${key}` : key, value }));
}

function avgDays(rows) {
  const nums = rows.filter((n) => Number.isFinite(n) && n >= 0);
  return nums.length ? round(nums.reduce((a, b) => a + b, 0) / nums.length, 1) : null;
}

function firstSessionByStudent(sessions) {
  const map = new Map();
  for (const session of sessions || []) {
    const ts = new Date(session.started_at || session.created_at).getTime();
    if (!Number.isFinite(ts)) continue;
    const current = map.get(session.student_id);
    if (!current || ts < current.ts) {
      map.set(session.student_id, {
        ts,
        date: new Date(ts).toISOString(),
      });
    }
  }
  return map;
}

function buildParentEmailById(authUsers) {
  const map = new Map();
  for (const user of authUsers || []) {
    if (!user?.id) continue;
    map.set(user.id, normalizeUserEmail(user));
  }
  return map;
}

function buildUserActivityAnalytics({
  allStudents,
  parentProfiles,
  authUsers,
  learningSessions,
  soloGameSessions,
  answers,
  studentSessions,
  range,
}) {
  const parentEmailById = buildParentEmailById(authUsers);
  const parents = parentProfiles.ok ? parentProfiles.rows || [] : [];
  const productionStudents = (allStudents || []).filter((student) => isIncludedAnalyticsStudent(student, parentEmailById));

  const newGuests = productionStudents.filter(
    (student) => student.account_kind === "guest" && inRange(student.created_at, range)
  ).length;
  const newParents = parents.filter(
    (parent) => isIncludedAnalyticsParentProfile(parent, parentEmailById) && inRange(parent.created_at, range)
  ).length;
  const newRegisteredStudents = productionStudents.filter(
    (student) => student.account_kind !== "guest" && inRange(student.created_at, range)
  ).length;

  const includedStudentIds = new Set(productionStudents.map((student) => student.id));
  const filteredLearningSessions = (learningSessions || []).filter((row) => includedStudentIds.has(row.student_id));
  const filteredSoloSessions = (soloGameSessions || []).filter((row) => includedStudentIds.has(row.student_id));
  const filteredAnswers = (answers || []).filter((row) => includedStudentIds.has(row.student_id));
  const filteredStudentSessions = (studentSessions || []).filter((row) => includedStudentIds.has(row.student_id));

  const learningSessionCount = filteredLearningSessions.length;
  const soloGameSessionCount = filteredSoloSessions.length;

  const activeStudentIds = new Set();
  for (const row of filteredLearningSessions) activeStudentIds.add(row.student_id);
  for (const row of filteredSoloSessions) activeStudentIds.add(row.student_id);
  for (const row of filteredAnswers) activeStudentIds.add(row.student_id);
  for (const row of filteredStudentSessions) activeStudentIds.add(row.student_id);
  const activeStudents = activeStudentIds.size;

  const cards = [
    metric("New guests created", newGuests, "students.account_kind=guest", {
      status: newGuests ? "available" : "empty",
      note: newGuests ? null : "No data yet",
    }),
    metric("New parents", newParents, "parent_profiles.created_at", {
      status: newParents ? "available" : "empty",
      note: newParents ? null : "No data yet",
    }),
    metric("New registered students", newRegisteredStudents, "students.account_kind=registered", {
      status: newRegisteredStudents ? "available" : "empty",
      note: newRegisteredStudents ? null : "No data yet",
    }),
    metric("Learning sessions", learningSessionCount, "learning_sessions"),
    metric("Solo game sessions", soloGameSessionCount, "solo_game_sessions"),
    metric("Users who performed real activity", activeStudents, "learning_sessions + solo_game_sessions + answers + student_sessions"),
  ];

  return {
    cards,
    funnel: {
      disclaimer:
        "Site traffic data (Vercel) and user activity data (Supabase) are not identity-linked — each funnel step may represent different people.",
      steps: [
        {
          key: "visitors",
          label: "Site visitors",
          value: null,
          source: "vercel_web_analytics",
          placeholder: true,
        },
        {
          key: "guests_and_parents",
          label: "New guests and parents",
          value: newGuests + newParents,
          source: "students + parent_profiles",
        },
        {
          key: "active_users",
          label: "Active users",
          value: activeStudents,
          source: "learning_sessions + solo_game_sessions + answers",
        },
        {
          key: "learning_and_games",
          label: "Learning & games",
          value: learningSessionCount + soloGameSessionCount,
          source: "learning_sessions + solo_game_sessions",
        },
      ],
    },
    guestsByDay: seriesBy(
      productionStudents.filter((student) => student.account_kind === "guest" && inRange(student.created_at, range)),
      "created_at",
      dateKey
    ),
    parentsByDay: seriesBy(
      parents.filter((parent) => isIncludedAnalyticsParentProfile(parent, parentEmailById) && inRange(parent.created_at, range)),
      "created_at",
      dateKey
    ),
    newGuests,
    newParents,
    newRegisteredStudents,
    learningSessions: learningSessionCount,
    soloGameSessions: soloGameSessionCount,
    activeStudents,
  };
}

function buildAccountAnalytics(authUsersResult, parentProfiles, teacherProfiles, entitlements, range) {
  const authUsers = authUsersResult.ok ? authUsersResult.rows : null;
  const entitlementRows = entitlements.ok ? entitlements.rows : [];
  const parentProfileIds = new Set((parentProfiles.rows || []).map((row) => row.id));
  const teacherProfileIds = new Set((teacherProfiles.rows || []).map((row) => row.id));
  const entitlementByUser = new Map();
  for (const ent of entitlementRows) {
    if (!entitlementByUser.has(ent.user_id)) entitlementByUser.set(ent.user_id, []);
    entitlementByUser.get(ent.user_id).push(ent);
  }

  const personaCounts = new Map();
  const statusCounts = new Map();
  for (const ent of entitlementRows) {
    increment(personaCounts, ent.persona || "unknown");
    increment(statusCounts, `${ent.persona || "unknown"}:${ent.status || "unknown"}`);
  }

  const authRoleCounts = new Map();
  for (const user of authUsers || []) {
    const role = String(user?.app_metadata?.role || "unknown").toLowerCase() || "unknown";
    increment(authRoleCounts, role);
  }

  const unlinkedAccounts = authUsers
    ? authUsers.filter((user) => {
        const id = user.id;
        return !entitlementByUser.has(id) && !parentProfileIds.has(id) && !teacherProfileIds.has(id);
      }).length
    : null;
  const missingProfileEntitlements = entitlementRows.filter((ent) => {
    if (ent.persona === "parent") return !parentProfileIds.has(ent.user_id);
    if (ent.persona === "private_teacher") return !teacherProfileIds.has(ent.user_id);
    if (ent.persona === "admin") return false;
    return false;
  }).length;
  const authInRange = authUsers ? authUsers.filter((user) => inRange(user.created_at, range)) : null;

  return {
    cards: [
      authUsers ? metric("Total auth accounts", authUsers.length, "auth.users") : unavailable("Total auth accounts", "auth.users", authUsersResult.error),
      metric("Total parents", parentProfiles.rows?.length || 0, "parent_profiles"),
      metric("Total private teachers", teacherProfiles.rows?.length || 0, "teacher_profiles + private_teacher entitlement"),
      metric("Admin accounts", entitlementRows.filter((ent) => ent.persona === "admin").length, "account_persona_entitlements persona=admin"),
      authUsers ? metric("Unlinked/unknown accounts", unlinkedAccounts, "auth.users + profiles + entitlements", { status: unlinkedAccounts ? "available" : "empty", note: unlinkedAccounts ? null : "No data yet" }) : unavailable("Unlinked/unknown accounts", "auth.users", authUsersResult.error),
      metric("Entitlements without profile", missingProfileEntitlements, "account_persona_entitlements + profiles", { status: missingProfileEntitlements ? "available" : "empty", note: missingProfileEntitlements ? null : "No data yet" }),
      authUsers ? metric("New accounts in range", authInRange.length, "auth.users.created_at", { status: authInRange.length ? "available" : "empty", note: authInRange.length ? null : "No data yet" }) : unavailable("New accounts in range", "auth.users", authUsersResult.error),
      metric("Active entitlements", entitlementRows.filter((ent) => ent.status === "active").length, "account_persona_entitlements.status"),
      metric("Inactive entitlements", entitlementRows.filter((ent) => ent.status !== "active").length, "account_persona_entitlements.status"),
    ],
    byPersona: topEntries(personaCounts, 20),
    byAuthRole: topEntries(authRoleCounts, 20),
    byStatus: topEntries(statusCounts, 20),
    joinedByDay: authUsers ? seriesBy(authUsers, "created_at", dateKey) : [],
    joinedByWeek: authUsers ? seriesBy(authUsers, "created_at", weekKey) : [],
    joinedByMonth: authUsers ? seriesBy(authUsers, "created_at", monthKey) : [],
  };
}

function buildParentJoinAnalytics(parentProfiles, allStudents, allSessions, events, range) {
  const parents = parentProfiles.rows || [];
  const childrenByParent = new Map();
  for (const child of allStudents) {
    if (!child.parent_id) continue;
    if (!childrenByParent.has(child.parent_id)) childrenByParent.set(child.parent_id, []);
    childrenByParent.get(child.parent_id).push(child);
  }
  const firstLearning = firstSessionByStudent(allSessions);
  const joinedInRange = parents.filter((parent) => inRange(parent.created_at, range));
  const daysToFirstChild = [];
  const joinedChildNeverLearning = new Set();

  for (const parent of parents) {
    const children = childrenByParent.get(parent.id) || [];
    const childCreatedTimes = children
      .map((child) => new Date(child.created_at).getTime())
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    const parentTs = new Date(parent.created_at).getTime();
    if (childCreatedTimes.length && Number.isFinite(parentTs)) {
      daysToFirstChild.push((childCreatedTimes[0] - parentTs) / DAY_MS);
    }
    if (children.length && children.every((child) => !firstLearning.has(child.id))) {
      joinedChildNeverLearning.add(parent.id);
    }
  }

  return {
    cards: [
      metric("Parents who joined in range", joinedInRange.length, "parent_profiles.created_at", { status: joinedInRange.length ? "available" : "empty", note: joinedInRange.length ? null : "No data yet" }),
      metric("Parents with children", Array.from(childrenByParent.keys()).length, "students.parent_id"),
      metric("Parents without children", parents.filter((parent) => !childrenByParent.has(parent.id)).length, "parent_profiles + students"),
      metric("Parents whose children did not start learning", joinedChildNeverLearning.size, "parent_profiles + students + learning_sessions", { status: joinedChildNeverLearning.size ? "available" : "empty", note: joinedChildNeverLearning.size ? null : "No data yet" }),
      metric("Average days from join to first child", avgDays(daysToFirstChild), "parent_profiles.created_at + students.created_at", {
        status: avgDays(daysToFirstChild) == null ? "empty" : "available",
        note: avgDays(daysToFirstChild) == null ? "No data yet" : null,
      }),
      events ? metric("Report opens after join", eventCount(events, "parent_report_opened"), "analytics_events.parent_report_opened") : requiresEvents("Report opens after join"),
      events ? metric("Activity creation after join", eventCount(events, "personal_activity_created"), "analytics_events.personal_activity_created") : requiresEvents("Activity creation after join"),
    ],
    byDay: seriesBy(parents, "created_at", dateKey),
    byWeek: seriesBy(parents, "created_at", weekKey),
    byMonth: seriesBy(parents, "created_at", monthKey),
    onboardingFunnel: buildFunnel(
      "Parent usage start",
      [
        { event: "parent_login", label: "Login/join" },
        { event: "child_created", label: "Child created" },
        { event: "practice_started", label: "Child started learning" },
        { event: "parent_report_opened", label: "Report opened" },
        { event: "personal_activity_created", label: "Activity created" },
      ],
      events,
      {
        child_created: allStudents.length,
        practice_started: allSessions.length,
      }
    ),
  };
}

function buildChildJoinAnalytics(allStudents, allSessions, range) {
  const firstLearning = firstSessionByStudent(allSessions);
  const addedInRange = allStudents.filter((child) => inRange(child.created_at, range));
  const neverStarted = allStudents.filter((child) => !firstLearning.has(child.id));
  const activeCreatedInRange = addedInRange.filter((child) => firstLearning.has(child.id));
  const daysToFirstLearning = [];
  for (const child of allStudents) {
    const first = firstLearning.get(child.id);
    const childTs = new Date(child.created_at).getTime();
    if (first && Number.isFinite(childTs)) daysToFirstLearning.push((first.ts - childTs) / DAY_MS);
  }
  return {
    cards: [
      metric("Children added in range", addedInRange.length, "students.created_at", { status: addedInRange.length ? "available" : "empty", note: addedInRange.length ? null : "No data yet" }),
      metric("Active children", allStudents.filter((child) => child.is_active === true).length, "students.is_active"),
      metric("Inactive children", allStudents.filter((child) => child.is_active !== true).length, "students.is_active"),
      metric("Children added who did not start learning", neverStarted.length, "students + learning_sessions", { status: neverStarted.length ? "available" : "empty", note: neverStarted.length ? null : "No data yet" }),
      metric("Children added in range who became active", activeCreatedInRange.length, "students.created_at + learning_sessions", { status: activeCreatedInRange.length ? "available" : "empty", note: activeCreatedInRange.length ? null : "No data yet" }),
      metric("Average days from first child to first learning", avgDays(daysToFirstLearning), "students.created_at + learning_sessions.started_at", {
        status: avgDays(daysToFirstLearning) == null ? "empty" : "available",
        note: avgDays(daysToFirstLearning) == null ? "No data yet" : null,
      }),
    ],
    byDay: seriesBy(allStudents, "created_at", dateKey),
    byWeek: seriesBy(allStudents, "created_at", weekKey),
    byMonth: seriesBy(allStudents, "created_at", monthKey),
    firstLearning: Array.from(firstLearning.entries()).slice(0, 20).map(([studentId, first]) => ({
      key: studentId,
      label: studentId,
      value: first.date.slice(0, 10),
    })),
  };
}

function buildTeacherAnalytics(teacherProfiles, entitlements, teacherClasses, teacherStudents, studentActivities, classroomActivities, worksheetActivities, events, range) {
  const teachers = teacherProfiles.rows || [];
  const privateTeacherEntitlements = (entitlements.rows || []).filter((ent) => ent.persona === "private_teacher");
  const privateTeacherIds = new Set(privateTeacherEntitlements.map((ent) => ent.user_id));
  const joinedInRange = teachers.filter((teacher) => inRange(teacher.created_at, range));
  const classTeacherIds = new Set((teacherClasses.rows || []).map((row) => row.teacher_id));
  const linkedTeacherIds = new Set((teacherStudents.rows || []).map((row) => row.teacher_id));
  const individualActivityTeacherIds = new Set((studentActivities.rows || []).map((row) => row.teacher_id));
  const classroomActivityTeacherIds = new Set((classroomActivities.rows || []).map((row) => row.teacher_id));
  const worksheetTeacherIds = new Set((worksheetActivities.rows || []).map((row) => row.teacher_id));
  const meaningful = new Set([
    ...classTeacherIds,
    ...linkedTeacherIds,
    ...individualActivityTeacherIds,
    ...classroomActivityTeacherIds,
    ...worksheetTeacherIds,
  ]);
  const eventTeacherIds = new Set((events || []).filter((event) => event.actor_type === "teacher").map((event) => event.actor_id).filter(Boolean));
  const activeTeacherIds = new Set([...meaningful, ...eventTeacherIds]);

  return {
    cards: [
      metric("Total private teachers", teachers.filter((teacher) => privateTeacherIds.has(teacher.id) || teacher.is_active === true).length, "teacher_profiles + private_teacher entitlement"),
      metric("Teachers with private-teacher entitlement", privateTeacherIds.size, "account_persona_entitlements persona=private_teacher"),
      metric("Teachers who joined in range", joinedInRange.length, "teacher_profiles.created_at", { status: joinedInRange.length ? "available" : "empty", note: joinedInRange.length ? null : "No data yet" }),
      metric("Active/meaningful teachers", activeTeacherIds.size, "teacher tables + analytics_events", { status: activeTeacherIds.size ? "available" : "empty", note: activeTeacherIds.size ? null : "No data yet" }),
      metric("Teachers without meaningful usage", teachers.filter((teacher) => !meaningful.has(teacher.id)).length, "teacher_profiles + teacher activity tables"),
      events ? metric("Teacher logins", eventCount(events, "teacher_login"), "analytics_events.teacher_login", { status: eventCount(events, "teacher_login") ? "available" : "empty", note: eventCount(events, "teacher_login") ? null : "No data yet" }) : requiresEvents("Teacher logins"),
      events ? metric("Teacher dashboard opens", eventCount(events, "teacher_dashboard_opened"), "analytics_events.teacher_dashboard_opened", { status: eventCount(events, "teacher_dashboard_opened") ? "available" : "empty", note: eventCount(events, "teacher_dashboard_opened") ? null : "No data yet" }) : requiresEvents("Teacher dashboard opens"),
      events ? metric("Teacher reports opened", eventCount(events, "teacher_report_opened"), "analytics_events.teacher_report_opened", { status: eventCount(events, "teacher_report_opened") ? "available" : "empty", note: eventCount(events, "teacher_report_opened") ? null : "No data yet" }) : requiresEvents("Teacher reports opened"),
      metric("Teacher activities created", (studentActivities.rows || []).length + (classroomActivities.rows || []).length, "student_activities + classroom_activities"),
      metric("Worksheets teachers created", (worksheetActivities.rows || []).length, "worksheet_activities"),
    ],
    byDay: seriesBy(teachers, "created_at", dateKey),
    byWeek: seriesBy(teachers, "created_at", weekKey),
    byMonth: seriesBy(teachers, "created_at", monthKey),
    activityByDay: seriesBy([...(studentActivities.rows || []), ...(classroomActivities.rows || []), ...(worksheetActivities.rows || [])], "created_at", dateKey),
  };
}

export async function getAdminAnalyticsDashboard(serviceRole, query = {}) {
  const range = resolveAdminAnalyticsRange(query);
  if (!range.ok) return range;

  const gradeFilter = String(query.grade || "all").trim();
  const subjectFilter = String(query.subject || "all").trim();
  const childStatusFilter = String(query.childStatus || "all").trim();

  const cacheKey = JSON.stringify({
    preset: range.preset,
    from: range.fromDateOnly,
    to: range.toDateOnly,
    gradeFilter,
    subjectFilter,
    childStatusFilter,
  });
  const cached = adminAnalyticsResponseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  const sourceErrors = [];
  const studentsResult = await fetchAll(
    serviceRole,
    "students",
    "id,parent_id,grade_level,is_active,created_at,account_kind",
    (q) => q.order("created_at", { ascending: false })
  );
  if (!studentsResult.ok) {
    return { ok: false, status: 500, code: "students_source_unavailable", error: studentsResult.error };
  }

  const allStudents = studentsResult.rows;
  let students = allStudents;
  if (gradeFilter !== "all") students = students.filter((student) => normalizeGrade(student.grade_level) === gradeFilter);
  if (childStatusFilter === "active") students = students.filter((student) => student.is_active === true);
  if (childStatusFilter === "inactive") students = students.filter((student) => student.is_active !== true);

  const studentById = new Map(students.map((student) => [student.id, student]));
  const allowedStudentIds = new Set(students.map((student) => student.id));
  const subjectQueryFilter = subjectFilter !== "all" ? normalizeSubject(subjectFilter) : null;

  const [
    authUsersResult,
    parentProfiles,
    allEntitlements,
    teacherProfiles,
    sessionsResult,
    allSessionsResult,
    answersResult,
    studentSessionsResult,
    activitiesResult,
    statusesResult,
    attemptsResult,
    bookSessionsResult,
    bookVisitsResult,
    worksheetStatusesResult,
    coinRowsResult,
    analyticsEventsResult,
    publicWorksheetVisitorEventsResult,
    teacherClassesResult,
    teacherStudentsResult,
    studentActivitiesResult,
    classroomActivitiesResult,
    worksheetActivitiesResult,
    soloGameSessionsResult,
  ] = await Promise.all([
    fetchAuthUsers(serviceRole),
    fetchAll(serviceRole, "parent_profiles", "id,created_at", (q) => q.order("created_at", { ascending: false })),
    fetchAll(
      serviceRole,
      "account_persona_entitlements",
      "user_id,persona,status,created_at,approved_at,revoked_at,suspended_at",
      (q) => q.order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "teacher_profiles",
      "id,is_active,archived_at,created_at",
      (q) => q.order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "learning_sessions",
      "id,student_id,subject,topic,started_at,created_at,ended_at,duration_seconds,status,metadata",
      (q) => {
        let built = q.gte("started_at", range.fromIso).lt("started_at", range.toIsoExclusive);
        if (subjectQueryFilter) built = built.eq("subject", subjectQueryFilter);
        return built.order("started_at", { ascending: false });
      }
    ),
    fetchAll(
      serviceRole,
      "learning_sessions",
      "id,student_id,subject,topic,started_at,created_at,ended_at,duration_seconds,status,metadata",
      (q) => q.order("started_at", { ascending: true }),
      { maxRows: MAX_ALL_TIME_SESSION_ROWS }
    ),
    fetchAll(
      serviceRole,
      "answers",
      "id,student_id,learning_session_id,is_correct,answered_at,created_at,answer_payload",
      (q) => q.gte("answered_at", range.fromIso).lt("answered_at", range.toIsoExclusive).order("answered_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "student_sessions",
      "id,student_id,started_at,last_seen_at,ended_at,created_at",
      (q) => q.gte("started_at", range.fromIso).lt("started_at", range.toIsoExclusive).order("started_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "parent_assigned_activities",
      "id,parent_id,student_id,subject,topic,subtopic,skill_key,question_count,mode,status,created_at,activated_at",
      (q) => q.gte("created_at", range.fromIso).lt("created_at", range.toIsoExclusive).order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "parent_activity_status",
      "id,activity_id,student_id,status,started_at,submitted_at,last_seen_at,answers_count,correct_count,score_pct,created_at",
      (q) => q.order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "parent_activity_attempts",
      "id,activity_id,student_id,is_correct,time_spent_ms,hints_used,explanation_viewed,answered_at,created_at",
      (q) => q.gte("answered_at", range.fromIso).lt("answered_at", range.toIsoExclusive).order("answered_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "book_reading_sessions",
      "id,student_id,subject,grade,started_at,ended_at,total_credited_dwell_ms,pages_read_count,pages_skipped_count,triggered_cta",
      (q) => q.gte("started_at", range.fromIso).lt("started_at", range.toIsoExclusive).order("started_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "book_page_visits",
      "id,student_id,subject,grade,page_id,started_at,ended_at,credited_dwell_ms,raw_dwell_ms,page_read,triggered_cta,sections_viewed,sections_skipped",
      (q) => q.gte("started_at", range.fromIso).lt("started_at", range.toIsoExclusive).order("started_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "worksheet_student_status",
      "id,student_id,pdf_first_opened_at,pdf_last_opened_at,pdf_open_count,marked_completed_at,digital_submitted_at,grading_status,auto_score_pct,final_score_pct",
      (q) => q.order("pdf_last_opened_at", { ascending: false, nullsFirst: false })
    ),
    fetchAll(
      serviceRole,
      "coin_transactions",
      "id,student_id,direction,amount,reason,source_type,source_id,metadata,created_at",
      (q) => q.gte("created_at", range.fromIso).lt("created_at", range.toIsoExclusive).order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "analytics_events",
      "id,created_at,actor_type,actor_id,parent_id,student_id,session_id,event_name,subject,topic,grade,device_type,app_surface",
      (q) => {
        let built = q.gte("created_at", range.fromIso).lt("created_at", range.toIsoExclusive);
        if (subjectQueryFilter) built = built.eq("subject", subjectQueryFilter);
        return built.order("created_at", { ascending: false });
      }
    ),
    fetchAll(
      serviceRole,
      "analytics_events",
      "session_id,event_name,actor_type,created_at",
      (q) =>
        q
          .eq("actor_type", "visitor")
          .in("event_name", [...PUBLIC_WORKSHEET_ANALYTICS_EVENTS])
          .gte("created_at", range.fromIso)
          .lt("created_at", range.toIsoExclusive)
          .order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "teacher_classes",
      "id,teacher_id,created_at,is_archived,archived_at",
      (q) => q.order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "teacher_students",
      "id,teacher_id,student_id,created_at,archived_at",
      (q) => q.order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "student_activities",
      "id,teacher_id,student_id,subject,topic,status,created_at",
      (q) => q.order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "classroom_activities",
      "id,teacher_id,subject,topic,status,created_at",
      (q) => q.order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "worksheet_activities",
      "id,teacher_id,subject,status,created_at",
      (q) => q.order("created_at", { ascending: false })
    ),
    fetchAll(
      serviceRole,
      "solo_game_sessions",
      "id,student_id,game_key,status,started_at,created_at",
      (q) => q.gte("started_at", range.fromIso).lt("started_at", range.toIsoExclusive).order("started_at", { ascending: false })
    ),
  ]);

  const optionalSources = [
    ["parent_profiles", parentProfiles],
    ["account_persona_entitlements", allEntitlements],
    ["teacher_profiles", teacherProfiles],
    ["learning_sessions", sessionsResult],
    ["learning_sessions_all_time", allSessionsResult],
    ["answers", answersResult],
    ["student_sessions", studentSessionsResult],
    ["parent_assigned_activities", activitiesResult],
    ["parent_activity_status", statusesResult],
    ["parent_activity_attempts", attemptsResult],
    ["book_reading_sessions", bookSessionsResult],
    ["book_page_visits", bookVisitsResult],
    ["worksheet_student_status", worksheetStatusesResult],
    ["coin_transactions", coinRowsResult],
    ["analytics_events", analyticsEventsResult],
    ["analytics_events.public_worksheet_visits", publicWorksheetVisitorEventsResult],
    ["teacher_classes", teacherClassesResult],
    ["teacher_students", teacherStudentsResult],
    ["student_activities", studentActivitiesResult],
    ["classroom_activities", classroomActivitiesResult],
    ["worksheet_activities", worksheetActivitiesResult],
    ["solo_game_sessions", soloGameSessionsResult],
  ];

  for (const [table, result] of optionalSources) {
    if (!result.ok) sourceErrors.push({ table, message: result.error?.message || "source unavailable" });
  }

  let sessions = sessionsResult.ok ? filterByStudent(sessionsResult.rows, allowedStudentIds) : [];
  let answers = answersResult.ok ? filterByStudent(answersResult.rows, allowedStudentIds) : [];
  const studentSessions = studentSessionsResult.ok ? filterByStudent(studentSessionsResult.rows, allowedStudentIds) : [];
  let parentActivities = activitiesResult.ok ? filterByStudent(activitiesResult.rows, allowedStudentIds) : [];
  const parentStatuses = statusesResult.ok ? filterByStudent(statusesResult.rows, allowedStudentIds) : [];
  const parentAttempts = attemptsResult.ok ? filterByStudent(attemptsResult.rows, allowedStudentIds) : [];
  const bookSessions = bookSessionsResult.ok ? filterByStudent(bookSessionsResult.rows, allowedStudentIds) : [];
  const bookVisits = bookVisitsResult.ok ? filterByStudent(bookVisitsResult.rows, allowedStudentIds) : [];
  const worksheetStatuses = worksheetStatusesResult.ok ? filterByStudent(worksheetStatusesResult.rows, allowedStudentIds) : [];
  const coinRows = coinRowsResult.ok ? filterByStudent(coinRowsResult.rows, allowedStudentIds) : [];
  const allSessions = allSessionsResult.ok ? allSessionsResult.rows : [];
  const analyticsEvents = analyticsEventsResult.ok
    ? analyticsEventsResult.rows.filter((event) => {
        if (!event.student_id) return true;
        return allowedStudentIds.has(event.student_id);
      })
    : null;

  if (subjectQueryFilter) {
    answers = answers.filter((answer) => extractAnswerSubject(answer) === subjectQueryFilter);
    parentActivities = parentActivities.filter((activity) => normalizeSubject(activity.subject) === subjectQueryFilter);
  }

  const activeChildIds = new Set(sessions.map((session) => session.student_id));
  const totalMinutes = sum(sessions, (row) => row.duration_seconds) / 60;
  const correctAnswers = answers.filter((answer) => answer.is_correct === true).length;
  const overview = [
    parentProfiles.ok
      ? metric("Total parents", parentProfiles.rows.length, "parent_profiles")
      : unavailable("Total parents", "parent_profiles", parentProfiles.error),
    allEntitlements.ok
      ? metric("Parents with parent entitlement", allEntitlements.rows.filter((ent) => ent.persona === "parent").length, "account_persona_entitlements")
      : unavailable("Parents with parent entitlement", "account_persona_entitlements", allEntitlements.error),
    metric("Total children", students.length, "students"),
    metric("Active children in range", activeChildIds.size, "learning_sessions.student_id"),
    metric("Active children today", countDistinct(sessions.filter((s) => dateKey(s.started_at) === isoDateOnly(startOfUtcToday())), (s) => s.student_id), "learning_sessions"),
    metric("Active children 7 days", countDistinct(sessions.filter((s) => new Date(s.started_at).getTime() >= Date.now() - 7 * DAY_MS), (s) => s.student_id), "learning_sessions"),
    metric("Active children 30 days", countDistinct(sessions.filter((s) => new Date(s.started_at).getTime() >= Date.now() - 30 * DAY_MS), (s) => s.student_id), "learning_sessions"),
    analyticsEvents
      ? metric(
          "Active parents in range (events)",
          countDistinct(analyticsEvents.filter((event) => event.actor_type === "parent"), (event) => event.actor_id),
          "analytics_events actor_type=parent"
        )
      : notTracked("Active parents today / 7 / 30", "parent_dashboard_opened"),
    metric("Learning minutes", round(totalMinutes, 1), "learning_sessions.duration_seconds"),
    metric("Questions answered", answers.length, "answers"),
    metric("Average minutes per active child", activeChildIds.size ? round(totalMinutes / activeChildIds.size, 1) : 0, "learning_sessions"),
    metric("Average questions per active child", activeChildIds.size ? round(answers.length / activeChildIds.size, 1) : 0, "answers"),
    metric("Average accuracy", rate(correctAnswers, answers.length), "answers.is_correct", { unit: "%" }),
    metric("Learning sessions", sessions.length, "learning_sessions"),
    metric("Average session length", sessions.length ? round(totalMinutes / sessions.length, 1) : 0, "learning_sessions.duration_seconds", { unit: "Minutes" }),
    metric("Student logins", studentSessions.length, "student_sessions.started_at"),
  ];

  if (sessionsResult.partial) {
    overview.push(partialMetric("Session row-limit warning", sessions.length, "learning_sessions", sessionsResult.note));
  }
  if (answersResult.partial) {
    overview.push(partialMetric("Answer row-limit warning", answers.length, "answers", answersResult.note));
  }

  const children = buildChildrenAnalytics(students, sessions, answers);
  const learning = {
    cards: [
      metric("Sessions in range", sessions.length, "learning_sessions"),
      metric("Learning minutes in range", round(totalMinutes, 1), "learning_sessions.duration_seconds"),
      metric("Questions in range", answers.length, "answers"),
      metric("Accuracy in range", rate(correctAnswers, answers.length), "answers.is_correct", { unit: "%" }),
      metric(
        "Abandonment candidates — short sessions",
        sessions.filter((session) => safeNum(session.duration_seconds) > 0 && safeNum(session.duration_seconds) < 60).length,
        "learning_sessions.duration_seconds"
      ),
      metric(
        "Sessions not completed",
        sessions.filter((session) => session.status !== "completed").length,
        "learning_sessions.status"
      ),
    ],
    daily: buildDailySeries(sessions, answers),
    usage: buildSubjectTopicUsage(sessions, answers, studentById),
  };

  const parentAnalytics = buildParentAnalytics(students, parentActivities, parentStatuses, analyticsEvents);
  const parentActivityAnalytics = buildParentActivityAnalytics(parentActivities, parentStatuses, parentAttempts, studentById, analyticsEvents);
  const reportTruth = buildReportTruth(sessions, answers, parentActivities, parentAttempts, bookVisits, analyticsEvents);
  const mediaRewards = buildBooksWorksheetsRewards(bookSessions, bookVisits, worksheetStatuses, coinRows, activeChildIds, analyticsEvents);
  const accountAnalytics = buildAccountAnalytics(authUsersResult, parentProfiles, teacherProfiles, allEntitlements, range);
  const parentJoinAnalytics = buildParentJoinAnalytics(parentProfiles, allStudents, allSessions, analyticsEvents, range);
  const childJoinAnalytics = buildChildJoinAnalytics(allStudents, allSessions, range);
  const teacherAnalytics = buildTeacherAnalytics(
    teacherProfiles,
    allEntitlements,
    teacherClassesResult.ok ? teacherClassesResult : { rows: [] },
    teacherStudentsResult.ok ? teacherStudentsResult : { rows: [] },
    studentActivitiesResult.ok ? studentActivitiesResult : { rows: [] },
    classroomActivitiesResult.ok ? classroomActivitiesResult : { rows: [] },
    worksheetActivitiesResult.ok ? worksheetActivitiesResult : { rows: [] },
    analyticsEvents,
    range
  );
  const fallbackFunnelCounts = {
    student_login: studentSessions.length,
    practice_started: sessions.length,
    question_answered: answers.length,
    practice_completed: sessions.filter((session) => session.status === "completed").length,
    personal_activity_created: parentActivities.length,
    personal_activity_started: parentStatuses.filter((status) => status.started_at || status.status === "in_progress" || status.submitted_at).length,
    personal_activity_completed: parentStatuses.filter((status) => status.submitted_at || status.status === "submitted").length,
    book_opened: bookSessions.length,
    book_section_opened: bookVisits.length,
    reward_earned: coinRows.filter((row) => row.direction === "earn").length,
  };
  const funnels = buildFunnels(analyticsEvents, fallbackFunnelCounts);
  const retention = buildRetention(analyticsEvents, sessions, studentSessions, range);
  const abandonment = buildAbandonment(analyticsEvents, sessions, parentStatuses);
  const featureUsage = buildFeatureUsage(analyticsEvents);
  const authUsers = authUsersResult.ok ? authUsersResult.rows : [];
  const userActivity = buildUserActivityAnalytics({
    allStudents,
    parentProfiles,
    authUsers,
    learningSessions: sessionsResult.ok ? sessionsResult.rows : [],
    soloGameSessions: soloGameSessionsResult.ok ? soloGameSessionsResult.rows : [],
    answers: answersResult.ok ? answersResult.rows : [],
    studentSessions: studentSessionsResult.ok ? studentSessionsResult.rows : [],
    range,
  });
  const publicWorksheetVisits = buildPublicWorksheetVisitAnalytics(
    publicWorksheetVisitorEventsResult.ok ? publicWorksheetVisitorEventsResult.rows : null
  );

  const payload = {
    ok: true,
    filters: {
      range,
      grade: gradeFilter,
      subject: subjectFilter,
      childStatus: childStatusFilter,
    },
    sourceErrors,
    sections: {
      overview,
      accounts: accountAnalytics,
      parentJoin: parentJoinAnalytics,
      childJoin: childJoinAnalytics,
      teachers: teacherAnalytics,
      children,
      learning,
      parents: parentAnalytics,
      parentActivities: parentActivityAnalytics,
      reportTruth,
      booksAudioWorksheets: mediaRewards.booksAudioWorksheets,
      topBookPages: mediaRewards.topBookPages,
      rewards: mediaRewards.rewards,
      rewardsByDay: mediaRewards.rewardsByDay,
      rewardsByReason: mediaRewards.rewardsByReason,
      funnels,
      retention,
      abandonment,
      featureUsage,
      userActivity,
      publicWorksheetVisits,
    },
  };

  if (allSessionsResult.partial) {
    payload.sourceErrors = [
      ...(payload.sourceErrors || []),
      {
        source: "learning_sessions_all_time",
        note: allSessionsResult.note || "join metrics may be partial (row cap)",
      },
    ];
  }

  adminAnalyticsResponseCache.set(cacheKey, {
    expiresAt: Date.now() + ADMIN_ANALYTICS_CACHE_TTL_MS,
    payload,
  });

  return payload;
}
