/**
 * Writing worksheet generator tab — 7 user-facing categories.
 */

import {
  ENGLISH_LOWER,
  ENGLISH_UPPER,
  getWritingWordPacks,
  PREWRITING_PATHS,
  prewritingPathLabelEn,
  wordPackLabelEn,
} from "../../lib/writing/writing-constants.js";
import {
  WRITING_REQUEST_DEFAULTS,
  WRITING_UI_CATEGORIES,
} from "../../lib/writing/writing-worksheet-types.js";
import {
  applyReferenceSheetPreset,
  REFERENCE_SHEET_PRESET_KEYS,
  REFERENCE_SHEET_PRESETS,
} from "../../lib/writing/writing-reference-sheet-presets.js";
import {
  PUBLIC_WRITING_DEMO_PRESETS,
  getPublicWritingDemoPreset,
} from "../../data/writing/public-demo-allowlist.js";
import { useWorksheetUi, writingCategoryLabel } from "../../hooks/useWorksheetUi.js";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";
import { useMemo } from "react";

const TRACING_OPTION_KEYS = [
  { key: "trace", labelKey: "worksheets.writingTracingTrace" },
  { key: "copy", labelKey: "worksheets.writingTracingCopy" },
  { key: "trace_and_copy", labelKey: "worksheets.writingTracingTraceAndCopy" },
  { key: "independent", labelKey: "worksheets.writingTracingIndependent" },
];

const TRACE_RENDER_OPTION_KEYS = [
  { key: "full_trace", labelKey: "worksheets.writingTraceRenderFull" },
  { key: "faint_model", labelKey: "worksheets.writingTraceRenderFaint" },
  { key: "outline", labelKey: "worksheets.writingTraceRenderOutline" },
  { key: "stroke_path", labelKey: "worksheets.writingTraceRenderStrokePath" },
];

const SCRIPT_OPTION_KEYS = [
  { key: "print", labelKey: "worksheets.writingScriptPrint" },
  { key: "script", labelKey: "worksheets.writingScriptScript" },
  { key: "print_and_script", labelKey: "worksheets.writingScriptBoth" },
];

const NUMBER_MODE_OPTION_KEYS = [
  { key: "digit", labelKey: "worksheets.writingNumberModeDigit" },
  { key: "number", labelKey: "worksheets.writingNumberModeNumber" },
  { key: "quantity_match", labelKey: "worksheets.writingNumberModeQuantity" },
  { key: "sequence", labelKey: "worksheets.writingNumberModeSequence" },
  { key: "before_after", labelKey: "worksheets.writingNumberModeBeforeAfter" },
];

const PERSONAL_KIND_OPTION_KEYS = [
  { key: "first_name", labelKey: "worksheets.writingPersonalFirstName" },
  { key: "full_name", labelKey: "worksheets.writingPersonalFullName" },
  { key: "word", labelKey: "worksheets.writingPersonalWord" },
  { key: "short_phrase", labelKey: "worksheets.writingPersonalShortPhrase" },
];

const LINE_COUNT_OPTIONS = [3, 4, 5, 6, 8, 10, 12];

/**
 * @param {string} writingCategory
 * @returns {string[]}
 */
function manualDefaultCharacters(writingCategory) {
  if (writingCategory === "english_letters") return ["A"];
  return [];
}

const ITEMS_PER_LINE_OPTIONS = [1, 2, 3, 4, 5, 6];

const FONT_SIZE_OPTION_KEYS = [
  { key: "sm", labelKey: "worksheets.writingFontSizeSm" },
  { key: "md", labelKey: "worksheets.writingFontSizeMd" },
  { key: "lg", labelKey: "worksheets.writingFontSizeLg" },
  { key: "xl", labelKey: "worksheets.writingFontSizeXl" },
];

const PRINT_STRENGTH_OPTION_KEYS = [
  { key: "light", labelKey: "worksheets.writingPrintStrengthLight" },
  { key: "normal", labelKey: "worksheets.writingPrintStrengthNormal" },
  { key: "strong", labelKey: "worksheets.writingPrintStrengthStrong" },
];

