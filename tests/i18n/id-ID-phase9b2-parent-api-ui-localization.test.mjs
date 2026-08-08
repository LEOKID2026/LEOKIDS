/**
 * Indonesian Master Phase 9B-2 — Parent API/UI localization (code-first, no raw English).
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import {
  mapParentApiFailurePayload,
  mapParentDashboardApiErrorPayload,
  mapParentPanelApiErrorPayload,
  mapParentReportLoadErrorPayload,
  resolveParentApiErrorDisplay,
} from "../../lib/parent-client/parent-api-errors.js";

const ROOT = process.cwd();

/** @type {Record<string, string>} */
const EN_UI = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/ui.json"), "utf8")
);
/** @type {Record<string, string>} */
const ID_UI = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/id-ID/ui.json"), "utf8")
);
/** @type {Record<string, unknown>} */
const EN_VAL = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/en/validation.json"), "utf8")
);
/** @type {Record<string, unknown>} */
const ID_VAL = JSON.parse(
  fs.readFileSync(path.join(ROOT, "locales/id-ID/validation.json"), "utf8")
);

/**
 * Minimal t() that resolves parent / ui.parent / validation.api keys from locale packs.
 * @param {"en"|"id-ID"} locale
 */
function makeT(locale) {
  const ui = locale === "id-ID" ? ID_UI : EN_UI;
  const val = locale === "id-ID" ? ID_VAL : EN_VAL;
  return (key, params = {}) => {
    const parts = String(key).split(".");
    let cur = null;
    if (parts[0] === "validation") {
      cur = val;
      for (const p of parts.slice(1)) cur = cur?.[p];
    } else if (parts[0] === "ui" && parts[1] === "parent") {
      cur = ui.parent;
      for (const p of parts.slice(2)) cur = cur?.[p];
    } else if (parts[0] === "parent") {
      cur = ui.parent;
      for (const p of parts.slice(1)) cur = cur?.[p];
    }
    let out = typeof cur === "string" ? cur : key;
    for (const [k, v] of Object.entries(params || {})) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
    return out;
  };
}

const EN_PROSE_SAMPLES = [
  "Username is already taken",
  "Invalid PIN",
  "Could not create access code",
  "Could not create student",
  "Could not update student",
  "Child ID is missing",
  "This child is not linked to this parent",
  "Invalid subject",
  "Unexpected server error",
  "Invalid date params, expected YYYY-MM-DD",
  "Failed to load coin history",
  "Method not allowed",
];

function assertNoRawEnglish(text, label) {
  const s = String(text || "");
  for (const sample of EN_PROSE_SAMPLES) {
    assert.notEqual(
      s,
      sample,
      `${label}: must not equal raw English "${sample}"`
    );
    assert.ok(
      !s.includes(sample),
      `${label}: must not contain raw English "${sample}" (got: ${s})`
    );
  }
  // ASCII-letter English sentences (4+ letter words) should not appear for id-ID paths we care about
  assert.ok(
    !/\b(Could not|Invalid PIN|Username is already|Child ID is missing|Unexpected server)\b/i.test(
      s
    ),
    `${label}: English phrase remnant in "${s}"`
  );
}

