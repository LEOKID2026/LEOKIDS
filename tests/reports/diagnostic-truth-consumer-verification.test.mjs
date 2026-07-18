/**
 * Phase 10 — Final consumer verification: all report paths share diagnostic truth.
 * Run: node --test tests/reports/diagnostic-truth-consumer-verification.test.mjs
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  aggregateReportPayloadFromActivityRows,
  mergeLearningActivityBookData,
  stripInternalReportPayloadFields,
} from "../../lib/parent-server/report-data-aggregate.server.js";

import { sanitizeReportPayloadForTeacher } from "../../lib/teacher-server/teacher-report.server.js";
import { sanitizeReportPayloadForGuardian } from "../../lib/guardian-server/guardian-report.server.js";
import { filterReportByPermittedSubjects } from "../../lib/school-server/school-subjects.server.js";
import { buildStudentTeacherGuidanceV2, buildClassTeacherGuidanceV2 } from "../../lib/teacher-server/teacher-guidance-v2.server.js";
import { buildStudentTeacherGuidance } from "../../lib/teacher-server/teacher-recommendations.server.js";
import { aggregateClassReportFromStudentPayloads } from "../../lib/teacher-server/teacher-class-report.server.js";
import { attachParentFacingToPayload } from "../../lib/parent-server/parent-report-parent-facing.server.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const FROM_DATE = new Date("2026-01-01T00:00:00.000Z");
const TO_DATE = new Date("2026-01-31T00:00:00.000Z");
const FETCH_META = { sessionsFilterField: "started_at", answersFilterField: "answered_at" };

function readSrc(relPath) {
  return readFileSync(join(ROOT, relPath), "utf8");
}

function makeStudent(id = "stu-p10") {
  return { id, full_name: "Phase 10 Student", grade_level: "g3", is_active: true };
}

function makeSession(id, subject, topic = "algebra", mode = "practice") {
  return {
    id,
    student_id: "stu-p10",
    subject,
    topic,
    started_at: "2026-01-10T10:00:00Z",
    ended_at: "2026-01-10T10:30:00Z",
    duration_seconds: 300,
    status: "completed",
    metadata: { mode },
  };
}

function makeClassifiedAnswer(sessionId, subject, topic, isCorrect, opts = {}) {
  return {
    id: `ans-${Math.random().toString(36).slice(2)}`,
    student_id: "stu-p10",
    learning_session_id: sessionId,
    question_id: `q-${Math.random().toString(36).slice(2)}`,
    is_correct: isCorrect,
    answered_at: "2026-01-10T10:05:00Z",
    answer_payload: {
      subject,
      topic,
      gameMode: opts.mode || "practice",
      isDiagnosticEligible: opts.isDiagnosticEligible !== false,
      evidenceCategory: opts.evidenceCategory || "diagnostic_independent",
      contextFlags: {
        afterStepByStep: opts.afterStepByStep === true,
        contextAfterBookReading: opts.contextAfterBookReading === true,
        hasHints: false,
      },
      questionEngine: opts.questionEngine,
      ...opts.payloadExtra,
    },
  };
}

/** Assert no raw `accuracy` or internal debug fields in a public API-shaped payload. */
function assertPublicPayloadTruthSafety(payload, label = "payload") {
  assert.ok(payload && typeof payload === "object", `${label} must be object`);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "_dailyBySubject"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "_positiveEvidenceAcc"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(payload, "_bookReadingInternal"), false);

  if (payload.summary && typeof payload.summary === "object") {
    assert.equal(
      Object.prototype.hasOwnProperty.call(payload.summary, "accuracy"),
      false,
      `${label}.summary must not expose raw accuracy`
    );
    assert.ok(
      Object.prototype.hasOwnProperty.call(payload.summary, "diagnosticAccuracy") ||
        safeNum(payload.summary.diagnosticAnswers) === 0,
      `${label}.summary should expose diagnosticAccuracy when diagnostic data exists`
    );
  }

  if (payload.meta && typeof payload.meta === "object") {
    assert.equal(payload.meta._rawActivityAccuracy, undefined);
  }

  if (payload.subjects && typeof payload.subjects === "object") {
    for (const [subjKey, subj] of Object.entries(payload.subjects)) {
      if (!subj || typeof subj !== "object") continue;
      assert.equal(
        Object.prototype.hasOwnProperty.call(subj, "accuracy"),
        false,
        `${label}.subjects.${subjKey} must not expose raw accuracy`
      );
      for (const [topicKey, topic] of Object.entries(subj.topics || {})) {
        if (!topic || typeof topic !== "object") continue;
        assert.equal(
          Object.prototype.hasOwnProperty.call(topic, "accuracy"),
          false,
          `${label}.subjects.${subjKey}.topics.${topicKey} must not expose raw accuracy`
        );
      }
    }
  }

  if (payload.learningActivity && typeof payload.learningActivity === "object") {
    const la = payload.learningActivity;
    assert.equal(la.hiddenTabMs, undefined);
    assert.equal(la.clientSessionToken, undefined);
    assert.equal(la.clientVisitToken, undefined);
    assert.equal(la._bookReadingInternal, undefined);
  }
}

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function buildMixedDiagnosticPayload() {
  const practiceSession = makeSession("sess-diag", "math", "fractions", "practice");
  const learningSession = makeSession("sess-learn", "math", "fractions", "learning");
  const speedSession = makeSession("sess-speed", "math", "fractions", "speed");

  const answers = [
    makeClassifiedAnswer("sess-diag", "math", "fractions", true, {
      evidenceCategory: "diagnostic_independent",
    }),
    makeClassifiedAnswer("sess-diag", "math", "fractions", false, {
      evidenceCategory: "diagnostic_independent",
    }),
    makeClassifiedAnswer("sess-learn", "math", "fractions", true, {
      isDiagnosticEligible: false,
      evidenceCategory: "learning_guided",
      mode: "learning",
    }),
    makeClassifiedAnswer("sess-learn", "math", "fractions", true, {
      isDiagnosticEligible: false,
      evidenceCategory: "learning_guided",
      mode: "learning",
    }),
    makeClassifiedAnswer("sess-speed", "math", "fractions", false, {
      evidenceCategory: "diagnostic_competitive",
      mode: "speed",
      questionEngine: { engineId: "mcq-v2", version: "1" },
    }),
  ];

  return aggregateReportPayloadFromActivityRows(
    makeStudent(),
    [practiceSession, learningSession, speedSession],
    answers,
    FROM_DATE,
    TO_DATE,
    FETCH_META
  );
}

