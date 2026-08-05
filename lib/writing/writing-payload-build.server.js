/**
 * Build WritingWorksheetPayload from validated requests or ready catalog entries.
 * @module lib/writing/writing-payload-build.server
 */

import { createSeededRandom } from "../worksheets/worksheet-seeded-random.server.js";
import {
  ANSWER_TASK_TYPES,
  WRITING_PAYLOAD_KIND,
} from "./writing-worksheet-types.js";
import { getWordIllustration } from "../../data/writing/word-illustration-map.js";
import {
  getWritingWordPacks,
  writingCategoryLabelEn,
  illustrationAssetPath,
  isTraceableGlyphChar,
  prewritingPathAssetPath,
  wordsFromPack,
  wordPackEntries,
} from "./writing-constants.js";
import { applyWritingLayoutDefaults } from "./writing-layout-defaults.server.js";
import {
  resolveWritingStrokeOrderAssetUrl,
  resolveWritingTraceAssetUrl,
} from "./writing-trace-asset-resolver.js";
import {
  REFERENCE_SHEET_PRESETS,
} from "./writing-reference-sheet-presets.js";
import { createTranslator } from "../i18n/create-translator.js";
import { resolveContentLocale } from "../content/locale.js";
import { resolveReadyWritingTitle } from "../../data/writing/ready-title.locale.js";

function writingUiT(locale = "en") {
  return createTranslator(locale || "en").t;
}

/**
 * @param {WritingWorksheetRequest || Record<string, unknown>} request
 * @returns {string}
 */
function localeForRequest(request) {
  const raw = /** @type {Record<string, unknown>} */ (request || {});
  return resolveContentLocale({
    contentLocale: raw.contentLocale || raw.interfaceLocale || raw.instructionLocale || null,
    interfaceLocale: raw.interfaceLocale || raw.contentLocale || null,
  });
}

/**
 * @typedef {import("./writing-worksheet-types.js").WritingWorksheetRequest} WritingWorksheetRequest
 * @typedef {import("./writing-worksheet-types.js").WritingWorksheetPayload} WritingWorksheetPayload
 * @typedef {import("./writing-worksheet-types.js").WritingMeta} WritingMeta
 * @typedef {import("./writing-worksheet-types.js").WritingPage} WritingPage
 * @typedef {import("./writing-worksheet-types.js").WritingBlock} WritingBlock
 * @typedef {import("./writing-worksheet-types.js").WritingItem} WritingItem
 * @typedef {import("./writing-worksheet-types.js").WritingAnswer} WritingAnswer
 * @typedef {import("./writing-worksheet-types.js").ReadyWritingCatalogEntry} ReadyWritingCatalogEntry
 * @typedef {import("./writing-worksheet-types.js").TaskType} TaskType
 * @typedef {import("./writing-worksheet-types.js").PageDirection} PageDirection
 */

/**
 * @param {import("./writing-worksheet-types.js").TracingMode} tracingMode
 * @param {boolean} includeExample
 * @param {boolean} includeCopyRows
 * @param {boolean} includeIndependentRows
 * @param {number} rowIndex
 * @returns {TaskType}
 */
function taskTypeForRow(tracingMode, includeExample, includeCopyRows, includeIndependentRows, rowIndex) {
  if (tracingMode === "trace") return "trace";
  if (tracingMode === "copy") return "copy";
  if (tracingMode === "independent") return "independent_write";
  if (tracingMode === "trace_and_copy") {
    /** @type {TaskType[]} */
    const cycle = [];
    if (includeExample) cycle.push("copy");
    cycle.push("trace", "copy");
    if (includeIndependentRows) cycle.push("independent_write");
    return cycle[rowIndex % cycle.length];
  }
  if (includeExample && rowIndex === 0) return "copy";
  if (includeIndependentRows && rowIndex % 3 === 2) return "independent_write";
  if (includeCopyRows) return "copy";
  return "trace";
}

