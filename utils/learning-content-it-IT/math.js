/**
 * Italian (Italy) (it-IT) rebuilders for math question stems.
 * English is the authority; params/numbers/operators unchanged.
 * Children: tu. Currency: euro / €.
 */
import { BLANK } from "../math-constants.js";
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

const WEEKDAYS_IT = [
  "domenica",
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
];

const OBJECTS_IT = Object.freeze({
  items: "oggetti",
  apples: "mele",
  balls: "palline",
  stickers: "adesivi",
  books: "libri",
  pencils: "matite",
  chairs: "sedie",
  cards: "carte",
  boxes: "scatole",
  coins: "monete",
});
const YES_NO = Object.freeze({ Yes: "Sì", No: "No", yes: "sì", no: "no" });
const PRIME_COMPOSITE = Object.freeze({
  prime: "primo",
  composite: "composto",
  Prime: "Primo",
  Composite: "Composto",
});
const PARITY = Object.freeze({ even: "pari", odd: "dispari", Even: "Pari", Odd: "Dispari" });
const MATH_PHRASES = [];

function applyMathPhrases(text) {
  let out = String(text ?? "");
  for (const [he, en] of MATH_PHRASES) {
    if (out.includes(he)) out = out.split(he).join(en);
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
export function rebuildMathStemItIt(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");
  const gradeKey = String(question?.gradeKey || p.gradeKey || "g3");

  if (kind === "mul_groups_g1") {
    const objects = OBJECTS_IT[p.objects] || String(p.objects || "oggetti");
    return `Ci sono ${p.groups} gruppi. Ogni gruppo ha ${p.perGroup} ${objects}. Quanti ${objects} ci sono in tutto?`;
  }
  if (kind === "mul_skip_count_g1") {
    const seq = Array.isArray(p.seq) ? p.seq : [];
    const head = seq.slice(0, -1).join(", ");
    return `Conta di ${p.perGroup} in ${p.perGroup}: ${head}, ${BLANK}`;
  }
  if (kind === "ns_number_line" || kind === "ns_number_line_g1") {
    const nums = Array.isArray(p.numbers) ? p.numbers : [];
    const line = nums.map((n) => (n === BLANK || n === "__" ? BLANK : n)).join(" - ");
    return `Completa il numero mancante sulla retta dei numeri: ${line}`;
  }
  if (kind === "ns_even_odd" || kind === "ns_parity") {
    return `${p.n ?? p.num} è un numero pari?`;
  }
  if (kind === "frac_half" || kind === "frac_half_reverse") {
    if (kind === "frac_half_reverse" && p.whole != null) {
      return `La metà di ${BLANK} è ${p.whole / 2}. Qual è il numero intero?`;
    }
    return `Quanto fa la metà di ${p.whole ?? p.n}?`;
  }
  if (kind === "frac_quarter" || kind === "frac_quarter_reverse") {
    if (kind === "frac_quarter_reverse" && p.whole != null) {
      return `Un quarto di ${BLANK} è ${p.whole / 4}. Qual è il numero intero?`;
    }
    return `Quanto fa un quarto di ${p.whole ?? p.n}?`;
  }
  if (
    kind === "frac_compare_like_den_g4" ||
    kind === "frac_compare_like_den_g3" ||
    kind === "frac_compare_same_den"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      return `Quale frazione è maggiore — ${p.n1}/${p.den} o ${p.n2}/${p.den}? Scrivi la frazione maggiore: ${BLANK}`;
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
      return `Semplifica la frazione ${p.num}/${p.den}: ${BLANK}`;
    }
  }
  if (kind === "frac_equivalent_expand" || kind === "frac_equivalent") {
    if (p.num != null && p.den != null && p.factor != null) {
      return `Trova una frazione equivalente a ${p.num}/${p.den} (moltiplica per ${p.factor}): ${BLANK}`;
    }
  }
  if (kind === "wp_simple_add" || kind === "wp_simple_add_g2") {
    if (kind === "wp_simple_add_g2") {
      return `C'erano ${p.a} bambini in classe e ne sono arrivati altri ${p.b}. Quanti bambini ci sono ora?`;
    }
    return `Leo ha ${p.a} palline e ne riceve altre ${p.b}. Quante palline ha Leo in tutto?`;
  }
  if (kind === "wp_simple_sub" || kind === "wp_simple_sub_g2") {
    if (kind === "wp_simple_sub_g2") {
      return `Ci sono ${p.total} mele in un cesto. Ne sono state mangiate ${p.give}. Quante mele rimangono?`;
    }
    return `Leo ha ${p.total} adesivi. Ne dà ${p.give} a un amico. Quanti adesivi gli rimangono?`;
  }
  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `Emma ha ${p.money} euro. Compra uno snack da ${p.toy} euro. Quanti soldi le rimangono?`;
  }
  if (kind === "wp_groups_g2") {
    return `Ogni fila ha ${p.per} sedie. Ci sono ${p.groups} file così. Quante sedie ci sono in tutto?`;
  }
  if (kind === "wp_groups_g3") {
    return `Ogni scatola contiene ${p.per} matite. Ci sono ${p.groups} scatole. Quante matite ci sono in tutto?`;
  }
  if (kind === "wp_groups_g4") {
    return `Ogni scaffale contiene ${p.per} libri. Ci sono ${p.groups} scaffali. Quanti libri ci sono in tutto?`;
  }
  if (kind === "wp_groups_late_g6") {
    return `Ogni contenitore ha ${p.per} pezzi. Sono stati consegnati ${p.groups} contenitori. Quanti pezzi in tutto?`;
  }
  if (kind === "wp_groups" || kind === "wp_groups_late") {
    return `Ogni cassa di materiali contiene ${p.per} pacchi. Sono state consegnate ${p.groups} casse. Quanti pacchi in tutto?`;
  }
  if (kind === "wp_comparison_more") {
    return `Noa ha ${p.big} carte e Yuval ne ha ${p.small}. Quante carte ha Noa in più di Yuval?`;
  }
  if (kind === "wp_part_whole_g4") {
    return `Una sala ha ${p.whole} posti. ${p.partA} sono occupati per uno spettacolo e gli altri sono vuoti. Quanti posti sono vuoti?`;
  }
  if (kind === "wp_part_whole") {
    return `Una classe ha ${p.whole} alunni. ${p.partA} sono nel club di calcio e gli altri nel club di scacchi. Quanti alunni sono nel club di scacchi?`;
  }
  if (kind === "wp_change_stack_g4") {
    return `Un magazzino aveva ${p.start} scatole. Ne sono state aggiunte ${p.gain} e ${p.loss} sono state inviate a un'altra sede. Quante scatole restano?`;
  }
  if (kind === "wp_change_stack") {
    return `Una biblioteca aveva ${p.start} libri. Ne sono stati aggiunti ${p.gain} e ${p.loss} sono stati presi in prestito. Quanti libri ci sono ora in biblioteca?`;
  }
  if (kind === "wp_time_days") {
    const start = WEEKDAYS_IT[p.startDayIdx] || "lunedì";
    const end = WEEKDAYS_IT[p.endDayIdx] || "venerdì";
    return `Se oggi è ${start}, quanti giorni mancano a ${end}?`;
  }
  if (kind === "wp_time_date") {
    return `Se oggi è il ${p.today} del mese, che data sarà tra ${p.daysLater} giorni?`;
  }
  if (kind === "wp_coins") {
    return `Leo ha ${p.coins1} monete da 1 euro e ${p.coins2} monete da 2 euro. Quanti soldi ha in tutto?`;
  }
  if (kind === "wp_coins_spent") {
    return `Leo ha € ${p.total} in monete. Compra caramelle per € ${p.spent}. Quanti soldi gli rimangono?`;
  }
  if (kind === "wp_division_simple") {
    return `Ci sono ${p.total} mele divise in gruppi da ${p.perGroup} mele ciascuno. Quanti gruppi ci sono?`;
  }
  if (kind === "wp_leftover") {
    return `${p.total} alunni sono divisi in gruppi da ${p.groupSize}. Quanti alunni restano senza un gruppo completo?`;
  }
  if (kind === "wp_shop_discount") {
    return `Una maglietta costa € ${p.price} con uno sconto del ${p.discPerc}%. Quanto paghi dopo lo sconto?`;
  }
  if (kind === "wp_unit_cm_to_m") {
    return `Quanti metri equivalgono a ${p.cm} centimetri? = ${BLANK}`;
  }
  if (kind === "wp_unit_g_to_kg") {
    return `Quanti chilogrammi equivalgono a ${p.g} grammi? = ${BLANK}`;
  }
  if (kind === "wp_distance_time") {
    return `Un bambino cammina a una velocità costante di ${p.speed} km/h per ${p.hours} ore. Quanti chilometri percorrerà?`;
  }
  if (kind === "wp_time_sum") {
    return `Un videoclip dura ${p.l1} minuti e un altro dura ${p.l2} minuti. Quanti minuti durano insieme i due clip?`;
  }
  if (kind === "wp_average" || kind === "wp_average_g6") {
    if (kind === "wp_average_g6") {
      return `Un progetto di gruppo ha ottenuto i punteggi ${p.s1}, ${p.s2} e ${p.s3} in tre fasi. Qual è il punteggio medio (arrotondato a un numero intero)?`;
    }
    return `Leo ha ottenuto ${p.s1}, ${p.s2} e ${p.s3} in tre prove. Qual è la sua media (arrotondata a un numero intero)?`;
  }
  if (kind === "wp_multi_step" || kind === "wp_multi_step_g6") {
    return `Leo ha € ${p.money}. Compra ${p.a} penne e ${p.b} matite, e ogni oggetto costa € ${p.price}. Quanti soldi gli rimangono dopo gli acquisti?`;
  }
  if (kind === "operation_choice_word_problem_probe") {
    return `Ci sono ${p.groups} gruppi con ${p.each} oggetti in ogni gruppo. Quale operazione trova il totale?`;
  }

  if (kind.startsWith("wp_") || inferSelectedOp(question) === "word_problems") {
    return null;
  }

  return applyMathLevelPresentationItIt(
    String(question?.question || question?.exerciseText || p.exerciseText || ""),
    {
      selectedOp: question?.operation || inferSelectedOp(question),
      params: p,
      mathLevelKey: inferMathLevelKey(question),
      gradeKey,
    },
  );
}

