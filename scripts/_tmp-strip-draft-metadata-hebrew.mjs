import fs from "node:fs";
import path from "node:path";

const HE = /[\u0590-\u05FF]/;
const root = process.cwd();

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.includes(`${path.sep}drafts${path.sep}`) && f.endsWith(".md")) out.push(f);
  }
}

function stripMetadataHebrew(text) {
  let out = text;
  // Remove title_hebrew table rows
  out = out.replace(/^\|\s*\*\*title_hebrew\*\*\s*\|[^\n]*\n/gm, "");
  // Remove title_he frontmatter-style lines
  out = out.replace(/^title_he:\s*[^\n]*\n/gm, "");
  out = out.replace(/^title_hebrew:\s*[^\n]*\n/gm, "");
  // Linked skill_ids with Hebrew — keep English prefix only or strip Hebrew segment
  out = out.replace(
    /(\*\*Linked skill_ids:\*\*\s*`[^`]*):[^\n`]*/g,
    (m) => {
      const base = m.match(/`([^`:]+)/)?.[1] ?? "skill";
      return `**Linked skill_ids:** \`${base}\``;
    },
  );
  return out;
}

const files = [];
walk(path.join(root, "docs/learning-book"), files);
let changed = 0;
let stillHe = 0;
for (const fp of files) {
  let text = fs.readFileSync(fp, "utf8");
  if (!HE.test(text)) continue;
  const cleaned = stripMetadataHebrew(text);
  if (cleaned !== text) {
    fs.writeFileSync(fp, cleaned);
    changed++;
    text = cleaned;
  }
  if (HE.test(text)) stillHe++;
}
console.log("metadata cleaned in", changed, "files");
console.log("still hebrew after metadata strip", stillHe);
