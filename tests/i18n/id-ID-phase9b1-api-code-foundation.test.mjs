/**
 * Indonesian Master Phase 9B-1 — shared API code-first localization foundation.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import {
  bindPlatformDisplayLocale,
  apiErrorMessageHe,
  API_ERROR_LABEL_HE,
} from "../../lib/platform-ui/display-labels.js";
import {
  extractApiErrorCode,
  resolveApiErrorMessage,
} from "../../lib/api/resolve-api-error-message.js";
import { I18N_NAMESPACES } from "../../lib/i18n/load-messages.js";

const ROOT = process.cwd();
const PLACEHOLDER_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;

/** Phase 9A missing user-facing stable codes + school/guardian helper codes newly mapped. */
const NEW_USER_FACING_CODES = [
  "account_deactivated",
  "already_archived",
  "class_archived",
  "config_missing",
  "consent_invalid",
  "consent_required",
  "grade_mismatch",
  "grade_required",
  "guest_not_eligible",
  "jwt_required",
  "link_limit_reached",
  "link_unavailable",
  "missing_card_id",
  "missing_resume_token",
  "missing_student_id",
  "not_authenticated",
  "not_authorized",
  "not_parent_activity",
  "not_school_guardian",
  "not_school_portal_member",
  "operator_grant_required",
  "profile_update_failed",
  "rate_limited",
  "server_error",
  "student_id_required",
  "student_not_found",
  "student_not_linked",
  "student_product_mismatch",
  "student_scope_violation",
  "subject_mismatch",
  "teacher_profile_missing",
  "unexpected_server_error",
  "unknown_query_param",
  "wrong_school",
];

const TECHNICAL_EXCLUDED = ["missing_idempotency_key"];

/**
 * @param {string} locale
 */
function loadValidation(locale) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "locales", locale, "validation.json"), "utf8"));
}

/**
 * @param {string} s
 */
