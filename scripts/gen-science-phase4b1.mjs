/**
 * One-off generator for Phase 4B-1 science coverage items (Hebrew MCQ).
 * Run: node scripts/gen-science-phase4b1.mjs
 * Writes: data/science-questions-phase4b1.js
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data", "science-questions-phase4b1.js");

const PF = {
  body: "sci_body_systems",
  animals: "sci_animals_classification",
  plants: "sci_plants_growth",
  materials: "sci_materials_properties",
  experiments: "sci_experiments_scientific_method",
  earth_space: "sci_earth_space_cycles",
  environment: "sci_environment_ecosystems",
};

const ST = {
  body: "sci_body_general",
  animals: "sci_animals_general",
  plants: "sci_plants_general",
  materials: "sci_materials_general",
  experiments: "sci_experiments_general",
  earth_space: "sci_earth_space_general",
  environment: "sci_environment_general",
};

/** Unique stems per slot — avoids pool[j%2] duplicate density in sessions. */
const G6_BODY_EASY = [
  {
    stem: "       ?",
    options: [
      "      ",
      "     ",
      "      ",
      "      ",
    ],
    explanation:
      "        ;      .",
    theoryLines: ["       .", "    ."],
  },
  {
    stem: "      ?",
    options: [
      "        ",
      "        ",
      "     ",
      "      ",
    ],
    explanation: "      ,    .",
    theoryLines: ["    .", "    ."],
  },
  {
    stem: "      ?",
    options: [
      "      ",
      "    ",
      "    ",
      "    ",
    ],
    explanation: "    ;      .",
    theoryLines: ["     .", "   ."],
  },
  {
    stem: "     ?",
    options: [
      "   ,  ",
      "   ",
      "    ",
      "   ",
    ],
    explanation: "   ;      .",
    theoryLines: ["  .", "   ."],
  },
  {
    stem: "     ?",
    options: [
      "      ",
      "   ",
      "    ",
      "   ",
    ],
    explanation: "     ,  .",
    theoryLines: ["    .", "   ."],
  },
  {
    stem: "    ?",
    options: [
      ",     ",
      "   ",
      "  ",
      "   ",
    ],
    explanation: "       .",
    theoryLines: ["   .", "   ."],
  },
  {
    stem: "    ?",
    options: [
      "    ",
      "   ",
      "  ",
      "   ",
    ],
    explanation: "      .",
    theoryLines: ["   .", "   ."],
  },
  {
    stem: "    ?",
    options: [
      "     ",
      "  ",
      "   ",
      "   ",
    ],
    explanation: "  ;      .",
    theoryLines: ["   .", "   ."],
  },
];

const G6_ANIMALS_MEDIUM = [
  {
    stem: "      ?",
    options: [
      "     ",
      "     ",
      "   ",
      "       ",
    ],
    explanation: "         .",
    theoryLines: ["    .", "     ."],
  },
  {
    stem: "         ?",
    options: [
      "      ",
      "     ",
      "     ",
      "    ",
    ],
    explanation: "          .",
    theoryLines: ["      .", "    ."],
  },
  {
    stem: "    ?",
    options: [
      "      ",
      "      ",
      "   ",
      "    ",
    ],
    explanation: "     .",
    theoryLines: ["    .", "     ."],
  },
  {
    stem: "    ?",
    options: [
      "     ",
      "  ",
      "   ",
      "   ",
    ],
    explanation: "  ;     .",
    theoryLines: ["    .", "  ."],
  },
  {
    stem: "      ?",
    options: [
      " ,    ",
      "    ",
      "    ",
      "   ",
    ],
    explanation: "     .",
    theoryLines: ["    .", "    ."],
  },
  {
    stem: "    ?",
    options: [", , , ", "   ", " ", "   "],
    explanation: "      .",
    theoryLines: ["    .", "   ."],
  },
  {
    stem: "   ?",
    options: [
      "     ",
      "    ",
      "  ",
      "  ",
    ],
    explanation: "     .",
    theoryLines: ["  .", "    ."],
  },
];

