/**
 * Scan i18n-key-first certified surfaces for unauthorized hardcoded user-visible English.
 * Scope: auth, consent, error pages, and other surfaces already wired to useT/useI18n.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { collectI18nKeyFirstFiles, readRepoFile } from "./_certified-surfaces.mjs";

const JSX_TEXT = />\s*([A-Za-z][^<{]{2,}?)\s*</g;
const JSX_STRING_CHILD = /\{\s*["']([A-Za-z][^"']{2,})["']\s*\}/g;
const ATTR_USER_TEXT = /\b(?:title|label|placeholder|aria-label)\s*=\s*["']([A-Za-z][^"']{2,})["']/g;

const LINE_ALLOW = [
  /useT|useI18n|\bt\s*\(/,
  /import\s+/,
  /from\s+["']/,
  /className=|data-testid=|href=|src=|type=|name=|id=|role=|autoComplete=|inputMode=/,
  /console\.(log|warn|error)/,
  /^\s*\/\//,
  /^\s*\*/,
  /process\.env/,
  /displayName|nativeName|ogLocale|textToSpeechLocale/,
  /NEXT_PUBLIC_/,
  /supabase|Supabase/,
  /Leo Kids/i, // brand in SEO constants allowed in non-user-copy contexts
];

const TEXT_ALLOW = [
  /^500$/,
  /^404$/,
  /^OK$/,
  /^Leo Kids$/,
  /^en$/,
  /^ltr$/,
  /^rtl$/,
  /^parent$/,
  /^teacher$/,
  /^student$/,
  /^email$/,
  /^password$/,
];

function usesI18nHook(source) {
  return /\buseT\b/.test(source) || /\buseI18n\b/.test(source);
}

function isAllowedLine(line) {
  return LINE_ALLOW.some((re) => re.test(line));
}

function isAllowedText(text) {
  const t = text.trim();
  if (t.length < 3) return true;
  if (TEXT_ALLOW.some((re) => re.test(t))) return true;
  if (!/[a-z]/.test(t)) return true;
  if (/^[A-Z0-9_]+$/.test(t)) return true;
  return false;
}

function findHardcodedUserText(source, rel) {
  /** @type {{ line: number, text: string, kind: string }[]} */
  const hits = [];
  const lines = source.split(/\r?\n/);

  lines.forEach((line, idx) => {
    if (isAllowedLine(line)) return;

    for (const re of [JSX_TEXT, JSX_STRING_CHILD, ATTR_USER_TEXT]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(line))) {
        const text = m[1];
        if (isAllowedText(text)) continue;
        hits.push({ line: idx + 1, text: text.trim().slice(0, 120), kind: re.source.slice(0, 12) });
      }
    }
  });

  return hits;
}

test("i18n-key-first certified surfaces avoid hardcoded user-visible English", () => {
  const files = collectI18nKeyFirstFiles().filter((rel) => /\.(jsx?|tsx?)$/.test(rel));
  /** @type {{ rel: string, line: number, text: string }[]} */
  const findings = [];

  for (const rel of files) {
    const source = readRepoFile(rel);
    if (!usesI18nHook(source)) continue;
    for (const hit of findHardcodedUserText(source, rel)) {
      findings.push({ rel, line: hit.line, text: hit.text });
    }
  }

  if (findings.length) {
    const msg = findings
      .slice(0, 30)
      .map((f) => `${f.rel}:${f.line} "${f.text}"`)
      .join("\n");
    assert.fail(`unauthorized hardcoded English (${findings.length}):\n${msg}`);
  }

  assert.ok(files.length >= 5, "expected i18n-key-first file set");
});
