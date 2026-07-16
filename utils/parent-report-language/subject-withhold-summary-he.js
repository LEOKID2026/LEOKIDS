/**
 * Parent-facing copy when the engine keeps actionState "withhold" but there is practice volume.
 * Centralizes replacement for the old generic "יש נתוני תרגול… עדיין זהיר" line.
 */

/** Full generic cautious line for subject scope (parent-facing subject cards / detailed.json). */
export const GENERIC_CAUTIOUS_SUBJECT_LINE_HE =
  "There's some practice data, but what the practice shows is still tentative - it's worth continuing to watch more practice.";

/** Topic-level thin cautious line (short report / "in topic X" prefix). */
export const GENERIC_CAUTIOUS_TOPIC_LINE_HE =
  "There's practice data, but what the practice shows is still tentative - it's worth continuing to watch more practice.";

const SUBJECT_COPY = {
  richStable:
    "There's a significant volume of practice in this subject, and a more consistent picture can be seen based on the accuracy and topics examined.",
  richNoStrength:
    "There's a significant volume of practice in this subject; no sharp recurring difficulty is visible right now - it's worth continuing focused practice and watching for what repeats.",
  unstable:
    "In this subject, answers look less consistent across topics - it's worth revisiting a short foundation and checking stability before a clear direction.",
  medium:
    "There's a certain volume of practice; to reduce misinterpretation - it's worth continuing focused practice and watching for what repeats.",
  multiWeak:
    "A few different directions appear in this subject's practice - it's worth gradually focusing on what repeats as difficult.",
  weakPattern: (p) =>
    `In this subject a relative difficulty appears (${p}), so it's worth focusing on short, targeted practice.`,
};

const TOPIC_COPY = {
  richStable:
    "There's a significant volume of practice, and a more consistent picture can be seen based on the accuracy and what was actually examined.",
  richNoStrength:
    "There's a significant volume of practice; no sharp recurring difficulty is visible right now - it's worth continuing focused practice and watching for what repeats.",
  unstable:
    "Answers look less consistent across parts of this topic - it's worth stabilizing a short foundation before a clear direction.",
  medium:
    "There's a volume of practice; to reduce misinterpretation - it's worth continuing focused practice and watching for what repeats.",
  multiWeak:
    "A few different directions appear in the practice - it's worth gradually focusing on what repeats as difficult.",
  weakPattern: (p) => `A relative difficulty appears (${p}) - it's worth focusing on short, targeted practice.`,
};

/**
 * @param {unknown[]} units
 */
export function unitsSuggestInstability(units) {
  const list = Array.isArray(units) ? units : [];
  for (const u of list) {
    const b = String(u?.strengthProfile?.dominantBehavior || "").toLowerCase();
    if (b === "random_guessing" || b === "inconsistent" || b.includes("guess") || b.includes("inconsisten")) {
      return true;
    }
  }
  return false;
}

/**
 * @param {"subject"|"topic"} mode
 * @param {{
 *   subjectReportQuestions?: number,
 *   sumUnitQuestions?: number,
 *   strengthUnitCount?: number,
 *   diagnosedCount?: number,
 *   weakPatternHe?: string,
 *   units?: unknown[],
 *   subjectLabelHe?: string,
 *   reportSubjectAccuracy?: number | null,
 *   reportTotalQuestions?: number,
 *   clearWeakTopicLabelHe?: string,
 *   clearWeakTopicQuestions?: number,
 *   clearWeakTopicAccuracy?: number,
 * }} ctx
 */
