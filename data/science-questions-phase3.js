// Metadata enrichment (safe pass): see science metadata reports.
export const SCIENCE_QUESTIONS_PHASE3 = [
  {
    "id": "sci_phb_g1_materials_med_04",
    "topic": "materials",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What kind of material is plastic?",
    "options": [
      "A man-made material created from chemicals, not found naturally.",
      "A natural material made directly from wood.",
      "A material that comes from inside animals.",
      "A material that is exactly the same as glass."
    ],
    "correctIndex": 0,
    "explanation": "Plastic is a man-made material. It is manufactured from chemicals, many of which come from oil. Unlike wood or stone, plastic does not exist in nature — people invented and produce it. Plastic is lightweight, waterproof, and can be shaped into many different forms.",
    "params": {
      "patternFamily": "sci_phb_materials_g1_medium_g1_materials_plastic",
      "subtype": "sci_materials_general",
      "conceptTag": "g1_materials_plastic",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g1",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Most plastics are made from petroleum, a type of fossil fuel.",
      "Because plastic does not break down easily in nature, it can pollute the environment for hundreds of years."
    ]
  },
  {
    "id": "sci_phb_g1_materials_hard_01",
    "topic": "materials",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "How can you compare which material is harder?",
    "options": [
      "See which one scratches the other more easily",
      "Weigh only their colors",
      "Listen for the loudest shadow",
      "Measure how sweet they taste"
    ],
    "correctIndex": 0,
    "explanation": "Harder materials can scratch softer ones. A careful scratch test helps compare hardness.",
    "params": {
      "patternFamily": "sci_phb_materials_g1_hard_g1_materials_hardness_compare",
      "subtype": "sci_materials_general",
      "conceptTag": "g1_materials_hardness_compare",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g1",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Hardness is a property of materials.",
      "Scientists compare properties with simple tests."
    ]
  },
  {
    "id": "sci_phb_g1_materials_hard_02",
    "topic": "materials",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What happens to a soft sponge when you press down hard on it?",
    "options": [
      "It changes shape while pressed but returns to its original shape when released",
      "It breaks apart into tiny pieces that cannot be put back together",
      "It hardens and becomes as stiff as a piece of metal",
      "It always stays exactly the same shape no matter how hard you press"
    ],
    "correctIndex": 0,
    "explanation": "A sponge is a soft, elastic material. When you press it, it compresses and changes shape, but it springs back to its original form when you let go.",
    "params": {
      "patternFamily": "sci_phb_materials_g1_hard_g1_materials_sponge_press",
      "subtype": "sci_materials_general",
      "conceptTag": "g1_materials_sponge_press",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g1",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g1_materials_hard_03",
    "topic": "materials",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "How can you tell if a surface is rough?",
    "options": [
      "It feels uneven and may create more friction",
      "It always tastes salty",
      "It becomes invisible in daylight",
      "It melts at the sound of music"
    ],
    "correctIndex": 0,
    "explanation": "Rough surfaces have bumps or texture you can feel, and they often grip more than smooth surfaces.",
    "params": {
      "patternFamily": "sci_phb_materials_g1_hard_g1_materials_rough_test",
      "subtype": "sci_materials_general",
      "conceptTag": "g1_materials_rough_test",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g1",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Friction is greater on many rough surfaces.",
      "Touch is a useful way to observe texture."
    ]
  },
  {
    "id": "sci_phb_g1_materials_hard_04",
    "topic": "materials",
    "grades": [
      "g1"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why do people use different materials for different objects?",
    "options": [
      "Different materials have different useful properties",
      "Every material behaves exactly the same",
      "Materials have no properties at all",
      "Objects never need matching materials"
    ],
    "correctIndex": 0,
    "explanation": "We choose materials for strength, flexibility, waterproofing, weight, and other properties that fit the job.",
    "params": {
      "patternFamily": "sci_phb_materials_g1_hard_g1_materials_different_props",
      "subtype": "sci_materials_general",
      "conceptTag": "g1_materials_different_props",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g1",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Properties guide material choices.",
      "A raincoat and a sponge are made for different needs."
    ]
  },
  {
    "id": "sci_phb_g1_earth_space_med_01",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What does the sun give us during the daytime?",
    "options": [
      "Light and warmth that let us see and keep Earth at a comfortable temperature",
      "Cold winds and heavy rain that fall from the sky",
      "Fresh drinking water that drips down from the clouds",
      "Gravity that pulls all objects down to the ground"
    ],
    "correctIndex": 0,
    "explanation": "The sun provides light and heat during the day. Its light lets us see, and its warmth keeps the Earth at temperatures that support life.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g1_medium_g1_earth_sun_day",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g1_earth_sun_day",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g1_earth_space_med_02",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What makes a shadow?",
    "options": [
      "An object blocking light",
      "An object creating extra sunlight",
      "Sound bouncing off a wall",
      "Wind spinning in a circle"
    ],
    "correctIndex": 0,
    "explanation": "When light cannot pass through an object, a darker shape called a shadow forms behind it.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g1_medium_g1_earth_shadow",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g1_earth_shadow",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Light travels in straight lines.",
      "Opaque objects block light and cast shadows."
    ]
  },
  {
    "id": "sci_phb_g1_earth_space_med_03",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "When does outdoor weather usually feel coldest?",
    "options": [
      "In winter in many places",
      "Only at noon in midsummer",
      "Only during a heat wave",
      "Only when the sun is closest at midnight"
    ],
    "correctIndex": 0,
    "explanation": "In many regions, winter brings colder temperatures than other seasons.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g1_medium_g1_earth_winter_cold",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g1_earth_winter_cold",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Seasons change temperature patterns.",
      "People dress warmly for cold weather."
    ]
  },
  {
    "id": "sci_phb_g1_earth_space_med_04",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What can you often see in the night sky?",
    "options": [
      "The Moon and stars",
      "Only ocean waves",
      "Only underground roots",
      "Only classroom chalkboards"
    ],
    "correctIndex": 0,
    "explanation": "At night the sky looks dark, and the Moon and stars are easier to notice.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g1_medium_g1_earth_night_sky",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g1_earth_night_sky",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "The Moon reflects sunlight.",
      "Stars are distant suns that look like points of light."
    ]
  },
  {
    "id": "sci_phb_g1_earth_space_hard_01",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why do we have day and night on Earth?",
    "options": [
      "Earth spins on its axis, so different sides face the Sun at different times",
      "The Moon moves in front of the Sun to create nighttime",
      "The Sun travels all the way around Earth once every 24 hours",
      "Thick clouds block all sunlight and cause complete darkness at night"
    ],
    "correctIndex": 0,
    "explanation": "Earth rotates on its axis once every 24 hours. The side facing the Sun experiences day, and the side facing away experiences night.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g1_hard_g1_earth_day_night_spin",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g1_earth_day_night_spin",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g1_earth_space_hard_02",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What can thick clouds do to sunlight during the day?",
    "options": [
      "Block some light and make the ground look dimmer",
      "Turn the sun into the Moon",
      "Stop Earth from rotating",
      "Make shadows impossible forever"
    ],
    "correctIndex": 0,
    "explanation": "Cloud cover can reduce the sunlight that reaches the ground, so a day may look gray and less bright.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g1_hard_g1_earth_cloud_cover",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g1_earth_cloud_cover",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Clouds are made of tiny water droplets or ice crystals.",
      "Weather can change how much sunlight we receive."
    ]
  },
  {
    "id": "sci_phb_g1_earth_space_hard_03",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why does summer feel hotter than other seasons?",
    "options": [
      "The Sun stays up longer and shines more directly, bringing extra light and warmth.",
      "The Sun moves much closer to Earth and becomes visibly larger in summer.",
      "The Moon reflects extra sunlight in summer to make the weather warmer.",
      "It always rains in summer, and rain traps heat in the air."
    ],
    "correctIndex": 0,
    "explanation": "In summer, the part of Earth you live on is tilted toward the Sun. This means the Sun is higher in the sky, its rays hit the ground more directly, and it stays up for more hours each day. More direct sunlight over a longer time means more heat.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g1_hard_g1_earth_summer_heat",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g1_earth_summer_heat",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Earth's tilt, not its distance from the Sun, is what causes the seasons.",
      "When the Northern Hemisphere has summer, the Southern Hemisphere has winter, and vice versa."
    ]
  },
  {
    "id": "sci_phb_g1_earth_space_hard_04",
    "topic": "earth_space",
    "grades": [
      "g1"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why do we wear a raincoat when it rains?",
    "options": [
      "To keep our body dry and protected from getting wet in the rain.",
      "To see the Moon more clearly through the rainy clouds.",
      "To help Earth absorb rainwater faster into the ground.",
      "To make rain fall more slowly and gently."
    ],
    "correctIndex": 0,
    "explanation": "We wear a raincoat so rain does not soak our body and clothes. The waterproof material keeps us dry and protected while it is raining.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g1_hard_g1_earth_rain_coat",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g1_earth_rain_coat",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Waterproof materials make water run off instead of soaking in.",
      "We choose clothes that match the weather to stay comfortable and protected."
    ]
  },
  {
    "id": "sci_phb_g1_environment_med_01",
    "topic": "environment",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "Why is it important to put trash in a trash bin?",
    "options": [
      "It keeps our surroundings clean and prevents animals from getting hurt by litter",
      "Trash bins are only decoration and do not actually help the environment",
      "Leaving trash outside is fine because rain washes it all away quickly",
      "The sun will break down all garbage outdoors before it causes any harm"
    ],
    "correctIndex": 0,
    "explanation": "Throwing trash in a bin keeps the environment clean, prevents animals from eating harmful waste, and stops litter from polluting soil and water.",
    "params": {
      "patternFamily": "sci_phb_environment_g1_medium_g1_env_trash_bin",
      "subtype": "sci_environment_general",
      "conceptTag": "g1_env_trash_bin",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g1_environment_med_02",
    "topic": "environment",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What do plants need to grow and stay healthy?",
    "options": [
      "Water and sunlight",
      "Only packaged nutrients bought from a store",
      "Salt water and deep shade to grow well",
      "Sand and freezing cold weather to survive"
    ],
    "correctIndex": 0,
    "explanation": "Plants need water and sunlight to carry out photosynthesis, the process they use to make their own food and grow.",
    "params": {
      "patternFamily": "sci_phb_environment_g1_medium_g1_env_plants_needs",
      "subtype": "sci_environment_general",
      "conceptTag": "g1_env_plants_needs",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g1_environment_med_03",
    "topic": "environment",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "Why should muddy boots stay off classroom carpets?",
    "options": [
      "Mud can dirty the floor and make cleanup harder",
      "Mud makes math problems easier",
      "Mud replaces the need for books",
      "Mud turns desks into trees"
    ],
    "correctIndex": 0,
    "explanation": "Keeping mud outside helps the classroom stay clean and safe to walk in.",
    "params": {
      "patternFamily": "sci_phb_environment_g1_medium_g1_env_mud_class",
      "subtype": "sci_environment_general",
      "conceptTag": "g1_env_mud_class",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Caring for shared spaces is part of responsibility.",
      "Dirt tracked indoors creates more work for everyone."
    ]
  },
  {
    "id": "sci_phb_g1_environment_med_04",
    "topic": "environment",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What do animals need from the place where they live?",
    "options": [
      "Food, water, shelter, and enough space to survive",
      "Only sunlight and fresh air to stay alive",
      "A large open ocean and constant rainfall",
      "Large numbers of the same kind of animal living very close together"
    ],
    "correctIndex": 0,
    "explanation": "Animals need food, water, shelter, and space in their habitat to meet their basic survival needs and raise their young.",
    "params": {
      "patternFamily": "sci_phb_environment_g1_medium_g1_env_habitat_needs",
      "subtype": "sci_environment_general",
      "conceptTag": "g1_env_habitat_needs",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g1_environment_hard_01",
    "topic": "environment",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why is it important to save water and not waste it?",
    "options": [
      "Fresh water is a limited resource and all living things need it to survive",
      "There is so much water on Earth that it can never run out",
      "Saving water and saving sunlight are exactly the same thing",
      "Water only comes from rivers and cannot be found underground or recycled"
    ],
    "correctIndex": 0,
    "explanation": "Although Earth has a lot of water, only a small amount is fresh and clean enough for living things to use, so it is important to use it carefully.",
    "params": {
      "patternFamily": "sci_phb_environment_g1_hard_g1_env_save_water",
      "subtype": "sci_environment_general",
      "conceptTag": "g1_env_save_water",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g1_environment_hard_02",
    "topic": "environment",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What can litter do if it ends up in the sea?",
    "options": [
      "Harm water, animals, and coastal places",
      "Automatically clean the ocean",
      "Feed every fish a healthy meal",
      "Turn salt water into fresh juice"
    ],
    "correctIndex": 0,
    "explanation": "Trash in the ocean can injure animals and pollute habitats.",
    "params": {
      "patternFamily": "sci_phb_environment_g1_hard_g1_env_sea_litter",
      "subtype": "sci_environment_general",
      "conceptTag": "g1_env_sea_litter",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "People should dispose of trash properly.",
      "Protecting oceans protects wildlife."
    ]
  },
  {
    "id": "sci_phb_g1_environment_hard_03",
    "topic": "environment",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why are trees in a park helpful?",
    "options": [
      "They give shade, homes for animals, and fresher air",
      "They remove all need for water on Earth",
      "They stop seasons from changing",
      "They turn playgrounds into deserts"
    ],
    "correctIndex": 0,
    "explanation": "Trees provide shade, shelter, and oxygen while making parks nicer places to visit.",
    "params": {
      "patternFamily": "sci_phb_environment_g1_hard_g1_env_park_trees",
      "subtype": "sci_environment_general",
      "conceptTag": "g1_env_park_trees",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Plants support healthy environments.",
      "Parks need care so living things can thrive."
    ]
  },
  {
    "id": "sci_phb_g1_environment_hard_04",
    "topic": "environment",
    "grades": [
      "g1"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What should visitors do when they enjoy a nature area?",
    "options": [
      "Leave plants and animals alone and take trash with them",
      "Carve names into every tree",
      "Leave food wrappers on trails",
      "Chase wildlife for fun"
    ],
    "correctIndex": 0,
    "explanation": "Respectful visitors protect habitats so other people and wildlife can enjoy them too.",
    "params": {
      "patternFamily": "sci_phb_environment_g1_hard_g1_env_visit_care",
      "subtype": "sci_environment_general",
      "conceptTag": "g1_env_visit_care",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Leave no trash behind.",
      "Nature places stay healthier when people are careful."
    ]
  },
  {
    "id": "sci_phb_g2_materials_hard_01",
    "topic": "materials",
    "grades": [
      "g1",
      "g2",
      "g3",
      "g4"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "How does metal differ from wood when it comes to conducting heat?",
    "options": [
      "Metal conducts heat much better than wood does",
      "Wood always conducts heat better than any other material",
      "Metal and wood conduct heat in exactly the same way",
      "Wood melts and turns into a liquid when heated, but metal stays solid"
    ],
    "correctIndex": 0,
    "explanation": "Metal is an excellent conductor of heat, while wood is a poor conductor. That is why a metal spoon heats up quickly in hot soup but a wooden spoon stays cool.",
    "params": {
      "patternFamily": "sci_phb_materials_g2_hard_g2_materials_metal_wood",
      "subtype": "sci_materials_general",
      "conceptTag": "g2_materials_metal_wood",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g1",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g2_materials_hard_02",
    "topic": "materials",
    "grades": [
      "g1",
      "g2",
      "g3",
      "g4"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "How can you tell that a material is transparent?",
    "options": [
      "Light can pass through it clearly",
      "It always feels sticky",
      "It blocks every bit of light",
      "It melts only when you whisper"
    ],
    "correctIndex": 0,
    "explanation": "Transparent materials such as clear glass or clear plastic let you see through them.",
    "params": {
      "patternFamily": "sci_phb_materials_g2_hard_g2_materials_transparent",
      "subtype": "sci_materials_general",
      "conceptTag": "g2_materials_transparent",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g1",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Transparent, translucent, and opaque describe how light passes through materials.",
      "Windows are often made of transparent material."
    ]
  },
  {
    "id": "sci_phb_g2_materials_hard_03",
    "topic": "materials",
    "grades": [
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why is plastic often used for light containers and toys?",
    "options": [
      "It can be lightweight, strong, and easy to shape",
      "It always dissolves in cold water instantly",
      "It is the heaviest material on Earth",
      "It can only be used for cooking pans"
    ],
    "correctIndex": 0,
    "explanation": "Plastic's properties make it useful for many everyday objects that should not be too heavy.",
    "params": {
      "patternFamily": "sci_phb_materials_g2_hard_g2_materials_plastic_light",
      "subtype": "sci_materials_general",
      "conceptTag": "g2_materials_plastic_light",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g2",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Material properties guide how we use materials.",
      "Plastics should be recycled or disposed of responsibly."
    ]
  },
  {
    "id": "sci_phb_g2_materials_hard_04",
    "topic": "materials",
    "grades": [
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What can happen to wax when it is heated?",
    "options": [
      "It can melt from a solid into a liquid",
      "It turns into a living plant",
      "It becomes colder than ice automatically",
      "It changes into pure metal"
    ],
    "correctIndex": 0,
    "explanation": "Heating can change wax from solid to liquid. This is a physical change of state.",
    "params": {
      "patternFamily": "sci_phb_materials_g2_hard_g2_materials_wax_melt",
      "subtype": "sci_materials_general",
      "conceptTag": "g2_materials_wax_melt",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g2",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Solids can melt when they gain enough heat.",
      "Cooling can make melted wax become solid again."
    ]
  },
  {
    "id": "sci_phb_g2_earth_space_med_01",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What is a sign that it might rain soon?",
    "options": [
      "Dark clouds gathering in the sky, filled with water droplets.",
      "A bright, clear Moon visible during the day.",
      "A perfectly blue sky with no clouds in sight.",
      "Stars appearing in the sky during the afternoon."
    ],
    "correctIndex": 0,
    "explanation": "Clouds are made of tiny water droplets or ice crystals. When clouds become dark and thick, they hold a lot of water. That is a sign that the water may fall as rain. Watching cloud shapes and colors is one way to predict the weather.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g2_medium_g2_earth_rain_signs",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g2_earth_rain_signs",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "medium",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Dark, heavy clouds are often a sign that rain is on its way.",
      "Meteorologists — weather scientists — use clouds, temperature, and air pressure to forecast the weather."
    ]
  },
  {
    "id": "sci_phb_g2_earth_space_med_02",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What causes wind?",
    "options": [
      "Moving air",
      "Silent moonlight only",
      "Underground roots growing",
      "Shadows walking by themselves"
    ],
    "correctIndex": 0,
    "explanation": "Wind is air in motion, often caused by uneven heating of Earth's surface.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g2_medium_g2_earth_wind_cause",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g2_earth_wind_cause",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "medium",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Warm air and cool air can help create wind.",
      "Wind is part of everyday weather."
    ]
  },
  {
    "id": "sci_phb_g2_earth_space_hard_01",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why do we experience different seasons throughout the year?",
    "options": [
      "Earth’s tilted axis causes different regions to receive more or less sunlight as it orbits the Sun",
      "The Moon moves closer to Earth in summer and farther away in winter",
      "Ocean currents change the temperature of the entire planet each season",
      "The Sun orbits Earth at different speeds during different times of year"
    ],
    "correctIndex": 0,
    "explanation": "Earth’s axis is tilted, so as it orbits the Sun, the Northern and Southern Hemispheres take turns being tilted toward the Sun, causing the seasons.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g2_hard_g2_earth_seasons",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g2_earth_seasons",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g2_earth_space_hard_02",
    "topic": "earth_space",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What happens to a puddle of water on a warm, sunny day?",
    "options": [
      "The heat from the sun causes the water to evaporate and turn into water vapor in the air",
      "The water sinks straight down into the ground and is gone forever",
      "The puddle grows larger because sunlight creates extra water",
      "Sunlight hardens the surface of the puddle so it stays as a permanent solid"
    ],
    "correctIndex": 0,
    "explanation": "Heat from the sun gives water molecules enough energy to escape from the liquid surface and rise into the air as invisible water vapor. This is called evaporation.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g2_hard_g2_earth_evaporation_heat",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g2_earth_evaporation_heat",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g1",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g2_earth_space_hard_03",
    "topic": "earth_space",
    "grades": [
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why does the Dead Sea feel so salty?",
    "options": [
      "It contains a very large amount of dissolved salt",
      "It is made of pure melted sugar",
      "It has no minerals at all",
      "It freezes every afternoon"
    ],
    "correctIndex": 0,
    "explanation": "The Dead Sea is extremely salty because lots of salt stays dissolved in its water.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g2_hard_g2_earth_dead_sea_salt",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g2_earth_dead_sea_salt",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g2",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Some lakes and seas have different amounts of salt.",
      "Salty water can make floating feel easier."
    ]
  },
  {
    "id": "sci_phb_g2_earth_space_hard_04",
    "topic": "earth_space",
    "grades": [
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What role do clouds play in weather?",
    "options": [
      "Clouds hold water droplets and can bring rain, snow, or shade.",
      "Clouds reflect starlight to make the night sky brighter.",
      "Clouds block the Sun completely and are the main cause of night.",
      "Clouds produce sunlight and spread it across Earth's surface."
    ],
    "correctIndex": 0,
    "explanation": "Clouds are made of tiny water droplets or ice crystals floating in the air. When enough droplets collect together, they become heavy and fall as rain or snow. Clouds also block sunlight, which can make a day feel cooler and darker — an important part of Earth's weather system.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g2_hard_g2_earth_cloud_role",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g2_earth_cloud_role",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g2",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "The water cycle — evaporation, condensation, and precipitation — is what forms clouds and brings rain.",
      "Different cloud types, such as cumulus and stratus, are linked to different types of weather."
    ]
  },
  {
    "id": "sci_phb_g2_environment_med_01",
    "topic": "environment",
    "grades": [
      "g1",
      "g2"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "Why should empty bottles be recycled when possible?",
    "options": [
      "Recycling helps reuse materials and reduce waste",
      "Recycling makes litter grow faster",
      "Recycling removes all oxygen from air",
      "Recycling turns parks into deserts"
    ],
    "correctIndex": 0,
    "explanation": "Recycling keeps useful materials in use and can reduce trash that harms the environment.",
    "params": {
      "patternFamily": "sci_phb_environment_g2_medium_g2_env_recycle_bottles",
      "subtype": "sci_environment_general",
      "conceptTag": "g2_env_recycle_bottles",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "medium",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Reduce, reuse, and recycle help the planet.",
      "Sorting recyclables correctly matters."
    ]
  },
  {
    "id": "sci_phb_g2_environment_hard_01",
    "topic": "environment",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why is burning trash outdoors a poor idea?",
    "options": [
      "It can release harmful smoke into the air",
      "It always cleans the atmosphere",
      "It creates only pure drinking water",
      "It helps every animal breathe better"
    ],
    "correctIndex": 0,
    "explanation": "Burning waste can pollute air and create unsafe fumes.",
    "params": {
      "patternFamily": "sci_phb_environment_g2_hard_g2_env_no_burning",
      "subtype": "sci_environment_general",
      "conceptTag": "g2_env_no_burning",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Clean air supports healthy people and wildlife.",
      "Dispose of trash through safe, approved methods."
    ]
  },
  {
    "id": "sci_phb_g2_environment_hard_02",
    "topic": "environment",
    "grades": [
      "g1",
      "g2",
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What can pollution do to a stream?",
    "options": [
      "Make the water unsafe for living things",
      "Automatically create more freshwater fish",
      "Turn the stream into solid gold",
      "Remove the need for clean habitats"
    ],
    "correctIndex": 0,
    "explanation": "Chemicals, trash, and other pollutants can harm plants, animals, and people who depend on clean water.",
    "params": {
      "patternFamily": "sci_phb_environment_g2_hard_g2_env_stream_pollution",
      "subtype": "sci_environment_general",
      "conceptTag": "g2_env_stream_pollution",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g1",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Clean water is an important natural resource.",
      "Preventing pollution protects ecosystems."
    ]
  },
  {
    "id": "sci_phb_g2_environment_hard_03",
    "topic": "environment",
    "grades": [
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why do people plant trees?",
    "options": [
      "Trees provide oxygen, shade, and homes for wildlife",
      "Trees remove all soil from Earth",
      "Trees stop rain from ever falling",
      "Trees replace the need for sunlight"
    ],
    "correctIndex": 0,
    "explanation": "Trees help the environment by making oxygen, giving shade, and supporting animals.",
    "params": {
      "patternFamily": "sci_phb_environment_g2_hard_g2_env_plant_trees",
      "subtype": "sci_environment_general",
      "conceptTag": "g2_env_plant_trees",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g2",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Plants release oxygen that animals need.",
      "Tree planting is a helpful conservation action."
    ]
  },
  {
    "id": "sci_phb_g2_environment_hard_04",
    "topic": "environment",
    "grades": [
      "g2"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What do ants do to help other ants find food they have discovered?",
    "options": [
      "They leave a chemical scent trail so other ants can follow the path to the food",
      "They make loud sounds to call all the other ants to the food",
      "They carry the food back silently without communicating with the colony",
      "They build a wall around the food to block other animals from reaching it"
    ],
    "correctIndex": 0,
    "explanation": "Ants leave a pheromone (chemical scent) trail from the food back to the nest. Other ants follow this invisible trail to find and collect the food.",
    "params": {
      "patternFamily": "sci_phb_environment_g2_hard_g2_env_trail_behavior",
      "subtype": "sci_environment_general",
      "conceptTag": "g2_env_trail_behavior",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g2",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g3_materials_eas_01",
    "topic": "materials",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Which material is a good conductor of electricity?",
    "options": [
      "Metal such as copper",
      "Dry wood",
      "Rubber",
      "Plastic wrap"
    ],
    "correctIndex": 0,
    "explanation": "Metals allow electric current to flow easily, so they are used in wires.",
    "params": {
      "patternFamily": "sci_phb_materials_g3_easy_g3_materials_conductor",
      "subtype": "sci_materials_general",
      "conceptTag": "g3_materials_conductor",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g3",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Conductors let electricity pass through.",
      "Insulators such as rubber resist electric flow."
    ]
  },
  {
    "id": "sci_phb_g3_materials_eas_02",
    "topic": "materials",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What state of matter is water normally found in at room temperature?",
    "options": [
      "Liquid",
      "Solid",
      "Gas",
      "Plasma"
    ],
    "correctIndex": 0,
    "explanation": "At room temperature, water is a liquid. It becomes ice (solid) when cooled below 32°F (0°C) and turns to steam (gas) when heated above 212°F (100°C).",
    "params": {
      "patternFamily": "sci_phb_materials_g3_easy_g3_materials_water_liquid",
      "subtype": "sci_materials_general",
      "conceptTag": "g3_materials_water_liquid",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g3",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g3_materials_hard_01",
    "topic": "materials",
    "grades": [
      "g3",
      "g4"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What usually makes an ice cube melt faster?",
    "options": [
      "Warmer surroundings",
      "Putting it in a colder freezer",
      "Keeping it away from all heat forever",
      "Wrapping it in thicker ice"
    ],
    "correctIndex": 0,
    "explanation": "Heat energy makes ice melt. A warmer place transfers heat more quickly to the ice.",
    "params": {
      "patternFamily": "sci_phb_materials_g3_hard_g3_materials_ice_melt_rate",
      "subtype": "sci_materials_general",
      "conceptTag": "g3_materials_ice_melt_rate",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g3",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Melting is a change from solid to liquid.",
      "Temperature affects how fast ice melts."
    ]
  },
  {
    "id": "sci_phb_g3_materials_hard_02",
    "topic": "materials",
    "grades": [
      "g3",
      "g4"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What is the difference between a physical change and a chemical change?",
    "options": [
      "A physical change may alter form, while a chemical change makes a new substance",
      "Physical changes always create brand-new elements",
      "Chemical changes never happen in kitchens",
      "Melting iron is always a chemical change into wood"
    ],
    "correctIndex": 0,
    "explanation": "Melting and tearing are physical changes. Burning wood is a chemical change because new substances form.",
    "params": {
      "patternFamily": "sci_phb_materials_g3_hard_g3_materials_phys_vs_chem",
      "subtype": "sci_materials_general",
      "conceptTag": "g3_materials_phys_vs_chem",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g3",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Physical changes do not make a new kind of matter.",
      "Chemical changes rearrange matter into new materials."
    ]
  },
  {
    "id": "sci_phb_g3_earth_space_eas_01",
    "topic": "earth_space",
    "grades": [
      "g3",
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What causes daytime?",
    "options": [
      "Earth rotating so that our part of the planet faces toward the Sun.",
      "The Moon moving in front of the Sun and reflecting light downward.",
      "The Sun traveling around Earth once every 24 hours.",
      "Rain clouds moving away to let sunlight through."
    ],
    "correctIndex": 0,
    "explanation": "Earth spins on its own axis once every 24 hours. When the part of Earth where you live turns to face the Sun, sunlight reaches you and it becomes daytime. As Earth continues spinning, that same part faces away from the Sun and it becomes night.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g3_easy_g3_earth_day_night",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g3_earth_day_night",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g3",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Earth's rotation — its spin on its axis — is what creates the cycle of day and night.",
      "The Sun does not move around Earth; Earth's spin just makes it look that way from the ground."
    ]
  },
  {
    "id": "sci_phb_g3_earth_space_eas_02",
    "topic": "earth_space",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Where does the Moon's light come from?",
    "options": [
      "It reflects light from the Sun",
      "It makes its own fire like a campfire",
      "It glows using ocean salt only",
      "It borrows light from Earth's core"
    ],
    "correctIndex": 0,
    "explanation": "The Moon does not produce its own visible light. We see sunlight bouncing off its surface.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g3_easy_g3_earth_moon_light",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g3_earth_moon_light",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g3",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "The Moon can look bright even though it reflects sunlight.",
      "Moon phases depend on how we see the lit side."
    ]
  },
  {
    "id": "sci_phb_g3_earth_space_hard_01",
    "topic": "earth_space",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why are places near the Mediterranean Sea often milder than inland deserts?",
    "options": [
      "Nearby seas help moderate temperature",
      "Deserts are always next to glaciers",
      "Oceans remove all sunlight",
      "Sand creates tropical rain every hour"
    ],
    "correctIndex": 0,
    "explanation": "Large bodies of water heat and cool more slowly than land, so coastal climates are often milder.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g3_hard_g3_earth_med_climate",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g3_earth_med_climate",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g3",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Geography affects climate.",
      "Water can reduce extreme temperature swings."
    ]
  },
  {
    "id": "sci_phb_g3_earth_space_hard_02",
    "topic": "earth_space",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What is condensation in the water cycle?",
    "options": [
      "Water vapor cooling and forming tiny liquid droplets",
      "Ice turning instantly into solid metal",
      "Rocks dissolving into pure oxygen",
      "Sunlight freezing into snowflakes"
    ],
    "correctIndex": 0,
    "explanation": "When cooled water vapor becomes liquid droplets, clouds or dew can form.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g3_hard_g3_earth_condensation",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g3_earth_condensation",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g3",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Condensation is the opposite of evaporation.",
      "Clouds often form by condensation in the air."
    ]
  },
  {
    "id": "sci_phb_g3_environment_eas_01",
    "topic": "environment",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What usually starts a simple food chain?",
    "options": [
      "Plants that make food from sunlight",
      "Lions that eat only rocks",
      "Clouds that hunt insects",
      "Cars that grow leaves"
    ],
    "correctIndex": 0,
    "explanation": "Producers such as plants capture sunlight and provide food energy for consumers.",
    "params": {
      "patternFamily": "sci_phb_environment_g3_easy_g3_env_food_chain_start",
      "subtype": "sci_environment_general",
      "conceptTag": "g3_env_food_chain_start",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g3",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Food chains show who eats whom.",
      "Energy flows from producers to consumers."
    ]
  },
  {
    "id": "sci_phb_g3_environment_eas_02",
    "topic": "environment",
    "grades": [
      "g3"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Why is recycling paper helpful?",
    "options": [
      "It saves materials and can reduce waste",
      "It makes trees disappear faster on purpose",
      "It pollutes rivers automatically",
      "It stops people from reading books"
    ],
    "correctIndex": 0,
    "explanation": "Recycling paper reuses fiber so fewer new resources may be needed and less trash piles up.",
    "params": {
      "patternFamily": "sci_phb_environment_g3_easy_g3_env_paper_recycle",
      "subtype": "sci_environment_general",
      "conceptTag": "g3_env_paper_recycle",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g3",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Paper comes from plant materials.",
      "Recycling is one way to care for the environment."
    ]
  },
  {
    "id": "sci_phb_g3_environment_hard_01",
    "topic": "environment",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "What can deforestation do to a forest ecosystem?",
    "options": [
      "Remove trees that animals and soil depend on",
      "Instantly create more ancient woodland",
      "Make every habitat safer automatically",
      "Stop carbon dioxide from existing"
    ],
    "correctIndex": 0,
    "explanation": "Cutting down large areas of forest destroys homes for wildlife and can harm soil and climate balance.",
    "params": {
      "patternFamily": "sci_phb_environment_g3_hard_g3_env_deforestation",
      "subtype": "sci_environment_general",
      "conceptTag": "g3_env_deforestation",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g3",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Forests support many living things.",
      "Protecting forests helps biodiversity."
    ]
  },
  {
    "id": "sci_phb_g3_environment_hard_02",
    "topic": "environment",
    "grades": [
      "g3"
    ],
    "minLevel": "hard",
    "maxLevel": "hard",
    "type": "mcq",
    "stem": "Why is air pollution harmful to people and animals?",
    "options": [
      "Breathing polluted air can damage lungs and cause serious health problems",
      "Air pollution only affects plants and has no effect on people or animals",
      "Clean water always washes air pollution away before it can harm anyone",
      "Air pollution is only dangerous inside city limits and harmless in rural areas"
    ],
    "correctIndex": 0,
    "explanation": "Polluted air contains harmful particles and gases that can irritate and damage the lungs, making it difficult to breathe and increasing the risk of illness.",
    "params": {
      "patternFamily": "sci_phb_environment_g3_hard_g3_env_air_pollution",
      "subtype": "sci_environment_general",
      "conceptTag": "g3_env_air_pollution",
      "difficulty": "advanced",
      "cognitiveLevel": "analysis",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g3",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "hard",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g4_materials_eas_01",
    "topic": "materials",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "How can you separate sand from water?",
    "options": [
      "Pour the mixture through a filter",
      "Wait for sand to turn into sugar",
      "Freeze the sunlight only",
      "Stir until the sand becomes invisible forever"
    ],
    "correctIndex": 0,
    "explanation": "Sand does not dissolve in water. Filtering can catch the sand while water passes through.",
    "params": {
      "patternFamily": "sci_phb_materials_g4_easy_g4_materials_sand_water_sep",
      "subtype": "sci_materials_general",
      "conceptTag": "g4_materials_sand_water_sep",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g4",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Mixtures can often be separated by physical methods.",
      "Filtration works when one material is undissolved."
    ]
  },
  {
    "id": "sci_phb_g4_materials_eas_02",
    "topic": "materials",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What is true about a liquid?",
    "options": [
      "It takes the shape of its container",
      "It always keeps a fixed shape like a rock",
      "It cannot be poured",
      "It has no volume at all"
    ],
    "correctIndex": 0,
    "explanation": "Liquids flow and match the shape of the container while keeping a definite volume.",
    "params": {
      "patternFamily": "sci_phb_materials_g4_easy_g4_materials_liquid_shape",
      "subtype": "sci_materials_general",
      "conceptTag": "g4_materials_liquid_shape",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g4",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Solids, liquids, and gases are states of matter.",
      "Water is a common liquid."
    ]
  },
  {
    "id": "sci_phb_g4_earth_space_eas_01",
    "topic": "earth_space",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What mainly creates the repeating pattern of day and night?",
    "options": [
      "Earth spinning on its axis every 24 hours.",
      "The Moon blocking the Sun's light to create darkness.",
      "The Sun traveling around Earth from east to west each day.",
      "Rain clouds covering the Sun and making everything dark."
    ],
    "correctIndex": 0,
    "explanation": "Earth rotates once about every 24 hours. The side facing the Sun has day, and the side turned away has night.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g4_easy_g4_earth_rotation_day",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g4_earth_rotation_day",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g4",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Day and night repeat because Earth spins.",
      "Earth's orbit around the Sun is the main reason for seasons, not day and night."
    ]
  },
  {
    "id": "sci_phb_g4_earth_space_eas_02",
    "topic": "earth_space",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What starts the water cycle by turning liquid water into vapor?",
    "options": [
      "Evaporation powered by heat from the Sun",
      "Rocks jumping into clouds",
      "Fish breathing fire",
      "Shadows freezing rivers"
    ],
    "correctIndex": 0,
    "explanation": "Sunlight heats water so some of it evaporates into the air as water vapor.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g4_easy_g4_earth_water_cycle_start",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g4_earth_water_cycle_start",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g4",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "The water cycle moves water around Earth.",
      "Evaporation, condensation, and precipitation are key steps."
    ]
  },
  {
    "id": "sci_phb_g4_environment_eas_01",
    "topic": "environment",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What is a habitat in science?",
    "options": [
      "The natural place where an animal or plant lives and gets what it needs to survive",
      "The specific food that an animal eats every single day",
      "A location where flowers bloom only during spring",
      "The body of water where all fish and sea animals must live"
    ],
    "correctIndex": 0,
    "explanation": "A habitat is the natural environment where a plant or animal lives. It provides everything the organism needs, including food, water, shelter, and space.",
    "params": {
      "patternFamily": "sci_phb_environment_g4_easy_g4_env_habitat_def",
      "subtype": "sci_environment_general",
      "conceptTag": "g4_env_habitat_def",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g4",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g4_environment_eas_02",
    "topic": "environment",
    "grades": [
      "g4"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What is the original source of energy for almost all food chains on Earth?",
    "options": [
      "The Sun",
      "The Moon",
      "Soil nutrients",
      "Wind and rain"
    ],
    "correctIndex": 0,
    "explanation": "Almost all food chains begin with the Sun. Plants capture sunlight through photosynthesis and use it to produce food, which other organisms then eat.",
    "params": {
      "patternFamily": "sci_phb_environment_g4_easy_g4_env_sun_energy_chain",
      "subtype": "sci_environment_general",
      "conceptTag": "g4_env_sun_energy_chain",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g4",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g5_materials_eas_01",
    "topic": "materials",
    "grades": [
      "g5",
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Which material is a good electrical insulator?",
    "options": [
      "Rubber",
      "Copper wire metal",
      "Aluminum foil",
      "Silver"
    ],
    "correctIndex": 0,
    "explanation": "Insulators resist electric current. Rubber is often used to cover wires for safety.",
    "params": {
      "patternFamily": "sci_phb_materials_g5_easy_g5_materials_insulator",
      "subtype": "sci_materials_general",
      "conceptTag": "g5_materials_insulator",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g5",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Insulators protect people from electric shock.",
      "Metals are usually conductors, not insulators."
    ]
  },
  {
    "id": "sci_phb_g5_materials_eas_02",
    "topic": "materials",
    "grades": [
      "g5",
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Which change is a physical change?",
    "options": [
      "Ice melting into liquid water",
      "Wood burning into ash and smoke",
      "Iron rusting into a new material",
      "Baking powder reacting in a cake batter"
    ],
    "correctIndex": 0,
    "explanation": "Melting changes water's state but not its chemical identity. Burning and rusting make new substances.",
    "params": {
      "patternFamily": "sci_phb_materials_g5_easy_g5_materials_physical_change",
      "subtype": "sci_materials_general",
      "conceptTag": "g5_materials_physical_change",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g5",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Physical changes can often be reversed.",
      "Chemical changes produce different materials."
    ]
  },
  {
    "id": "sci_phb_g5_materials_eas_03",
    "topic": "materials",
    "grades": [
      "g5"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What is a common property of many metals?",
    "options": [
      "They conduct heat and electricity well",
      "They are always gases at room temperature",
      "They never shine when polished",
      "They dissolve instantly in dry air only"
    ],
    "correctIndex": 0,
    "explanation": "Metals are often shiny, strong, and good conductors of heat and electricity.",
    "params": {
      "patternFamily": "sci_phb_materials_g5_easy_g5_materials_metal_props",
      "subtype": "sci_materials_general",
      "conceptTag": "g5_materials_metal_props",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g5",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Copper and aluminum are useful metal conductors.",
      "Material properties explain how metals are used."
    ]
  },
  {
    "id": "sci_phb_g5_materials_med_01",
    "topic": "materials",
    "grades": [
      "g5"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What usually helps a solid dissolve faster in water?",
    "options": [
      "Stirring and using warmer water",
      "Keeping the water colder and still",
      "Using larger unbreakable chunks only",
      "Removing all of the water"
    ],
    "correctIndex": 0,
    "explanation": "Warmth and stirring help particles mix so many solids dissolve more quickly.",
    "params": {
      "patternFamily": "sci_phb_materials_g5_medium_g5_materials_dissolve_rate",
      "subtype": "sci_materials_general",
      "conceptTag": "g5_materials_dissolve_rate",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g5",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "medium",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Dissolving forms a solution.",
      "Temperature and particle size can affect dissolving rate."
    ]
  },
  {
    "id": "sci_phb_g5_materials_med_02",
    "topic": "materials",
    "grades": [
      "g5"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What is the main difference between a mixture and a chemical compound?",
    "options": [
      "In a mixture the substances can be physically separated, but in a compound the elements are chemically bonded together",
      "Mixtures and compounds always behave the same way when heated or cooled",
      "A compound is always found as a gas at room temperature",
      "You can always separate the parts of a compound easily by hand"
    ],
    "correctIndex": 0,
    "explanation": "A mixture is a combination of substances that keep their own properties and can be physically separated. A compound forms when elements chemically bond, creating a new substance with different properties.",
    "params": {
      "patternFamily": "sci_phb_materials_g5_medium_g5_materials_mixture_compound",
      "subtype": "sci_materials_general",
      "conceptTag": "g5_materials_mixture_compound",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g5",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "medium",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g5_earth_space_eas_01",
    "topic": "earth_space",
    "grades": [
      "g5",
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What do daily weather reports usually describe?",
    "options": [
      "Temperature, wind, clouds, and precipitation",
      "Only the names of ancient dinosaurs",
      "Only the depth of Earth's core",
      "Only the taste of soil minerals"
    ],
    "correctIndex": 0,
    "explanation": "Weather is the day-to-day condition of the atmosphere, including heat, wind, and rain or snow.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g5_easy_g5_earth_daily_weather",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g5_earth_daily_weather",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g5",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Weather can change from day to day.",
      "Climate describes longer-term patterns."
    ]
  },
  {
    "id": "sci_phb_g5_earth_space_eas_02",
    "topic": "earth_space",
    "grades": [
      "g5",
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What helps create wind?",
    "options": [
      "Differences in air pressure caused by uneven heating",
      "Silent moonlight pushing rocks",
      "Underground rivers freezing solid",
      "Shadows trading places with clouds"
    ],
    "correctIndex": 0,
    "explanation": "When air is heated unevenly, pressure differences form and air moves as wind.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g5_easy_g5_earth_wind_pressure",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g5_earth_wind_pressure",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g5",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Air moves from higher pressure toward lower pressure.",
      "The Sun's energy drives much of Earth's weather."
    ]
  },
  {
    "id": "sci_phb_g5_environment_eas_01",
    "topic": "environment",
    "grades": [
      "g5"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What does conservation mean?",
    "options": [
      "Protecting and carefully using natural resources",
      "Wasting water and energy on purpose",
      "Destroying habitats for fun",
      "Ignoring trash in parks"
    ],
    "correctIndex": 0,
    "explanation": "Conservation means taking care of nature so resources and wildlife can last for the future.",
    "params": {
      "patternFamily": "sci_phb_environment_g5_easy_g5_env_conservation",
      "subtype": "sci_environment_general",
      "conceptTag": "g5_env_conservation",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g5",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "People share responsibility for the environment.",
      "Small daily choices can support conservation."
    ]
  },
  {
    "id": "sci_phb_g5_environment_eas_02",
    "topic": "environment",
    "grades": [
      "g5"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Why is recycling important?",
    "options": [
      "It reduces waste and helps reuse valuable materials",
      "It creates more ocean litter on purpose",
      "It removes all plants from forests",
      "It makes clean air disappear"
    ],
    "correctIndex": 0,
    "explanation": "Recycling keeps materials in use longer and can lessen pollution and landfill trash.",
    "params": {
      "patternFamily": "sci_phb_environment_g5_easy_g5_env_recycle_importance",
      "subtype": "sci_environment_general",
      "conceptTag": "g5_env_recycle_importance",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g5",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Recycling works best when materials are sorted correctly.",
      "Reduce and reuse are also helpful habits."
    ]
  },
  {
    "id": "sci_phb_g6_materials_eas_01",
    "topic": "materials",
    "grades": [
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Which of the following is an example of a chemical change in a material?",
    "options": [
      "Burning wood, which produces ash and smoke and cannot be reversed",
      "Melting an ice cube into liquid water",
      "Breaking a glass into smaller pieces",
      "Mixing sand into water"
    ],
    "correctIndex": 0,
    "explanation": "A chemical change creates a new substance with different properties. Burning wood is a chemical change because it produces ash and gases, and the wood cannot be restored.",
    "params": {
      "patternFamily": "sci_phb_materials_g6_easy_g6_materials_chemical_change",
      "subtype": "sci_materials_general",
      "conceptTag": "g6_materials_chemical_change",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g6",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g6_materials_eas_02",
    "topic": "materials",
    "grades": [
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Which material is often used as an electrical insulator?",
    "options": [
      "Plastic",
      "Copper",
      "Aluminum",
      "Silver"
    ],
    "correctIndex": 0,
    "explanation": "Plastic resists electric current, so it is commonly used to coat wires and make safe handles.",
    "params": {
      "patternFamily": "sci_phb_materials_g6_easy_g6_materials_insulator_plastic",
      "subtype": "sci_materials_general",
      "conceptTag": "g6_materials_insulator_plastic",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g6",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Insulators protect users from shock.",
      "Metals are usually conductors instead."
    ]
  },
  {
    "id": "sci_phb_g6_materials_eas_03",
    "topic": "materials",
    "grades": [
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What are the three states that water can exist in?",
    "options": [
      "Solid (ice), liquid (water), and gas (water vapor or steam)",
      "Only solid and gas, never in liquid form",
      "Liquid and solid only, it can never become a gas",
      "Plasma, crystal, and liquid"
    ],
    "correctIndex": 0,
    "explanation": "Water exists as ice (solid) when frozen, liquid water at normal temperatures, and water vapor or steam (gas) when heated enough. These are its three states of matter.",
    "params": {
      "patternFamily": "sci_phb_materials_g6_easy_g6_materials_water_states",
      "subtype": "sci_materials_general",
      "conceptTag": "g6_materials_water_states",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g6",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": []
  },
  {
    "id": "sci_phb_g6_materials_med_01",
    "topic": "materials",
    "grades": [
      "g6"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "What happens during a phase change of water?",
    "options": [
      "Water changes form, such as liquid to gas, without becoming a new substance",
      "Water turns into a brand-new metal element",
      "Water permanently loses all hydrogen",
      "Water becomes living tissue"
    ],
    "correctIndex": 0,
    "explanation": "Melting, freezing, evaporation, and condensation change water's state, not its chemical identity.",
    "params": {
      "patternFamily": "sci_phb_materials_g6_medium_g6_materials_phase_change",
      "subtype": "sci_materials_general",
      "conceptTag": "g6_materials_phase_change",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g6",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "medium",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "H2O stays water in solid, liquid, or gas form.",
      "Heat energy drives many phase changes."
    ]
  },
  {
    "id": "sci_phb_g6_materials_med_02",
    "topic": "materials",
    "grades": [
      "g6"
    ],
    "minLevel": "medium",
    "maxLevel": "medium",
    "type": "mcq",
    "stem": "Which factors can speed up dissolving?",
    "options": [
      "Higher temperature, stirring, and smaller pieces",
      "Lower temperature and no movement",
      "Larger chunks left untouched in ice water",
      "Removing the solvent completely"
    ],
    "correctIndex": 0,
    "explanation": "Warmth, stirring, and greater surface area help solute particles mix into the solvent faster.",
    "params": {
      "patternFamily": "sci_phb_materials_g6_medium_g6_materials_dissolution_factors",
      "subtype": "sci_materials_general",
      "conceptTag": "g6_materials_dissolution_factors",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "expectedErrorTags": [
        "concept_confusion",
        "misconception",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_materials_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "materials",
        "grade": "g6",
        "skillId": "sci_materials_general",
        "subSkill": "sci_materials_general",
        "questionType": "technical",
        "problemClass": "mixed",
        "difficulty": "medium",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "concept_confusion",
          "misconception",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_materials_general",
    "skillId": "sci_materials_general",
    "theoryLines": [
      "Dissolving rate depends on conditions.",
      "Scientists control variables when they study dissolving."
    ]
  },
  {
    "id": "sci_phb_g6_earth_space_eas_01",
    "topic": "earth_space",
    "grades": [
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What mainly causes Earth's seasons?",
    "options": [
      "Earth's tilted axis as it orbits the Sun",
      "The Moon turning off the Sun each month",
      "Clouds hiding all of outer space forever",
      "Oceans stopping Earth from moving"
    ],
    "correctIndex": 0,
    "explanation": "Because Earth is tilted, different hemispheres receive more direct sunlight at different times of year.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g6_easy_g6_earth_seasons_tilt",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g6_earth_seasons_tilt",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g6",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "Earth orbits the Sun once each year.",
      "Tilt, not distance alone, is the key reason for seasons."
    ]
  },
  {
    "id": "sci_phb_g6_earth_space_eas_02",
    "topic": "earth_space",
    "grades": [
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What role does the Sun play in the water cycle?",
    "options": [
      "It provides energy that drives evaporation",
      "It freezes all oceans every morning",
      "It removes water from Earth permanently",
      "It stops clouds from ever forming"
    ],
    "correctIndex": 0,
    "explanation": "Solar energy heats water so it can evaporate, beginning a major part of the water cycle.",
    "params": {
      "patternFamily": "sci_phb_earth_space_g6_easy_g6_earth_sun_water_cycle",
      "subtype": "sci_earth_space_general",
      "conceptTag": "g6_earth_sun_water_cycle",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_earth_space_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "earth_space",
        "grade": "g6",
        "skillId": "sci_earth_space_general",
        "subSkill": "sci_earth_space_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_earth_space_general",
    "skillId": "sci_earth_space_general",
    "theoryLines": [
      "The Sun powers weather and the water cycle.",
      "Evaporated water can later condense and fall as precipitation."
    ]
  },
  {
    "id": "sci_phb_g6_environment_eas_01",
    "topic": "environment",
    "grades": [
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "What does biodiversity mean?",
    "options": [
      "The variety of living things in an area",
      "A single species living alone forever",
      "Only rocks and minerals with no life",
      "Weather that never changes"
    ],
    "correctIndex": 0,
    "explanation": "Biodiversity is the mix of plants, animals, and other organisms that share a habitat.",
    "params": {
      "patternFamily": "sci_phb_environment_g6_easy_g6_env_biodiversity",
      "subtype": "sci_environment_general",
      "conceptTag": "g6_env_biodiversity",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "expectedErrorTags": [
        "fact_recall_gap",
        "concept_confusion",
        "careless_error"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g6",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "recall",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "fact_recall_gap",
          "concept_confusion",
          "careless_error"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Healthy ecosystems often have many species.",
      "Protecting habitats helps protect biodiversity."
    ]
  },
  {
    "id": "sci_phb_g6_environment_eas_02",
    "topic": "environment",
    "grades": [
      "g6"
    ],
    "minLevel": "easy",
    "maxLevel": "easy",
    "type": "mcq",
    "stem": "Why is water pollution a serious problem?",
    "options": [
      "It can harm people, animals, and ecosystems that need clean water",
      "It makes every river safer to drink",
      "It increases biodiversity automatically",
      "It removes all need for conservation"
    ],
    "correctIndex": 0,
    "explanation": "Polluted water can carry harmful substances that damage health and habitats.",
    "params": {
      "patternFamily": "sci_phb_environment_g6_easy_g6_env_water_pollution",
      "subtype": "sci_environment_general",
      "conceptTag": "g6_env_water_pollution",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "kind": "phase_b",
      "expectedErrorTypes": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "expectedErrorTags": [
        "misconception",
        "concept_confusion",
        "fact_recall_gap"
      ],
      "diagnosticSkillId": "sci_environment_general",
      "canonicalMetadata": {
        "contractVersion": "question-metadata-contract-v1",
        "subject": "science",
        "topic": "environment",
        "grade": "g6",
        "skillId": "sci_environment_general",
        "subSkill": "sci_environment_general",
        "questionType": "technical",
        "problemClass": "conceptual",
        "difficulty": "basic",
        "difficultyDepth": "simple_application",
        "requiresVisual": false,
        "requiresAudio": false,
        "answerFormat": "mcq",
        "metadataConfidence": "high",
        "diagnosticEligibleByMetadata": true,
        "possibleErrorPatterns": [
          "misconception",
          "concept_confusion",
          "fact_recall_gap"
        ],
        "notes": null
      }
    },
    "subSkill": "sci_environment_general",
    "skillId": "sci_environment_general",
    "theoryLines": [
      "Clean water is essential for life.",
      "Preventing pollution protects communities and nature."
    ]
  }
];