/**
 * @param {WritingWorksheetRequest || Record<string, unknown>} request
 * @returns {string}
 */
function languageForRequest(request) {
  return localeForRequest(request);
}

/**
 * @param {WritingWorksheetRequest} _request
 * @returns {PageDirection}
 */
function pageDirectionForRequest(_request) {
  return "ltr";
}

/**
 * @param {WritingWorksheetRequest} request
 * @param {string} [titleHeOverride]
 * @returns {WritingMeta}
 */
export function buildWritingMeta(request, titleHeOverride) {
  const language = languageForRequest(request);
  const locale = language;
  const presetKey = /** @type {Record<string, unknown>} */ (request).referenceSheetPreset;
  const preset =
    request.lineTemplate === "reference_sheet" &&
    typeof presetKey === "string" &&
    REFERENCE_SHEET_PRESETS[/** @type {keyof typeof REFERENCE_SHEET_PRESETS} */ (presetKey)]
      ? REFERENCE_SHEET_PRESETS[/** @type {keyof typeof REFERENCE_SHEET_PRESETS} */ (presetKey)]
      : null;
  const presetTitle = preset
    ? typeof preset.titleForLocale === "function"
      ? preset.titleForLocale(locale)
      : preset.title
    : null;
  return {
    title:
      titleHeOverride ||
      presetTitle ||
      writingCategoryLabelEn(request.writingCategory, locale) ||
      writingUiT(locale)("worksheets.writingPracticeFallbackTitle"),
    categoryHe: writingCategoryLabelEn(request.writingCategory, locale) || "",
    writingCategory: request.writingCategory,
    language,
    pageDirection: pageDirectionForRequest(request),
    lineTemplate: request.lineTemplate,
    lineCount: request.lineCount,
    inkSave: request.inkSave === true,
    includeNameField: request.includeNameField === true,
    includeDateField: request.includeDateField === true,
    pageDensity: request.pageDensity,
    fontSize: request.fontSize,
    printStrength: request.printStrength || "normal",
    ...(request.seed !== undefined ? { seed: request.seed } : {}),
  };
}

/**
 * @param {string} prefix
 * @param {number} pageIdx
 * @param {number} rowIdx
 * @param {number} itemIdx
 * @returns {string}
 */
function makeItemId(prefix, pageIdx, rowIdx, itemIdx) {
  return `${prefix}-p${pageIdx}-r${rowIdx}-i${itemIdx}`;
}

/**
 * Per-item trace render mode — trace rows use dashed full_trace by default.
 * @param {TaskType} taskType
 * @param {WritingWorksheetRequest} request
 * @returns {import("./writing-worksheet-types.js").TraceRenderMode}
 */
function resolveItemTraceRenderMode(taskType, request) {
  if (taskType === "trace") {
    const mode = request.traceRenderMode;
    if (mode === "outline" || mode === "stroke_path" || mode === "full_trace") return mode;
    return "full_trace";
  }
  if (taskType === "copy") return "faint_model";
  return "faint_model";
}

/**
 * @param {"en-upper" || "en-lower" || "digits"} group
 * @param {string} glyph
 * @param {import("./writing-worksheet-types.js").ScriptStyle} scriptStyle
 * @param {import("./writing-worksheet-types.js").TraceRenderMode} traceRenderMode
 * @returns {{ svgAssetId?: string, strokeOrderAssetId?: string }}
 */
function glyphAssets(group, glyph, scriptStyle, traceRenderMode) {
  const assets = {
    strokeOrderAssetId: resolveWritingStrokeOrderAssetUrl({
      character: glyph,
      scriptStyle,
      group,
    }),
  };
  if (traceRenderMode !== "faint_model") {
    assets.svgAssetId = resolveWritingTraceAssetUrl({
      scriptStyle,
      character: glyph,
      traceRenderMode,
    });
  }
  return assets;
}

