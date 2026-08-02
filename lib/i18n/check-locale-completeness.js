/**
 * Locale completeness checker — reports missing artifacts vs LOCALE_COMPLETENESS_MANIFEST.
 * Distinguishes: missing || fallback || english_subject_exception || excluded || intentional.
 */

import fs from "fs";
import path from "path";
import {
  LOCALE_COMPLETENESS_MANIFEST,
  REQUIRED_UI_NAMESPACES,
  REQUIRED_CONTENT_PACK_PATHS,
  GLOBAL_SUBJECTS,
  GLOBAL_GRADES,
} from "./locale-completeness-manifest.js";
import { LOCALE_REGISTRY, resolveLocaleDefinition } from "./locale-registry.js";
import { CONTENT_PACK_CATALOG, getCatalogPackExact } from "../content/pack-catalog.js";
import { getContentFallbackChain } from "../content/locale.js";
import { computeScienceLocalizationCoverage } from "../learning/science-localization-coverage.js";
import { SCIENCE_ES_419_OVERLAY } from "../../data/science-questions-es-419-overlay.js";
import { SCIENCE_PT_BR_OVERLAY } from "../../data/science-questions-pt-BR-overlay.js";
import { SCIENCE_PT_PT_OVERLAY } from "../../data/science-questions-pt-PT-overlay.js";
import { SCIENCE_IT_IT_OVERLAY } from "../../data/science-questions-it-IT-overlay.js";
import { SCIENCE_FR_FR_OVERLAY } from "../../data/science-questions-fr-FR-overlay.js";
import { SCIENCE_NL_NL_OVERLAY } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_DE_DE_OVERLAY } from "../../data/science-questions-de-DE-overlay.js";
import { SCIENCE_RU_RU_OVERLAY } from "../../data/science-questions-ru-RU-overlay.js";
import { checkLocalizedAssetsCompleteness } from "../content/localized-asset-manifest.js";
import { resolveLocaleFontStack, auditLocaleFontFileReferences } from "./resolve-locale-font.js";

const SCIENCE_OVERLAY_BY_LOCALE = Object.freeze({
  "es-419": SCIENCE_ES_419_OVERLAY,
  "pt-BR": SCIENCE_PT_BR_OVERLAY,
  "pt-PT": SCIENCE_PT_PT_OVERLAY,
  "it-IT": SCIENCE_IT_IT_OVERLAY,
  "fr-FR": SCIENCE_FR_FR_OVERLAY,
  "nl-NL": SCIENCE_NL_NL_OVERLAY,
  "de-DE": SCIENCE_DE_DE_OVERLAY,
  "ru-RU": SCIENCE_RU_RU_OVERLAY,
});

const NATIVE_STEM_LOCALES = new Set(["es-419", "pt-BR", "pt-PT", "it-IT", "fr-FR", "nl-NL", "de-DE", "ru-RU"]);
const NATIVE_WRITING_LOCALES = new Set(["es-419", "pt-BR", "pt-PT", "it-IT", "fr-FR", "nl-NL", "de-DE", "ru-RU"]);

/**
 * @typedef {{
 *   id: string,
 *   status: "ok"|"missing"|"fallback"|"english_subject_exception"|"excluded"|"intentional",
 *   detail: string,
 * }} CompletenessFinding
 */

/**
 * @param {string} localeId
 * @param {{ root?: string }} [opts]
 */
