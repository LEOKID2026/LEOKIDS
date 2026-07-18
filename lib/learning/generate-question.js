/**
 * Unified question generation contract — shared logic + locale content packs.
 */

import { resolveContentLocale } from "../content/locale.js";
import { resolveCurriculum, resolveMarket } from "../i18n/market-curriculum.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";

/**
 * @typedef {{
 *   subject: string,
 *   grade?: string|null,
 *   skill?: string|null,
 *   difficulty?: string|null,
 *   contentLocale?: string|null,
 *   interfaceLocale?: string|null,
 *   market?: string|null,
 *   curriculum?: string|null,
 *   generator: (ctx: Record<string, unknown>) => Record<string, unknown>|null,
 *   generatorContext?: Record<string, unknown>,
 * }} GenerateQuestionInput
 */

/**
 * @param {GenerateQuestionInput} input
 */
export function generateQuestion(input) {
  const contentLocale = resolveContentLocale({
    contentLocale: input.contentLocale,
    interfaceLocale: input.interfaceLocale,
    subject: input.subject,
    market: resolveMarket(input.interfaceLocale, input.market),
    curriculum: resolveCurriculum(input.interfaceLocale, input.curriculum),
  });

  const ctx = {
    subject: input.subject,
    grade: input.grade,
    skill: input.skill,
    difficulty: input.difficulty,
    contentLocale,
    market: resolveMarket(input.interfaceLocale, input.market),
    curriculum: resolveCurriculum(input.interfaceLocale, input.curriculum),
    ...(input.generatorContext || {}),
  };

  const raw = input.generator(ctx);
  if (!raw) return null;

  return localizeLearningQuestion(raw, { contentLocale, subject: input.subject });
}
