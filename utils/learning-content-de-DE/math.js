/**
 * German (Germany) (de-DE) rebuilders for math question stems.
 * English is the authority; params/numbers/operators unchanged.
 * Currency: Euro (€), not dollars. Decimal display uses a comma (Komma), e.g. 3,5.
 * Mirrors utils/learning-content-pt-PT/math.js structurally; German child-facing du-form copy.
 */
import { BLANK } from "../math-constants.js";
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

const WEEKDAYS_DE = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

const OBJECTS_DE = Object.freeze({
  items: "Dinge",
  apples: "Äpfel",
  balls: "Bälle",
  stickers: "Sticker",
  books: "Bücher",
  pencils: "Stifte",
  chairs: "Stühle",
  cards: "Karten",
  boxes: "Kisten",
  coins: "Münzen",
});
const YES_NO = Object.freeze({ Yes: "Ja", No: "Nein", yes: "ja", no: "nein" });
const PRIME_COMPOSITE = Object.freeze({
  prime: "Primzahl",
  composite: "zusammengesetzt",
  Prime: "Primzahl",
  Composite: "Zusammengesetzt",
});
const PARITY = Object.freeze({ even: "gerade", odd: "ungerade", Even: "Gerade", Odd: "Ungerade" });
const MATH_PHRASES = [];

