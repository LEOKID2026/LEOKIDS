#!/usr/bin/env node
/**
 * Replace common Hebrew UI literals in learning *-master.js with ms.t() calls.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const HEBREW_RE = /[\u0590-\u05FF]/;

const MASTERS = [
  "pages/learning/math-master.js",
  "pages/learning/english-master.js",
  "pages/learning/geometry-master.js",
  "pages/learning/science-master.js",
];

const REPLACEMENTS = [
  ['title: `שלב ${idx + 1}`', 'title: ms.t("learning.master.step", { num: idx + 1 })'],
  ['title: "שלב 1: נבין את השאלה"', 'title: ms.t("learning.math.steps.understandQuestion")'],
  ['<span>נסתכל על התרגיל.</span>', '<span>{ms.t("learning.math.steps.understandQuestion")}</span>'],
  ['title: "שלב 2: איך ניגשים?"', 'title: ms.t("learning.math.steps.howToApproach")'],
  ['content: <span>נפתור לפי הכללים של הנושא.</span>', 'content: <span>{ms.t("learning.math.steps.solveByRules")}</span>'],
  ['title: "שלב 3: התשובה"', 'title: ms.t("learning.math.steps.theAnswer")'],
  ['<span>התשובה היא: {renderMaybeStackedFractionText(ansText)}</span>', '<span>{ms.t("learning.math.steps.answerIs", { answer: renderMaybeStackedFractionText(ansText) })}</span>'],
  ['<span>נבדוק את התשובה.</span>', '<span>{ms.check}</span>'],
  ['setFeedback("🎉 כל השגיאות תוקנו! מעולה!")', 'setFeedback(ms.t("learning.master.mistakesFixed"))'],
  ['let feedbackText = "נכון! "', 'let feedbackText = ms.t("learning.master.streakFeedback.correct")'],
  ['feedbackText = `מדהים! רצף של ${streak + 1}! `', 'feedbackText = ms.t("learning.master.streakFeedback.amazing", { streak: streak + 1 })'],
  ['feedbackText = `מצוין! רצף של ${streak + 1}! `', 'feedbackText = ms.t("learning.master.streakFeedback.excellent", { streak: streak + 1 })'],
  ['feedbackText = `כל הכבוד! רצף של ${streak + 1}! `', 'feedbackText = ms.t("learning.master.streakFeedback.wellDone", { streak: streak + 1 })'],
  ['feedbackText = `יופי! רצף של ${streak + 1}! `', 'feedbackText = ms.t("learning.master.streakFeedback.nice", { streak: streak + 1 })'],
  ['<div className="text-xs text-white/60 mb-1">רמה</div>', '<div className="text-xs text-white/60 mb-1">{ms.level}</div>'],
  ['<div className="text-lg font-bold text-purple-400">רמה {playerLevel}</div>', '<div className="text-lg font-bold text-purple-400">{ms.t("learning.master.levelLabel", { level: playerLevel })}</div>'],
  ['<span>נק׳ ניסיון</span>', '<span>{ms.xpPoints}</span>'],
  ['<div className="text-xs text-white/60 mb-2">בחר אווטר:</div>', '<div className="text-xs text-white/60 mb-2">{ms.chooseAvatar}</div>'],
  ['<div className="text-sm text-white/60 mb-2">התקדמות לפי פעולות</div>', '<div className="text-sm text-white/60 mb-2">{ms.t("learning.master.progressByOperation")}</div>'],
  ['<span className="text-amber-300 font-semibold">לחזק:</span>', '<span className="text-amber-300 font-semibold">{ms.t("learning.master.strengthen")}</span>'],
  ['<span className="text-emerald-300 font-semibold">חזק ביחס:</span>', '<span className="text-emerald-300 font-semibold">{ms.t("learning.master.strongRelative")}</span>'],
  ['לפחות 2 ניסיונות; נשמר בדפדפן בלבד.', '{ms.t("learning.master.browserOnlyMistakes")}'],
  ['? `תרגל את ${mistakes.length} השגיאות שעשית`', '? ms.t("learning.master.practiceYourMistakes", { count: mistakes.length })'],
  ['<div className="text-sm text-white/60 mb-2">שגיאות אחרונות:</div>', '<div className="text-sm text-white/60 mb-2">{ms.t("learning.master.recentMistakes")}</div>'],
  ['🗑️ נקה שגיאות', '{ms.clearMistakes}'],
  ['תרגול ממוקד', '{ms.focusedPractice}'],
  ['{isVerticalDisplay ? "↔️ מאוזן" : "↕️ מאונך"}', '{isVerticalDisplay ? ms.t("learning.master.showHorizontal") : ms.t("learning.master.showVertical")}'],
  ['דף טיוטה', '{ms.t("learning.master.draftPage")}'],
  ['📖 צעד-צעד', '{ms.t("learning.master.stepByStep")}'],
  [': "\\u200Fאיך פותרים את התרגיל?"', ': ms.t("learning.master.howToSolveExerciseRtl")'],
  ['קודם', '{ms.t("learning.master.previous")}'],
  ['הבא', '{ms.t("learning.master.next")}'],
  ['צעד {animationStep + 1} מתוך {animationSteps.length}', 'ms.t("learning.master.stepOf", { current: animationStep + 1, total: animationSteps.length })'],
  ['איפוס', '{ms.t("learning.master.reset")}'],
  ['÷ חילוק', '{ms.t("learning.master.divisionLabel")}'],
  ['× כפל', '{ms.t("learning.master.multiplicationLabel")}'],
  ['בדוק', '{ms.check}'],
  ['שאלה חדשה', '{ms.t("learning.master.newQuestion")}'],
  ['שורה {num}', 'ms.t("learning.master.rowN", { num })'],
  ['עמודה {num}', 'ms.t("learning.master.columnN", { num })'],
  ['⚠️ שגיאה:{" "}', '{ms.t("learning.master.remainderWarning")}{" "}'],
  ['הוא לא מספר שלם!', '{ms.t("learning.master.notInteger")}'],
  ['? "לחץ על מספר מהטבלה, ואז על מספר שורה או עמודה"', '? ms.t("learning.master.tableTapNumberHint")'],
  [': "לחץ על מספר תוצאה, ואז על מספר שורה/עמודה כדי לראות את החילוק"', ': ms.t("learning.master.divisionTableTapHint")'],
  ['"שגיאה בטעינת לוח התוצאות:"', 'ms.t("learning.master.leaderboardLoadErrorPrefix")'],
  ['עדיין אין תוצאות ברמה{" "}', '{ms.t("learning.master.noResultsAtLevel")}{" "}'],
  ['🎲 בחר פעולות', '{ms.t("learning.master.pickOperations")}'],
  ['בחר פעולות', '{ms.t("learning.master.pickOperationsTitle")}'],
  ['שמור', '{ms.t("learning.master.save")}'],
  ['בטל', '{ms.t("learning.master.cancel")}'],
  ['הכל', '{ms.t("learning.master.all")}'],
  ['<div className="text-xl">אתה עכשיו ברמה {playerLevel}!</div>', '<div className="text-xl">{ms.t("learning.master.levelUpNowText", { level: playerLevel })}</div>'],
  ['title={`כיתה ${gradeLabels[gradeNumber - 1]}`}', 'title={ms.t("learning.master.gradeTitle", { grade: gradeLabels[gradeNumber - 1] })}'],
  ['{`כיתה ${gradeLabels[idx]}`}', '{ms.t("learning.master.gradeTitle", { grade: gradeLabels[idx] })}'],
  ['title="ערוך נושאים למיקס"', 'title={ms.t("learning.master.editMixTopics")}'],
  ['placeholder="כתוב את התשובה שלך כאן..."', 'placeholder={ms.t("learning.master.answerPlaceholderLong")}'],
  ['? "✅ בדוק תשובה"', '? ms.t("learning.master.checkAnswerBtn")'],
  ['עדיין אין תוצאות עבור רמה {ms.getDisplayLevelLabel(leaderboardLevel)}', '{ms.t("learning.master.noResultsForLevel")} {ms.getDisplayLevelLabel(leaderboardLevel)}'],
  ['🎲 בחר נושאים למיקס', '{ms.t("learning.master.pickMixTopics")}'],
  ['בחר אילו נושאים לכלול במיקס', '{ms.t("learning.master.pickMixTopicsBlurb")}'],
  ['בטל הכל', '{ms.t("learning.master.deselectAll")}'],
  ['alert("אנא בחר לפחות נושא אחד")', 'alert(ms.t("learning.master.selectOneTopicMin"))'],
  ['🎯 תרגול טעויות אחרונות', '{ms.t("learning.master.mistakePracticeTitle")}'],
  ['בחר טעות אחרונה כדי לפתוח משחק ממוקד באותו נושא, כיתה ורמת קושי.', '{ms.t("learning.master.mistakePracticeBlurb")}'],
  ['אין טעויות פעילות כרגע. תתחיל משחק, אסוף נתונים ואז חזור לכאן.', '{ms.t("learning.master.noActiveMistakes")}'],
  ['{getGradeLabel(mistake.grade) || "כיתה נוכחית"}', '{getGradeLabel(mistake.grade) || ms.t("learning.master.currentGrade")}'],
  ['תרגל עכשיו', '{ms.t("learning.master.practiceNow")}'],
  ['🧹 איפוס טעויות', '{ms.t("learning.master.clearMistakesBtn")}'],
  ['<h2 className="text-2xl font-extrabold">📚 לוח מילים אינטראקטיבי</h2>', '<h2 className="text-2xl font-extrabold">{ms.t("learning.master.wordBoardTitle")}</h2>'],
  ['בחר קטגוריה כדי לראות מילים חשובות באנגלית ובעברית, בדיוק כמו בעזרי העזר של משחק החשבון.', '{ms.t("learning.master.wordBoardBlurb")}'],
  ['אין מילים להצגה בקטגוריה זו.', '{ms.t("learning.master.noWordsInCategory")}'],
  ['<h2 className="text-2xl font-extrabold">🎛️ הגדרות תרגול חכם</h2>', '<h2 className="text-2xl font-extrabold">{ms.t("learning.master.smartPracticeSettings")}</h2>'],
  ['כמו במשחקי החשבון והגאומטריה, ניתן לבחור כאן מצב אימון מיוחד, חיבור לשגיאות אחרונות או מעבר מדורג בי', '{ms.t("learning.master.smartPracticeBlurb")}'],
  ['<p className="text-xs text-white/60 font-semibold">מצב מיקוד</p>', '<p className="text-xs text-white/60 font-semibold">{ms.t("learning.master.focusMode")}</p>'],
  ['{ value: "normal", label: "ברירת מחדל" }', '{ value: "normal", label: ms.t("learning.master.defaultMode") }'],
  ['{ value: "mistakes", label: "חזרה על טעויות אחרונות" }', '{ value: "mistakes", label: ms.t("learning.master.repeatRecentMistakes") }'],
  ['{ value: "graded", label: "תרגול מדורג (התחלה נמוכה → הרמה שבחרת)" }', '{ value: "graded", label: ms.t("learning.master.gradedPracticeLabel") }'],
  ['<p className="text-xs text-white/60 font-semibold">שאלות תרגום/סיפור</p>', '<p className="text-xs text-white/60 font-semibold">{ms.t("learning.master.translationQuestions")}</p>'],
  ['<span>שלב שאלות תרגום בתוך משחקי האוצר מילים/דקדוק</span>', '<span>{ms.t("learning.master.translationInVocab")}</span>'],
  ['<span>הצג רק שאלות תרגום/סיפור</span>', '<span>{ms.t("learning.master.translationOnly")}</span>'],
  ['<div className="font-semibold mb-1">סיכום מצב נוכחי</div>', '<div className="font-semibold mb-1">{ms.t("learning.master.currentStateSummary")}</div>'],
  ['<p>מיקוד שגיאות: {focusedPracticeMode === "normal" ? ms.t("learning.master.practiceModes.normal") :', '<p>{ms.t("learning.master.mistakeFocus")} {focusedPracticeMode === "normal" ? ms.t("learning.master.practiceModes.normal") :'],
  ['<p>שאלות תרגום: {storyOnly ? "רק תרגום" : useStoryQuestions ? "מעורב" : "כבוי"}</p>', '<p>{ms.t("learning.master.translationMode")} {storyOnly ? ms.t("learning.master.translationOnlyShort") : useStoryQuestions ? ms.t("learning.master.translationMixed") : ms.t("learning.master.translationOff")}</p>'],
  ['{dailyStreak.streak >= 30 ? "👑 אלוף!" : dailyStreak.streak >= 14 ? "🌟 מצוין!" : dailyStreak.streak', '{dailyStreak.streak >= 30 ? ms.t("learning.master.dailyStreakChampion") : dailyStreak.streak >= 14 ? ms.t("learning.master.dailyStreakExcellent") : dailyStreak.streak'],
  ['aria-label="הגדל שרטוט"', 'aria-label={ms.t("learning.master.enlargeDiagram")}'],
  ['⛶ הגדל', '{ms.t("learning.master.enlarge")}'],
  ['📘 צעד-צעד', '{ms.t("learning.master.stepByStep")}'],
  ['צעד {animationStep + 1} מתוך{" "}', 'ms.t("learning.master.stepOf", { current: animationStep + 1, total:'],
  ['console.error("שגיאה בטעינת לוח התוצאות:", e)', 'console.error(ms.t("learning.master.leaderboardLoadErrorPrefix"), e)'],
  ['title: "הסבר"', 'title: ms.t("learning.master.explainTitle")'],
  ['אין כאן פירוט צעדים לשאלה זו. השתמשו בלוח הנוסחאות.', '{ms.t("learning.master.noStepDetailGeometry")}'],
  ['errExpl = `${errExpl} התשובה הנכונה: ${ans}.`', 'errExpl = `${errExpl} ${ms.t("learning.master.correctAnswerColon", { answer: ans })}`'],
  ['errExpl = `התשובה הנכונה: ${ans}.`', 'errExpl = ms.t("learning.master.correctAnswerColon", { answer: ans })'],
  ['aria-label="שרטוט מוגדל"', 'aria-label={ms.t("learning.master.enlargedDiagram")}'],
  ['<span className="text-emerald-300 font-bold text-sm">שרטוט</span>', '<span className="text-emerald-300 font-bold text-sm">{ms.t("learning.master.diagram")}</span>'],
  ['aria-label="סגור שרטוט"', 'aria-label={ms.t("learning.master.closeDiagram")}'],
  ['{"\\u200Fסגור"}', '{ms.t("learning.master.closeRtl")}'],
  ['console.error("כיתה לא תקינה:", grade)', 'console.error("Invalid grade:", grade)'],
  ['console.error("אין נושאים זמינים לכיתה:", grade)', 'console.error("No topics available for grade:", grade)'],
];

// English reference category labels in english-master
const ENGLISH_REF_REPLACEMENTS = [
  ['colors: { label: "צבעים", lists: ["colors"] }', 'colors: { label: "Colors", lists: ["colors"] }'],
  ['animals: { label: "חיות", lists: ["animals"] }', 'animals: { label: "Animals", lists: ["animals"] }'],
  ['actions: { label: "פעלים נפוצים", lists: ["actions"] }', 'actions: { label: "Common verbs", lists: ["actions"] }'],
  ['emotions: { label: "רגשות", lists: ["emotions"] }', 'emotions: { label: "Emotions", lists: ["emotions"] }'],
  ['school: { label: "חיי בית ספר", lists: ["school", "family"] }', 'school: { label: "School life", lists: ["school", "family"] }'],
  ['technology: { label: "טכנולוגיה", lists: ["technology", "global_issues"] }', 'technology: { label: "Technology", lists: ["technology", "global_issues"] }'],
];

// English how-to-learn blurb in english-master
const ENGLISH_BLURB = [
  ['המטרה היא לתרגל אנגלית בצורה משחקית, עם התאמה לכיתה, נושא ורמת קושי.', 'The goal is to practice English in a fun way, matched to grade, topic, and difficulty.'],
  ['<li>בחר כיתה, רמת קושי ונושא (אוצר מילים, דקדוק, תרגום, כתיבה ועוד).</li>', '<li>Choose grade, difficulty, and topic (vocabulary, grammar, translation, writing, and more).</li>'],
  ['<li>בחר מצב משחק: למידה, אתגר עם טיימר וחיים, מהירות או מרתון.</li>', '<li>Choose a game mode: learning, challenge with timer and lives, speed, or marathon.</li>'],
  ['<li>קרא היטב את השאלה – לפעמים צריך לבחור תשובה, ולפעמים לכתוב באנגלית.</li>', '<li>Read each question carefully — sometimes you choose an answer, sometimes you type in English.</li>'],
  ['<li>ניקוד גבוה, רצף תשובות נכון, כוכבים ו Badges עוזרים לך לעלות רמה כשחקן.</li>', '<li>High scores, answer streaks, stars, and badges help you level up as a player.</li>'],
  [': "\\u200Fאיך פותרים את השאלה?"', ': ms.t("learning.master.howToSolveExerciseRtl")'],
];

for (const rel of MASTERS) {
  const file = path.join(root, rel);
  let text = fs.readFileSync(file, "utf8");
  let changed = 0;
  for (const [from, to] of [...REPLACEMENTS, ...ENGLISH_REF_REPLACEMENTS, ...ENGLISH_BLURB]) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      changed++;
    }
  }
  if (changed) {
    fs.writeFileSync(file, text, "utf8");
    console.log(`[fix-masters] ${rel}: ${changed} replacement group(s)`);
  }
}

for (const rel of MASTERS) {
  const text = fs.readFileSync(path.join(root, rel), "utf8");
  let n = 0;
  text.split(/\r?\n/).forEach((line) => {
    if (HEBREW_RE.test(line)) {
      const t = line.trim();
      if (!t.startsWith("//") && !t.startsWith("*") && !t.startsWith("/*")) n++;
    }
  });
  if (n) console.log(`[fix-masters] remaining in ${rel}: ${n}`);
}
