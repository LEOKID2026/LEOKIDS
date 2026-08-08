/**
 * Indonesian Master Phase 2E — namespace completeness vs English SoT.
 * Authority: I18N_NAMESPACES (not a hardcoded count).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { I18N_NAMESPACES } from "../../lib/i18n/load-messages.js";

const ROOT = process.cwd();
const PLACEHOLDER_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;

/**
 * @param {unknown} v
 * @param {string} prefix
 * @param {Map<string, string>} out
 */
function collectStringLeaves(v, prefix, out) {
  if (typeof v === "string") {
    out.set(prefix, v);
    return;
  }
  if (Array.isArray(v)) {
    v.forEach((item, i) => {
      const p = `${prefix}[${i}]`;
      if (typeof item === "string") out.set(p, item);
      else collectStringLeaves(item, p, out);
    });
    return;
  }
  if (v && typeof v === "object") {
    for (const [k, child] of Object.entries(v)) {
      const p = prefix ? `${prefix}.${k}` : k;
      collectStringLeaves(child, p, out);
    }
  }
}

/**
 * @param {string} locale
 * @param {string} ns
 */
function loadLeaves(locale, ns) {
  const file = path.join(ROOT, "locales", locale, `${ns}.json`);
  assert.ok(fs.existsSync(file), `missing ${locale}/${ns}.json`);
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  /** @type {Map<string, string>} */
  const leaves = new Map();
  collectStringLeaves(json, "", leaves);
  return leaves;
}

/**
 * @param {string} s
 */