describe("Phase 9B-2 Parent API/UI localization", () => {
  test("access code: username_taken → localized Parent fallback (id-ID, no EN)", () => {
    const t = makeT("id-ID");
    const mapped = mapParentApiFailurePayload(
      { status: 409, code: "username_taken", error: "Username is already taken" },
      "credentials"
    );
    assert.equal(mapped.errorCode, "username_taken");
    const out = t(mapped.messageKey, mapped.parameters);
    assertNoRawEnglish(out, "username_taken");
    assert.equal(out, ID_UI.parent.credentialsSaveFailed);
  });

  test("access code: invalid_pin → localized (id-ID)", () => {
    const t = makeT("id-ID");
    const out = resolveParentApiErrorDisplay(
      { status: 400, code: "invalid_pin", error: "Invalid PIN" },
      "credentials",
      t
    );
    assertNoRawEnglish(out, "invalid_pin");
    assert.equal(out, ID_UI.parent.newPinFourDigits);
  });

  test("access code: access_code_create_failed → localized (id-ID)", () => {
    const t = makeT("id-ID");
    const out = resolveParentApiErrorDisplay(
      { status: 500, code: "access_code_create_failed", error: "Could not create access code" },
      "credentials",
      t
    );
    assertNoRawEnglish(out, "access_code_create_failed");
  });

  test("PIN reset failure uses pin context fallback", () => {
    const t = makeT("id-ID");
    const out = resolveParentApiErrorDisplay(
      { status: 500, error: "Could not create access code" },
      "pin_reset",
      t
    );
    assertNoRawEnglish(out, "pin_reset");
    assert.equal(out, ID_UI.parent.pinChangeFailed);
  });

  test("create child failure → createChildFailed (id-ID)", () => {
    const t = makeT("id-ID");
    const mapped = mapParentDashboardApiErrorPayload(
      403,
      "create_student_failed",
      "Could not create student",
      "create_student"
    );
    const out = t(mapped.messageKey);
    assertNoRawEnglish(out, "create_student");
    assert.equal(out, ID_UI.parent.errors.createChildFailed);
  });

  test("update child failure → updateChildFailed (id-ID)", () => {
    const t = makeT("id-ID");
    const mapped = mapParentDashboardApiErrorPayload(
      403,
      "update_student_failed",
      "Could not update student",
      "update_student"
    );
    const out = t(mapped.messageKey);
    assertNoRawEnglish(out, "update_student");
    assert.equal(out, ID_UI.parent.errors.updateChildFailed);
  });

  test("delete child failure → deleteFailed (id-ID), ignores English detail", () => {
    const t = makeT("id-ID");
    const out = resolveParentApiErrorDisplay(
      {
        status: 500,
        code: "delete_student_failed",
        error: "Deleting the child failed. Please try again or contact support.",
        detail: "fk_constraint on learning_sessions",
      },
      "delete_student",
      t
    );
    assertNoRawEnglish(out, "delete_student");
    assert.equal(out, ID_UI.parent.deleteFailed);
    assert.ok(!out.includes("fk_constraint"));
  });

  test("guest link failure → guestLinkFailed (id-ID)", () => {
    const t = makeT("id-ID");
    const out = resolveParentApiErrorDisplay(
      { status: 404, code: "guest_link_failed", error: "Child ID is missing" },
      "guest_link",
      t
    );
    assertNoRawEnglish(out, "guest_link");
    assert.equal(out, ID_UI.parent.guestLinkFailed);
  });

  test("student_not_linked → validation.api Indonesian", () => {
    const t = makeT("id-ID");
    const mapped = mapParentPanelApiErrorPayload("student_not_linked", "save");
    const out = t(mapped.messageKey);
    assert.equal(out, ID_VAL.api.student_not_linked);
    assertNoRawEnglish(out, "student_not_linked");
  });

  test("permission failure invalid_subject → localized, not Invalid subject", () => {
    const t = makeT("id-ID");
    const mapped = mapParentPanelApiErrorPayload("invalid_subject", "save");
    const out = t(mapped.messageKey);
    assertNoRawEnglish(out, "invalid_subject");
    assert.equal(out, ID_VAL.api.invalid_subject);
  });

  test("unknown API code → Parent localized fallback (id-ID)", () => {
    const t = makeT("id-ID");
    const mapped = mapParentDashboardApiErrorPayload(
      500,
      "totally_unknown_parent_code_xyz",
      "Some English server prose that must not show",
      "generic"
    );
    assert.equal(mapped.errorCode, "totally_unknown_parent_code_xyz");
    const out = t(mapped.messageKey);
    assertNoRawEnglish(out, "unknown_code");
    assert.equal(out, ID_UI.parent.errors.genericFailed);
  });

  test("dashboard mapper never passthrough Latin English prose", () => {
    const t = makeT("id-ID");
    for (const prose of EN_PROSE_SAMPLES) {
      const mapped = mapParentDashboardApiErrorPayload(500, null, prose, "generic");
      const out = t(mapped.messageKey, mapped.parameters);
      assertNoRawEnglish(out, `dashboard prose:${prose}`);
      assert.notEqual(mapped.messageKey, "ui.parent.errors.rawMessage");
    }
  });

  test("report mapper: invalid_date_params + no EN passthrough", () => {
    const t = makeT("id-ID");
    const mapped = mapParentReportLoadErrorPayload(
      400,
      "invalid_date_params",
      "Invalid date params, expected YYYY-MM-DD"
    );
    const out = t(mapped.messageKey);
    assertNoRawEnglish(out, "report_date");
    assert.equal(out, ID_UI.parent.errors.invalidDateRange);
  });

  test("EN regression: mapped codes still resolve to English Parent copy", () => {
    const t = makeT("en");
    assert.equal(
      resolveParentApiErrorDisplay({ code: "username_taken" }, "credentials", t),
      EN_UI.parent.credentialsSaveFailed
    );
    assert.equal(
      resolveParentApiErrorDisplay({ code: "invalid_pin" }, "pin_reset", t),
      EN_UI.parent.newPinFourDigits
    );
    assert.equal(
      t(mapParentDashboardApiErrorPayload(403, "create_student_failed", null, "create_student").messageKey),
      EN_UI.parent.errors.createChildFailed
    );
    assert.equal(
      resolveParentApiErrorDisplay({ code: "delete_student_failed" }, "delete_student", t),
      EN_UI.parent.deleteFailed
    );
  });

  test("API route sources emit stable codes (smoke on disk)", () => {
    const files = [
      "pages/api/parent/create-student-access-code.js",
      "pages/api/parent/create-student.js",
      "pages/api/parent/update-student.js",
      "pages/api/parent/delete-student.js",
      "pages/api/parent/guest/link.js",
      "pages/api/parent/students/[studentId]/subject-permissions.js",
      "pages/api/parent/students/[studentId]/game-permissions.js",
      "pages/api/parent/students/[studentId]/report-data.js",
      "pages/api/parent/students/[studentId]/coin-history.js",
    ];
    const banned = [
      "Username is already taken",
      "Invalid PIN",
      "Could not create access code",
      "Could not create student",
      "Could not update student",
      "Child ID is missing",
      "This child is not linked",
      "Invalid subject",
      "Failed to load coin history",
      "Invalid date params",
    ];
    for (const rel of files) {
      const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
      for (const phrase of banned) {
        assert.ok(
          !src.includes(phrase),
          `${rel} still contains banned English prose: ${phrase}`
        );
      }
      assert.ok(
        src.includes('code') || src.includes("error:"),
        `${rel} should emit code-oriented failures`
      );
    }
  });

  test("dashboard.js has no raw payload.error display paths", () => {
    const src = fs.readFileSync(path.join(ROOT, "pages/parent/dashboard.js"), "utf8");
    assert.ok(!src.includes("payload.error ||"));
    assert.ok(!src.includes("linkPayload.error ||"));
    assert.ok(!src.includes("credPayload.error ||"));
    assert.ok(!src.includes("setDeleteError((payload.error"));
    assert.ok(src.includes("mapParentApiFailurePayload"));
  });
});
