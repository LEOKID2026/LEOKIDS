/**
 * F2: teacher-class-grade formatGradeLevelHe must resolve labels at call time
 * from the active burn-down locale (not capture English at module import).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  bindGlobalBurnDownLocale,
  getActiveBurnDownLocale,
  globalBurnDownCopyForLocale,
} from "../../lib/i18n/global-burn-down-copy.js";
import { formatGradeLevelHe } from "../../lib/teacher-portal/teacher-class-grade.js";

const SLUG = "lib__teacher-portal__teacher-class-grade";

const EXPECTED_G6 = {
  en: "Grade 6",
  "ar-EG": "الصف السادس",
  "ar-SA": "الصف السادس",
  "ar-MA": "السنة السادسة",
  "ar-DZ": "السنة 1 متوسط",
};

test("F2: live resolver authority for grade_6 matches expected country displays", () => {
  for (const [locale, expected] of Object.entries(EXPECTED_G6)) {
    assert.equal(globalBurnDownCopyForLocale(locale, SLUG, "grade_6"), expected, locale);
  }
});

test("F2: formatGradeLevelHe reflects bindGlobalBurnDownLocale at call time", () => {
  bindGlobalBurnDownLocale("en");
  assert.equal(getActiveBurnDownLocale(), "en");
  assert.equal(formatGradeLevelHe("g6"), "Grade 6");

  bindGlobalBurnDownLocale("ar-EG");
  assert.equal(formatGradeLevelHe("g6"), "الصف السادس");

  bindGlobalBurnDownLocale("ar-SA");
  assert.equal(formatGradeLevelHe("g6"), "الصف السادس");

  bindGlobalBurnDownLocale("ar-MA");
  assert.equal(formatGradeLevelHe("g6"), "السنة السادسة");

  bindGlobalBurnDownLocale("ar-DZ");
  assert.equal(formatGradeLevelHe("g6"), "السنة 1 متوسط");
});

test("F2: locale switch sequence does not keep stale import-time English capture", () => {
  bindGlobalBurnDownLocale("en");
  assert.equal(formatGradeLevelHe("g6"), "Grade 6");

  bindGlobalBurnDownLocale("ar-DZ");
  assert.equal(formatGradeLevelHe("g6"), "السنة 1 متوسط");

  bindGlobalBurnDownLocale("ar-MA");
  assert.equal(formatGradeLevelHe("g6"), "السنة السادسة");

  bindGlobalBurnDownLocale("en");
  assert.equal(formatGradeLevelHe("g6"), "Grade 6");
});

test("F2: ar-DZ g6 is never السنة 6 via formatter", () => {
  bindGlobalBurnDownLocale("ar-DZ");
  const label = formatGradeLevelHe("g6");
  assert.equal(label, "السنة 1 متوسط");
  assert.notEqual(label, "السنة 6");
  assert.equal(String(label).includes("السنة 6"), false);
});

test("F2: ar-001 still resolves Arabic grade labels after country switches", () => {
  bindGlobalBurnDownLocale("ar-DZ");
  bindGlobalBurnDownLocale("ar-001");
  assert.match(formatGradeLevelHe("g6"), /[\u0600-\u06FF]/);
  assert.equal(formatGradeLevelHe("g6"), globalBurnDownCopyForLocale("ar-001", SLUG, "grade_6"));
  bindGlobalBurnDownLocale("en");
});
