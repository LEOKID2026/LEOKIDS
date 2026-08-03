import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";
/**
 * Grade-aware parent recommendation templates for active global subjects (math, geometry, english, science).
 * Slot-specific parent copy is editorially approved; do not change without sign-off.
 */

/** @typedef {{ actionTextHe: string || null; goalTextHe: string || null; intentDescriptionEn: string }} GradeAwareBandCopy */

/** @typedef {{ g1_g2: GradeAwareBandCopy; g3_g4: GradeAwareBandCopy; g5_g6: GradeAwareBandCopy }} GradeAwareTaxonomyTemplate */

/**
 * Math and geometry extended entries: `defaultBands` + optional `bucketOverrides` - M-01 (compare, number_sense, estimation); M-03 (multiplication, factors_multiples, powers); M-10 (division, division_with_remainder, ratio, multiplication); M-07 (word_problems); M-08 (word_problems, sequences, equations, order_of_operations); geometry G-01/G-02/G-03/G-04/G-05/G-06/G-07/G-08 (see bucketOverrides).
 * Legacy flat taxonomies remain a flat {@link GradeAwareTaxonomyTemplate}.
 * @typedef {{
 *   defaultBands: GradeAwareTaxonomyTemplate;
 *   bucketOverrides?: Partial<Record<string, GradeAwareTaxonomyTemplate>>;
 * }} GradeAwareMathM01Template
 */

/**
 * @type {Record<string, Record<string, GradeAwareTaxonomyTemplate || GradeAwareMathM01Template>>}
 */
