import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const arr = JSON.parse(fs.readFileSync(path.join(dir, "_de-DE-book-uncovered.json"), "utf8"));

const student = arr.filter(({ en }) => {
  if (/^:::/.test(en)) return false;
  if (/^```/.test(en)) return false;
  if (/^type:\s*\w/.test(en)) return false;
  if (/[\u0590-\u05FF]/.test(en)) return false;
  if (
    /registry|commit, push|Not in scope|runtime insertion|owner-approved|approval_status|practice routing|Source of Truth|Document \/ file|No registry|Until owner/i.test(
      en
    )
  )
    return false;
  if (/^\| `[a-z0-9_]+\.md`/.test(en)) return false;
  if (/^\| File \|/.test(en) || /^\| Fix \|/.test(en) || /^\| Document/.test(en)) return false;
  if (/^## (Verify|Pages|Naming|Regenerate|Notes|Current Status|Explicit Stop|Source of Truth|Regenerate review)/i.test(en))
    return false;
  return /[a-zA-Z]{4,}/.test(en);
});

fs.writeFileSync(path.join(dir, "_de-DE-book-uncovered-prose.json"), JSON.stringify(student, null, 2));
console.log({
  all: arr.length,
  student: student.length,
  chars: student.reduce((a, x) => a + x.en.length, 0),
  top20: student.slice(0, 20),
});
