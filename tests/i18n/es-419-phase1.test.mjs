/**
 * Focused phase-1 checks for Latin American Spanish (es-419).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  LOCALE_REGISTRY,
  getSelectableLocales,
  resolveLocaleDefinition,
  resolveDirection,
} from "../../lib/i18n/locale-registry.js";
import { buildLocaleFallbackChain, normalizeLocaleId } from "../../lib/i18n/locale-normalize.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { stripLocaleFromPath, withLocalePath } from "../../lib/i18n/locale-path.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
  I18N_NAMESPACES,
} from "../../lib/i18n/load-messages.js";
import { createTranslator } from "../../lib/i18n/create-translator.js";
import { FORBIDDEN_ES_LATAM_PATTERNS } from "../../lib/i18n/spanish-latam-glossary.js";
import { ES419_TRANSLATED_NAMESPACES } from "../../lib/i18n/es-419-translation-inventory.js";
import { SUBJECT_LABEL_KEYS } from "../../lib/auth/auth-registration.js";
import { LEARNING_SUBJECT_ALLOWLIST } from "../../lib/learning-supabase/learning-activity.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("es-419 is registered, LTR, enabled, Español label", () => {
  const def = LOCALE_REGISTRY["es-419"];
  assert.ok(def);
  assert.equal(def.enabled, true);
  assert.equal(def.status, "enabled");
  assert.equal(def.direction, "ltr");
  assert.equal(def.nativeName, "Español");
  assert.equal(def.fallbackLocale, "en");
  assert.equal(def.intlLocale, "es-419");
  assert.equal(resolveDirection("es-419"), "ltr");
  assert.equal(resolveLocaleDefinition("es-419").id, "es-419");
  assert.equal(resolveLocaleDefinition("es-LA").id, "es-419");
  assert.equal(LOCALE_REGISTRY.es, undefined);
});

test("es-419 always appears in language switcher with English", () => {
  const ids = getSelectableLocales().map((l) => l.id);
  assert.ok(ids.includes("en"));
  // es-419 is the inheritance base; countries are selectable instead of Español.
  assert.ok(!ids.includes("es-419"));
  assert.ok(ids.includes("es-MX"));
  assert.ok(ids.includes("es-CO"));
  assert.ok(ids.includes("es-AR"));
  assert.ok(ids.includes("es-PE"));
  assert.ok(ids.includes("es-CL"));
  assert.ok(ids.includes("es-EC"));
  assert.ok(ids.includes("es-GT"));
  assert.ok(ids.includes("es-DO"));
  assert.ok(!ids.includes("en-XA"));
  assert.ok(!ids.includes("ar-XB"));
});

test("es-419 path routing and same-page locale switch prefix", () => {
  assert.deepEqual(stripLocaleFromPath("/es-419/learning"), {
    locale: "es-419",
    pathname: "/learning",
    hadPrefix: true,
    pathSegment: "es-419",
  });
  assert.equal(withLocalePath("es-419", "/learning"), "/es-419/learning");
  assert.equal(withLocalePath("en", "/learning"), "/learning");
});

test("es-419 fallback chain and future country parent chain", () => {
  assert.deepEqual(getLocaleFallbackChain("es-419"), ["es-419", "en"]);
  assert.deepEqual(buildLocaleFallbackChain("es-MX", { configuredFallback: "es-419", defaultLocale: "en" }), [
    "es-MX",
    "es-419",
    "en",
  ]);
  assert.equal(normalizeLocaleId("es-419"), "es-419");
});

test("es-419 loads Spanish across all UI namespaces", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("es-419");
  for (const ns of I18N_NAMESPACES) {
    assert.ok(bundles[ns], `missing namespace ${ns}`);
  }
  assert.equal(lookupMessage(bundles, "common.startLearning"), "Empezar a aprender");
  assert.equal(lookupMessage(bundles, "common.subjectMath"), "Matemáticas");
  assert.equal(lookupMessage(bundles, "ui.languageSwitcher.label"), "Idioma");
  assert.equal(lookupMessage(bundles, "auth.signIn"), "Iniciar sesión");
  assert.equal(lookupMessage(bundles, "validation.required"), "Este campo es obligatorio.");
  assert.equal(lookupMessage(bundles, "seo.homeTitle"), "Leo Kids — Práctica para estudiantes de primaria");
  assert.equal(lookupMessage(bundles, "learning.english.steps.findLocalizedMeaning"), "Encuentra el significado de la palabra.");
  assert.equal(lookupMessage(bundles, "emails.welcomeSubject"), "Te damos la bienvenida a Leo Kids");
});

test("es-419 translated namespace JSON key parity vs en", () => {
  function leafPaths(obj, prefix = []) {
    /** @type {string[]} */
    const out = [];
    for (const [k, v] of Object.entries(obj)) {
      const p = [...prefix, k];
      if (v && typeof v === "object" && !Array.isArray(v)) out.push(...leafPaths(v, p));
      else out.push(p.join("."));
    }
    return out.sort();
  }

  for (const ns of ES419_TRANSLATED_NAMESPACES) {
    const en = JSON.parse(fs.readFileSync(path.join(root, "locales", "en", `${ns}.json`), "utf8"));
    const es = JSON.parse(fs.readFileSync(path.join(root, "locales", "es-419", `${ns}.json`), "utf8"));
    assert.deepEqual(leafPaths(es), leafPaths(en), `key mismatch in ${ns}`);
  }
});

