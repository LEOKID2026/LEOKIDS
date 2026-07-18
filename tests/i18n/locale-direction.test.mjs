import test, { describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  resolveDirection,
  isRtlLocale,
  isPseudoLongLocale,
  isPseudoRtlLocale,
  LOCALE_REGISTRY,
  RUNTIME_LOCALE_IDS,
} from "../../lib/i18n/locale-registry.js";
import { readRepoFile, repoRoot } from "./_certified-surfaces.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("locale registry direction", () => {
  test("en and en-XA are LTR; ar-XB is RTL", () => {
    assert.equal(resolveDirection("en"), "ltr");
    assert.equal(resolveDirection("en-US"), "ltr");
    assert.equal(resolveDirection("en-XA"), "ltr");
    assert.equal(resolveDirection("ar-XB"), "rtl");
    assert.equal(isRtlLocale("en"), false);
    assert.equal(isRtlLocale("ar-XB"), true);
  });

  test("pseudo locale helpers identify QA locales", () => {
    assert.equal(isPseudoLongLocale("en-XA"), true);
    assert.equal(isPseudoLongLocale("en"), false);
    assert.equal(isPseudoRtlLocale("ar-XB"), true);
    assert.equal(isPseudoRtlLocale("en"), false);
  });

  test("enabled runtime locales declare direction explicitly", () => {
    for (const id of RUNTIME_LOCALE_IDS) {
      const def = LOCALE_REGISTRY[id];
      assert.ok(def.direction === "ltr" || def.direction === "rtl", `${id} direction`);
    }
  });
});

test("MathExpression stays LTR inside any surrounding direction", () => {
  const src = readRepoFile("components/i18n/MathExpression.jsx");
  assert.match(src, /dir\s*=\s*["']ltr["']/);
  assert.match(src, /math-expression/);
  assert.doesNotMatch(src, /dir\s*=\s*["']rtl["']/);
});

test("I18nProvider exposes registry-derived direction via context", () => {
  const src = readRepoFile("lib/i18n/I18nProvider.jsx");
  assert.match(src, /const direction = def\.direction/);
  assert.match(src, /direction,/);
  assert.match(src, /isRtl,/);
});

describe("certified runtime surfaces avoid hardcoded RTL", () => {
  const SCAN_ROOTS = ["pages", "components", "lib", "styles", "middleware.js"];

  const PATH_ALLOW = [
    /^pages\/admin\//,
    /^pages\/api\/admin\//,
    /^components\/admin\//,
    /^lib\/admin-portal\//,
    /^lib\/admin-server\//,
    /^components\/prototypes\//,
    /^pages\/dev\//,
    /^components\/ai-hybrid-internal-reviewer-panel\.jsx$/,
    /^styles\/worksheet-print\.css$/,
    /^utils\/hebrew-audio-attach\.js$/,
    /^lib\/bidi\//,
    /^lib\/i18n\//,
    /^components\/i18n\/MathExpression\.jsx$/,
    /^tests\//,
    /^locales\//,
  ];

  const LINE_ALLOW = [
    /dir=\{direction\}/,
    /dir=\{isRtl\s*\?\s*["']rtl["']\s*:\s*["']ltr["']\}/,
    /direction\s*:\s*ltr/i,
    /unicode-bidi\s*:\s*isolate/i,
    /\/\*.*rtl.*\*\//i,
    /\/\/.*rtl/i,
    /direction\s*:\s*["']rtl["']/i, // registry data strings in locale-registry.js already excluded
  ];

  const HARDCODED_RTL = [
    { re: /dir\s*=\s*["']rtl["']/i, kind: "dir_rtl_attr" },
    { re: /direction\s*:\s*rtl\b/i, kind: "direction_rtl_css" },
  ];

  function walk(entry, out = []) {
    const abs = path.isAbsolute(entry) ? entry : path.join(repoRoot, entry);
    if (!fs.existsSync(abs)) return out;
    const st = fs.statSync(abs);
    if (st.isFile()) {
      out.push(abs);
      return out;
    }
    for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
      if (ent.name === "node_modules" || ent.name === ".next" || ent.name.startsWith(".")) continue;
      walk(path.join(abs, ent.name), out);
    }
    return out;
  }

  function isAllowed(rel) {
    return PATH_ALLOW.some((re) => re.test(rel));
  }

  test("no hardcoded dir=rtl outside locale-aware or admin/dev surfaces", () => {
    /** @type {{ rel: string, line: number, kind: string, snippet: string }[]} */
    const findings = [];
    const ext = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".css", ".scss"]);

    for (const base of SCAN_ROOTS) {
      for (const file of walk(base)) {
        const rel = path.relative(repoRoot, file).split(path.sep).join("/");
        if (isAllowed(rel)) continue;
        const e = path.extname(rel);
        if (e && !ext.has(e)) continue;
        let text;
        try {
          text = fs.readFileSync(file, "utf8");
        } catch {
          continue;
        }
        text.split(/\r?\n/).forEach((line, i) => {
          if (LINE_ALLOW.some((re) => re.test(line))) return;
          for (const { re, kind } of HARDCODED_RTL) {
            if (re.test(line)) {
              findings.push({ rel, line: i + 1, kind, snippet: line.trim().slice(0, 140) });
              break;
            }
          }
        });
      }
    }

    if (findings.length) {
      const msg = findings
        .slice(0, 20)
        .map((f) => `[${f.kind}] ${f.rel}:${f.line} ${f.snippet}`)
        .join("\n");
      assert.fail(`hardcoded RTL findings:\n${msg}`);
    }
  });
});
