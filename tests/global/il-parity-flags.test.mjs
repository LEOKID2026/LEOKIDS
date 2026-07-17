/**
 * IL parity gates — contact (build-time), teacher invite-only, diagnostic promotion.
 * Run: node --test tests/global/il-parity-flags.test.mjs
 */
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { isTeacherPortalInviteOnly } from "../../lib/teacher-server/teacher-session.server.js";
import {
  isDiagnosticMetadataParentPromotionEnabled,
  isActiveMetadataParentPromotionEnabled,
} from "../../lib/learning/diagnostic-metadata-subskill-flag.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contactSrc = fs.readFileSync(path.join(__dirname, "../../pages/contact.js"), "utf8");

function contactVisibleFromEnv(envValue) {
  const prev = process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED;
  if (envValue === undefined) delete process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED;
  else process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED = envValue;
  const match = contactSrc.match(
    /const CONTACT_FORM_VISIBLE[\s\S]*?process\.env\.NEXT_PUBLIC_CONTACT_FORM_ENABLED === "true"/,
  );
  assert.ok(match, "contact.js uses opt-in === true pattern");
  const visible = process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED === "true";
  if (prev === undefined) delete process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED;
  else process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED = prev;
  return visible;
}

/** @type {Record<string, string|undefined>} */
let saved = {};

beforeEach(() => {
  saved = {
    invite: process.env.TEACHER_PORTAL_INVITE_ONLY,
    promo: process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED,
    sub: process.env.DIAGNOSTIC_METADATA_SUBSKILL_ENABLED,
    gate: process.env.DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED,
  };
});

afterEach(() => {
  for (const [k, v] of Object.entries({
    TEACHER_PORTAL_INVITE_ONLY: saved.invite,
    DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED: saved.promo,
    DIAGNOSTIC_METADATA_SUBSKILL_ENABLED: saved.sub,
    DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED: saved.gate,
  })) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

test("contact form hidden when env missing, empty, or false", () => {
  assert.equal(contactVisibleFromEnv(undefined), false);
  assert.equal(contactVisibleFromEnv(""), false);
  assert.equal(contactVisibleFromEnv("false"), false);
  assert.equal(contactVisibleFromEnv("0"), false);
});

test("contact form visible only when env is exactly true", () => {
  assert.equal(contactVisibleFromEnv("true"), true);
});

test("teacher portal invite-only defaults true when env missing", () => {
  delete process.env.TEACHER_PORTAL_INVITE_ONLY;
  assert.equal(isTeacherPortalInviteOnly(), true);
});

test("teacher portal invite-only when env empty string", () => {
  process.env.TEACHER_PORTAL_INVITE_ONLY = "";
  assert.equal(isTeacherPortalInviteOnly(), true);
});

test("diagnostic promotion off unless env is exactly true", () => {
  delete process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED;
  assert.equal(isDiagnosticMetadataParentPromotionEnabled(), false);
  process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED = "";
  assert.equal(isDiagnosticMetadataParentPromotionEnabled(), false);
  process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED = "false";
  assert.equal(isDiagnosticMetadataParentPromotionEnabled(), false);
  process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED = "true";
  assert.equal(isDiagnosticMetadataParentPromotionEnabled(), true);
});

test("active promotion requires explicit promotion true plus other flags", () => {
  delete process.env.DIAGNOSTIC_METADATA_SUBSKILL_ENABLED;
  delete process.env.DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED;
  delete process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED;
  assert.equal(isActiveMetadataParentPromotionEnabled(), false);
  process.env.DIAGNOSTIC_METADATA_SUBSKILL_ENABLED = "true";
  process.env.DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED = "true";
  process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED = "true";
  assert.equal(isActiveMetadataParentPromotionEnabled(), true);
});
