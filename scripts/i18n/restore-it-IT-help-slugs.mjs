/**
 * Restore English-authority slugs/paths/section keys inside it-IT help articles.
 * Titles/body copy stay Italian.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const files = [
  ["parents", "PARENT_ARTICLES"],
  ["students", "STUDENT_ARTICLES"],
  ["parent-report", "PARENT_REPORT_ARTICLES"],
  ["subjects", "SUBJECT_ARTICLES"],
];

function restorePaths(text, badSlug, goodSlug) {
  if (!badSlug || badSlug === goodSlug) return text;
  return text.split(badSlug).join(goodSlug);
}

for (const [name, exportName] of files) {
  const en = (
    await import(pathToFileURL(path.join(ROOT, `data/help-center/content/${name}.js`)).href)
  )[exportName];
  const itPath = path.join(ROOT, `data/help-center/it-IT/${name}.js`);
  let src = fs.readFileSync(itPath, "utf8");
  const itMod = await import(pathToFileURL(itPath).href + `?t=${Date.now()}`);
  const itArts = itMod[exportName];
  if (en.length !== itArts.length) {
    throw new Error(`${name}: article count mismatch en=${en.length} it=${itArts.length}`);
  }
  for (let i = 0; i < en.length; i += 1) {
    const good = en[i].slug;
    const bad = itArts[i].slug;
    src = restorePaths(src, bad, good);
    // section must stay English key
    if (en[i].section) {
      src = src.replace(new RegExp(`"section":\\s*"${bad}"`, "g"), `"section": "${en[i].section}"`);
    }
  }
  // global section key restorations
  src = src
    .replace(/"section":\s*"genitores"/g, '"section": "parents"')
    .replace(/"section":\s*"alunnos"/g, '"section": "students"')
    .replace(/"section":\s*"genitore-report"/g, '"section": "parent-report"')
    .replace(/\/help-center\/screenshots\/genitores\//g, "/help-center/screenshots/parents/")
    .replace(/\/help-center\/screenshots\/alunnos\//g, "/help-center/screenshots/students/")
    .replace(/\/help-center\/screenshots\/genitore-report\//g, "/help-center/screenshots/parent-report/");

  // restore any remaining mangled slug tokens globally from EN list
  const pairs = [
    ["create-genitore-account", "create-parent-account"],
    ["genitore-dashboard-tour", "parent-dashboard-tour"],
    ["alunno-pin-and-credentials", "student-pin-and-credentials"],
    ["edit-or-delete-alunno", "edit-or-delete-student"],
    ["genitore-copilot", "parent-copilot"],
    ["alunno-login", "student-login"],
    ["alunno-home-tour", "student-home-tour"],
    ["answering-domande", "answering-questions"],
  ];
  for (const [bad, good] of pairs) src = restorePaths(src, bad, good);

  // also undo accidental domanda.png filename if EN uses question.png
  src = src.replace(/\/domanda\.png/g, "/question.png");

  fs.writeFileSync(itPath, src, "utf8");
  console.log("restored", name);
}

// rewrite index cleanly
await import(pathToFileURL(path.join(ROOT, "scripts/i18n/fix-it-IT-help-slugs.mjs")).href);
console.log("done");
