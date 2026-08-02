/**
 * Cabo Verde (pt-CV) sparse content-layer checks vs effective fallback chain:
 * pt-CV → pt-PT → pt-BR → en (authority leaves = pt-BR merged under pt-PT).
 * Portuguese education overlay only — no Creole, no /cv wiring, no full suite.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";
import { getLocaleFromPath, stripLocaleFromPath } from "../../lib/i18n/locale-path.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { LOCALE_REGISTRY } from "../../lib/i18n/locale-registry.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "pt-CV";
const AUTHORITY_PT = "pt-PT";
const AUTHORITY_BR = "pt-BR";
const CV_GRADES = ["1.º ano", "2.º ano", "3.º ano", "4.º ano", "5.º ano", "6.º ano"];
const CV_BANDS = ["1.º–2.º ano", "3.º–4.º ano", "5.º–6.º ano"];
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const HEBREW_RE = /[\u0590-\u05FF]/
const AO_MZ_CLASSE_RE = /\b\d\.ª classe\b|Ensino Primário|1\.ª–2\.ª classe/;
const BR_LEAK_RE =
  /\b(Gerenciar|gerenciamento|porcentagens|porcentagem|cronômetro|celular|usuário|arquivo|Esportes|Alterar nota|Nome da classe|atividades de classe|Nenhuma aula ativa|Criar aula|Classe \{label\}|projetado)\b|(?<!\b[Aa] )Minha coleção/i;
const PT_ONLY_CLAIM_RE =
  /\b(única língua|unica lingua|só se fala português|apenas português|português é a única|Portuguese is the only)\b/i;
const CREOLE_RE =
  /\b(Crioulo|Kriolu|Cape Verdean Creole|kriol|badiu|sampadudu)\b/i;
const FOREIGN_CURRENCY_RE = /\b(EUR|USD|\$|€|real brasileiro|kwanza|metical)\b/i;
const GROUP_MISLABEL_RE =
  /\b(Nome da classe|Nenhuma aula ativa|Criar aula|Gerenciar turma|Gerenciar aulas|atividades de classe|Matérias de aula)\b/i;
/** Card-series “série” in rewards chrome is legitimate EP; grade-as-série is not. */
const REWARDS_SERIES_ALLOW_RE =
  /série de cartões|Série:\s*\{label\}|A série está faltando/i;
const GRADE_AS_SERIE_RE = /\bpor série\b|Tópicos por série|fora da série registrada|fora da série registada/i;
const ALLOWED_TOUCH_ROOTS = [
  path.join(ROOT, "locales", LOCALE),
  path.join(ROOT, "content-packs", LOCALE),
  path.join(ROOT, "data", "help-center", LOCALE),
  path.join(ROOT, "data", "english-questions", "word-meanings"),
  path.join(ROOT, "tests", "i18n"),
];

/**
 * @param {string} dir
 * @returns {string[]}
 */
function listJsonRel(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  /** @param {string} d @param {string} rel */
  function walk(d, rel = "") {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      const abs = path.join(d, ent.name);
      if (ent.isDirectory()) walk(abs, r);
      else if (ent.name.endsWith(".json")) out.push(r.replace(/\\/g, "/"));
    }
  }
  walk(dir);
  return out.sort();
}

/**
 * @param {unknown} base
 * @param {unknown} overlay
 */
function deepMerge(base, overlay) {
  if (overlay == null) return base;
  if (base == null) return overlay;
  if (typeof overlay !== "object" || Array.isArray(overlay)) return overlay;
  if (typeof base !== "object" || Array.isArray(base)) return overlay;
  /** @type {Record<string, unknown>} */
  const out = { .../** @type {Record<string, unknown>} */ (base) };
  for (const [k, v] of Object.entries(/** @type {Record<string, unknown>} */ (overlay))) {
    out[k] = deepMerge(out[k], v);
  }
  return out;
}

/**
 * @param {unknown} obj
 * @param {string} [prefix]
 * @param {Map<string, unknown>} [out]
 */
