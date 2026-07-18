/**
 * Selftest: number_sense and decimals question display fix
 * Verifies no duplicate blank placeholder (= __) in student-facing stems.
 */
import { generateQuestion } from "../utils/math-question-generator.js";
import { getLevelConfig } from "../utils/math-storage.js";

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(`FAIL: ${message}`);
    console.error(`FAIL: ${message}`);
  }
}

const DUPLICATE_BLANK = /= __\s*$/;
const PLACEHOLDER_ONLY = /^__$/;

for (const grade of ["g3", "g4", "g5", "g6"]) {
  for (const level of ["easy", "medium", "hard"]) {
    const lc = getLevelConfig(level, grade);
    let foundNeighbors = false;
    for (let i = 0; i < 30; i++) {
      globalThis.__LIOSH_MATH_FORCE = "ns_neighbors";
      const q = generateQuestion(lc, "number_sense", grade);
      globalThis.__LIOSH_MATH_FORCE = "";
      if (q.params?.kind !== "ns_neighbors") continue;
      foundNeighbors = true;

      assert(q.question !== "__" && !PLACEHOLDER_ONLY.test(String(q.question)), `${grade}/${level}/ns_neighbors: placeholder stem "${q.question}"`);
      assert(!DUPLICATE_BLANK.test(String(q.question)), `${grade}/${level}/ns_neighbors: duplicate blank in "${q.question}"`);
      assert(String(q.question).includes(String(q.params.n)), `${grade}/${level}/ns_neighbors: stem missing n=${q.params.n}`);

      const expectedAnswer = q.params.dir === "after" ? q.params.n + 1 : q.params.n - 1;
      assert(Number(q.correctAnswer) === expectedAnswer, `${grade}/${level}/ns_neighbors: answer ${q.correctAnswer} != ${expectedAnswer}`);
      assert(
        Array.isArray(q.answers) && q.answers.map(String).includes(String(q.correctAnswer)),
        `${grade}/${level}/ns_neighbors: correctAnswer not in options`,
      );
      break;
    }
    assert(foundNeighbors, `${grade}/${level}: ns_neighbors not generated in 30 tries`);
  }
}

for (const grade of ["g4", "g5", "g6"]) {
  for (const level of ["easy", "medium", "hard"]) {
    const lc = getLevelConfig(level, grade);
    let foundCompare = false;
    for (let i = 0; i < 40; i++) {
      globalThis.__LIOSH_MATH_FORCE = "dec_compare_max";
      const q = generateQuestion(lc, "decimals", grade);
      globalThis.__LIOSH_MATH_FORCE = "";
      if (q.params?.kind !== "dec_compare_max") continue;
      foundCompare = true;
      assert(!String(q.question).includes("= __"), `${grade}/${level}/dec_compare_max: duplicate blank`);
      assert(!/\b__\b/.test(String(q.question)), `${grade}/${level}/dec_compare_max: raw blank token in stem`);
      break;
    }
    assert(foundCompare, `${grade}/${level}: dec_compare_max not generated`);
  }
}

console.log(`\nnumber-sense-decimals-display-selftest: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  for (const f of failures) console.error(f);
  process.exit(1);
}
