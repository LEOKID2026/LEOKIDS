/**
 * English-only writing pool for Global worksheets.
 * Cues and prompts are English — no Hebrew helper text.
 * @module lib/worksheets/worksheet-english-writing-pool.server
 */

import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { ENGLISH_GRADES } from "../../data/english-curriculum.js";
import {
  englishVocabListKeysForGrade,
  englishWritingModeAllowed,
} from "../../utils/grade-gating.js";

const HEBREW_RE = /[\u0590-\u05FF]/;

const ENGLISH_WORKSHEET_GRADE_PROFILES = {
  g1: { writingPools: ["word"] },
  g2: { writingPools: ["word", "sentence_basic"] },
  g3: { writingPools: ["word", "sentence_basic"] },
  g4: { writingPools: ["word", "sentence_basic", "sentence_extended"] },
  g5: { writingPools: ["sentence_extended", "word"] },
  g6: { writingPools: ["sentence_extended", "sentence_master"] },
};

const WRITING_SENTENCES_BASIC = [
  { en: "Good morning", cue: "a greeting used in the morning" },
  { en: "Good night", cue: "a greeting used at night" },
  { en: "I love my dog", cue: "say that you love your dog" },
  { en: "I am happy", cue: "say that you are happy" },
  { en: "I like school", cue: "say that you like school" },
  { en: "This is my book", cue: "say that this is your book" },
  { en: "I can help you", cue: "say that you can help someone" },
  { en: "We play outside", cue: "say that you play outside" },
  { en: "She is my friend", cue: "say that she is your friend" },
  { en: "The cat is small", cue: "say that the cat is small" },
  { en: "I see a bird", cue: "say that you see a bird" },
  { en: "Please sit down", cue: "ask someone to sit down politely" },
  { en: "I like cats", cue: "say that you like cats" },
  { en: "We go to school", cue: "say that we go to school" },
  { en: "I have a book", cue: "say that you have a book" },
  { en: "The sun is yellow", cue: "say that the sun is yellow" },
  { en: "I eat an apple", cue: "say that you eat an apple" },
  { en: "He plays football", cue: "say that he plays football" },
  { en: "They are my family", cue: "say that they are your family" },
  { en: "I drink water", cue: "say that you drink water" },
  { en: "She has a red bag", cue: "say that she has a red bag" },
  { en: "We like ice cream", cue: "say that we like ice cream" },
  { en: "He is tall", cue: "say that he is tall" },
  { en: "My mom is kind", cue: "say that your mom is kind" },
  { en: "I sit on a chair", cue: "say that you sit on a chair" },
  { en: "We run in the park", cue: "say that we run in the park" },
  { en: "I write with a pen", cue: "say that you write with a pen" },
];