function collectLeavesTyped(obj, prefix = "", out = new Map()) {
  if (obj == null) return out;
  if (typeof obj !== "object") {
    out.set(prefix || "(root)", obj);
    return out;
  }
  if (Array.isArray(obj)) {
    out.set(prefix || "(root)", obj);
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === "object" && !Array.isArray(v)) collectLeavesTyped(v, p, out);
    else out.set(p, v);
  }
  return out;
}

/** @param {string} s */
function placeholders(s) {
  return [...String(s).matchAll(PLACEHOLDER_RE)].map((m) => m[0]).sort();
}

/**
 * @param {string} rel
 */
function effectiveLocaleAuthority(rel) {
  const brPath = path.join(ROOT, "locales", AUTHORITY_BR, rel);
  const ptPath = path.join(ROOT, "locales", AUTHORITY_PT, rel);
  assert.ok(fs.existsSync(brPath) || fs.existsSync(ptPath), `missing chain namespace ${rel}`);
  const br = fs.existsSync(brPath) ? JSON.parse(fs.readFileSync(brPath, "utf8")) : {};
  const pt = fs.existsSync(ptPath) ? JSON.parse(fs.readFileSync(ptPath, "utf8")) : {};
  return deepMerge(br, pt);
}

/**
 * @param {string} rel
 * @returns {{ baseRel: string, leaves: Map<string, string>, kind: string } | null}
 */
function effectivePackAuthority(rel) {
  const ptRoot = path.join(ROOT, "content-packs", AUTHORITY_PT);
  const brRoot = path.join(ROOT, "content-packs", AUTHORITY_BR);
  const ptExists = (candidate) => fs.existsSync(path.join(ptRoot, candidate));
  const brExists = (candidate) => fs.existsSync(path.join(brRoot, candidate));

  const ptAuth = resolveAuthorityPackPath(rel, ptExists);
  const brAuth = resolveAuthorityPackPath(rel, brExists);

  if (ptAuth.kind === "missing" && brAuth.kind === "missing") return null;

  /** @type {Map<string, string>} */
  let leaves = new Map();
  if (brAuth.kind !== "missing" && brAuth.baseRel) {
    const br = JSON.parse(fs.readFileSync(path.join(brRoot, brAuth.baseRel), "utf8"));
    leaves = collectStringLeaves(br);
  }
  if (ptAuth.kind !== "missing" && ptAuth.baseRel) {
    const pt = JSON.parse(fs.readFileSync(path.join(ptRoot, ptAuth.baseRel), "utf8"));
    for (const [k, v] of collectStringLeaves(pt)) leaves.set(k, v);
  }
  return {
    baseRel: ptAuth.baseRel || brAuth.baseRel || rel,
    leaves,
    kind: ptAuth.kind !== "missing" ? ptAuth.kind : brAuth.kind,
  };
}

test("pt-CV locale JSON parse + sparse vs effective pt-PT←pt-BR chain", () => {
  const countryRoot = path.join(ROOT, "locales", LOCALE);
  const files = listJsonRel(countryRoot);
  assert.ok(files.length > 0, "expected pt-CV locale files");

  /** @type {Array<{ file: string, key: string }>} */
  const orphans = [];
  /** @type {Array<{ file: string, key: string }>} */
  const identical = [];
  /** @type {Array<{ file: string, key: string }>} */
  const placeholderMismatches = [];
  /** @type {Array<{ file: string, key: string }>} */
  const typeMismatches = [];
  /** @type {string[]} */
  const emptyFiles = [];

  for (const rel of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    assert.ok(country && typeof country === "object");
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(rel);
    const blob = JSON.stringify(country);
    assert.equal(HEBREW_RE.test(blob), false, rel);
    assert.equal(AO_MZ_CLASSE_RE.test(blob), false, `AO/MZ classe leak in ${rel}`);
    assert.equal(BR_LEAK_RE.test(blob), false, `pt-BR leak in ${rel}`);
    assert.equal(PT_ONLY_CLAIM_RE.test(blob), false, `sole-language claim in ${rel}`);
    assert.equal(CREOLE_RE.test(blob), false, `Creole leak in ${rel}`);

    const effective = effectiveLocaleAuthority(rel);
    const countryLeaves = collectLeavesTyped(country);
    const baseLeaves = collectLeavesTyped(effective);

    for (const [key, value] of countryLeaves) {
      if (!baseLeaves.has(key)) orphans.push({ file: rel, key });
      else if (baseLeaves.get(key) === value) identical.push({ file: rel, key });
      else {
        const bv = baseLeaves.get(key);
        if (typeof value !== typeof bv) typeMismatches.push({ file: rel, key });
        if (typeof value === "string" && typeof bv === "string") {
          const a = placeholders(value).join(",");
          const b = placeholders(bv).join(",");
          if (a !== b) placeholderMismatches.push({ file: rel, key });
        }
      }
    }
  }

  assert.deepEqual(emptyFiles, []);
  assert.equal(orphans.length, 0, `orphan keys: ${JSON.stringify(orphans)}`);
  assert.equal(identical.length, 0, `identical overrides: ${JSON.stringify(identical)}`);
  assert.equal(
    placeholderMismatches.length,
    0,
    `placeholder mismatches: ${JSON.stringify(placeholderMismatches)}`
  );
  assert.equal(typeMismatches.length, 0, `type mismatches: ${JSON.stringify(typeMismatches)}`);
});

