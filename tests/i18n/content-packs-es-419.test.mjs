/**
 * es-419 content-pack structure parity, JSON validity, and catalog Spanish smoke.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";
import { CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

function listJsonRelative(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const fp = path.join(p, ent.name);
      if (ent.isDirectory()) walk(fp);
      else if (ent.name.endsWith(".json")) {
        out.push(path.relative(dir, fp).split(path.sep).join("/"));
      }
    }
  })(dir);
  return out.sort();
}

test("es-419 content-pack domains mirror en relative paths", () => {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const domain of DOMAINS) {
    const en = listJsonRelative(path.join(root, "content-packs", "en", domain));
    const es = listJsonRelative(path.join(root, "content-packs", "es-419", domain));
    counts[domain] = es.length;
    assert.deepEqual(
      es,
      en,
      `path mismatch in ${domain}: en=${en.length} es=${es.length}`,
    );
  }
  assert.equal(counts.learning, 59);
  assert.equal(counts.reports, 41);
  assert.equal(counts.games, 148);
  assert.equal(counts.books, 3);
  assert.equal(counts.rewards, 2);
  assert.equal(counts["global-burn-down"], 142);
  assert.equal(counts.demo, 1);
});

test("all es-419 content-pack JSON files parse", () => {
  let parsed = 0;
  for (const domain of DOMAINS) {
    const base = path.join(root, "content-packs", "es-419", domain);
    for (const rel of listJsonRelative(base)) {
      const abs = path.join(base, rel);
      const text = fs.readFileSync(abs, "utf8");
      const json = JSON.parse(text);
      assert.ok(json !== null && typeof json === "object");
      parsed += 1;
    }
  }
  assert.equal(parsed, 59 + 41 + 148 + 3 + 2 + 142 + 1);
});

test("pack catalog registers the same relative keys for en and es-419", () => {
  const enKeys = Object.keys(CONTENT_PACK_CATALOG.en).sort();
  const esKeys = Object.keys(CONTENT_PACK_CATALOG["es-419"] || {}).sort();
  assert.deepEqual(esKeys, enKeys);
  assert.equal(enKeys.length, 28);
});

test("catalog es-419 diagnostic addition label is Spanish", () => {
  const pack = resolveRegisteredContentPack("es-419", "learning", "diagnostic-labels.json");
  assert.equal(pack?.operations?.addition, "Suma");
});
