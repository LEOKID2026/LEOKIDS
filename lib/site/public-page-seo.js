import { globalBurnDownCopyForLocale } from "../i18n/global-burn-down-copy.js";
import { loadLocaleBundles, lookupMessage } from "../i18n/load-messages.js";

/**
 * @typedef {{ title: string; description: string; canonicalPath: string; noindex?: boolean }} PublicPageSeoEntry
 * @typedef {{
 *   canonicalPath: string,
 *   titleKey: string,
 *   descriptionKey?: string,
 *   seoTitleKey?: string,
 *   seoDescriptionKey?: string,
 *   noindex?: boolean,
 * }} PublicPageSeoMeta
 */

const SEO_PACK = "lib__site__public-page-seo";

/** @type {Record<string, PublicPageSeoMeta>} */
export const PUBLIC_PAGE_SEO_META = {
  home: {
    canonicalPath: "/",
    titleKey: "leo_kids_learning_games_and_progress_tracking_for_kids",
    seoTitleKey: "homeTitle",
    seoDescriptionKey: "homeDescription",
  },
  contact: {
    canonicalPath: "/contact",
    titleKey: "contact_leo_kids",
    descriptionKey: "contact_leo_kids_questions_support_bug_reports_or_ideas_to_improve_the_s",
    seoTitleKey: "contactTitle",
  },
  about: {
    canonicalPath: "/about",
    titleKey: "about_leo_kids",
    descriptionKey: "about_leo_kids_subject_practice_parent_reports_games_coins_and_cards_for",
    seoTitleKey: "aboutTitle",
  },
  kids: {
    canonicalPath: "/kids",
    titleKey: "learn_and_play_with_leo_leo_kids",
    descriptionKey: "kids_page_practice_math_geometry_english_science_games_coins_cards",
    seoTitleKey: "kidsTitle",
  },
  parents: {
    canonicalPath: "/parents",
    titleKey: "parent_portal_leo_kids",
    descriptionKey: "parents_page_progress_reports_reinforcement_insights_personal_activities",
    seoTitleKey: "parentsTitle",
  },
  teachers: {
    canonicalPath: "/teachers",
    titleKey: "teacher_portal_leo_kids",
    descriptionKey: "tracking_tools_personal_activities_and_reports_built_for_private_tutors_",
    seoTitleKey: "teachersTitle",
  },
  schools: {
    canonicalPath: "/schools",
    titleKey: "school_portal_leo_kids",
    descriptionKey: "school_portal_manage_classes_teachers_students_messaging_progress",
    seoTitleKey: "schoolsTitle",
  },
  "parent-login": {
    canonicalPath: "/parent/login",
    titleKey: "parent_login_leo_kids",
    descriptionKey: "sign_in_to_the_leo_kids_parent_portal",
    noindex: true,
  },
  "teacher-login": {
    canonicalPath: "/teacher/login",
    titleKey: "teacher_login_leo_kids",
    descriptionKey: "sign_in_to_the_leo_kids_teacher_portal",
    noindex: true,
  },
  learning: {
    canonicalPath: "/learning",
    titleKey: "practice_by_subject_leo_kids",
    descriptionKey: "digital_practice_for_elementary_learners_in_math_geometry_english_and_sc",
    seoTitleKey: "learningTitle",
    seoDescriptionKey: "learningDescription",
  },
  games: {
    canonicalPath: "/games",
    titleKey: "learning_games_for_kids_leo_kids",
    descriptionKey: "learning_games_that_reinforce_practice_with_challenges_and_rewards",
  },
  gallery: {
    canonicalPath: "/gallery",
    titleKey: "learn_and_play_with_leo_leo_kids",
    descriptionKey: "gallery_page_photos_and_videos_of_leo_the_site_mascot",
  },
  "student-home": {
    canonicalPath: "/student/home",
    titleKey: "learn_and_play_with_leo_leo_kids",
    descriptionKey: "kids_page_practice_math_geometry_english_science_games_coins_cards",
    seoTitleKey: "kidsTitle",
    noindex: true,
  },
  "practice-hub": {
    canonicalPath: "/practice",
    titleKey: "practice_by_subject_leo_kids",
    descriptionKey: "digital_practice_for_elementary_learners_in_math_geometry_english_and_sc",
  },
  "practice-math": {
    canonicalPath: "/practice/math",
    titleKey: "math_practice_by_grade_and_topic_leo_kids",
    descriptionKey: "math_practice_for_elementary_learners_operations_fractions_and_more",
  },
  "practice-reading": {
    canonicalPath: "/practice/reading",
    titleKey: "reading_comprehension_practice_leo_kids",
    descriptionKey: "reading_comprehension_short_texts_english_practice_for_elementary",
  },
  "practice-english": {
    canonicalPath: "/practice/english",
    titleKey: "english_practice_by_grade_and_topic_leo_kids",
    descriptionKey: "english_practice_vocabulary_phonics_grammar_sentences_and_reading",
  },
  "practice-geometry": {
    canonicalPath: "/practice/geometry",
    titleKey: "geometry_practice_by_grade_and_topic_leo_kids",
    descriptionKey: "geometry_practice_shapes_angles_perimeter_area_volume_and_more",
  },
  "practice-science": {
    canonicalPath: "/practice/science",
    titleKey: "science_practice_by_topic_leo_kids",
    descriptionKey: "science_practice_body_animals_plants_materials_earth_and_weather",
  },
  "practice-games": {
    canonicalPath: "/practice/games",
    titleKey: "learning_games_for_kids_leo_kids",
    descriptionKey: "learning_games_that_reinforce_practice_with_challenges_and_rewards",
  },
  "practice-no-print": {
    canonicalPath: "/practice/no-print",
    titleKey: "digital_practice_without_printing_leo_kids",
    descriptionKey: "practice_online_by_subject_and_topic_no_printing_required",
  },
  "practice-parent-reports": {
    canonicalPath: "/practice/parent-reports",
    titleKey: "parent_progress_reports_leo_kids",
    descriptionKey: "see_what_your_child_practiced_topics_to_strengthen_and_clear_next_steps",
  },
  "practice-worksheets": {
    canonicalPath: "/practice/worksheets",
    titleKey: "printable_worksheets_for_kids_leo_kids",
    descriptionKey: "ready_worksheets_a_worksheet_generator_and_answer_keys_for_elementary_pr",
  },
  help: {
    canonicalPath: "/help",
    titleKey: "help_center_leo_kids",
    descriptionKey: "help_center_guides_for_parents_and_students_site_reports_practice",
  },
  "guides-hub": {
    canonicalPath: "/guides",
    titleKey: "guides_for_parents_leo_kids",
    descriptionKey: "guides_hub_practical_guides_home_practice_progress_tracking",
  },
  "guides-math-practice-at-home": {
    canonicalPath: "/guides/math-practice-at-home",
    titleKey: "math_practice_at_home_leo_kids_guides",
    descriptionKey: "how_to_choose_a_math_topic_respond_to_mistakes_and_build_steady_home_pra",
  },
  "guides-reading-practice-at-home": {
    canonicalPath: "/guides/reading-practice-at-home",
    titleKey: "reading_practice_at_home_leo_kids_guides",
    descriptionKey: "how_to_practice_reading_accuracy_pace_and_understanding_with_short_texts",
  },
  "guides-reading-comprehension-at-home": {
    canonicalPath: "/guides/reading-comprehension-at-home",
    titleKey: "reading_comprehension_at_home_leo_kids_guides",
    descriptionKey: "how_to_help_your_child_find_details_explain_answers_and_draw_conclusions",
  },
  "guides-english-vocabulary-practice": {
    canonicalPath: "/guides/english-vocabulary-practice",
    titleKey: "english_vocabulary_practice_leo_kids_guides",
    descriptionKey: "how_to_practice_new_words_in_context_and_review_them_through_the_week",
  },
  "guides-learning-games-at-home": {
    canonicalPath: "/guides/learning-games-at-home",
    titleKey: "learning_games_at_home_leo_kids_guides",
    descriptionKey: "how_to_combine_learning_games_with_focused_practice_by_subject_and_topic",
  },
  "guides-math-games-for-kids": {
    canonicalPath: "/guides/math-games-for-kids",
    titleKey: "math_games_for_kids_leo_kids_guides",
    descriptionKey: "how_to_use_math_games_for_operations_numbers_and_problem_solving_practic",
  },
  "guides-parent-progress-tracking": {
    canonicalPath: "/guides/parent-progress-tracking",
    titleKey: "parent_progress_tracking_leo_kids_guides",
    descriptionKey: "how_to_read_progress_reports_and_spot_patterns_over_time",
  },
  "guides-how-to-follow-child-progress": {
    canonicalPath: "/guides/how-to-follow-child-progress",
    titleKey: "choosing_a_topic_to_strengthen_leo_kids_guides",
    descriptionKey: "how_to_pick_the_next_topic_based_on_reports_answers_and_repeating_diffic",
  },
  "guides-home-practice-routine": {
    canonicalPath: "/guides/home-practice-routine",
    titleKey: "home_practice_routine_leo_kids_guides",
    descriptionKey: "how_to_build_a_home_practice_routine_with_one_clear_goal_per_session",
  },
  "guides-no-print-worksheets": {
    canonicalPath: "/guides/no-print-worksheets",
    titleKey: "practice_without_printing_leo_kids_guides",
    descriptionKey: "how_to_use_digital_practice_and_games_and_when_worksheets_help",
  },
};

