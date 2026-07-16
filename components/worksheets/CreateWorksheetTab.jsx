/**
 * Worksheet generator tab — four core subjects.
 */

import { WORKSHEET_SUBJECT_ALLOWLIST } from "../../lib/worksheets/worksheet-print-allowlist.js";
import { WORKSHEET_LEVEL_OPTIONS } from "../../lib/worksheets/worksheet-level-display.js";
import { worksheetTopicOptionsForGrade } from "../../lib/worksheets/worksheet-topic-options.js";
import { listWorksheetMixedTopicOptions } from "../../lib/worksheets/worksheet-mixed-topics.js";
import { listMathPracticeFormatsForGradeTopic } from "../../lib/worksheets/worksheet-math-practice-format.js";
import { isWorksheetMcqOffered } from "../../lib/worksheets/worksheet-mcq-preference.js";
import {
  useWorksheetUi,
  worksheetGradeLabel,
  worksheetLevelLabel,
  worksheetSubjectLabel,
} from "../../hooks/useWorksheetUi.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import {
  getPublicDemoAllowlistEntry,
} from "../../lib/worksheets/worksheet-public-demo.constants.js";
import WorksheetIncludeAnswersOption from "./WorksheetIncludeAnswersOption.jsx";
import MixedTopicsPicker from "./MixedTopicsPicker.jsx";

const GRADE_KEYS = ["g1", "g2", "g3", "g4", "g5", "g6"];

const COUNT_OPTIONS = [6, 8, 10, 12, 15, 20];

/**
 * @param {string} subjectId
 * @param {string} gradeKey
 */
function allMixedKeys(subjectId, gradeKey) {
  return listWorksheetMixedTopicOptions(subjectId, gradeKey).map((t) => t.key);
}

/**
 * @param {{
 *   form: Record<string, unknown>,
 *   onChange: (patch: Record<string, unknown>) => void,
 *   onSubmit: () => void,
 *   busy: boolean,
 *   error: string,
 *   includeAnswers: boolean,
 *   includeAnswersReady: boolean,
 *   onIncludeAnswersChange: (includeAnswers: boolean) => void,
 *   T: Record<string, string>,
 *   variant?: "parent" | "public-demo",
 * }} props
 */
