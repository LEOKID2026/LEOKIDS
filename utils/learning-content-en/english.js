import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";
import { WORD_LISTS } from "../../data/english-questions/index.js";

const EXPLANATION_EN = {
  "עם I משתמשים ב-am.": "With I we use am.",
  "עם he/she/it משתמשים ב-is.": "With he/she/it we use is.",
  "עם you/we/they משתמשים ב-are.": "With you/we/they we use are.",
};

const PHONICS_LABELS = {
  "בחר/י את האות הגדולה שמתאימה לאות הקטנה שמוצגת:":
    "Choose the uppercase letter that matches the lowercase letter shown:",
  "בחר/י את האות הקטנה שמתאימה לאות הגדולה שמוצגת:":
    "Choose the lowercase letter that matches the uppercase letter shown:",
  "קרא/י את המילה - בחר/י את המילה הנכונה:":
    "Read the word — choose the correct word:",
  "בחר/י את האות שבאה אחרי האות שמוצגת:":
    "Choose the letter that comes after the letter shown:",
  "אין כרגע תרגיל פוניקה מתאים לכיתה הזו. נסו עמוד אחר או חזרו לתפריט.":
    "No phonics exercise is available for this grade. Try another page or return to the menu.",
  "אין כרגע משפטי תרגום מתאימים לכיתה. נסו נושא אחר או רמה אחרת.":
    "No translation sentences are available for this grade. Try another topic or level.",
};

const POOL_FALLBACK_EN = {
  הבנתי: "Got it",
  "אנסה שוב": "Try again",
  "אחזור לתפריט": "Back to menu",
  "בחרו נושא אחר": "Choose another topic",
};

function englishWordsFromList(listKey, excludeEn) {
  const list = WORD_LISTS[listKey] || WORD_LISTS.colors || {};
  return Object.keys(list).filter((w) => w !== excludeEn);
}