test("pt-CV authority-backed 1.º–6.º ano mapping + bands (inherited + overlay)", () => {
  const commonBase = effectiveLocaleAuthority("common.json");
  const learningBase = effectiveLocaleAuthority("learning.json");
  const worksheetsBase = effectiveLocaleAuthority("worksheets.json");
  const commonCv = fs.existsSync(path.join(ROOT, "locales", LOCALE, "common.json"))
    ? JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"))
    : {};
  const learningCv = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  const common = /** @type {Record<string, unknown>} */ (deepMerge(commonBase, commonCv));
  const learning = /** @type {Record<string, any>} */ (deepMerge(learningBase, learningCv));
  const worksheets = /** @type {Record<string, unknown>} */ (
    deepMerge(
      worksheetsBase,
      fs.existsSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"))
        ? JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8"))
        : {}
    )
  );

  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    CV_GRADES
  );
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    CV_GRADES
  );
  assert.deepEqual(
    [
      worksheets.gradeG1,
      worksheets.gradeG2,
      worksheets.gradeG3,
      worksheets.gradeG4,
      worksheets.gradeG5,
      worksheets.gradeG6,
    ],
    CV_GRADES
  );

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(
    [rewards.gradeBands.g12, rewards.gradeBands.g34, rewards.gradeBands.g56],
    CV_BANDS
  );

  // Overlay must not restate identical grade chrome keys.
  assert.equal(learningCv.master?.grades, undefined);
  assert.equal(fs.existsSync(path.join(ROOT, "locales", LOCALE, "common.json")), false);
});

