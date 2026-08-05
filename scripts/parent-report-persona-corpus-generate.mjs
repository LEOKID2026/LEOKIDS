import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "reports", "parent-report-persona-corpus");
const JSON_DIR = join(OUT_DIR, "json");
const TEXT_DIR = join(OUT_DIR, "text");
const HTML_DIR = join(OUT_DIR, "html");
const SHOTS_DIR = join(OUT_DIR, "screenshots");
for (const dir of [OUT_DIR, JSON_DIR, TEXT_DIR, HTML_DIR, SHOTS_DIR]) mkdirSync(dir, { recursive: true });

const { buildDetailedParentReportFromBaseReport } = await import(
  pathToFileURL(join(ROOT, "utils", "detailed-parent-report.js")).href
);
const { normalizeExecutiveSummary } = await import(
  pathToFileURL(join(ROOT, "utils", "parent-report-payload-normalize.js")).href
);
const { PARENT_REPORT_PERSONA_CORPUS } = await import(
  pathToFileURL(join(ROOT, "tests", "fixtures", "parent-report-persona-corpus.mjs")).href
);

function cleanText(v) {
  return String(v || "").replace(/\s+/g, " ").trim();
}
function normalizeLine(v) {
  return cleanText(v).toLowerCase();
}
function dedupe(lines) {
  const seen = new Set();
  const out = [];
  for (const raw of Array.isArray(lines) ? lines : []) {
    const t = cleanText(raw);
    if (!t) continue;
    const n = normalizeLine(t);
    if (seen.has(n)) continue;
    seen.add(n);
    out.push(t);
  }
  return out;
}
function sectionTxt(title, lines) {
  const body = (Array.isArray(lines) ? lines : []).map((x) => `- ${x}`).join("\n");
  return `## ${title}\n${body || "-   ."}\n`;
}
function sectionHtml(title, lines) {
  const items = (Array.isArray(lines) ? lines : []).map((line) => `<li>${String(line || "")}</li>`).join("");
  return `<section><h2>${title}</h2>${items ? `<ul>${items}</ul>` : "<p>  .</p>"}</section>`;
}
function shortReportFromDetailed(detailed) {
  const top = detailed?.parentProductContractV1?.top || {};
  return {
    parentProductContractPreview: {
      mainStatusHe: cleanText(top?.mainStatusHe),
      mainPriorityHe: cleanText(top?.mainPriorityHe),
      doNowHe: cleanText(top?.doNowHe),
      avoidNowHe: cleanText(top?.avoidNowHe),
      confidenceHe: cleanText(top?.confidenceHe),
      evidenceSummaryHe: cleanText(top?.evidenceSummaryHe),
      nextCheckHe: cleanText(top?.nextCheckHe),
      trendEvidenceStatus: cleanText(top?.evidence?.trendEvidenceStatus),
      primaryFocusType: cleanText(top?.primaryFocusType),
    },
  };
}

const indexRows = [];
const reviewerRows = [];
const reviewerBlindRows = [];