const G6_EXPERIMENTS_EASY = [
  {
    stem: "        ,   ?",
    options: [
      "           ",
      "      ",
      "        ",
      "     ",
    ],
    explanation: "         .",
    theoryLines: ["   .", "   ."],
  },
  {
    stem: "      ?",
    options: [
      "       ",
      "   ",
      "    ",
      "  ",
    ],
    explanation: "      .",
    theoryLines: ["   .", "  ."],
  },
  {
    stem: "    ?",
    options: ["   ", "  ", " ", "  "],
    explanation: "       .",
    theoryLines: ["   .", "  ."],
  },
  {
    stem: "   ?",
    options: [
      "   ",
      " ",
      " ",
      "     ",
    ],
    explanation: "   .",
    theoryLines: ["   .", "  ."],
  },
  {
    stem: "    ?",
    options: [
      "   ",
      "   ",
      "  ",
      "  ",
    ],
    explanation: "    .",
    theoryLines: ["   .", "    ."],
  },
  {
    stem: "     ?",
    options: [
      "   ",
      "    ",
      "   ",
      "   ",
    ],
    explanation: "  .",
    theoryLines: ["    .", "  ."],
  },
  {
    stem: "      ?",
    options: ["", "", "", " "],
    explanation: "    .",
    theoryLines: ["   .", "  ."],
  },
  {
    stem: "      ?",
    options: [
      "   ",
      "   ",
      "    ",
      "  ",
    ],
    explanation: "    .",
    theoryLines: ["    .", "   ."],
  },
];

const G4_BODY_EASY = [
  {
    stem: "     ?",
    options: [
      "      ",
      "   ",
      "     ",
      "    ",
    ],
    explanation: "    ;    .",
    theoryLines: ["    .", "  ."],
  },
  {
    stem: "       ?",
    options: [
      "      ",
      "    ",
      "   ",
      "   ",
    ],
    explanation: "      .",
    theoryLines: ["   .", " CO₂   ."],
  },
  {
    stem: "     ?",
    options: [
      "    ",
      "   ",
      "  ",
      "   ",
    ],
    explanation: "  ;   .",
    theoryLines: ["    .", "   ."],
  },
  {
    stem: "    ?",
    options: [
      "    ",
      "  ",
      "  ",
      "   ",
    ],
    explanation: "   .",
    theoryLines: ["   .", "   ."],
  },
  {
    stem: "     ?",
    options: [
      "    ",
      "   ",
      "    ",
      "  ",
    ],
    explanation: "   .",
    theoryLines: [" .", "   ."],
  },
  {
    stem: "   ?",
    options: [
      "   ",
      " ",
      " ",
      "  ",
    ],
    explanation: "  .",
    theoryLines: ["  .", "    ."],
  },
];

const G4_ANIMALS_EASY = [
  {
    stem: "      ?",
    options: [
      "     ",
      "     ",
      "   ",
      "    ",
    ],
    explanation: "        .",
    theoryLines: [":    .", "   ."],
  },
  {
    stem: "         ?",
    options: [
      ",       ",
      "     ",
      "    ",
      "      ",
    ],
    explanation: "      .",
    theoryLines: ["    .", "  ."],
  },
  {
    stem: "  ?",
    options: ["   ", " ", " ", "  "],
    explanation: "  .",
    theoryLines: ["   .", " ."],
  },
  {
    stem: "  ?",
    options: [" ", " ", "", ""],
    explanation: "   .",
    theoryLines: ["   .", "   ."],
  },
  {
    stem: "   ?",
    options: ["", "", " ", " "],
    explanation: "  .",
    theoryLines: ["   .", " ."],
  },
  {
    stem: "   ?",
    options: ["", " ", "", " "],
    explanation: "  .",
    theoryLines: ["  .", "  ."],
  },
];