test("pt-CV ano vs turma + nível de dificuldade preserved", () => {
  const school = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8")
  );
  assert.match(school.portal.classesSubtitle, /\bano\b/);
  assert.match(school.portal.classesSubtitle, /\bturma\b/);
  assert.match(school.portal.classesSubtitle, /gestão por ano/);
  assert.doesNotMatch(school.portal.classesSubtitle, /gestão por turma|gerenciamento|classe/);
  assert.equal(school.portal.colClass, "Turma");
  assert.equal(school.portal.classLabel, "Turma");
  assert.equal(school.portal.classMgmtName, "Nome da turma");
  assert.equal(school.portal.classMgmtCreate, "Criar turma");
  assert.equal(school.portal.quickClasses, "Gerir turmas");
  assert.doesNotMatch(JSON.stringify(school), GROUP_MISLABEL_RE);
  assert.doesNotMatch(JSON.stringify(school), /\bGerenciar\b|\bgerenciamento\b/);

  const teacher = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8")
  );
  assert.equal(teacher.dashboard.noClassesTitle, "Nenhuma turma ativa");
  assert.equal(teacher.dashboard.createClassLabel, "Nome da turma");
  assert.equal(teacher.dashboard.createClassButton, "Criar turma");
  assert.match(teacher.dashboard.noClassesHint, /Gerir turma/);
  const dashboardValues = Object.values(teacher.dashboard).join("\n");
  assert.doesNotMatch(dashboardValues, /\bGerenciar\b/);
  assert.doesNotMatch(dashboardValues, /\baula\b|\bclasse\b/i);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.public.about.intro1, /nível de dificuldade/);
  assert.match(ui.public.about.intro1, /\bano\b/);
  assert.match(ui.public.about.intro1, /foi concebido/);
  assert.doesNotMatch(ui.public.about.intro1, /projetado|\bturma\b/);

  const schoolMerged = /** @type {Record<string, any>} */ (
    deepMerge(effectiveLocaleAuthority("school.json"), school)
  );
  assert.match(schoolMerged.portal.physicalClassLoading, /turma/);
  assert.match(schoolMerged.portal.classMgmtEmpty, /turma/);
  assert.match(schoolMerged.communication.audienceClassParents, /turma/);
  assert.match(schoolMerged.communication.audienceGradeParents, /ano/);
  assert.doesNotMatch(schoolMerged.communication.audienceGradeParents, /turma/);
  assert.doesNotMatch(JSON.stringify(schoolMerged.portal), /\bGerenciar\b|\bgerenciamento\b/);
  assert.doesNotMatch(schoolMerged.portal.colClass, /^Aula$/);
  assert.doesNotMatch(schoolMerged.portal.quickClasses, /Gerenciar|aulas/i);

  const teacherMerged = /** @type {Record<string, any>} */ (
    deepMerge(effectiveLocaleAuthority("teacher.json"), teacher)
  );
  assert.equal(teacherMerged.dashboard.noClassesTitle, "Nenhuma turma ativa");
  assert.doesNotMatch(JSON.stringify(teacherMerged.dashboard), /\bGerenciar\b/);
  // Lesson/session wording may remain where it truly means a lesson.
  assert.match(teacherMerged.assignmentTypes.classroom_activity, /sala de aula/);
});

test("pt-CV European Portuguese authority + no pt-BR/pt-AO/pt-MZ leakage", () => {
  const learning = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8")
  );
  assert.match(learning.math.howToLearnSteps.step1, /percentagens/);
  assert.match(learning.math.howToLearnSteps.step2, /cronómetro/);
  assert.equal(learning.math.operations.percentages, "Percentagens");
  assert.doesNotMatch(JSON.stringify(learning), /porcentagens|cronômetro|classe/);

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.match(auth.registration.pending.schoolBody, /portal de gestão/);
  assert.doesNotMatch(auth.registration.pending.schoolBody, /gerenciamento/);

  const demo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "demo/ui.json"), "utf8")
  );
  assert.equal(demo.bar.changeGrade, "Alterar ano");
  assert.doesNotMatch(demo.bar.changeGrade, /nota|classe/i);
  assert.match(demo.enter.activeSessionNote, /cronómetro/);
  assert.equal(demo.enter.enterButton, "Entra no mundo infantil");
  assert.equal(demo.enter.enteringButton, "A entrar…");

  const localeBlob = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  const packBlob = listJsonRel(path.join(ROOT, "content-packs", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8"))
    .join("\n");
  for (const blob of [localeBlob, packBlob]) {
    assert.doesNotMatch(blob, AO_MZ_CLASSE_RE);
    assert.doesNotMatch(blob, BR_LEAK_RE);
    assert.doesNotMatch(blob, /\bvocê\b/i);
  }
});