/**
 * @param {WritingWorksheetRequest} request
 * @param {string} text
 * @returns {string || undefined}
 */
function wordImageAssetId(request, text) {
  if (request.includeImage !== true) return undefined;
  const entry = getWordIllustration("en", text);
  return entry ? illustrationAssetPath(entry.illustrationId) : undefined;
}

/**
 * Localized color instruction from the active word pack (chrome only).
 * @param {WritingWorksheetRequest} request
 * @param {string} text
 * @returns {string|undefined}
 */
function wordColorInstruction(request, text) {
  if (request.writingCategory !== "english_words") return undefined;
  const packs = getWritingWordPacks(localeForRequest(request));
  const packId = request.wordPackId || "animals";
  const entry = wordPackEntries(packs, packId).find((w) => {
    if (typeof w === "string") return w === text;
    return (w?.text || w?.word || "") === text;
  });
  if (!entry || typeof entry === "string") return undefined;
  const color =
    entry.colorInstruction ||
    entry.colorInstructionHe ||
    entry.colorInstructionEn ||
    undefined;
  return typeof color === "string" && color.trim() ? color.trim() : undefined;
}

/**
 * @param {string} content
 * @param {import("./writing-worksheet-types.js").WritingWorksheetRequest} request
 * @returns {"en-upper" || "en-lower" || "digits"}
 */
function glyphGroupFor(content, request) {
  const ch = String(content || "").trim();
  if (/^\d+$/.test(ch)) return "digits";
  if (/^[A-Z]$/.test(ch)) return "en-upper";
  if (/^[a-z]$/.test(ch)) return "en-lower";
  if (request.writingCategory === "english_letters") {
    return request.letterCase === "lower" ? "en-lower" : "en-upper";
  }
  throw new Error(`Unsupported glyph for global writing: "${ch}"`);
}

/**
 * @param {WritingWorksheetRequest} request
 * @param {{ itemCounter: { value: number }, pageIdx: number, rowIdx: number, itemIdx: number, content: string, taskType: TaskType, direction: PageDirection }} ctx
 * @returns {WritingItem}
 */
function buildGlyphItem(request, ctx) {
  const group = glyphGroupFor(ctx.content, request);
  const itemTraceMode = resolveItemTraceRenderMode(ctx.taskType, request);
  const assets = glyphAssets(group, ctx.content, request.scriptStyle, itemTraceMode);
  ctx.itemCounter.value += 1;
  return {
    itemType: "glyph",
    itemId: makeItemId("g", ctx.pageIdx, ctx.rowIdx, ctx.itemIdx),
    direction: ctx.direction,
    taskType: ctx.taskType,
    traceRenderMode: itemTraceMode,
    character: ctx.content,
    scriptStyle: request.scriptStyle,
    ...assets,
  };
}

/**
 * @param {WritingWorksheetRequest} request
 * @param {{ pageIdx: number, rowIdx: number, itemIdx: number, text: string, taskType: TaskType, direction: PageDirection, imageAssetId?: string }} ctx
 * @returns {WritingItem}
 */
function buildWordItem(request, ctx) {
  const itemTraceMode = resolveItemTraceRenderMode(ctx.taskType, request);
  const colorInstructionHe = wordColorInstruction(request, ctx.text);
  return {
    itemType: "word",
    itemId: makeItemId("w", ctx.pageIdx, ctx.rowIdx, ctx.itemIdx),
    direction: ctx.direction,
    taskType: ctx.taskType,
    traceRenderMode: itemTraceMode,
    text: ctx.text,
    scriptStyle: request.scriptStyle,
    hasNikud: request.nikudMode === "word_nikud" || request.nikudMode === "basic_vowels",
    ...(ctx.imageAssetId || colorInstructionHe
      ? {
          image: {
            ...(ctx.imageAssetId ? { assetId: ctx.imageAssetId } : {}),
            altHe: ctx.text,
            ...(colorInstructionHe ? { colorInstructionHe } : {}),
          },
        }
      : {}),
  };
}

