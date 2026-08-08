import fs from "fs";
import { GUIDE_PUBLIC_PATHS, PRACTICE_PUBLIC_PATHS, SEO_PUBLIC_PATHS } from "../../lib/seo/seo-public-paths.js";
import { CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import { getSelectableLocales, LOCALE_REGISTRY } from "../../lib/i18n/locale-registry.js";
import { I18N_NAMESPACES } from "../../lib/i18n/load-messages.js";

const help = ["parents", "students", "parent-report", "subjects"];
let articles = 0;
for (const s of help) {
  const m = fs.readFileSync(`data/help-center/content/${s}.js`, "utf8");
  const slugs = [...m.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((x) => x[1]);
  console.log("help", s, slugs.length);
  articles += slugs.length;
}
console.log("help_articles_total", articles);
console.log("GUIDE", GUIDE_PUBLIC_PATHS.length);
console.log("PRACTICE", PRACTICE_PUBLIC_PATHS.length);
console.log("SEO_PUBLIC", SEO_PUBLIC_PATHS.length);
console.log("en_catalog_keys", Object.keys(CONTENT_PACK_CATALOG.en || {}).length);
console.log("namespaces", I18N_NAMESPACES.length, I18N_NAMESPACES.join(","));
console.log("selector", getSelectableLocales().length);
console.log("id_ID_registered", Boolean(LOCALE_REGISTRY["id-ID"]));
const prefixes = new Set(
  Object.values(LOCALE_REGISTRY)
    .map((l) => l.pathPrefix)
    .filter(Boolean)
);
console.log("pathPrefix_id_used", prefixes.has("id"));
