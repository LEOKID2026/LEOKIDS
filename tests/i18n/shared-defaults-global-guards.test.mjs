/**
 * Runtime contract tests for shared global defaults (no he fallbacks)
 * and WritingTraceSvg / narrative locale resolution.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resolveTeacherPreferredLanguageDefault } from "../../lib/auth/auth-registration-request.server.js";
import {
  POLICY_ACCEPTANCE_DEFAULT_LOCALE,
  resolvePolicyAcceptanceLocale,
} from "../../lib/parent-server/policy-acceptance.server.js";
import {
  PARENT_REPORT_AI_DEFAULT_LOCALE,
  resolveParentReportAiNarrativeLocale,
  validateParentReportAIText,
} from "../../lib/parent-report-ai/parent-report-ai-validate.js";
import {
  resolveWritingGlyphGroup,
  resolveWritingSvgAssetUrl,
} from "../../lib/writing/writing-trace-asset-resolver.js";
import {
  isAllowedPath,
  scanTextForGlobalHebrewGuards,
} from "./_global-hebrew-guard-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

describe("Shared defaults — teacher preferred_language", () => {
  test("missing teacher preferred language → en", () => {
    assert.equal(resolveTeacherPreferredLanguageDefault(undefined), "en");
    assert.equal(resolveTeacherPreferredLanguageDefault(null), "en");
    assert.equal(resolveTeacherPreferredLanguageDefault(""), "en");
    assert.equal(resolveTeacherPreferredLanguageDefault("   "), "en");
  });

  test("explicit selected language preserved", () => {
    assert.equal(resolveTeacherPreferredLanguageDefault("es-419"), "es-419");
    assert.equal(resolveTeacherPreferredLanguageDefault("fr-FR"), "fr-FR");
    assert.equal(resolveTeacherPreferredLanguageDefault("en"), "en");
  });

  test("registration insert default source uses en (not he)", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "lib/auth/auth-registration-request.server.js"),
      "utf8"
    );
    assert.match(src, /resolveTeacherPreferredLanguageDefault/);
    assert.doesNotMatch(
      src,
      /preferred_language:\s*["']he["']/
    );
    assert.equal(
      fs.existsSync(path.join(ROOT, "lib/auth/auth-registration-request.server.he.js")),
      false,
      "Hebrew companion module must not exist in GLOBAL"
    );
  });
});

describe("Shared defaults — policy acceptance locale", () => {
  test("missing policy locale → en", () => {
    assert.equal(POLICY_ACCEPTANCE_DEFAULT_LOCALE, "en");
    assert.equal(resolvePolicyAcceptanceLocale(undefined), "en");
    assert.equal(resolvePolicyAcceptanceLocale(null), "en");
    assert.equal(resolvePolicyAcceptanceLocale(""), "en");
  });

  test("explicit locale preserved", () => {
    assert.equal(resolvePolicyAcceptanceLocale("es-419"), "es-419");
    assert.equal(resolvePolicyAcceptanceLocale("en"), "en");
  });

  test("invalid locale → safe global locale en", () => {
    assert.equal(resolvePolicyAcceptanceLocale("x"), "en");
    assert.equal(resolvePolicyAcceptanceLocale("a".repeat(40)), "en");
  });
});

describe("Shared defaults — parent-report AI narrative locale", () => {
  test("default narrative locale is en", () => {
    assert.equal(PARENT_REPORT_AI_DEFAULT_LOCALE, "en");
    assert.equal(resolveParentReportAiNarrativeLocale({}), "en");
    assert.equal(resolveParentReportAiNarrativeLocale({ narrativeReportContext: { surface: "detailed" } }), "en");
  });

  test("report locale / options.locale preserved", () => {
    assert.equal(resolveParentReportAiNarrativeLocale({ locale: "es-419" }), "es-419");
    assert.equal(
      resolveParentReportAiNarrativeLocale({
        narrativeReportContext: { surface: "detailed", locale: "fr-FR" },
      }),
      "fr-FR"
    );
  });

  test("English report validation narrative remains English", () => {
    const english =
      "Your child showed steadier practice habits this week during short focused sessions at home.";
    const result = validateParentReportAIText(english, {
      locale: "en",
      narrativeReportContext: { surface: "detailed", locale: "en" },
    });
    assert.equal(result.ok, true, result.ok ? "" : `${result.reason}:${result.detail || ""}`);
    assert.equal(result.text, english);
    assert.equal(
      resolveParentReportAiNarrativeLocale({
        narrativeReportContext: { surface: "detailed", locale: "en" },
      }),
      "en"
    );

    // Hebrew-majority copy must not pass English runtime validation.
    const heHeavy =
      "             .";
    const rejected = validateParentReportAIText(heHeavy, { locale: "en" });
    assert.equal(rejected.ok, false);
    assert.equal(rejected.reason, "unexpected_hebrew");
  });
});

describe("WritingTraceSvg defaults", () => {
  test("WritingTraceSvg default language → en / Latin assets", () => {
    const src = fs.readFileSync(path.join(ROOT, "components/writing/WritingTraceSvg.jsx"), "utf8");
    assert.match(src, /language\s*=\s*["']en["']/);
    assert.doesNotMatch(src, /language\s*=\s*["']he["']/);

    const group = resolveWritingGlyphGroup({ character: "A", scriptStyle: "print", language: "en" });
    assert.equal(group, "en-upper");
    const url = resolveWritingSvgAssetUrl(undefined, {
      character: "A",
      scriptStyle: "print",
      language: "en",
      traceRenderMode: "full_trace",
    });
    assert.match(String(url), /\/assets\/writing\/full-trace\/en-upper\//);
  });

  test("explicit WritingTraceSvg language=he still supported in prop surface", () => {
    const src = fs.readFileSync(path.join(ROOT, "components/writing/WritingTraceSvg.jsx"), "utf8");
    assert.match(src, /language\?:\s*"he"\s*\|\|\s*"en"\s*\|\|\s*"mixed"/);
    // Caller may still pass language="he"; component accepts the prop (default is en).
    assert.ok(src.includes('language?: "he" || "en" || "mixed"') || src.includes('"he" || "en" || "mixed"'));
  });
});

describe("Global no-Hebrew synthetic + Admin exemption contracts", () => {
  test("global no-Hebrew test detects a synthetic Hebrew SVG/string", () => {
    const hit = scanTextForGlobalHebrewGuards(`<text aria-label=""></text>`, {
      rel: "public/synthetic.svg",
    });
    assert.equal(hit.hebrew, true);
  });

  test("global translated-residue guard detects a synthetic Israeli key", () => {
    const hit = scanTextForGlobalHebrewGuards("Homeland Studies — Moledet unit", {
      rel: "locales/en/synthetic.json",
    });
    assert.ok(hit.residue.length >= 1);
  });

  test("Admin/Dev exemption works", () => {
    assert.equal(isAllowedPath("pages/admin/index.js"), true);
    assert.equal(isAllowedPath("pages/dev/tools.js"), true);
    assert.equal(isAllowedPath("lib/admin-server/x.js"), true);
    assert.equal(isAllowedPath("components/writing/WritingTraceSvg.jsx"), false);
  });
});
