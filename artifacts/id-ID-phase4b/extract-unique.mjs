/**
 * Extract unique translatable strings from EN games/rewards/demo packs.
 */
import fs from "node:fs";
import path from "node:path";
import { shouldPreserveString, walkLeaves } from "./helpers.mjs";

function walkFiles(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, acc);
    else if (e.name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

const uniq = new Map();
for (const fam of ["games", "rewards", "demo"]) {
  for (const f of walkFiles(path.join("content-packs/en", fam))) {
    const rel = f.split(path.sep).join("/");
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    for (const L of walkLeaves(j)) {
      if (typeof L.value !== "string") continue;
      if (shouldPreserveString(L.key, L.value, L.path, rel)) continue;
      if (!uniq.has(L.value)) uniq.set(L.value, { count: 0, samples: [] });
      const rec = uniq.get(L.value);
      rec.count += 1;
      if (rec.samples.length < 3) rec.samples.push(`${rel}::${L.path}`);
    }
  }
}

const list = [...uniq.entries()]
  .map(([en, meta]) => ({ en, count: meta.count, samples: meta.samples }))
  .sort((a, b) => b.count - a.count || a.en.localeCompare(b.en));

fs.writeFileSync(
  "artifacts/id-ID-phase4b/unique-translatable.json",
  JSON.stringify(list, null, 2),
  "utf8"
);
console.log("unique translatable", list.length);
// split into chunks of 200 for agents
const chunkSize = 200;
for (let i = 0, n = 0; i < list.length; i += chunkSize, n++) {
  const chunk = list.slice(i, i + chunkSize).map((x) => x.en);
  fs.writeFileSync(
    `artifacts/id-ID-phase4b/strings-chunk-${n}.json`,
    JSON.stringify(chunk, null, 2),
    "utf8"
  );
  console.log("chunk", n, chunk.length);
}