const LETTER_NUMBER_CATEGORIES = new Set(["english_letters", "numbers"]);

/**
 * @returns {Record<string, unknown>}
 */
export function defaultWritingCreateForm() {
  return {
    worksheetType: "writing",
    writingCategory: "english_letters",
    characters: ["A"],
    scriptStyle: WRITING_REQUEST_DEFAULTS.scriptStyle,
    tracingMode: WRITING_REQUEST_DEFAULTS.tracingMode,
    traceRenderMode: WRITING_REQUEST_DEFAULTS.traceRenderMode,
    lineCount: WRITING_REQUEST_DEFAULTS.lineCount,
    itemsPerLine: WRITING_REQUEST_DEFAULTS.itemsPerLine,
    fontSize: WRITING_REQUEST_DEFAULTS.fontSize,
    printStrength: "normal",
    letterCase: "upper",
    numberRange: { min: 1, max: 5 },
    numberMode: "digit",
    prewritingPathId: "horizontal",
    wordPackId: "animals",
    customWords: "",
    customText: "",
    customTextKind: "first_name",
    includeNameField: WRITING_REQUEST_DEFAULTS.includeNameField,
    includeDateField: WRITING_REQUEST_DEFAULTS.includeDateField,
    pageOrientation: WRITING_REQUEST_DEFAULTS.pageOrientation,
    inkSave: WRITING_REQUEST_DEFAULTS.inkSave,
    demoPresetId: PUBLIC_WRITING_DEMO_PRESETS[0]?.id || "",
    referenceSheetPreset: "",
  };
}

/**
 * @param {Record<string, unknown>} form
 * @param {{ interfaceLocale?: string, contentLocale?: string }} [localeOpts]
 * @returns {Record<string, unknown>}
 */
