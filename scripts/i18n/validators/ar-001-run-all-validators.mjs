/**
 * ar-001 — Run All Validators
 * Runs closure validators + fixture regression and reports combined results.
 *
 * Usage: node scripts/i18n/validators/ar-001-run-all-validators.mjs
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const validators = [
  { name: 'Brand', script: 'ar-001-brand-validator.mjs' },
  { name: 'Terminology', script: 'ar-001-terminology-validator.mjs' },
  { name: 'Completeness', script: 'ar-001-completeness-validator.mjs' },
  { name: 'Active Runtime Parity', script: 'ar-001-active-runtime-parity-validator.mjs' },
  { name: 'Leaf/Index Parity', script: 'ar-001-leaf-index-parity-validator.mjs' },
  { name: 'Runtime-Copy', script: 'ar-001-hardcoded-runtime-validator.mjs' },
  { name: 'Duplicate/Stale', script: 'ar-001-duplicate-stale-validator.mjs' },
  { name: 'Reachability Map', script: 'ar-001-reachability-map-validator.mjs' },
  { name: 'Fixture Regression', script: 'ar-001-fixture-regression.mjs' },
];

const results = [];

console.log(`\n${'='.repeat(60)}`);
console.log(`  ar-001 CLOSURE VALIDATORS — FULL RUN`);
console.log(`${'='.repeat(60)}\n`);

for (const v of validators) {
  const scriptPath = join(__dirname, v.script);
  console.log(`\n▶ Running: ${v.name} Validator...`);
  try {
    const output = execSync(`node "${scriptPath}"`, {
      encoding: 'utf8',
      timeout: 180000,
      maxBuffer: 20 * 1024 * 1024,
    });
    console.log(output);
    results.push({ name: v.name, status: 'PASS', output });
  } catch (err) {
    const output = (err.stdout || '') + (err.stderr || err.message || '');
    console.error(output);
    results.push({ name: v.name, status: 'FAIL', output, exitCode: err.status });
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`  SUMMARY`);
console.log(`${'='.repeat(60)}`);

let allPass = true;
for (const r of results) {
  const icon = r.status === 'PASS' ? '✅' : '❌';
  console.log(`  ${icon} ${r.name}: ${r.status}`);
  if (r.status !== 'PASS') allPass = false;
}

console.log('');
if (allPass) {
  console.log('✅ ALL VALIDATORS PASS');
} else {
  console.log('❌ VALIDATION FAILURES — see details above');
}
console.log('commit = no');
console.log('push = no');

process.exit(allPass ? 0 : 1);
