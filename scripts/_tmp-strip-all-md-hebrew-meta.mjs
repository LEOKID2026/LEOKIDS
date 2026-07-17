import fs from "node:fs";
import path from "node:path";

const HE = /[\u0590-\u05FF]/;
const root = process.cwd();

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (f.endsWith(".md")) out.push(f);
  }
}

function stripHebrew(text) {
  let out = text;
  out = out.replace(/^\|\s*\*\*title_hebrew\*\*\s*\|[^\n]*\n/gm, "");
  out = out.replace(/^title_he:\s*[^\n]*\n/gm, "");
  out = out.replace(/^title_hebrew:\s*[^\n]*\n/gm, "");
  out = out.replace(
    /(\*\*Linked skill_ids:\*\*\s*`[^`]*):[^\n`]*/g,
    (m) => {
      const base = m.match(/`([^`:]+)/)?.[1] ?? "skill";
      return `**Linked skill_ids:** \`${base}\``;
    },
  );
  // skill_id table cells with Hebrew slug segments
  out = out.replace(
    /(\|\s*\*\*skill_id\*\*\s*\|\s*`)([^`]*)(`)/g,
    (m, pre, val, post) => {
      if (!HE.test(val)) return m;
      const parts = val.split(":");
      const clean = parts
        .map((p, i) => (HE.test(p) ? (i === parts.length - 1 ? "content" : "line") : p))
        .join(":");
      return `${pre}${clean}${post}`;
    },
  );
  return out;
}

const files = [];
walk(path.join(root, "docs/learning-book"), files);
let changed = 0;
let still = 0;
for (const fp of files) {
  if (!HE.test(fs.readFileSync(fp, "utf8"))) continue;
  const cleaned = stripHebrew(fs.readFileSync(fp, "utf8"));
  if (cleaned !== fs.readFileSync(fp, "utf8")) {
    fs.writeFileSync(fp, cleaned);
    changed++;
  }
  if (HE.test(fs.readFileSync(fp, "utf8"))) still++;
}
console.log("changed", changed, "still hebrew", still);
