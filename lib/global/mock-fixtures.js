/**
 * Preview / mock fixtures for UI development without production writes.
 */

import { localizeReportContract } from "../reports/localize-report-contract.js";

export const MOCK_PARENT = Object.freeze({
  id: "mock-parent-001",
  email: "parent.preview@leokids.global",
  displayName: "Alex Parent",
  productId: "leokids_global",
  interfaceLanguage: "en",
  preferredReportLanguage: "en",
});

export const MOCK_STUDENTS = Object.freeze([
  {
    id: "mock-student-001",
    parentId: MOCK_PARENT.id,
    displayName: "Jamie",
    grade: "g3",
    accessCode: "DEMO-JAMIE",
    productId: "leokids_global",
  },
  {
    id: "mock-student-002",
    parentId: MOCK_PARENT.id,
    displayName: "Sam",
    grade: "g5",
    accessCode: "DEMO-SAM",
    productId: "leokids_global",
  },
]);

export const MOCK_PROGRESS = Object.freeze({
  studentId: MOCK_STUDENTS[0].id,
  subjects: {
    math: { accuracy: 78, questions: 40, streakDays: 3 },
    geometry: { accuracy: 72, questions: 22, streakDays: 1 },
    english: { accuracy: 85, questions: 30, streakDays: 4 },
    science: { accuracy: 70, questions: 18, streakDays: 2 },
  },
});

export const MOCK_REPORT_CONTRACT = Object.freeze({
  type: "topic_needs_strengthening",
  subject: "math",
  topic: "vertical_addition",
  metrics: { questions: 12, accuracy: 58, wrong: 5 },
  recommendedAction: "remediate_same_level",
});

export const MOCK_SESSION_RESULT = Object.freeze({
  sessionId: "mock-session-001",
  subject: "math",
  topic: "vertical_addition",
  grade: "g3",
  questions: 10,
  correct: 7,
  accuracy: 70,
  finishedAt: "2026-07-15T12:00:00.000Z",
});

/**
 * @param {string} accessCode
 */
export function findMockStudentByAccessCode(accessCode) {
  const code = String(accessCode || "").trim().toUpperCase();
  return MOCK_STUDENTS.find((s) => s.accessCode.toUpperCase() === code) || null;
}

/**
 * @param {string} email
 * @param {string} _password
 */
export function authenticateMockParent(email, _password) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) return null;
  if (e === MOCK_PARENT.email.toLowerCase() || e.endsWith("@leokids.global")) {
    return { ...MOCK_PARENT, email: e };
  }
  return { ...MOCK_PARENT, email: e };
}

/**
 * Mock report contract + localized English strings (no DB).
 * @param {string} [locale]
 */
export function getMockLocalizedReport(locale = "en") {
  return {
    contract: MOCK_REPORT_CONTRACT,
    localized: localizeReportContract(MOCK_REPORT_CONTRACT, locale),
    progress: MOCK_PROGRESS,
    student: MOCK_STUDENTS[0],
  };
}
