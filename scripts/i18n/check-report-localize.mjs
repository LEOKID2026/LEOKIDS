#!/usr/bin/env node
/**
 * Node-safe check for report localization (reads JSON via fs; no Next import graph).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatMessage } from "../../lib/i18n/message-format.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reports = JSON.parse(fs.readFileSync(path.join(root, "locales/en/reports.json"), "utf8"));

const template = reports.contract.types.topicNeedsStrengthening;
const headline = formatMessage(template, {
  topic: reports.topics.math.vertical_addition,
  accuracy: 58,
  questions: 12,
});

if (!headline.includes("Vertical addition") || !headline.includes("58%")) {
  console.error("[report-localize] unexpected headline:", headline);
  process.exit(1);
}
console.log("[report-localize] OK —", headline);
