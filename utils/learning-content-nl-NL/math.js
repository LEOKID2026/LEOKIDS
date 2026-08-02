/**
 * Dutch (Netherlands) (nl-NL) rebuilders for math question stems.
 * English is the authority; params/numbers/operators unchanged.
 */
import { BLANK } from "../math-constants.js";
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

const WEEKDAYS_NL = [
  "zondag",
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag"];

const OBJECTS_NL = Object.freeze({
  items: "dingen",
  apples: "appels",
  balls: "ballen",
  stickers: "stickers",
  books: "boeken",
  pencils: "potloden",
  chairs: "stoelen",
  cards: "kaarten",
  boxes: "dozen",
  coins: "munten",
});
const YES_NO = Object.freeze({ Yes: "Ja", No: "Nee", yes: "ja", no: "nee" });
const PRIME_COMPOSITE = Object.freeze({ prime: "priem", composite: "samengesteld", Prime: "Priem", Composite: "Samengesteld" });
const PARITY = Object.freeze({ even: "even", odd: "oneven", Even: "Even", Odd: "Oneven" });
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
export function rebuildMathStemNlNl(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");
  const gradeKey = String(question?.gradeKey || p.gradeKey || "g3");

  if (kind === "mul_groups_g1") {
    const objects = OBJECTS_NL[p.objects] || String(p.objects || "items");
    return `Er zijn ${p.groups} groepen. Elke groep heeft ${p.perGroup} ${objects}. Hoeveel ${objects} zijn er in totaal?`;
  }
  if (kind === "mul_skip_count_g1") {
    const seq = Array.isArray(p.seq) ? p.seq : [];
    const head = seq.slice(0, -1).join(", ");
    return `Tel met sprongen van ${p.perGroup}: ${head}, ${BLANK}`;
  }
  if (kind === "ns_number_line" || kind === "ns_number_line_g1") {
    const nums = Array.isArray(p.numbers) ? p.numbers : [];
    const line = nums.map((n) => (n === BLANK || n === "__" ? BLANK : n)).join(" - ");
    return `Vul het ontbrekende getal in op de getallenlijn: ${line}`;
  }
  if (kind === "ns_even_odd" || kind === "ns_parity") {
    return `Is ${p.n ?? p.num} een even getal?`;
  }
  if (kind === "frac_half" || kind === "frac_half_reverse") {
    if (kind === "frac_half_reverse" && p.whole != null) {
      return `De helft van ${BLANK} is ${p.whole / 2}. Wat is het hele getal?`;
    }
    return `Wat is de helft van ${p.whole ?? p.n}?`;
  }
  if (kind === "frac_quarter" || kind === "frac_quarter_reverse") {
    if (kind === "frac_quarter_reverse" && p.whole != null) {
      return `Een kwart van ${BLANK} is ${p.whole / 4}. Wat is het hele getal?`;
    }
    return `Wat is een kwart van ${p.whole ?? p.n}?`;
  }
  if (
    kind === "frac_compare_like_den_g4" |
    kind === "frac_compare_like_den_g3" |
    kind === "frac_compare_same_den"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      return `Welke breuk is groter — ${p.n1}/${p.den} of ${p.n2}/${p.den}? Schrijf de grotere breuk: ${BLANK}`;
    }
  }
  if (
    kind === "frac_same_den_add_g4" |
    kind === "frac_same_den_add" |
    kind === "frac_same_den_sub_g4" |
    kind === "frac_same_den_sub"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      const op = p.op === "add" || kind.includes("add") ? "+" : "−";
      return `${p.n1}/${p.den} ${op} ${p.n2}/${p.den} = ${BLANK}`;
    }
  }
  if (kind === "frac_simplify_intro_g4" || kind === "frac_simplify_intro_g3") {
    if (p.num != null && p.den != null) {
      return `Vereenvoudig de breuk ${p.num}/${p.den}: ${BLANK}`;
    }
  }
  if (kind === "frac_equivalent_expand" || kind === "frac_equivalent") {
    if (p.num != null && p.den != null && p.factor != null) {
      return `Zoek een gelijkwaardige breuk voor ${p.num}/${p.den} (vermenigvuldig met ${p.factor}): ${BLANK}`;
    }
  }
  if (kind === "wp_simple_add" || kind === "wp_simple_add_g2") {
    if (kind === "wp_simple_add_g2") {
      return `Er waren ${p.a} kinderen in de klas en er kwamen ${p.b} bij. Hoeveel kinderen zijn er nu?`;
    }
    return `Leo heeft ${p.a} ballen en krijgt er ${p.b} bij. Hoeveel ballen heeft Leo in totaal?`;
  }
  if (kind === "wp_simple_sub" || kind === "wp_simple_sub_g2") {
    if (kind === "wp_simple_sub_g2") {
      return `Er liggen ${p.total} appels in een mand. Er zijn er ${p.give} opgegeten. Hoeveel appels zijn er over?`;
    }
    return `Leo heeft ${p.total} stickers. Hij geeft er ${p.give} aan een vriend. Hoeveel stickers heeft Leo nog?`;
  }
  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `Emma heeft ${p.money} euro. Zij koopt een tussendoortje voor ${p.toy} euro. Hoeveel geld blijft er over?`;
  }
  if (kind === "wp_groups_g2") {
    return `Elke rij heeft ${p.per} stoelen. Er zijn ${p.groups} van zulke rijen. Hoeveel stoelen zijn er in totaal?`;
  }
  if (kind === "wp_groups_g3") {
    return `Elke doos bevat ${p.per} potloden. Er zijn ${p.groups} dozen. Hoeveel potloden zijn er in totaal?`;
  }
  if (kind === "wp_groups_g4") {
    return `Elke plank heeft ${p.per} boeken. Er zijn ${p.groups} planken. Hoeveel boeken zijn er in totaal?`;
  }
  if (kind === "wp_groups_late_g6") {
    return `Elke container bevat ${p.per} onderdelen. Er zijn ${p.groups} containers geleverd. Hoeveel onderdelen in totaal?`;
  }
  if (kind === "wp_groups" || kind === "wp_groups_late") {
    return `Elke voorraadkist bevat ${p.per} pakketten. Er zijn ${p.groups} kisten geleverd. Hoeveel pakketten in totaal?`;
  }
  if (kind === "wp_comparison_more") {
    return `Noa heeft ${p.big} kaarten en Yuval heeft ${p.small} kaarten. Hoeveel kaarten heeft Noa meer dan Yuval?`;
  }
  if (kind === "wp_part_whole_g4") {
    return `Een zaal heeft ${p.whole} stoelen. ${p.partA} zijn bezet voor een voorstelling en de rest is leeg. Hoeveel stoelen zijn leeg?`;
  }
  if (kind === "wp_part_whole") {
    return `Een klas heeft ${p.whole} leerlingen. ${p.partA} zitten bij de voetbalclub en de rest bij de schaakclub. Hoeveel leerlingen zitten bij de schaakclub?`;
  }
  if (kind === "wp_change_stack_g4") {
    return `Een magazijn had ${p.start} dozen. Er zijn ${p.gain} nieuwe dozen bijgekomen en ${p.loss} zijn naar een ander filiaal gestuurd. Hoeveel dozen blijven er over?`;
  }
  if (kind === "wp_change_stack") {
    return `Een bibliotheek had ${p.start} boeken. Er zijn ${p.gain} nieuwe boeken bijgekomen en ${p.loss} zijn uitgeleend. Hoeveel boeken heeft de bibliotheek nu?`;
  }
  if (kind === "wp_time_days") {
    const start = WEEKDAYS_NL[p.startDayIdx] || "maandag";
    const end = WEEKDAYS_NL[p.endDayIdx] || "vrijdag";
    return `Als het vandaag ${start} is, hoeveel dagen tot ${end}?`;
  }
  if (kind === "wp_time_date") {
    return `Als het vandaag de ${p.today}e van de maand is, welke datum is het over ${p.daysLater} dagen?`;
  }
  if (kind === "wp_coins") {
    return `Leo heeft ${p.coins1} munten van 1 euro en ${p.coins2} munten van 2 euro. Hoeveel geld heeft hij in totaal?`;
  }
  if (kind === "wp_coins_spent") {
    return `Leo heeft € ${p.total} in munten. Hij koopt snoep voor € ${p.spent}. Hoeveel geld blijft er over?`;
  }
  if (kind === "wp_division_simple") {
    return `Er zijn ${p.total} appels verdeeld in groepen van ${p.perGroup} appels. Hoeveel groepen zijn er?`;
  }
  if (kind === "wp_leftover") {
    return `${p.total} leerlingen worden verdeeld in groepen van ${p.groupSize}. Hoeveel leerlingen blijven over zonder een volle groep?`;
  }
  if (kind === "wp_shop_discount") {
    return `Een shirt kost € ${p.price} met ${p.discPerc}% korting. Hoeveel betaal je na de korting?`;
  }
  if (kind === "wp_unit_cm_to_m") {
    return `Hoeveel meter is ${p.cm} centimeter? = ${BLANK}`;
  }
  if (kind === "wp_unit_g_to_kg") {
    return `Hoeveel kilogram is ${p.g} gram? = ${BLANK}`;
  }
  if (kind === "wp_distance_time") {
    return `Een kind loopt met een constante snelheid van ${p.speed} km/u gedurende ${p.hours} uur. Hoeveel kilometer legt het af?`;
  }
  if (kind === "wp_time_sum") {
    return `Een videoclip duurt ${p.l1} minuten en een andere duurt ${p.l2} minuten. Hoeveel minuten duren beide clips samen?`;
  }
  if (kind === "wp_average" || kind === "wp_average_g6") {
    if (kind === "wp_average_g6") {
      return `Een groepsproject scoorde ${p.s1}, ${p.s2} en ${p.s3} in drie onderdelen. Wat is de gemiddelde score (afgerond op een heel getal)?`;
    }
    return `Leo scoorde ${p.s1}, ${p.s2} en ${p.s3} op drie toetsen. Wat is zijn gemiddelde (afgerond op een heel getal)?`;
  }
  if (kind === "wp_multi_step" || kind === "wp_multi_step_g6") {
    return `Leo heeft € ${p.money}. Hij koopt ${p.a} pennen en ${p.b} potloden, en elk artikel kost € ${p.price}. Hoeveel geld blijft er over na het winkelen?`;
  }
  if (kind === "operation_choice_word_problem_probe") {
    return `Er zijn ${p.groups} groepen met ${p.each} dingen in elke groep. Welke bewerking geeft het totaal?`;
  }

  if (kind.startsWith("wp_") || inferSelectedOp(question) === "word_problems") {
    return null;
  }

  return applyMathLevelPresentationNlNl(
    String(question?.question || question?.exerciseText || ""),
    {
      selectedOp: question?.operation || inferSelectedOp(question),
      params: p,
      mathLevelKey: inferMathLevelKey(question),
      gradeKey,
    }
  );
}

