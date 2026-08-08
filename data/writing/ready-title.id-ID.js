/**
 * Indonesian (id-ID) ready writing catalog title chrome.
 * Letter/number identities and ranges stay as in EN (A–Z, 0–20, etc.).
 *
 * MAIN must wire into `ready-title.locale.js` (do not wire here).
 *
 * @module data/writing/ready-title.id-ID
 */

import { PACK_TITLE_ID_ID } from "./word-packs.id-ID.js";

/** Exact EN catalog titles → Indonesian. */
export const READY_TITLE_EXACT_ID_ID = Object.freeze({
  "Group A–E": "Kelompok A–E",
  "Group F–J": "Kelompok F–J",
  "Group K–O": "Kelompok K–O",
  "Group P–T": "Kelompok P–T",
  "Group U–Z": "Kelompok U–Z",
  "A–Z uppercase": "A–Z huruf besar",
  "a–z lowercase": "a–z huruf kecil",
  "Aa–Zz pairs": "Pasangan Aa–Zz",
  "Similar letters": "Huruf mirip",
  "Straight letters": "Huruf lurus",
  "Rounded letters": "Huruf lengkung",
  "Varied practice": "Latihan bercampur",
  "Letter + word": "Huruf + kata",
  "Letter review": "Ulangan huruf",
  "Horizontal lines": "Garis mendatar",
  "Vertical lines": "Garis tegak",
  "Diagonal lines": "Garis miring",
  Bridges: "Jembatan",
  Waves: "Gelombang",
  Peaks: "Puncak",
  Circles: "Lingkaran",
  Loops: "Lengkungan berulang",
  Curves: "Lengkung",
  Spirals: "Spiral",
  Zigzag: "Zigzag",
  Valleys: "Lembah",
  Mountains: "Gunung",
  Tunnels: "Terowongan",
  "Line combinations": "Gabungan garis",
  "Mixed shapes": "Bentuk campuran",
  "Alphabet introduction A–E": "Pengenalan alfabet A–E",
  "Numbers 1–10": "Angka 1–10",
  "Numbers 0–5": "Angka 0–5",
  "Numbers 1–5": "Angka 1–5",
  "Numbers 0–9": "Angka 0–9",
  "Numbers 0–10": "Angka 0–10",
  "Numbers 11–20": "Angka 11–20",
  "Numbers 1–20": "Angka 1–20",
  "Even numbers": "Angka genap",
  "Odd numbers": "Angka ganjil",
  Tens: "Puluhan",
  "Before and after": "Sebelum dan sesudah",
  "Number order": "Urutan angka",
  "Quantity matching": "Mencocokkan jumlah",
  "Review — numbers": "Ulangan — angka",
  "Pre-writing starter": "Awal pra-menulis",
});

/** EN tens label → Indonesian (for “Ten — tens” patterns). */
export const READY_TITLE_TENS_ID_ID = Object.freeze({
  Ten: "Sepuluh",
  Twenty: "Dua puluh",
  Thirty: "Tiga puluh",
  Forty: "Empat puluh",
  Fifty: "Lima puluh",
  Sixty: "Enam puluh",
  Seventy: "Tujuh puluh",
  Eighty: "Delapan puluh",
  Ninety: "Sembilan puluh",
  "One hundred": "Seratus",
});

/** EN pack title (as used in “Words — …”) → Indonesian pack title. */
export const READY_TITLE_PACK_ALIASES_ID_ID = Object.freeze({
  Colors: PACK_TITLE_ID_ID.colors,
  Animals: PACK_TITLE_ID_ID.animals,
  Family: PACK_TITLE_ID_ID.family,
  Food: PACK_TITLE_ID_ID.food,
  School: PACK_TITLE_ID_ID.school,
  Body: PACK_TITLE_ID_ID.body,
  Home: PACK_TITLE_ID_ID.home,
  Nature: PACK_TITLE_ID_ID.nature,
  Transport: PACK_TITLE_ID_ID.transport,
  Numbers: PACK_TITLE_ID_ID.numbers,
  CVC: PACK_TITLE_ID_ID.cvc,
  "CVC words": PACK_TITLE_ID_ID.cvc,
  "Sight words": PACK_TITLE_ID_ID.sight,
});

/**
 * Resolve an English ready-writing catalog title to Indonesian chrome.
 * Preserves letter/number identities inside patterns.
 *
 * @param {string} titleEn
 * @returns {string}
 */
export function resolveReadyWritingTitleIdId(titleEn) {
  const title = String(titleEn || "").trim();
  if (!title) return title;

  if (READY_TITLE_EXACT_ID_ID[title]) return READY_TITLE_EXACT_ID_ID[title];

  let m = title.match(/^Trace\s*[—\-–]\s*(.+)$/i);
  if (m) return `Telusuri — ${m[1]}`;

  m = title.match(/^Number\s+(\d+)$/i);
  if (m) return `Angka ${m[1]}`;

  m = title.match(/^(.+?)\s*[—\-–]\s*tens$/i);
  if (m && READY_TITLE_TENS_ID_ID[m[1]]) {
    return `${READY_TITLE_TENS_ID_ID[m[1]]} — puluhan`;
  }

  m = title.match(/^Words\s*[—\-–]\s*(.+?)\s*\((.+)\)$/i);
  if (m) {
    const packTitleEn = m[1].trim();
    const packTitle = READY_TITLE_PACK_ALIASES_ID_ID[packTitleEn] || packTitleEn;
    const action = String(m[2] || "")
      .replace(/Trace\s*&\s*copy/i, "Telusuri & salin")
      .replace(/Trace/i, "Telusuri")
      .replace(/Copy/i, "Salin")
      .replace(/Review/i, "Ulangan");
    return `Kata — ${packTitle} (${action})`;
  }

  return title;
}