const WRITING_SENTENCES_ADVANCED = [
  { en: "I will visit my grandparents tomorrow", cue: "say you will visit your grandparents tomorrow" },
  { en: "We are going to start a science project", cue: "say you are going to start a science project" },
  { en: "If it rains, we will stay at home", cue: "say if it rains you will stay at home" },
  { en: "I have already finished my homework", cue: "say you have already finished your homework" },
  { en: "She has lived in this city for five years", cue: "say she has lived in this city for five years" },
  { en: "They were reading quietly in the library", cue: "say they were reading quietly in the library" },
  { en: "Can you explain the answer again?", cue: "ask someone to explain the answer again" },
  { en: "We should save water every day", cue: "say we should save water every day" },
  { en: "My brother wants to become a doctor", cue: "say your brother wants to become a doctor" },
  { en: "The movie was more exciting than I expected", cue: "say the movie was more exciting than expected" },
  { en: "I forgot to bring my lunch today", cue: "say you forgot to bring your lunch today" },
  { en: "Please turn off the lights before you leave", cue: "ask someone to turn off the lights before leaving" },
  { en: "We practiced the song until it sounded clear", cue: "say you practiced the song until it sounded clear" },
  { en: "He found a better way to solve the puzzle", cue: "say he found a better way to solve the puzzle" },
  { en: "Our team won because everyone worked hard", cue: "say your team won because everyone worked hard" },
  { en: "I enjoy learning new words in English", cue: "say you enjoy learning new words in English" },
  { en: "She reads books because she loves stories", cue: "say she reads books because she loves stories" },
  { en: "We learned about animals in science class", cue: "say we learned about animals in science class" },
  { en: "He practices football every afternoon", cue: "say he practices football every afternoon" },
  { en: "The teacher explained the new lesson clearly", cue: "say the teacher explained the new lesson clearly" },
  { en: "I enjoy hiking in the mountains with my family", cue: "say you enjoy hiking in the mountains with your family" },
  { en: "They worked together to solve the problem", cue: "say they worked together to solve the problem" },
  { en: "Although it was cold, we went outside to play", cue: "say although it was cold, we went outside to play" },
  { en: "I would like to become a doctor in the future", cue: "say you would like to become a doctor in the future" },
  { en: "She has been studying English for three years", cue: "say she has been studying English for three years" },
  { en: "My favorite subject is science because it is interesting", cue: "say your favorite subject is science because it is interesting" },
  { en: "We should recycle paper and plastic to help the environment", cue: "say we should recycle paper and plastic to help the environment" },
  { en: "He remembered to bring his books to school today", cue: "say he remembered to bring his books to school today" },
  { en: "The students listened carefully during the presentation", cue: "say the students listened carefully during the presentation" },
  { en: "I feel proud when I help my classmates", cue: "say you feel proud when you help your classmates" },
  { en: "We decided to plant trees in our school garden", cue: "say you decided to plant trees in your school garden" },
  { en: "She finished her project and presented it in class", cue: "say she finished her project and presented it in class" },
  { en: "If you study hard, you will pass the exam easily", cue: "say if you study hard, you will pass the exam easily" },
  { en: "My brother and I cooked dinner together last weekend", cue: "say you and your brother cooked dinner together last weekend" },
  { en: "Climate change is one of the greatest challenges of our time", cue: "say climate change is one of the greatest challenges of our time" },
  { en: "We need to work together to build a better future", cue: "say we need to work together to build a better future" },
  { en: "Volunteering in the community teaches important life skills", cue: "say volunteering in the community teaches important life skills" },
  { en: "Science helps us understand the world around us", cue: "say science helps us understand the world around us" },
  { en: "The library is a place where imagination comes to life", cue: "say the library is a place where imagination comes to life" },
  { en: "Solving problems creatively leads to better results", cue: "say solving problems creatively leads to better results" },
  { en: "A strong community is built on trust and cooperation", cue: "say a strong community is built on trust and cooperation" },
  { en: "The choices we make today will shape the world tomorrow", cue: "say the choices we make today will shape the world tomorrow" },
  { en: "Learning from our mistakes helps us grow and improve", cue: "say learning from our mistakes helps us grow and improve" },
  { en: "Sharing ideas with others can lead to new discoveries", cue: "say sharing ideas with others can lead to new discoveries" },
  { en: "People who never give up usually reach their goals", cue: "say people who never give up usually reach their goals" },
  { en: "Understanding history helps us make better decisions today", cue: "say understanding history helps us make better decisions today" },
  { en: "Asking questions is the beginning of all learning", cue: "say asking questions is the beginning of all learning" },
  { en: "Taking care of our planet starts with small daily actions", cue: "say taking care of our planet starts with small daily actions" },
];

