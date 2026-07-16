/**
 * Answer-first semantic routing: aggregate / comparison-style parent questions
 * (parent utterances). Does not read contracts — pattern only.
 */

/**
 * @param {string} utterance
 * @returns {
 *   "strongest_subject"|"weakest_subject"|"hardest_subject"|"subject_listing"|"period_highlight"|
 *   "comparison"|"most_practice"|"least_data"|"improved"|"needs_attention"|"still_unclear"|"most_stable"|
 *   "recommendation_action"|"clarify_reexplain"|"advance_or_hold_question"|"vague_summary_question"|"none"
 * }
 */
export function detectAggregateQuestionClass(utterance) {
  const t = String(utterance || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  if (t.length < 3) return "none";

  if (
    /^מה\s+הבעיה\s+(?:ב|בנושא|לגבי)\s*[\u0590-\u05FF]{2,}/u.test(t) ||
    /^מה\s+קשה\s+(?:ב|בנושא|לגבי)\s*[\u0590-\u05FF]{2,}/u.test(t)
  ) {
    return "none";
  }

  if (
    /^מה\s+הבעיה\??$/u.test(t) ||
    /^מה\s+הבעיה\s/u.test(t) ||
    /^מה\s+קשה(?:\s+לו|\s+לה)?/u.test(t) ||
    /^מה\s+לחזק/u.test(t) ||
    /^מה\s+טוב(?:\s+לו|\s+לה)?/u.test(t) ||
    /^איפה\s+הוא\s+חלש/u.test(t) ||
    /^איפה\s+הוא\s+חזק/u.test(t) ||
    /^איפה\s+היא\s+חלש/u.test(t) ||
    /^איפה\s+היא\s+חזק/u.test(t)
  ) {
    return "needs_attention";
  }

  if (
    /שתי\s+כיתות|כיתה\s+אחרת|תרגל\s+כיתה\s+אחרת|כיתה\s+גבוהה\s+יותר|יחסית\s+לכיתה/u.test(t)
  ) {
    return "still_unclear";
  }

  if (
    /^ו?בקיצור\??$/u.test(t) ||
    /^אז\s*מה\s*בעצם\??$/u.test(t) ||
    /מה\s*השורה\s*התחתונה/u.test(t) ||
    /מה\s*לקחת\s*מזה/u.test(t)
  ) {
    return "vague_summary_question";
  }

  if (
    /לא\s+הבנתי|לא\s+הבנתי\.|תסביר\s+פשוט|מה\s+זה\s+אומר\s+בעצם|^למה\s*\??$|^למה\?$|למה\s+זה\s+אומר/.test(t) ||
    /\bi\s+(?:did\s+not|didn'?t|don'?t)\s+understand\b/.test(t) ||
    /\bplease\s+explain\b/.test(t) ||
    /\bexplain\s+(?:it\s+)?(?:simply|in\s+simple\s+terms)\b/.test(t) ||
    /\bwhat\s+does\s+(?:that|this)\s+mean\b/.test(t) ||
    /\bwhy\s*\??$/.test(t)
  ) {
    return "clarify_reexplain";
  }

  if (
    /להתקדם\s+או\s+להמתין|כדאי\s+להתקדם|לחכות\s+או\s+להמשיך|להמשיך\s+או\s+להמתין|להמתין\s+או\s+להתקדם/.test(t) ||
    /\b(?:should\s+(?:we|i)\s+(?:move\s+forward|wait)|wait\s+or\s+continue|continue\s+or\s+wait|advance\s+or\s+hold)\b/.test(
      t,
    ) ||
    /\bis\s+it\s+worth\s+moving\s+forward\b/.test(t) ||
    /\bworth\s+(?:it\s+to\s+)?(?:move\s+forward|advance)\b/.test(t)
  ) {
    return "advance_or_hold_question";
  }

  if (
    /המלצות?\s+להמשך|המלצה\s+להמשך|מה\s+ההמלצות|המלצות\s+למה\s+להמשיך/.test(t) ||
    /מה\s+לעשות\s+עכשיו|מה\s+עושים\s+עכשיו|מה\s+לעשות\s+היום/.test(t) ||
    /מה\s+לעשות\s+בשבוע|מה\s+לעשות\s+השבוע|מה\s+לעשות\s+בשבוע\s+הקרוב/.test(t) ||
    /מה\s+כדאי\s+לעשות\s+בשבוע|מה\s+כדאי\s+לעשות\s+השבוע|מה\s+כדאי\s+לעשות\s+בשבוע\s+הקרוב/.test(t) ||
    (/תכנון\s+לשבוע/u.test(t) && /מה\s+מתחילים/u.test(t)) ||
    /מה\s+הצעד\s+הבא|הצעד\s+הבא/.test(t) ||
    /על\s+מה\s+להתמקד\s+עכשיו|על\s+מה\s+להתמקד/.test(t) ||
    /מה\s+הכי\s+חשוב\s+(?:כרגע|עכשיו|היום|לתרגל)/.test(t) ||
    /\bwhat\s+should\s+(?:we|i)\s+do\s+(?:right\s+now|today|this\s+week)\b/.test(t) ||
    /\bwhat\s+(?:should\s+(?:we|i)\s+)?(?:do|practice)\s+this\s+week\b/.test(t) ||
    /\bwhat\s+is\s+(?:the\s+)?next\s+step\b/.test(t) ||
    /\bwhat\s+are\s+(?:the\s+)?next\s+recommendations?\b/.test(t) ||
    /\bwhat\s+(?:should\s+(?:we|i)\s+)?focus\s+on\s+(?:right\s+now|today|now|this\s+week)\b/.test(t) ||
    /\bwhat\s+is\s+(?:the\s+)?most\s+important(?:\s+(?:thing|to\s+practice))?(?:\s+(?:right\s+now|today|now|this\s+week))?\b/.test(
      t,
    )
  ) {
    return "recommendation_action";
  }

  const hasSubjectWord = /מקצוע|מקצועות|חומר|חומרים|\bsubject\b|\bsubjects\b/.test(t);
  const hasMore = /יש\s+עוד|עוד\s+מק|אילו\s+מק|כל\s+המק|רשימת\s+מק|כמה\s+מק|\bmore\b|\bother\b|\blist\b|\bwhich\s+subjects\b|\bwhat\s+subjects\b/.test(t);

  if (
    (/מה\s+הכי\s+בולט|מה\s+בולט\s+ביותר|הכי\s+בולט/.test(t) && /תקופ|התקופ|בתקופ|דוח|למידה/.test(t)) ||
    (/בולט|בולטים|בולטת|מה\s+בולט|הדגש|ההדגשה/.test(t) && /תקופ|התקופ|בתקופ/.test(t)) ||
    (/\b(?:what|which)\b.*\b(?:stands?\s+out|most\s+noticeable|most\s+important|highlight)\b/.test(t) &&
      /\b(?:period|report|learning)\b/.test(t))
  ) {
    return "period_highlight";
  }
  if (/(?:בולט|בולטים|\bstands?\s+out\b|\bhighlight\b)/.test(t) && (t.includes("report") || t.includes("learning"))) {
    return "period_highlight";
  }

  if (hasMore && hasSubjectWord) return "subject_listing";
  if (hasMore && /נושא|נושאים|\btopic\b|\btopics\b/.test(t)) return "subject_listing";

  if (/איפה\s+יש\s+הכי\s+הרבה\s+תרגול|הכי\s+הרבה\s+תרגול|הכי\s+הרבה\s+שאלות|מרבית\s+התרגול|most\s+practice|most\s+questions/.test(t)) {
    return "most_practice";
  }
  if (/איפה\s+יש\s+הכי\s+מעט\s+נתונים|הכי\s+מעט\s+נתונים|פחות\s+נתונים|הכי\s+מעט\s+שאלות|least\s+data|least\s+information|fewest\s+questions/.test(t)) {
    return "least_data";
  }
  if (/מה\s+השתפר|איפה\s+השתפר|שיפור|התקדמות|התחזק|improv|progress/.test(t)) return "improved";
  if (/מה\s+דורש\s+תשומת\s+לב|דורש\s+תשומת\s+לב|מה\s+צריך\s+חיזוק|צריך\s+חיזוק|needs\s+attention|needs\s+work|needs\s+strengthening|reinforcement\s+needed|most\s+reinforcement|what\s+is\s+(?:weak|difficult)/.test(t)) return "needs_attention";
  if (/מה\s+עדיין\s+לא\s+ברור|עדיין\s+לא\s+ברור|מה\s+לא\s+ברור|still\s+unclear|not\s+clear|uncertain/.test(t)) return "still_unclear";
  if (/הכי\s+יציב|יציב\s+ביותר|יציבות|לא\s+יציב|stable|unstable/.test(t) && (hasSubjectWord || t.includes("subject"))) {
    return "most_stable";
  }

  if (
    (/(הכי|הכי\s+)(קשה|מאתגר|מאתגרת)/.test(t) && hasSubjectWord) ||
    /באיזה\s+מקצוע\s+הכי\s+קשה|באיזה\s+מקצוע\s+קשה|מקצוע\s+הכי\s+קשה/.test(t) ||
    /\b(?:which|what)\s+subject\b.*\b(?:hardest|most\s+difficult|most\s+challenging)\b/.test(t) ||
    /\b(?:hardest|most\s+difficult|most\s+challenging)\s+subject\b/.test(t) ||
    /\bsubject\b.*\b(?:is\s+the\s+)?(?:hardest|most\s+difficult|most\s+challenging)\b/.test(t)
  ) {
    return "hardest_subject";
  }

  if (
    (/(הכי|הכי\s+)(חלש|חלשה|חלשים|נמוך|נמוכה)/.test(t) && hasSubjectWord) ||
    /מקצוע\s+החלש|המקצוע\s+החלש|חלש\s+ביותר/.test(t) ||
    /\b(?:which|what)\s+subject\b.*\b(?:weakest|lowest|lowest\s+accuracy)\b/.test(t) ||
    /\b(?:weakest|lowest)\s+subject\b/.test(t) ||
    /\bsubject\b.*\b(?:is\s+the\s+)?(?:weakest|lowest)\b/.test(t)
  ) {
    return "weakest_subject";
  }

  if (
    (/(הכי|הכי\s+)(חזק|חזקה|חזקים|טוב|טובה|טובים)/.test(t) && hasSubjectWord) ||
    (/מקצוע\s+החזק|המקצוע\s+החזק|חזק\s+ביותר|הכי\s+חזק/.test(t) && (hasSubjectWord || t.includes("subject"))) ||
    /מה\s+המקצוע\s+החזק|איזה\s+מקצוע\s+החזק/.test(t) ||
    /\b(?:which|what)\s+subject\b.*\b(?:strongest|best|highest|going\s+well)\b/.test(t) ||
    /\b(?:strongest|best|highest)\s+subject\b/.test(t) ||
    /\bsubject\b.*\b(?:is\s+the\s+)?(?:strongest|best|highest|going\s+well)\b/.test(t)
  ) {
    return "strongest_subject";
  }

  if (
    /(לעומת|מול|בהשוואה|יותר\s+מ|פחות\s+מ).*(מקצוע|חשבון|עברית|גאומטריה|גיאומטריה|אנגלית|מדעים|מולדת)/.test(t) ||
    /(חשבון|עברית|אנגלית|גאומטריה|גיאומטריה|מדעים)\s+מול\s+(חשבון|עברית|אנגלית|גאומטריה|גיאומטריה|מדעים)/.test(t) ||
    /קריאה\s+או\s+חשבון|חשבון\s+או\s+קריאה|הבעיה\s+היא\s+קריאה\s+או\s+חשבון|קריאה\s+מול\s+חשבון|חשבון\s+מול\s+קריאה/u.test(
      t,
    ) ||
    /\b(?:compare|compared|versus|vs\.?|between)\b.*\b(?:subject|math|arithmetic|english|geometry|science|history|hebrew)\b/.test(t)
  ) {
    return "comparison";
  }

  return "none";
}

/** Aggregate classes that bind to executive scope even when a topic name appears in the utterance. */
export const EXECUTIVE_AGGREGATE_SCOPE_CLASSES = new Set([
  "period_highlight",
  "strongest_subject",
  "weakest_subject",
  "hardest_subject",
  "subject_listing",
  "comparison",
  "most_practice",
  "least_data",
  "improved",
  "needs_attention",
  "still_unclear",
  "most_stable",
]);

/** Semantic answer-first classes that must not be pre-empted by intent_composer. */
export const INTENT_COMPOSER_DEFER_CLASSES = new Set([
  "recommendation_action",
  "clarify_reexplain",
  "advance_or_hold_question",
  ...EXECUTIVE_AGGREGATE_SCOPE_CLASSES,
]);

/**
 * @param {string} questionClass
 */
export function shouldDeferIntentComposer(questionClass) {
  return INTENT_COMPOSER_DEFER_CLASSES.has(String(questionClass || ""));
}

export default { detectAggregateQuestionClass, shouldDeferIntentComposer, EXECUTIVE_AGGREGATE_SCOPE_CLASSES, INTENT_COMPOSER_DEFER_CLASSES };