/** Italian mirror of applyMathLevelPresentation. */
export function applyMathLevelPresentationItIt(question, ctx) {
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
        return `Arriva a ${c}: cosa aggiungi a ${b} per arrivare a ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Dato ${b} + ${BLANK} = ${c}. Qual è il numero mancante?`;
      }
      return `Problema: a ${b} manca una parte per arrivare a ${c} — quanto aggiungere? = ${BLANK}`;
    }
  }

  if (kind === "ns_complement10") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 10;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Fino a ${c}: cosa aggiungi a ${b} per arrivare a ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Manca nell'equazione: ${b} + ${BLANK} = ${c}`;
      }
      return `Senza colonna: quale addizione a ${c} inizia con ${b}? = ${BLANK}`;
    }
  }

  if (kind === "scale_find") {
    const ml = params?.mapLength;
    const rl = params?.realLength;
    if (ml != null && rl != null) {
      if (mathLevelKey === "easy") {
        return `Su una mappa, un segmento misura ${ml} cm e nella realtà misura ${rl} cm. Completa la scala come 1:${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Lunghezza sulla mappa ${ml} cm, lunghezza reale ${rl} cm. Qual è la scala? Scrivi il numero dopo 1: = ${BLANK}`;
      }
      return `Mappa ${ml} cm e reale ${rl} cm — la scala è 1:__. Qual è il numero mancante? = ${BLANK}`;
    }
  }

  if (kind === "scale_map_to_real") {
    const ml = params?.mapLength;
    const sc = params?.scale;
    if (ml != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `In scala 1:${sc}, quanti cm reali equivalgono a ${ml} cm sulla mappa? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Scala 1:${sc}. Una misura di mappa di ${ml} cm — qual è la lunghezza reale in cm? = ${BLANK}`;
      }
      return `Scala 1:${sc}, misura sulla mappa ${ml} cm — trova la lunghezza reale in cm = ${BLANK}`;
    }
  }

  if (kind === "scale_real_to_map") {
    const rl = params?.realLength;
    const sc = params?.scale;
    if (rl != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `In scala 1:${sc}, lunghezza reale ${rl} cm — quanti cm sulla mappa? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Lunghezza reale ${rl} cm, scala 1:${sc}. Qual è la lunghezza sulla mappa? = ${BLANK}`;
      }
      return `Converti dal reale alla mappa: ${rl} cm reali a 1:${sc} — quanti cm sulla pagina? = ${BLANK}`;
    }
  }

  if (selectedOp === "compare" || kind === "cmp") {
    const raw = params?.exerciseText ? String(params.exerciseText) : "";
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 4;
    if (mathLevelKey === "easy") {
      const opts = [
        `Confronta i due numeri e completa (<, =, >): ${raw}`,
        `Segno di confronto tra i numeri: ${raw}`,
        `Scegli < , = o > — confronta: ${raw}`,
        `Confronta i valori e completa il segno: ${raw}`,
      ];
      return opts[pv].trim();
    }
    if (mathLevelKey === "medium") {
      const opts = [
        `Completa il segno di confronto corretto: ${raw}`,
        `Quale segno confronta la coppia? ${raw}`,
        `Abbina il segno di confronto corretto: ${raw}`,
        `Completa il segno tra le espressioni numeriche: ${raw}`,
      ];
      return opts[pv].trim();
    }
    const opts = [
      `Completa il segno di confronto — controlla prima di scegliere: ${raw}`,
      `Confronta con attenzione e scegli un segno: ${raw}`,
      `Confronta con cura e scegli un segno: ${raw}`,
      `Controllo rapido: quale segno va bene? ${raw}`,
    ];
    return opts[pv].trim();
  }

  if (selectedOp === "divisibility" || kind === "divisibility") {
    const num = params?.num;
    const div = params?.divisor;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (num != null && div != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Divisibilità: ${num} è divisibile per ${div}?`
          : `Controlla: ${num} è un multiplo di ${div} (senza resto)?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Regole di divisibilità — ${num} è divisibile per ${div}?`
          : `Divisione intera: ${num} ÷ ${div} — il risultato è un numero intero?`;
      }
      return pv === 0
        ? `Controllo di divisibilità: ${num} è divisibile per ${div}?`
        : `Divisori: ${div} divide ${num} esattamente?`;
    }
  }

  if (selectedOp === "prime_composite" || kind === "prime_composite") {
    const num = params?.num;
    const subKind = String(params?.subKind || "pc_classify");
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (subKind === "pc_factor_count" && num != null) {
      if (mathLevelKey === "easy") return `Numeri primi: quanti divisori ha ${num}?`;
      if (mathLevelKey === "medium") {
        return `Conta i divisori: quanti divisori naturali ha ${num} (incluso 1 e se stesso)?`;
      }
      return `Divisori: quanti divisori diversi ha ${num}?`;
    }
    if (subKind === "pc_smallest_prime" && num != null) {
      if (mathLevelKey === "easy") return `Fattore primo: qual è il più piccolo fattore primo di ${num}?`;
      if (mathLevelKey === "medium") return `Trova il più piccolo fattore primo di ${num}.`;
      return `Fattori: qual è il più piccolo fattore primo di ${num}?`;
    }
    if (subKind === "pc_divisor_pick" && num != null && params?.divisorCandidate != null) {
      const d = params.divisorCandidate;
      if (mathLevelKey === "easy") return `Controllo del divisore: ${d} divide ${num} esattamente?`;
      if (mathLevelKey === "medium") return `Divisori: ${num} è divisibile per ${d}?`;
      return `Divisori: ${d} divide ${num} esattamente?`;
    }
    if (num != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Numeri primi: ${num} è primo o composto?`
          : `Classificazione di base: ${num} — primo o composto?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Classifica il numero: ${num} — primo o composto?`
          : `${num} ha esattamente due divisori naturali diversi?`;
      }
      return pv === 0
        ? `${num} è primo o composto? Pensa prima di scegliere.`
        : `Prova rapida: ${num} si può scomporre in due fattori maggiori di 1?`;
    }
  }

  if (selectedOp === "powers" && (kind === "power_base" || kind === "power_calc")) {
    if (kind === "power_calc") {
      if (mathLevelKey === "easy") return `Potenze: ${q0}`;
      if (mathLevelKey === "medium") return `Calcola la potenza — ${q0}`;
      return `Potenze: ${q0}`;
    }
    if (kind === "power_base") {
      if (mathLevelKey === "easy") return `Trova la base nella potenza: ${q0}`;
      if (mathLevelKey === "medium") return `Indovinello sulle potenze — ${q0}`;
      return `Base mancante nella potenza: ${q0}`;
    }
  }

  if (selectedOp === "estimation") {
    if (kind === "est_add") {
      if (mathLevelKey === "easy") return q0.replace(/^Estimate\b/i, "Stima con arrotondamento: stima");
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
    if (mathLevelKey === "easy") return `Frazioni: ${q0}`;
    if (mathLevelKey === "medium") return `Frazione come parte di un intero: ${q0}`;
    return `Frazioni: ${q0}`;
  }

  if (kind === "fm_factor") {
    if (mathLevelKey === "easy") return `Fattori: ${q0}`;
    if (mathLevelKey === "medium") return `Individua un divisore: ${q0}`;
    return `Divisori e fattori: ${q0}`;
  }
  if (kind === "fm_multiple") {
    if (mathLevelKey === "easy") return `Multipli: ${q0}`;
    if (mathLevelKey === "medium") return `Controlla i multipli: ${q0}`;
    return `Multipli: ${q0}`;
  }

  if (selectedOp === "percentages" || selectedOp === "ratio" || selectedOp === "scale") return q0;

  if (kind === "fm_gcd" && params?.a != null && params?.b != null) {
    const { a, b } = params;
    if (mathLevelKey === "easy") {
      return `MCD: qual è il massimo comune divisore di ${a} e ${b}? = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return `Massimo comune divisore (MCD) di ${a} e ${b} — qual è? = ${BLANK}`;
    }
    return `MCD: pensa prima — MCD(${a}, ${b}) = ${BLANK}`;
  }

  if (kind === "round" && params?.n != null && params?.toWhat != null) {
    const { n, toWhat } = params;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (toWhat === 10) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Arrotonda alle decine: a cosa arrotonda ${n}? = ${BLANK}`
          : `Decina più vicina: ${n} → ? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Arrotonda ${n} alla decina più vicina — risultato? = ${BLANK}`
          : `Regola di arrotondamento alle decine: ${n} = ${BLANK}`;
      }
      return pv === 0
        ? `Arrotonda alle decine: ${n} → ? = ${BLANK}`
        : `Numero corretto dopo aver arrotondato ${n} alle decine = ${BLANK}`;
    }
    if (mathLevelKey === "easy") {
      return pv === 0
        ? `Arrotonda alle centinaia: a cosa arrotonda ${n}? = ${BLANK}`
        : `Centinaia più vicina: ${n} = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return pv === 0
        ? `Arrotonda ${n} alla centinaia più vicina — risultato? = ${BLANK}`
        : `Arrotonda alle centinaia: ${n} → ? = ${BLANK}`;
    }
    return pv === 0
      ? `Arrotonda alle centinaia: ${n} → ? = ${BLANK}`
      : `Numero dopo aver arrotondato ${n} alle centinaia = ${BLANK}`;
  }

  if (kind === "dec_add" || kind === "dec_sub") {
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    const a = params?.a;
    const b = params?.b;
    const pl = params?.places ?? 1;
    if (a != null && b != null) {
      const af = Number(a).toFixed(pl).replace(".", ",");
      const bf = Number(b).toFixed(pl).replace(".", ",");
      if (kind === "dec_add") {
        if (mathLevelKey === "easy") {
          return pv === 0
            ? `Addiziona i decimali: ${af} + ${bf} = ${BLANK}`
            : `Somma diretta: ${af} + ${bf} = ${BLANK}`;
        }
        return `Addiziona i decimali: ${af} + ${bf} = ${BLANK}`;
      }
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Sottrai i decimali: ${af} − ${bf} = ${BLANK}`
          : `Differenza diretta: ${af} − ${bf} = ${BLANK}`;
      }
      return `Sottrai i decimali: ${af} − ${bf} = ${BLANK}`;
    }
  }

  if (selectedOp === "sequences") {
    if (mathLevelKey === "easy") {
      return q0.replace(/^Continue the sequence\b/i, "Continua la sequenza numerica");
    }
    return q0;
  }

  const looksNumericExercise =
    /=\s*__|=\s*\?\?|___|\?\?=/.test(q0) || (/^\d/.test(q0.trim()) && /[+\-×÷]/.test(q0));

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

  const rebuilt = rebuildMathStemItIt(question);
  if (
    rebuilt &&
    !containsHebrew(rebuilt) &&
    (_field === "question" || _field === "exerciseText" || _field === "questionLabel")
  ) {
    return rebuilt;
  }

  const presented = applyMathLevelPresentationItIt(text, {
    selectedOp: question?.operation || inferSelectedOp(question),
    params: question?.params || {},
    mathLevelKey: inferMathLevelKey(question),
    gradeKey: question?.gradeKey || "g3",
  });
  if (presented && !containsHebrew(presented)) return presented;

  const phrased = applyMathPhrases(text);
  if (!containsHebrew(phrased)) return phrased;

  const stripped = phrased
    .replace(/(\d+)\s+remainder\s+(\d+)/gu, "$1 resto $2")
    .replace(/(?!)/gu, " ")
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