function applyMathPhrases(text) {
  let out = String(text ?? "");
  for (const [from, to] of MATH_PHRASES) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

/** Format a number with a German decimal comma for display purposes only (value unchanged). */
function deComma(value, places) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  const fixed = places != null ? n.toFixed(places) : String(n);
  return fixed.replace(".", ",");
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
export function rebuildMathStemDeDe(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");
  const gradeKey = String(question?.gradeKey || p.gradeKey || "g3");

  if (kind === "mul_groups_g1") {
    const objects = OBJECTS_DE[p.objects] || String(p.objects || "Dinge");
    return `Es gibt ${p.groups} Gruppen. Jede Gruppe hat ${p.perGroup} ${objects}. Wie viele ${objects} gibt es insgesamt?`;
  }
  if (kind === "mul_skip_count_g1") {
    const seq = Array.isArray(p.seq) ? p.seq : [];
    const head = seq.slice(0, -1).join(", ");
    return `Zähle in Schritten von ${p.perGroup}: ${head}, ${BLANK}`;
  }
  if (kind === "ns_number_line" || kind === "ns_number_line_g1") {
    const nums = Array.isArray(p.numbers) ? p.numbers : [];
    const line = nums.map((n) => (n === BLANK || n === "__" ? BLANK : n)).join(" - ");
    return `Fülle die fehlende Zahl auf dem Zahlenstrahl ein: ${line}`;
  }
  if (kind === "ns_even_odd" || kind === "ns_parity") {
    return `Ist ${p.n ?? p.num} eine gerade Zahl?`;
  }
  if (kind === "frac_half" || kind === "frac_half_reverse") {
    if (kind === "frac_half_reverse" && p.whole != null) {
      return `Die Hälfte von ${BLANK} ist ${p.whole / 2}. Wie heißt die ganze Zahl?`;
    }
    return `Wie viel ist die Hälfte von ${p.whole ?? p.n}?`;
  }
  if (kind === "frac_quarter" || kind === "frac_quarter_reverse") {
    if (kind === "frac_quarter_reverse" && p.whole != null) {
      return `Ein Viertel von ${BLANK} ist ${p.whole / 4}. Wie heißt die ganze Zahl?`;
    }
    return `Wie viel ist ein Viertel von ${p.whole ?? p.n}?`;
  }
  if (
    kind === "frac_compare_like_den_g4" ||
    kind === "frac_compare_like_den_g3" ||
    kind === "frac_compare_same_den"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      return `Welcher Bruch ist größer — ${p.n1}/${p.den} oder ${p.n2}/${p.den}? Schreibe den größeren Bruch: ${BLANK}`;
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
      return `Kürze den Bruch ${p.num}/${p.den}: ${BLANK}`;
    }
  }
  if (kind === "frac_equivalent_expand" || kind === "frac_equivalent") {
    if (p.num != null && p.den != null && p.factor != null) {
      return `Finde einen gleichwertigen Bruch zu ${p.num}/${p.den} (multipliziere mit ${p.factor}): ${BLANK}`;
    }
  }
  if (kind === "wp_simple_add" || kind === "wp_simple_add_g2") {
    if (kind === "wp_simple_add_g2") {
      return `In der Klasse waren ${p.a} Kinder, und ${p.b} weitere kamen dazu. Wie viele Kinder sind jetzt da?`;
    }
    return `Leo hat ${p.a} Bälle und bekommt ${p.b} weitere dazu. Wie viele Bälle hat Leo insgesamt?`;
  }
  if (kind === "wp_simple_sub" || kind === "wp_simple_sub_g2") {
    if (kind === "wp_simple_sub_g2") {
      return `In einem Korb sind ${p.total} Äpfel. ${p.give} wurden gegessen. Wie viele Äpfel sind noch übrig?`;
    }
    return `Leo hat ${p.total} Sticker. Er gibt ${p.give} an einen Freund. Wie viele Sticker hat Leo noch?`;
  }
  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `Emma hat ${p.money} Euro. Sie kauft einen Snack für ${p.toy} Euro. Wie viel Geld bleibt übrig?`;
  }
  if (kind === "wp_groups_g2") {
    return `In jeder Reihe stehen ${p.per} Stühle. Es gibt ${p.groups} solche Reihen. Wie viele Stühle gibt es insgesamt?`;
  }
  if (kind === "wp_groups_g3") {
    return `In jeder Kiste sind ${p.per} Stifte. Es gibt ${p.groups} Kisten. Wie viele Stifte gibt es insgesamt?`;
  }
  if (kind === "wp_groups_g4") {
    return `In jedem Regal stehen ${p.per} Bücher. Es gibt ${p.groups} Regale. Wie viele Bücher gibt es insgesamt?`;
  }
  if (kind === "wp_groups_late_g6") {
    return `In jedem Container sind ${p.per} Teile. Es wurden ${p.groups} Container geliefert. Wie viele Teile sind es insgesamt?`;
  }
  if (kind === "wp_groups" || kind === "wp_groups_late") {
    return `In jeder Vorratskiste sind ${p.per} Pakete. Es wurden ${p.groups} Kisten geliefert. Wie viele Pakete sind es insgesamt?`;
  }
  if (kind === "wp_comparison_more") {
    return `Noa hat ${p.big} Karten und Yuval hat ${p.small} Karten. Wie viele Karten mehr hat Noa als Yuval?`;
  }
  if (kind === "wp_part_whole_g4") {
    return `Ein Saal hat ${p.whole} Sitzplätze. ${p.partA} werden für eine Show genutzt, der Rest bleibt leer. Wie viele Sitzplätze bleiben leer?`;
  }
  if (kind === "wp_part_whole") {
    return `Eine Klasse hat ${p.whole} Schüler. ${p.partA} sind im Fußballverein, der Rest ist im Schachverein. Wie viele Schüler sind im Schachverein?`;
  }
  if (kind === "wp_change_stack_g4") {
    return `Ein Lager hatte ${p.start} Kisten. ${p.gain} neue Kisten kamen hinzu, und ${p.loss} wurden an eine andere Filiale geschickt. Wie viele Kisten bleiben übrig?`;
  }
  if (kind === "wp_change_stack") {
    return `Eine Bibliothek hatte ${p.start} Bücher. ${p.gain} neue Bücher kamen hinzu, und ${p.loss} wurden ausgeliehen. Wie viele Bücher sind jetzt in der Bibliothek?`;
  }
  if (kind === "wp_time_days") {
    const start = WEEKDAYS_DE[p.startDayIdx] || "Montag";
    const end = WEEKDAYS_DE[p.endDayIdx] || "Freitag";
    return `Wenn heute ${start} ist, wie viele Tage sind es noch bis ${end}?`;
  }
  if (kind === "wp_time_date") {
    return `Wenn heute der ${p.today}. des Monats ist, welches Datum ist es in ${p.daysLater} Tagen?`;
  }
  if (kind === "wp_coins") {
    return `Leo hat ${p.coins1} 1-Euro-Münzen und ${p.coins2} 2-Euro-Münzen. Wie viel Geld hat er insgesamt?`;
  }
  if (kind === "wp_coins_spent") {
    return `Leo hat ${p.total} € in Münzen. Er kauft Süßigkeiten für ${p.spent} €. Wie viel Geld bleibt übrig?`;
  }
  if (kind === "wp_division_simple") {
    return `Es gibt ${p.total} Äpfel, die in Gruppen von je ${p.perGroup} Äpfeln aufgeteilt werden. Wie viele Gruppen gibt es?`;
  }
  if (kind === "wp_leftover") {
    return `${p.total} Schüler werden in Gruppen von je ${p.groupSize} aufgeteilt. Wie viele Schüler bleiben ohne vollständige Gruppe übrig?`;
  }
  if (kind === "wp_shop_discount") {
    return `Ein Hemd kostet ${p.price} € mit ${p.discPerc}% Rabatt. Wie viel bezahlst du nach dem Rabatt?`;
  }
  if (kind === "wp_unit_cm_to_m") {
    return `Wie viele Meter entsprechen ${p.cm} Zentimetern? = ${BLANK}`;
  }
  if (kind === "wp_unit_g_to_kg") {
    return `Wie viele Kilogramm entsprechen ${p.g} Gramm? = ${BLANK}`;
  }
  if (kind === "wp_distance_time") {
    return `Ein Kind geht mit einer konstanten Geschwindigkeit von ${p.speed} km/h für ${p.hours} Stunden. Wie viele Kilometer legt es zurück?`;
  }
  if (kind === "wp_time_sum") {
    return `Ein Videoclip dauert ${p.l1} Minuten und ein anderer ${p.l2} Minuten. Wie viele Minuten dauern beide Clips zusammen?`;
  }
  if (kind === "wp_average" || kind === "wp_average_g6") {
    if (kind === "wp_average_g6") {
      return `Ein Gruppenprojekt erzielte in drei Etappen die Punktzahlen ${p.s1}, ${p.s2} und ${p.s3}. Wie hoch ist der Durchschnitt (auf eine ganze Zahl gerundet)?`;
    }
    return `Leo erzielte bei drei Tests die Punktzahlen ${p.s1}, ${p.s2} und ${p.s3}. Wie hoch ist sein Durchschnitt (auf eine ganze Zahl gerundet)?`;
  }
  if (kind === "wp_multi_step" || kind === "wp_multi_step_g6") {
    return `Leo hat ${p.money} €. Er kauft ${p.a} Stifte und ${p.b} Bleistifte, und jeder Artikel kostet ${p.price} €. Wie viel Geld bleibt nach dem Einkauf übrig?`;
  }
  if (kind === "operation_choice_word_problem_probe") {
    return `Es gibt ${p.groups} Gruppen mit je ${p.each} Dingen. Welche Rechenart findet die Gesamtzahl?`;
  }

  if (kind.startsWith("wp_") || inferSelectedOp(question) === "word_problems") {
    return null;
  }

  return applyMathLevelPresentationDeDe(
    // Seed from authored stem or params.exerciseText so compare/round wrappers can attach.
    String(question?.question || question?.exerciseText || p.exerciseText || ""),
    {
      selectedOp: question?.operation || inferSelectedOp(question),
      params: p,
      mathLevelKey: inferMathLevelKey(question),
      gradeKey,
    }
  );
}