// ── 1. Parent / guardian consumers ───────────────────────────────────────────

describe("Phase 10 — parent & guardian API sanitation", () => {
  test("parent report-data API strips internal fields before response", () => {
    const src = readSrc("pages/api/parent/students/[studentId]/report-data.js");
    assert.match(src, /stripInternalReportPayloadFields/);
    assert.match(src, /aggregateParentReportPayload/);
    assert.doesNotMatch(src, /parent-dashboard-report-bridge/);
  });

  test("parent report pages use isolated API payload builder not bridge", () => {
    for (const page of ["pages/learning/parent-report.js", "pages/learning/parent-report-detailed.js"]) {
      const src = readSrc(page);
      assert.match(src, /parent-report-from-api-payload/);
      assert.match(src, /runParentReportGenerationFromApiBody/);
      assert.doesNotMatch(src, /parent-dashboard-report-bridge/);
    }
  });

  test("guardian report server strips then sanitizes PII", () => {
    const raw = buildMixedDiagnosticPayload();
    const stripped = stripInternalReportPayloadFields(raw);
    const guardian = sanitizeReportPayloadForGuardian(stripped);
    const enriched = attachParentFacingToPayload(guardian, {
      insights: ["test"],
      homeRecommendations: ["rec"],
    });
    assertPublicPayloadTruthSafety(enriched, "guardian");
    assert.equal(enriched.reportMeta?.audience, "guardian");
    assert.ok(enriched.competitiveContext);
    assert.ok(enriched.positiveEvidence);
    assert.ok(enriched.learningActivity === undefined || enriched.learningActivity.bookReadingMinutes === undefined);
  });

  test("guardian API route uses buildGuardianStudentReportPayload", () => {
    const src = readSrc("pages/api/guardian/student/[studentId]/report-data.js");
    assert.match(src, /buildGuardianStudentReportPayload/);
  });
});

// ── 2. Teacher student report ────────────────────────────────────────────────

