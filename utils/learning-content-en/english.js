import { burnDownCopyForLocale } from "../../lib/learning/burn-down-copy.js";
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";
import { WORD_LISTS } from "../../data/english-questions/index.js";
import {
  isSpanishInstructionLocale,
  remapStoredMeaningToInstructionLocale,
  resolveEnglishWordMeaning,
} from "../../data/english-questions/word-meanings-locale.js";
import { resolveWritingSentenceCue } from "../../data/english-questions/writing-sentence-cues-locale.js";

const PHONICS_LABELS = {};

const POOL_FALLBACK_EN = {};

/** EN explanation → burn-down key under utils__learning-content-en__english */
const EXPLANATION_BURN_DOWN_KEYS = Object.freeze({
  "With I we use am.": "with_i_we_use_am",
  "With he/she/it we use is.": "with_he_she_it_we_use_is",
  "With you/we/they we use are.": "with_you_we_they_we_use_are",
});

const ENGLISH_BURN_DOWN_SLUG = "utils__learning-content-en__english";

function isEnToMeaningDirection(direction) {
  return direction === "en_to_meaning";
}

function isMeaningToEnDirection(direction) {
  return direction === "meaning_to_en";
}

function englishWordsFromList(listKey, excludeEn) {
  const list = WORD_LISTS[listKey] || WORD_LISTS.colors || {};
  return Object.keys(list).filter((w) => w !== excludeEn);
}

function translateEnglishPhrase(text) {
  return String(text ?? "").trim();
}

/**
 * Resolve English-subject explanation by instructionLocale.
 * Prefer explanationByLocale; never serve Hebrew; fall back to EN then known burn-down strings.
 * @param {Record<string, unknown>} question
 * @param {string|null|undefined} instructionLocale
 */
function resolveEnglishExplanation(question, instructionLocale) {
  const byLocale =
    (question.explanationByLocale && typeof question.explanationByLocale === "object"
      ? question.explanationByLocale
      : null) ||
    (question.params &&
    typeof question.params === "object" &&
    question.params.explanationByLocale &&
    typeof question.params.explanationByLocale === "object"
      ? question.params.explanationByLocale
      : null);

  const esUi = isSpanishInstructionLocale(instructionLocale);

  if (byLocale) {
    if (esUi && typeof byLocale["es-419"] === "string" && byLocale["es-419"].trim()) {
      return String(byLocale["es-419"]).trim();
    }
    if (typeof byLocale.en === "string" && byLocale.en.trim()) {
      return String(byLocale.en).trim();
    }
  }

  const raw = String(question.explanation || "").trim();
  if (raw && !containsHebrew(raw)) {
    if (esUi) {
      const key = EXPLANATION_BURN_DOWN_KEYS[raw];
      if (key) {
        const localized = burnDownCopyForLocale("es-419", ENGLISH_BURN_DOWN_SLUG, key);
        if (localized && localized !== key) return localized;
      }
    }
    return raw;
  }

  // Hebrew or empty: prefer EN from byLocale / burn-down / pattern heuristics
  let enFallback =
    (byLocale && typeof byLocale.en === "string" && byLocale.en.trim()) || "";
  if (!enFallback) {
    const pattern = String(question.params?.patternFamily || question.patternFamily || "");
    if (/grammar_be|be_basic|be_present/i.test(pattern) || /grammar_be/i.test(String(question.params?.topic || ""))) {
      enFallback = burnDownCopyForLocale("en", ENGLISH_BURN_DOWN_SLUG, "with_i_we_use_am");
      if (enFallback === "with_i_we_use_am") enFallback = "With I we use am.";
    }
  }
  if (!enFallback) return "";

  if (esUi) {
    const key = EXPLANATION_BURN_DOWN_KEYS[enFallback];
    if (key) {
      const localized = burnDownCopyForLocale("es-419", ENGLISH_BURN_DOWN_SLUG, key);
      if (localized && localized !== key) return localized;
    }
  }
  return enFallback;
}

/**
 * Stable English word ID for a vocab/writing question (never Hebrew on Global path).
 * @param {Record<string, unknown>} question
 */
