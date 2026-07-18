import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("hardcoded inventory audit explains migration vs baseline gap", () => {
  execFileSync("node", ["scripts/i18n/audit-hardcoded-inventory.mjs", "--write-report"], {
    cwd: root,
    encoding: "utf8",
  });
  const reportPath = path.join(root, "tmp/i18n/hardcoded-inventory-audit.json");
  assert.ok(fs.existsSync(reportPath), "audit report must be written");
  const audit = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  assert.ok(Array.isArray(audit.migrationAreaTable), "migration area table required");
  assert.ok(audit.migrationAreaTable.length >= 4, "expected migration areas");
  assert.ok(audit.checks.teacherUiFindingsNow === 0, "teacher-ui should have zero findings");
  assert.ok(audit.checks.schoolUiFindingsNow === 0, "school-ui should have zero findings");
  assert.ok(audit.checks.hebrewDisplayFindingsNow === 0, "platform labels migrated");
  assert.ok(audit.globalGapReasons.some((r) => r.includes("export const")), "must document scanner blind spot");
});

test("hardcoded UI categories cover all findings", () => {
  execFileSync("node", ["scripts/i18n/categorize-hardcoded-ui.mjs", "--write-report"], {
    cwd: root,
    encoding: "utf8",
  });
  const reportPath = path.join(root, "tmp/i18n/hardcoded-ui-categories.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const categorized = report.categories.reduce((n, c) => n + c.findings, 0);
  assert.equal(categorized, report.scannerTotal || report.totalFindings);
  assert.ok(report.categories.length >= 10, "expected broad category coverage");
});
