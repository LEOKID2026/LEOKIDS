/**
 * Batch migrate global-debt owner findings to content packs.
 *
 * Usage:
 *   node scripts/i18n/batch-migrate-owner-debt.mjs --owner learning
 *   node scripts/i18n/batch-migrate-owner-debt.mjs --all
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyGlobalDebtOwner, GLOBAL_DEBT_OWNERS } from "./global-debt-inventory.mjs";
import { classifyFindingKind } from "./finding-classification.mjs";
import { scanRepository, scanSource } from "./hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {Record<string, { packDir: string, indexPath: string, helperImport: string, helperFn: string, buildIndex?: string }>} */
const OWNER_CONFIG = {
  learning: {
    packDir: "content-packs/en/learning/burn-down",
    indexPath: "content-packs/en/learning/burn-down-index.json",
    helperImport: "lib/learning/burn-down-copy.js",
    helperFn: "burnDownCopy",
    buildIndex: "scripts/i18n/build-burn-down-index.mjs",
  },
  gamesEducational: {
    packDir: "content-packs/en/games/burn-down",
    indexPath: "content-packs/en/games/burn-down-index.json",
    helperImport: "lib/games/game-pack-copy.js",
    helperFn: "gamePackCopy",
    buildIndex: "scripts/i18n/build-game-burn-down-index.mjs",
  },
  waveGWorksheetsClassroom: {
    packDir: "content-packs/en/global-burn-down",
    indexPath: "content-packs/en/global-burn-down/burn-down-index.json",
    helperImport: "lib/i18n/global-burn-down-copy.js",
    helperFn: "globalBurnDownCopy",
    buildIndex: "scripts/i18n/build-global-burn-down-index.mjs",
  },
  seo: {
    packDir: "content-packs/en/global-burn-down",
    indexPath: "content-packs/en/global-burn-down/burn-down-index.json",
    helperImport: "lib/i18n/global-burn-down-copy.js",
    helperFn: "globalBurnDownCopy",
    buildIndex: "scripts/i18n/build-global-burn-down-index.mjs",
  },
  pwaOffline: {
    packDir: "content-packs/en/global-burn-down",
    indexPath: "content-packs/en/global-burn-down/burn-down-index.json",
    helperImport: "lib/i18n/global-burn-down-copy.js",
    helperFn: "globalBurnDownCopy",
    buildIndex: "scripts/i18n/build-global-burn-down-index.mjs",
  },
  emailsNotifications: {
    packDir: "content-packs/en/global-burn-down",
    indexPath: "content-packs/en/global-burn-down/burn-down-index.json",
    helperImport: "lib/i18n/global-burn-down-copy.js",
    helperFn: "globalBurnDownCopy",
    buildIndex: "scripts/i18n/build-global-burn-down-index.mjs",
  },
  waveFSharedUi: {
    packDir: "content-packs/en/global-burn-down",
    indexPath: "content-packs/en/global-burn-down/burn-down-index.json",
    helperImport: "lib/i18n/global-burn-down-copy.js",
    helperFn: "globalBurnDownCopy",
    buildIndex: "scripts/i18n/build-global-burn-down-index.mjs",
  },
  waveFTeacherSchool: {
    packDir: "content-packs/en/global-burn-down",
    indexPath: "content-packs/en/global-burn-down/burn-down-index.json",
    helperImport: "lib/i18n/global-burn-down-copy.js",
    helperFn: "globalBurnDownCopy",
    buildIndex: "scripts/i18n/build-global-burn-down-index.mjs",
  },
  waveFTechnical: {
    packDir: "content-packs/en/global-burn-down",
    indexPath: "content-packs/en/global-burn-down/burn-down-index.json",
    helperImport: "lib/i18n/global-burn-down-copy.js",
    helperFn: "globalBurnDownCopy",
    buildIndex: "scripts/i18n/build-global-burn-down-index.mjs",
  },
};

const ownerArgIdx = process.argv.indexOf("--owner");
const ownerFilter = ownerArgIdx >= 0 ? process.argv[ownerArgIdx + 1] : null;
const runAll = process.argv.includes("--all");

if (!runAll && !ownerFilter) {
  console.error("Usage: --owner <name> | --all");
  process.exit(1);
}

const ownersToRun = runAll
  ? Object.keys(OWNER_CONFIG)
  : ownerFilter && OWNER_CONFIG[ownerFilter]
    ? [ownerFilter]
    : [];

if (!ownersToRun.length) {
  console.error(`Unknown owner: ${ownerFilter}`);
  console.error(`Known: ${Object.keys(OWNER_CONFIG).join(", ")}`);
  process.exit(1);
}

