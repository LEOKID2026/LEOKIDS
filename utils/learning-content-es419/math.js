import { BLANK } from "../math-constants.js";
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

const WEEKDAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado"];

/** Common object nouns used in mul_groups stems (EN param → LatAm Spanish). */
const OBJECTS_ES = Object.freeze({
  items: "artículos",
  apples: "manzanas",
  balls: "pelotas",
  stickers: "calcomanías",
  books: "libros",
  pencils: "lápices",
  chairs: "sillas",
  cards: "cartas",
  boxes: "cajas",
  coins: "monedas",
});
const YES_NO = Object.freeze({ Yes: "Sí", No: "No", yes: "sí", no: "no" });
const PRIME_COMPOSITE = Object.freeze({
  prime: "primo",
  composite: "compuesto",
  Prime: "Primo",
  Composite: "Compuesto",
});
const PARITY = Object.freeze({ even: "par", odd: "impar", Even: "Par", Odd: "Impar" });
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
export function rebuildMathStemEs419(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");
  const gradeKey = String(question?.gradeKey || p.gradeKey || "g3");

  if (kind === "mul_groups_g1") {
    const objectsKey = String(p.objects || "items");
    const objects = OBJECTS_ES[objectsKey] || objectsKey;
    return `Hay ${p.groups} grupos. Cada grupo tiene ${p.perGroup} ${objects}. ¿Cuántos ${objects} hay en total?`;
  }
  if (kind === "mul_skip_count_g1") {
    const seq = Array.isArray(p.seq) ? p.seq : [];
    const head = seq.slice(0, -1).join(", ");
    return `Cuenta de ${p.perGroup} en ${p.perGroup}: ${head}, ${BLANK}`;
  }
  if (kind === "ns_number_line" || kind === "ns_number_line_g1") {
    const nums = Array.isArray(p.numbers) ? p.numbers : [];
    const line = nums.map((n) => (n === BLANK || n === "__" ? BLANK : n)).join(" - ");
    return `Completa el número que falta en la recta numérica: ${line}`;
  }
  if (kind === "ns_even_odd" || kind === "ns_parity") {
    return `¿${p.n ?? p.num} es un número par?`;
  }
  if (kind === "frac_half" || kind === "frac_half_reverse") {
    if (kind === "frac_half_reverse" && p.whole != null) {
      return `La mitad de ${BLANK} es ${p.whole / 2}. ¿Cuál es el número completo?`;
    }
    return `¿Cuánto es la mitad de ${p.whole ?? p.n}?`;
  }
  if (kind === "frac_quarter" || kind === "frac_quarter_reverse") {
    if (kind === "frac_quarter_reverse" && p.whole != null) {
      return `Un cuarto de ${BLANK} es ${p.whole / 4}. ¿Cuál es el número completo?`;
    }
    return `¿Cuánto es un cuarto de ${p.whole ?? p.n}?`;
  }
  if (
    kind === "frac_compare_like_den_g4" |
    kind === "frac_compare_like_den_g3" |
    kind === "frac_compare_same_den"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      return `¿Qué fracción es mayor — ${p.n1}/${p.den} o ${p.n2}/${p.den}? Escribe la fracción mayor: ${BLANK}`;
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
      return `Simplifica la fracción ${p.num}/${p.den}: ${BLANK}`;
    }
  }
  if (kind === "frac_equivalent_expand" || kind === "frac_equivalent") {
    if (p.num != null && p.den != null && p.factor != null) {
      return `Halla una fracción equivalente de ${p.num}/${p.den} (multiplica por ${p.factor}): ${BLANK}`;
    }
  }
  if (kind === "wp_simple_add" || kind === "wp_simple_add_g2") {
    if (kind === "wp_simple_add_g2") {
      return `Había ${p.a} niños en clase y se unieron ${p.b} más. ¿Cuántos niños hay ahora?`;
    }
    return `Leo tiene ${p.a} pelotas y recibe ${p.b} más. ¿Cuántas pelotas tiene Leo en total?`;
  }
  if (kind === "wp_simple_sub" || kind === "wp_simple_sub_g2") {
    if (kind === "wp_simple_sub_g2") {
      return `Hay ${p.total} manzanas en una canasta. Se comieron ${p.give}. ¿Cuántas manzanas quedan?`;
    }
    return `Leo tiene ${p.total} calcomanías. Le da ${p.give} a un amigo. ¿Cuántas calcomanías le quedan a Leo?`;
  }
  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `Emma tiene ${p.money} dólares. Compra un refrigerio por ${p.toy} dólares. ¿Cuánto dinero le queda?`;
  }
  if (kind === "wp_groups_g2") {
    return `Cada fila tiene ${p.per} sillas. Hay ${p.groups} filas así. ¿Cuántas sillas hay en total?`;
  }
  if (kind === "wp_groups_g3") {
    return `Cada caja tiene ${p.per} lápices. Hay ${p.groups} cajas. ¿Cuántos lápices hay en total?`;
  }
  if (kind === "wp_groups_g4") {
    return `Cada estante tiene ${p.per} libros. Hay ${p.groups} estantes. ¿Cuántos libros hay en total?`;
  }
  if (kind === "wp_groups_late_g6") {
    return `Cada contenedor tiene ${p.per} piezas. Se entregaron ${p.groups} contenedores. ¿Cuántas piezas hay en total?`;
  }
  if (kind === "wp_groups" || kind === "wp_groups_late") {
    return `Cada caja de suministro tiene ${p.per} paquetes. Se entregaron ${p.groups} cajas. ¿Cuántos paquetes hay en total?`;
  }
  if (kind === "wp_comparison_more") {
    return `Noa tiene ${p.big} cartas y Yuval tiene ${p.small}. ¿Cuántas cartas más tiene Noa que Yuval?`;
  }
  if (kind === "wp_part_whole_g4") {
    return `Un salón tiene ${p.whole} asientos. ${p.partA} están ocupados para un espectáculo y el resto están vacíos. ¿Cuántos asientos están vacíos?`;
  }
  if (kind === "wp_part_whole") {
    return `Una clase tiene ${p.whole} estudiantes. ${p.partA} están en el club de fútbol y el resto en el club de ajedrez. ¿Cuántos estudiantes están en el club de ajedrez?`;
  }
  if (kind === "wp_change_stack_g4") {
    return `Un almacén tenía ${p.start} cajas. Se agregaron ${p.gain} cajas nuevas y se enviaron ${p.loss} a otra sucursal. ¿Cuántas cajas quedan?`;
  }
  if (kind === "wp_change_stack") {
    return `Una biblioteca tenía ${p.start} libros. Se agregaron ${p.gain} libros nuevos y se prestaron ${p.loss}. ¿Cuántos libros hay ahora en la biblioteca?`;
  }
  if (kind === "wp_time_days") {
    const start = WEEKDAYS_ES[p.startDayIdx] || "Monday";
    const end = WEEKDAYS_ES[p.endDayIdx] || "Friday";
    return `Si hoy es ${start}, ¿cuántos días faltan hasta ${end}?`;
  }
  if (kind === "wp_time_date") {
    return `Si hoy es el día ${p.today} del mes, ¿qué fecha será dentro de ${p.daysLater} días?`;
  }
  if (kind === "wp_coins") {
    return `Leo tiene ${p.coins1} monedas de un dólar y ${p.coins2} monedas de dos dólares. ¿Cuánto dinero tiene en total?`;
  }
  if (kind === "wp_coins_spent") {
    return `Leo tiene ${p.total} dólares en monedas. Compra dulces por ${p.spent} dólares. ¿Cuánto dinero le queda?`;
  }
  if (kind === "wp_division_simple") {
    return `Hay ${p.total} manzanas divididas en grupos de ${p.perGroup} manzanas cada uno. ¿Cuántos grupos hay?`;
  }
  if (kind === "wp_leftover") {
    return `${p.total} estudiantes se dividen en grupos de ${p.groupSize}. ¿Cuántos estudiantes quedan sin un grupo completo?`;
  }
  if (kind === "wp_shop_discount") {
    return `Una camisa cuesta ${p.price} dólares con un descuento del ${p.discPerc}%. ¿Cuánto pagas después del descuento?`;
  }
  if (kind === "wp_unit_cm_to_m") {
    return `¿Cuántos metros son ${p.cm} centímetros? = ${BLANK}`;
  }
  if (kind === "wp_unit_g_to_kg") {
    return `¿Cuántos kilogramos son ${p.g} gramos? = ${BLANK}`;
  }
  if (kind === "wp_distance_time") {
    return `Un niño camina a una velocidad constante de ${p.speed} km/h durante ${p.hours} horas. ¿Cuántos kilómetros recorrerá?`;
  }
  if (kind === "wp_time_sum") {
    return `Un video dura ${p.l1} minutos y otro dura ${p.l2} minutos. ¿Cuántos minutos duran los dos juntos?`;
  }
  if (kind === "wp_average" || kind === "wp_average_g6") {
    if (kind === "wp_average_g6") {
      return `Un proyecto grupal obtuvo las puntuaciones ${p.s1}, ${p.s2} y ${p.s3} en tres etapas. ¿Cuál es el promedio (redondeado a un número entero)?`;
    }
    return `Leo obtuvo ${p.s1}, ${p.s2} y ${p.s3} en tres pruebas. ¿Cuál es su promedio (redondeado a un número entero)?`;
  }
  if (kind === "wp_multi_step" || kind === "wp_multi_step_g6") {
    return `Leo tiene ${p.money} dólares. Compra ${p.a} bolígrafos y ${p.b} lápices, y cada artículo cuesta ${p.price} dólares. ¿Cuánto dinero le queda después de comprar?`;
  }
  if (kind === "operation_choice_word_problem_probe") {
    return `Hay ${p.groups} grupos con ${p.each} artículos en cada grupo. ¿Qué operación encuentra el total?`;
  }

  if (kind.startsWith("wp_") || inferSelectedOp(question) === "word_problems") {
    return null;
  }

  return applyMathLevelPresentationEs419(
    String(question?.question || question?.exerciseText || ""),
    {
      selectedOp: question?.operation || inferSelectedOp(question),
      params: p,
      mathLevelKey: inferMathLevelKey(question),
      gradeKey,
    }
  );
}

