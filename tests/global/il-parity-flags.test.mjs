/**
 * IL parity gates — contact (build-time), teacher invite-only, diagnostic promotion.
 * Run: node --test tests/global/il-parity-flags.test.mjs
 */
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { isTeacherPortalInviteOnly, isTeacherPortalLinkEnabled } from "../../lib/teacher-server/teacher-session.server.js";
import {
  isDiagnosticMetadataParentPromotionEnabled,
  isActiveMetadataParentPromotionEnabled,
} from "../../lib/learning/diagnostic-metadata-subskill-flag.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contactSrc = fs.readFileSync(path.join(__dirname, "../../pages/contact.js"), "utf8");

function contactFormVisibleFromSource() {
  const match = contactSrc.match(/const CONTACT_FORM_VISIBLE\s*=\s*(false|true)/);
  assert.ok(match, "contact.js defines CONTACT_FORM_VISIBLE as a boolean literal");
  return match[1] === "true";
}

/** @type {Record<string, string|undefined>} */
let saved = {};

beforeEach(() => {
  saved = {
    invite: process.env.TEACHER_PORTAL_INVITE_ONLY,
    link: process.env.TEACHER_PORTAL_LINK_ENABLED,
    promo: process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED,
    sub: process.env.DIAGNOSTIC_METADATA_SUBSKILL_ENABLED,
    gate: process.env.DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED,
  };
});

afterEach(() => {
  for (const [k, v] of Object.entries({
    TEACHER_PORTAL_INVITE_ONLY: saved.invite,
    TEACHER_PORTAL_LINK_ENABLED: saved.link,
    DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED: saved.promo,
    DIAGNOSTIC_METADATA_SUBSKILL_ENABLED: saved.sub,
    DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED: saved.gate,
  })) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

test("contact form hardcoded hidden (IL parity)", () => {
  assert.equal(contactFormVisibleFromSource(), false);
});

test("teacher portal link defaults false when env missing", () => {
  delete process.env.TEACHER_PORTAL_LINK_ENABLED;
  assert.equal(isTeacherPortalLinkEnabled(), false);
});

test("teacher portal link when env empty string", () => {
  process.env.TEACHER_PORTAL_LINK_ENABLED = "";
  assert.equal(isTeacherPortalLinkEnabled(), false);
});

test("teacher portal link only when env is exactly true", () => {
  process.env.TEACHER_PORTAL_LINK_ENABLED = "true";
  assert.equal(isTeacherPortalLinkEnabled(), true);
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