/**
 * @param {string|null|undefined} locale
 * @param {string} seoKey
 * @returns {string|null}
 */
function resolveSeoBundleKey(locale, seoKey) {
  const bundles = loadLocaleBundles(locale);
  const val = lookupMessage(bundles, `seo.${seoKey}`);
  return typeof val === "string" && val.trim() ? val : null;
}

/**
 * @param {string|null|undefined} locale
 * @param {string} key
 * @returns {string}
 */
function seoPack(locale, key) {
  return globalBurnDownCopyForLocale(locale, SEO_PACK, key);
}

/**
 * @param {string|null|undefined} locale
 * @param {PublicPageSeoMeta} meta
 * @returns {PublicPageSeoEntry}
 */
function resolvePublicPageSeoMeta(locale, meta) {
  const title =
    (meta.seoTitleKey && resolveSeoBundleKey(locale, meta.seoTitleKey)) ||
    seoPack(locale, meta.titleKey);

  const description =
    (meta.seoDescriptionKey && resolveSeoBundleKey(locale, meta.seoDescriptionKey)) ||
    (meta.descriptionKey ? seoPack(locale, meta.descriptionKey) : "");

  return {
    title,
    description,
    canonicalPath: meta.canonicalPath,
    ...(meta.noindex ? { noindex: true } : {}),
  };
}

/**
 * @param {string|null|undefined} locale
 * @param {string} key
 * @returns {PublicPageSeoEntry}
 */
export function getPublicPageSeoForLocale(locale, key) {
  const meta = PUBLIC_PAGE_SEO_META[key];
  if (meta) return resolvePublicPageSeoMeta(locale, meta);

  return {
    title: resolveSeoBundleKey(locale, "homeTitle") || seoPack(locale, "leo_kids_practice_for_elementary_learners"),
    description:
      resolveSeoBundleKey(locale, "homeDescription") ||
      seoPack(locale, "leo_kids_practice_for_elementary_learners"),
    canonicalPath: "/",
  };
}

/** @type {Record<string, PublicPageSeoEntry>} */
export const PUBLIC_PAGE_SEO = Object.fromEntries(
  Object.keys(PUBLIC_PAGE_SEO_META).map((key) => [key, getPublicPageSeoForLocale("en", key)])
);

/**
 * @param {string} key
 * @returns {PublicPageSeoEntry}
 */
export function getPublicPageSeo(key) {
  return getPublicPageSeoForLocale("en", key);
}