/** English mirror of applyMathLevelPresentation (math-question-generator.js). */
export function applyMathLevelPresentationEs419(question, ctx) {
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
        return `Completa ${c}: ¿qué le sumas a ${b} para llegar a ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Dado ${b} + ${BLANK} = ${c}. ¿Cuál es el número que falta?`;
      }
      return `Problema: a ${b} le falta una parte para llegar a ${c} — ¿cuánto hay que sumar? = ${BLANK}`;
    }
  }

  if (kind === "ns_complement10") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 10;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Hasta ${c}: ¿qué le sumas a ${b} para terminar en ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Falta en la ecuación: ${b} + ${BLANK} = ${c}`;
      }
      return `Sin columna: ¿qué suma hasta ${c} empieza con ${b}? = ${BLANK}`;
    }
  }

  if (kind === "scale_find") {
    const ml = params?.mapLength;
    const rl = params?.realLength;
    if (ml != null && rl != null) {
      if (mathLevelKey === "easy") {
        return `En un mapa, un segmento mide ${ml} cm y en la vida real mide ${rl} cm. Completa la escala como 1:${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Largo en el mapa ${ml} cm, largo real ${rl} cm. ¿Cuál es la escala? Escribe el número después de 1: = ${BLANK}`;
      }
      return `Mapa ${ml} cm y real ${rl} cm — la escala es 1:__. ¿Cuál es el número que falta? = ${BLANK}`;
    }
  }

  if (kind === "scale_map_to_real") {
    const ml = params?.mapLength;
    const sc = params?.scale;
    if (ml != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `A escala 1:${sc}, ¿cuántos cm reales equivalen a ${ml} cm en el mapa? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Escala 1:${sc}. Una medida de ${ml} cm en el mapa — ¿cuál es el largo real en cm? = ${BLANK}`;
      }
      return `Escala 1:${sc}, medida del mapa ${ml} cm — halla el largo real en cm = ${BLANK}`;
    }
  }

  if (kind === "scale_real_to_map") {
    const rl = params?.realLength;
    const sc = params?.scale;
    if (rl != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `A escala 1:${sc}, largo real ${rl} cm — ¿cuántos cm en el mapa? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Largo real ${rl} cm, escala 1:${sc}. ¿Cuál es el largo en el mapa? = ${BLANK}`;
      }
      return `Convierte de real a mapa: ${rl} cm reales a 1:${sc} — ¿cuántos cm en la página? = ${BLANK}`;
    }
  }

  if (selectedOp === "compare" || kind === "cmp") {
    const raw = params?.exerciseText ? String(params.exerciseText) : "";
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 4;
    if (mathLevelKey === "easy") {
      const opts = [
        `Compara los dos números y completa (<, =, >): ${raw}`,
        `Signo de comparación entre los números: ${raw}`,
        `Elige < , = o > — compara: ${raw}`,
        `Compara los valores y completa el signo: ${raw}`];
      return opts[pv].trim();
    }
    if (mathLevelKey === "medium") {
      const opts = [
        `Completa el signo de comparación correcto: ${raw}`,
        `¿Qué signo compara el par? ${raw}`,
        `Elige el signo de comparación correcto: ${raw}`,
        `Completa el signo entre las expresiones numéricas: ${raw}`];
      return opts[pv].trim();
    }
    const opts = [
      `Completa el signo de comparación — revisa antes de elegir: ${raw}`,
      `Compara con cuidado y elige un signo: ${raw}`,
      `Compara con cuidado y elige un signo: ${raw}`,
      `Revisión rápida: ¿qué signo corresponde? ${raw}`];
    return opts[pv].trim();
  }

  if (selectedOp === "divisibility" || kind === "divisibility") {
    const num = params?.num;
    const div = params?.divisor;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (num != null && div != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Divisibilidad: ¿${num} se divide exactamente entre ${div}?`
          : `Revisa: ¿${num} es múltiplo de ${div} (sin residuo)?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Reglas de divisibilidad — ¿${num} se divide entre ${div}?`
          : `División exacta: ${num} ÷ ${div} — ¿el resultado es un número entero?`;
      }
      return pv === 0
        ? `Comprobación de divisibilidad: ¿${num} se divide entre ${div}?`
        : `Divisores: ¿${div} divide exactamente a ${num}?`;
    }
  }

  if (selectedOp === "prime_composite" || kind === "prime_composite") {
    const num = params?.num;
    const subKind = String(params?.subKind || "pc_classify");
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (subKind === "pc_factor_count" && num != null) {
      if (mathLevelKey === "easy") return `Números primos: ¿cuántos divisores tiene ${num}?`;
      if (mathLevelKey === "medium") {
        return `Cuenta divisores: ¿cuántos divisores naturales tiene ${num} (incluyendo 1 y él mismo)?`;
      }
      return `Divisores: ¿cuántos divisores diferentes tiene ${num}?`;
    }
    if (subKind === "pc_smallest_prime" && num != null) {
      if (mathLevelKey === "easy") return `Factor primo: ¿cuál es el menor factor primo de ${num}?`;
      if (mathLevelKey === "medium") return `Halla el menor factor primo de ${num}.`;
      return `Factores: ¿cuál es el menor factor primo de ${num}?`;
    }
    if (subKind === "pc_divisor_pick" && num != null && params?.divisorCandidate != null) {
      const d = params.divisorCandidate;
      if (mathLevelKey === "easy") return `Comprobación de divisor: ¿${d} divide exactamente a ${num}?`;
      if (mathLevelKey === "medium") return `Divisores: ¿${num} se divide entre ${d}?`;
      return `Divisores: ¿${d} divide exactamente a ${num}?`;
    }
    if (num != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Números primos: ¿${num} es primo o compuesto?`
          : `Clasificación básica: ${num} — ¿primo o compuesto?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Clasifica el número: ${num} — ¿primo o compuesto?`
          : `¿${num} tiene exactamente dos divisores naturales diferentes?`;
      }
      return pv === 0
        ? `¿${num} es primo o compuesto? Piensa antes de elegir.`
        : `Prueba rápida: ¿se puede dividir ${num} en dos factores mayores que 1?`;
    }
  }

  if (selectedOp === "powers" && (kind === "power_base" || kind === "power_calc")) {
    if (kind === "power_calc") {
      if (mathLevelKey === "easy") return `Potencias: ${q0}`;
      if (mathLevelKey === "medium") return `Evalúa la potencia — ${q0}`;
      return `Potencias: ${q0}`;
    }
    if (kind === "power_base") {
      if (mathLevelKey === "easy") return `Halla la base en la potencia: ${q0}`;
      if (mathLevelKey === "medium") return `Acertijo de potencias — ${q0}`;
      return `Base que falta en la potencia: ${q0}`;
    }
  }

  if (selectedOp === "estimation") {
    if (kind === "est_add") {
      if (mathLevelKey === "easy") return q0.replace(/^Estima\b/i, "Rounding Estima: Estima");
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
    if (mathLevelKey === "easy") return `Fracciones: ${q0}`;
    if (mathLevelKey === "medium") return `Fracción como parte de un entero: ${q0}`;
    return `Fracciones: ${q0}`;
  }

  if (kind === "fm_factor") {
    if (mathLevelKey === "easy") return `Factores: ${q0}`;
    if (mathLevelKey === "medium") return `Identifica un divisor: ${q0}`;
    return `Divisores y factores: ${q0}`;
  }
  if (kind === "fm_multiple") {
    if (mathLevelKey === "easy") return `Múltiplos: ${q0}`;
    if (mathLevelKey === "medium") return `Revisa múltiplos: ${q0}`;
    return `Múltiplos: ${q0}`;
  }

  if (selectedOp === "percentages" || selectedOp === "ratio" || selectedOp === "scale") return q0;

  if (kind === "fm_gcd" && params?.a != null && params?.b != null) {
    const { a, b } = params;
    if (mathLevelKey === "easy") {
      return `MCD: ¿cuál es el máximo común divisor de ${a} y ${b}? = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return `Máximo común divisor (MCD) de ${a} y ${b} — ¿cuál es? = ${BLANK}`;
    }
    return `MCD: piensa primero — MCD(${a}, ${b}) = ${BLANK}`;
  }

  if (kind === "round" && params?.n != null && params?.toWhat != null) {
    const { n, toWhat } = params;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (toWhat === 10) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Redondea a decenas: ¿a qué se redondea ${n}? = ${BLANK}`
          : `Decena más cercana: ${n} → ? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Redondea ${n} a la decena más cercana — ¿resultado? = ${BLANK}`
          : `Regla de redondeo a decenas: ${n} = ${BLANK}`;
      }
      return pv === 0
        ? `Redondea a decenas: ${n} → ? = ${BLANK}`
        : `Número correcto después de redondear ${n} a decenas = ${BLANK}`;
    }
    if (mathLevelKey === "easy") {
      return pv === 0
        ? `Redondea a centenas: ¿a qué se redondea ${n}? = ${BLANK}`
        : `Centena más cercana: ${n} = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return pv === 0
        ? `Redondea ${n} a la centena más cercana — ¿resultado? = ${BLANK}`
        : `Redondea a centenas: ${n} → ? = ${BLANK}`;
    }
    return pv === 0
      ? `Redondea a centenas: ${n} → ? = ${BLANK}`
      : `Número después de redondear ${n} a centenas = ${BLANK}`;
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
            ? `Suma decimales: ${af} + ${bf} = ${BLANK}`
            : `Suma directa: ${af} + ${bf} = ${BLANK}`;
        }
        return `Suma decimales: ${af} + ${bf} = ${BLANK}`;
      }
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Resta decimales: ${af} − ${bf} = ${BLANK}`
          : `Diferencia directa: ${af} − ${bf} = ${BLANK}`;
      }
      return `Resta decimales: ${af} − ${bf} = ${BLANK}`;
    }
  }

  if (selectedOp === "sequences") {
    if (mathLevelKey === "easy") {
      return q0.replace(/^Continúa la secuencia\b/i, "Continúa el patrón numérico");
    }
    return q0;
  }

  const looksNumericEjercicio =
    /=\s*__|=\s*\?\?|___|\?\?=/.test(q0) |
    (/^\d/.test(q0.trim()) && /[+\-×÷]/.test(q0));

  if (looksNumericEjercicio) return q0;
  if (/^Ejercicio\b/i.test(q0)) return q0;

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

  const rebuilt = rebuildMathStemEs419(question);
  if (rebuilt && !containsHebrew(rebuilt) && (_field === "question" || _field === "exerciseText" || _field === "questionLabel")) {
    return rebuilt;
  }

  const presented = applyMathLevelPresentationEs419(text, {
    selectedOp: question?.operation || inferSelectedOp(question),
    params: question?.params || {},
    mathLevelKey: inferMathLevelKey(question),
    gradeKey: question?.gradeKey || "g3",
  });
  if (presented && !containsHebrew(presented)) return presented;

  const phrased = applyMathPhrases(text);
  if (!containsHebrew(phrased)) return phrased;

  const stripped = phrased
    .replace(/(\d+)\s+remainder\s+(\d+)/gu, "$1 residuo $2")
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

const OP_SYMBOL_EN = Object.freeze({
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
  const rebuilt = rebuildMathStemEs419(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  if (a != null && b != null && OP_SYMBOL_EN[opRaw]) {
    return { stem: `¿Cuánto es ${a} ${OP_SYMBOL_EN[opRaw]} ${b}?`, source: "generic" };
  }
  for (const candidate of [p.exerciseText, question?.exerciseText, question?.question]) {
    if (typeof candidate === "string" && candidate.trim() && !containsHebrew(candidate)) {
      return { stem: String(candidate).trim(), source: "passthrough" };
    }
  }
  return { stem: null, source: "none" };
}

/**
 * Localize math question for LatAm Spanish (es-419) display.
 * Display stems come from params/kind templates — not from translating Hebrew prose.
 * Option tokens use closed dictionaries (logical labels), not sentence MT.
 */
export function localizeMathQuestionEs419(question) {
  if (!question) return question;

  const base = { ...question };
  // Drop authored Hebrew stems so params are the sole stem authority.
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const { stem, source } = resolveMathDisplayStem({ ...question, ...base, params: question.params });
  const resolvedStem = stem || "Resuelve.";

  const out = mapQuestionTextFields({ ...base }, (field, value, q) => {
    if (field === "question" || field === "exerciseText" || field === "questionLabel") {
      if (!value || containsHebrew(value) || isNearlyEmptyStem(value)) return resolvedStem;
      return value;
    }
    // Answers/options: closed token maps only (no full-sentence HE→ES).
    if (isShortAnswerField(field)) {
      const text = String(value ?? "");
      if (YES_NO[text.trim()]) return YES_NO[text.trim()];
      if (PRIME_COMPOSITE[text.trim()]) return PRIME_COMPOSITE[text.trim()];
      if (PARITY[text.trim()]) return PARITY[text.trim()];
      if (OBJECTS_ES[text.trim()]) return OBJECTS_ES[text.trim()];
      if (!containsHebrew(text)) return text;
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
