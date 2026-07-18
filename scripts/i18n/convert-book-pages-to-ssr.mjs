import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pageRoots = [
  path.join(root, "pages/learning/book"),
  path.join(root, "pages/student/learning/book"),
];

/** @param {string} dir */
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs, out);
    else if (ent.name.endsWith(".js")) out.push(abs);
  }
  return out;
}

let changed = 0;
for (const base of pageRoots) {
  if (!fs.existsSync(base)) continue;
  for (const abs of walk(base)) {
    let source = fs.readFileSync(abs, "utf8");
    const before = source;
    source = source.replace(/\bgetStaticProps\b/g, "getServerSideProps");
    source = source.replace(
      /export async function getStaticPaths\(\) \{[\s\S]*?\r?\n\}\r?\n\r?\n/g,
      "",
    );
    source = source.replace(
      /export function getStaticPaths\(\) \{[\s\S]*?\r?\n\}\r?\n\r?\n/g,
      "",
    );
    if (source !== before) {
      fs.writeFileSync(abs, source);
      changed += 1;
      console.log("ssr", path.relative(root, abs));
    }
  }
}

console.log(`converted ${changed} book page files to SSR`);
