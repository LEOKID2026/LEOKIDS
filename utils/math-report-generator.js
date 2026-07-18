// Parent report generation system

import { reportPackCopy } from "../lib/reports/report-pack-copy.js";
import { STORAGE_KEY } from './math-constants.js';
import { getTimeByPeriod, getTimeByCustomPeriod, getAllTimeTracking } from './math-time-tracking.js';
import { getGeometryTimeByPeriod, getGeometryTimeByCustomPeriod } from './math-time-tracking.js';
import { getEnglishTimeByCustomPeriod } from './english-time-tracking.js';
import { getScienceTimeByCustomPeriod } from './science-time-tracking.js';

// Operation display names (math)
const OPERATION_NAMES = {
  addition: reportPackCopy("utils__math-report-generator", "addition"),
  subtraction: reportPackCopy("utils__math-report-generator", "subtraction"),
  multiplication: reportPackCopy("utils__math-report-generator", "multiplication"),
  division: reportPackCopy("utils__math-report-generator", "division"),
  division_with_remainder: reportPackCopy("utils__math-report-generator", "division_with_remainder"),
  fractions: reportPackCopy("utils__math-report-generator", "fractions"),
  percentages: reportPackCopy("utils__math-report-generator", "percentages"),
  sequences: reportPackCopy("utils__math-report-generator", "sequences"),
  decimals: reportPackCopy("utils__math-report-generator", "decimals"),
  rounding: reportPackCopy("utils__math-report-generator", "rounding"),
  divisibility: reportPackCopy("utils__math-report-generator", "divisibility_rules"),
  prime_composite: reportPackCopy("utils__math-report-generator", "prime_and_composite_numbers"),
  powers: reportPackCopy("utils__math-report-generator", "powers"),
  ratio: "Ratio",
  equations: reportPackCopy("utils__math-report-generator", "equations"),
  order_of_operations: reportPackCopy("utils__math-report-generator", "order_of_operations"),
  zero_one_properties: reportPackCopy("utils__math-report-generator", "properties_of_0_and_1"),
  estimation: reportPackCopy("utils__math-report-generator", "estimation"),
  scale: "Scale",
  compare: reportPackCopy("utils__math-report-generator", "comparison"),
  number_sense: reportPackCopy("utils__math-report-generator", "number_sense"),
  factors_multiples: reportPackCopy("utils__math-report-generator", "factors_and_multiples"),
  word_problems: reportPackCopy("utils__math-report-generator", "word_problems"),
  multiplication_table: reportPackCopy("utils__math-report-generator", "multiplication_table"),
  place_value: reportPackCopy("utils__math-report-generator", "place_value"),
  comparison: reportPackCopy("utils__math-report-generator", "comparison"),
  patterns: reportPackCopy("utils__math-report-generator", "patterns_and_sequences"),
  multiplication_advanced: reportPackCopy("utils__math-report-generator", "advanced_multiplication"),
  mixed: "Mixed"
};

// Topic display names (geometry)
const TOPIC_NAMES = {
  shapes_basic: reportPackCopy("utils__math-report-generator", "basic_shapes"),
  shapes: reportPackCopy("utils__math-report-generator", "shapes"),
  area: "Area",
  perimeter: reportPackCopy("utils__math-report-generator", "perimeter"),
  volume: reportPackCopy("utils__math-report-generator", "volume"),
  angles: reportPackCopy("utils__math-report-generator", "angles"),
  parallel_perpendicular: reportPackCopy("utils__math-report-generator", "parallel_and_perpendicular"),
  triangles: reportPackCopy("utils__math-report-generator", "triangles"),
  quadrilaterals: reportPackCopy("utils__math-report-generator", "quadrilaterals"),
  transformations: reportPackCopy("utils__math-report-generator", "transformations"),
  rotation: reportPackCopy("utils__math-report-generator", "rotation"),
  symmetry: reportPackCopy("utils__math-report-generator", "symmetry"),
  diagonal: reportPackCopy("utils__math-report-generator", "diagonal"),
  heights: reportPackCopy("utils__math-report-generator", "heights"),
  tiling: reportPackCopy("utils__math-report-generator", "tiling"),
  circles: reportPackCopy("utils__math-report-generator", "circle"),
  solids: reportPackCopy("utils__math-report-generator", "solids"),
  pythagoras: reportPackCopy("utils__math-report-generator", "pythagoras"),
  coordinates: reportPackCopy("utils__math-report-generator", "points_and_coordinates"),
  mixed: "Mixed"
};

/**
 * Strip grade/kind suffixes from stored topic bucket keys (e.g. area::grade:g4, area\u0001g4).
 * @param {string|null|undefined} bucketKey
 */
export function normalizeReportTopicBucketKey(bucketKey) {
  let t = String(bucketKey ?? "").trim();
  if (!t) return "";
  const sep = t.indexOf("\u0001");
  if (sep !== -1) t = t.slice(0, sep);
  const gradeIdx = t.indexOf("::grade:");
  if (gradeIdx !== -1) t = t.slice(0, gradeIdx);
  const kindIdx = t.indexOf("::");
  if (kindIdx !== -1) t = t.slice(0, kindIdx);
  return t.trim();
}

/** Fallback when no Hebrew topic label can be resolved for parent-facing math rows. */
export const MATH_PARENT_TOPIC_FALLBACK_HE = reportPackCopy("utils__math-report-generator", "practice");

const MATH_TOPIC_PLACEHOLDER_KEYS = new Set(["general", "unknown"]);

/** @param {string|null|undefined} label */
export function isGenericParentTopicLabelHe(label) {
  const t = String(label || "").trim();
  return !t || t === "Topic" || t === "this subject" || t === "general" || t === "unknown";
}

/**
 * @param {string|null|undefined} baseKey
 * @returns {string}
 */
function resolveMathOperationLabelHe(baseKey) {
  const base = String(baseKey || "").trim();
  if (!base) return "";
  if (MATH_TOPIC_PLACEHOLDER_KEYS.has(base.toLowerCase())) return "";
  if (OPERATION_NAMES[base]) return OPERATION_NAMES[base];
  if (base.startsWith("wp_")) return OPERATION_NAMES.word_problems;
  return "";
}

export function getOperationName(op) {
  const label = resolveMathOperationLabelHe(mathReportBaseOperationKey(String(op || "")));
  return label || MATH_PARENT_TOPIC_FALLBACK_HE;
}

/** Mistakes/progress key: the part before :: in a composite report key (addition::kind → addition) */
export function mathReportBaseOperationKey(bucketKey) {
  if (bucketKey == null || typeof bucketKey !== "string") return bucketKey;
  const i = bucketKey.indexOf("::");
  return i === -1 ? bucketKey : bucketKey.slice(0, i);
}

/**
 * Parent report display for math: only the base operation name, without the embedded kind.
 * The storage key may remain operation::kind — here we only display the base of the operation.
 */
export function getMathReportBucketDisplayName(bucketKey) {
  if (bucketKey == null || bucketKey === "") return "";
  const raw = String(bucketKey).trim();
  const base = mathReportBaseOperationKey(raw);
  const fromBase = resolveMathOperationLabelHe(base);
  if (fromBase) return fromBase;
  if (base !== raw) {
    const fromRaw = resolveMathOperationLabelHe(raw);
    if (fromRaw) return fromRaw;
  }
  return MATH_PARENT_TOPIC_FALLBACK_HE;
}

export function getTopicName(topic) {
  const key = normalizeReportTopicBucketKey(topic);
  if (!key || MATH_TOPIC_PLACEHOLDER_KEYS.has(key.toLowerCase())) return "";
  return TOPIC_NAMES[key] || "";
}

