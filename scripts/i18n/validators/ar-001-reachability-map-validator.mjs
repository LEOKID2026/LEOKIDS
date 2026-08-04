/**
 * ar-001 Runtime Reachability Map Integrity Validator
 *
 * READS artifacts/i18n/ar-001-runtime-reachability-map.json (Agent 4 owns map edits).
 * Extends Agent 3 scaffold with page existence, unique responsibility, harness refs.
 *
 * Checks:
 *   - totals.surfaces_mapped == Object.keys(surfaces).length == meta.canonical_surface_count_frozen
 *   - unique surface IDs
 *   - unique canonical_responsibility
 *   - each surface has route (or documented modal/render_surface), entry_action, ready_marker
 *   - real page_file / route exists (pages/)
 *   - no duplicate overlay responsibility (copilot)
 *   - no stale /learning/parent-report* routes
 *   - no nondeterministic mandatory browser event as sole ready path
 *   - Memory full-loop harness present
 *
 * Usage: node scripts/i18n/validators/ar-001-reachability-map-validator.mjs
 */

import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import {
  ROOT,
  readJSON,
  printFindings,
  exitCodeFor,
} from './lib/ar-001-validator-common.mjs';

const MAP_PATH = 'artifacts/i18n/ar-001-runtime-reachability-map.json';
const findings = [];

const NONDETERMINISTIC_READY = [
  /beforeinstallprompt/i,
  /\bemail sent\b/i,
];

const STALE_ROUTE_PATTERNS = [
  /\/learning\/parent-report(?:-detailed)?(?:\?|$| )/i,
  /\/legal\/privacy/i,
  /\/legal\/terms/i,
];

function pageExistsForRoute(route) {
  if (!route || typeof route !== 'string') return false;
  let path = route.split('?')[0].trim();
  if (path.includes('(') && /panel|overlay/i.test(path)) return false;
  if (path.startsWith('render_surface:')) return true;
  if (!path.startsWith('/')) return false;

  const parts = path.split('/').filter(Boolean);
  let cursor = join(ROOT, 'pages');

  if (parts.length === 0) {
    return (
      existsSync(join(ROOT, 'pages/index.js')) ||
      existsSync(join(ROOT, 'pages/index.jsx'))
    );
  }

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;
    if (!existsSync(cursor)) return false;

    if (part.startsWith('{') && part.endsWith('}')) {
      const entries = readdirSync(cursor);
      const dynDir = entries.find(
        (e) => e.startsWith('[') && e.endsWith(']') && statSync(join(cursor, e)).isDirectory()
      );
      const dynFile = entries.find((e) => /^\[.+\]\.(js|jsx|tsx)$/.test(e));
      if (isLast && dynFile) return true;
      if (!dynDir && !dynFile) return false;
      if (dynDir) {
        cursor = join(cursor, dynDir);
        if (isLast) {
          return (
            existsSync(join(cursor, 'index.js')) ||
            existsSync(join(cursor, 'index.jsx')) ||
            existsSync(join(cursor, 'index.tsx')) ||
            readdirSync(cursor).some((e) => /^\[.+\]\.(js|jsx|tsx)$/.test(e))
          );
        }
        continue;
      }
      return Boolean(dynFile);
    }

    const exactDir = join(cursor, part);
    const exactJs = join(cursor, `${part}.js`);
    const exactJsx = join(cursor, `${part}.jsx`);
    const exactTsx = join(cursor, `${part}.tsx`);

    if (isLast) {
      if (existsSync(exactJs) || existsSync(exactJsx) || existsSync(exactTsx)) return true;
      if (existsSync(exactDir) && statSync(exactDir).isDirectory()) {
        return (
          existsSync(join(exactDir, 'index.js')) ||
          existsSync(join(exactDir, 'index.jsx')) ||
          existsSync(join(exactDir, 'index.tsx'))
        );
      }
      return false;
    }

    if (existsSync(exactDir) && statSync(exactDir).isDirectory()) {
      cursor = exactDir;
      continue;
    }
    return false;
  }
  return false;
}

function primaryRoute(routeField) {
  if (!routeField) return '';
  const raw = String(routeField).split(',')[0].trim();
  const m = raw.match(/^(\/\S+)/);
  return m ? m[1] : raw;
}