/** Dutch (Netherlands) mirror of applyMathLevelPresentation (math-question-generator.js). */
export function applyMathLevelPresentationNlNl(question, ctx) {
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
        return `Maak ${c}: wat tel je op bij ${b} om op ${c} te komen? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Gegeven ${b} + ${BLANK} = ${c}. Wat is het ontbrekende getal?`;
      }
      return `Verhaalsom: bij ${b} ontbreekt een deel om op ${c} te komen — hoeveel moet je optellen? = ${BLANK}`;
    }
  }

  if (kind === "ns_complement10") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 10;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Tot ${c}: wat tel je op bij ${b} om op ${c} te eindigen? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Ontbreekt in de som: ${b} + ${BLANK} = ${c}`;
      }
      return `Zonder kolom: welke optelling tot ${c} begint met ${b}? = ${BLANK}`;
    }
  }

  if (kind === "scale_find") {
    const ml = params?.mapLength;
    const rl = params?.realLength;
    if (ml != null && rl != null) {
      if (mathLevelKey === "easy") {
        return `Op een kaart is een lijnstuk ${ml} cm lang en in het echt ${rl} cm. Vul de schaal in als 1:${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Kaartlengte ${ml} cm, echte lengte ${rl} cm. Wat is de schaal? Schrijf het getal na 1: = ${BLANK}`;
      }
      return `Kaart ${ml} cm en echt ${rl} cm — de schaal is 1:__. Wat is het ontbrekende getal? = ${BLANK}`;
    }
  }

  if (kind === "scale_map_to_real") {
    const ml = params?.mapLength;
    const sc = params?.scale;
    if (ml != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `Op schaal 1:${sc}, hoeveel echte cm zijn gelijk aan ${ml} cm op de kaart? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Scale 1:${sc}. A map measurement of ${ml} cm — what is the real length in cm? = ${BLANK}`;
      }
      return `Schaal 1:${sc}, kaartmaat ${ml} cm — zoek de echte lengte in cm = ${BLANK}`;
    }
  }

  if (kind === "scale_real_to_map") {
    const rl = params?.realLength;
    const sc = params?.scale;
    if (rl != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `Op schaal 1:${sc}, echte lengte ${rl} cm — hoeveel cm op de kaart? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Echte lengte ${rl} cm, schaal 1:${sc}. Wat is de lengte op de kaart? = ${BLANK}`;
      }
      return `Zet echt om naar kaart: ${rl} cm echt bij 1:${sc} — hoeveel cm op de pagina? = ${BLANK}`;
    }
  }

  if (selectedOp === "compare" || kind === "cmp") {
    const raw = params?.exerciseText ? String(params.exerciseText) : "";
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 4;
    if (mathLevelKey === "easy") {
      const opts = [
        `Vergelijk de twee getallen en vul in (<, =, >): ${raw}`,
        `Vergelijkingsteken tussen de getallen: ${raw}`,
        `Kies < , = of > — vergelijk: ${raw}`,
        `Vergelijk de waarden en vul het teken in: ${raw}`];
      return opts[pv].trim();
    }
    if (mathLevelKey === "medium") {
      const opts = [
        `Vul het juiste vergelijkingsteken in: ${raw}`,
        `Welk teken vergelijkt het paar? ${raw}`,
        `Kies het juiste vergelijkingsteken: ${raw}`,
        `Vul het teken tussen de getallen in: ${raw}`];
      return opts[pv].trim();
    }
    const opts = [
      `Fill in the comparison sign — check before you choose: ${raw}`,
      `Vergelijk zorgvuldig en kies een teken: ${raw}`,
      `Compare with care and pick a sign: ${raw}`,
      `Snelle check: welk teken past? ${raw}`];
    return opts[pv].trim();
  }

  if (selectedOp === "divisibility" || kind === "divisibility") {
    const num = params?.num;
    const div = params?.divisor;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (num != null && div != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Deelbaarheid: is ${num} deelbaar door ${div}?`
          : `Check: is ${num} a multiple of ${div} (no remainder)?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Deelbaarheidsregels — does ${num} divide by ${div}?`
          : `Whole division: ${num} ÷ ${div} — is the result a whole number?`;
      }
      return pv === 0
        ? `Deelbaarheidscontrole: does ${num} divide by ${div}?`
        : `Delers: does ${div} divide ${num} exactly?`;
    }
  }

  if (selectedOp === "prime_composite" || kind === "prime_composite") {
    const num = params?.num;
    const subKind = String(params?.subKind || "pc_classify");
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (subKind === "pc_factor_count" && num != null) {
      if (mathLevelKey === "easy") return `Priemgetallen: hoeveel delers heeft ${num}?`;
      if (mathLevelKey === "medium") {
        return `Tel de delers: how many natural divisors does ${num} have (including 1 and itself)?`;
      }
      return `Delers: how many different divisors does ${num} have?`;
    }
    if (subKind === "pc_smallest_prime" && num != null) {
      if (mathLevelKey === "easy") return `Priemfactor: wat is de kleinste priemfactor van ${num}?`;
      if (mathLevelKey === "medium") return `Zoek de kleinste priemfactor van ${num}.`;
      return `Factoren: wat is de kleinste priemfactor van ${num}?`;
    }
    if (subKind === "pc_divisor_pick" && num != null && params?.divisorCandidate != null) {
      const d = params.divisorCandidate;
      if (mathLevelKey === "easy") return `Delercontrole: does ${d} divide ${num} evenly?`;
      if (mathLevelKey === "medium") return `Delers: does ${num} divide by ${d}?`;
      return `Delers: does ${d} divide ${num} exactly?`;
    }
    if (num != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Priemgetallen: is ${num} prime or composite?`
          : `Basisclassificatie: ${num} — priem of samengesteld?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Classificeer het getal: ${num} — priem of samengesteld?`
          : `Does ${num} have exactly two different natural divisors?`;
      }
      return pv === 0
        ? `Is ${num} prime or composite? Denk na voordat je kiest.`
        : `Snelle controle: can ${num} be split into two factors greater than 1?`;
    }
  }

  if (selectedOp === "powers" && (kind === "power_base" || kind === "power_calc")) {
    if (kind === "power_calc") {
      if (mathLevelKey === "easy") return `Machten: ${q0}`;
      if (mathLevelKey === "medium") return `Bereken de macht — ${q0}`;
      return `Machten: ${q0}`;
    }
    if (kind === "power_base") {
      if (mathLevelKey === "easy") return `Zoek het grondtal in de macht: ${q0}`;
      if (mathLevelKey === "medium") return `Machtenpuzzel — ${q0}`;
      return `Ontbrekend grondtal in de macht: ${q0}`;
    }
  }

  if (selectedOp === "estimation") {
    if (kind === "est_add") {
      if (mathLevelKey === "easy") return q0.replace(/^Estimate\b/i, "Schatting door afronden: schat");
      return q0;
    }
    if (kind === "est_mul" || kind === "est_quantity") return q0;
  }

  if (
    kind === "frac_half" |
    kind === "frac_half_reverse" |
    kind === "frac_quarter" |
    kind === "frac_quarter_reverse"
  ) {
    if (mathLevelKey === "easy") return `Breuken: ${q0}`;
    if (mathLevelKey === "medium") return `Breuk als deel van een geheel: ${q0}`;
    return `Breuken: ${q0}`;
  }

  if (kind === "fm_factor") {
    if (mathLevelKey === "easy") return `Factoren: ${q0}`;
    if (mathLevelKey === "medium") return `Zoek een deler: ${q0}`;
    return `Delers en factoren: ${q0}`;
  }
  if (kind === "fm_multiple") {
    if (mathLevelKey === "easy") return `Veelvouden: ${q0}`;
    if (mathLevelKey === "medium") return `Controleer veelvouden: ${q0}`;
    return `Veelvouden: ${q0}`;
  }

  if (selectedOp === "percentages" || selectedOp === "ratio" || selectedOp === "scale") return q0;

  if (kind === "fm_gcd" && params?.a != null && params?.b != null) {
    const { a, b } = params;
    if (mathLevelKey === "easy") {
      return `GGD: wat is de grootste gemene deler van ${a} and ${b}? = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return `Grootste gemene deler (GGD) van ${a} and ${b} — wat is die? = ${BLANK}`;
    }
    return `GCF: think first — GCD(${a}, ${b}) = ${BLANK}`;
  }

  if (kind === "round" && params?.n != null && params?.toWhat != null) {
    const { n, toWhat } = params;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (toWhat === 10) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Afronden op tientallen: what does ${n} round to? = ${BLANK}`
          : `Dichtstbijzijnde tien: ${n} → ? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Round ${n} to the nearest ten — result? = ${BLANK}`
          : `Round by tens rule: ${n} = ${BLANK}`;
      }
      return pv === 0
        ? `Afronden op tientallen: ${n} → ? = ${BLANK}`
        : `Juiste getal na afronden van ${n} op tientallen = ${BLANK}`;
    }
    if (mathLevelKey === "easy") {
      return pv === 0
        ? `Afronden op honderdtallen: what does ${n} round to? = ${BLANK}`
        : `Dichtstbijzijnde honderd: ${n} = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return pv === 0
        ? `Round ${n} to the nearest hundred — result? = ${BLANK}`
        : `Afronden op honderdtallen: ${n} → ? = ${BLANK}`;
    }
    return pv === 0
      ? `Afronden op honderdtallen: ${n} → ? = ${BLANK}`
      : `Getal na afronden van ${n} op honderdtallen = ${BLANK}`;
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
            ? `Tel decimalen op: ${af} + ${bf} = ${BLANK}`
            : `Directe som: ${af} + ${bf} = ${BLANK}`;
        }
        return `Tel decimalen op: ${af} + ${bf} = ${BLANK}`;
      }
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Trek decimalen af: ${af} − ${bf} = ${BLANK}`
          : `Direct verschil: ${af} − ${bf} = ${BLANK}`;
      }
      return `Trek decimalen af: ${af} − ${bf} = ${BLANK}`;
    }
  }

  if (selectedOp === "sequences") {
    if (mathLevelKey === "easy") {
      return q0.replace(/^Ga verder met het patroon\b/i, "Continue the number pattern");
    }
    return q0;
  }

  const looksNumericExercise =
    /=\s*__|=\s*\?\?|___|\?\?=/.test(q0) |
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

  const rebuilt = rebuildMathStemNlNl(question);
  if (rebuilt && !containsHebrew(rebuilt) && (_field === "question" || _field === "exerciseText" || _field === "questionLabel")) {
    return rebuilt;
  }

  const presented = applyMathLevelPresentationNlNl(text, {
    selectedOp: question?.operation || inferSelectedOp(question),
    params: question?.params || {},
    mathLevelKey: inferMathLevelKey(question),
    gradeKey: question?.gradeKey || "g3",
  });
  if (presented && !containsHebrew(presented)) return presented;

  const phrased = applyMathPhrases(text);
  if (!containsHebrew(phrased)) return phrased;

  const stripped = phrased
    .replace(/(\d+)\s+remainder\s+(\d+)/gu, "$1 remainder $2")
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

const OP_SYMBOL_NL = Object.freeze({
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
  const rebuilt = rebuildMathStemNlNl(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  if (a != null && b != null && OP_SYMBOL_NL[opRaw]) {
    return { stem: `Hoeveel is ${a} ${OP_SYMBOL_NL[opRaw]} ${b}?`, source: "generic" };
  }
  for (const candidate of [p.exerciseText, question?.exerciseText, question?.question]) {
    if (typeof candidate === "string" && candidate.trim() && !containsHebrew(candidate)) {
      return { stem: String(candidate).trim(), source: "passthrough" };
    }
  }
  return { stem: null, source: "none" };
}

/**
 * Localize math question for Global English display.
 * Display stems come from params/kind templates — not from translating Hebrew prose.
 * Option tokens use closed dictionaries (logical labels), not sentence MT.
 */
export function localizeMathQuestionNlNl(question) {
  if (!question) return question;

  const base = { ...question };
  // Drop authored Hebrew stems so params are the sole stem authority.
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const { stem, source } = resolveMathDisplayStem({ ...question, ...base, params: question.params });
  const resolvedStem = stem || "Reken uit.";

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
      if (OBJECTS_NL[text.trim()]) return OBJECTS_NL[text.trim()];
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
      typeof a === "string" ? localizeMathField("answers", a, out) : a
    );
  }
  return out;
}
