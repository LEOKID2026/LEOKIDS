/** Science production completion — Batch 1 (grade-targeted MCQs, varied stems). Wired from data/science-questions.js.
 * English source conversion: node scripts/i18n/convert-science-banks-to-english.mjs
 */

export const SCIENCE_QUESTIONS_PRODUCTION_BATCH1 = [
  {
    "id": "sci_pb1_g3_body_easy_01",
    "topic": "body",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What main of lungs in the body human?",
    "options": [
      "Oxygen air.",
      "Blood from material.",
      "To lungs.",
      "Food long."
    ],
    "correctIndex": 0,
    "explanation": "System breathing body.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "science_respiratory_gas_exchange",
      "subtype": "sci_body_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill",
      "conceptTag": "lungs_primary_gas_exchange",
      "diagnosticSkillId": "sci_respiration_concept",
      "expectedErrorTags": [
        "lungs_primary_gas_exchange",
        "respiration_system_confusion",
        "cause_effect_gap"
      ],
      "probePower": "high"
    }
  },
  {
    "id": "sci_pb1_g3_body_easy_02",
    "topic": "body",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Which organ food?",
    "options": [
      "Stomach.",
      "Lungs usually all.",
      "Sight.",
      "Science question"
    ],
    "correctIndex": 0,
    "explanation": "System digestive stomach food.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_body_g3_easy",
      "subtype": "sci_body_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill",
      "conceptTag": "digestive_organs_after_swallow",
      "diagnosticSkillId": "sci_g3_body_systems_basic",
      "expectedErrorTags": [
        "digestive_organs_after_swallow",
        "organ_system_confusion",
        "fact_recall_gap"
      ]
    }
  },
  {
    "id": "sci_pb1_g3_body_hard_01",
    "topic": "body",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What true circulatory blood?",
    "options": [
      "Blood to body.",
      "Always blood in oxygen.",
      "Science question",
      "Heart."
    ],
    "correctIndex": 0,
    "explanation": "Blood; blood to heart ( ).",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_body_g3_hard",
      "subtype": "sci_body_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_body_hard_02",
    "topic": "body",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Through system breathing circulatory?",
    "options": [
      "Breathing circulatory in oxygen oxygen.",
      "Circulatory oxygen usually all.",
      "Muscles oxygen from air.",
      "Heart to oxygen usually all."
    ],
    "correctIndex": 0,
    "explanation": "In lungs on oxygen in blood.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_body_g3_hard",
      "subtype": "sci_body_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_animals_easy_01",
    "topic": "animals",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What?",
    "options": [
      "Or.",
      "To.",
      "Through.",
      "Usually all."
    ],
    "correctIndex": 0,
    "explanation": "Usually all.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_animals_g3_easy",
      "subtype": "sci_animals_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_animals_hard_01",
    "topic": "animals",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What best of animal living?",
    "options": [
      "In night to from heat.",
      "In water without all.",
      "All food.",
      "To desert usually all."
    ],
    "correctIndex": 0,
    "explanation": "On.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_animals_g3_hard",
      "subtype": "sci_animals_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_plants_easy_01",
    "topic": "plants",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What plants to photosynthesis in day?",
    "options": [
      "Light, water from air.",
      "Hot water usually all.",
      "Usually all.",
      "Without all."
    ],
    "correctIndex": 0,
    "explanation": "In photosynthesis use in light, in water.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_plants_g3_easy",
      "subtype": "sci_plants_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_materials_easy_01",
    "topic": "materials",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "How material in class?",
    "options": [
      "With through material.",
      "Material always.",
      "On material experiment.",
      "All metal always."
    ],
    "correctIndex": 0,
    "explanation": ";.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_materials_g3_easy",
      "subtype": "sci_materials_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_materials_hard_01",
    "topic": "materials",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What on of class?",
    "options": [
      "Science question",
      "In class usually all.",
      "Student experiment.",
      "Without to environment."
    ],
    "correctIndex": 0,
    "explanation": "On.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_materials_g3_hard",
      "subtype": "sci_materials_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_experiments_easy_01",
    "topic": "experiments",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What experiment?",
    "options": [
      "What variable.",
      "All.",
      "Science question",
      "Variable."
    ],
    "correctIndex": 0,
    "explanation": "In experiment from morning variable.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_experiments_g3_easy",
      "subtype": "sci_experiments_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_earth_space_easy_01",
    "topic": "earth_space",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What describes true Earth Earth sun?",
    "options": [
      "Earth Earth sun.",
      "Earth Earth sun without.",
      "Sun Earth Earth in day without.",
      "Science question"
    ],
    "correctIndex": 0,
    "explanation": "Earth Earth sun of light.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_earth_space_g3_easy",
      "subtype": "sci_earth_space_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_earth_space_hard_01",
    "topic": "earth_space",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What light near?",
    "options": [
      "Sun more more more.",
      "On.",
      "Light usually all.",
      "Moon in all day usually all."
    ],
    "correctIndex": 0,
    "explanation": "Day of sun.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_earth_space_g3_hard",
      "subtype": "sci_earth_space_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_environment_easy_01",
    "topic": "environment",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What through?",
    "options": [
      "Science question",
      "Class usually all.",
      "Nose.",
      "To all."
    ],
    "correctIndex": 0,
    "explanation": ".",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_environment_g3_easy",
      "subtype": "sci_environment_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g3_environment_hard_01",
    "topic": "environment",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What result plants?",
    "options": [
      "With.",
      "Science question",
      "Rain liver usually all.",
      "Usually all."
    ],
    "correctIndex": 0,
    "explanation": "Plants on.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_environment_g3_hard",
      "subtype": "sci_environment_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_body_easy_01",
    "topic": "body",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What true to system digestive?",
    "options": [
      "Food more materials to body.",
      "Oxygen usually all.",
      "Role with lungs blood.",
      "Movement of."
    ],
    "correctIndex": 0,
    "explanation": "System digestive food,.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_body_g4_easy",
      "subtype": "sci_body_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_body_hard_01",
    "topic": "body",
    "grades": [
      "g4"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What more on of body?",
    "options": [
      "Large heart to.",
      "Always usually all.",
      "Heart.",
      "To muscles."
    ],
    "correctIndex": 0,
    "explanation": "Body oxygen more.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_body_g4_hard",
      "subtype": "sci_body_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_animals_easy_01",
    "topic": "animals",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What living of with from not?",
    "options": [
      ",,.",
      "All.",
      "All usually all.",
      "Science question"
    ],
    "correctIndex": 0,
    "explanation": "From not with.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_animals_g4_easy",
      "subtype": "sci_animals_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_animals_hard_01",
    "topic": "animals",
    "grades": [
      "g4"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What food plant?",
    "options": [
      "Energy.",
      "Plants not.",
      "All animals living more.",
      "Without."
    ],
    "correctIndex": 0,
    "explanation": "Plants material.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_animals_g4_hard",
      "subtype": "sci_animals_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_materials_easy_01",
    "topic": "materials",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What of?",
    "options": [
      "Of on or.",
      "Always without usually all.",
      "Materials usually all.",
      "To water without experiment."
    ],
    "correctIndex": 0,
    "explanation": "With.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_materials_g4_easy",
      "subtype": "sci_materials_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_materials_hard_01",
    "topic": "materials",
    "grades": [
      "g4"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "When true in experiment?",
    "options": [
      "Material with variable or.",
      "Material with.",
      "Gas.",
      "On paper variable without."
    ],
    "correctIndex": 0,
    "explanation": "Material; on material with.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_materials_g4_hard",
      "subtype": "sci_materials_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_experiments_easy_01",
    "topic": "experiments",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What role hypothesis?",
    "options": [
      "Experiment.",
      "Result variable never.",
      "Of usually all.",
      "Of."
    ],
    "correctIndex": 0,
    "explanation": "Hypothesis.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_experiments_g4_easy",
      "subtype": "sci_experiments_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_experiments_hard_01",
    "topic": "experiments",
    "grades": [
      "g4"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What true of experiment?",
    "options": [
      "Science question",
      "Always result.",
      "Always.",
      "Of experiment."
    ],
    "correctIndex": 0,
    "explanation": ".",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_experiments_g4_hard",
      "subtype": "sci_experiments_general",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "advanced",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_earth_space_easy_01",
    "topic": "earth_space",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What on day?",
    "options": [
      "Earth Earth sun.",
      "Science question",
      "Science question",
      "Usually all."
    ],
    "correctIndex": 0,
    "explanation": "Sun on day.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_earth_space_g4_easy",
      "subtype": "sci_earth_space_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g4_environment_easy_01",
    "topic": "environment",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What through?",
    "options": [
      "Science question",
      "Usually all.",
      "Science question",
      "In soil usually all."
    ],
    "correctIndex": 0,
    "explanation": "Recycling or materials.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_environment_g4_easy",
      "subtype": "sci_environment_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g5_body_easy_01",
    "topic": "body",
    "grades": [
      "g5"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What true of role kidneys in system circulatory?",
    "options": [
      "On.",
      "Oxygen to blood.",
      "On sight usually all.",
      "Role lungs."
    ],
    "correctIndex": 0,
    "explanation": "Kidneys role blood.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_body_g5_easy",
      "subtype": "sci_body_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g5_body_medium_01",
    "topic": "body",
    "grades": [
      "g5"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What heart usually all?",
    "options": [
      "To oxygen to muscles.",
      "Without.",
      "Always without blood.",
      "On."
    ],
    "correctIndex": 0,
    "explanation": "Heart to on oxygen.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_body_g5_medium",
      "subtype": "sci_body_general",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "standard",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g5_animals_medium_01",
    "topic": "animals",
    "grades": [
      "g5"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What?",
    "options": [
      "To large.",
      "Always without.",
      "On.",
      "All usually all."
    ],
    "correctIndex": 0,
    "explanation": "On.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_animals_g5_medium",
      "subtype": "sci_animals_general",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "standard",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g5_materials_medium_01",
    "topic": "materials",
    "grades": [
      "g5"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What experiment on of materials?",
    "options": [
      "With.",
      "Material usually all.",
      "Material not usually all.",
      "Material."
    ],
    "correctIndex": 0,
    "explanation": ".",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_materials_g5_medium",
      "subtype": "sci_materials_general",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "standard",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g6_body_medium_01",
    "topic": "body",
    "grades": [
      "g6"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What energy in day?",
    "options": [
      "With in energy.",
      "On morning always without.",
      "Fast to energy usually all.",
      "Without usually all."
    ],
    "correctIndex": 0,
    "explanation": "In energy day.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_body_g6_medium",
      "subtype": "sci_body_general",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "standard",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g2_earth_space_easy_01",
    "topic": "earth_space",
    "grades": [
      "g2"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What describes true day?",
    "options": [
      "Sun day.",
      "Moon always without movement.",
      "Stars.",
      "Day."
    ],
    "correctIndex": 0,
    "explanation": "Day sun in weather variable on.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_earth_space_g2_easy",
      "subtype": "sci_earth_space_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g2_earth_space_easy_02",
    "topic": "earth_space",
    "grades": [
      "g2"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What moon night in observation?",
    "options": [
      "Through.",
      "Always from not in all evening without.",
      "Sun.",
      "Usually all."
    ],
    "correctIndex": 0,
    "explanation": "Moon light sun.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_earth_space_g2_easy",
      "subtype": "sci_earth_space_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g2_earth_space_easy_03",
    "topic": "earth_space",
    "grades": [
      "g2"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What of weather?",
    "options": [
      ",.",
      "Of.",
      "In class.",
      "Teacher."
    ],
    "correctIndex": 0,
    "explanation": "Weather.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_earth_space_g2_easy",
      "subtype": "sci_earth_space_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g2_earth_space_easy_04",
    "topic": "earth_space",
    "grades": [
      "g2"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What through in sun day?",
    "options": [
      "Through in sun or on.",
      "Long.",
      "Science question",
      "Sun usually all."
    ],
    "correctIndex": 0,
    "explanation": "In eyes in sun.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_earth_space_g2_easy",
      "subtype": "sci_earth_space_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  },
  {
    "id": "sci_pb1_g6_environment_easy_01",
    "topic": "environment",
    "grades": [
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What class?",
    "options": [
      "Or on.",
      "To all student.",
      "From all usually all.",
      "Near class usually all."
    ],
    "correctIndex": 0,
    "explanation": "Not.",
    "theoryLines": [
      ", class.",
      "To to observation or to experiment."
    ],
    "params": {
      "patternFamily": "sci_pb1_environment_g6_easy",
      "subtype": "sci_environment_general",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "concept_confusion",
        "fact_recall_gap"
      ],
      "difficulty": "basic",
      "kind": "production_batch1_fill"
    }
  }
];
