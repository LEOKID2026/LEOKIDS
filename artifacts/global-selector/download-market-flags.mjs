/**
 * One-shot: download unique market-flag SVGs into public/assets/market-flags/.
 * Source: flagcdn.com (MIT-friendly public flag CDN). Assets are committed locally
 * so CSP img-src 'self' continues to work without runtime CDN dependency.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listUniqueMarketFlagCodes } from "../../lib/i18n/locale-selector-flags.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../../public/assets/market-flags");

fs.mkdirSync(outDir, { recursive: true });

const codes = listUniqueMarketFlagCodes();
let ok = 0;
for (const code of codes) {
  const url = `https://flagcdn.com/${code}.svg`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed ${code}: HTTP ${res.status}`);
  }
  const svg = await res.text();
  if (!svg.includes("<svg")) {
    throw new Error(`Invalid SVG for ${code}`);
  }
  fs.writeFileSync(path.join(outDir, `${code}.svg`), svg, "utf8");
  ok += 1;
  process.stdout.write(`ok ${code}\n`);
}

process.stdout.write(`Downloaded ${ok}/${codes.length} flags → ${outDir}\n`);
