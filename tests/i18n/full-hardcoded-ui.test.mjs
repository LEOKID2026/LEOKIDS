import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const baselinePath = path.join(root, "tests/i18n/_hardcoded-ui-baseline.json");

test("hardcoded UI debt burn-down — real unauthorized user-visible/content debt must be zero", () => {
  assert.ok(fs.existsSync(baselinePath), "storedDebtBaseline ledger must exist");

  let output = "";
  try {
    output = execFileSync("node", ["scripts/i18n/scan-hardcoded-ui.mjs"], {
      cwd: root,
      encoding: "utf8",
    });
  } catch (err) {
    output = String(err.stdout || err.output?.[1] || "");
  }

  const report = JSON.parse(output || "{}");
  assert.equal(
    report.baselineGrew,
    false,
    `storedDebtBaseline must never grow (was ${report.storedDebtBaseline}, now ${report.unauthorizedUserVisible})`
  );

  assert.equal(
    report.unauthorizedUserVisible,
    0,
    `real unauthorized debt (${report.unauthorizedUserVisible}, scannerTotal ${report.scannerTotal}):\n${(report.sample || [])
      .slice(0, 15)
      .map((f) => `${f.file}:${f.line} [${f.kind}] "${f.text}"`)
      .join("\n")}`
  );
});

test("storedDebtBaseline tracks unauthorizedUserVisible only", () => {
  const raw = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  assert.equal(raw.tracks || "unauthorizedUserVisible", "unauthorizedUserVisible");
});
