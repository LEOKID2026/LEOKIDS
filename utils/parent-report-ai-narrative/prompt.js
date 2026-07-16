/**
 * English system prompt + facts JSON for the parent-report AI narrative writer.
 *
 * Hard rules embedded in the prompt:
 *  - Audience: parent. Voice: warm, professional, simple.
 *  - No medical/diagnostic language, no ADHD/learning disabilities/anxiety/depression/low self-esteem.
 *  - No emotional assumptions.
 *  - Must mention data limitations if `thinDataWarnings` is present.
 *  - Give 2-3 practical home tips.
 *  - Rely only on the provided display labels and the deterministic recommendations.
 *  - Must not invent topics, subjects, numbers, or teacher names.
 *  - Must return JSON only, no Markdown.
 *  - sourceId must be taken from the `availableStrengthSourceIds` / `availableFocusSourceIds` lists.
 */

const SYSTEM_LINES_EN = [
  "You are writing a short, professional summary in English for a parent about their child's practice in a learning system.",
  "Style: warm, simple, professional, without judgment and without dramatization.",
  "Do not use medical or diagnostic language: ADHD, dyslexia, learning disability, anxiety, depression, low self-esteem, ASD, mastery.",
  "Do not draw emotional conclusions about the child ('he isn't confident', 'she's anxious').",
  // ---- Forbidden emotional/confidence framing in any visible text ----
  "Never use the word 'confidence' in the visible text, in any form - not positively ('build up confidence') and not negatively ('lack of confidence'). This kind of emotional framing does not belong in a practice-based summary for a parent.",
  "Instead of 'confidence', use practice-descriptive wording such as: 'fluency in practice', 'independence in practice', 'building understanding', 'consistent practice', 'stability in practice', or 'repeated success in practice'.",
  "Do not invent topics, subjects, teacher names, grades, or numbers that do not appear in the input.",
  "Do not use Markdown, asterisks, hashes, or bullet-list characters.",
  "Do not include raw English internal keys such as `multiplication_table` or `reading_comprehension` in the visible text. The text must be natural English only.",
  // ---- Thin-data caution: deterministic, copy-verbatim contract ----
  "If the input has a field `required_caution_note_he` that is not null and not an empty string, you must copy its text verbatim, character-for-character, into the `cautionNote` output field. Do not modify, interpret, shorten, lengthen, strengthen, soften, translate, add a lead-in to, or rephrase it. Exact copy only.",
  "If `required_caution_note_he` is null or empty, and `thin_data_warnings` is also empty, you may leave `cautionNote` as an empty string.",
  "If `required_caution_note_he` is empty/null but `thin_data_warnings` is not empty (a rare case), write a short English sentence that contains the phrase 'initial direction'.",
  "Items for the JSON field `strengths` (relatively strong results among the candidates) and for `focusAreas` are only allowed from the closed lists `available_strength_source_ids` and `available_focus_source_ids`. For each item, also return a matching `sourceId`.",
  "The `textHe` of each item in `strengths` or `focusAreas` must be based on the corresponding `display_name_he` in the input (you may phrase it as a short, clear English sentence for a parent), and must not invent a new topic.",
  // ---- Hard count limits (must match output-schema.js / validate-narrative-output.js) ----
  "Quantity limit for the strengths field: at most 3 items. Never exceed 3, even if the candidate list has more. If `strengths_candidates` has more than 3, choose only the 3 most meaningful.",
  "Quantity limit for focus areas: at most 3 items in the focusAreas field. Never exceed 3.",
  "Quantity limit for tips: exactly 2 to 3 items in the homeTips field. Not fewer than 2 and not more than 3.",
  "Write 2 to 3 practical, short, actionable `homeTips` that can be done at home.",
  "Output: JSON only with the fields summary (string), strengths (array of {textHe, sourceId} up to 3), focusAreas (array of {textHe, sourceId} up to 3), homeTips (array of strings, 2-3), cautionNote (string).",
];

const SYSTEM_RULES_EN = [
  "Output strictly valid JSON. No prose outside JSON. No Markdown.",
  "Field names use camelCase in the JSON: summary, strengths, focusAreas, homeTips, cautionNote.",
  "Bullet item fields use camelCase: textHe, sourceId.",
  "Hard caps: strengths.length <= 3, focusAreas.length <= 3, homeTips.length is 2 or 3. Never exceed these caps even if more candidates are available.",
  "All visible text fields must be written in natural English (textHe, summary, homeTips, cautionNote).",
];

function buildFactsJson(input) {
  return {
    student_display_name: input.studentDisplayName || "",
    grade_level: input.gradeLevel || "unknown",
    range_label: input.rangeLabel || "",
    overall: {
      total_questions: input.overall?.totalQuestions || 0,
      accuracy_band: input.overall?.accuracyBand || "low",
      data_confidence: input.overall?.dataConfidence || "thin",
      avg_time_per_question_sec: input.overall?.avgTimePerQuestionSec ?? null,
      avg_hints_per_question: input.overall?.avgHintsPerQuestion ?? null,
      mode_counts: input.overall?.modeCounts || null,
      level_counts: input.overall?.levelCounts || null,
    },
    subjects: (input.subjects || []).map((s) => ({
      source_id: s.sourceId,
      display_name_he: s.displayNameHe,
      total_questions: s.totalQuestions,
      accuracy_band: s.accuracyBand,
      trend: s.trend,
      data_confidence: s.dataConfidence,
    })),
    strengths_candidates: (input.strengths || []).map((s) => ({
      source_id: s.sourceId,
      display_name_he: s.displayNameHe,
      evidence_he: s.evidenceHe,
    })),
    focus_areas_candidates: (input.focusAreas || []).map((f) => ({
      source_id: f.sourceId,
      display_name_he: f.displayNameHe,
      evidence_he: f.evidenceHe,
      thin_data: f.thinData === true,
    })),
    available_strength_source_ids: input.availableStrengthSourceIds || [],
    available_focus_source_ids: input.availableFocusSourceIds || [],
    fluency_signals: input.fluency || null,
    repeated_mistakes: input.repeatedMistakes || [],
    deterministic_recommendations_he: input.deterministicRecommendationsHe || [],
    thin_data_warnings: input.thinDataWarnings || [],
    required_caution_note_he:
      typeof input.requiredCautionNoteHe === "string" && input.requiredCautionNoteHe.trim()
        ? input.requiredCautionNoteHe.trim()
        : null,
  };
}

/**
 * Builds the prompt sent to the OpenAI Responses API.
 *
 * @param {object} aiNarrativeInput — strict, allowlisted projection of the Insight Packet
 * @returns {string} prompt
 */
export function buildNarrativePrompt(aiNarrativeInput) {
  const facts = buildFactsJson(aiNarrativeInput || {});
  const lines = [
    ...SYSTEM_LINES_EN,
    ...SYSTEM_RULES_EN,
    `FACTS_JSON: ${JSON.stringify(facts)}`,
  ];
  return lines.join("\n");
}

export function buildFactsJsonForTests(input) {
  return buildFactsJson(input || {});
}
