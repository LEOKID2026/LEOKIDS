/**
 * Strict MGS English-token scan (content pages only, not README).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORD_ID } from "./id-book-words.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ID = path.join(ROOT, "docs/learning-book/id-ID");

const ALLOW = new Set([
  ...Object.keys(WORD_ID),
  // units / symbols / proper-ish / technical
  "cm", "mm", "km", "kg", "g", "ml", "l", "rp", "gcf", "fpb", "kpk", "pdf", "sql", "cta",
  "id", "url", "http", "https", "www", "pi", "md", "js", "mjs", "json", "png", "svg",
  "noah", "danny", "dana", "mia", "amir", "noa", "abcd", "ab", "bc", "cd", "da",
  "var", "todo", "ok", "cta",
  // Indonesian function words that look latin
  "dan", "atau", "dari", "ke", "di", "pada", "untuk", "dengan", "tanpa", "oleh", "yang",
  "ini", "itu", "ada", "ketika", "apa", "bagaimana", "berapa", "banyak", "lebih", "semua",
  "setiap", "hanya", "juga", "sudah", "lagi", "selalu", "tidak", "ya", "adalah", "bisa",
  "akan", "harus", "kamu", "kita", "mereka", "dia", "hari", "sekarang", "pertama", "kedua",
  "belajar", "temukan", "lihat", "baca", "tulis", "hitung", "selesaikan", "periksa", "coba",
  "mulai", "buat", "gunakan", "contoh", "latihan", "pertanyaan", "jawaban", "soal", "kata",
  "bilangan", "digit", "nilai", "jumlah", "total", "selisih", "faktor", "kelipatan",
  "penjumlahan", "pengurangan", "perkalian", "pembagian", "genap", "ganjil", "prima",
  "pecahan", "desimal", "persen", "langkah", "metode", "aturan", "rumus", "satuan",
  "puluhan", "ratusan", "ribuan", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh",
  "delapan", "sembilan", "nol", "kiri", "kanan", "sama", "besar", "kecil", "bersama",
  "kelompok", "pasangan", "sisi", "sudut", "garis", "bentuk", "persegi", "panjang",
  "segitiga", "lingkaran", "kubus", "bola", "tabung", "kerucut", "prisma", "limas",
  "alas", "tinggi", "luas", "keliling", "volume", "diagonal", "jari", "diameter",
  "matematika", "geometri", "sains", "kelas", "murid", "guru", "anak", "sekolah",
  "buku", "halaman", "bab", "draf", "konten", "penting", "ingat", "penyelesaian",
  "penjelasan", "ilmiah", "percobaan", "hipotesis", "variabel", "kesimpulan", "grafik",
  "tabel", "air", "udara", "cahaya", "matahari", "tanaman", "makanan", "tubuh", "menit",
  "jam", "uang", "koin", "harga", "diskon", "titik", "poin", "vertikal", "mudah", "aman",
  "mari", "jika", "jadi", "karena", "seperti", "antara", "sesudah", "sebelum", "lalu",
  "maju", "mundur", "translasi", "refleksi", "rotasi", "simetri", "sejajar", "derajat",
  "putaran", "hipotenusa", "trapesium", "jajar", "genjang", "bangun", "ruang", "muka",
  "rusuk", "hasil", "bagi", "kali", "hilang", "keseluruhan", "bagian", "setengah",
  "seperempat", "pembilang", "penyebut", "tetangga", "barisan", "pola", "konversi",
  "pembulatan", "perkiraan", "perbandingan", "meter", "sentimeter", "gram", "kilogram",
  "liter", "kecepatan", "jarak", "siklus", "tahap", "energi", "gaya", "materi", "bahan",
  "perangkat", "listrik", "panas", "dingin", "tumbuh", "bernapas", "campuran",
  "rupiah", "kolom", "referensi", "sumber", "cakupan", "visual", "konkret", "umum",
  "hati", "hati", "bersama", "sendiri", "berikutnya", "misalnya", "berarti", "itulah",
  "empat", "tiga", "lebih", "marbles", // temporary — will fix
]);

// Remove marbles from allow - we want to catch it
ALLOW.delete("marbles");

const COMMON_EN = [
  "marble", "marbles", "pencil", "pencils", "sticker", "stickers", "apple", "apples",
  "bag", "bags", "box", "boxes", "coin", "coins", "chair", "chairs", "table", "tables",
  "student", "students", "teacher", "teachers", "because", "without", "through", "during",
  "before", "after", "while", "where", "which", "their", "there", "these", "those",
  "about", "into", "from", "with", "that", "this", "have", "has", "been", "were", "was",
  "will", "would", "could", "should", "today", "learn", "learning", "practice", "example",
  "examples", "question", "questions", "answer", "answers", "number", "numbers", "missing",
  "calculate", "solve", "check", "find", "write", "read", "count", "start", "look",
  "when", "what", "how", "many", "much", "more", "less", "equal", "equals", "addition",
  "subtraction", "multiplication", "division", "fraction", "decimal", "percent",
  "square", "rectangle", "triangle", "circle", "angle", "angles", "side", "sides",
  "area", "perimeter", "volume", "height", "length", "width", "base", "formula",
  "step", "steps", "method", "important", "remember", "try", "yourself", "together",
  "content", "scope", "source", "references", "grade", "chapter", "page", "pages",
  "carrying", "borrowing", "remainder", "quotient", "divisor", "dividend", "factor",
  "multiple", "prime", "even", "odd", "round", "estimate", "compare", "sequence",
  "water", "light", "plant", "plants", "food", "body", "experiment", "hypothesis",
  "variable", "conclusion", "graph", "environment", "energy", "matter", "force",
  "children", "child", "school", "class", "book", "draft", "owner", "approved",
  "vertical", "horizontally", "ones", "tens", "hundreds", "thousands", "digit",
  "place", "value", "whole", "part", "parts", "half", "quarter", "group", "groups",
  "pair", "pairs", "left", "right", "same", "different", "bigger", "smaller",
  "first", "second", "third", "next", "last", "each", "every", "only", "also",
  "just", "still", "already", "always", "never", "because", "so", "if", "else",
  "up", "down", "out", "off", "over", "under", "between", "among", "across",
];

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md") && !/README\.md$/i.test(p)) a.push(p);
  }
  return a;
}

const hits = [];
for (const subject of ["math", "geometry", "science"]) {
  const dir = path.join(ID, subject);
  for (const f of walk(dir)) {
    const rel = path.relative(ID, f).replace(/\\/g, "/");
    const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      if (/^```/.test(line.trim()) || /^:::/.test(line.trim())) return;
      if (/^\|/.test(line.trim()) && /learning_page_id|skill_id|age_band|page_type|approval_status|title_english/.test(line)) return;
      if (/^-\s*`?(data|docs|lib|utils)\//.test(line.trim())) return;
      const cleaned = line
        .replace(/`[^`]+`/g, " ")
        .replace(/https?:\/\/\S+/g, " ")
        .replace(/\b[\d.,]+\b/g, " ");
      for (const w of cleaned.match(/[A-Za-z']+/g) || []) {
        const low = w.toLowerCase();
        if (low.length < 3) continue;
        if (ALLOW.has(low)) continue;
        if (COMMON_EN.includes(low)) {
          hits.push({ file: rel, line: i + 1, word: w, text: line.trim().slice(0, 160) });
        }
      }
    });
  }
}

// unique by word
const byWord = hits.reduce((a, h) => {
  a[h.word.toLowerCase()] = (a[h.word.toLowerCase()] || 0) + 1;
  return a;
}, {});

fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-phase8/mgs-english-tokens.json"),
  JSON.stringify({ totalHits: hits.length, uniqueWords: Object.keys(byWord).length, byWord, sample: hits.slice(0, 100) }, null, 2)
);
console.log(JSON.stringify({ totalHits: hits.length, uniqueWords: Object.keys(byWord).length, top: Object.entries(byWord).sort((a,b)=>b[1]-a[1]).slice(0,40) }, null, 2));
