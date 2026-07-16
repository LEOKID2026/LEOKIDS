import { useMemo } from "react";
import { useI18n, useT } from "../lib/i18n/I18nProvider.jsx";

/** Keys mirrored from legacy worksheet-ui.he — use worksheets.* locale entries. */
const WORKSHEET_UI_KEYS = [
  "hubTitle",
  "hubSubtitle",
  "hubIntro",
  "tabReady",
  "tabGenerator",
  "tabRecommendations",
  "tabReadyHint",
  "tabCreateHint",
  "tabRecommendationsHint",
  "print",
  "preview",
  "answerKey",
  "answerKeySeparate",
  "inkSave",
  "inkSaveHint",
  "noAnswersInWorksheet",
  "subjectField",
  "subjectMath",
  "subjectGeometry",
  "subjectHebrew",
  "subjectEnglish",
  "subjectFilterAll",
  "levelFilterAll",
  "blockedAudio",
  "blockedImage",
  "questionLabel",
  "nameField",
  "dateField",
  "gradeField",
  "topicField",
  "practiceFormatField",
  "levelField",
  "countField",
  "includeAnswers",
  "preferMcq",
  "preferMcqHint",
  "preferMcqUnavailable",
  "createWorksheet",
  "viewAndPrint",
  "back",
  "loading",
  "errorGeneric",
  "noStudents",
  "selectChild",
  "recommendationsEmpty",
  "recommendationsEmptyTitle",
  "recommendationsTitle",
  "recommendationsHint",
  "readyTitle",
  "readyHint",
  "readyEmptyTitle",
  "readyEmptyText",
  "createTitle",
  "createHint",
  "mixedTopicsTitle",
  "mixedTopicsHint",
  "mixedTopicsSelectAll",
  "mixedTopicsEmptyError",
  "previewTitle",
  "documentTitle",
  "answerKeyTitle",
  "noPreviewData",
  "generating",
  "refreshQuestions",
  "refreshingQuestions",
  "refreshQuestionsError",
  "answerKeyStale",
  "questionCount",
  "createFromRecommendation",
  "publicDemoTitle",
  "publicDemoHint",
  "publicDemoLockedTopic",
  "publicReadyTitle",
  "publicReadyHint",
  "publicPreviewLost",
  "publicPreviewLostCta",
  "publicFullSystemNote",
  "hubSlotAriaLabel",
  "gradeFilterAll",
  "gradeG1",
  "gradeG2",
  "gradeG3",
  "gradeG4",
  "gradeG5",
  "gradeG6",
  "levelRegular",
  "levelAdvanced",
  "seoPreviewTitle",
  "seoPreviewDescription",
  "seoAnswerKeyTitle",
  "seoAnswerKeyDescription",
];

/** Print documents stay LTR in the global English product. */
export const WORKSHEET_PRINT_DOC_ATTRS = Object.freeze({ dir: "ltr", lang: "en" });

/**
 * @returns {Record<string, string>}
 */
export function useWorksheetUi() {
  const t = useT();
  return useMemo(() => {
    /** @type {Record<string, string>} */
    const ui = {};
    for (const key of WORKSHEET_UI_KEYS) {
      ui[key] = t(`worksheets.${key}`);
    }
    return ui;
  }, [t]);
}

export function useWorksheetShellAttrs() {
  const { direction, locale } = useI18n();
  return { dir: direction, lang: locale };
}

/**
 * @param {(key: string, vars?: Record<string, unknown>) => string} t
 * @param {string} subjectId
 */
export function worksheetSubjectLabel(t, subjectId) {
  const map = {
    math: "subjectMath",
    geometry: "subjectGeometry",
    english: "subjectEnglish",
    hebrew: "subjectHebrew",
  };
  const key = map[subjectId];
  return key ? t(`worksheets.${key}`) : subjectId;
}

/**
 * @param {(key: string, vars?: Record<string, unknown>) => string} t
 * @param {string} gradeKey
 */
export function worksheetGradeLabel(t, gradeKey) {
  if (!gradeKey) return t("worksheets.gradeFilterAll");
  const labelKey = `grade${String(gradeKey).toUpperCase()}`;
  const msg = t(`worksheets.${labelKey}`);
  return msg.startsWith("worksheets.") ? gradeKey : msg;
}

/**
 * @param {(key: string, vars?: Record<string, unknown>) => string} t
 * @param {string} levelKey
 */
export function worksheetLevelLabel(t, levelKey) {
  if (levelKey === "regular") return t("worksheets.levelRegular");
  if (levelKey === "advanced") return t("worksheets.levelAdvanced");
  return levelKey;
}
