import fs from "fs";
import {
  getSelectableLocales,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
  getPublicLocalePathPrefix,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { withLocalePath } from "../../lib/i18n/locale-path.js";

const checks = {};
for (const id of ["en", "es-419", "ar-001", "es-AR", "id-ID", "ar-SA", "ar-EG", "ar-MA"]) {
  const def = resolveLocaleDefinition(id);
  checks[id] = {
    enabled: def.enabled,
    pathPrefix: def.pathPrefix,
    publicPrefix: getPublicLocalePathPrefix(id),
    fromPrefix: resolveLocaleIdFromPathPrefix(def.pathPrefix),
    fallback: getLocaleFallbackChain(id),
    samplePath: withLocalePath(id, "/practice/math"),
  };
}
const sel = getSelectableLocales();
checks.selectorCount = sel.length;
checks.hasIndonesia = sel.some((s) => s.id === "id-ID");
checks.hasEs419 = sel.some((s) => s.id === "es-419");
checks.hasAr001 = sel.some((s) => s.id === "ar-001");
checks.hasEsAR = sel.some((s) => s.id === "es-AR");
const sw = fs.readFileSync("public/sw.js", "utf8");
checks.sw = {
  "id-ID": /"id-ID"\s*:\s*"id"/.test(sw),
  "ar-001": /"ar-001"\s*:\s*"ar"/.test(sw),
  "es-419": /"es-419"/.test(sw),
  "es-AR": /"es-AR"/.test(sw),
  offlineId: sw.includes("/id/offline") || /"id-ID"\s*:\s*"id"/.test(sw),
};
fs.writeFileSync("artifacts/id-ID-auditor-b-final/regression-wiring.json", JSON.stringify(checks, null, 2));
console.log(JSON.stringify(checks, null, 2));
