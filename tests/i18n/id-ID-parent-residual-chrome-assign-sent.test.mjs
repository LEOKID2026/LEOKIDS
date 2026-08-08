/**
 * Indonesian Master — Parent Residual Chrome (ID-A-007 / ID-A-008).
 * AssignActivityModal + ParentSentActivitiesPanel localization.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { createTranslator } from "../../lib/i18n/create-translator.js";
import { resolveParentApiErrorDisplay } from "../../lib/parent-client/parent-api-errors.js";

const ROOT = process.cwd();

const ASSIGN_SRC = fs.readFileSync(
  path.join(ROOT, "components/parent/AssignActivityModal.js"),
  "utf8"
);
const SENT_SRC = fs.readFileSync(
  path.join(ROOT, "components/parent/ParentSentActivitiesPanel.jsx"),
  "utf8"
);

/** @type {Record<string, unknown>} */
const EN_UI = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/ui.json"), "utf8"));
/** @type {Record<string, unknown>} */
const ID_UI = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/id-ID/ui.json"), "utf8"));

const FORBIDDEN_ASSIGN_LITERALS = [
  "Choose a grade for the activity before generating questions",
  "Choose a grade for the activity before sending",
  "Enter the number of questions",
  "Generate questions first",
  "Enter a title for the activity",
  "Could not generate questions — try a different topic",
  "Cannot send an activity to this child",
  "Network error",
  "Send activity to ",
  "Grade for activity",
  "Number of questions",
  "Question count is limited to",
  "Send activity",
  '"Preview"',
  '"Close"',
  '"Title"',
  '"Subject"',
  '"Topic"',
];

const FORBIDDEN_SENT_LITERALS = [
  "Could not load results",
  "Network error",
  "Activity results",
  "No activities sent yet",
  "Answer details",
  "Sent activities",
  "View results",
  '"Loading…"',
  '"Close"',
  '"Correct"',
  '"Incorrect"',
  "Subject:",
  "Status:",
  "Answers:",
  "Started:",
  "Finished:",
  "Correct answer:",
  "json?.message || json?.error",
];

const REQUIRED_ASSIGN_KEYS = [
  "ui.parent.assignActivityChooseGradeGenerate",
  "ui.parent.assignActivityChooseGradeSend",
  "ui.parent.assignActivityEnterQuestionCount",
  "ui.parent.assignActivityGenerateFirst",
  "ui.parent.assignActivityEnterTitle",
  "ui.parent.assignActivityGenerateFailed",
  "ui.parent.assignActivityCannotSend",
  "ui.parent.assignActivityTitle",
  "ui.parent.assignActivityPreview",
  "ui.parent.assignActivitySend",
  "ui.common.close",
  "mapParentPanelApiError",
];

const REQUIRED_SENT_KEYS = [
  "resolveParentApiErrorDisplay",
  "panel_load",
  "ui.parent.errors.panelLoadFailed",
  "ui.parent.sentActivitiesTitle",
  "ui.parent.viewActivityResults",
  "ui.parent.activityResultsTitle",
  "ui.parent.noActivitiesSentYet",
  "ui.parent.deleteNetworkError",
];

const PARENT_ACTIVITY_KEYS = [
  "assignActivityTitle",
  "assignActivityTitleLabel",
  "assignActivitySubjectLabel",
  "assignActivityGradeLabel",
  "assignActivityTopicLabel",
  "assignActivityQuestionCountLabel",
  "assignActivityQuestionCountMax",
  "assignActivityPreview",
  "assignActivitySend",
  "assignActivityQuestionsHeading",
  "assignActivityChooseGradeGenerate",
  "assignActivityChooseGradeSend",
  "assignActivityEnterQuestionCount",
  "assignActivityEnterTitle",
  "assignActivityGenerateFirst",
  "assignActivityGenerateFailed",
  "assignActivityCannotSend",
  "sentActivitiesTitle",
  "viewActivityResults",
  "activityResultsTitle",
  "noActivitiesSentYet",
  "loading",
  "answerDetails",
  "questionLabel",
  "correct",
  "incorrect",
  "choicesLabel",
  "answerLabel",
  "correctAnswerLabel",
  "metaSubject",
  "metaTopic",
  "metaStatus",
  "metaAnswers",
  "metaCorrect",
  "metaScore",
  "metaStarted",
  "metaFinished",
  "sentStatusNotStarted",
  "sentStatusInProgress",
  "sentStatusCompleted",
];

function leafKeys(obj, prefix = "") {
  /** @type {string[]} */
  const out = [];
  for (const [k, v] of Object.entries(obj || {})) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...leafKeys(v, p));
    else out.push(p);
  }
  return out;
}