const ENGLISH_TOPIC_NAMES = {
  phonics: reportPackCopy("utils__math-report-generator", "phonics"),
  vocabulary: reportPackCopy("utils__math-report-generator", "vocabulary"),
  grammar: reportPackCopy("utils__math-report-generator", "grammar"),
  grammar_basics: reportPackCopy("utils__math-report-generator", "grammar_basics"),
  translation: reportPackCopy("utils__math-report-generator", "translation"),
  sentence: reportPackCopy("utils__math-report-generator", "sentence_building"),
  sentences: reportPackCopy("utils__math-report-generator", "sentence_building"),
  writing: reportPackCopy("utils__math-report-generator", "writing"),
  reading_comprehension: reportPackCopy("utils__math-report-generator", "reading_comprehension"),
  matching: reportPackCopy("utils__math-report-generator", "matching"),
  inference: reportPackCopy("utils__math-report-generator", "inference"),
  sentence_understanding: reportPackCopy("utils__math-report-generator", "sentence_understanding"),
  simple_sentences: reportPackCopy("utils__math-report-generator", "simple_sentences"),
  mixed: reportPackCopy("utils__math-report-generator", "mixed_practice"),
};

export function getEnglishTopicName(topic) {
  const key = normalizeReportTopicBucketKey(topic);
  if (!key) return "";
  return ENGLISH_TOPIC_NAMES[key] || "";
}

const SCIENCE_TOPIC_NAMES = {
  body: reportPackCopy("utils__math-report-generator", "human_body"),
  animals: reportPackCopy("utils__math-report-generator", "animals"),
  plants: reportPackCopy("utils__math-report-generator", "plants"),
  materials: reportPackCopy("utils__math-report-generator", "materials"),
  earth_space: reportPackCopy("utils__math-report-generator", "earth_and_space"),
  environment: reportPackCopy("utils__math-report-generator", "environment_and_ecology"),
  experiments: reportPackCopy("utils__math-report-generator", "experiments_and_processes"),
  animals_plants: reportPackCopy("utils__math-report-generator", "animals_and_plants"),
  basic_experiments: reportPackCopy("utils__math-report-generator", "basic_experiments"),
  living_things: reportPackCopy("utils__math-report-generator", "living_things"),
  matter: reportPackCopy("utils__math-report-generator", "materials"),
  forces: reportPackCopy("utils__math-report-generator", "forces"),
  mixed: reportPackCopy("utils__math-report-generator", "mixed_topics"),
};

export function getScienceTopicName(topic) {
  const key = normalizeReportTopicBucketKey(topic);
  if (!key) return "";
  return SCIENCE_TOPIC_NAMES[key] || "";
}

export function getHistoryTopicName(_topic) {
  return "";
}

export function getHistorySubtopicName(_subtopicKey) {
  return "";
}

const HEBREW_TOPIC_NAMES = {
  reading: reportPackCopy("utils__math-report-generator", "reading"),
  comprehension: reportPackCopy("utils__math-report-generator", "reading_comprehension"),
  reading_comprehension: reportPackCopy("utils__math-report-generator", "reading_comprehension"),
  writing: reportPackCopy("utils__math-report-generator", "writing_and_expression"),
  grammar: reportPackCopy("utils__math-report-generator", "grammar_and_language"),
  vocabulary: reportPackCopy("utils__math-report-generator", "language_richness"),
  speaking: reportPackCopy("utils__math-report-generator", "speaking_and_discussion"),
  mixed: "Mixed",
  main_idea: reportPackCopy("utils__math-report-generator", "main_idea"),
  sequence: reportPackCopy("utils__math-report-generator", "sequence"),
  inference: reportPackCopy("utils__math-report-generator", "inference"),
  fact_vs_opinion: reportPackCopy("utils__math-report-generator", "fact_vs_opinion"),
  vowels_reading: reportPackCopy("utils__math-report-generator", "reading_with_vowels"),
  plurals: reportPackCopy("utils__math-report-generator", "singular_and_plural"),
  verb_forms: reportPackCopy("utils__math-report-generator", "verb_forms"),
  sentence_structure: reportPackCopy("utils__math-report-generator", "sentence_structure"),
};

export function getHebrewTopicName(topic) {
  const key = normalizeReportTopicBucketKey(topic);
  if (!key) return "";
  return HEBREW_TOPIC_NAMES[key] || "";
}

const MOLEDET_GEOGRAPHY_TOPIC_NAMES = {
  homeland: reportPackCopy("utils__math-report-generator", "homeland_studies"),
  community: reportPackCopy("utils__math-report-generator", "community"),
  citizenship: reportPackCopy("utils__math-report-generator", "citizenship"),
  geography: reportPackCopy("utils__math-report-generator", "geography"),
  basic_geography: reportPackCopy("utils__math-report-generator", "geography_basics"),
  values: reportPackCopy("utils__math-report-generator", "values"),
  maps: "Maps",
  map_reading: reportPackCopy("utils__math-report-generator", "map_reading"),
  directions: reportPackCopy("utils__math-report-generator", "directions"),
  places: reportPackCopy("utils__math-report-generator", "places"),
  maps_basic: reportPackCopy("utils__math-report-generator", "basic_maps"),
  regions: reportPackCopy("utils__math-report-generator", "regions"),
  history: reportPackCopy("utils__math-report-generator", "history"),
  mixed: "Mixed",
};

export function getMoledetGeographyTopicName(topic) {
  const key = normalizeReportTopicBucketKey(topic);
  if (!key) return "";
  return MOLEDET_GEOGRAPHY_TOPIC_NAMES[key] || "";
}

/** Grade label by internal key g1…g6 (parent report / recommendations) */
const GRADE_LABELS = { g1: "1st", g2: "2nd", g3: "3rd", g4: "4th", g5: "5th", g6: "6th" };

const HEBREW_GRADE_DISPLAY_AS_IS = new Set([
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
]);

const HEBREW_GRADE_TO_CANON = {
  "1st": "g1",
  "2nd": "g2",
  "3rd": "g3",
  "4th": "g4",
  "5th": "g5",
  "6th": "g6",
};

/**
 * Normalizes an internal grade key (g1, gg3, "3", etc.) to g1…g6.
 * @returns {string|null}
 */
export function canonicalParentReportGradeKey(raw) {
  if (raw == null || raw === "") return null;
  const s0 = String(raw).trim();
  if (HEBREW_GRADE_DISPLAY_AS_IS.has(s0)) return HEBREW_GRADE_TO_CANON[s0] || null;
  const s = s0.toLowerCase();
  const m = s.match(/^g{1,2}([1-6])$/);
  if (m) return `g${m[1]}`;
  const d = s.match(/^([1-6])$/);
  if (d) return `g${d[1]}`;
  return null;
}

/**
 * Grade label for parent report display across all subjects — display text only, not g1/gg5.
 * If the value is already a recognized display label, it is returned as-is.
 */
export function formatParentReportGradeLabel(raw) {
  if (raw == null || raw === "") return reportPackCopy("utils__math-report-generator", "unavailable");
  const s0 = String(raw).trim();
  if (HEBREW_GRADE_DISPLAY_AS_IS.has(s0)) return s0;
  const c = canonicalParentReportGradeKey(s0);
  if (c && GRADE_LABELS[c]) return GRADE_LABELS[c];
  return reportPackCopy("utils__math-report-generator", "unavailable");
}

const LEVEL_LABELS = { easy: "Easy", medium: "Medium", hard: "Hard" };

