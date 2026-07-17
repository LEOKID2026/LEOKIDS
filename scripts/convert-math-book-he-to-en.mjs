/**
 * Convert remaining Hebrew math learning book pages to English.
 * Skips files already in English. Usage: node scripts/convert-math-book-he-to-en.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { translate } from "@vitalets/google-translate-api";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const HEBREW = /[\u0590-\u05FF]/;

const SECTION_HEADERS = [
  "## 1. What are we learning?",
  "## 2. Simple explanation",
  "## 3. Visual / concrete example",
  "## 4. Let's solve together",
  "## 5. Try it yourself",
  "## 6. Common mistake — watch out!",
  "## 7. Let's practice!",
];

const pages = [];
for (const grade of ["g1", "g2", "g3", "g4", "g5", "g6"]) {
  const mod = await import(
    pathToFileURL(path.join(ROOT, "lib/learning-book", `math-${grade}-registry.js`)).href
  );
  for (const id of mod[`MATH_${grade.toUpperCase()}_PAGE_ORDER`]) {
    pages.push({
      grade,
      id,
      filePath: path.join(ROOT, "docs/learning-book/math", grade, "drafts", `${id}.md`),
    });
  }
}

function extractTitle(content) {
  const h1 = content.match(/^# (.+)$/m);
  const raw = h1?.[1] ?? content.match(/\*\*title_hebrew\*\* \| (.+)/)?.[1] ?? "Untitled";
  return raw.replace(/\s*`\[DRAFT — not owner-approved\]`/g, "").trim();
}

function splitIntoSections(content) {
  const parts = content.split(/^---\s*$/m);
  return { headerBlock: parts[0] ?? content, sectionBlocks: parts.slice(1) };
}

function replaceMetadata(headerBlock, titleEnglish) {
  let block = headerBlock.replace(/^# .+$/m, `# ${titleEnglish}`);
  block = block.replace(/\*\*title_hebrew\*\*/g, "**title_english**");
  block = block.replace(/(\*\*title_english\*\* \| ).+/, `$1${titleEnglish}`);
  block = block.replace(/ `\[DRAFT — not owner-approved\]`/g, "");
  return block;
}

function protectContent(text) {
  const preserved = [];
  let idx = 0;
  const keep = (value) => {
    const key = `ZZP${idx++}ZZ`;
    preserved.push({ key, value });
    return key;
  };
  let working = text;
  working = working.replace(/`[^`\n]+`/g, keep);
  working = working.replace(/```[\s\S]*?```/g, keep);
  working = working.replace(/^[-*] `[^`\n]+`[^\n]*$/gm, keep);
  working = working.replace(/[½⅓¼¾⅔₪]/g, keep);
  working = working.replace(/^\*\*Source references:\*\*[\s\S]*?(?=^\*\*Content scope:\*\*|\Z)/m, keep);
  return { working, preserved };
}

function restoreContent(text, preserved) {
  let out = text;
  for (const { key, value } of preserved) out = out.split(key).join(value);
  return out;
}

function preprocessHebrew(text) {
  const terms = [
    [/חיבור/g, "ADDITION"], [/חיסור/g, "SUBTRACTION"], [/כפל/g, "MULTIPLICATION"],
    [/חילוק/g, "DIVISION"], [/שברים/g, "FRACTIONS"], [/שבר/g, "FRACTION"],
    [/משוואות/g, "EQUATIONS"], [/משוואה/g, "EQUATION"], [/השוואה/g, "COMPARISON"],
    [/עשרוניים/g, "DECIMALS"], [/עשרוני/g, "DECIMAL"], [/אחוזים/g, "PERCENTS"],
    [/אחוז/g, "PERCENT"], [/יחס/g, "RATIO"], [/קנה מידה/g, "SCALE"],
    [/עיגול/g, "ROUNDING"], [/שכנים/g, "NEIGHBORS"], [/מאות/g, "HUNDREDS"],
    [/עשרות/g, "TENS"], [/אחדות/g, "ONES"], [/שארית/g, "REMAINDER"],
    [/ציר המספרים/g, "NUMBER LINE"], [/מונה/g, "NUMERATOR"], [/מכנה/g, "DENOMINATOR"],
  ];
  let out = text;
  for (const [p, r] of terms) out = out.replace(p, r);
  return out;
}