const G4_EXPERIMENTS_MEDIUM = [
  {
    stem: "  ,    ?",
    options: [
      " ,     ",
      "     ",
      "    ",
      "     ",
    ],
    explanation: "         .",
    theoryLines: ["    .", "  ."],
  },
  {
    stem: "   —    ?",
    options: [
      ", ,   ",
      "   ",
      " ",
      "   ",
    ],
    explanation: "     .",
    theoryLines: ["  .", "  ."],
  },
  {
    stem: "   ?",
    options: ["    ", " ", " ", " "],
    explanation: "   .",
    theoryLines: [" =  .", "  ."],
  },
  {
    stem: "   ?",
    options: [" ", " ", "  ", " "],
    explanation: "  .",
    theoryLines: ["  .", "  ."],
  },
  {
    stem: "   ?",
    options: ["", "", "", ""],
    explanation: "  .",
    theoryLines: ["  .", "  ."],
  },
  {
    stem: "   ?",
    options: ["  ", " ", " ", ""],
    explanation: "   .",
    theoryLines: ["  .", "  ."],
  },
];

function levBand(i, easyN, medN) {
  if (i < easyN) return "easy";
  if (i < easyN + medN) return "medium";
  return "hard";
}

function paramsDiff(band) {
  if (band === "easy") return "basic";
  if (band === "medium") return "intermediate";
  return "advanced";
}

function cog(band) {
  if (band === "easy") return "recall";
  if (band === "medium") return "understanding";
  return "application";
}

function mkItem({
  id,
  topic,
  grades,
  band,
  stem,
  options,
  correctIndex,
  explanation,
  theoryLines,
}) {
  const ml = band;
  const xl = band;
  const conceptTag = `p4b1_${topic}_${id.replace(/^p4b1_/, "")}`;
  return {
    id,
    topic,
    grades,
    minLevel: ml,
    maxLevel: xl,
    type: "mcq",
    stem,
    options,
    correctIndex,
    explanation,
    theoryLines,
    params: {
      patternFamily: PF[topic],
      subtype: ST[topic],
      conceptTag,
      diagnosticSkillId: `sci_${conceptTag}`,
      expectedErrorTags: ["concept_confusion", "fact_recall_gap"],
      expectedErrorTypes: ["concept_confusion", "fact_recall_gap"],
      cognitiveLevel: cog(band),
      difficulty: paramsDiff(band),
    },
  };
}

const items = [];

