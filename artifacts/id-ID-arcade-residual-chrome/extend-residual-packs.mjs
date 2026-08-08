/**
 * Extend packs for remaining multiplayer/EmoteBar chrome residuals.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function writeLeaf(locale, slug, copy) {
  const dir = path.join(ROOT, "content-packs", locale, "games", "burn-down");
  const file = path.join(dir, `${slug}.json`);
  const raw = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { copy: {} };
  raw.copy = { ...(raw.copy || {}), ...copy };
  fs.writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
}

function rebuild(locale) {
  const leafDir = path.join(ROOT, "content-packs", locale, "games", "burn-down");
  const indexPath = path.join(ROOT, "content-packs", locale, "games", "burn-down-index.json");
  const index = {};
  for (const name of fs.readdirSync(leafDir)) {
    if (!name.endsWith(".json") || name === "burn-down-index.json") continue;
    const slug = name.slice(0, -".json".length);
    const raw = JSON.parse(fs.readFileSync(path.join(leafDir, name), "utf8"));
    if (raw?.copy) index[slug] = raw.copy;
  }
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

const emote = {
  en: { message: "😊 Message" },
  id: { message: "😊 Pesan" },
};

const dominoesExtra = {
  en: {
    no_legal_move_pass: "No legal move — pass",
    left_end: "Left end",
    right_end: "Right end",
    choose_end: "Choose which end to play",
    coin_settlement: "Coin settlement",
    session_ended: "Session ended",
  },
  id: {
    no_legal_move_pass: "Tidak ada langkah sah — lewat",
    left_end: "Ujung kiri",
    right_end: "Ujung kanan",
    choose_end: "Pilih ujung mana yang dimainkan",
    coin_settlement: "Penyelesaian koin",
    session_ended: "Sesi berakhir",
  },
};

const placeholderExtra = {
  en: {
    arcade_build_active: "Arcade build — active room connection; full game rules come next.",
    player_seat: "{name} - Seat {seat}",
    player: "Player",
  },
  id: {
    arcade_build_active: "Build arkade — koneksi ruangan aktif; aturan gim lengkap segera hadir.",
    player_seat: "{name} - Kursi {seat}",
    player: "Pemain",
  },
};

const bingoExtra = {
  en: {
    network_error: "Network error",
    rematch_request_failed: "Rematch request failed",
    could_not_cancel_rematch: "Could not cancel rematch",
    could_not_start_next_game: "Could not start the next game",
    sit_in_lobby_seat: "Sit in a lobby seat to see your card for this round.",
    finished: "Finished",
    game: "Game",
    ready: "Ready",
    waiting: "Waiting",
    open: "Open",
    empty: "Empty",
    player: "Player",
    last: "Last",
    next: "Next",
    deck: "Deck",
    last_called: "Last called",
    phase: "Phase",
    bingo_live_game: "Bingo · live game",
    bingo_room: "Bingo · room",
    bingo: "Bingo",
    row_n: "Row {n}",
    full: "Full",
    already_claimed: "Already claimed",
    try_again: "Try again",
  },
  id: {
    network_error: "Kesalahan jaringan",
    rematch_request_failed: "Permintaan main lagi gagal",
    could_not_cancel_rematch: "Tidak bisa membatalkan main lagi",
    could_not_start_next_game: "Tidak bisa memulai gim berikutnya",
    sit_in_lobby_seat: "Duduk di kursi lobi untuk melihat kartumu di ronde ini.",
    finished: "Selesai",
    game: "Gim",
    ready: "Siap",
    waiting: "Menunggu",
    open: "Terbuka",
    empty: "Kosong",
    player: "Pemain",
    last: "Terakhir",
    next: "Berikutnya",
    deck: "Dek",
    last_called: "Terakhir dipanggil",
    phase: "Fase",
    bingo_live_game: "Bingo · gim langsung",
    bingo_room: "Bingo · ruangan",
    bingo: "Bingo",
    row_n: "Baris {n}",
    full: "Penuh",
    already_claimed: "Sudah diklaim",
    try_again: "Coba lagi",
  },
};

const finishExtra = {
  en: {
    victory: "Victory",
    round_over: "Round over",
    game_has_ended: "The game has ended",
    last_one_standing: "Last one standing — {name}",
    winner: "Winner",
    sending_results: "Sending results to your balance…",
    round_over_rematch_hint: "Round over — request a rematch, then the host starts the next one.",
    player: "Player",
    sending_request: "Sending request…",
    request_rematch: "Request rematch",
    only_host_can_start: "Only the host can start the next game",
    starting: "Starting…",
    start_next_host: "Start next (host)",
  },
  id: {
    victory: "Kemenangan",
    round_over: "Ronde selesai",
    game_has_ended: "Gim telah berakhir",
    last_one_standing: "Pemain terakhir yang bertahan — {name}",
    winner: "Pemenang",
    sending_results: "Mengirim hasil ke saldo kamu…",
    round_over_rematch_hint: "Ronde selesai — minta main lagi, lalu host memulai yang berikutnya.",
    player: "Pemain",
    sending_request: "Mengirim permintaan…",
    request_rematch: "Minta main lagi",
    only_host_can_start: "Hanya host yang bisa memulai gim berikutnya",
    starting: "Memulai…",
    start_next_host: "Mulai berikutnya (host)",
  },
};

writeLeaf("en", "components__arcade__club__EmoteBar", emote.en);
writeLeaf("id-ID", "components__arcade__club__EmoteBar", emote.id);
writeLeaf("en", "components__arcade__dominoes__DominoesScreen", dominoesExtra.en);
writeLeaf("id-ID", "components__arcade__dominoes__DominoesScreen", dominoesExtra.id);
writeLeaf("en", "components__arcade__placeholder__ArcadePlaceholderScreen", placeholderExtra.en);
writeLeaf("id-ID", "components__arcade__placeholder__ArcadePlaceholderScreen", placeholderExtra.id);
writeLeaf("en", "components__arcade__bingo__ArcadeBingoScreen", bingoExtra.en);
writeLeaf("id-ID", "components__arcade__bingo__ArcadeBingoScreen", bingoExtra.id);
writeLeaf("en", "components__arcade__bingo__Ov2BingoFinishModal", finishExtra.en);
writeLeaf("id-ID", "components__arcade__bingo__Ov2BingoFinishModal", finishExtra.id);

rebuild("en");
rebuild("id-ID");
console.log("extended packs ok");
