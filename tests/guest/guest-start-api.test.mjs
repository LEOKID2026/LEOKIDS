/**
 * Guest start API — controlled failures and happy path (mocked deps).
 * Run: node --test tests/guest/guest-start-api.test.mjs
 */

import { describe, test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createGuestStartHandler } from "../../lib/guest/guest-start-handler.server.js";
import {
  classifyGuestStartThrownError,
  mapGuestStartResultError,
  GUEST_START_ERROR_CODES,
} from "../../lib/guest/guest-start-errors.server.js";
import { GUEST_SYSTEM_PARENT_EMAIL, GUEST_SYSTEM_PARENT_EMAIL_IL } from "../../lib/guest/constants.js";
import {
  GLOBAL_WRITE_DISABLED_CODE,
  withGlobalWriteBarrier,
} from "../../lib/global/write-barrier.js";

const ORIGINAL_ENV = { ...process.env };

function mockReq(body = {}) {
  return {
    method: "POST",
    body,
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
    },
  };
}

function mockRes() {
  /** @type {{ statusCode: number|null, body: any, headers: Record<string,string>, cookies: string[] }} */
  const state = { statusCode: null, body: null, headers: {}, cookies: [] };
  const res = {
    status(code) {
      state.statusCode = code;
      return res;
    },
    json(body) {
      state.body = body;
      return res;
    },
    setHeader(name, value) {
      state.headers[String(name).toLowerCase()] = String(value);
      if (String(name).toLowerCase() === "set-cookie") {
        state.cookies.push(String(value));
      }
      return res;
    },
    end(payload) {
      if (payload && state.body == null) {
        try {
          state.body = JSON.parse(String(payload));
        } catch {
          state.body = payload;
        }
      }
      return res;
    },
    state,
  };
  // respondGlobalWritesDisabled sets statusCode directly
  Object.defineProperty(res, "statusCode", {
    get() {
      return state.statusCode;
    },
    set(v) {
      state.statusCode = v;
    },
    configurable: true,
  });
  return res;
}

function restoreEnv() {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) delete process.env[key];
  }
  for (const [k, v] of Object.entries(ORIGINAL_ENV)) {
    process.env[k] = v;
  }
}

beforeEach(() => {
  process.env.NODE_ENV = "test";
  process.env.GLOBAL_DATA_WRITES_ENABLED = "true";
  process.env.GLOBAL_MOCK_MODE = "false";
});

afterEach(() => {
  restoreEnv();
});

describe("guest-start error classification", () => {
  test("maps missing supabase config", () => {
    const mapped = classifyGuestStartThrownError(
      new Error("Missing LEARNING_SUPABASE_SERVICE_ROLE_KEY")
    );
    assert.equal(mapped.code, GUEST_START_ERROR_CODES.MISSING_LEARNING_SUPABASE_CONFIG);
    assert.equal(mapped.error, "The service is not configured correctly.");
    assert.equal(mapped.status, 500);
  });

  test("maps missing student access secret", () => {
    const mapped = classifyGuestStartThrownError(
      new Error("Missing LEARNING_STUDENT_ACCESS_SECRET")
    );
    assert.equal(mapped.code, GUEST_START_ERROR_CODES.MISSING_STUDENT_ACCESS_SECRET);
    assert.equal(mapped.error, "The service is not configured correctly.");
  });

  test("maps guest mode disabled result", () => {
    const mapped = mapGuestStartResultError({
      status: 403,
      code: "guest_mode_disabled",
      message: "Guest mode is currently disabled.",
    });
    assert.equal(mapped.code, "guest_mode_disabled");
    assert.equal(mapped.status, 403);
  });

  test("maps missing global system parent", () => {
    const mapped = mapGuestStartResultError({
      status: 503,
      code: "guest_system_parent_not_found",
    });
    assert.equal(mapped.code, "guest_system_parent_not_found");
    assert.equal(mapped.status, 503);
  });

  test("client payload never includes secret-looking fields", () => {
    const mapped = classifyGuestStartThrownError(
      new Error("Missing LEARNING_SUPABASE_SERVICE_ROLE_KEY=super-secret-value")
    );
    const json = JSON.stringify(mapped);
    assert.doesNotMatch(json, /super-secret-value/);
    assert.doesNotMatch(json, /stack/i);
  });
});