function checkMap() {
  const map = readJSON(join(ROOT, MAP_PATH));
  if (!map) {
    findings.push({
      severity: 'error',
      file: MAP_PATH,
      reason: 'Reachability map missing or invalid JSON',
      ruleId: 'reach-map-missing',
    });
    return;
  }

  const surfaces = map.surfaces && typeof map.surfaces === 'object' ? map.surfaces : null;
  if (!surfaces) {
    findings.push({
      severity: 'error',
      file: MAP_PATH,
      reason: 'Map missing surfaces object',
      ruleId: 'reach-map-no-surfaces',
    });
    return;
  }

  const ids = Object.keys(surfaces);
  const count = ids.length;
  const totals = map.totals || map.meta?.totals || {};
  const declared =
    totals.surfaces_mapped ??
    totals.surfacesMapped ??
    map.meta?.surfaces_mapped ??
    map.meta?.surface_count;
  const frozen = map.meta?.canonical_surface_count_frozen;

  console.log(`  Surface object count: ${count}`);
  console.log(`  Declared totals.surfaces_mapped: ${declared ?? '(missing)'}`);
  if (frozen != null) console.log(`  Frozen canonical count: ${frozen}`);

  if (declared == null) {
    findings.push({
      severity: 'error',
      file: MAP_PATH,
      key: 'totals.surfaces_mapped',
      reason: 'totals.surfaces_mapped (or meta equivalent) missing',
      ruleId: 'reach-map-totals-missing',
    });
  } else if (Number(declared) !== count) {
    findings.push({
      severity: 'error',
      file: MAP_PATH,
      key: 'totals.surfaces_mapped',
      value: String(declared),
      reason: `totals.surfaces_mapped (${declared}) != Object.keys(surfaces).length (${count})`,
      ruleId: 'reach-map-totals-mismatch',
    });
  }

  if (frozen != null && Number(frozen) !== count) {
    findings.push({
      severity: 'error',
      file: MAP_PATH,
      key: 'meta.canonical_surface_count_frozen',
      value: String(frozen),
      reason: `frozen count (${frozen}) != Object.keys(surfaces).length (${count})`,
      ruleId: 'reach-map-frozen-mismatch',
    });
  }

  const seenIds = new Set();
  const respMap = new Map();

  for (const id of ids) {
    if (seenIds.has(id)) {
      findings.push({
        severity: 'error',
        file: MAP_PATH,
        key: id,
        reason: 'Duplicate surface ID',
        ruleId: 'reach-map-duplicate-id',
      });
    }
    seenIds.add(id);

    const s = surfaces[id] || {};
    const route = s.route || s.routeModal || s.route_modal;
    const entry = s.entry_action || s.entryAction;
    const ready = s.ready_marker || s.readyMarker;
    const kind = s.route_kind || 'page';
    const responsibility = s.canonical_responsibility;

    if (!responsibility || String(responsibility).trim() === '') {
      findings.push({
        severity: 'error',
        file: MAP_PATH,
        key: id,
        reason: 'Surface missing canonical_responsibility',
        ruleId: 'reach-map-missing-responsibility',
      });
    } else {
      const rk = String(responsibility).trim().toLowerCase();
      if (respMap.has(rk)) {
        findings.push({
          severity: 'error',
          file: MAP_PATH,
          key: `${respMap.get(rk)}|${id}`,
          value: String(responsibility),
          reason: 'Duplicate canonical_responsibility',
          ruleId: 'reach-map-duplicate-responsibility',
        });
      } else {
        respMap.set(rk, id);
      }
    }

    if (!route || String(route).trim() === '') {
      findings.push({
        severity: 'error',
        file: MAP_PATH,
        key: id,
        reason: 'Surface missing route / routeModal',
        ruleId: 'reach-map-missing-route',
      });
    }
    if (!entry || String(entry).trim() === '') {
      findings.push({
        severity: 'error',
        file: MAP_PATH,
        key: id,
        reason: 'Surface missing entry_action',
        ruleId: 'reach-map-missing-entry',
      });
    }
    if (!ready || String(ready).trim() === '') {
      findings.push({
        severity: 'error',
        file: MAP_PATH,
        key: id,
        reason: 'Surface missing ready_marker',
        ruleId: 'reach-map-missing-ready',
      });
    }

    if (ready && NONDETERMINISTIC_READY.some((re) => re.test(String(ready)))) {
      findings.push({
        severity: 'error',
        file: MAP_PATH,
        key: id,
        value: String(ready),
        reason: 'Nondeterministic/unprovable mandatory ready marker',
        ruleId: 'reach-map-nondeterministic-ready',
      });
    }

    const routeCandidates = [route, ...(s.alternate_routes || [])].filter(Boolean);
    for (const c of routeCandidates) {
      for (const re of STALE_ROUTE_PATTERNS) {
        if (re.test(String(c))) {
          findings.push({
            severity: 'error',
            file: MAP_PATH,
            key: id,
            value: String(c),
            reason: 'Stale or incorrect product route',
            ruleId: 'reach-map-stale-route',
          });
        }
      }
    }

    // Real route / page existence
    if (kind === 'render_surface') {
      if (!s.proof_harness && !s.proof_artifact) {
        findings.push({
          severity: 'error',
          file: MAP_PATH,
          key: id,
          reason: 'render_surface requires proof_harness or proof_artifact',
          ruleId: 'reach-map-render-surface-proof',
        });
      } else if (s.proof_harness && !existsSync(join(ROOT, s.proof_harness))) {
        findings.push({
          severity: 'error',
          file: MAP_PATH,
          key: id,
          value: s.proof_harness,
          reason: 'proof_harness file missing',
          ruleId: 'reach-map-proof-harness-missing',
        });
      }
    } else if (kind === 'overlay') {
      const host = s.host_route || primaryRoute(route);
      const pageFileOk = s.page_file && existsSync(join(ROOT, s.page_file));
      if (!pageFileOk && !pageExistsForRoute(host)) {
        findings.push({
          severity: 'error',
          file: MAP_PATH,
          key: id,
          value: host,
          reason: 'Overlay host route/page missing',
          ruleId: 'reach-map-overlay-host-missing',
        });
      }
    } else if (route) {
      const primary = primaryRoute(route);
      const pageFileOk = s.page_file && existsSync(join(ROOT, s.page_file));
      const routeOk = pageExistsForRoute(primary);
      if (!pageFileOk && !routeOk) {
        findings.push({
          severity: 'error',
          file: MAP_PATH,
          key: id,
          value: primary,
          reason: `Route/page not found (page_file=${s.page_file || 'n/a'})`,
          ruleId: 'reach-map-page-missing',
        });
      } else if (s.page_file && !pageFileOk) {
        findings.push({
          severity: 'error',
          file: MAP_PATH,
          key: id,
          value: s.page_file,
          reason: 'Declared page_file does not exist',
          ruleId: 'reach-map-page-file-missing',
        });
      }
    }
  }

  // Duplicate overlay responsibility
  if (surfaces.parent_copilot && surfaces.reports_copilot) {
    findings.push({
      severity: 'error',
      file: MAP_PATH,
      key: 'parent_copilot|reports_copilot',
      reason: 'Duplicate Copilot overlay surfaces — keep one canonical surface',
      ruleId: 'reach-map-duplicate-copilot',
    });
  }

  // Stale learning/* parent report routes (Agent 3 check retained)
  for (const id of ['parent_report_short', 'parent_report_detailed']) {
    const s = surfaces[id];
    if (!s) continue;
    const route = String(s.route || s.routeModal || '');
    if (route.includes('/learning/parent-report')) {
      findings.push({
        severity: 'error',
        file: MAP_PATH,
        key: id,
        value: route,
        reason: 'Stale parent report route under /learning/ — use /parent/ product route',
        ruleId: 'reach-map-stale-report-route',
      });
    }
  }

  // Memory full-loop harness
  const mem = surfaces.student_solo_games;
  if (mem) {
    const harness = mem.full_loop_harness || 'scripts/i18n/harness/memory-full-loop.mjs';
    if (!existsSync(join(ROOT, harness))) {
      findings.push({
        severity: 'error',
        file: MAP_PATH,
        key: 'student_solo_games',
        value: harness,
        reason: 'Memory full-loop harness missing',
        ruleId: 'reach-map-memory-harness-missing',
      });
    } else {
      console.log(`  Memory harness: ${harness}`);
    }
  }
}

console.log('\n=== ar-001 Reachability Map Integrity Validator ===');
checkMap();
printFindings('Reachability map results', findings);
const code = exitCodeFor(findings, ['critical', 'error']);
console.log(code === 0 ? '\n✅ Reachability map PASS' : '\n❌ Reachability map FAIL');
process.exit(code);
