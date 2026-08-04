/**
 * Generate docs/learning-book/fr-FR/** from docs/learning-book/en/**.
 * Protects English educational targets in english/ subject books.
 *
 * Run: node scripts/i18n/generate-learning-book-fr-FR.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyGlossaryHints,
  applySurfaceTone,
  loadCache,
  mtTranslate,
  saveCache,
} from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "docs/learning-book/en");
const OUT = path.join(ROOT, "docs/learning-book/fr-FR");
const CACHE_PATH = path.join(__dirname, "_mt-cache-fr-FR-learning-book.json");

const STRUCTURAL_FM_KEYS = new Set([
  "id",
  "pageId",
  "slug",
  "subject",
  "grade",
  "topicId",
  "skillId",
  "order",
  "status",
  "locale",
  "type",
  "kind",
  "batchId",
  "prev",
  "next",
]);

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith(".md")) files.push(p);
  }
  return files;
}

function protectCode(s) {
  /** @type {string[]} */
  const ph = [];
  let out = String(s).replace(/`([^`]+)`/g, (_, code) => {
    ph.push(code);
    return `⟦C${ph.length - 1}⟧`;
  });
  out = out.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    ph.push(expr);
    return `⟦P${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restoreCode(s, ph) {
  return String(s)
    .replace(/⟦C(\d+)⟧/g, (_, i) => `\`${ph[Number(i)]}\``)
    .replace(/⟦P(\d+)⟧/g, (_, i) => `\${${ph[Number(i)]}}`);
}

/** Protect English teaching forms inside english/ subject books. */
function protectEnglishTargets(text, isEnglishSubject) {
  if (!isEnglishSubject) return { text, ph: [] };
  /** @type {string[]} */
  const ph = [];
  let out = String(text);
  // Quoted English
  out = out.replace(/"([^"\n]{1,80})"/g, (m, inner) => {
    if (!/^[A-Za-z]/.test(inner)) return m;
    ph.push(m);
    return `⟦E${ph.length - 1}⟧`;
  });
  // Common be / grammar patterns on their own line or as tokens
  out = out.replace(
    /\b((?:I|You|He|She|It|We|They)\s+(?:am|are|is|was|were|have|has|do|does|did|can|will|won't|don't|doesn't)(?:\s+[A-Za-z']+)?)\b/g,
    (m) => {
      ph.push(m);
      return `⟦E${ph.length - 1}⟧`;
    },
  );
  return { text: out, ph };
}

function restoreEnglishTargets(text, ph) {
  return String(text).replace(/⟦E(\d+)⟧/g, (_, i) => ph[Number(i)] ?? "");
}