describe("POST /api/student/guest/start", () => {
  test("writes disabled → 503 GLOBAL_DATA_WRITES_DISABLED", async () => {
    process.env.GLOBAL_DATA_WRITES_ENABLED = "false";
    const wrapped = withGlobalWriteBarrier(
      createGuestStartHandler({
        getLearningSupabaseServiceRoleClient() {
          assert.fail("must not reach supabase when writes are disabled");
        },
      })
    );
    const res = mockRes();
    await wrapped(mockReq({}), res);
    assert.equal(res.state.statusCode, 503);
    assert.equal(res.state.body?.error, GLOBAL_WRITE_DISABLED_CODE);
    assert.equal(res.state.body?.ok, false);
  });

  test("missing supabase config → missing_learning_supabase_config", async () => {
    const handler = createGuestStartHandler({
      getLearningSupabaseServiceRoleClient() {
        throw new Error("Missing LEARNING_SUPABASE_SERVICE_ROLE_KEY");
      },
    });
    const res = mockRes();
    const logs = [];
    const originalError = console.error;
    console.error = (...args) => {
      logs.push(args);
    };
    try {
      await handler(mockReq({}), res);
    } finally {
      console.error = originalError;
    }
    assert.equal(res.state.statusCode, 500);
    assert.equal(res.state.body?.code, "missing_learning_supabase_config");
    assert.equal(res.state.body?.error, "The service is not configured correctly.");
    assert.equal(res.state.body?.ok, false);
    assert.equal(res.state.body?.stack, undefined);
    const logBlob = JSON.stringify(logs);
    assert.match(logBlob, /supabase_client/);
    assert.doesNotMatch(logBlob, /service.role.key\s*=/i);
    assert.ok(res.state.cookies.some((c) => /liosh_student_session=/.test(c) && /Max-Age=0/.test(c)));
  });

  test("missing student access secret → missing_student_access_secret", async () => {
    const handler = createGuestStartHandler({
      getLearningSupabaseServiceRoleClient: () => ({}),
      async startGuestStudent() {
        throw new Error("Missing LEARNING_STUDENT_ACCESS_SECRET");
      },
    });
    const res = mockRes();
    await handler(mockReq({}), res);
    assert.equal(res.state.statusCode, 500);
    assert.equal(res.state.body?.code, "missing_student_access_secret");
    assert.equal(res.state.body?.error, "The service is not configured correctly.");
  });

  test("guest disabled → 403 guest_mode_disabled", async () => {
    const handler = createGuestStartHandler({
      getLearningSupabaseServiceRoleClient: () => ({}),
      async startGuestStudent() {
        return {
          ok: false,
          status: 403,
          code: "guest_mode_disabled",
          message: "Guest mode is currently disabled.",
        };
      },
    });
    const res = mockRes();
    await handler(mockReq({}), res);
    assert.equal(res.state.statusCode, 403);
    assert.equal(res.state.body?.code, "guest_mode_disabled");
    assert.equal(res.state.body?.ok, false);
  });

  test("global system parent missing → 503 guest_system_parent_not_found", async () => {
    const handler = createGuestStartHandler({
      getLearningSupabaseServiceRoleClient: () => ({}),
      async startGuestStudent() {
        return {
          ok: false,
          status: 503,
          code: "guest_system_parent_not_found",
          message: "The guest system is not ready.",
        };
      },
    });
    const res = mockRes();
    await handler(mockReq({}), res);
    assert.equal(res.state.statusCode, 503);
    assert.equal(res.state.body?.code, "guest_system_parent_not_found");
  });

  test("happy path → 200, global product, session cookie, no IL parent email", async () => {
    assert.equal(GUEST_SYSTEM_PARENT_EMAIL, "guest-system-global@liosh.invalid");
    assert.notEqual(GUEST_SYSTEM_PARENT_EMAIL, GUEST_SYSTEM_PARENT_EMAIL_IL);

    let setCookieToken = null;
    const handler = createGuestStartHandler({
      getLearningSupabaseServiceRoleClient: () => ({ tag: "service-role" }),
      async startGuestStudent(supabase) {
        assert.equal(supabase.tag, "service-role");
        return {
          ok: true,
          student: {
            id: "stu-global-1",
            full_name: "Guest 48291301",
            grade_level: "g3",
            account_kind: "guest",
            leo_number: "48291301",
            guest_status: "active",
            product_id: "leokids_global",
          },
          sessionToken: "session-token-value",
          resumeToken: "resume-token-value",
          leoNumber: "48291301",
          sessionId: "sess-1",
        };
      },
      setStudentSessionCookie(res, token) {
        setCookieToken = token;
        res.setHeader(
          "Set-Cookie",
          `liosh_student_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
        );
      },
      clearStudentSessionCookie() {},
    });

    const res = mockRes();
    await handler(mockReq({}), res);
    assert.equal(res.state.statusCode, 200);
    assert.equal(res.state.body?.ok, true);
    assert.equal(res.state.body?.student?.product_id, "leokids_global");
    assert.equal(setCookieToken, "session-token-value");
    assert.ok(res.state.cookies.some((c) => c.includes("liosh_student_session=session-token-value")));
    assert.doesNotMatch(JSON.stringify(res.state.body), /guest-system@liosh\.invalid/);
    assert.doesNotMatch(JSON.stringify(res.state.body), /service.role/i);
  });

  test("failure after student create → no valid cookie, clear code, no secret leak", async () => {
    const handler = createGuestStartHandler({
      getLearningSupabaseServiceRoleClient: () => ({}),
      async startGuestStudent() {
        return {
          ok: false,
          status: 500,
          code: "session_create_failed",
          message: "Server error.",
        };
      },
      setStudentSessionCookie() {
        assert.fail("must not set session cookie on failure");
      },
    });
    const res = mockRes();
    await handler(mockReq({}), res);
    assert.equal(res.state.statusCode, 500);
    assert.equal(res.state.body?.code, "session_create_failed");
    assert.equal(res.state.body?.ok, false);
    const blob = JSON.stringify(res.state.body);
    assert.doesNotMatch(blob, /LEARNING_STUDENT_ACCESS_SECRET/);
    assert.doesNotMatch(blob, /service_role/i);
    assert.ok(res.state.cookies.some((c) => /Max-Age=0/.test(c)));
  });
});