function translateEnglishPhrase(text) {
  const raw = String(text ?? "").trim();
  if (!raw || !containsHebrew(raw)) return raw;
  if (PHONICS_LABELS[raw]) return PHONICS_LABELS[raw];
  if (POOL_FALLBACK_EN[raw]) return POOL_FALLBACK_EN[raw];
  if (EXPLANATION_EN[raw]) return EXPLANATION_EN[raw];

  return raw
    .replace(/^מה פירוש המילה "/u, 'What does "')
    .replace(/"\u200F\?$/u, '" mean?')
    .replace(/^כתוב את המילה "/u, 'Write the English word for "')
    .replace(/"\u200F באנגלית$/u, '"')
    .replace(/^כתוב באנגלית: "/u, 'Write in English: "')
    .replace(/^תרגם: "/u, 'Translate: "')
    .replace(/"\u200F?$/u, '"')
    .replace(/[\u0590-\u05FF]+/gu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function rebuildEnglishStem(question) {
  const p = question?.params || {};
  const topic = String(p.topic || question?.topic || "");

  if (topic === "vocabulary" || p.patternFamily?.startsWith("vocab_")) {
    const en =
      p.word && !containsHebrew(String(p.word))
        ? p.word
        : p.translation && !containsHebrew(String(p.translation))
          ? p.translation
          : null;
    if (p.direction === "he_to_en" && en) {
      return `Write the English word: "${en}"`;
    }
    if (p.direction === "en_to_he" && en) {
      return `What does "${en}" mean? Choose the best English match.`;
    }
    if (en) return `Which word is "${en}"?`;
  }

  if (topic === "translation" || p.patternFamily?.startsWith("translation_")) {
    if (p.direction === "en_to_he" && p.sentence && !containsHebrew(String(p.sentence))) {
      return `Write in English: "${p.sentence}"`;
    }
    if (p.direction === "he_to_en" && p.sentence && !containsHebrew(String(p.sentence))) {
      return `Choose the correct English sentence: "${p.sentence}"`;
    }
    if (p.sentence && !containsHebrew(String(p.sentence))) {
      return `Choose the correct option for: "${p.sentence}"`;
    }
    if (p.translation && !containsHebrew(String(p.translation))) {
      return `Write in English: "${p.translation}"`;
    }
  }

  if (topic === "writing") {
    if (p.type === "word" && p.wordEn) {
      return `Write the English word: ${p.wordEn}`;
    }
    if (p.type === "sentence" && p.sentenceEn) {
      return `Write this sentence in English.`;
    }
    if (p.wordEn) return `Write the English word: ${p.wordEn}`;
  }

  if (topic === "grammar" && question?.question && !containsHebrew(String(question.question))) {
    return String(question.question);
  }

  if (topic === "phonics" && question?.questionLabel) {
    return translateEnglishPhrase(question.questionLabel);
  }

  return null;
}

function localizeEnglishField(question, field, value) {
  const text = String(value ?? "");
  if (!containsHebrew(text)) return text;

  const p = question?.params || {};
  const listKey = p.listKey || "colors";

  if (field === "questionLabel" || field === "question" || field === "exerciseText") {
    const rebuilt = rebuildEnglishStem(question);
    if (rebuilt && !containsHebrew(rebuilt)) return rebuilt;
    const translated = translateEnglishPhrase(text);
    if (!containsHebrew(translated)) return translated;
  }

  if (p.direction === "en_to_he") {
    if (field === "correctAnswer" && p.sentence && !containsHebrew(String(p.sentence))) {
      return p.sentence;
    }
    if (field !== "question") {
      const list = WORD_LISTS[p.listKey] || {};
      const matchKey = Object.entries(list).find(([, he]) => he === text)?.[0];
      if (matchKey) return matchKey;
      if (text === p.translation && p.sentence) return p.sentence;
    }
  }

  if (p.direction === "he_to_en") {
    if (field === "correctAnswer" && p.translation && !containsHebrew(String(p.translation))) {
      return p.translation;
    }
  }

  if (POOL_FALLBACK_EN[text.trim()]) return POOL_FALLBACK_EN[text.trim()];

  if (p.direction === "en_to_he" && field !== "question") {
    const enWords = englishWordsFromList(listKey, p.word);
    const idx = Object.values(WORD_LISTS[listKey] || {}).indexOf(text);
    if (idx >= 0) {
      const keys = Object.keys(WORD_LISTS[listKey] || {});
      return keys[idx] || text;
    }
    if (text === p.translation && p.word) return p.word;
    return enWords[Math.abs(text.length) % enWords.length] || translateEnglishPhrase(text);
  }

  return translateEnglishPhrase(text);
}

export function localizeEnglishQuestionEn(question) {
  if (!question) return question;
  const rebuilt = rebuildEnglishStem(question);
  const out = mapQuestionTextFields({ ...question }, (field, value, q) =>
    localizeEnglishField(q, field, value)
  );
  if (rebuilt && !containsHebrew(rebuilt)) {
    out.question = rebuilt;
    if (!out.exerciseText || containsHebrew(String(out.exerciseText))) {
      out.exerciseText = rebuilt;
    }
  }
  if (typeof out.questionLabel === "string" && containsHebrew(out.questionLabel)) {
    out.questionLabel = translateEnglishPhrase(out.questionLabel);
  }
  if (typeof out.correctAnswer === "string" && containsHebrew(out.correctAnswer)) {
    out.correctAnswer = localizeEnglishField(out, "correctAnswer", out.correctAnswer);
  }
  if (Array.isArray(out.answers)) {
    out.answers = out.answers.map((a) =>
      typeof a === "string" ? localizeEnglishField(out, "answers", a) : a
    );
  }
  if (typeof out.explanation === "string" && containsHebrew(out.explanation)) {
    out.explanation = translateEnglishPhrase(out.explanation);
  }
  return out;
}