// ---------- Grade 6 only (46) — grades ["g6"], topic spread ----------
const g6Spec = [
  ["body", 8],
  ["animals", 7],
  ["materials", 8],
  ["experiments", 8],
  ["earth_space", 8],
  ["environment", 7],
];
let g6Idx = 0;
for (const [topic, n] of g6Spec) {
  for (let j = 0; j < n; j++) {
    const band = levBand(g6Idx % 23, 8, 8); // cycles ~even thirds across 46
    const tag = String(++g6Idx).padStart(2, "0");
    let stem;
    let options;
    let correctIndex;
    let explanation;
    let theoryLines;

    if (topic === "body") {
      const b = G6_BODY_EASY[j];
      items.push(
        mkItem({
          id: `p4b1_g6_body_${tag}`,
          topic: "body",
          grades: ["g6"],
          band,
          ...b,
          correctIndex: 0,
        })
      );
      continue;
    }
    if (topic === "animals") {
      const b = G6_ANIMALS_MEDIUM[j];
      items.push(
        mkItem({
          id: `p4b1_g6_animals_${tag}`,
          topic: "animals",
          grades: ["g6"],
          band,
          ...b,
          correctIndex: 0,
        })
      );
      continue;
    }
    if (topic === "materials") {
      items.push(
        mkItem({
          id: `p4b1_g6_materials_${tag}`,
          topic: "materials",
          grades: ["g6"],
          band,
          stem:
            j % 2 === 0
              ? "     ?"
              : "         ?",
          options:
            j % 2 === 0
              ? [
                  "          ",
                  "       ",
                  "      ",
                  "      ",
                ]
              : [
                  "   —   ",
                  "    ",
                  "     ",
                  "     ",
                ],
          correctIndex: 0,
          explanation:
            j % 2 === 0
              ? "           ."
              : "     ;      .",
          theoryLines:
            j % 2 === 0
              ? ["     .", "   ."]
              : ["      .", "    ."],
        })
      );
      continue;
    }
    if (topic === "experiments") {
      const b = G6_EXPERIMENTS_EASY[j];
      items.push(
        mkItem({
          id: `p4b1_g6_experiments_${tag}`,
          topic: "experiments",
          grades: ["g6"],
          band,
          ...b,
          correctIndex: 0,
        })
      );
      continue;
    }
    if (topic === "earth_space") {
      items.push(
        mkItem({
          id: `p4b1_g6_earth_${tag}`,
          topic: "earth_space",
          grades: ["g6"],
          band,
          stem:
            j % 3 === 0
              ? "        ?"
              : j % 3 === 1
                ? "      ?"
                : "         ?",
          options:
            j % 3 === 0
              ? [
                  ", ,     ",
                  "       ",
                  "      ",
                  "       ",
                ]
              : j % 3 === 1
                ? [
                    "        ",
                    "     ",
                    "   ",
                    "       ",
                  ]
                : [
                    "  ,     ",
                    "      ",
                    "        ",
                    "      ",
                  ],
          correctIndex: 0,
          explanation:
            j % 3 === 0
              ? "         ."
              : j % 3 === 1
                ? "        ."
                : "  : ,   .",
          theoryLines:
            j % 3 === 0
              ? ["     .", "    ."]
              : j % 3 === 1
                ? ["      .", "    ."]
                : ["    .", "    ."],
        })
      );
      continue;
    }
    // environment
    items.push(
      mkItem({
        id: `p4b1_g6_env_${tag}`,
        topic: "environment",
        grades: ["g6"],
        band,
        stem:
          j % 2 === 0
            ? "      ?"
            : "       ?",
        options:
          j % 2 === 0
            ? [
                "         ",
                "       ",
                "      ",
                "      ",
              ]
            : [
                "         ",
                "       ",
                "      ",
                "      ",
              ],
        correctIndex: 0,
        explanation:
          j % 2 === 0
            ? "        ."
            : "     ;     .",
        theoryLines:
          j % 2 === 0
            ? ["      .", "   ."]
            : ["    .", "    ."],
      })
    );
  }
}

// Fix duplicate IDs from pool reuse — assign unique suffix per item at end
const seenId = new Map();
for (const it of items) {
  const base = it.id.replace(/_\d{2}$/, "");
  const n = (seenId.get(base) || 0) + 1;
  seenId.set(base, n);
  it.id = `${base}_${String(n).padStart(3, "0")}`;
}