function resolveStableEnglishWordId(question) {
  const p = question?.params || {};
  const candidates = [p.wordEn, p.word, p.translation];
  for (const c of candidates) {
    const s = String(c || "").trim();
    if (s && !containsHebrew(s)) {
      if (p.listKey && WORD_LISTS[p.listKey]?.[s] != null) return s;
      if (!p.listKey) {
        for (const list of Object.values(WORD_LISTS || {})) {
          if (list?.[s] != null) return s;
        }
      }
      // Prefer non-Hebrew params.word / wordEn even if not in lists
      if (c === p.wordEn || c === p.word) return s;
    }
  }
  return "";
}

/**
 * Display meaning for instructionLocale. Global never returns Hebrew.
 * @param {string} enWord
 * @param {string|undefined} listKey
 * @param {string|null|undefined} instructionLocale
 */
function displayMeaningForLocale(enWord, listKey, instructionLocale) {
  if (!enWord) return "";
  // Global never serves HE — resolve via Spanish pack or English word ID
  if (isSpanishInstructionLocale(instructionLocale)) {
    return resolveEnglishWordMeaning(enWord, { listKey, instructionLocale });
  }
  return resolveEnglishWordMeaning(enWord, {
    listKey,
    instructionLocale: "en",
  });
}

function rebuildEnglishStem(question, instructionLocale) {
  const p = question?.params || {};
  const topic = String(p.topic || question?.topic || "");
  const patternFamily = String(p.patternFamily || "");
  const listKey = p.listKey || undefined;
  const esUi = isSpanishInstructionLocale(instructionLocale);

  if (topic === "vocabulary" || patternFamily.startsWith("vocab_")) {
    const enWord = resolveStableEnglishWordId(question);
    if (isEnToMeaningDirection(p.direction) && enWord) {
      if (esUi) {
        return `¿Qué significa "${enWord}"? Elige el mejor significado.`;
      }
      return `What does "${enWord}" mean? Choose the best English match.`;
    }
    if (isMeaningToEnDirection(p.direction) && enWord) {
      const meaning =
        (typeof p.localizedMeaning === "string" && p.localizedMeaning.trim()) ||
        displayMeaningForLocale(enWord, listKey, instructionLocale);
      if (esUi) {
        return `Escribe la palabra en inglés para: "${meaning}"`;
      }
      if (meaning && meaning !== enWord) {
        return `Write the English word for: "${meaning}"`;
      }
      return `Write the English word: "${enWord}"`;
    }
    if (enWord) {
      if (esUi) {
        return `¿Qué significa "${enWord}"? Elige el mejor significado.`;
      }
      return `What does "${enWord}" mean? Choose the best English match.`;
    }
  }

  if (topic === "translation" || patternFamily.startsWith("translation_")) {
    if (isEnToMeaningDirection(p.direction) && p.sentence && !containsHebrew(String(p.sentence))) {
      if (esUi) return `Elige el significado correcto.`;
      return `Choose the correct meaning.`;
    }
    if (isMeaningToEnDirection(p.direction)) {
      const cue =
        (typeof p.localizedMeaning === "string" && p.localizedMeaning.trim()) ||
        (p.sentence && !containsHebrew(String(p.sentence)) ? String(p.sentence) : "");
      if (cue) {
        return esUi ? `Escribe en inglés: "${cue}"` : `Write in English: "${cue}"`;
      }
    }
    if (p.sentence && !containsHebrew(String(p.sentence))) {
      if (esUi) return `Elige la oración correcta en inglés.`;
      return `Choose the correct English sentence.`;
    }
    if (p.localizedMeaning && !containsHebrew(String(p.localizedMeaning))) {
      if (esUi) return `Escribe en inglés: "${p.localizedMeaning}"`;
      return `Write in English: "${p.localizedMeaning}"`;
    }
    if (p.translation && !containsHebrew(String(p.translation))) {
      if (esUi) return `Escribe en inglés: "${p.translation}"`;
      return `Write in English: "${p.translation}"`;
    }
    if (p.sentence && containsHebrew(String(p.sentence)) && p.translation) {
      const en = !containsHebrew(String(p.translation)) ? p.translation : "";
      if (en) {
        return esUi ? `Escribe en inglés: "${en}"` : `Write in English: "${en}"`;
      }
    }
  }

  if (topic === "writing" || patternFamily.startsWith("writing_")) {
    if (p.type === "word" && p.wordEn && !containsHebrew(String(p.wordEn))) {
      const enWord = String(p.wordEn).trim();
      const meaning =
        (typeof p.localizedMeaning === "string" && p.localizedMeaning.trim()) ||
        displayMeaningForLocale(enWord, listKey, instructionLocale);
      if (esUi && meaning && meaning !== enWord) {
        return `Escribe en inglés: "${meaning}"`;
      }
      if (meaning && meaning !== enWord) {
        return `Write in English: "${meaning}"`;
      }
      return `Write the English word: "${enWord}"`;
    }
    if (p.type === "sentence") {
      const sentenceEn = p.sentenceEn && !containsHebrew(String(p.sentenceEn)) ? String(p.sentenceEn).trim() : "";
      const cue = resolveWritingSentenceCue(
        sentenceEn,
        (typeof p.localizedMeaning === "string" && p.localizedMeaning.trim()) ||
          (typeof p.sentenceCue === "string" && p.sentenceCue.trim()) ||
          "",
        { instructionLocale }
      );
      if (cue) {
        return esUi ? `Escribe en inglés: "${cue}"` : `Write in English: "${cue}"`;
      }
      if (sentenceEn) {
        return esUi
          ? `Completa o escribe la oración en inglés.`
          : `Complete the sentence.`;
      }
      return esUi ? `Completa la oración.` : `Complete the sentence.`;
    }
    if (p.wordEn && !containsHebrew(String(p.wordEn))) {
      return `Write the English word: "${String(p.wordEn).trim()}"`;
    }
  }

  if (topic === "sentences" || patternFamily.startsWith("sentence_")) {
    return esUi
      ? `Elige la oración correcta en inglés.`
      : `Choose the correct English sentence.`;
  }

  if (topic === "grammar" && question?.question && !containsHebrew(String(question.question))) {
    return String(question.question);
  }

  if (topic === "phonics" && question?.questionLabel) {
    return translateEnglishPhrase(question.questionLabel);
  }

  return null;
}

