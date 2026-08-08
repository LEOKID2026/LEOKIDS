/**
 * Indonesian Master Phase 9B-3 — Student + Arcade API/UI localization.
 * Focused: raw English API leak removal (code-first + Student fallback).
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import {
  STUDENT_API_LEGACY_ERROR,
  extractStudentApiErrorCode,
  resolveStudentApiErrorMessage,
} from "../../lib/student-client/student-api-legacy-errors.js";

const ROOT = process.cwd();

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function makeIdTranslator() {
  const ui = loadJson("locales/id-ID/ui.json");
  const auth = loadJson("locales/id-ID/auth.json");
  const games = loadJson("locales/id-ID/games.json");
  const bag = {
    "ui.student.errors.sessionExpired": ui.student.errors.sessionExpired,
    "ui.student.errors.serverError": ui.student.errors.serverError,
    "ui.student.errors.loadFailed": ui.student.errors.loadFailed,
    "auth.networkError": auth.networkError,
    "auth.invalidStudentCredentials": auth.invalidStudentCredentials,
    "auth.guestUnavailable": auth.guestUnavailable,
    "games.apiFailed": games.apiFailed,
    "games.apiSuccess": games.apiSuccess,
    "games.apiInsufficientFunds": games.apiInsufficientFunds,
  };
  return (key) => bag[key] ?? key;
}

function makeEnTranslator() {
  const ui = loadJson("locales/en/ui.json");
  const auth = loadJson("locales/en/auth.json");
  const games = loadJson("locales/en/games.json");
  const bag = {
    "ui.student.errors.sessionExpired": ui.student.errors.sessionExpired,
    "ui.student.errors.serverError": ui.student.errors.serverError,
    "ui.student.errors.loadFailed": ui.student.errors.loadFailed,
    "auth.networkError": auth.networkError,
    "auth.invalidStudentCredentials": auth.invalidStudentCredentials,
    "auth.guestUnavailable": auth.guestUnavailable,
    "games.apiFailed": games.apiFailed,
    "games.apiSuccess": games.apiSuccess,
    "games.apiInsufficientFunds": games.apiInsufficientFunds,
  };
  return (key) => bag[key] ?? key;
}

const LOOKS_ENGLISH_PROSE = /[A-Za-z]{4,}.*\s+[A-Za-z]{3,}/;

describe("Phase 9B-3 student legacy resolver", () => {
  test("removes raw-English passthrough; maps session + temporary + unknown", () => {
    const t = makeIdTranslator();
    const session = resolveStudentApiErrorMessage(STUDENT_API_LEGACY_ERROR.SESSION_EXPIRED, t);
    const temporary = resolveStudentApiErrorMessage(STUDENT_API_LEGACY_ERROR.TEMPORARY, t);
    const unexpected = resolveStudentApiErrorMessage("unexpected_server_error", t);
    const unknownCode = resolveStudentApiErrorMessage("totally_unknown_student_code", t);
    const rawEnglish = resolveStudentApiErrorMessage(
      "A temporary error occurred. Please try again later.",
      t
    );
    const prose = resolveStudentApiErrorMessage("Missing room ID", t);

    assert.equal(session, t("ui.student.errors.sessionExpired"));
    assert.equal(temporary, t("ui.student.errors.serverError"));
    assert.equal(unexpected, t("ui.student.errors.serverError"));
    assert.equal(unknownCode, t("ui.student.errors.loadFailed"));
    assert.equal(rawEnglish, t("ui.student.errors.serverError"));
    assert.equal(prose, t("ui.student.errors.loadFailed"));
    assert.notEqual(session, STUDENT_API_LEGACY_ERROR.SESSION_EXPIRED);
    assert.notEqual(temporary, STUDENT_API_LEGACY_ERROR.TEMPORARY);
    assert.notEqual(prose, "Missing room ID");
    assert.equal(LOOKS_ENGLISH_PROSE.test("Missing room ID"), true);
  });

  test("home temporary + session expired payload shapes", () => {
    const t = makeIdTranslator();
    assert.equal(
      resolveStudentApiErrorMessage(
        { ok: false, error: "unexpected_server_error", code: "unexpected_server_error" },
        t
      ),
      t("ui.student.errors.serverError")
    );
    assert.equal(
      resolveStudentApiErrorMessage(
        { ok: false, error: STUDENT_API_LEGACY_ERROR.SESSION_EXPIRED, code: "session_expired" },
        t
      ),
      t("ui.student.errors.sessionExpired")
    );
  });

  test("worksheet / arcade / guest / login / educational failure codes localize", () => {
    const t = makeIdTranslator();
    assert.equal(
      resolveStudentApiErrorMessage({ error: "server_error", code: "server_error" }, t),
      t("ui.student.errors.serverError")
    );
    assert.equal(
      resolveStudentApiErrorMessage({ error: "bad_request", code: "bad_request" }, t),
      t("ui.student.errors.loadFailed")
    );
    assert.equal(
      resolveStudentApiErrorMessage({ error: "unavailable", code: "unavailable" }, t),
      t("ui.student.errors.loadFailed")
    );
    assert.equal(
      resolveStudentApiErrorMessage({ error: "guest_resume_failed", code: "guest_resume_failed" }, t),
      t("auth.guestUnavailable")
    );
    assert.equal(
      resolveStudentApiErrorMessage(
        { error: STUDENT_API_LEGACY_ERROR.INVALID_CREDENTIALS, code: "invalid_credentials" },
        t
      ),
      t("auth.invalidStudentCredentials")
    );
    assert.equal(
      resolveStudentApiErrorMessage({ error: "invalid_game", code: "invalid_game" }, t),
      t("ui.student.errors.loadFailed")
    );
    assert.equal(
      resolveStudentApiErrorMessage("start_failed", t),
      t("ui.student.errors.loadFailed")
    );
  });

  test("arcade save success key remains local games.apiSuccess (id-ID)", () => {
    const t = makeIdTranslator();
    assert.equal(t("games.apiSuccess"), "Selesai");
    assert.notEqual(t("games.apiSuccess"), "Saved!");
  });

  test("unknown-code localized fallback (generic Student)", () => {
    const t = makeIdTranslator();
    const msg = resolveStudentApiErrorMessage("xyzzy_not_in_map", t);
    assert.equal(msg, t("ui.student.errors.loadFailed"));
    assert.match(msg, /Tidak dapat|gagal|server/i);
  });

  test("compact EN regression — still localized EN, never raw temporary prose", () => {
    const t = makeEnTranslator();
    const temporary = resolveStudentApiErrorMessage(STUDENT_API_LEGACY_ERROR.TEMPORARY, t);
    const session = resolveStudentApiErrorMessage(STUDENT_API_LEGACY_ERROR.SESSION_EXPIRED, t);
    assert.equal(temporary, t("ui.student.errors.serverError"));
    assert.equal(session, t("ui.student.errors.sessionExpired"));
    assert.notEqual(temporary, STUDENT_API_LEGACY_ERROR.TEMPORARY);
  });

  test("extractStudentApiErrorCode never treats free English prose as a code", () => {
    assert.equal(extractStudentApiErrorCode("Missing room ID"), "");
    assert.equal(extractStudentApiErrorCode("Saved!"), "");
    assert.equal(extractStudentApiErrorCode("unexpected_server_error"), "unexpected_server_error");
    assert.equal(
      extractStudentApiErrorCode(STUDENT_API_LEGACY_ERROR.TEMPORARY),
      "unexpected_server_error"
    );
  });
});

describe("Phase 9B-3 source guards", () => {
  test("legacy resolver source no longer returns English letter-prose as-is", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "lib/student-client/student-api-legacy-errors.js"),
      "utf8"
    );
    assert.equal(/\/\[A-Za-z\]\{4,\}\/\.test\(s\)\s*return s/.test(src), false);
    assert.match(src, /never preferred/i);
  });

  test("worksheet page no longer uses json?.error || Error anti-pattern", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "pages/student/worksheet/[worksheetId].js"),
      "utf8"
    );
    assert.equal(src.includes('json?.error || "Error"'), false);
    assert.equal(src.includes('json?.error || "Unable to open"'), false);
    assert.match(src, /resolveStudentApiErrorMessage/);
  });

  test("arcade lobby apiMessage does not prefer payload.error English", () => {
    const src = fs.readFileSync(path.join(ROOT, "pages/student/arcade.js"), "utf8");
    assert.equal(/const msg = typeof payload\?\.error === "string" \? payload\.error : ""/.test(src), false);
    assert.match(src, /resolveStudentApiErrorMessage/);
    assert.match(src, /games\.apiFailed/);
  });

  test("arcade my-room no longer renders Saved! / raw json.message", () => {
    const src = fs.readFileSync(path.join(ROOT, "pages/student/arcade/my-room.js"), "utf8");
    assert.equal(src.includes('"Saved!"'), false);
    assert.equal(src.includes("json.message || json.error"), false);
    assert.match(src, /games\.apiSuccess/);
    assert.match(src, /resolveStudentApiErrorMessage/);
  });

  test("guest login no longer prefers payload?.error English", () => {
    const src = fs.readFileSync(path.join(ROOT, "pages/student/login.js"), "utf8");
    assert.equal(src.includes("payload?.error || t("), false);
    assert.match(src, /auth\.guestUnavailable/);
  });

  test("home-profile APIs emit unexpected_server_error not temporary English", () => {
    for (const rel of [
      "pages/api/student/home-profile.js",
      "pages/api/student/home-profile/summary.js",
      "pages/api/student/home-profile/analytics.js",
      "pages/api/student/home-profile/achievement-grants.js",
    ]) {
      const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
      assert.equal(src.includes("A temporary error occurred"), false);
      assert.match(src, /unexpected_server_error/);
    }
  });

  test("new-code-mappings artifact exists", () => {
    const rel = "artifacts/id-ID-phase9b3/new-code-mappings-required.json";
    assert.equal(fs.existsSync(path.join(ROOT, rel)), true);
    const data = loadJson(rel);
    assert.ok(Array.isArray(data.mappings));
    assert.ok(data.mappings.length >= 1);
  });
});