export function buildWritingGenerateBody(form, localeOpts = {}) {
  const interfaceLocale = String(localeOpts.interfaceLocale || "").trim();
  const contentLocale = String(localeOpts.contentLocale || interfaceLocale || "").trim();
  const localeFields = {
    ...(interfaceLocale ? { interfaceLocale } : {}),
    ...(contentLocale ? { contentLocale, instructionLocale: contentLocale } : {}),
  };
  const referenceSheetPreset = String(form.referenceSheetPreset || "");
  if (referenceSheetPreset && REFERENCE_SHEET_PRESET_KEYS.includes(referenceSheetPreset)) {
    const applied = applyReferenceSheetPreset(referenceSheetPreset);
    if (applied) {
      return {
        worksheetType: "writing",
        ...applied,
        inkSave: form.inkSave === true,
        pageOrientation: form.pageOrientation || WRITING_REQUEST_DEFAULTS.pageOrientation,
        ...localeFields,
      };
    }
  }

  const category = String(form.writingCategory || "english_letters");
  /** @type {Record<string, unknown>} */
  const body = {
    worksheetType: "writing",
    writingCategory: category,
    scriptStyle: form.scriptStyle || WRITING_REQUEST_DEFAULTS.scriptStyle,
    tracingMode: form.tracingMode || WRITING_REQUEST_DEFAULTS.tracingMode,
    traceRenderMode: form.traceRenderMode || WRITING_REQUEST_DEFAULTS.traceRenderMode,
    nikudMode: WRITING_REQUEST_DEFAULTS.nikudMode,
    lineTemplate: WRITING_REQUEST_DEFAULTS.lineTemplate,
    lineCount: Number(form.lineCount) || WRITING_REQUEST_DEFAULTS.lineCount,
    itemsPerLine: Number(form.itemsPerLine) || WRITING_REQUEST_DEFAULTS.itemsPerLine,
    repeatsPerLine: WRITING_REQUEST_DEFAULTS.repeatsPerLine,
    fontSize: String(form.fontSize || WRITING_REQUEST_DEFAULTS.fontSize),
    strokeStyle: WRITING_REQUEST_DEFAULTS.strokeStyle,
    printStrength: String(form.printStrength || "normal"),
    includeExample: WRITING_REQUEST_DEFAULTS.includeExample,
    includeCopyRows: WRITING_REQUEST_DEFAULTS.includeCopyRows,
    includeIndependentRows: WRITING_REQUEST_DEFAULTS.includeIndependentRows,
    includeImage: WRITING_REQUEST_DEFAULTS.includeImage,
    includeNameField: form.includeNameField !== false,
    includeDateField: form.includeDateField !== false,
    pageOrientation: form.pageOrientation || WRITING_REQUEST_DEFAULTS.pageOrientation,
    pageDensity: WRITING_REQUEST_DEFAULTS.pageDensity,
    showStartPoint: WRITING_REQUEST_DEFAULTS.showStartPoint,
    showDirectionArrows: WRITING_REQUEST_DEFAULTS.showDirectionArrows,
    showStrokeNumbers: WRITING_REQUEST_DEFAULTS.showStrokeNumbers,
    inkSave: form.inkSave === true,
    ...localeFields,
  };

  if (category === "english_letters") {
    body.characters = Array.isArray(form.characters)
      ? form.characters.filter(Boolean)
      : [String(form.characters || "A")];
    body.letterCase = form.letterCase || "upper";
  } else if (category === "numbers") {
    body.numberRange = form.numberRange || { min: 1, max: 5 };
    body.numberMode = form.numberMode || "digit";
  } else if (category === "prewriting") {
    body.prewritingPathId = form.prewritingPathId || "horizontal";
  } else if (category === "english_words") {
    const custom = String(form.customWords || "").trim();
    if (custom) {
      body.wordPackId = "custom";
      body.words = custom.split(/[\s,]+/).filter(Boolean).slice(0, 10);
    } else {
      body.wordPackId = form.wordPackId || "animals";
    }
  } else if (category === "personal_text") {
    body.customText = String(form.customText || "").trim();
    body.customTextKind = form.customTextKind || "first_name";
  }

  return body;
}

/**
 * @param {{
 *   form: Record<string, unknown>,
 *   onChange: (patch: Record<string, unknown>) => void,
 *   onSubmit: () => void,
 *   busy: boolean,
 *   error: string,
 *   T: Record<string, string>,
 *   variant?: "parent" || "public-demo",
 *   hidePanelHeader?: boolean,
 * }} props
 */
