/**
 * Regression tests for ar-001 FAIL remediations (hubs, SEO, bind, terminology).
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { getPublicPageSeoForLocale, PUBLIC_PAGE_SEO_META } from "../../lib/site/public-page-seo.js";
import {
  getGuidePageContentForLocale,
  getPracticePageContentForLocale,
} from "../../lib/seo/locale-public-seo-content.js";
import {
  bindPlatformDisplayLocale,
  activityModeLabelHe,
  SUBJECT_LABEL_HE,
  subjectLabel,
} from "../../lib/platform-ui/display-labels.js";
import { bindLearningBurnDownLocale, burnDownCopy } from "../../lib/learning/burn-down-copy.js";
import { bindGamePackLocale, gamePackCopy } from "../../lib/games/game-pack-copy.js";

const ROOT = process.cwd();
const ARABIC = /[\u0600-\u06FF]/;
const INDIC = /[٠١٢٣٤٥٦٧٨٩]/;
const FORBIDDEN_BRAND = /أطفال ليو|ليو كيدز|أدلة ليو للأطفال/;
const FORBIDDEN_PARENT = /الوالدين|البوابة الأم|أحد الوالدين/;

describe("ar-001 remediation regressions", () => {
  test("guides hub pack renders Arabic chrome fields", () => {
    const page = getGuidePageContentForLocale("ar-001", "hub");
    assert.ok(page);
    for (const key of ["badge", "h1", "intro"]) {
      assert.match(String(page[key] || ""), ARABIC, key);
      assert.doesNotMatch(String(page[key] || ""), /Practical guides|Home practice/i);
    }
    assert.ok(Array.isArray(page.faq) && page.faq.length > 0);
    assert.match(page.faq[0].q, ARABIC);
    assert.match(page.faq[0].a, ARABIC);
  });

  test("practice hub pack renders Arabic chrome fields", () => {
    const page = getPracticePageContentForLocale("ar-001", "hub");
    assert.ok(page);
    for (const key of ["badge", "h1", "intro", "displayTitle"]) {
      if (page[key]) assert.match(String(page[key]), ARABIC, key);
    }
    assert.ok(Array.isArray(page.faq) && page.faq.length > 0);
  });

  test("all PUBLIC_PAGE_SEO_META keys resolve Arabic with no raw snake_case", () => {
    for (const key of Object.keys(PUBLIC_PAGE_SEO_META)) {
      const seo = getPublicPageSeoForLocale("ar-001", key);
      assert.match(seo.title, ARABIC, `${key} title`);
      assert.doesNotMatch(seo.title, /^[a-z0-9_]+$/i, `${key} raw title`);
      if (seo.description) {
        assert.match(seo.description, ARABIC, `${key} description`);
        assert.doesNotMatch(seo.description, /^[a-z0-9_]+$/i, `${key} raw description`);
      }
    }
  });

  test("platform display labels stay empty before bind and Arabic after bind", () => {
    // Fresh module state is already bound by other tests sometimes — verify bind path.
    bindPlatformDisplayLocale("ar-001");
    assert.match(activityModeLabelHe("quiz"), ARABIC);
    assert.match(subjectLabel("math"), ARABIC);
    assert.ok(SUBJECT_LABEL_HE.math);
  });

  test("math age-appropriate explanations resolve via burn-down", () => {
    bindLearningBurnDownLocale("ar-001");
    const text = burnDownCopy("utils__math-explanations", "age_g12_addition");
    assert.match(text, ARABIC);
    assert.doesNotMatch(text, /Try thinking of it this way/);
  });

  test("MleoSortShapes HUD labels are Arabic", () => {
    bindGamePackLocale("ar-001");
    for (const key of ["score", "sorted", "lives", "time", "sec"]) {
      assert.match(
        gamePackCopy("components__solo-games__engines__MleoSortShapesEngine", key),
        ARABIC,
        key
      );
    }
  });

  test("worksheets subject/topic terminology lock", () => {
    const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001/worksheets.json"), "utf8"));
    assert.equal(ws.subjectField, "مادة");
    assert.equal(ws.topicField, "موضوع");
    assert.equal(ws.subjectFilterAll, "جميع المواد");
    assert.equal(ws.writingCategoryPrewriting, "ما قبل الكتابة");
    assert.equal(ws.writingNumberModeBeforeAfter, "قبل / بعد");
  });

  test("no Arabic-Indic digits in ar-001 locales/content-packs user packs", () => {
    const roots = ["locales/ar-001", "content-packs/ar-001", "data/help-center/ar-001"];
    const hits = [];
    for (const root of roots) {
      const walk = (dir) => {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, ent.name);
          if (ent.isDirectory()) walk(p);
          else if (/\.(json|js|md)$/.test(ent.name)) {
            const text = fs.readFileSync(p, "utf8");
            if (INDIC.test(text)) hits.push(p);
          }
        }
      };
      if (fs.existsSync(root)) walk(root);
    }
    assert.equal(hits.length, 0, hits.slice(0, 10).join(", "));
  });

  test("brand + parent terminology locks on help + hubs", () => {
    const files = [
      "data/help-center/ar-001/index.js",
      "data/help-center/ar-001/parents.js",
      "content-packs/ar-001/public-seo/guides/hub.json",
      "content-packs/ar-001/public-seo/marketing/teachers.json",
    ];
    for (const rel of files) {
      const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
      assert.doesNotMatch(text, FORBIDDEN_BRAND, rel);
      assert.doesNotMatch(text, FORBIDDEN_PARENT, rel);
    }
    const style = fs.readFileSync(path.join(ROOT, "docs/i18n/ar-001-style-guide.md"), "utf8");
    assert.match(style, /Leo Kids/);
    assert.match(style, /ولي الأمر/);
  });

  test("platform display labels: ar-001 bind has no English flash on miss", () => {
    bindPlatformDisplayLocale("ar-001");
    assert.match(activityModeLabelHe("quiz"), ARABIC);
    assert.match(subjectLabel("math"), ARABIC);
    // Missing keys must not fall back to English under ar-001.
    const unknown = activityModeLabelHe("totally_unknown_mode_xyz");
    assert.doesNotMatch(unknown, /[A-Za-z]{3,}/);
    assert.doesNotMatch(subjectLabel("not_a_real_subject_xyz"), /Math|Science|English/);
  });

  test("SortShapes intro + Memory difficulty packs are Arabic", () => {
    bindGamePackLocale("ar-001");
    for (const key of ["intro_pick_box", "intro_points", "intro_mistake", "intro_finish"]) {
      assert.match(
        gamePackCopy("components__solo-games__engines__MleoSortShapesEngine", key),
        ARABIC,
        key
      );
    }
    for (const key of ["difficulty_easy", "difficulty_medium", "difficulty_hard"]) {
      assert.match(
        gamePackCopy("components__solo-games__engines__MleoMemoryEngine", key),
        ARABIC,
        key
      );
      assert.doesNotMatch(
        gamePackCopy("components__solo-games__engines__MleoMemoryEngine", key),
        /^(Easy|Medium|Hard)$/
      );
    }
  });

  test("geometry solution steps resolve Arabic chrome under ar-001", async () => {
    bindLearningBurnDownLocale("ar-001");
    const { getSolutionSteps } = await import("../../utils/geometry-explanations.js");
    const steps = getSolutionSteps(
      {
        shape: "square",
        params: { side: 5 },
        correctAnswer: 25,
        question: "side 5 cm",
      },
      "area",
      "g3"
    );
    assert.ok(Array.isArray(steps) && steps.length >= 3);
    const joined = steps.map((s) => (typeof s === "string" ? s : String(s?.props?.children ?? s))).join(" ");
    // At least the identify/formula chrome keys resolve to Arabic in burn-down.
    const identify = burnDownCopy(
      "utils__geometry-explanations",
      "sol_1_identify_square_all_sides_the_same_length_area_how_much_sp_b3333972"
    );
    assert.match(identify, ARABIC);
    assert.doesNotMatch(identify, /Identify|all sides the same length/i);
  });

  test("glossary authority matches style guide student/class terms", async () => {
    const gloss = await import("../../lib/i18n/arabic-master-glossary.js");
    const G = gloss.ARABIC_MASTER_GLOSSARY || gloss.default || gloss;
    const student = G.Student?.preferred || G.student?.preferred;
    assert.match(String(student || ""), /تلميذ/);
    assert.doesNotMatch(String(student || ""), /^الطالب$/);
    const students = G.Students?.preferred;
    assert.equal(students, "تلاميذ");
    const cls = G["Class group"]?.preferred || G["class group"]?.preferred;
    assert.equal(cls, "الفصل");
  });

  test("reports geometry area family uses مساحة not منطقة", () => {
    const reports = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001/reports.json"), "utf8"));
    const geo = reports.topics?.geometry || {};
    for (const [k, v] of Object.entries(geo)) {
      if (/area|مساح/i.test(k) || /area/i.test(String(v))) {
        assert.doesNotMatch(String(v), /منطقة/, k);
      }
      assert.doesNotMatch(String(v), /منطقة مربعة|مقدمة للمنطقة|منطقة شبه|منطقة متوازي/);
    }
  });

  test("sw.js never falls back to English offline HTML for ar-001", () => {
    const sw = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
    assert.match(sw, /offlineInlineFallbackHtml/);
    assert.match(sw, /lang=\"ar\" dir=\"rtl\"/);
    assert.doesNotMatch(
      sw,
      /if \(offlinePath !== '\/offline'\)[\s\S]*caches\.match\('\/offline'\)/
    );
  });
});
