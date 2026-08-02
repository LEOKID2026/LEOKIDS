/**
 * Austria (de-AT) sparse country layer checks (content-only; no wiring/build).
 * Base authority: de-DE. Fallback planned: de-AT → de-DE → en.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function walkJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

/** @param {unknown} node @param {string} prefix @param {Map<string, string>} map */
function collectStrings(node, prefix = "", map = new Map()) {
  if (typeof node === "string") {
    map.set(prefix, node);
    return map;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectStrings(v, prefix ? `${prefix}.${i}` : String(i), map));
    return map;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      collectStrings(v, prefix ? `${prefix}.${k}` : k, map);
    }
  }
  return map;
}

/** @param {unknown} node @param {string} prefix @param {Map<string, string>} map */
function collectTypedLeaves(node, prefix = "", map = new Map()) {
  if (node === null || typeof node === "boolean" || typeof node === "number" || typeof node === "string") {
    map.set(prefix, typeof node);
    return map;
  }
  if (Array.isArray(node)) {
    map.set(prefix, "array");
    node.forEach((v, i) => collectTypedLeaves(v, `${prefix}.${i}`, map));
    return map;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      collectTypedLeaves(v, prefix ? `${prefix}.${k}` : k, map);
    }
  }
  return map;
}

const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;

test("de-AT locales: JSON parse + sparse key existence vs de-DE", () => {
  const atDir = path.join(ROOT, "locales/de-AT");
  const deDir = path.join(ROOT, "locales/de-DE");
  const files = fs.readdirSync(atDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.length > 0);
  /** @type {string[]} */
  const orphans = [];
  /** @type {string[]} */
  const identical = [];
  /** @type {string[]} */
  const placeholderMismatches = [];
  /** @type {string[]} */
  const typeMismatches = [];

  for (const f of files) {
    const at = JSON.parse(fs.readFileSync(path.join(atDir, f), "utf8"));
    const de = JSON.parse(fs.readFileSync(path.join(deDir, f), "utf8"));
    const atLeaves = collectStrings(at);
    const deLeaves = collectStrings(de);
    const atTypes = collectTypedLeaves(at);
    const deTypes = collectTypedLeaves(de);

    assert.notEqual(atLeaves.size, 0, `${f} must not be empty`);
    assert.ok(atLeaves.size < deLeaves.size, `${f} must be sparse vs de-DE`);

    for (const [key, value] of atLeaves) {
      if (!deLeaves.has(key)) orphans.push(`${f}:${key}`);
      else if (deLeaves.get(key) === value) identical.push(`${f}:${key}`);
      else {
        const aPh = (value.match(PLACEHOLDER_RE) || []).sort().join("|");
        const bPh = ((deLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).sort().join("|");
        if (aPh !== bPh) placeholderMismatches.push(`${f}:${key}`);
      }
    }
    for (const [key, t] of atTypes) {
      if (deTypes.has(key) && deTypes.get(key) !== t) typeMismatches.push(`${f}:${key}`);
    }
  }

  assert.deepEqual(orphans, [], `orphan keys: ${orphans.join(", ")}`);
  assert.deepEqual(identical, [], `identical overrides: ${identical.join(", ")}`);
  assert.deepEqual(placeholderMismatches, [], `placeholder mismatches: ${placeholderMismatches.join(", ")}`);
  assert.deepEqual(typeMismatches, [], `type mismatches: ${typeMismatches.join(", ")}`);
});

test("de-AT content-packs: sparse contract vs de-DE (no full copies)", () => {
  const atRoot = path.join(ROOT, "content-packs/de-AT");
  const deRoot = path.join(ROOT, "content-packs/de-DE");
  const files = walkJson(atRoot).map((p) => path.relative(atRoot, p).replace(/\\/g, "/")).sort();
  assert.ok(files.length > 0);

  /** @type {string[]} */
  const orphans = [];
  /** @type {string[]} */
  const identical = [];
  /** @type {string[]} */
  const fullCopies = [];
  let overrideCount = 0;

  for (const rel of files) {
    const at = JSON.parse(fs.readFileSync(path.join(atRoot, rel), "utf8"));
    const dePath = path.join(deRoot, rel);
    assert.ok(fs.existsSync(dePath), `missing de-DE authority for ${rel}`);
    const de = JSON.parse(fs.readFileSync(dePath, "utf8"));
    const atLeaves = collectStrings(at);
    const deLeaves = collectStrings(de);
    assert.notEqual(atLeaves.size, 0, `${rel} empty`);

    // burn-down-index and dense justified grade-aware packs may cover many keys,
    // but must not be byte-identical full file copies.
    if (JSON.stringify(at) === JSON.stringify(de)) fullCopies.push(rel);

    for (const [key, value] of atLeaves) {
      if (!deLeaves.has(key)) orphans.push(`${rel}:${key}`);
      else if (deLeaves.get(key) === value) identical.push(`${rel}:${key}`);
      else overrideCount += 1;
    }
  }

  assert.deepEqual(fullCopies, [], `full-copy files: ${fullCopies.join(", ")}`);
  assert.deepEqual(orphans, [], `orphan keys: ${orphans.slice(0, 20).join(", ")}`);
  assert.deepEqual(identical, [], `identical overrides: ${identical.slice(0, 20).join(", ")}`);
  assert.ok(overrideCount > 0);
});

test("de-AT grade mapping uses Schulstufe labels", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-AT/common.json"), "utf8"));
  assert.equal(common.grade1, "1. Schulstufe");
  assert.equal(common.grade2, "2. Schulstufe");
  assert.equal(common.grade3, "3. Schulstufe");
  assert.equal(common.grade4, "4. Schulstufe");
  assert.equal(common.grade5, "5. Schulstufe");
  assert.equal(common.grade6, "6. Schulstufe");
  assert.equal(common.gradeLabel, "{grade}. Schulstufe");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-AT/learning.json"), "utf8"));
  assert.equal(learning.master.grades.g1, "1. Schulstufe");
  assert.equal(learning.master.grades.g6, "6. Schulstufe");
  assert.equal(learning.chooseGrade, "Schulstufe wählen");
});

