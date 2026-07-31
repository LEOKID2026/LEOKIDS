/**
 * Contract for localized static assets under assets/i18n/{locale}/.
 * Empty locale folders for inactive locales are OK.
 * Enabled locales must pass required-asset checks.
 */

import { resolveLocalizedAsset } from "./resolve-localized-asset.js";

/** @typedef {"required"|"optional"|"no_text"} LocalizedAssetRequirement */

/**
 * @typedef {{
 *   id: string,
 *   relativePath: string,
 *   requirement: LocalizedAssetRequirement,
 *   description: string,
 * }} LocalizedAssetManifestItem
 */

/**
 * Product assets that carry UI/content text and must exist for an enabled locale.
 * Keep empty until a second language ships real artwork — then add paths here.
 * @type {readonly LocalizedAssetManifestItem[]}
 */
export const LOCALIZED_ASSET_MANIFEST = Object.freeze([]);

/** @type {readonly LocalizedAssetManifestItem[]} */
export const LOCALIZED_ASSET_OPTIONAL = Object.freeze([]);

/** @type {readonly LocalizedAssetManifestItem[]} */
export const LOCALIZED_ASSET_NO_TEXT = Object.freeze([]);

/**
 * @param {string} localeId
 * @param {{
 *   root?: string,
 *   localeStatus?: string,
 *   isPseudo?: boolean,
 * }} [opts]
 */
export function checkLocalizedAssetsCompleteness(localeId, opts = {}) {
  const root = opts.root || process.cwd();
  const status = String(opts.localeStatus || "enabled");
  const isPseudo = Boolean(opts.isPseudo);

  /** @type {{ id: string, status: string, detail: string }[]} */
  const findings = [];
  /** @type {string[]} */
  const missingRequired = [];

  if (status !== "enabled" || isPseudo) {
    findings.push({
      id: "localized_assets",
      status: "intentional",
      detail: `Locale status=${status} pseudo=${isPseudo}: empty assets/i18n folder is OK`,
    });
    return { localeId, findings, missingRequired, ok: true };
  }

  const required = LOCALIZED_ASSET_MANIFEST.filter((a) => a.requirement === "required");

  for (const item of required) {
    const r = resolveLocalizedAsset(localeId, item.relativePath, { root });
    const atLocale = r.locale === localeId && !r.fellBack;
    if (!atLocale) {
      missingRequired.push(item.id);
      findings.push({
        id: `asset:${item.id}`,
        status: "missing",
        detail: `Required asset missing for enabled locale (resolved ${r.relativeUrl})`,
      });
    } else {
      findings.push({
        id: `asset:${item.id}`,
        status: "ok",
        detail: r.relativeUrl,
      });
    }
  }

  for (const item of LOCALIZED_ASSET_OPTIONAL) {
    findings.push({
      id: `asset_optional:${item.id}`,
      status: "intentional",
      detail: "Optional — missing allowed",
    });
  }
  for (const item of LOCALIZED_ASSET_NO_TEXT) {
    findings.push({
      id: `asset_no_text:${item.id}`,
      status: "intentional",
      detail: "No-text asset — EN fallback OK",
    });
  }

  if (required.length === 0) {
    findings.push({
      id: "localized_assets",
      status: "ok",
      detail: "No required localized assets declared yet; empty assets/i18n is OK",
    });
  }

  return {
    localeId,
    findings,
    missingRequired,
    ok: missingRequired.length === 0,
  };
}
