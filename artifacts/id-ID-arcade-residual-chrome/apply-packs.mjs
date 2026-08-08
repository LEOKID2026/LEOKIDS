/**
 * Apply EN + id-ID games burn-down leaf updates for Arcade residual chrome.
 * Rebuilds content-packs/{en,id-ID}/games/burn-down-index.json from leaves.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @param {string} locale @param {string} slug @param {Record<string,string>} copy @param {"merge"|"replace"} mode */
function writeLeaf(locale, slug, copy, mode = "merge") {
  const dir = path.join(ROOT, "content-packs", locale, "games", "burn-down");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${slug}.json`);
  let next = { ...copy };
  if (mode === "merge" && fs.existsSync(file)) {
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const prev = raw?.copy && typeof raw.copy === "object" ? raw.copy : {};
    next = { ...prev, ...copy };
  }
  fs.writeFileSync(file, `${JSON.stringify({ copy: next }, null, 2)}\n`, "utf8");
}

function rebuildIndex(locale) {
  const leafDir = path.join(ROOT, "content-packs", locale, "games", "burn-down");
  const indexPath = path.join(ROOT, "content-packs", locale, "games", "burn-down-index.json");
  /** @type {Record<string, Record<string, string>>} */
  const index = {};
  for (const name of fs.readdirSync(leafDir)) {
    if (!name.endsWith(".json") || name === "burn-down-index.json") continue;
    const slug = name.slice(0, -".json".length);
    const raw = JSON.parse(fs.readFileSync(path.join(leafDir, name), "utf8"));
    const copy = raw?.copy && typeof raw.copy === "object" ? raw.copy : null;
    if (!copy) continue;
    index[slug] = copy;
  }
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  return Object.keys(index).length;
}

const packs = {
  components__arcade__club__ArcadeClubFriendsPanel: {
    en: {
      copy: "Copy",
      copied: "Copied!",
      online: "● Online",
      offline: "○ Offline",
    },
    id: {
      setting_up_your_leo_number: "Menyiapkan nomor Leo kamu…",
      copy: "Salin",
      copied: "Tersalin!",
      online: "● Online",
      offline: "○ Offline",
    },
  },
  components__arcade__club__ArcadeClubProfilePanel: {
    en: {
      official_name_parent: "Official name (parent): {fullName}",
      wins_games: "Wins: {wins} · Games: {games}",
      game_fallback: "Game",
      result_dash: "-",
      coins_reward: "+{amount} coins",
    },
    id: {
      official_name_parent: "Nama resmi (orang tua): {fullName}",
      wins_games: "Menang: {wins} · Gim: {games}",
      game_fallback: "Gim",
      result_dash: "-",
      coins_reward: "+{amount} koin",
    },
  },
  components__arcade__club__ArcadeClubEventsPanel: {
    en: {
      daily_event: "Daily event",
      todays_challenge: "Today's challenge",
      coins_reward: "+{amount} coins",
      collected: "Collected ✓",
      collect_reward: "Collect reward",
      play_to_complete: "Play an arcade game to complete the challenge",
      tournament: "Tournament",
      registered: "Registered ✓",
      register: "Register",
      registration_closed: "Registration closed",
    },
    id: {
      daily_event: "Acara harian",
      todays_challenge: "Tantangan hari ini",
      coins_reward: "+{amount} koin",
      collected: "Sudah dikumpulkan ✓",
      collect_reward: "Ambil hadiah",
      play_to_complete: "Mainkan gim arkade untuk menyelesaikan tantangan",
      tournament: "Turnamen",
      registered: "Terdaftar ✓",
      register: "Daftar",
      registration_closed: "Pendaftaran ditutup",
    },
  },
  components__arcade__club__ArcadeClubMissionsPanel: {
    en: {
      missions_locked: "Daily missions — controlled via Admin. Not open to guests yet.",
      todays_missions: "Today's missions",
      mission_progress: "{progress}/{goal} · +{coins} coins",
      no_missions_today: "No missions today",
      achievements: "Achievements",
      no_achievements_yet: "No achievements yet",
    },
    id: {
      missions_locked: "Misi harian — dikontrol lewat Admin. Belum terbuka untuk tamu.",
      todays_missions: "Misi hari ini",
      mission_progress: "{progress}/{goal} · +{coins} koin",
      no_missions_today: "Tidak ada misi hari ini",
      achievements: "Pencapaian",
      no_achievements_yet: "Belum ada pencapaian",
    },
  },
  components__arcade__club__ArcadeClubShopPanel: {
    en: {
      card_shop: "Card shop",
      my_collection: "My collection",
    },
    id: {
      card_shop: "Toko kartu",
      my_collection: "Koleksiku",
    },
  },
  components__arcade__club__ArcadeTabNav: {
    en: {
      games: "Games",
      friends: "Friends",
      shop: "Shop",
      profile: "Profile",
    },
    id: {
      games: "Gim",
      friends: "Teman",
      shop: "Toko",
      profile: "Profil",
    },
  },
  components__arcade__club__ArcadeLobbyHeader: {
    en: {
      player: "Player",
      guest_player: "Guest player",
      leo_number_part: " · Leo number {leoNumber}",
      guest_link_hint: " — link with a parent for the full experience",
      coins: "Coins",
      diamonds: "Diamonds",
    },
    id: {
      player: "Pemain",
      guest_player: "Pemain tamu",
      leo_number_part: " · Nomor Leo {leoNumber}",
      guest_link_hint: " — tautkan dengan orang tua untuk pengalaman lengkap",
      coins: "Koin",
      diamonds: "Permata",
    },
  },
  components__arcade__club__ArcadeGuestUpgradeBanner: {
    en: {
      title: "Upgrade to a Leo profile for the full experience",
      body: "Linking with a parent keeps coins, cards, and display name — without blocking games.",
      home_screen: "Home screen",
    },
    id: {
      title: "Upgrade ke profil Leo untuk pengalaman lengkap",
      body: "Menautkan dengan orang tua menyimpan koin, kartu, dan nama tampilan — tanpa mengunci gim.",
      home_screen: "Layar beranda",
    },
  },
  components__arcade__club__ArcadeInviteBanner: {
    en: {
      friend: "Friend",
      invites_you_to_game: "{name} invites you to {game}",
      invites_you_to_a_game: "{name} invites you to a game",
      accept: "Accept",
      decline: "Decline",
    },
    id: {
      friend: "Teman",
      invites_you_to_game: "{name} mengundang kamu ke {game}",
      invites_you_to_a_game: "{name} mengundang kamu ke sebuah gim",
      accept: "Terima",
      decline: "Tolak",
    },
  },
  pages__student__arcade: {
    en: {
      selected_game: "Selected game: {title}",
      entry_amount_coins: "Entry amount: {amount} coins",
      pick_available_game: "Pick an available game",
      quick_match: "Quick match",
      create_public_room: "Create public room",
      create_private_room: "Create private room",
      active: "Active",
      unavailable: "Unavailable",
      open_rooms_count: "Open rooms: {count}",
      selected: "Selected",
      select: "Select",
      loading_games: "Loading games…",
      game_disabled_on_server: "Game disabled on server",
      not_active_yet: "Not active yet (waiting to enable)",
      enter_a_room_code: "Enter a room code",
      not_enough_coins: "Not enough coins",
      waiting_for_another_player: "Waiting for another player",
      game_in_progress: "Game in progress",
      player: "Player",
      personal_room: "Personal room",
      personal_room_blurb: "Your space with trophies and decorations",
      my_room: "My room",
      open_rooms: "Open rooms",
      open_rooms_blurb: "Public rooms and quick matches waiting for a player",
      no_list_game_inactive: "No list — game isn't active",
      no_open_rooms: "No open rooms right now",
      room_meta: "Cost {cost} · {players}/{max} players · {roomType} · waiting",
      room_is_full: "Room is full",
      join: "Join",
      private_room_join_code: "Private room — join with code",
      enter_code_from_friend: "Enter the code you got from a friend",
      join_with_code: "Join with code",
      room_ready: "Room ready",
      entry_cost: "Entry cost",
      room_code: "Room code",
      send_code_to_friend: "Send the code to a friend so they can join",
      enter_game: "Enter game",
      loading: "Loading…",
    },
    id: {
      selected_game: "Gim dipilih: {title}",
      entry_amount_coins: "Jumlah masuk: {amount} koin",
      pick_available_game: "Pilih gim yang tersedia",
      quick_match: "Pertandingan cepat",
      create_public_room: "Buat ruangan publik",
      create_private_room: "Buat ruangan pribadi",
      active: "Aktif",
      unavailable: "Tidak tersedia",
      open_rooms_count: "Ruangan terbuka: {count}",
      selected: "Dipilih",
      select: "Pilih",
      loading_games: "Memuat gim…",
      game_disabled_on_server: "Gim dinonaktifkan di server",
      not_active_yet: "Belum aktif (menunggu diaktifkan)",
      enter_a_room_code: "Masukkan kode ruangan",
      not_enough_coins: "Koin tidak cukup",
      waiting_for_another_player: "Menunggu pemain lain",
      game_in_progress: "Gim sedang berlangsung",
      player: "Pemain",
      personal_room: "Ruangan pribadi",
      personal_room_blurb: "Ruangmu dengan piala dan dekorasi",
      my_room: "Ruanganku",
      open_rooms: "Ruangan terbuka",
      open_rooms_blurb: "Ruangan publik dan pertandingan cepat yang menunggu pemain",
      no_list_game_inactive: "Tidak ada daftar — gim belum aktif",
      no_open_rooms: "Belum ada ruangan terbuka",
      room_meta: "Biaya {cost} · {players}/{max} pemain · {roomType} · menunggu",
      room_is_full: "Ruangan penuh",
      join: "Gabung",
      private_room_join_code: "Ruangan pribadi — gabung dengan kode",
      enter_code_from_friend: "Masukkan kode yang kamu dapat dari teman",
      join_with_code: "Gabung dengan kode",
      room_ready: "Ruangan siap",
      entry_cost: "Biaya masuk",
      room_code: "Kode ruangan",
      send_code_to_friend: "Kirim kode ke teman supaya mereka bisa gabung",
      enter_game: "Masuk gim",
      loading: "Memuat…",
    },
  },
};

/** Shared multiplayer HUD chrome keys per game slug */
const mpChromeEn = {
  back: "Back",
  leave: "Leave",
  leaving: "Leaving…",
  how_to_play: "How to play",
  close: "Close",
  help: "Help",
  waiting_for_a_player: "Waiting for a player…",
  waiting_for_another_player: "Waiting for another player…",
  loading: "Loading…",
  loading_game_state: "Loading game state…",
  you_won: "You won!",
  draw: "Draw",
  game_over: "Game over",
  wait_for_your_turn: "Wait for your turn",
  sending: "Sending…",
  you: "(You)",
  player_n: "Player {n}",
  winner_seat: "Winner: Seat {n}",
  winner_name: "Winner: {name}",
  could_not_load_the_room: "Could not load the room",
  could_not_load_board: "Couldn't load the board — try refreshing",
  illegal_move: "Illegal move",
  pick_piece_then_target: "Pick a piece, then a target square",
  pick_piece_then_target_short: "Pick a piece, then a target",
  check: "Check!",
  continue_capturing: "Continue capturing…",
  game_in_progress: "Game in progress",
  waiting_for_players: "Waiting for players",
  leave_game: "Leave game",
  leave_table: "Leave table",
  white: "White",
  black: "Black",
};

const mpChromeId = {
  back: "Kembali",
  leave: "Keluar",
  leaving: "Keluar…",
  how_to_play: "Cara bermain",
  close: "Tutup",
  help: "Bantuan",
  waiting_for_a_player: "Menunggu pemain…",
  waiting_for_another_player: "Menunggu pemain lain…",
  loading: "Memuat…",
  loading_game_state: "Memuat status gim…",
  you_won: "Kamu menang!",
  draw: "Seri",
  game_over: "Gim selesai",
  wait_for_your_turn: "Tunggu giliranmu",
  sending: "Mengirim…",
  you: "(Kamu)",
  player_n: "Pemain {n}",
  winner_seat: "Pemenang: Kursi {n}",
  winner_name: "Pemenang: {name}",
  could_not_load_the_room: "Tidak bisa memuat ruangan",
  could_not_load_board: "Tidak bisa memuat papan — coba muat ulang",
  illegal_move: "Langkah tidak sah",
  pick_piece_then_target: "Pilih buah, lalu kotak tujuan",
  pick_piece_then_target_short: "Pilih buah, lalu tujuan",
  check: "Skak!",
  continue_capturing: "Lanjutkan makan…",
  game_in_progress: "Gim sedang berlangsung",
  waiting_for_players: "Menunggu pemain",
  leave_game: "Keluar dari gim",
  leave_table: "Tinggalkan meja",
  white: "Putih",
  black: "Hitam",
};

const mpSlugs = [
  "components__arcade__chess__ChessScreen",
  "components__arcade__checkers__CheckersScreen",
  "components__arcade__dominoes__DominoesScreen",
  "components__arcade__placeholder__ArcadePlaceholderScreen",
  "components__arcade__bingo__ArcadeBingoScreen",
];

for (const [slug, { en, id }] of Object.entries(packs)) {
  writeLeaf("en", slug, en, "merge");
  writeLeaf("id-ID", slug, id, "merge");
}

for (const slug of mpSlugs) {
  writeLeaf("en", slug, mpChromeEn, "merge");
  writeLeaf("id-ID", slug, mpChromeId, "merge");
}

// Chess title + two-player blurb + unfinished EN rule leaf
writeLeaf(
  "en",
  "components__arcade__chess__ChessScreen",
  {
    chess: "Chess",
    chess_two_players: "Chess — two players",
  },
  "merge",
);
writeLeaf(
  "id-ID",
  "components__arcade__chess__ChessScreen",
  {
    chess: "Catur",
    chess_two_players: "Catur — dua pemain",
    white_first_seat_in_the_list_goes_first: "Putih (kursi pertama di daftar) jalan duluan.",
  },
  "merge",
);

writeLeaf(
  "en",
  "components__arcade__checkers__CheckersScreen",
  {
    checkers: "Checkers",
    checkers_two_players: "Checkers — two players",
  },
  "merge",
);
writeLeaf(
  "id-ID",
  "components__arcade__checkers__CheckersScreen",
  {
    checkers: "Dam",
    checkers_two_players: "Dam — dua pemain",
  },
  "merge",
);

writeLeaf(
  "en",
  "components__arcade__dominoes__DominoesScreen",
  {
    dominoes: "Dominoes",
    dominoes_players: "Dominoes — players",
    draw_blocked: "Draw (blocked)",
    you_lost_won: "You lost — {name} won",
    pass: "Pass",
    my_hand: "My hand",
    chain: "Chain",
  },
  "merge",
);
writeLeaf(
  "id-ID",
  "components__arcade__dominoes__DominoesScreen",
  {
    dominoes: "Domino",
    dominoes_players: "Domino — pemain",
    draw_blocked: "Seri (macet)",
    you_lost_won: "Kamu kalah — {name} menang",
    pass: "Lewat",
    my_hand: "Kartu saya",
    chain: "Rantai",
  },
  "merge",
);

writeLeaf(
  "en",
  "components__arcade__bingo__ArcadeBingoScreen",
  {
    waiting_for_all_to_stake: "Waiting for all players to stake",
    waiting_for_host_start: "Waiting for the host to start Bingo",
    waiting_for_caller: "Waiting for the caller to draw a number.",
    join_bingo_from_rooms: "Join a Bingo room from shared rooms to play live.",
  },
  "merge",
);
writeLeaf(
  "id-ID",
  "components__arcade__bingo__ArcadeBingoScreen",
  {
    waiting_for_all_to_stake: "Menunggu semua pemain memasang taruhan",
    waiting_for_host_start: "Menunggu host memulai Bingo",
    waiting_for_caller: "Menunggu pemanggil mengeluarkan angka.",
    join_bingo_from_rooms: "Gabung ruangan Bingo dari ruangan bersama untuk main langsung.",
  },
  "merge",
);

writeLeaf(
  "en",
  "components__arcade__bingo__Ov2BingoFinishModal",
  {
    close: "Close",
    leave_table: "Leave table",
    leaving: "Leaving…",
  },
  "merge",
);
writeLeaf(
  "id-ID",
  "components__arcade__bingo__Ov2BingoFinishModal",
  {
    close: "Tutup",
    leave_table: "Tinggalkan meja",
    leaving: "Keluar…",
  },
  "merge",
);

const enN = rebuildIndex("en");
const idN = rebuildIndex("id-ID");
console.log(JSON.stringify({ enPacks: enN, idPacks: idN }, null, 2));
