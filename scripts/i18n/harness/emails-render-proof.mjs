/**
 * ar-001 emails render proof (audit harness — NOT live SMTP delivery).
 *
 * Proves locales/ar-001/emails.json is loadable via the product message loader
 * and that key subjects/body intros resolve to Arabic text.
 *
 * Usage: node scripts/i18n/harness/emails-render-proof.mjs
 * Output: artifacts/i18n/ar-001-emails-render-proof.json
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../../..");
const OUT = join(ROOT, "artifacts/i18n/ar-001-emails-render-proof.json");

const ARABIC_RE = /[\u0600-\u06FF]/;
const KEYS = [
  "emails.resetSubject",
  "emails.welcomeSubject",
  "emails.resetBodyIntro",
];

async function main() {
  const modPath = pathToFileURL(join(ROOT, "lib/i18n/load-messages.js")).href;
  const { loadLocaleBundles, lookupMessage } = await import(modPath);
  const bundles = loadLocaleBundles("ar-001");

  const rendered = {};
  const missing = [];
  const nonArabic = [];

  for (const key of KEYS) {
    const value = lookupMessage(bundles, key);
    rendered[key] = value == null ? null : String(value);
    if (value == null || String(value).trim() === "") {
      missing.push(key);
    } else if (!ARABIC_RE.test(String(value))) {
      nonArabic.push(key);
    }
  }

  const ok = missing.length === 0 && nonArabic.length === 0;
  const proof = {
    ok,
    locale: "ar-001",
    strategy: "loader_render_proof",
    note: "Render surface proof only — does not send email / no SMTP",
    generatedAt: new Date().toISOString(),
    keysChecked: KEYS,
    rendered,
    missing,
    nonArabic,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(proof, null, 2)}\n`, "utf8");

  console.log(`emails render proof → ${OUT}`);
  console.log(ok ? "OK" : "FAIL", { missing, nonArabic });
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