/** @param {string} rel */
function slugFromFile(rel) {
  return rel.replace(/\.(js|jsx|mjs|cjs)$/, "").replace(/[/\\]/g, "__");
}

/** @param {string} text */
function slugKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 72);
}

/** @param {string} relFile @param {string} helperImport */
function importPath(relFile, helperImport) {
  const depth = relFile.split(/[/\\]/).length - 1;
  const relHelper = helperImport.replace(/\\/g, "/");
  return `${ "../".repeat(depth) || "./" }${relHelper}`.replace(/\/\.\//g, "/");
}

/** @param {string} src @param {string} fn @param {string} slug @param {Record<string, string>} textToKey */
function applyJsxTextReplacements(src, fn, slug, textToKey) {
  let out = src;
  for (const text of Object.keys(textToKey).sort((a, b) => b.length - a.length)) {
    if (text.length < 4 || text.includes("{") || text.includes("`")) continue;
    const key = textToKey[text];
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(
      new RegExp(`>\\s*${escaped}\\s*<`, "g"),
      `>{${fn}("${slug}", "${key}")}<`
    );
  }
  return out;
}

/** @param {string} owner @param {typeof OWNER_CONFIG[string]} config */
function migrateOwner(owner, config) {
  const packDir = path.join(root, config.packDir);
  const indexPath = path.join(root, config.indexPath);
  fs.mkdirSync(packDir, { recursive: true });

  /** @type {Record<string, Record<string, string>>} */
  let index = {};
  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  }

  const { findings } = scanRepository();
  /** @type {Map<string, typeof findings>} */
  const byFile = new Map();

  for (const f of findings) {
    const kind = classifyFindingKind(f.file, f.text, f.line);
    const { owner: fOwner, countsAsDebt } = classifyGlobalDebtOwner(f.file, f.text, f.line, kind);
    if (!countsAsDebt || fOwner !== owner) continue;
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }

  let totalKeys = 0;
  const fn = config.helperFn;

  for (const [relFile, hits] of byFile.entries()) {
    const abs = path.join(root, relFile);
    if (!fs.existsSync(abs)) continue;
    let src = fs.readFileSync(abs, "utf8");
    const slug = slugFromFile(relFile);
    /** @type {Record<string, string>} */
    const copy = { ...(index[slug] || {}) };
    /** @type {Record<string, string>} */
    const textToKey = {};
    for (const [key, val] of Object.entries(copy)) {
      textToKey[val] = key;
    }

    for (const hit of hits) {
      if (!textToKey[hit.text]) {
        let key = slugKey(hit.text) || `k_${Object.keys(copy).length + 1}`;
        let unique = key;
        let n = 2;
        while (copy[unique] && copy[unique] !== hit.text) unique = `${key}_${n++}`;
        textToKey[hit.text] = unique;
        copy[unique] = hit.text;
        totalKeys += 1;
      }
    }

    for (const text of Object.keys(textToKey).sort((a, b) => b.length - a.length)) {
      const key = textToKey[text];
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      src = src.replace(new RegExp(`"${escaped}"`, "g"), `${fn}("${slug}", "${key}")`);
      src = src.replace(new RegExp(`'${escaped}'`, "g"), `${fn}("${slug}", "${key}")`);
    }
    src = applyJsxTextReplacements(src, fn, slug, textToKey);

    if (Object.keys(copy).length) {
      fs.writeFileSync(path.join(packDir, `${slug}.json`), `${JSON.stringify({ copy }, null, 2)}\n`, "utf8");
      index[slug] = copy;
      const importRe = new RegExp(`import\\s+\\{[^}]*\\b${fn}\\b`);
      if (!importRe.test(src)) {
        const importLine = `import { ${fn} } from "${importPath(relFile, config.helperImport)}";\n`;
        const idx = src.search(/^import /m);
        src = idx >= 0 ? src.slice(0, idx) + importLine + src.slice(idx) : importLine + src;
      }
      fs.writeFileSync(abs, src, "utf8");
      const remaining = scanSource(relFile, src).filter((h) => {
        const kind = classifyFindingKind(relFile, h.text, h.line);
        const { owner: fo, countsAsDebt } = classifyGlobalDebtOwner(relFile, h.text, h.line, kind);
        return countsAsDebt && fo === owner;
      }).length;
      console.log(`[${owner}]`, relFile, Object.keys(copy).length, "remaining", remaining);
    }
  }

  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.log(`[${owner}] total keys`, totalKeys, "files", byFile.size);
}

for (const owner of ownersToRun) {
  migrateOwner(owner, OWNER_CONFIG[owner]);
}

console.log("owners migrated:", ownersToRun.join(", "));
