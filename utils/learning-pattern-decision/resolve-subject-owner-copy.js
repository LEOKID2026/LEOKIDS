/**
 * Subject summary / letter owner-copy resolver — thin bridge to owner templates (Phase A).
 */

import {
  resolveSubjectOwnerCopyFromContract,
  SUBJECT_OWNER_COPY_TEMPLATE_IDS,
} from "../parent-report-language/parent-report-owner-copy-templates.js";

/**
 * @param {Record<string, unknown>|null|undefined} contract
 * @param {{ subjectLabel?: string }} [opts]
 * @returns {string|null}
 */
export function resolveSubjectSummaryTextFromEngineContract(contract, opts = {}) {
  if (!contract?.blockedLegacySummary) return null;
  const templateId =
    String(contract.summarySlots?.openingTemplateId || "").trim() ||
    SUBJECT_OWNER_COPY_TEMPLATE_IDS.OPENING;
  const subjectLabel = String(opts.subjectLabel || "").trim();
  const ownerCopy = resolveSubjectOwnerCopyFromContract(contract, templateId, subjectLabel);
  if (ownerCopy) return ownerCopy;

  const p0 = contract.priorityTopics?.[0];
  const finding = String(p0?.parentSafeFinding || "").trim();
  return finding || null;
}

/**
 * @param {Record<string, unknown>|null|undefined} contract
 * @param {string} templateId
 * @param {string} [subjectLabel]
 * @returns {string|null}
 */
export function resolveSubjectLetterOwnerCopyHe(contract, templateId, subjectLabel = "") {
  return resolveSubjectOwnerCopyFromContract(contract, templateId, subjectLabel);
}
