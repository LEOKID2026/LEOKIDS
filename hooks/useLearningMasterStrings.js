import { useCallback, useMemo } from "react";
import { useI18n, useT } from "../lib/i18n/I18nProvider.jsx";
import {
  formatLearningWrongFeedback,
  livePracticeCorrect,
  livePracticeGameOver,
  livePracticeWrong,
  livePracticeTimeUp,
  livePracticeTimeUpGameOver,
  livePracticeExcellent,
} from "../utils/learning-live-feedback.js";
import { parseLegacyBadgeCanonicalId } from "../utils/learning-badge-ids.js";

const MODE_KEYS = ["learning", "challenge", "speed", "marathon", "practice"];
const LEVEL_KEYS = ["easy", "medium", "hard"];
const GRADE_KEYS = ["g1", "g2", "g3", "g4", "g5", "g6"];
const DISPLAY_LEVEL_KEYS = ["regular", "advanced"];

/**
 * Shared UI strings for learning subject masters (math, geometry, english, science).
 * @param {string} [subjectId] — math | geometry | english | science
 */
export function useLearningMasterStrings(subjectId = "math") {
  const { direction, locale } = useI18n();
  const t = useT();

  const common = useMemo(
    () => ({
      direction,
      locale,
      back: t("learning.master.back"),
      curriculum: t("learning.master.curriculum"),
      player: t("learning.master.player"),
      defaultPlayerName: t("learning.master.defaultPlayerName"),
      topic: t("learning.master.topic"),
      close: t("learning.master.close"),
      loading: t("learning.master.loading"),
      coins: t("learning.master.coins"),
      coinsTitle: t("learning.master.coinsTitle"),
      submit: t("learning.master.submit"),
      answer: t("learning.master.answer"),
      answerPlaceholder: t("learning.master.answerPlaceholder"),
      enterAnswer: t("learning.master.enterAnswer"),
      check: t("learning.master.check"),
      start: t("learning.master.start"),
      stop: t("learning.master.stop"),
      play: t("learning.master.play"),
      explain: t("learning.master.explain"),
      explainBook: t("learning.master.explainBook"),
      explainFull: t("learning.master.explainFull"),
      remember: t("learning.master.remember"),
      rememberTitle: t("learning.master.rememberTitle"),
      whyMistake: t("learning.master.whyMistake"),
      previousExercise: t("learning.master.previousExercise"),
      howToSolve: t("learning.master.howToSolve"),
      leaderboard: t("learning.master.leaderboard"),
      helpBoard: t("learning.master.helpBoard"),
      howToLearn: t("learning.master.howToLearn"),
      focusedPractice: t("learning.master.focusedPractice"),
      enterNameToStart: t("learning.master.enterNameToStart"),
      opening: t("learning.master.opening"),
      challenges: t("learning.master.challenges"),
      accuracy: t("learning.master.accuracy"),
      bestScore: t("learning.master.bestScore"),
      bestStreak: t("learning.master.bestStreak"),
      noQuestion: t("learning.master.noQuestion"),
      playerProfile: t("learning.master.playerProfile"),
      chooseAvatar: t("learning.master.chooseAvatar"),
      pickImage: t("learning.master.pickImage"),
      deleteImage: t("learning.master.deleteImage"),
      imageSelected: t("learning.master.imageSelected"),
      playerName: t("learning.master.playerName"),
      peakScore: t("learning.master.peakScore"),
      peakStreak: t("learning.master.peakStreak"),
      stars: t("learning.master.stars"),
      level: t("learning.master.level"),
      xpPoints: t("learning.master.xpPoints"),
      dailyStreak: t("learning.master.dailyStreak"),
      days: t("learning.master.days"),
      monthlyProgress: t("learning.master.monthlyProgress"),
      minutesShort: t("learning.master.minutesShort"),
      overallAccuracy: t("learning.master.overallAccuracy"),
      correctOfTotal: t("learning.master.correctOfTotal"),
      topicProgress: t("learning.master.topicProgress"),
      badges: t("learning.master.badges"),
      noBadgesYet: t("learning.master.noBadgesYet"),
      newBadge: t("learning.master.newBadge"),
      levelUp: t("learning.master.levelUp"),
      levelUpNow: t("learning.master.levelUpNow"),
      avatar: t("learning.master.avatar"),
      avatarAlt: t("learning.master.avatarAlt"),
      childNameAria: t("learning.master.childNameAria"),
      childNameUnavailable: t("learning.master.childNameUnavailable"),
      imageTooLarge: t("learning.master.imageTooLarge"),
      imageTypeOnly: t("learning.master.imageTypeOnly"),
      imageSaveFailed: t("learning.master.imageSaveFailed"),
      gradeRequired: t("learning.master.gradeRequired"),
      enterValidNumber: t("learning.master.enterValidNumber"),
      enterPlayerNameForMistake: t("learning.master.enterPlayerNameForMistake"),
      selectAtLeastOneOp: t("learning.master.selectAtLeastOneOp"),
      noMistakesToPractice: t("learning.master.noMistakesToPractice"),
      noResultsYet: t("learning.master.noResultsYet"),
      rank: t("learning.master.rank"),
      score: t("learning.master.score"),
      streak: t("learning.master.streak"),
      localHighScores: t("learning.master.localHighScores"),
      practiceSettings: t("learning.master.practiceSettings"),
      practiceSettingsBlurb: t("learning.master.practiceSettingsBlurb"),
      practiceModeLabel: t("learning.master.practiceModeLabel"),
      currentMode: t("learning.master.currentMode"),
      focus: t("learning.master.focus"),
      focusedPracticeMode: t("learning.master.focusedPracticeMode"),
      resetDefaults: t("learning.master.resetDefaults"),
      mistakeReview: t("learning.master.mistakeReview"),
      mistakeReviewEmpty: t("learning.master.mistakeReviewEmpty"),
      correctAnswer: t("learning.master.correctAnswer"),
      yourAnswer: t("learning.master.yourAnswer"),
      practiceThisQuestion: t("learning.master.practiceThisQuestion"),
      clearMistakes: t("learning.master.clearMistakes"),
      referenceBoard: t("learning.master.referenceBoard"),
      referenceBoardBlurb: t("learning.master.referenceBoardBlurb"),
      noTermsYet: t("learning.master.noTermsYet"),
      verticalDisplay: t("learning.master.verticalDisplay"),
      horizontalDisplay: t("learning.master.horizontalDisplay"),
      topics: t("learning.master.topics"),
      mixedPractice: t("learning.master.mixedPractice"),
      editMixOperations: t("learning.master.editMixOperations"),
      subjects: t("learning.master.subjects"),
      notEnoughQuestions: t("learning.master.notEnoughQuestions"),
      step: t("learning.master.step"),
      explanation: t("learning.master.explanation"),
      noStepDetail: t("learning.master.noStepDetail"),
      multiplicationTableHint: t("learning.master.multiplicationTableHint"),
      divisionTableHint: t("learning.master.divisionTableHint"),
      leaderboardLoadError: t("learning.master.leaderboardLoadError"),
      subjectLocked: t(`learning.subjects.${subjectId}`),
    }),
    [t, direction, locale, subjectId]
  );

  const getModeName = useCallback(
    (mode) => {
      const key = MODE_KEYS.includes(mode) ? mode : "practice";
      return t(`learning.master.modes.${key}.name`);
    },
    [t]
  );

  const getModeDescription = useCallback(
    (mode) => {
      const key = MODE_KEYS.includes(mode) ? mode : "practice";
      return t(`learning.master.modes.${key}.description`);
    },
    [t]
  );

  const getLevelName = useCallback(
    (level) => {
      const key = LEVEL_KEYS.includes(level) ? level : "easy";
      return t(`learning.master.levels.${key}`);
    },
    [t]
  );

  const getGradeName = useCallback(
    (gradeKey) => {
      if (!gradeKey) return "";
      const key = GRADE_KEYS.includes(gradeKey) ? gradeKey : gradeKey;
      const label = t(`learning.master.grades.${key}`);
      return label !== `learning.master.grades.${key}` ? label : gradeKey;
    },
    [t]
  );

  const getDisplayLevelLabel = useCallback(
    (displayLevel) => {
      const key = DISPLAY_LEVEL_KEYS.includes(displayLevel) ? displayLevel : "regular";
      return t(`learning.master.displayLevels.${key}`);
    },
    [t]
  );

  const getSubjectTitle = useCallback(
    () => t(`learning.master.titles.${subjectId}`),
    [t, subjectId]
  );

  const getTopicName = useCallback(
    (topicKey) => {
      if (!topicKey) return common.topic;
      const key = `learning.${subjectId}.topics.${topicKey}`;
      const label = t(key);
      return label !== key ? label : common.topic;
    },
    [t, subjectId, common.topic]
  );

  const getMathOperationName = useCallback(
    (op) => {
      if (!op) return common.topic;
      const key = `learning.math.operations.${op}`;
      const label = t(key);
      return label !== key ? label : common.topic;
    },
    [t, common.topic]
  );

  const getPracticeFocusLabel = useCallback(
    (value) => {
      const key = `learning.${subjectId}.practiceFocus.${value}`;
      const label = t(key);
      return label !== key ? label : value;
    },
    [t, subjectId]
  );

  const getReferenceCategoryLabel = useCallback(
    (value) => {
      const key = `learning.${subjectId}.reference.${value}.label`;
      let label = t(key);
      if (label !== key) return label;
      const masterKey = `learning.master.referenceCategories.${value}`;
      label = t(masterKey);
      return label !== masterKey ? label : value;
    },
    [t, subjectId]
  );

  const getBadgeLabel = useCallback(
    (badgeId) => {
      if (!badgeId) return "";
      const canonical = parseLegacyBadgeCanonicalId(badgeId) || badgeId;
      if (canonical.startsWith("op_king:")) {
        const op = canonical.slice("op_king:".length);
        return t("learning.master.badges.op_king", { op: getMathOperationName(op) });
      }
      if (canonical.startsWith("op_genius:")) {
        const op = canonical.slice("op_genius:".length);
        return t("learning.master.badges.op_genius", { op: getMathOperationName(op) });
      }
      if (canonical.startsWith("topic_expert:")) {
        const topic = canonical.slice("topic_expert:".length);
        return t("learning.master.badges.topic_expert", { topic: getTopicName(topic) });
      }
      if (canonical.startsWith("topic_genius:")) {
        const topic = canonical.slice("topic_genius:".length);
        return t("learning.master.badges.topic_genius", { topic: getTopicName(topic) });
      }
      if (canonical.startsWith("topic_expert_legacy:")) {
        const topic = canonical.slice("topic_expert_legacy:".length);
        return t("learning.master.badges.topic_expert_legacy", { topic });
      }
      if (canonical.startsWith("topic_genius_legacy:")) {
        const topic = canonical.slice("topic_genius_legacy:".length);
        return t("learning.master.badges.topic_genius_legacy", { topic });
      }
      const key = `learning.master.badges.${canonical}`;
      const label = t(key);
      return label !== key ? label : badgeId;
    },
    [t, getMathOperationName, getTopicName]
  );

  const getScienceHint = useCallback(
    (topic, hasCorrect) => {
      if (topic) {
        const key = `learning.science.hints.${topic}`;
        const label = t(key);
        if (label !== key) return label;
      }
      return hasCorrect
        ? t("learning.science.hints.genericRetry")
        : t("learning.science.hints.genericCheck");
    },
    [t]
  );

  const getScienceSolutionSteps = useCallback(
    (question) => {
      if (!question) return [];
      const lines = [t("learning.science.steps.understand")];
      if (question.theoryLines?.length) {
        question.theoryLines.forEach((line, i) => {
          lines.push(`${i + 2}. ${line}`);
        });
      }
      const correctText = question.options?.[question.correctIndex] ?? "";
      if (correctText) {
        const quoted = `\u2066${correctText}\u2069`;
        lines.push(
          t("learning.science.steps.onlyMatch", {
            num: lines.length + 1,
            answer: quoted,
          })
        );
      }
      if (question.explanation) {
        lines.push(
          t("learning.science.steps.summary", {
            num: lines.length + 1,
            explanation: question.explanation,
          })
        );
      }
      return lines;
    },
    [t]
  );

  const getEnglishSolutionSteps = useCallback(
    (question, topic) => {
      if (!question?.params) return [];
      const { correctAnswer } = question;
      const p = question.params;

      switch (topic) {
        case "vocabulary":
          if (p.direction === "en_to_he") {
            return [
              t("learning.english.steps.wordIsEnglish", { word: p.word }),
              t("learning.english.steps.findHebrewMeaning"),
              t("learning.english.steps.correctMeaning", { answer: correctAnswer }),
              t("learning.english.steps.checkMeaning"),
            ];
          }
          return [
            t("learning.english.steps.wordIsHebrew", { word: p.word }),
            t("learning.english.steps.findEnglishMeaning"),
            t("learning.english.steps.correctMeaning", { answer: correctAnswer }),
            t("learning.english.steps.checkMeaning"),
          ];
        case "grammar":
          return [
            t("learning.english.steps.grammarRules"),
            t("learning.english.steps.grammarAmIsAre"),
            t("learning.english.steps.correctMeaning", { answer: correctAnswer }),
            p.explanation || t("learning.english.steps.checkMeaning"),
          ];
        case "translation":
          if (p.direction === "en_to_he") {
            return [
              t("learning.english.steps.readEnglishSentence", { sentence: p.sentence }),
              t("learning.english.steps.translatePiece"),
              t("learning.english.steps.buildHebrewSentence"),
              t("learning.english.steps.correctTranslation", { answer: correctAnswer }),
            ];
          }
          return [
            t("learning.english.steps.readHebrewSentence", { sentence: p.sentence }),
            t("learning.english.steps.translatePiece"),
            t("learning.english.steps.buildEnglishSentence"),
            t("learning.english.steps.correctTranslation", { answer: correctAnswer }),
          ];
        case "sentences":
          return [
            t("learning.english.steps.readTemplate", { template: p.template }),
            t("learning.english.steps.whatIsMissing"),
            t("learning.english.steps.grammarCheck"),
            `${t("learning.english.steps.correctMeaning", { answer: correctAnswer })}${p.explanation ? ` ${p.explanation}` : ""}`,
          ];
        case "writing":
          if (p.type === "word") {
            return [
              t("learning.english.steps.spellingReadHebrew", { word: p.wordHe }),
              t("learning.english.steps.spellingRecallEnglish"),
              t("learning.english.steps.spellingLetterByLetter"),
              t("learning.english.steps.correctMeaning", { answer: correctAnswer }),
            ];
          }
          if (p.type === "sentence") {
            return [
              t("learning.english.steps.writeSentenceHebrew", { sentence: p.sentenceHe }),
              t("learning.english.steps.breakIntoParts"),
              t("learning.english.steps.checkWordOrder"),
              t("learning.english.steps.correctSentence", { answer: correctAnswer }),
            ];
          }
          return [];
        default:
          return [];
      }
    },
    [t]
  );

  const getEnglishErrorExplanation = useCallback(
    (question, topic, wrongAnswer, opts = {}) => {
      if (!question) return "";
      const userAns = String(wrongAnswer).toLowerCase();
      const correctAns = String(question.correctAnswer).toLowerCase();
      const learning = opts.mode === "learning";
      const ca = question.correctAnswer;

      switch (topic) {
        case "vocabulary":
          return learning
            ? t("learning.english.mistakes.checkMeaningLearning", { answer: ca })
            : t("learning.english.mistakes.checkMeaningContext");
        case "grammar":
          if (userAns === "is" && correctAns === "am") {
            return t("learning.english.mistakes.iAmNotIs");
          }
          if (userAns === "am" && (correctAns === "is" || correctAns === "are")) {
            return t("learning.english.mistakes.amOnlyWithI");
          }
          return learning
            ? t("learning.english.mistakes.checkGrammarLearning", { answer: ca })
            : t("learning.english.mistakes.checkGrammar");
        case "translation":
          return learning
            ? t("learning.english.mistakes.checkTranslationLearning", { answer: ca })
            : t("learning.english.mistakes.checkTranslation");
        case "sentences":
          return learning
            ? t("learning.english.mistakes.checkWordFitLearning", { answer: ca })
            : t("learning.english.mistakes.checkWordFit");
        case "writing":
          return learning
            ? t("learning.english.mistakes.checkSpellingLearning", { answer: ca })
            : t("learning.english.mistakes.checkSpelling");
        default:
          return "";
      }
    },
    [t]
  );

  const feedback = useMemo(
    () => ({
      correct: () => livePracticeCorrect(t),
      wrong: () => livePracticeWrong(t),
      gameOver: () => livePracticeGameOver(t),
      wrongWithAnswer: (answer) => formatLearningWrongFeedback(t, answer),
      timeUp: () => livePracticeTimeUp(t),
      timeUpGameOver: () => livePracticeTimeUpGameOver(t),
      excellent: () => livePracticeExcellent(t),
    }),
    [t]
  );

  const modes = useMemo(
    () =>
      Object.fromEntries(
        MODE_KEYS.map((m) => [
          m,
          { name: getModeName(m), description: getModeDescription(m) },
        ])
      ),
    [getModeName, getModeDescription]
  );

  return {
    ...common,
    t,
    getModeName,
    getModeDescription,
    getLevelName,
    getGradeName,
    getDisplayLevelLabel,
    getSubjectTitle,
    getTopicName,
    getMathOperationName,
    getPracticeFocusLabel,
    getReferenceCategoryLabel,
    getBadgeLabel,
    getScienceHint,
    getScienceSolutionSteps,
    getEnglishSolutionSteps,
    getEnglishErrorExplanation,
    feedback,
    modes,
  };
}
