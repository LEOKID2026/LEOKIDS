/**
 * Generate map-chunk-2.json and map-chunk-3.json (id-ID Phase 4B).
 * Identity-map code fragments / keycodes; translate UI strings.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const map2 = {
  "Collect Leo the Runner!": "Kumpulkan Leo si Pelari!",
  "Collect Leo the Scientist!": "Kumpulkan Leo si Ilmuwan!",
  "Collect Leo the Smart One!": "Kumpulkan Leo si Pintar!",
  "Collect Leo the Sorcerer!": "Kumpulkan Leo si Ahli Sihir!",
  "Collect Leo the Surfer!": "Kumpulkan Leo si Peselancar!",
  "Collect Leo the Swimmer!": "Kumpulkan Leo si Perenang!",
  "Collect Leo the Wizard!": "Kumpulkan Leo si Penyihir!",
  "Collect Leo Treasure Hunter!": "Kumpulkan Leo Pemburu Harta!",
  "Collect Leo Veterinarian!": "Kumpulkan Leo Dokter Hewan!",
  "Collect Leo Walk to School!": "Kumpulkan Leo Jalan ke Sekolah!",
  "Collect Leo Wave Champion!": "Kumpulkan Leo Juara Ombak!",
  "Collect Leo with Glasses!": "Kumpulkan Leo Berkacamata!",
  "Collect Leo World Explorer!": "Kumpulkan Leo Penjelajah Dunia!",
  "Color Experiment": "Eksperimen Warna",
  "Combine the fractions on the pizza.": "Gabungkan pecahan di pizza.",
  "Complete the pieces of Leo's picture!": "Lengkapi potongan gambar Leo!",
  "Complete the pizza to make a whole.": "Lengkapi pizza agar menjadi utuh.",
  "Complete the required action to activate the bonus.":
    "Selesaikan aksi yang diminta untuk mengaktifkan bonus.",
  "Complete the sequence. Choose the missing numbers in order.":
    "Lengkapi barisan. Pilih angka yang hilang berurutan.",
  "Conduction Experiment": "Eksperimen Konduksi",
  "Connect Colors": "Hubungkan Warna",
  "Continue anyway": "Lanjutkan saja",
  cookies: "kue kering",
  "Correct answer +30, streak bonus. After a few failed attempts the solution is shown.":
    "Jawaban benar +30, bonus beruntun. Setelah beberapa kali gagal, solusi ditampilkan.",
  "Correct answer +30, time bonus up to +20, streak of 5 correct +25. No points are deducted for mistakes.":
    "Jawaban benar +30, bonus waktu hingga +20, 5 beruntun benar +25. Kesalahan tidak mengurangi poin.",
  "Correct answer +30, time bonus, streak of 3 +15, streak of 5 +30. Timeout −5. A mistake doesn't end the game - it just counts.":
    "Jawaban benar +30, bonus waktu, 3 beruntun +15, 5 beruntun +30. Waktu habis −5. Kesalahan tidak mengakhiri gim — hanya dihitung.",
  "Correct answer +30, time bonus, streak. After a few failed attempts the solution is shown.":
    "Jawaban benar +30, bonus waktu, beruntun. Setelah beberapa kali gagal, solusi ditampilkan.",
  "Correct comparison!": "Perbandingan benar!",
  "Correct conclusion from the passage!": "Kesimpulan dari bacaan benar!",
  "Correct female form!": "Bentuk perempuan benar!",
  "Correct items": "Item benar",
  "Correct path:": "Jalur benar:",
  "Correct pizza +30, streak of 3 correct +15, streak of 5 +30. No points are deducted for mistakes.":
    "Pizza benar +30, 3 beruntun benar +15, 5 beruntun +30. Kesalahan tidak mengurangi poin.",
  "Correct plural form!": "Bentuk jamak benar!",
  "Correct product +10, correct change +25, satisfied customer +30, change right on the first try +10, fast service +5. A mistake or running out of time −5.":
    "Produk benar +10, uang kembalian benar +25, pelanggan puas +30, kembalian benar di percobaan pertama +10, layanan cepat +5. Kesalahan atau kehabisan waktu −5.",
  "Correct sort +10, fast sort +5, streak of 5 correct +20, streak of 10 +50. A mistake or missed item −5 (score never drops below 0).":
    "Sortir benar +10, sortir cepat +5, 5 beruntun benar +20, 10 beruntun +50. Kesalahan atau item terlewat −5 (skor tidak pernah di bawah 0).",
  "Correct! Great job ♻️": "Benar! Kerja bagus ♻️",
  "Correct! The first letter is on the car.": "Benar! Huruf pertama ada di gerbong.",
  "Couldn't sell the duplicate — try again.": "Tidak bisa menjual duplikat — coba lagi.",
  "Couldn't show your Leo number — try refreshing the page.":
    "Tidak bisa menampilkan nomor Leo kamu — coba muat ulang halaman.",
  croissants: "croissant",
  cupcakes: "cupcake",
  "Customer paid:": "Pelanggan membayar:",
  "Customers walk into the pizzeria — make them exactly the pizza they ordered!":
    "Pelanggan masuk ke pizzeria — buatkan pizza persis seperti yang mereka pesan!",
  "Date.now()": "Date.now()",
  Decline: "Tolak",
  Default: "Default",
  Delete: "Hapus",
  "Demo mode": "Mode demo",
  "Diamond balance:": "Saldo berlian:",
  "Diamond chest is disabled": "Peti berlian dinonaktifkan",
  "Diamonds info": "Info berlian",
  "diffConfig.bins.map((id) => BINS[id]),\n    [diffConfig.bins],\n  );\n\n  const binsGridClass =\n    activeBins.length":
    "diffConfig.bins.map((id) => BINS[id]),\n    [diffConfig.bins],\n  );\n\n  const binsGridClass =\n    activeBins.length",
  Digit1: "Digit1",
  Digit2: "Digit2",
  Digit3: "Digit3",
  "Diligent Student": "Murid Rajin",
  "Display name": "Nama tampilan",
  "Display name for games only — doesn't change your official name or Leo number.":
    "Nama tampilan hanya untuk gim — tidak mengubah nama resmi atau nomor Leo kamu.",
  'div]:w-full max-lg:[&>div]:max-w-none max-lg:[&>div]:rounded-none max-lg:[&>div]:border-x-0">':
    'div]:w-full max-lg:[&>div]:max-w-none max-lg:[&>div]:rounded-none max-lg:[&>div]:border-x-0">',
  "Divide among children or into bags — find how many per group and how many are left over, then tap Check division.":
    "Bagagi ke anak atau ke kantong — hitung berapa per kelompok dan sisanya, lalu ketuk Periksa pembagian.",
  "Division the Champion": "Juara Pembagian",
  Dog: "Anjing",
  "Don't fly too high - sometimes it's better to pass beneath an obstacle.":
    "Jangan terbang terlalu tinggi — kadang lebih baik lewat di bawah rintangan.",
  "Don't jump every time - sometimes it's better to wait a moment and jump at the right time.":
    "Jangan lompat terus — kadang lebih baik menunggu sebentar dan lompat di waktu yang tepat.",
  "Don't rush at everything - sometimes a target with a diamond is worth more.":
    "Jangan buru-buru ke semua target — kadang target dengan berlian lebih berharga.",
  "Double-6 set — two players, seven tiles each.":
    "Set dobel-6 — dua pemain, tujuh batu masing-masing.",
  Down: "Bawah",
  "Drag a title that fits the passage": "Seret judul yang cocok dengan bacaan",
  "Drag or tap an item from the conveyor belt, then choose the correct bin. Sort enough items before you reach the maximum number of mistakes.":
    "Seret atau ketuk item dari ban berjalan, lalu pilih tempat sampah yang benar. Sortir cukup item sebelum mencapai batas kesalahan.",
  "Drag the shape to the right group! +50 for each correct sort.":
    "Seret bentuk ke kelompok yang benar! +50 untuk setiap sortir benar.",
  "Drag the word that matches the picture": "Seret kata yang cocok dengan gambar",
  "Drag to a bin or tap an item → bin": "Seret ke tempat sampah atau ketuk item → tempat sampah",
  "Drag two dogs of the same level together to merge into a higher level.":
    "Seret dua anjing level sama agar bergabung jadi level lebih tinggi.",
  "Drag/move below · don't miss the ball": "Seret/gerak di bawah · jangan lewatkan bola",
  "Each child gets {quotient}.": "Setiap anak mendapat {quotient}.",
  "Each child gets {quotient}. {remaining}": "Setiap anak mendapat {quotient}. {remaining}",
  "Each dog adds damage per second to its lane. When a rock breaks you get coins.":
    "Setiap anjing menambah kerusakan per detik di jalurnya. Saat batu pecah kamu dapat koin.",
  "Each new maze — collect and race on!": "Setiap labirin baru — kumpulkan dan terus balapan!",
  "Each player picks a column; the disc drops to the bottom.":
    "Setiap pemain pilih kolom; keping jatuh ke bawah.",
  "Each tray gets {perTray}.": "Setiap nampan mendapat {perTray}.",
  "Earn this card: 20 Questions": "Dapatkan kartu ini: 20 Pertanyaan",
  "Earn this card: 3 Day Streak": "Dapatkan kartu ini: 3 Hari Beruntun",
  "Earn this card: 7 Day Streak": "Dapatkan kartu ini: 7 Hari Beruntun",
  "Earn this card: Addition the Champion": "Dapatkan kartu ini: Juara Penjumlahan",
  "Earn this card: Big Progress": "Dapatkan kartu ini: Progres Besar",
  "Earn this card: Diligent Student": "Dapatkan kartu ini: Murid Rajin",
  "Earn this card: Division the Champion": "Dapatkan kartu ini: Juara Pembagian",
  "Earn this card: English Star": "Dapatkan kartu ini: Bintang Bahasa Inggris",
  "Earn this card: Great Listener": "Dapatkan kartu ini: Pendengar Hebat",
  "Earn this card: Multiplication the Champion": "Dapatkan kartu ini: Juara Perkalian",
  "Earn this card: Never Give Up": "Dapatkan kartu ini: Pantang Menyerah",
  "Earn this card: New Record": "Dapatkan kartu ini: Rekor Baru",
  "Earn this card: Number Explorer": "Dapatkan kartu ini: Penjelajah Angka",
  "Earn this card: Personal Activity": "Dapatkan kartu ini: Aktivitas Pribadi",
  "Earn this card: Science Explorer": "Dapatkan kartu ini: Penjelajah Sains",
  "Earn this card: Shapes Master": "Dapatkan kartu ini: Master Bentuk",
  "Earn this card: Strong Start": "Dapatkan kartu ini: Awal Kuat",
  "Earn this card: Subtraction the Champion": "Dapatkan kartu ini: Juara Pengurangan",
  "Earn this card: Task Complete": "Dapatkan kartu ini: Tugas Selesai",
  "Earn this card: Understanding Master": "Dapatkan kartu ini: Master Pemahaman",
  "Earn this card: Week Star": "Dapatkan kartu ini: Bintang Minggu",
  "Earn this card: Word Discoverer": "Dapatkan kartu ini: Penemu Kata",
  "Earn this card: Young Reader": "Dapatkan kartu ini: Pembaca Muda",
  "earned points are redeemed for Leo coins via the server.":
    "poin yang didapat ditukar menjadi koin Leo lewat server.",
  "Educational Games - Offline": "Gim Edukatif - Offline",
  "Electricity Experiment": "Eksperimen Listrik",
  "Empty slot": "Slot kosong",
  "Empty space": "Ruang kosong",
  "Empty your hand to win.": "Kosongkan tanganmu untuk menang.",
  "English Star": "Bintang Bahasa Inggris",
  "Enrichment games, critical thinking, and general knowledge":
    "Gim pengayaan, berpikir kritis, dan pengetahuan umum",
  "Enter a Leo number or display name — a friend request will be sent for them to approve.":
    "Masukkan nomor Leo atau nama tampilan — permintaan teman akan dikirim untuk mereka setujui.",
  "Enter learning prototypes": "Masuk prototipe belajar",
  "Enter prototypes": "Masuk prototipe",
  "Enter solo prototypes": "Masuk prototipe solo",
  "Entering…": "Masuk…",
  "Entry cost": "Biaya masuk",
  "Equal sharing, groups, and remainder": "Pembagian sama rata, kelompok, dan sisa",
  "Equivalent fractions, compare, and combine visually":
    "Pecahan senilai, bandingkan, dan gabungkan secara visual",
  Escape: "Escape",
  "Event order is correct!": "Urutan peristiwa benar!",
  'event.stopPropagation()}\n                dir="ltr"\n              >':
    'event.stopPropagation()}\n                dir="ltr"\n              >',
  "Every rock broken grants coins. Points accumulate based on the rock's stage - with a daily limit.":
    "Setiap batu yang dipecahkan memberi koin. Poin bertambah menurut tahap batu — dengan batas harian.",
  "Excellent! You built the word on the cars.": "Luar biasa! Kamu menyusun kata di gerbong.",
  "Exit demo": "Keluar demo",
  "Extra topping on the pizza — check again.": "Topping ekstra di pizza — periksa lagi.",
  "f.y > -120 && f.y": "f.y > -120 && f.y",
  "Face-down card": "Kartu tertutup",
  "Face-up card": "Kartu terbuka",
  "Fill in the missing letter on the car": "Isi huruf yang hilang di gerbong",
  "Fill the target shape · double-tap = rotate 45°":
    "Isi bentuk target · ketuk dua kali = putar 45°",
  "Finish a successful game to earn coins and diamonds for Kid's World.":
    "Selesaikan gim dengan sukses untuk dapat koin dan berlian di Dunia Anak.",
  "Finish all items before time runs out": "Selesaikan semua item sebelum waktu habis",
  "First fraction is greater": "Pecahan pertama lebih besar",
  "First pizza": "Pizza pertama",
  "First player": "Pemain pertama",
  "First to {target}": "Pertama ke {target}",
  "Floating Experiment": "Eksperimen Mengapung",
  "Follow the instructions on screen and try to reach the goal.":
    "Ikuti instruksi di layar dan coba capai tujuan.",
  "For the best experience, rotate your screen to landscape.":
    "Untuk pengalaman terbaik, putar layar ke mode landscape.",
  "Four eighths basil and four eighths cheese.": "Empat per delapan basil dan empat per delapan keju.",
  "Four in a row.": "Empat beruntun.",
  "Friend requests": "Permintaan teman",
  Friends: "Teman",
  "Friends — controlled via Admin. Not open to guests yet.":
    "Teman — dikontrol lewat Admin. Belum terbuka untuk tamu.",
  "Fruit slice, pipes, blocks, and more — feel out solo gameplay.":
    "Potong buah, pipa, blok, dan lainnya — coba gameplay solo.",
  "Full bags": "Kantong penuh",
  Fullscreen: "Layar penuh",
  "Game balance, gifts, and daily limits may change for fairness and upkeep.":
    "Keseimbangan gim, hadiah, dan batas harian bisa berubah demi keadilan dan pemeliharaan.",
  "Game is not active yet": "Gim belum aktif",
  "Game name:": "Nama gim:",
  "Game Prototypes": "Prototipe Gim",
  "Game results summary": "Ringkasan hasil gim",
  Games: "Gim",
  "Garden Experiment": "Eksperimen Kebun",
  "Get ready... {countdown}": "Bersiap... {countdown}",
  "ghostPreview.row + dr === r && ghostPreview.col + dc === c,\r\n                      );\r\n                    const ghostClass = ghostHere\r\n                      ? ghostPreview.valid\r\n                        ? \"ring-2 ring-emerald-300/80\"\r\n                        : \"ring-2 ring-rose-400/80\"\r\n                      : \"\";\r\n                    return (":
    "ghostPreview.row + dr === r && ghostPreview.col + dc === c,\r\n                      );\r\n                    const ghostClass = ghostHere\r\n                      ? ghostPreview.valid\r\n                        ? \"ring-2 ring-emerald-300/80\"\r\n                        : \"ring-2 ring-rose-400/80\"\r\n                      : \"\";\r\n                    return (",
  gift: "hadiah",
  "Gift timer": "Timer hadiah",
  "Gift timer info": "Info timer hadiah",
  "Gifts, auto dogs, and other bonuses show up from time to time.":
    "Hadiah, anjing otomatis, dan bonus lain muncul dari waktu ke waktu.",
  "Give change ✓": "Berikan kembalian ✓",
  "Given: {givenTrays} × {givenPerTray} = {total}":
    "Diketahui: {givenTrays} × {givenPerTray} = {total}",
  "Glass can be recycled many times.": "Kaca bisa didaur ulang berkali-kali.",
  "Go back to the card shop and make sure cards are available":
    "Kembali ke toko kartu dan pastikan kartu tersedia",
  Goal: "Tujuan",
  "Goal: connect four discs in a row — horizontal, vertical, or diagonal.":
    "Tujuan: hubungkan empat keping beruntun — horizontal, vertikal, atau diagonal.",
  "Good moves earn points. Mistakes or running out of time can end the game.":
    "Gerakan bagus memberi poin. Kesalahan atau kehabisan waktu bisa mengakhiri gim.",
  "Got it — I'll rotate": "Oke — aku akan putar",
  "Got it, let's play": "Oke, ayo main",
  "Great job": "Kerja bagus",
  "Great job! 🎉": "Kerja bagus! 🎉",
  "Great job! The uppercase letter is in place.": "Kerja bagus! Huruf kapital sudah di tempatnya.",
  "Great Listener": "Pendengar Hebat",
  "Great! The order is ready.": "Bagus! Pesanan siap.",
  "Great! You chose the correct path.": "Bagus! Kamu memilih jalur yang benar.",
  "Great! You completed the missing letters.": "Bagus! Kamu melengkapi huruf yang hilang.",
  "Great! You identified the fraction.": "Bagus! Kamu mengenali pecahannya.",
  "Great! You shared correctly.": "Bagus! Kamu membagi dengan benar.",
  Green: "Hijau",
  "Grocery, recycling, animals, lab, Israel journey, weather, space, and more.":
    "Belanja, daur ulang, hewan, lab, perjalanan Israel, cuaca, luar angkasa, dan lainnya.",
  "Guests cannot collect diamonds": "Tamu tidak bisa mengumpulkan berlian",
  "Guests cannot collect rewards - please link an account":
    "Tamu tidak bisa mengumpulkan hadiah - silakan tautkan akun",
  "Half 🌿 + Half 🫑": "Separuh 🌿 + Separuh 🫑",
  "Half 🍄 + Half 🧀": "Separuh 🍄 + Separuh 🧀",
  "Half 🧀 + Half 🌿": "Separuh 🧀 + Separuh 🌿",
  "Half 🧀 + Half 🍄": "Separuh 🧀 + Separuh 🍄",
  "Half 🧀 + Half 🍅": "Separuh 🧀 + Separuh 🍅",
  "Half 🫑 + Half 🧀": "Separuh 🫑 + Separuh 🧀",
  "Half 🫒 + Half 🍅": "Separuh 🫒 + Separuh 🍅",
  "Half the pizza with basil and half with pepper.":
    "Separuh pizza dengan basil dan separuh dengan paprika.",
  "Half the pizza with cheese and half with basil.":
    "Separuh pizza dengan keju dan separuh dengan basil.",
  "Half the pizza with cheese and half with mushrooms.":
    "Separuh pizza dengan keju dan separuh dengan jamur.",
  "Half the pizza with cheese and half with tomato.":
    "Separuh pizza dengan keju dan separuh dengan tomat.",
  "Half the pizza with mushrooms and half with cheese.":
    "Separuh pizza dengan jamur dan separuh dengan keju.",
  "Half the pizza with olives and half with tomato.":
    "Separuh pizza dengan zaitun dan separuh dengan tomat.",
  "Half the pizza with pepper and half with cheese.":
    "Separuh pizza dengan paprika dan separuh dengan keju.",
  "handleDragStart(e, id)}\n\n              portraitMobile\n\n              hideLabel\n\n              singleRow\n\n            />":
    "handleDragStart(e, id)}\n\n              portraitMobile\n\n              hideLabel\n\n              singleRow\n\n            />",
  "handleDragStart(e, id)}\n\n              portraitMobile\n\n              hideLabel\n\n            />":
    "handleDragStart(e, id)}\n\n              portraitMobile\n\n              hideLabel\n\n            />",
};

const map3 = {
  "handleDragStart(e, id)}\n\n            />": "handleDragStart(e, id)}\n\n            />",
  "Heat can turn ice into water.": "Panas bisa mengubah es menjadi air.",
  "Heat Experiment": "Eksperimen Panas",
  "Heavier objects can sink in water.": "Benda lebih berat bisa tenggelam di air.",
  "Help Leo the cashier — pick the product, figure out the change, and give the right money back":
    "Bantu Leo si kasir — pilih produk, hitung kembalian, dan kembalikan uang yang tepat",
  "hintCell && hintCell.r === r && hintCell.c === c;\n  const isStartCell = (r, c) => start.r === r && start.c === c;\n  const isExitCell = (r, c) => exit.r === r && exit.c === c;\n  const isKeyCell = (r, c) => keyCell && keyCell.r === r && keyCell.c === c;\n  const isBonusDiamond = (r, c) =>\n    bonusDiamond?.active && bonusDiamond.r === r && bonusDiamond.c === c;\n  const isWallHit = (r, c) => wallHitCell && wallHitCell.r === r && wallHitCell.c === c;\n\n  return (":
    "hintCell && hintCell.r === r && hintCell.c === c;\n  const isStartCell = (r, c) => start.r === r && start.c === c;\n  const isExitCell = (r, c) => exit.r === r && exit.c === c;\n  const isKeyCell = (r, c) => keyCell && keyCell.r === r && keyCell.c === c;\n  const isBonusDiamond = (r, c) =>\n    bonusDiamond?.active && bonusDiamond.r === r && bonusDiamond.c === c;\n  const isWallHit = (r, c) => wallHitCell && wallHitCell.r === r && wallHitCell.c === c;\n\n  return (",
  "Hold to fly": "Tahan untuk terbang",
  "Home screen · UI": "Layar utama · UI",
  "Horizontal line of 3": "Garis horizontal 3",
  "Horizontal line of 4": "Garis horizontal 4",
  "Horizontal pair": "Pasangan horizontal",
  "How do you make carrot orange? 🟧": "Bagaimana membuat oranye wortel? 🟧",
  "How do you make grape purple? 🟪": "Bagaimana membuat ungu anggur? 🟪",
  "How do you make grass green? 🟩": "Bagaimana membuat hijau rumput? 🟩",
  "How do you make green? 🟩": "Bagaimana membuat hijau? 🟩",
  "How do you make orange? 🟧": "Bagaimana membuat oranye? 🟧",
  "How do you make purple? 🟪": "Bagaimana membuat ungu? 🟪",
  "How do you score?": "Bagaimana cara mendapat skor?",
  "How many slices are marked?": "Berapa iris yang ditandai?",
  "How to play {title}?": "Cara main {title}?",
  "How to play?": "Cara main?",
  "Ice can float in water.": "Es bisa mengapung di air.",
  "Ice in a bowl can keep things cold for a short time.":
    "Es di mangkuk bisa menjaga barang tetap dingin sebentar.",
  "Ice melts when it gets warm.": "Es mencair saat menjadi hangat.",
  "If it's off - wait until the conditions are met.":
    "Jika mati - tunggu sampai syarat terpenuhi.",
  "If the board fills with no four-in-a-row — it's a draw.":
    "Jika papan penuh tanpa empat beruntun — hasilnya seri.",
  'img.id === selectedImageId)?.src || PUZZLE_IMAGES[0].src;\n  const isEasy = difficulty === "easy";\n\n  const safePreviewIndex =\n    previewIndex == null\n      ? null\n      : Math.min(Math.max(previewIndex, 0), PUZZLE_IMAGES.length - 1);\n  const previewImage = safePreviewIndex == null ? null : PUZZLE_IMAGES[safePreviewIndex];\n  const canPreviewPrev = safePreviewIndex != null && safePreviewIndex > 0;\n  const canPreviewNext =\n    safePreviewIndex != null && safePreviewIndex':
    'img.id === selectedImageId)?.src || PUZZLE_IMAGES[0].src;\n  const isEasy = difficulty === "easy";\n\n  const safePreviewIndex =\n    previewIndex == null\n      ? null\n      : Math.min(Math.max(previewIndex, 0), PUZZLE_IMAGES.length - 1);\n  const previewImage = safePreviewIndex == null ? null : PUZZLE_IMAGES[safePreviewIndex];\n  const canPreviewPrev = safePreviewIndex != null && safePreviewIndex > 0;\n  const canPreviewNext =\n    safePreviewIndex != null && safePreviewIndex',
  "initGameWithDifficulty(difficulty)}\n                />":
    "initGameWithDifficulty(difficulty)}\n                />",
  "Invalid action type": "Jenis aksi tidak valid",
  "Invalid claim type": "Jenis klaim tidak valid",
  "Invalid idempotency key": "Kunci idempotensi tidak valid",
  "Invalid room type (must be public or private)":
    "Jenis ruang tidak valid (harus publik atau privat)",
  Invite: "Undang",
  "Item tray — drag to a side": "Nampan item — seret ke salah satu sisi",
  "Jump 🦘": "Lompat 🦘",
  "Keep your eyes on what's falling and move ahead of time before the item reaches the bottom.":
    "Pantau yang jatuh dan bergerak lebih dulu sebelum item sampai di bawah.",
  L: "L",
  "Lab Experiment": "Eksperimen Lab",
  "Large triangle": "Segitiga besar",
  "Learning Prototypes": "Prototipe Belajar",
  "Left side wins! 🏆": "Sisi kiri menang! 🏆",
  "Legendary Super Leo": "Leo Super Legendaris",
  "Leo Arcade Champion": "Leo Juara Arkade",
  "Leo Archaeologist": "Leo Arkeolog",
  "Leo Army Dog": "Leo Anjing Tentara",
  "Leo Art Class": "Leo Kelas Seni",
  "Leo at the Beach": "Leo di Pantai",
  "Leo at the Library": "Leo di Perpustakaan",
  "Leo at the Pool": "Leo di Kolam",
  "Leo at the Recess": "Leo di Istirahat",
  "Leo at the Zoo": "Leo di Kebun Binatang",
  "Leo Autumn": "Leo Musim Gugur",
  "Leo Autumn — limited event card!": "Leo Musim Gugur — kartu event terbatas!",
  "Leo Back to Learning": "Leo Kembali Belajar",
  "Leo Back to Learning — limited event card!": "Leo Kembali Belajar — kartu event terbatas!",
  "Leo Birthday": "Leo Ultah",
  "Leo Birthday — limited event card!": "Leo Ultah — kartu event terbatas!",
  "Leo Bot": "Leo Bot",
  "Leo Camping": "Leo Berkemah",
  "Leo Candy Store": "Leo Toko Permen",
  "Leo Card Common Assets": "Aset Umum Kartu Leo",
  "Leo Carpenter": "Leo Tukang Kayu",
  "Leo Cherry Blossom": "Leo Bunga Sakura",
  "Leo Chess Club": "Leo Klub Catur",
  "Leo Clothes Shopping": "Leo Belanja Baju",
  "Leo Clothing Store": "Leo Toko Pakaian",
  "Leo Computer Class": "Leo Kelas Komputer",
  "Leo Cyclist": "Leo Pesepeda",
  "Leo Electrician": "Leo Tukang Listrik",
  "Leo Enchanted Forest Guardian": "Leo Penjaga Hutan Ajaib",
  "Leo End of Year": "Leo Akhir Tahun",
  "Leo End of Year — limited event card!": "Leo Akhir Tahun — kartu event terbatas!",
  "Leo Factory Manager": "Leo Manajer Pabrik",
  "Leo Factory Tour": "Leo Tur Pabrik",
  "Leo Family Day": "Leo Hari Keluarga",
  "Leo Family Day — limited event card!": "Leo Hari Keluarga — kartu event terbatas!",
  "Leo Ferris Wheel": "Leo Bianglala",
  "Leo Firefighter": "Leo Pemadam Kebakaran",
  "Leo Firefighter Helper": "Leo Asisten Pemadam",
  "Leo Forest Guardian": "Leo Penjaga Hutan",
  "Leo Galactic Explorer": "Leo Penjelajah Galaksi",
  "Leo Galaxy Captain": "Leo Kapten Galaksi",
  "Leo Games - Offline": "Gim Leo - Offline",
  "Leo Gardener": "Leo Tukang Kebun",
  "Leo Genius Inventor": "Leo Penemu Jenius",
  "Leo Gets Star": "Leo Dapat Bintang",
  "Leo Golden Knight": "Leo Ksatria Emas",
  "Leo Grand Wizard": "Leo Penyihir Agung",
  "Leo Hot Air Balloon": "Leo Balon Udara",
  "Leo in a Suit": "Leo Berjas",
  "Leo Jump Rope": "Leo Lompat Tali",
  "Leo Magician": "Leo Pesulap",
  "Leo Marathon the Runner": "Leo Pelari Marathon",
  "Leo Master Chef": "Leo Chef Master",
  "Leo Master Detective": "Leo Detektif Master",
  "Leo Master Painter": "Leo Pelukis Master",
  "Leo Miner": "Leo Penambang",
  "Leo Miners claims are disabled": "Klaim Leo Miners dinonaktifkan",
  "Leo Miners economy is disabled": "Ekonomi Leo Miners dinonaktifkan",
  "Leo Miners gifts are disabled": "Hadiah Leo Miners dinonaktifkan",
  "Leo Miners is disabled in Admin settings": "Leo Miners dinonaktifkan di pengaturan Admin",
  "Leo Miners is not enabled yet - apply migration and config":
    "Leo Miners belum diaktifkan - terapkan migrasi dan konfigurasi",
  "Leo Miners point accrual is disabled": "Akumulasi poin Leo Miners dinonaktifkan",
  "Leo Month Star": "Leo Bintang Bulan",
  "Leo Moon Walker": "Leo Pejalan Bulan",
  "Leo Mountain Climber": "Leo Pendaki Gunung",
  "Leo Music Star": "Leo Bintang Musik",
  "Leo Nature Explorer": "Leo Penjelajah Alam",
  "Leo number (8 digits) or display name": "Nomor Leo (8 digit) atau nama tampilan",
  "Leo Office Worker": "Leo Pegawai Kantor",
  "Leo on Train": "Leo di Kereta",
  "Leo PE Class": "Leo Kelas Olahraga",
  "Leo Piano Player": "Leo Pemain Piano",
  "Leo Picnic": "Leo Piknik",
  "Leo Pirate Captain": "Leo Kapten Bajak Laut",
  "Leo Police Dog": "Leo Anjing Polisi",
  "Leo Racing Driver": "Leo Pembalap",
  "Leo Rain Walk": "Leo Jalan Hujan",
  "Leo Robot the Engineer": "Leo Robot si Insinyur",
  "Leo Robotic": "Leo Robotik",
  "Leo Safari": "Leo Safari",
  "Leo Science Class": "Leo Kelas Sains",
  "Leo Shoe Shopping": "Leo Belanja Sepatu",
  "Leo Skateboarder": "Leo Pemain Skateboard",
  "Leo Skier": "Leo Pemain Ski",
  "Leo Soccer Champion": "Leo Juara Sepak Bola",
  "Leo Solo Games": "Gim Solo Leo",
  "Leo Space Commander": "Leo Komandan Luar Angkasa",
  "Leo Space the Pilot": "Leo Luar Angkasa si Pilot",
  "Leo Sports Store": "Leo Toko Olahraga",
  "Leo Spring": "Leo Musim Semi",
  "Leo Spring — limited event card!": "Leo Musim Semi — kartu event terbatas!",
  "Leo Star Explorer": "Leo Penjelajah Bintang",
  "Leo Summer": "Leo Musim Panas",
  "Leo Summer — limited event card!": "Leo Musim Panas — kartu event terbatas!",
  "Leo Summer Vacation": "Leo Liburan Musim Panas",
  "Leo Summer Vacation — limited event card!":
    "Leo Liburan Musim Panas — kartu event terbatas!",
  "Leo Super Inventor": "Leo Penemu Super",
  "Leo Superhero": "Leo Superhero",
  "Leo Teacher": "Leo Guru",
  "Leo Techno Dog": "Leo Anjing Tekno",
  "Leo the Artist": "Leo si Seniman",
  "Leo the Astronaut": "Leo si Astronaut",
  "Leo the Basketball Player": "Leo si Pemain Basket",
  "Leo the Celebrator": "Leo si Perayaan",
  "Leo the Champion": "Leo si Juara",
  "Leo the Chef": "Leo si Chef",
  "Leo the Classic Leo": "Leo si Leo Klasik",
  "Leo the Cool One": "Leo si Keren",
  "Leo the Dancer": "Leo si Penari",
  "Leo the Detective": "Leo si Detektif",
  "Leo the Doctor": "Leo si Dokter",
  "Leo the Engineer": "Leo si Insinyur",
  "Leo the Football Player": "Leo si Pemain Sepak Bola",
  "Leo the Funny One": "Leo si Lucu",
  "Leo the Gamer": "Leo si Gamer",
  "Leo the King": "Leo si Raja",
  "Leo the Knight": "Leo si Ksatria",
  "Leo the Miner - HUD version": "Leo si Penambang - versi HUD",
  "Leo the Miner - Leo Games": "Leo si Penambang - Gim Leo",
  "Leo the Musician": "Leo si Musisi",
  "Leo the Ninja": "Leo si Ninja",
  "Leo the Pilot": "Leo si Pilot",
  "Leo the Pirate": "Leo si Bajak Laut",
  "Leo the Playful One": "Leo si Ceria",
  "Leo the Runner": "Leo si Pelari",
  "Leo the Scientist": "Leo si Ilmuwan",
  "Leo the Smart One": "Leo si Pintar",
  "Leo the Sorcerer": "Leo si Ahli Sihir",
  "Leo the Surfer": "Leo si Peselancar",
  "Leo the Swimmer": "Leo si Perenang",
  "Leo the Wizard": "Leo si Penyihir",
  "Leo Treasure Hunter": "Leo Pemburu Harta",
  "Leo Veterinarian": "Leo Dokter Hewan",
  "Leo Walk to School": "Leo Jalan ke Sekolah",
  "Leo Wave Champion": "Leo Juara Ombak",
  "Leo Winter": "Leo Musim Dingin",
  "Leo Winter — limited event card!": "Leo Musim Dingin — kartu event terbatas!",
  "Leo Winter Vacation": "Leo Liburan Musim Dingin",
  "Leo Winter Vacation — limited event card!":
    "Leo Liburan Musim Dingin — kartu event terbatas!",
  "Leo with Glasses": "Leo Berkacamata",
  "Leo World Explorer": "Leo Penjelajah Dunia",
  "Leo's Games": "Gim Leo",
  "Leo's Maze": "Labirin Leo",
  "Leo's Maze Race": "Balapan Labirin Leo",
  "Leo's Memory Game": "Gim Memori Leo",
  "Leo's Puzzle": "Puzzle Leo",
  "Leo's Word Detective": "Detektif Kata Leo",
  "Leo's Word Train": "Kereta Kata Leo",
  "Leo&apos;s Market": "Pasar Leo",
  "Leo&apos;s Pizzeria": "Pizzeria Leo",
  "Leo&apos;s Recycling Factory": "Pabrik Daur Ulang Leo",
  Level: "Level",
  "Level:": "Level:",
  "Light Experiment": "Eksperimen Cahaya",
  "Light objects can float on water.": "Benda ringan bisa mengapung di air.",
  "Line of 3": "Garis 3",
  "Line of 4": "Garis 4",
  "Live game stats": "Statistik gim langsung",
  Lives: "Nyawa",
};

function writeMap(chunkName, translations) {
  const chunkPath = path.join(__dirname, `strings-${chunkName}.json`);
  const outPath = path.join(__dirname, `map-${chunkName}.json`);
  const strings = JSON.parse(fs.readFileSync(chunkPath, "utf8"));
  const missing = [];
  const extra = new Set(Object.keys(translations));
  const out = {};
  for (const s of strings) {
    if (!(s in translations)) missing.push(s.slice(0, 80));
    else {
      out[s] = translations[s];
      extra.delete(s);
    }
  }
  if (missing.length || extra.size) {
    console.error(chunkName, "missing", missing.length, "extra", extra.size);
    if (missing.length) console.error("MISSING sample:", missing.slice(0, 5));
    if (extra.size) console.error("EXTRA sample:", [...extra].slice(0, 5));
    process.exit(1);
  }
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`${chunkName}: ${Object.keys(out).length} keys → ${path.basename(outPath)}`);
}

writeMap("chunk-2", map2);
writeMap("chunk-3", map3);
