/**
 * pt-PT content layer smoke checks (no full suite / no build).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

test("pt-PT learning-book parity path count matches pt-BR", () => {
  function countMd(dir) {
    let n = 0;
    if (!fs.existsSync(dir)) return 0;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) n += countMd(p);
      else if (ent.name.endsWith(".md")) n += 1;
    }
    return n;
  }
  const br = countMd(path.join(ROOT, "docs/learning-book/pt-BR"));
  const pt = countMd(path.join(ROOT, "docs/learning-book/pt-PT"));
  assert.equal(pt, br);
  assert.ok(pt >= 450);
});

test("pt-PT science overlay ID parity with pt-BR", async () => {
  const { SCIENCE_PT_BR_OVERLAY } = await import("../../data/science-questions-pt-BR-overlay.js");
  const { SCIENCE_PT_PT_OVERLAY } = await import("../../data/science-questions-pt-PT-overlay.js");
  const br = Object.keys(SCIENCE_PT_BR_OVERLAY).sort();
  const pt = Object.keys(SCIENCE_PT_PT_OVERLAY).sort();
  assert.deepEqual(pt, br);
});

test("pt-PT math/geometry rebuilders export expected symbols", async () => {
  const math = await import("../../utils/learning-content-pt-PT/math.js");
  const geo = await import("../../utils/learning-content-pt-PT/geometry.js");
  assert.equal(typeof math.rebuildMathStemPtPt, "function");
  assert.equal(typeof geo.rebuildGeometryStemPtPt, "function");
});

test("pt-PT word meanings are sparse overrides only", async () => {
  const { WORD_MEANINGS_PT_PT } = await import("../../data/english-questions/word-meanings/pt-PT.js");
  const { WORD_MEANINGS_PT_BR } = await import("../../data/english-questions/word-meanings/pt-BR.js");
  assert.equal(WORD_MEANINGS_PT_PT.travel?.bus, "autocarro");
  assert.equal(WORD_MEANINGS_PT_PT.food?.juice, "sumo");
  assert.equal(WORD_MEANINGS_PT_BR.travel.bus, "ônibus");
  for (const [cat, words] of Object.entries(WORD_MEANINGS_PT_PT)) {
    for (const [id, meaning] of Object.entries(words)) {
      assert.ok(WORD_MEANINGS_PT_BR[cat]?.[id] != null, `orphan ${cat}.${id}`);
      assert.notEqual(meaning, WORD_MEANINGS_PT_BR[cat][id], `identical ${cat}.${id}`);
    }
  }
});
