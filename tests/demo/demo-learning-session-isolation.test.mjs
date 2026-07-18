/**
 * Demo learning session isolation — unit tests (no browser DB).
 * Run: node --test tests/demo/demo-learning-session-isolation.test.mjs
 */
import assert from "node:assert/strict";
import { test, describe, beforeEach, afterEach } from "node:test";
import { resolveStudentSessionView } from "../../lib/learning-client/resolveStudentSessionView.js";
import {
  DEMO_SESSION_STORAGE_KEY,
  DEMO_SESSION_VERSION,
  createDemoSession,
  clearDemoSession,
} from "../../lib/demo/demo-mode.client.js";
import {
  startLearningSession,
  saveLearningAnswer,
  finishLearningSession,
} from "../../lib/learning-client/learningActivityClient.js";

const LIOSH_ACTIVE_STUDENT_ID_KEY = "liosh_active_student_id";

/** @type {Map<string, string>} */
let store;

beforeEach(() => {
  store = new Map();
  globalThis.window = /** @type {typeof globalThis.window} */ ({});
  globalThis.localStorage = {
    getItem(key) {
      return store.get(key) ?? null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
  };
  globalThis.fetch = async () => {
    throw new Error("fetch must not be called in demo learning isolation tests");
  };
});

afterEach(() => {
  clearDemoSession();
  store.clear();
});

describe("demo learning session isolation", () => {
  test("demo student resolves without real student id or cache fallback", () => {
    store.set(LIOSH_ACTIVE_STUDENT_ID_KEY, "real-student-99");
    store.set("liosh_student_grade_real-student-99", "g5");

    const view = resolveStudentSessionView({
      status: "ok",
      student: {
        account_kind: "demo",
        full_name: "Demo Guest",
        grade_level: "g3",
        coin_balance: 0,
      },
      activeStudentId: "real-student-99",
      cachedGradeLevelRaw: "g5",
      demoGradeLevel: "g3",
    });

    assert.equal(view.studentId, "");
    assert.equal(view.gradeKey, "g3");
    assert.equal(view.gradeSource, "demo_session");
    assert.equal(view.gradeNumber, 3);
  });

  test("demo mode does not POST learning session APIs", async () => {
    createDemoSession("g3");

    const start = await startLearningSession({ subject: "math", activityId: "a1" });
    assert.equal(start.demo, true);
    assert.match(String(start.sessionId), /^demo-learning-/);

    const answer = await saveLearningAnswer({
      sessionId: start.sessionId,
      questionId: "q1",
      answer: "42",
    });
    assert.equal(answer.demo, true);
    assert.equal(answer.answer, "42");

    const finish = await finishLearningSession({ sessionId: start.sessionId });
    assert.equal(finish.demo, true);
  });

  test("guest with real id is not treated as demo", () => {
    createDemoSession("g3");

    const view = resolveStudentSessionView({
      status: "ok",
      student: {
        id: "guest-student-1",
        full_name: "Guest",
        grade_level: "g4",
        account_kind: "guest",
      },
      activeStudentId: "guest-student-1",
      demoGradeLevel: "g3",
    });

    assert.equal(view.studentId, "guest-student-1");
    assert.equal(view.gradeSource, "authoritative");
    assert.equal(view.gradeKey, "g4");
  });

  test("demo session storage key is global-specific", () => {
    assert.equal(DEMO_SESSION_STORAGE_KEY, "leokids_global_demo_session");
    const session = createDemoSession("g2");
    assert.equal(session.v, DEMO_SESSION_VERSION);
    assert.equal(session.gradeLevel, "g2");
  });
});
