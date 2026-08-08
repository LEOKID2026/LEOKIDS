import {
  resolveLocaleDefinition,
  resolveLocaleIdFromPathPrefix,
  getPublicLocalePathPrefix,
  getSelectableLocales,
} from "../../lib/i18n/locale-registry.js";
import fs from "fs";

const a = resolveLocaleDefinition("ar-001");
console.log({
  ar001: {
    id: a.id,
    pathPrefix: a.pathPrefix,
    public: getPublicLocalePathPrefix("ar-001"),
    from: resolveLocaleIdFromPathPrefix(a.pathPrefix || "ar-001"),
    selectorVisible: a.selectorVisible,
  },
});
const e = resolveLocaleDefinition("es-419");
console.log({
  es419: {
    id: e.id,
    pathPrefix: e.pathPrefix,
    selectorVisible: e.selectorVisible,
    inSel: getSelectableLocales().some((s) => s.id === "es-419"),
  },
});
const sw = fs.readFileSync("public/sw.js", "utf8");
const hits = [];
for (const m of sw.matchAll(/"(ar[^"]*)"\s*:\s*"([^"]+)"/g)) {
  hits.push(`${m[1]}:${m[2]}`);
}
console.log({ swArHits: hits.slice(0, 20), hasAr001: /"ar-001"/.test(sw) });