test("de-AT no Volksschule misuse for full 1–6 range; Klasse reserved for physical class where overridden", () => {
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/de-AT")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/de-AT", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/de-AT"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  const joined = blobs.join("\n");
  assert.doesNotMatch(joined, /Volksschule/);
  assert.doesNotMatch(joined, /\bGrundschule/);
  // Grade labels must be Schulstufe, not Klasse
  assert.match(joined, /1\. Schulstufe/);
  assert.doesNotMatch(joined, /"grade1":\s*"1\. Klasse"/);
  assert.doesNotMatch(joined, /"g1":\s*"1\. Klasse"/);
});

test("de-AT du/Sie consistency on child vs adult surfaces", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-AT/learning.json"), "utf8"));
  const childBlob = JSON.stringify(learning);
  assert.match(childBlob, /\bwähle\b/i);
  assert.doesNotMatch(childBlob, /\bwählen Sie\b/);
  assert.doesNotMatch(childBlob, /\bSie\b/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-AT/ui.json"), "utf8"));
  const parentBlob = JSON.stringify(ui.parent);
  assert.match(parentBlob, /wählen Sie/i);
  assert.doesNotMatch(parentBlob, /\bdu\b/);
  assert.doesNotMatch(parentBlob, /\bwähle\b/);

  const worksheets = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-AT/worksheets.json"), "utf8"));
  const wsBlob = JSON.stringify(worksheets);
  assert.match(wsBlob, /Wählen Sie|wählen Sie/);
  assert.doesNotMatch(wsBlob, /\bwähle\b/);
});

test("de-AT Help overlays apply Schulstufe without Volksschule-for-all-six", async () => {
  const { BY_SECTION_DE_AT, ALL_ARTICLES_DE_AT } = await import("../../data/help-center/de-AT/index.js");
  assert.ok(ALL_ARTICLES_DE_AT.length > 10);
  const add = BY_SECTION_DE_AT.parents.find((a) => a.slug === "add-students");
  assert.ok(add);
  assert.match(add.summary, /Schulstufe/);
  const list = add.blocks.find((b) => b.kind === "list");
  assert.deepEqual(list.items, [
    "1. Schulstufe",
    "2. Schulstufe",
    "3. Schulstufe",
    "4. Schulstufe",
    "5. Schulstufe",
    "6. Schulstufe",
  ]);
  const welcome = BY_SECTION_DE_AT.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeText = welcome.blocks.find((b) => b.kind === "paragraph" && /Schulstufe/.test(b.text || "")).text;
  assert.match(welcomeText, /1\. bis zur 6\. Schulstufe/);
  assert.doesNotMatch(welcomeText, /Volksschule/);
  assert.doesNotMatch(welcomeText, /6\. Klasse/);

  const choose = BY_SECTION_DE_AT.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.equal(choose.title, "Ein Fach und eine Schulstufe wählen");
  assert.match(JSON.stringify(choose), /\bWähle\b/);
  assert.doesNotMatch(JSON.stringify(choose), /\bWählen Sie\b/);
});

test("de-AT does not ship word-meanings or science overlay (inherit de-DE)", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/de-AT.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-de-AT-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/de-AT")), false);
});

test("de-AT no Swiss regionalisms in authored overlay strings", () => {
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/de-AT")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/de-AT", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/de-AT"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  const joined = blobs.join("\n");
  assert.doesNotMatch(joined, /\bVelo\b/i);
  assert.doesNotMatch(joined, /\bparkieren\b/i);
  assert.doesNotMatch(joined, /\bZnüni\b/i);
  assert.doesNotMatch(joined, /\bZvieri\b/i);
});

