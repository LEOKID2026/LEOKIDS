/**
 * English SEO metadata for public marketing, practice, and legal pages.
 * @typedef {{ title: string; description: string; canonicalPath: string; noindex?: boolean }} PublicPageSeoEntry
 */

/** @type {Record<string, PublicPageSeoEntry>} */
export const PUBLIC_PAGE_SEO = {
  home: {
    title: "Leo Kids — Learning, games, and progress tracking for kids",
    description:
      "A learning system for elementary learners that combines practice and games with clear parent reports across math, geometry, English, and science.",
    canonicalPath: "/",
  },
  contact: {
    title: "Contact · Leo Kids",
    description: "Contact Leo Kids — questions, support, bug reports, or ideas to improve the site.",
    canonicalPath: "/contact",
  },
  about: {
    title: "About · Leo Kids",
    description: "About Leo Kids — subject practice, parent reports, games, coins, and cards for kids.",
    canonicalPath: "/about",
  },
  kids: {
    title: "Learn and play with Leo · Leo Kids",
    description:
      "Practice math, geometry, English, and science — with games, coins, cards, and surprises along the way.",
    canonicalPath: "/kids",
  },
  parents: {
    title: "Parent portal · Leo Kids",
    description:
      "Progress reports, reinforcement insights, and personal activities — tools for parents in Leo Kids.",
    canonicalPath: "/parents",
  },
  teachers: {
    title: "Teacher portal · Leo Kids",
    description: "Tracking tools, personal activities, and reports — built for private tutors in Leo Kids.",
    canonicalPath: "/teachers",
  },
  "parent-login": {
    title: "Parent login · Leo Kids",
    description: "Sign in to the Leo Kids parent portal.",
    canonicalPath: "/parent/login",
    noindex: true,
  },
  "teacher-login": {
    title: "Teacher login · Leo Kids",
    description: "Sign in to the Leo Kids teacher portal.",
    canonicalPath: "/teacher/login",
    noindex: true,
  },
  "practice-hub": {
    title: "Practice by subject · Leo Kids",
    description: "Digital practice for elementary learners in math, geometry, English, and science.",
    canonicalPath: "/practice",
  },
  "practice-math": {
    title: "Math practice by grade and topic · Leo Kids",
    description:
      "Math practice for elementary learners — addition, subtraction, multiplication, division, fractions, and more.",
    canonicalPath: "/practice/math",
  },
  "practice-reading": {
    title: "Reading comprehension practice · Leo Kids",
    description:
      "Short texts, comprehension questions, and English reading practice for elementary learners.",
    canonicalPath: "/practice/reading",
  },
  "practice-english": {
    title: "English practice by grade and topic · Leo Kids",
    description: "English practice — vocabulary, phonics, grammar, sentences, and reading.",
    canonicalPath: "/practice/english",
  },
  "practice-geometry": {
    title: "Geometry practice by grade and topic · Leo Kids",
    description: "Geometry practice — shapes, angles, perimeter, area, volume, and more.",
    canonicalPath: "/practice/geometry",
  },
  "practice-science": {
    title: "Science practice by topic · Leo Kids",
    description: "Science practice — body, animals, plants, materials, earth, and weather.",
    canonicalPath: "/practice/science",
  },
  "practice-games": {
    title: "Learning games for kids · Leo Kids",
    description: "Learning games that reinforce practice with challenges and rewards.",
    canonicalPath: "/practice/games",
  },
  "practice-no-print": {
    title: "Digital practice without printing · Leo Kids",
    description: "Practice online by subject and topic — no printing required.",
    canonicalPath: "/practice/no-print",
  },
  "practice-parent-reports": {
    title: "Parent progress reports · Leo Kids",
    description: "See what your child practiced, topics to strengthen, and clear next steps.",
    canonicalPath: "/practice/parent-reports",
  },
  "practice-worksheets": {
    title: "Printable worksheets for kids · Leo Kids",
    description: "Ready worksheets, a worksheet generator, and answer keys for elementary practice.",
    canonicalPath: "/practice/worksheets",
  },
  help: {
    title: "Help center · Leo Kids",
    description:
      "Guides for parents and students — how to use the site, read reports, and practice by subject.",
    canonicalPath: "/help",
  },
  "guides-hub": {
    title: "Guides for parents · Leo Kids",
    description:
      "Practical guides for home practice, progress tracking, learning games, and building a routine.",
    canonicalPath: "/guides",
  },
  "guides-math-practice-at-home": {
    title: "Math practice at home · Leo Kids guides",
    description: "How to choose a math topic, respond to mistakes, and build steady home practice.",
    canonicalPath: "/guides/math-practice-at-home",
  },
  "guides-reading-practice-at-home": {
    title: "Reading practice at home · Leo Kids guides",
    description: "How to practice reading accuracy, pace, and understanding with short texts at home.",
    canonicalPath: "/guides/reading-practice-at-home",
  },
  "guides-reading-comprehension-at-home": {
    title: "Reading comprehension at home · Leo Kids guides",
    description: "How to help your child find details, explain answers, and draw conclusions from text.",
    canonicalPath: "/guides/reading-comprehension-at-home",
  },
  "guides-english-vocabulary-practice": {
    title: "English vocabulary practice · Leo Kids guides",
    description: "How to practice new words in context and review them through the week.",
    canonicalPath: "/guides/english-vocabulary-practice",
  },
  "guides-learning-games-at-home": {
    title: "Learning games at home · Leo Kids guides",
    description: "How to combine learning games with focused practice by subject and topic.",
    canonicalPath: "/guides/learning-games-at-home",
  },
  "guides-math-games-for-kids": {
    title: "Math games for kids · Leo Kids guides",
    description: "How to use math games for operations, numbers, and problem-solving practice.",
    canonicalPath: "/guides/math-games-for-kids",
  },
  "guides-parent-progress-tracking": {
    title: "Parent progress tracking · Leo Kids guides",
    description: "How to read progress reports and spot patterns over time.",
    canonicalPath: "/guides/parent-progress-tracking",
  },
  "guides-how-to-follow-child-progress": {
    title: "Choosing a topic to strengthen · Leo Kids guides",
    description: "How to pick the next topic based on reports, answers, and repeating difficulty.",
    canonicalPath: "/guides/how-to-follow-child-progress",
  },
  "guides-home-practice-routine": {
    title: "Home practice routine · Leo Kids guides",
    description: "How to build a home practice routine with one clear goal per session.",
    canonicalPath: "/guides/home-practice-routine",
  },
  "guides-no-print-worksheets": {
    title: "Practice without printing · Leo Kids guides",
    description: "How to use digital practice and games, and when worksheets help.",
    canonicalPath: "/guides/no-print-worksheets",
  },
};

/**
 * @param {string} key
 * @returns {PublicPageSeoEntry}
 */
export function getPublicPageSeo(key) {
  const entry = PUBLIC_PAGE_SEO[key];
  if (entry) return entry;
  return {
    title: "Leo Kids",
    description: "Leo Kids — practice for elementary learners.",
    canonicalPath: "/",
  };
}
