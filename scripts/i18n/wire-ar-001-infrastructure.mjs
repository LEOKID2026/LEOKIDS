/**
 * Wire ar-001 into load-messages.js and pack-catalog.js after locale files exist.
 * Run: node scripts/i18n/wire-ar-001-infrastructure.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { I18N_NAMESPACES } from "../../lib/i18n/load-messages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const LOCALE = "ar-001";
const LOCALE_SLUG = "Ar001";

function toImportVar(ns) {
  const base = ns.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return `${base}${LOCALE_SLUG}`;
}

function wireLoadMessages() {
  const file = path.join(ROOT, "lib/i18n/load-messages.js");
  let src = fs.readFileSync(file, "utf8");
  if (src.includes(`locales/${LOCALE}/common.json`)) {
    console.log("load-messages already wired");
    return;
  }

  const importLines = I18N_NAMESPACES.map(
    (ns) =>
      `import ${toImportVar(ns)} from "../../locales/${LOCALE}/${ns}.json" with { type: "json" };`,
  ).join("\n");

  src = src.replace(
    /import copilotPtBr from "\.\.\/\.\.\/locales\/pt-BR\/copilot\.json" with \{ type: "json" \};/,
    `import copilotPtBr from "../../locales/pt-BR/copilot.json" with { type: "json" };\n${importLines}`,
  );

  const bundleFields = I18N_NAMESPACES.map((ns) => `    ${ns}: ${toImportVar(ns)},`).join("\n");
  const bundleBlock = `  "${LOCALE}": Object.freeze({\n${bundleFields}\n  }),`;

  src = src.replace(
    /  "pt-BR": Object\.freeze\(\{[\s\S]*?\n  \}\),\n  "pt-PT":/,
    (m) => m.replace(/\n  "pt-PT":/, `\n  }),\n${bundleBlock}\n  "pt-PT":`),
  );

  fs.writeFileSync(file, src, "utf8");
  console.log("wired load-messages.js");
}

const CATALOG_PACKS = [
  "books/ui.json",
  "books/registry-titles.json",
  "books/english-page-skills.json",
  "demo/ui.json",
  "games/burn-down-index.json",
  "games/ui-pack-index.json",
  "global-burn-down/burn-down-index.json",
  "learning/burn-down-index.json",
  "learning/diagnostic-engine-v2-defaults.json",
  "learning/diagnostic-framework-v1.json",
  "learning/diagnostic-labels.json",
  "learning/example-pattern-diagnostics-payload.json",
  "learning/fast-diagnostic-probes.json",
  "learning/fast-diagnostic-tag-labels.json",
  "learning/geometry-content.json",
  "learning/learning-patterns-copy.json",
  "learning/math-animation-titles.json",
  "learning/taxonomy/english.structure.json",
  "learning/taxonomy/english.content.json",
  "learning/taxonomy/geometry.structure.json",
  "learning/taxonomy/geometry.content.json",
  "learning/taxonomy/math.structure.json",
  "learning/taxonomy/math.content.json",
  "learning/taxonomy/science.structure.json",
  "learning/taxonomy/science.content.json",
  "reports/burn-down-index.json",
  "rewards/card-catalog.json",
  "rewards/ui.json",
];

function catalogImportVar(relPath) {
  const parts = relPath.replace(/\//g, " ").replace(/[.-]/g, " ").split(/\s+/);
  const camel = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return `${camel}${LOCALE_SLUG}`;
}

function wirePackCatalog() {
  const file = path.join(ROOT, "lib/content/pack-catalog.js");
  let src = fs.readFileSync(file, "utf8");
  if (src.includes(`content-packs/${LOCALE}/books/ui.json`)) {
    console.log("pack-catalog already wired");
    return;
  }

  const importLines = CATALOG_PACKS.map((rel) => {
    const v = catalogImportVar(rel);
    return `import ${v} from "../../content-packs/${LOCALE}/${rel}" with { type: "json" };`;
  }).join("\n");

  src = src.replace(
    /import rewardsUiPtBr from "\.\.\/\.\.\/content-packs\/pt-BR\/rewards\/ui\.json" with \{ type: "json" \};/,
    `import rewardsUiPtBr from "../../content-packs/pt-BR/rewards/ui.json" with { type: "json" };\n\n${importLines}`,
  );

  const entries = CATALOG_PACKS.map((rel) => `    "${rel}": ${catalogImportVar(rel)},`).join("\n");
  const block = `  "${LOCALE}": Object.freeze({\n${entries}\n  }),`;

  src = src.replace(
    /  "pt-BR": Object\.freeze\(\{[\s\S]*?\n  \}\),\n  "pt-PT":/,
    (m) => m.replace(/\n  "pt-PT":/, `\n  }),\n${block}\n  "pt-PT":`),
  );

  fs.writeFileSync(file, src, "utf8");
  console.log("wired pack-catalog.js");
}

wireLoadMessages();
wirePackCatalog();
