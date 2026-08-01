#!/usr/bin/env node
/**
 * Apply es-419 learning-book translation patches onto seeded MD trees.
 * Patch format: { pages: [{ id, h1, title_english, contentScope, sections: [{ number, body }] }] }
 * Preserves EN section rawTitle, metadata IDs, and non-translated structure.
 *
 * Usage: node scripts/i18n/apply-learning-book-es419-batch.mjs <patch.json> [patch2.json ...]
 */
import fs from "fs";
import path from "path";
import { parseLearningPageMarkdown } from "../../lib/learning-book/parse-learning-page-markdown.js";

const root = process.cwd();
const patchFiles = process.argv.slice(2);
if (!patchFiles.length) {
  console.error("Usage: node scripts/i18n/apply-learning-book-es419-batch.mjs <patch.json>...");
  process.exit(1);
}

let applied = 0;
/** @type {string[]} */
const errors = [];

for (const patchFile of patchFiles) {
  const abs = path.isAbsolute(patchFile) ? patchFile : path.join(root, patchFile);
  const patch = JSON.parse(fs.readFileSync(abs, "utf8"));
  const subject = patch.subject;
  const grade = patch.grade;
  if (!subject || !grade || !Array.isArray(patch.pages)) {
    errors.push(`invalid patch ${patchFile}`);
    continue;
  }

  for (const rec of patch.pages) {
    const id = rec.id;
    const target = path.join(
      root,
      "docs/learning-book/es-419",
      subject,
      grade,
      "drafts",
      `${id}.md`,
    );
    const enPath = path.join(
      root,
      "docs/learning-book/en",
      subject,
      grade,
      "drafts",
      `${id}.md`,
    );
    if (!fs.existsSync(enPath)) {
      errors.push(`missing EN ${subject}:${grade}:${id}`);
      continue;
    }
    const enRaw = fs.readFileSync(enPath, "utf8");
    const enPage = parseLearningPageMarkdown(enRaw, id);

    // Start from EN structure; replace H1, title_english value, content scope, section bodies.
    let out = enRaw;

    // H1
    out = out.replace(/^# .+$/m, `# ${String(rec.h1 || enPage.displayTitle).trim()}`);

    // title_english table cell (with or without backticks)
    if (rec.title_english) {
      const title = String(rec.title_english).trim();
      out = out.replace(
        /(\|\s*\*\*title_english\*\*\s*\|\s*)(?:`[^`]*`|[^\n|]+)(\s*\|)/,
        `$1\`${title}\`$2`,
      );
    }

    // Content scope
    if (typeof rec.contentScope === "string" && rec.contentScope.length) {
      out = out.replace(
        /(\*\*Content scope:\*\*\s*).+/,
        `$1${String(rec.contentScope).trim()}`,
      );
    }

    // Section bodies — split by ## N. headings
    const sectionMap = new Map(
      (rec.sections || []).map((s) => [Number(s.number), String(s.body || "").trim()]),
    );

    const parts = out.split(/(?=^## \d+\. )/m);
    const rebuilt = parts.map((part) => {
      const m = part.match(/^## (\d+)\. ([^\n]*)\n/);
      if (!m) return part;
      const num = Number(m[1]);
      const title = m[2];
      const newBody = sectionMap.get(num);
      if (newBody == null) return part;
      // Keep heading line; replace body until next section / EOF
      return `## ${num}. ${title}\n\n${newBody}\n\n`;
    });

    // Preserve preamble (before first ## N.) from original split
    // parts[0] is preamble if file starts with # title
    out = rebuilt.join("").replace(/\n{3,}/g, "\n\n").trim() + "\n";

    // Validate section count
    const parsed = parseLearningPageMarkdown(out, id);
    if (parsed.sections.length !== enPage.sections.length) {
      errors.push(
        `section count drift after apply ${subject}:${grade}:${id} en=${enPage.sections.length} out=${parsed.sections.length}`,
      );
      continue;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, out);
    applied += 1;
  }
}

console.log(JSON.stringify({ applied, errorCount: errors.length, errors: errors.slice(0, 20) }, null, 2));
if (errors.length) process.exit(1);
