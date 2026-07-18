/**
 * Phase 1 — Official parent reports require server/DB authority (remote API path only).
 */

import { reportPackCopy } from "../lib/reports/report-pack-copy.js";
import { parseParentReportRemoteSource } from "./teacher-portal/parent-report-remote-source.js";

/** @typedef {'db' | 'estimated' | 'unavailable'} BridgeFieldSource */

/**
 * @typedef {object} BridgeFieldProvenance
 * @property {BridgeFieldSource} source
 * @property {boolean} [isEstimated]
 * @property {string|null} [missingReason]
 */

export const PARENT_REPORT_DATA_AUTHORITY_SERVER = "server";

export const PARENT_REPORT_PORTAL_GATE = Object.freeze({
  titleHe: reportPackCopy("lib__parent-report-server-truth", "parent_report"),
  messageHe:
    "The official parent report is only available through the parent portal - after signing in and choosing a child from the dashboard.",
  hintHe: reportPackCopy("lib__parent-report-server-truth", "the_report_cannot_be_built_from_local_browser_data_data_stored_on_this_d"),
});

/**
 * @param {import('next/router').NextRouter} router
 */
export function isOfficialParentReportRemoteRoute(router) {
  return parseParentReportRemoteSource(router).isRemote;
}

/**
 * @param {BridgeFieldSource} source
 * @param {{ isEstimated?: boolean, missingReason?: string|null }} [opts]
 * @returns {BridgeFieldProvenance}
 */
export function makeBridgeFieldProvenance(source, opts = {}) {
  return {
    source,
    isEstimated: Boolean(opts.isEstimated),
    missingReason:
      typeof opts.missingReason === "string" && opts.missingReason.trim()
        ? opts.missingReason.trim()
        : null,
  };
}

/**
 * @param {Record<string, unknown>|null|undefined} prov
 */
export function bridgeFieldIsAuthoritative(prov) {
  if (!prov || typeof prov !== "object") return false;
  return prov.source === "db" && prov.isEstimated !== true;
}