export function withholdSummaryCopyHe(mode, ctx) {
  const m = mode === "topic" ? "topic" : "subject";
  const C = m === "topic" ? TOPIC_COPY : SUBJECT_COPY;
  const subjectLabelHe = String(ctx.subjectLabelHe || "").trim();
  const mediumSubjectAware = subjectLabelHe
    ? `There's a volume of practice in ${subjectLabelHe}; to reduce misinterpretation - it's worth continuing focused practice and watching for what repeats.`
    : "There's a certain volume of practice; to reduce misinterpretation - it's worth continuing focused practice and watching for what repeats.";
  const accMaybe =
    ctx.reportSubjectAccuracy == null ? null : Number(ctx.reportSubjectAccuracy);
  const reportAcc =
    accMaybe != null && Number.isFinite(accMaybe)
      ? Math.max(0, Math.min(100, Math.round(accMaybe)))
      : null;

  const volume = Math.max(
    Math.max(0, Number(ctx.subjectReportQuestions) || 0),
    Math.max(0, Number(ctx.sumUnitQuestions) || 0),
  );
  const su = Math.max(0, Number(ctx.strengthUnitCount) || 0);
  const dc = Math.max(0, Number(ctx.diagnosedCount) || 0);
  const pattern = String(ctx.weakPatternHe || "").trim();
  const units = Array.isArray(ctx.units) ? ctx.units : [];
  const reportTotalQuestions = Math.max(0, Number(ctx.reportTotalQuestions) || 0);
  /** Plenty of practice overall → avoid generic cautious row/topic copy for one thinner slice */
  const globalVolumeSupportsRichCopy = reportTotalQuestions >= 80;

  const thinLine = m === "subject" ? GENERIC_CAUTIOUS_SUBJECT_LINE_HE : GENERIC_CAUTIOUS_TOPIC_LINE_HE;
  const weakLabel = String(ctx.clearWeakTopicLabelHe || "").trim();
  const weakQ = Math.max(0, Number(ctx.clearWeakTopicQuestions) || 0);
  const weakAcc = Number(ctx.clearWeakTopicAccuracy);

  if (
    volume >= 5 &&
    reportAcc != null &&
    reportAcc <= 55 &&
    (weakQ >= 5 || volume >= 5)
  ) {
    if (m === "subject" && subjectLabelHe) {
      if (weakLabel) {
        return `In ${subjectLabelHe} a clear reinforcement point is visible in ${weakLabel} - it's worth reinforcing it with short, targeted practice.`;
      }
      return `In ${subjectLabelHe} a clear reinforcement point is visible based on the practice - it's worth focusing on topics that need reinforcement.`;
    }
    if (m === "topic" && weakLabel) {
      return `A clear reinforcement point is visible in ${weakLabel} - it's worth reinforcing it with short, targeted practice.`;
    }
  }

  if (volume > 0 && volume < 35) {
    if (globalVolumeSupportsRichCopy) {
      if (dc >= 1 && pattern) return C.weakPattern(pattern);
      if (reportAcc != null && reportAcc > 0 && reportAcc <= 55 && volume >= 15) {
        if (m === "subject") {
          return subjectLabelHe
            ? `In ${subjectLabelHe} a relative difficulty appears based on the accuracy in the practice summary - it's worth focusing on short, targeted practice.`
            : mediumSubjectAware;
        }
        return TOPIC_COPY.medium;
      }
      return volume >= 15 ? (m === "subject" ? mediumSubjectAware : C.medium) : C.richStable;
    }
    return thinLine;
  }

  if (unitsSuggestInstability(units)) {
    return C.unstable;
  }

  if (dc >= 1 && pattern) {
    return C.weakPattern(pattern);
  }
  if (dc >= 2) {
    return C.multiWeak;
  }

  if (reportAcc != null && reportAcc > 0 && reportAcc <= 55 && volume >= 25) {
    if (m === "subject" && subjectLabelHe) {
      return `In ${subjectLabelHe} a relative difficulty appears based on the accuracy in the practice summary - it's worth focusing on short, targeted practice.`;
    }
    if (m === "topic") {
      return `A relative difficulty appears based on the accuracy in the practice summary - it's worth focusing on short, targeted practice.`;
    }
  }

  if (volume >= 90 && su >= 1) {
    return C.richStable;
  }
  if (volume >= 90 && su === 0) {
    if (m === "subject" && subjectLabelHe) {
      return `There's a significant volume of practice in ${subjectLabelHe}; no sharp recurring difficulty is visible right now - it's worth continuing focused practice and watching for what repeats.`;
    }
    return C.richNoStrength;
  }

  if (volume >= 40) {
    return m === "subject" ? mediumSubjectAware : C.medium;
  }

  if (volume >= 10) {
    if (reportAcc != null && reportAcc <= 55) {
      if (m === "subject" && subjectLabelHe) {
        if (weakLabel) {
          return `In ${subjectLabelHe} a clear reinforcement point is visible in ${weakLabel} - it's worth reinforcing it with short, targeted practice.`;
        }
        return `In ${subjectLabelHe} a clear reinforcement point is visible based on the practice - it's worth focusing on topics that need reinforcement.`;
      }
    }
    if (globalVolumeSupportsRichCopy) {
      return m === "subject" ? mediumSubjectAware : C.medium;
    }
    return thinLine;
  }

  // Not enough evidence yet to draw a conclusion at this stage.
  return "There still isn't enough data at this stage to determine a clear picture.";
}

