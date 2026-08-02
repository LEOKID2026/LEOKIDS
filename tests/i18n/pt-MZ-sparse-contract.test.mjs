/**
 * Mozambique (pt-MZ) sparse country layer checks vs effective fallback chain:
 * pt-MZ → pt-PT → pt-BR → en (authority leaves = pt-BR merged under pt-PT).
 * Focused only — no full suite / no build / no other locales.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";

const ROOT = process.cwd();
const LOCALE = "pt-MZ";
const AUTHORITY_PT = "pt-PT";
const AUTHORITY_BR = "pt-BR";

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
 * Deep-merge plain objects; `overlay` wins. Arrays/primitives replaced.
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
  return [...String(s).matchAll(/\{[^{}]+\}|\{\{[^{}]+\}\}/g)].map((m) => m[0]).sort();
}

/**
 * Effective locale authority: pt-BR namespace merged under pt-PT sparse overlay.
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
 * Effective content-pack authority for a relative pack path.
 * Prefers pt-PT leaf when present, else pt-BR; merges BR←PT for key existence.
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

test("pt-MZ locale JSON parse + sparse vs effective pt-PT←pt-BR chain", () => {
  const countryRoot = path.join(ROOT, "locales", LOCALE);
  const files = listJsonRel(countryRoot);
  assert.ok(files.length > 0, "expected pt-MZ locale files");

  /** @type {Array<{ file: string, key: string }>} */
  const orphans = [];
  /** @type {Array<{ file: string, key: string }>} */
  const identical = [];
  /** @type {Array<{ file: string, key: string }>} */
  const placeholderMismatches = [];
  /** @type {Array<{ file: string, key: string }>} */
  const typeMismatches = [];

  for (const rel of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    assert.ok(country && typeof country === "object");
    assert.notEqual(Object.keys(country).length, 0, `empty locale file ${rel}`);
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

  assert.equal(orphans.length, 0, `orphan keys: ${JSON.stringify(orphans)}`);
  assert.equal(identical.length, 0, `identical overrides: ${JSON.stringify(identical)}`);
  assert.equal(
    placeholderMismatches.length,
    0,
    `placeholder mismatches: ${JSON.stringify(placeholderMismatches)}`
  );
  assert.equal(typeMismatches.length, 0, `type mismatches: ${JSON.stringify(typeMismatches)}`);
});

test("pt-MZ grade runtime keys closed (demo/report/worksheets/learning/school)", () => {
  const demo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/pt-MZ/demo/ui.json"), "utf8"));
  assert.equal(demo.bar.changeGrade, "Alterar classe");
  assert.equal(demo.bar.gradeLabel, "Classe");
  assert.doesNotMatch(demo.bar.changeGrade, /nota/i);

  const reportGrade = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/pt-MZ/reports/burn-down/components__parent-report-detailed-surface.json"
      ),
      "utf8"
    )
  );
  assert.equal(reportGrade.copy.grade, "Classe");

  const tier = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/pt-MZ/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json"
      ),
      "utf8"
    )
  );
  assert.equal(tier.copy.practice_above_grade_level, "Pratique acima do nível da classe");

  const worksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales/pt-MZ/worksheets.json"), "utf8")
  );
  assert.equal(worksheets.gradeFilterAll, "Todas as classes");
  assert.equal(worksheets.gradeField, "Classe");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-MZ/learning.json"), "utf8"));
  assert.equal(learning.master.gradeFallback, "Classe");
  assert.equal(learning.master.currentGrade, "Classe atual");
  assert.match(learning.math.howToLearnBlurb, /de acordo com a classe/);
  assert.match(learning.math.howToLearnSteps.step1, /percentagens/);
  assert.match(learning.math.howToLearnSteps.step2, /cronómetro/);
  assert.doesNotMatch(JSON.stringify(learning), /porcentagens|cronômetro/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-MZ/school.json"), "utf8"));
  assert.equal(school.portal.colGrade, "Classe");
  assert.equal(school.portal.assignCurrentGrade, "Classe atual");
  assert.match(school.portal.classesSubtitle, /gestão por classe/);
  assert.doesNotMatch(school.portal.classesSubtitle, /gerenciamento/);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-MZ/seo.json"), "utf8"));
  assert.match(seo.learningDescription, /classe/);
});

