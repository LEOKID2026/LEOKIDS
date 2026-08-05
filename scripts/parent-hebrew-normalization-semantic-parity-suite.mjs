import assert from "node:assert/strict";
import { normalizeParentFacing } from "../utils/parent-report-language/parent-facing-normalize.js";
import { pct, writeArtifact } from "./rollout-artifacts-lib.mjs";

const pairs = [
  {
    input: "        .",
    mustContain: [" ", "  "],
  },
  {
    input: "      .",
    mustContain: [" ", "  "],
  },
  {
    input: "     .",
    mustContain: [" ", "  "],
  },
  {
    input: "   ,    .",
    mustContain: ["   ", "  "],
  },
  {
    input: "       .",
    mustContain: [" ", "   "],
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
assert.ok(preservationRate >= 99, `normalization semantic preservation below threshold: ${preservationRate.toFixed(2)}%`);

console.log("parent-hebrew-normalization-semantic-parity-suite: OK");