/**
 * Multi-digit numbers in digit trace mode render as separate per-digit glyph cells.
 * @param {string} unit
 * @param {WritingWorksheetRequest} request
 * @param {string} numberMode
 * @returns {string[] || null}
 */
function digitCellsForNumberUnit(unit, request, numberMode) {
  const text = String(unit || "").trim();
  if (!/^\d+$/.test(text) || text.length <= 1) return null;
  if (numberMode !== "digit") return null;
  if (request.lineTemplate === "single_digit_trace" || request.writingCategory === "numbers") {
    return text.split("");
  }
  return null;
}

/**
 * @param {WritingWorksheetRequest} request
 * @returns {string[]}
 */
function resolvePracticeUnits(request) {
  if (request.writingCategory === "mixed") {
    const mixed = /** @type {Record<string, unknown>} */ (request);
    if (Array.isArray(mixed.characters) && mixed.characters.length) {
      return mixed.characters.map((c) => String(c));
    }
    if (mixed.numberRange && typeof mixed.numberRange === "object") {
      const range = /** @type {{ min: number, max: number }} */ (mixed.numberRange);
      /** @type {string[]} */
      const values = [];
      for (let n = range.min; n <= range.max; n += 1) values.push(String(n));
      return values;
    }
    if (typeof mixed.prewritingPathId === "string") {
      return [mixed.prewritingPathId];
    }
    return [];
  }

  if (request.writingCategory === "english_letters") {
    return request.characters;
  }
  if (request.writingCategory === "numbers") {
    /** @type {string[]} */
    const values = [];
    for (let n = request.numberRange.min; n <= request.numberRange.max; n += 1) {
      values.push(String(n));
    }
    return values;
  }
  if (request.writingCategory === "prewriting") {
    return [request.prewritingPathId];
  }
  if (request.writingCategory === "english_words") {
    if (request.wordPackId === "custom" && request.words?.length) {
      return request.words;
    }
    const packs = getWritingWordPacks(localeForRequest(request));
    return wordsFromPack(packs, request.wordPackId || "animals");
  }
  if (request.writingCategory === "personal_text") {
    const text = String(request.customText || "");
    const kind = request.customTextKind || "first_name";
    if (kind === "word_list") {
      return text.split(/[\s,]+/).filter(Boolean);
    }
    if (kind === "word" || kind === "short_phrase" || kind === "greeting") {
      return text ? [text] : [];
    }
    return [...text];
  }
  return [];
}

/**
 * One A4 reference sheet — each unit once, trace only, no repeats.
 * @param {WritingWorksheetRequest} request
 * @param {number} pageIdx
 * @returns {WritingBlock[]}
 */
