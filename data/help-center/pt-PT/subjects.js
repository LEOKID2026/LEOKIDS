/**
 * Portugal (pt-PT) sparse Help overlays for subjects — European Portuguese on pt-BR.
 * Inherit all other articles/fields from pt-BR.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  "math": {
    "summary": "Prática de matemática do 1º ao 6.º ano — o que as crianças aprendem e como praticar.",
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "A prática é projetada para crianças da 1ª à 6.º ano, de acordo com o nível do ano.",
        "textIncludes": "A prática é projetada para crianças da 1"
      },
      {
        "kind": "screenshot",
        "alt": "Ecrã de prática de matemática",
        "altIncludes": "Tela de prática de matemática",
        "caption": "Ecrã de prática de matemática",
        "textIncludes": "Tela de prática de matemática"
      }
    ]
  },
  "geometry": {
    "summary": "Prática de geometria do 1º ao 6.º ano – o que as crianças aprendem e como praticar.",
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "A prática é projetada para crianças da 1ª à 6.º ano, de acordo com o nível do ano.",
        "textIncludes": "A prática é projetada para crianças da 1"
      },
      {
        "kind": "screenshot",
        "alt": "Ecrã de prática de geometria",
        "altIncludes": "Tela de prática de geometria",
        "caption": "Ecrã de prática de geometria",
        "textIncludes": "Tela de prática de geometria"
      }
    ]
  },
  "english": {
    "summary": "Prática de inglês da 1ª à 6.º ano — o que as crianças aprendem e como praticar.",
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "A prática é projetada para crianças da 1ª à 6.º ano, de acordo com o nível do ano.",
        "textIncludes": "A prática é projetada para crianças da 1"
      },
      {
        "kind": "screenshot",
        "alt": "Ecrã de prática de inglês",
        "altIncludes": "Tela de prática de inglês",
        "caption": "Ecrã de prática de inglês",
        "textIncludes": "Tela de prática de inglês"
      }
    ]
  },
  "science": {
    "summary": "Prática científica da 1ª à 6.º ano — o que as crianças aprendem e como praticar.",
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "A prática é projetada para crianças da 1ª à 6.º ano, de acordo com o nível do ano.",
        "textIncludes": "A prática é projetada para crianças da 1"
      },
      {
        "kind": "screenshot",
        "alt": "Ecrã de prática científica",
        "altIncludes": "Tela de prática científica",
        "caption": "Ecrã de prática científica",
        "textIncludes": "Tela de prática científica"
      }
    ]
  }
};
