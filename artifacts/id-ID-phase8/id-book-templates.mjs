/**
 * Template regex transforms for formulaic learning-book lines (math/geo/sci).
 * Applied after EXACT map, before phrase/word passes.
 */

/** @type {Array<[RegExp, (m: RegExpMatchArray) => string]>} */
export const LINE_TEMPLATES = [
  [/^Work out:\s*(.+)$/i, (m) => `Hitung: ${m[1]}`],
  [/^Calculate:\s*(.+)$/i, (m) => `Hitung: ${m[1]}`],
  [/^Calculate vertically:\s*(.+)$/i, (m) => `Hitung secara vertikal: ${m[1]}`],
  [/^Solve:\s*(.+)$/i, (m) => `Selesaikan: ${m[1]}`],
  [/^Check:\s*(.+)$/i, (m) => `Periksa: ${m[1]}`],
  [/^Check!$/i, () => `Periksa!`],
  [/^Check with multiplication!$/i, () => `Periksa dengan perkalian!`],
  [/^Compare:\s*(.+)$/i, (m) => `Bandingkan: ${m[1]}`],
  [/^Continue:\s*(.+)$/i, (m) => `Lanjutkan: ${m[1]}`],
  [/^Continue the sequence:\s*(.+)$/i, (m) => `Lanjutkan barisan: ${m[1]}`],
  [/^Simplify:\s*(.+)$/i, (m) => `Sederhanakan: ${m[1]}`],
  [/^Round\s+(.+)\s+to the nearest (.+)\.$/i, (m) => `Bulatkan ${m[1]} ke ${m[2]} terdekat.`],
  [/^Find all the factors of\s+(.+)\.$/i, (m) => `Temukan semua faktor dari ${m[1]}.`],
  [/^Find the GCF of\s+(.+)\.$/i, (m) => `Temukan FPB dari ${m[1]}.`],
  [/^Find the step first!$/i, () => `Temukan langkahnya dulu!`],
  [/^Write the first 5 multiples of\s+(.+)\.$/i, (m) => `Tuliskan 5 kelipatan pertama dari ${m[1]}.`],
  [/^Factors of\s+(.+)$/i, (m) => `Faktor dari ${m[1]}`],
  [/^Common factors:\s*(.+)$/i, (m) => `Faktor persekutuan: ${m[1]}`],

  [/^Now you know how to (.+)\.$/i, (m) => `Sekarang kamu sudah tahu cara ${translateVerbPhrase(m[1])}.`],
  [/^In practice you'll find (.+)\.$/i, (m) => `Dalam latihan kamu akan menemukan ${translatePracticeTail(m[1])}.`],
  [/^Today we'll (.+)\.$/i, (m) => `Hari ini kita akan ${translateVerbPhrase(m[1])}.`],
  [/^We will learn (.+)\.$/i, (m) => `Kita akan belajar ${m[1]}.`],
  [/^We'll (.+)\.$/i, (m) => `Kita akan ${translateVerbPhrase(m[1])}.`],

  [/^What is the missing number\?$/i, () => `Berapa bilangan yang hilang?`],
  [/^What is missing\?$/i, () => `Apa yang hilang?`],
  [/^what is the missing number\?$/i, () => `berapa bilangan yang hilang?`],
  [/^what is missing\?$/i, () => `apa yang hilang?`],
  [/^What is the missing divisor\?$/i, () => `Berapa pembagi yang hilang?`],
  [/^(.+) — what is the missing number\?$/i, (m) => `${m[1]} — berapa bilangan yang hilang?`],
  [/^(.+) — what is missing\?$/i, (m) => `${m[1]} — apa yang hilang?`],
  [/^(.+) — what is the missing divisor\?$/i, (m) => `${m[1]} — berapa pembagi yang hilang?`],

  [/^Square with side (.+) — what is the area\?$/i, (m) => `Persegi dengan sisi ${m[1]} — berapa luasnya?`],
  [/^Square with side (.+) — what is the perimeter\?$/i, (m) => `Persegi dengan sisi ${m[1]} — berapa kelilingnya?`],
  [/^A square with side (.+) — what is the area\?$/i, (m) => `Sebuah persegi dengan sisi ${m[1]} — berapa luasnya?`],
  [/^A square with side (.+) — what is the perimeter\?$/i, (m) => `Sebuah persegi dengan sisi ${m[1]} — berapa kelilingnya?`],
  [/^A square with a side of (.+) — what is the area\?$/i, (m) => `Sebuah persegi dengan sisi ${m[1]} — berapa luasnya?`],
  [/^Rectangle (.+) — what is the length of the diagonal\?$/i, (m) => `Persegi panjang ${m[1]} — berapa panjang diagonalnya?`],
  [/^Rectangular prism (.+) — what is the volume\?$/i, (m) => `Balok ${m[1]} — berapa volumenya?`],
  [/^Parallelogram: (.+) — what is the area\?$/i, (m) => `Jajar genjang: ${m[1]} — berapa luasnya?`],
  [/^Parallelogram: (.+) — what is the height\?$/i, (m) => `Jajar genjang: ${m[1]} — berapa tingginya?`],
  [/^Trapezoid: (.+) — what is the area\?$/i, (m) => `Trapesium: ${m[1]} — berapa luasnya?`],
  [/^Trapezoid: (.+) — what is the height\?$/i, (m) => `Trapesium: ${m[1]} — berapa tingginya?`],
  [/^Triangle: (.+) — what is the area\?$/i, (m) => `Segitiga: ${m[1]} — berapa luasnya?`],
  [/^Triangle: (.+) — what is the height\?$/i, (m) => `Segitiga: ${m[1]} — berapa tingginya?`],
  [/^Triangle: (.+) — what is the perimeter\?$/i, (m) => `Segitiga: ${m[1]} — berapa kelilingnya?`],
  [/^A triangle with sides (.+) — what is the perimeter\?$/i, (m) => `Sebuah segitiga dengan sisi ${m[1]} — berapa kelilingnya?`],
  [/^A triangle with sides (.+) — what type of triangle is it\?$/i, (m) => `Sebuah segitiga dengan sisi ${m[1]} — jenis segitiga apakah itu?`],
  [/^Circle radius (.+) — what is the area\?$/i, (m) => `Lingkaran berjari-jari ${m[1]} — berapa luasnya?`],
  [/^Circle radius (.+) — what is the circumference\?$/i, (m) => `Lingkaran berjari-jari ${m[1]} — berapa kelilingnya?`],
  [/^Sphere radius (.+) — what is the volume\?$/i, (m) => `Bola berjari-jari ${m[1]} — berapa volumenya?`],
  [/^Right triangle: (.+) — what is the (?:length of the )?hypotenuse\?$/i, (m) => `Segitiga siku-siku: ${m[1]} — berapa panjang hipotenusanya?`],
  [/^Right triangle: (.+) — what is the other leg\?$/i, (m) => `Segitiga siku-siku: ${m[1]} — berapa panjang kaki yang lain?`],

  [/^How many (.+)\?$/i, (m) => `Berapa banyak ${translateNounPhrase(m[1])}?`],
  [/^How much (.+)\?$/i, (m) => `Berapa ${translateNounPhrase(m[1])}?`],
  [/^What is the (.+)\?$/i, (m) => `Apa ${translateNounPhrase(m[1])}?`],
  [/^What are the (.+)\?$/i, (m) => `Apa ${translateNounPhrase(m[1])}?`],
  [/^What does (.+) mean\?$/i, (m) => `Apa arti ${m[1]}?`],
  [/^What happens\?$/i, () => `Apa yang terjadi?`],
  [/^What did we learn\?$/i, () => `Apa yang kita pelajari?`],
  [/^Why\?$/i, () => `Mengapa?`],
  [/^Is (.+) even or odd\?$/i, (m) => `Apakah ${m[1]} genap atau ganjil?`],
  [/^Is (.+) prime\?$/i, (m) => `Apakah ${m[1]} bilangan prima?`],
  [/^Is the (.+)\?$/i, (m) => `Apakah ${translateNounPhrase(m[1])}?`],

  [/^Step (\d+) — (.+)$/i, (m) => `Langkah ${m[1]} — ${translateStepTail(m[2])}`],
  [/^Before you answer:$/i, () => `Sebelum kamu menjawab:`],
  [/^Before you calculate — read out loud:$/i, () => `Sebelum kamu menghitung — bacakan dengan suara:`],
  [/^Work step by step!$/i, () => `Kerjakan langkah demi langkah!`],
  [/^Always start with the ones!$/i, () => `Selalu mulai dari satuan!`],
  [/^Always check the place!$/i, () => `Selalu periksa tempat nilainya!`],
  [/^Line up the decimal points!$/i, () => `Sejajarkan tanda desimalnya!`],
  [/^Line up the decimal points\.$/i, () => `Sejajarkan tanda desimalnya.`],
  [/^Look for the remainder!$/i, () => `Cari sisanya!`],
  [/^The number stays the same!$/i, () => `Bilangannya tetap sama!`],
  [/^Important: (.+)$/i, (m) => `Penting: ${m[1]}`],
  [/^Method:$/i, () => `Metode:`],
  [/^Comparison:$/i, () => `Perbandingan:`],
  [/^Conversion:$/i, () => `Konversi:`],
  [/^Hypothesis:$/i, () => `Hipotesis:`],
  [/^Variable:$/i, () => `Variabel:`],
  [/^Reflection:$/i, () => `Refleksi:`],
  [/^Translation:$/i, () => `Translasi:`],
  [/^Writing:$/i, () => `Penulisan:`],
  [/^So:$/i, () => `Jadi:`],
  [/^Rectangle:$/i, () => `Persegi panjang:`],
  [/^Cube\.$/i, () => `Kubus.`],
  [/^In this chapter:$/i, () => `Dalam bab ini:`],
  [/^Examples:$/i, () => `Contoh:`],
  [/^Picture:$/i, () => `Gambar:`],
  [/^Words:$/i, () => `Kata-kata:`],
  [/^Area = (.+)$/i, (m) => `Luas = ${m[1]}`],
  [/^Perimeter = (.+)$/i, (m) => `Keliling = ${m[1]}`],
  [/^Volume = (.+)$/i, (m) => `Volume = ${m[1]}`],
  [/^Diagonal = (.+)$/i, (m) => `Diagonal = ${m[1]}`],
  [/^Distance = (.+)$/i, (m) => `Jarak = ${m[1]}`],
  [/^Base area = (.+)$/i, (m) => `Luas alas = ${m[1]}`],
  [/^Formula — (.+)$/i, (m) => `Rumus — ${m[1]}`],
  [/^Whole:\s*(.+)$/i, (m) => `Keseluruhan: ${m[1]}`],
  [/^Largest:\s*(.+)$/i, (m) => `Terbesar: ${m[1]}`],
  [/^Neighbor after = (.+)$/i, (m) => `Tetangga sesudah = ${m[1]}`],
  [/^Neighbor before = (.+)$/i, (m) => `Tetangga sebelum = ${m[1]}`],
  [/^Missing divisor = (.+)$/i, (m) => `Pembagi yang hilang = ${m[1]}`],
  [/^Missing factor = (.+)$/i, (m) => `Faktor yang hilang = ${m[1]}`],
  [/^Half of (.+) = (.+)$/i, (m) => `Setengah dari ${m[1]} = ${m[2]}`],
  [/^A quarter of (.+) = (.+)$/i, (m) => `Seperempat dari ${m[1]} = ${m[2]}`],
  [/^Half = (.+)$/i, (m) => `Setengah = ${m[1]}`],
  [/^A quarter = (.+)$/i, (m) => `Seperempat = ${m[1]}`],
  [/^Half of the whole is (.+)\.$/i, (m) => `Setengah dari keseluruhan adalah ${m[1]}.`],
  [/^A quarter of the whole is (.+)\.$/i, (m) => `Seperempat dari keseluruhan adalah ${m[1]}.`],
  [/^\*\*Content scope:\*\*\s*(.+)$/i, (m) => `**Cakupan konten:** ${m[1]}`],
  [/^Count (forward|backward) from (.+)\.$/i, (m) => `Hitung ${m[1] === "forward" ? "maju" : "mundur"} dari ${m[2]}.`],
  [/^Count the hops!$/i, () => `Hitung lompatannya!`],
  [/^Hop just one step!$/i, () => `Lompat hanya satu langkah!`],
  [/^Divide!$/i, () => `Bagilah!`],
  [/^Add the (.+):$/i, (m) => `Jumlahkan ${translateNounPhrase(m[1])}:`],
  [/^Multiply the (.+):$/i, (m) => `Kalikan ${translateNounPhrase(m[1])}:`],
  [/^Break each number apart:$/i, () => `Uraikan setiap bilangan:`],
  [/^Substitute:$/i, () => `Substitusi:`],
  [/^Steps for rounding:$/i, () => `Langkah pembulatan:`],
  [/^Ways to add three numbers:$/i, () => `Cara menjumlahkan tiga bilangan:`],
  [/^Plan a safe experiment:$/i, () => `Rencanakan percobaan yang aman:`],
  [/^Research question — what are we testing\?$/i, () => `Pertanyaan penelitian — apa yang kita uji?`],
  [/^Safe experiments only — with a teacher, no dangerous materials, no electrical devices\.$/i, () => `Hanya percobaan aman — bersama guru, tanpa bahan berbahaya, tanpa perangkat listrik.`],
  [/^The missing number is (.+)\.$/i, (m) => `Bilangan yang hilang adalah ${m[1]}.`],
  [/^The name of this solid:$/i, () => `Nama bangun ruang ini:`],
  [/^What is the name of this solid\?$/i, () => `Apa nama bangun ruang ini?`],
  [/^Square or rectangle\?$/i, () => `Persegi atau persegi panjang?`],
  [/^Translation or reflection\?$/i, () => `Translasi atau refleksi?`],
  [/^Today is (.+)\.$/i, (m) => `Hari ini ${translateDay(m[1])}.`],
  [/^Number line from (.+) to (.+):$/i, (m) => `Garis bilangan dari ${m[1]} sampai ${m[2]}:`],
  [/^≈ means about, close to\.$/i, () => `≈ berarti kira-kira, mendekati.`],
  [/^×10 → the decimal point moves one place to the right\.$/i, () => `×10 → tanda desimal bergeser satu tempat ke kanan.`],
  [/^÷10 → the decimal point moves one place to the left\.$/i, () => `÷10 → tanda desimal bergeser satu tempat ke kiri.`],
  [/^Repeated addition:\s*(.+)$/i, (m) => `Penjumlahan berulang: ${m[1]}`],
  [/^Change (.+) to a mixed number\.$/i, (m) => `Ubah ${m[1]} menjadi bilangan campuran.`],
  [/^Change (.+) to an improper fraction\.$/i, (m) => `Ubah ${m[1]} menjadi pecahan tidak biasa.`],
  [/^Expand (.+) to have denominator (.+)\.$/i, (m) => `Perluas ${m[1]} agar penyebutnya ${m[2]}.`],
  [/^What is (.+) of (.+)\?$/i, (m) => `Berapa ${m[1]} dari ${m[2]}?`],
  [/^What is a quarter of (.+)\?$/i, (m) => `Berapa seperempat dari ${m[1]}?`],
  [/^What is half of (.+)\?$/i, (m) => `Berapa setengah dari ${m[1]}?`],
  [/^Which is bigger — (.+) or (.+)\?$/i, (m) => `Mana yang lebih besar — ${m[1]} atau ${m[2]}?`],
  [/^Which symbol is correct — (.+)\?$/i, (m) => `Simbol mana yang benar — ${m[1]}?`],
  [/^Which number is (.+)\?$/i, (m) => `Bilangan mana yang ${translateNounPhrase(m[1])}?`],
  [/^When they are equal:$/i, () => `Ketika keduanya sama:`],
  [/^There is a blank — you need to find the missing number\.$/i, () => `Ada bagian kosong — kamu perlu menemukan bilangan yang hilang.`],
  [/^There are (.+)\.$/i, (m) => `Ada ${m[1]}.`],
  [/^You have (.+)\. You want to reach (.+)\.$/i, (m) => `Kamu punya ${m[1]}. Kamu ingin mencapai ${m[2]}.`],
  [
    /^Look at the digit to the right of the place you're rounding to$/i,
    () => `Lihat digit di kanan tempat yang kamu bulatkan`,
  ],
  [
    /^If it's 0, 1, 2, 3, or 4 — round down \(stay the same\)$/i,
    () => `Jika 0, 1, 2, 3, atau 4 — bulatkan ke bawah (tetap sama)`,
  ],
  [
    /^If it's 5, 6, 7, 8, or 9 — round up \(add 1\)$/i,
    () => `Jika 5, 6, 7, 8, atau 9 — bulatkan ke atas (tambah 1)`,
  ],
  [/^If equal — (.+)$/i, (m) => `Jika sama — ${translateNounPhrase(m[1])}`],
  [/^Ones:\s*(.+)$/i, (m) => `Satuan: ${m[1]}`],
  [/^Tens:\s*(.+)$/i, (m) => `Puluhan: ${m[1]}`],
  [/^Hundredths:\s*(.+)$/i, (m) => `Perseratusan: ${m[1]}`],
  [/^Thousands:\s*(.+)$/i, (m) => `Ribuan: ${m[1]}`],
  [/^Ones digit:\s*(.+)$/i, (m) => `Digit satuan: ${m[1]}`],
  [/^Ones digit — (.+)$/i, (m) => `Digit satuan — ${m[1]}`],
  [/^Tens digit — (.+)$/i, (m) => `Digit puluhan — ${m[1]}`],
  [/^Hundreds digit — (.+)$/i, (m) => `Digit ratusan — ${m[1]}`],
  [/^Thousands digit — (.+)$/i, (m) => `Digit ribuan — ${m[1]}`],
  [/^1\. Start with ones \(right\)$/i, () => `1. Mulai dari satuan (kanan)`],
  [/^Add the ones — if you get 10 or more, carry 1 to the tens$/i, () => `Jumlahkan satuan — jika mendapat 10 atau lebih, simpan 1 ke puluhan`],
];

function translateDay(d) {
  const map = {
    Sunday: "Minggu",
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
    Saturday: "Sabtu",
  };
  return map[d] || d;
}

function translateStepTail(s) {
  const t = String(s || "").trim();
  const map = {
    Calculate: "Hitung",
    Count: "Hitung",
    "What do we know?": "Apa yang kita ketahui?",
    "What are we asked?": "Apa yang ditanyakan?",
    "What do we do?": "Apa yang kita lakukan?",
  };
  if (map[t]) return map[t];
  if (/^Calculate:/i.test(t)) return t.replace(/^Calculate:/i, "Hitung:");
  if (/^Count:/i.test(t)) return t.replace(/^Count:/i, "Hitung:");
  return t;
}

function translateVerbPhrase(s) {
  let out = String(s || "");
  const reps = [
    ["add decimal numbers", "menjumlahkan bilangan desimal"],
    ["add three numbers", "menjumlahkan tiga bilangan"],
    ["subtract decimal numbers", "mengurangi bilangan desimal"],
    ["check divisibility by 2, 5, and 10", "memeriksa keterbagian oleh 2, 5, dan 10"],
    ["estimate a multiplication answer", "memperkirakan hasil perkalian"],
    ["estimate an addition sum", "memperkirakan hasil penjumlahan"],
    ["solve how many more?", "menyelesaikan soal berapa lebih banyak?"],
    ["break each number into tens and ones to make it easier", "menguraikan setiap bilangan menjadi puluhan dan satuan agar lebih mudah"],
    ["learn about rotation at a more advanced stage", "belajar tentang rotasi pada tahap yang lebih lanjut"],
    ["solve a word problem — when the question asks how many more one person has than another", "menyelesaikan soal cerita — ketika pertanyaan menanyakan berapa lebih banyak yang dimiliki seseorang dibanding yang lain"],
  ];
  for (const [en, id] of reps) {
    if (out.toLowerCase().includes(en.toLowerCase())) out = out.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), id);
  }
  return out;
}

function translatePracticeTail(s) {
  let out = String(s || "");
  const reps = [
    ["what comes before?", "apa yang datang sebelumnya?"],
    [">, <, =.", ">, <, =."],
    ["blanks (__).", "bagian kosong (__)."],
    ["conversions.", "konversi."],
    ["even or odd?", "genap atau ganjil?"],
    ["long division.", "pembagian panjang."],
    ["questions about a digit's value by its place.", "pertanyaan tentang nilai digit menurut tempatnya."],
    ["questions: even or odd?", "pertanyaan: genap atau ganjil?"],
    ["questions: what comes before?", "pertanyaan: apa yang datang sebelumnya?"],
    ["rounding questions.", "pertanyaan pembulatan."],
    ["subtractions.", "pengurangan."],
  ];
  for (const [en, id] of reps) {
    if (out.toLowerCase() === en.toLowerCase() || out.toLowerCase().includes(en.toLowerCase().replace(/\.$/, ""))) {
      out = id;
      break;
    }
  }
  return out;
}

function translateNounPhrase(s) {
  let out = String(s || "");
  const reps = [
    ["apples are there altogether", "apel yang ada seluruhnya"],
    ["more points does Noah have", "lebih banyak poin yang dimiliki Noah"],
    ["more does Danny have", "lebih banyak yang dimiliki Danny"],
    ["stickers does each child get", "stiker yang didapat setiap anak"],
    ["students won't be in a full group", "murid yang tidak masuk kelompok penuh"],
    ["tens and how many ones are in", "puluhan dan berapa satuan dalam"],
    ["hundreds, tens, and ones are in", "ratusan, puluhan, dan satuan dalam"],
    ["tiles meet at one point", "ubin yang bertemu di satu titik"],
    ["degrees are in a half turn", "derajat dalam setengah putaran"],
    ["days pass", "hari yang berlalu"],
    ["pairs of equal faces are there", "pasangan muka yang sama"],
    ["neighbors of", "tetangga dari"],
    ["next two numbers", "dua bilangan berikutnya"],
    ["whole", "keseluruhan"],
    ["total watching time", "total waktu menonton"],
    ["distance", "jarak"],
    ["area", "luas"],
    ["perimeter", "keliling"],
    ["volume", "volume"],
    ["height", "tinggi"],
    ["hypothesis", "hipotesis"],
    ["variable", "variabel"],
    ["change did he get", "uang kembalian yang dia dapat"],
    ["change does she get", "uang kembalian yang dia dapat"],
    ["is left", "yang tersisa"],
    ["money does he have altogether", "uang yang dia miliki seluruhnya"],
    ["money in total — we need to add", "uang total — kita perlu menjumlahkan"],
    ["money is there altogether", "uang yang ada seluruhnya"],
    ["first stage in a frog's life cycle", "tahap pertama dalam siklus hidup katak"],
    ["neighbor before and after the number", "tetangga sebelum dan sesudah bilangan"],
    ["name of this solid", "nama bangun ruang ini"],
    ["board a rectangle", "papan itu persegi panjang"],
    ["sticker a square", "stiker itu persegi"],
    ["bases", "alas"],
    ["first two sides", "dua sisi pertama"],
    ["third side", "sisi ketiga"],
    ["two known angles", "dua sudut yang diketahui"],
    ["area by 2", "luas dengan 2"],
  ];
  for (const [en, id] of reps) {
    if (out.toLowerCase().includes(en.toLowerCase())) {
      out = out.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), id);
    }
  }
  return out;
}

/**
 * @param {string} line
 * @returns {string|null}
 */
export function applyLineTemplates(line) {
  const trimmed = String(line ?? "").trim();
  if (!trimmed) return null;
  for (const [re, fn] of LINE_TEMPLATES) {
    const m = trimmed.match(re);
    if (m) {
      const out = fn(m);
      if (out != null) return String(line).replace(trimmed, out);
    }
  }
  return null;
}