function buildReferenceSheetBlocks(request, pageIdx) {
  const direction = pageDirectionForRequest(request);
  const locale = localeForRequest(request);
  const units = resolvePracticeUnits(request);
  if (!units.length) {
    return [
      {
        blockType: "instruction",
        direction,
        text: writingUiT(locale)("worksheets.writingNoPracticeContent"),
      },
    ];
  }

  const itemCounter = { value: 0 };
  /** @type {import("./writing-worksheet-types.js").WritingRow[]} */
  const rows = [];
  let unitIdx = 0;

  for (let rowIdx = 0; rowIdx < request.lineCount && unitIdx < units.length; rowIdx += 1) {
    /** @type {WritingItem[]} */
    const items = [];
    for (let slot = 0; slot < request.itemsPerLine && unitIdx < units.length; slot += 1) {
      const unit = units[unitIdx];
      unitIdx += 1;
      const isNumberUnit = request.writingCategory === "numbers";
      const itemDirection = direction;

      if (isNumberUnit) {
        items.push(
          buildGlyphItem(request, {
            itemCounter,
            pageIdx,
            rowIdx,
            itemIdx: items.length,
            content: unit,
            taskType: "trace",
            direction: itemDirection,
          })
        );
      } else {
        items.push(
          buildGlyphItem(request, {
            itemCounter,
            pageIdx,
            rowIdx,
            itemIdx: items.length,
            content: unit,
            taskType: "trace",
            direction: itemDirection,
          })
        );
      }
    }
    if (items.length) {
      rows.push({
        rowId: `ref-row-${pageIdx}-${rowIdx}`,
        items,
      });
    }
  }

  const presetKey = /** @type {Record<string, unknown>} */ (request).referenceSheetPreset;
  const preset =
    typeof presetKey === "string" &&
    REFERENCE_SHEET_PRESETS[/** @type {keyof typeof REFERENCE_SHEET_PRESETS} */ (presetKey)]
      ? REFERENCE_SHEET_PRESETS[/** @type {keyof typeof REFERENCE_SHEET_PRESETS} */ (presetKey)]
      : null;
  const presetTitle = preset
    ? typeof preset.titleForLocale === "function"
      ? preset.titleForLocale(locale)
      : preset.title
    : writingCategoryLabelEn(request.writingCategory, locale) ||
      writingUiT(locale)("worksheets.writingPracticeFallbackTitle");

  return [
    {
      blockType: "title",
      direction,
      text: presetTitle,
    },
    {
      blockType: "instruction",
      direction,
      text: writingUiT(locale)("worksheets.writingTraceEachOnce"),
    },
    {
      blockType: "practice",
      direction,
      rows,
    },
  ];
}

/**
 * @param {WritingWorksheetRequest} request
 * @param {number} pageIdx
 * @returns {WritingBlock[]}
 */
