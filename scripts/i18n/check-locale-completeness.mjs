#!/usr/bin/env node
/**
 * CLI: node scripts/i18n/check-locale-completeness.mjs [localeId]
 * Default: en
 */
import { printLocaleCompletenessReport } from "../../lib/i18n/check-locale-completeness.js";

const locale = process.argv[2] || "en";
const report = printLocaleCompletenessReport(locale);
process.exit(report.missingCount > 0 && !report.isPseudo ? 1 : 0);
