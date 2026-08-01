/**
 * Spain (es-ES) sparse meaning overrides for English learning words.
 * Inherit all other glosses from word-meanings/es-419.js via es-ES → es-419 → en.
 * Keys match WORD_LISTS English word IDs; only real Spain differences live here.
 *
 * Activation requires shared word-meanings locale chain wiring (not done in this layer).
 */

export const WORD_MEANINGS_ES_ES = {
  food: {
    juice: "zumo",
  },
  school: {
    eraser: "goma",
    classroom: "aula",
  },
  travel: {
    car: "coche",
    ticket: "billete",
  },
  house: {
    computer: "ordenador",
    refrigerator: "nevera",
    fridge: "nevera",
    stove: "cocina",
  },
  sports: {
    field: "campo",
  },
  technology: {
    computer: "ordenador",
    laptop: "ordenador portátil",
    headphones: "auriculares",
  },
};
