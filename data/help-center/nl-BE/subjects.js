/**
 * Belgium Dutch (nl-BE) sparse Help overlays for subjects —
 * Groep 3–8 → 1ste–6de leerjaar. Adult parent-facing surface.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay["blockPatches"]} */
const SUBJECT_BLOCK_PATCHES = [
  {
    kind: "paragraph",
    textIncludes: "Groep 3 tot en met Groep 8",
    text:
      "Het oefenen is bedoeld voor kinderen van het 1ste tot en met 6de leerjaar, afgestemd op het niveau van het leerjaar.",
  },
  {
    kind: "paragraph",
    textIncludes: "Kies een groep en niveau",
    text:
      "Kies een leerjaar en een niveau, beantwoord vragen en krijg na elk antwoord een uitleg.",
  },
];

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Rekenen oefenen voor het 1ste tot en met 6de leerjaar — wat kinderen leren en hoe ze oefenen.",
    blockPatches: [
      ...SUBJECT_BLOCK_PATCHES,
      {
        kind: "list",
        items: [
          "Optellen, aftrekken, vermenigvuldigen en delen",
          "Breuken en decimalen (hogere leerjaren)",
          "Verhaalsommen",
        ],
      },
    ],
  },
  geometry: {
    summary:
      "Meetkunde oefenen voor het 1ste tot en met 6de leerjaar — wat kinderen leren en hoe ze oefenen.",
    blockPatches: [
      ...SUBJECT_BLOCK_PATCHES,
      {
        kind: "list",
        items: [
          "Oppervlakte en omtrek",
          "Hoeken en vormen",
          "Pythagoras (gevorderde leerjaren)",
        ],
      },
    ],
  },
  english: {
    summary:
      "Engels oefenen voor het 1ste tot en met 6de leerjaar — wat kinderen leren en hoe ze oefenen.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
  science: {
    summary:
      "Natuur en techniek oefenen voor het 1ste tot en met 6de leerjaar — wat kinderen leren en hoe ze oefenen.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
};