/** German display mirror of applyMathLevelPresentation (math-question-generator.js). */
export function applyMathLevelPresentationDeDe(question, ctx) {
  const q0 = String(question || "");
  if (!q0.trim()) return q0;
  const { selectedOp, params, mathLevelKey } = ctx;
  const kind = String(params?.kind || "");
  if (kind.startsWith("wp_") || selectedOp === "word_problems") return q0;

  if (kind === "ns_complement100") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 100;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Ergänze auf ${c}: Was musst du zu ${b} addieren, um ${c} zu erreichen? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Gegeben: ${b} + ${BLANK} = ${c}. Welche Zahl fehlt?`;
      }
      return `Textaufgabe: ${b} fehlt ein Teil, um ${c} zu erreichen — wie viel muss addiert werden? = ${BLANK}`;
    }
  }

  if (kind === "ns_complement10") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 10;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Auf ${c} ergänzen: Was addierst du zu ${b}, um bei ${c} zu enden? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Fehlende Zahl in der Gleichung: ${b} + ${BLANK} = ${c}`;
      }
      return `Ohne Spalte: Welche Addition zu ${c} beginnt mit ${b}? = ${BLANK}`;
    }
  }

  if (kind === "scale_find") {
    const ml = params?.mapLength;
    const rl = params?.realLength;
    if (ml != null && rl != null) {
      if (mathLevelKey === "easy") {
        return `Auf einer Karte ist eine Strecke ${ml} cm lang und in Wirklichkeit ${rl} cm. Ergänze den Maßstab als 1:${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Kartenlänge ${ml} cm, tatsächliche Länge ${rl} cm. Wie lautet der Maßstab? Schreibe die Zahl nach 1: = ${BLANK}`;
      }
      return `Karte ${ml} cm und real ${rl} cm — der Maßstab ist 1:__. Welche Zahl fehlt? = ${BLANK}`;
    }
  }

  if (kind === "scale_map_to_real") {
    const ml = params?.mapLength;
    const sc = params?.scale;
    if (ml != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `Im Maßstab 1:${sc}: Wie viele reale cm entsprechen ${ml} cm auf der Karte? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Maßstab 1:${sc}. Ein Kartenmaß von ${ml} cm — wie lang ist die reale Länge in cm? = ${BLANK}`;
      }
      return `Maßstab 1:${sc}, Kartenmaß ${ml} cm — finde die reale Länge in cm = ${BLANK}`;
    }
  }

  if (kind === "scale_real_to_map") {
    const rl = params?.realLength;
    const sc = params?.scale;
    if (rl != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `Im Maßstab 1:${sc}, reale Länge ${rl} cm — wie viele cm auf der Karte? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Reale Länge ${rl} cm, Maßstab 1:${sc}. Wie lang ist die Länge auf der Karte? = ${BLANK}`;
      }
      return `Real in Karte umrechnen: ${rl} cm real bei 1:${sc} — wie viele cm auf dem Papier? = ${BLANK}`;
    }
  }

  if (selectedOp === "compare" || kind === "cmp") {
    const raw = params?.exerciseText ? String(params.exerciseText) : "";
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 4;
    if (mathLevelKey === "easy") {
      const opts = [
        `Vergleiche die beiden Zahlen und ergänze (<, =, >): ${raw}`,
        `Vergleichszeichen zwischen den Zahlen: ${raw}`,
        `Wähle < , = oder > — vergleiche: ${raw}`,
        `Vergleiche die Werte und ergänze das Zeichen: ${raw}`];
      return opts[pv].trim();
    }
    if (mathLevelKey === "medium") {
      const opts = [
        `Ergänze das richtige Vergleichszeichen: ${raw}`,
        `Welches Zeichen vergleicht das Paar? ${raw}`,
        `Finde das passende Vergleichszeichen: ${raw}`,
        `Ergänze das Zeichen zwischen den Zahlenausdrücken: ${raw}`];
      return opts[pv].trim();
    }
    const opts = [
      `Ergänze das Vergleichszeichen — prüfe, bevor du wählst: ${raw}`,
      `Vergleiche sorgfältig und wähle ein Zeichen: ${raw}`,
      `Vergleiche genau und wähle ein Zeichen: ${raw}`,
      `Schnelle Prüfung: Welches Zeichen passt? ${raw}`];
    return opts[pv].trim();
  }

  if (selectedOp === "divisibility" || kind === "divisibility") {
    const num = params?.num;
    const div = params?.divisor;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (num != null && div != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Teilbarkeit: Ist ${num} ohne Rest durch ${div} teilbar?`
          : `Prüfe: Ist ${num} ein Vielfaches von ${div} (ohne Rest)?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Teilbarkeitsregeln — Ist ${num} durch ${div} teilbar?`
          : `Ganzzahlige Division: ${num} ÷ ${div} — ist das Ergebnis eine ganze Zahl?`;
      }
      return pv === 0
        ? `Teilbarkeitsprüfung: Ist ${num} durch ${div} teilbar?`
        : `Teiler: Teilt ${div} die Zahl ${num} genau?`;
    }
  }

  if (selectedOp === "prime_composite" || kind === "prime_composite") {
    const num = params?.num;
    const subKind = String(params?.subKind || "pc_classify");
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (subKind === "pc_factor_count" && num != null) {
      if (mathLevelKey === "easy") return `Primzahlen: Wie viele Teiler hat ${num}?`;
      if (mathLevelKey === "medium") {
        return `Teiler zählen: Wie viele natürliche Teiler hat ${num} (einschließlich 1 und sich selbst)?`;
      }
      return `Teiler: Wie viele verschiedene Teiler hat ${num}?`;
    }
    if (subKind === "pc_smallest_prime" && num != null) {
      if (mathLevelKey === "easy") return `Primfaktor: Was ist der kleinste Primfaktor von ${num}?`;
      if (mathLevelKey === "medium") return `Finde den kleinsten Primfaktor von ${num}.`;
      return `Faktoren: Was ist der kleinste Primfaktor von ${num}?`;
    }
    if (subKind === "pc_divisor_pick" && num != null && params?.divisorCandidate != null) {
      const d = params.divisorCandidate;
      if (mathLevelKey === "easy") return `Teilerprüfung: Teilt ${d} die Zahl ${num} ohne Rest?`;
      if (mathLevelKey === "medium") return `Teiler: Teilt ${d} die Zahl ${num}?`;
      return `Teiler: Teilt ${d} die Zahl ${num} genau?`;
    }
    if (num != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Primzahlen: Ist ${num} eine Primzahl oder zusammengesetzt?`
          : `Grundlegende Einordnung: ${num} — Primzahl oder zusammengesetzt?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Ordne die Zahl ein: ${num} — Primzahl oder zusammengesetzt?`
          : `Hat ${num} genau zwei verschiedene natürliche Teiler?`;
      }
      return pv === 0
        ? `Ist ${num} eine Primzahl oder zusammengesetzt? Denk nach, bevor du wählst.`
        : `Schnelltest: Lässt sich ${num} in zwei Faktoren größer als 1 aufteilen?`;
    }
  }

  if (selectedOp === "powers" && (kind === "power_base" || kind === "power_calc")) {
    if (kind === "power_calc") {
      if (mathLevelKey === "easy") return `Potenzen: ${q0}`;
      if (mathLevelKey === "medium") return `Berechne die Potenz — ${q0}`;
      return `Potenzen: ${q0}`;
    }
    if (kind === "power_base") {
      if (mathLevelKey === "easy") return `Finde die Basis der Potenz: ${q0}`;
      if (mathLevelKey === "medium") return `Potenz-Rätsel — ${q0}`;
      return `Fehlende Basis der Potenz: ${q0}`;
    }
  }

  if (selectedOp === "estimation") {
    if (kind === "est_add") {
      if (mathLevelKey === "easy") return q0.replace(/^Estimate\b/i, "Überschlagen durch Runden: schätze");
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
    if (mathLevelKey === "easy") return `Brüche: ${q0}`;
    if (mathLevelKey === "medium") return `Bruch als Teil eines Ganzen: ${q0}`;
    return `Brüche: ${q0}`;
  }

  if (kind === "fm_factor") {
    if (mathLevelKey === "easy") return `Teiler: ${q0}`;
    if (mathLevelKey === "medium") return `Finde einen Teiler: ${q0}`;
    return `Teiler und Vielfache: ${q0}`;
  }
  if (kind === "fm_multiple") {
    if (mathLevelKey === "easy") return `Vielfache: ${q0}`;
    if (mathLevelKey === "medium") return `Prüfe Vielfache: ${q0}`;
    return `Vielfache: ${q0}`;
  }

  if (selectedOp === "percentages" || selectedOp === "ratio" || selectedOp === "scale") return q0;

  if (kind === "fm_gcd" && params?.a != null && params?.b != null) {
    const { a, b } = params;
    if (mathLevelKey === "easy") {
      return `ggT: Was ist der größte gemeinsame Teiler von ${a} und ${b}? = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return `Größter gemeinsamer Teiler (ggT) von ${a} und ${b} — wie lautet er? = ${BLANK}`;
    }
    return `ggT: Denk zuerst nach - ggT(${a}, ${b}) = ${BLANK}`;
  }

  if (kind === "round" && params?.n != null && params?.toWhat != null) {
    const { n, toWhat } = params;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (toWhat === 10) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Auf Zehner runden: Auf welchen Zehner rundet ${n}? = ${BLANK}`
          : `Nächster Zehner: ${n} → ? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Runde ${n} auf den nächsten Zehner - Ergebnis? = ${BLANK}`
          : `Rundungsregel für Zehner: ${n} = ${BLANK}`;
      }
      return pv === 0
        ? `Auf Zehner runden: ${n} → ? = ${BLANK}`
        : `Richtige Zahl nach dem Runden von ${n} auf Zehner = ${BLANK}`;
    }
    if (mathLevelKey === "easy") {
      return pv === 0
        ? `Auf Hunderter runden: Auf welchen Hunderter rundet ${n}? = ${BLANK}`
        : `Nächster Hunderter: ${n} = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return pv === 0
        ? `Runde ${n} auf den nächsten Hunderter - Ergebnis? = ${BLANK}`
        : `Auf Hunderter runden: ${n} → ? = ${BLANK}`;
    }
    return pv === 0
      ? `Auf Hunderter runden: ${n} → ? = ${BLANK}`
      : `Zahl nach dem Runden von ${n} auf Hunderter = ${BLANK}`;
  }

  if (kind === "dec_add" || kind === "dec_sub") {
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    const a = params?.a;
    const b = params?.b;
    const pl = params?.places ?? 1;
    if (a != null && b != null) {
      const af = deComma(a, pl);
      const bf = deComma(b, pl);
      if (kind === "dec_add") {
        if (mathLevelKey === "easy") {
          return pv === 0
            ? `Addiere Dezimalzahlen: ${af} + ${bf} = ${BLANK}`
            : `Direkte Summe: ${af} + ${bf} = ${BLANK}`;
        }
        return `Addiere Dezimalzahlen: ${af} + ${bf} = ${BLANK}`;
      }
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Subtrahiere Dezimalzahlen: ${af} − ${bf} = ${BLANK}`
          : `Direkte Differenz: ${af} − ${bf} = ${BLANK}`;
      }
      return `Subtrahiere Dezimalzahlen: ${af} − ${bf} = ${BLANK}`;
    }
  }

  if (selectedOp === "sequences") {
    if (mathLevelKey === "easy") {
      return q0.replace(/^Continue the sequence\b/i, "Setze die Zahlenfolge fort");
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
  return field === "answers" || field === "options";
}

function localizeMathField(_field, value, question) {
  const text = String(value ?? "");
  if (!containsHebrew(text)) return text;

  if (YES_NO[text.trim()]) return YES_NO[text.trim()];
  if (PRIME_COMPOSITE[text.trim()]) return PRIME_COMPOSITE[text.trim()];
  if (PARITY[text.trim()]) return PARITY[text.trim()];

  const rebuilt = rebuildMathStemDeDe(question);
  if (rebuilt && !containsHebrew(rebuilt) && (_field === "question" || _field === "exerciseText" || _field === "questionLabel")) {
    return rebuilt;
  }

  const presented = applyMathLevelPresentationDeDe(text, {
    selectedOp: question?.operation || inferSelectedOp(question),
    params: question?.params || {},
    mathLevelKey: inferMathLevelKey(question),
    gradeKey: question?.gradeKey || "g3",
  });
  if (presented && !containsHebrew(presented)) return presented;

  const phrased = applyMathPhrases(text);
  if (!containsHebrew(phrased)) return phrased;

  const stripped = phrased
    .replace(/(\d+)\s+remainder\s+(\d+)/gu, "$1 Rest $2")
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

const OP_SYMBOL_DE = Object.freeze({
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
  const rebuilt = rebuildMathStemDeDe(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  if (a != null && b != null && OP_SYMBOL_DE[opRaw]) {
    return { stem: `Wie viel ist ${a} ${OP_SYMBOL_DE[opRaw]} ${b}?`, source: "generic" };
  }
  for (const candidate of [p.exerciseText, question?.exerciseText, question?.question]) {
    if (typeof candidate === "string" && candidate.trim() && !containsHebrew(candidate)) {
      return { stem: String(candidate).trim(), source: "passthrough" };
    }
  }
  return { stem: null, source: "none" };
}

/**
 * Localize math question for German (Germany) (de-DE) display.
 * Display stems come from params/kind templates — not from translating Hebrew prose.
 * Option tokens use closed dictionaries (logical labels), not sentence MT.
 */
export function localizeMathQuestionDeDe(question) {
  if (!question) return question;

  const base = { ...question };
  // Drop authored Hebrew stems so params are the sole stem authority.
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const { stem, source } = resolveMathDisplayStem({ ...question, ...base, params: question.params });
  const resolvedStem = stem || "Löse.";

  const out = mapQuestionTextFields({ ...base }, (field, value) => {
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
      if (OBJECTS_DE[text.trim()]) return OBJECTS_DE[text.trim()];
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
