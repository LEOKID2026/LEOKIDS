import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ALL_ARTICLES,
  ALL_ARTICLES_ES_419,
  getArticle,
  getHelpSections,
  listArticles,
  resolveHelpLocale,
} from "../../data/help-center/index.js";

const HEBREW_RE = /[\u0590-\u05FF]/;
const VOS_RE = /\b(vos|vosotros|vosotras|vais|estáis|sois)\b/i;

function collectStrings(value, out = []) {
  if (typeof value === "string") {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectStrings(v, out);
  }
  return out;
}

describe("Help Center es-419", () => {
  it("resolves locale and sections", () => {
    assert.equal(resolveHelpLocale("es-419"), "es-419");
    assert.equal(resolveHelpLocale("es-MX"), "es-419");
    assert.equal(resolveHelpLocale("es-ES"), "es-ES");
    assert.equal(resolveHelpLocale("en"), "en");
    assert.match(getHelpSections("es-419").parents.title, /padres/i);
    assert.match(getHelpSections("en").parents.title, /parents/i);
  });

  it("keeps slug parity with English", () => {
    const en = ALL_ARTICLES.map((a) => `${a.section}/${a.slug}`).sort();
    const es = ALL_ARTICLES_ES_419.map((a) => `${a.section}/${a.slug}`).sort();
    assert.deepEqual(es, en);
  });

  it("returns Spanish article bodies for es-419", () => {
    const article = getArticle("parents", "welcome-and-overview", "es-419");
    assert.ok(article);
    assert.match(article.title, /Bienvenida|guía|padres/i);
    assert.doesNotMatch(article.title, /Welcome to the parent guide/);
  });

  it("has no Hebrew and no vos/vosotros in es-419 help content", () => {
    const strings = collectStrings(ALL_ARTICLES_ES_419);
    for (const s of strings) {
      assert.equal(HEBREW_RE.test(s), false, `Hebrew in: ${s.slice(0, 80)}`);
      assert.equal(VOS_RE.test(s), false, `vos form in: ${s.slice(0, 80)}`);
    }
  });

  it("lists the same article count per section", () => {
    for (const section of ["parents", "students", "parent-report", "subjects"]) {
      assert.equal(listArticles(section, "es-419").length, listArticles(section, "en").length);
    }
  });
});