test("pt-CV currency terminology surfaces (CVE / no foreign chrome)", () => {
  const localeBlob = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  const packBlob = listJsonRel(path.join(ROOT, "content-packs", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8"))
    .join("\n");
  // Authority: escudo cabo-verdiano / CVE — no local fiat chrome keys in pt-PT base,
  // so sparse overlay must not invent EUR/USD/kwanza/metical labels.
  assert.doesNotMatch(localeBlob, FOREIGN_CURRENCY_RE);
  assert.doesNotMatch(packBlob, FOREIGN_CURRENCY_RE);
});

test("pt-CV content-packs sparse contract vs effective pt-PT←pt-BR chain", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const ptRoot = path.join(ROOT, "content-packs", AUTHORITY_PT);
  const ptExists = (rel) => fs.existsSync(path.join(ptRoot, rel));

  /** @type {string[]} */
  const extraFiles = [];
  /** @type {Array<{ rel: string, key: string }>} */
  const orphanKeys = [];
  /** @type {Array<{ rel: string, key: string }>} */
  const identicalOverrides = [];
  /** @type {Array<{ rel: string }>} */
  const nearFullCopies = [];
  /** @type {string[]} */
  const emptyFiles = [];

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    assert.ok(country && typeof country === "object");
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(rel);
    const blob = JSON.stringify(country);
    assert.equal(HEBREW_RE.test(blob), false, rel);
    assert.equal(PT_ONLY_CLAIM_RE.test(blob), false, rel);
    assert.equal(CREOLE_RE.test(blob), false, rel);

    if (isBurnDownIndexPath(rel)) {
      const domain = rel.split("/")[0];
      const ptIndexPath = path.join(ROOT, "content-packs", AUTHORITY_PT, `${domain}/burn-down-index.json`);
      const brIndexPath = path.join(ROOT, "content-packs", AUTHORITY_BR, `${domain}/burn-down-index.json`);
      if (!fs.existsSync(ptIndexPath) && !fs.existsSync(brIndexPath)) {
        extraFiles.push(rel);
        continue;
      }
      const ptIndex = fs.existsSync(ptIndexPath)
        ? JSON.parse(fs.readFileSync(ptIndexPath, "utf8"))
        : {};
      const brIndex = fs.existsSync(brIndexPath)
        ? JSON.parse(fs.readFileSync(brIndexPath, "utf8"))
        : {};
      const baseIndex = /** @type {Record<string, unknown>} */ (deepMerge(brIndex, ptIndex));
      const indexAudit = auditBurnDownIndexOverlay(country, baseIndex, {
        countryRoot,
        domain,
        hasLeafForSlug: (slug) => {
          if (fs.existsSync(path.join(countryRoot, domain, `${slug}.json`))) return true;
          if (fs.existsSync(path.join(countryRoot, domain, "burn-down", `${slug}.json`))) {
            return true;
          }
          return false;
        },
      });
      for (const key of indexAudit.orphanKeys) orphanKeys.push({ rel, key });
      for (const key of indexAudit.identicalOverrides) identicalOverrides.push({ rel, key });
      continue;
    }

    const authority = effectivePackAuthority(rel);
    if (!authority) {
      extraFiles.push(rel);
      continue;
    }
    const countryLeaves = collectStringLeaves(country);
    const baseLeaves = authority.leaves;

    for (const [key, value] of countryLeaves) {
      if (!baseLeaves.has(key)) orphanKeys.push({ rel, key });
      else if (baseLeaves.get(key) === value) identicalOverrides.push({ rel, key });
      else if (typeof value === "string" && typeof baseLeaves.get(key) === "string") {
        const a = placeholders(value).join(",");
        const b = placeholders(/** @type {string} */ (baseLeaves.get(key))).join(",");
        assert.equal(a, b, `placeholder mismatch ${rel} ${key}`);
      }
    }

    if (ptExists(rel) || resolveAuthorityPackPath(rel, ptExists).kind !== "missing") {
      const ptAuth = resolveAuthorityPackPath(rel, ptExists);
      if (ptAuth.baseRel) {
        const ptBase = JSON.parse(fs.readFileSync(path.join(ptRoot, ptAuth.baseRel), "utf8"));
        const assessment = assessNearFullCopy(
          /** @type {Map<string, string>} */ (countryLeaves),
          collectStringLeaves(ptBase)
        );
        if (assessment.isNearFullCopy) nearFullCopies.push({ rel });
      }
    }
  }

  assert.deepEqual(emptyFiles, []);
  assert.equal(extraFiles.length, 0, `extra/orphan files: ${JSON.stringify(extraFiles)}`);
  assert.equal(orphanKeys.length, 0, `orphan keys: ${JSON.stringify(orphanKeys)}`);
  assert.equal(
    identicalOverrides.length,
    0,
    `identical overrides: ${JSON.stringify(identicalOverrides)}`
  );
  assert.equal(nearFullCopies.length, 0, `near-full copies: ${JSON.stringify(nearFullCopies)}`);
});