function getMostCommonGradeAndLevel(savedTracking, containerKey, itemKey) {
  let gradeKey = null;
  let levelKey = null;
  let rawGradeDominant = null;

  try {
    const itemData = savedTracking?.[containerKey]?.[itemKey];
    if (itemData?.sessions && itemData.sessions.length > 0) {
      const gradeCounts = {};
      const levelCounts = {};

      itemData.sessions.forEach((session) => {
        if (session.grade) gradeCounts[session.grade] = (gradeCounts[session.grade] || 0) + 1;
        if (session.level) levelCounts[session.level] = (levelCounts[session.level] || 0) + 1;
      });

      if (Object.keys(gradeCounts).length > 0) {
        const entries = Object.entries(gradeCounts).sort((a, b) => b[1] - a[1]);
        rawGradeDominant = entries[0][0];
        gradeKey = canonicalParentReportGradeKey(rawGradeDominant);
      }

      if (Object.keys(levelCounts).length > 0) {
        const entries = Object.entries(levelCounts).sort((a, b) => b[1] - a[1]);
        levelKey = entries[0][0];
      }
    }
  } catch (e) {
    // ignore
  }

  return {
    gradeKey,
    levelKey,
    gradeLabel:
      rawGradeDominant != null
        ? formatParentReportGradeLabel(rawGradeDominant)
        : reportPackCopy("utils__math-report-generator", "unavailable"),
    levelLabel: levelKey ? (LEVEL_LABELS[levelKey] || levelKey) : reportPackCopy("utils__math-report-generator", "unavailable"),
  };
}

