import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("all 33 active games are fully locale-aware at runtime", () => {
  const out = execFileSync("node", ["scripts/i18n/audit-game-locale-status.mjs", "--json"], {
    cwd: root,
    encoding: "utf8",
  });
  const report = JSON.parse(out);
  assert.equal(report.summary.total, 33);
  assert.equal(report.summary.fullyLocaleAware, 33);
  assert.equal(report.summary.partiallyLocaleAware, 0);
  assert.equal(report.summary.notLocaleAware, 0);
});
