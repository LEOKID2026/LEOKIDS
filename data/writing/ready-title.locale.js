/**
 * Locale-aware ready writing catalog titles (chrome only).
 * Letter/number identities and ranges stay as in EN.
 */

import { resolveWritingWordPacks } from "./word-packs.locale.js";

/** @type {Record<string, string>} */
const EXACT_ES_419 = Object.freeze({
  "Group A–E": "Grupo A–E",
  "Group F–J": "Grupo F–J",
  "Group K–O": "Grupo K–O",
  "Group P–T": "Grupo P–T",
  "Group U–Z": "Grupo U–Z",
  "A–Z uppercase": "A–Z mayúsculas",
  "a–z lowercase": "a–z minúsculas",
  "Aa–Zz pairs": "Pares Aa–Zz",
  "Similar letters": "Letras parecidas",
  "Straight letters": "Letras rectas",
  "Rounded letters": "Letras redondas",
  "Varied practice": "Práctica variada",
  "Letter + word": "Letra + palabra",
  "Letter review": "Repaso de letras",
  "Horizontal lines": "Líneas horizontales",
  "Vertical lines": "Líneas verticales",
  "Diagonal lines": "Líneas diagonales",
  Bridges: "Puentes",
  Waves: "Ondas",
  Peaks: "Picos",
  Circles: "Círculos",
  Loops: "Lazos",
  Curves: "Curvas",
  Spirals: "Espirales",
  Zigzag: "Zigzag",
  Valleys: "Valles",
  Mountains: "Montañas",
  Tunnels: "Túneles",
  "Line combinations": "Combinaciones de líneas",
  "Mixed shapes": "Formas mixtas",
  "Alphabet introduction A–E": "Introducción al alfabeto A–E",
  "Numbers 1–10": "Números 1–10",
  "Numbers 0–5": "Números 0–5",
  "Numbers 1–5": "Números 1–5",
  "Numbers 0–9": "Números 0–9",
  "Numbers 0–10": "Números 0–10",
  "Numbers 11–20": "Números 11–20",
  "Numbers 1–20": "Números 1–20",
  "Even numbers": "Números pares",
  "Odd numbers": "Números impares",
  Tens: "Decenas",
  "Before and after": "Antes y después",
  "Number order": "Orden de números",
  "Quantity matching": "Emparejar cantidades",
  "Review — numbers": "Repaso — números",
  "Pre-writing starter": "Inicio de preescritura",
});

/** @type {Record<string, string>} */
const TENS_ES_419 = Object.freeze({
  Ten: "Diez",
  Twenty: "Veinte",
  Thirty: "Treinta",
  Forty: "Cuarenta",
  Fifty: "Cincuenta",
  Sixty: "Sesenta",
  Seventy: "Setenta",
  Eighty: "Ochenta",
  Ninety: "Noventa",
  "One hundred": "Cien",
});

/**
 * @param {unknown} locale
 */
function isEs419(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "es" || tag.startsWith("es-") || tag === "es419";
}

/**
 * @param {string} titleEn
 * @param {string|null|undefined} [contentLocale]
 * @returns {string}
 */
export function resolveReadyWritingTitle(titleEn, contentLocale) {
  const title = String(titleEn || "").trim();
  if (!title || !isEs419(contentLocale)) return title;

  if (EXACT_ES_419[title]) return EXACT_ES_419[title];

  let m = title.match(/^Trace\s*[—\-–]\s*(.+)$/i);
  if (m) return `Traza — ${m[1]}`;

  m = title.match(/^Number\s+(\d+)$/i);
  if (m) return `Número ${m[1]}`;

  m = title.match(/^(.+?)\s*[—\-–]\s*tens$/i);
  if (m && TENS_ES_419[m[1]]) return `${TENS_ES_419[m[1]]} — decenas`;

  m = title.match(/^Words\s*[—\-–]\s*(.+?)\s*\((.+)\)$/i);
  if (m) {
    const packs = resolveWritingWordPacks(contentLocale);
    const packTitleEn = m[1].trim();
    let packTitle = packTitleEn;
    for (const pack of Object.values(packs)) {
      if (pack.titleEn === packTitleEn || pack.title === packTitleEn) {
        packTitle = pack.title;
        break;
      }
    }
    // CVC pack EN title is "CVC words" but catalog uses "CVC".
    if (packTitleEn === "CVC" && packs.cvc?.title) packTitle = packs.cvc.title;
    if (packTitleEn === "Sight words" && packs.sight?.title) packTitle = packs.sight.title;
    const action = String(m[2] || "")
      .replace(/Trace\s*&\s*copy/i, "Traza y copia")
      .replace(/Trace/i, "Traza")
      .replace(/Copy/i, "Copia")
      .replace(/Review/i, "Repaso");
    return `Palabras — ${packTitle} (${action})`;
  }

  return title;
}
