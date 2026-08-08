/**
 * Generate content-packs/id-ID/public-seo/* from English dumps + translation dicts.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const ART = path.join(ROOT, "artifacts/id-ID-phase2d");
const OUT = path.join(ROOT, "content-packs/id-ID/public-seo");

const seoDump = JSON.parse(fs.readFileSync(path.join(ART, "en-seo-dump.json"), "utf8"));
const legalDump = JSON.parse(fs.readFileSync(path.join(ART, "en-legal-dump.json"), "utf8"));
const seoDict = JSON.parse(fs.readFileSync(path.join(ART, "seo-dict.json"), "utf8"));
const legalDict = JSON.parse(fs.readFileSync(path.join(ART, "legal-dict.json"), "utf8"));

const SKIP_KEYS = new Set([
  "slug",
  "seoKey",
  "href",
  "route",
  "scrollToSectionId",
  "id",
  "relatedPracticePath",
  "relatedGuideSlugs",
  "action",
  "scrollTo",
  "emoji",
]);

const missing = new Set();
const translatedLeaves = { seo: 0, legal: 0 };

function makeWalker(dict, counterKey) {
  function tr(s) {
    if (typeof s !== "string") return s;
    if (s.startsWith("/")) return s;
    if (dict[s] !== undefined) {
      translatedLeaves[counterKey] += 1;
      return dict[s];
    }
    // Slug-like route identifiers already identical in dict, but preserve if missed
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s === s.toLowerCase() && !s.includes(" ")) {
      return s;
    }
    missing.add(s);
    return s;
  }

  function walk(value, key = "") {
    if (typeof value === "string") {
      if (SKIP_KEYS.has(key)) return value;
      return tr(value);
    }
    if (Array.isArray(value)) return value.map((v) => walk(v, key));
    if (value && typeof value === "object") {
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        if (SKIP_KEYS.has(k) && typeof v !== "object") {
          out[k] = v;
        } else {
          out[k] = walk(v, k);
        }
      }
      return out;
    }
    return value;
  }

  return walk;
}

const walkSeo = makeWalker(seoDict, "seo");
const walkLegal = makeWalker(legalDict, "legal");

function writeJson(rel, data) {
  const full = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data, null, 2) + "\n", "utf8");
}

const written = [];

// Guides
for (const slug of seoDump.guideSlugs) {
  const page = seoDump.guidePages[slug];
  if (!page) throw new Error(`Missing guide page: ${slug}`);
  writeJson(`guides/${slug}.json`, walkSeo(page));
  written.push(`guides/${slug}.json`);
}
writeJson("guides/hub-cards.json", walkSeo(seoDump.guideHubCards));
written.push("guides/hub-cards.json");

// Practice
for (const slug of seoDump.practiceSlugs) {
  const page = seoDump.practicePages[slug];
  if (!page) throw new Error(`Missing practice page: ${slug}`);
  writeJson(`practice/${slug}.json`, walkSeo(page));
  written.push(`practice/${slug}.json`);
}
writeJson("practice/hub-cards.json", walkSeo(seoDump.practiceHubCards));
written.push("practice/hub-cards.json");
writeJson("practice/worksheets.json", walkSeo(seoDump.worksheets));
written.push("practice/worksheets.json");

// Marketing
for (const key of ["kids", "parents", "teachers", "schools"]) {
  writeJson(`marketing/${key}.json`, walkSeo(seoDump.marketing[key]));
  written.push(`marketing/${key}.json`);
}

// Legal
writeJson("legal/unified.json", walkLegal(legalDump));
written.push("legal/unified.json");

const report = {
  missing: [...missing],
  missingCount: missing.size,
  translatedLeaves,
  writtenFiles: written.length,
  written,
  dictSizes: {
    seo: Object.keys(seoDict).length,
    legal: Object.keys(legalDict).length,
  },
};

fs.writeFileSync(path.join(ART, "seo-legal-generate-report.json"), JSON.stringify(report, null, 2) + "\n");

if (missing.size) {
  console.error("MISSING", [...missing].slice(0, 80));
  process.exit(1);
}

console.log("SEO/legal overlays generated OK", {
  written: written.length,
  translatedLeaves,
});
