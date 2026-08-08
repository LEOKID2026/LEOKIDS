import fs from 'node:fs';

const dir = 'artifacts/id-ID-phase4c';
const chunk = JSON.parse(fs.readFileSync(`${dir}/chunk-1.json`, 'utf8'));
const translations = JSON.parse(fs.readFileSync(`${dir}/translations-1.json`, 'utf8'));

if (chunk.length !== translations.length) {
  console.error(`LENGTH MISMATCH: chunk=${chunk.length} translations=${translations.length}`);
  process.exit(1);
}

const dict = {};
const placeholderIssues = [];
const placeholderRe = /\{[a-zA-Z0-9_]+\}|\{[a-zA-Z0-9_]+,\s*plural,[\s\S]*?\}/g;

for (let i = 0; i < chunk.length; i++) {
  const en = chunk[i];
  const id = translations[i];
  if (typeof id !== 'string' || id.length === 0) {
    console.error(`EMPTY TRANSLATION at index ${i}: ${JSON.stringify(en)}`);
    process.exit(1);
  }
  dict[en] = id;

  const enPh = (en.match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
  const idPh = (id.match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
  if (JSON.stringify(enPh) !== JSON.stringify(idPh)) {
    placeholderIssues.push({ index: i, en, id, enPh, idPh });
  }
}

if (Object.keys(dict).length !== chunk.length) {
  console.error(`KEY COUNT MISMATCH after dedupe: dict keys=${Object.keys(dict).length} chunk length=${chunk.length}`);
  // find duplicates
  const seen = new Map();
  chunk.forEach((s, idx) => {
    if (seen.has(s)) console.error(`Duplicate source string at ${idx} and ${seen.get(s)}: ${JSON.stringify(s)}`);
    else seen.set(s, idx);
  });
  process.exit(1);
}

let allPresent = true;
for (const s of chunk) {
  if (!(s in dict)) {
    console.error(`MISSING KEY: ${JSON.stringify(s)}`);
    allPresent = false;
  }
}
if (!allPresent) process.exit(1);

if (placeholderIssues.length) {
  console.error('PLACEHOLDER MISMATCHES:');
  for (const p of placeholderIssues) {
    console.error(JSON.stringify(p, null, 2));
  }
  process.exit(1);
}

fs.writeFileSync(`${dir}/dict-chunk-1.json`, JSON.stringify(dict, null, 2) + '\n', 'utf8');

console.log('OK');
console.log('chunk.length =', chunk.length);
console.log('Object.keys(dict).length =', Object.keys(dict).length);
console.log('all chunk strings are keys:', chunk.every((s) => s in dict));
