/**
 * Content-only parity for Indonesian Help + Public SEO overlays (Phase 2D).
 * Does NOT require global Help / SEO client-index registration.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { PARENT_ARTICLES } from "../../data/help-center/content/parents.js";
import { STUDENT_ARTICLES } from "../../data/help-center/content/students.js";
import { PARENT_REPORT_ARTICLES } from "../../data/help-center/content/parent-report.js";
import { SUBJECT_ARTICLES } from "../../data/help-center/content/subjects.js";
import {
  ALL_ARTICLES_ID_ID,
  SECTIONS_ID_ID,
} from "../../data/help-center/id-ID/index.js";
import { GUIDE_SLUGS } from "../../data/seo/guide-pages.js";
import { PRACTICE_SLUGS } from "../../data/seo/practice-pages.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SEO_ROOT = path.join(ROOT, "content-packs/id-ID/public-seo");

const EN_HELP = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];

function emptyLeaves(value, p = "", out = []) {
  if (typeof value === "string") {
    if (!value.trim()) out.push(p || "(root)");
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((x, i) => emptyLeaves(x, `${p}[${i}]`, out));
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) emptyLeaves(v, p ? `${p}.${k}` : k, out);
  }
  return out;
}

describe("id-ID Phase 2D Help + Public SEO content", () => {
  it("has Help section and article parity with English", () => {
    assert.equal(Object.keys(SECTIONS_ID_ID).length, 4);
    assert.equal(ALL_ARTICLES_ID_ID.length, 40);
    assert.equal(EN_HELP.length, 40);
    const en = EN_HELP.map((a) => `${a.section}/${a.slug}`).sort();
    const id = ALL_ARTICLES_ID_ID.map((a) => `${a.section}/${a.slug}`).sort();
    assert.deepEqual(id, en);
  });

  it("has no empty Help fields and Indonesian welcome title", () => {
    assert.equal(emptyLeaves(ALL_ARTICLES_ID_ID).length, 0);
    assert.equal(emptyLeaves(SECTIONS_ID_ID).length, 0);
    const welcome = ALL_ARTICLES_ID_ID.find(
      (a) => a.section === "parents" && a.slug === "welcome-and-overview"
    );
    assert.ok(welcome);
    assert.match(welcome.title, /orang tua|panduan/i);
    assert.doesNotMatch(welcome.title, /Welcome to the parent guide/);
    assert.match(SECTIONS_ID_ID.parents.title, /orang tua/i);
  });

  it("creates full Public SEO overlay set on disk", () => {
    const expected = [
      ...GUIDE_SLUGS.map((s) => `guides/${s}.json`),
      "guides/hub-cards.json",
      ...PRACTICE_SLUGS.map((s) => `practice/${s}.json`),
      "practice/hub-cards.json",
      "practice/worksheets.json",
      "marketing/kids.json",
      "marketing/parents.json",
      "marketing/teachers.json",
      "marketing/schools.json",
      "legal/unified.json",
    ];
    for (const rel of expected) {
      const full = path.join(SEO_ROOT, rel);
      assert.ok(fs.existsSync(full), `missing ${rel}`);
      const json = JSON.parse(fs.readFileSync(full, "utf8"));
      assert.equal(emptyLeaves(json).length, 0, `empty leaves in ${rel}`);
    }
  });

  it("uses Kelas bands and not Fase labels in practice English overlay", () => {
    const enPage = JSON.parse(
      fs.readFileSync(path.join(SEO_ROOT, "practice/english.json"), "utf8")
    );
    assert.match(enPage.h1, /Bahasa Inggris/i);
    assert.match(enPage.badge, /Kelas 1–6|Kelas 1-6/);
    const blob = JSON.stringify(enPage);
    assert.equal(/\bFase [ABC]\b/.test(blob), false);
    assert.equal(/\bGrade\s*[1-6]\b/.test(blob), false);
  });
});
