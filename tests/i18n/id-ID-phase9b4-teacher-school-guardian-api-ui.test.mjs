/**
 * Indonesian Master Phase 9B-4 — Teacher + School + Guardian API/UI localization.
 * Focused: code-first consumers, school bypass removal, mapped-code audit.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import {
  bindPlatformDisplayLocale,
  apiErrorMessageHe,
} from "../../lib/platform-ui/display-labels.js";

const ROOT = process.cwd();

/**
 * @param {string} dir
 * @param {(p: string) => boolean} [filter]
 * @returns {string[]}
 */
function walkFiles(dir, filter) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(p, filter));
    else if (!filter || filter(p)) out.push(p);
  }
  return out;
}

/**
 * @param {string} locale
 */
function loadValidation(locale) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "locales", locale, "validation.json"), "utf8"));
}

const MESSAGE_FIRST_RE =
  /(?:body|json|dBody|result)\?\.error\?\.message\s*\|\||error\?\.message\s*\|\|\s*(?:body|json)?\.?error\?\.code|message\s*\|\|\s*(?:body|json)?\.?error\?\.code/;

const TEACHER_SCHOOL_SCOPES = [
  path.join(ROOT, "pages", "teacher"),
  path.join(ROOT, "pages", "school"),
  path.join(ROOT, "components", "teacher-portal"),
  path.join(ROOT, "components", "school-portal"),
];

const SCHOOL_AUDIT_CODES = [
  "class_archived",
  "already_archived",
  "wrong_school",
  "teacher_profile_missing",
  "rate_limited",
  "not_school_portal_member",
  "operator_grant_required",
  "profile_update_failed",
  "unexpected_server_error",
];

const TEACHER_AUDIT_CODES = [
  "feature_disabled",
  "school_inactive",
  "class_archived",
  "already_archived",
  "rate_limited",
  "teacher_profile_missing",
  "link_unavailable",
  "consent_required",
  "student_not_found",
  "internal_error",
];

describe("Phase 9B-4 consumer scan", () => {
  test("Teacher + School product UI has zero message-first API error paths", () => {
    /** @type {string[]} */
    const hits = [];
    for (const root of TEACHER_SCHOOL_SCOPES) {
      for (const file of walkFiles(root, (p) => /\.(js|jsx)$/.test(p))) {
        const text = fs.readFileSync(file, "utf8");
        const lines = text.split(/\r?\n/);
        lines.forEach((line, i) => {
          if (MESSAGE_FIRST_RE.test(line)) {
            hits.push(`${path.relative(ROOT, file)}:${i + 1}:${line.trim()}`);
          }
        });
      }
    }
    assert.deepEqual(hits, [], `message-first leaks:\n${hits.join("\n")}`);
  });

  test("school activity monitor uses apiErrorMessageHe (no direct bypass)", () => {
    const file = path.join(ROOT, "pages", "school", "activities", "[activityId]", "monitor.js");
    const text = fs.readFileSync(file, "utf8");
    assert.match(text, /apiErrorMessageHe\s*\(/);
    assert.doesNotMatch(text, /body\?\.error\?\.message\s*\|\|/);
  });

  test("Guardian login maps by error.code — does not render raw error.message", () => {
    const login = fs.readFileSync(path.join(ROOT, "pages", "guardian", "login.js"), "utf8");
    assert.match(login, /mapGuardianAccessErrorKey/);
    assert.doesNotMatch(login, /error\?\.message\s*\|\|/);
    assert.doesNotMatch(login, /body\?\.error\?\.message/);
    const view = fs.readFileSync(path.join(ROOT, "pages", "guardian", "view.js"), "utf8");
    assert.doesNotMatch(view, /error\?\.message\s*\|\|/);
  });
});

describe("Phase 9B-4 mapped-code display (id-ID)", () => {
  test("Teacher audit codes: mapped Indonesian wins over English message twin", () => {
    bindPlatformDisplayLocale("id-ID");
    const id = loadValidation("id-ID");
    const fallback = id.apiFallback;
    for (const code of TEACHER_AUDIT_CODES) {
      const englishTwin = `ENGLISH_TWIN_FOR_${code}`;
      const out = apiErrorMessageHe({ code, message: englishTwin }, fallback);
      assert.equal(out, id.api[code], `teacher code ${code}`);
      assert.notEqual(out, englishTwin);
      assert.doesNotMatch(out, /ENGLISH_TWIN|Class is archived|Too many requests|Server error/i);
    }
  });

  test("School audit codes: mapped Indonesian wins over English message twin", () => {
    bindPlatformDisplayLocale("id-ID");
    const id = loadValidation("id-ID");
    const fallback = id.apiFallback;
    for (const code of SCHOOL_AUDIT_CODES) {
      const englishTwin = `Please leak English for ${code}`;
      const out = apiErrorMessageHe({ code, message: englishTwin }, fallback);
      assert.equal(out, id.api[code], `school code ${code}`);
      assert.notEqual(out, englishTwin);
    }
  });

  test("CRUD validation_failed + English field prose does not win", () => {
    bindPlatformDisplayLocale("id-ID");
    const id = loadValidation("id-ID");
    const out = apiErrorMessageHe(
      { code: "validation_failed", message: "accessId required" },
      id.apiFallback
    );
    assert.equal(out, id.api.validation_failed);
    assert.notEqual(out, "accessId required");
  });

  test("unknown code → localized fallback (not English message)", () => {
    bindPlatformDisplayLocale("id-ID");
    const id = loadValidation("id-ID");
    const out = apiErrorMessageHe(
      { code: "phase9b4_unknown_xyz", message: "Raw English pipeline boom" },
      id.apiFallback
    );
    assert.equal(out, id.apiFallback);
    assert.doesNotMatch(out, /Raw English|pipeline boom/i);
  });

  test("compact EN regression: mapped code still beats English message", () => {
    bindPlatformDisplayLocale("en");
    const en = loadValidation("en");
    const out = apiErrorMessageHe(
      { code: "class_archived", message: "Class is archived" },
      en.apiFallback
    );
    assert.equal(out, en.api.class_archived);
    // Message twin must not be preferred even when locale is English
    // (message equals mapping here is coincidental-safe only if identical; assert code path used)
    assert.ok(typeof out === "string" && out.length > 0);
  });
});

describe("Phase 9B-4 school CRUD transport hygiene", () => {
  test("known required-field call sites no longer emit English field prose as message", () => {
    const schoolApi = path.join(ROOT, "pages", "api", "school");
    const banned = [
      "accessId required",
      "loginUsername required",
      "gradeLevel is required",
      "physicalClassName is required",
      "activityId required",
    ];
    /** @type {string[]} */
    const hits = [];
    for (const file of walkFiles(schoolApi, (p) => p.endsWith(".js"))) {
      const text = fs.readFileSync(file, "utf8");
      for (const b of banned) {
        if (text.includes(`"${b}"`)) hits.push(`${path.relative(ROOT, file)}:${b}`);
      }
    }
    assert.deepEqual(hits, []);
  });
});