/** Deep-merge sparse overlay onto base (runtime-shaped). */
function deepMerge(base, overlay) {
  if (Array.isArray(overlay)) return overlay.slice();
  if (!overlay || typeof overlay !== "object") return overlay;
  const out = base && typeof base === "object" && !Array.isArray(base) ? { ...base } : {};
  for (const [k, v] of Object.entries(overlay)) {
    if (v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" && !Array.isArray(out[k])) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

const EN_UI_RE =
  /\b(Demo mode|Exit demo|Play time|Try the|Loading |Could not|Purchase|Buy|My cards|You have it|Not enough|Welcome to|Available in|Network error|sign-up|view only)\b/i;

test("de-AT demo merged chrome has no English UI leftovers", () => {
  const de = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-DE/demo/ui.json"), "utf8"));
  const at = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-AT/demo/ui.json"), "utf8"));
  const merged = deepMerge(de, at);
  assert.equal(merged.bar.badge, "Demo-Modus");
  assert.equal(merged.bar.exitDemo, "Demo verlassen");
  assert.equal(merged.bar.playTime, "Spielzeit");
  assert.equal(merged.enter.heading, "Demo-Modus");
  assert.equal(merged.enter.pageTitle, "Demo-Modus — LEO KIDS");
  assert.match(merged.bar.playExpired, /abgelaufen/);
  const leaves = collectStrings(merged);
  /** @type {string[]} */
  const englishHits = [];
  for (const [key, value] of leaves) {
    if (EN_UI_RE.test(value)) englishHits.push(`${key}=${value}`);
  }
  assert.deepEqual(englishHits, [], `demo English chrome: ${englishHits.join(" | ")}`);
});

test("de-AT rewards merged chrome has German shop/cards UI", () => {
  const de = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-DE/rewards/ui.json"), "utf8"));
  const at = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-AT/rewards/ui.json"), "utf8"));
  const merged = deepMerge(de, at);
  assert.equal(merged.shop.alreadyOwned, "Hast du schon!");
  assert.equal(merged.shopView.buy, "Kaufen");
  assert.equal(merged.cardsPage.title, "Meine Karten");
  assert.equal(merged.gradeBands.g12, "Schulstufen 1–2");
  assert.match(merged.shop.purchaseSuccess, /\{name\}/);
  assert.match(merged.shop.coinsLabel, /\{amount\}/);
  const leaves = collectStrings({
    shop: merged.shop,
    shopView: merged.shopView,
    cardsPage: merged.cardsPage,
    surpriseBox: merged.surpriseBox,
    surpriseBoxModal: merged.surpriseBoxModal,
  });
  /** @type {string[]} */
  const englishHits = [];
  for (const [key, value] of leaves) {
    if (EN_UI_RE.test(value) || /\b(You |Buy|Sold |Couldn't|Loading cards)\b/.test(value)) {
      englishHits.push(`${key}=${value}`);
    }
  }
  assert.deepEqual(englishHits, [], `rewards English chrome: ${englishHits.join(" | ")}`);
});

test("de-AT english-page-skills titles: no mash, no broken reinforce, keep English targets", () => {
  const de = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/de-DE/books/english-page-skills.json"), "utf8")
  );
  const at = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/de-AT/books/english-page-skills.json"), "utf8")
  );
  const merged = deepMerge(de, at);
  assert.equal(merged.grades.g3.vocab_body.title, "Der menschliche Körper auf Englisch");
  assert.equal(merged.grades.g4.vocab_school.title, "Schule — Wörter lesen");
  assert.equal(merged.grades.g3.grammar_question_frames.title, "Fragen — 3. Schulstufe");
  assert.equal(merged.grades.g5.grammar_quantifiers.title, "much/many — 5. Schulstufe");
  assert.equal(merged.grades.g2.grammar_be.title, "am / is / are — üben");
  assert.match(merged.grades.g6.grammar_comparatives.description, /the best \/ the most interesting/);
  assert.doesNotMatch(merged.grades.g6.grammar_comparatives.description, /reinforce/);

  const titles = [];
  function walkTitles(node, prefix = "") {
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      const p = prefix ? `${prefix}.${k}` : k;
      if ((k === "title" || k === "description") && typeof v === "string") titles.push([p, v]);
      else if (v && typeof v === "object") walkTitles(v, p);
    }
  }
  walkTitles(merged.grades);
  /** @type {string[]} */
  const mash = [];
  for (const [p, v] of titles) {
    if (/menschlicher Körper|in Englisch|Schülerinnen und Schüler, read|Schulstufe reinforce|Klasse reinforce|\breinforce\b/.test(v)) {
      mash.push(`${p}=${v}`);
    }
  }
  assert.deepEqual(mash, [], `skill title mash: ${mash.join(" | ")}`);
});

test("de-AT accessDenied uses adult/neutral Sie register", async () => {
  // Identical to de-DE after authority chrome sync — sparse overlay omits the key;
  // runtime must still resolve via de-AT → de-DE merge.
  const { loadLocaleBundles, lookupMessage, resetLocaleBundleCache } = await import(
    "../../lib/i18n/load-messages.js"
  );
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("de-AT");
  const accessDenied = lookupMessage(bundles, "common.accessDenied");
  assert.equal(accessDenied, "Sie haben keinen Zugriff auf diese Seite.");
  assert.doesNotMatch(accessDenied, /\bDu\b/);
});
