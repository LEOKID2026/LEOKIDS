/**
 * Broad latin-token scan for MGS content pages (exclude known ID/tech tokens).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ID = path.join(ROOT, "docs/learning-book/id-ID");

const ID_OR_OK = new Set(
  `dan atau dari ke di pada untuk dengan tanpa oleh yang ini itu ada ketika apa bagaimana berapa banyak lebih paling beberapa semua setiap hanya juga sudah lagi selalu tidak ya adalah bisa akan harus kamu kita mereka dia hari sekarang pertama kedua ketiga belajar temukan lihat baca tulis gambar hitung selesaikan periksa coba mulai buat gunakan dapatkan beri ambil letakkan simpan perlu ingin seperti berarti disebut nama contoh latihan pertanyaan jawaban soal kata bilangan digit tempat nilai jumlah total selisih faktor kelipatan penjumlahan pengurangan perkalian pembagian sama hilang keseluruhan bagian setengah seperempat pecahan desimal persen rasio genap ganjil prima bulatkan pembulatan perkiraan bandingkan perbandingan barisan pola langkah metode aturan rumus satuan puluhan ratusan ribuan satu dua tiga empat lima enam tujuh delapan sembilan nol kiri kanan berbeda besar kecil panjang pendek bersama kelompok pasangan sisi sudut garis bentuk persegi segitiga lingkaran jajar genjang trapesium kubus bola tabung kerucut prisma limas bangun ruang muka rusuk alas tinggi lebar luas keliling volume diagonal jari diameter sejajar simetri refleksi rotasi translasi derajat putaran matematika geometri sains kelas murid guru orang tua anak sekolah buku halaman bab draf konten cakupan status penting ingat tips catatan penyelesaian penjelasan ilmiah percobaan hipotesis variabel kesimpulan grafik tabel air udara cahaya matahari tanaman makanan tubuh menit jam uang koin harga diskon kembalian titik poin vertikal mudah aman berbahaya kosong penuh terbuka tertutup baru lama benar salah karena jadi jika lainnya keduanya kecuali termasuk menurut tergantung berdasarkan terkait terhubung dipisahkan digabungkan disusun diurutkan terdaftar ditunjukkan digambar diwarnai diarsir dipilih diperlukan diizinkan diharapkan seharusnya dimaksudkan dirancang dibuat dibentuk selesai dimulai berakhir berhenti dilanjutkan diikuti didahului diganti dihapus ditambahkan dikecualikan dibagi dikalikan dikurangi dijumlahkan rupiah kolom referensi sumber visual konkret umum hati mari misalnya itulah berikutnya sebelumnya setelah sebelum lalu maju mundur hipotenusa pembagi pembilang penyebut tetangga konversi meter sentimeter gram kilogram liter kecepatan jarak siklus tahap energi gaya materi bahan perangkat listrik panas dingin tumbuh bernapas campuran biasa improper numerator denominator simplify expand reduce increase decrease swap flip slide forward backward direction relationship opposite adjacent face faces edge edges vertex base bases height length width area perimeter volume diagonal radius diameter circumference parallel perpendicular symmetry reflection rotation translation degree degrees turn math geometry science english grade student students teacher teachers parent parents child children school class book page pages chapter draft drafts content scope status important remember tip note solution explanation scientific experiment hypothesis variable conclusion graph table water air light sun plant plants food body day days time times minute minutes hour hours money coin coins price discount change point points carry borrow borrowing vertical horizontally vertically easy easier hard careful safe dangerous empty full open closed big small long short high low new old true false correct wrong because so if else both either other another such per via using used known unknown given asked shown follows following above below across around through during until while once twice going come comes came go goes went move moves moved stay stays remain remains become becomes show shows tell ask choose pick fill complete finish begin begins end ends work works build hear listen say says said call help helps let sheet worksheet worksheets exercise exercises activity activities game games play playing near far inside outside top bottom middle center centre row rows column columns grid tile tiles measure measurement measurements convert conversion conversions neighbour neighbors neighbors neighbour blank blanks symbol symbols sign signs greater less least average common greatest lowest highest possible impossible reasonable approximately almost exactly roughly finally previously originally actually really very too enough quite rather yet still even own itself yourself ourselves someone something everything nothing anyone anything everyone somebody nobody people person boy girl man woman friend friends family home house room door window bag bags box boxes apple apples egg eggs fish bird birds tree nest leaf leaves soil earth world sky night morning evening week month year life cycle stage stages cause effect climate environment energy force matter material materials device devices electrical fire heat warm cold hot shine shines grow grows eat eaten breathe alive dead living non mixed improper proper numerator denominator simplify expand reduce increase decrease swap flip slide forward backward direction relationship opposite adjacent hypotenuse leg legs apex circular rectangular equilateral isosceles scalene acute obtuse right straight curved slanted marked dots dot stick sticks cube cubes single double triple shared equally among within throughout toward towards against upon along beside besides except including according depending based related connected separated combined arranged ordered sorted listed shown drawn colored coloured shaded highlighted selected chosen preferred required allowed needed wanted expected supposed meant intended designed created formed made done finished completed started begun ended stopped continued followed preceded replaced removed added included excluded divided multiplied subtracted added rupiah kolom referensi sumber visual konkret umum hati mari misalnya itulah berikutnya sebelumnya setelah sebelum lalu maju mundur hipotenusa pembagi yang dibagi penyebut tetangga konversi meter sentimeter gram kilogram liter kecepatan jarak siklus tahap energi gaya materi bahan perangkat listrik panas dingin tumbuh bernapas campuran kelereng pensil stiker kursi meja menyimpan meminjam tanpa sampai pertama masih perlu jadi pecah langkah langkahnya bersama jawaban pertanyaan coba sendiri halaman berikutnya hati hati batasan eksplisit panduan keterampilan pengecualian rentang operasi konteks entri dalam gunakan ulang pembaca desain pemilik disetujui salinan produk final metafora buaya ramah anak draf saja diterima hasil elipsis menyiratkan`
    .split(/\s+/)
    .map((w) => w.toLowerCase())
);

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md") && !/README\.md$/i.test(p)) a.push(p);
  }
  return a;
}

const hits = new Map();
for (const subject of ["math", "geometry", "science"]) {
  for (const f of walk(path.join(ID, subject))) {
    const text = fs.readFileSync(f, "utf8");
    for (const line of text.split(/\r?\n/)) {
      if (/^```/.test(line.trim()) || /^:::/.test(line.trim())) continue;
      if (/^\|/.test(line.trim()) && /learning_page_id|skill_id|age_band|page_type|approval_status|title_english/.test(line)) continue;
      if (/^-\s*`?(data|docs|lib|utils|scripts)\//.test(line.trim())) continue;
      const cleaned = line.replace(/`[^`]+`/g, " ").replace(/https?:\/\/\S+/g, " ");
      for (const w of cleaned.match(/[A-Za-z']+/g) || []) {
        const low = w.toLowerCase();
        if (low.length < 4) continue;
        if (ID_OR_OK.has(low)) continue;
        if (/^(cm|mm|km|kg|pdf|sql|json|http|https|gcf|fpb|kpk|abcd)$/i.test(low)) continue;
        if (/^[A-Z]{2,}$/.test(w)) continue; // acronyms
        if (/^[A-Z][a-z]+$/.test(w) && w.length <= 10) continue; // proper nouns Noah etc.
        hits.set(low, (hits.get(low) || 0) + 1);
      }
    }
  }
}

const ranked = [...hits.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-phase8/mgs-broad-latin-scan.json"),
  JSON.stringify({ unique: ranked.length, top80: ranked.slice(0, 80) }, null, 2)
);
console.log(JSON.stringify({ unique: ranked.length, top30: ranked.slice(0, 30) }, null, 2));
