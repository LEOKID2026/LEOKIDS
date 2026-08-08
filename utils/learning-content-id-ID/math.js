/**
 * Indonesian (id-ID) rebuilders for math question stems.
 * English is the authority; params/numbers/operators unchanged.
 * Currency word problems keep "dolar" (dollars). Child-facing kamu / natural imperative.
 */
import { BLANK } from "../math-constants.js";
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

const WEEKDAYS_ID = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const OBJECTS_ID = Object.freeze({
  items: "benda",
  apples: "apel",
  balls: "bola",
  stickers: "stiker",
  books: "buku",
  pencils: "pensil",
  chairs: "kursi",
  cards: "kartu",
  boxes: "kotak",
  coins: "koin",
});
const YES_NO = Object.freeze({ Yes: "Ya", No: "Tidak", yes: "ya", no: "tidak" });
const PRIME_COMPOSITE = Object.freeze({
  prime: "prima",
  composite: "komposit",
  Prime: "Prima",
  Composite: "Komposit",
});
const PARITY = Object.freeze({
  even: "genap",
  odd: "ganjil",
  Even: "Genap",
  Odd: "Ganjil",
});
const MATH_PHRASES = [];

function applyMathPhrases(text) {
  let out = String(text ?? "");
  for (const [from, to] of MATH_PHRASES) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

function inferMathLevelKey(question) {
  const lv = String(question?.params?.difficulty || question?.levelKey || "easy");
  if (lv === "hard" || lv === "medium") return lv;
  return "easy";
}

function inferSelectedOp(question) {
  return String(question?.operation || question?.params?.kind || "").replace(/^wp_/, "word_problems");
}

/** Rebuild word-problem / story stems from params when kind is known. */
export function rebuildMathStemIdId(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");
  const gradeKey = String(question?.gradeKey || p.gradeKey || "g3");

  if (kind === "mul_groups_g1") {
    const objects = OBJECTS_ID[p.objects] || String(p.objects || "benda");
    return `Ada ${p.groups} kelompok. Setiap kelompok punya ${p.perGroup} ${objects}. Berapa ${objects} semuanya?`;
  }
  if (kind === "mul_skip_count_g1") {
    const seq = Array.isArray(p.seq) ? p.seq : [];
    const head = seq.slice(0, -1).join(", ");
    return `Hitung loncat ${p.perGroup}: ${head}, ${BLANK}`;
  }
  if (kind === "ns_number_line" || kind === "ns_number_line_g1") {
    const nums = Array.isArray(p.numbers) ? p.numbers : [];
    const line = nums.map((n) => (n === BLANK || n === "__" ? BLANK : n)).join(" - ");
    return `Isi bilangan yang hilang pada garis bilangan: ${line}`;
  }
  if (kind === "ns_even_odd" || kind === "ns_parity") {
    return `Apakah ${p.n ?? p.num} bilangan genap?`;
  }
  if (kind === "frac_half" || kind === "frac_half_reverse") {
    if (kind === "frac_half_reverse" && p.whole != null) {
      return `Setengah dari ${BLANK} adalah ${p.whole / 2}. Berapa bilangan utuhnya?`;
    }
    return `Berapa setengah dari ${p.whole ?? p.n}?`;
  }
  if (kind === "frac_quarter" || kind === "frac_quarter_reverse") {
    if (kind === "frac_quarter_reverse" && p.whole != null) {
      return `Seperempat dari ${BLANK} adalah ${p.whole / 4}. Berapa bilangan utuhnya?`;
    }
    return `Berapa seperempat dari ${p.whole ?? p.n}?`;
  }
  if (
    kind === "frac_compare_like_den_g4" ||
    kind === "frac_compare_like_den_g3" ||
    kind === "frac_compare_same_den"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      return `Pecahan mana yang lebih besar — ${p.n1}/${p.den} atau ${p.n2}/${p.den}? Tulis pecahan yang lebih besar: ${BLANK}`;
    }
  }
  if (
    kind === "frac_same_den_add_g4" ||
    kind === "frac_same_den_add" ||
    kind === "frac_same_den_sub_g4" ||
    kind === "frac_same_den_sub"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      const op = p.op === "add" || kind.includes("add") ? "+" : "−";
      return `${p.n1}/${p.den} ${op} ${p.n2}/${p.den} = ${BLANK}`;
    }
  }
  if (kind === "frac_simplify_intro_g4" || kind === "frac_simplify_intro_g3") {
    if (p.num != null && p.den != null) {
      return `Sederhanakan pecahan ${p.num}/${p.den}: ${BLANK}`;
    }
  }
  if (kind === "frac_equivalent_expand" || kind === "frac_equivalent") {
    if (p.num != null && p.den != null && p.factor != null) {
      return `Cari pecahan yang setara dengan ${p.num}/${p.den} (kalikan dengan ${p.factor}): ${BLANK}`;
    }
  }
  if (kind === "wp_simple_add" || kind === "wp_simple_add_g2") {
    if (kind === "wp_simple_add_g2") {
      return `Di kelas ada ${p.a} anak dan ${p.b} lagi bergabung. Berapa anak sekarang?`;
    }
    return `Leo punya ${p.a} bola dan mendapat ${p.b} lagi. Berapa bola Leo semuanya?`;
  }
  if (kind === "wp_simple_sub" || kind === "wp_simple_sub_g2") {
    if (kind === "wp_simple_sub_g2") {
      return `Ada ${p.total} apel di keranjang. ${p.give} dimakan. Berapa apel yang tersisa?`;
    }
    return `Leo punya ${p.total} stiker. Ia memberi ${p.give} kepada teman. Berapa stiker yang tersisa pada Leo?`;
  }
  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `Emma punya ${p.money} dolar. Ia membeli camilan seharga ${p.toy} dolar. Berapa uang yang tersisa?`;
  }
  if (kind === "wp_groups_g2") {
    return `Setiap baris punya ${p.per} kursi. Ada ${p.groups} baris seperti itu. Berapa kursi semuanya?`;
  }
  if (kind === "wp_groups_g3") {
    return `Setiap kotak punya ${p.per} pensil. Ada ${p.groups} kotak. Berapa pensil semuanya?`;
  }
  if (kind === "wp_groups_g4") {
    return `Setiap rak punya ${p.per} buku. Ada ${p.groups} rak. Berapa buku semuanya?`;
  }
  if (kind === "wp_groups_late_g6") {
    return `Setiap wadah punya ${p.per} bagian. ${p.groups} wadah dikirim. Berapa bagian semuanya?`;
  }
  if (kind === "wp_groups" || kind === "wp_groups_late") {
    return `Setiap peti persediaan punya ${p.per} paket. ${p.groups} peti dikirim. Berapa paket semuanya?`;
  }
  if (kind === "wp_comparison_more") {
    return `Noa punya ${p.big} kartu dan Yuval punya ${p.small} kartu. Berapa kartu lebih banyak yang dimiliki Noa daripada Yuval?`;
  }
  if (kind === "wp_part_whole_g4") {
    return `Sebuah aula punya ${p.whole} kursi. ${p.partA} terisi untuk pertunjukan dan sisanya kosong. Berapa kursi yang kosong?`;
  }
  if (kind === "wp_part_whole") {
    return `Sebuah kelas punya ${p.whole} murid. ${p.partA} ikut klub sepak bola dan sisanya ikut klub catur. Berapa murid di klub catur?`;
  }
  if (kind === "wp_change_stack_g4") {
    return `Sebuah gudang punya ${p.start} kotak. ${p.gain} kotak baru ditambahkan dan ${p.loss} dikirim ke cabang lain. Berapa kotak yang tersisa?`;
  }
  if (kind === "wp_change_stack") {
    return `Sebuah perpustakaan punya ${p.start} buku. ${p.gain} buku baru ditambahkan dan ${p.loss} dipinjam. Berapa buku di perpustakaan sekarang?`;
  }
  if (kind === "wp_time_days") {
    const start = WEEKDAYS_ID[p.startDayIdx] || "Senin";
    const end = WEEKDAYS_ID[p.endDayIdx] || "Jumat";
    return `Jika hari ini ${start}, berapa hari lagi sampai ${end}?`;
  }
  if (kind === "wp_time_date") {
    return `Jika hari ini tanggal ${p.today}, tanggal berapa setelah ${p.daysLater} hari?`;
  }
  if (kind === "wp_coins") {
    return `Leo punya ${p.coins1} koin satu dolar dan ${p.coins2} koin dua dolar. Berapa uangnya semuanya?`;
  }
  if (kind === "wp_coins_spent") {
    return `Leo punya ${p.total} dolar dalam bentuk koin. Ia membeli permen seharga ${p.spent} dolar. Berapa uang yang tersisa?`;
  }
  if (kind === "wp_division_simple") {
    return `Ada ${p.total} apel dibagi menjadi kelompok-kelompok berisi ${p.perGroup} apel. Berapa kelompok yang terbentuk?`;
  }
  if (kind === "wp_leftover") {
    return `${p.total} murid dibagi menjadi kelompok berisi ${p.groupSize}. Berapa murid yang tersisa tanpa kelompok penuh?`;
  }
  if (kind === "wp_shop_discount") {
    return `Sebuah kaos berharga ${p.price} dolar dengan diskon ${p.discPerc}%. Berapa yang kamu bayar setelah diskon?`;
  }
  if (kind === "wp_unit_cm_to_m") {
    return `Berapa meter dari ${p.cm} sentimeter? = ${BLANK}`;
  }
  if (kind === "wp_unit_g_to_kg") {
    return `Berapa kilogram dari ${p.g} gram? = ${BLANK}`;
  }
  if (kind === "wp_distance_time") {
    return `Seorang anak berjalan dengan kecepatan tetap ${p.speed} km/h selama ${p.hours} jam. Berapa kilometer jarak yang ditempuh?`;
  }
  if (kind === "wp_time_sum") {
    return `Satu klip video berdurasi ${p.l1} menit dan yang lain ${p.l2} menit. Berapa menit total kedua klip bersama-sama?`;
  }
  if (kind === "wp_average" || kind === "wp_average_g6") {
    if (kind === "wp_average_g6") {
      return `Sebuah proyek kelompok mendapat skor ${p.s1}, ${p.s2}, dan ${p.s3} pada tiga tahap. Berapa skor rata-ratanya (dibulatkan ke bilangan bulat)?`;
    }
    return `Leo mendapat skor ${p.s1}, ${p.s2}, dan ${p.s3} pada tiga tes. Berapa rata-ratanya (dibulatkan ke bilangan bulat)?`;
  }
  if (kind === "wp_multi_step" || kind === "wp_multi_step_g6") {
    return `Leo punya ${p.money} dolar. Ia membeli ${p.a} pena dan ${p.b} pensil, dan setiap barang berharga ${p.price} dolar. Berapa uang yang tersisa setelah belanja?`;
  }
  if (kind === "operation_choice_word_problem_probe") {
    return `Ada ${p.groups} kelompok dengan ${p.each} benda di setiap kelompok. Operasi mana yang mencari totalnya?`;
  }

  if (kind.startsWith("wp_") || inferSelectedOp(question) === "word_problems") {
    return null;
  }

  return applyMathLevelPresentationIdId(
    String(question?.question || question?.exerciseText || ""),
    {
      selectedOp: question?.operation || inferSelectedOp(question),
      params: p,
      mathLevelKey: inferMathLevelKey(question),
      gradeKey,
    }
  );
}

