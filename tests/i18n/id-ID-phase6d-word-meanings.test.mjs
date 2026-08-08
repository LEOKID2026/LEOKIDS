/**
 * Content-only validation for Indonesian English Word Meanings (Phase 6D).
 * Does NOT require word-meanings-locale.js registration.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { WORD_MEANINGS_ID_ID } from "../../data/english-questions/word-meanings/id-ID.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ROUTER = path.join(ROOT, "data/english-questions/word-meanings-locale.js");

/** Loanwords / identical forms commonly used as Indonesian. */
const INTENTIONAL_SAME = new Set([
  "zebra",
  "penguin",
  "pizza",
  "yoga",
  "hotel",
  "wifi",
  "bluetooth",
  "internet",
  "email",
  "video",
  "robot",
  "tablet",
  "laptop",
  "pasta",
  "flu",
  "judo",
  "karate",
  "golf",
  "bus",
  "oven",
  "toilet",
  "museum",
  "supermarket",
  "bank",
  "cafe",
  "piano",
  "film",
  "tsunami",
  "planet",
  "program",
  "printer",
  "folder",
  "sofa",
  "salad",
]);

function packPairs(pack) {
  /** @type {{ list: string, lemma: string, meaning: string }[]} */
  const out = [];
  for (const [list, map] of Object.entries(pack || {})) {
    for (const [lemma, meaning] of Object.entries(map || {})) {
      out.push({ list, lemma, meaning: String(meaning ?? "") });
    }
  }
  return out;
}

describe("id-ID Phase 6D English word meanings", () => {
  const canon = packPairs(WORD_LISTS);
  const id = packPairs(WORD_MEANINGS_ID_ID);
  const canonKeys = new Set(canon.map((p) => `${p.list}|${p.lemma}`));
  const idKeys = new Set(id.map((p) => `${p.list}|${p.lemma}`));

  it("matches WORD_LISTS entry and list parity", () => {
    assert.equal(Object.keys(WORD_LISTS).length, 21);
    assert.equal(Object.keys(WORD_MEANINGS_ID_ID).length, 21);
    assert.equal(canon.length, 745);
    assert.equal(id.length, 745);
  });

  it("has zero missing/extra/duplicate list-lemma pairs", () => {
    const missing = [...canonKeys].filter((k) => !idKeys.has(k));
    const extra = [...idKeys].filter((k) => !canonKeys.has(k));
    const seen = new Set();
    const dups = [];
    for (const p of id) {
      const k = `${p.list}|${p.lemma}`;
      if (seen.has(k)) dups.push(k);
      else seen.add(k);
    }
    assert.deepEqual(missing, []);
    assert.deepEqual(extra, []);
    assert.deepEqual(dups, []);
  });

  it("has no empty meanings", () => {
    const empty = id.filter((p) => !p.meaning.trim()).map((p) => `${p.list}|${p.lemma}`);
    assert.deepEqual(empty, []);
  });

  it("keeps English lemmas as keys and avoids untranslated English definitions", () => {
    const untranslated = [];
    for (const p of id) {
      const mm = p.meaning.trim();
      const same = mm === p.lemma || mm === p.lemma.replace(/_/g, " ");
      if (same && !INTENTIONAL_SAME.has(p.lemma)) {
        untranslated.push(`${p.list}|${p.lemma}=${mm}`);
      }
    }
    assert.deepEqual(untranslated, []);
  });

  it("preserves sense distinctions for ambiguous lemmas", () => {
    assert.equal(WORD_MEANINGS_ID_ID.colors.orange, "oranye");
    assert.equal(WORD_MEANINGS_ID_ID.food.orange, "jeruk");
    assert.equal(WORD_MEANINGS_ID_ID.animals.mouse, "tikus");
    assert.match(WORD_MEANINGS_ID_ID.technology.mouse, /mouse/i);
    assert.equal(WORD_MEANINGS_ID_ID.weather.cold, "dingin");
    assert.equal(WORD_MEANINGS_ID_ID.health.cold, "pilek");
  });

  it("registers id-ID in the shared locale router (Phase 7 wiring)", () => {
    const src = fs.readFileSync(ROUTER, "utf8");
    assert.equal(src.includes("WORD_MEANINGS_ID_ID"), true);
    assert.equal(/["']id-ID["']/.test(src), true);
  });
});
