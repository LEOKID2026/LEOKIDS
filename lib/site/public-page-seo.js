import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
/**
 * English SEO metadata for public marketing, practice, and legal pages.
 * @typedef {{ title: string; description: string; canonicalPath: string; noindex?: boolean }} PublicPageSeoEntry
 */

/** @type {Record<string, PublicPageSeoEntry>} */
export const PUBLIC_PAGE_SEO = {
  home: {
    title: globalBurnDownCopy("lib__site__public-page-seo", "leo_kids_learning_games_and_progress_tracking_for_kids"),
    description:
      "A learning system for elementary learners that combines practice and games with clear parent reports across math, geometry, English, and science.",
    canonicalPath: "/",
  },
  contact: {
    title: globalBurnDownCopy("lib__site__public-page-seo", "contact_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "contact_leo_kids_questions_support_bug_reports_or_ideas_to_improve_the_s"),
    canonicalPath: "/contact",
  },
  about: {
    title: globalBurnDownCopy("lib__site__public-page-seo", "about_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "about_leo_kids_subject_practice_parent_reports_games_coins_and_cards_for"),
    canonicalPath: "/about",
  },
  kids: {
    title: globalBurnDownCopy("lib__site__public-page-seo", "learn_and_play_with_leo_leo_kids"),
    description:
      "Practice math, geometry, English, and science — with games, coins, cards, and surprises along the way.",
    canonicalPath: "/kids",
  },
  parents: {
    title: globalBurnDownCopy("lib__site__public-page-seo", "parent_portal_leo_kids"),
    description:
      "Progress reports, reinforcement insights, and personal activities — tools for parents in Leo Kids.",
    canonicalPath: "/parents",
  },
  teachers: {
    title: globalBurnDownCopy("lib__site__public-page-seo", "teacher_portal_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "tracking_tools_personal_activities_and_reports_built_for_private_tutors_"),
    canonicalPath: "/teachers",
  },
  "parent-login": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "parent_login_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "sign_in_to_the_leo_kids_parent_portal"),
    canonicalPath: "/parent/login",
    noindex: true,
  },
  "teacher-login": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "teacher_login_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "sign_in_to_the_leo_kids_teacher_portal"),
    canonicalPath: "/teacher/login",
    noindex: true,
  },
  "practice-hub": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "practice_by_subject_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "digital_practice_for_elementary_learners_in_math_geometry_english_and_sc"),
    canonicalPath: "/practice",
  },
  "practice-math": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "math_practice_by_grade_and_topic_leo_kids"),
    description:
      "Math practice for elementary learners — addition, subtraction, multiplication, division, fractions, and more.",
    canonicalPath: "/practice/math",
  },
  "practice-reading": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "reading_comprehension_practice_leo_kids"),
    description:
      "Short texts, comprehension questions, and English reading practice for elementary learners.",
    canonicalPath: "/practice/reading",
  },
  "practice-english": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "english_practice_by_grade_and_topic_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "english_practice_vocabulary_phonics_grammar_sentences_and_reading"),
    canonicalPath: "/practice/english",
  },
  "practice-geometry": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "geometry_practice_by_grade_and_topic_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "geometry_practice_shapes_angles_perimeter_area_volume_and_more"),
    canonicalPath: "/practice/geometry",
  },
  "practice-science": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "science_practice_by_topic_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "science_practice_body_animals_plants_materials_earth_and_weather"),
    canonicalPath: "/practice/science",
  },
  "practice-games": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "learning_games_for_kids_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "learning_games_that_reinforce_practice_with_challenges_and_rewards"),
    canonicalPath: "/practice/games",
  },
  "practice-no-print": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "digital_practice_without_printing_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "practice_online_by_subject_and_topic_no_printing_required"),
    canonicalPath: "/practice/no-print",
  },
  "practice-parent-reports": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "parent_progress_reports_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "see_what_your_child_practiced_topics_to_strengthen_and_clear_next_steps"),
    canonicalPath: "/practice/parent-reports",
  },
  "practice-worksheets": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "printable_worksheets_for_kids_leo_kids"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "ready_worksheets_a_worksheet_generator_and_answer_keys_for_elementary_pr"),
    canonicalPath: "/practice/worksheets",
  },
  help: {
    title: globalBurnDownCopy("lib__site__public-page-seo", "help_center_leo_kids"),
    description:
      "Guides for parents and students — how to use the site, read reports, and practice by subject.",
    canonicalPath: "/help",
  },
  "guides-hub": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "guides_for_parents_leo_kids"),
    description:
      "Practical guides for home practice, progress tracking, learning games, and building a routine.",
    canonicalPath: "/guides",
  },
  "guides-math-practice-at-home": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "math_practice_at_home_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_choose_a_math_topic_respond_to_mistakes_and_build_steady_home_pra"),
    canonicalPath: "/guides/math-practice-at-home",
  },
  "guides-reading-practice-at-home": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "reading_practice_at_home_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_practice_reading_accuracy_pace_and_understanding_with_short_texts"),
    canonicalPath: "/guides/reading-practice-at-home",
  },
  "guides-reading-comprehension-at-home": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "reading_comprehension_at_home_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_help_your_child_find_details_explain_answers_and_draw_conclusions"),
    canonicalPath: "/guides/reading-comprehension-at-home",
  },
  "guides-english-vocabulary-practice": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "english_vocabulary_practice_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_practice_new_words_in_context_and_review_them_through_the_week"),
    canonicalPath: "/guides/english-vocabulary-practice",
  },
  "guides-learning-games-at-home": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "learning_games_at_home_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_combine_learning_games_with_focused_practice_by_subject_and_topic"),
    canonicalPath: "/guides/learning-games-at-home",
  },
  "guides-math-games-for-kids": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "math_games_for_kids_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_use_math_games_for_operations_numbers_and_problem_solving_practic"),
    canonicalPath: "/guides/math-games-for-kids",
  },
  "guides-parent-progress-tracking": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "parent_progress_tracking_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_read_progress_reports_and_spot_patterns_over_time"),
    canonicalPath: "/guides/parent-progress-tracking",
  },
  "guides-how-to-follow-child-progress": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "choosing_a_topic_to_strengthen_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_pick_the_next_topic_based_on_reports_answers_and_repeating_diffic"),
    canonicalPath: "/guides/how-to-follow-child-progress",
  },
  "guides-home-practice-routine": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "home_practice_routine_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_build_a_home_practice_routine_with_one_clear_goal_per_session"),
    canonicalPath: "/guides/home-practice-routine",
  },
  "guides-no-print-worksheets": {
    title: globalBurnDownCopy("lib__site__public-page-seo", "practice_without_printing_leo_kids_guides"),
    description: globalBurnDownCopy("lib__site__public-page-seo", "how_to_use_digital_practice_and_games_and_when_worksheets_help"),
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
    description: globalBurnDownCopy("lib__site__public-page-seo", "leo_kids_practice_for_elementary_learners"),
    canonicalPath: "/",
  };
}
