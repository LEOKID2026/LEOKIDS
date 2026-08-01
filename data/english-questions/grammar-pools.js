// Metadata enrichment (safe pass): difficulty, cognitiveLevel, expectedErrorTypes, skillId (when no diagnostic), subtype (pool bucket when taxonomy-valid), prerequisiteSkillIds (gated). See reports/question-metadata-qa/english-metadata-apply-report.json.
import { enrichEnglishGrammarPools } from "../../utils/english-grammar-diagnostic-metadata-enrich.js";
import { GRAMMAR_POOLS_PHASE_B } from "./grammar-pools-phase-b.js";

export const GRAMMAR_POOLS = {
  "be_basic": [
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_1",
      "conceptTag": "english_be_agreement",
      "diagnosticSkillId": "en_grammar_be_present",
      "probePower": "medium",
      "expectedErrorTags": [
        "grammar_pattern_error"
      ],
      "question": "Choose the correct word: \"I ___ ten years old\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "am",
      "explanation": "With I we use am.",
      "difficulty": "basic",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_pattern_error",
        "grammar_error",
        "careless_error"
      ],
      "subtype": "be_basic",
      "explanationByLocale": {
        "en": "With I we use am.",
        "es-419": "Con I usamos am."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_2",
      "conceptTag": "english_be_agreement",
      "diagnosticSkillId": "en_grammar_be_present",
      "probePower": "medium",
      "expectedErrorTags": [
        "grammar_pattern_error"
      ],
      "question": "Choose the correct word: \"He ___ my teacher\"",
      "options": [
        "are",
        "is",
        "am"
      ],
      "correct": "is",
      "explanation": "He/She/It → is.",
      "difficulty": "basic",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_pattern_error",
        "grammar_error",
        "careless_error"
      ],
      "subtype": "be_basic",
      "explanationByLocale": {
        "en": "He/She/It → is.",
        "es-419": "Él/Ella/Eso → es."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_3",
      "conceptTag": "english_be_agreement",
      "diagnosticSkillId": "en_grammar_be_present",
      "probePower": "medium",
      "expectedErrorTags": [
        "grammar_pattern_error"
      ],
      "question": "Complete the sentence: \"We ___ in class\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "We/They → are.",
      "difficulty": "basic",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_pattern_error",
        "grammar_error",
        "careless_error"
      ],
      "subtype": "be_basic",
      "explanationByLocale": {
        "en": "We/They → are.",
        "es-419": "Nosotros/Ellos → somos."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_4",
      "conceptTag": "english_be_agreement",
      "diagnosticSkillId": "en_grammar_be_present",
      "probePower": "medium",
      "expectedErrorTags": [
        "grammar_pattern_error"
      ],
      "question": "Choose the correct word: \"They ___ happy\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "They → are.",
      "difficulty": "basic",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_pattern_error",
        "grammar_error",
        "careless_error"
      ],
      "subtype": "be_basic",
      "explanationByLocale": {
        "en": "They → are.",
        "es-419": "Ellos → son."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_5",
      "question": "Choose the correct word: \"She ___ a student\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "She → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_5",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → is.",
        "es-419": "Ella → es."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_6",
      "question": "Complete: \"You ___ my friend\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "You → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_6",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "You → are.",
        "es-419": "Tú → lo eres."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_7",
      "question": "Choose: \"It ___ a book\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "It → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_7",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "It → is.",
        "es-419": "Es → lo es."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_8",
      "question": "Complete: \"Tom and I ___ friends\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "Tom and I = We → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_8",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tom and I = We → are.",
        "es-419": "Tom y yo = Nosotros → somos."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_9",
      "question": "Choose: \"The cat ___ sleeping\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "The cat = It → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_9",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The cat = It → is.",
        "es-419": "El gato = Él → es."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_10",
      "question": "Complete: \"My friends ___ nice\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "My friends = They → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_10",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My friends = They → are.",
        "es-419": "Mis amigos = Ellos → son."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_11",
      "question": "Choose: \"I ___ from Israel\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "am",
      "explanation": "I → am.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_11",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → am.",
        "es-419": "Yo → soy."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_12",
      "question": "Complete: \"You and Sarah ___ in class\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "You and Sarah = plural → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_12",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "You and Sarah = plural → are.",
        "es-419": "Tú y Sarah = plural → sois."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_13",
      "question": "Choose: \"The pencil ___ blue\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "The pencil = It → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_13",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The pencil = It → is.",
        "es-419": "El lápiz = Es → es."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_14",
      "question": "Complete: \"These books ___ new\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "These books = plural → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_14",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "These books = plural → are.",
        "es-419": "Estos libros = plural → son."
      }
    },
    {
      "minGrade": 1,
      "maxGrade": 1,
      "patternFamily": "be_basic_g1_15",
      "question": "Choose: \"My mother ___ a teacher\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "My mother = She → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g1_15",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My mother = She → is.",
        "es-419": "Mi madre = Ella → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_1",
      "question": "Complete: \"The children ___ playing\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "The children = They → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_1",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The children = They → are.",
        "es-419": "Los niños = Ellos → son."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_2",
      "question": "Choose: \"I ___ six years old\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "am",
      "explanation": "I → am.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_2",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → am.",
        "es-419": "Yo → soy."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_3",
      "question": "Complete: \"Sara and I ___ classmates\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "Sara and I = We → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_3",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Sara and I = We → are.",
        "es-419": "Sara y yo = Nosotros → somos."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_4",
      "question": "Choose: \"The dog ___ brown\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "The dog = It → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_4",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The dog = It → is.",
        "es-419": "El perro = Es → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_5",
      "question": "Complete: \"My sister and brother ___ at home\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "My sister and brother = They → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_5",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My sister and brother = They → are.",
        "es-419": "Mi hermana y mi hermano = Ellos → son."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_6",
      "question": "Choose: \"I ___ a student\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "am",
      "explanation": "I → am.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_6",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → am.",
        "es-419": "Yo → soy."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_7",
      "question": "Choose: \"You ___ my best friend\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "You → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_7",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "You → are.",
        "es-419": "Tú → lo eres."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_8",
      "question": "Choose: \"He ___ very tall\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "He → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_8",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He → is.",
        "es-419": "Él → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_9",
      "question": "Choose: \"She ___ a doctor\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "She → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_9",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → is.",
        "es-419": "Ella → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_10",
      "question": "Choose: \"It ___ a beautiful day\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "It → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_10",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "It → is.",
        "es-419": "Es → lo es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_11",
      "question": "Choose: \"We ___ classmates\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "We → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_11",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → are.",
        "es-419": "Nosotros → somos."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_12",
      "question": "Choose: \"They ___ good friends\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "They → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_12",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → are.",
        "es-419": "Ellos → son."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_13",
      "question": "Choose: \"My name ___ Tom\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "My name (it) → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_13",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My name (it) → is.",
        "es-419": "Mi nombre (eso) → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_14",
      "question": "Choose: \"The books ___ on the table\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "The books (plural) → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_14",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The books (plural) → are.",
        "es-419": "Los libros (plural) → son."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_15",
      "question": "Choose: \"I ___ not tired\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "am",
      "explanation": "I → am (also in negative).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_15",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → am (also in negative).",
        "es-419": "Yo → soy (también en negativo)."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_16",
      "question": "Choose: \"She ___ not here\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "She → is (also in negative).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_16",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → is (also in negative).",
        "es-419": "Ella → es (también en negativo)."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_17",
      "question": "Choose: \"We ___ not ready\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "We → are (also in negative).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_17",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → are (also in negative).",
        "es-419": "Nosotros → somos (también en negativo)."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_18",
      "question": "Choose: \"The cat ___ sleeping\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "The cat (it) → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_18",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The cat (it) → is.",
        "es-419": "El gato (ello) → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_19",
      "question": "Choose: \"My parents ___ at work\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "My parents (they) → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_19",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My parents (they) → are.",
        "es-419": "Mis padres (ellos) → son."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_20",
      "question": "Choose: \"I ___ happy today\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "am",
      "explanation": "I → am.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_20",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → am.",
        "es-419": "Yo → soy."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_21",
      "question": "Choose: \"You ___ very kind\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "You → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_21",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "You → are.",
        "es-419": "Tú → lo eres."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_22",
      "question": "Choose: \"He ___ my brother\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "He → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_22",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He → is.",
        "es-419": "Él → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_23",
      "question": "Choose: \"She ___ a teacher\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "She → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_23",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → is.",
        "es-419": "Ella → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_24",
      "question": "Choose: \"It ___ cold outside\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "It → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_24",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "It → is.",
        "es-419": "Es → lo es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_25",
      "question": "Choose: \"We ___ students\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "We → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_25",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → are.",
        "es-419": "Nosotros → somos."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_26",
      "question": "Choose: \"They ___ playing\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "They → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_26",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → are.",
        "es-419": "Ellos → son."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_27",
      "question": "Choose: \"The dog ___ brown\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "The dog (it) → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_27",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The dog (it) → is.",
        "es-419": "El perro (él) → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_28",
      "question": "Choose: \"My friends ___ nice\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "My friends (they) → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_28",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My friends (they) → are.",
        "es-419": "Mis amigos (ellos) → son."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_29",
      "question": "Choose: \"I ___ from Tel Aviv\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "am",
      "explanation": "I → am.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_29",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → am.",
        "es-419": "Yo → soy."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_30",
      "question": "Choose: \"You ___ right\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "You → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_30",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "You → are.",
        "es-419": "Tú → lo eres."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_31",
      "question": "Choose: \"He ___ wrong\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "He → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_31",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He → is.",
        "es-419": "Él → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_32",
      "question": "Choose: \"She ___ correct\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "She → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_32",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → is.",
        "es-419": "Ella → es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_33",
      "question": "Choose: \"It ___ important\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "is",
      "explanation": "It → is.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_33",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "It → is.",
        "es-419": "Es → lo es."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_34",
      "question": "Choose: \"We ___ here\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "We → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_34",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → are.",
        "es-419": "Nosotros → somos."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "be_basic_g2_35",
      "question": "Choose: \"They ___ there\"",
      "options": [
        "am",
        "is",
        "are"
      ],
      "correct": "are",
      "explanation": "They → are.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "subject_verb_agreement_error"
      ],
      "skillId": "be_basic_g2_35",
      "subtype": "be_basic",
      "diagnosticSkillId": "en_grammar_be_present",
      "conceptTag": "english_be_agreement",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "subject_verb_agreement_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → are.",
        "es-419": "Ellos → son."
      }
    }
  ],
  "question_frames": [
    {
      "question": "Choose the correct question word: \"___ is your name?\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a name with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a name with What.",
        "es-419": "Pregunta por un nombre con What."
      }
    },
    {
      "question": "Choose the correct question word: \"___ do you live?\"",
      "options": [
        "Where",
        "Why",
        "Who"
      ],
      "correct": "Where",
      "explanation": "Ask about a place with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a place with Where.",
        "es-419": "Pregunta por un lugar con Dónde."
      }
    },
    {
      "question": "Choose the correct helper: \"___ you like pizza?\"",
      "options": [
        "Do",
        "Does",
        "Is"
      ],
      "correct": "Do",
      "explanation": "With You we use Do in questions.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "With You we use Do in questions.",
        "es-419": "Contigo utilizamos Do en las preguntas."
      }
    },
    {
      "question": "Choose the correct order: \"___ is this?\" (pointing at an object)",
      "options": [
        "Who",
        "What",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a thing with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a thing with What.",
        "es-419": "Preguntar sobre algo con qué."
      }
    },
    {
      "question": "Choose: \"___ are you?\" - \"I'm fine\"",
      "options": [
        "How",
        "What",
        "Where"
      ],
      "correct": "How",
      "explanation": "Ask about feelings or health with How.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about feelings or health with How.",
        "es-419": "Pregunta sobre sentimientos o salud con Cómo."
      }
    },
    {
      "question": "Choose: \"___ is your birthday?\"",
      "options": [
        "When",
        "Where",
        "Who"
      ],
      "correct": "When",
      "explanation": "Ask about time with When.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about time with When.",
        "es-419": "Pregunta sobre el tiempo con Cuándo."
      }
    },
    {
      "question": "Choose: \"___ is your favorite color?\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a choice or opinion with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a choice or opinion with What.",
        "es-419": "Pregunta sobre una elección u opinión con What."
      }
    },
    {
      "question": "Choose: \"___ do you go to school?\" - \"At eight o'clock\"",
      "options": [
        "When",
        "Where",
        "Why"
      ],
      "correct": "When",
      "explanation": "Ask about a time of day with When.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a time of day with When.",
        "es-419": "Pregunta sobre una hora del día con Cuándo."
      }
    },
    {
      "question": "Choose: \"___ is your teacher?\"",
      "options": [
        "Who",
        "What",
        "Where"
      ],
      "correct": "Who",
      "explanation": "Ask about a person with Who.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a person with Who.",
        "es-419": "Pregunta por una persona con Quién."
      }
    },
    {
      "question": "Choose: \"___ do you go to school?\" - \"By bus\"",
      "options": [
        "How",
        "What",
        "Where"
      ],
      "correct": "How",
      "explanation": "Ask about how or by what means with How.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about how or by what means with How.",
        "es-419": "Preguntar sobre cómo o por qué medio con Cómo."
      }
    },
    {
      "question": "Choose: \"___ color is your bag?\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a feature with What + noun.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a feature with What + noun.",
        "es-419": "Pregunte acerca de una característica con What + sustantivo."
      }
    },
    {
      "question": "Choose: \"___ does she like ice cream?\" - \"Because it's sweet\"",
      "options": [
        "Why",
        "What",
        "Where"
      ],
      "correct": "Why",
      "explanation": "Ask about a reason with Why.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a reason with Why.",
        "es-419": "Pregunte acerca de una razón con el por qué."
      }
    },
    {
      "question": "Choose: \"___ old are you?\"",
      "options": [
        "How",
        "What",
        "Where"
      ],
      "correct": "How",
      "explanation": "Ask about age with How old.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about age with How old.",
        "es-419": "Pregunte sobre la edad con ¿Cuántos años?"
      }
    },
    {
      "question": "Choose: \"___ is your best friend?\"",
      "options": [
        "Who",
        "What",
        "Where"
      ],
      "correct": "Who",
      "explanation": "Ask about a person with Who.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a person with Who.",
        "es-419": "Pregunta por una persona con Quién."
      }
    },
    {
      "question": "Choose: \"___ does the lesson start?\"",
      "options": [
        "When",
        "Where",
        "Who"
      ],
      "correct": "When",
      "explanation": "Ask about a start time with When.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a start time with When.",
        "es-419": "Pregunte sobre la hora de inicio con Cuándo."
      }
    },
    {
      "question": "Choose: \"___ is your pencil?\" - \"In my bag\"",
      "options": [
        "Where",
        "What",
        "Who"
      ],
      "correct": "Where",
      "explanation": "Ask about a location with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a location with Where.",
        "es-419": "Pregunta por una ubicación con Dónde."
      }
    },
    {
      "question": "Choose: \"___ does Tom play?\" - \"Football\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about an activity with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about an activity with What.",
        "es-419": "Pregunta por una actividad con What."
      }
    },
    {
      "question": "Choose: \"___ many books do you have?\"",
      "options": [
        "How",
        "What",
        "Where"
      ],
      "correct": "How",
      "explanation": "Ask about a countable amount with How many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a countable amount with How many.",
        "es-419": "Pregunte por una cantidad contable con cuántos."
      }
    },
    {
      "question": "Choose: \"___ is the library?\" - \"Next to the school\"",
      "options": [
        "Where",
        "What",
        "Who"
      ],
      "correct": "Where",
      "explanation": "Ask about a location with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a location with Where.",
        "es-419": "Pregunta por una ubicación con Dónde."
      }
    },
    {
      "question": "Choose: \"___ does she study?\" - \"English and Math\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a school subject with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a school subject with What.",
        "es-419": "Pregunta sobre una materia escolar con What."
      }
    },
    {
      "question": "Choose: \"___ is your favorite subject?\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a choice with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a choice with What.",
        "es-419": "Pregunte acerca de una opción con What."
      }
    },
    {
      "question": "Choose: \"___ do you live?\" - \"In Jerusalem\"",
      "options": [
        "Where",
        "What",
        "When"
      ],
      "correct": "Where",
      "explanation": "Ask about a place with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a place with Where.",
        "es-419": "Pregunta por un lugar con Dónde."
      }
    },
    {
      "question": "Choose: \"___ is your birthday?\" - \"In May\"",
      "options": [
        "When",
        "Where",
        "Who"
      ],
      "correct": "When",
      "explanation": "Ask about time with When.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about time with When.",
        "es-419": "Pregunta sobre el tiempo con Cuándo."
      }
    },
    {
      "question": "Choose: \"___ is your teacher?\" - \"Mrs. Cohen\"",
      "options": [
        "Who",
        "What",
        "Where"
      ],
      "correct": "Who",
      "explanation": "Ask about a person with Who.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a person with Who.",
        "es-419": "Pregunta por una persona con Quién."
      }
    },
    {
      "question": "Choose: \"___ do you go to school?\" - \"By bus\"",
      "options": [
        "How",
        "What",
        "Where"
      ],
      "correct": "How",
      "explanation": "Ask about how with How.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about how with How.",
        "es-419": "Pregunta cómo con Cómo."
      }
    },
    {
      "question": "Choose: \"___ do you like pizza?\" - \"Because it's delicious\"",
      "options": [
        "Why",
        "What",
        "Where"
      ],
      "correct": "Why",
      "explanation": "Ask about a reason with Why.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a reason with Why.",
        "es-419": "Pregunte acerca de una razón con el por qué."
      }
    },
    {
      "question": "Choose: \"___ many books do you have?\"",
      "options": [
        "How",
        "What",
        "Where"
      ],
      "correct": "How",
      "explanation": "Ask about a countable amount with How many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a countable amount with How many.",
        "es-419": "Pregunte por una cantidad contable con cuántos."
      }
    },
    {
      "question": "Choose: \"___ much water do you drink?\"",
      "options": [
        "How",
        "What",
        "Where"
      ],
      "correct": "How",
      "explanation": "Ask about an uncountable amount with How much.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about an uncountable amount with How much.",
        "es-419": "Pregunta por una cantidad incontable con Cuanto."
      }
    },
    {
      "question": "Choose: \"___ old are you?\" - \"I'm ten\"",
      "options": [
        "How",
        "What",
        "Where"
      ],
      "correct": "How",
      "explanation": "Ask about age with How old.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about age with How old.",
        "es-419": "Pregunte sobre la edad con ¿Cuántos años?"
      }
    },
    {
      "question": "Choose: \"___ is your name?\" - \"My name is Tom\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a name with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a name with What.",
        "es-419": "Pregunta por un nombre con What."
      }
    },
    {
      "question": "Choose: \"___ are you from?\" - \"I'm from Israel\"",
      "options": [
        "Where",
        "What",
        "When"
      ],
      "correct": "Where",
      "explanation": "Ask about a place of origin with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a place of origin with Where.",
        "es-419": "Pregunta por un lugar de origen con Dónde."
      }
    },
    {
      "question": "Choose: \"___ do you wake up?\" - \"At 7 o'clock\"",
      "options": [
        "When",
        "Where",
        "Who"
      ],
      "correct": "When",
      "explanation": "Ask about an hour with When.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about an hour with When.",
        "es-419": "Pregunta alrededor de una hora con When."
      }
    },
    {
      "question": "Choose: \"___ is your best friend?\" - \"Sarah\"",
      "options": [
        "Who",
        "What",
        "Where"
      ],
      "correct": "Who",
      "explanation": "Ask about a person with Who.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a person with Who.",
        "es-419": "Pregunta por una persona con Quién."
      }
    },
    {
      "question": "Choose: \"___ do you like to do?\" - \"I like to read\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about an activity with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about an activity with What.",
        "es-419": "Pregunta por una actividad con What."
      }
    },
    {
      "question": "Choose: \"___ is the library?\" - \"Next to the school\"",
      "options": [
        "Where",
        "What",
        "Who"
      ],
      "correct": "Where",
      "explanation": "Ask about a location with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a location with Where.",
        "es-419": "Pregunta por una ubicación con Dónde."
      }
    },
    {
      "question": "Choose: \"___ do you study?\" - \"Every day\"",
      "options": [
        "When",
        "Where",
        "Who"
      ],
      "correct": "When",
      "explanation": "Ask about frequency with When.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about frequency with When.",
        "es-419": "Preguntar sobre la frecuencia con Cuando."
      }
    },
    {
      "question": "Choose: \"___ is your favorite color?\" - \"Blue\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a choice with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a choice with What.",
        "es-419": "Pregunte acerca de una opción con What."
      }
    },
    {
      "question": "Choose: \"___ do you play?\" - \"Football\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about sports with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about sports with What.",
        "es-419": "Pregunta por deportes con What."
      }
    },
    {
      "question": "Choose: \"___ are you going?\" - \"To the park\"",
      "options": [
        "Where",
        "What",
        "When"
      ],
      "correct": "Where",
      "explanation": "Ask about a destination with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a destination with Where.",
        "es-419": "Pregunta por un destino con Dónde."
      }
    },
    {
      "question": "Choose: \"___ is the test?\" - \"Next week\"",
      "options": [
        "When",
        "Where",
        "Who"
      ],
      "correct": "When",
      "explanation": "Ask about time with When.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about time with When.",
        "es-419": "Pregunta sobre el tiempo con Cuándo."
      }
    },
    {
      "question": "Choose: \"___ do you eat breakfast?\" - \"In the morning\"",
      "options": [
        "When",
        "Where",
        "Who"
      ],
      "correct": "When",
      "explanation": "Ask about time with When.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about time with When.",
        "es-419": "Pregunta sobre el tiempo con Cuándo."
      }
    },
    {
      "question": "Choose: \"___ is your phone?\" - \"In my bag\"",
      "options": [
        "Where",
        "What",
        "When"
      ],
      "correct": "Where",
      "explanation": "Ask about a location with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a location with Where.",
        "es-419": "Pregunta por una ubicación con Dónde."
      }
    },
    {
      "question": "Choose: \"___ do you want?\" - \"A sandwich\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a thing with what.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a thing with what.",
        "es-419": "Preguntar sobre una cosa con qué."
      }
    },
    {
      "question": "Choose: \"___ can help me?\" - \"I can\"",
      "options": [
        "Who",
        "What",
        "Where"
      ],
      "correct": "Who",
      "explanation": "Ask about a person with Who.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a person with Who.",
        "es-419": "Pregunta por una persona con Quién."
      }
    },
    {
      "question": "Choose: \"___ is your favorite animal?\" - \"A dog\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a choice with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a choice with What.",
        "es-419": "Pregunte acerca de una opción con What."
      }
    },
    {
      "question": "Choose: \"___ do you speak?\" - \"Hebrew and English\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about language with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about language with What.",
        "es-419": "Preguntar sobre lenguaje con What."
      }
    },
    {
      "question": "Choose: \"___ is your address?\" - \"123 Main Street\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "They ask about an address with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They ask about an address with What.",
        "es-419": "Preguntan por una dirección con What."
      }
    },
    {
      "question": "Choose: \"___ do you come from?\" - \"Israel\"",
      "options": [
        "Where",
        "What",
        "When"
      ],
      "correct": "Where",
      "explanation": "Ask about a place of origin with Where.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a place of origin with Where.",
        "es-419": "Pregunta por un lugar de origen con Dónde."
      }
    },
    {
      "question": "Choose: \"___ is your favorite food?\" - \"Pizza\"",
      "options": [
        "What",
        "Where",
        "When"
      ],
      "correct": "What",
      "explanation": "Ask about a choice with What.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "question_word_order_error",
        "auxiliary_error"
      ],
      "patternFamily": "question_frames_question_frames",
      "diagnosticSkillId": "en_grammar_question_frames",
      "conceptTag": "english_question_frames",
      "expectedErrorTags": [
        "question_word_order_error",
        "auxiliary_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ask about a choice with What.",
        "es-419": "Pregunte acerca de una opción con What."
      }
    }
  ],
  "present_simple": [
    {
      "question": "Choose the correct form: \"She ___ basketball on Fridays\"",
      "options": [
        "play",
        "plays",
        "playing"
      ],
      "correct": "plays",
      "explanation": "He/She/It take -s in the simple present tense.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_third_s_g3",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_third_s_g3",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He/She/It take -s in the simple present tense.",
        "es-419": "Él/Ella/Eso toma -s en tiempo presente simple."
      }
    },
    {
      "question": "Choose the correct form: \"We ___ breakfast at seven\"",
      "options": [
        "eat",
        "eats",
        "eating"
      ],
      "correct": "eat",
      "explanation": "We → the base form without -s.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_plural_g3",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_plural_g3",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → the base form without -s.",
        "es-419": "Nosotros → la forma base sin -s."
      }
    },
    {
      "question": "Choose the correct negative: \"He ___ like carrots\"",
      "options": [
        "don't",
        "doesn't",
        "isn't"
      ],
      "correct": "doesn't",
      "explanation": "He/she/it → doesn't + verb base.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_neg_g3",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_neg_g3",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He/she/it → doesn't + verb base.",
        "es-419": "Él/ella/ello → no + base verbal."
      }
    },
    {
      "question": "Choose the question: \"___ they play music?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Do",
      "explanation": "They → Do in present tense questions.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_question_g3",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_question_g3",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → Do in present tense questions.",
        "es-419": "Ellos → Hacen preguntas en tiempo presente."
      }
    },
    {
      "question": "Choose: \"Tom ___ to school every day\"",
      "options": [
        "go",
        "goes",
        "going"
      ],
      "correct": "goes",
      "explanation": "Tom (he) → goes with -es.",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_third_s_g4",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_third_s_g4",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tom (he) → goes with -es.",
        "es-419": "Tom (él) → va con -es."
      }
    },
    {
      "question": "Choose: \"I ___ my homework after school\"",
      "options": [
        "do",
        "does",
        "doing"
      ],
      "correct": "do",
      "explanation": "I → do (base form).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_first_g4",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_first_g4",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → do (base form).",
        "es-419": "Yo → hago (forma base)."
      }
    },
    {
      "question": "Choose: \"They ___ TV in the evening\"",
      "options": [
        "watch",
        "watches",
        "watching"
      ],
      "correct": "watch",
      "explanation": "They → watch (base form).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_plural_g4",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_plural_g4",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → watch (base form).",
        "es-419": "Ellos → miran (forma base)."
      }
    },
    {
      "question": "Choose: \"My sister ___ English well\"",
      "options": [
        "speak",
        "speaks",
        "speaking"
      ],
      "correct": "speaks",
      "explanation": "My sister (she) → speaks with -s.",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_third_s_g4",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_third_s_g4",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My sister (she) → speaks with -s.",
        "es-419": "Mi hermana (ella) → habla con -s."
      }
    },
    {
      "question": "Choose: \"We ___ books from the library\"",
      "options": [
        "borrow",
        "borrows",
        "borrowing"
      ],
      "correct": "borrow",
      "explanation": "We → borrow (base form).",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_borrow",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_borrow",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → borrow (base form).",
        "es-419": "Nosotros → pedir prestado (forma base)."
      }
    },
    {
      "question": "Choose: \"The cat ___ milk\"",
      "options": [
        "like",
        "likes",
        "liking"
      ],
      "correct": "likes",
      "explanation": "The cat (it) → likes with -s.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_cat",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_cat",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The cat (it) → likes with -s.",
        "es-419": "Al gato (le) → le gusta con -s."
      }
    },
    {
      "question": "Choose: \"I ___ like broccoli\"",
      "options": [
        "don't",
        "doesn't",
        "isn't"
      ],
      "correct": "don't",
      "explanation": "I → don't in the negative.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_neg_i",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_neg_i",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → don't in the negative.",
        "es-419": "Yo → no lo hago en negativo."
      }
    },
    {
      "question": "Choose: \"She ___ watch cartoons\"",
      "options": [
        "don't",
        "doesn't",
        "isn't"
      ],
      "correct": "doesn't",
      "explanation": "She → doesn't in the negative.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_neg_she",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_neg_she",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → doesn't in the negative.",
        "es-419": "Ella → no es negativa."
      }
    },
    {
      "question": "Choose: \"___ you like apples?\"",
      "options": [
        "Do",
        "Does",
        "Are"
      ],
      "correct": "Do",
      "explanation": "With You we use Do in questions.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_q_you",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_q_you",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "With You we use Do in questions.",
        "es-419": "Contigo utilizamos Do en las preguntas."
      }
    },
    {
      "question": "Choose: \"___ he play football?\"",
      "options": [
        "Do",
        "Does",
        "Is"
      ],
      "correct": "Does",
      "explanation": "He → Does in questions.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_q_he",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_q_he",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He → Does in questions.",
        "es-419": "Él → Hace en preguntas."
      }
    },
    {
      "question": "Choose: \"My friends ___ study together\"",
      "options": [
        "don't",
        "doesn't",
        "isn't"
      ],
      "correct": "don't",
      "explanation": "My friends (they) → don't in the negative.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_neg_friends",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_neg_friends",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My friends (they) → don't in the negative.",
        "es-419": "Mis amigos (ellos) → no lo hacen en negativo."
      }
    },
    {
      "question": "Choose: \"The teacher ___ us new words\"",
      "options": [
        "teach",
        "teaches",
        "teaching"
      ],
      "correct": "teaches",
      "explanation": "The teacher (he/she) → teaches with -es.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_teach",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_teach",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The teacher (he/she) → teaches with -es.",
        "es-419": "El maestro (él/ella) → enseña con -es."
      }
    },
    {
      "question": "Choose: \"Children ___ to play games\"",
      "options": [
        "love",
        "loves",
        "loving"
      ],
      "correct": "love",
      "explanation": "Children (they) → love (base form).",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_love_games",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_love_games",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Children (they) → love (base form).",
        "es-419": "Niños (ellos) → aman (forma básica)."
      }
    },
    {
      "question": "Choose: \"___ they eat lunch at school?\"",
      "options": [
        "Do",
        "Does",
        "Are"
      ],
      "correct": "Do",
      "explanation": "They → Do in questions.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_q_they_lunch",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_q_they_lunch",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → Do in questions.",
        "es-419": "Ellos → Hacen en preguntas."
      }
    },
    {
      "question": "Choose: \"The sun ___ in the east\"",
      "options": [
        "rise",
        "rises",
        "rising"
      ],
      "correct": "rises",
      "explanation": "The sun (it) → rises with -s.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_sun",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_sun",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The sun (it) → rises with -s.",
        "es-419": "El sol (it) → sale con -s."
      }
    },
    {
      "question": "Choose: \"I ___ understand this exercise\"",
      "options": [
        "don't",
        "doesn't",
        "am not"
      ],
      "correct": "don't",
      "explanation": "I → don't in the negative.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_understand",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_understand",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → don't in the negative.",
        "es-419": "Yo → no lo hago en negativo."
      }
    },
    {
      "question": "Choose: \"___ she help you with homework?\"",
      "options": [
        "Do",
        "Does",
        "Is"
      ],
      "correct": "Does",
      "explanation": "She → Does in questions.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_q_she_help",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_q_she_help",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → Does in questions.",
        "es-419": "Ella → Hace preguntas."
      }
    },
    {
      "question": "Choose: \"I ___ English every day\"",
      "options": [
        "study",
        "studies",
        "studying"
      ],
      "correct": "study",
      "explanation": "I → study (base form).",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_study",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_study",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → study (base form).",
        "es-419": "Yo → estudio (forma base)."
      }
    },
    {
      "question": "Choose: \"She ___ to school by bus\"",
      "options": [
        "go",
        "goes",
        "going"
      ],
      "correct": "goes",
      "explanation": "She → goes with -es.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_bus",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_bus",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → goes with -es.",
        "es-419": "Ella → va con -es."
      }
    },
    {
      "question": "Choose: \"We ___ lunch at 12 o'clock\"",
      "options": [
        "eat",
        "eats",
        "eating"
      ],
      "correct": "eat",
      "explanation": "We → eat (base form).",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_lunch",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_lunch",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → eat (base form).",
        "es-419": "Nosotros → comemos (forma base)."
      }
    },
    {
      "question": "Choose: \"He ___ his room every Saturday\"",
      "options": [
        "clean",
        "cleans",
        "cleaning"
      ],
      "correct": "cleans",
      "explanation": "He → cleans with -s.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_clean",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_clean",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He → cleans with -s.",
        "es-419": "Él → limpia con -s."
      }
    },
    {
      "question": "Choose: \"They ___ football on Sundays\"",
      "options": [
        "play",
        "plays",
        "playing"
      ],
      "correct": "play",
      "explanation": "They → play (base form).",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_football",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_football",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → play (base form).",
        "es-419": "Ellos → juegan (forma base)."
      }
    },
    {
      "question": "Choose: \"I ___ not like vegetables\"",
      "options": [
        "do",
        "does",
        "am"
      ],
      "correct": "do",
      "explanation": "I → do not (don't).",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_do_not_i",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_do_not_i",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → do not (don't).",
        "es-419": "Yo → no (no lo hago)."
      }
    },
    {
      "question": "Choose: \"She ___ not watch TV\"",
      "options": [
        "do",
        "does",
        "is"
      ],
      "correct": "does",
      "explanation": "She → does not (doesn't).",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_do_not_she",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_do_not_she",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → does not (doesn't).",
        "es-419": "Ella → no lo hace (no lo hace)."
      }
    },
    {
      "question": "Choose: \"We ___ not eat meat\"",
      "options": [
        "do",
        "does",
        "are"
      ],
      "correct": "do",
      "explanation": "We → do not (don't).",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_do_not_we",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_do_not_we",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → do not (don't).",
        "es-419": "Nosotros → no lo hacemos (no lo hacemos)."
      }
    },
    {
      "question": "Choose: \"___ you like ice cream?\"",
      "options": [
        "Do",
        "Does",
        "Are"
      ],
      "correct": "Do",
      "explanation": "With You we use Do in questions.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_q_icecream",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_q_icecream",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "With You we use Do in questions.",
        "es-419": "Contigo utilizamos Do en las preguntas."
      }
    },
    {
      "question": "Choose: \"___ he play piano?\"",
      "options": [
        "Do",
        "Does",
        "Is"
      ],
      "correct": "Does",
      "explanation": "He → Does in questions.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_q_piano",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_q_piano",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He → Does in questions.",
        "es-419": "Él → Hace en preguntas."
      }
    },
    {
      "question": "Choose: \"___ they speak English?\"",
      "options": [
        "Do",
        "Does",
        "Are"
      ],
      "correct": "Do",
      "explanation": "They → Do in questions.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_q_speak_en",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_q_speak_en",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → Do in questions.",
        "es-419": "Ellos → Hacen en preguntas."
      }
    },
    {
      "question": "Choose: \"My father ___ work in a hospital\"",
      "options": [
        "work",
        "works",
        "working"
      ],
      "correct": "works",
      "explanation": "My father (he) → works with -s.",
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "grammar_present_ps_g3_father_work",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g3_father_work",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My father (he) → works with -s.",
        "es-419": "Mi padre (él) → trabaja con -s."
      }
    },
    {
      "question": "Choose: \"Birds ___ in the sky\"",
      "options": [
        "fly",
        "flies",
        "flying"
      ],
      "correct": "fly",
      "explanation": "Birds (they) → fly (base form).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_birds",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_birds",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Birds (they) → fly (base form).",
        "es-419": "Pájaros (ellos) → vuelan (forma básica)."
      }
    },
    {
      "question": "Choose: \"I ___ breakfast at 8 o'clock\"",
      "options": [
        "have",
        "has",
        "having"
      ],
      "correct": "have",
      "explanation": "I → have (base form).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_breakfast",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_breakfast",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → have (base form).",
        "es-419": "Yo → tengo (forma base)."
      }
    },
    {
      "question": "Choose: \"She ___ her homework after school\"",
      "options": [
        "do",
        "does",
        "doing"
      ],
      "correct": "does",
      "explanation": "She → does (base form of do).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_homework",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_homework",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → does (base form of do).",
        "es-419": "Ella → hace (forma básica de hacer)."
      }
    },
    {
      "question": "Choose: \"The teacher ___ us English\"",
      "options": [
        "teach",
        "teaches",
        "teaching"
      ],
      "correct": "teaches",
      "explanation": "The teacher (he/she) → teaches with -es.",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_teacher_en",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_teacher_en",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The teacher (he/she) → teaches with -es.",
        "es-419": "El maestro (él/ella) → enseña con -es."
      }
    },
    {
      "question": "Choose: \"Children ___ to play\"",
      "options": [
        "love",
        "loves",
        "loving"
      ],
      "correct": "love",
      "explanation": "Children (they) → love (base form).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_children_love",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_children_love",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Children (they) → love (base form).",
        "es-419": "Niños (ellos) → aman (forma básica)."
      }
    },
    {
      "question": "Choose: \"I ___ understand this\"",
      "options": [
        "do",
        "does",
        "am"
      ],
      "correct": "do",
      "explanation": "I → do (auxiliary verb).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_aux_i",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_aux_i",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → do (auxiliary verb).",
        "es-419": "Yo → hago (verbo auxiliar)."
      }
    },
    {
      "question": "Choose: \"She ___ not know the answer\"",
      "options": [
        "do",
        "does",
        "is"
      ],
      "correct": "does",
      "explanation": "She → does not (doesn't).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_not_know",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_not_know",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → does not (doesn't).",
        "es-419": "Ella → no lo hace (no lo hace)."
      }
    },
    {
      "question": "Choose: \"We ___ not want to go\"",
      "options": [
        "do",
        "does",
        "are"
      ],
      "correct": "do",
      "explanation": "We → do not (don't).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_not_want",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_not_want",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → do not (don't).",
        "es-419": "Nosotros → no lo hacemos (no lo hacemos)."
      }
    },
    {
      "question": "Choose: \"___ you have a pet?\"",
      "options": [
        "Do",
        "Does",
        "Are"
      ],
      "correct": "Do",
      "explanation": "With You we use Do in questions.",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_q_pet",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_q_pet",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "With You we use Do in questions.",
        "es-419": "Contigo utilizamos Do en las preguntas."
      }
    },
    {
      "question": "Choose: \"___ she live here?\"",
      "options": [
        "Do",
        "Does",
        "Is"
      ],
      "correct": "Does",
      "explanation": "She → Does in questions.",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_q_live",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_q_live",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → Does in questions.",
        "es-419": "Ella → Hace preguntas."
      }
    },
    {
      "question": "Choose: \"___ they like music?\"",
      "options": [
        "Do",
        "Does",
        "Are"
      ],
      "correct": "Do",
      "explanation": "They → Do in questions.",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_q_music",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_q_music",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They → Do in questions.",
        "es-419": "Ellos → Hacen en preguntas."
      }
    },
    {
      "question": "Choose: \"My cousin ___ French in class\"",
      "options": [
        "speak",
        "speaks",
        "speaking"
      ],
      "correct": "speaks",
      "explanation": "My cousin (she) → speaks with -s.",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_third_s_g4_cousin",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_third_s_g4_cousin",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My cousin (she) → speaks with -s.",
        "es-419": "Mi prima (ella) → habla con -s."
      }
    },
    {
      "question": "Choose: \"The rabbit ___ carrots\"",
      "options": [
        "like",
        "likes",
        "liking"
      ],
      "correct": "likes",
      "explanation": "The rabbit (it) → likes with -s.",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_third_s_g4_rabbit",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_third_s_g4_rabbit",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The rabbit (it) → likes with -s.",
        "es-419": "Al conejo (ello) → le gusta con -s."
      }
    },
    {
      "question": "Choose: \"I ___ not want that\"",
      "options": [
        "do",
        "does",
        "am"
      ],
      "correct": "do",
      "explanation": "I → do not (don't).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_not_want_that",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_not_want_that",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → do not (don't).",
        "es-419": "Yo → no (no lo hago)."
      }
    },
    {
      "question": "Choose: \"He ___ not like coffee\"",
      "options": [
        "do",
        "does",
        "is"
      ],
      "correct": "does",
      "explanation": "He → does not (doesn't).",
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "grammar_present_ps_g4_not_coffee",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "present_simple_3rd_singular_error"
      ],
      "skillId": "grammar_present_ps_g4_not_coffee",
      "subtype": "present_simple",
      "diagnosticSkillId": "en_grammar_present_simple",
      "conceptTag": "english_present_simple",
      "expectedErrorTags": [
        "present_simple_3rd_singular_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He → does not (doesn't).",
        "es-419": "Él → no lo hace (no lo hace)."
      }
    }
  ],
  "progressive": [
    {
      "question": "Choose the correct tense: \"Right now, they ___ English\"",
      "options": [
        "study",
        "studies",
        "are studying"
      ],
      "correct": "are studying",
      "explanation": "Right now → Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Right now → Present Continuous.",
        "es-419": "Ahora mismo → Presente continuo."
      }
    },
    {
      "question": "Choose the correct form: \"I ___ a movie\"",
      "options": [
        "watch",
        "am watching",
        "watched"
      ],
      "correct": "am watching",
      "explanation": "I + am + verb-ing in present tense.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I + am + verb-ing in present tense.",
        "es-419": "I + am + verbo-ing en tiempo presente."
      }
    },
    {
      "question": "Choose the correct sentence: \"She ___ dinner at the moment\"",
      "options": [
        "is cook",
        "is cooking",
        "cook"
      ],
      "correct": "is cooking",
      "explanation": "She + is + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She + is + verb-ing.",
        "es-419": "Ella + es + verbo-ing."
      }
    },
    {
      "question": "Choose: \"Look! It ___ outside\"",
      "options": [
        "rain",
        "rains",
        "is raining"
      ],
      "correct": "is raining",
      "explanation": "Look! = now → it is raining.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Look! = now → it is raining.",
        "es-419": "¡Mirar! = ahora → está lloviendo."
      }
    },
    {
      "question": "Choose: \"We ___ for the bus now\"",
      "options": [
        "wait",
        "waits",
        "are waiting"
      ],
      "correct": "are waiting",
      "explanation": "We + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We + are + verb-ing.",
        "es-419": "Nosotros + somos + verbo-ing."
      }
    },
    {
      "question": "Choose: \"He ___ his homework right now\"",
      "options": [
        "do",
        "does",
        "is doing"
      ],
      "correct": "is doing",
      "explanation": "He + is + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He + is + verb-ing.",
        "es-419": "Él + es + verbo-ing."
      }
    },
    {
      "question": "Choose: \"I ___ a letter to my friend\"",
      "options": [
        "write",
        "am writing",
        "writes"
      ],
      "correct": "am writing",
      "explanation": "I + am + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I + am + verb-ing.",
        "es-419": "Yo + soy + verbo-ing."
      }
    },
    {
      "question": "Choose: \"The children ___ in the park\"",
      "options": [
        "play",
        "plays",
        "are playing"
      ],
      "correct": "are playing",
      "explanation": "The children (they) + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The children (they) + are + verb-ing.",
        "es-419": "Los niños (ellos) + son + verbo-ing."
      }
    },
    {
      "question": "Choose: \"She ___ to music now\"",
      "options": [
        "listen",
        "listens",
        "is listening"
      ],
      "correct": "is listening",
      "explanation": "She + is + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She + is + verb-ing.",
        "es-419": "Ella + es + verbo-ing."
      }
    },
    {
      "question": "Choose: \"They ___ a new game\"",
      "options": [
        "learn",
        "learns",
        "are learning"
      ],
      "correct": "are learning",
      "explanation": "They + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They + are + verb-ing.",
        "es-419": "Ellos + son + verbo-ing."
      }
    },
    {
      "question": "Choose: \"I ___ my room this morning\"",
      "options": [
        "clean",
        "am cleaning",
        "cleans"
      ],
      "correct": "am cleaning",
      "explanation": "I + am + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I + am + verb-ing.",
        "es-419": "Yo + soy + verbo-ing."
      }
    },
    {
      "question": "Choose: \"What ___ you ___?\" - \"I'm reading\"",
      "options": [
        "are / doing",
        "do / do",
        "is / doing"
      ],
      "correct": "are / doing",
      "explanation": "What are you doing? = Question in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "What are you doing? = Question in Present Continuous.",
        "es-419": "¿Qué estás haciendo? = Pregunta en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"Why ___ she ___?\" - \"Because she's tired\"",
      "options": [
        "does / cry",
        "is / crying",
        "do / cry"
      ],
      "correct": "is / crying",
      "explanation": "Why is she crying? = Question in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Why is she crying? = Question in Present Continuous.",
        "es-419": "¿Por qué está llorando? = Pregunta en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"We ___ not ___ TV right now\"",
      "options": [
        "are / watching",
        "do / watch",
        "is / watching"
      ],
      "correct": "are / watching",
      "explanation": "We are not watching = negative in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We are not watching = negative in Present Continuous.",
        "es-419": "No estamos viendo = negativo en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"The dog ___ in the garden\"",
      "options": [
        "run",
        "runs",
        "is running"
      ],
      "correct": "is running",
      "explanation": "The dog (it) + is + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The dog (it) + is + verb-ing.",
        "es-419": "El perro (it) + es + verbo-ing."
      }
    },
    {
      "question": "Choose: \"I ___ for my test tomorrow\"",
      "options": [
        "study",
        "am studying",
        "studies"
      ],
      "correct": "am studying",
      "explanation": "Upcoming plan → Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Upcoming plan → Present Continuous.",
        "es-419": "Próximo plan → Presente continuo."
      }
    },
    {
      "question": "Choose: \"She ___ her grandmother this weekend\"",
      "options": [
        "visits",
        "is visiting",
        "visit"
      ],
      "correct": "is visiting",
      "explanation": "Future plan → Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future plan → Present Continuous.",
        "es-419": "Plan de futuro → Presente continuo."
      }
    },
    {
      "question": "Choose: \"They ___ to the beach next week\"",
      "options": [
        "go",
        "are going",
        "goes"
      ],
      "correct": "are going",
      "explanation": "Program → are going.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going.",
        "es-419": "Programa → van."
      }
    },
    {
      "question": "Choose: \"What ___ he ___ for lunch?\"",
      "options": [
        "does / eat",
        "is / eating",
        "do / eat"
      ],
      "correct": "is / eating",
      "explanation": "What is he eating? = Question in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "What is he eating? = Question in Present Continuous.",
        "es-419": "¿Qué está comiendo? = Pregunta en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"The students ___ in class now\"",
      "options": [
        "sit",
        "sits",
        "are sitting"
      ],
      "correct": "are sitting",
      "explanation": "The students (they) + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The students (they) + are + verb-ing.",
        "es-419": "Los estudiantes (ellos) + son + verbo-ing."
      }
    },
    {
      "question": "Choose: \"I ___ my homework right now\"",
      "options": [
        "do",
        "am doing",
        "does"
      ],
      "correct": "am doing",
      "explanation": "I + am + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I + am + verb-ing.",
        "es-419": "Yo + soy + verbo-ing."
      }
    },
    {
      "question": "Choose: \"She ___ a book now\"",
      "options": [
        "read",
        "is reading",
        "reads"
      ],
      "correct": "is reading",
      "explanation": "She + is + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She + is + verb-ing.",
        "es-419": "Ella + es + verbo-ing."
      }
    },
    {
      "question": "Choose: \"We ___ TV at the moment\"",
      "options": [
        "watch",
        "are watching",
        "watches"
      ],
      "correct": "are watching",
      "explanation": "We + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We + are + verb-ing.",
        "es-419": "Nosotros + somos + verbo-ing."
      }
    },
    {
      "question": "Choose: \"They ___ to music now\"",
      "options": [
        "listen",
        "are listening",
        "listens"
      ],
      "correct": "are listening",
      "explanation": "They + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They + are + verb-ing.",
        "es-419": "Ellos + son + verbo-ing."
      }
    },
    {
      "question": "Choose: \"He ___ his room right now\"",
      "options": [
        "clean",
        "is cleaning",
        "cleans"
      ],
      "correct": "is cleaning",
      "explanation": "He + is + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He + is + verb-ing.",
        "es-419": "Él + es + verbo-ing."
      }
    },
    {
      "question": "Choose: \"I ___ a letter now\"",
      "options": [
        "write",
        "am writing",
        "writes"
      ],
      "correct": "am writing",
      "explanation": "I + am + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I + am + verb-ing.",
        "es-419": "Yo + soy + verbo-ing."
      }
    },
    {
      "question": "Choose: \"She ___ dinner now\"",
      "options": [
        "cook",
        "is cooking",
        "cooks"
      ],
      "correct": "is cooking",
      "explanation": "She + is + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She + is + verb-ing.",
        "es-419": "Ella + es + verbo-ing."
      }
    },
    {
      "question": "Choose: \"We ___ for the bus now\"",
      "options": [
        "wait",
        "are waiting",
        "waits"
      ],
      "correct": "are waiting",
      "explanation": "We + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We + are + verb-ing.",
        "es-419": "Nosotros + somos + verbo-ing."
      }
    },
    {
      "question": "Choose: \"They ___ a game now\"",
      "options": [
        "play",
        "are playing",
        "plays"
      ],
      "correct": "are playing",
      "explanation": "They + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They + are + verb-ing.",
        "es-419": "Ellos + son + verbo-ing."
      }
    },
    {
      "question": "Choose: \"What ___ you ___?\" - \"I'm reading\"",
      "options": [
        "are / doing",
        "do / do",
        "is / doing"
      ],
      "correct": "are / doing",
      "explanation": "What are you doing? = Question in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "What are you doing? = Question in Present Continuous.",
        "es-419": "¿Qué estás haciendo? = Pregunta en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"What ___ he ___?\" - \"He's playing\"",
      "options": [
        "is / doing",
        "does / do",
        "do / do"
      ],
      "correct": "is / doing",
      "explanation": "What is he doing? = Question in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "What is he doing? = Question in Present Continuous.",
        "es-419": "¿Qué está haciendo? = Pregunta en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"Why ___ she ___?\" - \"Because she's happy\"",
      "options": [
        "is / smiling",
        "does / smile",
        "do / smile"
      ],
      "correct": "is / smiling",
      "explanation": "Why is she smiling? = Question in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Why is she smiling? = Question in Present Continuous.",
        "es-419": "¿Por qué está sonriendo? = Pregunta en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"Where ___ you ___?\" - \"To the park\"",
      "options": [
        "are / going",
        "do / go",
        "is / going"
      ],
      "correct": "are / going",
      "explanation": "Where are you going? = Question in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Where are you going? = Question in Present Continuous.",
        "es-419": "¿Adónde vas? = Pregunta en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"I ___ not ___ TV right now\"",
      "options": [
        "am / watching",
        "do / watch",
        "is / watching"
      ],
      "correct": "am / watching",
      "explanation": "I am not watching = negative in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I am not watching = negative in Present Continuous.",
        "es-419": "No estoy viendo = negativo en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"She ___ not ___ now\"",
      "options": [
        "is / sleeping",
        "does / sleep",
        "do / sleep"
      ],
      "correct": "is / sleeping",
      "explanation": "She is not sleeping = negative in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She is not sleeping = negative in Present Continuous.",
        "es-419": "Ella no está durmiendo = negativo en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"We ___ not ___ now\"",
      "options": [
        "are / studying",
        "do / study",
        "is / studying"
      ],
      "correct": "are / studying",
      "explanation": "We are not studying = negative in Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We are not studying = negative in Present Continuous.",
        "es-419": "No estamos estudiando = negativo en Presente Continuo."
      }
    },
    {
      "question": "Choose: \"The dog ___ in the garden\"",
      "options": [
        "run",
        "runs",
        "is running"
      ],
      "correct": "is running",
      "explanation": "The dog (it) + is + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The dog (it) + is + verb-ing.",
        "es-419": "El perro (it) + es + verbo-ing."
      }
    },
    {
      "question": "Choose: \"The birds ___ in the sky\"",
      "options": [
        "fly",
        "flies",
        "are flying"
      ],
      "correct": "are flying",
      "explanation": "The birds (they) + are + verb-ing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The birds (they) + are + verb-ing.",
        "es-419": "Los pájaros (ellos) + son + verbo-ing."
      }
    },
    {
      "question": "Choose: \"I ___ for my test tomorrow\"",
      "options": [
        "study",
        "am studying",
        "studies"
      ],
      "correct": "am studying",
      "explanation": "Upcoming plan → Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Upcoming plan → Present Continuous.",
        "es-419": "Próximo plan → Presente continuo."
      }
    },
    {
      "question": "Choose: \"She ___ her grandmother this weekend\"",
      "options": [
        "visits",
        "is visiting",
        "visit"
      ],
      "correct": "is visiting",
      "explanation": "Future plan → Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future plan → Present Continuous.",
        "es-419": "Plan de futuro → Presente continuo."
      }
    },
    {
      "question": "Choose: \"They ___ to the beach next week\"",
      "options": [
        "go",
        "are going",
        "goes"
      ],
      "correct": "are going",
      "explanation": "Program → are going.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going.",
        "es-419": "Programa → van."
      }
    },
    {
      "question": "Choose: \"We ___ a party next month\"",
      "options": [
        "have",
        "are having",
        "has"
      ],
      "correct": "are having",
      "explanation": "Future plan → are having.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future plan → are having.",
        "es-419": "Plan de futuro → están teniendo."
      }
    },
    {
      "question": "Choose: \"I ___ my friend tomorrow\"",
      "options": [
        "meet",
        "am meeting",
        "meets"
      ],
      "correct": "am meeting",
      "explanation": "Future plan → am meeting.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future plan → am meeting.",
        "es-419": "Plan futuro → me encuentro."
      }
    },
    {
      "question": "Choose: \"She ___ a new school in September\"",
      "options": [
        "start",
        "is starting",
        "starts"
      ],
      "correct": "is starting",
      "explanation": "Future plan → is starting.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future plan → is starting.",
        "es-419": "Plan de futuro → está comenzando."
      }
    },
    {
      "question": "Choose: \"Look! It ___ outside\"",
      "options": [
        "rain",
        "rains",
        "is raining"
      ],
      "correct": "is raining",
      "explanation": "Look! = now → it is raining.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Look! = now → it is raining.",
        "es-419": "¡Mirar! = ahora → está lloviendo."
      }
    },
    {
      "question": "Choose: \"Listen! The birds ___\"",
      "options": [
        "sing",
        "sings",
        "are singing"
      ],
      "correct": "are singing",
      "explanation": "Listen! = Now → are singing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Listen! = Now → are singing.",
        "es-419": "¡Escuchar! = Ahora → están cantando."
      }
    },
    {
      "question": "Choose: \"Watch! He ___\"",
      "options": [
        "jump",
        "jumps",
        "is jumping"
      ],
      "correct": "is jumping",
      "explanation": "Watch! = now → is jumping.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Watch! = now → is jumping.",
        "es-419": "¡Mirar! = ahora → está saltando."
      }
    },
    {
      "question": "Choose: \"Right now, I ___ a book\"",
      "options": [
        "read",
        "am reading",
        "reads"
      ],
      "correct": "am reading",
      "explanation": "Right now → Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Right now → Present Continuous.",
        "es-419": "Ahora mismo → Presente continuo."
      }
    },
    {
      "question": "Choose: \"At the moment, she ___ dinner\"",
      "options": [
        "cook",
        "is cooking",
        "cooks"
      ],
      "correct": "is cooking",
      "explanation": "At the moment → Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "progressive_aspect_error",
        "verb_form_error"
      ],
      "patternFamily": "progressive_progressive",
      "diagnosticSkillId": "en_grammar_progressive",
      "conceptTag": "english_progressive",
      "expectedErrorTags": [
        "progressive_aspect_error",
        "verb_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "At the moment → Present Continuous.",
        "es-419": "Por el momento → Presente continuo."
      }
    }
  ],
  "quantifiers": [
    {
      "question": "Choose the correct word: \"There aren't ___ apples left\"",
      "options": [
        "some",
        "any",
        "much"
      ],
      "correct": "any",
      "explanation": "In the negative, any is used.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "In the negative, any is used.",
        "es-419": "En caso negativo se utiliza cualquiera."
      }
    },
    {
      "question": "Choose the correct option: \"How ___ water do you drink?\"",
      "options": [
        "many",
        "much",
        "few"
      ],
      "correct": "much",
      "explanation": "Water is not sapphire → much.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Water is not sapphire → much.",
        "es-419": "El agua no es zafiro → mucho."
      }
    },
    {
      "question": "Choose the correct option: \"We have ___ homework today\"",
      "options": [
        "a few",
        "much",
        "many"
      ],
      "correct": "a few",
      "explanation": "Homework in the sense of separate tasks → a few.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Homework in the sense of separate tasks → a few.",
        "es-419": "Tarea en el sentido de tareas separadas → algunas."
      }
    },
    {
      "question": "Choose: \"There are ___ books on the table\"",
      "options": [
        "some",
        "any",
        "much"
      ],
      "correct": "some",
      "explanation": "Positively with many nouns → some.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Positively with many nouns → some.",
        "es-419": "Positivamente con muchos sustantivos → algunos."
      }
    },
    {
      "question": "Choose: \"Do you have ___ pencils?\"",
      "options": [
        "some",
        "any",
        "much"
      ],
      "correct": "any",
      "explanation": "In questions with plural nouns → any.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "In questions with plural nouns → any.",
        "es-419": "En preguntas con sustantivos en plural → cualquiera."
      }
    },
    {
      "question": "Choose: \"I need ___ milk for the cake\"",
      "options": [
        "a few",
        "many",
        "some"
      ],
      "correct": "some",
      "explanation": "Milk = not sapphire, positively → some.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Milk = not sapphire, positively → some.",
        "es-419": "Leche = no zafiro, positivamente → algo."
      }
    },
    {
      "question": "Choose: \"How ___ students are in your class?\"",
      "options": [
        "much",
        "many",
        "few"
      ],
      "correct": "many",
      "explanation": "Students = Sapir → many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Students = Sapir → many.",
        "es-419": "Estudiantes = Sapir → muchos."
      }
    },
    {
      "question": "Choose: \"There isn't ___ time left\"",
      "options": [
        "many",
        "much",
        "few"
      ],
      "correct": "much",
      "explanation": "Time = not Sapir → much.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Time = not Sapir → much.",
        "es-419": "Tiempo = no Sapir → mucho."
      }
    },
    {
      "question": "Choose: \"We have ___ friends at school\"",
      "options": [
        "a lot of",
        "much",
        "a little"
      ],
      "correct": "a lot of",
      "explanation": "Friends = Sapir, positively → a lot of.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Friends = Sapir, positively → a lot of.",
        "es-419": "Amigos = Sapir, positivamente → muchos."
      }
    },
    {
      "question": "Choose: \"Can I have ___ water, please?\"",
      "options": [
        "a few",
        "some",
        "many"
      ],
      "correct": "some",
      "explanation": "Please/offer with no sapphire → some.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Please/offer with no sapphire → some.",
        "es-419": "Por favor/ofrecer sin zafiro → algunos."
      }
    },
    {
      "question": "Choose: \"There are ___ trees in the park\"",
      "options": [
        "a little",
        "many",
        "much"
      ],
      "correct": "many",
      "explanation": "Trees = Sapir → many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Trees = Sapir → many.",
        "es-419": "Árboles = Sapir → muchos."
      }
    },
    {
      "question": "Choose: \"I have ___ homework to do\"",
      "options": [
        "a few",
        "a lot of",
        "many"
      ],
      "correct": "a lot of",
      "explanation": "Homework = not Sapir, positively → a lot of.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Homework = not Sapir, positively → a lot of.",
        "es-419": "Tarea = no Sapir, positivamente → mucha."
      }
    },
    {
      "question": "Choose: \"There isn't ___ sugar in the coffee\"",
      "options": [
        "many",
        "any",
        "few"
      ],
      "correct": "any",
      "explanation": "in the negative → any.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "in the negative → any.",
        "es-419": "en negativo → cualquiera."
      }
    },
    {
      "question": "Choose: \"How ___ money do you need?\"",
      "options": [
        "many",
        "much",
        "few"
      ],
      "correct": "much",
      "explanation": "Money = not sapphire → much.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Money = not sapphire → much.",
        "es-419": "Dinero = no zafiro → mucho."
      }
    },
    {
      "question": "Choose: \"We have ___ apples in the basket\"",
      "options": [
        "a few",
        "a little",
        "much"
      ],
      "correct": "a few",
      "explanation": "Apples = Sapir → a few.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Apples = Sapir → a few.",
        "es-419": "Manzanas = Sapir → algunas."
      }
    },
    {
      "question": "Choose: \"There is ___ snow on the ground\"",
      "options": [
        "many",
        "a lot of",
        "few"
      ],
      "correct": "a lot of",
      "explanation": "Snow = not sapphire, positively → a lot of.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Snow = not sapphire, positively → a lot of.",
        "es-419": "Nieve = no zafiro, positivamente → mucho."
      }
    },
    {
      "question": "Choose: \"Do you want ___ ice cream?\"",
      "options": [
        "some",
        "any",
        "many"
      ],
      "correct": "some",
      "explanation": "In the offer → some.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "In the offer → some.",
        "es-419": "En la oferta → algunos."
      }
    },
    {
      "question": "Choose: \"I don't have ___ friends in this city\"",
      "options": [
        "many",
        "much",
        "a little"
      ],
      "correct": "many",
      "explanation": "Friends = Sapir → many (also in the negative).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Friends = Sapir → many (also in the negative).",
        "es-419": "Amigos = Sapir → muchos (también en negativo)."
      }
    },
    {
      "question": "Choose: \"There is ___ milk in the fridge\"",
      "options": [
        "a few",
        "a little",
        "many"
      ],
      "correct": "a little",
      "explanation": "Milk = not Sapir, a small amount → a little.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Milk = not Sapir, a small amount → a little.",
        "es-419": "Leche = no Sapir, una pequeña cantidad → un poco."
      }
    },
    {
      "question": "Choose: \"We need ___ more chairs\"",
      "options": [
        "a few",
        "a little",
        "much"
      ],
      "correct": "a few",
      "explanation": "Chairs = Sapir → a few.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Chairs = Sapir → a few.",
        "es-419": "Sillas = Sapir → algunas."
      }
    },
    {
      "question": "Choose: \"There are ___ students in the class\"",
      "options": [
        "many",
        "much",
        "a little"
      ],
      "correct": "many",
      "explanation": "Students = Sapir → many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Students = Sapir → many.",
        "es-419": "Estudiantes = Sapir → muchos."
      }
    },
    {
      "question": "Choose: \"I need ___ help\"",
      "options": [
        "some",
        "any",
        "many"
      ],
      "correct": "some",
      "explanation": "Help = not Sapir, yes → some.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Help = not Sapir, yes → some.",
        "es-419": "Ayuda = no Sapir, sí → algo."
      }
    },
    {
      "question": "Choose: \"Do you have ___ time?\"",
      "options": [
        "some",
        "any",
        "many"
      ],
      "correct": "any",
      "explanation": "in questions → any.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "in questions → any.",
        "es-419": "en preguntas → cualquiera."
      }
    },
    {
      "question": "Choose: \"There isn't ___ milk left\"",
      "options": [
        "many",
        "any",
        "few"
      ],
      "correct": "any",
      "explanation": "in the negative → any.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "in the negative → any.",
        "es-419": "en negativo → cualquiera."
      }
    },
    {
      "question": "Choose: \"How ___ apples do you want?\"",
      "options": [
        "much",
        "many",
        "few"
      ],
      "correct": "many",
      "explanation": "Apples = Sapir → many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Apples = Sapir → many.",
        "es-419": "Manzanas = Sapir → muchas."
      }
    },
    {
      "question": "Choose: \"How ___ sugar do you need?\"",
      "options": [
        "many",
        "much",
        "few"
      ],
      "correct": "much",
      "explanation": "Sugar = not Sapir → much.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Sugar = not Sapir → much.",
        "es-419": "Azúcar = no Sapir → mucho."
      }
    },
    {
      "question": "Choose: \"I have ___ friends\"",
      "options": [
        "a lot of",
        "much",
        "a little"
      ],
      "correct": "a lot of",
      "explanation": "Friends = Sapir, positively → a lot of.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Friends = Sapir, positively → a lot of.",
        "es-419": "Amigos = Sapir, positivamente → muchos."
      }
    },
    {
      "question": "Choose: \"There is ___ water in the bottle\"",
      "options": [
        "a few",
        "a little",
        "many"
      ],
      "correct": "a little",
      "explanation": "Water = not sapphire, a small amount → a little.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Water = not sapphire, a small amount → a little.",
        "es-419": "Agua = no zafiro, una pequeña cantidad → un poco."
      }
    },
    {
      "question": "Choose: \"We have ___ books\"",
      "options": [
        "a few",
        "a little",
        "much"
      ],
      "correct": "a few",
      "explanation": "Books = Sapir → a few.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Books = Sapir → a few.",
        "es-419": "Libros = Sapir → algunos."
      }
    },
    {
      "question": "Choose: \"There are ___ people here\"",
      "options": [
        "many",
        "much",
        "a little"
      ],
      "correct": "many",
      "explanation": "People = Sapir → many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "People = Sapir → many.",
        "es-419": "Gente = Sapir → muchos."
      }
    },
    {
      "question": "Choose: \"I don't have ___ money\"",
      "options": [
        "many",
        "much",
        "few"
      ],
      "correct": "much",
      "explanation": "Money = not sapphire → much.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Money = not sapphire → much.",
        "es-419": "Dinero = no zafiro → mucho."
      }
    },
    {
      "question": "Choose: \"Can I have ___ cookies?\"",
      "options": [
        "some",
        "any",
        "much"
      ],
      "correct": "some",
      "explanation": "Please → some.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Please → some.",
        "es-419": "Por favor → algunos."
      }
    },
    {
      "question": "Choose: \"There aren't ___ cookies left\"",
      "options": [
        "some",
        "any",
        "much"
      ],
      "correct": "any",
      "explanation": "in the negative → any.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "in the negative → any.",
        "es-419": "en negativo → cualquiera."
      }
    },
    {
      "question": "Choose: \"We need ___ more time\"",
      "options": [
        "a few",
        "a little",
        "many"
      ],
      "correct": "a little",
      "explanation": "Time = not Sapir → a little.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Time = not Sapir → a little.",
        "es-419": "Tiempo = no Sapir → un poco."
      }
    },
    {
      "question": "Choose: \"There are ___ flowers in the garden\"",
      "options": [
        "a lot of",
        "much",
        "a little"
      ],
      "correct": "a lot of",
      "explanation": "Flowers = Sapir, positively → a lot of.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Flowers = Sapir, positively → a lot of.",
        "es-419": "Flores = Sapir, positivamente → muchas."
      }
    },
    {
      "question": "Choose: \"I have ___ homework\"",
      "options": [
        "a lot of",
        "many",
        "few"
      ],
      "correct": "a lot of",
      "explanation": "Homework = not Sapir, positively → a lot of.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Homework = not Sapir, positively → a lot of.",
        "es-419": "Tarea = no Sapir, positivamente → mucha."
      }
    },
    {
      "question": "Choose: \"There is ___ juice in the fridge\"",
      "options": [
        "a few",
        "a little",
        "many"
      ],
      "correct": "a little",
      "explanation": "Juice = not Sapir, a small amount → a little.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Juice = not Sapir, a small amount → a little.",
        "es-419": "Jugo = no Sapir, una pequeña cantidad → un poco."
      }
    },
    {
      "question": "Choose: \"We have ___ toys\"",
      "options": [
        "a few",
        "a little",
        "much"
      ],
      "correct": "a few",
      "explanation": "Toys = Sapir → a few.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Toys = Sapir → a few.",
        "es-419": "Juguetes = Sapir → algunos."
      }
    },
    {
      "question": "Choose: \"There isn't ___ bread left\"",
      "options": [
        "many",
        "any",
        "few"
      ],
      "correct": "any",
      "explanation": "in the negative → any.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "in the negative → any.",
        "es-419": "en negativo → cualquiera."
      }
    },
    {
      "question": "Choose: \"How ___ children are in your class?\"",
      "options": [
        "much",
        "many",
        "few"
      ],
      "correct": "many",
      "explanation": "Children = Sapir → many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Children = Sapir → many.",
        "es-419": "Niños = Sapir → muchos."
      }
    },
    {
      "question": "Choose: \"How ___ juice do you drink?\"",
      "options": [
        "many",
        "much",
        "few"
      ],
      "correct": "much",
      "explanation": "Juice = not sapphire → much.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Juice = not sapphire → much.",
        "es-419": "Jugo = no zafiro → mucho."
      }
    },
    {
      "question": "Choose: \"I have ___ pencils\"",
      "options": [
        "a few",
        "a little",
        "much"
      ],
      "correct": "a few",
      "explanation": "Pencils = Sapir → a few.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Pencils = Sapir → a few.",
        "es-419": "Lápices = Sapir → unos pocos."
      }
    },
    {
      "question": "Choose: \"There is ___ coffee in the cup\"",
      "options": [
        "a few",
        "a little",
        "many"
      ],
      "correct": "a little",
      "explanation": "Coffee = not Sapir, a small amount → a little.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Coffee = not Sapir, a small amount → a little.",
        "es-419": "Café = no Sapir, una pequeña cantidad → un poco."
      }
    },
    {
      "question": "Choose: \"We need ___ more paper\"",
      "options": [
        "a few",
        "a little",
        "many"
      ],
      "correct": "a little",
      "explanation": "Paper = not sapphire → a little.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Paper = not sapphire → a little.",
        "es-419": "Papel = no zafiro → un poco."
      }
    },
    {
      "question": "Choose: \"There are ___ cars on the road\"",
      "options": [
        "many",
        "much",
        "a little"
      ],
      "correct": "many",
      "explanation": "Cars = Sapir → many.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Cars = Sapir → many.",
        "es-419": "Coches = Sapir → muchos."
      }
    },
    {
      "question": "Choose: \"I don't have ___ friends\"",
      "options": [
        "many",
        "much",
        "a little"
      ],
      "correct": "many",
      "explanation": "Friends = Sapir → many (also in the negative).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Friends = Sapir → many (also in the negative).",
        "es-419": "Amigos = Sapir → muchos (también en negativo)."
      }
    },
    {
      "question": "Choose: \"There is ___ snow outside\"",
      "options": [
        "many",
        "a lot of",
        "few"
      ],
      "correct": "a lot of",
      "explanation": "Snow = not sapphire, positively → a lot of.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Snow = not sapphire, positively → a lot of.",
        "es-419": "Nieve = no zafiro, positivamente → mucho."
      }
    },
    {
      "question": "Choose: \"We have ___ work to do\"",
      "options": [
        "a few",
        "a lot of",
        "many"
      ],
      "correct": "a lot of",
      "explanation": "Work = not Sapir, positively → a lot of.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "quantifier_choice_error",
        "countability_error"
      ],
      "patternFamily": "quantifiers_quantifiers",
      "diagnosticSkillId": "en_grammar_quantifiers",
      "conceptTag": "english_quantifiers",
      "expectedErrorTags": [
        "quantifier_choice_error",
        "countability_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Work = not Sapir, positively → a lot of.",
        "es-419": "Trabajo = no Sapir, positivamente → mucho."
      }
    }
  ],
  "past_simple": [
    {
      "question": "Choose the correct verb: \"Yesterday we ___ a science project\"",
      "options": [
        "finish",
        "finished",
        "finishing"
      ],
      "correct": "finished",
      "explanation": "Yesterday → Past Simple.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Yesterday → Past Simple.",
        "es-419": "Ayer → Pasado simple."
      }
    },
    {
      "question": "Choose the correct form: \"He ___ to the museum last week\"",
      "options": [
        "go",
        "goes",
        "went"
      ],
      "correct": "went",
      "explanation": "Went is the past form of go.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Went is the past form of go.",
        "es-419": "Went es la forma pasada de go."
      }
    },
    {
      "question": "Choose the correct negative: \"They ___ the film\"",
      "options": [
        "don't like",
        "didn't like",
        "weren't like"
      ],
      "correct": "didn't like",
      "explanation": "Past Simple negative: didn't + verb base.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative: didn't + verb base.",
        "es-419": "Pasado simple negativo: no + base verbal."
      }
    },
    {
      "question": "Choose: \"I ___ to school yesterday\"",
      "options": [
        "walk",
        "walked",
        "walking"
      ],
      "correct": "walked",
      "explanation": "Yesterday → Past Simple, regular verb → +ed.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Yesterday → Past Simple, regular verb → +ed.",
        "es-419": "Ayer → Pasado simple, verbo regular → +ed."
      }
    },
    {
      "question": "Choose: \"She ___ a book last night\"",
      "options": [
        "read",
        "reads",
        "reading"
      ],
      "correct": "read",
      "explanation": "Read is the past form of read.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Read is the past form of read.",
        "es-419": "Leer es la forma pasada de leer."
      }
    },
    {
      "question": "Choose: \"We ___ pizza for dinner\"",
      "options": [
        "eat",
        "ate",
        "eating"
      ],
      "correct": "ate",
      "explanation": "Ate is the past form of eat.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Ate is the past form of eat.",
        "es-419": "Ate es la forma pasada de comer."
      }
    },
    {
      "question": "Choose: \"They ___ football in the park\"",
      "options": [
        "play",
        "played",
        "playing"
      ],
      "correct": "played",
      "explanation": "Played = Past Simple of play.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Played = Past Simple of play.",
        "es-419": "Jugado = Pasado simple de juego."
      }
    },
    {
      "question": "Choose: \"He ___ his homework yesterday\"",
      "options": [
        "do",
        "did",
        "doing"
      ],
      "correct": "did",
      "explanation": "Did is the past form of do.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Did is the past form of do.",
        "es-419": "Did es la forma pasada de do."
      }
    },
    {
      "question": "Choose: \"I ___ see you at the library\"",
      "options": [
        "don't",
        "didn't",
        "wasn't"
      ],
      "correct": "didn't",
      "explanation": "Past Simple negative → didn't.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → didn't.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"She ___ like the movie\"",
      "options": [
        "doesn't",
        "didn't",
        "wasn't"
      ],
      "correct": "didn't",
      "explanation": "Past Simple negative → didn't.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → didn't.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"___ you go to the park?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Did",
      "explanation": "Past Simple question → Did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → Did.",
        "es-419": "Pregunta simple pasada → Lo hizo."
      }
    },
    {
      "question": "Choose: \"What ___ you do yesterday?\"",
      "options": [
        "do",
        "does",
        "did"
      ],
      "correct": "did",
      "explanation": "Past Simple question → did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → did.",
        "es-419": "Pregunta simple pasada → hizo."
      }
    },
    {
      "question": "Choose: \"My friend ___ me a present\"",
      "options": [
        "give",
        "gave",
        "giving"
      ],
      "correct": "gave",
      "explanation": "Gave is the past form of give.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Gave is the past form of give.",
        "es-419": "Dio es la forma pasada de dar."
      }
    },
    {
      "question": "Choose: \"We ___ to the beach last summer\"",
      "options": [
        "go",
        "went",
        "going"
      ],
      "correct": "went",
      "explanation": "Went is the past form of go.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Went is the past form of go.",
        "es-419": "Went es la forma pasada de go."
      }
    },
    {
      "question": "Choose: \"The cat ___ on the chair\"",
      "options": [
        "sit",
        "sat",
        "sitting"
      ],
      "correct": "sat",
      "explanation": "Sat is the past form of sit.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Sat is the past form of sit.",
        "es-419": "Sat es la forma pasada de sentarse."
      }
    },
    {
      "question": "Choose: \"I ___ breakfast at 8 o'clock\"",
      "options": [
        "have",
        "had",
        "having"
      ],
      "correct": "had",
      "explanation": "Had is the past form of have.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Had is the past form of have.",
        "es-419": "Had es la forma pasada de have."
      }
    },
    {
      "question": "Choose: \"They ___ a great time at the party\"",
      "options": [
        "have",
        "has",
        "had"
      ],
      "correct": "had",
      "explanation": "Had is the past form of have.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Had is the past form of have.",
        "es-419": "Had es la forma pasada de have."
      }
    },
    {
      "question": "Choose: \"She ___ home early yesterday\"",
      "options": [
        "come",
        "came",
        "coming"
      ],
      "correct": "came",
      "explanation": "Came is the past form of come.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Came is the past form of come.",
        "es-419": "Came es la forma pasada de venir."
      }
    },
    {
      "question": "Choose: \"___ he finish his project?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Did",
      "explanation": "Past Simple question → Did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → Did.",
        "es-419": "Pregunta simple pasada → Lo hizo."
      }
    },
    {
      "question": "Choose: \"I ___ not understand the question\"",
      "options": [
        "do",
        "does",
        "did"
      ],
      "correct": "did",
      "explanation": "Past Simple negative → did not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → did not.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"Yesterday I ___ to the store\"",
      "options": [
        "go",
        "went",
        "going"
      ],
      "correct": "went",
      "explanation": "Yesterday → Past Simple, went is the past form of go.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Yesterday → Past Simple, went is the past form of go.",
        "es-419": "Ayer → Pasado simple, fui es la forma pasada de ir."
      }
    },
    {
      "question": "Choose: \"Last week she ___ a new book\"",
      "options": [
        "buy",
        "bought",
        "buying"
      ],
      "correct": "bought",
      "explanation": "Last week → Past Simple, bought is the past form of buy.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Last week → Past Simple, bought is the past form of buy.",
        "es-419": "La semana pasada → Pasado simple, comprado es la forma pasada de compra."
      }
    },
    {
      "question": "Choose: \"We ___ pizza yesterday\"",
      "options": [
        "eat",
        "ate",
        "eating"
      ],
      "correct": "ate",
      "explanation": "Yesterday → Past Simple, ate is the past form of eat.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Yesterday → Past Simple, ate is the past form of eat.",
        "es-419": "Ayer → Pasado simple, ate es la forma pasada de comer."
      }
    },
    {
      "question": "Choose: \"He ___ his homework last night\"",
      "options": [
        "finish",
        "finished",
        "finishing"
      ],
      "correct": "finished",
      "explanation": "Last night → Past Simple, regular verb → +ed.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Last night → Past Simple, regular verb → +ed.",
        "es-419": "Anoche → Pasado simple, verbo regular → +ed."
      }
    },
    {
      "question": "Choose: \"They ___ football yesterday\"",
      "options": [
        "play",
        "played",
        "playing"
      ],
      "correct": "played",
      "explanation": "Yesterday → Past Simple, regular verb → +ed.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Yesterday → Past Simple, regular verb → +ed.",
        "es-419": "Ayer → Pasado simple, verbo regular → +ed."
      }
    },
    {
      "question": "Choose: \"I ___ not see you yesterday\"",
      "options": [
        "do",
        "did",
        "does"
      ],
      "correct": "did",
      "explanation": "Past Simple negative → did not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → did not.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"She ___ not like the movie\"",
      "options": [
        "does",
        "did",
        "do"
      ],
      "correct": "did",
      "explanation": "Past Simple negative → did not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → did not.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"We ___ not go to school yesterday\"",
      "options": [
        "do",
        "did",
        "does"
      ],
      "correct": "did",
      "explanation": "Past Simple negative → did not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → did not.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"___ you go to the park?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Did",
      "explanation": "Past Simple question → Did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → Did.",
        "es-419": "Pregunta simple pasada → Lo hizo."
      }
    },
    {
      "question": "Choose: \"___ she finish her homework?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Did",
      "explanation": "Past Simple question → Did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → Did.",
        "es-419": "Pregunta simple pasada → Lo hizo."
      }
    },
    {
      "question": "Choose: \"___ they play yesterday?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Did",
      "explanation": "Past Simple question → Did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → Did.",
        "es-419": "Pregunta simple pasada → Lo hizo."
      }
    },
    {
      "question": "Choose: \"What ___ you do yesterday?\"",
      "options": [
        "do",
        "does",
        "did"
      ],
      "correct": "did",
      "explanation": "Past Simple question → did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → did.",
        "es-419": "Pregunta simple pasada → hizo."
      }
    },
    {
      "question": "Choose: \"Where ___ you go?\"",
      "options": [
        "do",
        "does",
        "did"
      ],
      "correct": "did",
      "explanation": "Past Simple question → did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → did.",
        "es-419": "Pregunta simple pasada → hizo."
      }
    },
    {
      "question": "Choose: \"When ___ she arrive?\"",
      "options": [
        "do",
        "does",
        "did"
      ],
      "correct": "did",
      "explanation": "Past Simple question → did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → did.",
        "es-419": "Pregunta simple pasada → hizo."
      }
    },
    {
      "question": "Choose: \"I ___ a letter yesterday\"",
      "options": [
        "write",
        "wrote",
        "writing"
      ],
      "correct": "wrote",
      "explanation": "Yesterday → Past Simple, wrote is the past form of write.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Yesterday → Past Simple, wrote is the past form of write.",
        "es-419": "Ayer → Pasado simple, escrito es la forma pasada de escribir."
      }
    },
    {
      "question": "Choose: \"She ___ a picture\"",
      "options": [
        "draw",
        "drew",
        "drawing"
      ],
      "correct": "drew",
      "explanation": "Past Simple, drew is the past form of draw.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple, drew is the past form of draw.",
        "es-419": "Pasado simple, dibujado es la forma pasada de dibujar."
      }
    },
    {
      "question": "Choose: \"We ___ to the beach last summer\"",
      "options": [
        "go",
        "went",
        "going"
      ],
      "correct": "went",
      "explanation": "Last summer → Past Simple, went is the past form of go.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Last summer → Past Simple, went is the past form of go.",
        "es-419": "El verano pasado → Pasado simple, fue es la forma pasada de ir."
      }
    },
    {
      "question": "Choose: \"He ___ home early\"",
      "options": [
        "come",
        "came",
        "coming"
      ],
      "correct": "came",
      "explanation": "Past Simple, came is the past form of come.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple, came is the past form of come.",
        "es-419": "Pasado simple, vino es la forma pasada de venir."
      }
    },
    {
      "question": "Choose: \"They ___ a great time\"",
      "options": [
        "have",
        "has",
        "had"
      ],
      "correct": "had",
      "explanation": "Past Simple, had is the past form of have.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple, had is the past form of have.",
        "es-419": "Pasado simple, had es la forma pasada de have."
      }
    },
    {
      "question": "Choose: \"I ___ my keys\"",
      "options": [
        "lose",
        "lost",
        "losing"
      ],
      "correct": "lost",
      "explanation": "Past Simple, lost is the past form of lose.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple, lost is the past form of lose.",
        "es-419": "Pasado simple, perdido es la forma pasada de perder."
      }
    },
    {
      "question": "Choose: \"She ___ her room\"",
      "options": [
        "clean",
        "cleaned",
        "cleaning"
      ],
      "correct": "cleaned",
      "explanation": "Past Simple, regular verb → +ed.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple, regular verb → +ed.",
        "es-419": "Pasado simple, verbo regular → +ed."
      }
    },
    {
      "question": "Choose: \"We ___ TV last night\"",
      "options": [
        "watch",
        "watched",
        "watching"
      ],
      "correct": "watched",
      "explanation": "Last night → Past Simple, regular verb → +ed.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Last night → Past Simple, regular verb → +ed.",
        "es-419": "Anoche → Pasado simple, verbo regular → +ed."
      }
    },
    {
      "question": "Choose: \"They ___ football\"",
      "options": [
        "play",
        "played",
        "playing"
      ],
      "correct": "played",
      "explanation": "Past Simple, regular verb → +ed.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple, regular verb → +ed.",
        "es-419": "Pasado simple, verbo regular → +ed."
      }
    },
    {
      "question": "Choose: \"I ___ not go yesterday\"",
      "options": [
        "do",
        "did",
        "does"
      ],
      "correct": "did",
      "explanation": "Past Simple negative → did not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → did not.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"She ___ not come\"",
      "options": [
        "does",
        "did",
        "do"
      ],
      "correct": "did",
      "explanation": "Past Simple negative → did not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → did not.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"We ___ not see them\"",
      "options": [
        "do",
        "did",
        "does"
      ],
      "correct": "did",
      "explanation": "Past Simple negative → did not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple negative → did not.",
        "es-419": "Pasado simple negativo → no lo hizo."
      }
    },
    {
      "question": "Choose: \"___ you eat breakfast?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Did",
      "explanation": "Past Simple question → Did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → Did.",
        "es-419": "Pregunta simple pasada → Lo hizo."
      }
    },
    {
      "question": "Choose: \"___ he finish?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Did",
      "explanation": "Past Simple question → Did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → Did.",
        "es-419": "Pregunta simple pasada → Lo hizo."
      }
    },
    {
      "question": "Choose: \"___ they arrive?\"",
      "options": [
        "Do",
        "Does",
        "Did"
      ],
      "correct": "Did",
      "explanation": "Past Simple question → Did.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "past_tense_form_error",
        "irregular_past_error"
      ],
      "patternFamily": "past_simple_past_simple",
      "diagnosticSkillId": "en_grammar_past_simple",
      "conceptTag": "english_past_simple",
      "expectedErrorTags": [
        "past_tense_form_error",
        "irregular_past_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Simple question → Did.",
        "es-419": "Pregunta simple pasada → Lo hizo."
      }
    }
  ],
  "modals": [
    {
      "question": "Choose the correct modal: \"You ___ wear a helmet when you ride\"",
      "options": [
        "should",
        "am",
        "was"
      ],
      "correct": "should",
      "explanation": "Advice → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Advice → should.",
        "es-419": "Consejo → debería."
      }
    },
    {
      "question": "Choose the correct modal: \"We ___ go to the new science fair\"",
      "options": [
        "might",
        "am",
        "is"
      ],
      "correct": "might",
      "explanation": "Future possibility → might.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future possibility → might.",
        "es-419": "Posibilidad futura → podría."
      }
    },
    {
      "question": "Choose the correct modal: \"Students ___ bring water to the trip\"",
      "options": [
        "must",
        "can",
        "am"
      ],
      "correct": "must",
      "explanation": "Mandatory → must",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory → must",
        "es-419": "Obligatorio → debe"
      }
    },
    {
      "question": "Choose: \"I ___ swim when I was five\"",
      "options": [
        "can",
        "could",
        "must"
      ],
      "correct": "could",
      "explanation": "Could in the past → could.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Could in the past → could.",
        "es-419": "Podría en el pasado → podría."
      }
    },
    {
      "question": "Choose: \"You ___ be careful with fire\"",
      "options": [
        "should",
        "can",
        "will"
      ],
      "correct": "should",
      "explanation": "advice/recommendation → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "advice/recommendation → should.",
        "es-419": "consejo/recomendación → debería."
      }
    },
    {
      "question": "Choose: \"We ___ play outside if it rains\"",
      "options": [
        "can't",
        "can",
        "must"
      ],
      "correct": "can't",
      "explanation": "It's impossible → can't.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "It's impossible → can't.",
        "es-419": "Es imposible → no puedo."
      }
    },
    {
      "question": "Choose: \"She ___ speak three languages\"",
      "options": [
        "can",
        "should",
        "must"
      ],
      "correct": "can",
      "explanation": "ability → can",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "ability → can",
        "es-419": "habilidad → puede"
      }
    },
    {
      "question": "Choose: \"You ___ do your homework before playing\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "Advice → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Advice → should.",
        "es-419": "Consejo → debería."
      }
    },
    {
      "question": "Choose: \"They ___ come to the party tomorrow\"",
      "options": [
        "might",
        "must",
        "should"
      ],
      "correct": "might",
      "explanation": "Option → might.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Option → might.",
        "es-419": "Opción → podría."
      }
    },
    {
      "question": "Choose: \"Students ___ not run in the hallway\"",
      "options": [
        "should",
        "can",
        "must"
      ],
      "correct": "must",
      "explanation": "Mandatory/prohibition → must not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory/prohibition → must not.",
        "es-419": "Obligatorio/prohibido → no debe."
      }
    },
    {
      "question": "Choose: \"I ___ help you with that\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "Help offer → can.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Help offer → can.",
        "es-419": "Oferta de ayuda → lata."
      }
    },
    {
      "question": "Choose: \"We ___ save water for the environment\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "advice/moral → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "advice/moral → should.",
        "es-419": "consejo/moral → debería."
      }
    },
    {
      "question": "Choose: \"You ___ be at school by 8 o'clock\"",
      "options": [
        "can",
        "must",
        "might"
      ],
      "correct": "must",
      "explanation": "Mandatory → must",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory → must",
        "es-419": "Obligatorio → debe"
      }
    },
    {
      "question": "Choose: \"He ___ not find his keys\"",
      "options": [
        "can",
        "could",
        "should"
      ],
      "correct": "could",
      "explanation": "Inability in the past → could not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inability in the past → could not.",
        "es-419": "Incapacidad en el pasado → no pudo."
      }
    },
    {
      "question": "Choose: \"___ I borrow your pencil?\"",
      "options": [
        "Can",
        "Should",
        "Must"
      ],
      "correct": "Can",
      "explanation": "Request → Can I?",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Request → Can I?",
        "es-419": "Solicitar → ¿Puedo?"
      }
    },
    {
      "question": "Choose: \"We ___ visit the museum next week\"",
      "options": [
        "might",
        "can",
        "must"
      ],
      "correct": "might",
      "explanation": "Future possibility → might.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future possibility → might.",
        "es-419": "Posibilidad futura → podría."
      }
    },
    {
      "question": "Choose: \"You ___ listen to your teacher\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "Advice/moral duty → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Advice/moral duty → should.",
        "es-419": "Consejo/deber moral → debería."
      }
    },
    {
      "question": "Choose: \"She ___ play the piano very well\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "ability → can",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "ability → can",
        "es-419": "habilidad → puede"
      }
    },
    {
      "question": "Choose: \"Children ___ not play near the road\"",
      "options": [
        "should",
        "can",
        "must"
      ],
      "correct": "must",
      "explanation": "Mandatory/prohibition → must not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory/prohibition → must not.",
        "es-419": "Obligatorio/prohibido → no debe."
      }
    },
    {
      "question": "Choose: \"I ___ finish my project by Friday\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "advice/recommendation → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "advice/recommendation → should.",
        "es-419": "consejo/recomendación → debería."
      }
    },
    {
      "question": "Choose: \"You ___ be careful\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "Advice → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Advice → should.",
        "es-419": "Consejo → debería."
      }
    },
    {
      "question": "Choose: \"I ___ swim\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "ability → can",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "ability → can",
        "es-419": "habilidad → puede"
      }
    },
    {
      "question": "Choose: \"You ___ come to school\"",
      "options": [
        "can",
        "must",
        "might"
      ],
      "correct": "must",
      "explanation": "Mandatory → must",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory → must",
        "es-419": "Obligatorio → debe"
      }
    },
    {
      "question": "Choose: \"We ___ go tomorrow\"",
      "options": [
        "might",
        "can",
        "must"
      ],
      "correct": "might",
      "explanation": "Option → might.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Option → might.",
        "es-419": "Opción → podría."
      }
    },
    {
      "question": "Choose: \"She ___ speak English\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "ability → can",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "ability → can",
        "es-419": "habilidad → puede"
      }
    },
    {
      "question": "Choose: \"You ___ not run here\"",
      "options": [
        "should",
        "can",
        "must"
      ],
      "correct": "must",
      "explanation": "Mandatory/prohibition → must not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory/prohibition → must not.",
        "es-419": "Obligatorio/prohibido → no debe."
      }
    },
    {
      "question": "Choose: \"I ___ help you\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "Help offer → can.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Help offer → can.",
        "es-419": "Oferta de ayuda → lata."
      }
    },
    {
      "question": "Choose: \"We ___ save water\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "advice/moral → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "advice/moral → should.",
        "es-419": "consejo/moral → debería."
      }
    },
    {
      "question": "Choose: \"He ___ not find it\"",
      "options": [
        "can",
        "could",
        "should"
      ],
      "correct": "could",
      "explanation": "Inability in the past → could not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inability in the past → could not.",
        "es-419": "Incapacidad en el pasado → no pudo."
      }
    },
    {
      "question": "Choose: \"___ I help you?\"",
      "options": [
        "Can",
        "Should",
        "Must"
      ],
      "correct": "Can",
      "explanation": "Request → Can I?",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Request → Can I?",
        "es-419": "Solicitar → ¿Puedo?"
      }
    },
    {
      "question": "Choose: \"You ___ listen\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "Advice → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Advice → should.",
        "es-419": "Consejo → debería."
      }
    },
    {
      "question": "Choose: \"They ___ come\"",
      "options": [
        "might",
        "can",
        "must"
      ],
      "correct": "might",
      "explanation": "Option → might.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Option → might.",
        "es-419": "Opción → podría."
      }
    },
    {
      "question": "Choose: \"I ___ not do that\"",
      "options": [
        "can",
        "could",
        "should"
      ],
      "correct": "can",
      "explanation": "Inability → can not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inability → can not.",
        "es-419": "Incapacidad → no puede."
      }
    },
    {
      "question": "Choose: \"You ___ be on time\"",
      "options": [
        "can",
        "must",
        "might"
      ],
      "correct": "must",
      "explanation": "Mandatory → must",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory → must",
        "es-419": "Obligatorio → debe"
      }
    },
    {
      "question": "Choose: \"We ___ visit them\"",
      "options": [
        "might",
        "can",
        "must"
      ],
      "correct": "might",
      "explanation": "Future possibility → might.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future possibility → might.",
        "es-419": "Posibilidad futura → podría."
      }
    },
    {
      "question": "Choose: \"She ___ play well\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "ability → can",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "ability → can",
        "es-419": "habilidad → puede"
      }
    },
    {
      "question": "Choose: \"Children ___ not play here\"",
      "options": [
        "should",
        "can",
        "must"
      ],
      "correct": "must",
      "explanation": "Mandatory/prohibition → must not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory/prohibition → must not.",
        "es-419": "Obligatorio/prohibido → no debe."
      }
    },
    {
      "question": "Choose: \"I ___ help\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "Help offer → can.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Help offer → can.",
        "es-419": "Oferta de ayuda → lata."
      }
    },
    {
      "question": "Choose: \"You ___ study hard\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "Advice → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Advice → should.",
        "es-419": "Consejo → debería."
      }
    },
    {
      "question": "Choose: \"He ___ not come\"",
      "options": [
        "can",
        "could",
        "should"
      ],
      "correct": "could",
      "explanation": "Inability in the past → could not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inability in the past → could not.",
        "es-419": "Incapacidad en el pasado → no pudo."
      }
    },
    {
      "question": "Choose: \"___ I go?\"",
      "options": [
        "Can",
        "Should",
        "Must"
      ],
      "correct": "Can",
      "explanation": "Request → Can I?",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Request → Can I?",
        "es-419": "Solicitar → ¿Puedo?"
      }
    },
    {
      "question": "Choose: \"We ___ be careful\"",
      "options": [
        "should",
        "can",
        "might"
      ],
      "correct": "should",
      "explanation": "Advice → should.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Advice → should.",
        "es-419": "Consejo → debería."
      }
    },
    {
      "question": "Choose: \"They ___ arrive late\"",
      "options": [
        "might",
        "can",
        "must"
      ],
      "correct": "might",
      "explanation": "Option → might.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Option → might.",
        "es-419": "Opción → podría."
      }
    },
    {
      "question": "Choose: \"I ___ not see it\"",
      "options": [
        "can",
        "could",
        "should"
      ],
      "correct": "can",
      "explanation": "Inability → can not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inability → can not.",
        "es-419": "Incapacidad → no puede."
      }
    },
    {
      "question": "Choose: \"You ___ be here at 8\"",
      "options": [
        "can",
        "must",
        "might"
      ],
      "correct": "must",
      "explanation": "Mandatory → must",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory → must",
        "es-419": "Obligatorio → debe"
      }
    },
    {
      "question": "Choose: \"She ___ come tomorrow\"",
      "options": [
        "might",
        "can",
        "must"
      ],
      "correct": "might",
      "explanation": "Future possibility → might.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future possibility → might.",
        "es-419": "Posibilidad futura → podría."
      }
    },
    {
      "question": "Choose: \"We ___ play together\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "ability → can",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "ability → can",
        "es-419": "habilidad → puede"
      }
    },
    {
      "question": "Choose: \"Students ___ not cheat\"",
      "options": [
        "should",
        "can",
        "must"
      ],
      "correct": "must",
      "explanation": "Mandatory/prohibition → must not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory/prohibition → must not.",
        "es-419": "Obligatorio/prohibido → no debe."
      }
    },
    {
      "question": "Choose: \"I ___ help you\"",
      "options": [
        "can",
        "must",
        "should"
      ],
      "correct": "can",
      "explanation": "Help offer → can.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "modal_verb_error"
      ],
      "patternFamily": "modals_modals",
      "diagnosticSkillId": "en_grammar_modals",
      "conceptTag": "english_modals",
      "expectedErrorTags": [
        "modal_verb_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Help offer → can.",
        "es-419": "Oferta de ayuda → lata."
      }
    }
  ],
  "comparatives": [
    {
      "question": "Choose the correct form: \"This book is ___ than that one\"",
      "options": [
        "more interesting",
        "most interesting",
        "interesting"
      ],
      "correct": "more interesting",
      "explanation": "Comparison of a two-syllable adjective → more + adjective.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison of a two-syllable adjective → more + adjective.",
        "es-419": "Comparación de un adjetivo de dos sílabas → más + adjetivo."
      }
    },
    {
      "question": "Choose the correct word: \"My bag is ___ than yours\"",
      "options": [
        "heavier",
        "heavy",
        "heaviest"
      ],
      "correct": "heavier",
      "explanation": "Comparative → adjective + er.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → adjective + er.",
        "es-419": "Comparativo → adjetivo + er."
      }
    },
    {
      "question": "Choose the correct form: \"This exercise is the ___ of the unit\"",
      "options": [
        "harder",
        "hardest",
        "hard"
      ],
      "correct": "hardest",
      "explanation": "Superlative → the + adjective + est.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → the + adjective + est.",
        "es-419": "Superlativo → el + adjetivo + est."
      }
    },
    {
      "question": "Choose: \"Tom is ___ than his brother\"",
      "options": [
        "tall",
        "taller",
        "tallest"
      ],
      "correct": "taller",
      "explanation": "Comparative → taller (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → taller (er).",
        "es-419": "Comparativo → más alto (er)."
      }
    },
    {
      "question": "Choose: \"This is the ___ day of the week\"",
      "options": [
        "long",
        "longer",
        "longest"
      ],
      "correct": "longest",
      "explanation": "Superlative → longest (est).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → longest (est).",
        "es-419": "Superlativo → más largo (est)."
      }
    },
    {
      "question": "Choose: \"My room is ___ than yours\"",
      "options": [
        "big",
        "bigger",
        "biggest"
      ],
      "correct": "bigger",
      "explanation": "Comparison → bigger (doubling the last letter + er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison → bigger (doubling the last letter + er).",
        "es-419": "Comparación → más grande (duplicando la última letra + er)."
      }
    },
    {
      "question": "Choose: \"This test was ___ than the last one\"",
      "options": [
        "easy",
        "easier",
        "easiest"
      ],
      "correct": "easier",
      "explanation": "Comparative → easier (y → ier).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → easier (y → ier).",
        "es-419": "Comparativo → más fácil (y → ier)."
      }
    },
    {
      "question": "Choose: \"She is the ___ student in class\"",
      "options": [
        "good",
        "better",
        "best"
      ],
      "correct": "best",
      "explanation": "Superlative of good → best.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of good → best.",
        "es-419": "Superlativo de bueno → mejor."
      }
    },
    {
      "question": "Choose: \"This movie is ___ than the book\"",
      "options": [
        "more exciting",
        "most exciting",
        "exciting"
      ],
      "correct": "more exciting",
      "explanation": "Comparison of a long adjective → more + adjective.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison of a long adjective → more + adjective.",
        "es-419": "Comparación de un adjetivo largo → más + adjetivo."
      }
    },
    {
      "question": "Choose: \"Today is ___ than yesterday\"",
      "options": [
        "cold",
        "colder",
        "coldest"
      ],
      "correct": "colder",
      "explanation": "Comparative → colder (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → colder (er).",
        "es-419": "Comparativo → más frío (más)."
      }
    },
    {
      "question": "Choose: \"This is the ___ cake I've ever eaten\"",
      "options": [
        "good",
        "better",
        "best"
      ],
      "correct": "best",
      "explanation": "Superlative of good → best.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of good → best.",
        "es-419": "Superlativo de bueno → mejor."
      }
    },
    {
      "question": "Choose: \"My pencil is ___ than yours\"",
      "options": [
        "short",
        "shorter",
        "shortest"
      ],
      "correct": "shorter",
      "explanation": "Comparative → shorter (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → shorter (er).",
        "es-419": "Comparativo → más corto (er)."
      }
    },
    {
      "question": "Choose: \"This problem is ___ than the previous one\"",
      "options": [
        "difficult",
        "more difficult",
        "most difficult"
      ],
      "correct": "more difficult",
      "explanation": "Comparison of a long adjective → more + adjective.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison of a long adjective → more + adjective.",
        "es-419": "Comparación de un adjetivo largo → más + adjetivo."
      }
    },
    {
      "question": "Choose: \"That is the ___ building in the city\"",
      "options": [
        "high",
        "higher",
        "highest"
      ],
      "correct": "highest",
      "explanation": "Superlative → highest (est).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → highest (est).",
        "es-419": "Superlativo → más alto (est)."
      }
    },
    {
      "question": "Choose: \"This route is ___ than the other\"",
      "options": [
        "long",
        "longer",
        "longest"
      ],
      "correct": "longer",
      "explanation": "Comparative → longer (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → longer (er).",
        "es-419": "Comparativo → más largo (er)."
      }
    },
    {
      "question": "Choose: \"She is ___ than her sister\"",
      "options": [
        "old",
        "older",
        "oldest"
      ],
      "correct": "older",
      "explanation": "Comparative → older (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → older (er).",
        "es-419": "Comparativo → mayor (er)."
      }
    },
    {
      "question": "Choose: \"This is the ___ question in the test\"",
      "options": [
        "hard",
        "harder",
        "hardest"
      ],
      "correct": "hardest",
      "explanation": "Superlative → hardest (est).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → hardest (est).",
        "es-419": "Superlativo → más difícil (est)."
      }
    },
    {
      "question": "Choose: \"My homework is ___ than yours\"",
      "options": [
        "easy",
        "easier",
        "easiest"
      ],
      "correct": "easier",
      "explanation": "Comparative → easier (y → ier).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → easier (y → ier).",
        "es-419": "Comparativo → más fácil (y → ier)."
      }
    },
    {
      "question": "Choose: \"This book is the ___ one I've read\"",
      "options": [
        "interesting",
        "more interesting",
        "most interesting"
      ],
      "correct": "most interesting",
      "explanation": "Superlative of a long adjective → most + adjective.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of a long adjective → most + adjective.",
        "es-419": "Superlativo de un adjetivo largo → most + adjetivo."
      }
    },
    {
      "question": "Choose: \"The weather today is ___ than yesterday\"",
      "options": [
        "nice",
        "nicer",
        "nicest"
      ],
      "correct": "nicer",
      "explanation": "Comparative → nicer (e → er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → nicer (e → er).",
        "es-419": "Comparativo → más agradable (e → er)."
      }
    },
    {
      "question": "Choose: \"This is ___ than that\"",
      "options": [
        "good",
        "better",
        "best"
      ],
      "correct": "better",
      "explanation": "Comparison of good → better.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison of good → better.",
        "es-419": "Comparación de bueno → mejor."
      }
    },
    {
      "question": "Choose: \"She is ___ than me\"",
      "options": [
        "tall",
        "taller",
        "tallest"
      ],
      "correct": "taller",
      "explanation": "Comparative → taller (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → taller (er).",
        "es-419": "Comparativo → más alto (er)."
      }
    },
    {
      "question": "Choose: \"This is the ___ one\"",
      "options": [
        "good",
        "better",
        "best"
      ],
      "correct": "best",
      "explanation": "Superlative of good → best.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of good → best.",
        "es-419": "Superlativo de bueno → mejor."
      }
    },
    {
      "question": "Choose: \"My bag is ___ than yours\"",
      "options": [
        "heavy",
        "heavier",
        "heaviest"
      ],
      "correct": "heavier",
      "explanation": "Comparative → heavier.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → heavier.",
        "es-419": "Comparativo → más pesado."
      }
    },
    {
      "question": "Choose: \"This is the ___ day\"",
      "options": [
        "long",
        "longer",
        "longest"
      ],
      "correct": "longest",
      "explanation": "Superlative → longest (est).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → longest (est).",
        "es-419": "Superlativo → más largo (est)."
      }
    },
    {
      "question": "Choose: \"This room is ___ than that one\"",
      "options": [
        "big",
        "bigger",
        "biggest"
      ],
      "correct": "bigger",
      "explanation": "Comparison → bigger (doubling the last letter + er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison → bigger (doubling the last letter + er).",
        "es-419": "Comparación → más grande (duplicando la última letra + er)."
      }
    },
    {
      "question": "Choose: \"This test is ___ than the last\"",
      "options": [
        "easy",
        "easier",
        "easiest"
      ],
      "correct": "easier",
      "explanation": "Comparative → easier (y → ier).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → easier (y → ier).",
        "es-419": "Comparativo → más fácil (y → ier)."
      }
    },
    {
      "question": "Choose: \"She is the ___ student\"",
      "options": [
        "good",
        "better",
        "best"
      ],
      "correct": "best",
      "explanation": "Superlative of good → best.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of good → best.",
        "es-419": "Superlativo de bueno → mejor."
      }
    },
    {
      "question": "Choose: \"This movie is ___ than the book\"",
      "options": [
        "more exciting",
        "most exciting",
        "exciting"
      ],
      "correct": "more exciting",
      "explanation": "Comparison of a long adjective → more + adjective.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison of a long adjective → more + adjective.",
        "es-419": "Comparación de un adjetivo largo → más + adjetivo."
      }
    },
    {
      "question": "Choose: \"Today is ___ than yesterday\"",
      "options": [
        "cold",
        "colder",
        "coldest"
      ],
      "correct": "colder",
      "explanation": "Comparative → colder (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → colder (er).",
        "es-419": "Comparativo → más frío (más)."
      }
    },
    {
      "question": "Choose: \"This is the ___ cake\"",
      "options": [
        "good",
        "better",
        "best"
      ],
      "correct": "best",
      "explanation": "Superlative of good → best.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of good → best.",
        "es-419": "Superlativo de bueno → mejor."
      }
    },
    {
      "question": "Choose: \"My pencil is ___ than yours\"",
      "options": [
        "short",
        "shorter",
        "shortest"
      ],
      "correct": "shorter",
      "explanation": "Comparative → shorter (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → shorter (er).",
        "es-419": "Comparativo → más corto (er)."
      }
    },
    {
      "question": "Choose: \"This problem is ___ than the previous\"",
      "options": [
        "difficult",
        "more difficult",
        "most difficult"
      ],
      "correct": "more difficult",
      "explanation": "Comparison of a long adjective → more + adjective.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison of a long adjective → more + adjective.",
        "es-419": "Comparación de un adjetivo largo → más + adjetivo."
      }
    },
    {
      "question": "Choose: \"That is the ___ building\"",
      "options": [
        "high",
        "higher",
        "highest"
      ],
      "correct": "highest",
      "explanation": "Superlative → highest (est).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → highest (est).",
        "es-419": "Superlativo → más alto (est)."
      }
    },
    {
      "question": "Choose: \"This route is ___ than the other\"",
      "options": [
        "long",
        "longer",
        "longest"
      ],
      "correct": "longer",
      "explanation": "Comparative → longer (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → longer (er).",
        "es-419": "Comparativo → más largo (er)."
      }
    },
    {
      "question": "Choose: \"She is ___ than her sister\"",
      "options": [
        "old",
        "older",
        "oldest"
      ],
      "correct": "older",
      "explanation": "Comparative → older (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → older (er).",
        "es-419": "Comparativo → mayor (er)."
      }
    },
    {
      "question": "Choose: \"This is the ___ question\"",
      "options": [
        "hard",
        "harder",
        "hardest"
      ],
      "correct": "hardest",
      "explanation": "Superlative → hardest (est).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → hardest (est).",
        "es-419": "Superlativo → más difícil (est)."
      }
    },
    {
      "question": "Choose: \"My homework is ___ than yours\"",
      "options": [
        "easy",
        "easier",
        "easiest"
      ],
      "correct": "easier",
      "explanation": "Comparative → easier (y → ier).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → easier (y → ier).",
        "es-419": "Comparativo → más fácil (y → ier)."
      }
    },
    {
      "question": "Choose: \"This book is the ___ one\"",
      "options": [
        "interesting",
        "more interesting",
        "most interesting"
      ],
      "correct": "most interesting",
      "explanation": "Superlative of a long adjective → most + adjective.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of a long adjective → most + adjective.",
        "es-419": "Superlativo de un adjetivo largo → most + adjetivo."
      }
    },
    {
      "question": "Choose: \"The weather is ___ than before\"",
      "options": [
        "nice",
        "nicer",
        "nicest"
      ],
      "correct": "nicer",
      "explanation": "Comparative → nicer (e → er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → nicer (e → er).",
        "es-419": "Comparativo → más agradable (e → er)."
      }
    },
    {
      "question": "Choose: \"This is ___ than that\"",
      "options": [
        "bad",
        "worse",
        "worst"
      ],
      "correct": "worse",
      "explanation": "Comparison of bad → worse.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison of bad → worse.",
        "es-419": "Comparación de malo → peor."
      }
    },
    {
      "question": "Choose: \"This is the ___ one\"",
      "options": [
        "bad",
        "worse",
        "worst"
      ],
      "correct": "worst",
      "explanation": "Superlative of bad → worst.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of bad → worst.",
        "es-419": "Superlativo de malo → peor."
      }
    },
    {
      "question": "Choose: \"She is ___ than him\"",
      "options": [
        "young",
        "younger",
        "youngest"
      ],
      "correct": "younger",
      "explanation": "Comparative → younger (er).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → younger (er).",
        "es-419": "Comparativo → más joven (er)."
      }
    },
    {
      "question": "Choose: \"This is the ___ child\"",
      "options": [
        "young",
        "younger",
        "youngest"
      ],
      "correct": "youngest",
      "explanation": "Superlative → youngest (est).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → youngest (est).",
        "es-419": "Superlativo → más joven (est)."
      }
    },
    {
      "question": "Choose: \"This is ___ than that\"",
      "options": [
        "far",
        "farther",
        "farthest"
      ],
      "correct": "farther",
      "explanation": "Comparative → farther.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparative → farther.",
        "es-419": "Comparativo → más lejos."
      }
    },
    {
      "question": "Choose: \"This is the ___ place\"",
      "options": [
        "far",
        "farther",
        "farthest"
      ],
      "correct": "farthest",
      "explanation": "Superlative → farthest.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative → farthest.",
        "es-419": "Superlativo → más lejano."
      }
    },
    {
      "question": "Choose: \"This is ___ than that\"",
      "options": [
        "little",
        "less",
        "least"
      ],
      "correct": "less",
      "explanation": "Comparison of little → less.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison of little → less.",
        "es-419": "Comparación de poco → menos."
      }
    },
    {
      "question": "Choose: \"This is the ___ one\"",
      "options": [
        "little",
        "less",
        "least"
      ],
      "correct": "least",
      "explanation": "Superlative of little → least.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "comparative_form_error",
        "irregular_comparative_error"
      ],
      "patternFamily": "comparatives_comparatives",
      "diagnosticSkillId": "en_grammar_comparatives",
      "conceptTag": "english_comparatives",
      "expectedErrorTags": [
        "comparative_form_error",
        "irregular_comparative_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Superlative of little → least.",
        "es-419": "Superlativo de poco → mínimo."
      }
    }
  ],
  "future_forms": [
    {
      "question": "Choose the correct future: \"Tomorrow we ___ a trip\"",
      "options": [
        "take",
        "will take",
        "took"
      ],
      "correct": "will take",
      "explanation": "Tomorrow → will + base form.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tomorrow → will + base form.",
        "es-419": "Mañana → será + forma base."
      }
    },
    {
      "question": "Choose the correct plan: \"We ___ my cousins on Sunday\"",
      "options": [
        "are visiting",
        "visited",
        "visits"
      ],
      "correct": "are visiting",
      "explanation": "Upcoming plan → Present Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Upcoming plan → Present Continuous.",
        "es-419": "Próximo plan → Presente continuo."
      }
    },
    {
      "question": "Choose the correct option: \"I'm sure it ___ fine\"",
      "options": [
        "is",
        "will be",
        "was"
      ],
      "correct": "will be",
      "explanation": "Security in the future → will + base.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Security in the future → will + base.",
        "es-419": "Seguridad en el futuro → voluntad + base."
      }
    },
    {
      "question": "Choose: \"Next week I ___ to the beach\"",
      "options": [
        "go",
        "will go",
        "went"
      ],
      "correct": "will go",
      "explanation": "future → will go",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will go",
        "es-419": "futuro → irá"
      }
    },
    {
      "question": "Choose: \"She ___ a party next month\"",
      "options": [
        "has",
        "will have",
        "had"
      ],
      "correct": "will have",
      "explanation": "future → will have",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will have",
        "es-419": "futuro → tendrá"
      }
    },
    {
      "question": "Choose: \"We ___ pizza for dinner tonight\"",
      "options": [
        "are having",
        "have",
        "had"
      ],
      "correct": "are having",
      "explanation": "Upcoming program → are having.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Upcoming program → are having.",
        "es-419": "Próximo programa → están teniendo."
      }
    },
    {
      "question": "Choose: \"They ___ visit us tomorrow\"",
      "options": [
        "visit",
        "will visit",
        "visited"
      ],
      "correct": "will visit",
      "explanation": "future → will visit",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will visit",
        "es-419": "futuro → visitará"
      }
    },
    {
      "question": "Choose: \"I ___ finish my homework soon\"",
      "options": [
        "finish",
        "will finish",
        "finished"
      ],
      "correct": "will finish",
      "explanation": "future → will finish",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will finish",
        "es-419": "futuro → terminará"
      }
    },
    {
      "question": "Choose: \"What ___ you do next summer?\"",
      "options": [
        "do",
        "will",
        "did"
      ],
      "correct": "will",
      "explanation": "Question in the future → What will you do?",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in the future → What will you do?",
        "es-419": "Pregunta en el futuro → ¿Qué harás?"
      }
    },
    {
      "question": "Choose: \"I ___ not forget your birthday\"",
      "options": [
        "do",
        "will",
        "am"
      ],
      "correct": "will",
      "explanation": "Negative future → will not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Negative future → will not.",
        "es-419": "Futuro negativo → no lo hará."
      }
    },
    {
      "question": "Choose: \"We ___ going to the park this afternoon\"",
      "options": [
        "are",
        "will",
        "was"
      ],
      "correct": "are",
      "explanation": "Program → are going to.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going to.",
        "es-419": "Programa → van a."
      }
    },
    {
      "question": "Choose: \"She ___ start her new school in September\"",
      "options": [
        "starts",
        "will start",
        "started"
      ],
      "correct": "will start",
      "explanation": "future → will start",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will start",
        "es-419": "futuro → comenzará"
      }
    },
    {
      "question": "Choose: \"I ___ see you next week\"",
      "options": [
        "see",
        "will see",
        "saw"
      ],
      "correct": "will see",
      "explanation": "future → will see",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will see",
        "es-419": "futuro → verá"
      }
    },
    {
      "question": "Choose: \"They ___ not come to school tomorrow\"",
      "options": [
        "do",
        "will",
        "are"
      ],
      "correct": "will",
      "explanation": "Negative future → will not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Negative future → will not.",
        "es-419": "Futuro negativo → no lo hará."
      }
    },
    {
      "question": "Choose: \"What time ___ the movie start?\"",
      "options": [
        "does",
        "will",
        "did"
      ],
      "correct": "will",
      "explanation": "Question in the future → will.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in the future → will.",
        "es-419": "Pregunta en el futuro → voluntad."
      }
    },
    {
      "question": "Choose: \"I ___ help you with that tomorrow\"",
      "options": [
        "help",
        "will help",
        "helped"
      ],
      "correct": "will help",
      "explanation": "future → will help",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will help",
        "es-419": "futuro → ayudará"
      }
    },
    {
      "question": "Choose: \"We ___ have a test next Friday\"",
      "options": [
        "have",
        "will have",
        "had"
      ],
      "correct": "will have",
      "explanation": "future → will have",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will have",
        "es-419": "futuro → tendrá"
      }
    },
    {
      "question": "Choose: \"She ___ be ten years old next month\"",
      "options": [
        "is",
        "will be",
        "was"
      ],
      "correct": "will be",
      "explanation": "future → will be",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will be",
        "es-419": "futuro → será"
      }
    },
    {
      "question": "Choose: \"I think it ___ rain tomorrow\"",
      "options": [
        "rains",
        "will rain",
        "rained"
      ],
      "correct": "will rain",
      "explanation": "forecast/prediction → will rain.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "forecast/prediction → will rain.",
        "es-419": "pronóstico/predicción → lloverá."
      }
    },
    {
      "question": "Choose: \"We ___ going to learn about space\"",
      "options": [
        "are",
        "will",
        "was"
      ],
      "correct": "are",
      "explanation": "Program → are going to.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going to.",
        "es-419": "Programa → van a."
      }
    },
    {
      "question": "Choose: \"Tomorrow I ___ to school\"",
      "options": [
        "go",
        "will go",
        "went"
      ],
      "correct": "will go",
      "explanation": "Tomorrow → will go.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tomorrow → will go.",
        "es-419": "Mañana → irá."
      }
    },
    {
      "question": "Choose: \"Next week she ___ a party\"",
      "options": [
        "has",
        "will have",
        "had"
      ],
      "correct": "will have",
      "explanation": "Next week → will have.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Next week → will have.",
        "es-419": "La semana que viene → lo tendré."
      }
    },
    {
      "question": "Choose: \"We ___ pizza tonight\"",
      "options": [
        "are having",
        "have",
        "had"
      ],
      "correct": "are having",
      "explanation": "Upcoming program → are having.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Upcoming program → are having.",
        "es-419": "Próximo programa → están teniendo."
      }
    },
    {
      "question": "Choose: \"They ___ visit us tomorrow\"",
      "options": [
        "visit",
        "will visit",
        "visited"
      ],
      "correct": "will visit",
      "explanation": "Tomorrow → will visit.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tomorrow → will visit.",
        "es-419": "Mañana → lo visitaré."
      }
    },
    {
      "question": "Choose: \"I ___ finish soon\"",
      "options": [
        "finish",
        "will finish",
        "finished"
      ],
      "correct": "will finish",
      "explanation": "future → will finish",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will finish",
        "es-419": "futuro → terminará"
      }
    },
    {
      "question": "Choose: \"What ___ you do next summer?\"",
      "options": [
        "do",
        "will",
        "did"
      ],
      "correct": "will",
      "explanation": "Question in the future → What will you do?",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in the future → What will you do?",
        "es-419": "Pregunta en el futuro → ¿Qué harás?"
      }
    },
    {
      "question": "Choose: \"I ___ not forget\"",
      "options": [
        "do",
        "will",
        "am"
      ],
      "correct": "will",
      "explanation": "Negative future → will not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Negative future → will not.",
        "es-419": "Futuro negativo → no lo hará."
      }
    },
    {
      "question": "Choose: \"We ___ going to the park\"",
      "options": [
        "are",
        "will",
        "was"
      ],
      "correct": "are",
      "explanation": "Program → are going to.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going to.",
        "es-419": "Programa → van a."
      }
    },
    {
      "question": "Choose: \"She ___ start next month\"",
      "options": [
        "starts",
        "will start",
        "started"
      ],
      "correct": "will start",
      "explanation": "future → will start",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will start",
        "es-419": "futuro → comenzará"
      }
    },
    {
      "question": "Choose: \"I ___ see you next week\"",
      "options": [
        "see",
        "will see",
        "saw"
      ],
      "correct": "will see",
      "explanation": "future → will see",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will see",
        "es-419": "futuro → verá"
      }
    },
    {
      "question": "Choose: \"They ___ not come tomorrow\"",
      "options": [
        "do",
        "will",
        "are"
      ],
      "correct": "will",
      "explanation": "Negative future → will not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Negative future → will not.",
        "es-419": "Futuro negativo → no lo hará."
      }
    },
    {
      "question": "Choose: \"What time ___ it start?\"",
      "options": [
        "does",
        "will",
        "did"
      ],
      "correct": "will",
      "explanation": "Question in the future → will.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in the future → will.",
        "es-419": "Pregunta en el futuro → voluntad."
      }
    },
    {
      "question": "Choose: \"I ___ help you tomorrow\"",
      "options": [
        "help",
        "will help",
        "helped"
      ],
      "correct": "will help",
      "explanation": "future → will help",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will help",
        "es-419": "futuro → ayudará"
      }
    },
    {
      "question": "Choose: \"We ___ have a test next Friday\"",
      "options": [
        "have",
        "will have",
        "had"
      ],
      "correct": "will have",
      "explanation": "future → will have",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will have",
        "es-419": "futuro → tendrá"
      }
    },
    {
      "question": "Choose: \"She ___ be ten next month\"",
      "options": [
        "is",
        "will be",
        "was"
      ],
      "correct": "will be",
      "explanation": "future → will be",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future → will be",
        "es-419": "futuro → será"
      }
    },
    {
      "question": "Choose: \"I think it ___ rain\"",
      "options": [
        "rains",
        "will rain",
        "rained"
      ],
      "correct": "will rain",
      "explanation": "Forecast → will rain.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Forecast → will rain.",
        "es-419": "Pronóstico → lloverá."
      }
    },
    {
      "question": "Choose: \"We ___ going to learn\"",
      "options": [
        "are",
        "will",
        "was"
      ],
      "correct": "are",
      "explanation": "Program → are going to.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going to.",
        "es-419": "Programa → van a."
      }
    },
    {
      "question": "Choose: \"Tomorrow we ___ a trip\"",
      "options": [
        "take",
        "will take",
        "took"
      ],
      "correct": "will take",
      "explanation": "Tomorrow → will take.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tomorrow → will take.",
        "es-419": "Mañana → tomará."
      }
    },
    {
      "question": "Choose: \"Next year I ___ twelve\"",
      "options": [
        "am",
        "will be",
        "was"
      ],
      "correct": "will be",
      "explanation": "Next year → will be.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Next year → will be.",
        "es-419": "El año que viene → será."
      }
    },
    {
      "question": "Choose: \"We ___ going to the beach\"",
      "options": [
        "are",
        "will",
        "was"
      ],
      "correct": "are",
      "explanation": "Program → are going to.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going to.",
        "es-419": "Programa → van a."
      }
    },
    {
      "question": "Choose: \"She ___ come next week\"",
      "options": [
        "come",
        "will come",
        "came"
      ],
      "correct": "will come",
      "explanation": "Next week → will come.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Next week → will come.",
        "es-419": "La semana que viene → vendrá."
      }
    },
    {
      "question": "Choose: \"I ___ not be late\"",
      "options": [
        "do",
        "will",
        "am"
      ],
      "correct": "will",
      "explanation": "Negative future → will not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Negative future → will not.",
        "es-419": "Futuro negativo → no lo hará."
      }
    },
    {
      "question": "Choose: \"They ___ arrive tomorrow\"",
      "options": [
        "arrive",
        "will arrive",
        "arrived"
      ],
      "correct": "will arrive",
      "explanation": "Tomorrow → will arrive.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tomorrow → will arrive.",
        "es-419": "Mañana → llegará."
      }
    },
    {
      "question": "Choose: \"We ___ going to play\"",
      "options": [
        "are",
        "will",
        "was"
      ],
      "correct": "are",
      "explanation": "Program → are going to.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going to.",
        "es-419": "Programa → van a."
      }
    },
    {
      "question": "Choose: \"Next month I ___ start\"",
      "options": [
        "start",
        "will start",
        "started"
      ],
      "correct": "will start",
      "explanation": "Next month → will start.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Next month → will start.",
        "es-419": "El mes que viene → comenzará."
      }
    },
    {
      "question": "Choose: \"She ___ not forget\"",
      "options": [
        "do",
        "will",
        "is"
      ],
      "correct": "will",
      "explanation": "Negative future → will not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Negative future → will not.",
        "es-419": "Futuro negativo → no lo hará."
      }
    },
    {
      "question": "Choose: \"We ___ going to study\"",
      "options": [
        "are",
        "will",
        "was"
      ],
      "correct": "are",
      "explanation": "Program → are going to.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Program → are going to.",
        "es-419": "Programa → van a."
      }
    },
    {
      "question": "Choose: \"Tomorrow they ___ leave\"",
      "options": [
        "leave",
        "will leave",
        "left"
      ],
      "correct": "will leave",
      "explanation": "Tomorrow → will leave.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tomorrow → will leave.",
        "es-419": "Mañana → se irá."
      }
    },
    {
      "question": "Choose: \"I ___ not miss it\"",
      "options": [
        "do",
        "will",
        "am"
      ],
      "correct": "will",
      "explanation": "Negative future → will not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "future_form_error",
        "will_going_to_confusion"
      ],
      "patternFamily": "future_forms_future_forms",
      "diagnosticSkillId": "en_grammar_future_forms",
      "conceptTag": "english_future_forms",
      "expectedErrorTags": [
        "future_form_error",
        "will_going_to_confusion",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Negative future → will not.",
        "es-419": "Futuro negativo → no lo hará."
      }
    }
  ],
  "complex_tenses": [
    {
      "question": "Choose the correct tense: \"They ___ when the phone rang\"",
      "options": [
        "played",
        "were playing",
        "are playing"
      ],
      "correct": "were playing",
      "explanation": "Action continues in the past → Past Continuous.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Action continues in the past → Past Continuous.",
        "es-419": "La acción continúa en el pasado → Pasado continuo."
      }
    },
    {
      "question": "Choose the correct form: \"I have ___ finished my project\"",
      "options": [
        "already",
        "ever",
        "never"
      ],
      "correct": "already",
      "explanation": "Present Perfect likes already/just.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Present Perfect likes already/just.",
        "es-419": "A Present Perfect ya le gusta/solo."
      }
    },
    {
      "question": "Choose the correct option: \"She has ___ visited London\"",
      "options": [
        "never",
        "ever",
        "always"
      ],
      "correct": "never",
      "explanation": "Experience in the past until now → never/ever.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Experience in the past until now → never/ever.",
        "es-419": "Experiencia en el pasado hasta ahora → nunca/jamás."
      }
    },
    {
      "question": "Choose: \"I ___ my homework when you called\"",
      "options": [
        "was doing",
        "did",
        "do"
      ],
      "correct": "was doing",
      "explanation": "A continuous action in the past → was doing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "A continuous action in the past → was doing.",
        "es-419": "Una acción continua en el pasado → estaba haciendo."
      }
    },
    {
      "question": "Choose: \"She ___ a book when the bell rang\"",
      "options": [
        "read",
        "was reading",
        "reads"
      ],
      "correct": "was reading",
      "explanation": "Action continues in the past → was reading.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Action continues in the past → was reading.",
        "es-419": "La acción continúa en el pasado → estaba leyendo."
      }
    },
    {
      "question": "Choose: \"We ___ already eaten lunch\"",
      "options": [
        "have",
        "has",
        "had"
      ],
      "correct": "have",
      "explanation": "Present Perfect → have + past participle.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Present Perfect → have + past participle.",
        "es-419": "Presente perfecto → tener + participio pasado."
      }
    },
    {
      "question": "Choose: \"Have you ___ been to Paris?\"",
      "options": [
        "ever",
        "never",
        "already"
      ],
      "correct": "ever",
      "explanation": "Question in Present Perfect → ever.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in Present Perfect → ever.",
        "es-419": "Pregunta en Presente Perfecto → siempre."
      }
    },
    {
      "question": "Choose: \"They ___ studying when I arrived\"",
      "options": [
        "were",
        "was",
        "are"
      ],
      "correct": "were",
      "explanation": "Past Continuous → were studying.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → were studying.",
        "es-419": "Pasado Continuo → estaban estudiando."
      }
    },
    {
      "question": "Choose: \"I have ___ seen that movie\"",
      "options": [
        "already",
        "ever",
        "never"
      ],
      "correct": "already",
      "explanation": "already",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "already",
        "es-419": "ya"
      }
    },
    {
      "question": "Choose: \"He ___ not finished his work yet\"",
      "options": [
        "has",
        "have",
        "had"
      ],
      "correct": "has",
      "explanation": "Present Perfect negative → has not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Present Perfect negative → has not.",
        "es-419": "Presente perfecto negativo → no tiene."
      }
    },
    {
      "question": "Choose: \"What ___ you doing at 5 o'clock?\"",
      "options": [
        "were",
        "was",
        "are"
      ],
      "correct": "were",
      "explanation": "Question in Past Continuous → were.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in Past Continuous → were.",
        "es-419": "Pregunta en pasado continuo → eran."
      }
    },
    {
      "question": "Choose: \"She has ___ lived here for five years\"",
      "options": [
        "ever",
        "never",
        "already"
      ],
      "correct": "already",
      "explanation": "already/such a long time → already (or without a time word).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "already/such a long time → already (or without a time word).",
        "es-419": "ya/hace mucho tiempo → ya (o sin palabra de tiempo)."
      }
    },
    {
      "question": "Choose: \"While I ___ dinner, he was watching TV\"",
      "options": [
        "was eating",
        "ate",
        "eat"
      ],
      "correct": "was eating",
      "explanation": "Action continues in the past → was eating.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Action continues in the past → was eating.",
        "es-419": "La acción continúa en el pasado → estaba comiendo."
      }
    },
    {
      "question": "Choose: \"Have they ___ visited Israel?\"",
      "options": [
        "ever",
        "never",
        "already"
      ],
      "correct": "ever",
      "explanation": "Question in Present Perfect → ever.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in Present Perfect → ever.",
        "es-419": "Pregunta en Presente Perfecto → siempre."
      }
    },
    {
      "question": "Choose: \"I ___ just finished my breakfast\"",
      "options": [
        "have",
        "has",
        "had"
      ],
      "correct": "have",
      "explanation": "Present Perfect with just → have just.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Present Perfect with just → have just.",
        "es-419": "Presente perfecto con just → have just."
      }
    },
    {
      "question": "Choose: \"She ___ crying when I saw her\"",
      "options": [
        "was",
        "were",
        "is"
      ],
      "correct": "was",
      "explanation": "Past Continuous → was crying.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → was crying.",
        "es-419": "Pasado Continuo → estaba llorando."
      }
    },
    {
      "question": "Choose: \"We have ___ been to this place before\"",
      "options": [
        "never",
        "ever",
        "already"
      ],
      "correct": "never",
      "explanation": "Never → never.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Never → never.",
        "es-419": "Nunca → nunca."
      }
    },
    {
      "question": "Choose: \"The children ___ playing outside when it started raining\"",
      "options": [
        "was",
        "were",
        "are"
      ],
      "correct": "were",
      "explanation": "Past Continuous → were playing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → were playing.",
        "es-419": "Pasado continuo → estaban reproduciendo."
      }
    },
    {
      "question": "Choose: \"Has she ___ done her homework?\"",
      "options": [
        "already",
        "ever",
        "never"
      ],
      "correct": "already",
      "explanation": "A question with already → Already?",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "A question with already → Already?",
        "es-419": "Una pregunta con ya → ¿Ya?"
      }
    },
    {
      "question": "Choose: \"I ___ sleeping when the alarm went off\"",
      "options": [
        "was",
        "were",
        "am"
      ],
      "correct": "was",
      "explanation": "Past Continuous → was sleeping.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → was sleeping.",
        "es-419": "Pasado Continuo → estaba durmiendo."
      }
    },
    {
      "question": "Choose: \"I ___ my homework when you called\"",
      "options": [
        "was doing",
        "did",
        "do"
      ],
      "correct": "was doing",
      "explanation": "A continuous action in the past → was doing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "A continuous action in the past → was doing.",
        "es-419": "Una acción continua en el pasado → estaba haciendo."
      }
    },
    {
      "question": "Choose: \"She ___ a book when the bell rang\"",
      "options": [
        "read",
        "was reading",
        "reads"
      ],
      "correct": "was reading",
      "explanation": "Action continues in the past → was reading.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Action continues in the past → was reading.",
        "es-419": "La acción continúa en el pasado → estaba leyendo."
      }
    },
    {
      "question": "Choose: \"We ___ already eaten\"",
      "options": [
        "have",
        "has",
        "had"
      ],
      "correct": "have",
      "explanation": "Present Perfect → have + past participle.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Present Perfect → have + past participle.",
        "es-419": "Presente perfecto → tener + participio pasado."
      }
    },
    {
      "question": "Choose: \"Have you ___ been to Paris?\"",
      "options": [
        "ever",
        "never",
        "already"
      ],
      "correct": "ever",
      "explanation": "Question in Present Perfect → ever.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in Present Perfect → ever.",
        "es-419": "Pregunta en Presente Perfecto → siempre."
      }
    },
    {
      "question": "Choose: \"They ___ studying when I arrived\"",
      "options": [
        "were",
        "was",
        "are"
      ],
      "correct": "were",
      "explanation": "Past Continuous → were studying.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → were studying.",
        "es-419": "Pasado Continuo → estaban estudiando."
      }
    },
    {
      "question": "Choose: \"I have ___ seen that movie\"",
      "options": [
        "already",
        "ever",
        "never"
      ],
      "correct": "already",
      "explanation": "already",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "already",
        "es-419": "ya"
      }
    },
    {
      "question": "Choose: \"He ___ not finished yet\"",
      "options": [
        "has",
        "have",
        "had"
      ],
      "correct": "has",
      "explanation": "Present Perfect negative → has not.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Present Perfect negative → has not.",
        "es-419": "Presente perfecto negativo → no tiene."
      }
    },
    {
      "question": "Choose: \"What ___ you doing at 5?\"",
      "options": [
        "were",
        "was",
        "are"
      ],
      "correct": "were",
      "explanation": "Question in Past Continuous → were.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in Past Continuous → were.",
        "es-419": "Pregunta en pasado continuo → eran."
      }
    },
    {
      "question": "Choose: \"She has ___ lived here\"",
      "options": [
        "ever",
        "never",
        "already"
      ],
      "correct": "already",
      "explanation": "already",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "already",
        "es-419": "ya"
      }
    },
    {
      "question": "Choose: \"While I ___ dinner, he watched TV\"",
      "options": [
        "was eating",
        "ate",
        "eat"
      ],
      "correct": "was eating",
      "explanation": "Action continues in the past → was eating.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Action continues in the past → was eating.",
        "es-419": "La acción continúa en el pasado → estaba comiendo."
      }
    },
    {
      "question": "Choose: \"Have they ___ visited?\"",
      "options": [
        "ever",
        "never",
        "already"
      ],
      "correct": "ever",
      "explanation": "Question in Present Perfect → ever.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in Present Perfect → ever.",
        "es-419": "Pregunta en Presente Perfecto → siempre."
      }
    },
    {
      "question": "Choose: \"I ___ just finished\"",
      "options": [
        "have",
        "has",
        "had"
      ],
      "correct": "have",
      "explanation": "Present Perfect with just → have just.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Present Perfect with just → have just.",
        "es-419": "Presente perfecto con just → have just."
      }
    },
    {
      "question": "Choose: \"She ___ crying when I saw her\"",
      "options": [
        "was",
        "were",
        "is"
      ],
      "correct": "was",
      "explanation": "Past Continuous → was crying.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → was crying.",
        "es-419": "Pasado Continuo → estaba llorando."
      }
    },
    {
      "question": "Choose: \"We have ___ been here\"",
      "options": [
        "never",
        "ever",
        "already"
      ],
      "correct": "never",
      "explanation": "Never → never.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Never → never.",
        "es-419": "Nunca → nunca."
      }
    },
    {
      "question": "Choose: \"The children ___ playing when it rained\"",
      "options": [
        "was",
        "were",
        "are"
      ],
      "correct": "were",
      "explanation": "Past Continuous → were playing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → were playing.",
        "es-419": "Pasado continuo → estaban reproduciendo."
      }
    },
    {
      "question": "Choose: \"Has she ___ done it?\"",
      "options": [
        "already",
        "ever",
        "never"
      ],
      "correct": "already",
      "explanation": "A question with already → Already?",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "A question with already → Already?",
        "es-419": "Una pregunta con ya → ¿Ya?"
      }
    },
    {
      "question": "Choose: \"I ___ sleeping when it happened\"",
      "options": [
        "was",
        "were",
        "am"
      ],
      "correct": "was",
      "explanation": "Past Continuous → was sleeping.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → was sleeping.",
        "es-419": "Pasado Continuo → estaba durmiendo."
      }
    },
    {
      "question": "Choose: \"They ___ when I called\"",
      "options": [
        "were eating",
        "ate",
        "eat"
      ],
      "correct": "were eating",
      "explanation": "Past Continuous → were eating.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → were eating.",
        "es-419": "Pasado continuo → estaban comiendo."
      }
    },
    {
      "question": "Choose: \"I have ___ finished\"",
      "options": [
        "already",
        "ever",
        "never"
      ],
      "correct": "already",
      "explanation": "already",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "already",
        "es-419": "ya"
      }
    },
    {
      "question": "Choose: \"She ___ when I saw her\"",
      "options": [
        "was running",
        "ran",
        "run"
      ],
      "correct": "was running",
      "explanation": "Past Continuous → was running.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → was running.",
        "es-419": "Pasado continuo → se estaba ejecutando."
      }
    },
    {
      "question": "Choose: \"We have ___ been there\"",
      "options": [
        "never",
        "ever",
        "already"
      ],
      "correct": "never",
      "explanation": "Never → never.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Never → never.",
        "es-419": "Nunca → nunca."
      }
    },
    {
      "question": "Choose: \"He ___ when I arrived\"",
      "options": [
        "was sleeping",
        "slept",
        "sleep"
      ],
      "correct": "was sleeping",
      "explanation": "Past Continuous → was sleeping.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → was sleeping.",
        "es-419": "Pasado Continuo → estaba durmiendo."
      }
    },
    {
      "question": "Choose: \"I have ___ seen it\"",
      "options": [
        "already",
        "ever",
        "never"
      ],
      "correct": "already",
      "explanation": "already",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "already",
        "es-419": "ya"
      }
    },
    {
      "question": "Choose: \"They ___ when it started\"",
      "options": [
        "were playing",
        "played",
        "play"
      ],
      "correct": "were playing",
      "explanation": "Past Continuous → were playing.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → were playing.",
        "es-419": "Pasado continuo → estaban reproduciendo."
      }
    },
    {
      "question": "Choose: \"Have you ___ done this?\"",
      "options": [
        "ever",
        "never",
        "already"
      ],
      "correct": "ever",
      "explanation": "Question in Present Perfect → ever.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Question in Present Perfect → ever.",
        "es-419": "Pregunta en Presente Perfecto → siempre."
      }
    },
    {
      "question": "Choose: \"I ___ when you called\"",
      "options": [
        "was studying",
        "studied",
        "study"
      ],
      "correct": "was studying",
      "explanation": "Past Continuous → was studying.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → was studying.",
        "es-419": "Pasado Continuo → estaba estudiando."
      }
    },
    {
      "question": "Choose: \"She has ___ finished\"",
      "options": [
        "already",
        "ever",
        "never"
      ],
      "correct": "already",
      "explanation": "already",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "already",
        "es-419": "ya"
      }
    },
    {
      "question": "Choose: \"We ___ when it happened\"",
      "options": [
        "were talking",
        "talked",
        "talk"
      ],
      "correct": "were talking",
      "explanation": "Past Continuous → were talking.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past Continuous → were talking.",
        "es-419": "Pasado Continuo → estábamos hablando."
      }
    },
    {
      "question": "Choose: \"I have ___ been there\"",
      "options": [
        "never",
        "ever",
        "already"
      ],
      "correct": "never",
      "explanation": "Never → never.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "perfect_aspect_error",
        "tense_sequence_error"
      ],
      "patternFamily": "complex_tenses_complex_tenses",
      "diagnosticSkillId": "en_grammar_complex_tenses",
      "conceptTag": "english_complex_tenses",
      "expectedErrorTags": [
        "perfect_aspect_error",
        "tense_sequence_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Never → never.",
        "es-419": "Nunca → nunca."
      }
    }
  ],
  "conditionals": [
    {
      "question": "Choose the correct form: \"If we save water, we ___ the planet\"",
      "options": [
        "help",
        "helped",
        "will help"
      ],
      "correct": "help",
      "explanation": "Zero conditional: If + present, present.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: If + present, present.",
        "es-419": "Condicional cero: Si + presente, presente."
      }
    },
    {
      "question": "Choose the correct option: \"If it rains, we ___ at home\"",
      "options": [
        "stay",
        "stayed",
        "will stay"
      ],
      "correct": "will stay",
      "explanation": "First conditional: If + present, will + base.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional: If + present, will + base.",
        "es-419": "Primer condicional: Si + presente, será + base."
      }
    },
    {
      "question": "Choose the correct sentence: \"If you study, you ___ the test\"",
      "options": [
        "pass",
        "passed",
        "passes"
      ],
      "correct": "pass",
      "explanation": "General fact → Zero conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional.",
        "es-419": "Hecho general → Cero condicional."
      }
    },
    {
      "question": "Choose: \"If you heat water, it ___\"",
      "options": [
        "boils",
        "boiled",
        "will boil"
      ],
      "correct": "boils",
      "explanation": "General fact → Zero conditional (present, present).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional (present, present).",
        "es-419": "Hecho general → Condicional cero (presente, presente)."
      }
    },
    {
      "question": "Choose: \"If I have time, I ___ you\"",
      "options": [
        "help",
        "helped",
        "will help"
      ],
      "correct": "will help",
      "explanation": "Possible condition → First conditional (present, will).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Possible condition → First conditional (present, will).",
        "es-419": "Condición posible → Primer condicional (presente, voluntad)."
      }
    },
    {
      "question": "Choose: \"If it's sunny tomorrow, we ___ to the park\"",
      "options": [
        "go",
        "went",
        "will go"
      ],
      "correct": "will go",
      "explanation": "Future conditional → First conditional (present, will).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future conditional → First conditional (present, will).",
        "es-419": "Condicional futuro → Primer condicional (presente, voluntad)."
      }
    },
    {
      "question": "Choose: \"If you don't study, you ___ pass the test\"",
      "options": [
        "don't",
        "didn't",
        "won't"
      ],
      "correct": "won't",
      "explanation": "First conditional is negative → won't.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional is negative → won't.",
        "es-419": "El primer condicional es negativo → no lo hará."
      }
    },
    {
      "question": "Choose: \"If plants don't get water, they ___\"",
      "options": [
        "die",
        "died",
        "will die"
      ],
      "correct": "die",
      "explanation": "General fact → Zero conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional.",
        "es-419": "Hecho general → Cero condicional."
      }
    },
    {
      "question": "Choose: \"If she comes early, we ___ start on time\"",
      "options": [
        "start",
        "started",
        "will start"
      ],
      "correct": "will start",
      "explanation": "First conditional → will start.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will start.",
        "es-419": "El primer condicional → comenzará."
      }
    },
    {
      "question": "Choose: \"If you touch fire, you ___ burned\"",
      "options": [
        "get",
        "got",
        "will get"
      ],
      "correct": "get",
      "explanation": "General fact → Zero conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional.",
        "es-419": "Hecho general → Cero condicional."
      }
    },
    {
      "question": "Choose: \"If I finish early, I ___ help you\"",
      "options": [
        "help",
        "helped",
        "will help"
      ],
      "correct": "will help",
      "explanation": "First conditional → will help.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will help.",
        "es-419": "El primer condicional → ayudará."
      }
    },
    {
      "question": "Choose: \"If it snows, school ___ closed\"",
      "options": [
        "closes",
        "closed",
        "will close"
      ],
      "correct": "will close",
      "explanation": "Possible condition → First conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Possible condition → First conditional.",
        "es-419": "Posible condición → Primer condicional."
      }
    },
    {
      "question": "Choose: \"If you water plants, they ___\"",
      "options": [
        "grow",
        "grew",
        "will grow"
      ],
      "correct": "grow",
      "explanation": "General fact → Zero conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional.",
        "es-419": "Hecho general → Cero condicional."
      }
    },
    {
      "question": "Choose: \"If we recycle, we ___ the environment\"",
      "options": [
        "protect",
        "protected",
        "will protect"
      ],
      "correct": "protect",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If he doesn't hurry, he ___ late\"",
      "options": [
        "is",
        "was",
        "will be"
      ],
      "correct": "will be",
      "explanation": "First conditional → will be.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will be.",
        "es-419": "El primer condicional → será."
      }
    },
    {
      "question": "Choose: \"If you eat too much, you ___ sick\"",
      "options": [
        "feel",
        "felt",
        "will feel"
      ],
      "correct": "feel",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If she studies hard, she ___ good grades\"",
      "options": [
        "gets",
        "got",
        "will get"
      ],
      "correct": "will get",
      "explanation": "First conditional → will get.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will get.",
        "es-419": "Primer condicional → obtendrá."
      }
    },
    {
      "question": "Choose: \"If the sun shines, it ___ warm\"",
      "options": [
        "is",
        "was",
        "will be"
      ],
      "correct": "is",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If we don't hurry, we ___ miss the bus\"",
      "options": [
        "miss",
        "missed",
        "will miss"
      ],
      "correct": "will miss",
      "explanation": "First conditional → will miss.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will miss.",
        "es-419": "Primer condicional → fallará."
      }
    },
    {
      "question": "Choose: \"If you mix red and blue, you ___ purple\"",
      "options": [
        "get",
        "got",
        "will get"
      ],
      "correct": "get",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If we save water, we ___ the planet\"",
      "options": [
        "help",
        "helped",
        "will help"
      ],
      "correct": "help",
      "explanation": "Zero conditional: If + present, present.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: If + present, present.",
        "es-419": "Condicional cero: Si + presente, presente."
      }
    },
    {
      "question": "Choose: \"If it rains, we ___ at home\"",
      "options": [
        "stay",
        "stayed",
        "will stay"
      ],
      "correct": "will stay",
      "explanation": "First conditional: If + present, will + base.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional: If + present, will + base.",
        "es-419": "Primer condicional: Si + presente, será + base."
      }
    },
    {
      "question": "Choose: \"If you study, you ___ the test\"",
      "options": [
        "pass",
        "passed",
        "passes"
      ],
      "correct": "pass",
      "explanation": "General fact → Zero conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional.",
        "es-419": "Hecho general → Cero condicional."
      }
    },
    {
      "question": "Choose: \"If you heat water, it ___\"",
      "options": [
        "boils",
        "boiled",
        "will boil"
      ],
      "correct": "boils",
      "explanation": "General fact → Zero conditional (present, present).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional (present, present).",
        "es-419": "Hecho general → Condicional cero (presente, presente)."
      }
    },
    {
      "question": "Choose: \"If I have time, I ___ you\"",
      "options": [
        "help",
        "helped",
        "will help"
      ],
      "correct": "will help",
      "explanation": "Possible condition → First conditional (present, will).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Possible condition → First conditional (present, will).",
        "es-419": "Condición posible → Primer condicional (presente, voluntad)."
      }
    },
    {
      "question": "Choose: \"If it's sunny, we ___ to the park\"",
      "options": [
        "go",
        "went",
        "will go"
      ],
      "correct": "will go",
      "explanation": "Future conditional → First conditional (present, will).",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future conditional → First conditional (present, will).",
        "es-419": "Condicional futuro → Primer condicional (presente, voluntad)."
      }
    },
    {
      "question": "Choose: \"If you don't study, you ___ pass\"",
      "options": [
        "don't",
        "didn't",
        "won't"
      ],
      "correct": "won't",
      "explanation": "First conditional is negative → won't.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional is negative → won't.",
        "es-419": "El primer condicional es negativo → no lo hará."
      }
    },
    {
      "question": "Choose: \"If plants don't get water, they ___\"",
      "options": [
        "die",
        "died",
        "will die"
      ],
      "correct": "die",
      "explanation": "General fact → Zero conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional.",
        "es-419": "Hecho general → Cero condicional."
      }
    },
    {
      "question": "Choose: \"If she comes early, we ___ start\"",
      "options": [
        "start",
        "started",
        "will start"
      ],
      "correct": "will start",
      "explanation": "First conditional → will start.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will start.",
        "es-419": "El primer condicional → comenzará."
      }
    },
    {
      "question": "Choose: \"If you touch fire, you ___ burned\"",
      "options": [
        "get",
        "got",
        "will get"
      ],
      "correct": "get",
      "explanation": "General fact → Zero conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional.",
        "es-419": "Hecho general → Cero condicional."
      }
    },
    {
      "question": "Choose: \"If I finish early, I ___ help\"",
      "options": [
        "help",
        "helped",
        "will help"
      ],
      "correct": "will help",
      "explanation": "First conditional → will help.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will help.",
        "es-419": "El primer condicional → ayudará."
      }
    },
    {
      "question": "Choose: \"If it snows, school ___ closed\"",
      "options": [
        "closes",
        "closed",
        "will close"
      ],
      "correct": "will close",
      "explanation": "Possible condition → First conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Possible condition → First conditional.",
        "es-419": "Posible condición → Primer condicional."
      }
    },
    {
      "question": "Choose: \"If you water plants, they ___\"",
      "options": [
        "grow",
        "grew",
        "will grow"
      ],
      "correct": "grow",
      "explanation": "General fact → Zero conditional.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "General fact → Zero conditional.",
        "es-419": "Hecho general → Cero condicional."
      }
    },
    {
      "question": "Choose: \"If we recycle, we ___ the environment\"",
      "options": [
        "protect",
        "protected",
        "will protect"
      ],
      "correct": "protect",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If he doesn't hurry, he ___ late\"",
      "options": [
        "is",
        "was",
        "will be"
      ],
      "correct": "will be",
      "explanation": "First conditional → will be.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will be.",
        "es-419": "El primer condicional → será."
      }
    },
    {
      "question": "Choose: \"If you eat too much, you ___ sick\"",
      "options": [
        "feel",
        "felt",
        "will feel"
      ],
      "correct": "feel",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If she studies hard, she ___ good grades\"",
      "options": [
        "gets",
        "got",
        "will get"
      ],
      "correct": "will get",
      "explanation": "First conditional → will get.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will get.",
        "es-419": "Primer condicional → obtendrá."
      }
    },
    {
      "question": "Choose: \"If the sun shines, it ___ warm\"",
      "options": [
        "is",
        "was",
        "will be"
      ],
      "correct": "is",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If we don't hurry, we ___ miss\"",
      "options": [
        "miss",
        "missed",
        "will miss"
      ],
      "correct": "will miss",
      "explanation": "First conditional → will miss.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will miss.",
        "es-419": "Primer condicional → fallará."
      }
    },
    {
      "question": "Choose: \"If you don't eat, you ___ hungry\"",
      "options": [
        "get",
        "got",
        "will get"
      ],
      "correct": "get",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If I see him, I ___ tell him\"",
      "options": [
        "tell",
        "told",
        "will tell"
      ],
      "correct": "will tell",
      "explanation": "First conditional → will tell.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will tell.",
        "es-419": "El primer condicional → lo dirá."
      }
    },
    {
      "question": "Choose: \"If you practice, you ___ better\"",
      "options": [
        "get",
        "got",
        "will get"
      ],
      "correct": "get",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If it's cold, I ___ a jacket\"",
      "options": [
        "wear",
        "wore",
        "will wear"
      ],
      "correct": "will wear",
      "explanation": "First conditional → will wear.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will wear.",
        "es-419": "Primer condicional → se usará."
      }
    },
    {
      "question": "Choose: \"If you don't sleep, you ___ tired\"",
      "options": [
        "feel",
        "felt",
        "will feel"
      ],
      "correct": "feel",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If she calls, I ___ answer\"",
      "options": [
        "answer",
        "answered",
        "will answer"
      ],
      "correct": "will answer",
      "explanation": "First conditional → will answer.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will answer.",
        "es-419": "Primer condicional → responderá."
      }
    },
    {
      "question": "Choose: \"If you don't study, you ___ fail\"",
      "options": [
        "fail",
        "failed",
        "will fail"
      ],
      "correct": "will fail",
      "explanation": "First conditional → will fail.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will fail.",
        "es-419": "El primer condicional → fallará."
      }
    },
    {
      "question": "Choose: \"If it's hot, we ___ swim\"",
      "options": [
        "swim",
        "swam",
        "will swim"
      ],
      "correct": "will swim",
      "explanation": "First conditional → will swim.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will swim.",
        "es-419": "Primer condicional → nadará."
      }
    },
    {
      "question": "Choose: \"If you don't brush, your teeth ___ hurt\"",
      "options": [
        "hurt",
        "hurted",
        "will hurt"
      ],
      "correct": "hurt",
      "explanation": "Zero conditional: a general fact.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Zero conditional: a general fact.",
        "es-419": "Condicional cero: un hecho general."
      }
    },
    {
      "question": "Choose: \"If I have money, I ___ buy it\"",
      "options": [
        "buy",
        "bought",
        "will buy"
      ],
      "correct": "will buy",
      "explanation": "First conditional → will buy.",
      "difficulty": "basic",
      "cognitiveLevel": "recall",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "conditional_clause_error",
        "if_clause_form_error"
      ],
      "patternFamily": "conditionals_conditionals",
      "diagnosticSkillId": "en_grammar_conditionals",
      "conceptTag": "english_conditionals",
      "expectedErrorTags": [
        "conditional_clause_error",
        "if_clause_form_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "First conditional → will buy.",
        "es-419": "Primer condicional → comprará."
      }
    }
  ],
  "phase29_g2_standard": [
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "phase29_g2_std_01",
      "question": "Choose: \"The birds ___ in the tree\"",
      "options": [
        "sing",
        "sings",
        "singing"
      ],
      "correct": "sing",
      "explanation": "The birds (they) → sing.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g2_std_01",
      "subtype": "phase29_g2_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The birds (they) → sing.",
        "es-419": "Los pájaros (ellos) → cantan."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "phase29_g2_std_02",
      "question": "Choose: \"My parents ___ me a story\"",
      "options": [
        "read",
        "reads",
        "reading"
      ],
      "correct": "read",
      "explanation": "My parents (they) → read.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g2_std_02",
      "subtype": "phase29_g2_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "My parents (they) → read.",
        "es-419": "Mis padres (ellos) → leen."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "phase29_g2_std_03",
      "question": "Choose: \"___ you have a blue ruler?\"",
      "options": [
        "Do",
        "Does",
        "Is"
      ],
      "correct": "Do",
      "explanation": "You → Do in simple present questions.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g2_std_03",
      "subtype": "phase29_g2_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "You → Do in simple present questions.",
        "es-419": "Tú → Haz preguntas simples en presente."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "phase29_g2_std_04",
      "question": "Choose: \"We ___ a thank-you card\"",
      "options": [
        "make",
        "makes",
        "making"
      ],
      "correct": "make",
      "explanation": "We → make (base form).",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g2_std_04",
      "subtype": "phase29_g2_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → make (base form).",
        "es-419": "Nosotros → hacemos (forma base)."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "phase29_g2_std_05",
      "question": "Choose: \"She ___ not play outside today\"",
      "options": [
        "don't",
        "doesn't",
        "isn't"
      ],
      "correct": "doesn't",
      "explanation": "She → doesn't in the negative.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g2_std_05",
      "subtype": "phase29_g2_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → doesn't in the negative.",
        "es-419": "Ella → no es negativa."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "phase29_g2_std_06",
      "question": "Choose: \"There ___ two apples on the table\"",
      "options": [
        "is",
        "are",
        "am"
      ],
      "correct": "are",
      "explanation": "There are + plural.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g2_std_06",
      "subtype": "phase29_g2_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "There are + plural.",
        "es-419": "Hay + plural."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "phase29_g2_std_07",
      "question": "Choose: \"I ___ a picture of a flower\"",
      "options": [
        "draw",
        "draws",
        "drawing"
      ],
      "correct": "draw",
      "explanation": "I → draw.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g2_std_07",
      "subtype": "phase29_g2_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "I → draw.",
        "es-419": "Yo → dibujo."
      }
    },
    {
      "minGrade": 2,
      "maxGrade": 2,
      "patternFamily": "phase29_g2_std_08",
      "question": "Choose: \"He ___ a green pencil case\"",
      "options": [
        "have",
        "has",
        "having"
      ],
      "correct": "has",
      "explanation": "He → has.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g2_std_08",
      "subtype": "phase29_g2_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "He → has.",
        "es-419": "Él → tiene."
      }
    }
  ],
  "phase29_g3_advanced": [
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_01",
      "question": "Choose: \"Last Sunday we ___ our grandparents\"",
      "options": [
        "visit",
        "visited",
        "visiting"
      ],
      "correct": "visited",
      "explanation": "Action in the past → Past simple.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_01",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Action in the past → Past simple.",
        "es-419": "Acción en pasado → Pasado simple."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_02",
      "question": "Choose: \"She ___ her umbrella at school\"",
      "options": [
        "forget",
        "forgot",
        "forgotten"
      ],
      "correct": "forgot",
      "explanation": "past → forgot",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_02",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "past → forgot",
        "es-419": "pasado → olvidado"
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_03",
      "question": "Choose: \"___ they watch the show yesterday?\"",
      "options": [
        "Do",
        "Did",
        "Does"
      ],
      "correct": "Did",
      "explanation": "Yesterday → Did in the past questions.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_03",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Yesterday → Did in the past questions.",
        "es-419": "Ayer → Hice preguntas en el pasado."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_04",
      "question": "Choose: \"Tomorrow we ___ visit the zoo\"",
      "options": [
        "will",
        "do",
        "are"
      ],
      "correct": "will",
      "explanation": "Tomorrow → future with will.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_04",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Tomorrow → future with will.",
        "es-419": "Mañana → futuro con voluntad."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_05",
      "question": "Choose: \"This road is ___ than that road\"",
      "options": [
        "narrow",
        "narrower",
        "narrowest"
      ],
      "correct": "narrower",
      "explanation": "Comparison between two → comparative.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_05",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison between two → comparative.",
        "es-419": "Comparación entre dos → comparativo."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_06",
      "question": "Choose: \"I have never ___ this song before\"",
      "options": [
        "hear",
        "heard",
        "hearing"
      ],
      "correct": "heard",
      "explanation": "Present perfect → have + past participle (heard).",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_06",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Present perfect → have + past participle (heard).",
        "es-419": "Presente perfecto → tener + participio pasado (escuchado)."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_07",
      "question": "Choose: \"We ___ to the museum last Thursday\"",
      "options": [
        "go",
        "went",
        "going"
      ],
      "correct": "went",
      "explanation": "Last Thursday → Past simple.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_07",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Last Thursday → Past simple.",
        "es-419": "Jueves pasado → Pasado simple."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_08",
      "question": "Choose: \"There ___ enough chairs for everyone\"",
      "options": [
        "is",
        "are",
        "be"
      ],
      "correct": "are",
      "explanation": "plural chairs → are.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_08",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "plural chairs → are.",
        "es-419": "plural sillas → son."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_09",
      "question": "Choose: \"She ___ her homework before dinner\"",
      "options": [
        "finish",
        "finished",
        "finishing"
      ],
      "correct": "finished",
      "explanation": "Order of actions in the past → finished.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_09",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Order of actions in the past → finished.",
        "es-419": "Orden de acciones en el pasado → finalizado."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_10",
      "question": "Choose: \"Whose backpack ___ on the floor?\"",
      "options": [
        "is",
        "are",
        "am"
      ],
      "correct": "is",
      "explanation": "Whose backpack → singular.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_10",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Whose backpack → singular.",
        "es-419": "Cuya mochila → singular."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_11",
      "question": "Choose: \"They ___ planning the poster all morning\"",
      "options": [
        "is",
        "are",
        "was"
      ],
      "correct": "are",
      "explanation": "They + Present Continuous.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_11",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "They + Present Continuous.",
        "es-419": "Ellos + Presente Continuo."
      }
    },
    {
      "minGrade": 3,
      "maxGrade": 3,
      "patternFamily": "phase29_g3_adv_12",
      "question": "Choose: \"Nobody ___ the answer yet\"",
      "options": [
        "know",
        "knows",
        "knowing"
      ],
      "correct": "knows",
      "explanation": "Nobody → single subject → knows.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g3_adv_12",
      "subtype": "phase29_g3_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Nobody → single subject → knows.",
        "es-419": "Nadie → un solo sujeto → lo sabe."
      }
    }
  ],
  "phase29_g4_advanced": [
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_01",
      "question": "Choose: \"She ___ already finished her lunch\"",
      "options": [
        "have",
        "has",
        "is"
      ],
      "correct": "has",
      "explanation": "She → has in present perfect.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_01",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "She → has in present perfect.",
        "es-419": "Ella → tiene en presente perfecto."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_02",
      "question": "Choose: \"We ___ this song many times\"",
      "options": [
        "hear",
        "have heard",
        "heard"
      ],
      "correct": "have heard",
      "explanation": "An experience that repeats until now → have heard.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_02",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "An experience that repeats until now → have heard.",
        "es-419": "Una experiencia que se repite hasta ahora → lo he escuchado."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_03",
      "question": "Choose: \"This was the ___ day of the trip\"",
      "options": [
        "happy",
        "happier",
        "happiest"
      ],
      "correct": "happiest",
      "explanation": "the + superlative.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_03",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "the + superlative.",
        "es-419": "el + superlativo."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_04",
      "question": "Choose: \"This puzzle is ___ than that puzzle\"",
      "options": [
        "hard",
        "harder",
        "hardest"
      ],
      "correct": "harder",
      "explanation": "Comparison between two → harder.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_04",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison between two → harder.",
        "es-419": "Comparación entre dos → más difícil."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_05",
      "question": "Choose: \"They ___ living here since January\"",
      "options": [
        "are",
        "were",
        "have been"
      ],
      "correct": "have been",
      "explanation": "since + time point → have been.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_05",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "since + time point → have been.",
        "es-419": "desde + punto de tiempo → han sido."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_06",
      "question": "Choose: \"By noon, we ___ the whole poster\"",
      "options": [
        "finish",
        "finished",
        "had finished"
      ],
      "correct": "had finished",
      "explanation": "An event a moment ago in the past (by noon) → Past perfect.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_06",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "An event a moment ago in the past (by noon) → Past perfect.",
        "es-419": "Un evento hace un momento en el pasado (al mediodía) → Pasado perfecto."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_07",
      "question": "Choose: \"We ___ the results twice before writing the chart\"",
      "options": [
        "check",
        "checked",
        "checking"
      ],
      "correct": "checked",
      "explanation": "A previously completed action.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_07",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "A previously completed action.",
        "es-419": "Una acción previamente completada."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_08",
      "question": "Choose: \"Neither notebook ___ open on the desk\"",
      "options": [
        "was",
        "were",
        "are"
      ],
      "correct": "was",
      "explanation": "Neither + singular → was.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_08",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Neither + singular → was.",
        "es-419": "Ninguno + singular → fue."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_09",
      "question": "Choose: \"By Friday, we ___ the soil samples\"",
      "options": [
        "label",
        "labeled",
        "will label"
      ],
      "correct": "will label",
      "explanation": "Future plan before Friday.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_09",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Future plan before Friday.",
        "es-419": "Plan de futuro antes del viernes."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_10",
      "question": "Choose: \"The graphs ___ clearer after we fixed the scale\"",
      "options": [
        "look",
        "looks",
        "looked"
      ],
      "correct": "looked",
      "explanation": "a past event.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_10",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "a past event.",
        "es-419": "un evento pasado."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_11",
      "question": "Choose: \"Each meter ___ checked before class ended\"",
      "options": [
        "was",
        "were",
        "are"
      ],
      "correct": "was",
      "explanation": "Each meter → single.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_11",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Each meter → single.",
        "es-419": "Cada metro → sencillo."
      }
    },
    {
      "minGrade": 4,
      "maxGrade": 4,
      "patternFamily": "phase29_g4_adv_12",
      "question": "Choose: \"Neither of the answers ___ correct\"",
      "options": [
        "is",
        "are",
        "am"
      ],
      "correct": "is",
      "explanation": "Neither of → single subject → is.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error"
      ],
      "skillId": "phase29_g4_adv_12",
      "subtype": "phase29_g4_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Neither of → single subject → is.",
        "es-419": "Ninguno de → sujeto único → lo es."
      }
    }
  ],
  "phase29_g5_standard": [
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_01",
      "question": "Choose: \"Everyone ___ a quiet voice in the library\"",
      "options": [
        "need",
        "needs",
        "needing"
      ],
      "correct": "needs",
      "explanation": "Everyone is considered singular → needs.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_01",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Everyone is considered singular → needs.",
        "es-419": "Todo el mundo es considerado singular → necesidades."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_02",
      "question": "Choose: \"This question is ___ than the last one\"",
      "options": [
        "easy",
        "easier",
        "easiest"
      ],
      "correct": "easier",
      "explanation": "Comparison between two → easier.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_02",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison between two → easier.",
        "es-419": "Comparación entre dos → más fácil."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_03",
      "question": "Choose: \"You ___ return these books on Friday\"",
      "options": [
        "must",
        "can",
        "may"
      ],
      "correct": "must",
      "explanation": "Obvious obligation → must.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_03",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Obvious obligation → must.",
        "es-419": "Obligación obvia → debe."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_04",
      "question": "Choose: \"She ___ in this choir since March\"",
      "options": [
        "is",
        "was",
        "has been"
      ],
      "correct": "has been",
      "explanation": "since March → has been.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_04",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "since March → has been.",
        "es-419": "desde marzo → ha sido."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_05",
      "question": "Choose: \"Next week we ___ start our science lab\"",
      "options": [
        "will",
        "do",
        "are"
      ],
      "correct": "will",
      "explanation": "future plan → will.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_05",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "future plan → will.",
        "es-419": "plan futuro → voluntad."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_06",
      "question": "Choose: \"Neither answer ___ correct\"",
      "options": [
        "is",
        "are",
        "am"
      ],
      "correct": "is",
      "explanation": "Neither + singular → is.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_06",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Neither + singular → is.",
        "es-419": "Ninguno + singular → lo es."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_07",
      "question": "Choose: \"Each student ___ a worksheet\"",
      "options": [
        "have",
        "has",
        "having"
      ],
      "correct": "has",
      "explanation": "Each student → single → has.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_07",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Each student → single → has.",
        "es-419": "Cada estudiante → soltero → tiene."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_08",
      "question": "Choose: \"This river is the ___ in our area\"",
      "options": [
        "long",
        "longer",
        "longest"
      ],
      "correct": "longest",
      "explanation": "the + superlative.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_08",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "the + superlative.",
        "es-419": "el + superlativo."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_09",
      "question": "Choose: \"The committee ___ a budget before the fair\"",
      "options": [
        "approve",
        "approves",
        "approved"
      ],
      "correct": "approved",
      "explanation": "an event that ended in the past.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_09",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "an event that ended in the past.",
        "es-419": "un evento que terminó en el pasado."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_10",
      "question": "Choose: \"Few students ___ the answer on the first try\"",
      "options": [
        "know",
        "knows",
        "knew"
      ],
      "correct": "knew",
      "explanation": "Past number - knew.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_10",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past number - knew.",
        "es-419": "Número pasado: lo sabía."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_11",
      "question": "Choose: \"Either the map or the charts ___ on the wall\"",
      "options": [
        "need",
        "needs",
        "needing"
      ],
      "correct": "need",
      "explanation": "either...or - proximity to need.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_11",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "either...or - proximity to need.",
        "es-419": "ya sea...o - proximidad a la necesidad."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_std_12",
      "question": "Choose: \"We ___ our draft after peer feedback\"",
      "options": [
        "rewrite",
        "rewrites",
        "rewrote"
      ],
      "correct": "rewrote",
      "explanation": "a past event.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g5_std_12",
      "subtype": "phase29_g5_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "a past event.",
        "es-419": "un evento pasado."
      }
    }
  ],
  "phase29_g5_advanced": [
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_01",
      "question": "Choose: \"If it rains, we ___ the picnic indoors\"",
      "options": [
        "move",
        "moved",
        "will move"
      ],
      "correct": "will move",
      "explanation": "Conditional type 1 - result in the future with will.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_01",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Conditional type 1 - result in the future with will.",
        "es-419": "Condicional tipo 1: resultado en el futuro con voluntad."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_02",
      "question": "Choose: \"She ___ never tried sushi before last month\"",
      "options": [
        "had",
        "has",
        "have"
      ],
      "correct": "had",
      "explanation": "Before a point in time in the past → Past Perfect with had.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_02",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Before a point in time in the past → Past Perfect with had.",
        "es-419": "Antes de un momento en el pasado → Pretérito perfecto con had."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_03",
      "question": "Choose: \"The picture ___ by my cousin yesterday\"",
      "options": [
        "paints",
        "painted",
        "was painted"
      ],
      "correct": "was painted",
      "explanation": "Past imperative → was painted.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_03",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past imperative → was painted.",
        "es-419": "Pasado imperativo → fue pintado."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_04",
      "question": "Choose: \"Although it was cold, the team ___ finishing on time\"",
      "options": [
        "keep",
        "kept",
        "keeping"
      ],
      "correct": "kept",
      "explanation": "Although + past sentence → kept.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_04",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Although + past sentence → kept.",
        "es-419": "Aunque + frase pasada → mantenida."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_05",
      "question": "Choose: \"By next June, we ___ our bridge model\"",
      "options": [
        "finish",
        "will have finished",
        "finished"
      ],
      "correct": "will have finished",
      "explanation": "Absolute future time point → Future Perfect.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_05",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Absolute future time point → Future Perfect.",
        "es-419": "Punto de tiempo futuro absoluto → Futuro perfecto."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_06",
      "question": "Choose: \"The letters ___ before the bell rang\"",
      "options": [
        "send",
        "were sent",
        "sending"
      ],
      "correct": "were sent",
      "explanation": "Past plural of imperative → were sent.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_06",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past plural of imperative → were sent.",
        "es-419": "Pasado plural de imperativo → fueron enviados."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_07",
      "question": "Choose: \"He wishes he ___ more time to read\"",
      "options": [
        "has",
        "had",
        "will have"
      ],
      "correct": "had",
      "explanation": "wish + transfer to an unrealistic wish → had.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_07",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "wish + transfer to an unrealistic wish → had.",
        "es-419": "deseo + transferencia a un deseo poco realista → tenía."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_08",
      "question": "Choose: \"Neither the glue nor the scissors ___ on the shelf\"",
      "options": [
        "was",
        "were",
        "are"
      ],
      "correct": "were",
      "explanation": "Proximity to scissors (plural) → were.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_08",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Proximity to scissors (plural) → were.",
        "es-419": "Proximidad a las tijeras (plural) → fueron."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_09",
      "question": "Choose: \"The coach suggested that we ___ a shorter route\"",
      "options": [
        "take",
        "took",
        "taking"
      ],
      "correct": "take",
      "explanation": "suggested that + base (subjunctive style) → take.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_09",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "suggested that + base (subjunctive style) → take.",
        "es-419": "sugirió que + base (estilo subjuntivo) → tomar."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_10",
      "question": "Choose: \"No sooner had we arrived ___ it started to hail\"",
      "options": [
        "when",
        "than",
        "then"
      ],
      "correct": "than",
      "explanation": "No sooner ... than - permanent connection.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_10",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "No sooner ... than - permanent connection.",
        "es-419": "Tan pronto como... conexión permanente."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_11",
      "question": "Choose: \"Scissors ___ useful for cutting cardboard\"",
      "options": [
        "is",
        "are",
        "was"
      ],
      "correct": "are",
      "explanation": "Scissors are always plural → are.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_11",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Scissors are always plural → are.",
        "es-419": "Las tijeras siempre son plural → son."
      }
    },
    {
      "minGrade": 5,
      "maxGrade": 5,
      "patternFamily": "phase29_g5_adv_12",
      "question": "Choose: \"This is the museum ___ we saw the dinosaur bones\"",
      "options": [
        "which",
        "where",
        "whose"
      ],
      "correct": "where",
      "explanation": "Place → where.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g5_adv_12",
      "subtype": "phase29_g5_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Place → where.",
        "es-419": "Lugar → dónde."
      }
    }
  ],
  "phase29_g6_standard": [
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_01",
      "question": "Choose: \"The band ___ played at two school events this year\"",
      "options": [
        "have",
        "has",
        "is"
      ],
      "correct": "has",
      "explanation": "The band as a single group → has.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_01",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "The band as a single group → has.",
        "es-419": "La banda como un solo grupo → tiene."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_02",
      "question": "Choose: \"This essay is ___ than my first draft\"",
      "options": [
        "clear",
        "clearer",
        "clearest"
      ],
      "correct": "clearer",
      "explanation": "Comparison between two → clearer.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_02",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Comparison between two → clearer.",
        "es-419": "Comparación entre dos → más clara."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_03",
      "question": "Choose: \"By next June, I ___ English for seven years\"",
      "options": [
        "study",
        "will study",
        "will have studied"
      ],
      "correct": "will have studied",
      "explanation": "Duration until future point → future perfect.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_03",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Duration until future point → future perfect.",
        "es-419": "Duración hasta punto futuro → futuro perfecto."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_04",
      "question": "Choose: \"Students ___ follow the lab safety rules\"",
      "options": [
        "must",
        "might",
        "could"
      ],
      "correct": "must",
      "explanation": "Mandatory safety rule → must.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_04",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Mandatory safety rule → must.",
        "es-419": "Regla de seguridad obligatoria → debe."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_05",
      "question": "Choose: \"These results ___ similar to last year's results\"",
      "options": [
        "is",
        "are",
        "was"
      ],
      "correct": "are",
      "explanation": "These results (plural) → are.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_05",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "These results (plural) → are.",
        "es-419": "Estos resultados (plural) → son."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_06",
      "question": "Choose: \"Please ___ your phones on silent during the talk\"",
      "options": [
        "keep",
        "keeps",
        "keeping"
      ],
      "correct": "keep",
      "explanation": "Please + base form → keep.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_06",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Please + base form → keep.",
        "es-419": "Por favor + formulario base → conservar."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_07",
      "question": "Choose: \"This was the ___ debate we have hosted\"",
      "options": [
        "large",
        "larger",
        "largest"
      ],
      "correct": "largest",
      "explanation": "the + superlative.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_07",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "the + superlative.",
        "es-419": "el + superlativo."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_08",
      "question": "Choose: \"We ___ already presented our group project\"",
      "options": [
        "have",
        "has",
        "had"
      ],
      "correct": "have",
      "explanation": "We → have in the present perfect.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_08",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "We → have in the present perfect.",
        "es-419": "Nosotros → tenemos en presente perfecto."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_09",
      "question": "Choose: \"The mentors ___ the prototypes overnight\"",
      "options": [
        "test",
        "tests",
        "tested"
      ],
      "correct": "tested",
      "explanation": "A completed action in the past tense.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_09",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "A completed action in the past tense.",
        "es-419": "Una acción completada en tiempo pasado."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_10",
      "question": "Choose: \"Neither the students nor the teacher ___ pleased yesterday\"",
      "options": [
        "was",
        "were",
        "is"
      ],
      "correct": "was",
      "explanation": "Proximity to the teacher (singular) → was.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_10",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Proximity to the teacher (singular) → was.",
        "es-419": "Proximidad al maestro (singular) → era."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_11",
      "question": "Choose: \"Few districts ___ the flood maps yet\"",
      "options": [
        "publish",
        "publishes",
        "have published"
      ],
      "correct": "have published",
      "explanation": "yet → Present Perfect is appropriate in the narrative journey.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_11",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "yet → Present Perfect is appropriate in the narrative journey.",
        "es-419": "todavía → Present Perfect es apropiado en el viaje narrativo."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_std_12",
      "question": "Choose: \"Both sketches ___ on recycled paper\"",
      "options": [
        "is",
        "are",
        "was"
      ],
      "correct": "are",
      "explanation": "Both sketches are plural → are.",
      "difficulty": "standard",
      "cognitiveLevel": "understanding",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "sentence_structure_error"
      ],
      "skillId": "phase29_g6_std_12",
      "subtype": "phase29_g6_standard",
      "diagnosticSkillId": "en_grammar_phase29_standard",
      "conceptTag": "english_phase29_standard",
      "expectedErrorTags": [
        "grammar_pattern_error",
        "sentence_structure_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Both sketches are plural → are.",
        "es-419": "Ambos bocetos son plurales → son."
      }
    }
  ],
  "phase29_g6_advanced": [
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_01",
      "question": "Choose: \"Had we left earlier, we ___ the storm\"",
      "options": [
        "miss",
        "would miss",
        "would have missed"
      ],
      "correct": "would have missed",
      "explanation": "Inverted conditional in the past → would have missed.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_01",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inverted conditional in the past → would have missed.",
        "es-419": "Condicional invertido en el pasado → se habría perdido."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_02",
      "question": "Choose: \"The speech ___ to every class before Friday\"",
      "options": [
        "deliver",
        "was delivered",
        "delivers"
      ],
      "correct": "was delivered",
      "explanation": "Past passive imperative → was delivered.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_02",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Past passive imperative → was delivered.",
        "es-419": "Pasado imperativo pasivo → fue entregado."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_03",
      "question": "Choose: \"She denied ___ the window open\"",
      "options": [
        "leave",
        "to leave",
        "leaving"
      ],
      "correct": "leaving",
      "explanation": "deny + gerund.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_03",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "deny + gerund.",
        "es-419": "negar + gerundio."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_04",
      "question": "Choose: \"Not only ___ the guide arrive early, but she also mapped two exits\"",
      "options": [
        "did",
        "does",
        "has"
      ],
      "correct": "did",
      "explanation": "Inversion after Not only in the past → did.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_04",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inversion after Not only in the past → did.",
        "es-419": "Inversión después No sólo en el pasado → lo hizo."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_05",
      "question": "Choose: \"He practises the cello as though it ___ second nature\"",
      "options": [
        "is",
        "were",
        "was"
      ],
      "correct": "were",
      "explanation": "as though + were for an unrealistic image.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_05",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "as though + were for an unrealistic image.",
        "es-419": "como si + fuera para una imagen poco realista."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_06",
      "question": "Choose: \"Provided that the data ___ accurate, we publish the chart\"",
      "options": [
        "is",
        "are",
        "were"
      ],
      "correct": "is",
      "explanation": "data as singular accepted standards → is.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_06",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "data as singular accepted standards → is.",
        "es-419": "datos como estándares singulares aceptados → es."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_07",
      "question": "Choose: \"Little ___ they know that the lab had reopened\"",
      "options": [
        "did",
        "do",
        "does"
      ],
      "correct": "did",
      "explanation": "Inversion after Little in the past → did.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_07",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inversion after Little in the past → did.",
        "es-419": "Inversión después de Little en el pasado → lo hizo."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_08",
      "question": "Choose: \"The mural, along with two sketches, ___ outside Room 4\"",
      "options": [
        "hang",
        "hangs",
        "hanging"
      ],
      "correct": "hangs",
      "explanation": "along with does not change the subject units → hangs.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_08",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "along with does not change the subject units → hangs.",
        "es-419": "junto con no cambia las unidades del tema → se cuelga."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_09",
      "question": "Choose: \"She would rather ___ quietly than argue online\"",
      "options": [
        "read",
        "to read",
        "reading"
      ],
      "correct": "read",
      "explanation": "would rather + base seat.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_09",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "would rather + base seat.",
        "es-419": "preferiría + asiento base."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_10",
      "question": "Choose: \"No sooner ___ the curtain risen than the hall applauded\"",
      "options": [
        "had",
        "has",
        "did"
      ],
      "correct": "had",
      "explanation": "No sooner had ... than - Had auxiliary.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_10",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "No sooner had ... than - Had auxiliary.",
        "es-419": "Apenas había... que - Tenía auxiliar."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_11",
      "question": "Choose: \"It is essential that she ___ a helmet during the climb\"",
      "options": [
        "wear",
        "wears",
        "wore"
      ],
      "correct": "wear",
      "explanation": "After essential that, use the base verb (subjunctive style).",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_11",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "After essential that, use the base verb (subjunctive style).",
        "es-419": "Después de lo esencial, utiliza el verbo base (estilo subjuntivo)."
      }
    },
    {
      "minGrade": 6,
      "maxGrade": 6,
      "patternFamily": "phase29_g6_adv_12",
      "question": "Choose: \"Seldom ___ a cleaner ocean seemed so urgent\"",
      "options": [
        "did",
        "does",
        "has"
      ],
      "correct": "did",
      "explanation": "Inversion after Seldom in the past → did.",
      "difficulty": "advanced",
      "cognitiveLevel": "application",
      "expectedErrorTypes": [
        "grammar_error",
        "grammar_pattern_error",
        "careless_error",
        "advanced_grammar_error",
        "register_error"
      ],
      "skillId": "phase29_g6_adv_12",
      "subtype": "phase29_g6_advanced",
      "diagnosticSkillId": "en_grammar_phase29_advanced",
      "conceptTag": "english_phase29_advanced",
      "expectedErrorTags": [
        "advanced_grammar_error",
        "register_error",
        "grammar_pattern_error"
      ],
      "probePower": "medium",
      "explanationByLocale": {
        "en": "Inversion after Seldom in the past → did.",
        "es-419": "Inversión después de Rara vez en el pasado → lo hizo."
      }
    }
  ]
};

for (const [poolKey, rows] of Object.entries(GRAMMAR_POOLS_PHASE_B)) {
  if (!GRAMMAR_POOLS[poolKey]) GRAMMAR_POOLS[poolKey] = [];
  GRAMMAR_POOLS[poolKey].push(...rows);
}

enrichEnglishGrammarPools(GRAMMAR_POOLS);