function looksLikeEnglishExampleLine(line, isEnglishSubject) {
  if (!isEnglishSubject) return false;
  const t = line.trim();
  if (!t) return false;
  if (/^#{1,6}\s+/.test(t)) return false;
  if (/^\|/.test(t)) return false;
  if (/^[-*]/.test(t)) return false;
  // Short English-only example lines
  if (/^[A-Za-z][A-Za-z' ,.!?\-]{0,60}$/.test(t) && !/\b(the|and|with|for|from|this|that|learning|today)\b/i.test(t)) {
    if (/^(I|You|He|She|It|We|They|This|That|a|an|the)\b/.test(t) || t.split(/\s+/).length <= 5) {
      return /^(I|You|He|She|It|We|They)\b/.test(t) || /^[A-Z][a-z]+(\s+[a-z]+){0,3}$/.test(t);
    }
  }
  return false;
}

async function translateChunk(en, cache, isEnglishSubject) {
  const s = String(en || "");
  if (!s.trim()) return s;
  if (!/[A-Za-z]/.test(s)) return s;
  if (cache[s]) return applySurfaceTone(applyGlossaryHints(cache[s]), "child");

  const code = protectCode(s);
  const eng = protectEnglishTargets(code.text, isEnglishSubject);
  try {
    let out = await mtTranslate(eng.text);
    out = restoreEnglishTargets(out, eng.ph);
    out = restoreCode(out, code.ph);
    out = applyGlossaryHints(out);
    out = applySurfaceTone(out, "child");
    // Restore protected English if MT mangled markers
    for (let i = 0; i < eng.ph.length; i++) {
      const marker = `⟦E${i}⟧`;
      if (out.includes(marker)) out = out.split(marker).join(eng.ph[i]);
    }
    cache[s] = out;
    return out;
  } catch (err) {
    console.warn("MT fail", s.slice(0, 50), err.message);
    return s;
  }
}

async function translateMarkdown(md, cache, isEnglishSubject) {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fm) {
    // Many learning-book drafts are heading-first without YAML frontmatter
    return translateBody(md, cache, isEnglishSubject);
  }
  const yaml = fm[1];
  const body = fm[2];
  const yamlLines = yaml.split(/\r?\n/);
  const outYaml = [];
  for (const line of yamlLines) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) {
      outYaml.push(line);
      continue;
    }
    const key = m[1];
    const val = m[2];
    if (STRUCTURAL_FM_KEYS.has(key) || key === "title_english" || key === "learning_page_id" || key === "skill_id") {
      outYaml.push(line);
      continue;
    }
    if (!val || val === '""' || val === "''" || /^[\[{]/.test(val.trim())) {
      outYaml.push(line);
      continue;
    }
    const quote = val.startsWith('"') || val.startsWith("'") ? val[0] : "";
    const inner = quote ? val.slice(1, -1) : val;
    if (!/[A-Za-z]/.test(inner)) {
      outYaml.push(line);
      continue;
    }
    const translated = await translateChunk(inner, cache, isEnglishSubject);
    outYaml.push(quote ? `${key}: ${quote}${translated}${quote}` : `${key}: ${translated}`);
  }

  const outBody = await translateBody(body, cache, isEnglishSubject);
  return `---\n${outYaml.join("\n")}\n---\n${outBody}`;
}

async function translateBody(body, cache, isEnglishSubject) {
  const bodyLines = body.split(/\r?\n/);
  /** @type {string[]} */
  const outBody = [];
  let buf = [];
  let inFence = false;

  const flush = async () => {
    if (!buf.length) return;
    const chunk = buf.join("\n");
    buf = [];
    if (!/[A-Za-z]/.test(chunk)) {
      outBody.push(chunk);
      return;
    }
    if (/^[\s#>*\-\d\.\$\\π=+\-×÷\/\(\)\[\],.:;_%]+$/m.test(chunk) && !/[A-Za-z]{3,}/.test(chunk)) {
      outBody.push(chunk);
      return;
    }
    outBody.push(await translateChunk(chunk, cache, isEnglishSubject));
  };

  for (const line of bodyLines) {
    if (/^```/.test(line)) {
      await flush();
      inFence = !inFence;
      outBody.push(line);
      continue;
    }
    if (inFence) {
      outBody.push(line);
      continue;
    }
    // Metadata table: keep backtick IDs / structural values; translate labels cautiously
    if (/^\|/.test(line)) {
      await flush();
      if (/\`[a-z0-9:_-]+\`/i.test(line) || /\|\s*\*\*[A-Za-z_]+\*\*\s*\|/.test(line)) {
        // Translate left label cells only when they are Field/Value style English labels
        const cells = line.split("|");
        const outCells = [];
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          const trimmed = cell.trim();
          if (!trimmed || trimmed.startsWith("`") || /^:?-+:?$/.test(trimmed) || trimmed.startsWith("**learning") || trimmed.startsWith("**skill") || trimmed === "g1" || trimmed === "g2" || trimmed === "g3" || trimmed === "g4" || trimmed === "g5" || trimmed === "g6" || trimmed === "english" || trimmed === "math" || trimmed === "science" || trimmed === "geometry") {
            outCells.push(cell);
            continue;
          }
          if (/^[A-Za-z]/.test(trimmed) && !trimmed.startsWith("`") && i === 1) {
            // label column
            const t = await translateChunk(trimmed.replace(/^\*\*|\*\*$/g, ""), cache, false);
            const bold = /^\*\*.*\*\*$/.test(trimmed);
            outCells.push(bold ? ` **${t}** ` : ` ${t} `);
          } else if (trimmed.startsWith("**title_english**") || /title_english/i.test(trimmed)) {
            outCells.push(cell);
          } else {
            outCells.push(cell);
          }
        }
        outBody.push(outCells.join("|"));
      } else {
        outBody.push(line);
      }
      continue;
    }
    if (looksLikeEnglishExampleLine(line, isEnglishSubject)) {
      await flush();
      outBody.push(line);
      continue;
    }
    if (/^#{1,6}\s+/.test(line)) {
      await flush();
      const m = line.match(/^(#{1,6}\s+)(.*)$/);
      if (m && /[A-Za-z]/.test(m[2])) {
        // Keep English grammar forms in headings when they are the learning target
        if (isEnglishSubject && /^(I am|You are|He is|She is|We are|They are)\b/.test(m[2])) {
          outBody.push(line);
        } else {
          outBody.push(m[1] + (await translateChunk(m[2], cache, isEnglishSubject)));
        }
      } else {
        outBody.push(line);
      }
      continue;
    }
    if (!line.trim()) {
      await flush();
      outBody.push(line);
      continue;
    }
    // Keep source reference paths
    if (/^-\s+`[^`]+`$/.test(line.trim()) || /^-\s+docs\//.test(line.trim()) || /^-\s+data\//.test(line.trim())) {
      await flush();
      outBody.push(line);
      continue;
    }
    buf.push(line);
  }
  await flush();
  return outBody.join("\n");
}

async function main() {
  const FORCE = process.argv.includes("--force");
  const files = walk(SRC);
  console.log("EN drafts:", files.length);
  const cache = loadCache(CACHE_PATH);
  let done = 0;
  let skipped = 0;
  let wrote = 0;
  for (const file of files) {
    const rel = path.relative(SRC, file);
    const outFile = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    done += 1;
    if (
      !FORCE &&
      fs.existsSync(outFile) &&
      fs.statSync(outFile).size > 40
    ) {
      skipped += 1;
      if (done % 50 === 0 || done === files.length) {
        console.log(`Progress ${done}/${files.length} (skip existing ${skipped}, wrote ${wrote})`);
      }
      continue;
    }
    const isEnglishSubject = rel.split(path.sep).includes("english") || rel.includes("/english/");
    const raw = fs.readFileSync(file, "utf8");
    const translated = await translateMarkdown(raw, cache, isEnglishSubject);
    fs.writeFileSync(outFile, translated, "utf8");
    wrote += 1;
    if (wrote % 10 === 0 || done === files.length) {
      saveCache(CACHE_PATH, cache);
      console.log(`Progress ${done}/${files.length} (skip existing ${skipped}, wrote ${wrote})`);
    }
    await new Promise((r) => setTimeout(r, 30));
  }
  saveCache(CACHE_PATH, cache);
  console.log("Done. Wrote", wrote, "skipped", skipped, "total", done, "→", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
