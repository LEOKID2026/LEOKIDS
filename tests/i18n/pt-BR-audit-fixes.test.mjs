import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test, { describe } from "node:test";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import { resolveLocaleDefinition } from "../../lib/i18n/locale-registry.js";
import { loadContentPack } from "../../lib/content/locale.server.js";
import { getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import { rebuildMathStemPtBr } from "../../utils/learning-content-pt-BR/math.js";
import { rebuildGeometryStemPtBr } from "../../utils/learning-content-pt-BR/geometry.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";

const HE = /[\u0590-\u05FF]/;
const ROOT = process.cwd();

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function treeHas(re, roots) {
  for (const root of roots) {
    for (const f of walk(path.join(ROOT, root))) {
      if (!/\.(json|js|md)$/i.test(f)) continue;
      if (re.test(fs.readFileSync(f, "utf8"))) return f;
    }
  }
  return null;
}

describe("pt-BR BLOCKER word meanings", () => {
  test("travel.port and community.port are porto; door remains porta", () => {
    assert.equal(resolveEnglishWordMeaning("port", { listKey: "travel", instructionLocale: "pt-BR" }), "porto");
    assert.equal(resolveEnglishWordMeaning("port", { listKey: "community", instructionLocale: "pt-BR" }), "porto");
    assert.equal(resolveEnglishWordMeaning("door", { listKey: "home", instructionLocale: "pt-BR" }), "porta");
  });

  test("school.grade is ano", () => {
    assert.equal(resolveEnglishWordMeaning("grade", { listKey: "school", instructionLocale: "pt-BR" }), "ano");
  });
});

describe("pt-BR geometry square / books", () => {
  test("no geometric square mistranslated as praça", () => {
    assert.equal(treeHas(/Em uma praça|Conhecendo a Praça/, ["docs/learning-book/pt-BR/geometry"]), null);
    const square = fs.readFileSync(
      path.join(ROOT, "docs/learning-book/pt-BR/geometry/g1/drafts/shapes_basic_square.md"),
      "utf8",
    );
    assert.match(square, /Conhecendo o quadrado/);
    assert.match(square, /ângulos retos/);
  });

  test("README and placeholders have no Hebrew", () => {
    const files = [
      ...walk(path.join(ROOT, "docs/learning-book/pt-BR")).filter((f) => /README\.md$/i.test(f)),
      ...walk(path.join(ROOT, "docs/learning-book/pt-BR")).filter((f) => /book_placeholder\.md$/i.test(f)),
    ];
    assert.equal(files.length, 33);
    for (const f of files) {
      const t = fs.readFileSync(f, "utf8");
      assert.equal(HE.test(t), false, f);
      assert.doesNotMatch(t, /Draft content only\. No code/);
    }
  });

  test("projecto removed; geometry legs use cateto", () => {
    assert.equal(treeHas(/projecto/i, ["docs/learning-book/pt-BR"]), null);
    const leg = fs.readFileSync(
      path.join(ROOT, "docs/learning-book/pt-BR/geometry/g6/drafts/pythagoras_leg.md"),
      "utf8",
    );
    assert.match(leg, /cateto/i);
    assert.doesNotMatch(leg, /\bperna\b/i);
  });
});

describe("pt-BR worksheet / grade / parent copy", () => {
  test("no atividadess; gabarito used; createHint uses ano", () => {
    assert.equal(treeHas(/atividadess/, ["locales/pt-BR", "content-packs/pt-BR", "data/help-center/pt-BR"]), null);
    const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-BR/worksheets.json"), "utf8"));
    assert.equal(ws.includeAnswers, "Incluir gabarito");
    assert.match(ws.createHint, /o ano/);
    assert.match(ws.noPreviewData, /criar uma/);
  });

  test("auth parent identifier is not teacher credentials", () => {
    const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-BR/auth.json"), "utf8"));
    assert.equal(auth.identifierPlaceholderParent, "Digite seu e-mail ou nome de usuário");
    assert.match(auth.askParentOpenAccount, /responsável/);
    assert.doesNotMatch(auth.identifierPlaceholderParent, /professor/i);
  });

  test("brandTagline final", () => {
    const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/pt-BR/common.json"), "utf8"));
    assert.equal(common.brandTagline, "Aprender brincando");
    assert.equal(common.gradeLabel, "{grade}º ano");
    assert.equal(common.gradeLabel.replace("{grade}", "3"), "3º ano");
    assert.equal(common.grade3, "3º ano");
  });
});

describe("pt-BR math/geometry rebuilders", () => {
  test("reais and feminine agreement", () => {
    assert.match(
      rebuildMathStemPtBr({ params: { kind: "wp_shop_discount", price: 80, discPerc: 10 } }),
      /R\$/,
    );
    assert.match(
      rebuildMathStemPtBr({ params: { kind: "wp_simple_sub_g2", total: 5, give: 3 } }),
      /foram comidas/,
    );
    assert.match(
      rebuildMathStemPtBr({ params: { kind: "wp_simple_add_g2", a: 2, b: 3 } }),
      /turma/,
    );
    assert.match(
      rebuildMathStemPtBr({ params: { kind: "wp_groups_g2", per: 4, groups: 3 } }),
      /fileiras/,
    );
  });

  test("geometry stem style", () => {
    assert.equal(
      rebuildGeometryStemPtBr({ params: { kind: "circle_area", radius: 5 } }),
      "Um círculo tem raio 5. Qual é a área? (π = 3.14)",
    );
  });

  test("IDs/answers unchanged through localize", () => {
    const q = {
      id: "keep-id",
      subject: "math",
      questionKind: "wp_shop_discount",
      correctIndex: 1,
      params: { kind: "wp_shop_discount", price: 50, discPerc: 20 },
      options: ["40", "45", "50"],
    };
    const out = localizeLearningQuestion(q, { subject: "math", contentLocale: "pt-BR" });
    assert.equal(out.id, "keep-id");
    assert.equal(out.correctIndex, 1);
    assert.deepEqual(out.options, ["40", "45", "50"]);
  });
});

describe("pt-BR structural locks", () => {
  test("writing packs pt-BR complete", () => {
    const packs = resolveWritingWordPacks("pt-BR");
    assert.equal(packs.colors.title, "Cores");
    assert.equal(packs.animals.title, "Animais");
    assert.equal(packs.food.title, "Comidas");
    const report = checkLocaleCompleteness("pt-BR");
    const ws = report.findings.find((f) => f.id === "worksheets");
    assert.equal(ws.status, "ok");
  });

  test("bare pt is registry-consistent (not pt-BR alias)", () => {
    assert.equal(resolveLocaleDefinition("pt").id, "en");
    const meaning = resolveEnglishWordMeaning("port", { listKey: "travel", instructionLocale: "pt" });
    assert.notEqual(meaning, "porto");
    assert.equal(resolveLocaleDefinition("pt-BR").id, "pt-BR");
    assert.equal(resolveLocaleDefinition("pt-PT").id, "en");
  });

  test("game pack disk authority parity for all pt-BR game slugs", () => {
    const dir = path.join(ROOT, "content-packs/pt-BR/games");
    const slugs = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json") && !f.includes("index") && f !== "burn-down-index.json")
      .map((f) => f.replace(/\.json$/, ""));
    assert.ok(slugs.length >= 30);
    let localizedTitles = 0;
    for (const slug of slugs) {
      const relative = `games/${slug}.json`;
      assert.equal(getCatalogPackExact("pt-BR", relative), null, `unexpected catalog entry ${relative}`);
      const disk = JSON.parse(fs.readFileSync(path.join(dir, `${slug}.json`), "utf8"));
      const pack = loadContentPack("pt-BR", "games", `${slug}.json`);
      assert.ok(pack, slug);
      assert.equal(pack.title, disk.title, slug);
      assert.ok(pack.title, slug);
      const en = loadContentPack("en", "games", `${slug}.json`);
      if (en?.title && pack.title !== en.title) localizedTitles += 1;
    }
    assert.ok(localizedTitles >= 20, `expected many localized titles, got ${localizedTitles}`);
  });
});

describe("pt-BR leakage scans", () => {
  test("no European PT markers / Hebrew in product trees", () => {
    assert.equal(
      treeHas(/projecto|telemóvel|ficheiro|\becrã\b|miúdo|cinqüenta/i, [
        "locales/pt-BR",
        "content-packs/pt-BR",
        "data/help-center/pt-BR",
        "docs/learning-book/pt-BR",
        "utils/learning-content-pt-BR",
      ]),
      null,
    );
    assert.equal(
      treeHas(HE, ["locales/pt-BR", "docs/learning-book/pt-BR", "utils/learning-content-pt-BR"]),
      null,
    );
  });
});

describe("Spanish / English-country untouched smoke", () => {
  test("es-419 still resolves and has Spanish worksheets wording", () => {
    const es = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/es-419/worksheets.json"), "utf8"));
    assert.ok(typeof es.hubTitle === "string" && es.hubTitle.length > 0);
    assert.doesNotMatch(es.hubTitle || "", /folhas de atividades/);
  });

  test("en-GB registry still enabled", () => {
    assert.equal(resolveLocaleDefinition("en-GB").id, "en-GB");
    assert.equal(resolveLocaleDefinition("en-GB").enabled, true);
  });
});