const OP_SYMBOL_IT = Object.freeze({
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
});

function resolveMathDisplayStem(question) {
  const rebuilt = rebuildMathStemItIt(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  if (a != null && b != null && OP_SYMBOL_IT[opRaw]) {
    return { stem: `Quanto fa ${a} ${OP_SYMBOL_IT[opRaw]} ${b}?`, source: "generic" };
  }
  for (const candidate of [p.exerciseText, question?.exerciseText, question?.question]) {
    if (typeof candidate === "string" && candidate.trim() && !containsHebrew(candidate)) {
      return { stem: String(candidate).trim(), source: "passthrough" };
    }
  }
  return { stem: null, source: "none" };
}

/**
 * Localize math question for Italian (Italy) (it-IT) display.
 */
export function localizeMathQuestionItIt(question) {
  if (!question) return question;

  const base = { ...question };
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const { stem, source } = resolveMathDisplayStem({ ...question, ...base, params: question.params });
  const resolvedStem = stem || "Risolvi.";

  const out = mapQuestionTextFields({ ...base }, (field, value) => {
    if (field === "question" || field === "exerciseText" || field === "questionLabel") {
      if (!value || containsHebrew(value) || isNearlyEmptyStem(value)) return resolvedStem;
      return value;
    }
    if (isShortAnswerField(field)) {
      const text = String(value ?? "");
      if (!containsHebrew(text)) return text;
      if (YES_NO[text.trim()]) return YES_NO[text.trim()];
      if (PRIME_COMPOSITE[text.trim()]) return PRIME_COMPOSITE[text.trim()];
      if (PARITY[text.trim()]) return PARITY[text.trim()];
      if (OBJECTS_IT[text.trim()]) return OBJECTS_IT[text.trim()];
      const digitsOnly = text.replace(/(?!)/gu, "").trim();
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
      out.correctAnswer = ca.replace(/(?!)/gu, "").trim() || ca;
    }
  }
  if (Array.isArray(out.answers)) {
    out.answers = out.answers.map((a) =>
      typeof a === "string" ? localizeMathField("answers", a, out) : a,
    );
  }
  return out;
}
