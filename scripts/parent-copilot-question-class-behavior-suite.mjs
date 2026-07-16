/**
 * Validates **question classes** (routing + grounded answers), not exact product strings.
 * Run: npm run test:parent-copilot-question-class-behavior
 */
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const { syntheticPayload } = await import(pathToFileURL(join(ROOT, "scripts/parent-copilot-test-fixtures.mjs")).href);
const { resolveScope } = await import(pathToFileURL(join(ROOT, "utils/parent-copilot/scope-resolver.js")).href);
const { buildTruthPacketV1 } = await import(pathToFileURL(join(ROOT, "utils/parent-copilot/truth-packet-v1.js")).href);
const parentMod = await import(pathToFileURL(join(ROOT, "utils/parent-copilot/index.js")).href);
const runParentCopilotTurn = parentMod.default?.runParentCopilotTurn ?? parentMod.runParentCopilotTurn;

const UI_HELPER_SUBSTRINGS = ["question about the report", "answer:"];

const payload = syntheticPayload({ eligible: true });

/** @param {string} canonicalIntent */
function executiveTruthSlotsForIntent(canonicalIntent) {
  const tp = buildTruthPacketV1(payload, {
    scopeType: "executive",
    scopeId: "executive",
    scopeLabel: "the report for the selected period",
    interpretationScope: "executive",
    scopeClass: "executive",
    canonicalIntent,
  });
  assert.ok(tp, `truthPacket for intent ${canonicalIntent}`);
  const slots = tp.contracts?.narrative?.textSlots || {};
  return { o: String(slots.observation || ""), i: String(slots.interpretation || "") };
}

/**
 * Each key is a **behavior class**. `paraphrases` is a small family (short / noisy / informal / typos).
 * @type {Record<string, { expect: { resolutionStatus?: string; scopeType: string; scopeId?: string }; paraphrases: string[] }>}
 */
const QUESTION_CLASS_FAMILIES = {
  broadReportExecutive: {
    expect: { resolutionStatus: "resolved", scopeType: "executive" },
    paraphrases: [
      "What does this report mean for me in practice?",
      "What is the main thing I should know from the report?",
      "Help me make sense of the report numbers, I do not understand the picture",
      "What does the report say overall about this period?",
      "How should I understand the conclusions without getting stuck in small details?",
      "What should I pay attention to in this report period?",
      "I want a general picture of what is going on from the report",
      "I did not understand the meaning, please explain briefly what this is about",
      "What should I remember from this report?",
      "General meaning of the report please",
      "What is important to take home from this report?",
      "How should I read the report when there is a lot of data?",
      "What does the report say overall?",
    ],
  },
  subjectAnchored: {
    expect: { resolutionStatus: "resolved", scopeType: "subject", scopeId: "math" },
    paraphrases: [
      "What is going on in Math?",
      "In the Math subject, I am not sure what is happening",
      "I want to understand Math",
      "How is Math doing in the report?",
    ],
  },
  topicAnchored: {
    expect: { resolutionStatus: "resolved", scopeType: "topic", scopeId: "t1" },
    paraphrases: [
      "What about Fractions?",
      "Fractions - what is the status?",
      "What is the status of Fractions in the report?",
      "Fractions???",
    ],
  },
  actionExecutive: {
    expect: { resolutionStatus: "resolved", scopeType: "executive" },
    paraphrases: [
      "What should we do at home today?",
      "What should we do in the coming week?",
      "Weekly plan - what should we start with?",
    ],
  },
  meaningConcernExecutive: {
    expect: { resolutionStatus: "resolved", scopeType: "executive" },
    paraphrases: [
      "Should I be worried about the report?",
      "I am not sure if this is serious or not",
      "Is there anything concerning according to the report?",
    ],
  },
  communicationChildExecutive: {
    expect: { resolutionStatus: "resolved", scopeType: "executive" },
    paraphrases: [
      "How should I explain this to my child without pressure?",
      "What should I say at home about what is written in the report?",
    ],
  },
  communicationTeacherExecutive: {
    expect: { resolutionStatus: "resolved", scopeType: "executive" },
    paraphrases: ["What should I write to the teacher about what we saw in the report?", "Please give me wording for a teacher question"],
  },
  strengthWeaknessExecutive: {
    expect: { resolutionStatus: "resolved", scopeType: "executive" },
    paraphrases: [
      "What is strong and what is weak in the report?",
      "Strengths versus weaknesses in the report please",
      "A balanced summary of what is good and what is less good",
    ],
  },
  clarifyTermExecutive: {
    expect: { resolutionStatus: "resolved", scopeType: "executive" },
    paraphrases: ["What is the meaning of this term in the report?", "What does this mean here in the report?"],
  },
};

let sessionSeq = 0;
for (const [className, def] of Object.entries(QUESTION_CLASS_FAMILIES)) {
  for (const utterance of def.paraphrases) {
    const sc = resolveScope({ payload, utterance, selectedContextRef: null });
    if (def.expect.resolutionStatus) {
      assert.equal(sc.resolutionStatus, def.expect.resolutionStatus, `${className}: ${utterance.slice(0, 36)}`);
    }
    assert.equal(sc.scope?.scopeType, def.expect.scopeType, `${className} scopeType: ${utterance.slice(0, 36)}`);
    if (def.expect.scopeId) {
      assert.equal(sc.scope?.scopeId, def.expect.scopeId, `${className} scopeId: ${utterance.slice(0, 36)}`);
    }
    if (def.expect.resolutionStatus === "resolved") {
      const res = runParentCopilotTurn({
        audience: "parent",
        payload,
        utterance,
        sessionId: `qclass-${className}-${sessionSeq++}`,
        selectedContextRef: null,
      });
      assert.equal(res.resolutionStatus, "resolved", `${className} turn: ${utterance.slice(0, 36)}`);
      assert.ok(Array.isArray(res.answerBlocks) && res.answerBlocks.length >= 1, `${className} blocks`);
      const joined = res.answerBlocks.map((b) => String(b.textHe || "")).join("\n");
      for (const bad of UI_HELPER_SUBSTRINGS) {
        assert.ok(!joined.includes(bad), `${className}: no UI helper leak "${bad}"`);
      }
    }
  }
}

// Same entity scope (executive): **intent classes** must yield distinct grounded narrative slots (not coaching overlap).
const intentClassesForSlotParity = [
  "explain_report",
  "what_is_most_important",
  "strength_vs_weakness_summary",
  "what_is_going_well",
  "is_intervention_needed",
  "how_to_tell_child",
  "question_for_teacher",
  "clarify_term",
  "what_to_do_this_week",
  "why_not_advance",
];
const slotSnapshots = intentClassesForSlotParity.map((canonicalIntent) => ({
  canonicalIntent,
  ...executiveTruthSlotsForIntent(canonicalIntent),
}));
for (let a = 0; a < slotSnapshots.length; a += 1) {
  for (let b = a + 1; b < slotSnapshots.length; b += 1) {
    const sameO = slotSnapshots[a].o === slotSnapshots[b].o;
    const sameI = slotSnapshots[a].i === slotSnapshots[b].i;
    assert.ok(
      !(sameO && sameI),
      `executive narrative slots must not fully collapse between intent ${slotSnapshots[a].canonicalIntent} and ${slotSnapshots[b].canonicalIntent}`,
    );
  }
}

console.log("parent-copilot-question-class-behavior-suite: OK");
