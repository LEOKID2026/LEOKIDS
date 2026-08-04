/**
 * Unit integrity for ar-001 visible-English auditor.
 * Run: node --test tests/unit/ar-001-english-audit.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  auditVisibleEnglish,
  assertArabicDocumentShell,
} from "../e2e/helpers/ar-001-english-audit-core.mjs";

test("auditVisibleEnglish fails on English chrome phrases", () => {
  const hits = auditVisibleEnglish("مرحبا Loading... Back to dashboard");
  assert.ok(hits.some((h) => h.includes("Loading")));
  assert.ok(hits.some((h) => h.includes("Back to dashboard")));
});

test("auditVisibleEnglish fails on raw dotted keys", () => {
  const hits = auditVisibleEnglish("حدث خطأ ui.cards.shop.title");
  assert.ok(hits.some((h) => h.startsWith("rawKey:ui.cards.shop.title")), hits.join(","));
});

test("auditVisibleEnglish fails on raw snake_case keys", () => {
  const hits = auditVisibleEnglish("waiting_for_the_teacher");
  assert.ok(hits.some((h) => h.startsWith("rawKey:waiting_for_the_teacher")), hits.join(","));
});

test("auditVisibleEnglish fails on English chrome words", () => {
  const hits = auditVisibleEnglish("Dashboard Settings Profile");
  assert.ok(hits.some((h) => h.startsWith("word:")), hits.join(","));
});

test("auditVisibleEnglish allows Arabic-only chrome", () => {
  const hits = auditVisibleEnglish("لوحة التحكم · المتجر · صندوق المفاجأة");
  assert.deepEqual(hits, []);
});

test("assertArabicDocumentShell requires ar-001 + rtl", () => {
  assert.deepEqual(assertArabicDocumentShell("ar-001", "rtl"), []);
  assert.ok(assertArabicDocumentShell("en", "ltr").length > 0);
});