test("pt-MZ content-packs sparse contract vs effective pt-PT←pt-BR chain", () => {
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

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    assert.ok(country && typeof country === "object");
    assert.notEqual(Object.keys(country).length, 0, `empty override file ${rel}`);

    if (isBurnDownIndexPath(rel)) {
      const domain = rel.split("/")[0];
      const ptIndexRel = `${domain}/burn-down-index.json`;
      const brIndexRel = `${domain}/burn-down-index.json`;
      const ptIndexPath = path.join(ROOT, "content-packs", AUTHORITY_PT, ptIndexRel);
      const brIndexPath = path.join(ROOT, "content-packs", AUTHORITY_BR, brIndexRel);
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

  assert.equal(extraFiles.length, 0, `extra/orphan files: ${JSON.stringify(extraFiles)}`);
  assert.equal(orphanKeys.length, 0, `orphan keys: ${JSON.stringify(orphanKeys)}`);
  assert.equal(
    identicalOverrides.length,
    0,
    `identical overrides: ${JSON.stringify(identicalOverrides)}`
  );
  assert.equal(nearFullCopies.length, 0, `near-full copies: ${JSON.stringify(nearFullCopies)}`);
});

test("pt-MZ help student grade article + parent encarregado", async () => {
  const { BY_SECTION_PT_MZ } = await import("../../data/help-center/pt-MZ/index.js");

  const choose = BY_SECTION_PT_MZ.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.ok(choose);
  assert.match(String(choose.title), /classe/);
  assert.doesNotMatch(String(choose.title), /\bano\b/i);
  const body = (choose.blocks || []).map((b) => String(b.text || "")).join("\n");
  assert.match(body, /classe/);
  assert.doesNotMatch(body, /ao seu ano/i);

  const welcome = BY_SECTION_PT_MZ.parents.find((a) => a.slug === "welcome-and-overview");
  assert.ok(welcome);
  assert.match(String(welcome.title), /encarregados de educação/i);
  const welcomeText = (welcome.blocks || []).map((b) => String(b.text || "")).join("\n");
  assert.match(welcomeText, /encarregados de educação/i);
  assert.doesNotMatch(welcomeText, /O papel dos responsáveis/);
});

test("pt-MZ game grade bands + rewards residue", () => {
  for (const rel of [
    "content-packs/pt-MZ/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json",
    "content-packs/pt-MZ/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json",
    "content-packs/pt-MZ/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json",
  ]) {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
    const blob = JSON.stringify(j.copy);
    assert.match(blob, /1\.ª–2\.ª classe/);
    assert.doesNotMatch(blob, /\.º ano/);
  }

  const rewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/pt-MZ/rewards/ui.json"), "utf8")
  );
  assert.equal(rewards.series["sport-fun"], "Desportos e Diversão");
  assert.equal(rewards.surpriseBox.myCollection, "A minha coleção");
  assert.match(rewards.fallback.keepLearning, /Continuar a aprender/);
  assert.equal(rewards.surpriseBoxModal.doneTitle, "Boa! Recebeste recompensas!");
  assert.doesNotMatch(JSON.stringify(rewards), /Esportes|aprendendo|Minha coleção|Baixe|Legal!/);
});

test("pt-MZ closure fixes: percentages, auth gestão, demo tu, rewards tone", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-MZ/learning.json"), "utf8"));
  assert.equal(learning.math.operations.percentages, "Percentagens");
  assert.equal(learning.math.reference.operations.percentages.title, "% Percentagens");

  const reports = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-MZ/reports.json"), "utf8"));
  assert.equal(reports.topics.math.percentages, "Percentagens");
  assert.equal(reports.topics.math.percent_intro, "Introdução às percentagens");

  const curriculum = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs/pt-MZ/learning/burn-down/components__parent__ParentCurriculumContent.json"
      ),
      "utf8"
    )
  );
  assert.equal(curriculum.copy.percentages, "Percentagens");
  assert.match(
    curriculum.copy.addition_subtraction_from_10_000_to_50_000_multiplication_from_30_30_to_,
    /percentagens/
  );
  assert.match(
    curriculum.copy.addition_subtraction_up_to_100_000_multiplication_up_to_99_99_fractions_,
    /percentagens/
  );
  assert.doesNotMatch(JSON.stringify(curriculum), /[Pp]orcentagens/);

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-MZ/auth.json"), "utf8"));
  assert.match(auth.registration.pending.schoolBody, /portal de gestão/);
  assert.doesNotMatch(auth.registration.pending.schoolBody, /gerenciamento/);

  const demo = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/pt-MZ/demo/ui.json"), "utf8"));
  assert.equal(demo.enter.enterButton, "Entra no mundo infantil");
  assert.equal(demo.enter.enteringButton, "A entrar…");
  assert.doesNotMatch(demo.enter.enterButton, /^Entre /);
  assert.doesNotMatch(demo.enter.enteringButton, /Entrando/);
});

test("pt-MZ classe terminology + no pt-BR grade leakage", () => {
  const blobs = [
    fs.readFileSync(path.join(ROOT, "locales/pt-MZ/common.json"), "utf8"),
    fs.readFileSync(path.join(ROOT, "locales/pt-MZ/learning.json"), "utf8"),
    fs.readFileSync(path.join(ROOT, "locales/pt-MZ/worksheets.json"), "utf8"),
    fs.readFileSync(path.join(ROOT, "locales/pt-MZ/school.json"), "utf8"),
    fs.readFileSync(path.join(ROOT, "locales/pt-MZ/ui.json"), "utf8"),
    fs.readFileSync(path.join(ROOT, "content-packs/pt-MZ/demo/ui.json"), "utf8"),
  ].join("\n");

  assert.match(blobs, /1\.ª classe/);
  assert.match(blobs, /Ensino Primário|classe/);
  assert.doesNotMatch(blobs, /Todos os anos|Alterar nota|porcentagens|cronômetro|gerenciamento/);
  assert.doesNotMatch(blobs, /\bvocê\b/i);
});

test("pt-MZ does not ship word-meanings or science full copies", () => {
  assert.equal(
    fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/pt-MZ.js")),
    false
  );
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-pt-MZ-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/pt-MZ")), false);
});

test("pt-MZ English educational targets remain English in skill titles where present", () => {
  const skillsPath = path.join(ROOT, "content-packs/pt-MZ/books/english-page-skills.json");
  if (!fs.existsSync(skillsPath)) return;
  const skills = JSON.parse(fs.readFileSync(skillsPath, "utf8"));
  const blob = JSON.stringify(skills);
  // Grade labels may be localized; English grammar targets stay English.
  if (blob.includes("the best")) {
    assert.match(blob, /the best \/ the most interesting/);
  }
});
