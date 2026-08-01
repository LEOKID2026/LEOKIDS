/**
 * Generate out-body-00..02.json from batch files + inline es-419 translations.
 */
import fs from "fs";
import path from "path";

const DIR = "reports/science-es419";

/** @type {Record<string, { stem: string, options: string[], explanation: string, theoryLines?: string[] }>} */
const T = {
  body_1: {
    stem: "¿Dónde se encuentra el corazón en el cuerpo humano?",
    options: [
      "en el pecho, en el lado derecho del cuerpo",
      "en el pecho, ligeramente a la izquierda del centro",
      "en la parte superior del abdomen, cerca del hígado",
      "a la altura del cuello, detrás de la tráquea",
    ],
    explanation:
      "El corazón está en el pecho, ligeramente a la izquierda de la línea media, y bombea sangre por todo el cuerpo.",
    theoryLines: [
      "El corazón es un músculo que trabaja sin detenerse.",
      "Bombea sangre que lleva oxígeno y nutrientes a todas las partes del cuerpo.",
    ],
  },
  body_2: {
    stem: "¿Qué órgano usamos para ver?",
    options: ["Oídos", "Ojos", "Nariz", "Lengua"],
    explanation: "Los ojos reciben la luz para que el cerebro forme una imagen de lo que nos rodea.",
    theoryLines: [
      "Los cinco sentidos principales son la vista, el oído, el olfato, el gusto y el tacto.",
      "Los ojos envían señales al cerebro a través del nervio óptico.",
    ],
  },
  body_3: {
    stem: "¿Cuál es la función principal del sistema respiratorio?",
    options: [
      "Mover sangre que ya tiene oxígeno hacia los tejidos del cuerpo",
      "Intercambiar oxígeno y dióxido de carbono con el aire",
      "Descomponer los alimentos en materiales pequeños en los intestinos",
      "Sostener el cuerpo, proteger los órganos y ayudar con el movimiento",
    ],
    explanation:
      "El sistema respiratorio trae el oxígeno que necesitan las células y ayuda al cuerpo a eliminar el dióxido de carbono.",
    theoryLines: [
      "El sistema respiratorio incluye la nariz, la tráquea y los pulmones.",
      "El intercambio de gases entre el aire y la sangre ocurre dentro de los pulmones.",
    ],
  },
  body_4: {
    stem: "¿Cómo ayudan los músculos y el esqueleto a mover el cuerpo?",
    options: [
      "Los músculos tiran de los huesos para crear movimiento",
      "Los huesos se mueven solos, sin músculos",
      "El cuerpo se mueve sin usar músculos ni huesos",
      "El movimiento proviene solo de la respiración",
    ],
    explanation: "Los huesos dan al cuerpo una estructura, y los músculos tiran de esos huesos para que puedas moverte.",
    theoryLines: [
      "Sin esqueleto, el cuerpo sería blando e inestable.",
      "Sin músculos, los huesos no podrían moverse por sí solos.",
    ],
  },
  body_5: {
    stem: "¿Qué oración describe mejor la función del sistema circulatorio?",
    options: [
      "Digiere los alimentos y los descompone en materiales simples.",
      "Lleva señales nerviosas entre el cerebro y los músculos.",
      "Mueve sangre que transporta oxígeno y nutrientes y elimina desechos.",
      "Protege el cuerpo principalmente a través de la piel, no mediante el flujo sanguíneo.",
    ],
    explanation:
      "El corazón, los vasos sanguíneos y la sangre trabajan juntos para entregar materiales útiles y llevar los desechos.",
    theoryLines: [
      "La sangre fluye por arterias, venas y pequeños capilares.",
      "El corazón actúa como una bomba que mantiene la sangre en movimiento por todo el cuerpo.",
    ],
  },
  body_6: {
    stem: "¿Cuál es la función principal del sistema nervioso?",
    options: [
      "Coordinar y enviar información entre las partes del cuerpo",
      "Solo almacenar energía, sin relación con la información",
      "Solo mantener los sistemas del cuerpo completamente separados",
      "Solo mantener caliente el cuerpo",
    ],
    explanation:
      "El sistema nervioso recoge información sensorial, la procesa en el cerebro y envía instrucciones a músculos y órganos.",
    theoryLines: [
      "El sistema nervioso incluye el cerebro, la médula espinal y muchos nervios.",
      "Los nervios transportan señales eléctricas rápidas por todo el cuerpo.",
    ],
  },
  body_7: {
    stem: "¿Qué órgano usamos para oír?",
    options: ["Ojos", "Oídos", "Nariz", "Lengua"],
    explanation: "Los oídos son el órgano del oído. A través de ellos, el sonido llega al cerebro.",
    theoryLines: [
      "Los oídos son el órgano del oído.",
      "El sonido entra por los oídos y viaja al cerebro.",
    ],
  },
  body_8: {
    stem: "¿Cuál es la función de la boca?",
    options: [
      "Digierir completamente los alimentos como lo hace el estómago",
      "Comer, beber y hablar",
      "Enviar alimentos totalmente absorbidos directamente a la sangre",
      "Intercambiar oxígeno en la sangre con el aire en cada respiración",
    ],
    explanation:
      "La boca se usa para comer, beber y hablar. Los dientes mastican los alimentos y la lengua ayuda con el gusto.",
    theoryLines: [
      "La boca es el inicio del sistema digestivo.",
      "La lengua te ayuda a saborear los alimentos y formar palabras.",
    ],
  },
  body_9: {
    stem: "¿Cuál es la función de las manos?",
    options: [
      "Dar oxígeno solo a los músculos de la mano a través de la piel de las palmas",
      "Sostener, tocar y realizar acciones precisas",
      "Mover las mismas articulaciones que controlan principalmente las piernas",
      "Transportar sangre filtrada desde los riñones hasta el cerebro",
    ],
    explanation: "Las manos te ayudan a sostener objetos, sentir texturas y hacer tareas cuidadosas con los dedos.",
    theoryLines: [
      "Las manos ayudan con el trabajo, el juego y el cuidado personal.",
      "Las yemas de los dedos son especialmente sensibles al tacto.",
    ],
  },
  body_10: {
    stem: "¿Cuál es la función de las piernas?",
    options: [
      "Captar olores y enviarlos al cerebro como la nariz",
      "Caminar, correr y saltar",
      "Intercambiar gases entre la sangre y el aire como los pulmones",
      "Mover principalmente los brazos a través de las articulaciones del hombro",
    ],
    explanation: "Las piernas sostienen movimientos como caminar, correr y saltar.",
    theoryLines: [
      "Las piernas son lo bastante fuertes para sostener el peso del cuerpo.",
      "Dos piernas ayudan a las personas a mantenerse de pie y caminar erguidas.",
    ],
  },
  body_11: {
    stem: "¿Cuántos sentidos principales tienen las personas?",
    options: [
      "Cinco: vista, oído, olfato, gusto y tacto",
      "Tres: solo vista, oído y gusto",
      "Dos: generalmente solo vista y oído",
      "Siete sentidos, iguales para todos los animales",
    ],
    explanation: "Las personas tienen cinco sentidos principales que les ayudan a entender el mundo.",
    theoryLines: [
      "Cada sentido trabaja con un órgano diferente del cuerpo.",
      "Los sentidos ayudan a mantenernos seguros y a aprender.",
    ],
  },
  body_12: {
    stem: "¿Cuál es el primer órgano digestivo del cuerpo?",
    options: ["Estómago", "Boca", "Intestino delgado", "Esófago"],
    explanation: "La digestión comienza en la boca, donde se mastican los alimentos y se mezclan con saliva.",
    theoryLines: [
      "El sistema digestivo comienza en la boca y termina en el ano.",
      "La saliva ayuda a descomponer los alimentos y facilita la deglución.",
    ],
  },
  body_13: {
    stem: "¿Cuál es la función de los pulmones?",
    options: [
      "Descomponer los alimentos en materiales pequeños absorbidos en el intestino",
      "Respirar: traer oxígeno y eliminar dióxido de carbono",
      "Bombear sangre por todo el cuerpo como una bomba central",
      "Filtrar desechos y equilibrar agua y sales en la sangre",
    ],
    explanation:
      "Los pulmones toman oxígeno del aire hacia la sangre y liberan dióxido de carbono fuera del cuerpo.",
    theoryLines: [
      "Las personas tienen dos pulmones: uno a la derecha y otro a la izquierda.",
      "La caja torácica ayuda a proteger los pulmones.",
    ],
  },
  body_14: {
    stem: "¿Cuál es la función principal de los huesos en el cuerpo humano?",
    options: [
      "Los huesos descomponen y absorben los alimentos durante la digestión.",
      "Los huesos sostienen la forma del cuerpo y protegen órganos importantes como el cerebro y el corazón.",
      "Los huesos bombean sangre por todo el cuerpo.",
      "Los huesos producen el oxígeno que respiramos.",
    ],
    explanation:
      "Los huesos forman el esqueleto, que da forma y soporte al cuerpo y protege órganos vitales. También trabajan con los músculos para permitir el movimiento.",
    theoryLines: [
      "El cuerpo humano tiene 206 huesos.",
      "Los huesos protegen órganos vitales como el cerebro, el corazón y los pulmones.",
    ],
  },
  body_15: {
    stem: "¿Cuál es la función del sistema digestivo?",
    options: [
      "Intercambiar gases entre la sangre y el aire en los pulmones",
      "Descomponer los alimentos en materiales pequeños que el cuerpo puede usar",
      "Transportar oxígeno y nutrientes en los vasos sanguíneos a todos los tejidos",
      "Captar información sensorial y enviar señales rápidas",
    ],
    explanation:
      "El sistema digestivo descompone los alimentos en nutrientes que el cuerpo puede absorber para obtener energía y crecer.",
    theoryLines: [
      "El sistema digestivo incluye la boca, el esófago, el estómago y los intestinos.",
      "El estómago usa ácidos y enzimas para descomponer los alimentos.",
    ],
  },
  body_16: {
    stem: "¿Cuál es la función principal de los músculos en el cuerpo humano?",
    options: [
      "Los músculos digieren los alimentos y absorben nutrientes.",
      "Los músculos crean la fuerza necesaria para el movimiento al contraerse y relajarse.",
      "Los músculos producen glóbulos rojos para el sistema circulatorio.",
      "Los músculos transportan señales de luz desde los ojos al cerebro.",
    ],
    explanation:
      "Los músculos están unidos a los huesos. Cuando un músculo se contrae, tira del hueso y crea movimiento. Los músculos trabajan en pares: cuando uno se contrae, el otro se relaja.",
    theoryLines: [
      "Hay tres tipos de músculos: esqueléticos, lisos y cardíacos.",
      "Los músculos trabajan en pares: cuando uno se contrae, el otro se relaja.",
    ],
  },
  body_17: {
    stem: "¿Cuál es la función del cerebro?",
    options: [
      "Digiere los alimentos en el estómago.",
      "Es el centro de control del cuerpo: recibe señales del cuerpo y envía instrucciones para controlar el movimiento, el pensamiento y las emociones.",
      "Bombea sangre a todas las partes del cuerpo.",
      "Lleva oxígeno a la sangre.",
    ],
    explanation:
      "El cerebro es el centro de control del sistema nervioso. Recibe información de los sentidos, la procesa y envía señales a músculos y órganos. También controla el pensamiento, la memoria y las emociones.",
    theoryLines: [
      "El cerebro está protegido por el cráneo y se conecta con el cuerpo a través de la médula espinal.",
      "Los nervios transportan mensajes entre el cerebro y cada parte del cuerpo.",
    ],
  },
  body_18: {
    stem: "¿Cuál es la función de los riñones en el cuerpo humano?",
    options: [
      "Descomponer los alimentos y producir bilis",
      "Filtrar desechos de la sangre y eliminarlos en la orina",
      "Bombear sangre como el corazón",
      "Intercambiar oxígeno con dióxido de carbono",
    ],
    explanation:
      "Los riñones filtran la sangre, eliminan desechos y agua extra, y producen orina que sale del cuerpo.",
    theoryLines: [
      "Las personas tienen dos riñones.",
      "Los riñones ayudan a mantener el equilibrio de líquidos del cuerpo.",
    ],
  },
  body_19: {
    stem: "¿Cuál es el órgano más grande del cuerpo humano?",
    options: ["Piel", "Corazón", "Cerebro", "Hígado"],
    explanation: "La piel es el órgano más grande del cuerpo. Cubre el cuerpo y ayuda a protegerlo.",
    theoryLines: [
      "La piel ayuda a bloquear gérmenes y lesiones.",
      "La piel también ayuda a mantener estable la temperatura del cuerpo.",
    ],
  },
  body_20: {
    stem: "¿Cuál es la función del sistema inmunitario?",
    options: [
      "Descomponer grasas y azúcares en materiales de construcción en los intestinos",
      "Combatir bacterias y virus y proteger el cuerpo de enfermedades",
      "Transportar sangre rica en oxígeno sin detectar gérmenes",
      "Reaccionar solo a picaduras de insectos sin crear memoria inmune",
    ],
    explanation: "El sistema inmunitario encuentra y ataca los gérmenes que invaden el cuerpo.",
    theoryLines: [
      "Los glóbulos blancos forman parte del sistema inmunitario.",
      "Cuando estás enfermo, el sistema inmunitario trabaja con más intensidad.",
    ],
  },
  body_21: {
    stem: "¿Cómo funciona el sistema digestivo?",
    options: [
      "La digestión ocurre solo en la boca, sin estómago ni intestinos",
      "Los alimentos pasan por la boca, el estómago y los intestinos para descomponerse y absorberse en la sangre",
      "La descomposición ocurre solo en el estómago, sin intestinos después",
      "La absorción ocurre en los intestinos sin etapa de boca ni estómago",
    ],
    explanation:
      "Los alimentos se mastican, se descomponen en el estómago y se absorben en los intestinos. Los desechos salen del cuerpo.",
    theoryLines: [
      "El sistema digestivo es largo y tiene muchas partes.",
      "Cada parte tiene una función importante.",
    ],
  },
  body_22: {
    stem: "¿Cuál es la función de las hormonas?",
    options: [
      "Mover los alimentos de un lugar a otro apretando músculo liso",
      "Transportar mensajes entre órganos y ayudar a controlar el crecimiento, la energía y el estado de ánimo",
      "Empujar líquidos fuera del cuerpo a través de los pulmones",
      "Producir anticuerpos directamente en la superficie de la tráquea",
    ],
    explanation:
      "Las hormonas son mensajeros químicos de las glándulas. Ayudan a controlar el crecimiento, el metabolismo, el estado de ánimo y más.",
    theoryLines: [
      "Las glándulas producen hormonas.",
      "Las hormonas suelen actuar lentamente, pero pueden tener efectos duraderos.",
    ],
  },
  body_23: {
    stem: "¿Cuál es la función de la nariz?",
    options: [
      "Hacer la mayor parte del intercambio de gases como los pulmones",
      "Oler y tomar aire para respirar",
      "Intercambiar oxígeno en la sangre en cada exhalación",
      "Mover sangre del corazón al cerebro",
    ],
    explanation: "La nariz se usa para oler y respirar. El aire entra al cuerpo a través de ella.",
    theoryLines: [
      "La nariz forma parte del sistema respiratorio.",
      "Pelos diminutos en la nariz ayudan a filtrar el aire.",
    ],
  },
  body_24: {
    stem: "¿Cómo te ayuda la boca a comer los alimentos?",
    options: [
      "Tu nariz huele la comida y la descompone.",
      "Tus dientes mastican la comida en pedazos pequeños y tu lengua ayuda a moverla.",
      "El agua en tu boca disuelve toda la comida por completo.",
      "Tragás la comida entera sin necesidad de masticarla.",
    ],
    explanation:
      "Tus dientes mastican la comida en pedazos más pequeños, lo que facilita tragarla y digerirla. Tu lengua ayuda a mover la comida dentro de la boca.",
    theoryLines: [
      "Los dientes descomponen la comida en pedazos más pequeños durante la masticación.",
      "La lengua ayuda a guiar la comida hacia la garganta para tragarla.",
    ],
  },
  body_25: {
    stem: "¿Cuántos ojos tienen la mayoría de las personas?",
    options: ["Dos", "Uno", "Tres", "Cuatro"],
    explanation: "La mayoría de las personas tienen dos ojos, que ayudan con la distancia y la percepción de profundidad.",
    theoryLines: [
      "Dos ojos te ayudan a ver en tres dimensiones.",
      "Los ojos trabajan juntos.",
    ],
  },
  body_26: {
    stem: "¿Qué hay dentro del cuerpo?",
    options: [
      "Un esqueleto de huesos sin órganos blandos",
      "Órganos internos como el corazón, los pulmones, el estómago y más",
      "Solo un corazón, sin pulmones ni otros órganos",
      "Solo pulmones, sin corazón ni riñones",
    ],
    explanation:
      "Dentro del cuerpo hay muchos órganos—corazón, pulmones, estómago, intestinos, hígado, riñones y más—cada uno con una función importante.",
    theoryLines: [
      "El cuerpo está formado por órganos que trabajan juntos.",
      "Cada órgano tiene un papel especial.",
    ],
  },
  body_27: {
    stem: "¿Cuál es la función del esqueleto?",
    options: [
      "Bombear sangre a todas las partes del cuerpo.",
      "Sostener la forma del cuerpo, proteger órganos como el cerebro y trabajar con los músculos para permitir el movimiento.",
      "Los huesos reemplazan a los músculos y manejan todo el movimiento solos.",
      "Transportar nutrientes a través de la sangre.",
    ],
    explanation:
      "El esqueleto da forma y soporte al cuerpo. Los huesos duros protegen órganos blandos; por ejemplo, el cráneo protege el cerebro y la caja torácica protege el corazón y los pulmones. Los músculos se unen a los huesos y tiran de ellos para crear movimiento.",
    theoryLines: [
      "El esqueleto humano está formado por más de 200 huesos.",
      "Las articulaciones son los lugares donde se encuentran dos huesos y permiten doblarse y moverse.",
    ],
  },
  body_29: {
    stem: "¿Cuál es la función del estómago?",
    options: [
      "Traer oxígeno al cuerpo.",
      "Descomponer los alimentos usando ácidos y músculos, y luego enviarlos a los intestinos.",
      "Bombear sangre a través del sistema circulatorio.",
      "Enviar señales del cuerpo al cerebro.",
    ],
    explanation:
      "El estómago es un órgano muscular del sistema digestivo. Usa ácido y movimientos de compresión para descomponer los alimentos en un líquido espeso. Ese líquido pasa luego al intestino delgado para seguir digiriéndose y absorbiéndose.",
    theoryLines: [
      "El estómago puede estirarse para contener alimentos después de una comida y encogerse cuando está vacío.",
      "El ácido estomacal descompone los alimentos y también elimina muchas bacterias dañinas.",
    ],
  },
  body_30: {
    stem: "¿Cuál es la función de los intestinos?",
    options: [
      "Filtrar gases dañinos del aire que respiramos.",
      "Absorber nutrientes de los alimentos digeridos hacia la sangre.",
      "Bombear sangre a todas las partes del cuerpo.",
      "Descomponer los alimentos de la misma manera que el estómago.",
    ],
    explanation:
      "Después de que el estómago descompone los alimentos, pasan al intestino delgado, donde los nutrientes se absorben en la sangre. El intestino grueso absorbe agua y expulsa los desechos restantes del cuerpo.",
    theoryLines: [
      "El intestino delgado es muy largo: en un adulto puede medir unos 6 metros.",
      "Las paredes del intestino delgado están cubiertas de proyecciones diminutas en forma de dedo que ayudan a absorber nutrientes rápidamente.",
    ],
  },
  body_31: {
    stem: "¿Cuál es la función del hígado?",
    options: [
      "Masticar y tragar los alimentos.",
      "Filtrar la sangre, eliminar desechos y ayudar al cuerpo a procesar y almacenar energía.",
      "Bombear sangre por todo el cuerpo.",
      "Traer aire y expulsar aire de los pulmones.",
    ],
    explanation:
      "El hígado es uno de los órganos más grandes del cuerpo. Limpia la sangre eliminando sustancias dañinas, descompone glóbulos rojos viejos y ayuda a procesar los nutrientes absorbidos de los alimentos para que el cuerpo los use como energía.",
    theoryLines: [
      "El hígado está en la parte superior derecha del abdomen, justo debajo de la caja torácica.",
      "El hígado realiza cientos de funciones diferentes para mantener sano el cuerpo.",
    ],
  },
  body_32: {
    stem: "¿Cuál es la función del sistema linfático?",
    options: [
      "Descomponer grasa en los intestinos con enzimas",
      "Ayudar a combatir infecciones y drenar líquido de los tejidos",
      "Solo mover sangre al ritmo del corazón",
      "Intercambiar aire en los pulmones en cada inhalación",
    ],
    explanation:
      "El sistema linfático incluye ganglios linfáticos, vasos y linfa. Ayuda a combatir gérmenes y drenar líquido extra.",
    theoryLines: [
      "Los ganglios linfáticos se encuentran en muchos lugares del cuerpo.",
      "Ayudan a evitar que las infecciones se propaguen.",
    ],
  },
  body_33: {
    stem: "¿Cuál es la función de la glándula tiroides?",
    options: [
      "Filtrar toxinas y producir bilis para digerir grasas",
      "Producir hormonas que controlan el metabolismo, el crecimiento y el uso de energía",
      "Empujar sangre rica en oxígeno desde las arterias hacia las arterias pulmonares",
      "Liberar insulina que controla principalmente el azúcar en las células musculares",
    ],
    explanation:
      "La tiroides produce hormonas que ayudan a controlar qué tan rápido el cuerpo usa energía y cómo crece.",
    theoryLines: [
      "La glándula tiroides está en el cuello.",
      "Es importante para el crecimiento y el desarrollo.",
    ],
  },
  body_34: {
    stem: "¿Qué hace el intestino delgado en el sistema digestivo?",
    options: [
      "Bombear sangre a todas las partes del cuerpo.",
      "Absorber nutrientes de los alimentos digeridos y pasarlos a la sangre.",
      "Mover aire dentro y fuera de los pulmones durante la respiración.",
      "Mantener unidos los huesos y proteger los órganos del cuerpo.",
    ],
    explanation:
      "El intestino delgado absorbe nutrientes de los alimentos digeridos y los transfiere al torrente sanguíneo, donde viajan a todas las partes del cuerpo.",
    theoryLines: [
      "El intestino delgado está ubicado después del estómago en el sistema digestivo.",
      "La mayor parte de la absorción de nutrientes ocurre dentro del intestino delgado.",
    ],
  },
  body_35: {
    stem: "¿Cuál es la función de la glándula suprarrenal?",
    options: [
      "Producir la insulina principal que controla el azúcar después de una comida",
      "Producir hormonas como la adrenalina para el estrés y las emergencias",
      "Hacer la primera descomposición de proteínas en el estómago",
      "Ser el órgano principal que controla la producción de glóbulos rojos sin función renal",
    ],
    explanation:
      "Las glándulas suprarrenales producen hormonas como la adrenalina que ayudan al cuerpo a responder al estrés y a las emergencias.",
    theoryLines: [
      "Las glándulas suprarrenales están sobre los riñones.",
      "La adrenalina ayuda al cuerpo a liberar energía rápidamente.",
    ],
  },
  body_37: {
    stem: "¿Cuál es la función de la piel?",
    options: [
      "Solo apariencia, sin papel protector",
      "Proteger el cuerpo, ayudar a controlar la temperatura y sentir el tacto",
      "Respirar principalmente a través de los poros",
      "Estabilizar el esqueleto sin nervios debajo",
    ],
    explanation:
      "La piel es el órgano más grande. Protege el cuerpo, ayuda a controlar la temperatura, siente el tacto y libera sudor.",
    theoryLines: [
      "La piel cubre todo el cuerpo.",
      "Es una barrera importante contra los gérmenes.",
    ],
  },
  "body_25__v2": {
    stem: "¿Cuál es la función del ojo?",
    options: ["Ver", "Oír", "Oler", "Saborear"],
    explanation: "El ojo nos permite ver el mundo que nos rodea.",
    theoryLines: [
      "El ojo es el órgano de la vista.",
      "Dos ojos nos ayudan a ver mejor.",
    ],
  },
  "body_31__v2": {
    stem: "¿Cuántos dedos hay en cada mano?",
    options: ["Cinco", "Cuatro", "Seis", "Tres"],
    explanation: "Cada mano suele tener cinco dedos: pulgar, índice, medio, anular y meñique.",
    theoryLines: [
      "Los dedos nos ayudan a sostener objetos.",
      "El pulgar ayuda a tener un agarre fuerte.",
    ],
  },
  "body_32__v2": {
    stem: "¿Qué tenemos en la cabeza?",
    options: ["Dientes", "Cabello", "Uñas", "Huesos"],
    explanation: "El cabello en la cabeza ayuda a proteger y mantener caliente la cabeza.",
    theoryLines: [
      "El cabello puede ser de muchos colores.",
      "El cabello sigue creciendo.",
    ],
  },
  "body_33__v2": {
    stem: "¿Cuál es la función de los dientes?",
    options: [
      "Ver con los ojos",
      "Oír con los oídos",
      "Masticar y cortar los alimentos",
      "Correr en un campo",
    ],
    explanation: "Los dientes ayudan a cortar y masticar los alimentos para que sea más fácil tragar.",
    theoryLines: [
      "Las personas tienen dientes incisivos, caninos y molares.",
      "Los niños tienen dientes de leche que luego son reemplazados.",
    ],
  },
  "body_34__v2": {
    stem: "¿Dónde se encuentra el cerebro?",
    options: ["En el vientre", "En la cabeza", "En las piernas", "En las manos"],
    explanation: "El cerebro está en la cabeza, protegido por el cráneo.",
    theoryLines: [
      "El cerebro es uno de los órganos más importantes.",
      "Controla las acciones del cuerpo.",
    ],
  },
};

// Batch 01 translations continued in part 2 - merged at runtime
import { T01 } from "./gen-body-es419-01-data.mjs";
import { T02 } from "./gen-body-es419-02-data.mjs";
Object.assign(T, T01, T02);

const pairs = [
  ["batch-body-00.json", "out-body-00.json"],
  ["batch-body-01.json", "out-body-01.json"],
  ["batch-body-02.json", "out-body-02.json"],
];

for (const [inName, outName] of pairs) {
  const src = JSON.parse(fs.readFileSync(path.join(DIR, inName), "utf8"));
  const patches = src.map((q) => {
    const t = T[q.id];
    if (!t) throw new Error(`missing translation for ${q.id} in ${inName}`);
    const p = { id: q.id, stem: t.stem, options: [...t.options], explanation: t.explanation };
    if (q.theoryLines?.length) {
      if (!t.theoryLines || t.theoryLines.length !== q.theoryLines.length) {
        throw new Error(`theoryLines mismatch ${q.id}`);
      }
      p.theoryLines = [...t.theoryLines];
    }
    return p;
  });
  fs.writeFileSync(path.join(DIR, outName), JSON.stringify({ patches }, null, 2) + "\n", "utf8");
  console.log(`${outName}: ${patches.length} patches`);
}
