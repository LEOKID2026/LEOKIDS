/**
 * Indonesian Master Phase 9B-5 — validation.api reconciliation + final leakage gate.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "path";
import { resolveApiErrorMessage } from "../../lib/api/resolve-api-error-message.js";
import { mapParentApiFailurePayload } from "../../lib/parent-client/parent-api-errors.js";
import { resolveStudentApiErrorMessage } from "../../lib/student-client/student-api-legacy-errors.js";
import { apiErrorMessageHe, bindPlatformDisplayLocale } from "../../lib/platform-ui/display-labels.js";
import { lookupMessage, loadLocaleBundles, resetLocaleBundleCache } from "../../lib/i18n/load-messages.js";

const ROOT = process.cwd();
const PARENT_REQ = JSON.parse(
  fs.readFileSync(path.join(ROOT, "artifacts/id-ID-phase9b2/new-code-mappings-required.json"), "utf8")
);
const STUDENT_REQ = JSON.parse(
  fs.readFileSync(path.join(ROOT, "artifacts/id-ID-phase9b3/new-code-mappings-required.json"), "utf8")
).mappings;
const TEACHER_REQ = JSON.parse(
  fs.readFileSync(path.join(ROOT, "artifacts/id-ID-phase9b4/new-code-mappings-required.json"), "utf8")
);

function ph(s) {
  return [...String(s).matchAll(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g)].map((m) => m[0]).sort().join(",");
}

test("9B-5 validation.api EN/ID parity after reconciliation", () => {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/validation.json"), "utf8"));
  const id = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/id-ID/validation.json"), "utf8"));
  const ek = Object.keys(en.api).sort();
  const ik = Object.keys(id.api).sort();
  assert.equal(ek.length, 116);
  assert.equal(ik.length, 116);
  assert.deepEqual(ek, ik);
  let empty = 0;
  let mism = 0;
  for (const k of ek) {
    if (!String(en.api[k] || "").trim() || !String(id.api[k] || "").trim()) empty += 1;
    if (ph(en.api[k]) !== ph(id.api[k])) mism += 1;
  }
  assert.equal(empty, 0);
  assert.equal(mism, 0);
});

test("9B-5 parent+student requested codes are unique and present in validation.api", () => {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/validation.json"), "utf8"));
  const parentCodes = PARENT_REQ.map((x) => x.code);
  const studentCodes = STUDENT_REQ.map((x) => x.code);
  assert.equal(parentCodes.length, 27);
  assert.equal(studentCodes.length, 12);
  assert.equal(Array.isArray(TEACHER_REQ) ? TEACHER_REQ.length : 0, 0);
  const cross = parentCodes.filter((c) => studentCodes.includes(c));
  assert.deepEqual(cross, []);
  for (const c of [...parentCodes, ...studentCodes]) {
    assert.ok(en.api[c], `missing validation.api.${c}`);
  }
});

test("9B-5 resolveApiErrorMessage: mapped code beats English message; unknown → fallback", async () => {
  resetLocaleBundleCache();
  const bundles = await loadLocaleBundles("id-ID");
  const t = (key) => lookupMessage(bundles, key) ?? key;
  const mapped = resolveApiErrorMessage(
    { code: "username_taken", message: "Username is already taken." },
    { translate: t, fallback: t("validation.apiFallback") }
  );
  assert.equal(mapped, t("validation.api.username_taken"));
  assert.notEqual(mapped, "Username is already taken.");

  const unknown = resolveApiErrorMessage(
    { code: "totally_unknown_xyz", message: "Something English blew up" },
    { translate: t, fallback: t("validation.apiFallback") }
  );
  assert.equal(unknown, t("validation.apiFallback"));
  assert.notEqual(unknown, "Something English blew up");
});

test("9B-5 Parent new code maps without raw English", async () => {
  resetLocaleBundleCache();
  const bundles = await loadLocaleBundles("id-ID");
  const t = (key, params) => lookupMessage(bundles, key, params) ?? key;
  const mapped = mapParentApiFailurePayload(
    { code: "username_taken", error: "Username is already taken." },
    "credentials"
  );
  assert.equal(mapped.errorCode, "username_taken");
  assert.ok(mapped.messageKey);
  assert.notEqual(mapped.messageKey, "ui.parent.errors.rawMessage");
  const display = t(mapped.messageKey, mapped.parameters);
  assert.ok(display);
  assert.equal(/\bUsername is already taken\b/i.test(display), false);
});

test("9B-5 Student new code maps without raw English", async () => {
  resetLocaleBundleCache();
  const bundles = await loadLocaleBundles("id-ID");
  const t = (key, params) => lookupMessage(bundles, key, params) ?? key;
  const display = resolveStudentApiErrorMessage(
    { code: "invalid_game", error: "Invalid game" },
    t
  );
  assert.ok(display);
  assert.equal(/\bInvalid game\b/i.test(display), false);
});

test("9B-5 Teacher/School apiErrorMessageHe code-first for id-ID", async () => {
  bindPlatformDisplayLocale("id-ID");
  resetLocaleBundleCache();
  const bundles = await loadLocaleBundles("id-ID");
  const expected = lookupMessage(bundles, "validation.api.rate_limited");
  const out = apiErrorMessageHe(
    { code: "rate_limited", message: "Too many requests. Please try again later." },
    "FALLBACK"
  );
  assert.equal(out, expected);
  assert.notEqual(out, "Too many requests. Please try again later.");
});

test("9B-5 Demo/Public representatives are not raw-message consumers", () => {
  const contact = fs.readFileSync(path.join(ROOT, "pages/contact.js"), "utf8");
  assert.match(contact, /body\?\.code === "validation_failed"/);
  assert.equal(/setFormError\(body\?\.error\)/.test(contact), false);

  const publicPage = fs.readFileSync(
    path.join(ROOT, "components/worksheets/ReadyWorksheetPublicPage.jsx"),
    "utf8"
  );
  assert.match(publicPage, /ui\.errorGeneric/);
  assert.equal(/includeAnswers_required/.test(publicPage), false);

  const cards = fs.readFileSync(path.join(ROOT, "pages/student/cards.js"), "utf8");
  assert.match(cards, /demoPackCopyForLocale\(locale, "cards", "loadFailed"\)/);

  const friends = fs.readFileSync(
    path.join(ROOT, "components/arcade/club/ArcadeClubFriendsPanel.jsx"),
    "utf8"
  );
  assert.match(friends, /resolveStudentApiErrorMessage/);
  assert.equal(/json\.message \|\| json\.error \|\| "Error"/.test(friends), false);
});