describe("ID-A-007 AssignActivityModal residual chrome", () => {
  test("no English validation/UI literals remain", () => {
    for (const lit of FORBIDDEN_ASSIGN_LITERALS) {
      assert.ok(
        !ASSIGN_SRC.includes(lit),
        `AssignActivityModal must not contain English literal: ${lit}`
      );
    }
  });

  test("validation messages resolve via ui.parent keys", () => {
    for (const key of REQUIRED_ASSIGN_KEYS) {
      assert.match(ASSIGN_SRC, new RegExp(key.replace(/\./g, "\\.")), `missing wiring: ${key}`);
    }
    assert.match(ASSIGN_SRC, /t\(mapParentPanelApiError\(/);
  });

  test("AssignActivityModal validation messages resolve id-ID", () => {
    const { t } = createTranslator("id-ID");
    assert.equal(
      t("ui.parent.assignActivityEnterQuestionCount"),
      ID_UI.parent.assignActivityEnterQuestionCount
    );
    assert.equal(
      t("ui.parent.assignActivityGenerateFirst"),
      ID_UI.parent.assignActivityGenerateFirst
    );
    assert.equal(
      t("ui.parent.assignActivityChooseGradeGenerate"),
      ID_UI.parent.assignActivityChooseGradeGenerate
    );
    assert.equal(
      t("ui.parent.assignActivityChooseGradeSend"),
      ID_UI.parent.assignActivityChooseGradeSend
    );
    assert.equal(
      t("ui.parent.assignActivityEnterTitle"),
      ID_UI.parent.assignActivityEnterTitle
    );
    assert.equal(
      t("ui.parent.assignActivityCannotSend"),
      ID_UI.parent.assignActivityCannotSend
    );
    for (const sample of [
      "Enter the number of questions",
      "Generate questions first",
      "Choose a grade",
    ]) {
      assert.notEqual(t("ui.parent.assignActivityEnterQuestionCount"), sample);
      assert.ok(!t("ui.parent.assignActivityGenerateFirst").includes(sample));
    }
    assert.match(t("ui.parent.assignActivityEnterQuestionCount"), /pertanyaan/i);
    assert.match(t("ui.parent.assignActivityGenerateFirst"), /pertanyaan|terlebih/i);
  });

  test("EN regression: AssignActivityModal keys keep English meaning", () => {
    const { t } = createTranslator("en");
    assert.equal(t("ui.parent.assignActivityEnterQuestionCount"), "Enter the number of questions");
    assert.equal(t("ui.parent.assignActivityGenerateFirst"), "Generate questions first");
    assert.equal(
      t("ui.parent.assignActivityChooseGradeGenerate"),
      "Choose a grade for the activity before generating questions"
    );
    assert.equal(t("ui.parent.assignActivitySend"), "Send activity");
  });
});

describe("ID-A-008 ParentSentActivitiesPanel residual chrome", () => {
  test("no English literal fallback remains", () => {
    for (const lit of FORBIDDEN_SENT_LITERALS) {
      assert.ok(
        !SENT_SRC.includes(lit),
        `ParentSentActivitiesPanel must not contain English literal/fallback: ${lit}`
      );
    }
  });

  test("failure path uses code-first Parent error resolver", () => {
    for (const key of REQUIRED_SENT_KEYS) {
      if (key === "ui.parent.errors.panelLoadFailed") {
        // resolved via resolver → panelLoadFailed key; ensure resolver wiring
        assert.match(SENT_SRC, /resolveParentApiErrorDisplay/);
        assert.match(SENT_SRC, /panel_load/);
        continue;
      }
      assert.match(SENT_SRC, new RegExp(key.replace(/\./g, "\\.")), `missing wiring: ${key}`);
    }
  });

  test("ParentSentActivitiesPanel failure resolves id-ID", () => {
    const { t } = createTranslator("id-ID");
    const out = resolveParentApiErrorDisplay(
      {
        status: 500,
        code: null,
        error: "Could not load results",
        message: "Could not load results",
      },
      "panel_load",
      t
    );
    assert.equal(out, ID_UI.parent.errors.panelLoadFailed);
    assert.notEqual(out, "Could not load results");
    assert.ok(!/\bCould not load results\b/i.test(out));
    assert.match(out, /Tidak dapat|memuat/i);
  });

  test("EN regression: panel load failure stays English via resolver", () => {
    const { t } = createTranslator("en");
    const out = resolveParentApiErrorDisplay(
      {
        status: 500,
        error: "Could not load results",
        message: "Could not load results",
      },
      "panel_load",
      t
    );
    assert.equal(out, EN_UI.parent.errors.panelLoadFailed);
    assert.equal(out, "Could not load the data.");
  });
});

describe("Parent residual chrome EN/id-ID key parity", () => {
  test("added ui.parent activity keys exist with exact parity", () => {
    for (const key of PARENT_ACTIVITY_KEYS) {
      assert.equal(
        typeof EN_UI.parent[key],
        "string",
        `EN missing ui.parent.${key}`
      );
      assert.equal(
        typeof ID_UI.parent[key],
        "string",
        `id-ID missing ui.parent.${key}`
      );
      assert.ok(String(EN_UI.parent[key]).trim(), `EN empty ui.parent.${key}`);
      assert.ok(String(ID_UI.parent[key]).trim(), `id-ID empty ui.parent.${key}`);
    }
  });

  test("parent leaf key sets match for activity chrome additions", () => {
    const enLeaves = new Set(leafKeys(EN_UI.parent));
    const idLeaves = new Set(leafKeys(ID_UI.parent));
    for (const key of PARENT_ACTIVITY_KEYS) {
      assert.ok(enLeaves.has(key), `EN leaf missing: ${key}`);
      assert.ok(idLeaves.has(key), `id-ID leaf missing: ${key}`);
    }
  });
});
