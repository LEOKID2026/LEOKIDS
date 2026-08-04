import fs from "node:fs";
import path from "node:path";

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const freq = new Map();
for (const f of walk("docs/learning-book/en")) {
  if (f.includes(`${path.sep}english${path.sep}`) || f.includes("/english/")) continue;
  let inFence = false;
  for (const line of fs.readFileSync(f, "utf8").split(/\n/)) {
    const t = line.trim();
    if (t.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || t.startsWith(":::") || !t) continue;
    if (/^\|\s*\*\*(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(line)) continue;
    if (/^[\d\s+\-×÷=/?.,…#-]+$/.test(t)) continue;
    if (!/[A-Za-z]{3,}/.test(t)) continue;
    // skip pure headings already mapped
    freq.set(t, (freq.get(t) || 0) + 1);
  }
}
const arr = [...freq.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync("scripts/i18n/_book-en-freq.json", JSON.stringify(arr.slice(0, 800).map(([en, n]) => ({ en, n })), null, 2));
console.log({ unique: freq.size, top800: arr.slice(0, 800).length });
console.log(arr.slice(0, 40).map(([e, n]) => `${n}\t${e.slice(0, 100)}`).join("\n"));
