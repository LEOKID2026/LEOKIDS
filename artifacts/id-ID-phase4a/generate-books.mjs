/**
 * Phase 4A — generate content-packs/id-ID/books/** from English SoT + dictionary.
 * Does NOT register packs. Artifacts only under artifacts/id-ID-phase4a/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN_ROOT = path.join(ROOT, "content-packs", "en", "books");
const ID_ROOT = path.join(ROOT, "content-packs", "id-ID", "books");
const DICT_PATH = path.join(__dirname, "en-to-id-dict.json");

const dict = JSON.parse(fs.readFileSync(DICT_PATH, "utf8"));

/** Technical / identity fields — never translate */
const KEEP_KEY_EXACT = new Set([
  "skillId",
  "learningPageId",
  "pageType",
  "learningLanguage",
  "doNotTranslateFields",
]);

/**
 * @param {string} dir
 * @param {string[]} acc
 */
function walkJson(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, acc);
    else if (ent.name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

/**
 * @param {unknown} node
 * @param {{ fileRel: string, inDoNotTranslateDescription: boolean, parentKey: string | null }} ctx
 * @returns {unknown}
 */
function transform(node, ctx) {
  if (Array.isArray(node)) {
    // doNotTranslateFields arrays stay byte-identical
    if (ctx.parentKey === "doNotTranslateFields") return node.map((x) => x);
    return node.map((item) =>
      transform(item, { ...ctx, parentKey: null, inDoNotTranslateDescription: false })
    );
  }
  if (node === null || typeof node !== "object") {
    if (typeof node !== "string") return node;
    // Empty learningPageId etc.
    if (node === "") return node;
    // Force-keep english-page-skills descriptions (all marked doNotTranslate)
    if (ctx.inDoNotTranslateDescription || ctx.parentKey === "description") {
      if (ctx.fileRel.replace(/\\/g, "/").endsWith("english-page-skills.json")) {
        return node;
      }
    }
    if (ctx.parentKey && KEEP_KEY_EXACT.has(ctx.parentKey)) return node;
    if (Object.prototype.hasOwnProperty.call(dict, node)) return dict[node];
    // Unknown string — leave as-is but record later via audit
    return node;
  }

  /** @type {Record<string, unknown>} */
  const out = {};
  const dnt = Array.isArray(/** @type {any} */ (node).doNotTranslateFields)
    ? /** @type {string[]} */ (/** @type {any} */ (node).doNotTranslateFields)
    : [];

  for (const [key, value] of Object.entries(/** @type {Record<string, unknown>} */ (node))) {
    // section map keys are English lookup keys — preserve key, translate value
    const nextCtx = {
      ...ctx,
      parentKey: key,
      inDoNotTranslateDescription: dnt.includes(key) || (key === "description" && dnt.includes("description")),
    };
    out[key] = transform(value, nextCtx);
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  const files = walkJson(EN_ROOT);
  let written = 0;
  const unmapped = new Map();

  for (const enPath of files) {
    const rel = path.relative(EN_ROOT, enPath);
    const idPath = path.join(ID_ROOT, rel);
    ensureDir(path.dirname(idPath));
    const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const id = transform(en, {
      fileRel: rel,
      inDoNotTranslateDescription: false,
      parentKey: null,
    });

    // Collect unmapped user-facing strings (non-technical)
    collectUnmapped(en, id, rel, "", unmapped);

    fs.writeFileSync(idPath, JSON.stringify(id, null, 2) + "\n", "utf8");
    written++;
  }

  const report = {
    written,
    unmappedCount: unmapped.size,
    unmapped: [...unmapped.entries()].slice(0, 50).map(([v, locs]) => ({ v, locs })),
  };
  fs.writeFileSync(path.join(__dirname, "generate-report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ written, unmappedCount: unmapped.size }, null, 2));
}

/**
 * @param {unknown} en
 * @param {unknown} id
 * @param {string} file
 * @param {string} p
 * @param {Map<string, string[]>} unmapped
 */
function collectUnmapped(en, id, file, p, unmapped) {
  if (typeof en === "string" && typeof id === "string") {
    if (en === id && /[A-Za-z]{3,}/.test(en) && !Object.prototype.hasOwnProperty.call(dict, en)) {
      const leaf = p.split(".").pop() || "";
      if (KEEP_KEY_EXACT.has(leaf)) return;
      if (leaf === "description" && file.replace(/\\/g, "/").endsWith("english-page-skills.json")) return;
      if (!unmapped.has(en)) unmapped.set(en, []);
      unmapped.get(en).push(`${file}:${p}`);
    }
    return;
  }
  if (!en || typeof en !== "object" || !id || typeof id !== "object") return;
  if (Array.isArray(en)) return;
  for (const k of Object.keys(/** @type {object} */ (en))) {
    collectUnmapped(
      /** @type {any} */ (en)[k],
      /** @type {any} */ (id)[k],
      file,
      p ? `${p}.${k}` : k,
      unmapped
    );
  }
}

main();