// Generate a parent report
export function generateParentReport(playerName, period = 'week', customStartDate = null, customEndDate = null) {
  if (typeof window === "undefined") return null;
  
  try {
    // ========== Math ==========
    // Collect math progress data
    const mathProgress = JSON.parse(localStorage.getItem(STORAGE_KEY + "_progress") || "{}");
    const mathProgressData = mathProgress.progress || {};
    
    // ========== Geometry ==========
    // Collect geometry progress data
    const geometryProgress = JSON.parse(localStorage.getItem("mleo_geometry_master" + "_progress") || "{}");
    const geometryProgressData = geometryProgress.progress || {};
    
    const englishProgress = JSON.parse(localStorage.getItem("mleo_english_master" + "_progress") || "{}");
    const englishProgressData = englishProgress.progress || {};
    
    const scienceProgress = JSON.parse(localStorage.getItem("mleo_science_master" + "_progress") || "{}");
    const scienceProgressData = scienceProgress.progress || {};
    
    // Calculate the period
    const now = new Date();
    let startDate, endDate;
    
    if (period === 'custom' && customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
      // Make sure endDate isn't after today
      if (endDate > now) {
        endDate = now;
      }
    } else {
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      endDate = now;
    }
    
    // Collect time data for the custom period (math)
    const mathTimeData = getTimeByCustomPeriod(startDate, endDate);
    
    // Collect time data for the custom period (geometry)
    const geometryTimeData = getGeometryTimeByCustomPeriod(startDate, endDate);
    const englishTimeData = getEnglishTimeByCustomPeriod(startDate, endDate);
    const scienceTimeData = getScienceTimeByCustomPeriod(startDate, endDate);
    
    // Collect mistakes (math)
    const mathMistakes = JSON.parse(localStorage.getItem("mleo_mistakes") || "[]");
    
    // Collect mistakes (geometry) - if any
    const geometryMistakes = JSON.parse(localStorage.getItem("mleo_geometry_mistakes") || "[]");
    
    // Collect mistakes (english)
    const englishMistakes = JSON.parse(localStorage.getItem("mleo_english_mistakes") || "[]");
    const scienceMistakes = JSON.parse(localStorage.getItem("mleo_science_mistakes") || "[]");
    
    // Collect challenges (math)
    const dailyChallenge = JSON.parse(localStorage.getItem("mleo_daily_challenge") || "{}");
    const weeklyChallenge = JSON.parse(localStorage.getItem("mleo_weekly_challenge") || "{}");
    
    // ========== Math summary ==========
    // Use time data to filter only operations with time logged in the period
    const mathOperationsSummary = {};
    let mathTotalQuestions = 0;
    let mathTotalCorrect = 0;
    
    // Filter only operations with time logged in the period
    const mathOperationsWithTime = Object.keys(mathTimeData.operations || {});
    
    // If there's no time data, use all the data (for a general report)
    const operationsToProcess = mathOperationsWithTime.length > 0 
      ? mathOperationsWithTime 
      : Object.keys(mathProgressData);
    
    operationsToProcess.forEach((op) => {
      const progressData = mathProgressData[op] || { total: 0, correct: 0 };
      const questions = progressData.total || 0;
      const correct = progressData.correct || 0;
      const accuracy = questions > 0 ? Math.round((correct / questions) * 100) : 0;
      const timeMinutes = mathTimeData.operations?.[op]?.minutes || 0;
      
      const mathTrackingSaved = (() => {
        try {
          return JSON.parse(localStorage.getItem("mleo_time_tracking") || "{}");
        } catch {
          return {};
        }
      })();
      const { gradeKey: mostCommonGradeKey, levelKey: mostCommonLevelKey, gradeLabel: mostCommonGrade, levelLabel: mostCommonLevel } =
        getMostCommonGradeAndLevel(mathTrackingSaved, "operations", op);
      
      // If there's time in the period, include the data
      if (timeMinutes > 0 || questions > 0) {
        mathTotalQuestions += questions;
        mathTotalCorrect += correct;
        
        mathOperationsSummary[op] = {
          subject: "math",
          questions,
          correct,
          wrong: questions - correct,
          accuracy,
          timeMinutes,
          timeHours: (timeMinutes / 60).toFixed(2),
          needsPractice: accuracy < 70,
          excellent: accuracy >= 90,
          improvement: calculateImprovement(op, mathProgressData, period),
          grade: mostCommonGrade,
          gradeKey: mostCommonGradeKey,
          level: mostCommonLevel,
          levelKey: mostCommonLevelKey
        };
      }
    });
    
    const mathOverallAccuracy = mathTotalQuestions > 0 
      ? Math.round((mathTotalCorrect / mathTotalQuestions) * 100) 
      : 0;
    
    // ========== Geometry summary ==========
    // Use time data to filter only topics with time logged in the period
    const geometryTopicsSummary = {};
    let geometryTotalQuestions = 0;
    let geometryTotalCorrect = 0;
    
    // Filter only topics with time logged in the period
    const geometryTopicsWithTime = Object.keys(geometryTimeData.topics || {});
    
    // If there's no time data, use all the data (for a general report)
    const topicsToProcess = geometryTopicsWithTime.length > 0 
      ? geometryTopicsWithTime 
      : Object.keys(geometryProgressData);
    
    topicsToProcess.forEach((topic) => {
      const progressData = geometryProgressData[topic] || { total: 0, correct: 0 };
      const questions = progressData.total || 0;
      const correct = progressData.correct || 0;
      const accuracy = questions > 0 ? Math.round((correct / questions) * 100) : 0;
      const timeMinutes = geometryTimeData.topics?.[topic]?.minutes || 0;
      
      const geoTrackingSaved = (() => {
        try {
          return JSON.parse(localStorage.getItem("mleo_geometry_time_tracking") || "{}");
        } catch {
          return {};
        }
      })();
      const { gradeKey: mostCommonGradeKey, levelKey: mostCommonLevelKey, gradeLabel: mostCommonGrade, levelLabel: mostCommonLevel } =
        getMostCommonGradeAndLevel(geoTrackingSaved, "topics", topic);
      
      // If there's time in the period, include the data
      if (timeMinutes > 0 || questions > 0) {
        geometryTotalQuestions += questions;
        geometryTotalCorrect += correct;
        
        geometryTopicsSummary[topic] = {
          subject: "geometry",
          questions,
          correct,
          wrong: questions - correct,
          accuracy,
          timeMinutes,
          timeHours: (timeMinutes / 60).toFixed(2),
          needsPractice: accuracy < 70,
          excellent: accuracy >= 90,
          grade: mostCommonGrade,
          gradeKey: mostCommonGradeKey,
          level: mostCommonLevel,
          levelKey: mostCommonLevelKey
        };
      }
    });
    
    const geometryOverallAccuracy = geometryTotalQuestions > 0 
      ? Math.round((geometryTotalCorrect / geometryTotalQuestions) * 100) 
      : 0;
    
    // ========== English summary ==========
    const englishTopicsSummary = {};
    let englishTotalQuestions = 0;
    let englishTotalCorrect = 0;
    
    const englishTopicsWithTime = Object.keys(englishTimeData.topics || {});
    const englishTopicsToProcess = englishTopicsWithTime.length > 0
      ? englishTopicsWithTime
      : Object.keys(englishProgressData);
    
    englishTopicsToProcess.forEach((topic) => {
      const progressData = englishProgressData[topic] || { total: 0, correct: 0 };
      const questions = progressData.total || 0;
      const correct = progressData.correct || 0;
      const accuracy = questions > 0 ? Math.round((correct / questions) * 100) : 0;
      const timeMinutes = englishTimeData.topics?.[topic]?.minutes || 0;
      
      const engTrackingSaved = (() => {
        try {
          return JSON.parse(localStorage.getItem("mleo_english_time_tracking") || "{}");
        } catch {
          return {};
        }
      })();
      const { gradeKey: mostCommonGradeKey, levelKey: mostCommonLevelKey, gradeLabel: mostCommonGrade, levelLabel: mostCommonLevel } =
        getMostCommonGradeAndLevel(engTrackingSaved, "topics", topic);
      
      if (timeMinutes > 0 || questions > 0) {
        englishTotalQuestions += questions;
        englishTotalCorrect += correct;
        
        englishTopicsSummary[topic] = {
          subject: "english",
          questions,
          correct,
          wrong: questions - correct,
          accuracy,
          timeMinutes,
          timeHours: (timeMinutes / 60).toFixed(2),
          needsPractice: accuracy < 70 && questions > 0,
          excellent: accuracy >= 90 && questions >= 10,
          grade: mostCommonGrade,
          gradeKey: mostCommonGradeKey,
          level: mostCommonLevel,
          levelKey: mostCommonLevelKey,
          displayName: getEnglishTopicName(topic)
        };
      }
    });
    
    const englishOverallAccuracy = englishTotalQuestions > 0
      ? Math.round((englishTotalCorrect / englishTotalQuestions) * 100)
      : 0;
    
    // ========== Science summary ==========
    const scienceTopicsSummary = {};
    let scienceTotalQuestions = 0;
    let scienceTotalCorrect = 0;
    
    const scienceTopicsWithTime = Object.keys(scienceTimeData.topics || {});
    const scienceTopicsToProcess = scienceTopicsWithTime.length > 0
      ? scienceTopicsWithTime
      : Object.keys(scienceProgressData);
    
    scienceTopicsToProcess.forEach((topic) => {
      const progressData = scienceProgressData[topic] || { total: 0, correct: 0 };
      const questions = progressData.total || 0;
      const correct = progressData.correct || 0;
      const accuracy = questions > 0 ? Math.round((correct / questions) * 100) : 0;
      const timeMinutes = scienceTimeData.topics?.[topic]?.minutes || 0;
      
      const sciTrackingSaved = (() => {
        try {
          return JSON.parse(localStorage.getItem("mleo_science_time_tracking") || "{}");
        } catch {
          return {};
        }
      })();
      const { gradeKey: mostCommonGradeKey, levelKey: mostCommonLevelKey, gradeLabel: mostCommonGrade, levelLabel: mostCommonLevel } =
        getMostCommonGradeAndLevel(sciTrackingSaved, "topics", topic);
      
      if (timeMinutes > 0 || questions > 0) {
        scienceTotalQuestions += questions;
        scienceTotalCorrect += correct;
        
        scienceTopicsSummary[topic] = {
          subject: "science",
          questions,
          correct,
          wrong: questions - correct,
          accuracy,
          timeMinutes,
          timeHours: (timeMinutes / 60).toFixed(2),
          needsPractice: accuracy < 70 && questions > 0,
          excellent: accuracy >= 90 && questions >= 10,
          grade: mostCommonGrade,
          gradeKey: mostCommonGradeKey,
          level: mostCommonLevel,
          levelKey: mostCommonLevelKey,
          displayName: getScienceTopicName(topic)
        };
      }
    });
    
    const scienceOverallAccuracy = scienceTotalQuestions > 0
      ? Math.round((scienceTotalCorrect / scienceTotalQuestions) * 100)
      : 0;
    
    // ========== General summary ==========
    const totalQuestions = mathTotalQuestions + geometryTotalQuestions + englishTotalQuestions + scienceTotalQuestions;
    const totalCorrect = mathTotalCorrect + geometryTotalCorrect + englishTotalCorrect + scienceTotalCorrect;
    const overallAccuracy = totalQuestions > 0 
      ? Math.round((totalCorrect / totalQuestions) * 100) 
      : 0;
    
    // ========== Filter mistakes by period ==========
    const filteredMathMistakes = mathMistakes.filter(mistake => {
      if (!mistake.timestamp) return false;
      const mistakeDate = new Date(mistake.timestamp);
      return mistakeDate >= startDate && mistakeDate <= endDate;
    });
    
    const filteredGeometryMistakes = geometryMistakes.filter(mistake => {
      if (!mistake.timestamp) return false;
      const mistakeDate = new Date(mistake.timestamp);
      return mistakeDate >= startDate && mistakeDate <= endDate;
    });
    
    const filteredEnglishMistakes = englishMistakes.filter(mistake => {
      if (!mistake.timestamp) return false;
      const mistakeDate = new Date(mistake.timestamp);
      return mistakeDate >= startDate && mistakeDate <= endDate;
    });
    
    const filteredScienceMistakes = scienceMistakes.filter(mistake => {
      if (!mistake.timestamp) return false;
      const mistakeDate = new Date(mistake.timestamp);
      return mistakeDate >= startDate && mistakeDate <= endDate;
    });
    
    // Analyze mistakes (math)
    const mathMistakesByOperation = {};
    filteredMathMistakes.forEach(mistake => {
      const op = mistake.operation;
      if (!mathMistakesByOperation[op]) {
        mathMistakesByOperation[op] = {
          count: 0,
          lastSeen: null,
          commonErrors: {}
        };
      }
      mathMistakesByOperation[op].count++;
      if (!mathMistakesByOperation[op].lastSeen || 
          new Date(mistake.timestamp) > new Date(mathMistakesByOperation[op].lastSeen)) {
        mathMistakesByOperation[op].lastSeen = mistake.timestamp;
      }
    });
    
    // Analyze mistakes (geometry)
    const geometryMistakesByTopic = {};
    filteredGeometryMistakes.forEach(mistake => {
      const topic = mistake.topic;
      if (!geometryMistakesByTopic[topic]) {
        geometryMistakesByTopic[topic] = {
          count: 0,
          lastSeen: null,
          commonErrors: {}
        };
      }
      geometryMistakesByTopic[topic].count++;
      if (!geometryMistakesByTopic[topic].lastSeen || 
          new Date(mistake.timestamp) > new Date(geometryMistakesByTopic[topic].lastSeen)) {
        geometryMistakesByTopic[topic].lastSeen = mistake.timestamp;
      }
    });
    
    // Analyze mistakes (english)
    const englishMistakesByTopic = {};
    filteredEnglishMistakes.forEach(mistake => {
      const topic = mistake.topic;
      if (!englishMistakesByTopic[topic]) {
        englishMistakesByTopic[topic] = {
          count: 0,
          lastSeen: null,
          commonErrors: {}
        };
      }
      englishMistakesByTopic[topic].count++;
      if (
        !englishMistakesByTopic[topic].lastSeen ||
        new Date(mistake.timestamp) > new Date(englishMistakesByTopic[topic].lastSeen)
      ) {
        englishMistakesByTopic[topic].lastSeen = mistake.timestamp;
      }
    });
    
    const scienceMistakesByTopic = {};
    filteredScienceMistakes.forEach(mistake => {
      const topic = mistake.topic;
      if (!scienceMistakesByTopic[topic]) {
        scienceMistakesByTopic[topic] = {
          count: 0,
          lastSeen: null,
          commonErrors: {}
        };
      }
      scienceMistakesByTopic[topic].count++;
      if (
        !scienceMistakesByTopic[topic].lastSeen ||
        new Date(mistake.timestamp) > new Date(scienceMistakesByTopic[topic].lastSeen)
      ) {
        scienceMistakesByTopic[topic].lastSeen = mistake.timestamp;
      }
    });
    
    // ========== Recommendations ==========
    const mathRecommendations = generateRecommendations(mathOperationsSummary, mathMistakesByOperation);
    const geometryRecommendations = generateRecommendations(geometryTopicsSummary, geometryMistakesByTopic);
    const englishRecommendations = generateRecommendations(englishTopicsSummary, englishMistakesByTopic);
    const scienceRecommendations = generateRecommendations(scienceTopicsSummary, scienceMistakesByTopic);
    const recommendations = [
      ...mathRecommendations,
      ...geometryRecommendations,
      ...englishRecommendations,
      ...scienceRecommendations,
    ];
    
    // ========== Achievements ==========
    const mathAchievements = mathProgress.badges || [];
    const geometryAchievements = geometryProgress.badges || [];
    const englishAchievements = englishProgress.badges || [];
    const scienceAchievements = scienceProgress.badges || [];
    const achievements = [
      ...mathAchievements,
      ...geometryAchievements,
      ...englishAchievements,
      ...scienceAchievements,
    ];
    const stars =
      (mathProgress.stars || 0) +
      (geometryProgress.stars || 0) +
      (englishProgress.stars || 0) +
      (scienceProgress.stars || 0);
    const playerLevel = Math.max(
      mathProgress.playerLevel || 1,
      geometryProgress.playerLevel || 1,
      englishProgress.playerLevel || 1,
      scienceProgress.playerLevel || 1
    );
    const xp =
      (mathProgress.xp || 0) +
      (geometryProgress.xp || 0) +
      (englishProgress.xp || 0) +
      (scienceProgress.xp || 0);
    
    // Daily activity - only within the selected period
    const dailyActivity = [];
    const mathDailyData = mathTimeData.daily || {};
    const geometryDailyData = geometryTimeData.daily || {};
    const englishDailyData = englishTimeData.daily || {};
    const scienceDailyData = scienceTimeData.daily || {};
    
    // Merge daily data
    const allDailyDates = new Set([
      ...Object.keys(mathDailyData),
      ...Object.keys(geometryDailyData),
      ...Object.keys(englishDailyData),
      ...Object.keys(scienceDailyData),
    ]);
    
    allDailyDates.forEach(dateStr => {
      const dayDate = new Date(dateStr);
      if (dayDate >= startDate && dayDate <= endDate) {
        const mathDay = mathDailyData[dateStr] || { total: 0, operations: {} };
        const geometryDay = geometryDailyData[dateStr] || { total: 0, topics: {} };
        const englishDay = englishDailyData[dateStr] || { total: 0, topics: {} };
        const scienceDay = scienceDailyData[dateStr] || { total: 0, topics: {} };
        
        const totalTime =
          (mathDay.total || 0) +
          (geometryDay.total || 0) +
          (englishDay.total || 0) +
          (scienceDay.total || 0);
        const mathQuestions = Object.values(mathDay.operations || {}).reduce((sum, time) => {
          return sum + Math.round(time / 30); // estimate: one question every 30 seconds
        }, 0);
        const geometryQuestions = Object.values(geometryDay.topics || {}).reduce((sum, time) => {
          return sum + Math.round(time / 30);
        }, 0);
        const englishQuestions = Object.values(englishDay.topics || {}).reduce((sum, time) => {
          return sum + Math.round(time / 30);
        }, 0);
        const scienceQuestions = Object.values(scienceDay.topics || {}).reduce((sum, time) => {
          return sum + Math.round(time / 30);
        }, 0);
        
        dailyActivity.push({
          date: dateStr,
          timeMinutes: Math.round(totalTime / 60),
          questions: mathQuestions + geometryQuestions + englishQuestions + scienceQuestions,
          mathTopics: Object.keys(mathDay.operations || {}).length,
          geometryTopics: Object.keys(geometryDay.topics || {}).length,
          englishTopics: Object.keys(englishDay.topics || {}).length,
          scienceTopics: Object.keys(scienceDay.topics || {}).length,
        });
      }
    });
    
    // Sort by date
    dailyActivity.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Topics that need practice
    const needsPractice = [
      ...Object.entries(mathOperationsSummary)
        .filter(([_, data]) => data.needsPractice)
        .map(([op, _]) => `Math: ${getOperationName(op)}`),
      ...Object.entries(geometryTopicsSummary)
        .filter(([_, data]) => data.needsPractice)
        .map(([topic, _]) => `Geometry: ${getTopicName(topic)}`),
      ...Object.entries(englishTopicsSummary)
        .filter(([_, data]) => data.needsPractice)
        .map(([topic, _]) => `English: ${getEnglishTopicName(topic)}`),
      ...Object.entries(scienceTopicsSummary)
        .filter(([_, data]) => data.needsPractice)
        .map(([topic, _]) => `Science: ${getScienceTopicName(topic)}`),
    ];
    
    // Excellent topics
    const excellent = [
      ...Object.entries(mathOperationsSummary)
        .filter(([_, data]) => data.excellent && data.questions >= 10)
        .map(([op, _]) => `Math: ${getOperationName(op)}`),
      ...Object.entries(geometryTopicsSummary)
        .filter(([_, data]) => data.excellent && data.questions >= 10)
        .map(([topic, _]) => `Geometry: ${getTopicName(topic)}`),
      ...Object.entries(englishTopicsSummary)
        .filter(([_, data]) => data.excellent && data.questions >= 10)
        .map(([topic, _]) => `English: ${getEnglishTopicName(topic)}`),
      ...Object.entries(scienceTopicsSummary)
        .filter(([_, data]) => data.excellent && data.questions >= 10)
        .map(([topic, _]) => `Science: ${getScienceTopicName(topic)}`),
    ];
    
    return {
      playerName,
      period: period === 'custom' ? 'custom' : period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      generatedAt: now.toISOString(),
      
      // General summary
      summary: {
        totalTimeMinutes:
          (mathTimeData.totalMinutes || 0) +
          (geometryTimeData.totalMinutes || 0) +
          (englishTimeData.totalMinutes || 0) +
          (scienceTimeData.totalMinutes || 0),
        totalTimeHours: (
          ((mathTimeData.totalMinutes || 0) +
            (geometryTimeData.totalMinutes || 0) +
            (englishTimeData.totalMinutes || 0) +
            (scienceTimeData.totalMinutes || 0)) /
          60
        ).toFixed(2),
        totalQuestions,
        totalCorrect,
        overallAccuracy,
        mathQuestions: mathTotalQuestions,
        mathCorrect: mathTotalCorrect,
        mathAccuracy: mathOverallAccuracy,
        geometryQuestions: geometryTotalQuestions,
        geometryCorrect: geometryTotalCorrect,
        geometryAccuracy: geometryOverallAccuracy,
        englishQuestions: englishTotalQuestions,
        englishCorrect: englishTotalCorrect,
        englishAccuracy: englishOverallAccuracy,
        scienceQuestions: scienceTotalQuestions,
        scienceCorrect: scienceTotalCorrect,
        scienceAccuracy: scienceOverallAccuracy,
        stars,
        playerLevel,
        xp,
        achievements: achievements.length
      },
      
      // By operation (math)
      mathOperations: mathOperationsSummary,
      
      // By topic (geometry)
      geometryTopics: geometryTopicsSummary,
      
      // By topic (english)
      englishTopics: englishTopicsSummary,
      
      // By topic (science)
      scienceTopics: scienceTopicsSummary,
      
      // All operations and topics together (for display purposes)
      allItems: {
        ...Object.fromEntries(Object.entries(mathOperationsSummary).map(([k, v]) => [`math_${k}`, v])),
        ...Object.fromEntries(Object.entries(geometryTopicsSummary).map(([k, v]) => [`geometry_${k}`, v])),
        ...Object.fromEntries(Object.entries(englishTopicsSummary).map(([k, v]) => [`english_${k}`, v])),
        ...Object.fromEntries(Object.entries(scienceTopicsSummary).map(([k, v]) => [`science_${k}`, v])),
      },
      
      // Daily activity
      dailyActivity: dailyActivity.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      ),
      
      // Analysis
      analysis: {
        needsPractice,
        excellent,
        mathMistakesByOperation,
        geometryMistakesByTopic,
        englishMistakesByTopic,
        scienceMistakesByTopic,
        recommendations
      },
      
      // Challenges
      challenges: {
        daily: {
          questions: dailyChallenge.questions || 0,
          correct: dailyChallenge.correct || 0,
          bestScore: dailyChallenge.bestScore || 0
        },
        weekly: {
          current: weeklyChallenge.current || 0,
          target: weeklyChallenge.target || 100,
          completed: weeklyChallenge.completed || false
        }
      },
      
      // Achievements
      achievements: achievements.map(badge => ({
        name: badge,
        earned: true
      }))
    };
  } catch (error) {
    console.error("Error generating parent report:", error);
    // Return an empty report instead of null so the user can still choose other periods
    return {
      playerName: playerName || "Player",
      period: period === 'custom' ? 'custom' : period,
      startDate: customStartDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: customEndDate || new Date().toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
      summary: {
        totalTimeMinutes: 0,
        totalTimeHours: "0",
        totalQuestions: 0,
        totalCorrect: 0,
        overallAccuracy: 0,
        mathQuestions: 0,
        mathCorrect: 0,
        mathAccuracy: 0,
        geometryQuestions: 0,
        geometryCorrect: 0,
        geometryAccuracy: 0,
        englishQuestions: 0,
        englishCorrect: 0,
        englishAccuracy: 0,
        scienceQuestions: 0,
        scienceCorrect: 0,
        scienceAccuracy: 0,
        hebrewQuestions: 0,
        hebrewCorrect: 0,
        hebrewAccuracy: 0,
        moledetGeographyQuestions: 0,
        moledetGeographyCorrect: 0,
        moledetGeographyAccuracy: 0,
        stars: 0,
        playerLevel: 1,
        xp: 0,
        achievements: 0
      },
      mathOperations: {},
      geometryTopics: {},
      englishTopics: {},
      scienceTopics: {},
      hebrewTopics: {},
      moledetGeographyTopics: {},
      allItems: {},
      dailyActivity: [],
      analysis: {
        needsPractice: [],
        excellent: [],
        mathMistakesByOperation: {},
        geometryMistakesByTopic: {},
        englishMistakesByTopic: {},
        scienceMistakesByTopic: {},
        hebrewMistakesByTopic: {},
        moledetGeographyMistakesByTopic: {},
        recommendations: []
      },
      challenges: {
        daily: { questions: 0, correct: 0, bestScore: 0 },
        weekly: { current: 0, target: 100, completed: false }
      },
      achievements: []
    };
  }
}