function buildBlocksForCategory(request, pageIdx) {
  if (request.lineTemplate === "reference_sheet") {
    return buildReferenceSheetBlocks(request, pageIdx);
  }

  const direction = pageDirectionForRequest(request);
  const locale = localeForRequest(request);
  const units = resolvePracticeUnits(request);
  if (!units.length) {
    return [
      {
        blockType: "instruction",
        direction,
        text: writingUiT(locale)("worksheets.writingNoPracticeContent"),
      },
    ];
  }

  /** @type {import("./writing-worksheet-types.js").WritingRow[]} */
  const rows = [];
  const itemCounter = { value: 0 };

  for (let rowIdx = 0; rowIdx < request.lineCount; rowIdx += 1) {
    const taskType = taskTypeForRow(
      request.tracingMode,
      request.includeExample,
      request.includeCopyRows,
      request.includeIndependentRows,
      rowIdx
    );

    /** @type {WritingItem[]} */
    const items = [];
    for (let slot = 0; slot < request.itemsPerLine; slot += 1) {
      const unit = units[(rowIdx * request.itemsPerLine + slot) % units.length];
      for (let rep = 0; rep < request.repeatsPerLine; rep += 1) {
        const itemIdx = items.length;
        const isPrewriting =
          request.writingCategory === "prewriting" ||
          (request.writingCategory === "mixed" &&
            typeof /** @type {Record<string, unknown>} */ (request).prewritingPathId === "string");
        const isNumberUnit =
          request.writingCategory === "numbers" ||
          (request.writingCategory === "mixed" &&
            /^\d+$/.test(unit) &&
            /** @type {Record<string, unknown>} */ (request).numberRange);

        if (isPrewriting) {
          items.push({
            itemType: "path",
            itemId: makeItemId("p", pageIdx, rowIdx, itemIdx),
            direction,
            taskType: "trace",
            pathAssetId: prewritingPathAssetPath(unit),
          });
        } else if (
          request.writingCategory === "english_words" ||
          (request.writingCategory === "personal_text" &&
            (request.customTextKind === "word" ||
              request.customTextKind === "word_list" ||
              request.customTextKind === "short_phrase" ||
              request.customTextKind === "greeting"))
        ) {
          items.push(
            buildWordItem(request, {
              pageIdx,
              rowIdx,
              itemIdx,
              text: unit,
              taskType,
              direction,
              imageAssetId: wordImageAssetId(request, unit),
            })
          );
        } else if (isNumberUnit) {
          const value = Number(unit);
          /** @type {TaskType} */
          let numberTask = taskType;
          const numberMode =
            request.writingCategory === "numbers"
              ? request.numberMode
              : String(/** @type {Record<string, unknown>} */ (request).numberMode || "digit");
          if (numberMode === "quantity_match") numberTask = "quantity_match";
          if (numberMode === "sequence") numberTask = "number_sequence";
          if (numberMode === "before_after") numberTask = "before_after";
          const digitCells = digitCellsForNumberUnit(unit, request, numberMode);
          if (digitCells && (numberTask === "trace" || numberTask === "copy")) {
            for (const digit of digitCells) {
              items.push(
                buildGlyphItem(request, {
                  itemCounter,
                  pageIdx,
                  rowIdx,
                  itemIdx: items.length,
                  content: digit,
                  taskType: numberTask,
                  direction,
                })
              );
            }
            continue;
          }
          const itemTraceMode =
            numberMode === "digit"
              ? resolveItemTraceRenderMode(numberTask, request)
              : "faint_model";
          items.push({
            itemType: "number",
            itemId: makeItemId("n", pageIdx, rowIdx, itemIdx),
            direction,
            taskType: numberTask,
            traceRenderMode: itemTraceMode,
            value,
            ...(numberMode === "digit" && String(unit).length === 1
              ? glyphAssets("digits", unit, request.scriptStyle, itemTraceMode)
              : {}),
            ...(numberMode === "quantity_match"
              ? { image: { assetId: illustrationAssetPath(`qty-${String(value).padStart(2, "0")}`) } }
              : {}),
          });
        } else {
          const itemDirection = direction;
          if (!isTraceableGlyphChar(unit, request)) {
            items.push({
              itemType: "blank",
              itemId: makeItemId("b", pageIdx, rowIdx, itemIdx),
              direction: itemDirection,
              taskType,
            });
            continue;
          }
          items.push(
            buildGlyphItem(request, {
              itemCounter,
              pageIdx,
              rowIdx,
              itemIdx,
              content: unit,
              taskType,
              direction: itemDirection,
            })
          );
        }
      }
    }

    rows.push({
      rowId: `row-${pageIdx}-${rowIdx}`,
      items,
    });
  }

  /** @type {WritingBlock[]} */
  const blocks = [
    {
      blockType: "title",
      direction,
      text:
        writingCategoryLabelEn(request.writingCategory, locale) ||
        writingUiT(locale)("worksheets.writingPracticeFallbackTitle"),
    },
    {
      blockType: "instruction",
      direction,
      text: instructionHeForRequest(request),
    },
    {
      blockType: "practice",
      direction,
      rows,
    },
  ];

  if (request.includeNameField || request.includeDateField) {
    blocks.push({
      blockType: "answer_area",
      direction,
      rows: [
        {
          rowId: `footer-${pageIdx}`,
          items: [
            ...(request.includeNameField
              ? [
                  {
                    itemType: "blank",
                    itemId: makeItemId("b-name", pageIdx, 0, 0),
                    direction,
                    lineTemplate: request.lineTemplate,
                  },
                ]
              : []),
            ...(request.includeDateField
              ? [
                  {
                    itemType: "blank",
                    itemId: makeItemId("b-date", pageIdx, 0, 1),
                    direction,
                    lineTemplate: request.lineTemplate,
                  },
                ]
              : []),
          ],
        },
      ],
    });
  }

  return blocks;
}

/**
 * @param {WritingWorksheetRequest} request
 * @returns {string}
 */
