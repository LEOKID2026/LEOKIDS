import { SCIENCE_GRADES } from "../../data/science-curriculum.js";
import { sortTopicsByBookSequence } from "../../lib/learning-book/learning-book-sequence.js";
import { resolveCanonicalGradeKey } from "./teacher-class-grade.js";
import { GRADES as MATH_GRADES } from "../../utils/math-constants.js";
import { getMathReportBucketDisplayName } from "../../utils/math-report-generator.js";
import {
  GRADES as GEOMETRY_GRADES,
  TOPICS as GEOMETRY_TOPICS,
} from "../../utils/geometry-constants.js";
import {
  ENGLISH_GRADES,
  ENGLISH_TOPICS,
} from "../../utils/english-question-generator.js";
import { isTopicHiddenFromLaunch } from "../launch-readiness/topic-launch-policy.js";

const SCIENCE_TOPIC_LABELS = {
  body: "Human body",
  animals: "Animals",
  plants: "Plants",
  materials: "Materials",
  experiments: "Experiments",
  earth_space: "Earth & space",
  environment: "Environment",
};

function canonicalGrade(gradeKey) {
  return resolveCanonicalGradeKey(gradeKey);
}

export function mathTopicOptionsForGrade(gradeKey) {
  const canonical = canonicalGrade(gradeKey);
  if (!canonical) return [];
  const operations = MATH_GRADES[canonical]?.operations || [];
  return operations
    .filter((op) => op !== "mixed")
    .map((key) => ({ key, label: getMathReportBucketDisplayName(key) || key }));
}

export function geometryTopicOptionsForGrade(gradeKey) {
  const canonical = canonicalGrade(gradeKey);
  if (!canonical) return [];
  const topics = GEOMETRY_GRADES[canonical]?.topics || [];
  return topics
    .filter((t) => t !== "mixed")
    .map((key) => ({ key, label: GEOMETRY_TOPICS[key]?.name || key }));
}

export function englishTopicOptionsForGrade(gradeKey) {
  const canonical = canonicalGrade(gradeKey);
  if (!canonical) return [];
  const topics = ENGLISH_GRADES[canonical]?.topics || [];
  return topics.map((key) => ({ key, label: ENGLISH_TOPICS[key]?.name || key }));
}

export function scienceTopicOptionsForGrade(gradeKey) {
  const canonical = canonicalGrade(gradeKey);
  if (!canonical) return [];
  const topics = SCIENCE_GRADES[canonical]?.topics ?? [];
  const ordered = sortTopicsByBookSequence("science", canonical, topics);
  return ordered.map((key) => ({
    key,
    label: SCIENCE_TOPIC_LABELS[key] ?? key,
  }));
}

export function topicOptionsForSubject(subjectKey, gradeKey) {
  let opts = [];
  if (subjectKey === "math") opts = mathTopicOptionsForGrade(gradeKey);
  else if (subjectKey === "geometry") opts = geometryTopicOptionsForGrade(gradeKey);
  else if (subjectKey === "english") opts = englishTopicOptionsForGrade(gradeKey);
  else if (subjectKey === "science") opts = scienceTopicOptionsForGrade(gradeKey);
  return opts.filter(({ key }) => !isTopicHiddenFromLaunch(subjectKey, gradeKey, key));
}

export function defaultTopicForSubject(subjectKey, gradeKey) {
  const opts = topicOptionsForSubject(subjectKey, gradeKey);
  if (subjectKey === "math") return opts[0]?.key || "addition";
  return opts[0]?.key || "";
}