for (const persona of PARENT_REPORT_PERSONA_CORPUS) {
  const base = persona.buildBaseReport();
  const detailed = buildDetailedParentReportFromBaseReport(base, { period: "week" });
  const short = shortReportFromDetailed(detailed);
  const topContract = detailed?.parentProductContractV1?.top || {};
  const subjectContracts = detailed?.parentProductContractV1?.subjects || {};

  const normalizedExecutive = normalizeExecutiveSummary(detailed);
  const executiveLines = dedupe([
    ...(normalizedExecutive?.topStrengthsAcrossHe || []),
    ...(normalizedExecutive?.topFocusAreasHe || []),
    ...(normalizedExecutive?.majorTrendsHe || []),
    ...(normalizedExecutive?.monitoringOnlyAreasHe || []),
  ]);
  const topLines = dedupe([
    `: ${topContract.mainStatusHe || ""}`,
    ` : ${topContract.mainPriorityHe || ""}`,
    `  : ${topContract.doNowHe || ""}`,
    `: ${topContract.whyHe || ""}`,
    `   : ${topContract.avoidNowHe || ""}`,
    ` : ${topContract.confidenceHe || ""}`,
    ` : ${topContract.evidenceSummaryHe || ""}`,
    ` : ${topContract.nextCheckHe || ""}`,
  ]);
  const subjectLines = [];
  for (const [sid, row] of Object.entries(subjectContracts)) {
    const lines = dedupe([
      `: ${sid}`,
      `: ${row?.mainStatusHe || ""}`,
      `: ${row?.mainPriorityHe || ""}`,
      `  : ${row?.doNowHe || ""}`,
      `   : ${row?.avoidNowHe || ""}`,
      ` : ${row?.confidenceHe || ""}`,
    ]);
    subjectLines.push(...lines);
  }
  const summaryLines = dedupe([
    `  : ${persona.expectedParentConclusionHe}`,
    `  : ${cleanText(topContract.mainPriorityHe)}`,
    `  : ${cleanText(topContract.doNowHe)}`,
    `   : ${cleanText(topContract.avoidNowHe)}`,
  ]);

  const shortTxt = sectionTxt("  ", [
    `: ${short.parentProductContractPreview.mainStatusHe}`,
    ` : ${short.parentProductContractPreview.mainPriorityHe}`,
    `  : ${short.parentProductContractPreview.doNowHe}`,
    `   : ${short.parentProductContractPreview.avoidNowHe}`,
  ]);
  const detailedTxt = [
    sectionTxt(" ", topLines),
    sectionTxt(" ", executiveLines),
    sectionTxt("  ", subjectLines),
    sectionTxt("  ", detailed?.homePlan?.itemsHe || []),
    sectionTxt("  ", detailed?.nextPeriodGoals?.itemsHe || []),
  ].join("\n");
  const summaryTxt = sectionTxt(" ", summaryLines);

  const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${persona.id}</title></head><body>
<h1>${persona.titleHe}</h1>
<p>${persona.descriptionHe}</p>
<p><strong>Expected:</strong> ${persona.expectedParentConclusionHe}</p>
${sectionHtml("  ", [
  `: ${short.parentProductContractPreview.mainStatusHe}`,
  ` : ${short.parentProductContractPreview.mainPriorityHe}`,
  `  : ${short.parentProductContractPreview.doNowHe}`,
  `   : ${short.parentProductContractPreview.avoidNowHe}`,
])}
${sectionHtml(" ", topLines)}
${sectionHtml(" ", executiveLines)}
${sectionHtml("  ", subjectLines)}
</body></html>`;

  writeFileSync(join(JSON_DIR, `${persona.id}.short.json`), JSON.stringify(short, null, 2), "utf8");
  writeFileSync(join(JSON_DIR, `${persona.id}.detailed.json`), JSON.stringify(detailed, null, 2), "utf8");
  writeFileSync(join(TEXT_DIR, `${persona.id}.short.txt`), shortTxt, "utf8");
  writeFileSync(join(TEXT_DIR, `${persona.id}.detailed.txt`), detailedTxt, "utf8");
  writeFileSync(join(TEXT_DIR, `${persona.id}.summary.txt`), summaryTxt, "utf8");
  writeFileSync(join(HTML_DIR, `${persona.id}.html`), html, "utf8");

  indexRows.push(
    `| ${persona.id} | ${persona.category} | ${persona.expectedParentConclusionHe} | ` +
      `[short](./text/${persona.id}.short.txt) | [detailed](./text/${persona.id}.detailed.txt) | ` +
      `[html](./html/${persona.id}.html) | GENERATED |`
  );

  reviewerRows.push(`## ${persona.id} — ${persona.titleHe}`);
  reviewerRows.push(`- : ${persona.category}`);
  reviewerRows.push(`-   /: ${persona.descriptionHe}`);
  reviewerRows.push(`- /: ${persona.expectedParentConclusionHe}`);
  reviewerRows.push(`- short: \`reports/parent-report-persona-corpus/text/${persona.id}.short.txt\``);
  reviewerRows.push(`- detailed: \`reports/parent-report-persona-corpus/text/${persona.id}.detailed.txt\``);
  reviewerRows.push("-  :");
  reviewerRows.push("  - Did you understand within 10 seconds what is happening?");
  reviewerRows.push("  - Does the recommendation match the child profile?");
  reviewerRows.push("  - Is the recommendation too strong / too weak / right?");
  reviewerRows.push("  - Is there any contradiction?");
  reviewerRows.push("  - Is there too much text?");
  reviewerRows.push("  - Is anything repetitive?");
  reviewerRows.push("  - Would a parent know what to do tonight?");
  reviewerRows.push("  - Score 1–5");
  reviewerRows.push("  - Notes");
  reviewerRows.push("");

  reviewerBlindRows.push(`## ${persona.id} — ${persona.titleHe}`);
  reviewerBlindRows.push(`- : ${persona.category}`);
  reviewerBlindRows.push(`-   /: ${persona.descriptionHe}`);
  reviewerBlindRows.push(`- short: \`reports/parent-report-persona-corpus/text/${persona.id}.short.txt\``);
  reviewerBlindRows.push(`- detailed: \`reports/parent-report-persona-corpus/text/${persona.id}.detailed.txt\``);
  reviewerBlindRows.push("-  :");
  reviewerBlindRows.push("  - Did you understand within 10 seconds what is happening?");
  reviewerBlindRows.push("  - Does the recommendation match the child profile?");
  reviewerBlindRows.push("  - Is the recommendation too strong / too weak / right?");
  reviewerBlindRows.push("  - Is there any contradiction?");
  reviewerBlindRows.push("  - Is there too much text?");
  reviewerBlindRows.push("  - Is anything repetitive?");
  reviewerBlindRows.push("  - Would a parent know what to do tonight?");
  reviewerBlindRows.push("  - Score 1–5");
  reviewerBlindRows.push("  - Notes");
  reviewerBlindRows.push("");
}

const indexMd = [
  "# Parent Report Persona Corpus",
  "",
  "| Persona | Category | Expected behavior | Short report file | Detailed report file | HTML review | Status |",
  "|---|---|---|---|---|---|---|",
  ...indexRows,
  "",
].join("\n");
writeFileSync(join(OUT_DIR, "index.md"), indexMd, "utf8");

writeFileSync(
  join(OUT_DIR, "reviewer-pack.md"),
  ["# Reviewer Pack (With Expected Behavior)", "", ...reviewerRows].join("\n"),
  "utf8"
);
writeFileSync(
  join(OUT_DIR, "reviewer-pack-blind.md"),
  ["# Reviewer Pack (Blind)", "", ...reviewerBlindRows].join("\n"),
  "utf8"
);

console.log(
  JSON.stringify(
    {
      ok: true,
      personas: PARENT_REPORT_PERSONA_CORPUS.length,
      out_dir: OUT_DIR,
      index: join(OUT_DIR, "index.md"),
      reviewer_pack: join(OUT_DIR, "reviewer-pack.md"),
      reviewer_pack_blind: join(OUT_DIR, "reviewer-pack-blind.md"),
    },
    null,
    2
  )
);
