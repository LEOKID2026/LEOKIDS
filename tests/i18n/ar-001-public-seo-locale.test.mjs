/**
 * ar-001 locale-aware public SEO — titles/descriptions must resolve from Arabic packs, not English fallbacks.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { getPublicPageSeoForLocale } from "../../lib/site/public-page-seo.js";
import { loadLocaleBundles, lookupMessage } from "../../lib/i18n/load-messages.js";

const FORBIDDEN_HOME_ENGLISH = [
  "Practice areas and parent guides",
  "Want to explore Leo Kids practice areas?",
  "A learning system for elementary learners",
  "Leo Kids — Practice for elementary learners",
  "Terms, privacy & accessibility",
  "Product values",
];

describe("ar-001 public SEO locale resolution", () => {
  test("home title + description use Arabic seo.json / burn-down (not English literals)", () => {
    const seo = getPublicPageSeoForLocale("ar-001", "home");
    assert.match(seo.title, /[\u0600-\u06FF]/, `home title should be Arabic: ${seo.title}`);
    assert.match(seo.description, /[\u0600-\u06FF]/, `home description should be Arabic: ${seo.description}`);
    for (const forbidden of FORBIDDEN_HOME_ENGLISH) {
      assert.ok(!seo.title.includes(forbidden), `title contains forbidden English: ${forbidden}`);
      assert.ok(!seo.description.includes(forbidden), `description contains forbidden English: ${forbidden}`);
    }
  });

  test("homepage seoEntry + valueCardsAria keys resolve to Arabic in ui bundle", () => {
    const bundles = loadLocaleBundles("ar-001");
    const keys = [
      "ui.public.homepage.seoEntry.title",
      "ui.public.homepage.seoEntry.body",
      "ui.public.homepage.seoEntry.quickLinks.math",
      "ui.public.homepage.valueCardsAria",
      "legal.legalHubLink",
    ];
    for (const key of keys) {
      const val = lookupMessage(bundles, key);
      assert.ok(typeof val === "string" && val.trim(), `missing ${key}`);
      assert.match(val, /[\u0600-\u06FF]/, `${key} should be Arabic: ${val}`);
    }
  });

  test("practice-hub + help SEO resolve Arabic for ar-001", () => {
    for (const pageKey of ["practice-hub", "help", "about", "contact"]) {
      const seo = getPublicPageSeoForLocale("ar-001", pageKey);
      assert.match(seo.title, /[\u0600-\u06FF]/, `${pageKey} title: ${seo.title}`);
      assert.match(seo.description, /[\u0600-\u06FF]/, `${pageKey} description: ${seo.description}`);
    }
  });
});