function postprocessEnglish(text) {
  const fixes = [
    [/\bADDITION\b/g, "addition"], [/\bSUBTRACTION\b/g, "subtraction"],
    [/\bMULTIPLICATION\b/g, "multiplication"], [/\bDIVISION\b/g, "division"],
    [/\bFRACTIONS\b/g, "fractions"], [/\bFRACTION\b/g, "fraction"],
    [/\bEQUATIONS\b/g, "equations"], [/\bEQUATION\b/g, "equation"],
    [/\bCOMPARISON\b/g, "comparing"], [/\bDECIMALS\b/g, "decimals"],
    [/\bDECIMAL\b/g, "decimal"], [/\bPERCENTS\b/g, "percents"],
    [/\bPERCENT\b/g, "percent"], [/\bRATIO\b/g, "ratio"], [/\bSCALE\b/g, "scale"],
    [/\bROUNDING\b/g, "rounding"], [/\bNEIGHBORS\b/g, "neighbors"],
    [/\bHUNDREDS\b/g, "hundreds"], [/\bTENS\b/g, "tens"], [/\bONES\b/g, "ones"],
    [/\bREMAINDER\b/g, "remainder"], [/\bNUMBER LINE\b/g, "number line"],
    [/\bNUMERATOR\b/g, "numerator"], [/\bDENOMINATOR\b/g, "denominator"],
    [/## 1\. What are we learning\?\s*\n\nWhat we learn/g, "## 1. What are we learning?\n\nToday we're going to learn"],
    [/Today we're going to learn to learn/g, "Today we're going to learn"],
    [/Now you know how to how to/g, "Now you know how to"],
    [/Try to solve by yourself\./g, "Try to solve it on your own."],
    [/On the next page we will check together the way and the answer\./gi,
      "On the next page we'll check the steps and the answer together."],
  ];
  let out = text;
  for (const [p, r] of fixes) out = out.replace(p, r);
  return out.replace(/\n{3,}/g, "\n\n");
}

async function translateChunk(text, retries = 6) {
  if (!text.trim()) return text;
  const { working, preserved } = protectContent(preprocessHebrew(text));
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await translate(working, { from: "he", to: "en" });
      return postprocessEnglish(restoreContent(result.text, preserved));
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)));
    }
  }
  return text;
}

async function convertFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  if (!HEBREW.test(original)) return null;

  const titleEn = postprocessEnglish(await translateChunk(extractTitle(original)));
  const { headerBlock, sectionBlocks } = splitIntoSections(original);
  let header = replaceMetadata(headerBlock, titleEn);

  const scopeMatch = header.match(/\*\*Content scope:\*\* (.+)/);
  if (scopeMatch && HEBREW.test(scopeMatch[1])) {
    header = header.replace(
      scopeMatch[0],
      `**Content scope:** ${postprocessEnglish(await translateChunk(scopeMatch[1]))}`
    );
  }

  const bodies = sectionBlocks.map((b) => b.trim().split("\n").slice(1).join("\n").trim());
  const batch = bodies.map((body, i) => `[[SECTION_${i + 1}]]\n${body}`).join("\n\n");
  const translatedBatch = postprocessEnglish(await translateChunk(batch));

  const sections = [];
  for (let i = 0; i < sectionBlocks.length; i++) {
    const marker = `[[SECTION_${i + 1}]]`;
    const next = `[[SECTION_${i + 2}]]`;
    let bodyEn = "";
    const start = translatedBatch.indexOf(marker);
    if (start !== -1) {
      const cs = start + marker.length;
      const end = i + 1 < sectionBlocks.length ? translatedBatch.indexOf(next, cs) : translatedBatch.length;
      bodyEn = translatedBatch.slice(cs, end === -1 ? undefined : end).trim();
    } else if (bodies[i]) {
      bodyEn = postprocessEnglish(await translateChunk(bodies[i]));
    }
    sections.push(`\n---\n\n${SECTION_HEADERS[i]}\n\n${bodyEn}`.trimEnd());
  }

  return `${header.trimEnd()}${sections.join("\n")}\n`;
}

const results = { converted: 0, skipped: 0, failed: [] };
const pending = pages.filter((p) => HEBREW.test(fs.readFileSync(p.filePath, "utf8")));

console.log(`Hebrew pages remaining: ${pending.length} / ${pages.length}`);

for (const page of pending) {
  try {
    process.stdout.write(`  ${page.grade}/${page.id}... `);
    const converted = await convertFile(page.filePath);
    if (!converted) {
      console.log("SKIP");
      results.skipped++;
      continue;
    }
    fs.writeFileSync(page.filePath, converted, "utf8");
    results.converted++;
    console.log("OK");
  } catch (err) {
    console.log("FAILED");
    results.failed.push({ ...page, error: String(err?.message || err) });
  }
  await new Promise((r) => setTimeout(r, 8000));
}

console.log("\n=== Summary ===");
console.log(`Converted: ${results.converted}`);
console.log(`Skipped (already English): ${results.skipped}`);
console.log(`Failed: ${results.failed.length}`);
for (const f of results.failed) console.log(`  - ${f.grade}/${f.id}: ${f.error}`);
process.exit(results.failed.length ? 1 : 0);