// Calculate improvement
function calculateImprovement(operation, progressData, period) {
  // This could be more elaborate - compare between periods
  // For now, return null or basic data
  return null;
}

function getDisplayNameForEntry(op, data) {
  if (data?.displayName) return data.displayName;
  const keyForLookup =
    data?.bucketKey != null && data.bucketKey !== "" ? data.bucketKey : op;
  if (data.subject === "math") return getMathReportBucketDisplayName(keyForLookup);
  if (data.subject === 'geometry') return getTopicName(keyForLookup);
  if (data.subject === 'english') return getEnglishTopicName(keyForLookup);
  if (data.subject === 'science') return getScienceTopicName(keyForLookup);
  if (data.subject === 'history') {
    if (String(keyForLookup).startsWith("hist_sub_")) return getHistorySubtopicName(keyForLookup);
    return getHistoryTopicName(keyForLookup);
  }
  if (data.subject === 'hebrew') return getHebrewTopicName(keyForLookup);
  if (data.subject === 'moledet-geography')
    return getMoledetGeographyTopicName(keyForLookup);
  return getOperationName(keyForLookup);
}

// Generate recommendations (shared by report V1 and V2)
export function generateRecommendations(operations, mistakes) {
  const recommendations = [];

  // "Hybrid" thresholds (accuracy+questions from overall data, time from the selected period)
  const TH = {
    promoteAccuracy: 92,
    promoteQuestions: 40,
    promoteTimeMinutes: 20,
    superAccuracy: 97,
    superQuestions: 80,
    superTimeMinutes: 30,
    minDataQuestions: 10,
    minDataTimeMinutes: 5,
    // To get a "Blue recommendation" (good), both time and enough questions are required
    goodAccuracy: 85,
    goodQuestions: 15,
    goodTimeMinutes: 10,
  };

  const gradeOrder = ["g1", "g2", "g3", "g4", "g5", "g6"];
  const nextGradeKey = (g) => {
    const idx = gradeOrder.indexOf(g);
    if (idx < 0 || idx >= gradeOrder.length - 1) return null;
    return gradeOrder[idx + 1];
  };
  const nextLevelKey = (l) => {
    if (l === "easy") return "medium";
    if (l === "medium") return "hard";
    return null;
  };

  Object.entries(operations).forEach(([op, data]) => {
    const operationName = getDisplayNameForEntry(op, data);

    const questions = data.questions || 0;
    const accuracy = data.accuracy || 0;
    const timeMinutes = data.timeMinutes || 0;
    const rawBucket =
      data.bucketKey != null && data.bucketKey !== "" ? data.bucketKey : op;
    const mistakeKey =
      data.subject === "math"
        ? mathReportBaseOperationKey(rawBucket)
        : rawBucket;
    const mistakesCount = mistakes?.[mistakeKey]?.count || 0;
    const hasQuestions = questions > 0;

    // Generate a recommendation for every topic/operation practiced (has time or has questions)
    if (questions <= 0 && timeMinutes <= 0) return;

    const baseReasons = hasQuestions
      ? `${accuracy}% accuracy on ${questions} questions, ${timeMinutes} minutes in a period`
      : `No question data (only ${timeMinutes} practice minutes in the period)`;

    // To assign "blue", both a minimum amount of time and a minimum number of questions are required
    const hasEnoughDataForStableRecommendation =
      questions >= TH.minDataQuestions && timeMinutes >= TH.minDataTimeMinutes;

    // Green recommendation to move up (level/grade/both)
    const meetsPromotionBase =
      accuracy >= TH.promoteAccuracy &&
      questions >= TH.promoteQuestions &&
      timeMinutes >= TH.promoteTimeMinutes;

    let promoteLevelToKey = null;
    let promoteGradeToKey = null;

    if (meetsPromotionBase) {
      if (data.levelKey && data.levelKey !== "hard") {
        promoteLevelToKey = nextLevelKey(data.levelKey);
      }

      const meetsSuper =
        accuracy >= TH.superAccuracy &&
        questions >= TH.superQuestions &&
        timeMinutes >= TH.superTimeMinutes;

      if (data.gradeKey && data.gradeKey !== "g6" && (data.levelKey === "hard" || meetsSuper)) {
        promoteGradeToKey = nextGradeKey(data.gradeKey);
      }
    }

    if (promoteLevelToKey || promoteGradeToKey) {
      const parts = [];
      if (promoteLevelToKey) parts.push(`level up to ${LEVEL_LABELS[promoteLevelToKey] || promoteLevelToKey}`);
      if (promoteGradeToKey) parts.push(`move up a grade to ${GRADE_LABELS[promoteGradeToKey] || promoteGradeToKey}`);

      recommendations.push({
        type: "promotion",
        operation: op,
        operationName,
        message: `Excellent! ${parts.join(" and ")} is recommended. (${baseReasons})`,
        priority: "success",
        promoteLevelToKey,
        promoteGradeToKey,
      });
      return;
    }

    // Not enough data (little time and/or few questions) — not blue.
    // We leave this as yellow so it doesn't feel like "everything is good" when there's no time/data.
    if (!hasEnoughDataForStableRecommendation) {
      recommendations.push({
        type: "insufficient_data",
        operation: op,
        operationName,
        message: `You need more practice (mainly time/quantity of questions) to give a strong recommendation. (${baseReasons})`,
        priority: "medium",
      });
      return;
    }

    // "Not good" recommendations (red) — low accuracy or many mistakes in the period
    if ((hasQuestions && accuracy < 65 && questions >= TH.minDataQuestions) || mistakesCount >= 10) {
      const msgParts = [];
      if (accuracy < 65) msgParts.push(`Low accuracy (${accuracy}%) - it is recommended to repeat the basics and work slowly`);
      if (mistakesCount >= 10) msgParts.push(`${mistakesCount} Mistakes during the period - you should practice the topic in a focused way`);
      if (timeMinutes < 10) msgParts.push("It is also recommended to increase the practice time for this subject");

      recommendations.push({
        type: "needs_practice",
        operation: op,
        operationName,
        message: `${msgParts.join(". ")}. (${baseReasons})`,
        priority: "high",
        mistakeCount: mistakesCount,
      });
      return;
    }

    // In between (yellow)
    if (hasQuestions && accuracy < 80) {
      recommendations.push({
        type: "improve",
        operation: op,
        operationName,
        message: `There is progress, but it is better to strengthen before raising difficulties. (${baseReasons})`,
        priority: "medium",
      });
      return;
    }

    // Good (blue) - only if both the time target and the question count + good accuracy are met
    if (
      hasQuestions &&
      accuracy >= TH.goodAccuracy &&
      questions >= TH.goodQuestions &&
      timeMinutes >= TH.goodTimeMinutes
    ) {
      const hint =
        data.levelKey && data.levelKey !== "hard"
          ? `You can gradually try level ${LEVEL_LABELS[nextLevelKey(data.levelKey)] || "higher"}`
          : "Keep practicing to maintain stability";
      recommendations.push({
        type: "good",
        operation: op,
        operationName,
        message: `Good progress. ${hint}. (${baseReasons})`,
        priority: "low",
      });
      return;
    }

    // Default: yellow (not blue) — accuracy is good but time/questions are still too low to call it "very good"
    if (hasQuestions) {
      recommendations.push({
        type: "improve_more",
        operation: op,
        operationName,
        message: `The accuracy is good, but you need more practice (time/amount of questions) before increasing the difficulty. (${baseReasons})`,
        priority: "medium",
      });
      return;
    }

    recommendations.push({
      type: "ok",
      operation: op,
      operationName,
      message: `It is recommended to keep practicing to get accuracy data as well. (${baseReasons})`,
      priority: "medium",
    });
  });

  const priorityOrder = { success: 4, high: 3, medium: 2, low: 1 };
  recommendations.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
  return recommendations;
}

