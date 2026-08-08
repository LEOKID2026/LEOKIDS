const fs = require("fs");
const path = require("path");

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(js|ts)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

const areas = [
  "parent",
  "student",
  "teacher",
  "school",
  "demo",
  "public",
  "arcade",
  "guardian",
  "learning",
  "auth",
  "contact",
];
const apiRoot = path.join(process.cwd(), "pages", "api");
const uniqueProse = new Map();
const uniqueCodes = new Map();
const allHits = [];

for (const area of areas) {
  const dir = path.join(apiRoot, area);
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    const text = fs.readFileSync(file, "utf8");
    const rel = path.relative(process.cwd(), file).replace(/\\/g, "/");
    const re = /(?:error|message)\s*:\s*["'`]([^"'`\n]{4,})["'`]/g;
    let m;
    while ((m = re.exec(text))) {
      const s = m[1].trim();
      if (!/[A-Za-z]/.test(s)) continue;
      if (/^[a-z][a-z0-9_]*$/.test(s)) {
        const ck = area + "|" + s;
        if (!uniqueCodes.has(ck)) uniqueCodes.set(ck, { area, file: rel, text: s });
        continue;
      }
      // prose-like: has space or capital letter start / mixed case words
      if (!(/\s/.test(s) || /[A-Z]/.test(s) || /[!.?]/.test(s))) continue;
      const key = area + "|" + s;
      if (!uniqueProse.has(key)) uniqueProse.set(key, { area, file: rel, text: s });
      allHits.push({ area, file: rel, text: s });
    }
  }
}

const byArea = {};
for (const r of uniqueProse.values()) {
  byArea[r.area] = (byArea[r.area] || 0) + 1;
}
const codesByArea = {};
for (const r of uniqueCodes.values()) {
  codesByArea[r.area] = (codesByArea[r.area] || 0) + 1;
}

const outDir = path.join(process.cwd(), "artifacts", "phase9a");
fs.mkdirSync(outDir, { recursive: true });
const prose = [...uniqueProse.values()].sort(
  (a, b) => a.area.localeCompare(b.area) || a.text.localeCompare(b.text)
);
const codes = [...uniqueCodes.values()].sort(
  (a, b) => a.area.localeCompare(b.area) || a.text.localeCompare(b.text)
);
fs.writeFileSync(path.join(outDir, "unique-english-prose.json"), JSON.stringify(prose, null, 2));
fs.writeFileSync(path.join(outDir, "unique-machine-codes.json"), JSON.stringify(codes, null, 2));
fs.writeFileSync(
  path.join(outDir, "summary.json"),
  JSON.stringify(
    {
      uniqueProseByArea: byArea,
      totalUniqueProse: prose.length,
      uniqueCodesByArea: codesByArea,
      totalUniqueCodes: codes.length,
      totalProseHits: allHits.length,
    },
    null,
    2
  )
);
console.log(JSON.stringify({ byArea, totalUniqueProse: prose.length, codesByArea, totalUniqueCodes: codes.length }, null, 2));
for (const area of areas) {
  const items = prose.filter((x) => x.area === area);
  console.log(`\n===${area} (${items.length})===`);
  items.forEach((i) => console.log(`- [${i.file}] ${i.text.slice(0, 140)}`));
}
