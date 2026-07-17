/** Strip UTF-8 BOM from learning book draft markdown files. */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
let fixed = 0;

function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (f.includes(`${path.sep}drafts${path.sep}`) && f.endsWith(".md")) {
      let t = fs.readFileSync(f, "utf8");
      if (t.charCodeAt(0) === 0xfeff) {
        fs.writeFileSync(f, t.slice(1), "utf8");
        fixed++;
      }
    }
  }
}

walk(path.join(root, "docs/learning-book"));
console.log("BOM stripped from", fixed, "draft files");
