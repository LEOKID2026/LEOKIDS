/**
 * Content-only validation for Indonesian learning packs (Phase 4D).
 * Does NOT require pack-catalog registration.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EN_ROOT = path.join(ROOT, "content-packs/en/learning");
const ID_ROOT = path.join(ROOT, "content-packs/id-ID/learning");

function walkFiles(dir, base = "") {
  let out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = (base ? `${base}/${ent.name}` : ent.name).replace(/\\/g, "/");
    if (ent.isDirectory()) out = out.concat(walkFiles(path.join(dir, ent.name), rel));
    else if (ent.name.endsWith(".json")) out.push(rel);
  }
  return out.sort();
}

function placeholders(s) {
  return (String(s).match(/\{[a-zA-Z0-9_]+\}/g) || []).sort().join(",");
}

function emptyLeaves(v, p = "", out = []) {
  if (typeof v === "string") {
    if (!v.trim()) out.push(p);
    return out;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => emptyLeaves(x, `${p}[${i}]`, out));
    return out;
  }
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) emptyLeaves(x, p ? `${p}.${k}` : k, out);
  }
  return out;
}

function keyPaths(v, out = new Set(), p = "") {
  if (Array.isArray(v)) {
    v.forEach((x) => keyPaths(x, out, `${p}[]`));
    return out;
  }
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      out.add(p ? `${p}.${k}` : k);
      keyPaths(x, out, p ? `${p}.${k}` : k);
    }
  }
  return out;
}

describe("id-ID Phase 4D learning content packs", () => {
  const enFiles = walkFiles(EN_ROOT);
  const idFiles = walkFiles(ID_ROOT);

  it("has exact file parity with English learning packs", () => {
    assert.equal(enFiles.length, 59);
    assert.deepEqual(idFiles, enFiles);
  });

  it("preserves key shapes, placeholders, and non-empty leaves", () => {
    let ph = 0;
    for (const rel of enFiles) {
      const en = JSON.parse(fs.readFileSync(path.join(EN_ROOT, rel), "utf8"));
      const id = JSON.parse(fs.readFileSync(path.join(ID_ROOT, rel), "utf8"));
      assert.deepEqual([...keyPaths(id)].sort(), [...keyPaths(en)].sort(), rel);
      assert.equal(emptyLeaves(id).length, 0, rel);
      const walk = (a, b) => {
        if (typeof a === "string" && typeof b === "string") {
          if (placeholders(a) !== placeholders(b)) ph++;
          return;
        }
        if (Array.isArray(a) && Array.isArray(b)) a.forEach((x, i) => walk(x, b[i]));
        else if (a && typeof a === "object" && b && typeof b === "object") {
          for (const k of Object.keys(a)) walk(a[k], b[k]);
        }
      };
      walk(en, id);
    }
    assert.equal(ph, 0);
  });

  it("keeps taxonomy structure IDs and thresholds unchanged", () => {
    for (const rel of [
      "taxonomy/math.structure.json",
      "taxonomy/geometry.structure.json",
      "taxonomy/english.structure.json",
      "taxonomy/science.structure.json",
    ]) {
      const en = JSON.parse(fs.readFileSync(path.join(EN_ROOT, rel), "utf8"));
      const id = JSON.parse(fs.readFileSync(path.join(ID_ROOT, rel), "utf8"));
      assert.deepEqual(id, en);
    }
  });

  it("translates diagnostic display labels while keeping operation keys", () => {
    const en = JSON.parse(fs.readFileSync(path.join(EN_ROOT, "diagnostic-labels.json"), "utf8"));
    const id = JSON.parse(fs.readFileSync(path.join(ID_ROOT, "diagnostic-labels.json"), "utf8"));
    assert.deepEqual(Object.keys(id.operations), Object.keys(en.operations));
    assert.notEqual(id.operations.addition, en.operations.addition);
    assert.match(id.operations.addition, /Penjumlahan/i);
    assert.equal(/\bFase [ABC]\b/.test(JSON.stringify(id)), false);
    assert.equal(/\bGrade\s*[1-6]\b/.test(JSON.stringify(id)), false);
  });

  it("retains intentional English teaching sentences in learning-content-en", () => {
    const id = JSON.parse(
      fs.readFileSync(
        path.join(ID_ROOT, "burn-down/utils__learning-content-en__english.json"),
        "utf8"
      )
    );
    assert.equal(id.copy.with_i_we_use_am, "With I we use am.");
    assert.match(id.copy.got_it, /Mengerti|Paham|Oke|Sudah/i);
  });
});
