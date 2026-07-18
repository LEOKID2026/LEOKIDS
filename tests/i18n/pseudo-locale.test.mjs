import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { createTranslator } from "../../lib/i18n/create-translator.js";
import {
  applyPseudoLong,
  applyPseudoRtl,
  formatMessage,
} from "../../lib/i18n/message-format.js";
import {
  isPseudoLongLocale,
  isPseudoRtlLocale,
  resolveDirection,
} from "../../lib/i18n/locale-registry.js";

describe("en-XA pseudo long strings", () => {
  test("applyPseudoLong wraps text for layout stress testing", () => {
    assert.equal(applyPseudoLong("Save"), "[[[ Save ~~~ Save ]]]");
    assert.equal(applyPseudoLong(""), "");
  });

  test("createTranslator applies pseudo-long expansion for en-XA", () => {
    const { t, locale } = createTranslator("en-XA");
    assert.equal(locale, "en-XA");
    assert.equal(resolveDirection(locale), "ltr");
    const out = t("common.save");
    assert.match(out, /^\[\[\[/);
    assert.match(out, /Save/);
    assert.match(out, /~~~/);
  });

  test("formatMessage runs before pseudo-long expansion", () => {
    const { t } = createTranslator("en-XA");
    const out = t("common.gradeLabel", { grade: "3" });
    assert.match(out, /Grade 3/);
    assert.match(out, /^\[\[\[/);
  });
});

describe("ar-XB pseudo RTL", () => {
  test("applyPseudoRtl wraps with RLE/PDF isolates", () => {
    const out = applyPseudoRtl("Continue");
    assert.equal(out, `\u202BContinue\u202C`);
  });

  test("createTranslator applies pseudo-rtl markers for ar-XB", () => {
    const { t, locale } = createTranslator("ar-XB");
    assert.equal(locale, "ar-XB");
    assert.equal(isPseudoRtlLocale(locale), true);
    assert.equal(resolveDirection(locale), "rtl");
    const out = t("common.continue");
    assert.equal(out.charCodeAt(0), 0x202b);
    assert.ok(out.includes("Continue"));
    assert.equal(out.charCodeAt(out.length - 1), 0x202c);
  });

  test("en-XA is not pseudo-rtl", () => {
    assert.equal(isPseudoLongLocale("en-XA"), true);
    assert.equal(isPseudoRtlLocale("en-XA"), false);
  });
});
