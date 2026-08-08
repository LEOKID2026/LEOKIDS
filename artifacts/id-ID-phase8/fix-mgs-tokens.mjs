/**
 * Replace remaining MGS English nouns/tokens in id-ID learning books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ID = path.join(ROOT, "docs/learning-book/id-ID");

const REPLACEMENTS = [
  [/\bmarbles\b/g, "kelereng"],
  [/\bmarble\b/g, "kelereng"],
  [/\bpencils\b/g, "pensil"],
  [/\bpencil\b/g, "pensil"],
  [/\bstickers\b/g, "stiker"],
  [/\bsticker\b/g, "stiker"],
  [/\bchairs\b/g, "kursi"],
  [/\bchair\b/g, "kursi"],
  [/\btables\b/g, "meja"],
  [/\bcarrying\b/g, "menyimpan"],
  [/\bborrowing\b/g, "meminjam"],
  [/\bdivisor\b/g, "pembagi"],
  [/\bdividend\b/g, "yang dibagi"],
  [/\bsource\b/g, "sumber"],
  // phrase cleanup for common salad leftovers
  [/\bWork out\b/g, "Hitung"],
  [/\bwork out\b/g, "hitung"],
  [/\bFind out\b/g, "Temukan"],
  [/\bfind out\b/g, "temukan"],
  [/\bround down\b/g, "bulatkan ke bawah"],
  [/\bRound down\b/g, "Bulatkan ke bawah"],
  [/\bround up\b/g, "bulatkan ke atas"],
  [/\bRound up\b/g, "Bulatkan ke atas"],
  [/\bturn off\b/g, "matikan"],
  [/\bTurn off\b/g, "Matikan"],
  [/\bset out\b/g, "susun"],
  [/\bcarry 1\b/g, "simpan 1"],
  [/\bjumlah up ke\b/g, "jumlah sampai"],
  [/\bTidak vertikal penjumlahan\b/g, "Tanpa penjumlahan vertikal"],
  [/\btidak menyimpan\b/g, "tanpa menyimpan"],
  [/\btidak penjumlahan tiga\b/g, "tanpa penjumlahan tiga"],
  [/\bbelajar ke jumlahkan\b/g, "belajar menjumlahkan"],
  [/\bbelajar ke\b/g, "belajar"],
];

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

let files = 0;
let changes = 0;
for (const subject of ["math", "geometry", "science"]) {
  for (const f of walk(path.join(ID, subject))) {
    let text = fs.readFileSync(f, "utf8");
    const before = text;
    for (const [re, to] of REPLACEMENTS) text = text.replace(re, to);
    if (text !== before) {
      fs.writeFileSync(f, text, "utf8");
      files += 1;
      changes += 1;
    }
  }
}
console.log(JSON.stringify({ files, changes }, null, 2));