export const GRADE_AWARE_RECOMMENDATION_TEMPLATES = {
  math: {
    "M-09": {
      g1_g2: {
        actionTextHe:
          "Early subtraction with concrete objects, drawing, or a short number line, then connecting to symbolic notation. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Early subtraction with concrete objects, drawing, or a short number line, then connecting to symbolic notation.",
        intentDescriptionEn:
          "Early subtraction with concrete objects, drawing, or a short number line, then connecting to symbolic notation."
      },
      g3_g4: {
        actionTextHe:
          "Multi-digit vertical subtraction with regrouping, place-value attention, and inverse addition check. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Multi-digit vertical subtraction with regrouping, place-value attention, and inverse addition check.",
        intentDescriptionEn:
          "Multi-digit vertical subtraction with regrouping, place-value attention, and inverse addition check."
      },
      g5_g6: {
        actionTextHe:
          "Upper-grade subtraction with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Upper-grade subtraction with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy.",
        intentDescriptionEn:
          "Upper-grade subtraction with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy."
      }
    },
    "M-02": {
      g1_g2: {
        actionTextHe:
          "Early addition with concrete objects, drawing, or ten-frame support, then connecting to symbolic notation. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Early addition with concrete objects, drawing, or ten-frame support, then connecting to symbolic notation.",
        intentDescriptionEn:
          "Early addition with concrete objects, drawing, or ten-frame support, then connecting to symbolic notation."
      },
      g3_g4: {
        actionTextHe:
          "Multi-digit vertical addition with carrying, place-value attention, and reasonableness check. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Multi-digit vertical addition with carrying, place-value attention, and reasonableness check.",
        intentDescriptionEn:
          "Multi-digit vertical addition with carrying, place-value attention, and reasonableness check."
      },
      g5_g6: {
        actionTextHe:
          "Upper-grade addition with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Upper-grade addition with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy.",
        intentDescriptionEn:
          "Upper-grade addition with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy."
      }
    },
    "M-06": {
      g1_g2: {
        actionTextHe:
          "Early estimation and simple rounding with whole numbers, using number-line distance and nearest ten reasoning. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Early estimation and simple rounding with whole numbers, using number-line distance and nearest ten reasoning.",
        intentDescriptionEn:
          "Early estimation and simple rounding with whole numbers, using number-line distance and nearest ten reasoning."
      },
      g3_g4: {
        actionTextHe:
          "It helps to practice rounding and comparing whole numbers by place value, with estimation before calculating and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on rounding and comparing whole numbers by place value, with estimation before calculating and reasonableness checks.",
        intentDescriptionEn:
          "Rounding and comparing whole numbers by place value, with estimation before calculating and reasonableness checks."
      },
      g5_g6: {
        actionTextHe:
          "Upper-grade rounding, comparison, and estimation with decimals or percentages, including place-value explanation and final reasonableness check. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Upper-grade rounding, comparison, and estimation with decimals or percentages, including place-value explanation and final reasonableness check.",
        intentDescriptionEn:
          "Upper-grade rounding, comparison, and estimation with decimals or percentages, including place-value explanation and final reasonableness check."
      }
    },
    "M-04": {
      g1_g2: {
        actionTextHe: null,
        goalTextHe: null,
        intentDescriptionEn:
          "Do not provide formal fraction comparison recommendations for grades 1–2 unless product evidence explicitly supports it."
      },
      g3_g4: {
        actionTextHe:
          "It helps to practice grade 3–4 fraction comparison through visual representation, numerator/denominator meaning, and same-denominator comparison reasoning. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on grade 3–4 fraction comparison through visual representation, numerator/denominator meaning, and same-denominator comparison reasoning.",
        intentDescriptionEn:
          "Grade 3–4 fraction comparison through visual representation, numerator/denominator meaning, and same-denominator comparison reasoning."
      },
      g5_g6: {
        actionTextHe:
          "It helps to practice grade 5–6 fraction comparison using equivalent fractions, common denominators, benchmark fractions, and explicit reasoning. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on grade 5–6 fraction comparison using equivalent fractions, common denominators, benchmark fractions, and explicit reasoning.",
        intentDescriptionEn:
          "Grade 5–6 fraction comparison using equivalent fractions, common denominators, benchmark fractions, and explicit reasoning."
      }
    },
    "M-05": {
      g1_g2: {
        actionTextHe: null,
        goalTextHe: null,
        intentDescriptionEn:
          "Do not provide formal fraction operation recommendations for grades 1–2 unless product evidence explicitly supports it."
      },
      g3_g4: {
        actionTextHe:
          "It helps to practice grade 3–4 fraction addition/subtraction with same denominators, focusing on denominator meaning, numerator operation, and reasonableness. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on grade 3–4 fraction addition/subtraction with same denominators, focusing on denominator meaning, numerator operation, and reasonableness.",
        intentDescriptionEn:
          "Grade 3–4 fraction addition/subtraction with same denominators, focusing on denominator meaning, numerator operation, and reasonableness."
      },
      g5_g6: {
        actionTextHe:
          "It helps to practice grade 5–6 fraction addition/subtraction with unlike denominators, using common denominators, equivalent fractions, step explanation, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on grade 5–6 fraction addition/subtraction with unlike denominators, using common denominators, equivalent fractions, step explanation, and reasonableness checks.",
        intentDescriptionEn:
          "Grade 5–6 fraction addition/subtraction with unlike denominators, using common denominators, equivalent fractions, step explanation, and reasonableness checks."
      }
    },
    "M-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-03 default: no approved parent copy; use bucketOverrides (multiplication, factors_multiples, powers) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-03 default: no approved parent copy; use bucketOverrides (multiplication, factors_multiples, powers) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-03 default: no approved parent copy; use bucketOverrides (multiplication, factors_multiples, powers) or engine fallback."
        }
      },
      bucketOverrides: {
        multiplication: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal multiplication recommendations for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 multiplication through equal groups, arrays, known facts, and explaining the chosen strategy. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 multiplication through equal groups, arrays, known facts, and explaining the chosen strategy.",
            intentDescriptionEn:
              "Grade 3–4 multiplication through equal groups, arrays, known facts, and explaining the chosen strategy."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 multiplication with decomposition, estimation, multi-step calculation, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 multiplication with decomposition, estimation, multi-step calculation, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 multiplication with decomposition, estimation, multi-step calculation, and reasonableness checks."
          }
        },
        factors_multiples: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "do_not_provide_formal_factors_multiples_recommendations_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 factors and multiples through multiplication patterns, times tables, and verbal explanation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 factors and multiples through multiplication patterns, times tables, and verbal explanation.",
            intentDescriptionEn:
              "Grade 3–4 factors and multiples through multiplication patterns, times tables, and verbal explanation."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 factors and multiples using factorization, common multiples, number properties, and explicit justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 factors and multiples using factorization, common multiples, number properties, and explicit justification.",
            intentDescriptionEn:
              "Grade 5–6 factors and multiples using factorization, common multiples, number properties, and explicit justification."
          }
        },
        powers: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "do_not_provide_powers_exponents_recommendations_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep powers/exponents null for grades 3–4 unless product evidence explicitly supports formal exponent work."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 powers as repeated multiplication, unpacking exponent notation and applying order of operations. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 powers as repeated multiplication, unpacking exponent notation and applying order of operations.",
            intentDescriptionEn:
              "Grade 5–6 powers as repeated multiplication, unpacking exponent notation and applying order of operations."
          }
        }
      }
    },
    "M-10": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-10 default: no approved parent copy; use bucketOverrides (multiplication, division, division_with_remainder, ratio) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-10 default: no approved parent copy; use bucketOverrides (multiplication, division, division_with_remainder, ratio) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-10 default: no approved parent copy; use bucketOverrides (multiplication, division, division_with_remainder, ratio) or engine fallback."
        }
      },
      bucketOverrides: {
        multiplication: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide inverse multiplication/division recommendations for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 inverse relationship between multiplication and division using fact families and inverse checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 inverse relationship between multiplication and division using fact families and inverse checks.",
            intentDescriptionEn:
              "Grade 3–4 inverse relationship between multiplication and division using fact families and inverse checks."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 choosing multiplication vs division in multiplicative relationships, explaining operation choice, and checking with inverse operation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 choosing multiplication vs division in multiplicative relationships, explaining operation choice, and checking with inverse operation.",
            intentDescriptionEn:
              "Grade 5–6 choosing multiplication vs division in multiplicative relationships, explaining operation choice, and checking with inverse operation."
          }
        },
        division: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal division recommendations for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 division as equal sharing or equal groups, with multiplication as an inverse check. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 division as equal sharing or equal groups, with multiplication as an inverse check.",
            intentDescriptionEn:
              "Grade 3–4 division as equal sharing or equal groups, with multiplication as an inverse check."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 division with larger numbers or word problems, estimation, quotient meaning, and multiplication check. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 division with larger numbers or word problems, estimation, quotient meaning, and multiplication check.",
            intentDescriptionEn:
              "Grade 5–6 division with larger numbers or word problems, estimation, quotient meaning, and multiplication check."
          }
        },
        division_with_remainder: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "do_not_provide_division_with_remainder_recommendations_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 division with remainder using equal groups and explaining what is shared and what remains. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 division with remainder using equal groups and explaining what is shared and what remains.",
            intentDescriptionEn:
              "Grade 3–4 division with remainder using equal groups and explaining what is shared and what remains."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 division with remainder in context, interpreting whether to keep, round, or explain the remainder. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 division with remainder in context, interpreting whether to keep, round, or explain the remainder.",
            intentDescriptionEn:
              "Grade 5–6 division with remainder in context, interpreting whether to keep, round, or explain the remainder."
          }
        },
        ratio: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "do_not_provide_ratio_recommendations_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep ratio null for grades 3–4 unless product evidence explicitly supports ratio/proportion work."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 ratio as a multiplicative relationship between two quantities, preserving the relationship and checking consistency. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 ratio as a multiplicative relationship between two quantities, preserving the relationship and checking consistency.",
            intentDescriptionEn:
              "Grade 5–6 ratio as a multiplicative relationship between two quantities, preserving the relationship and checking consistency."
          }
        }
      }
    },
    "M-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-07 default: no approved parent copy; use bucketOverrides (word_problems) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-07 default: no approved parent copy; use bucketOverrides (word_problems) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-07 default: no approved parent copy; use bucketOverrides (word_problems) or engine fallback."
        }
      },
      bucketOverrides: {
        word_problems: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal word-problem unit recommendations for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 word-problem answer labeling: identify what is asked, solve, and write a complete answer with the correct unit. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 word-problem answer labeling: identify what is asked, solve, and write a complete answer with the correct unit.",
            intentDescriptionEn:
              "Grade 3–4 word-problem answer labeling: identify what is asked, solve, and write a complete answer with the correct unit."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 word-problem unit/context alignment: track quantities, units, and whether the final answer matches the question. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 word-problem unit/context alignment: track quantities, units, and whether the final answer matches the question.",
            intentDescriptionEn:
              "Grade 5–6 word-problem unit/context alignment: track quantities, units, and whether the final answer matches the question."
          }
        }
      }
    },
    "M-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-08 default: no approved parent copy; use bucketOverrides (word_problems, sequences, equations, order_of_operations) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-08 default: no approved parent copy; use bucketOverrides (word_problems, sequences, equations, order_of_operations) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-08 default: no approved parent copy; use bucketOverrides (word_problems, sequences, equations, order_of_operations) or engine fallback."
        }
      },
      bucketOverrides: {
        word_problems: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal multi-step word-problem recommendations for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 word-problem planning: identify known information, target question, and operation choice for one- or two-step problems. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 word-problem planning: identify known information, target question, and operation choice for one- or two-step problems.",
            intentDescriptionEn:
              "Grade 3–4 word-problem planning: identify known information, target question, and operation choice for one- or two-step problems."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 multi-step word-problem modeling with tables, diagrams, simple equations, operation choice, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 multi-step word-problem modeling with tables, diagrams, simple equations, operation choice, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 multi-step word-problem modeling with tables, diagrams, simple equations, operation choice, and reasonableness checks."
          }
        },
        sequences: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal sequence recommendations for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 sequences through identifying the change between neighboring terms and explaining the rule. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 sequences through identifying the change between neighboring terms and explaining the rule.",
            intentDescriptionEn:
              "Grade 3–4 sequences through identifying the change between neighboring terms and explaining the rule."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 sequence reasoning: formulate and test a rule, then use it to find missing or later terms. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 sequence reasoning: formulate and test a rule, then use it to find missing or later terms.",
            intentDescriptionEn:
              "Grade 5–6 sequence reasoning: formulate and test a rule, then use it to find missing or later terms."
          }
        },
        equations: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal equation recommendations for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 simple missing-number equations using inverse operations and substitution check. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 simple missing-number equations using inverse operations and substitution check.",
            intentDescriptionEn:
              "Grade 3–4 simple missing-number equations using inverse operations and substitution check."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 simple equation solving by preserving equality, applying operations to both sides, and checking by substitution. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 simple equation solving by preserving equality, applying operations to both sides, and checking by substitution.",
            intentDescriptionEn:
              "Grade 5–6 simple equation solving by preserving equality, applying operations to both sides, and checking by substitution."
          }
        },
        order_of_operations: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "do_not_provide_order_of_operations_recommendations_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 order of operations in short expressions, especially parentheses and mixed operations, with step-by-step reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 order of operations in short expressions, especially parentheses and mixed operations, with step-by-step reasoning.",
            intentDescriptionEn:
              "Grade 3–4 order of operations in short expressions, especially parentheses and mixed operations, with step-by-step reasoning."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 order of operations in more complex expressions, including parentheses and sometimes powers, with written steps and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 order of operations in more complex expressions, including parentheses and sometimes powers, with written steps and justification.",
            intentDescriptionEn:
              "Grade 5–6 order of operations in more complex expressions, including parentheses and sometimes powers, with written steps and justification."
          }
        }
      }
    },
    "M-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-01 default parent copy not approved yet; use bucketOverrides (compare, number_sense, estimation) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-01 default parent copy not approved yet; use bucketOverrides (compare, number_sense, estimation) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-01 default parent copy not approved yet; use bucketOverrides (compare, number_sense, estimation) or engine fallback."
        }
      },
      bucketOverrides: {
        compare: {
          g1_g2: {
            actionTextHe:
              "Early number comparison with concrete supports, tens/ones representation, and simple greater-than/less-than reasoning. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Early number comparison with concrete supports, tens/ones representation, and simple greater-than/less-than reasoning.",
            intentDescriptionEn:
              "Early number comparison with concrete supports, tens/ones representation, and simple greater-than/less-than reasoning."
          },
          g3_g4: {
            actionTextHe:
              "Multi-digit comparison by place value, starting from the highest place and identifying the first differing place. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Multi-digit comparison by place value, starting from the highest place and identifying the first differing place.",
            intentDescriptionEn:
              "Multi-digit comparison by place value, starting from the highest place and identifying the first differing place."
          },
          g5_g6: {
            actionTextHe:
              "Upper-grade comparison of larger numbers or different numeric representations using place value, estimation, and explicit reasoning. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Upper-grade comparison of larger numbers or different numeric representations using place value, estimation, and explicit reasoning.",
            intentDescriptionEn:
              "Upper-grade comparison of larger numbers or different numeric representations using place value, estimation, and explicit reasoning."
          }
        },
        number_sense: {
          g1_g2: {
            actionTextHe:
              "Early number sense through composing and decomposing numbers with objects, drawings, tens, and ones. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Early number sense through composing and decomposing numbers with objects, drawings, tens, and ones.",
            intentDescriptionEn:
              "Early number sense through composing and decomposing numbers with objects, drawings, tens, and ones."
          },
          g3_g4: {
            actionTextHe:
              "Multi-digit number sense through place-value decomposition across ones, tens, hundreds, and thousands. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Multi-digit number sense through place-value decomposition across ones, tens, hundreds, and thousands.",
            intentDescriptionEn:
              "Multi-digit number sense through place-value decomposition across ones, tens, hundreds, and thousands."
          },
          g5_g6: {
            actionTextHe:
              "Upper-grade number sense through translating between standard notation, place-value decomposition, and magnitude reasoning. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Upper-grade number sense through translating between standard notation, place-value decomposition, and magnitude reasoning.",
            intentDescriptionEn:
              "Upper-grade number sense through translating between standard notation, place-value decomposition, and magnitude reasoning."
          }
        },
        estimation: {
          g1_g2: {
            actionTextHe:
              "Early estimation with small quantities and numbers, making an approximate guess before counting or calculating and checking closeness. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Early estimation with small quantities and numbers, making an approximate guess before counting or calculating and checking closeness.",
            intentDescriptionEn:
              "Early estimation with small quantities and numbers, making an approximate guess before counting or calculating and checking closeness."
          },
          g3_g4: {
            actionTextHe:
              "Multi-digit estimation before calculation, using rounded numbers to predict approximate answer size and check reasonableness. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Multi-digit estimation before calculation, using rounded numbers to predict approximate answer size and check reasonableness.",
            intentDescriptionEn:
              "Multi-digit estimation before calculation, using rounded numbers to predict approximate answer size and check reasonableness."
          },
          g5_g6: {
            actionTextHe:
              "Upper-grade estimation across larger numbers and more complex contexts, including simple fractions, decimals, or percentages, with before-and-after reasonableness checks. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Upper-grade estimation across larger numbers and more complex contexts, including simple fractions, decimals, or percentages, with before-and-after reasonableness checks.",
            intentDescriptionEn:
              "Upper-grade estimation across larger numbers and more complex contexts, including simple fractions, decimals, or percentages, with before-and-after reasonableness checks."
          }
        },
        scale: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_scale_magnitude_recommendations_null_for_grades_1_2_until_early_num")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 number magnitude through comparison to familiar quantities (tens, hundreds, thousands). After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 number magnitude through comparison to familiar quantities (tens, hundreds, thousands).",
            intentDescriptionEn:
              "Grade 3–4 number magnitude through comparison to familiar quantities (tens, hundreds, thousands)."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 order-of-magnitude reasoning with large numbers, decimals, or percentages and answer-size checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 order-of-magnitude reasoning with large numbers, decimals, or percentages and answer-size checks.",
            intentDescriptionEn:
              "Grade 5–6 order-of-magnitude reasoning with large numbers, decimals, or percentages and answer-size checks."
          }
        },
        prime_composite: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_prime_composite_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 prime vs composite in a small range using factor-count reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 prime vs composite in a small range using factor-count reasoning.",
            intentDescriptionEn:
              "Grade 3–4 prime vs composite in a small range using factor-count reasoning."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 prime factorization and prime/composite classification with written justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 prime factorization and prime/composite classification with written justification.",
            intentDescriptionEn:
              "Grade 5–6 prime factorization and prime/composite classification with written justification."
          }
        },
        zero_one_properties: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_zero_one_properties_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 special properties of 0 and 1 in basic operations with verbal rules. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 special properties of 0 and 1 in basic operations with verbal rules.",
            intentDescriptionEn:
              "Grade 3–4 special properties of 0 and 1 in basic operations with verbal rules."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 zero/one identity and annihilator properties in richer numeric contexts. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 zero/one identity and annihilator properties in richer numeric contexts.",
            intentDescriptionEn:
              "Grade 5–6 zero/one identity and annihilator properties in richer numeric contexts."
          }
        }
      }
    }
  },
  geometry: {
    "G-02": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-02 default: no approved parent copy; use bucketOverrides (angles, circles) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-02 default: no approved parent copy; use bucketOverrides (angles, circles) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-02 default: no approved parent copy; use bucketOverrides (angles, circles) or engine fallback."
        }
      },
      bucketOverrides: {
        angles: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal angle recommendations null for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 angle recognition and comparison using a clear drawing and right-angle benchmark. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 angle recognition and comparison using a clear drawing and right-angle benchmark.",
            intentDescriptionEn:
              "Grade 3–4 angle recognition and comparison using a clear drawing and right-angle benchmark."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 angle measurement and estimation, including correct protractor use and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 angle measurement and estimation, including correct protractor use and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 angle measurement and estimation, including correct protractor use and reasonableness checks."
          }
        },
        circles: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep circle recommendations null for grades 1–2 unless product evidence explicitly supports circle properties."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 circle parts: center, radius, diameter, and explaining their role in a clear diagram. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 circle parts: center, radius, diameter, and explaining their role in a clear diagram.",
            intentDescriptionEn:
              "Grade 3–4 circle parts: center, radius, diameter, and explaining their role in a clear diagram."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 circle relationships involving radius, diameter, measurements, diagram marking, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 circle relationships involving radius, diameter, measurements, diagram marking, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 circle relationships involving radius, diameter, measurements, diagram marking, and reasonableness checks."
          }
        }
      }
    },
    "G-04": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-04 default: no approved parent copy; use bucketOverrides (transformations, rotation) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-04 default: no approved parent copy; use bucketOverrides (transformations, rotation) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-04 default: no approved parent copy; use bucketOverrides (transformations, rotation) or engine fallback."
        }
      },
      bucketOverrides: {
        transformations: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 concrete transformations: slide, flip, or turn a shape while preserving the shape. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 concrete transformations: slide, flip, or turn a shape while preserving the shape.",
            intentDescriptionEn:
              "Grade 1–2 concrete transformations: slide, flip, or turn a shape while preserving the shape."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 transformations on a grid: translation, reflection, rotation, and describing what changed. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 transformations on a grid: translation, reflection, rotation, and describing what changed.",
            intentDescriptionEn:
              "Grade 3–4 transformations on a grid: translation, reflection, rotation, and describing what changed."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 precise transformation descriptions including direction, distance, reflection line, rotation center, and invariants. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 precise transformation descriptions including direction, distance, reflection line, rotation center, and invariants.",
            intentDescriptionEn:
              "Grade 5–6 precise transformation descriptions including direction, distance, reflection line, rotation center, and invariants."
          }
        },
        rotation: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 concrete rotation using objects or drawings, recognizing the same shape after turning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 concrete rotation using objects or drawings, recognizing the same shape after turning.",
            intentDescriptionEn:
              "Grade 1–2 concrete rotation using objects or drawings, recognizing the same shape after turning."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 rotation around a point, including quarter-turn/half-turn language and direction. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 rotation around a point, including quarter-turn/half-turn language and direction.",
            intentDescriptionEn:
              "Grade 3–4 rotation around a point, including quarter-turn/half-turn language and direction."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 precise rotation using center, direction, angle, and point-image consistency. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 precise rotation using center, direction, angle, and point-image consistency.",
            intentDescriptionEn:
              "Grade 5–6 precise rotation using center, direction, angle, and point-image consistency."
          }
        }
      }
    },
    "G-05": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-05 default: no approved parent copy; use bucketOverrides (solids, volume) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-05 default: no approved parent copy; use bucketOverrides (solids, volume) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-05 default: no approved parent copy; use bucketOverrides (solids, volume) or engine fallback."
        }
      },
      bucketOverrides: {
        solids: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 solid recognition using everyday objects and simple spatial language. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 solid recognition using everyday objects and simple spatial language.",
            intentDescriptionEn:
              "Grade 1–2 solid recognition using everyday objects and simple spatial language."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 solid properties: faces, vertices, edges, face shapes, and justification of identification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 solid properties: faces, vertices, edges, face shapes, and justification of identification.",
            intentDescriptionEn:
              "Grade 3–4 solid properties: faces, vertices, edges, face shapes, and justification of identification."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 solids, nets, measurements, and connecting 2D representations to 3D structure. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 solids, nets, measurements, and connecting 2D representations to 3D structure.",
            intentDescriptionEn:
              "Grade 5–6 solids, nets, measurements, and connecting 2D representations to 3D structure."
          }
        },
        volume: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_formal_volume_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal volume recommendations null for grades 3–4 unless product evidence explicitly supports volume at this level."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 volume of simple solids using length, width, height, units, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 volume of simple solids using length, width, height, units, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 volume of simple solids using length, width, height, units, and reasonableness checks."
          }
        }
      }
    },
    "G-06": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-06 default: no approved parent copy; use bucketOverrides (perimeter) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-06 default: no approved parent copy; use bucketOverrides (perimeter) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-06 default: no approved parent copy; use bucketOverrides (perimeter) or engine fallback."
        }
      },
      bucketOverrides: {
        perimeter: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_formal_perimeter_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 perimeter as sum of side lengths, marking each side and using correct length units. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 perimeter as sum of side lengths, marking each side and using correct length units.",
            intentDescriptionEn:
              "Grade 3–4 perimeter as sum of side lengths, marking each side and using correct length units."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 perimeter of composite or more complex shapes, missing sides, units, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 perimeter of composite or more complex shapes, missing sides, units, and justification.",
            intentDescriptionEn:
              "Grade 5–6 perimeter of composite or more complex shapes, missing sides, units, and justification."
          }
        }
      }
    },
    "G-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-07 default: no approved parent copy; use bucketOverrides (symmetry) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-07 default: no approved parent copy; use bucketOverrides (symmetry) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-07 default: no approved parent copy; use bucketOverrides (symmetry) or engine fallback."
        }
      },
      bucketOverrides: {
        symmetry: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 symmetry through folding, mirror-like matching, and simple visual comparison. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 symmetry through folding, mirror-like matching, and simple visual comparison.",
            intentDescriptionEn:
              "Grade 1–2 symmetry through folding, mirror-like matching, and simple visual comparison."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 symmetry lines and completing shapes using equal distance from the line of symmetry. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 symmetry lines and completing shapes using equal distance from the line of symmetry.",
            intentDescriptionEn:
              "Grade 3–4 symmetry lines and completing shapes using equal distance from the line of symmetry."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 symmetry in more complex shapes, multiple symmetry lines, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 symmetry in more complex shapes, multiple symmetry lines, and justification.",
            intentDescriptionEn:
              "Grade 5–6 symmetry in more complex shapes, multiple symmetry lines, and justification."
          }
        }
      }
    },
    "G-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-01 default: no approved parent copy; use bucketOverrides (shapes_basic, quadrilaterals, parallel_perpendicular, diagonal, tiling) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-01 default: no approved parent copy; use bucketOverrides (shapes_basic, quadrilaterals, parallel_perpendicular, diagonal, tiling) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-01 default: no approved parent copy; use bucketOverrides (shapes_basic, quadrilaterals, parallel_perpendicular, diagonal, tiling) or engine fallback."
        }
      },
      bucketOverrides: {
        shapes_basic: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 basic shape recognition using familiar objects or drawings, with simple properties such as sides and corners. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 basic shape recognition using familiar objects or drawings, with simple properties such as sides and corners.",
            intentDescriptionEn:
              "Grade 1–2 basic shape recognition using familiar objects or drawings, with simple properties such as sides and corners."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 shape classification by clear geometric properties such as sides, vertices, equal sides, and right angles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 shape classification by clear geometric properties such as sides, vertices, equal sides, and right angles.",
            intentDescriptionEn:
              "Grade 3–4 shape classification by clear geometric properties such as sides, vertices, equal sides, and right angles."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 analysis and comparison of shape properties and relationships between shape families. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 analysis and comparison of shape properties and relationships between shape families.",
            intentDescriptionEn:
              "Grade 5–6 analysis and comparison of shape properties and relationships between shape families."
          }
        },
        quadrilaterals: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal quadrilateral property recommendations null for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 quadrilateral identification using properties such as four sides, opposite sides, right angles, and equal sides. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 quadrilateral identification using properties such as four sides, opposite sides, right angles, and equal sides.",
            intentDescriptionEn:
              "Grade 3–4 quadrilateral identification using properties such as four sides, opposite sides, right angles, and equal sides."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 quadrilateral classification and relationships using parallelism, equal sides, angles, diagonals, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 quadrilateral classification and relationships using parallelism, equal sides, angles, diagonals, and justification.",
            intentDescriptionEn:
              "Grade 5–6 quadrilateral classification and relationships using parallelism, equal sides, angles, diagonals, and justification."
          }
        },
        parallel_perpendicular: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_formal_parallel_perpendicular_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 identifying parallel and perpendicular lines using drawings, right angles, intersection, and equal distance. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 identifying parallel and perpendicular lines using drawings, right angles, intersection, and equal distance.",
            intentDescriptionEn:
              "Grade 3–4 identifying parallel and perpendicular lines using drawings, right angles, intersection, and equal distance."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 using parallel and perpendicular relationships inside shapes to justify geometric properties. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 using parallel and perpendicular relationships inside shapes to justify geometric properties.",
            intentDescriptionEn:
              "Grade 5–6 using parallel and perpendicular relationships inside shapes to justify geometric properties."
          }
        },
        diagonal: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_diagonal_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 identifying diagonals as segments between non-adjacent vertices and distinguishing them from sides. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 identifying diagonals as segments between non-adjacent vertices and distinguishing them from sides.",
            intentDescriptionEn:
              "Grade 3–4 identifying diagonals as segments between non-adjacent vertices and distinguishing them from sides."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 using diagonals to reason about quadrilateral properties, triangle decomposition, equality, and bisection. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 using diagonals to reason about quadrilateral properties, triangle decomposition, equality, and bisection.",
            intentDescriptionEn:
              "Grade 5–6 using diagonals to reason about quadrilateral properties, triangle decomposition, equality, and bisection."
          }
        },
        tiling: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 simple tiling with shapes, covering space without gaps or overlaps. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 simple tiling with shapes, covering space without gaps or overlaps.",
            intentDescriptionEn:
              "Grade 1–2 simple tiling with shapes, covering space without gaps or overlaps."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 tiling with polygons, patterns, and explaining why shapes cover a region without gaps. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 tiling with polygons, patterns, and explaining why shapes cover a region without gaps.",
            intentDescriptionEn:
              "Grade 3–4 tiling with polygons, patterns, and explaining why shapes cover a region without gaps."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 analyzing tessellations and geometric patterns using angles, sides, repetition, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 analyzing tessellations and geometric patterns using angles, sides, repetition, and justification.",
            intentDescriptionEn:
              "Grade 5–6 analyzing tessellations and geometric patterns using angles, sides, repetition, and justification."
          }
        }
      }
    },
    "G-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-03 default: no approved parent copy; use bucketOverrides (quadrilaterals, heights, area) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-03 default: no approved parent copy; use bucketOverrides (quadrilaterals, heights, area) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-03 default: no approved parent copy; use bucketOverrides (quadrilaterals, heights, area) or engine fallback."
        }
      },
      bucketOverrides: {
        quadrilaterals: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep advanced quadrilateral area/height recommendations null for grades 1–2."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 quadrilateral reasoning with base, height, and the perpendicular relationship between them. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 quadrilateral reasoning with base, height, and the perpendicular relationship between them.",
            intentDescriptionEn:
              "Grade 3–4 quadrilateral reasoning with base, height, and the perpendicular relationship between them."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 quadrilateral area reasoning using matched base-height pairs and selecting the appropriate formula. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 quadrilateral area reasoning using matched base-height pairs and selecting the appropriate formula.",
            intentDescriptionEn:
              "Grade 5–6 quadrilateral area reasoning using matched base-height pairs and selecting the appropriate formula."
          }
        },
        heights: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_formal_height_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 identifying height as a perpendicular segment to a base, not just any segment in the diagram. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 identifying height as a perpendicular segment to a base, not just any segment in the diagram.",
            intentDescriptionEn:
              "Grade 3–4 identifying height as a perpendicular segment to a base, not just any segment in the diagram."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 using height correctly in area calculations, matching base and height even in non-standard diagrams. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 using height correctly in area calculations, matching base and height even in non-standard diagrams.",
            intentDescriptionEn:
              "Grade 5–6 using height correctly in area calculations, matching base and height even in non-standard diagrams."
          }
        },
        area: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_formal_area_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 area as covering a region, using grid squares or decomposition, and distinguishing area from perimeter. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 area as covering a region, using grid squares or decomposition, and distinguishing area from perimeter.",
            intentDescriptionEn:
              "Grade 3–4 area as covering a region, using grid squares or decomposition, and distinguishing area from perimeter."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 area of composite shapes using decomposition, appropriate formulas, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 area of composite shapes using decomposition, appropriate formulas, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 area of composite shapes using decomposition, appropriate formulas, and reasonableness checks."
          }
        }
      }
    },
    "G-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-08 default: no approved parent copy; use bucketOverrides (area, triangles, pythagoras) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-08 default: no approved parent copy; use bucketOverrides (area, triangles, pythagoras) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-08 default: no approved parent copy; use bucketOverrides (area, triangles, pythagoras) or engine fallback."
        }
      },
      bucketOverrides: {
        area: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_formula_based_area_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formula-based advanced area recommendations null for grades 3–4 unless item evidence explicitly supports it."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 formula-based area reasoning: choose the correct formula, substitute values, and check square units. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 formula-based area reasoning: choose the correct formula, substitute values, and check square units.",
            intentDescriptionEn:
              "Grade 5–6 formula-based area reasoning: choose the correct formula, substitute values, and check square units."
          }
        },
        triangles: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal triangle area/property recommendations null for grades 1–2."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 triangle identification and comparison using clear properties such as sides, vertices, and angles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 triangle identification and comparison using clear properties such as sides, vertices, and angles.",
            intentDescriptionEn:
              "Grade 3–4 triangle identification and comparison using clear properties such as sides, vertices, and angles."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 triangle area using base and height, understanding the divide-by-two relationship to rectangles/parallelograms. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 triangle area using base and height, understanding the divide-by-two relationship to rectangles/parallelograms.",
            intentDescriptionEn:
              "Grade 5–6 triangle area using base and height, understanding the divide-by-two relationship to rectangles/parallelograms."
          }
        },
        pythagoras: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_pythagoras_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_pythagoras_recommendations_null_for_grades_3_4")
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 Pythagoras only in right triangles: identify right angle, hypotenuse, legs, substitute carefully, and check reasonableness. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 Pythagoras only in right triangles: identify right angle, hypotenuse, legs, substitute carefully, and check reasonableness.",
            intentDescriptionEn:
              "Grade 5–6 Pythagoras only in right triangles: identify right angle, hypotenuse, legs, substitute carefully, and check reasonableness."
          }
        }
      }
    }
  },
  english: {
    "E-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-01 default: use bucketOverrides (vocabulary) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-01 default: use bucketOverrides (vocabulary) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-01 default: use bucketOverrides (vocabulary) or engine fallback."
        }
      },
      bucketOverrides: {
        vocabulary: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep early English vocabulary recommendations null for grades 1–2 until early-English copy is approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English vocabulary recognition through word-picture/meaning matching and simple reuse. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 English vocabulary recognition through word-picture/meaning matching and simple reuse.",
            intentDescriptionEn:
              "Grade 3–4 English vocabulary recognition through word-picture/meaning matching and simple reuse."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English vocabulary expansion by topic and text use, with example sentences and recognition in new contexts. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English vocabulary expansion by topic and text use, with example sentences and recognition in new contexts.",
            intentDescriptionEn:
              "Grade 5–6 English vocabulary expansion by topic and text use, with example sentences and recognition in new contexts."
          }
        }
      }
    },
    "E-02": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-02 default: use bucketOverrides (grammar) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-02 default: use bucketOverrides (grammar) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-02 default: use bucketOverrides (grammar) or engine fallback."
        }
      },
      bucketOverrides: {
        grammar: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_formal_english_grammar_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 basic English grammar agreement inside short sentences, matching the subject with the correct verb/form. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 basic English grammar agreement inside short sentences, matching the subject with the correct verb/form.",
            intentDescriptionEn:
              "Grade 3–4 basic English grammar agreement inside short sentences, matching the subject with the correct verb/form."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English grammar with tense, subject, and verb-form agreement in full sentences. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English grammar with tense, subject, and verb-form agreement in full sentences.",
            intentDescriptionEn:
              "Grade 5–6 English grammar with tense, subject, and verb-form agreement in full sentences."
          }
        }
      }
    },
    "E-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-03 default: no approved flat copy; use bucketOverrides (translation) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-03 default: no approved flat copy; use bucketOverrides (translation) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-03 default: no approved flat copy; use bucketOverrides (translation) or engine fallback."
        }
      },
      bucketOverrides: {
        translation: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep line-tracking/layout recommendations null for grades 1–2 until early English reading evidence and copy are approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English reading layout support: track one line at a time and avoid jumping between lines. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 English reading layout support: track one line at a time and avoid jumping between lines.",
            intentDescriptionEn:
              "Grade 3–4 English reading layout support: track one line at a time and avoid jumping between lines."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English reading layout and evidence tracking across lines, paragraphs, or columns. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English reading layout and evidence tracking across lines, paragraphs, or columns.",
            intentDescriptionEn:
              "Grade 5–6 English reading layout and evidence tracking across lines, paragraphs, or columns."
          }
        }
      }
    },
    "E-04": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-04 default: use bucketOverrides (grammar) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-04 default: use bucketOverrides (grammar) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-04 default: use bucketOverrides (grammar) or engine fallback."
        }
      },
      bucketOverrides: {
        grammar: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_sentence_structure_grammar_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English sentence structure: basic word order, subject/action, and meaning completion. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "this_week_focus_on_grade_3_4_english_sentence_structure_basic_word_order"),
            intentDescriptionEn:
              "Grade 3–4 English sentence structure: basic word order, subject/action, and meaning completion."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English sentence structure with word order, connectors, prepositions, and meaning clarity. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English sentence structure with word order, connectors, prepositions, and meaning clarity.",
            intentDescriptionEn:
              "Grade 5–6 English sentence structure with word order, connectors, prepositions, and meaning clarity."
          }
        }
      }
    },
    "E-05": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-05 default: use bucketOverrides (vocabulary) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-05 default: use bucketOverrides (vocabulary) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-05 default: use bucketOverrides (vocabulary) or engine fallback."
        }
      },
      bucketOverrides: {
        vocabulary: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "keep_vocabulary_in_context_recommendations_null_for_grades_1_2")
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 vocabulary in context: choose a word by reading the whole sentence and using context clues. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 vocabulary in context: choose a word by reading the whole sentence and using context clues.",
            intentDescriptionEn:
              "Grade 3–4 vocabulary in context: choose a word by reading the whole sentence and using context clues."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 vocabulary in context, natural word combinations, and choosing meaning based on sentence/text context. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 vocabulary in context, natural word combinations, and choosing meaning based on sentence/text context.",
            intentDescriptionEn:
              "Grade 5–6 vocabulary in context, natural word combinations, and choosing meaning based on sentence/text context."
          }
        }
      }
    },
    "E-06": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-06 default: use bucketOverrides (sentences/sentence) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-06 default: use bucketOverrides (sentences/sentence) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-06 default: use bucketOverrides (sentences/sentence) or engine fallback."
        }
      },
      bucketOverrides: {
        sentences: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep English sentence inference/comprehension recommendations null for grades 1–2 until approved early-English copy exists."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues.",
            intentDescriptionEn:
              "Grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning.",
            intentDescriptionEn:
              "Grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning."
          }
        },
        sentence: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Alias of sentences. Keep null for grades 1–2 until approved early-English copy exists."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice alias of sentences. Grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on alias of sentences. Grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues.",
            intentDescriptionEn:
              "Alias of sentences. Grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice alias of sentences. Grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on alias of sentences. Grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning.",
            intentDescriptionEn:
              "Alias of sentences. Grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning."
          }
        }
      }
    },
    "E-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-07 default: no approved flat copy; use bucketOverrides (writing) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-07 default: no approved flat copy; use bucketOverrides (writing) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-07 default: no approved flat copy; use bucketOverrides (writing) or engine fallback."
        }
      },
      bucketOverrides: {
        writing: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep early English spelling recommendations null for grades 1–2 until age-appropriate spelling copy is approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 recurring English spelling patterns through word groups and repeated endings or letter patterns. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 recurring English spelling patterns through word groups and repeated endings or letter patterns.",
            intentDescriptionEn:
              "Grade 3–4 recurring English spelling patterns through word groups and repeated endings or letter patterns."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 spelling consistency in English writing, identifying repeated error patterns and correcting them systematically. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 spelling consistency in English writing, identifying repeated error patterns and correcting them systematically.",
            intentDescriptionEn:
              "Grade 5–6 spelling consistency in English writing, identifying repeated error patterns and correcting them systematically."
          }
        }
      }
    },
    "E-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-08 default: no approved flat copy; use bucketOverrides (listening) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-08 default: no approved flat copy; use bucketOverrides (listening) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-08 default: no approved flat copy; use bucketOverrides (listening) or engine fallback."
        }
      },
      bucketOverrides: {
        listening: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep listening/minimal-pair recommendations null for grades 1–2 until early-English listening copy is approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English minimal-pair listening through slow reading and repeated sound pairs in different words. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 English minimal-pair listening through slow reading and repeated sound pairs in different words.",
            intentDescriptionEn:
              "Grade 3–4 English minimal-pair listening through slow reading and repeated sound pairs in different words."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 minimal-pair listening in short English sentences with explicit sound-difference explanation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 minimal-pair listening in short English sentences with explicit sound-difference explanation.",
            intentDescriptionEn:
              "Grade 5–6 minimal-pair listening in short English sentences with explicit sound-difference explanation."
          }
        }
      }
    }
  },
  science: {
    "S-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-01 default: no approved parent copy; use bucketOverrides (animals, plants, earth_space, mixed) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-01 default: no approved parent copy; use bucketOverrides (animals, plants, earth_space, mixed) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-01 default: no approved parent copy; use bucketOverrides (animals, plants, earth_space, mixed) or engine fallback."
        }
      },
      bucketOverrides: {
        animals: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep animal classification recommendations null for grades 1–2 until concrete early-science copy is approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 animal classification using observable traits such as body structure, habitat, food, or movement. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 animal classification using observable traits such as body structure, habitat, food, or movement.",
            intentDescriptionEn:
              "Grade 3–4 animal classification using observable traits such as body structure, habitat, food, or movement."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 animal classification across multiple traits, distinguishing traits from processes and justifying with evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 animal classification across multiple traits, distinguishing traits from processes and justifying with evidence.",
            intentDescriptionEn:
              "Grade 5–6 animal classification across multiple traits, distinguishing traits from processes and justifying with evidence."
          }
        },
        plants: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep plant classification recommendations null for grades 1–2 until concrete early-science copy is approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 plant classification using plant parts and their roles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 plant classification using plant parts and their roles.",
            intentDescriptionEn:
              "Grade 3–4 plant classification using plant parts and their roles."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 plant comparison by structure, living conditions, and processes, separating traits from processes. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 plant comparison by structure, living conditions, and processes, separating traits from processes.",
            intentDescriptionEn:
              "Grade 5–6 plant comparison by structure, living conditions, and processes, separating traits from processes."
          }
        },
        earth_space: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep earth/space classification recommendations null for grades 1–2 until concrete early-science copy is approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 earth/space classification by observable categories such as celestial bodies, weather, rocks, water, or environmental changes. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 earth/space classification by observable categories such as celestial bodies, weather, rocks, water, or environmental changes.",
            intentDescriptionEn:
              "Grade 3–4 earth/space classification by observable categories such as celestial bodies, weather, rocks, water, or environmental changes."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 earth/space reasoning by distinguishing objects, phenomena, and processes using task evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 earth/space reasoning by distinguishing objects, phenomena, and processes using task evidence.",
            intentDescriptionEn:
              "Grade 5–6 earth/space reasoning by distinguishing objects, phenomena, and processes using task evidence."
          }
        },
        mixed: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep mixed science classification recommendations null for grades 1–2 until concrete early-science copy is approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 mixed science classification by clear traits and explanation using evidence from the question. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 mixed science classification by clear traits and explanation using evidence from the question.",
            intentDescriptionEn:
              "Grade 3–4 mixed science classification by clear traits and explanation using evidence from the question."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 mixed science concept classification across domains, distinguishing concepts, traits, and processes using evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 mixed science concept classification across domains, distinguishing concepts, traits, and processes using evidence.",
            intentDescriptionEn:
              "Grade 5–6 mixed science concept classification across domains, distinguishing concepts, traits, and processes using evidence."
          }
        }
      }
    },
    "S-02": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-02 default: no approved parent copy; use bucketOverrides (experiments) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-02 default: no approved parent copy; use bucketOverrides (experiments) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-02 default: no approved parent copy; use bucketOverrides (experiments) or engine fallback."
        }
      },
      bucketOverrides: {
        experiments: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal experiment-variable recommendations null for grades 1–2 until concrete early-science copy is approved."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 fair-test reasoning: change one variable, keep other conditions the same, and observe the result. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 fair-test reasoning: change one variable, keep other conditions the same, and observe the result.",
            intentDescriptionEn:
              "Grade 3–4 fair-test reasoning: change one variable, keep other conditions the same, and observe the result."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 experiment planning with isolated variables, controlled conditions, measurement, and causal explanation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 experiment planning with isolated variables, controlled conditions, measurement, and causal explanation.",
            intentDescriptionEn:
              "Grade 5–6 experiment planning with isolated variables, controlled conditions, measurement, and causal explanation."
          }
        }
      }
    },
    "S-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-03 default: use bucketOverrides (body) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-03 default: use bucketOverrides (body) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-03 default: use bucketOverrides (body) or engine fallback."
        }
      },
      bucketOverrides: {
        body: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep body-system diagram recommendations null for grades 1–2 unless product evidence explicitly supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 reading simple body/system diagrams: identify parts, roles, and direction of flow without medical conclusions. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 reading simple body/system diagrams: identify parts, roles, and direction of flow without medical conclusions.",
            intentDescriptionEn:
              "Grade 3–4 reading simple body/system diagrams: identify parts, roles, and direction of flow without medical conclusions."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 body systems: connect structure to function and explain relationships between parts in a diagram. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 body systems: connect structure to function and explain relationships between parts in a diagram.",
            intentDescriptionEn:
              "Grade 5–6 body systems: connect structure to function and explain relationships between parts in a diagram."
          }
        }
      }
    },
    "S-04": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-04 default: use bucketOverrides (materials) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-04 default: use bucketOverrides (materials) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-04 default: use bucketOverrides (materials) or engine fallback."
        }
      },
      bucketOverrides: {
        materials: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal matter/conservation recommendations null for grades 1–2 unless concrete product evidence supports it."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 states of matter: track what changes and what remains using diagrams and observations. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 states of matter: track what changes and what remains using diagrams and observations.",
            intentDescriptionEn:
              "Grade 3–4 states of matter: track what changes and what remains using diagrams and observations."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 matter changes and conservation reasoning using particle diagrams or before/after tables. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 matter changes and conservation reasoning using particle diagrams or before/after tables.",
            intentDescriptionEn:
              "Grade 5–6 matter changes and conservation reasoning using particle diagrams or before/after tables."
          }
        }
      }
    },
    "S-05": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-05 default: use bucketOverrides (materials) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-05 default: use bucketOverrides (materials) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-05 default: use bucketOverrides (materials) or engine fallback."
        }
      },
      bucketOverrides: {
        materials: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 unit conversion with reference table and unit choice justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 unit conversion with reference table and unit choice justification.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_3_4_unit_conversion_with_reference_table_and_unit_choice_justifica")
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 multi-step unit conversion with reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 multi-step unit conversion with reasonableness checks.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_5_6_multi_step_unit_conversion_with_reasonableness_checks")
          }
        }
      }
    },
    "S-06": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-06 default: use bucketOverrides (earth_space, experiments) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-06 default: use bucketOverrides (earth_space, experiments) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-06 default: use bucketOverrides (earth_space, experiments) or engine fallback."
        }
      },
      bucketOverrides: {
        earth_space: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 graph reading: axes, point location, value extraction. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 graph reading: axes, point location, value extraction.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_3_4_graph_reading_axes_point_location_value_extraction")
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 graph comparison and axis-based reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 graph comparison and axis-based reasoning.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_5_6_graph_comparison_and_axis_based_reasoning")
          }
        },
        experiments: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 experiment data table/graph reading. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 experiment data table/graph reading.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_3_4_experiment_data_table_graph_reading")
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 experiment graph analysis and variable-result link. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 experiment graph analysis and variable-result link.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_5_6_experiment_graph_analysis_and_variable_result_link")
          }
        }
      }
    },
    "S-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-08 default: use bucketOverrides (animals, experiments) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-08 default: use bucketOverrides (animals, experiments) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-08 default: use bucketOverrides (animals, experiments) or engine fallback."
        }
      },
      bucketOverrides: {
        animals: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 evidence/source grounding for animal-science claims. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 evidence/source grounding for animal-science claims.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_3_4_evidence_source_grounding_for_animal_science_claims")
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 claim-evidence distinction in science texts. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 claim-evidence distinction in science texts.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_5_6_claim_evidence_distinction_in_science_texts")
          }
        },
        experiments: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 experiment evidence sourcing from observation/logs. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 experiment evidence sourcing from observation/logs.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_3_4_experiment_evidence_sourcing_from_observation_logs")
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 data-backed conclusions vs speculation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 data-backed conclusions vs speculation.",
            intentDescriptionEn: reportPackCopy("utils__parent-report-language__grade-aware-recommendation-templates", "grade_5_6_data_backed_conclusions_vs_speculation")
          }
        }
      }
    },
    "S-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-07 default: use bucketOverrides (environment) or engine fallback."
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-07 default: use bucketOverrides (environment) or engine fallback."
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-07 default: use bucketOverrides (environment) or engine fallback."
        }
      },
      bucketOverrides: {
        environment: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep ecosystem/food-web recommendations null for grades 1–2 unless product evidence explicitly supports simple food-chain work."
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 simple food-chain reasoning: who eats whom, what arrows show, and using diagram evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 simple food-chain reasoning: who eats whom, what arrows show, and using diagram evidence.",
            intentDescriptionEn:
              "Grade 3–4 simple food-chain reasoning: who eats whom, what arrows show, and using diagram evidence."
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 ecosystem reasoning with food webs, producers/consumers, energy flow, and system effects. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 ecosystem reasoning with food webs, producers/consumers, energy flow, and system effects.",
            intentDescriptionEn:
              "Grade 5–6 ecosystem reasoning with food webs, producers/consumers, energy flow, and system effects."
          }
        }
      }
    }
  },
};