/** Indonesian mirror of applyMathLevelPresentation (math-question-generator.js). */
export function applyMathLevelPresentationIdId(question, ctx) {
  const q0 = String(question || "");
  if (!q0.trim()) return q0;
  const { selectedOp, params, mathLevelKey, gradeKey } = ctx;
  const kind = String(params?.kind || "");
  if (kind.startsWith("wp_") || selectedOp === "word_problems") return q0;

  if (kind === "ns_complement100") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 100;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Buat ${c}: berapa yang ditambahkan ke ${b} agar menjadi ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Diberikan ${b} + ${BLANK} = ${c}. Berapa bilangan yang hilang?`;
      }
      return `Soal cerita: ${b} masih kurang agar menjadi ${c} — berapa yang ditambahkan? = ${BLANK}`;
    }
  }

  if (kind === "ns_complement10") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 10;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Sampai ${c}: berapa yang ditambahkan ke ${b} agar selesai di ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Yang hilang dalam persamaan: ${b} + ${BLANK} = ${c}`;
      }
      return `Tanpa kolom: penjumlahan apa ke ${c} yang dimulai dengan ${b}? = ${BLANK}`;
    }
  }

  if (kind === "scale_find") {
    const ml = params?.mapLength;
    const rl = params?.realLength;
    if (ml != null && rl != null) {
      if (mathLevelKey === "easy") {
        return `Pada peta, sebuah ruas panjangnya ${ml} cm dan di dunia nyata ${rl} cm. Lengkapi skalanya sebagai 1:${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Panjang peta ${ml} cm, panjang nyata ${rl} cm. Berapa skalanya? Tulis angka setelah 1: = ${BLANK}`;
      }
      return `Peta ${ml} cm dan nyata ${rl} cm — skala 1:__. Berapa bilangan yang hilang? = ${BLANK}`;
    }
  }

  if (kind === "scale_map_to_real") {
    const ml = params?.mapLength;
    const sc = params?.scale;
    if (ml != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `Pada skala 1:${sc}, berapa cm nyata yang sama dengan ${ml} cm pada peta? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Skala 1:${sc}. Ukuran peta ${ml} cm — berapa panjang nyata dalam cm? = ${BLANK}`;
      }
      return `Skala 1:${sc}, ukuran peta ${ml} cm — cari panjang nyata dalam cm = ${BLANK}`;
    }
  }

  if (kind === "scale_real_to_map") {
    const rl = params?.realLength;
    const sc = params?.scale;
    if (rl != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `Pada skala 1:${sc}, panjang nyata ${rl} cm — berapa cm pada peta? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Panjang nyata ${rl} cm, skala 1:${sc}. Berapa panjangnya pada peta? = ${BLANK}`;
      }
      return `Ubah nyata ke peta: ${rl} cm nyata pada 1:${sc} — berapa cm di halaman? = ${BLANK}`;
    }
  }

  if (selectedOp === "compare" || kind === "cmp") {
    const raw = params?.exerciseText ? String(params.exerciseText) : "";
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 4;
    if (mathLevelKey === "easy") {
      const opts = [
        `Bandingkan kedua bilangan dan isi (<, =, >): ${raw}`,
        `Tanda perbandingan di antara bilangan: ${raw}`,
        `Pilih < , = atau > — bandingkan: ${raw}`,
        `Bandingkan nilainya dan isi tandanya: ${raw}`];
      return opts[pv].trim();
    }
    if (mathLevelKey === "medium") {
      const opts = [
        `Isi tanda perbandingan yang benar: ${raw}`,
        `Tanda mana yang membandingkan pasangan ini? ${raw}`,
        `Cocokkan tanda perbandingan yang benar: ${raw}`,
        `Isi tanda di antara ekspresi bilangan: ${raw}`];
      return opts[pv].trim();
    }
    const opts = [
      `Isi tanda perbandingan — periksa dulu sebelum memilih: ${raw}`,
      `Bandingkan dengan teliti dan pilih tanda: ${raw}`,
      `Bandingkan hati-hati lalu pilih tanda: ${raw}`,
      `Cek cepat: tanda mana yang cocok? ${raw}`];
    return opts[pv].trim();
  }

  if (selectedOp === "divisibility" || kind === "divisibility") {
    const num = params?.num;
    const div = params?.divisor;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (num != null && div != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Keterbagian: apakah ${num} habis dibagi ${div}?`
          : `Cek: apakah ${num} kelipatan ${div} (tanpa sisa)?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Aturan keterbagian — apakah ${num} habis dibagi ${div}?`
          : `Pembagian bulat: ${num} ÷ ${div} — apakah hasilnya bilangan bulat?`;
      }
      return pv === 0
        ? `Cek keterbagian: apakah ${num} habis dibagi ${div}?`
        : `Pembagi: apakah ${div} membagi ${num} tepat?`;
    }
  }

  if (selectedOp === "prime_composite" || kind === "prime_composite") {
    const num = params?.num;
    const subKind = String(params?.subKind || "pc_classify");
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (subKind === "pc_factor_count" && num != null) {
      if (mathLevelKey === "easy") return `Bilangan prima: berapa banyak pembagi yang dimiliki ${num}?`;
      if (mathLevelKey === "medium") {
        return `Hitung pembagi: berapa pembagi asli yang dimiliki ${num} (termasuk 1 dan dirinya sendiri)?`;
      }
      return `Pembagi: berapa pembagi berbeda yang dimiliki ${num}?`;
    }
    if (subKind === "pc_smallest_prime" && num != null) {
      if (mathLevelKey === "easy") return `Faktor prima: berapa faktor prima terkecil dari ${num}?`;
      if (mathLevelKey === "medium") return `Cari faktor prima terkecil dari ${num}.`;
      return `Faktor: berapa faktor prima terkecil dari ${num}?`;
    }
    if (subKind === "pc_divisor_pick" && num != null && params?.divisorCandidate != null) {
      const d = params.divisorCandidate;
      if (mathLevelKey === "easy") return `Cek pembagi: apakah ${d} membagi ${num} habis?`;
      if (mathLevelKey === "medium") return `Pembagi: apakah ${num} habis dibagi ${d}?`;
      return `Pembagi: apakah ${d} membagi ${num} tepat?`;
    }
    if (num != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Bilangan prima: apakah ${num} prima atau komposit?`
          : `Klasifikasi dasar: ${num} — prima atau komposit?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Klasifikasikan bilangan: ${num} — prima atau komposit?`
          : `Apakah ${num} punya tepat dua pembagi asli yang berbeda?`;
      }
      return pv === 0
        ? `Apakah ${num} prima atau komposit? Pikir dulu sebelum memilih.`
        : `Bukti cepat: bisakah ${num} dipecah menjadi dua faktor lebih besar dari 1?`;
    }
  }

  if (selectedOp === "powers" && (kind === "power_base" || kind === "power_calc")) {
    if (kind === "power_calc") {
      if (mathLevelKey === "easy") return `Pangkat: ${q0}`;
      if (mathLevelKey === "medium") return `Hitung pangkatnya — ${q0}`;
      return `Pangkat: ${q0}`;
    }
    if (kind === "power_base") {
      if (mathLevelKey === "easy") return `Cari basis pada pangkat: ${q0}`;
      if (mathLevelKey === "medium") return `Teka-teki pangkat — ${q0}`;
      return `Basis yang hilang pada pangkat: ${q0}`;
    }
  }

  if (selectedOp === "estimation") {
    if (kind === "est_add") {
      if (mathLevelKey === "easy") return q0.replace(/^Estimate\b/i, "Perkiraan pembulatan: perkirakan");
      return q0;
    }
    if (kind === "est_mul" || kind === "est_quantity") return q0;
  }

  if (
    kind === "frac_half" ||
    kind === "frac_half_reverse" ||
    kind === "frac_quarter" ||
    kind === "frac_quarter_reverse"
  ) {
    if (mathLevelKey === "easy") return `Pecahan: ${q0}`;
    if (mathLevelKey === "medium") return `Pecahan sebagai bagian dari keseluruhan: ${q0}`;
    return `Pecahan: ${q0}`;
  }

  if (kind === "fm_factor") {
    if (mathLevelKey === "easy") return `Faktor: ${q0}`;
    if (mathLevelKey === "medium") return `Identifikasi sebuah pembagi: ${q0}`;
    return `Pembagi dan faktor: ${q0}`;
  }
  if (kind === "fm_multiple") {
    if (mathLevelKey === "easy") return `Kelipatan: ${q0}`;
    if (mathLevelKey === "medium") return `Cek kelipatan: ${q0}`;
    return `Kelipatan: ${q0}`;
  }

  if (selectedOp === "percentages" || selectedOp === "ratio" || selectedOp === "scale") return q0;

  if (kind === "fm_gcd" && params?.a != null && params?.b != null) {
    const { a, b } = params;
    if (mathLevelKey === "easy") {
      return `FPB: berapa faktor persekutuan terbesar dari ${a} dan ${b}? = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return `Faktor persekutuan terbesar (FPB) dari ${a} dan ${b} — berapa itu? = ${BLANK}`;
    }
    return `FPB: pikir dulu — GCD(${a}, ${b}) = ${BLANK}`;
  }

  if (kind === "round" && params?.n != null && params?.toWhat != null) {
    const { n, toWhat } = params;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (toWhat === 10) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Bulatkan ke puluhan: ${n} dibulatkan menjadi berapa? = ${BLANK}`
          : `Puluhan terdekat: ${n} → ? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Bulatkan ${n} ke puluhan terdekat — hasilnya? = ${BLANK}`
          : `Aturan bulatkan ke puluhan: ${n} = ${BLANK}`;
      }
      return pv === 0
        ? `Bulatkan ke puluhan: ${n} → ? = ${BLANK}`
        : `Bilangan benar setelah membulatkan ${n} ke puluhan = ${BLANK}`;
    }
    if (mathLevelKey === "easy") {
      return pv === 0
        ? `Bulatkan ke ratusan: ${n} dibulatkan menjadi berapa? = ${BLANK}`
        : `Ratusan terdekat: ${n} = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return pv === 0
        ? `Bulatkan ${n} ke ratusan terdekat — hasilnya? = ${BLANK}`
        : `Bulatkan ke ratusan: ${n} → ? = ${BLANK}`;
    }
    return pv === 0
      ? `Bulatkan ke ratusan: ${n} → ? = ${BLANK}`
      : `Bilangan setelah membulatkan ${n} ke ratusan = ${BLANK}`;
  }

  if (kind === "dec_add" || kind === "dec_sub") {
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    const a = params?.a;
    const b = params?.b;
    const pl = params?.places ?? 1;
    if (a != null && b != null) {
      const af = Number(a).toFixed(pl);
      const bf = Number(b).toFixed(pl);
      if (kind === "dec_add") {
        if (mathLevelKey === "easy") {
          return pv === 0
            ? `Jumlahkan desimal: ${af} + ${bf} = ${BLANK}`
            : `Jumlah langsung: ${af} + ${bf} = ${BLANK}`;
        }
        return `Jumlahkan desimal: ${af} + ${bf} = ${BLANK}`;
      }
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Kurangkan desimal: ${af} − ${bf} = ${BLANK}`
          : `Selisih langsung: ${af} − ${bf} = ${BLANK}`;
      }
      return `Kurangkan desimal: ${af} − ${bf} = ${BLANK}`;
    }
  }

  if (selectedOp === "sequences") {
    if (mathLevelKey === "easy") {
      return q0.replace(/^Continue the sequence\b/i, "Lanjutkan pola bilangan");
    }
    return q0;
  }

  const looksNumericExercise =
    /=\s*__|=\s*\?\?|___|\?\?=/.test(q0) ||
    (/^\d/.test(q0.trim()) && /[+\-×÷]/.test(q0));

  if (looksNumericExercise) return q0;
  if (/^Exercise\b/i.test(q0)) return q0;

  if (containsHebrew(q0) && params?.exerciseText && !containsHebrew(String(params.exerciseText))) {
    return String(params.exerciseText);
  }

  return q0;
}