function instructionHeForRequest(request) {
  const t = writingUiT(localeForRequest(request));
  if (request.lineTemplate === "reference_sheet") {
    return t("worksheets.writingTraceEachOnce");
  }
  if (request.tracingMode === "copy") return t("worksheets.writingInstructionCopyByHand");
  if (request.tracingMode === "independent") return t("worksheets.writingInstructionIndependent");
  if (request.writingCategory === "prewriting") return t("worksheets.writingInstructionFollowLines");
  if (
    request.writingCategory === "numbers" &&
    /** @type {import("./writing-worksheet-types.js").NumbersWritingRequest} */ (request).numberMode ===
      "quantity_match"
  ) {
    return t("worksheets.writingInstructionQuantityMatch");
  }
  return t("worksheets.writingInstructionTraceAndWrite");
}

/**
 * @param {WritingWorksheetRequest} request
 * @returns {WritingPage[]}
 */
export function buildPages(request) {
  const pageIdx = 0;
  return [
    {
      pageId: `page-${pageIdx}`,
      orientation: request.pageOrientation,
      blocks: buildBlocksForCategory(request, pageIdx),
    },
  ];
}

/**
 * @param {WritingPage[]} pages
 * @returns {boolean}
 */
export function computeRequiresAnswerKey(pages) {
  return pages.some((page) =>
    page.blocks.some((block) => {
      if (block.blockType !== "practice" && block.blockType !== "answer_area") return false;
      return block.rows.some((row) => row.items.some((item) => ANSWER_TASK_TYPES.has(item.taskType)));
    })
  );
}

/**
 * Collect all items from pages.
 * @param {WritingPage[]} pages
 * @returns {WritingItem[]}
 */
function collectItems(pages) {
  /** @type {WritingItem[]} */
  const items = [];
  for (const page of pages) {
    for (const block of page.blocks) {
      if (block.blockType !== "practice" && block.blockType !== "answer_area") continue;
      for (const row of block.rows) {
        items.push(...row.items);
      }
    }
  }
  return items;
}

/**
 * @param {WritingItem[]} items
 * @returns {WritingAnswer[]}
 */
export function buildAnswers(items) {
  /** @type {WritingAnswer[]} */
  const answers = [];
  for (const item of items) {
    if (!ANSWER_TASK_TYPES.has(item.taskType)) continue;
    if (item.itemType === "glyph") {
      answers.push({ itemRef: item.itemId, correctAnswer: item.character });
    } else if (item.itemType === "word") {
      answers.push({ itemRef: item.itemId, correctAnswer: item.text });
    } else if (item.itemType === "number") {
      answers.push({
        itemRef: item.itemId,
        correctAnswer: String(item.value),
        ...(item.taskType === "quantity_match"
          ? { explanationHe: `The correct quantity is ${item.value}` }
          : {}),
      });
    }
  }
  return answers;
}

/**
 * @param {WritingWorksheetRequest} request
 * @param {{ title?: string, slug?: string || null, catalogNumber?: string || null, savedAt?: number || null }} [opts]
 * @returns {WritingWorksheetPayload}
 */
export function buildWritingPayloadFromRequest(request, opts = {}) {
  const normalizedRequest = applyWritingLayoutDefaults(request);
  if (normalizedRequest.seed !== undefined) {
    const rng = createSeededRandom(normalizedRequest.seed);
    rng();
  }

  const pages = buildPages(normalizedRequest);
  const requiresAnswerKey = computeRequiresAnswerKey(pages);
  const items = collectItems(pages);
  const answers = requiresAnswerKey ? buildAnswers(items) : null;

  return {
    payloadKind: WRITING_PAYLOAD_KIND,
    slug: opts.slug ?? null,
    catalogNumber: opts.catalogNumber ?? null,
    writingCategory: normalizedRequest.writingCategory,
    language: languageForRequest(normalizedRequest),
    pageDirection: pageDirectionForRequest(normalizedRequest),
    scriptStyle: normalizedRequest.scriptStyle,
    tracingMode: normalizedRequest.tracingMode,
    meta: buildWritingMeta(normalizedRequest, opts.title),
    pages,
    requiresAnswerKey,
    answers,
    savedAt: opts.savedAt ?? null,
  };
}