export default function CreateWorksheetTab({
  form,
  onChange,
  onSubmit,
  busy,
  error,
  includeAnswers,
  includeAnswersReady,
  onIncludeAnswersChange,
  T,
  variant = "parent",
}) {
  const ui = useWorksheetUi();
  const t = useT();
  const isPublicDemo = variant === "public-demo";
  const subjectId = String(form.subjectId || "math");
  const gradeKey = String(form.gradeKey || "g3");
  const topicKey = String(form.topicKey || "");
  const topicOptions = worksheetTopicOptionsForGrade(subjectId, gradeKey);
  const mixedOptions = listWorksheetMixedTopicOptions(subjectId, gradeKey);
  const isMixed = topicKey === "mixed";
  const mixedTopicKeys = Array.isArray(form.mixedTopicKeys)
    ? form.mixedTopicKeys.map(String)
    : mixedOptions.map((t) => t.key);
  const practiceFormatOptions =
    subjectId === "math" ? listMathPracticeFormatsForGradeTopic(gradeKey, topicKey) : [];
  const showPracticeFormat = practiceFormatOptions.length > 1;
  const practiceFormatValue =
    typeof form.mathPracticeFormat === "string" && form.mathPracticeFormat
      ? form.mathPracticeFormat
      : practiceFormatOptions[0]?.key || "";
  const showMcqCheckbox = isWorksheetMcqOffered(subjectId);
  const allowedEntry = isPublicDemo ? getPublicDemoAllowlistEntry(subjectId, gradeKey) : null;
  const allowedTopicKey = allowedEntry?.topicKey || "";

  const patchTopic = (nextTopicKey) => {
    if (isPublicDemo && nextTopicKey !== allowedTopicKey) return;
    const formats = listMathPracticeFormatsForGradeTopic(gradeKey, nextTopicKey);
    /** @type {Record<string, unknown>} */
    const patch = {
      topicKey: nextTopicKey,
      mathPracticeFormat: formats[0]?.key || "",
    };
    if (nextTopicKey === "mixed") {
      patch.mixedTopicKeys = allMixedKeys(subjectId, gradeKey);
    } else {
      patch.mixedTopicKeys = null;
    }
    onChange(patch);
  };

  const patchGrade = (nextGrade) => {
    const topics = worksheetTopicOptionsForGrade(subjectId, nextGrade);
    const allow = isPublicDemo ? getPublicDemoAllowlistEntry(subjectId, nextGrade) : null;
    const nextTopic = allow?.topicKey || topics[0]?.key || "";
    const formats = listMathPracticeFormatsForGradeTopic(nextGrade, nextTopic);
    onChange({
      gradeKey: nextGrade,
      topicKey: nextTopic,
      mathPracticeFormat: formats[0]?.key || "",
      mixedTopicKeys: nextTopic === "mixed" ? allMixedKeys(subjectId, nextGrade) : null,
    });
  };

  const patchSubject = (nextSubject) => {
    const topics = worksheetTopicOptionsForGrade(nextSubject, gradeKey);
    const allow = isPublicDemo ? getPublicDemoAllowlistEntry(nextSubject, gradeKey) : null;
    const nextTopic = allow?.topicKey || topics[0]?.key || "";
    const formats =
      nextSubject === "math"
        ? listMathPracticeFormatsForGradeTopic(gradeKey, nextTopic)
        : [];
    onChange({
      subjectId: nextSubject,
      topicKey: nextTopic,
      mathPracticeFormat: formats[0]?.key || "",
      preferMcq: isWorksheetMcqOffered(nextSubject) ? form.preferMcq === true : false,
      mixedTopicKeys: nextTopic === "mixed" ? allMixedKeys(nextSubject, gradeKey) : null,
    });
  };

  const mixedEmpty = isMixed && mixedTopicKeys.length === 0;

  return (
    <div className={`worksheet-hub-panel worksheet-create-panel ${T.panel}`}>
      <h2 className={`worksheet-hub-panel-title ${T.heading}`}>
        {isPublicDemo ? ui.publicDemoTitle : ui.createTitle}
      </h2>
      <p className={`worksheet-hub-panel-hint ${T.muted}`}>
        {isPublicDemo ? ui.publicDemoHint : ui.createHint}
      </p>

      <div className="worksheet-form-grid">
        <div className="worksheet-form-field">
          <label>
            <span className={T.label}>{ui.subjectField}</span>
            <select
              className={T.inputMt}
              value={subjectId}
              onChange={(e) => patchSubject(e.target.value)}
            >
              {Object.keys(WORKSHEET_SUBJECT_ALLOWLIST).map((key) => (
                <option key={key} value={key}>
                  {worksheetSubjectLabel(t, key)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="worksheet-form-field">
          <label>
            <span className={T.label}>{ui.gradeField}</span>
            <select className={T.inputMt} value={gradeKey} onChange={(e) => patchGrade(e.target.value)}>
              {GRADE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {worksheetGradeLabel(t, key)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="worksheet-form-field">
          <label>
            <span className={T.label}>{ui.topicField}</span>
            <select
              className={T.inputMt}
              value={topicKey}
              onChange={(e) => patchTopic(e.target.value)}
            >
              {topicOptions.map((topicOpt) => {
                const isAllowed = !isPublicDemo || topicOpt.key === allowedTopicKey;
                return (
                  <option key={topicOpt.key} value={topicOpt.key} disabled={!isAllowed}>
                    {isAllowed ? topicOpt.label : `${topicOpt.label} - ${ui.publicDemoLockedTopic}`}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        {showPracticeFormat ? (
          <div className="worksheet-form-field">
            <label>
              <span className={T.label}>{ui.practiceFormatField}</span>
              <select
                className={T.inputMt}
                value={practiceFormatValue}
                onChange={(e) => onChange({ mathPracticeFormat: e.target.value })}
              >
                {practiceFormatOptions.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="worksheet-form-field worksheet-form-field-empty" aria-hidden="true" />
        )}

        <div className="worksheet-form-field">
          <label>
            <span className={T.label}>{ui.levelField}</span>
            <select
              className={T.inputMt}
              value={String(form.levelKey || "regular")}
              onChange={(e) => onChange({ levelKey: e.target.value })}
            >
              {WORKSHEET_LEVEL_OPTIONS.map((l) => (
                <option key={l.key} value={l.key}>
                  {worksheetLevelLabel(t, l.key)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {!isPublicDemo ? (
        <div className="worksheet-form-field">
          <label>
            <span className={T.label}>{ui.countField}</span>
            <select
              className={T.inputMt}
              value={Number(form.count) || 8}
              onChange={(e) => onChange({ count: Number(e.target.value) })}
            >
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        ) : null}

        {includeAnswersReady ? (
          <WorksheetIncludeAnswersOption
            checked={includeAnswers}
            onChange={onIncludeAnswersChange}
            T={T}
            className="worksheet-create-include-answers"
          />
        ) : null}

        <div className="worksheet-form-checkboxes">
          {showMcqCheckbox ? (
            <label className="worksheet-checkbox-card">
              <input
                type="checkbox"
                checked={form.preferMcq === true}
                onChange={(e) => onChange({ preferMcq: e.target.checked })}
              />
              <span className="worksheet-checkbox-card-text">
                <span className={T.label}>{ui.preferMcq}</span>
                <span className={`worksheet-checkbox-card-hint ${T.muted}`}>
                  {ui.preferMcqHint}
                </span>
              </span>
            </label>
          ) : null}

          <label className="worksheet-checkbox-card">
            <input
              type="checkbox"
              checked={form.inkSave === true}
              onChange={(e) => onChange({ inkSave: e.target.checked })}
            />
            <span className="worksheet-checkbox-card-text">
              <span className={T.label}>{ui.inkSave}</span>
              <span className={`worksheet-checkbox-card-hint ${T.muted}`}>
                {ui.inkSaveHint}
              </span>
            </span>
          </label>
        </div>
      </div>

      {!isPublicDemo && isMixed && mixedOptions.length > 0 ? (
        <MixedTopicsPicker
          options={mixedOptions}
          selectedKeys={mixedTopicKeys}
          onChange={(nextKeys) => onChange({ mixedTopicKeys: nextKeys })}
          T={T}
        />
      ) : null}

      {error ? <p className={`mt-4 ${T.error}`}>{error}</p> : null}
      {mixedEmpty && !error ? (
        <p className={`mt-4 ${T.error}`}>{ui.mixedTopicsEmptyError}</p>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          disabled={busy || !form.topicKey || mixedEmpty}
          onClick={onSubmit}
          className={`worksheet-primary-cta ${T.primaryBtn}`}
        >
          {busy ? ui.generating : ui.createWorksheet}
        </button>
      </div>
    </div>
  );
}