function placeholders(s) {
  return [...String(s).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort();
}

describe("Phase 9B-1 validation.api parity", () => {
  test("en / id-ID validation.api key parity for all branches", () => {
    const en = loadValidation("en");
    const id = loadValidation("id-ID");
    const enKeys = Object.keys(en.api || {}).sort();
    const idKeys = Object.keys(id.api || {}).sort();
    const missing = enKeys.filter((k) => !idKeys.includes(k));
    const extra = idKeys.filter((k) => !enKeys.includes(k));
    assert.deepEqual(missing, [], `missing id-ID keys: ${missing.join(", ")}`);
    assert.deepEqual(extra, [], `extra id-ID keys: ${extra.join(", ")}`);
    assert.equal(enKeys.length, idKeys.length);
    // Phase 9B-1 added 34 codes onto a 43-key base (=77). Phase 9B-5 added 39 → 116.
    assert.equal(enKeys.length, 116);
    for (const code of NEW_USER_FACING_CODES) {
      assert.ok(enKeys.includes(code), `en.api missing ${code}`);
    }

    const phMismatches = [];
    for (const k of enKeys) {
      const enPh = placeholders(en.api[k]).join(",");
      const idPh = placeholders(id.api[k]).join(",");
      if (enPh !== idPh) phMismatches.push(k);
      assert.ok(String(id.api[k]).trim().length > 0, `empty id-ID api.${k}`);
      assert.ok(String(en.api[k]).trim().length > 0, `empty en api.${k}`);
    }
    assert.deepEqual(phMismatches, []);
  });

  test("new user-facing codes exist in en and id-ID with Indonesian copy", () => {
    const en = loadValidation("en");
    const id = loadValidation("id-ID");
    for (const code of NEW_USER_FACING_CODES) {
      assert.ok(en.api[code], `en missing ${code}`);
      assert.ok(id.api[code], `id-ID missing ${code}`);
      assert.notEqual(id.api[code], en.api[code], `${code} should be Indonesian`);
      assert.doesNotMatch(id.api[code], /please try again|permission denied|server error/i);
    }
    for (const code of TECHNICAL_EXCLUDED) {
      assert.equal(en.api[code], undefined, `technical ${code} should not be forced into validation.api`);
    }
  });
});

describe("Phase 9B-1 code-first resolution", () => {
  test("resolveApiErrorMessage prefers mapped code over English message", () => {
    const labels = {
      class_archived: "Kelas ini sudah diarsipkan.",
      rate_limited: "Terlalu banyak percobaan. Coba lagi nanti.",
    };
    const fallback = "Terjadi kesalahan — silakan coba lagi";
    const out = resolveApiErrorMessage(
      { code: "class_archived", message: "Class is archived" },
      { labels, fallback }
    );
    assert.equal(out, labels.class_archived);
    assert.notEqual(out, "Class is archived");

    const rate = resolveApiErrorMessage(
      { code: "rate_limited", message: "Too many requests. Please try again later." },
      { labels, fallback }
    );
    assert.equal(rate, labels.rate_limited);
  });

  test("unknown code uses localized fallback — not English prose", () => {
    const fallback = "Terjadi kesalahan — silakan coba lagi";
    const out = resolveApiErrorMessage(
      { code: "totally_unknown_product_code_xyz", message: "Something exploded in the pipeline" },
      { labels: { class_archived: "mapped" }, fallback }
    );
    assert.equal(out, fallback);
    assert.doesNotMatch(out, /Something exploded|pipeline/i);
  });

  test("persona-shaped errorCode / error string resolves via code", () => {
    const labels = { not_authenticated: "Silakan masuk" };
    const fallback = "fallback";
    assert.equal(
      resolveApiErrorMessage(
        { ok: false, error: "not_authenticated", errorCode: "not_authenticated", message: "Missing bearer token" },
        { labels, fallback }
      ),
      labels.not_authenticated
    );
    assert.equal(extractApiErrorCode({ errorCode: "wrong_school" }), "wrong_school");
  });

  test("apiErrorMessageHe mapped-code priority across locales", () => {
    const locales = ["en", "es-419", "ar-001", "id-ID"];
    for (const locale of locales) {
      bindPlatformDisplayLocale(locale);
      const pack = loadValidation(locale);
      const fallback = pack.apiFallback || "\u00a0";

      // Existing mapped key (present in all four locale packs before 9B-1)
      const existing = apiErrorMessageHe(
        { code: "internal_error", message: "Unexpected server error — leak me" },
        fallback
      );
      const expectedExisting = API_ERROR_LABEL_HE.internal_error || fallback;
      assert.equal(existing, expectedExisting, `${locale} internal_error`);
      assert.notEqual(existing, "Unexpected server error — leak me");

      // Newly mapped key — English message must never win over code resolution
      const archived = apiErrorMessageHe(
        { code: "class_archived", message: "Class is archived" },
        fallback
      );
      assert.notEqual(archived, "Class is archived", `${locale} must not prefer raw message`);
      if (locale === "id-ID") {
        assert.match(archived, /diarsipkan/i);
      } else if (locale === "en") {
        assert.equal(archived, API_ERROR_LABEL_HE.class_archived);
      } else {
        // es/ar may inherit en SoT via bundle merge, or use localized fallback
        assert.ok(
          archived === fallback ||
            archived === loadValidation("en").api.class_archived ||
            archived === API_ERROR_LABEL_HE.class_archived,
          `${locale} unexpected class_archived: ${archived}`
        );
      }

      const unknown = apiErrorMessageHe(
        { code: "no_such_code_abc", message: "Raw English must not win" },
        fallback
      );
      assert.equal(unknown, fallback);
      assert.doesNotMatch(unknown, /Raw English/);
    }
  });

  test("id-ID new codes resolve to Bahasa Indonesia via helper", () => {
    bindPlatformDisplayLocale("id-ID");
    const samples = {
      account_deactivated: /dinonaktifkan/i,
      link_unavailable: /tidak lagi tersedia/i,
      rate_limited: /Terlalu banyak percobaan/i,
      wrong_school: /sekolah/i,
      student_not_linked: /Murid|ditautkan/i,
    };
    for (const [code, re] of Object.entries(samples)) {
      const text = apiErrorMessageHe({ code, message: "English prose override attempt" });
      assert.match(text, re, code);
      assert.doesNotMatch(text, /English prose|Class is archived|Please try again later/i);
    }
  });
});

describe("Phase 9B-1 compact id-ID regressions", () => {
  test("15/15 namespace files exist", () => {
    assert.ok(I18N_NAMESPACES.length >= 15);
    for (const ns of I18N_NAMESPACES) {
      assert.ok(fs.existsSync(path.join(ROOT, "locales", "id-ID", `${ns}.json`)), ns);
    }
  });

  test("Help / Public SEO / Phase5 / Phase7 / Phase8 markers remain", () => {
    assert.ok(fs.existsSync(path.join(ROOT, "data/help-center/id-ID")));
    assert.ok(fs.existsSync(path.join(ROOT, "content-packs/id-ID")));
    assert.ok(fs.existsSync(path.join(ROOT, "docs/reports/id-ID-indonesian-master-phase5-non-seo-runtime-2026-08-08.md")));
    assert.ok(fs.existsSync(path.join(ROOT, "docs/reports/id-ID-indonesian-master-phase7-native-learning-runtime-2026-08-08.md")));
    assert.ok(fs.existsSync(path.join(ROOT, "docs/reports/id-ID-indonesian-master-phase8-learning-books-2026-08-08.md")));
  });
});
