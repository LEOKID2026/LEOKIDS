/**
 * Portugal (pt-PT) runtime wiring: path, selector, namespaces, packs, Help,
 * meanings, science, stems, learning books, writing packs, completeness.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
  getSelectableLocales,
} from "../../lib/i18n/locale-registry.js";
import {
  getLocaleFallbackChain,
  resolveContentLocale,
  resolveInterfaceLocale,
} from "../../lib/i18n/locale-resolution.js";
import {
  stripLocaleFromPath,
  withLocalePath,
  shouldRedirectToPublicLocalePrefix,
} from "../../lib/i18n/locale-path.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { loadContentPack } from "../../lib/content/locale.server.js";
import { getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import { reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";
import {
  ALL_ARTICLES_PT_BR,
  ALL_ARTICLES_PT_PT,
  getArticle,
  listArticles,
  resolveHelpLocale,
} from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { localizeScienceQuestionForLocale } from "../../utils/learning-content-en/science.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import {
  renderMathStemForLocale,
  renderGeometryStemForLocale,
} from "../../lib/learning/render-question-stem.js";
import { resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
import { loadMathG1Page } from "../../lib/learning-book/load-math-g1-pages.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import { SCIENCE_PT_PT_OVERLAY } from "../../data/science-questions-pt-PT-overlay.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const NAMESPACES = [
  "common",
  "ui",
  "auth",
  "validation",
  "learning",
  "reports",
  "worksheets",
  "games",
  "emails",
  "seo",
  "legal",
  "teacher",
  "school",
  "platform",
  "copilot",
];

test("pt-PT maps /pt and falls back pt-PT → pt-BR → en", () => {
  assert.equal(getPublicLocalePathPrefix("pt-PT"), "pt");
  assert.equal(resolveLocaleIdFromPathPrefix("pt"), "pt-PT");
  assert.equal(resolveLocaleIdFromPathPrefix("br"), "pt-BR");
  assert.deepEqual(getLocaleFallbackChain("pt-PT"), ["pt-PT", "pt-BR", "en"]);
  assert.equal(resolveLocaleDefinition("pt-PT").label, "Portugal");
  assert.equal(resolveLocaleDefinition("pt-PT").fallbackLocale, "pt-BR");
  assert.equal(withLocalePath("pt-PT", "/parents"), "/pt/parents");
  assert.equal(stripLocaleFromPath("/pt/parents").locale, "pt-PT");
});

test("pt-PT canonical redirects from /pt-PT and /PT", () => {
  const fromInternal = stripLocaleFromPath("/pt-PT/student/home");
  assert.equal(fromInternal.locale, "pt-PT");
  assert.equal(shouldRedirectToPublicLocalePrefix("pt-PT", fromInternal.pathSegment), true);
  assert.equal(withLocalePath("pt-PT", fromInternal.pathname), "/pt/student/home");

  const fromUpper = stripLocaleFromPath("/PT/parents");
  assert.equal(fromUpper.locale, "pt-PT");
  assert.equal(shouldRedirectToPublicLocalePrefix("pt-PT", fromUpper.pathSegment), true);
  assert.equal(shouldRedirectToPublicLocalePrefix("pt-PT", "pt"), false);
});

test("selector includes Portugal; count 47", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 47);
  const pt = locales.find((l) => l.id === "pt-PT");
  assert.ok(pt);
  assert.equal(pt.label, "Portugal");
  assert.equal(pt.nativeName, "Portugal");
  assert.equal(pt.pathPrefix, "pt");
  // Switcher never exposes bare `pt` as a selectable id.
  assert.ok(!locales.some((l) => l.id === "pt"));
});

test("bare pt authority: /pt path feeds pt-PT; direct pt never aliases pt-BR", () => {
  // Public path authority (middleware / resolveInterfaceLocale).
  const parsed = stripLocaleFromPath("/pt/student/home");
  assert.equal(parsed.locale, "pt-PT");
  assert.equal(resolveLocaleDefinition(parsed.locale).id, "pt-PT");
  assert.equal(resolveInterfaceLocale({ asPath: "/pt/parents" }), "pt-PT");

  const runtime = "pt-PT";
  assert.equal(resolveHelpLocale(runtime), "pt-PT");
  assert.equal(resolveContentLocale({ contentLocale: runtime }), "pt-PT");
  assert.equal(
    resolveEnglishWordMeaning("bus", { listKey: "travel", instructionLocale: runtime }),
    "autocarro"
  );
  assert.equal(resolveWritingWordPacks(runtime).food.title, "Alimentos");

  // Direct bare `pt` (out of path flow): safe English fallback — never Brazil.
  assert.equal(resolveLocaleDefinition("pt").id, "en");
  assert.equal(resolveContentLocale({ contentLocale: "pt" }), "en");
  assert.equal(
    resolveEnglishWordMeaning("bus", { listKey: "travel", instructionLocale: "pt" }),
    "bus"
  );
  assert.equal(resolveWritingWordPacks("pt").food.title, "Food");
  assert.notEqual(resolveWritingWordPacks("pt").food.title, "Comidas");
  assert.equal(resolveHelpLocale("pt"), "pt-PT"); // Help follows Portugal path authority
  assert.notEqual(resolveHelpLocale("pt"), "pt-BR");
  assert.notEqual(resolveLocaleDefinition("pt").id, "pt-BR");
});

test("pt-PT loads all 15 namespaces via deep merge with Portugal samples", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("pt-PT");
  for (const ns of NAMESPACES) {
    assert.ok(bundles[ns] && typeof bundles[ns] === "object", ns);
  }
  assert.equal(lookupMessage(bundles, "common.grade1"), "1.º ano");
  const flat = JSON.stringify(bundles);
  assert.match(flat, /ficha de trabalho/i);
  assert.match(flat, /telemóvel/i);
  assert.match(flat, /encarregado de educação/i);
});

test("pt-PT content packs deep-merge; missing packs inherit pt-BR", () => {
  const books = loadContentPack("pt-PT", "books", "ui.json");
  const demo = loadContentPack("pt-PT", "demo", "ui.json");
  const rewards = loadContentPack("pt-PT", "rewards", "ui.json");
  assert.ok(books && Object.keys(books).length >= 1);
  assert.ok(demo && Object.keys(demo).length >= 1);
  assert.ok(rewards && Object.keys(rewards).length >= 1);

  assert.ok(getCatalogPackExact("pt-PT", "books/ui.json"));
  assert.ok(getCatalogPackExact("pt-PT", "reports/burn-down-index.json"));
  // Structure packs not on disk for pt-PT — inherit via chain
  const geoStruct = loadContentPack("pt-PT", "learning", "taxonomy", "geometry.structure.json");
  const brStruct = loadContentPack("pt-BR", "learning", "taxonomy", "geometry.structure.json");
  assert.ok(geoStruct);
  assert.deepEqual(geoStruct, brStruct);
});

test("pt-PT report label sample", () => {
  const label = reportPackCopyForLocale(
    "pt-PT",
    "lib__parent-report-server-truth",
    "parent_report"
  );
  assert.match(String(label || ""), /encarregados de educação|Relatório/i);
});

test("Help: pt-PT overlays; bare pt follows Portugal path authority; not Brazil", () => {
  assert.equal(resolveHelpLocale("pt-PT"), "pt-PT");
  assert.equal(resolveHelpLocale("pt"), "pt-PT");
  assert.equal(resolveHelpLocale("pt-BR"), "pt-BR");
  assert.deepEqual(
    ALL_ARTICLES_PT_PT.map((a) => `${a.section}/${a.slug}`).sort(),
    ALL_ARTICLES_PT_BR.map((a) => `${a.section}/${a.slug}`).sort()
  );
  assert.equal(listArticles("parents", "pt-PT").length, listArticles("parents", "pt-BR").length);

  const overridden = getArticle("parents", "welcome-and-overview", "pt-PT");
  const brWelcome = getArticle("parents", "welcome-and-overview", "pt-BR");
  assert.ok(overridden);
  // Sparse body overlay (title may still inherit pt-BR).
  assert.match(JSON.stringify(overridden), /encarregados de educação/i);
  assert.notEqual(JSON.stringify(overridden), JSON.stringify(brWelcome));

  const inherited = getArticle("parents", "parent-copilot", "pt-PT");
  const br = getArticle("parents", "parent-copilot", "pt-BR");
  assert.ok(inherited);
  assert.equal(inherited.title, br.title);
});

test("word meanings: Portugal overrides + pt-BR inheritance; bare pt not Brazil", () => {
  assert.equal(
    resolveEnglishWordMeaning("bus", { listKey: "travel", instructionLocale: "pt-PT" }),
    "autocarro"
  );
  assert.equal(
    resolveEnglishWordMeaning("juice", { listKey: "food", instructionLocale: "pt-PT" }),
    "sumo"
  );
  assert.equal(
    resolveEnglishWordMeaning("phone", { listKey: "technology", instructionLocale: "pt-PT" }),
    "telemóvel"
  );
  assert.equal(
    resolveEnglishWordMeaning("port", { listKey: "travel", instructionLocale: "pt-PT" }),
    "porto"
  );
  assert.equal(
    resolveEnglishWordMeaning("grade", { listKey: "school", instructionLocale: "pt-PT" }),
    "ano"
  );
  assert.equal(
    resolveEnglishWordMeaning("bus", { listKey: "travel", instructionLocale: "pt-BR" }),
    "ônibus"
  );
  const bare = resolveEnglishWordMeaning("port", { listKey: "travel", instructionLocale: "pt" });
  assert.notEqual(bare, "porto");
});

test("science overlay sample: terminology + options; 1017 records", () => {
  assert.equal(Object.keys(SCIENCE_PT_PT_OVERLAY).length, 1017);

  const eyes = localizeScienceQuestionForLocale(
    { id: "sci_g3_body_027", subject: "science", options: ["a", "b", "c", "d"] },
    "pt-PT"
  );
  assert.match(JSON.stringify(eyes), /ecrãs/i);

  const body = localizeScienceQuestionForLocale(
    { id: "body_2", subject: "science", options: ["a", "b", "c", "d"] },
    "pt-PT"
  );
  assert.ok(Array.isArray(body.options));
  assert.ok(body.options.includes("Ouvidos"));
  assert.ok(body.options.includes("Olhos"));
});

test("Math/Geometry stems: arithmetic, euros money, word problem, area, perimeter", () => {
  const arith = renderMathStemForLocale(
    { operation: "addition", params: { a: 4, b: 7 } },
    "pt-PT"
  );
  assert.match(String(arith.stem), /Quanto é 4 \+ 7\?/);

  const money = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "pt-PT" }
  );
  assert.match(String(money.question || ""), /euros?/i);
  assert.doesNotMatch(String(money.question || ""), /R\$|reais/i);

  const wp = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_simple_add", a: 3, b: 5 } },
    { subject: "math", contentLocale: "pt-PT" }
  );
  assert.match(String(wp.question || ""), /Quant/i);

  const area = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "pt-PT" }
  );
  assert.match(String(area.question || ""), /área|area/i);

  const peri = renderGeometryStemForLocale(
    { params: { kind: "square_perimeter", side: 6 } },
    "pt-PT"
  );
  assert.match(String(peri.stem), /perímetro|perimetro/i);
});

test("learning-book loader prefers pt-PT before pt-BR", () => {
  assert.equal(
    resolveLearningBookDraftsDir("pt-PT", "math", "g1"),
    "docs/learning-book/pt-PT/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("pt-PT", "science", "g3"),
    "docs/learning-book/pt-PT/science/g3/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("pt-PT", "geometry", "g6"),
    "docs/learning-book/pt-PT/geometry/g6/drafts"
  );

  const g1 = loadMathG1Page("add_two", { contentLocale: "pt-PT" });
  assert.ok(g1);
  assert.doesNotMatch(JSON.stringify(g1), /[\u0590-\u05FF]/);

  const sciPath = path.join(root, "docs/learning-book/pt-PT/science/g3/drafts/animals.md");
  assert.ok(fs.existsSync(sciPath));
  assert.match(fs.readFileSync(sciPath, "utf8"), /\S/);

  const geoPath = path.join(root, "docs/learning-book/pt-PT/geometry/g6/drafts/circle_area.md");
  assert.ok(fs.existsSync(geoPath));

  const readme = path.join(root, "docs/learning-book/pt-PT/english/g1/drafts/README.md");
  assert.ok(fs.existsSync(readme));
});

test("writing packs: Portugal titles, Pinta colors, Escreve chrome", () => {
  const packs = resolveWritingWordPacks("pt-PT");
  assert.equal(packs.colors.title, "Cores");
  assert.equal(packs.animals.title, "Animais");
  assert.equal(packs.food.title, "Alimentos");
  assert.equal(packs.transport.title, "Transportes");
  assert.equal(packs.sight.title, "Palavras frequentes");

  const red = packs.colors.words.find((w) => w.colorInstructionEn === "Color in red");
  assert.equal(red?.colorInstruction, "Pinta de vermelho");
  const blue = packs.colors.words.find((w) => w.colorInstructionEn === "Color in blue");
  assert.equal(blue?.colorInstruction, "Pinta de azul");

  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("pt-PT");
  assert.match(String(lookupMessage(bundles, "worksheets.writingInstructionIndependent") || ""), /Escreve/i);
});

test("completeness recognizes pt-PT learning surfaces", () => {
  const report = checkLocaleCompleteness("pt-PT");
  const byId = Object.fromEntries(report.findings.map((f) => [f.id, f]));
  assert.equal(byId.science_overlay.status, "ok");
  assert.equal(byId.question_stems.status, "ok");
  assert.equal(byId.worksheets.status, "ok");
});