function localizeEnglishField(question, field, value, instructionLocale) {
  const text = String(value ?? "");
  const p = question?.params || {};
  const listKey = p.listKey || "colors";

  // Instructional stems: rebuild even when no Hebrew remains
  if (field === "questionLabel" || field === "question" || field === "exerciseText") {
    const rebuilt = rebuildEnglishStem(question, instructionLocale);
    if (rebuilt) return rebuilt;
    if (containsHebrew(text)) {
      const translated = translateEnglishPhrase(text);
      if (!containsHebrew(translated)) return translated;
    }
    return text;
  }

  // Meaning / answer options: remap by stable English word ID
  if (
    isEnToMeaningDirection(p.direction) ||
    isMeaningToEnDirection(p.direction) ||
    p.patternFamily === "writing_word" ||
    p.type === "word"
  ) {
    const enWord = resolveStableEnglishWordId(question);

    if (isEnToMeaningDirection(p.direction)) {
      // Options / correct answer are meanings in instructionLocale
      if (field === "correctAnswer" || field === "answers") {
        if (
          typeof p.localizedMeaning === "string" &&
          p.localizedMeaning.trim() &&
          field === "correctAnswer" &&
          (text === p.localizedMeaning || text === p.translation || containsHebrew(text))
        ) {
          return displayMeaningForLocale(enWord, listKey, instructionLocale) || p.localizedMeaning;
        }
        const remapped = remapStoredMeaningToInstructionLocale(text, {
          listKey,
          enWordHint:
            field === "correctAnswer" ||
            text === p.translation ||
            text === p.localizedMeaning ||
            text === question?.correctAnswer
              ? enWord
              : undefined,
          instructionLocale: isSpanishInstructionLocale(instructionLocale)
            ? instructionLocale
            : "en",
        });
        if (remapped && !containsHebrew(remapped)) return remapped;
        if (WORD_LISTS[listKey]?.[text] != null) {
          return displayMeaningForLocale(text, listKey, instructionLocale);
        }
        if (containsHebrew(text)) {
          if (field === "correctAnswer" && enWord) {
            return displayMeaningForLocale(enWord, listKey, instructionLocale);
          }
          const enWords = englishWordsFromList(listKey, enWord);
          const pick = enWords[Math.abs(String(text).length) % Math.max(enWords.length, 1)];
          return (
            displayMeaningForLocale(pick, listKey, instructionLocale) ||
            translateEnglishPhrase(text)
          );
        }
      }
    }

    if (isMeaningToEnDirection(p.direction)) {
      // Correct answer / options stay English word IDs
      if (field === "correctAnswer" && enWord) return enWord;
      if (field === "answers" && containsHebrew(text) && enWord) {
        return enWord;
      }
      if (field === "correctAnswer" && p.wordEn && !containsHebrew(String(p.wordEn))) {
        return String(p.wordEn);
      }
      if (field === "correctAnswer" && p.translation && !containsHebrew(String(p.translation))) {
        return String(p.translation);
      }
    }

    if ((p.patternFamily === "writing_word" || p.type === "word") && field === "correctAnswer") {
      if (p.wordEn && !containsHebrew(String(p.wordEn))) return String(p.wordEn);
    }
  }

  if (POOL_FALLBACK_EN[text.trim()]) return POOL_FALLBACK_EN[text.trim()];

  if (isEnToMeaningDirection(p.direction) && field !== "question" && containsHebrew(text)) {
    const enWord = resolveStableEnglishWordId(question);
    if (enWord) return displayMeaningForLocale(enWord, listKey, instructionLocale);
    if (text === p.translation && p.word) {
      return displayMeaningForLocale(String(p.word), listKey, instructionLocale);
    }
    const enWords = englishWordsFromList(listKey, p.word);
    return enWords[Math.abs(text.length) % enWords.length] || translateEnglishPhrase(text);
  }

  if (containsHebrew(text)) {
    return translateEnglishPhrase(text);
  }

  return text;
}

