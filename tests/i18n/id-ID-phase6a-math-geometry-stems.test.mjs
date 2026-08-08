/**
 * Indonesian Master Phase 6A — native Math + Geometry stem display layer (content only).
 * Does not register into learning-content-en/index.js (MAIN wiring).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { applyIdIdDisplayLayer } from "../../utils/learning-content-id-ID/index.js";
import { rebuildMathStemIdId } from "../../utils/learning-content-id-ID/math.js";
import { rebuildGeometryStemIdId } from "../../utils/learning-content-id-ID/geometry.js";

const ROOT = process.cwd();
const VALIDATE = path.join(ROOT, "artifacts", "id-ID-phase6a", "validate-stems.mjs");

function extractKinds(src) {
  const s = new Set();
  for (const m of src.matchAll(/kind === "([^"]+)"/g)) s.add(m[1]);
  for (const m of src.matchAll(/kind\.includes\("([^"]+)"\)/g)) s.add(m[1]);
  for (const m of src.matchAll(/kind\.startsWith\("([^"]+)"\)/g)) s.add(m[1]);
  return [...s].sort();
}

test("Phase 6A: id-ID math/geometry modules exist with expected exports", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-id-ID/math.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-id-ID/geometry.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-id-ID/index.js")));
  assert.equal(typeof applyIdIdDisplayLayer, "function");
  assert.equal(typeof rebuildMathStemIdId, "function");
  assert.equal(typeof rebuildGeometryStemIdId, "function");
});

test("Phase 6A: kind parity vs English SoT", () => {
  const enMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-en/math.js"), "utf8");
  const idMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/math.js"), "utf8");
  const enGeo = fs.readFileSync(path.join(ROOT, "utils/learning-content-en/geometry.js"), "utf8");
  const idGeo = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/geometry.js"), "utf8");
  assert.deepEqual(extractKinds(idMath), extractKinds(enMath));
  assert.deepEqual(extractKinds(idGeo), extractKinds(enGeo));
});

test("Phase 6A: sample stems are Indonesian; params untouched", () => {
  const mathQ = {
    subject: "math",
    params: { kind: "wp_groups_g2", per: 4, groups: 3 },
    correctAnswer: 12,
  };
  const mathOut = applyIdIdDisplayLayer(mathQ, "math");
  assert.equal(mathOut.correctAnswer, 12);
  assert.deepEqual(mathOut.params, mathQ.params);
  assert.match(String(mathOut.question), /kursi|baris|berapa/i);
  assert.equal(/\b(There are|How many)\b/.test(String(mathOut.question)), false);

  const geoQ = {
    subject: "geometry",
    params: { kind: "rectangle_area", length: 6, width: 2 },
    correctAnswer: 12,
  };
  const geoOut = applyIdIdDisplayLayer(geoQ, "geometry");
  assert.equal(geoOut.correctAnswer, 12);
  assert.deepEqual(geoOut.params, geoQ.params);
  assert.match(String(geoOut.question), /luas|persegi panjang/i);

  const labeled = applyIdIdDisplayLayer(
    {
      subject: "geometry",
      params: { kind: "concept_circle", patternFamily: "radius_diameter" },
      options: ["Parallel", "Perpendicular"],
      correctAnswer: "Parallel",
    },
    "geometry"
  );
  assert.deepEqual(labeled.options, ["Sejajar", "Tegak lurus"]);
  assert.equal(labeled.correctAnswer, "Sejajar");
});

test("Phase 6A: shared display router registers id-ID (Phase 7 wiring)", () => {
  const router = fs.readFileSync(path.join(ROOT, "utils/learning-content-en/index.js"), "utf8");
  assert.equal(/learning-content-id-ID|applyIdIdDisplayLayer/.test(router), true);
});

test("Phase 6A: validate-stems.mjs PASS", () => {
  const r = spawnSync(process.execPath, [VALIDATE], { encoding: "utf8", cwd: ROOT });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /VALIDATION PASS/);
});