test("pt-CV help overlays: ano + encarregado + no sole-language claim", async () => {
  const { BY_SECTION_PT_CV } = await import("../../data/help-center/pt-CV/index.js");

  const choose = BY_SECTION_PT_CV.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.ok(choose);
  assert.match(String(choose.title), /\bano\b/);
  assert.doesNotMatch(String(choose.title), /classe/i);
  const body = (choose.blocks || []).map((b) => String(b.text || "")).join("\n");
  assert.match(body, /\bano\b/);
  assert.doesNotMatch(body, /classe/i);

  const welcome = BY_SECTION_PT_CV.parents.find((a) => a.slug === "welcome-and-overview");
  assert.ok(welcome);
  assert.match(String(welcome.title), /encarregados de educação/i);
  const welcomeText = (welcome.blocks || []).map((b) => String(b.text || "")).join("\n");
  assert.match(welcomeText, /ensino básico/);
  assert.match(welcomeText, /1\.º ao 6\.º ano/);
  assert.match(welcomeText, /Cabo Verde/);
  assert.match(welcomeText, /experiência em português|aprendizagem em português/);
  assert.doesNotMatch(welcomeText, PT_ONLY_CLAIM_RE);
  assert.doesNotMatch(welcomeText, CREOLE_RE);
  assert.doesNotMatch(welcomeText, /O papel dos responsáveis/);
  assert.doesNotMatch(welcomeText, /Ensino Primário|classe/);
});

test("pt-CV game grade bands + rewards EP residue", () => {
  for (const rel of [
    "content-packs/pt-CV/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json",
    "content-packs/pt-CV/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json",
    "content-packs/pt-CV/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json",
  ]) {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
    const blob = JSON.stringify(j.copy);
    assert.match(blob, /1\.º–2\.º ano/);
    assert.doesNotMatch(blob, /classe|\.ª–/);
  }

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/pt-CV/rewards/ui.json"), "utf8")
  );
  assert.equal(rewards.series["sport-fun"], "Desportos e Diversão");
  assert.equal(rewards.surpriseBox.myCollection, "A minha coleção");
  assert.match(rewards.fallback.keepLearning, /Continuar a aprender/);
  assert.equal(rewards.surpriseBoxModal.doneTitle, "Boa! Recebeste recompensas!");
  assert.doesNotMatch(JSON.stringify(rewards), /Esportes|aprendendo|Minha coleção|Baixe|Legal!/);
});

test("pt-CV does not ship word-meanings or science/books full copies", () => {
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/pt-CV.js")),
    false
  );
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-pt-CV-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/pt-CV")), false);
  // Sparse books chrome only (Desportos titles); no full book corpus copy.
  const booksDir = path.join(ROOT, "content-packs/pt-CV/books");
  if (fs.existsSync(booksDir)) {
    const files = fs.readdirSync(booksDir);
    assert.deepEqual(files, ["english-page-skills.json"]);
    const skills = JSON.parse(
      fs.readFileSync(path.join(booksDir, "english-page-skills.json"), "utf8")
    );
    assert.equal(collectStringLeaves(skills).size, 3);
    assert.match(JSON.stringify(skills), /Desportos/);
    assert.doesNotMatch(JSON.stringify(skills), /Esportes/);
  }
});

test("pt-CV English learning targets preserved (no local word-meanings overlay)", () => {
  // English vocabulary/phonics/spelling targets stay on the authority chain; no pt-CV override file.
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/pt-CV.js")),
    false
  );
  assert.ok(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/pt-PT.js")));
});

test("pt-CV generator helper file absent", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "tests/i18n/_gen-pt-CV-sparse-layer.mjs")), false);
  const i18nDir = path.join(ROOT, "tests/i18n");
  const leftovers = fs
    .readdirSync(i18nDir)
    .filter((name) => /^_gen-pt-CV/i.test(name) || /^_.*pt-CV.*\.mjs$/i.test(name));
  assert.deepEqual(leftovers, []);
});