/**
 * English-subject display layer.
 * Learning targets (English words/sentences) stay English.
 * Meanings / instructional stems follow instructionLocale (es-419 → Spanish, en → English).
 * Global never serves Hebrew.
 *
 * @param {Record<string, unknown>} question
 * @param {{ instructionLocale?: string|null, interfaceLocale?: string|null }} [opts]
 */
export function localizeEnglishQuestionEn(question, opts = {}) {
  if (!question) return question;
  const instructionLocale =
    opts.instructionLocale || opts.interfaceLocale || "en";

  const rebuilt = rebuildEnglishStem(question, instructionLocale);
  const out = mapQuestionTextFields({ ...question }, (field, value, q) =>
    localizeEnglishField(q, field, value, instructionLocale)
  );
  if (rebuilt) {
    out.question = rebuilt;
    if (!out.exerciseText || containsHebrew(String(out.exerciseText))) {
      out.exerciseText = rebuilt;
    }
  }
  if (typeof out.questionLabel === "string" && containsHebrew(out.questionLabel)) {
    out.questionLabel = translateEnglishPhrase(out.questionLabel);
  }
  if (typeof out.correctAnswer === "string") {
    out.correctAnswer = localizeEnglishField(
      out,
      "correctAnswer",
      out.correctAnswer,
      instructionLocale
    );
  }
  if (Array.isArray(out.answers)) {
    out.answers = out.answers.map((a) =>
      typeof a === "string"
        ? localizeEnglishField(out, "answers", a, instructionLocale)
        : a
    );
  }
  if (Array.isArray(out.options)) {
    out.options = out.options.map((a) =>
      typeof a === "string"
        ? localizeEnglishField(out, "answers", a, instructionLocale)
        : a
    );
  }
  out.explanation = resolveEnglishExplanation(out, instructionLocale);

  // Strip residual Hebrew from params; prefer localizedMeaning
  if (out.params && typeof out.params === "object") {
    const p = { ...out.params };
    const enWord = resolveStableEnglishWordId(out);
    const meaning = displayMeaningForLocale(
      enWord || String(p.wordEn || ""),
      p.listKey,
      instructionLocale
    );
    if (!p.localizedMeaning && meaning) {
      p.localizedMeaning = meaning;
    } else if (typeof p.localizedMeaning === "string" && containsHebrew(p.localizedMeaning)) {
      p.localizedMeaning = meaning || translateEnglishPhrase(p.localizedMeaning);
    }
    if (
      typeof p.translation === "string" &&
      containsHebrew(p.translation) &&
      enWord
    ) {
      p.translation = displayMeaningForLocale(enWord, p.listKey, instructionLocale);
    }
    if (typeof p.word === "string" && containsHebrew(p.word) && enWord) {
      p.word = enWord;
    }
    out.params = p;
  }

  return out;
}
