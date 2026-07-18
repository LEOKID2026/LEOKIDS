/**
 * Validate tmp/i18n reports are internally consistent with live scan metrics.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { scanRepository } from "./hardcoded-ui-core.mjs";
import { classifyFindingKind, summarizeClassifiedFindings } from "./finding-classification.mjs";
import { EDUCATIONAL_GAME_KEYS } from "../../lib/educational-games/educational-game-registry.js";
import { SOLO_GAME_KEYS } from "../../lib/solo-games/solo-game-registry.js";
import { ARCADE_GAME_REGISTRY } from "../../lib/arcade/game-registry.js";
import { SAME_DEVICE_OFFLINE_GAMES } from "../../lib/offline/offline-game-catalog.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];

function readJson(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    errors.push(`missing report: ${rel}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(abs, "utf8"));
}

const { findings, scannedFiles } = scanRepository();
const classified = findings.map((f) => ({ ...f, kind: classifyFindingKind(f.file, f.text, f.line) }));
const metrics = summarizeClassifiedFindings(classified);

const finalJson = readJson("tmp/i18n/MULTILINGUAL-INFRASTRUCTURE-FINAL-REPORT.json");
const categories = readJson("tmp/i18n/hardcoded-ui-categories.json");
const audit = readJson("tmp/i18n/hardcoded-inventory-audit.json");

if (categories) {
  const sum = categories.categories.reduce((n, c) => n + c.findings, 0);
  if (sum !== categories.totalFindings) {
    errors.push(`categories sum ${sum} != totalFindings ${categories.totalFindings}`);
  }
  if (categories.totalFindings !== metrics.scannerTotal) {
    errors.push(
      `categories.totalFindings ${categories.totalFindings} != live scannerTotal ${metrics.scannerTotal}`
    );
  }
}

if (finalJson?.acceptanceMetrics) {
  const m = finalJson.acceptanceMetrics;
  if (m.filesScanned !== scannedFiles) {
    errors.push(`final report filesScanned ${m.filesScanned} != live ${scannedFiles}`);
  }
  if (m.hardcodedFindingsCurrent && m.hardcodedFindingsCurrent !== metrics.scannerTotal) {
    errors.push(
      `final report hardcodedFindingsCurrent ${m.hardcodedFindingsCurrent} != scannerTotal ${metrics.scannerTotal}`
    );
  }
  if (m.unresolvedUserVisibleFindings !== metrics.unauthorizedUserVisible && m.unauthorizedUserVisible !== metrics.unauthorizedUserVisible) {
    errors.push(
      `final report unresolved ${m.unresolvedUserVisibleFindings ?? m.unauthorizedUserVisible} != unauthorizedUserVisible ${metrics.unauthorizedUserVisible}`
    );
  }
  const gameTotal =
    (m.gamePacksShellComplete || 0) +
    (m.gamePacksGameplayPartial || 0) +
    (m.gamePacksGameplayFull || 0) +
    (m.gamePacksNotLocaleAware || 0);
  const activeGames =
    EDUCATIONAL_GAME_KEYS.length +
    SOLO_GAME_KEYS.length +
    ARCADE_GAME_REGISTRY.length +
    SAME_DEVICE_OFFLINE_GAMES.length;
  if (gameTotal && gameTotal !== activeGames) {
    errors.push(`game classification totals ${gameTotal} != active games ${activeGames}`);
  }
}

if (audit?.checks) {
  if (audit.checks.siteNavFindingsNow !== 0 || audit.checks.layoutFindingsNow !== 0) {
    errors.push(
      `audit site-nav/layout must be 0 (nav=${audit.checks.siteNavFindingsNow}, layout=${audit.checks.layoutFindingsNow})`
    );
  }
}

if (errors.length) {
  console.error("Report consistency validation failed:\n" + errors.join("\n"));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      scannerTotal: metrics.scannerTotal,
      unauthorizedUserVisible: metrics.unauthorizedUserVisible,
      scannedFiles,
    },
    null,
    2
  )
);