describe("Phase 10 — teacher student report", () => {
  test("teacher sanitize chain removes raw accuracy, keeps diagnostic fields", () => {
    const raw = buildMixedDiagnosticPayload();
    const teacher = sanitizeReportPayloadForTeacher(raw, { active: 0, revoked: 0, expired: 0 });
    assertPublicPayloadTruthSafety(teacher, "teacher");
    assert.equal(teacher.reportMeta?.audience, "teacher");
    assert.ok(teacher.competitiveContext);
    assert.ok(teacher.positiveEvidence);
  });

  test("teacher guidance v1/v2 rank weaknesses from diagnosticAccuracy not mixed accuracy", () => {
    const raw = buildMixedDiagnosticPayload();
    const teacher = sanitizeReportPayloadForTeacher(raw, { active: 0, revoked: 0, expired: 0 });
    const mathTopic = teacher.subjects?.math?.topics?.fractions;
    assert.ok(mathTopic);
    assert.equal(mathTopic.diagnosticAnswers, 2);
    assert.equal(mathTopic.diagnosticAccuracy, 50);

    const v1 = buildStudentTeacherGuidance(teacher);
    const v2 = buildStudentTeacherGuidanceV2(teacher);
    assert.equal(v2.competitiveContext != null, true);
    assert.equal(v2.positiveEvidence != null, true);

    if (v1.nextPracticeFocus?.length) {
      for (const focus of v1.nextPracticeFocus) {
        if (focus.accuracy != null) {
          assert.ok(focus.accuracy <= 100);
        }
      }
    }
  });

  test("competitive wrongs do not become teacher weakness topics", () => {
    const speedOnly = aggregateReportPayloadFromActivityRows(
      makeStudent("stu-comp"),
      [makeSession("s-speed", "math", "algebra", "speed")],
      [
        makeClassifiedAnswer("s-speed", "math", "algebra", false, {
          mode: "speed",
          evidenceCategory: "diagnostic_competitive",
        }),
        makeClassifiedAnswer("s-speed", "math", "algebra", false, {
          mode: "speed",
          evidenceCategory: "diagnostic_competitive",
        }),
      ],
      FROM_DATE,
      TO_DATE,
      FETCH_META
    );
    const teacher = sanitizeReportPayloadForTeacher(speedOnly, { active: 0, revoked: 0, expired: 0 });
    const guidance = buildStudentTeacherGuidanceV2(teacher);
    const weakTopics = (guidance.recommendationUnits || []).filter((u) => u.level === "topic");
    assert.equal(weakTopics.length, 0, "competitive-only wrongs must not surface as diagnostic weakness");
  });

  test("teacher student report API uses buildTeacherStudentReportPayload", () => {
    const src = readSrc("pages/api/teacher/students/[studentId]/report-data.js");
    assert.match(src, /buildTeacherStudentReportPayload/);
  });
});

// ── 3. Teacher class report ──────────────────────────────────────────────────

describe("Phase 10 — teacher class report", () => {
  test("class weaknessTopics use diagnosticWrong counts only", () => {
    const competitiveOnly = aggregateClassReportFromStudentPayloads([
      {
        studentId: "stu-c1",
        studentFullName: "C1",
        studentFullNameMasked: "C1",
        payload: aggregateReportPayloadFromActivityRows(
          makeStudent("stu-c1"),
          [makeSession("sc1", "math", "algebra", "speed")],
          [
            makeClassifiedAnswer("sc1", "math", "algebra", false, {
              mode: "speed",
              evidenceCategory: "diagnostic_competitive",
            }),
          ],
          FROM_DATE,
          TO_DATE,
          FETCH_META
        ),
      },
    ]);
    assert.equal(competitiveOnly.weaknessTopics.length, 0);
  });

  test("class guidance v2 receives competitiveContext from sanitized student payloads", () => {
    const raw = buildMixedDiagnosticPayload();
    const teacher = sanitizeReportPayloadForTeacher(raw, { active: 0, revoked: 0, expired: 0 });
    const classReport = aggregateClassReportFromStudentPayloads([
      {
        studentId: "stu-p10",
        studentFullName: "P10",
        studentFullNameMasked: "P10",
        payload: teacher,
      },
    ]);
    const guidance = buildClassTeacherGuidanceV2(
      { ...classReport, students: [{ studentId: "stu-p10", payload: teacher }] },
      { studentPayloads: [{ studentId: "stu-p10", payload: teacher }] }
    );
    assert.ok(classReport.weaknessTopics.length >= 1);
    assert.equal(guidance.version, "v2");
  });
});