const WRITING_SENTENCES_MASTER = [
  { en: "We should protect the forest to keep animals safe", cue: "say we should protect the forest to keep animals safe" },
  { en: "By working together, we can solve difficult problems", cue: "say that by working together we can solve difficult problems" },
  { en: "I have never forgotten the trip to the science park", cue: "say you have never forgotten the trip to the science park" },
  { en: "If we recycle plastic, the beach stays beautiful", cue: "say if we recycle plastic the beach stays beautiful" },
  { en: "Although the task was hard, she did not give up", cue: "say that although the task was hard she did not give up" },
  { en: "Scientists study climate change to protect our planet", cue: "say scientists study climate change to protect our planet" },
  { en: "Before we publish the report, we must check every fact", cue: "say before publishing the report you must check every fact" },
  { en: "Technology can help students learn in creative ways", cue: "say technology can help students learn in creative ways" },
  { en: "I would rather ask a clear question than guess the answer", cue: "say you would rather ask a clear question than guess" },
  { en: "Communities grow stronger when people support each other", cue: "say communities grow stronger when people support each other" },
  { en: "After reviewing the evidence, we changed our plan", cue: "say after reviewing the evidence you changed your plan" },
  { en: "Learning from mistakes is an important part of progress", cue: "say learning from mistakes is an important part of progress" },
  { en: "If everyone shares ideas, the project becomes richer", cue: "say if everyone shares ideas the project becomes richer" },
  { en: "She explained the solution with patience and clarity", cue: "say she explained the solution with patience and clarity" },
  { en: "We must balance online time with outdoor activities", cue: "say we must balance online time with outdoor activities" },
  { en: "Honest feedback helps writers improve their drafts", cue: "say honest feedback helps writers improve their drafts" },
  { en: "Exploring different cultures teaches respect and curiosity", cue: "say exploring different cultures teaches respect and curiosity" },
  { en: "A careful plan makes complex goals easier to reach", cue: "say a careful plan makes complex goals easier to reach" },
  { en: "I believe teamwork is more powerful than working alone", cue: "say you believe teamwork is more powerful than working alone" },
  { en: "When we listen carefully, we understand people better", cue: "say when we listen carefully we understand people better" },
  { en: "Despite the difficulties, she continued to work hard", cue: "say despite the difficulties, she continued to work hard" },
  { en: "Reading regularly improves both vocabulary and thinking skills", cue: "say reading regularly improves both vocabulary and thinking skills" },
  { en: "Technology has changed the way we communicate with each other", cue: "say technology has changed the way we communicate with each other" },
  { en: "In my opinion, students should have more time for creative activities", cue: "say in my opinion, students should have more time for creative activities" },
  { en: "The scientist discovered that plants grow faster in sunlight", cue: "say the scientist discovered that plants grow faster in sunlight" },
  { en: "Although many people disagree, I believe that practice is the key to success", cue: "say although many people disagree, I believe that practice is the key to success" },
  { en: "We must take responsibility for protecting the environment for future generations", cue: "say we must take responsibility for protecting the environment for future generations" },
  { en: "Having a strong work ethic helps people achieve their goals", cue: "say having a strong work ethic helps people achieve their goals" },
  { en: "She argued convincingly that access to education is a basic right", cue: "say she argued convincingly that access to education is a basic right" },
  { en: "The experiment showed that there is a connection between sleep and learning", cue: "say the experiment showed that there is a connection between sleep and learning" },
  { en: "Without clean water, neither humans nor animals can survive", cue: "say without clean water, neither humans nor animals can survive" },
  { en: "It is important to consider different perspectives before making a decision", cue: "say it is important to consider different perspectives before making a decision" },
  { en: "Through consistent effort and determination, anyone can improve", cue: "say through consistent effort and determination, anyone can improve" },
  { en: "The research findings suggest that exercise has a positive effect on mental health", cue: "say the research findings suggest that exercise has a positive effect on mental health" },
  { en: "Students who read every day become better writers", cue: "say students who read every day become better writers" },
  { en: "The ability to communicate clearly is essential in every field", cue: "say the ability to communicate clearly is essential in every field" },
  { en: "Every person has the right to a good education", cue: "say every person has the right to a good education" },
  { en: "Critical thinking is a skill that helps us in everyday life", cue: "say critical thinking is a skill that helps us in everyday life" },
  { en: "Music and art make our lives richer and more meaningful", cue: "say music and art make our lives richer and more meaningful" },
  { en: "Protecting nature is our responsibility as human beings", cue: "say protecting nature is our responsibility as human beings" },
  { en: "Physical activity and rest are both important for good health", cue: "say physical activity and rest are both important for good health" },
  { en: "Being a good friend means listening and showing kindness", cue: "say being a good friend means listening and showing kindness" },
  { en: "The ocean covers more than half of our planet", cue: "say the ocean covers more than half of our planet" },
  { en: "Saving energy at home is a simple way to help the planet", cue: "say saving energy at home is a simple way to help the planet" },
];

/**
 * @param {string} gradeKey
 * @returns {string[]}
 */
function gradeWritingPoolKeys(gradeKey) {
  const profile = ENGLISH_WORKSHEET_GRADE_PROFILES[gradeKey] || ENGLISH_WORKSHEET_GRADE_PROFILES.g3;
  const pools = profile.writingPools || ["word", "sentence_basic"];
  return pools.filter((m) => englishWritingModeAllowed(m, gradeKey));
}

