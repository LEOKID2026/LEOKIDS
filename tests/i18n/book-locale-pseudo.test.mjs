import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  bookUiCopyForLocale,
  getLearningBookSubjectLabelCopy,
  resolveBookTitleKey,
  resolveEnglishSkillCopy,
  resolveRegistryTitleKey,
  resolveSectionDisplayTitle,
} from "../../lib/learning-book/book-pack-copy.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("book content pack validator passes", () => {
  const out = execFileSync("node", ["scripts/i18n/validate-book-content-packs.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.match(out, /Books UI=0/);
});

describe("book pseudo locales", () => {
  for (const locale of ["en", "en-XA", "ar-XB"]) {
    test(`shell navigation copy @ ${locale}`, () => {
      const text = bookUiCopyForLocale(locale, "shell", "previousPage");
      assert.ok(text);
      if (locale === "en-XA") assert.match(text, /^\[\[\[/);
      if (locale === "ar-XB") assert.equal(text.charCodeAt(0), 0x202b);
    });

    test(`subject + book title @ ${locale}`, () => {
      const subject = getLearningBookSubjectLabelCopy("geometry", locale);
      const bookTitle = resolveBookTitleKey("geometry.g1.bookTitle", locale);
      assert.ok(subject);
      assert.ok(bookTitle);
    });

    test(`registry batch title @ ${locale}`, () => {
      const title = resolveRegistryTitleKey("math.g1.a", locale);
      assert.ok(title);
    });

    test(`section display title @ ${locale}`, () => {
      const title = resolveSectionDisplayTitle("What are we learning?", locale);
      assert.ok(title);
    });
  }
});

test("english skill doNotTranslate fields skip pseudo locale", () => {
  const description = resolveEnglishSkillCopy("g1", "letters_upper", "description", "ar-XB");
  assert.match(description, /A–Z/);
  assert.doesNotMatch(description, /^\u202b/);
});