test("pt-CV teacher/school portal EP chrome + aula reserved for lessons", () => {
  const localeBlob = ["teacher.json", "school.json", "ui.json", "auth.json"]
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(localeBlob, /\bGerenciar\b|\bgerenciamento\b/);
  assert.doesNotMatch(localeBlob, GROUP_MISLABEL_RE);
  assert.doesNotMatch(localeBlob, /\bprojetado\b/);
  assert.doesNotMatch(localeBlob, /\b(porcentagem|porcentagens|cronômetro|celular|usuário)\b/);

  const dash = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/pt-CV/global-burn-down/components__teacher-portal__TeacherDashboardClient.json"
      ),
      "utf8"
    )
  );
  assert.equal(dash.copy.manage_class, "Gerir turma");

  const schoolMerged = /** @type {Record<string, any>} */ (
    deepMerge(
      effectiveLocaleAuthority("school.json"),
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"))
    )
  );
  const teacherMerged = /** @type {Record<string, any>} */ (
    deepMerge(
      effectiveLocaleAuthority("teacher.json"),
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"))
    )
  );
  // Group-management chrome uses turma; lesson phrasing may keep aula.
  assert.equal(schoolMerged.portal.colClass, "Turma");
  assert.equal(teacherMerged.dashboard.createClassLabel, "Nome da turma");
  assert.match(teacherMerged.assignmentTypes.classroom_activity, /sala de aula/);
  assert.match(teacherMerged.supportSuggestions.targetedReview, /na aula/);

  const platform = /** @type {Record<string, any>} */ (effectiveLocaleAuthority("platform.json"));
  assert.equal(platform.activityModes?.live_lesson, "Aula ao vivo");
});

test("pt-CV Cabo Verde framing intact + no sibling-country leakage", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Cabo Verde/);
  assert.match(seo.homeTitle, /português|ensino básico/);
  assert.match(seo.homeDescription, /experiência em português/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home.subhead, /Cabo Verde/);
  assert.match(ui.public.about.intro1, /Cabo Verde/);
  assert.doesNotMatch(ui.public.about.intro1, PT_ONLY_CLAIM_RE);

  const localeBlob = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  const packBlob = listJsonRel(path.join(ROOT, "content-packs", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8"))
    .join("\n");
  for (const blob of [localeBlob, packBlob]) {
    assert.doesNotMatch(blob, AO_MZ_CLASSE_RE);
    assert.doesNotMatch(blob, /\b(Portugal|Angola|Moçambique|Brazil|Brasil)\b/);
  }
});

test("pt-CV content-layer touch set does not modify other locales", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "tests/i18n/_gen-pt-CV-sparse-layer.mjs")), false);
  for (const loc of ["pt-PT", "pt-BR", "pt-AO", "pt-MZ"]) {
    // Presence of sibling locales is fine; this layer must not write into them.
    assert.equal(path.join(ROOT, "locales", loc).startsWith(path.join(ROOT, "locales", LOCALE)), false);
  }
  for (const root of ALLOWED_TOUCH_ROOTS) {
    assert.ok(fs.existsSync(root) || root.includes("word-meanings"), `allowed root missing: ${root}`);
  }
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "cv")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "cv-pt")), false);
});

test("pt-CV wiring verification: /cv-pt, bare /cv, fallback, selector label", () => {
  const def = LOCALE_REGISTRY["pt-CV"];
  assert.ok(def);
  assert.equal(def.pathPrefix, "cv-pt");
  assert.equal(def.nativeName, "Cabo Verde-pt");
  assert.equal(def.label || def.nativeName, "Cabo Verde-pt");
  assert.deepEqual(getLocaleFallbackChain("pt-CV"), ["pt-CV", "pt-PT", "pt-BR", "en"]);
  assert.equal(getLocaleFromPath("/cv-pt"), "pt-CV");
  assert.equal(getLocaleFromPath("/cv-pt/learning"), "pt-CV");
  assert.equal(getLocaleFromPath("/cv"), null);
  assert.equal(stripLocaleFromPath("/cv").locale, null);
  assert.equal(LOCALE_REGISTRY.cv, undefined);
});

