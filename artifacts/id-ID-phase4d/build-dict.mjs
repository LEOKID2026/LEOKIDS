/**
 * Build learning-dict.json from batch files + core glossary + batch override maps.
 * Run after dict-overrides-*.json exist (or with glossary-only for short labels).
 */
import fs from "fs";
import path from "path";

const ART = path.join(process.cwd(), "artifacts/id-ID-phase4d");

/** @type {Record<string, string>} */
const GLOSSARY = {
  Square: "Persegi",
  Rectangle: "Persegi panjang",
  Triangle: "Segitiga",
  Quadrilateral: "Segiempat",
  Circle: "Lingkaran",
  Parallelogram: "Jajar genjang",
  Trapezoid: "Trapesium",
  "Rectangular prism": "Balok",
  Cylinder: "Tabung",
  Sphere: "Bola",
  Pyramid: "Limas",
  Cube: "Kubus",
  Cone: "Kerucut",
  Addition: "Penjumlahan",
  Subtraction: "Pengurangan",
  Multiplication: "Perkalian",
  Division: "Pembagian",
  Comparison: "Perbandingan",
  "Number sense": "Kepekaan bilangan",
  "Word problems": "Soal cerita",
  Mixed: "Campuran",
  "Regular:": "Reguler:",
  "Advanced:": "Lanjutan:",
  Sequences: "Barisan",
  Decimals: "Desimal",
  Rounding: "Pembulatan",
  Percentages: "Persen",
  Ratio: "Rasio",
  Scale: "Skala",
  Equations: "Persamaan",
  Perimeter: "Keliling",
  Area: "Luas",
  Volume: "Volume",
  Translation: "Translasi",
  Reflection: "Refleksi",
  Rotation: "Rotasi",
  "No movement": "Tanpa pergerakan",
  "Parallel lines": "Garis sejajar",
  "Perpendicular lines": "Garis tegak lurus",
  "Equilateral triangle": "Segitiga sama sisi",
  "Loading...": "Memuat...",
  "Loading…": "Memuat…",
  Unavailable: "Tidak tersedia",
  Cumulative: "Kumulatif",
  Math: "Matematika",
  English: "Bahasa Inggris",
  Geometry: "Geometri",
  Science: "IPA",
  Phonics: "Fonik",
  Vocabulary: "Kosakata",
  Grammar: "Tata bahasa",
  Writing: "Menulis",
  "Reading comprehension": "Pemahaman bacaan",
  "Mixed practice": "Latihan campuran",
  Body: "Tubuh",
  Axis: "Sumbu",
  Idea: "Ide",
  Rule: "Aturan",
  moderate: "sedang",
  "six grades": "enam kelas",
  "Topics by grade": "Topik menurut kelas",
  "per grade: regular, advanced": "per kelas: reguler, lanjutan",
  "regular / advanced": "reguler / lanjutan",
  "Two practice levels - regular and advanced": "Dua tingkat latihan — reguler dan lanjutan",
  "two practice levels - regular and advanced": "dua tingkat latihan — reguler dan lanjutan",
  "Practice recommendation": "Rekomendasi latihan",
  "Recommended practice level": "Tingkat latihan yang direkomendasikan",
  "Recommended number of questions": "Jumlah pertanyaan yang direkomendasikan",
  "Keep practicing based on your progress": "Terus berlatih berdasarkan kemajuanmu",
  "Continue to recommended practice": "Lanjut ke latihan yang direkomendasikan",
  "Suggested next step": "Langkah berikutnya yang disarankan",
  "Pick up where you left off": "Lanjutkan dari tempat terakhirmu",
  "Go to learning hub": "Buka pusat pembelajaran",
  "No data yet": "Belum ada data",
  "Data unavailable right now": "Data tidak tersedia saat ini",
  "For the current month": "Untuk bulan berjalan",
  "Cumulative from all sessions": "Kumulatif dari semua sesi",
  "From completed sessions": "Dari sesi yang selesai",
  "From all sessions with duration": "Dari semua sesi yang memiliki durasi",
  "Prime and composite numbers": "Bilangan prima dan komposit",
  "Powers/exponents": "Pangkat",
  "Properties of 0 and 1": "Sifat 0 dan 1",
  "Factors and multiples": "Faktor dan kelipatan",
  "Estimation and developing number sense": "Estimasi dan mengembangkan kepekaan bilangan",
  "Order of operations and using parentheses": "Urutan operasi dan penggunaan tanda kurung",
  "Divisibility rules - by 2, 5, 10": "Aturan keterbagian — oleh 2, 5, 10",
  "Divisibility rules - by 3, 6, 9": "Aturan keterbagian — oleh 3, 6, 9",
  "Decimals - basic decimals": "Desimal — desimal dasar",
  "How the next practice was chosen": "Bagaimana latihan berikutnya dipilih",
  "Great to see you! Every practice session brings you closer to your goal.":
    "Senang bertemu kamu! Setiap sesi latihan mendekatkanmu ke tujuanmu.",
  "The monthly goal is usually marked after you reach the minutes goal — keep learning!":
    "Target bulanan biasanya ditandai setelah kamu mencapai target menit — terus belajar!",
  "You got the monthly persistence reward! Well done!":
    "Kamu mendapat hadiah ketekunan bulanan! Bagus sekali!",
  "You reached the monthly goal! Keep learning!":
    "Kamu mencapai target bulanan! Terus belajar!",
  "No activity recorded yet — choose a subject to get started.":
    "Belum ada aktivitas tercatat — pilih mata pelajaran untuk mulai.",
  "Credited learning time — questions, books, and parent activities":
    "Waktu belajar yang dihitung — pertanyaan, buku, dan aktivitas orang tua",
  "Equal in measure": "Sama ukurannya",
  "Parallel and equal in length": "Sejajar dan sama panjang",
  "The areas can be different": "Luasnya bisa berbeda",
  "The sum of the three angles in a triangle is 180°":
    "Jumlah ketiga sudut dalam segitiga adalah 180°",
  "Multiply length by width": "Kalikan panjang dengan lebar",
  "The diameter is twice the radius": "Diameter adalah dua kali jari-jari",
  "The circumference of the circle": "Keliling lingkaran",
  "The side opposite the right angle": "Sisi di depan sudut siku-siku",
  "They meet at a 90° angle": "Mereka bertemu pada sudut 90°",
  "Same shape and same size (you can place one on the other)":
    "Bentuk dan ukuran sama (bisa ditumpuk tepat)",
  "They have no intersection point and stay the same distance apart":
    "Tidak berpotongan dan jaraknya tetap sama",
  "They do not meet and keep a constant distance":
    "Tidak bertemu dan menjaga jarak tetap",
  "How much space is occupied inside the box in three dimensions":
    "Seberapa banyak ruang di dalam kotak dalam tiga dimensi",
  "Equal in length and bisect each other":
    "Sama panjang dan saling membagi dua",
  "Parallel lines do not meet; perpendicular lines meet at 90°":
    "Garis sejajar tidak bertemu; garis tegak lurus bertemu di 90°",
  "The side length is 5 cm because 20 ÷ 4 = 5":
    "Panjang sisi 5 cm karena 20 ÷ 4 = 5",
  "Compute: {m0}.": "Hitung: {m0}.",
  "Compute: {m0}, then {m1}.": "Hitung: {m0}, lalu {m1}.",
  "Substitute: {m0}.": "Substitusi: {m0}.",
  "Substitute: {m0}, height {m1}.": "Substitusi: {m0}, tinggi {m1}.",
  "Compute: {m0} → rounded per the question: {m1}.":
    "Hitung: {m0} → dibulatkan sesuai soal: {m1}.",
  "Volume: {m0}.": "Volume: {m0}.",
  "What is stated in the question: {m0}.": "Yang dinyatakan dalam soal: {m0}.",
  "The missing angle is {m0}°.": "Sudut yang hilang adalah {m0}°.",
  "Compute the squares: {m0} and {m1}.": "Hitung kuadrat: {m0} dan {m1}.",
  "Take the square root for the hypotenuse: {m0}.":
    "Ambil akar kuadrat untuk sisi miring: {m0}.",
  "Here we look for {m0}, so {m1}.": "Di sini kita mencari {m0}, jadi {m1}.",
  "Missing leg: {m0}.": "Kaki yang hilang: {m0}.",
  "Match: {m0}.": "Cocokkan: {m0}.",
  "So we choose {m0}.": "Jadi kita memilih {m0}.",
  "So the correct option is {m0}.": "Jadi opsi yang benar adalah {m0}.",
  "So the answer: {m0}°.": "Jadi jawabannya: {m0}°.",
  "The answer in degrees: {m0}.": "Jawaban dalam derajat: {m0}.",
  "divided by 3 ≈ {m0}.": "dibagi 3 ≈ {m0}.",
  "{m0} and {m1} — find the third angle.": "{m0} dan {m1} — cari sudut ketiga.",
  "3. compute: {m0}.": "3. hitung: {m0}.",
  "3. substitute and compute: {m0}.": "3. substitusi dan hitung: {m0}.",
  "4. compute: {m0}.": "4. hitung: {m0}.",
  "2. rectangular base: {m0}.": "2. alas persegi panjang: {m0}.",
  "2. what is stated in the question: {m0}.": "2. yang dinyatakan dalam soal: {m0}.",
  "2. substitute the legs: {m0}.": "2. substitusi kaki-kakinya: {m0}.",
  "3. compute the squares: {m0}.": "3. hitung kuadratnya: {m0}.",
  "square: area = side × side.": "persegi: luas = sisi × sisi.",
  "rectangle: area = length × width.": "persegi panjang: luas = panjang × lebar.",
  "triangle: area = (base × height) ÷ 2.": "segitiga: luas = (alas × tinggi) ÷ 2.",
  "parallelogram: area = base × height.": "jajar genjang: luas = alas × tinggi.",
  "trapezoid: area = ((base 1 + base 2) × height) ÷ 2.":
    "trapesium: luas = ((alas 1 + alas 2) × tinggi) ÷ 2.",
  "square: area = side².": "persegi: luas = sisi².",
  "circle: area = π × radius².": "lingkaran: luas = π × jari-jari².",
  "square: perimeter = side × 4.": "persegi: keliling = sisi × 4.",
  "rectangle: perimeter = (length + width) × 2.":
    "persegi panjang: keliling = (panjang + lebar) × 2.",
  "circle: circumference = 2 × π × radius.": "lingkaran: keliling = 2 × π × jari-jari.",
  "cube: volume = side³.": "kubus: volume = sisi³.",
  "box (rectangular): volume = length × width × height.":
    "balok: volume = panjang × lebar × tinggi.",
  "box: volume = length × width × height.": "kotak: volume = panjang × lebar × tinggi.",
  "cylinder: volume = π × radius² × height.": "tabung: volume = π × jari-jari² × tinggi.",
  "sphere: volume = (4/3) × π × radius³.": "bola: volume = (4/3) × π × jari-jari³.",
  "always add all the sides.": "selalu jumlahkan semua sisi.",
  "for every shape: perimeter = the sum of all side lengths.":
    "untuk setiap bangun: keliling = jumlah semua panjang sisi.",
  "in a right triangle: a² + b² = c² (c is the hypotenuse).":
    "pada segitiga siku-siku: a² + b² = c² (c adalah sisi miring).",
  "circle area = π × radius².": "luas lingkaran = π × jari-jari².",
  "circle circumference = 2 × π × radius.": "keliling lingkaran = 2 × π × jari-jari.",
  "square: diagonal = side × √2.": "persegi: diagonal = sisi × √2.",
  "rectangle: diagonal = √(length² + width²).":
    "persegi panjang: diagonal = √(panjang² + lebar²).",
  "parallelogram: diagonal = √(side 1² + side 2²).":
    "jajar genjang: diagonal = √(sisi 1² + sisi 2²).",
};

// Load any override dict parts
/** @type {Record<string, string>} */
const dict = { ...GLOSSARY };
for (const name of fs
  .readdirSync(ART)
  .filter((n) => /^dict-overrides-(\d+|rest)\.json$/.test(n))
  .sort()) {
  Object.assign(dict, JSON.parse(fs.readFileSync(path.join(ART, name), "utf8")));
}

const toTranslate = JSON.parse(fs.readFileSync(path.join(ART, "to-translate.json"), "utf8"));
const missing = [];
for (const { s } of toTranslate) {
  if (!Object.prototype.hasOwnProperty.call(dict, s)) missing.push(s);
}

fs.writeFileSync(path.join(ART, "learning-dict.json"), JSON.stringify(dict, null, 2));
fs.writeFileSync(path.join(ART, "dict-missing.json"), JSON.stringify(missing, null, 2));
console.log({ dictSize: Object.keys(dict).length, missing: missing.length });