export default function CreateWritingWorksheetTab({
  form,
  onChange,
  onSubmit,
  busy,
  error,
  T,
  variant = "parent",
  hidePanelHeader = false,
}) {
  const ui = useWorksheetUi();
  const t = useT();
  const { locale, contentLocale } = useI18n();
  const wordPacks = useMemo(
    () => getWritingWordPacks(contentLocale || locale || "en"),
    [contentLocale, locale]
  );
  const isPublicDemo = variant === "public-demo";
  const category = String(form.writingCategory || "english_letters");
  const referenceSheetPreset = String(form.referenceSheetPreset || "");
  const isReferenceSheet = Boolean(referenceSheetPreset);
  const letterCase = String(form.letterCase || "upper");
  const englishLetterPool = letterCase === "lower" ? ENGLISH_LOWER : ENGLISH_UPPER;
  const englishChars = Array.isArray(form.characters)
    ? form.characters.map(String).filter(Boolean)
    : ["A"];
  const showLetterNumberLayout =
    !isPublicDemo && !isReferenceSheet && LETTER_NUMBER_CATEGORIES.has(category);

  const applyDemoPreset = (presetId) => {
    const preset = getPublicWritingDemoPreset(presetId);
    if (!preset) return;
    onChange({
      demoPresetId: presetId,
      writingCategory: preset.writingCategory,
      ...(preset.request || {}),
    });
  };

  return (
    <div className={`worksheet-hub-panel worksheet-create-panel worksheet-writing-panel ${T.panel}`}>
      {hidePanelHeader ? null : (
        <>
          <h2 className={`worksheet-hub-panel-title ${T.heading}`}>
            {isPublicDemo ? ui.writingPublicDemoTitle : ui.writingCreateTitle}
          </h2>
          <p className={`worksheet-hub-panel-hint ${T.muted}`}>
            {isPublicDemo ? ui.writingPublicDemoHint : ui.writingCreateHint}
          </p>
        </>
      )}

      {isPublicDemo ? (
        <div className="worksheet-form-field">
          <span className={`worksheet-filter-label ${T.muted}`}>
            {ui.writingDemoPresetField}
          </span>
          <select
            className={T.inputMt}
            value={String(form.demoPresetId || PUBLIC_WRITING_DEMO_PRESETS[0]?.id || "")}
            onChange={(e) => applyDemoPreset(e.target.value)}
          >
            {PUBLIC_WRITING_DEMO_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.titleHe}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <div className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>{ui.writingReferenceSheetField}</span>
            <select
              className={T.inputMt}
              value={referenceSheetPreset}
              onChange={(e) => {
                const key = e.target.value;
                if (!key) {
                  onChange({
                    referenceSheetPreset: "",
                    characters: manualDefaultCharacters(category),
                  });
                  return;
                }
                const applied = applyReferenceSheetPreset(key);
                onChange({ referenceSheetPreset: key, ...applied });
              }}
            >
              <option value="">{ui.writingReferenceSheetManual}</option>
              {REFERENCE_SHEET_PRESET_KEYS.map((key) => (
                <option key={key} value={key}>
                  {typeof REFERENCE_SHEET_PRESETS[key].labelForLocale === "function"
                    ? REFERENCE_SHEET_PRESETS[key].labelForLocale(locale || "en")
                    : REFERENCE_SHEET_PRESETS[key].labelHe}
                </option>
              ))}
            </select>
          </div>

          {!isReferenceSheet ? (
        <div className="worksheet-form-field">
          <span className={`worksheet-filter-label ${T.muted}`}>
            {ui.writingCategoryField}
          </span>
          <select
            className={T.inputMt}
            value={category}
            onChange={(e) => {
              const nextCategory = e.target.value;
              onChange({
                writingCategory: nextCategory,
                referenceSheetPreset: "",
                characters: manualDefaultCharacters(nextCategory),
              });
            }}
          >
            {WRITING_UI_CATEGORIES.map((key) => (
              <option key={key} value={key}>
                {writingCategoryLabel(t, key)}
              </option>
            ))}
          </select>
        </div>
          ) : null}
        </>
      )}

      {!isPublicDemo && !isReferenceSheet && category === "english_letters" ? (
        <>
          <div className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingLetterCaseField}
            </span>
            <select
              className={T.inputMt}
              value={letterCase}
              onChange={(e) =>
                onChange({ letterCase: e.target.value, characters: manualDefaultCharacters("english_letters") })
              }
            >
              <option value="upper">{t("worksheets.writingLetterCaseUpper")}</option>
              <option value="lower">{t("worksheets.writingLetterCaseLower")}</option>
              <option value="pairs">{t("worksheets.writingLetterCasePairs")}</option>
            </select>
          </div>
          <div className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingLettersField}
            </span>
            <div className="worksheet-writing-letter-grid">
              {englishLetterPool.map((letter) => {
                const selected = englishChars.includes(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    className={`worksheet-writing-letter-btn${selected ? " is-selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => {
                      const next = selected
                        ? englishChars.filter((c) => c !== letter)
                        : [...englishChars, letter];
                      const fallback = englishLetterPool[0] || "A";
                      onChange({ characters: next.length ? next : [fallback] });
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      {!isPublicDemo && !isReferenceSheet && category === "numbers" ? (
        <>
          <div className="worksheet-form-grid">
            <label className="worksheet-form-field">
              <span className={`worksheet-filter-label ${T.muted}`}>{ui.writingNumberMin}</span>
              <input
                type="number"
                className={T.inputMt}
                min={0}
                max={100}
                value={Number(form.numberRange?.min ?? 1)}
                onChange={(e) =>
                  onChange({
                    numberRange: {
                      ...(form.numberRange || {}),
                      min: Number(e.target.value),
                    },
                  })
                }
              />
            </label>
            <label className="worksheet-form-field">
              <span className={`worksheet-filter-label ${T.muted}`}>{ui.writingNumberMax}</span>
              <input
                type="number"
                className={T.inputMt}
                min={0}
                max={100}
                value={Number(form.numberRange?.max ?? 5)}
                onChange={(e) =>
                  onChange({
                    numberRange: {
                      ...(form.numberRange || {}),
                      max: Number(e.target.value),
                    },
                  })
                }
              />
            </label>
          </div>
          <div className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingNumberModeField}
            </span>
            <select
              className={T.inputMt}
              value={String(form.numberMode || "digit")}
              onChange={(e) => onChange({ numberMode: e.target.value })}
            >
              {NUMBER_MODE_OPTION_KEYS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}

      {!isPublicDemo && !isReferenceSheet && category === "prewriting" ? (
        <div className="worksheet-form-field">
          <span className={`worksheet-filter-label ${T.muted}`}>
            {ui.writingPrewritingField}
          </span>
          <select
            className={T.inputMt}
            value={String(form.prewritingPathId || "horizontal")}
            onChange={(e) => onChange({ prewritingPathId: e.target.value })}
          >
            {PREWRITING_PATHS.map((pathId) => (
              <option key={pathId} value={pathId}>
                {prewritingPathLabelEn(pathId, locale || "en")}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {!isPublicDemo && !isReferenceSheet && category === "english_words" ? (
        <>
          <div className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingWordPackField}
            </span>
            <select
              className={T.inputMt}
              value={String(form.wordPackId || "animals")}
              onChange={(e) => onChange({ wordPackId: e.target.value, customWords: "" })}
            >
              {Object.keys(wordPacks).map((packId) => (
                <option key={packId} value={packId}>
                  {wordPackLabelEn(wordPacks, packId)}
                </option>
              ))}
              <option value="custom">{t("worksheets.writingWordPackCustom")}</option>
            </select>
          </div>
          {form.wordPackId === "custom" ? (
            <div className="worksheet-form-field">
              <span className={`worksheet-filter-label ${T.muted}`}>
                {ui.writingCustomWordsField}
              </span>
              <input
                type="text"
                className={T.inputMt}
                value={String(form.customWords || "")}
                onChange={(e) => onChange({ customWords: e.target.value, wordPackId: "custom" })}
                placeholder={t("worksheets.writingCustomWordsPlaceholder")}
              />
            </div>
          ) : null}
        </>
      ) : null}

      {!isPublicDemo && !isReferenceSheet && category === "personal_text" ? (
        <>
          <div className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingPersonalKindField}
            </span>
            <select
              className={T.inputMt}
              value={String(form.customTextKind || "first_name")}
              onChange={(e) => onChange({ customTextKind: e.target.value })}
            >
              {PERSONAL_KIND_OPTION_KEYS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>
          <div className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingPersonalTextField}
            </span>
            <input
              type="text"
              className={T.inputMt}
              value={String(form.customText || "")}
              onChange={(e) => onChange({ customText: e.target.value })}
              maxLength={30}
            />
          </div>
        </>
      ) : null}

      {showLetterNumberLayout ? (
        <div className="worksheet-form-grid">
          <label className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>{ui.writingLettersPerRow}</span>
            <select
              className={T.inputMt}
              value={Number(form.itemsPerLine ?? WRITING_REQUEST_DEFAULTS.itemsPerLine)}
              onChange={(e) => onChange({ itemsPerLine: Number(e.target.value) })}
            >
              {ITEMS_PER_LINE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>{ui.writingLetterSize}</span>
            <select
              className={T.inputMt}
              value={String(form.fontSize || WRITING_REQUEST_DEFAULTS.fontSize)}
              onChange={(e) => onChange({ fontSize: e.target.value })}
            >
              {FONT_SIZE_OPTION_KEYS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </label>
          <label className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>{ui.writingPrintStrength}</span>
            <select
              className={T.inputMt}
              value={String(form.printStrength || "normal")}
              onChange={(e) => onChange({ printStrength: e.target.value })}
            >
              {PRINT_STRENGTH_OPTION_KEYS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </label>
          <label className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingOrientationField}
            </span>
            <select
              className={T.inputMt}
              value={String(form.pageOrientation || "portrait")}
              onChange={(e) => onChange({ pageOrientation: e.target.value })}
            >
              <option value="portrait">{ui.writingOrientationPortrait}</option>
              <option value="landscape">{ui.writingOrientationLandscape}</option>
            </select>
          </label>
        </div>
      ) : null}

      <div className="worksheet-form-grid">
        {!isReferenceSheet ? (
        <label className="worksheet-form-field">
          <span className={`worksheet-filter-label ${T.muted}`}>
            {ui.writingTracingField}
          </span>
          <select
            className={T.inputMt}
            value={String(form.tracingMode || "trace_and_copy")}
            onChange={(e) => onChange({ tracingMode: e.target.value })}
            disabled={isPublicDemo}
          >
            {TRACING_OPTION_KEYS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </label>
        ) : null}

        {!isPublicDemo && !isReferenceSheet ? (
          <label className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>{ui.writingTraceDisplayStyle}</span>
            <select
              className={T.inputMt}
              value={String(form.traceRenderMode || "full_trace")}
              onChange={(e) => onChange({ traceRenderMode: e.target.value })}
            >
              {TRACE_RENDER_OPTION_KEYS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {!isPublicDemo ? (
          <label className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingScriptField}
            </span>
            <select
              className={T.inputMt}
              value={String(form.scriptStyle || "print")}
              onChange={(e) => onChange({ scriptStyle: e.target.value })}
            >
              {SCRIPT_OPTION_KEYS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {!isReferenceSheet ? (
        <label className="worksheet-form-field">
          <span className={`worksheet-filter-label ${T.muted}`}>
            {ui.writingLineCountField}
          </span>
          <select
            className={T.inputMt}
            value={Number(form.lineCount || 6)}
            onChange={(e) => onChange({ lineCount: Number(e.target.value) })}
            disabled={isPublicDemo}
          >
            {LINE_COUNT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        ) : null}

        {!isPublicDemo && !showLetterNumberLayout ? (
          <label className="worksheet-form-field">
            <span className={`worksheet-filter-label ${T.muted}`}>
              {ui.writingOrientationField}
            </span>
            <select
              className={T.inputMt}
              value={String(form.pageOrientation || "portrait")}
              onChange={(e) => onChange({ pageOrientation: e.target.value })}
            >
              <option value="portrait">{ui.writingOrientationPortrait}</option>
              <option value="landscape">{ui.writingOrientationLandscape}</option>
            </select>
          </label>
        ) : null}
      </div>

      <label className="worksheet-form-checkbox-row">
        <input
          type="checkbox"
          checked={form.inkSave === true}
          onChange={(e) => onChange({ inkSave: e.target.checked })}
        />
        <span>{ui.inkSave}</span>
      </label>

      {error ? <p className={T.error}>{error}</p> : null}

      <button
        type="button"
        disabled={busy}
        onClick={onSubmit}
        className={`${T.primaryBtn} worksheet-create-submit`}
      >
        {busy
          ? ui.generating
          : isPublicDemo
            ? ui.writingPublicDemoCreate
            : ui.writingCreateWorksheet}
      </button>
    </div>
  );
}
