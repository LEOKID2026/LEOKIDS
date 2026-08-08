/**
 * Broader leftover English cleanup for MGS id-ID learning books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ID = path.join(ROOT, "docs/learning-book/id-ID");

const PHRASES = [
  [/bagian out dari/gi, "bagian dari"],
  [/temukan out/gi, "temukan"],
  [/baca out loud/gi, "bacakan dengan suara"],
  [/Letakkan out/g, "Susun"],
  [/letakkan out/g, "susun"],
  [/taken\?/gi, "diambil?"],
  [/Bagaimana banyak adalah taken/gi, "Berapa banyak yang diambil"],
  [/bagaimana banyak langkah dari (\d+) down ke (\d+)/gi, "berapa banyak langkah dari $1 turun ke $2"],
  [/down ke/gi, "turun ke"],
  [/Up ke/g, "Sampai"],
  [/up ke/g, "sampai"],
  [/Carrying gently\./g, "Dengan menyimpan secara bertahap."],
  [/tidak heavy/gi, "tanpa contoh"],
  [/values,/gi, "nilai,"],
  [/altogether\./gi, "seluruhnya."],
  [/altogether/gi, "seluruhnya"],
  [/objects \(seperti stars\)/gi, "benda (seperti bintang)"],
  [/objects/gi, "benda"],
  [/stars\./gi, "bintang."],
  [/stars/gi, "bintang"],
  [/halves\./gi, "setengah."],
  [/halves/gi, "setengah"],
  [/as visual bagian/gi, "sebagai bagian visual"],
  [/Tidak advanced pecahan calculation/gi, "Tanpa perhitungan pecahan lanjutan"],
  [/Vertikal penjumlahan \(kolom\)\./g, "Penjumlahan vertikal (kolom)."],
  [/turn off/gi, "matikan"],
  [/Take off/gi, "Lepaskan"],
  [/take off/gi, "lepaskan"],
  [/cut off/gi, "potong"],
  [/show off/gi, "pamerkan"],
  [/off the/gi, "dari"],
  [/\boff\b/gi, "mati"],
  [/\bout of\b/gi, "dari"],
  [/\bout\b/gi, ""],
  [/\bdown\b/gi, "turun"],
  [/Carrying/g, "Menyimpan"],
  [/carrying/g, "menyimpan"],
  [/\bsticker\b/gi, "stiker"],
  [/\bstickers\b/gi, "stiker"],
  [/  +/g, " "],
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
for (const subject of ["math", "geometry", "science"]) {
  for (const f of walk(path.join(ID, subject))) {
    let text = fs.readFileSync(f, "utf8");
    const before = text;
    for (const [re, to] of PHRASES) text = text.replace(re, to);
    text = text.replace(/[ \t]+\n/g, "\n").replace(/ {2,}/g, " ");
    if (text !== before) {
      fs.writeFileSync(f, text, "utf8");
      files += 1;
    }
  }
}
console.log(JSON.stringify({ files }, null, 2));