export function checkLocaleCompleteness(localeId, opts = {}) {
  const root = opts.root || process.cwd();
  const def = resolveLocaleDefinition(localeId);
  const id = def.id;
  const isPseudo = Boolean(def.isPseudo);
  /** @type {CompletenessFinding[]} */
  const findings = [];

  // registry
  if (LOCALE_REGISTRY[id]) {
    findings.push({
      id: "registry",
      status: "ok",
      detail: `Registered status=${def.status} dir=${def.direction}`,
    });
  } else {
    findings.push({ id: "registry", status: "missing", detail: "Not in LOCALE_REGISTRY" });
  }

  // fonts / direction
  if (def.fonts?.length && def.direction) {
    findings.push({
      id: "fonts",
      status: "ok",
      detail: `fonts=[${def.fonts.join(", ")}] direction=${def.direction}`,
    });
  } else {
    findings.push({ id: "fonts", status: "missing", detail: "Missing fonts[] or direction" });
  }

  // UI namespaces
  const localeDir = path.join(root, "locales", id);
  const missingNs = [];
  for (const ns of REQUIRED_UI_NAMESPACES) {
    const p = path.join(localeDir, `${ns}.json`);
    if (!fs.existsSync(p)) missingNs.push(ns);
  }
  if (missingNs.length === 0) {
    findings.push({ id: "ui_namespaces", status: "ok", detail: `All ${REQUIRED_UI_NAMESPACES.length} namespaces present` });
  } else if (isPseudo) {
    findings.push({
      id: "ui_namespaces",
      status: "fallback",
      detail: `Pseudo locale missing namespaces (fallback en): ${missingNs.join(", ")}`,
    });
  } else if (id === "en") {
    findings.push({
      id: "ui_namespaces",
      status: missingNs.length ? "missing" : "ok",
      detail: missingNs.length ? `Missing: ${missingNs.join(", ")}` : "ok",
    });
  } else {
    findings.push({
      id: "ui_namespaces",
      status: "missing",
      detail: `Missing namespaces: ${missingNs.join(", ")}`,
    });
  }

  // content packs
  const chain = getContentFallbackChain(id);
  const missingPacks = [];
  const fallbackPacks = [];
  for (const rel of REQUIRED_CONTENT_PACK_PATHS) {
    let foundAt = null;
    for (const loc of chain) {
      if (getCatalogPackExact(loc, rel) != null) {
        foundAt = loc;
        break;
      }
      const fp = path.join(root, "content-packs", loc, rel);
      if (fs.existsSync(fp)) {
        foundAt = loc;
        break;
      }
    }
    if (!foundAt) missingPacks.push(rel);
    else if (foundAt !== id) fallbackPacks.push(`${rel}→${foundAt}`);
  }
  if (missingPacks.length) {
    findings.push({ id: "content_packs", status: "missing", detail: missingPacks.join("; ") });
  } else if (fallbackPacks.length) {
    findings.push({
      id: "content_packs",
      status: isPseudo || id !== "en" ? "fallback" : "ok",
      detail: `Resolved via fallback: ${fallbackPacks.slice(0, 5).join("; ")}`,
    });
  } else {
    findings.push({ id: "content_packs", status: "ok", detail: "All required packs resolve at locale" });
  }

  // learning books
  let bookMissing = 0;
  let bookFallback = 0;
  let bookOk = 0;
  for (const subject of GLOBAL_SUBJECTS) {
    for (const grade of GLOBAL_GRADES) {
      const localized = path.join(root, "docs", "learning-book", id, subject, grade, "drafts");
      const legacy = path.join(root, "docs", "learning-book", subject, grade, "drafts");
      if (fs.existsSync(localized)) bookOk += 1;
      else if (fs.existsSync(legacy)) bookFallback += 1;
      else bookMissing += 1;
    }
  }
  if (bookMissing && !isPseudo) {
    findings.push({
      id: "learning_books",
      status: bookOk ? "fallback" : "missing",
      detail: `ok=${bookOk} legacyFallback=${bookFallback} missing=${bookMissing}`,
    });
  } else if (bookFallback && id === "en") {
    // en prefers locale tree; legacy fallback still ok if en tree partial
    findings.push({
      id: "learning_books",
      status: bookOk ? "ok" : "fallback",
      detail: `ok=${bookOk} legacyFallback=${bookFallback} missing=${bookMissing}`,
    });
  } else {
    findings.push({
      id: "learning_books",
      status: isPseudo ? "fallback" : bookOk ? "ok" : "fallback",
      detail: `ok=${bookOk} legacyFallback=${bookFallback} missing=${bookMissing}`,
    });
  }

  // science overlay (EN authority + native locale overlays when present)
  if (id === "en" || isPseudo) {
    const sci = computeScienceLocalizationCoverage();
    findings.push({
      id: "science_overlay",
      status: sci.contractComplete ? "ok" : "missing",
      detail: `questions=${sci.totalQuestions} overlay=${sci.overlayCoveragePct}% contractComplete=${sci.contractComplete} incomplete=${sci.incompleteOverlayCount}`,
    });
  } else if (SCIENCE_OVERLAY_BY_LOCALE[id]) {
    const sci = computeScienceLocalizationCoverage(undefined, SCIENCE_OVERLAY_BY_LOCALE[id]);
    findings.push({
      id: "science_overlay",
      status: sci.contractComplete ? "ok" : "missing",
      detail: `questions=${sci.totalQuestions} overlay=${sci.overlayCoveragePct}% contractComplete=${sci.contractComplete} incomplete=${sci.incompleteOverlayCount}`,
    });
  } else {
    findings.push({
      id: "science_overlay",
      status: "missing",
      detail: "No native science locale overlay yet — must register before enabling locale",
    });
  }

  // question stems: en templates exist; native locales have math/geometry rebuilders
  findings.push({
    id: "question_stems",
    status: id === "en" || isPseudo || NATIVE_STEM_LOCALES.has(id) ? "ok" : "missing",
    detail:
      id === "en" || isPseudo
        ? "Params-based EN stem templates + pseudo fallback to en"
        : NATIVE_STEM_LOCALES.has(id)
          ? `Params-based ${id} math/geometry stem rebuilders`
          : "Need locale stem templates (no HE translation path)",
  });

  findings.push({
    id: "worksheets",
    status: id === "en" || isPseudo || NATIVE_WRITING_LOCALES.has(id) ? "ok" : "missing",
    detail:
      id === "en" || isPseudo
        ? "Writing packs resolve via word-packs.locale (en)"
        : NATIVE_WRITING_LOCALES.has(id)
          ? `Writing packs resolve via word-packs.locale (${id}) + writing sentence cues`
          : "Need locale writing packs",
  });

  findings.push({
    id: "games",
    status: CONTENT_PACK_CATALOG[id]?.["games/ui-pack-index.json"]
      ? "ok"
      : CONTENT_PACK_CATALOG.en?.["games/ui-pack-index.json"]
        ? id === "en" || isPseudo
          ? "ok"
          : "fallback"
        : "missing",
    detail: CONTENT_PACK_CATALOG[id]?.["games/ui-pack-index.json"]
      ? "Game packs registered at locale in CONTENT_PACK_CATALOG"
      : "Game packs via catalog fallback chain",
  });

  findings.push({
    id: "reports",
    status: CONTENT_PACK_CATALOG[id]?.["reports/burn-down-index.json"]
      ? "ok"
      : CONTENT_PACK_CATALOG.en?.["reports/burn-down-index.json"]
        ? id === "en" || isPseudo
          ? "ok"
          : "fallback"
        : "missing",
    detail: CONTENT_PACK_CATALOG[id]?.["reports/burn-down-index.json"]
      ? "Report packs registered at locale in CONTENT_PACK_CATALOG"
      : "Report packs via catalog fallback chain",
  });

  findings.push({
    id: "seo",
    status: def.ogLocale ? "ok" : "missing",
    detail: `ogLocale=${def.ogLocale || "none"}; hreflang only for status=enabled`,
  });

  findings.push({
    id: "english_subject",
    status: "english_subject_exception",
    detail: "English-subject learning content remains en by resolveContentLocale({ subject: 'english' })",
  });

  {
    const assets = checkLocalizedAssetsCompleteness(id, {
      root,
      localeStatus: def.status,
      isPseudo,
    });
    findings.push({
      id: "localized_assets",
      status: assets.ok ? (assets.findings[0]?.status === "intentional" ? "intentional" : "ok") : "missing",
      detail: assets.findings.map((f) => f.detail).join("; ") || "ok",
    });
  }

  {
    const font = resolveLocaleFontStack(id, { root });
    const audit = auditLocaleFontFileReferences({ root });
    findings.push({
      id: "fonts_resolver",
      status: audit.ok ? "ok" : "missing",
      detail: `script=${font.script} webfont=${font.webfontAvailable} systemFallback=${font.usesSystemFallback} missingFileRefs=${audit.missing.length}`,
    });
  }

  if (isPseudo) {
    findings.push({
      id: "pseudo",
      status: "intentional",
      detail: "Pseudo locale: transforms + en content fallback are intentional",
    });
  }

  const missing = findings.filter((f) => f.status === "missing");
  const fallback = findings.filter((f) => f.status === "fallback");

  return {
    localeId: id,
    isPseudo,
    status: def.status,
    findings,
    missingCount: missing.length,
    fallbackCount: fallback.length,
    readyForTranslationContent: missing.length === 0 || (isPseudo && missing.every((m) => m.id === "science_overlay" && false)),
    summary: {
      ok: findings.filter((f) => f.status === "ok").length,
      missing: missing.length,
      fallback: fallback.length,
      exceptions: findings.filter((f) =>
        ["english_subject_exception", "intentional", "excluded"].includes(f.status)
      ).length,
    },
  };
}

/**
 * CLI entry
 */
export function printLocaleCompletenessReport(localeId) {
  const report = checkLocaleCompleteness(localeId);
  console.log(JSON.stringify(report, null, 2));
  return report;
}
