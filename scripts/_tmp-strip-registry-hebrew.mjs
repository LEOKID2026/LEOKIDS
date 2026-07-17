import fs from "node:fs";
import path from "node:path";

const HE = /[\u0590-\u05FF]/;
const root = process.cwd();
const regDir = path.join(root, "lib/learning-book");
let changed = 0;

for (const f of fs.readdirSync(regDir)) {
  if (!f.endsWith("-registry.js")) continue;
  const fp = path.join(regDir, f);
  let text = fs.readFileSync(fp, "utf8");
  const orig = text;

  // titleHe: "..." -> mirror English title when present on same object
  text = text.replace(
    /title:\s*"([^"]*)",\s*titleHe:\s*"[^"]*"/g,
    (m, title) => `title: "${title}", titleHe: "${title}"`,
  );
  text = text.replace(/bookTitleHe:\s*"([^"]*)"/g, (m, v) => {
    if (HE.test(v)) return `bookTitleHe: "English book"`;
    return m;
  });
  // Fix bookTitleHe when bookTitle exists on next lines
  text = text.replace(
    /bookTitle:\s*"([^"]*)",\s*bookTitleHe:\s*"[^"]*"/g,
    (m, bt) => `bookTitle: "${bt}", bookTitleHe: "${bt}"`,
  );
  // gradeShortLabel Hebrew
  text = text.replace(/gradeShortLabel:\s*"[^"]*"/g, (m) => {
    if (HE.test(m)) return m.replace(/"[^"]*"/, '"Grade"');
    return m;
  });
  // Any remaining Hebrew strings in registry — replace with ASCII placeholder for legacy field
  text = text.replace(/:\s*"([^"]*)"/g, (m, val) => {
    if (!HE.test(val)) return m;
    return ': ""';
  });

  if (text !== orig) {
    fs.writeFileSync(fp, text);
    changed++;
    console.log("updated", f);
  }
}
console.log("registries changed", changed);
