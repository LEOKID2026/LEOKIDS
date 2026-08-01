// Metadata enrichment (safe pass): difficulty, cognitiveLevel, expectedErrorTypes, skillId (when no diagnostic), subtype (pool bucket when taxonomy-valid), prerequisiteSkillIds (gated). See reports/question-metadata-qa/english-metadata-apply-report.json.
import { TRANSLATION_POOLS_PHASE_B } from "./translation-pools-phase-b.js";

export const TRANSLATION_POOLS = {
  "classroom": [
    {
      "en": "Please sit down",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "translation_classroom_g1",
      "difficulty": "basic",
      "meaning": {
        "en": "Please sit down",
        "es-419": "Por favor siéntate"
      }
    },
    {
      "en": "Open your notebook",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "translation_classroom_g1",
      "difficulty": "basic",
      "meaning": {
        "en": "Open your notebook",
        "es-419": "Abre tu cuaderno"
      }
    },
    {
      "en": "Thank you, teacher",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "translation_classroom_g1_p28a",
      "difficulty": "basic",
      "meaning": {
        "en": "Thank you, teacher",
        "es-419": "Gracias maestro"
      }
    },
    {
      "en": "Good morning, class",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "translation_classroom_g1_p28b",
      "difficulty": "basic",
      "meaning": {
        "en": "Good morning, class",
        "es-419": "Buenos dias clase"
      }
    },
    {
      "en": "I have a pencil",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "translation_classroom_g1_p28c",
      "difficulty": "basic",
      "meaning": {
        "en": "I have a pencil",
        "es-419": "Tengo un lapiz"
      }
    },
    {
      "en": "This is my bag",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "translation_classroom_g1_p28d",
      "difficulty": "basic",
      "meaning": {
        "en": "This is my bag",
        "es-419": "Esta es mi bolsa"
      }
    },
    {
      "en": "Look at the board",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "translation_classroom_g1_p28e",
      "difficulty": "basic",
      "meaning": {
        "en": "Look at the board",
        "es-419": "Mira el tablero"
      }
    },
    {
      "en": "We like our school",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "translation_classroom_g1_p28f",
      "difficulty": "basic",
      "meaning": {
        "en": "We like our school",
        "es-419": "Nos gusta nuestra escuela"
      }
    },
    {
      "en": "Raise your hand",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_classroom_g2",
      "difficulty": "basic",
      "meaning": {
        "en": "Raise your hand",
        "es-419": "Levanta tu mano"
      }
    },
    {
      "en": "Listen carefully",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_classroom_g2",
      "difficulty": "basic",
      "meaning": {
        "en": "Listen carefully",
        "es-419": "Escuche atentamente"
      }
    },
    {
      "en": "Please open your book",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_classroom_g2_p28a",
      "difficulty": "basic",
      "meaning": {
        "en": "Please open your book",
        "es-419": "Por favor abre tu libro"
      }
    },
    {
      "en": "Work with a partner",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_classroom_g2_p28b",
      "difficulty": "basic",
      "meaning": {
        "en": "Work with a partner",
        "es-419": "Trabajar con un socio"
      }
    },
    {
      "en": "Put your things away",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_classroom_g2_p28c",
      "difficulty": "basic",
      "meaning": {
        "en": "Put your things away",
        "es-419": "Guarda tus cosas"
      }
    },
    {
      "en": "Write the date",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_classroom_g3",
      "difficulty": "standard",
      "meaning": {
        "en": "Write the date",
        "es-419": "Escribe la fecha"
      }
    },
    {
      "en": "Close the door softly",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_classroom_g3",
      "difficulty": "standard",
      "meaning": {
        "en": "Close the door softly",
        "es-419": "Cierra la puerta suavemente"
      }
    }
  ],
  "routines": [
    {
      "en": "I brush my teeth at night",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_routines_g2",
      "difficulty": "basic",
      "meaning": {
        "en": "I brush my teeth at night",
        "es-419": "Me lavo los dientes por la noche"
      }
    },
    {
      "en": "She drinks milk every morning",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_routines_g2",
      "difficulty": "basic",
      "meaning": {
        "en": "She drinks milk every morning",
        "es-419": "Ella bebe leche todas las mañanas."
      }
    },
    {
      "en": "I wash my hands before lunch",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_routines_g2_p28d",
      "difficulty": "basic",
      "meaning": {
        "en": "I wash my hands before lunch",
        "es-419": "Me lavo las manos antes del almuerzo"
      }
    },
    {
      "en": "We turn off the lights at night",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_routines_g2_p28e",
      "difficulty": "basic",
      "meaning": {
        "en": "We turn off the lights at night",
        "es-419": "Apagamos las luces por la noche."
      }
    },
    {
      "en": "We walk the dog after school",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_routines_g3",
      "difficulty": "standard",
      "meaning": {
        "en": "We walk the dog after school",
        "es-419": "Paseamos al perro después de la escuela."
      }
    },
    {
      "en": "My brother cleans his room on Friday",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_routines_g3",
      "difficulty": "standard",
      "meaning": {
        "en": "My brother cleans his room on Friday",
        "es-419": "Mi hermano limpia su cuarto el viernes."
      }
    },
    {
      "en": "They read a story before bed",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "translation_routines_g4",
      "difficulty": "standard",
      "meaning": {
        "en": "They read a story before bed",
        "es-419": "Leen un cuento antes de dormir."
      }
    },
    {
      "en": "Dad cooks dinner on Sundays",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "translation_routines_g4",
      "difficulty": "standard",
      "meaning": {
        "en": "Dad cooks dinner on Sundays",
        "es-419": "Papá prepara la cena los domingos."
      }
    }
  ],
  "hobbies": [
    {
      "en": "We play basketball after school",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_hobbies_g3",
      "difficulty": "standard",
      "meaning": {
        "en": "We play basketball after school",
        "es-419": "Jugamos baloncesto después de la escuela."
      }
    },
    {
      "en": "My sister paints colorful pictures",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_hobbies_g3",
      "difficulty": "standard",
      "meaning": {
        "en": "My sister paints colorful pictures",
        "es-419": "Mi hermana pinta cuadros coloridos."
      }
    },
    {
      "en": "It is windy, so we fly a kite",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "translation_hobbies_g4",
      "difficulty": "standard",
      "meaning": {
        "en": "It is windy, so we fly a kite",
        "es-419": "Hace viento, así que volamos una cometa."
      }
    },
    {
      "en": "He collects stickers of animals",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_hobbies_g5",
      "difficulty": "advanced",
      "meaning": {
        "en": "He collects stickers of animals",
        "es-419": "Colecciona pegatinas de animales."
      }
    },
    {
      "en": "They practice piano every Tuesday",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_hobbies_g5",
      "difficulty": "advanced",
      "meaning": {
        "en": "They practice piano every Tuesday",
        "es-419": "Practican piano todos los martes."
      }
    },
    {
      "en": "I like to build Lego cities",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "translation_hobbies_g6",
      "difficulty": "advanced",
      "meaning": {
        "en": "I like to build Lego cities",
        "es-419": "Me gusta construir ciudades con Lego."
      }
    }
  ],
  "community": [
    {
      "en": "The library is next to the park",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_community_g3",
      "difficulty": "standard",
      "meaning": {
        "en": "The library is next to the park",
        "es-419": "La biblioteca está al lado del parque."
      }
    },
    {
      "en": "We visited the science museum",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_community_g3",
      "difficulty": "standard",
      "meaning": {
        "en": "We visited the science museum",
        "es-419": "Visitamos el museo de ciencias."
      }
    },
    {
      "en": "Please recycle the bottles in the bin",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "translation_community_g4",
      "difficulty": "standard",
      "meaning": {
        "en": "Please recycle the bottles in the bin",
        "es-419": "Por favor recicle las botellas en la papelera."
      }
    },
    {
      "en": "The market is crowded on Fridays",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "translation_community_g4",
      "difficulty": "standard",
      "meaning": {
        "en": "The market is crowded on Fridays",
        "es-419": "El mercado está lleno los viernes."
      }
    },
    {
      "en": "Our town celebrates a music festival",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_community_g5",
      "difficulty": "advanced",
      "meaning": {
        "en": "Our town celebrates a music festival",
        "es-419": "Nuestro pueblo celebra un festival de música"
      }
    },
    {
      "en": "The nurse helps people feel better",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_community_g5",
      "difficulty": "advanced",
      "meaning": {
        "en": "The nurse helps people feel better",
        "es-419": "La enfermera ayuda a las personas a sentirse mejor."
      }
    }
  ],
  "technology": [
    {
      "en": "She is coding a friendly robot",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "translation_technology_g4",
      "difficulty": "standard",
      "meaning": {
        "en": "She is coding a friendly robot",
        "es-419": "Ella está codificando un robot amigable."
      }
    },
    {
      "en": "We use tablets for digital art",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "translation_technology_g4",
      "difficulty": "standard",
      "meaning": {
        "en": "We use tablets for digital art",
        "es-419": "Usamos tabletas para el arte digital"
      }
    },
    {
      "en": "The drone takes photos of the field",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_technology_g5",
      "difficulty": "advanced",
      "meaning": {
        "en": "The drone takes photos of the field",
        "es-419": "El dron toma fotografías del campo."
      }
    },
    {
      "en": "He uploads a podcast every week",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_technology_g5",
      "difficulty": "advanced",
      "meaning": {
        "en": "He uploads a podcast every week",
        "es-419": "Sube un podcast cada semana."
      }
    },
    {
      "en": "Our class designs a smart garden",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "translation_technology_g6",
      "difficulty": "advanced",
      "meaning": {
        "en": "Our class designs a smart garden",
        "es-419": "Nuestra clase diseña un jardín inteligente"
      }
    },
    {
      "en": "They research clean energy online",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "translation_technology_g6",
      "difficulty": "advanced",
      "meaning": {
        "en": "They research clean energy online",
        "es-419": "Investigan energías limpias en internet"
      }
    }
  ],
  "global": [
    {
      "en": "If we save water, rivers stay clean",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_global_g5",
      "difficulty": "advanced",
      "meaning": {
        "en": "If we save water, rivers stay clean",
        "es-419": "Si ahorramos agua, los ríos se mantienen limpios"
      }
    },
    {
      "en": "Planting trees helps our planet breathe",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_global_g5",
      "difficulty": "advanced",
      "meaning": {
        "en": "Planting trees helps our planet breathe",
        "es-419": "Plantar árboles ayuda a nuestro planeta a respirar"
      }
    },
    {
      "en": "We write about cultures around the world",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "translation_global_g6",
      "difficulty": "advanced",
      "meaning": {
        "en": "We write about cultures around the world",
        "es-419": "Escribimos sobre culturas de todo el mundo."
      }
    },
    {
      "en": "She reads news about space missions",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "translation_global_g6",
      "difficulty": "advanced",
      "meaning": {
        "en": "She reads news about space missions",
        "es-419": "Ella lee noticias sobre misiones espaciales."
      }
    },
    {
      "en": "They discuss how communities share water",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "translation_global_g6b",
      "difficulty": "advanced",
      "meaning": {
        "en": "They discuss how communities share water",
        "es-419": "Discuten cómo las comunidades comparten el agua"
      }
    },
    {
      "en": "Working together keeps the ocean blue",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "translation_global_g6c",
      "difficulty": "advanced",
      "meaning": {
        "en": "Working together keeps the ocean blue",
        "es-419": "Trabajar juntos mantiene el océano azul"
      }
    }
  ],
  "production_completion_translation_bands": [
    {
      "en": "This is my blue pencil case",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "pcb_trans_g1_std_01",
      "difficulty": "standard",
      "meaning": {
        "en": "This is my blue pencil case",
        "es-419": "Este es mi estuche azul"
      }
    },
    {
      "en": "We sing a short English song",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "pcb_trans_g1_std_02",
      "difficulty": "standard",
      "meaning": {
        "en": "We sing a short English song",
        "es-419": "Cantamos una canción corta en inglés."
      }
    },
    {
      "en": "Please point to the door",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "pcb_trans_g1_std_03",
      "difficulty": "standard",
      "meaning": {
        "en": "Please point to the door",
        "es-419": "Por favor señala la puerta"
      }
    },
    {
      "en": "My friend shares crayons",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "pcb_trans_g1_std_04",
      "difficulty": "standard",
      "meaning": {
        "en": "My friend shares crayons",
        "es-419": "Mi amigo comparte crayones"
      }
    },
    {
      "en": "We draw shapes on paper",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "pcb_trans_g1_std_05",
      "difficulty": "standard",
      "meaning": {
        "en": "We draw shapes on paper",
        "es-419": "Dibujamos formas en papel."
      }
    },
    {
      "en": "This flower smells sweet",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "pcb_trans_g1_std_06",
      "difficulty": "standard",
      "meaning": {
        "en": "This flower smells sweet",
        "es-419": "Esta flor huele dulce"
      }
    },
    {
      "en": "Please count to twelve slowly",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "pcb_trans_g1_std_07",
      "difficulty": "standard",
      "meaning": {
        "en": "Please count to twelve slowly",
        "es-419": "Por favor cuenta hasta doce lentamente."
      }
    },
    {
      "en": "We wash hands before snack time",
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "pcb_trans_g1_std_08",
      "difficulty": "standard",
      "meaning": {
        "en": "We wash hands before snack time",
        "es-419": "Nos lavamos las manos antes de la merienda"
      }
    },
    {
      "en": "Our classroom has big windows",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "pcb_trans_g2_std_01",
      "difficulty": "standard",
      "meaning": {
        "en": "Our classroom has big windows",
        "es-419": "Nuestro salón de clases tiene grandes ventanales."
      }
    },
    {
      "en": "Please bring a healthy sandwich",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "pcb_trans_g2_std_02",
      "difficulty": "standard",
      "meaning": {
        "en": "Please bring a healthy sandwich",
        "es-419": "Por favor trae un sándwich saludable."
      }
    },
    {
      "en": "We practice letters on the board",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "pcb_trans_g2_std_03",
      "difficulty": "standard",
      "meaning": {
        "en": "We practice letters on the board",
        "es-419": "Practicamos letras en la pizarra."
      }
    },
    {
      "en": "She ties her shoes carefully",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "pcb_trans_g2_std_04",
      "difficulty": "standard",
      "meaning": {
        "en": "She ties her shoes carefully",
        "es-419": "Ella se ata los zapatos con cuidado."
      }
    },
    {
      "en": "We pack our bags after school",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "pcb_trans_g2_std_05",
      "difficulty": "standard",
      "meaning": {
        "en": "We pack our bags after school",
        "es-419": "Hacemos las maletas después de la escuela."
      }
    },
    {
      "en": "Please copy the date with neat letters",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "pcb_trans_g2_std_06",
      "difficulty": "standard",
      "meaning": {
        "en": "Please copy the date with neat letters",
        "es-419": "Por favor copie la fecha con letras claras."
      }
    },
    {
      "en": "They share scissors during art class",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "pcb_trans_g2_std_07",
      "difficulty": "standard",
      "meaning": {
        "en": "They share scissors during art class",
        "es-419": "Comparten tijeras durante clase de arte"
      }
    },
    {
      "en": "We spell new words with the teacher",
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "pcb_trans_g2_std_08",
      "difficulty": "standard",
      "meaning": {
        "en": "We spell new words with the teacher",
        "es-419": "Deletreamos nuevas palabras con el profesor."
      }
    },
    {
      "en": "I see a yellow sun",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_01",
      "difficulty": "basic",
      "meaning": {
        "en": "I see a yellow sun",
        "es-419": "Veo un sol amarillo"
      }
    },
    {
      "en": "We drink water every day",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_02",
      "difficulty": "basic",
      "meaning": {
        "en": "We drink water every day",
        "es-419": "Bebemos agua todos los días."
      }
    },
    {
      "en": "My shoes are under the chair",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_03",
      "difficulty": "basic",
      "meaning": {
        "en": "My shoes are under the chair",
        "es-419": "Mis zapatos están debajo de la silla."
      }
    },
    {
      "en": "She draws a big tree",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_04",
      "difficulty": "basic",
      "meaning": {
        "en": "She draws a big tree",
        "es-419": "Ella dibuja un gran árbol"
      }
    },
    {
      "en": "They play football after school",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_05",
      "difficulty": "basic",
      "meaning": {
        "en": "They play football after school",
        "es-419": "Juegan al fútbol después de la escuela."
      }
    },
    {
      "en": "It is hot and sunny today",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_06",
      "difficulty": "basic",
      "meaning": {
        "en": "It is hot and sunny today",
        "es-419": "Hoy hace calor y sol"
      }
    },
    {
      "en": "Please close your English book",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_07",
      "difficulty": "basic",
      "meaning": {
        "en": "Please close your English book",
        "es-419": "Por favor cierra tu libro de inglés."
      }
    },
    {
      "en": "I like apples and bananas",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_08",
      "difficulty": "basic",
      "meaning": {
        "en": "I like apples and bananas",
        "es-419": "Me gustan las manzanas y los plátanos"
      }
    },
    {
      "en": "We listen to the teacher",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_09",
      "difficulty": "basic",
      "meaning": {
        "en": "We listen to the teacher",
        "es-419": "Escuchamos al maestro"
      }
    },
    {
      "en": "The cat sleeps on the sofa",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_10",
      "difficulty": "basic",
      "meaning": {
        "en": "The cat sleeps on the sofa",
        "es-419": "El gato duerme en el sofá."
      }
    },
    {
      "en": "He washes his hands before lunch",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_11",
      "difficulty": "basic",
      "meaning": {
        "en": "He washes his hands before lunch",
        "es-419": "Se lava las manos antes del almuerzo."
      }
    },
    {
      "en": "They count from one to twenty",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_basic_12",
      "difficulty": "basic",
      "meaning": {
        "en": "They count from one to twenty",
        "es-419": "Cuentan del uno al veinte"
      }
    },
    {
      "en": "Yesterday we visited a small farm",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_01",
      "difficulty": "advanced",
      "meaning": {
        "en": "Yesterday we visited a small farm",
        "es-419": "Ayer visitamos una pequeña granja."
      }
    },
    {
      "en": "Tomorrow our class will plant trees",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_02",
      "difficulty": "advanced",
      "meaning": {
        "en": "Tomorrow our class will plant trees",
        "es-419": "Mañana nuestra clase plantará árboles."
      }
    },
    {
      "en": "Because it rained, we stayed indoors",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_03",
      "difficulty": "advanced",
      "meaning": {
        "en": "Because it rained, we stayed indoors",
        "es-419": "Como llovió, nos quedamos adentro."
      }
    },
    {
      "en": "She forgot her umbrella at home",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_04",
      "difficulty": "advanced",
      "meaning": {
        "en": "She forgot her umbrella at home",
        "es-419": "Ella olvidó su paraguas en casa."
      }
    },
    {
      "en": "If you hurry, you will catch the bus",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_05",
      "difficulty": "advanced",
      "meaning": {
        "en": "If you hurry, you will catch the bus",
        "es-419": "Si te das prisa cogerás el autobús."
      }
    },
    {
      "en": "We measured the plant with a ruler",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_06",
      "difficulty": "advanced",
      "meaning": {
        "en": "We measured the plant with a ruler",
        "es-419": "Medimos la planta con una regla."
      }
    },
    {
      "en": "The river looks cleaner after the rain",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_07",
      "difficulty": "advanced",
      "meaning": {
        "en": "The river looks cleaner after the rain",
        "es-419": "El río luce más limpio después de la lluvia"
      }
    },
    {
      "en": "They explained the experiment in simple words",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_08",
      "difficulty": "advanced",
      "meaning": {
        "en": "They explained the experiment in simple words",
        "es-419": "Explicaron el experimento en palabras sencillas."
      }
    },
    {
      "en": "I prefer quiet reading to loud games",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_09",
      "difficulty": "advanced",
      "meaning": {
        "en": "I prefer quiet reading to loud games",
        "es-419": "Prefiero la lectura tranquila a los juegos ruidosos."
      }
    },
    {
      "en": "The wind pushed our kite higher",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_10",
      "difficulty": "advanced",
      "meaning": {
        "en": "The wind pushed our kite higher",
        "es-419": "El viento empujó nuestra cometa más alto"
      }
    },
    {
      "en": "Before bedtime, we pack our schoolbags",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_11",
      "difficulty": "advanced",
      "meaning": {
        "en": "Before bedtime, we pack our schoolbags",
        "es-419": "Antes de acostarnos, preparamos nuestras mochilas."
      }
    },
    {
      "en": "Science class taught us about recycling",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_adv_12",
      "difficulty": "advanced",
      "meaning": {
        "en": "Science class taught us about recycling",
        "es-419": "La clase de ciencias nos enseñó sobre el reciclaje."
      }
    },
    {
      "en": "Our city park has fresh air",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_01",
      "difficulty": "basic",
      "meaning": {
        "en": "Our city park has fresh air",
        "es-419": "Nuestro parque de la ciudad tiene aire fresco."
      }
    },
    {
      "en": "We carried bottles to the recycling bin",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_02",
      "difficulty": "basic",
      "meaning": {
        "en": "We carried bottles to the recycling bin",
        "es-419": "Llevamos botellas al contenedor de reciclaje."
      }
    },
    {
      "en": "The horse runs faster than the sheep",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_03",
      "difficulty": "basic",
      "meaning": {
        "en": "The horse runs faster than the sheep",
        "es-419": "El caballo corre más rápido que la oveja."
      }
    },
    {
      "en": "Ice melts when the sun shines",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_04",
      "difficulty": "basic",
      "meaning": {
        "en": "Ice melts when the sun shines",
        "es-419": "El hielo se derrite cuando brilla el sol."
      }
    },
    {
      "en": "Please compare the two shadows",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_05",
      "difficulty": "basic",
      "meaning": {
        "en": "Please compare the two shadows",
        "es-419": "Por favor compara las dos sombras."
      }
    },
    {
      "en": "Clouds sometimes hide the mountains",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_06",
      "difficulty": "basic",
      "meaning": {
        "en": "Clouds sometimes hide the mountains",
        "es-419": "Las nubes a veces ocultan las montañas."
      }
    },
    {
      "en": "They collected seeds for next spring",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_07",
      "difficulty": "basic",
      "meaning": {
        "en": "They collected seeds for next spring",
        "es-419": "Recogieron semillas para la próxima primavera."
      }
    },
    {
      "en": "My cousin lives near the sea",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_08",
      "difficulty": "basic",
      "meaning": {
        "en": "My cousin lives near the sea",
        "es-419": "Mi prima vive cerca del mar."
      }
    },
    {
      "en": "We noticed dew on the grass",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_09",
      "difficulty": "basic",
      "meaning": {
        "en": "We noticed dew on the grass",
        "es-419": "Notamos rocío en la hierba."
      }
    },
    {
      "en": "The bicycle bell sounds friendly",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_10",
      "difficulty": "basic",
      "meaning": {
        "en": "The bicycle bell sounds friendly",
        "es-419": "El timbre de la bicicleta suena amigable"
      }
    },
    {
      "en": "Students sorted rocks by colour",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_11",
      "difficulty": "basic",
      "meaning": {
        "en": "Students sorted rocks by colour",
        "es-419": "Los estudiantes clasificaron rocas por color."
      }
    },
    {
      "en": "Healthy snacks give us energy",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_basic_12",
      "difficulty": "basic",
      "meaning": {
        "en": "Healthy snacks give us energy",
        "es-419": "Los snacks saludables nos dan energía"
      }
    },
    {
      "en": "Although the trail was slippery, we walked carefully",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_01",
      "difficulty": "advanced",
      "meaning": {
        "en": "Although the trail was slippery, we walked carefully",
        "es-419": "Aunque el sendero estaba resbaladizo, caminamos con cuidado."
      }
    },
    {
      "en": "While the soup cooled, we set the table",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_02",
      "difficulty": "advanced",
      "meaning": {
        "en": "While the soup cooled, we set the table",
        "es-419": "Mientras la sopa se enfriaba, pusimos la mesa."
      }
    },
    {
      "en": "Since morning, the wind has blown harder",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_03",
      "difficulty": "advanced",
      "meaning": {
        "en": "Since morning, the wind has blown harder",
        "es-419": "Desde la mañana el viento sopla con más fuerza"
      }
    },
    {
      "en": "We compared soil samples from two gardens",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_04",
      "difficulty": "advanced",
      "meaning": {
        "en": "We compared soil samples from two gardens",
        "es-419": "Comparamos muestras de suelo de dos jardines."
      }
    },
    {
      "en": "The engineer checked the bridge drawings twice",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_05",
      "difficulty": "advanced",
      "meaning": {
        "en": "The engineer checked the bridge drawings twice",
        "es-419": "El ingeniero revisó los planos del puente dos veces."
      }
    },
    {
      "en": "Plastic litter harms birds near the shore",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_06",
      "difficulty": "advanced",
      "meaning": {
        "en": "Plastic litter harms birds near the shore",
        "es-419": "La basura plástica daña a las aves cerca de la orilla"
      }
    },
    {
      "en": "They predicted rain using a simple chart",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_07",
      "difficulty": "advanced",
      "meaning": {
        "en": "They predicted rain using a simple chart",
        "es-419": "Predijeron lluvia usando un gráfico simple"
      }
    },
    {
      "en": "Our group explained how compost helps plants",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_08",
      "difficulty": "advanced",
      "meaning": {
        "en": "Our group explained how compost helps plants",
        "es-419": "Nuestro grupo explicó cómo el compost ayuda a las plantas."
      }
    },
    {
      "en": "She labeled each mineral with neat handwriting",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_09",
      "difficulty": "advanced",
      "meaning": {
        "en": "She labeled each mineral with neat handwriting",
        "es-419": "Etiquetó cada mineral con una letra clara."
      }
    },
    {
      "en": "We summarized the field trip in four sentences",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_10",
      "difficulty": "advanced",
      "meaning": {
        "en": "We summarized the field trip in four sentences",
        "es-419": "Resumimos la salida al campo en cuatro frases"
      }
    },
    {
      "en": "The museum guide answered curious questions",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_11",
      "difficulty": "advanced",
      "meaning": {
        "en": "The museum guide answered curious questions",
        "es-419": "La guía del museo respondió preguntas curiosas"
      }
    },
    {
      "en": "Friendly neighbours shared tools after the storm",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_adv_12",
      "difficulty": "advanced",
      "meaning": {
        "en": "Friendly neighbours shared tools after the storm",
        "es-419": "Vecinos amigables compartieron herramientas después de la tormenta"
      }
    },
    {
      "en": "Please tie your shoes tightly before PE",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_01",
      "difficulty": "basic",
      "meaning": {
        "en": "Please tie your shoes tightly before PE",
        "es-419": "Por favor, átate bien los zapatos antes de la clase de educación física."
      }
    },
    {
      "en": "We recycle paper in the blue bin",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_02",
      "difficulty": "basic",
      "meaning": {
        "en": "We recycle paper in the blue bin",
        "es-419": "Reciclamos papel en el contenedor azul."
      }
    },
    {
      "en": "The thermometer shows thirty degrees",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_03",
      "difficulty": "basic",
      "meaning": {
        "en": "The thermometer shows thirty degrees",
        "es-419": "El termómetro marca treinta grados."
      }
    },
    {
      "en": "Healthy teeth need brushing twice a day",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_04",
      "difficulty": "basic",
      "meaning": {
        "en": "Healthy teeth need brushing twice a day",
        "es-419": "Los dientes sanos necesitan cepillarse dos veces al día"
      }
    },
    {
      "en": "Our team wrote clear safety rules",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_05",
      "difficulty": "basic",
      "meaning": {
        "en": "Our team wrote clear safety rules",
        "es-419": "Nuestro equipo escribió reglas de seguridad claras."
      }
    },
    {
      "en": "Clouds moved quickly across the sky",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_06",
      "difficulty": "basic",
      "meaning": {
        "en": "Clouds moved quickly across the sky",
        "es-419": "Las nubes se movían rápidamente por el cielo."
      }
    },
    {
      "en": "She drew a careful map of the river",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_07",
      "difficulty": "basic",
      "meaning": {
        "en": "She drew a careful map of the river",
        "es-419": "Dibujó un cuidadoso mapa del río."
      }
    },
    {
      "en": "We measured rainfall with a plastic bottle",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_08",
      "difficulty": "basic",
      "meaning": {
        "en": "We measured rainfall with a plastic bottle",
        "es-419": "Medimos la lluvia con una botella de plástico."
      }
    },
    {
      "en": "The forest trail felt quieter at dawn",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_09",
      "difficulty": "basic",
      "meaning": {
        "en": "The forest trail felt quieter at dawn",
        "es-419": "El sendero del bosque parecía más tranquilo al amanecer."
      }
    },
    {
      "en": "They sorted waste into three labelled bags",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_10",
      "difficulty": "basic",
      "meaning": {
        "en": "They sorted waste into three labelled bags",
        "es-419": "Clasificaron los residuos en tres bolsas etiquetadas"
      }
    },
    {
      "en": "Fresh vegetables arrived from local farms",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_11",
      "difficulty": "basic",
      "meaning": {
        "en": "Fresh vegetables arrived from local farms",
        "es-419": "Verduras frescas llegadas de granjas locales."
      }
    },
    {
      "en": "Please wash fruit before you eat it",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_basic_12",
      "difficulty": "basic",
      "meaning": {
        "en": "Please wash fruit before you eat it",
        "es-419": "Por favor lave la fruta antes de comerla."
      }
    },
    {
      "en": "We compared two brands of reusable bottles",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_01",
      "difficulty": "standard",
      "meaning": {
        "en": "We compared two brands of reusable bottles",
        "es-419": "Comparamos dos marcas de botellas reutilizables."
      }
    },
    {
      "en": "The coach reminded us to stretch slowly",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_02",
      "difficulty": "standard",
      "meaning": {
        "en": "The coach reminded us to stretch slowly",
        "es-419": "El entrenador nos recordó que estiráramos lentamente"
      }
    },
    {
      "en": "Students debated how to save electricity",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_03",
      "difficulty": "standard",
      "meaning": {
        "en": "Students debated how to save electricity",
        "es-419": "Los estudiantes debatieron cómo ahorrar electricidad."
      }
    },
    {
      "en": "Our poster explained the water cycle clearly",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_04",
      "difficulty": "standard",
      "meaning": {
        "en": "Our poster explained the water cycle clearly",
        "es-419": "Nuestro cartel explicaba claramente el ciclo del agua."
      }
    },
    {
      "en": "They tested whether seeds grow faster in light",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_05",
      "difficulty": "standard",
      "meaning": {
        "en": "They tested whether seeds grow faster in light",
        "es-419": "Probaron si las semillas crecen más rápido con luz"
      }
    },
    {
      "en": "The nurse showed how germs spread on hands",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_06",
      "difficulty": "standard",
      "meaning": {
        "en": "The nurse showed how germs spread on hands",
        "es-419": "La enfermera mostró cómo se propagan los gérmenes en las manos."
      }
    },
    {
      "en": "We summarized yesterday's lab in two paragraphs",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_07",
      "difficulty": "standard",
      "meaning": {
        "en": "We summarized yesterday's lab in two paragraphs",
        "es-419": "Resumimos el laboratorio de ayer en dos párrafos."
      }
    },
    {
      "en": "Wind turbines convert motion into electricity",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_08",
      "difficulty": "standard",
      "meaning": {
        "en": "Wind turbines convert motion into electricity",
        "es-419": "Las turbinas eólicas convierten el movimiento en electricidad"
      }
    },
    {
      "en": "Neighbours organized a weekend river cleanup",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_09",
      "difficulty": "standard",
      "meaning": {
        "en": "Neighbours organized a weekend river cleanup",
        "es-419": "Vecinos organizaron limpieza de río el fin de semana"
      }
    },
    {
      "en": "The librarian recommended a bilingual atlas",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_10",
      "difficulty": "standard",
      "meaning": {
        "en": "The librarian recommended a bilingual atlas",
        "es-419": "El bibliotecario recomendó un atlas bilingüe"
      }
    },
    {
      "en": "We estimated distance using map scale practice",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_11",
      "difficulty": "standard",
      "meaning": {
        "en": "We estimated distance using map scale practice",
        "es-419": "Estimamos la distancia usando la práctica de escala de mapa."
      }
    },
    {
      "en": "Our journal tracked moon phases for two weeks",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_std_12",
      "difficulty": "standard",
      "meaning": {
        "en": "Our journal tracked moon phases for two weeks",
        "es-419": "Nuestro diario siguió las fases lunares durante dos semanas."
      }
    },
    {
      "en": "Turn off lights when the classroom is empty",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_01",
      "difficulty": "basic",
      "meaning": {
        "en": "Turn off lights when the classroom is empty",
        "es-419": "Apagar las luces cuando el aula esté vacía."
      }
    },
    {
      "en": "We labeled each rock with its scratch test",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_02",
      "difficulty": "basic",
      "meaning": {
        "en": "We labeled each rock with its scratch test",
        "es-419": "Etiquetamos cada roca con su prueba de rayado."
      }
    },
    {
      "en": "Plants lose water through tiny leaf pores",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_03",
      "difficulty": "basic",
      "meaning": {
        "en": "Plants lose water through tiny leaf pores",
        "es-419": "Las plantas pierden agua a través de los diminutos poros de las hojas."
      }
    },
    {
      "en": "The digital scale showed grams precisely",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_04",
      "difficulty": "basic",
      "meaning": {
        "en": "The digital scale showed grams precisely",
        "es-419": "La báscula digital marcaba gramos con precisión"
      }
    },
    {
      "en": "Please rinse the beaker before the next trial",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_05",
      "difficulty": "basic",
      "meaning": {
        "en": "Please rinse the beaker before the next trial",
        "es-419": "Enjuague el vaso antes de la siguiente prueba."
      }
    },
    {
      "en": "We summarized evidence from three reliable sites",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_06",
      "difficulty": "basic",
      "meaning": {
        "en": "We summarized evidence from three reliable sites",
        "es-419": "Resumimos la evidencia de tres sitios confiables."
      }
    },
    {
      "en": "Solar panels warm water on the roof",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_07",
      "difficulty": "basic",
      "meaning": {
        "en": "Solar panels warm water on the roof",
        "es-419": "Paneles solares calientan agua en el techo."
      }
    },
    {
      "en": "City planners study traffic near schools",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_08",
      "difficulty": "basic",
      "meaning": {
        "en": "City planners study traffic near schools",
        "es-419": "Los urbanistas estudian el tráfico cerca de las escuelas"
      }
    },
    {
      "en": "Coastal waves shaped the cliffs slowly",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_09",
      "difficulty": "basic",
      "meaning": {
        "en": "Coastal waves shaped the cliffs slowly",
        "es-419": "Las olas costeras moldearon lentamente los acantilados"
      }
    },
    {
      "en": "Volunteers counted birds before sunrise",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_10",
      "difficulty": "basic",
      "meaning": {
        "en": "Volunteers counted birds before sunrise",
        "es-419": "Los voluntarios contaron las aves antes del amanecer."
      }
    },
    {
      "en": "Our sensor recorded temperature every minute",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_11",
      "difficulty": "basic",
      "meaning": {
        "en": "Our sensor recorded temperature every minute",
        "es-419": "Nuestro sensor registró la temperatura cada minuto."
      }
    },
    {
      "en": "They translated safety warnings for visitors",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_basic_12",
      "difficulty": "basic",
      "meaning": {
        "en": "They translated safety warnings for visitors",
        "es-419": "Tradujeron avisos de seguridad para visitantes"
      }
    },
    {
      "en": "Although budgets were tight, the council funded filters",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_01",
      "difficulty": "standard",
      "meaning": {
        "en": "Although budgets were tight, the council funded filters",
        "es-419": "Aunque los presupuestos eran ajustados, el consejo financió filtros"
      }
    },
    {
      "en": "Researchers compared soil drainage after rainfall",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_02",
      "difficulty": "standard",
      "meaning": {
        "en": "Researchers compared soil drainage after rainfall",
        "es-419": "Los investigadores compararon el drenaje del suelo después de la lluvia."
      }
    },
    {
      "en": "We debated whether drones could survey reefs safely",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_03",
      "difficulty": "standard",
      "meaning": {
        "en": "We debated whether drones could survey reefs safely",
        "es-419": "Debatimos si los drones podrían estudiar los arrecifes de forma segura"
      }
    },
    {
      "en": "The engineer justified wider sidewalks near clinics",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_04",
      "difficulty": "standard",
      "meaning": {
        "en": "The engineer justified wider sidewalks near clinics",
        "es-419": "El ingeniero justificó aceras más amplias cerca de las clínicas"
      }
    },
    {
      "en": "Citizens proposed shading nets for playgrounds",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_05",
      "difficulty": "standard",
      "meaning": {
        "en": "Citizens proposed shading nets for playgrounds",
        "es-419": "Los ciudadanos propusieron redes de sombra para los parques infantiles"
      }
    },
    {
      "en": "Students modeled erosion with sand and water trays",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_06",
      "difficulty": "standard",
      "meaning": {
        "en": "Students modeled erosion with sand and water trays",
        "es-419": "Los estudiantes modelaron la erosión con bandejas de arena y agua."
      }
    },
    {
      "en": "Our podcast episode explained renewable incentives",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_07",
      "difficulty": "standard",
      "meaning": {
        "en": "Our podcast episode explained renewable incentives",
        "es-419": "Nuestro episodio de podcast explicó los incentivos renovables."
      }
    },
    {
      "en": "Meteorologists tracked humidity during the heatwave",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_08",
      "difficulty": "standard",
      "meaning": {
        "en": "Meteorologists tracked humidity during the heatwave",
        "es-419": "Los meteorólogos rastrearon la humedad durante la ola de calor"
      }
    },
    {
      "en": "We analyzed graphs showing seasonal storm counts",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_09",
      "difficulty": "standard",
      "meaning": {
        "en": "We analyzed graphs showing seasonal storm counts",
        "es-419": "Analizamos gráficos que muestran el recuento de tormentas estacionales."
      }
    },
    {
      "en": "Biologists tagged turtles to study migration routes",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_10",
      "difficulty": "standard",
      "meaning": {
        "en": "Biologists tagged turtles to study migration routes",
        "es-419": "Biólogos etiquetaron tortugas para estudiar rutas migratorias"
      }
    },
    {
      "en": "Technicians calibrated probes before stream sampling",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_11",
      "difficulty": "standard",
      "meaning": {
        "en": "Technicians calibrated probes before stream sampling",
        "es-419": "Los técnicos calibraron las sondas antes del muestreo del arroyo."
      }
    },
    {
      "en": "Neighbourhood councils compared flood simulations online",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_std_12",
      "difficulty": "standard",
      "meaning": {
        "en": "Neighbourhood councils compared flood simulations online",
        "es-419": "Las juntas vecinales compararon simulaciones de inundaciones online"
      }
    },
    {
      "en": "We record weather symbols in a small chart",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_std_x1",
      "difficulty": "standard",
      "meaning": {
        "en": "We record weather symbols in a small chart",
        "es-419": "Registramos símbolos meteorológicos en un pequeño gráfico."
      }
    },
    {
      "en": "Please compare the length of two shadows at noon",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_std_x2",
      "difficulty": "standard",
      "meaning": {
        "en": "Please compare the length of two shadows at noon",
        "es-419": "Compara la longitud de dos sombras al mediodía."
      }
    },
    {
      "en": "They weigh seeds before planting them in soil",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "pcb_trans_g3_std_x3",
      "difficulty": "standard",
      "meaning": {
        "en": "They weigh seeds before planting them in soil",
        "es-419": "Pesan las semillas antes de plantarlas en el suelo."
      }
    },
    {
      "en": "Our science diary explains every step clearly",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_std_x1",
      "difficulty": "standard",
      "meaning": {
        "en": "Our science diary explains every step clearly",
        "es-419": "Nuestro diario científico explica cada paso claramente."
      }
    },
    {
      "en": "We summarize observations without guessing results",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_std_x2",
      "difficulty": "standard",
      "meaning": {
        "en": "We summarize observations without guessing results",
        "es-419": "Resumimos las observaciones sin adivinar los resultados."
      }
    },
    {
      "en": "Please rinse tools before the next measurement",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_std_x3",
      "difficulty": "standard",
      "meaning": {
        "en": "Please rinse tools before the next measurement",
        "es-419": "Enjuague las herramientas antes de la siguiente medición."
      }
    },
    {
      "en": "Citizens discussed quieter buses near schools",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "pcb_trans_g4_std_x4",
      "difficulty": "standard",
      "meaning": {
        "en": "Citizens discussed quieter buses near schools",
        "es-419": "Los ciudadanos discuten sobre autobuses más silenciosos cerca de las escuelas"
      }
    },
    {
      "en": "Engineers tested safer crossings after traffic counts",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_adv_x1",
      "difficulty": "advanced",
      "meaning": {
        "en": "Engineers tested safer crossings after traffic counts",
        "es-419": "Los ingenieros probaron cruces más seguros después de los recuentos de tráfico"
      }
    },
    {
      "en": "Volunteers mapped flooding risks before winter rains",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_adv_x2",
      "difficulty": "advanced",
      "meaning": {
        "en": "Volunteers mapped flooding risks before winter rains",
        "es-419": "Los voluntarios mapearon los riesgos de inundaciones antes de las lluvias invernales"
      }
    },
    {
      "en": "Students debated fair rules for sharing lab laptops",
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "pcb_trans_g5_adv_x3",
      "difficulty": "advanced",
      "meaning": {
        "en": "Students debated fair rules for sharing lab laptops",
        "es-419": "Los estudiantes debatieron sobre reglas justas para compartir computadoras portátiles de laboratorio"
      }
    },
    {
      "en": "Urban planners compared flood simulations across districts",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_adv_x1",
      "difficulty": "advanced",
      "meaning": {
        "en": "Urban planners compared flood simulations across districts",
        "es-419": "Los planificadores urbanos compararon simulaciones de inundaciones en todos los distritos"
      }
    },
    {
      "en": "Researchers calibrated probes minutes before high tide",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_adv_x2",
      "difficulty": "advanced",
      "meaning": {
        "en": "Researchers calibrated probes minutes before high tide",
        "es-419": "Los investigadores calibraron las sondas minutos antes de la marea alta"
      }
    },
    {
      "en": "Citizen scientists verified algae alerts using handheld kits",
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "pcb_trans_g6_adv_x3",
      "difficulty": "advanced",
      "meaning": {
        "en": "Citizen scientists verified algae alerts using handheld kits",
        "es-419": "Científicos ciudadanos verificaron alertas de algas utilizando kits portátiles"
      }
    }
  ],
  "simulator_translation_mcq": [
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "translation_mcq_g2_matrix",
      "question": "Choose the correct meaning: \"She has a red bag\"",
      "options": [
        "Ella tiene un bolso rojo",
        "Ella tiene un bolso azul",
        "Ella ve un bolso verde",
        "Ella olvida el bolso"
      ],
      "correct": "Ella tiene un bolso rojo",
      "explanation": "She has = ella tiene; red bag = bolso rojo.",
      "explanationByLocale": {
        "en": "She has = ella tiene; red bag = bolso rojo.",
        "es-419": "She has = ella tiene; red bag = bolso rojo."
      },
      "meaning": {
        "en": "She has a red bag",
        "es-419": "Ella tiene un bolso rojo"
      },
      "difficulty": "basic",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "translation_error",
        "vocabulary_confusion",
        "reading_comprehension_error"
      ],
      "skillId": "translation_mcq_g2_matrix",
      "subtype": "simulator_translation_mcq"
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "translation_mcq_g3_matrix",
      "question": "Choose the correct meaning: \"We eat lunch at school every day\"",
      "options": [
        "Comemos el almuerzo en la escuela todos los días",
        "Olvidamos el almuerzo en la escuela",
        "Compramos el almuerzo solo los fines de semana",
        "Nunca comemos en la escuela"
      ],
      "correct": "Comemos el almuerzo en la escuela todos los días",
      "explanation": "A present routine — every day shows frequency.",
      "explanationByLocale": {
        "en": "A present routine — every day shows frequency.",
        "es-419": "Es una rutina en presente: every day indica frecuencia."
      },
      "meaning": {
        "en": "We eat lunch at school every day",
        "es-419": "Comemos el almuerzo en la escuela todos los días"
      },
      "difficulty": "standard",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "translation_error",
        "vocabulary_confusion",
        "reading_comprehension_error"
      ],
      "skillId": "translation_mcq_g3_matrix",
      "subtype": "simulator_translation_mcq"
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "translation_mcq_g4_matrix",
      "question": "Choose the correct meaning: \"Turn off the light when you leave the room\"",
      "options": [
        "Apaguen la luz cuando salgan de la habitación",
        "Prendan la luz cuando entren a la habitación",
        "Dejen la luz encendida siempre",
        "Cierren la ventana cuando salgan de la habitación"
      ],
      "correct": "Apaguen la luz cuando salgan de la habitación",
      "explanation": "An instruction — turn off the light when leaving the room.",
      "explanationByLocale": {
        "en": "An instruction — turn off the light when leaving the room.",
        "es-419": "Es una instrucción: apagar la luz al salir de la habitación."
      },
      "meaning": {
        "en": "Turn off the light when you leave the room",
        "es-419": "Apaguen la luz cuando salgan de la habitación"
      },
      "difficulty": "standard",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "translation_error",
        "vocabulary_confusion",
        "reading_comprehension_error"
      ],
      "skillId": "translation_mcq_g4_matrix",
      "subtype": "simulator_translation_mcq"
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "translation_mcq_g5_matrix",
      "question": "Choose the correct meaning: \"The teacher explained the new topic slowly\"",
      "options": [
        "La maestra explicó el tema nuevo despacio",
        "La maestra olvidó el tema nuevo",
        "La maestra corrió rápido sin explicar",
        "Los estudiantes le explicaron el tema a la maestra"
      ],
      "correct": "La maestra explicó el tema nuevo despacio",
      "explanation": "explained = explicó; slowly = despacio.",
      "explanationByLocale": {
        "en": "explained = explicó; slowly = despacio.",
        "es-419": "Explained = explicó; slowly = despacio."
      },
      "meaning": {
        "en": "The teacher explained the new topic slowly",
        "es-419": "La maestra explicó el tema nuevo despacio"
      },
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "translation_error",
        "vocabulary_confusion",
        "reading_comprehension_error"
      ],
      "skillId": "translation_mcq_g5_matrix",
      "subtype": "simulator_translation_mcq"
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "translation_mcq_g6_matrix",
      "question": "Choose the correct meaning: \"Clean energy can help protect our planet\"",
      "options": [
        "La energía limpia puede ayudar a proteger nuestro planeta",
        "La energía limpia siempre daña el planeta",
        "El planeta no necesita protección",
        "No podemos proteger el medio ambiente en el futuro"
      ],
      "correct": "La energía limpia puede ayudar a proteger nuestro planeta",
      "explanation": "clean energy = energía limpia; protect our planet = proteger nuestro planeta.",
      "explanationByLocale": {
        "en": "clean energy = energía limpia; protect our planet = proteger nuestro planeta.",
        "es-419": "Clean energy = energía limpia; protect our planet = proteger nuestro planeta."
      },
      "meaning": {
        "en": "Clean energy can help protect our planet",
        "es-419": "La energía limpia puede ayudar a proteger nuestro planeta"
      },
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "translation_error",
        "vocabulary_confusion",
        "reading_comprehension_error"
      ],
      "skillId": "translation_mcq_g6_matrix",
      "subtype": "simulator_translation_mcq"
    }
  ]
};

for (const [poolKey, rows] of Object.entries(TRANSLATION_POOLS_PHASE_B)) {
  if (!TRANSLATION_POOLS[poolKey]) TRANSLATION_POOLS[poolKey] = [];
  TRANSLATION_POOLS[poolKey].push(...rows);
}