function placeholders(s) {
  return [...String(s).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort();
}

test("I18N_NAMESPACES authority drives id-ID file coverage", () => {
  assert.ok(Array.isArray(I18N_NAMESPACES) && I18N_NAMESPACES.length > 0);
  for (const ns of I18N_NAMESPACES) {
    assert.ok(
      fs.existsSync(path.join(ROOT, "locales", "id-ID", `${ns}.json`)),
      `id-ID missing ${ns}.json`
    );
  }
});

test("every id-ID namespace matches English string-leaf keys, placeholders, non-empty", () => {
  /** @type {Record<string, { en: number, id: number, missing: string[], extra: string[], empty: string[], ph: string[] }>} */
  const report = {};
  let enTotal = 0;
  let idTotal = 0;
  let missingGlobal = 0;
  let extraGlobal = 0;
  let emptyGlobal = 0;
  let phGlobal = 0;

  for (const ns of I18N_NAMESPACES) {
    const en = loadLeaves("en", ns);
    const id = loadLeaves("id-ID", ns);
    const missing = [...en.keys()].filter((k) => !id.has(k));
    const extra = [...id.keys()].filter((k) => !en.has(k));
    /** @type {string[]} */
    const empty = [];
    /** @type {string[]} */
    const ph = [];
    for (const [k, enVal] of en) {
      const idVal = id.get(k);
      if (idVal === undefined) continue;
      if (!String(idVal).trim()) empty.push(k);
      const enPh = placeholders(enVal).join(",");
      const idPh = placeholders(idVal).join(",");
      if (enPh !== idPh) ph.push(`${k}: en[${enPh}] id[${idPh}]`);
    }
    report[ns] = {
      en: en.size,
      id: id.size,
      missing,
      extra,
      empty,
      ph,
    };
    enTotal += en.size;
    idTotal += id.size;
    missingGlobal += missing.length;
    extraGlobal += extra.length;
    emptyGlobal += empty.length;
    phGlobal += ph.length;

    assert.equal(id.size, en.size, `${ns} leaf count`);
    assert.deepEqual(missing, [], `${ns} missing keys`);
    assert.deepEqual(extra, [], `${ns} extra keys`);
    assert.deepEqual(empty, [], `${ns} empty leaves`);
    assert.deepEqual(ph, [], `${ns} placeholder mismatches`);
  }

  assert.equal(missingGlobal, 0);
  assert.equal(extraGlobal, 0);
  assert.equal(emptyGlobal, 0);
  assert.equal(phGlobal, 0);
  assert.equal(idTotal, enTotal);
  console.log(
    JSON.stringify(
      {
        authorityCount: I18N_NAMESPACES.length,
        enTotal,
        idTotal,
        perNamespace: Object.fromEntries(
          Object.entries(report).map(([ns, r]) => [ns, { en: r.en, id: r.id }])
        ),
      },
      null,
      2
    )
  );
});

/** Phase 2C adult-portal subset — leaf totals follow current EN SoT (not a frozen count). */
const PHASE2C_NAMESPACES = ["reports", "emails", "legal", "teacher", "school", "copilot"];

test("Phase 2C subset: exact EN/id-ID key parity (no frozen leaf total)", () => {
  let enTotal = 0;
  let idTotal = 0;
  let missingGlobal = 0;
  let extraGlobal = 0;
  let emptyGlobal = 0;
  let phGlobal = 0;
  /** @type {Record<string, { en: number, id: number }>} */
  const perNamespace = {};

  for (const ns of PHASE2C_NAMESPACES) {
    const en = loadLeaves("en", ns);
    const id = loadLeaves("id-ID", ns);
    const missing = [...en.keys()].filter((k) => !id.has(k));
    const extra = [...id.keys()].filter((k) => !en.has(k));
    /** @type {string[]} */
    const empty = [];
    /** @type {string[]} */
    const ph = [];
    for (const [k, enVal] of en) {
      const idVal = id.get(k);
      if (idVal === undefined) continue;
      if (!String(idVal).trim()) empty.push(k);
      const enPh = placeholders(enVal).join(",");
      const idPh = placeholders(idVal).join(",");
      if (enPh !== idPh) ph.push(`${k}: en[${enPh}] id[${idPh}]`);
    }
    perNamespace[ns] = { en: en.size, id: id.size };
    enTotal += en.size;
    idTotal += id.size;
    missingGlobal += missing.length;
    extraGlobal += extra.length;
    emptyGlobal += empty.length;
    phGlobal += ph.length;

    assert.ok(en.size > 0, `${ns}: EN authority must be non-empty`);
    assert.equal(id.size, en.size, `${ns} leaf count vs EN`);
    assert.deepEqual(missing, [], `${ns} missing keys`);
    assert.deepEqual(extra, [], `${ns} extra keys`);
    assert.deepEqual(empty, [], `${ns} empty leaves`);
    assert.deepEqual(ph, [], `${ns} placeholder mismatches`);
  }

  assert.equal(missingGlobal, 0);
  assert.equal(extraGlobal, 0);
  assert.equal(emptyGlobal, 0);
  assert.equal(phGlobal, 0);
  assert.equal(idTotal, enTotal);
  console.log(
    JSON.stringify(
      {
        phase2cAuthority: "locales/en/{ns}.json string leaves",
        enTotal,
        idTotal,
        perNamespace,
      },
      null,
      2
    )
  );
});

test("seo namespace: exact EN/id-ID key parity", () => {
  const en = loadLeaves("en", "seo");
  const id = loadLeaves("id-ID", "seo");
  const missing = [...en.keys()].filter((k) => !id.has(k));
  const extra = [...id.keys()].filter((k) => !en.has(k));
  /** @type {string[]} */
  const empty = [];
  /** @type {string[]} */
  const ph = [];
  for (const [k, enVal] of en) {
    const idVal = id.get(k);
    if (idVal === undefined) continue;
    if (!String(idVal).trim()) empty.push(k);
    const enPh = placeholders(enVal).join(",");
    const idPh = placeholders(idVal).join(",");
    if (enPh !== idPh) ph.push(`${k}: en[${enPh}] id[${idPh}]`);
  }
  assert.ok(en.size > 0, "seo EN authority must be non-empty");
  assert.equal(id.size, en.size);
  assert.deepEqual(missing, [], "seo missing");
  assert.deepEqual(extra, [], "seo extra");
  assert.deepEqual(empty, [], "seo empty");
  assert.deepEqual(ph, [], "seo placeholders");
  assert.deepEqual([...en.keys()].sort(), [...id.keys()].sort());
});