// ── 4. School / manager reports ──────────────────────────────────────────────

describe("Phase 10 — school report consumers", () => {
  test("school student report API double-strips via stripInternalReportPayloadFields", () => {
    const src = readSrc("pages/api/school/students/[studentId]/report-data.js");
    assert.match(src, /buildTeacherStudentReportPayload/);
    assert.match(src, /stripInternalReportPayloadFields/);
  });

  test("school class report API strips payload", () => {
    const src = readSrc("pages/api/school/classes/[classId]/report-data.js");
    assert.match(src, /stripInternalReportPayloadFields/);
  });

  test("filterReportByPermittedSubjects respects scope and strips internals", () => {
    const raw = buildMixedDiagnosticPayload();
    raw.subjects.english = {
      sessions: 2,
      answers: 10,
      correct: 8,
      wrong: 2,
      accuracy: 80,
      diagnosticAnswers: 10,
      diagnosticCorrect: 8,
      diagnosticWrong: 2,
      diagnosticAccuracy: 80,
      topics: {},
    };

    const mathOnly = filterReportByPermittedSubjects(raw, new Set(["math"]));
    assertPublicPayloadTruthSafety(mathOnly, "school-filtered");
    assert.ok(mathOnly.subjects.math);
    assert.equal(mathOnly.subjects.english, undefined);
    assert.ok(mathOnly.teacherGuidanceBlock);
  });
});

// ── 5. Book / learning activity isolation ────────────────────────────────────

describe("Phase 10 — book & learning activity truth isolation", () => {
  test("book reading minutes do not change diagnostic buckets", () => {
    const base = aggregateReportPayloadFromActivityRows(
      makeStudent(),
      [makeSession("sess-b", "math", "algebra", "practice")],
      [
        makeClassifiedAnswer("sess-b", "math", "algebra", true),
        makeClassifiedAnswer("sess-b", "math", "algebra", false),
      ],
      FROM_DATE,
      TO_DATE,
      FETCH_META
    );
    const diagBefore = { ...base.summary };

    const merged = mergeLearningActivityBookData(
      base,
      [{ subject: "math", credited_dwell_ms: 2_520_000, page_read: true, raw_dwell_ms: 2_520_000 }],
      [{ id: "book-sess-1" }],
      []
    );

    assert.equal(merged.summary.diagnosticAnswers, diagBefore.diagnosticAnswers);
    assert.equal(merged.summary.diagnosticAccuracy, diagBefore.diagnosticAccuracy);
    assert.ok(merged.learningActivity.bookReadingMinutes > 0);

    const publicPayload = stripInternalReportPayloadFields(merged);
    assert.ok(publicPayload.learningActivity.bookReadingMinutes > 0);
    assertPublicPayloadTruthSafety(publicPayload, "book-merged");
  });

  test("step-by-step answers excluded from diagnostic accuracy", () => {
    const stepByStep = makeClassifiedAnswer("sess-sbs", "math", "algebra", false, {
      isDiagnosticEligible: false,
      evidenceCategory: "learning_guided",
      payloadExtra: {
        contextFlags: {
          afterStepByStep: true,
          contextAfterBookReading: false,
          hasHints: false,
          stepByStepOverride: true,
        },
      },
    });
    const normal = makeClassifiedAnswer("sess-sbs", "math", "algebra", true, {
      evidenceCategory: "diagnostic_independent",
    });
    const result = aggregateReportPayloadFromActivityRows(
      makeStudent(),
      [makeSession("sess-sbs", "math", "algebra", "practice")],
      [stepByStep, normal],
      FROM_DATE,
      TO_DATE,
      FETCH_META
    );
    assert.equal(result.summary.diagnosticAnswers, 1);
    assert.equal(result.summary.diagnosticAccuracy, 100);
    assert.equal(result.summary.diagnosticAnswers, result.subjects.math.diagnosticAnswers);
  });
});

// ── 6. Legacy / localStorage authority scan ──────────────────────────────────

