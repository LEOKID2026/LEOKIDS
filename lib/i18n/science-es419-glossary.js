/**
 * Science-domain Spanish (LatAm) glossary for es-419 question overlays.
 * Neutral Latin American Spanish, ages 5–12. No vos/vosotros. No Spain-specific terms.
 */
/** @typedef {{ preferred: string, avoid?: string[], notes?: string }} GlossaryEntry */

/** @type {Readonly<Record<string, GlossaryEntry>>} */
export const SCIENCE_ES419_GLOSSARY = Object.freeze({
  // —— Body ——
  heart: { preferred: "corazón", avoid: ["heart"] },
  lungs: { preferred: "pulmones", avoid: ["lungs", "bofes"] },
  brain: { preferred: "cerebro", avoid: ["brain", "sesos (kids MCQ)"] },
  blood: { preferred: "sangre", avoid: ["blood"] },
  bones: { preferred: "huesos", avoid: ["bones"] },
  muscles: { preferred: "músculos", avoid: ["muscles"] },
  stomach: { preferred: "estómago", avoid: ["stomach", "barriga (too informal for science stem)"] },
  intestines: { preferred: "intestinos", avoid: ["intestines"] },
  "digestive system": { preferred: "sistema digestivo", avoid: ["digestive system"] },
  "respiratory system": { preferred: "sistema respiratorio", avoid: ["respiratory system", "aparato respiratorio (OK synonym; prefer sistema)"] },
  "circulatory system": { preferred: "sistema circulatorio", avoid: ["circulatory system"] },
  "nervous system": { preferred: "sistema nervioso", avoid: ["nervous system"] },
  skeleton: { preferred: "esqueleto", avoid: ["skeleton"] },
  oxygen: { preferred: "oxígeno", avoid: ["oxygen"] },
  "carbon dioxide": { preferred: "dióxido de carbono", avoid: ["carbon dioxide", "anhídrido carbónico (Spain-leaning)"] },
  pulse: { preferred: "pulso", avoid: ["pulse"] },
  teeth: { preferred: "dientes", avoid: ["teeth"] },

  // —— Animals ——
  mammal: { preferred: "mamífero", avoid: ["mammal"] },
  reptile: { preferred: "reptil", avoid: ["reptile"] },
  amphibian: { preferred: "anfibio", avoid: ["amphibian"] },
  predator: { preferred: "depredador", avoid: ["predator", "cazador (too vague alone)"] },
  prey: { preferred: "presa", avoid: ["prey"] },
  habitat: { preferred: "hábitat", avoid: ["habitat", "medio (too vague alone)"] },
  "food chain": { preferred: "cadena alimenticia", avoid: ["food chain", "cadena trófica (OK advanced; prefer alimenticia for g1–g4)"] },
  "food web": { preferred: "red alimenticia", avoid: ["food web", "red trófica (OK advanced)"] },
  "warm-blooded": { preferred: "de sangre caliente", avoid: ["warm-blooded", "homeotermo (too advanced for most grades)"] },
  "cold-blooded": { preferred: "de sangre fría", avoid: ["cold-blooded", "poiquilotermo"] },

  // —— Plants ——
  photosynthesis: { preferred: "fotosíntesis", avoid: ["photosynthesis"] },
  chlorophyll: { preferred: "clorofila", avoid: ["chlorophyll"] },
  stomata: { preferred: "estomas", avoid: ["stomata", "estomas foliares (OK longer)"] },
  pollination: { preferred: "polinización", avoid: ["pollination"] },
  "seed dispersal": { preferred: "dispersión de semillas", avoid: ["seed dispersal"] },
  germination: { preferred: "germinación", avoid: ["germination"] },
  root: { preferred: "raíz", avoid: ["root"] },
  stem: { preferred: "tallo", avoid: ["stem (plant)"] },
  leaf: { preferred: "hoja", avoid: ["leaf"] },
  flower: { preferred: "flor", avoid: ["flower"] },
  seed: { preferred: "semilla", avoid: ["seed"] },
  fruit: { preferred: "fruto", avoid: ["fruit", "fruta (when meaning botanical fruit structure, prefer fruto)"] , notes: "Botany: fruto. Everyday edible produce may be fruta." },

  // —— Earth & space ——
  Earth: { preferred: "la Tierra", avoid: ["Earth", "el planeta Tierra (OK longer)"] },
  Sun: { preferred: "el Sol", avoid: ["Sun"] },
  Moon: { preferred: "la Luna", avoid: ["Moon"] },
  planet: { preferred: "planeta", avoid: ["planet"] },
  star: { preferred: "estrella", avoid: ["star"] },
  orbit: { preferred: "órbita", avoid: ["orbit"] },
  axis: { preferred: "eje", avoid: ["axis"] },
  rotation: { preferred: "rotación", avoid: ["rotation", "giro (OK kids synonym)"] },
  season: { preferred: "estación", avoid: ["season", "temporada (weather marketing)"] },
  weather: { preferred: "clima del día / el tiempo", avoid: ["weather"], notes: "Day-to-day: el tiempo. Prefer 'el tiempo' in kids stems; 'clima' for climate." },
  climate: { preferred: "clima", avoid: ["climate"] },
  erosion: { preferred: "erosión", avoid: ["erosion"] },

  // —— Environment ——
  pollution: { preferred: "contaminación", avoid: ["pollution", "polución (OK LatAm; prefer contaminación)"] },
  recycle: { preferred: "reciclar", avoid: ["recycle"] },
  recycling: { preferred: "reciclaje", avoid: ["recycling"] },
  ecosystem: { preferred: "ecosistema", avoid: ["ecosystem"] },
  sustainability: { preferred: "sustentabilidad", avoid: ["sustainability", "sostenibilidad (Spain-leaning; OK in some LatAm docs — prefer sustentabilidad for kids product)"] },
  "greenhouse effect": { preferred: "efecto invernadero", avoid: ["greenhouse effect"] },

  // —— Materials ——
  solid: { preferred: "sólido", avoid: ["solid"] },
  liquid: { preferred: "líquido", avoid: ["liquid"] },
  gas: { preferred: "gas", avoid: ["gas"] },
  "states of matter": { preferred: "estados de la materia", avoid: ["states of matter"] },
  dissolve: { preferred: "disolver", avoid: ["dissolve"] },
  mixture: { preferred: "mezcla", avoid: ["mixture"] },
  compound: { preferred: "compuesto", avoid: ["compound"] },
  conductor: { preferred: "conductor", avoid: ["conductor"] },
  insulator: { preferred: "aislante", avoid: ["insulator", "aislador"] },
  density: { preferred: "densidad", avoid: ["density"] },
  "chemical change": { preferred: "cambio químico", avoid: ["chemical change"] },
  "physical change": { preferred: "cambio físico", avoid: ["physical change"] },

  // —— Experiments ——
  hypothesis: { preferred: "hipótesis", avoid: ["hypothesis"] },
  variable: { preferred: "variable", avoid: ["variable"] },
  experiment: { preferred: "experimento", avoid: ["experiment"] },
  observation: { preferred: "observación", avoid: ["observation"] },
  measurement: { preferred: "medición", avoid: ["measurement"] },
  "fair test": { preferred: "prueba justa", avoid: ["fair test", "experimento controlado (OK synonym)"] },
  thermometer: { preferred: "termómetro", avoid: ["thermometer"] },
  "control group": { preferred: "grupo de control", avoid: ["control group", "control"] },

  // —— Energy / motion ——
  energy: { preferred: "energía", avoid: ["energy"] },
  force: { preferred: "fuerza", avoid: ["force"] },
  friction: { preferred: "fricción", avoid: ["friction", "rozamiento (OK synonym)"] },
  heat: { preferred: "calor", avoid: ["heat"] },
  light: { preferred: "luz", avoid: ["light"] },

  // —— True/False ——
  True: { preferred: "Verdadero", avoid: ["True", "Cierto (prefer Verdadero for T/F)"] },
  False: { preferred: "Falso", avoid: ["False", "Incorrecto (for T/F use Falso)"] },
});

export const SCIENCE_ES419_GLOSSARY_PATH_NOTE =
  "Use with SPANISH_LATAM_GLOSSARY / FORBIDDEN_ES_LATAM_PATTERNS. Prefer preferred forms; avoid listed alternatives unless notes say otherwise.";
