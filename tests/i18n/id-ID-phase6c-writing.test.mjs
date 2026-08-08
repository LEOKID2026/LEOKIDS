/**
 * Indonesian Master Phase 6C — Writing content (disk modules only; no router wiring).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ENGLISH_WORD_PACKS, ENGLISH_WORD_PACK_IDS_ALL } from "../../data/writing/word-packs.en.js";
import {
  PACK_TITLE_ID_ID,
  COLOR_INSTRUCTION_ID_ID,
  WRITING_WORD_PACK_IDS_ID_ID,
} from "../../data/writing/word-packs.id-ID.js";
import {
  READY_TITLE_EXACT_ID_ID,
  resolveReadyWritingTitleIdId,
} from "../../data/writing/ready-title.id-ID.js";
import { WRITING_SENTENCE_CUES_ID_ID } from "../../data/english-questions/writing-sentence-cues/id-ID.js";
import { listEnglishWorksheetWritingPool } from "../../lib/worksheets/worksheet-english-writing-pool.server.js";
import { buildWritingCatalogItems } from "../../lib/writing/writing-catalog.server.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";

const ROOT = process.cwd();

function collectSentenceKeys() {
  const seen = new Set();
  for (const grade of ["g1", "g2", "g3", "g4", "g5", "g6"]) {
    for (const row of listEnglishWorksheetWritingPool(grade)) {
      if (row.subtype === "word") continue;
      seen.add(row.en);
    }
  }
  return seen;
}

test("Phase 6C: word-pack chrome parity vs EN SoT", () => {
  const enIds = Object.keys(ENGLISH_WORD_PACKS).sort();
  const idIds = Object.keys(PACK_TITLE_ID_ID).sort();
  assert.deepEqual(idIds, enIds);
  assert.deepEqual([...WRITING_WORD_PACK_IDS_ID_ID].sort(), [...ENGLISH_WORD_PACK_IDS_ALL].sort());

  for (const id of enIds) {
    assert.equal(typeof PACK_TITLE_ID_ID[id], "string");
    assert.ok(PACK_TITLE_ID_ID[id].trim(), `empty title ${id}`);
  }

  const enColors = new Set();
  for (const w of ENGLISH_WORD_PACKS.colors.words) {
    if (w.colorInstruction) enColors.add(w.colorInstruction);
  }
  assert.equal(enColors.size, 8);
  for (const en of enColors) {
    assert.ok(COLOR_INSTRUCTION_ID_ID[en], `missing colorInstruction ${en}`);
    assert.ok(String(COLOR_INSTRUCTION_ID_ID[en]).trim());
  }
  assert.equal(Object.keys(COLOR_INSTRUCTION_ID_ID).length, enColors.size);

  // Learning targets unchanged in EN SoT; id-ID module has no text overlays
  assert.equal(ENGLISH_WORD_PACKS.animals.words[0].text, "cat");
  assert.equal(ENGLISH_WORD_PACKS.colors.words[0].text, "red");
});

test("Phase 6C: ready titles localize chrome; letter/number identities preserved", () => {
  assert.equal(resolveReadyWritingTitleIdId("Group A–E"), "Kelompok A–E");
  assert.equal(resolveReadyWritingTitleIdId("Horizontal lines"), "Garis mendatar");
  assert.equal(resolveReadyWritingTitleIdId("Number 7"), "Angka 7");
  assert.equal(resolveReadyWritingTitleIdId("Trace — A"), "Telusuri — A");
  assert.equal(resolveReadyWritingTitleIdId("Twenty — tens"), "Dua puluh — puluhan");
  assert.equal(
    resolveReadyWritingTitleIdId("Words — Colors (Trace)"),
    "Kata — Warna (Telusuri)"
  );
  assert.equal(
    resolveReadyWritingTitleIdId("Words — Sight words (Trace)"),
    "Kata — Kata sering dipakai (Telusuri)"
  );
  assert.equal(
    resolveReadyWritingTitleIdId("Words — CVC (Review)"),
    "Kata — Kata CVC (Ulangan)"
  );

  const catalog = buildWritingCatalogItems({ locale: "en" });
  const unresolved = [];
  for (const item of catalog) {
    const en = String(item.title || item.titleHe || "").trim();
    if (!en) continue;
    const id = resolveReadyWritingTitleIdId(en);
    if (!id.trim()) unresolved.push(en);
    // Pattern leftovers that stay English only if unknown chrome — flag unexplained English UI
    if (id === en) {
      const ok =
        /^Number\s+\d+$/i.test(en) || // should have been localized — fail below if still EN
        /^Trace\s*[—\-–]/.test(en) ||
        /^Words\s*[—\-–]/.test(en) ||
        /—\s*tens$/i.test(en) ||
        READY_TITLE_EXACT_ID_ID[en];
      if (!ok && !/^Trace\s*[—\-–]/.test(en) && id === en) {
        // Exact map miss and no pattern — only OK if title is identity-only (rare)
        if (!READY_TITLE_EXACT_ID_ID[en] && !/^Number\s+\d+$/i.test(en) && !/^Words\s*[—\-–]/.test(en) && !/^Trace\s*[—\-–]/.test(en) && !/tens$/i.test(en)) {
          unresolved.push(`untranslated:${en}`);
        }
      }
    }
  }
  // Every catalog title must resolve to a non-empty Indonesian (or patterned) string different from raw English chrome where expected
  const stillEnglishChrome = [];
  for (const item of catalog) {
    const en = String(item.title || item.titleHe || "").trim();
    const id = resolveReadyWritingTitleIdId(en);
    if (id === en && READY_TITLE_EXACT_ID_ID[en] === undefined) {
      // patterns should have changed Trace/Number/Words/tens
      if (/^(Trace|Number|Words)\b/i.test(en) || /tens$/i.test(en)) {
        stillEnglishChrome.push(en);
      } else if (!READY_TITLE_EXACT_ID_ID[en]) {
        stillEnglishChrome.push(en);
      }
    }
  }
  assert.deepEqual(stillEnglishChrome, [], `untranslated chrome: ${JSON.stringify(stillEnglishChrome.slice(0, 20))}`);
  assert.equal(unresolved.filter((x) => x.startsWith("untranslated:")).length, 0);
});

test("Phase 6C: writing sentence cues cover EN pool; keys stay English", () => {
  const enKeys = collectSentenceKeys();
  assert.equal(enKeys.size, 119);
  assert.equal(Object.keys(WRITING_SENTENCE_CUES_ID_ID).length, 119);
  const missing = [...enKeys].filter((k) => !WRITING_SENTENCE_CUES_ID_ID[k]);
  const orphan = Object.keys(WRITING_SENTENCE_CUES_ID_ID).filter((k) => !enKeys.has(k));
  assert.deepEqual(missing, []);
  assert.deepEqual(orphan, []);
  for (const [en, cue] of Object.entries(WRITING_SENTENCE_CUES_ID_ID)) {
    assert.ok(String(cue).trim(), `empty cue for ${en}`);
    assert.equal(en, en.trim());
  }
});

test("Phase 6C: child register kamu; no Anda/siswa in writing modules", () => {
  const files = [
    "data/writing/word-packs.id-ID.js",
    "data/writing/ready-title.id-ID.js",
    "data/english-questions/writing-sentence-cues/id-ID.js",
  ];
  const blob = files.map((f) => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
  assert.equal(/\bAnda\b/.test(blob), false);
  assert.equal(/\bsiswa\b/i.test(blob), false);
  assert.equal(/peserta didik/i.test(blob), false);
  // color instructions are imperative without kamu pronoun — OK; cues should use kamu
  assert.match(JSON.stringify(WRITING_SENTENCE_CUES_ID_ID), /\bkamu\b/);
});

test("Phase 6C: shared routers resolve id-ID chrome (Phase 7 wiring)", () => {
  const packs = resolveWritingWordPacks("id-ID");
  assert.equal(packs.colors.title, "Warna");
  assert.equal(packs.colors.words[0].colorInstruction, "Warnai merah");
  assert.equal(packs.animals.words[0].text, "cat"); // learning target always EN
});

test("Phase 6C: writing content modules + routers present", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "data/writing/word-packs.id-ID.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "data/writing/ready-title.id-ID.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "data/english-questions/writing-sentence-cues/id-ID.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "data/writing/word-packs.locale.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "data/writing/ready-title.locale.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "data/english-questions/writing-sentence-cues-locale.js")));
});
