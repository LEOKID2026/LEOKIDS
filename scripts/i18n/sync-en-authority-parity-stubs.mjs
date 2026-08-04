/**
 * Fill remaining EN geometry keys (parity with ar-001) + public SEO EN authority keys.
 * Geometry: prefer recovered English; else humanize key body (EN authority stub for wiring).
 */
import fs from "node:fs";

const GEO_SLUG = "utils__geometry-explanations";
const SEO_SLUG = "lib__site__public-page-seo";

function loadCopy(path, slug) {
  const raw = JSON.parse(fs.readFileSync(path, "utf8"));
  if (raw?.copy && typeof raw.copy === "object") return { wrap: "copy", pack: { ...raw.copy } };
  if (raw?.[slug] && typeof raw[slug] === "object") return { wrap: "slug", pack: { ...raw[slug] } };
  return { wrap: "flat", pack: { ...raw } };
}

function writeCopy(path, wrap, slug, pack) {
  if (wrap === "copy") fs.writeFileSync(path, JSON.stringify({ copy: pack }, null, 2) + "\n");
  else if (wrap === "slug") fs.writeFileSync(path, JSON.stringify({ [slug]: pack }, null, 2) + "\n");
  else fs.writeFileSync(path, JSON.stringify(pack, null, 2) + "\n");
}

function humanizeKey(key) {
  const body = String(key).replace(/_[a-f0-9]{8}$/i, "");
  return body.replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

const SEO_EN = {
  kids_page_practice_math_geometry_english_science_games_coins_cards:
    "Kids page — practice math, geometry, English and science, with games, coins and cards.",
  gallery_page_photos_and_videos_of_leo_the_site_mascot:
    "Gallery — photos and videos of Leo, the site mascot.",
  parents_page_progress_reports_reinforcement_insights_personal_activities:
    "Parents page — progress reports, reinforcement insights and personal activities.",
  math_practice_for_elementary_learners_operations_fractions_and_more:
    "Math practice for elementary learners — operations, fractions and more.",
  reading_comprehension_short_texts_english_practice_for_elementary:
    "Reading comprehension — short texts and English practice for elementary learners.",
  help_center_guides_for_parents_and_students_site_reports_practice:
    "Help center — guides for parents and students about the site, reports and practice.",
  guides_hub_practical_guides_home_practice_progress_tracking:
    "Guides hub — practical guides for home practice and progress tracking.",
};

// Geometry parity
{
  const enPath = `content-packs/en/learning/burn-down/${GEO_SLUG}.json`;
  const arPath = `content-packs/ar-001/learning/burn-down/${GEO_SLUG}.json`;
  const enL = loadCopy(enPath, GEO_SLUG);
  const arL = loadCopy(arPath, GEO_SLUG);
  let filled = 0;
  for (const k of Object.keys(arL.pack)) {
    if (enL.pack[k]) continue;
    enL.pack[k] = humanizeKey(k);
    filled += 1;
  }
  writeCopy(enPath, enL.wrap, GEO_SLUG, enL.pack);
  console.log("geometry EN filled stubs", filled, "enKeys", Object.keys(enL.pack).length, "arKeys", Object.keys(arL.pack).length);
}

// SEO EN authority
{
  const enPath = `content-packs/en/global-burn-down/${SEO_SLUG}.json`;
  const arPath = `content-packs/ar-001/global-burn-down/${SEO_SLUG}.json`;
  const enL = loadCopy(enPath, SEO_SLUG);
  const arL = loadCopy(arPath, SEO_SLUG);
  let added = 0;
  for (const k of Object.keys(arL.pack)) {
    if (enL.pack[k]) continue;
    enL.pack[k] = SEO_EN[k] || humanizeKey(k);
    added += 1;
  }
  writeCopy(enPath, enL.wrap, SEO_SLUG, enL.pack);
  console.log("seo EN added", added, "enKeys", Object.keys(enL.pack).length, "arKeys", Object.keys(arL.pack).length);
}
