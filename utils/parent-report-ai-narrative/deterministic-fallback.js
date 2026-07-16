/**
 * Deterministic English narrative builder. Produces the SAME structured shape as the LLM:
 *   { summary, strengths[{textHe, sourceId}], focusAreas[{textHe, sourceId}], homeTips[], cautionNote }
 *
 * The fallback is the safety net for: no API key, LLM disabled, network failure, or AI output
 * that fails any validator step. Output passes all 9 validator steps by construction.
 */

function trim(s, max) {
  const t = typeof s === "string" ? s.trim() : "";
  return t.length > max ? t.slice(0, max) : t;
}

function bandToCopy(band) {
  switch (String(band || "").toLowerCase()) {
    case "high":
      return "mature, stable practice";
    case "moderate":
      return "consistent practice with reasonable stability";
    case "mixed":
      return "mixed practice, with some areas more stable than others";
    default:
      return "practice that's still worth treating with caution";
  }
}

function buildSummary(packet) {
  const total = Math.max(0, Math.round(Number(packet?.overall?.totalQuestions) || 0));
  const accuracy = Math.max(0, Math.min(100, Number(packet?.overall?.accuracyPct) || 0));
  const dc = String(packet?.overall?.dataConfidence || "").toLowerCase();
  const studentName = trim(packet?.student?.displayName, 40);
  const subjectStr = (packet?.subjects || [])
    .filter((s) => Number(s.totalQuestions) > 0)
    .map((s) => s.displayNameHe)
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");
  const strengths = Array.isArray(packet?.strengths) ? packet.strengths : [];
  const focusAreas = Array.isArray(packet?.focusAreas) ? packet.focusAreas : [];
  const mixedGrade = packet?.mixedGradePractice === true;

  if (total === 0) {
    return "No practice was recorded in the system during this period. It's worth continuing to watch after more practice before drawing conclusions.";
  }
  if (mixedGrade && strengths.length === 0 && focusAreas.length === 0) {
    return "There's only a little practice in the registered grade's material, so it's worth continuing to practice more before drawing broader conclusions.";
  }
  if (dc === "thin" || dc === "low") {
    const opening = studentName ? `From ${studentName}'s practice this period` : "From this period's practice";
    return trim(
      `${opening}, only an initial direction can be seen. ${subjectStr ? `The main subjects practiced: ${subjectStr}.` : ""} It's worth continuing to watch gently, and not drawing firm conclusions from a single session.`,
      560
    );
  }
  const opening = studentName ? `From ${studentName}'s practice this period` : "From this period's practice";
  const accuracyDesc = bandToCopy(packet?.overall?.accuracyPct >= 85 ? "high" : packet?.overall?.accuracyPct >= 70 ? "moderate" : packet?.overall?.accuracyPct >= 50 ? "mixed" : "low");
  return trim(
    `${opening}, the picture shows ${accuracyDesc}. ${subjectStr ? `Subjects practiced this period: ${subjectStr}.` : ""} It's recommended to continue with a short, regular practice routine to reinforce this.`,
    560
  );
}

function buildStrengthsBullets(packet) {
  const out = [];
  const candidates = Array.isArray(packet?.strengths) ? packet.strengths : [];
  for (const s of candidates) {
    if (out.length >= 3) break;
    if (!s?.sourceId || !s?.displayNameHe) continue;
    const evidence = trim(s.evidenceHe, 60);
    const text = evidence
      ? `Practice in ${s.displayNameHe} looks stable - ${evidence}.`
      : `Practice in ${s.displayNameHe} looks stable.`;
    out.push({ textHe: trim(text, 150), sourceId: s.sourceId });
  }
  return out;
}

function buildFocusBullets(packet) {
  const out = [];
  const candidates = Array.isArray(packet?.focusAreas) ? packet.focusAreas : [];
  for (const f of candidates) {
    if (out.length >= 3) break;
    if (!f?.sourceId || !f?.displayNameHe) continue;
    const evidence = trim(f.evidenceHe, 60);
    const text = evidence
      ? `It's worth continuing to strengthen ${f.displayNameHe} - ${evidence}.`
      : `It's worth continuing to gently strengthen ${f.displayNameHe}.`;
    out.push({ textHe: trim(text, 150), sourceId: f.sourceId });
  }
  return out;
}

function buildHomeTips(packet) {
  const tips = [];
  const focusFirst = (packet?.focusAreas || [])[0];
  const strengthFirst = (packet?.strengths || [])[0];
  if (focusFirst?.displayNameHe) {
    tips.push(`Set a short, regular time at home for gentle practice of ${focusFirst.displayNameHe}, without time pressure.`);
  } else {
    tips.push("Set a short, regular time at home for routine practice, without time pressure.");
  }
  if (strengthFirst?.displayNameHe) {
    tips.push(`Keep encouraging ${strengthFirst.displayNameHe} through calm conversation and simple games at home.`);
  } else {
    tips.push("Give positive reinforcement for effort, not just results, and keep the conversation around learning calm.");
  }
  if (tips.length < 3) {
    tips.push("Keep watching over time and let the picture settle before drawing firm conclusions.");
  }
  return tips.slice(0, 3).map((t) => trim(t, 150));
}

function buildCautionNote(packet) {
  const warnings = Array.isArray(packet?.thinDataWarnings) ? packet.thinDataWarnings : [];
  if (warnings.length === 0) return "";
  const overall = warnings.find((w) => w.scope === "overall");
  if (overall) {
    return trim("It's important to remember that there's limited data for this period - this is only an initial direction, and it's worth avoiding firm conclusions.", 280);
  }
  const subjects = warnings
    .filter((w) => w.scope === "subject" && w.displayNameHe)
    .map((w) => w.displayNameHe)
    .slice(0, 3);
  if (subjects.length === 0) {
    return trim("It's important to remember that data in some areas is limited - it's worth continuing to watch before drawing conclusions.", 280);
  }
  return trim(
    `It's important to remember that data for ${subjects.join(", ")} is limited this period - this is only an initial direction.`,
    280
  );
}

/**
 * Builds a deterministic narrative output that matches the LLM output schema exactly.
 * @param {object} packet — Insight Packet (full, not the AI projection)
 * @returns {{ summary: string, strengths: {textHe:string,sourceId:string}[], focusAreas: {textHe:string,sourceId:string}[], homeTips: string[], cautionNote: string }}
 */
export function buildDeterministicFallbackNarrative(packet) {
  return {
    summary: buildSummary(packet),
    strengths: buildStrengthsBullets(packet),
    focusAreas: buildFocusBullets(packet),
    homeTips: buildHomeTips(packet),
    cautionNote: buildCautionNote(packet),
  };
}
