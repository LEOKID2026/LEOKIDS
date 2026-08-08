/**
 * Re-export need-chunks with stronger identity protection for tokens/enums/diagrams.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CHROME_EXACT } from "./id-book-phrases.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "artifacts/id-ID-phase8");
const lines = JSON.parse(fs.readFileSync(path.join(OUT, "unique-lines.json"), "utf8"));
const titles = JSON.parse(fs.readFileSync(path.join(OUT, "titles-only.json"), "utf8"));
const phase4a = JSON.parse(fs.readFileSync(path.join(ROOT, "artifacts/id-ID-phase4a/en-to-id-dict.json"), "utf8"));
const phase4d = JSON.parse(fs.readFileSync(path.join(ROOT, "artifacts/id-ID-phase4d/learning-dict.json"), "utf8"));

const exact = { ...CHROME_EXACT };

for (const { en } of titles) {
  const bare = en.replace(/^#\s+/, "").trim();
  if (phase4a[bare] && phase4a[bare] !== bare) exact[en] = `# ${phase4a[bare]}`;
}

for (const { en } of lines) {
  if (exact[en]) continue;
  if (phase4a[en] && phase4a[en] !== en) exact[en] = phase4a[en];
  else if (phase4d[en] && phase4d[en] !== en) exact[en] = phase4d[en];
}

const META_KEYS =
  /learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english/i;

function isIdentity(t) {
  if (!t.trim()) return true;
  if (/^```/.test(t)) return true;
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(t)) return true;
  if (/^[\d\s+\-×÷=*/?.,…()\[\]{}%°:<>≤≥≠≈∞√π]+$/.test(t)) return true;
  if (/^`[^`]+`$/.test(t)) return true;
  if (/^:::/.test(t)) return true;
  if (/^[-*]\s*`[^`]+`\s*$/.test(t)) return true;
  if (/^-\s*`?(data|docs|lib|utils|content-packs|scripts|public|components|pages)\//.test(t)) return true;
  // metadata rows — keep enum/token values (IDs, page_type, approval_status, grade codes)
  if (/^\|/.test(t) && META_KEYS.test(t)) return true;
  // diagram / yaml-ish machine lines
  if (/^(type|width|height|unit|label|labels|points|show|fill|stroke|size|color|colours|colors|grid|rows|cols|title|caption|variant|kind|id|ids|src|href|anchor|page_id|skill|skills)\s*:/i.test(t))
    return true;
  // pure equations with words only as var names short
  if (/[=+\-×÷]/.test(t) && !/[A-Za-z]{4,}/.test(t)) return true;
  // HTML-like / markdown image
  if (/^!\[[^\]]*\]\([^)]+\)/.test(t)) return true;
  if (/^<[^>]+>/.test(t)) return true;
  return false;
}

const need = [];
let identity = 0;
for (const { en, n } of lines) {
  if (exact[en]) continue;
  if (isIdentity(en)) {
    exact[en] = en;
    identity += 1;
    continue;
  }
  need.push({ en, n });
}

fs.writeFileSync(path.join(OUT, "exact-seed.json"), JSON.stringify(exact, null, 2));

const CHUNK = 200;
const chunkDir = path.join(OUT, "dict-chunks");
fs.rmSync(chunkDir, { recursive: true, force: true });
fs.mkdirSync(chunkDir, { recursive: true });
const chunkMeta = [];
for (let i = 0; i < need.length; i += CHUNK) {
  const slice = need.slice(i, i + CHUNK);
  const idx = Math.floor(i / CHUNK);
  const file = `need-${String(idx).padStart(3, "0")}.json`;
  fs.writeFileSync(path.join(chunkDir, file), JSON.stringify(slice.map((x) => x.en), null, 2));
  chunkMeta.push({ file, count: slice.length });
}

fs.writeFileSync(
  path.join(OUT, "dict-chunk-meta.json"),
  JSON.stringify(
    {
      seededExact: Object.keys(exact).length,
      identityAdded: identity,
      needTranslation: need.length,
      chunks: chunkMeta.length,
      chunkMeta,
    },
    null,
    2
  )
);
console.log({
  seededExact: Object.keys(exact).length,
  identityAdded: identity,
  need: need.length,
  chunks: chunkMeta.length,
});