test("es-419 translated strings preserve placeholders and avoid forbidden LatAm patterns", () => {
  function walkStrings(obj, out = []) {
    for (const v of Object.values(obj)) {
      if (typeof v === "string") out.push(v);
      else if (v && typeof v === "object" && !Array.isArray(v)) walkStrings(v, out);
    }
    return out;
  }

  function placeholders(s) {
    const simple = [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
    const icu = [...String(s).matchAll(/\{(\w+)\s*,/g)].map((m) => m[1]);
    return [...new Set([...simple, ...icu])].sort();
  }

  for (const ns of ES419_TRANSLATED_NAMESPACES) {
    const en = JSON.parse(fs.readFileSync(path.join(root, "locales", "en", `${ns}.json`), "utf8"));
    const es = JSON.parse(fs.readFileSync(path.join(root, "locales", "es-419", `${ns}.json`), "utf8"));

    function check(enNode, esNode, pathParts) {
      for (const key of Object.keys(enNode)) {
        const p = [...pathParts, key];
        const ev = enNode[key];
        const sv = esNode[key];
        if (ev && typeof ev === "object" && !Array.isArray(ev)) {
          assert.ok(sv && typeof sv === "object", `missing object at ${p.join(".")}`);
          check(ev, sv, p);
        } else if (typeof ev === "string") {
          assert.equal(typeof sv, "string", `missing string at ${p.join(".")}`);
          assert.deepEqual(placeholders(sv), placeholders(ev), `placeholder mismatch at ${p.join(".")}`);
        }
      }
    }
    check(en, es, [ns]);

    for (const s of walkStrings(es)) {
      for (const { id, re } of FORBIDDEN_ES_LATAM_PATTERNS) {
        assert.equal(re.test(s), false, `forbidden ${id} in ${ns}: ${s.slice(0, 80)}`);
      }
    }
  }
});

test("createTranslator(es-419) returns Spanish for phase-1 keys", () => {
  resetLocaleBundleCache();
  const t = createTranslator("es-419");
  assert.equal(t.locale, "es-419");
  assert.equal(t.direction, "ltr");
  assert.equal(t.t("common.continue"), "Continuar");
  assert.equal(t.t("auth.email"), "Correo electrónico");
  assert.match(t.t("common.gradeLabel", { grade: 3 }), /Grado 3/);
});

test("es-419 has complete UI namespace coverage on disk matching I18N_NAMESPACES", () => {
  assert.deepEqual([...ES419_TRANSLATED_NAMESPACES].sort(), [...I18N_NAMESPACES].sort());
  for (const ns of I18N_NAMESPACES) {
    assert.ok(fs.existsSync(path.join(root, "locales", "es-419", `${ns}.json`)), ns);
  }
  resetLocaleBundleCache();
  assert.equal(lookupMessage(loadLocaleBundles("es-419"), "seo.homeTitle"), "Leo Kids — Práctica para estudiantes de primaria");
  assert.equal(lookupMessage(loadLocaleBundles("es-419"), "emails.welcomeSubject"), "Te damos la bienvenida a Leo Kids");
  assert.equal(lookupMessage(loadLocaleBundles("es-419"), "legal.privacyTitle"), "Política de privacidad");
  assert.equal(lookupMessage(loadLocaleBundles("es-419"), "teacher.subjects.math"), "Matemáticas");
  assert.equal(lookupMessage(loadLocaleBundles("es-419"), "copilot.boundary.generalOffTopic").includes("informe"), true);
});

test("global registration and teacher/platform subject maps are only four product subjects", () => {
  assert.deepEqual(Object.keys(SUBJECT_LABEL_KEYS).sort(), ["english", "geometry", "math", "science"]);
  assert.deepEqual([...LEARNING_SUBJECT_ALLOWLIST].sort(), ["english", "geometry", "math", "science"]);
  const authEn = JSON.parse(fs.readFileSync(path.join(root, "locales", "en", "auth.json"), "utf8"));
  const authEs = JSON.parse(fs.readFileSync(path.join(root, "locales", "es-419", "auth.json"), "utf8"));
  assert.deepEqual(Object.keys(authEn.registration.subjects).sort(), ["english", "geometry", "math", "science"]);
  assert.deepEqual(Object.keys(authEs.registration.subjects).sort(), ["english", "geometry", "math", "science"]);
  const teacherEn = JSON.parse(fs.readFileSync(path.join(root, "locales", "en", "teacher.json"), "utf8"));
  const platformEn = JSON.parse(fs.readFileSync(path.join(root, "locales", "en", "platform.json"), "utf8"));
  assert.deepEqual(Object.keys(teacherEn.subjects).sort(), ["english", "geometry", "math", "science"]);
  assert.deepEqual(Object.keys(platformEn.subjects).sort(), ["english", "geometry", "math", "science"]);
  assert.deepEqual(teacherEn.reportSubjects.slice().sort(), ["english", "geometry", "math", "science"]);
});

test("learning english chrome no longer names Hebrew in user-facing values", () => {
  for (const loc of ["en", "es-419"]) {
    const learning = JSON.parse(fs.readFileSync(path.join(root, "locales", loc, "learning.json"), "utf8"));
    const values = [];
    function walk(o) {
      for (const v of Object.values(o)) {
        if (typeof v === "string") values.push(v);
        else if (v && typeof v === "object") walk(v);
      }
    }
    walk(learning.english || {});
    walk({ wordBoardBlurb: learning.master?.wordBoardBlurb });
    for (const v of values) {
      assert.equal(/Hebrew|hebreo/i.test(v), false, `${loc}: ${v}`);
    }
  }
});
