import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

function writeLeaf(locale, slug, copy) {
  const file = path.join(ROOT, "content-packs", locale, "games", "burn-down", `${slug}.json`);
  const raw = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { copy: {} };
  raw.copy = { ...(raw.copy || {}), ...copy };
  fs.writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`);
}

function rebuild(locale) {
  const leafDir = path.join(ROOT, "content-packs", locale, "games", "burn-down");
  const index = {};
  for (const name of fs.readdirSync(leafDir)) {
    if (!name.endsWith(".json") || name === "burn-down-index.json") continue;
    const slug = name.slice(0, -5);
    const raw = JSON.parse(fs.readFileSync(path.join(leafDir, name), "utf8"));
    if (raw?.copy) index[slug] = raw.copy;
  }
  fs.writeFileSync(
    path.join(ROOT, "content-packs", locale, "games", "burn-down-index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
  );
}

const packs = {
  components__arcade__dominoes__DominoesScreen: {
    en: {
      first_tile_goes_here: "The first tile goes here",
      open_ends: "Open ends: {left} · {right}",
    },
    id: {
      first_tile_goes_here: "Ubin pertama ditaruh di sini",
      open_ends: "Ujung terbuka: {left} · {right}",
    },
  },
  components__arcade__placeholder__ArcadePlaceholderScreen: {
    en: {
      when_room_fills: "When the room fills, the game state opens",
      session_ended: "Session ended",
      session_id: "Session id: {id}…",
      players_in_room: "Players in room",
    },
    id: {
      when_room_fills: "Saat ruangan penuh, status gim akan terbuka",
      session_ended: "Sesi berakhir",
      session_id: "Id sesi: {id}…",
      players_in_room: "Pemain di ruangan",
    },
  },
  components__arcade__bingo__ArcadeBingoScreen: {
    en: {
      missing_room_id: "Missing room id",
      status: "Status",
      reset: "Reset",
      your_card: "Your card",
      called_numbers: "Called numbers",
      claim_prize: "Claim prize",
      won_seat: "Won · Seat {seat}{namePart}",
      claim_label: "Claim {label}",
      name_part: " · {name}",
    },
    id: {
      missing_room_id: "Id ruangan hilang",
      status: "Status",
      reset: "Atur ulang",
      your_card: "Kartu kamu",
      called_numbers: "Angka yang dipanggil",
      claim_prize: "Klaim hadiah",
      won_seat: "Menang · Kursi {seat}{namePart}",
      claim_label: "Klaim {label}",
      name_part: " · {name}",
    },
  },
  components__arcade__bingo__Ov2BingoFinishModal: {
    en: {
      round_result: "Round result",
      table_multiplier: "Table multiplier",
      payout: "Payout",
      prizes_claimed: "Prizes claimed",
      unclaimed: "Unclaimed",
      host_only: "Host only",
      host_starts_when_all_request: "The host starts a new game when all seated players request a rematch.",
      coins_amount: "+{amount} coins",
      coins_prizes: "+{amount} coins (prizes)",
      coins_plain: "{amount} coins",
    },
    id: {
      round_result: "Hasil ronde",
      table_multiplier: "Pengali meja",
      payout: "Pembayaran",
      prizes_claimed: "Hadiah diklaim",
      unclaimed: "Belum diklaim",
      host_only: "Hanya host",
      host_starts_when_all_request: "Host memulai gim baru saat semua pemain yang duduk meminta main lagi.",
      coins_amount: "+{amount} koin",
      coins_prizes: "+{amount} koin (hadiah)",
      coins_plain: "{amount} koin",
    },
  },
};

for (const [slug, { en, id }] of Object.entries(packs)) {
  writeLeaf("en", slug, en);
  writeLeaf("id-ID", slug, id);
}
rebuild("en");
rebuild("id-ID");
console.log("final residual packs ok");
