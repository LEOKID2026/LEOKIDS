import assert from "node:assert/strict";
import { normalizeParentFacing } from "../utils/parent-report-language/parent-facing-normalize.js";
import { pct, writeArtifact } from "./rollout-artifacts-lib.mjs";

const pairs = [
  {
    input: "Right now it is worth continuing to monitor and check again next week.",
    mustContain: ["Right now", "worth continuing to monitor"],
  },
  {
    input: "At this stage there is not enough data for a strong conclusion.",
    mustContain: ["At this stage", "not enough data"],
  },
  {
    input: "Right now short focused practice is recommended.",
    mustContain: ["Right now", "short focused practice"],
  },
  {
    input: "This is not a professional diagnosis, but a learning snapshot.",
    mustContain: ["not a professional diagnosis", "learning snapshot"],
  },
  {
    input: "Careful monitoring is recommended before raising difficulty.",
    mustContain: ["Careful monitoring", "before raising difficulty"],
  },
];

let preserved = 0;
for (const p of pairs) {
  const out = normalizeParentFacing(p.input);
  const ok = p.mustContain.every((frag) => out.includes(frag));
  if (ok) preserved += 1;
}

const preservationRate = pct(preserved, pairs.length);
writeArtifact("hebrew-normalization-semantic-parity", {
  sampleSize: pairs.length,
  normalizationSemanticPreservationRate: preservationRate,
  pass: preservationRate >= 99,
});

assert.ok(pairs.length >= 5, "normalization parity sample too small");
assert.ok(
  preservationRate >= 99,
  `normalization semantic preservation below threshold: ${preservationRate.toFixed(2)}%`
);

console.log("parent-hebrew-normalization-semantic-parity-suite: OK");