// ---------- Grade 4 band (35) — grades ["g4"] only (no cross-grade bucket inflation) ----------
const g4Items = [];
const g4Spec = [
  ["body", 6],
  ["animals", 6],
  ["materials", 6],
  ["experiments", 6],
  ["earth_space", 6],
  ["environment", 5],
];
let g4idx = 0;
for (const [topic, n] of g4Spec) {
  for (let j = 0; j < n; j++) {
    const band = levBand(g4idx - 1, 12, 11);
    const tag = String(++g4idx).padStart(2, "0");
    let stem;
    let options;
    let explanation;
    let theoryLines;

    if (topic === "body") {
      const b = G4_BODY_EASY[j];
      stem = b.stem;
      options = b.options;
      explanation = b.explanation;
      theoryLines = b.theoryLines;
    } else if (topic === "animals") {
      const b = G4_ANIMALS_EASY[j];
      stem = b.stem;
      options = b.options;
      explanation = b.explanation;
      theoryLines = b.theoryLines;
    } else if (topic === "materials") {
      stem =
        j % 3 === 0
          ? "         ?"
          : j % 3 === 1
            ? "    ?"
            : "     ?";
      options =
        j % 3 === 0
          ? [
              "     ;   ",
              "    ",
              "      ",
              "    ",
            ]
          : j % 3 === 1
            ? [
                "    ",
                "     ",
                "   ",
                "     ",
              ]
            : [
                "     ;    ",
                "        ",
                "    ",
                "      ",
              ];
      explanation =
        j % 3 === 0
          ? "   ;     ."
          : j % 3 === 1
            ? "        ."
            : "     .";
      theoryLines =
        j % 3 === 0
          ? ["     .", "   ."]
          : j % 3 === 1
            ? ["    .", "   ."]
            : [": , ,  .", "  ."];
    } else if (topic === "experiments") {
      const b = G4_EXPERIMENTS_MEDIUM[j];
      stem = b.stem;
      options = b.options;
      explanation = b.explanation;
      theoryLines = b.theoryLines;
    } else if (topic === "earth_space") {
      stem =
        j % 2 === 0
          ? "           ?"
          : "         ?";
      options =
        j % 2 === 0
          ? [
              "     /  ",
              "      ",
              "   ",
              "     ",
            ]
          : [
              "        ",
              "     ",
              "     ",
              "     ",
            ];
      explanation =
        j % 2 === 0
          ? "        ."
          : "     ;   .";
      theoryLines =
        j % 2 === 0
          ? ["    .", "   ."]
          : ["   .", "    ."];
    } else {
      stem =
        j % 2 === 0
          ? "       ?"
          : "       ?";
      options =
        j % 2 === 0
          ? [
              "    ,   ",
              "      ",
              "    ",
              "     ",
            ]
          : [
              "      ",
              "    ",
              "   ",
              "    ",
            ];
      explanation =
        j % 2 === 0
          ? "      ."
          : "     .";
      theoryLines =
        j % 2 === 0
          ? ["   .", "      ."]
          : ["   .", "    ."];
    }

    g4Items.push(
      mkItem({
        id: `p4b1_g4_${topic}_${tag}`,
        topic,
        grades: ["g4"],
        band,
        stem,
        options,
        correctIndex: 0,
        explanation,
        theoryLines,
      })
    );
  }
}

const seenG4 = new Map();
for (const it of g4Items) {
  const base = it.id.replace(/_\d{2}$/, "");
  const n = (seenG4.get(base) || 0) + 1;
  seenG4.set(base, n);
  it.id = `${base}_${String(n).padStart(3, "0")}`;
}