/**
 * @param {string} gradeKey
 * @returns {Array<{ en: string, cue: string, patternFamily: string, subtype: string }>}
 */
export function listEnglishWritingSentencePoolForGrade(gradeKey) {
  const modes = new Set(gradeWritingPoolKeys(gradeKey));
  /** @type {Array<{ en: string, cue: string, patternFamily: string, subtype: string }>} */
  const out = [];
  const push = (rows, patternFamily, subtype) => {
    for (const row of rows) {
      if (HEBREW_RE.test(row.en) || HEBREW_RE.test(row.cue)) continue;
      out.push({ ...row, patternFamily, subtype });
    }
  };
  if (modes.has("sentence_basic")) {
    push(WRITING_SENTENCES_BASIC, "writing_sentence_basic", "sentence_basic");
  }
  if (modes.has("sentence_extended")) {
    push(WRITING_SENTENCES_ADVANCED, "writing_sentence_extended", "sentence_extended");
  }
  if (modes.has("sentence_master")) {
    push(WRITING_SENTENCES_MASTER, "writing_sentence_master", "sentence_master");
  }
  return out;
}

/**
 * Word items use English-only copy cues (no Hebrew glosses from vocab lists).
 * @param {string} gradeKey
 * @returns {Array<{ en: string, cue: string, patternFamily: string, subtype: string, listKey: string }>}
 */
export function listEnglishWritingWordPoolForGrade(gradeKey) {
  if (!gradeWritingPoolKeys(gradeKey).includes("word")) return [];
  const gradeWordLists = ENGLISH_GRADES[gradeKey]?.wordLists || [];
  const curriculumLists = englishVocabListKeysForGrade(gradeKey, WORD_LISTS);
  const listKeys = (gradeWordLists.length ? gradeWordLists : curriculumLists).filter(
    (key) => WORD_LISTS[key]
  );
  /** @type {Array<{ en: string, cue: string, patternFamily: string, subtype: string, listKey: string }>} */
  const out = [];
  for (const key of listKeys) {
    const listObj = WORD_LISTS[key] || {};
    const pairs = Array.isArray(listObj)
      ? listObj
      : Object.entries(listObj).map(([en, gloss]) => [en, gloss]);
    for (const pair of pairs) {
      if (!Array.isArray(pair) || !pair[0]) continue;
      const en = String(pair[0]).trim();
      if (!en || HEBREW_RE.test(en)) continue;
      // English-only cue: never surface Hebrew glosses on Global worksheets.
      const cue = `the English word "${en}"`;
      out.push({
        en,
        cue,
        patternFamily: "writing_word",
        subtype: "word",
        listKey: key,
      });
      if (out.length >= 40) return out;
    }
  }
  return out;
}

/**
 * @param {string} gradeKey
 */
export function listEnglishWorksheetWritingPool(gradeKey) {
  const sentences = listEnglishWritingSentencePoolForGrade(gradeKey);
  const words = listEnglishWritingWordPoolForGrade(gradeKey);
  const seen = new Set(sentences.map((s) => `${s.cue}|${s.en}`));
  for (const w of words) {
    const fp = `${w.cue}|${w.en}`;
    if (seen.has(fp)) continue;
    seen.add(fp);
    sentences.push(w);
  }
  return sentences;
}

/**
 * @param {Object} row
 * @param {string} gradeKey
 * @param {string} levelKey
 * @returns {Record<string, unknown>}
 */
export function englishWritingItemFromPoolRow(row, gradeKey, levelKey) {
  const isWord = row.subtype === "word";
  const cue = String(row.cue || "").trim();
  const en = String(row.en || "").trim();
  const question = isWord
    ? `Write the English word: "${en}"`
    : `Complete the sentence.`;
  return {
    question,
    correctAnswer: row.en,
    answerMode: "typing",
    subject: "english",
    topic: "writing",
    operation: "writing",
    gradeLevel: gradeKey,
    writingSpaceLines: 6,
    params: {
      answerMode: "typing",
      gradeKey,
      levelKey,
      direction: "cue_to_en",
      patternFamily: row.patternFamily,
      subtype: row.subtype,
      topic: "writing",
      ...(isWord
        ? { type: "word", wordCue: cue, wordEn: en }
        : { type: "sentence", sentenceCue: cue, sentenceEn: en }),
    },
  };
}