// Generate a PDF report (HTML → PDF) to keep the layout readable
export function exportReportToPDF(report, options = {}) {
  if (typeof window === "undefined") return;
  
  const elementId = options.elementId || "parent-report-pdf";
  const filename = options.filename || `Report-${report?.playerName || "Player"}-${report?.endDate || ""}.pdf`;
  const method = options.method || "print"; // "print" (recommended) | "canvas" (fallback)

  try {
    const el = document.getElementById(elementId);
    if (!el) {
      alert(reportPackCopy("utils__math-report-generator", "pdf_export_error_no_printable_content_found"));
      return;
    }

    // The professional approach: print to PDF (vector, proper page breaks, no "screenshot")
    if (method === "print") {
      if (window.__mleoPdfExportInProgress) return;
      window.__mleoPdfExportInProgress = true;

      const overlay = document.createElement("div");
      overlay.setAttribute("data-pdf-overlay", "1");
      overlay.classList.add("no-pdf");
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        background: rgba(0,0,0,0.45);
        display: flex; align-items: center; justify-content: center;
        color: #fff; font: 600 16px/1.4 system-ui, -apple-system, Segoe UI, Arial;
        direction: ltr; text-align: center;
        backdrop-filter: blur(2px);
      `;
      overlay.textContent = reportPackCopy("utils__math-report-generator", "opens_print_select_save_as_pdf");
      document.body.appendChild(overlay);

      // Many browsers use the title as the default PDF name
      const prevTitle = document.title;
      document.title = filename;

      // Print mode (the page's CSS will kick in via @media print)
      document.documentElement.classList.add("pdf-print-mode");

      const cleanup = () => {
        try { overlay.remove(); } catch {}
        document.documentElement.classList.remove("pdf-print-mode");
        document.title = prevTitle;
        window.__mleoPdfExportInProgress = false;
      };

      // Clean up after printing
      const prevAfterPrint = window.onafterprint;
      window.onafterprint = () => {
        try { prevAfterPrint?.(); } catch {}
        cleanup();
        window.onafterprint = prevAfterPrint || null;
      };

      // Make sure the overlay is painted before opening the print dialog
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            window.print();
          } catch (e) {
            console.error("Print failed:", e);
            cleanup();
            alert(reportPackCopy("utils__math-report-generator", "error_opening_print_please_try_again"));
          }
        });
      });

      return;
    }

    // Record chart sizes (Recharts ResponsiveContainer) so they don't collapse to 0 in the clone
    const chartEls = Array.from(el.querySelectorAll(".recharts-responsive-container"));
    const chartSizes = [];
    chartEls.forEach((node, idx) => {
      const rect = node.getBoundingClientRect();
      const w = Math.max(0, Math.round(rect.width));
      const h = Math.max(0, Math.round(rect.height));
      const id = `pdfchart-${idx}`;
      node.setAttribute("data-pdf-chart-id", id);
      // If height/width come out 0 (sometimes happens), try the parent instead
      const pRect = node.parentElement?.getBoundingClientRect?.() || { width: 0, height: 0 };
      chartSizes.push({
        id,
        w: w || Math.round(pRect.width) || 600,
        h: h || Math.round(pRect.height) || 280,
      });
    });

    // Prevent duplicate exports that could cause a freeze/memory issue
    if (window.__mleoPdfExportInProgress) return;
    window.__mleoPdfExportInProgress = true;

    // Small overlay so the user knows the action is in progress (doesn't change the page's own styling)
    const overlay = document.createElement("div");
    overlay.setAttribute("data-pdf-overlay", "1");
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font: 600 16px/1.4 system-ui, -apple-system, Segoe UI, Arial;
      direction: ltr; text-align: center;
      backdrop-filter: blur(2px);
    `;
    overlay.textContent = reportPackCopy("utils__math-report-generator", "preparing_a_pdf_this_may_take_a_few_seconds");
    document.body.appendChild(overlay);

    // Let the browser "breathe" and paint the overlay before the heavy work
    const deferStart = (fn) => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(fn, { timeout: 300 });
      } else {
        setTimeout(fn, 50);
      }
    };

    // Dynamic import to avoid weighing down SSR / build
    deferStart(() => {
      import("html2pdf.js/dist/html2pdf.js")
        .then((mod) => {
          const candidates = [mod, mod?.default, mod?.default?.default];
          const html2pdf = candidates.find((c) => typeof c === "function");
          if (!html2pdf) {
            throw new Error("html2pdf import did not return a function");
          }

          // Default: readable quality (sharper text) — still not "vectorial", but much clearer
          const dpr = window.devicePixelRatio || 1;
          const scale = Math.min(2, Math.max(1.8, dpr)); // sharper text

          const opt = {
            margin: [10, 10, 10, 10],
            filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale,
              useCORS: true,
              backgroundColor: "#ffffff",
              logging: false,
              onclone: (clonedDoc) => {
                try {
                  const root = clonedDoc.getElementById(elementId);
                  if (!root) return;

                  // Apply chart sizes so ResponsiveContainer doesn't export 0x0
                  chartSizes.forEach(({ id, w, h }) => {
                    const c = root.querySelector(`[data-pdf-chart-id="${id}"]`);
                    if (c) {
                      c.style.setProperty("width", `${w}px`, "important");
                      c.style.setProperty("height", `${h}px`, "important");
                      // Sometimes the parent wrapper is what governs — make sure it matches too
                      const parent = c.parentElement;
                      if (parent) {
                        parent.style.setProperty("width", `${w}px`, "important");
                        parent.style.setProperty("height", `${h}px`, "important");
                      }
                    }
                  });

                  // "PDF friendly" styling only inside the clone (doesn't change the site's own styling!)
                  root.setAttribute("dir", "ltr");

                  // Most important: html2canvas doesn't support oklab/oklch. Inject CSS with !important to force plain colors.
                  const style = clonedDoc.createElement("style");
                  style.textContent = `
                    /* PDF template for readability */
                    #${elementId} {
                      background: #fff !important;
                      color: #111 !important;
                      font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif !important;
                      font-size: 14px !important;
                      line-height: 1.55 !important;
                      -webkit-font-smoothing: antialiased !important;
                      text-rendering: geometricPrecision !important;
                      padding: 14px !important;
                      max-width: 780px !important;
                      margin: 0 auto !important;
                      direction: ltr !important;
                      text-align: left !important;
                      unicode-bidi: plaintext !important;
                    }
                    #${elementId} h1 { font-size: 22px !important; margin-bottom: 6px !important; }
                    #${elementId} h2 { font-size: 16px !important; margin: 10px 0 8px !important; }
                    #${elementId} p { margin: 4px 0 !important; }

                    #${elementId}, #${elementId} * {
                      color: #000 !important;
                      border-color: #d1d5db !important;
                      background-image: none !important;
                      background: transparent !important;
                      background-color: transparent !important;
                      box-shadow: none !important;
                      text-shadow: none !important;
                      filter: none !important;
                      backdrop-filter: none !important;
                      direction: ltr !important;
                      text-align: left !important;
                      unicode-bidi: plaintext !important;
                    }
                    #${elementId} {
                      background-color: #fff !important;
                    }

                    /* Cards/blocks – make them neat and clean */
                    #${elementId} .rounded-lg {
                      background-color: #fff !important;
                      border: 1px solid #e5e7eb !important;
                    }

                    /* Tables – spacing and borders for readability */
                    #${elementId} table { width: 100% !important; border-collapse: collapse !important; }
                    #${elementId} th, #${elementId} td {
                      padding: 6px 8px !important;
                      border: 1px solid #e5e7eb !important;
                      vertical-align: top !important;
                      font-size: 12.5px !important;
                      text-align: left !important;
                      direction: ltr !important;
                    }
                    #${elementId} thead th { background: #f3f4f6 !important; font-weight: 700 !important; }

                    /* Global English PDF: all content LTR */
                    #${elementId} * {
                      unicode-bidi: isolate;
                    }

                    /* Smart page breaks */
                    #${elementId} .avoid-break,
                    #${elementId} .rounded-lg,
                    #${elementId} table,
                    #${elementId} .recharts-wrapper,
                    #${elementId} .recharts-responsive-container {
                      break-inside: avoid !important;
                      page-break-inside: avoid !important;
                    }

                    /* Charts – do display in the PDF, but in a neat, readable way */
                    #${elementId} .recharts-wrapper,
                    #${elementId} .recharts-responsive-container {
                      display: block !important;
                    }
                    #${elementId} .recharts-wrapper {
                      margin: 0 auto !important;
                    }
                    /* Frame the chart area so it looks like it does in the report */
                    #${elementId} .recharts-wrapper,
                    #${elementId} svg.recharts-surface {
                      background: #fff !important;
                    }
                    /* Don't break a page in the middle of a chart */
                    #${elementId} .recharts-wrapper,
                    #${elementId} .recharts-responsive-container {
                      break-inside: avoid !important;
                      page-break-inside: avoid !important;
                    }
                  `;
                  clonedDoc.head.appendChild(style);

                  // Also explicitly enforce this on the root (with important) — in case there's an !important from the source
                  root.style.setProperty("background-color", "#ffffff", "important");
                  root.style.setProperty("color", "#000000", "important");
                  root.style.setProperty("background-image", "none", "important");

                  // Extra safeguard for charts: make sure SVGs stay LTR
                  const svgs = root.querySelectorAll("svg");
                  svgs.forEach((svg) => {
                    svg.setAttribute("direction", "ltr");
                    svg.style.setProperty("direction", "ltr", "important");
                  });
                } catch (e) {
                  console.warn("PDF onclone styling failed:", e);
                }
              },
              ignoreElements: (node) => node?.classList?.contains("no-pdf"),
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            // Better page breaks:
            // - css: uses break rules
            // - legacy: fallback
            // - avoid-all: tries to avoid cutting blocks (sometimes)
            pagebreak: {
              mode: ["avoid-all", "css", "legacy"],
              avoid: [".avoid-break", ".recharts-wrapper", ".recharts-responsive-container", "table"],
              before: [".pdf-page-break"],
            },
          };

          return html2pdf().set(opt).from(el).save();
        })
        .catch((error) => {
          console.error("Error loading/creating PDF:", error);
          alert(reportPackCopy("utils__math-report-generator", "error_exporting_pdf_please_try_again_details") + (error?.message || "unknown"));
        })
        .finally(() => {
          try {
            overlay.remove();
          } catch {}
          // Clean up temporary attributes from the DOM
          try {
            chartEls.forEach((n) => n.removeAttribute("data-pdf-chart-id"));
          } catch {}
          window.__mleoPdfExportInProgress = false;
        });
    });
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    alert(reportPackCopy("utils__math-report-generator", "error_exporting_pdf_please_try_again"));
    try {
      const existing = document.querySelector('[data-pdf-overlay="1"]');
      existing?.remove?.();
    } catch {}
    window.__mleoPdfExportInProgress = false;
  }
}