/**
 * @param {ReadyWritingCatalogEntry} entry
 * @returns {WritingWorksheetRequest}
 */
export function readyEntryToWritingRequest(entry) {
  /** @type {Record<string, unknown>} */
  const defaults = entry.requestDefaults || entry.builderConfig || {};
  /** @type {Record<string, unknown>} */
  const body = {
    worksheetType: "writing",
    writingCategory: entry.writingCategory,
    scriptStyle: "print",
    tracingMode: "trace_and_copy",
    traceRenderMode: "faint_model",
    nikudMode: "none",
    lineTemplate: "trace_row",
    lineCount: 6,
    itemsPerLine: 4,
    repeatsPerLine: 1,
    fontSize: "md",
    strokeStyle: "dashed",
    includeExample: true,
    includeCopyRows: true,
    includeIndependentRows: false,
    includeImage: false,
    includeNameField: true,
    includeDateField: true,
    pageOrientation: "portrait",
    pageDensity: "comfortable",
    showStartPoint: false,
    showDirectionArrows: false,
    showStrokeNumbers: false,
    inkSave: false,
    ...defaults,
    ...(entry.seed !== undefined ? { seed: entry.seed } : {}),
    inkSave: entry.inkSave === true,
  };
  return /** @type {WritingWorksheetRequest} */ (body);
}

/**
 * @param {ReadyWritingCatalogEntry} entry
 * @returns {WritingWorksheetPayload}
 */
export function buildReadyWritingPayload(entry, localeOpts = {}) {
  const request = readyEntryToWritingRequest(entry);
  const interfaceLocale = String(localeOpts.interfaceLocale || "").trim();
  const contentLocale = String(localeOpts.contentLocale || interfaceLocale || "").trim();
  if (interfaceLocale) {
    /** @type {Record<string, unknown>} */ (request).interfaceLocale = interfaceLocale;
  }
  if (contentLocale) {
    /** @type {Record<string, unknown>} */ (request).contentLocale = contentLocale;
    /** @type {Record<string, unknown>} */ (request).instructionLocale = contentLocale;
  }

  let title = entry.title;
  if (contentLocale && typeof entry.title === "string") {
    title = resolveReadyWritingTitle(entry.title, contentLocale);
  }

  return buildWritingPayloadFromRequest(request, {
    title,
    slug: entry.slug,
    catalogNumber: entry.catalogNumber,
    savedAt: null,
  });
}

/**
 * Strip session-only keys before API transport.
 * @param {WritingWorksheetPayload} payload
 * @returns {WritingWorksheetPayload}
 */
export function publicWritingPayload(payload) {
  const next = {
    ...payload,
    meta: { ...payload.meta },
    pages: payload.pages,
    answers: payload.answers,
    savedAt: null,
  };
  delete next.meta.seed;
  return next;
}

/**
 * @param {WritingWorksheetPayload} payload
 * @returns {{ pass: boolean, errors: string[] }}
 */
export function validateWritingAnswerIntegrity(payload) {
  /** @type {string[]} */
  const errors = [];
  if (!payload.requiresAnswerKey) {
    if (payload.answers?.length) {
      errors.push("answers present but requiresAnswerKey is false");
    }
    return { pass: errors.length === 0, errors };
  }
  const items = collectItems(payload.pages);
  const itemIds = new Set(items.map((i) => i.itemId));
  for (const answer of payload.answers || []) {
    if (!itemIds.has(answer.itemRef)) {
      errors.push(`itemRef missing itemId: ${answer.itemRef}`);
    }
  }
  return { pass: errors.length === 0, errors };
}