/**
 * Confidence strip parallel to withhold summary (no generic cautious fallback).
 * @param {{
 *   subjectReportQuestions?: number,
 *   sumUnitQuestions?: number,
 *   strengthUnitCount?: number,
 *   diagnosedCount?: number,
 *   reportSubjectAccuracy?: number | null,
 * }} ctx
 */
export function withholdConfidenceSummaryFallbackHe(ctx) {
  const subjectLabelHe = String(ctx.subjectLabelHe || "").trim();
  const volume = Math.max(
    Math.max(0, Number(ctx.subjectReportQuestions) || 0),
    Math.max(0, Number(ctx.sumUnitQuestions) || 0),
  );
  const su = Math.max(0, Number(ctx.strengthUnitCount) || 0);
  const dc = Math.max(0, Number(ctx.diagnosedCount) || 0);
  const accMaybe =
    ctx.reportSubjectAccuracy == null ? null : Number(ctx.reportSubjectAccuracy);
  const reportAcc =
    accMaybe != null && Number.isFinite(accMaybe)
      ? Math.max(0, Math.min(100, Math.round(accMaybe)))
      : null;

  if (volume > 0 && volume < 35) {
    return "There's a practice foundation in this subject, but the evidence is still limited - it's worth continuing to gather practice and watch.";
  }
  if (reportAcc != null && reportAcc > 0 && reportAcc <= 55 && volume >= 25) {
    return "Based on the practice summary in this subject, accuracy looks relatively low - it's worth focusing on short, targeted practice and then checking again.";
  }
  if (volume >= 90 && su >= 1) {
    return "There's a significant volume of practice in this subject - a more consistent initial direction can be seen based on what was examined.";
  }
  if (volume >= 40 && dc >= 2) {
    return "In this subject, a few patterns appear in parallel - it's worth focusing on what repeats as difficult, with small, steady steps.";
  }
  if (volume >= 40) {
    return subjectLabelHe
      ? `There's a volume of practice in ${subjectLabelHe} - it's worth continuing focused practice and watching for what repeats.`
      : "There's a certain volume of practice - it's worth continuing focused practice and watching for what repeats.";
  }
  return subjectLabelHe
    ? `There's a practice foundation in ${subjectLabelHe} - it's worth continuing focused practice and watching how it develops.`
    : "There's a certain practice foundation - it's worth continuing focused practice and watching how it develops.";
}

/**
 * Detects the legacy paired cautious wording (subject or topic variants).
 * @param {string} text
 */
export function isGenericCautiousPracticeLineHe(text) {
  const t = String(text || "");
  const hasPractice = /יש\s+נתוני\s+תרגול|there'?s?\s+(?:some\s+)?practice\s+data/i.test(t);
  const hasCautious = /מה\s+שנראה\s+מהתרגולים\s+עדיין\s+זהיר|what\s+the\s+practice\s+shows\s+is\s+still\s+tentative/i.test(t);
  return hasPractice && hasCautious;
}
