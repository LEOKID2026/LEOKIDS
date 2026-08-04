/**
 * Generate locales/pt-BR + content-packs/pt-BR from English sources.
 *
 * - Walks JSON recursively; preserves keys and non-string leaves
 * - Translates user-facing string VALUES only (Google gtx MT tl=pt + glossary)
 * - Applies Brazilian Portuguese post-fixes (você, celular, 1º ano, …)
 * - Skips ids/paths/urls/enums; protects {placeholders}
 *
 * Run: node scripts/i18n/generate-pt-BR-layer.mjs
 * Optional: --force  retranslate even if cache hit
 * Optional: --dry    print stats only
 * Optional: --namespaces-only
 * Optional: --packs-only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PORTUGUESE_BRAZIL_GLOSSARY,
  FORBIDDEN_PT_BR_PATTERNS,
} from "../../lib/i18n/portuguese-brazil-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-pt-BR.json");
const REPORT_PATH = path.join(__dirname, "_pt-BR-layer-report.json");

const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const NAMESPACES_ONLY = process.argv.includes("--namespaces-only");
const PACKS_ONLY = process.argv.includes("--packs-only");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

const SKIP_VALUE_KEYS = new Set([
  "id",
  "ids",
  "skillId",
  "pageType",
  "learningPageId",
  "learningLanguage",
  "gameId",
  "subjectId",
  "topicId",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "icon",
  "image",
  "imageSrc",
  "asset",
  "assetPath",
  "font",
  "ttf",
  "locale",
  "localeId",
  "contentLocale",
  "enum",
  "key",
  "code",
  "type",
  "kind",
  "status",
  "severity",
  "version",
  "sha",
  "hash",
  "color",
  "bg",
  "background",
  "className",
  "component",
  "file",
  "filename",
  "ext",
  "mime",
  "doNotTranslateFields",
]);

const EXACT_OVERRIDES = {
  Math: "Matemática",
  Geometry: "Geometria",
  English: "Inglês",
  Science: "Ciências",
  Strength: "Ponto forte",
  "Area to strengthen": "Área para reforçar",
  "Worth strengthening": "Área para reforçar",
  "Parent report": "Relatório para responsáveis",
  "Learning pattern": "Padrão de aprendizagem",
  Progress: "Progresso",
  Improvement: "Melhora",
  Practice: "Prática",
  Start: "Começar",
  Continue: "Continuar",
  "Try again": "Tentar de novo",
  Check: "Conferir",
  Next: "Próximo",
  Back: "Voltar",
  Play: "Jogar",
  Finish: "Concluir",
  Loading: "Carregando…",
  "Loading...": "Carregando…",
  Save: "Salvar",
  Cancel: "Cancelar",
  Delete: "Excluir",
  Close: "Fechar",
  Hint: "Dica",
  Addition: "Adição",
  Subtraction: "Subtração",
  Multiplication: "Multiplicação",
  Division: "Divisão",
  Fractions: "Frações",
  Percentages: "Porcentagens",
  Sequences: "Sequências",
  Decimals: "Decimais",
  Rounding: "Arredondamento",
  Equations: "Equações",
  Patterns: "Padrões",
  Vocabulary: "Vocabulário",
  Grammar: "Gramática",
  Phonics: "Fonética",
  Writing: "Escrita",
  Reading: "Leitura",
  "Reading comprehension": "Compreensão de leitura",
  Shapes: "Formas",
  "Basic shapes": "Formas básicas",
  Area: "Área",
  Perimeter: "Perímetro",
  Volume: "Volume",
  Angles: "Ângulos",
  Triangles: "Triângulos",
  Circles: "Círculos",
  Symmetry: "Simetria",
  Coordinates: "Coordenadas",
  Animals: "Animais",
  Plants: "Plantas",
  Materials: "Materiais",
  "Mixed practice": "Prática mista",
  "Word problems": "Problemas de palavras",
  "Place value": "Valor posicional",
  "Number sense": "Senso numérico",
  "Grade 1": "1º ano",
  "Grade 2": "2º ano",
  "Grade 3": "3º ano",
  "Grade 4": "4º ano",
  "Grade 5": "5º ano",
  "Grade 6": "6º ano",
  "Grade {grade}": "{grade}º ano",
  "Grades 1–2": "1º–2º ano",
  "Grades 3–4": "3º–4º ano",
  "Grades 5–6": "5º–6º ano",
  Grade: "Ano",
  "All grades": "Todos os anos",
  "Choose grade": "Escolher ano",
  "Select grade": "Escolher ano",
  "Current grade": "Ano atual",
  "Invalid grade": "Ano inválido",
  "Invalid grade. Please choose another grade.": "Ano inválido. Escolha outro ano.",
  "That grade is not valid.": "Esse ano não é válido.",
  "Allow child to pick grade on learning pages": "Permitir que a criança escolha o ano nas páginas de aprendizagem",

  Worksheet: "Folha de atividades",
  Worksheets: "Folhas de atividades",
  Regular: "Comum",
  Special: "Especial",
  Rare: "Rara",
  Gold: "Ouro",
  "Surprise box": "Caixa surpresa",
  Locked: "Bloqueada",
  "My cards": "Minhas cartas",
  "My collection": "Minha coleção",
  "Card shop": "Loja de cartas",
  "All cards": "Todas as cartas",
  Series: "Séries",
  Buy: "Comprar",
  "Sell duplicate": "Vender duplicata",
  "Open box": "Abrir caixa",
  "Table of contents": "Índice",
  "Coming soon": "Em breve",
  "Previous page": "Página anterior",
  "Next page": "Próxima página",
  "Previous topic": "Tema anterior",
  "Next topic": "Próximo tema",
  "Let's practice now": "Vamos praticar agora",
  "Practice with questions": "Praticar com perguntas",
  "Book reading": "Leitura do livro",
  Parent: "Responsável",
  Parents: "Responsáveis",
  Student: "Aluno",
  Students: "Alunos",
  Teacher: "Professor",
  Teachers: "Professores",
  School: "Escola",
  Answers: "Respostas",
  Answer: "Resposta",
  File: "Arquivo",
  Video: "Vídeo",
  Phone: "Celular",
  Computer: "Computador",
  Laptop: "Notebook",
};

const POST_PHRASE_FIXES = [
  [/telemóvel/gi, "celular"],
  [/autocarro/gi, "ônibus"],
  [/comboio/gi, "trem"],
  [/pequeno[- ]almoço/gi, "café da manhã"],
  [/\becrã\b/gi, "tela"],
  [/\becrá\b/gi, "tela"],
  [/ficheiro/gi, "arquivo"],
  [/\baplicação\b/gi, "aplicativo"],
  [/descarregar/gi, "baixar"],
  [/descarregue/gi, "baixe"],
  [/descarrega/gi, "baixa"],
  [/\becrãs\b/gi, "telas"],
  [/\butilizador(?:es)?\b/gi, "usuário"],
  [/\bequipa\b/gi, "equipe"],
  [/\bpalavra[- ]passe\b/gi, "senha"],
  [/\bpalavra[- ]chave\b/gi, "senha"],
  [/\bGrau 1\b/g, "1º ano"],
  [/\bGrau 2\b/g, "2º ano"],
  [/\bGrau 3\b/g, "3º ano"],
  [/\bGrau 4\b/g, "4º ano"],
  [/\bGrau 5\b/g, "5º ano"],
  [/\bGrau 6\b/g, "6º ano"],
  [/\bGrade 1\b/g, "1º ano"],
  [/\bGrade 2\b/g, "2º ano"],
  [/\bGrade 3\b/g, "3º ano"],
  [/\bGrade 4\b/g, "4º ano"],
  [/\bGrade 5\b/g, "5º ano"],
  [/\bGrade 6\b/g, "6º ano"],
  [/\bAno 1\b/g, "1º ano"],
  [/\bAno 2\b/g, "2º ano"],
  [/\bAno 3\b/g, "3º ano"],
  [/\bAno 4\b/g, "4º ano"],
  [/\bAno 5\b/g, "5º ano"],
  [/\bAno 6\b/g, "6º ano"],
  [/\b1º grau\b/gi, "1º ano"],
  [/\b2º grau\b/gi, "2º ano"],
  [/\b3º grau\b/gi, "3º ano"],
  [/\b4º grau\b/gi, "4º ano"],
  [/\b5º grau\b/gi, "5º ano"],
  [/\b6º grau\b/gi, "6º ano"],
  [/\bpais\b/g, "responsáveis"],
  [/\bPais\b/g, "Responsáveis"],
  [/folha de trabalho/gi, "folha de atividades"],
  [/folhas de trabalho/gi, "folhas de atividades"],
  [/planilha/gi, "folha de atividades"],
  [/\bvós\b/gi, "vocês"],
  [/\b(tu|teu|tua|teus|tuas)\b/gi, (m) => {
    const map = {
      tu: "você",
      teu: "seu",
      tua: "sua",
      teus: "seus",
      tuas: "suas",
    };
    return map[m.toLowerCase()] || m;
  }],
  [/\b(tens|podes|queres|fazes|vês)\b/gi, (m) => {
    const map = {
      tens: "tem",
      podes: "pode",
      queres: "quer",
      fazes: "faz",
      vês: "vê",
    };
    return map[m.toLowerCase()] || m;
  }],
];

function looksNonTranslate(s) {
  if (s == null) return true;
  const str = String(s);
  if (!str.trim()) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str)) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(str)) return true;
  if (/^\d+(\.\d+)?%?$/.test(str)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(str) && str.length <= 48) return true;
  if (/[\u0590-\u05FF]/.test(str) && !/[A-Za-z]/.test(str)) return true;
  if (!/\s/.test(str)) {
    if (/^[a-z0-9]+([_/.-][a-z0-9]+)+$/i.test(str)) return true;
    if (/^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(str)) return true;
    if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
    if (/\.(png|jpe?g|gif|webp|svg|ttf|woff2?|json|js|css|mp3|wav|pdf)$/i.test(str)) return true;
  }
  return false;
}

function protectPlaceholders(s) {
  /** @type {string[]} */
  const ph = [];
  const out = String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    ph.push(name);
    return `⟦${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restorePlaceholders(s, ph) {
  return String(s).replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `{${ph[Number(i)]}}`);
}

function applyGlossaryHints(text) {
  let out = text;
  for (const [enTerm, entry] of Object.entries(PORTUGUESE_BRAZIL_GLOSSARY)) {
    if (!entry?.preferred) continue;
    if (!/[A-Za-z]/.test(enTerm)) continue;
    if (enTerm.length < 4) continue;
    const re = new RegExp(`\\b${escapeRegExp(enTerm)}\\b`, "g");
    out = out.replace(re, entry.preferred);
  }
  for (const [re, rep] of POST_PHRASE_FIXES) {
    out = out.replace(re, rep);
  }
  return out;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasForbidden(text) {
  return FORBIDDEN_PT_BR_PATTERNS.some((p) => p.re.test(text));
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

async function mtTranslate(text) {
  // Google gtx: tl=pt yields Brazilian Portuguese for most educational UI copy.
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateString(en, cache) {
  if (looksNonTranslate(en)) return { value: en, source: "skip" };
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, en)) {
    return { value: EXACT_OVERRIDES[en], source: "override" };
  }
  if (!FORCE && cache[en]) {
    return { value: applyGlossaryHints(cache[en]), source: "cache" };
  }

  const { text, ph } = protectPlaceholders(en);
  let translated;
  try {
    translated = await mtTranslate(text);
  } catch (err) {
    console.warn("MT fail:", en.slice(0, 60), err.message);
    return { value: en, source: "mt-fail" };
  }
  translated = restorePlaceholders(translated, ph);
  translated = applyGlossaryHints(translated);

  const enPh = [...en.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  const ptPh = [...translated.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  if (enPh !== ptPh) {
    console.warn("placeholder mismatch, keeping EN:", en.slice(0, 80));
    return { value: en, source: "ph-mismatch" };
  }

  cache[en] = translated;
  return { value: translated, source: "mt" };
}

function listJsonFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const fp = path.join(p, ent.name);
      if (ent.isDirectory()) walk(fp);
      else if (ent.name.endsWith(".json")) out.push(fp);
    }
  })(dir);
  return out;
}

async function transformNode(node, ctx, translateFn) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (ctx.preserveString) return node;
    if (ctx.key && SKIP_VALUE_KEYS.has(ctx.key)) return node;
    if (ctx.doNotTranslate && ctx.key && ctx.doNotTranslate.has(ctx.key)) return node;
    return translateFn(node, ctx.key);
  }
  if (typeof node !== "object") return node;
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) {
      out.push(
        await transformNode(
          item,
          {
            doNotTranslate: ctx.doNotTranslate,
            preserveString: ctx.preserveArrayStrings || ctx.preserveString,
          },
          translateFn,
        ),
      );
    }
    return out;
  }

  /** @type {Set<string>|undefined} */
  let childSkip = ctx.doNotTranslate;
  if (Array.isArray(node.doNotTranslateFields)) {
    childSkip = new Set([...(childSkip || []), ...node.doNotTranslateFields.map(String)]);
  }

  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    out[k] = await transformNode(
      v,
      {
        key: k,
        doNotTranslate: childSkip,
        preserveArrayStrings: k === "doNotTranslateFields",
      },
      translateFn,
    );
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function collectStrings(node, key, skipFields, unique) {
  if (node == null) return;
  if (typeof node === "string") {
    if (key && SKIP_VALUE_KEYS.has(key)) return;
    if (skipFields && key && skipFields.has(key)) return;
    if (!looksNonTranslate(node)) unique.add(node);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((x) => collectStrings(x, undefined, skipFields, unique));
    return;
  }
  if (typeof node === "object") {
    let childSkip = skipFields;
    if (Array.isArray(node.doNotTranslateFields)) {
      childSkip = new Set([...(childSkip || []), ...node.doNotTranslateFields.map(String)]);
    }
    for (const [k, v] of Object.entries(node)) collectStrings(v, k, childSkip, unique);
  }
}

async function fillCache(unique, cache) {
  const pending = [...unique].filter((s) => FORCE || !cache[s]);
  console.log("Need MT resolve:", pending.length);
  const CONCURRENCY = 8;
  let done = 0;
  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const chunk = pending.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (s) => translateString(s, cache)));
    done += chunk.length;
    if (done % 80 === 0 || done >= pending.length) {
      saveCache(cache);
      console.log(`Cache progress ${Math.min(done, pending.length)}/${pending.length}`);
    }
    await new Promise((r) => setTimeout(r, 40));
  }
  saveCache(cache);
}

async function translateTree(raw, cache, stats) {
  const inflight = new Map();
  async function translateFn(s) {
    stats.stringsSeen++;
    if (looksNonTranslate(s)) {
      stats.skipped++;
      stats.bySource.skip = (stats.bySource.skip || 0) + 1;
      return s;
    }
    let p = inflight.get(s);
    if (!p) {
      p = translateString(s, cache).then((r) => {
        if (r.source === "mt-fail" || r.source === "ph-mismatch") stats.mtFails++;
        if (r.value !== s) stats.translated++;
        stats.bySource[r.source] = (stats.bySource[r.source] || 0) + 1;
        if (hasForbidden(r.value)) {
          stats.forbiddenHits.push({ en: s, pt: r.value });
        }
        return r;
      });
      inflight.set(s, p);
    }
    return (await p).value;
  }
  return transformNode(raw, {}, translateFn);
}

async function generateNamespaces(cache, stats) {
  const srcDir = path.join(ROOT, "locales", "en");
  const outDir = path.join(ROOT, "locales", "pt-BR");
  ensureDir(outDir);
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"));
  const unique = new Set();
  for (const f of files) {
    collectStrings(JSON.parse(fs.readFileSync(path.join(srcDir, f), "utf8")), undefined, undefined, unique);
  }
  console.log("Namespaces unique strings:", unique.size);
  if (DRY) return;
  await fillCache(unique, cache);
  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(srcDir, f), "utf8"));
    const translated = await translateTree(raw, cache, stats);
    fs.writeFileSync(path.join(outDir, f), `${JSON.stringify(translated, null, 2)}\n`, "utf8");
    stats.namespaceFiles++;
  }
}

async function generatePacks(cache, stats) {
  const srcRoot = path.join(ROOT, "content-packs", "en");
  const outRoot = path.join(ROOT, "content-packs", "pt-BR");
  const allFiles = [];
  for (const d of DOMAINS) {
    const files = listJsonFiles(path.join(srcRoot, d));
    stats.domains[d] = files.length;
    for (const f of files) allFiles.push(f);
  }
  const unique = new Set();
  for (const file of allFiles) {
    collectStrings(JSON.parse(fs.readFileSync(file, "utf8")), undefined, undefined, unique);
  }
  console.log("Pack files:", allFiles.length, "unique strings:", unique.size);
  if (DRY) return;
  await fillCache(unique, cache);
  for (const file of allFiles) {
    const rel = path.relative(srcRoot, file);
    const outFile = path.join(outRoot, rel);
    ensureDir(path.dirname(outFile));
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const translated = await translateTree(raw, cache, stats);
    fs.writeFileSync(outFile, `${JSON.stringify(translated, null, 2)}\n`, "utf8");
    stats.packFiles++;
  }
}

async function main() {
  const cache = loadCache();
  const stats = {
    namespaceFiles: 0,
    packFiles: 0,
    stringsSeen: 0,
    translated: 0,
    skipped: 0,
    bySource: {},
    domains: {},
    forbiddenHits: [],
    mtFails: 0,
  };

  if (!PACKS_ONLY) {
    console.log("=== locales/pt-BR ===");
    await generateNamespaces(cache, stats);
  }
  if (!NAMESPACES_ONLY) {
    console.log("=== content-packs/pt-BR ===");
    await generatePacks(cache, stats);
  }

  stats.forbiddenHits = stats.forbiddenHits.slice(0, 80);
  stats.cacheSize = Object.keys(cache).length;
  fs.writeFileSync(REPORT_PATH, JSON.stringify(stats, null, 2), "utf8");
  console.log("Done.", JSON.stringify(stats, null, 2));
  console.log("Report:", REPORT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