test("pt-CV merged runtime has zero unjustified Brazilian residue", async () => {
  /** @type {Array<{ scope: string, key: string, value: string }>} */
  const unjustified = [];

  /** @param {string} scope @param {string} key @param {string} value */
  function checkValue(scope, key, value) {
    if (typeof value !== "string") return;
    if (scope.startsWith("pack:rewards/") && REWARDS_SERIES_ALLOW_RE.test(value)) return;
    if (BR_LEAK_RE.test(value) || GROUP_MISLABEL_RE.test(value) || GRADE_AS_SERIE_RE.test(value)) {
      unjustified.push({ scope, key, value: value.slice(0, 160) });
    }
  }

  const localeNamespaces = [
    ...new Set([
      ...listJsonRel(path.join(ROOT, "locales", AUTHORITY_BR)),
      ...listJsonRel(path.join(ROOT, "locales", AUTHORITY_PT)),
      ...listJsonRel(path.join(ROOT, "locales", LOCALE)),
    ]),
  ];
  assert.ok(localeNamespaces.length >= 15, "expected full pt namespace set");

  for (const ns of localeNamespaces) {
    const merged = /** @type {Record<string, unknown>} */ (
      deepMerge(
        effectiveLocaleAuthority(ns),
        fs.existsSync(path.join(ROOT, "locales", LOCALE, ns))
          ? JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, ns), "utf8"))
          : {}
      )
    );
    for (const [key, value] of collectStringLeaves(merged)) {
      checkValue(`locale:${ns}`, key, /** @type {string} */ (value));
    }
  }

  const packRels = new Set([
    ...listJsonRel(path.join(ROOT, "content-packs", AUTHORITY_BR)),
    ...listJsonRel(path.join(ROOT, "content-packs", AUTHORITY_PT)),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)),
  ]);
  assert.ok(packRels.size > 50, "expected broad pack authority set");

  for (const rel of [...packRels].sort()) {
    let merged = {};
    for (const loc of [AUTHORITY_BR, AUTHORITY_PT, LOCALE]) {
      const p = path.join(ROOT, "content-packs", loc, rel);
      if (fs.existsSync(p)) {
        merged = deepMerge(merged, JSON.parse(fs.readFileSync(p, "utf8")));
      }
    }
    for (const [key, value] of collectStringLeaves(merged)) {
      checkValue(`pack:${rel}`, key, /** @type {string} */ (value));
    }
  }

  const { BY_SECTION_PT_CV, ALL_ARTICLES_PT_CV } = await import("../../data/help-center/pt-CV/index.js");
  assert.ok(BY_SECTION_PT_CV.parents?.length);
  assert.ok(BY_SECTION_PT_CV.students?.length);
  assert.ok(BY_SECTION_PT_CV.subjects?.length);
  assert.ok(BY_SECTION_PT_CV["parent-report"]?.length);
  for (const article of ALL_ARTICLES_PT_CV) {
    const blob = JSON.stringify(article);
    checkValue(`help:${article.section}:${article.slug}`, "article", blob);
  }

  assert.deepEqual(
    unjustified,
    [],
    `unjustified Brazilian residue remaining: ${JSON.stringify(unjustified.slice(0, 30))}`
  );

  // Legitimate retained rewards card-series wording still present in authority merge.
  const rewardsMerged = deepMerge(
    deepMerge(
      JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/pt-BR/rewards/ui.json"), "utf8")),
      fs.existsSync(path.join(ROOT, "content-packs/pt-PT/rewards/ui.json"))
        ? JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/pt-PT/rewards/ui.json"), "utf8"))
        : {}
    ),
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/pt-CV/rewards/ui.json"), "utf8"))
  );
  assert.match(JSON.stringify(rewardsMerged), REWARDS_SERIES_ALLOW_RE);

  const uiMerged = /** @type {Record<string, any>} */ (
    deepMerge(
      effectiveLocaleAuthority("ui.json"),
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"))
    )
  );
  assert.match(uiMerged.public.about.intro1, /foi concebido/);
  assert.match(uiMerged.public.about.learnEnjoyBody, /concebidos|académica|aprendizagem/);
  assert.doesNotMatch(uiMerged.public.about.learnEnjoyBody, /projetado|acadêmica|aprendizado/);
});