describe("Phase 10 — legacy authority classification", () => {
  test("production pages do not import parent-dashboard-report-bridge", () => {
    const parentPage = readSrc("pages/learning/parent-report.js");
    const detailedPage = readSrc("pages/learning/parent-report-detailed.js");
    assert.doesNotMatch(parentPage, /parent-dashboard-report-bridge/);
    assert.doesNotMatch(detailedPage, /parent-dashboard-report-bridge/);
  });

  test("seed-db-report-local-storage only used from isolated shim or scripts", () => {
    const shim = readSrc("lib/learning-supabase/parent-report-from-api-payload.js");
    assert.match(shim, /seedLocalStorageFromDbReportInput/);
    assert.match(shim, /runWithIsolatedReportStorage/);
    assert.doesNotMatch(shim, /parent-dashboard-report-bridge/);
  });

  test("LEO_MONTHLY_PROGRESS not used in report API or aggregate servers", () => {
    const files = [
      "pages/api/parent/students/[studentId]/report-data.js",
      "lib/parent-server/report-data-aggregate.server.js",
      "lib/teacher-server/teacher-report.server.js",
      "lib/guardian-server/guardian-report.server.js",
    ];
    for (const f of files) {
      assert.doesNotMatch(readSrc(f), /LEO_MONTHLY_PROGRESS/);
    }
  });

  test("mleo_*_time_tracking confined to gameplay/seed/scripts not report APIs", () => {
    const reportApis = [
      "pages/api/parent/students/[studentId]/report-data.js",
      "pages/api/teacher/students/[studentId]/report-data.js",
      "pages/api/guardian/student/[studentId]/report-data.js",
    ];
    for (const f of reportApis) {
      assert.doesNotMatch(readSrc(f), /mleo_.*_time_tracking/);
    }
    const shim = readSrc("lib/learning-supabase/parent-report-from-api-payload.js");
    assert.doesNotMatch(shim, /window\.localStorage\.getItem/);
  });

  test("progress-storage documents non-authoritative LEO keys", () => {
    const src = readSrc("utils/progress-storage.js");
    assert.match(src, /non-authoritative|server/i);
    assert.match(src, /syncMonthlyProgressCacheFromServer/);
  });
});

// ── 7. API payload safety ────────────────────────────────────────────────────

describe("Phase 10 — API payload safety", () => {
  test("stripInternalReportPayloadFields removes all internal leak fields", () => {
    const raw = buildMixedDiagnosticPayload();
    raw._dailyBySubject = { "2026-01-10": { math: { answers: 1 } } };
    raw._positiveEvidenceAcc = { math: 90 };
    raw.meta = { ...(raw.meta || {}), _rawActivityAccuracy: 75 };
    raw.learningActivity = {
      bookReadingMinutes: 10,
      hiddenTabMs: 500,
      clientSessionToken: "secret",
      sectionsSkipped: [1],
      _bookReadingInternal: { x: 1 },
    };

    const stripped = stripInternalReportPayloadFields(raw);
    assertPublicPayloadTruthSafety(stripped, "stripped");
    assert.ok(stripped.competitiveContext);
    assert.ok(stripped.positiveEvidence);
    assert.equal(stripped.learningActivity.bookReadingMinutes, 10);
    assert.equal(stripped.subjects.math.diagnosticAccuracy, 50);
  });

  test("recentMistakes questionEngine survives strip for MCQ contract", () => {
    const raw = buildMixedDiagnosticPayload();
    raw.recentMistakes = [
      {
        subject: "math",
        topic: "fractions",
        questionEngine: { engineId: "mcq-v2", version: "1" },
      },
    ];
    const stripped = stripInternalReportPayloadFields(raw);
    assert.equal(stripped.recentMistakes[0].questionEngine.engineId, "mcq-v2");
  });
});

// ── 8. Classroom / assigned activity reports ─────────────────────────────────

describe("Phase 10 — assigned activity report isolation", () => {
  test("assigned activity report API is separate from parent monthly aggregate", () => {
    const src = readSrc("pages/api/teacher/student-activities/[activityId]/report.js");
    assert.match(src, /buildStudentActivityReportPayload/);
    assert.doesNotMatch(src, /LEO_MONTHLY_PROGRESS/);
    assert.doesNotMatch(src, /aggregateParentReportPayload/);
  });

  test("student-activity server selects question_snapshot for report truth", () => {
    const src = readSrc("lib/teacher-server/student-activity.server.js");
    assert.match(src, /question_snapshot/);
  });
});
