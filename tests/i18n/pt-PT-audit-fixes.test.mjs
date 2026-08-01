/**
 * Portugal (pt-PT) audit-closure checks — no content rewrites here.
 * Confirms linguistic/structural leftovers stay at zero after wiring.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { SCIENCE_PT_PT_OVERLAY } from "../../data/science-questions-pt-PT-overlay.js";
import { SCIENCE_PT_BR_OVERLAY } from "../../data/science-questions-pt-BR-overlay.js";

const ROOT = process.cwd();

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const st = fs.statSync(dir);
  if (st.isFile()) {
    acc.push(dir);
    return acc;
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    walk(path.join(dir, ent.name), acc);
  }
  return acc;
}

const PT_PT_ROOTS = [
  "locales/pt-PT",
  "content-packs/pt-PT",
  "data/help-center/pt-PT",
  "docs/learning-book/pt-PT",
  "utils/learning-content-pt-PT",
  "data/science-questions-pt-PT-overlay.js",
  "data/english-questions/word-meanings/pt-PT.js",
];

const CHECKS = {
  voce: /\bvocê\b/i,
  onibus: /ônibus/i,
  oxigenio: /oxigênio/i,
  usuario: /\busuário\b/i,
  ensinoFund: /ensino fundamental/i,
  aEcran: /\b(a|na|à|pela|uma|da) ecrã\b/i,
  eurosCorrupt: /(estações|evidências|diferenças|atividades) euros/i,
  vidaEuro: /vida euro|e euro \$\{|Converter euro|cm euro/i,
  notaSchoolYear:
    /Selecione uma nota|Voltar para notas|Essa nota não é válida|disciplinas, notas e níveis/,
  tuSeu: /Escolhe[^.]*\bseu\b|\bteu\b[^.]*\bseu\b/i,
};

function publicTextForFile(filePath, text) {
  if (!filePath.includes(`${path.sep}help-center${path.sep}pt-PT`) && !filePath.includes("/help-center/pt-PT")) {
    return text;
  }
  return text
    .replace(/"textIncludes"\s*:\s*"[^"]*"/g, "")
    .replace(/"altIncludes"\s*:\s*"[^"]*"/g, "");
}

test("pt-PT public leftovers stay at zero", () => {
  /** @type {Record<string, string[]>} */
  const hits = Object.fromEntries(Object.keys(CHECKS).map((k) => [k, []]));
  for (const root of PT_PT_ROOTS) {
    for (const file of walk(path.join(ROOT, root))) {
      if (!/\.(js|json|md)$/.test(file)) continue;
      const raw = fs.readFileSync(file, "utf8");
      const text = publicTextForFile(file, raw);
      for (const [name, re] of Object.entries(CHECKS)) {
        if (re.test(text)) {
          hits[name].push(path.relative(ROOT, file).replace(/\\/g, "/"));
        }
      }
    }
  }
  for (const [name, files] of Object.entries(hits)) {
    assert.equal(files.length, 0, `${name}: ${files.slice(0, 5).join("|")}`);
  }
});

test("Math scale uses vida real / comprimento real; money uses euros", () => {
  const math = fs.readFileSync(path.join(ROOT, "utils/learning-content-pt-PT/math.js"), "utf8");
  assert.match(math, /na vida real/);
  assert.match(math, /comprimento real/);
  assert.match(math, /Converter real em mapa/);
  assert.match(math, /Mapa \$\{ml\} cm e real \$\{rl\} cm/);
  assert.match(math, /euros/);
  assert.match(math, /€/);
  assert.doesNotMatch(math, /vida euro|Converter euro|e euro \$\{/);
});

test("Science euros corruption = 0; ID parity with pt-BR", () => {
  assert.deepEqual(
    Object.keys(SCIENCE_PT_PT_OVERLAY).sort(),
    Object.keys(SCIENCE_PT_BR_OVERLAY).sort()
  );
  let euroHits = 0;
  for (const overlay of Object.values(SCIENCE_PT_PT_OVERLAY)) {
    if (/euro/i.test(JSON.stringify(overlay))) euroHits += 1;
  }
  assert.equal(euroHits, 0);
});

test("identical namespace overrides = 0 for known sparse hotspots", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-PT/ui.json"), "utf8"));
  const brUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-BR/ui.json"), "utf8"));
  const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-PT/worksheets.json"), "utf8"));
  const brWs = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-BR/worksheets.json"), "utf8"));

  const identical = [];
  if (
    ui.public?.homepage?.parentBenefits?.items?.["0"]?.text ===
    brUi.public?.homepage?.parentBenefits?.items?.["0"]?.text
  ) {
    identical.push("ui.parentBenefits.0.text");
  }
  if (
    ws.coloringUploadPreviewAlt != null &&
    ws.coloringUploadPreviewAlt === brWs.coloringUploadPreviewAlt
  ) {
    identical.push("worksheets.coloringUploadPreviewAlt");
  }
  if (ws.gradeField != null && ws.gradeField === brWs.gradeField) {
    identical.push("worksheets.gradeField");
  }
  assert.deepEqual(identical, []);
});

test("IDs/answers/diagnostics unchanged through pt-PT math localization", () => {
  const q = {
    subject: "math",
    id: "pt-pt-audit-frac",
    params: { kind: "frac_simplify_intro_g4", num: 2, den: 4 },
    correctIndex: 1,
    diagnosticTags: ["frac"],
  };
  const out = localizeLearningQuestion(q, { subject: "math", contentLocale: "pt-PT" });
  assert.equal(out.id, "pt-pt-audit-frac");
  assert.equal(out.correctIndex, 1);
  assert.deepEqual(out.diagnosticTags, ["frac"]);
  assert.equal(out.params.num, 2);
  assert.equal(out.params.den, 4);
});