// ---------- Grade 2 band (15) — grades ["g2","g3"] ----------
const g2Spec = [
  ["plants", 3],
  ["animals", 2],
  ["environment", 2],
  ["earth_space", 2],
  ["materials", 3],
  ["experiments", 2],
  ["body", 1],
];
const g2Items = [];
let g2idx = 0;
for (const [topic, n] of g2Spec) {
  for (let j = 0; j < n; j++) {
    const band = levBand(g2idx % 15, 6, 6);
    const tag = String(++g2idx).padStart(2, "0");
    let stem;
    let options;
    let explanation;
    let theoryLines;

    if (topic === "plants") {
      stem =
        j % 3 === 0
          ? "      ?"
          : j % 3 === 1
            ? "     ?"
            : "       ?";
      options =
        j % 3 === 0
          ? [
              ",    ",
              "    ",
              "   ",
              "   ",
            ]
          : j % 3 === 1
            ? [
                " ,     ",
                "     ",
                "    ",
                "    ",
              ]
            : [
                "    ",
                "    ",
                "       ",
                "      ",
              ];
      explanation =
        j % 3 === 0
          ? "  ,    ."
          : j % 3 === 1
            ? "     ."
            : "    .";
      theoryLines =
        j % 3 === 0
          ? ["    .", "  ."]
          : j % 3 === 1
            ? ["     .", "    ."]
            : ["    .", "   ."];
    } else if (topic === "animals") {
      stem =
        j % 2 === 0
          ? "     ?"
          : "       ?";
      options =
        j % 2 === 0
          ? [
              ",   ",
              "   ",
              "   ",
              "   ",
            ]
          : [
              ",    —   ",
              "    ",
              "      ",
              "   ",
            ];
      explanation =
        j % 2 === 0
          ? "       ."
          : "     .";
      theoryLines =
        j % 2 === 0
          ? ["  .", "  ."]
          : ["    .", "    ."];
    } else if (topic === "environment") {
      stem =
        j % 2 === 0
          ? "  \" \"   ?"
          : "    ?";
      options =
        j % 2 === 0
          ? [
              "    ",
              "   ",
              "   ",
              "    ",
            ]
          : [
              "       ",
              "     ",
              "    ",
              "      ",
            ];
      explanation =
        j % 2 === 0
          ? "     ."
          : "     .";
      theoryLines =
        j % 2 === 0
          ? ["    .", " : /."]
          : ["    .", "  ."];
    } else if (topic === "earth_space") {
      stem =
        j % 2 === 0
          ? "        ?"
          : "     ?";
      options =
        j % 2 === 0
          ? [
              "       ",
              "     ",
              "    ",
              "   ",
            ]
          : [
              "       ",
              "    ",
              "    ",
              "   ",
            ];
      explanation =
        j % 2 === 0
          ? "       ."
          : "      .";
      theoryLines =
        j % 2 === 0
          ? ["   .", "  ."]
          : ["     .", "   ."];
    } else if (topic === "materials") {
      stem =
        j % 3 === 0
          ? "      ?"
          : j % 3 === 1
            ? "       ?"
            : "    ?";
      options =
        j % 3 === 0
          ? [
              "     ",
              "   ",
              "   ",
              "    ",
            ]
          : j % 3 === 1
            ? [
                "      ",
                "   ",
                "     ",
                "      ",
              ]
            : [
                "     ",
                "   ",
                "   ",
                "     ",
              ];
      explanation =
        j % 3 === 0
          ? "     ."
          : j % 3 === 1
            ? "    ."
            : "   .";
      theoryLines =
        j % 3 === 0
          ? ["   .", "  ."]
          : j % 3 === 1
            ? ["    .", "  ."]
            : ["  .", "     ."];
    } else if (topic === "experiments") {
      stem =
        j % 2 === 0
          ? "      ?"
          : "     ?";
      options =
        j % 2 === 0
          ? [
              "  ,   ",
              "     ",
              "     ",
              "   ",
            ]
          : [
              "      ",
              "     ",
              "      ",
              "    ",
            ];
      explanation =
        j % 2 === 0
          ? "      ."
          : "    .";
      theoryLines =
        j % 2 === 0
          ? ["   .", "   ."]
          : ["   .", "  ."];
    } else {
      // body
      stem =
        "         ?";
      options = [
        "     ",
        "   ",
        "   ",
        "       D",
      ];
      explanation =
        "      ;    .";
      theoryLines = [
        "  .",
        "  .",
      ];
    }

    g2Items.push(
      mkItem({
        id: `p4b1_g2_${topic}_${tag}`,
        topic,
        grades: ["g2", "g3"],
        band,
        stem,
        options,
        correctIndex: 0,
        explanation,
        theoryLines,
      })
    );
  }
}

const seenG2 = new Map();
for (const it of g2Items) {
  const base = it.id.replace(/_\d{2}$/, "");
  const n = (seenG2.get(base) || 0) + 1;
  seenG2.set(base, n);
  it.id = `${base}_${String(n).padStart(3, "0")}`;
}

const all = [...items, ...g4Items, ...g2Items];

const header = `/**
 * Phase 4B-1 — Science coverage additions (static MCQ, Hebrew stems).
 * Wired via data/science-questions.js. Inventory counts use gradeMin per row:
 * g6-only items raise grade 6 counts; g4-only span raises grade 4; g2–g3 span raises grade 2.
 *
 * Generated by scripts/gen-science-phase4b1.mjs — regenerate only when intentionally refreshing this batch.
 */
export const SCIENCE_QUESTIONS_PHASE4B1 = `;

const body = `${JSON.stringify(all, null, 2)};\n`;

writeFileSync(OUT, header + body, "utf8");
console.log(
  `Wrote ${all.length} items to ${OUT} (g6=${items.length}, g4=${g4Items.length}, g2=${g2Items.length})`
);