function isShortAnswerField(field) {
  return field === "answers" || field === "options" || field === "acceptedAnswers";
}

function localizeMathField(_field, value, question) {
  const text = String(value ?? "");
  if (!containsHebrew(text)) return text;

  if (YES_NO[text.trim()]) return YES_NO[text.trim()];
  if (PRIME_COMPOSITE[text.trim()]) return PRIME_COMPOSITE[text.trim()];
  if (PARITY[text.trim()]) return PARITY[text.trim()];

  const rebuilt = rebuildMathStemIdId(question);
  if (rebuilt && !containsHebrew(rebuilt) && (_field === "question" || _field === "exerciseText" || _field === "questionLabel")) {
    return rebuilt;
  }

  const presented = applyMathLevelPresentationIdId(text, {
    selectedOp: question?.operation || inferSelectedOp(question),
    params: question?.params || {},
    mathLevelKey: inferMathLevelKey(question),
    gradeKey: question?.gradeKey || "g3",
  });
  if (presented && !containsHebrew(presented)) return presented;

  const phrased = applyMathPhrases(text);
  if (!containsHebrew(phrased)) return phrased;

  const stripped = phrased
    .replace(/(\d+)\s+remainder\s+(\d+)/gu, "$1 sisa $2")
    .replace(/[\u0590-\u05FF]+/gu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return stripped || text;
}

function isNearlyEmptyStem(text) {
  const t = String(text ?? "")
    .replace(/[_\s.:=?\-−–—,/|]+/g, "")
    .trim();
  return t.length < 2;
}

const OP_SYMBOL_ID = Object.freeze({
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
});

/**
 * Build display stem from params/kind only (no Hebrew sentence translation).
 * @param {Record<string, unknown>} question
 */
function resolveMathDisplayStem(question) {
  const rebuilt = rebuildMathStemIdId(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  if (a != null && b != null && OP_SYMBOL_ID[opRaw]) {
    return { stem: `Berapa ${a} ${OP_SYMBOL_ID[opRaw]} ${b}?`, source: "generic" };
  }
  for (const candidate of [p.exerciseText, question?.exerciseText, question?.question]) {
    if (typeof candidate === "string" && candidate.trim() && !containsHebrew(candidate)) {
      return { stem: String(candidate).trim(), source: "passthrough" };
    }
  }
  return { stem: null, source: "none" };
}

/**
 * Localize math question for Indonesian (id-ID) display.
 * Display stems come from params/kind templates — not from translating Hebrew prose.
 * Option tokens use closed dictionaries (logical labels), not sentence MT.
 */
export function localizeMathQuestionIdId(question) {
  if (!question) return question;

  const base = { ...question };
  // Drop authored Hebrew stems so params are the sole stem authority.
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const { stem, source } = resolveMathDisplayStem({ ...question, ...base, params: question.params });
  const resolvedStem = stem || "Selesaikan.";

  const out = mapQuestionTextFields({ ...base }, (field, value, q) => {
    if (field === "question" || field === "exerciseText" || field === "questionLabel") {
      if (!value || containsHebrew(value) || isNearlyEmptyStem(value)) return resolvedStem;
      return value;
    }
    // Answers/options: closed token maps only (no full-sentence HE→EN).
    if (isShortAnswerField(field)) {
      const text = String(value ?? "");
      if (!containsHebrew(text)) return text;
      if (YES_NO[text.trim()]) return YES_NO[text.trim()];
      if (PRIME_COMPOSITE[text.trim()]) return PRIME_COMPOSITE[text.trim()];
      if (PARITY[text.trim()]) return PARITY[text.trim()];
      if (OBJECTS_ID[text.trim()]) return OBJECTS_ID[text.trim()];
      const digitsOnly = text.replace(/[\u0590-\u05FF]+/gu, "").trim();
      return digitsOnly || text;
    }
    if (!containsHebrew(String(value ?? ""))) return value;
    return value;
  });

  out.question = resolvedStem;
  if (!out.exerciseText || containsHebrew(String(out.exerciseText)) || isNearlyEmptyStem(out.exerciseText)) {
    out.exerciseText = resolvedStem;
  }
  out.displayStemSource = source;

  if (typeof out.correctAnswer === "string") {
    const ca = out.correctAnswer.trim();
    if (YES_NO[ca]) out.correctAnswer = YES_NO[ca];
    else if (PRIME_COMPOSITE[ca]) out.correctAnswer = PRIME_COMPOSITE[ca];
    else if (PARITY[ca]) out.correctAnswer = PARITY[ca];
    else if (containsHebrew(ca)) {
      out.correctAnswer = ca.replace(/[\u0590-\u05FF]+/gu, "").trim() || ca;
    }
  }
  if (Array.isArray(out.answers)) {
    out.answers = out.answers.map((a) =>
      typeof a === "string" ? localizeMathField("answers", a, out) : a
    );
  }
  return out;
}
