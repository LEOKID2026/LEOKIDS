/**
 * Grade-aware parent recommendation templates (Phase 1–4 math/geometry/Hebrew/English; Phase 5-B1/B2 Science; Phase 5-C1/C3 moledet-geography MG-01–MG-08 bucketOverrides).
 * Slot-specific parent copy is editorially approved; do not change without sign-off.
 */

/** @typedef {{ actionTextHe: string | null; goalTextHe: string | null; intentDescriptionEn: string }} GradeAwareBandCopy */

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
 * @type {Record<string, Record<string, GradeAwareTaxonomyTemplate | GradeAwareMathM01Template>>}
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
          "Early subtraction with concrete objects, drawing, or a short number line, then connecting to symbolic notation.",
      },
      g3_g4: {
        actionTextHe:
          "Multi-digit vertical subtraction with regrouping, place-value attention, and inverse addition check. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Multi-digit vertical subtraction with regrouping, place-value attention, and inverse addition check.",
        intentDescriptionEn:
          "Multi-digit vertical subtraction with regrouping, place-value attention, and inverse addition check.",
      },
      g5_g6: {
        actionTextHe:
          "Upper-grade subtraction with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Upper-grade subtraction with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy.",
        intentDescriptionEn:
          "Upper-grade subtraction with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy.",
      },
    },
    "M-02": {
      g1_g2: {
        actionTextHe:
          "Early addition with concrete objects, drawing, or ten-frame support, then connecting to symbolic notation. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Early addition with concrete objects, drawing, or ten-frame support, then connecting to symbolic notation.",
        intentDescriptionEn:
          "Early addition with concrete objects, drawing, or ten-frame support, then connecting to symbolic notation.",
      },
      g3_g4: {
        actionTextHe:
          "Multi-digit vertical addition with carrying, place-value attention, and reasonableness check. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Multi-digit vertical addition with carrying, place-value attention, and reasonableness check.",
        intentDescriptionEn:
          "Multi-digit vertical addition with carrying, place-value attention, and reasonableness check.",
      },
      g5_g6: {
        actionTextHe:
          "Upper-grade addition with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Upper-grade addition with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy.",
        intentDescriptionEn:
          "Upper-grade addition with larger numbers or multi-step contexts, estimation before solving, reasonableness check, and explanation of strategy.",
      },
    },
    "M-06": {
      g1_g2: {
        actionTextHe:
          "Early estimation and simple rounding with whole numbers, using number-line distance and nearest ten reasoning. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Early estimation and simple rounding with whole numbers, using number-line distance and nearest ten reasoning.",
        intentDescriptionEn:
          "Early estimation and simple rounding with whole numbers, using number-line distance and nearest ten reasoning.",
      },
      g3_g4: {
        actionTextHe:
          "It helps to practice rounding and comparing whole numbers by place value, with estimation before calculating and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on rounding and comparing whole numbers by place value, with estimation before calculating and reasonableness checks.",
        intentDescriptionEn:
          "Rounding and comparing whole numbers by place value, with estimation before calculating and reasonableness checks.",
      },
      g5_g6: {
        actionTextHe:
          "Upper-grade rounding, comparison, and estimation with decimals or percentages, including place-value explanation and final reasonableness check. Ask your child to explain the steps, not only the answer.",
        goalTextHe:
          "This week, focus on: Upper-grade rounding, comparison, and estimation with decimals or percentages, including place-value explanation and final reasonableness check.",
        intentDescriptionEn:
          "Upper-grade rounding, comparison, and estimation with decimals or percentages, including place-value explanation and final reasonableness check.",
      },
    },
    "M-04": {
      g1_g2: {
        actionTextHe: null,
        goalTextHe: null,
        intentDescriptionEn:
          "Do not provide formal fraction comparison recommendations for grades 1–2 unless product evidence explicitly supports it.",
      },
      g3_g4: {
        actionTextHe:
          "It helps to practice grade 3–4 fraction comparison through visual representation, numerator/denominator meaning, and same-denominator comparison reasoning. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on grade 3–4 fraction comparison through visual representation, numerator/denominator meaning, and same-denominator comparison reasoning.",
        intentDescriptionEn:
          "Grade 3–4 fraction comparison through visual representation, numerator/denominator meaning, and same-denominator comparison reasoning.",
      },
      g5_g6: {
        actionTextHe:
          "It helps to practice grade 5–6 fraction comparison using equivalent fractions, common denominators, benchmark fractions, and explicit reasoning. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on grade 5–6 fraction comparison using equivalent fractions, common denominators, benchmark fractions, and explicit reasoning.",
        intentDescriptionEn:
          "Grade 5–6 fraction comparison using equivalent fractions, common denominators, benchmark fractions, and explicit reasoning.",
      },
    },
    "M-05": {
      g1_g2: {
        actionTextHe: null,
        goalTextHe: null,
        intentDescriptionEn:
          "Do not provide formal fraction operation recommendations for grades 1–2 unless product evidence explicitly supports it.",
      },
      g3_g4: {
        actionTextHe:
          "It helps to practice grade 3–4 fraction addition/subtraction with same denominators, focusing on denominator meaning, numerator operation, and reasonableness. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on grade 3–4 fraction addition/subtraction with same denominators, focusing on denominator meaning, numerator operation, and reasonableness.",
        intentDescriptionEn:
          "Grade 3–4 fraction addition/subtraction with same denominators, focusing on denominator meaning, numerator operation, and reasonableness.",
      },
      g5_g6: {
        actionTextHe:
          "It helps to practice grade 5–6 fraction addition/subtraction with unlike denominators, using common denominators, equivalent fractions, step explanation, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
        goalTextHe:
          "This week, focus on grade 5–6 fraction addition/subtraction with unlike denominators, using common denominators, equivalent fractions, step explanation, and reasonableness checks.",
        intentDescriptionEn:
          "Grade 5–6 fraction addition/subtraction with unlike denominators, using common denominators, equivalent fractions, step explanation, and reasonableness checks.",
      },
    },
    "M-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-03 default: no approved parent copy; use bucketOverrides (multiplication, factors_multiples, powers) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-03 default: no approved parent copy; use bucketOverrides (multiplication, factors_multiples, powers) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-03 default: no approved parent copy; use bucketOverrides (multiplication, factors_multiples, powers) or engine fallback.",
        },
      },
      bucketOverrides: {
        multiplication: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal multiplication recommendations for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 multiplication through equal groups, arrays, known facts, and explaining the chosen strategy. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 multiplication through equal groups, arrays, known facts, and explaining the chosen strategy.",
            intentDescriptionEn:
              "Grade 3–4 multiplication through equal groups, arrays, known facts, and explaining the chosen strategy.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 multiplication with decomposition, estimation, multi-step calculation, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 multiplication with decomposition, estimation, multi-step calculation, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 multiplication with decomposition, estimation, multi-step calculation, and reasonableness checks.",
          },
        },
        factors_multiples: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Do not provide formal factors/multiples recommendations for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 factors and multiples through multiplication patterns, times tables, and verbal explanation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 factors and multiples through multiplication patterns, times tables, and verbal explanation.",
            intentDescriptionEn:
              "Grade 3–4 factors and multiples through multiplication patterns, times tables, and verbal explanation.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 factors and multiples using factorization, common multiples, number properties, and explicit justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 factors and multiples using factorization, common multiples, number properties, and explicit justification.",
            intentDescriptionEn:
              "Grade 5–6 factors and multiples using factorization, common multiples, number properties, and explicit justification.",
          },
        },
        powers: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Do not provide powers/exponents recommendations for grades 1–2.",
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep powers/exponents null for grades 3–4 unless product evidence explicitly supports formal exponent work.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 powers as repeated multiplication, unpacking exponent notation and applying order of operations. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 powers as repeated multiplication, unpacking exponent notation and applying order of operations.",
            intentDescriptionEn:
              "Grade 5–6 powers as repeated multiplication, unpacking exponent notation and applying order of operations.",
          },
        },
      },
    },
    "M-10": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-10 default: no approved parent copy; use bucketOverrides (multiplication, division, division_with_remainder, ratio) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-10 default: no approved parent copy; use bucketOverrides (multiplication, division, division_with_remainder, ratio) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-10 default: no approved parent copy; use bucketOverrides (multiplication, division, division_with_remainder, ratio) or engine fallback.",
        },
      },
      bucketOverrides: {
        multiplication: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide inverse multiplication/division recommendations for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 inverse relationship between multiplication and division using fact families and inverse checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 inverse relationship between multiplication and division using fact families and inverse checks.",
            intentDescriptionEn:
              "Grade 3–4 inverse relationship between multiplication and division using fact families and inverse checks.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 choosing multiplication vs division in multiplicative relationships, explaining operation choice, and checking with inverse operation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 choosing multiplication vs division in multiplicative relationships, explaining operation choice, and checking with inverse operation.",
            intentDescriptionEn:
              "Grade 5–6 choosing multiplication vs division in multiplicative relationships, explaining operation choice, and checking with inverse operation.",
          },
        },
        division: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal division recommendations for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 division as equal sharing or equal groups, with multiplication as an inverse check. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 division as equal sharing or equal groups, with multiplication as an inverse check.",
            intentDescriptionEn:
              "Grade 3–4 division as equal sharing or equal groups, with multiplication as an inverse check.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 division with larger numbers or word problems, estimation, quotient meaning, and multiplication check. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 division with larger numbers or word problems, estimation, quotient meaning, and multiplication check.",
            intentDescriptionEn:
              "Grade 5–6 division with larger numbers or word problems, estimation, quotient meaning, and multiplication check.",
          },
        },
        division_with_remainder: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Do not provide division-with-remainder recommendations for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 division with remainder using equal groups and explaining what is shared and what remains. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 division with remainder using equal groups and explaining what is shared and what remains.",
            intentDescriptionEn:
              "Grade 3–4 division with remainder using equal groups and explaining what is shared and what remains.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 division with remainder in context, interpreting whether to keep, round, or explain the remainder. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 division with remainder in context, interpreting whether to keep, round, or explain the remainder.",
            intentDescriptionEn:
              "Grade 5–6 division with remainder in context, interpreting whether to keep, round, or explain the remainder.",
          },
        },
        ratio: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Do not provide ratio recommendations for grades 1–2.",
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep ratio null for grades 3–4 unless product evidence explicitly supports ratio/proportion work.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 ratio as a multiplicative relationship between two quantities, preserving the relationship and checking consistency. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 ratio as a multiplicative relationship between two quantities, preserving the relationship and checking consistency.",
            intentDescriptionEn:
              "Grade 5–6 ratio as a multiplicative relationship between two quantities, preserving the relationship and checking consistency.",
          },
        },
      },
    },
    "M-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-07 default: no approved parent copy; use bucketOverrides (word_problems) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-07 default: no approved parent copy; use bucketOverrides (word_problems) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-07 default: no approved parent copy; use bucketOverrides (word_problems) or engine fallback.",
        },
      },
      bucketOverrides: {
        word_problems: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal word-problem unit recommendations for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 word-problem answer labeling: identify what is asked, solve, and write a complete answer with the correct unit. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 word-problem answer labeling: identify what is asked, solve, and write a complete answer with the correct unit.",
            intentDescriptionEn:
              "Grade 3–4 word-problem answer labeling: identify what is asked, solve, and write a complete answer with the correct unit.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 word-problem unit/context alignment: track quantities, units, and whether the final answer matches the question. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 word-problem unit/context alignment: track quantities, units, and whether the final answer matches the question.",
            intentDescriptionEn:
              "Grade 5–6 word-problem unit/context alignment: track quantities, units, and whether the final answer matches the question.",
          },
        },
      },
    },
    "M-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-08 default: no approved parent copy; use bucketOverrides (word_problems, sequences, equations, order_of_operations) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-08 default: no approved parent copy; use bucketOverrides (word_problems, sequences, equations, order_of_operations) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-08 default: no approved parent copy; use bucketOverrides (word_problems, sequences, equations, order_of_operations) or engine fallback.",
        },
      },
      bucketOverrides: {
        word_problems: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal multi-step word-problem recommendations for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 word-problem planning: identify known information, target question, and operation choice for one- or two-step problems. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 word-problem planning: identify known information, target question, and operation choice for one- or two-step problems.",
            intentDescriptionEn:
              "Grade 3–4 word-problem planning: identify known information, target question, and operation choice for one- or two-step problems.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 multi-step word-problem modeling with tables, diagrams, simple equations, operation choice, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 multi-step word-problem modeling with tables, diagrams, simple equations, operation choice, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 multi-step word-problem modeling with tables, diagrams, simple equations, operation choice, and reasonableness checks.",
          },
        },
        sequences: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal sequence recommendations for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 sequences through identifying the change between neighboring terms and explaining the rule. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 sequences through identifying the change between neighboring terms and explaining the rule.",
            intentDescriptionEn:
              "Grade 3–4 sequences through identifying the change between neighboring terms and explaining the rule.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 sequence reasoning: formulate and test a rule, then use it to find missing or later terms. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 sequence reasoning: formulate and test a rule, then use it to find missing or later terms.",
            intentDescriptionEn:
              "Grade 5–6 sequence reasoning: formulate and test a rule, then use it to find missing or later terms.",
          },
        },
        equations: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Do not provide formal equation recommendations for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 simple missing-number equations using inverse operations and substitution check. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 simple missing-number equations using inverse operations and substitution check.",
            intentDescriptionEn:
              "Grade 3–4 simple missing-number equations using inverse operations and substitution check.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 simple equation solving by preserving equality, applying operations to both sides, and checking by substitution. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 simple equation solving by preserving equality, applying operations to both sides, and checking by substitution.",
            intentDescriptionEn:
              "Grade 5–6 simple equation solving by preserving equality, applying operations to both sides, and checking by substitution.",
          },
        },
        order_of_operations: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Do not provide order-of-operations recommendations for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 order of operations in short expressions, especially parentheses and mixed operations, with step-by-step reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 order of operations in short expressions, especially parentheses and mixed operations, with step-by-step reasoning.",
            intentDescriptionEn:
              "Grade 3–4 order of operations in short expressions, especially parentheses and mixed operations, with step-by-step reasoning.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 order of operations in more complex expressions, including parentheses and sometimes powers, with written steps and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 order of operations in more complex expressions, including parentheses and sometimes powers, with written steps and justification.",
            intentDescriptionEn:
              "Grade 5–6 order of operations in more complex expressions, including parentheses and sometimes powers, with written steps and justification.",
          },
        },
      },
    },
    "M-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-01 default parent copy not approved yet; use bucketOverrides (compare, number_sense, estimation) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-01 default parent copy not approved yet; use bucketOverrides (compare, number_sense, estimation) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "M-01 default parent copy not approved yet; use bucketOverrides (compare, number_sense, estimation) or engine fallback.",
        },
      },
      bucketOverrides: {
        compare: {
          g1_g2: {
            actionTextHe:
              "Early number comparison with concrete supports, tens/ones representation, and simple greater-than/less-than reasoning. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Early number comparison with concrete supports, tens/ones representation, and simple greater-than/less-than reasoning.",
            intentDescriptionEn:
              "Early number comparison with concrete supports, tens/ones representation, and simple greater-than/less-than reasoning.",
          },
          g3_g4: {
            actionTextHe:
              "Multi-digit comparison by place value, starting from the highest place and identifying the first differing place. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Multi-digit comparison by place value, starting from the highest place and identifying the first differing place.",
            intentDescriptionEn:
              "Multi-digit comparison by place value, starting from the highest place and identifying the first differing place.",
          },
          g5_g6: {
            actionTextHe:
              "Upper-grade comparison of larger numbers or different numeric representations using place value, estimation, and explicit reasoning. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Upper-grade comparison of larger numbers or different numeric representations using place value, estimation, and explicit reasoning.",
            intentDescriptionEn:
              "Upper-grade comparison of larger numbers or different numeric representations using place value, estimation, and explicit reasoning.",
          },
        },
        number_sense: {
          g1_g2: {
            actionTextHe:
              "Early number sense through composing and decomposing numbers with objects, drawings, tens, and ones. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Early number sense through composing and decomposing numbers with objects, drawings, tens, and ones.",
            intentDescriptionEn:
              "Early number sense through composing and decomposing numbers with objects, drawings, tens, and ones.",
          },
          g3_g4: {
            actionTextHe:
              "Multi-digit number sense through place-value decomposition across ones, tens, hundreds, and thousands. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Multi-digit number sense through place-value decomposition across ones, tens, hundreds, and thousands.",
            intentDescriptionEn:
              "Multi-digit number sense through place-value decomposition across ones, tens, hundreds, and thousands.",
          },
          g5_g6: {
            actionTextHe:
              "Upper-grade number sense through translating between standard notation, place-value decomposition, and magnitude reasoning. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Upper-grade number sense through translating between standard notation, place-value decomposition, and magnitude reasoning.",
            intentDescriptionEn:
              "Upper-grade number sense through translating between standard notation, place-value decomposition, and magnitude reasoning.",
          },
        },
        estimation: {
          g1_g2: {
            actionTextHe:
              "Early estimation with small quantities and numbers, making an approximate guess before counting or calculating and checking closeness. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Early estimation with small quantities and numbers, making an approximate guess before counting or calculating and checking closeness.",
            intentDescriptionEn:
              "Early estimation with small quantities and numbers, making an approximate guess before counting or calculating and checking closeness.",
          },
          g3_g4: {
            actionTextHe:
              "Multi-digit estimation before calculation, using rounded numbers to predict approximate answer size and check reasonableness. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Multi-digit estimation before calculation, using rounded numbers to predict approximate answer size and check reasonableness.",
            intentDescriptionEn:
              "Multi-digit estimation before calculation, using rounded numbers to predict approximate answer size and check reasonableness.",
          },
          g5_g6: {
            actionTextHe:
              "Upper-grade estimation across larger numbers and more complex contexts, including simple fractions, decimals, or percentages, with before-and-after reasonableness checks. Ask your child to explain the steps, not only the answer.",
            goalTextHe:
              "This week, focus on: Upper-grade estimation across larger numbers and more complex contexts, including simple fractions, decimals, or percentages, with before-and-after reasonableness checks.",
            intentDescriptionEn:
              "Upper-grade estimation across larger numbers and more complex contexts, including simple fractions, decimals, or percentages, with before-and-after reasonableness checks.",
          },
        },
        scale: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep scale/magnitude recommendations null for grades 1–2 until early-number copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 number magnitude through comparison to familiar quantities (tens, hundreds, thousands). After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 number magnitude through comparison to familiar quantities (tens, hundreds, thousands).",
            intentDescriptionEn:
              "Grade 3–4 number magnitude through comparison to familiar quantities (tens, hundreds, thousands).",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 order-of-magnitude reasoning with large numbers, decimals, or percentages and answer-size checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 order-of-magnitude reasoning with large numbers, decimals, or percentages and answer-size checks.",
            intentDescriptionEn:
              "Grade 5–6 order-of-magnitude reasoning with large numbers, decimals, or percentages and answer-size checks.",
          },
        },
        prime_composite: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep prime/composite recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 prime vs composite in a small range using factor-count reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 prime vs composite in a small range using factor-count reasoning.",
            intentDescriptionEn:
              "Grade 3–4 prime vs composite in a small range using factor-count reasoning.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 prime factorization and prime/composite classification with written justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 prime factorization and prime/composite classification with written justification.",
            intentDescriptionEn:
              "Grade 5–6 prime factorization and prime/composite classification with written justification.",
          },
        },
        zero_one_properties: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep zero/one properties recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 special properties of 0 and 1 in basic operations with verbal rules. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 special properties of 0 and 1 in basic operations with verbal rules.",
            intentDescriptionEn:
              "Grade 3–4 special properties of 0 and 1 in basic operations with verbal rules.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 zero/one identity and annihilator properties in richer numeric contexts. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 zero/one identity and annihilator properties in richer numeric contexts.",
            intentDescriptionEn:
              "Grade 5–6 zero/one identity and annihilator properties in richer numeric contexts.",
          },
        },
      },
    },
  },
  geometry: {
    "G-02": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-02 default: no approved parent copy; use bucketOverrides (angles, circles) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-02 default: no approved parent copy; use bucketOverrides (angles, circles) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-02 default: no approved parent copy; use bucketOverrides (angles, circles) or engine fallback.",
        },
      },
      bucketOverrides: {
        angles: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal angle recommendations null for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 angle recognition and comparison using a clear drawing and right-angle benchmark. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 angle recognition and comparison using a clear drawing and right-angle benchmark.",
            intentDescriptionEn:
              "Grade 3–4 angle recognition and comparison using a clear drawing and right-angle benchmark.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 angle measurement and estimation, including correct protractor use and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 angle measurement and estimation, including correct protractor use and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 angle measurement and estimation, including correct protractor use and reasonableness checks.",
          },
        },
        circles: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep circle recommendations null for grades 1–2 unless product evidence explicitly supports circle properties.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 circle parts: center, radius, diameter, and explaining their role in a clear diagram. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 circle parts: center, radius, diameter, and explaining their role in a clear diagram.",
            intentDescriptionEn:
              "Grade 3–4 circle parts: center, radius, diameter, and explaining their role in a clear diagram.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 circle relationships involving radius, diameter, measurements, diagram marking, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 circle relationships involving radius, diameter, measurements, diagram marking, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 circle relationships involving radius, diameter, measurements, diagram marking, and reasonableness checks.",
          },
        },
      },
    },
    "G-04": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-04 default: no approved parent copy; use bucketOverrides (transformations, rotation) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-04 default: no approved parent copy; use bucketOverrides (transformations, rotation) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-04 default: no approved parent copy; use bucketOverrides (transformations, rotation) or engine fallback.",
        },
      },
      bucketOverrides: {
        transformations: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 concrete transformations: slide, flip, or turn a shape while preserving the shape. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 concrete transformations: slide, flip, or turn a shape while preserving the shape.",
            intentDescriptionEn:
              "Grade 1–2 concrete transformations: slide, flip, or turn a shape while preserving the shape.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 transformations on a grid: translation, reflection, rotation, and describing what changed. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 transformations on a grid: translation, reflection, rotation, and describing what changed.",
            intentDescriptionEn:
              "Grade 3–4 transformations on a grid: translation, reflection, rotation, and describing what changed.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 precise transformation descriptions including direction, distance, reflection line, rotation center, and invariants. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 precise transformation descriptions including direction, distance, reflection line, rotation center, and invariants.",
            intentDescriptionEn:
              "Grade 5–6 precise transformation descriptions including direction, distance, reflection line, rotation center, and invariants.",
          },
        },
        rotation: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 concrete rotation using objects or drawings, recognizing the same shape after turning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 concrete rotation using objects or drawings, recognizing the same shape after turning.",
            intentDescriptionEn:
              "Grade 1–2 concrete rotation using objects or drawings, recognizing the same shape after turning.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 rotation around a point, including quarter-turn/half-turn language and direction. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 rotation around a point, including quarter-turn/half-turn language and direction.",
            intentDescriptionEn:
              "Grade 3–4 rotation around a point, including quarter-turn/half-turn language and direction.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 precise rotation using center, direction, angle, and point-image consistency. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 precise rotation using center, direction, angle, and point-image consistency.",
            intentDescriptionEn:
              "Grade 5–6 precise rotation using center, direction, angle, and point-image consistency.",
          },
        },
      },
    },
    "G-05": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-05 default: no approved parent copy; use bucketOverrides (solids, volume) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-05 default: no approved parent copy; use bucketOverrides (solids, volume) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-05 default: no approved parent copy; use bucketOverrides (solids, volume) or engine fallback.",
        },
      },
      bucketOverrides: {
        solids: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 solid recognition using everyday objects and simple spatial language. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 solid recognition using everyday objects and simple spatial language.",
            intentDescriptionEn:
              "Grade 1–2 solid recognition using everyday objects and simple spatial language.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 solid properties: faces, vertices, edges, face shapes, and justification of identification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 solid properties: faces, vertices, edges, face shapes, and justification of identification.",
            intentDescriptionEn:
              "Grade 3–4 solid properties: faces, vertices, edges, face shapes, and justification of identification.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 solids, nets, measurements, and connecting 2D representations to 3D structure. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 solids, nets, measurements, and connecting 2D representations to 3D structure.",
            intentDescriptionEn:
              "Grade 5–6 solids, nets, measurements, and connecting 2D representations to 3D structure.",
          },
        },
        volume: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formal volume recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal volume recommendations null for grades 3–4 unless product evidence explicitly supports volume at this level.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 volume of simple solids using length, width, height, units, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 volume of simple solids using length, width, height, units, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 volume of simple solids using length, width, height, units, and reasonableness checks.",
          },
        },
      },
    },
    "G-06": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-06 default: no approved parent copy; use bucketOverrides (perimeter) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-06 default: no approved parent copy; use bucketOverrides (perimeter) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-06 default: no approved parent copy; use bucketOverrides (perimeter) or engine fallback.",
        },
      },
      bucketOverrides: {
        perimeter: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formal perimeter recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 perimeter as sum of side lengths, marking each side and using correct length units. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 perimeter as sum of side lengths, marking each side and using correct length units.",
            intentDescriptionEn:
              "Grade 3–4 perimeter as sum of side lengths, marking each side and using correct length units.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 perimeter of composite or more complex shapes, missing sides, units, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 perimeter of composite or more complex shapes, missing sides, units, and justification.",
            intentDescriptionEn:
              "Grade 5–6 perimeter of composite or more complex shapes, missing sides, units, and justification.",
          },
        },
      },
    },
    "G-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-07 default: no approved parent copy; use bucketOverrides (symmetry) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-07 default: no approved parent copy; use bucketOverrides (symmetry) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-07 default: no approved parent copy; use bucketOverrides (symmetry) or engine fallback.",
        },
      },
      bucketOverrides: {
        symmetry: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 symmetry through folding, mirror-like matching, and simple visual comparison. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 symmetry through folding, mirror-like matching, and simple visual comparison.",
            intentDescriptionEn:
              "Grade 1–2 symmetry through folding, mirror-like matching, and simple visual comparison.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 symmetry lines and completing shapes using equal distance from the line of symmetry. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 symmetry lines and completing shapes using equal distance from the line of symmetry.",
            intentDescriptionEn:
              "Grade 3–4 symmetry lines and completing shapes using equal distance from the line of symmetry.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 symmetry in more complex shapes, multiple symmetry lines, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 symmetry in more complex shapes, multiple symmetry lines, and justification.",
            intentDescriptionEn:
              "Grade 5–6 symmetry in more complex shapes, multiple symmetry lines, and justification.",
          },
        },
      },
    },
    "G-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-01 default: no approved parent copy; use bucketOverrides (shapes_basic, quadrilaterals, parallel_perpendicular, diagonal, tiling) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-01 default: no approved parent copy; use bucketOverrides (shapes_basic, quadrilaterals, parallel_perpendicular, diagonal, tiling) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-01 default: no approved parent copy; use bucketOverrides (shapes_basic, quadrilaterals, parallel_perpendicular, diagonal, tiling) or engine fallback.",
        },
      },
      bucketOverrides: {
        shapes_basic: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 basic shape recognition using familiar objects or drawings, with simple properties such as sides and corners. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 basic shape recognition using familiar objects or drawings, with simple properties such as sides and corners.",
            intentDescriptionEn:
              "Grade 1–2 basic shape recognition using familiar objects or drawings, with simple properties such as sides and corners.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 shape classification by clear geometric properties such as sides, vertices, equal sides, and right angles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 shape classification by clear geometric properties such as sides, vertices, equal sides, and right angles.",
            intentDescriptionEn:
              "Grade 3–4 shape classification by clear geometric properties such as sides, vertices, equal sides, and right angles.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 analysis and comparison of shape properties and relationships between shape families. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 analysis and comparison of shape properties and relationships between shape families.",
            intentDescriptionEn:
              "Grade 5–6 analysis and comparison of shape properties and relationships between shape families.",
          },
        },
        quadrilaterals: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal quadrilateral property recommendations null for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 quadrilateral identification using properties such as four sides, opposite sides, right angles, and equal sides. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 quadrilateral identification using properties such as four sides, opposite sides, right angles, and equal sides.",
            intentDescriptionEn:
              "Grade 3–4 quadrilateral identification using properties such as four sides, opposite sides, right angles, and equal sides.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 quadrilateral classification and relationships using parallelism, equal sides, angles, diagonals, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 quadrilateral classification and relationships using parallelism, equal sides, angles, diagonals, and justification.",
            intentDescriptionEn:
              "Grade 5–6 quadrilateral classification and relationships using parallelism, equal sides, angles, diagonals, and justification.",
          },
        },
        parallel_perpendicular: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formal parallel/perpendicular recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 identifying parallel and perpendicular lines using drawings, right angles, intersection, and equal distance. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 identifying parallel and perpendicular lines using drawings, right angles, intersection, and equal distance.",
            intentDescriptionEn:
              "Grade 3–4 identifying parallel and perpendicular lines using drawings, right angles, intersection, and equal distance.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 using parallel and perpendicular relationships inside shapes to justify geometric properties. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 using parallel and perpendicular relationships inside shapes to justify geometric properties.",
            intentDescriptionEn:
              "Grade 5–6 using parallel and perpendicular relationships inside shapes to justify geometric properties.",
          },
        },
        diagonal: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep diagonal recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 identifying diagonals as segments between non-adjacent vertices and distinguishing them from sides. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 identifying diagonals as segments between non-adjacent vertices and distinguishing them from sides.",
            intentDescriptionEn:
              "Grade 3–4 identifying diagonals as segments between non-adjacent vertices and distinguishing them from sides.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 using diagonals to reason about quadrilateral properties, triangle decomposition, equality, and bisection. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 using diagonals to reason about quadrilateral properties, triangle decomposition, equality, and bisection.",
            intentDescriptionEn:
              "Grade 5–6 using diagonals to reason about quadrilateral properties, triangle decomposition, equality, and bisection.",
          },
        },
        tiling: {
          g1_g2: {
            actionTextHe:
              "It helps to practice grade 1–2 simple tiling with shapes, covering space without gaps or overlaps. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 1–2 simple tiling with shapes, covering space without gaps or overlaps.",
            intentDescriptionEn:
              "Grade 1–2 simple tiling with shapes, covering space without gaps or overlaps.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 tiling with polygons, patterns, and explaining why shapes cover a region without gaps. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 tiling with polygons, patterns, and explaining why shapes cover a region without gaps.",
            intentDescriptionEn:
              "Grade 3–4 tiling with polygons, patterns, and explaining why shapes cover a region without gaps.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 analyzing tessellations and geometric patterns using angles, sides, repetition, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 analyzing tessellations and geometric patterns using angles, sides, repetition, and justification.",
            intentDescriptionEn:
              "Grade 5–6 analyzing tessellations and geometric patterns using angles, sides, repetition, and justification.",
          },
        },
      },
    },
    "G-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-03 default: no approved parent copy; use bucketOverrides (quadrilaterals, heights, area) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-03 default: no approved parent copy; use bucketOverrides (quadrilaterals, heights, area) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-03 default: no approved parent copy; use bucketOverrides (quadrilaterals, heights, area) or engine fallback.",
        },
      },
      bucketOverrides: {
        quadrilaterals: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep advanced quadrilateral area/height recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 quadrilateral reasoning with base, height, and the perpendicular relationship between them. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 quadrilateral reasoning with base, height, and the perpendicular relationship between them.",
            intentDescriptionEn:
              "Grade 3–4 quadrilateral reasoning with base, height, and the perpendicular relationship between them.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 quadrilateral area reasoning using matched base-height pairs and selecting the appropriate formula. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 quadrilateral area reasoning using matched base-height pairs and selecting the appropriate formula.",
            intentDescriptionEn:
              "Grade 5–6 quadrilateral area reasoning using matched base-height pairs and selecting the appropriate formula.",
          },
        },
        heights: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formal height recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 identifying height as a perpendicular segment to a base, not just any segment in the diagram. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 identifying height as a perpendicular segment to a base, not just any segment in the diagram.",
            intentDescriptionEn:
              "Grade 3–4 identifying height as a perpendicular segment to a base, not just any segment in the diagram.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 using height correctly in area calculations, matching base and height even in non-standard diagrams. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 using height correctly in area calculations, matching base and height even in non-standard diagrams.",
            intentDescriptionEn:
              "Grade 5–6 using height correctly in area calculations, matching base and height even in non-standard diagrams.",
          },
        },
        area: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formal area recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 area as covering a region, using grid squares or decomposition, and distinguishing area from perimeter. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 area as covering a region, using grid squares or decomposition, and distinguishing area from perimeter.",
            intentDescriptionEn:
              "Grade 3–4 area as covering a region, using grid squares or decomposition, and distinguishing area from perimeter.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 area of composite shapes using decomposition, appropriate formulas, and reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 area of composite shapes using decomposition, appropriate formulas, and reasonableness checks.",
            intentDescriptionEn:
              "Grade 5–6 area of composite shapes using decomposition, appropriate formulas, and reasonableness checks.",
          },
        },
      },
    },
    "G-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-08 default: no approved parent copy; use bucketOverrides (area, triangles, pythagoras) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-08 default: no approved parent copy; use bucketOverrides (area, triangles, pythagoras) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "G-08 default: no approved parent copy; use bucketOverrides (area, triangles, pythagoras) or engine fallback.",
        },
      },
      bucketOverrides: {
        area: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formula-based area recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formula-based advanced area recommendations null for grades 3–4 unless item evidence explicitly supports it.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 formula-based area reasoning: choose the correct formula, substitute values, and check square units. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 formula-based area reasoning: choose the correct formula, substitute values, and check square units.",
            intentDescriptionEn:
              "Grade 5–6 formula-based area reasoning: choose the correct formula, substitute values, and check square units.",
          },
        },
        triangles: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal triangle area/property recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 triangle identification and comparison using clear properties such as sides, vertices, and angles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 triangle identification and comparison using clear properties such as sides, vertices, and angles.",
            intentDescriptionEn:
              "Grade 3–4 triangle identification and comparison using clear properties such as sides, vertices, and angles.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 triangle area using base and height, understanding the divide-by-two relationship to rectangles/parallelograms. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 triangle area using base and height, understanding the divide-by-two relationship to rectangles/parallelograms.",
            intentDescriptionEn:
              "Grade 5–6 triangle area using base and height, understanding the divide-by-two relationship to rectangles/parallelograms.",
          },
        },
        pythagoras: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep Pythagoras recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep Pythagoras recommendations null for grades 3–4.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 Pythagoras only in right triangles: identify right angle, hypotenuse, legs, substitute carefully, and check reasonableness. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 Pythagoras only in right triangles: identify right angle, hypotenuse, legs, substitute carefully, and check reasonableness.",
            intentDescriptionEn:
              "Grade 5–6 Pythagoras only in right triangles: identify right angle, hypotenuse, legs, substitute carefully, and check reasonableness.",
          },
        },
      },
    },
  },
  hebrew: {
    "H-04": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-04 default: no approved flat copy; use bucketOverrides (reading, comprehension) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-04 default: no approved flat copy; use bucketOverrides (reading, comprehension) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-04 default: no approved flat copy; use bucketOverrides (reading, comprehension) or engine fallback.",
        },
      },
      bucketOverrides: {
        reading: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep reading-order/fact-location recommendations null for grades 1–2 until concrete early-reading copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 locating explicit information in a text using title, paragraph, or keyword cues, and pointing to the exact sentence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 locating explicit information in a text using title, paragraph, or keyword cues, and pointing to the exact sentence.",
            intentDescriptionEn:
              "Grade 3–4 locating explicit information in a text using title, paragraph, or keyword cues, and pointing to the exact sentence.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 locating textual evidence and distinguishing explicit information from an inference. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 locating textual evidence and distinguishing explicit information from an inference.",
            intentDescriptionEn:
              "Grade 5–6 locating textual evidence and distinguishing explicit information from an inference.",
          },
        },
        comprehension: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep comprehension strategy recommendations null for grades 1–2 until concrete early-reading copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 comprehension through sequence of events/ideas and returning to the text for support. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 comprehension through sequence of events/ideas and returning to the text for support.",
            intentDescriptionEn:
              "Grade 3–4 comprehension through sequence of events/ideas and returning to the text for support.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 comprehension by connecting details across the text and supporting answers with textual evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 comprehension by connecting details across the text and supporting answers with textual evidence.",
            intentDescriptionEn:
              "Grade 5–6 comprehension by connecting details across the text and supporting answers with textual evidence.",
          },
        },
      },
    },
    "H-05": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-05 default: no approved flat copy; use bucketOverrides (homophones) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-05 default: no approved flat copy; use bucketOverrides (homophones) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-05 default: no approved flat copy; use bucketOverrides (homophones) or engine fallback.",
        },
      },
      bucketOverrides: {
        homophones: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep homophone/context recommendations null for grades 1–2 until early Hebrew copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 homophone disambiguation using minimal sentence pairs and context-based word choice. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 homophone disambiguation using minimal sentence pairs and context-based word choice.",
            intentDescriptionEn:
              "Grade 3–4 homophone disambiguation using minimal sentence pairs and context-based word choice.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 homophone/context discrimination in short texts with written justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 homophone/context discrimination in short texts with written justification.",
            intentDescriptionEn:
              "Grade 5–6 homophone/context discrimination in short texts with written justification.",
          },
        },
      },
    },
    "H-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-01 default: use bucketOverrides (vocabulary, mixed) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-01 default: use bucketOverrides (vocabulary, mixed) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-01 default: use bucketOverrides (vocabulary, mixed) or engine fallback.",
        },
      },
      bucketOverrides: {
        vocabulary: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep Hebrew vocabulary recommendations null for grades 1–2 until early-reading copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 Hebrew vocabulary through short texts, explaining word meaning from context, and using the word in a sentence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 Hebrew vocabulary through short texts, explaining word meaning from context, and using the word in a sentence.",
            intentDescriptionEn:
              "Grade 3–4 Hebrew vocabulary through short texts, explaining word meaning from context, and using the word in a sentence.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 Hebrew vocabulary in context, key words, nuanced meaning, and possible shifts in meaning across contexts. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 Hebrew vocabulary in context, key words, nuanced meaning, and possible shifts in meaning across contexts.",
            intentDescriptionEn:
              "Grade 5–6 Hebrew vocabulary in context, key words, nuanced meaning, and possible shifts in meaning across contexts.",
          },
        },
        mixed: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep mixed Hebrew vocabulary recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 mixed Hebrew vocabulary and expressions through sentence context and explanation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 3–4 mixed Hebrew vocabulary and expressions through sentence context and explanation.",
            intentDescriptionEn:
              "Grade 3–4 mixed Hebrew vocabulary and expressions through sentence context and explanation.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 mixed vocabulary/expressions in text, including literal vs contextual meaning and evidence from context. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 mixed vocabulary/expressions in text, including literal vs contextual meaning and evidence from context.",
            intentDescriptionEn:
              "Grade 5–6 mixed vocabulary/expressions in text, including literal vs contextual meaning and evidence from context.",
          },
        },
      },
    },
    "H-02": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-02 default: use bucketOverrides (grammar) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-02 default: use bucketOverrides (grammar) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-02 default: use bucketOverrides (grammar) or engine fallback.",
        },
      },
      bucketOverrides: {
        grammar: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formal Hebrew grammar recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 basic Hebrew grammar agreement in short sentences: gender, number, and matching the word form to context. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 basic Hebrew grammar agreement in short sentences: gender, number, and matching the word form to context.",
            intentDescriptionEn:
              "Grade 3–4 basic Hebrew grammar agreement in short sentences: gender, number, and matching the word form to context.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 Hebrew grammar accuracy in full sentences: agreement, verb form, function words, and sentence clarity. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 Hebrew grammar accuracy in full sentences: agreement, verb form, function words, and sentence clarity.",
            intentDescriptionEn:
              "Grade 5–6 Hebrew grammar accuracy in full sentences: agreement, verb form, function words, and sentence clarity.",
          },
        },
      },
    },
    "H-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-03 default: use bucketOverrides (writing) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-03 default: use bucketOverrides (writing) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-03 default: use bucketOverrides (writing) or engine fallback.",
        },
      },
      bucketOverrides: {
        writing: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep Hebrew writing recommendations null for grades 1–2 until early-writing copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 Hebrew writing: short clear answer, direct response to the question, one supporting detail, and rereading for clarity. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 3–4 Hebrew writing: short clear answer, direct response to the question, one supporting detail, and rereading for clarity.",
            intentDescriptionEn:
              "Grade 3–4 Hebrew writing: short clear answer, direct response to the question, one supporting detail, and rereading for clarity.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 Hebrew writing with clear structure: opening, explanation/example, organized ideas, and a clear closing. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 Hebrew writing with clear structure: opening, explanation/example, organized ideas, and a clear closing.",
            intentDescriptionEn:
              "Grade 5–6 Hebrew writing with clear structure: opening, explanation/example, organized ideas, and a clear closing.",
          },
        },
      },
    },
    "H-06": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-06 default: use bucketOverrides (grammar) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-06 default: use bucketOverrides (grammar) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-06 default: use bucketOverrides (grammar) or engine fallback.",
        },
      },
      bucketOverrides: {
        grammar: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep advanced Hebrew grammar/syntax recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 Hebrew sentence structure: identify the doer/action and how sentence parts connect. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 3–4 Hebrew sentence structure: identify the doer/action and how sentence parts connect.",
            intentDescriptionEn:
              "Grade 3–4 Hebrew sentence structure: identify the doer/action and how sentence parts connect.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 advanced Hebrew grammar/syntax: root-pattern awareness, verb forms, sentence roles, and meaning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 advanced Hebrew grammar/syntax: root-pattern awareness, verb forms, sentence roles, and meaning.",
            intentDescriptionEn:
              "Grade 5–6 advanced Hebrew grammar/syntax: root-pattern awareness, verb forms, sentence roles, and meaning.",
          },
        },
      },
    },
    "H-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-07 default: use bucketOverrides (writing) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-07 default: use bucketOverrides (writing) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "H-07 default: use bucketOverrides (writing) or engine fallback.",
        },
      },
      bucketOverrides: {
        writing: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep higher-level Hebrew writing recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 developed Hebrew writing: main idea, explanation, example, and keeping sentences connected. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 3–4 developed Hebrew writing: main idea, explanation, example, and keeping sentences connected.",
            intentDescriptionEn:
              "Grade 3–4 developed Hebrew writing: main idea, explanation, example, and keeping sentences connected.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 higher Hebrew writing: organized paragraph, reasoning, examples, cohesion, and revision. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 higher Hebrew writing: organized paragraph, reasoning, examples, cohesion, and revision.",
            intentDescriptionEn:
              "Grade 5–6 higher Hebrew writing: organized paragraph, reasoning, examples, cohesion, and revision.",
          },
        },
      },
    },
    "H-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-08 default: no approved flat copy; use bucketOverrides (speaking) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-08 default: no approved flat copy; use bucketOverrides (speaking) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "H-08 default: no approved flat copy; use bucketOverrides (speaking) or engine fallback.",
        },
      },
      bucketOverrides: {
        speaking: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formal register/speaking recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep context-appropriate register recommendations null for grades 3–4 until diagnosis-line jargon cleanup and editorial copy are approved.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 context-appropriate speaking/register: choosing wording that fits the situation and explaining why. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 context-appropriate speaking/register: choosing wording that fits the situation and explaining why.",
            intentDescriptionEn:
              "Grade 5–6 context-appropriate speaking/register: choosing wording that fits the situation and explaining why.",
          },
        },
      },
    },
  },
  english: {
    "E-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-01 default: use bucketOverrides (vocabulary) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-01 default: use bucketOverrides (vocabulary) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-01 default: use bucketOverrides (vocabulary) or engine fallback.",
        },
      },
      bucketOverrides: {
        vocabulary: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep early English vocabulary recommendations null for grades 1–2 until early-English copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English vocabulary recognition through word-picture/meaning matching and simple reuse. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 English vocabulary recognition through word-picture/meaning matching and simple reuse.",
            intentDescriptionEn:
              "Grade 3–4 English vocabulary recognition through word-picture/meaning matching and simple reuse.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English vocabulary expansion by topic and text use, with example sentences and recognition in new contexts. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English vocabulary expansion by topic and text use, with example sentences and recognition in new contexts.",
            intentDescriptionEn:
              "Grade 5–6 English vocabulary expansion by topic and text use, with example sentences and recognition in new contexts.",
          },
        },
      },
    },
    "E-02": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-02 default: use bucketOverrides (grammar) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-02 default: use bucketOverrides (grammar) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-02 default: use bucketOverrides (grammar) or engine fallback.",
        },
      },
      bucketOverrides: {
        grammar: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep formal English grammar recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 basic English grammar agreement inside short sentences, matching the subject with the correct verb/form. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 basic English grammar agreement inside short sentences, matching the subject with the correct verb/form.",
            intentDescriptionEn:
              "Grade 3–4 basic English grammar agreement inside short sentences, matching the subject with the correct verb/form.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English grammar with tense, subject, and verb-form agreement in full sentences. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English grammar with tense, subject, and verb-form agreement in full sentences.",
            intentDescriptionEn:
              "Grade 5–6 English grammar with tense, subject, and verb-form agreement in full sentences.",
          },
        },
      },
    },
    "E-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-03 default: no approved flat copy; use bucketOverrides (translation) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-03 default: no approved flat copy; use bucketOverrides (translation) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-03 default: no approved flat copy; use bucketOverrides (translation) or engine fallback.",
        },
      },
      bucketOverrides: {
        translation: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep line-tracking/layout recommendations null for grades 1–2 until early English reading evidence and copy are approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English reading layout support: track one line at a time and avoid jumping between lines. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 English reading layout support: track one line at a time and avoid jumping between lines.",
            intentDescriptionEn:
              "Grade 3–4 English reading layout support: track one line at a time and avoid jumping between lines.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English reading layout and evidence tracking across lines, paragraphs, or columns. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English reading layout and evidence tracking across lines, paragraphs, or columns.",
            intentDescriptionEn:
              "Grade 5–6 English reading layout and evidence tracking across lines, paragraphs, or columns.",
          },
        },
      },
    },
    "E-04": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-04 default: use bucketOverrides (grammar) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-04 default: use bucketOverrides (grammar) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-04 default: use bucketOverrides (grammar) or engine fallback.",
        },
      },
      bucketOverrides: {
        grammar: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep sentence-structure grammar recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English sentence structure: basic word order, subject/action, and meaning completion. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 3–4 English sentence structure: basic word order, subject/action, and meaning completion.",
            intentDescriptionEn:
              "Grade 3–4 English sentence structure: basic word order, subject/action, and meaning completion.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English sentence structure with word order, connectors, prepositions, and meaning clarity. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English sentence structure with word order, connectors, prepositions, and meaning clarity.",
            intentDescriptionEn:
              "Grade 5–6 English sentence structure with word order, connectors, prepositions, and meaning clarity.",
          },
        },
      },
    },
    "E-05": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-05 default: use bucketOverrides (vocabulary) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-05 default: use bucketOverrides (vocabulary) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-05 default: use bucketOverrides (vocabulary) or engine fallback.",
        },
      },
      bucketOverrides: {
        vocabulary: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep vocabulary-in-context recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 vocabulary in context: choose a word by reading the whole sentence and using context clues. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 vocabulary in context: choose a word by reading the whole sentence and using context clues.",
            intentDescriptionEn:
              "Grade 3–4 vocabulary in context: choose a word by reading the whole sentence and using context clues.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 vocabulary in context, natural word combinations, and choosing meaning based on sentence/text context. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 vocabulary in context, natural word combinations, and choosing meaning based on sentence/text context.",
            intentDescriptionEn:
              "Grade 5–6 vocabulary in context, natural word combinations, and choosing meaning based on sentence/text context.",
          },
        },
      },
    },
    "E-06": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-06 default: use bucketOverrides (sentences/sentence) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-06 default: use bucketOverrides (sentences/sentence) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "E-06 default: use bucketOverrides (sentences/sentence) or engine fallback.",
        },
      },
      bucketOverrides: {
        sentences: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep English sentence inference/comprehension recommendations null for grades 1–2 until approved early-English copy exists.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues.",
            intentDescriptionEn:
              "Grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning.",
            intentDescriptionEn:
              "Grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning.",
          },
        },
        sentence: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Alias of sentences. Keep null for grades 1–2 until approved early-English copy exists.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice alias of sentences. Grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on alias of sentences. Grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues.",
            intentDescriptionEn:
              "Alias of sentences. Grade 3–4 English sentence comprehension: understand the whole sentence, identify who does the action, what happens, and context clues.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice alias of sentences. Grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on alias of sentences. Grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning.",
            intentDescriptionEn:
              "Alias of sentences. Grade 5–6 English sentence inference from context, nearby words, pronouns, connectors, and explaining the reasoning.",
          },
        },
      },
    },
    "E-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-07 default: no approved flat copy; use bucketOverrides (writing) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-07 default: no approved flat copy; use bucketOverrides (writing) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-07 default: no approved flat copy; use bucketOverrides (writing) or engine fallback.",
        },
      },
      bucketOverrides: {
        writing: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep early English spelling recommendations null for grades 1–2 until age-appropriate spelling copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 recurring English spelling patterns through word groups and repeated endings or letter patterns. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 recurring English spelling patterns through word groups and repeated endings or letter patterns.",
            intentDescriptionEn:
              "Grade 3–4 recurring English spelling patterns through word groups and repeated endings or letter patterns.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 spelling consistency in English writing, identifying repeated error patterns and correcting them systematically. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 spelling consistency in English writing, identifying repeated error patterns and correcting them systematically.",
            intentDescriptionEn:
              "Grade 5–6 spelling consistency in English writing, identifying repeated error patterns and correcting them systematically.",
          },
        },
      },
    },
    "E-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-08 default: no approved flat copy; use bucketOverrides (listening) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-08 default: no approved flat copy; use bucketOverrides (listening) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "E-08 default: no approved flat copy; use bucketOverrides (listening) or engine fallback.",
        },
      },
      bucketOverrides: {
        listening: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep listening/minimal-pair recommendations null for grades 1–2 until early-English listening copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 English minimal-pair listening through slow reading and repeated sound pairs in different words. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 English minimal-pair listening through slow reading and repeated sound pairs in different words.",
            intentDescriptionEn:
              "Grade 3–4 English minimal-pair listening through slow reading and repeated sound pairs in different words.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 minimal-pair listening in short English sentences with explicit sound-difference explanation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 minimal-pair listening in short English sentences with explicit sound-difference explanation.",
            intentDescriptionEn:
              "Grade 5–6 minimal-pair listening in short English sentences with explicit sound-difference explanation.",
          },
        },
      },
    },
  },
  science: {
    "S-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-01 default: no approved parent copy; use bucketOverrides (animals, plants, earth_space, mixed) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-01 default: no approved parent copy; use bucketOverrides (animals, plants, earth_space, mixed) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-01 default: no approved parent copy; use bucketOverrides (animals, plants, earth_space, mixed) or engine fallback.",
        },
      },
      bucketOverrides: {
        animals: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep animal classification recommendations null for grades 1–2 until concrete early-science copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 animal classification using observable traits such as body structure, habitat, food, or movement. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 animal classification using observable traits such as body structure, habitat, food, or movement.",
            intentDescriptionEn:
              "Grade 3–4 animal classification using observable traits such as body structure, habitat, food, or movement.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 animal classification across multiple traits, distinguishing traits from processes and justifying with evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 animal classification across multiple traits, distinguishing traits from processes and justifying with evidence.",
            intentDescriptionEn:
              "Grade 5–6 animal classification across multiple traits, distinguishing traits from processes and justifying with evidence.",
          },
        },
        plants: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep plant classification recommendations null for grades 1–2 until concrete early-science copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 plant classification using plant parts and their roles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 plant classification using plant parts and their roles.",
            intentDescriptionEn:
              "Grade 3–4 plant classification using plant parts and their roles.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 plant comparison by structure, living conditions, and processes, separating traits from processes. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 plant comparison by structure, living conditions, and processes, separating traits from processes.",
            intentDescriptionEn:
              "Grade 5–6 plant comparison by structure, living conditions, and processes, separating traits from processes.",
          },
        },
        earth_space: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep earth/space classification recommendations null for grades 1–2 until concrete early-science copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 earth/space classification by observable categories such as celestial bodies, weather, rocks, water, or environmental changes. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 earth/space classification by observable categories such as celestial bodies, weather, rocks, water, or environmental changes.",
            intentDescriptionEn:
              "Grade 3–4 earth/space classification by observable categories such as celestial bodies, weather, rocks, water, or environmental changes.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 earth/space reasoning by distinguishing objects, phenomena, and processes using task evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 earth/space reasoning by distinguishing objects, phenomena, and processes using task evidence.",
            intentDescriptionEn:
              "Grade 5–6 earth/space reasoning by distinguishing objects, phenomena, and processes using task evidence.",
          },
        },
        mixed: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep mixed science classification recommendations null for grades 1–2 until concrete early-science copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 mixed science classification by clear traits and explanation using evidence from the question. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 mixed science classification by clear traits and explanation using evidence from the question.",
            intentDescriptionEn:
              "Grade 3–4 mixed science classification by clear traits and explanation using evidence from the question.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 mixed science concept classification across domains, distinguishing concepts, traits, and processes using evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 mixed science concept classification across domains, distinguishing concepts, traits, and processes using evidence.",
            intentDescriptionEn:
              "Grade 5–6 mixed science concept classification across domains, distinguishing concepts, traits, and processes using evidence.",
          },
        },
      },
    },
    "S-02": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-02 default: no approved parent copy; use bucketOverrides (experiments) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-02 default: no approved parent copy; use bucketOverrides (experiments) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "S-02 default: no approved parent copy; use bucketOverrides (experiments) or engine fallback.",
        },
      },
      bucketOverrides: {
        experiments: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal experiment-variable recommendations null for grades 1–2 until concrete early-science copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 fair-test reasoning: change one variable, keep other conditions the same, and observe the result. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 fair-test reasoning: change one variable, keep other conditions the same, and observe the result.",
            intentDescriptionEn:
              "Grade 3–4 fair-test reasoning: change one variable, keep other conditions the same, and observe the result.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 experiment planning with isolated variables, controlled conditions, measurement, and causal explanation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 experiment planning with isolated variables, controlled conditions, measurement, and causal explanation.",
            intentDescriptionEn:
              "Grade 5–6 experiment planning with isolated variables, controlled conditions, measurement, and causal explanation.",
          },
        },
      },
    },
    "S-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-03 default: use bucketOverrides (body) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-03 default: use bucketOverrides (body) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-03 default: use bucketOverrides (body) or engine fallback.",
        },
      },
      bucketOverrides: {
        body: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep body-system diagram recommendations null for grades 1–2 unless product evidence explicitly supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 reading simple body/system diagrams: identify parts, roles, and direction of flow without medical conclusions. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 reading simple body/system diagrams: identify parts, roles, and direction of flow without medical conclusions.",
            intentDescriptionEn:
              "Grade 3–4 reading simple body/system diagrams: identify parts, roles, and direction of flow without medical conclusions.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 body systems: connect structure to function and explain relationships between parts in a diagram. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 body systems: connect structure to function and explain relationships between parts in a diagram.",
            intentDescriptionEn:
              "Grade 5–6 body systems: connect structure to function and explain relationships between parts in a diagram.",
          },
        },
      },
    },
    "S-04": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-04 default: use bucketOverrides (materials) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-04 default: use bucketOverrides (materials) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-04 default: use bucketOverrides (materials) or engine fallback.",
        },
      },
      bucketOverrides: {
        materials: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep formal matter/conservation recommendations null for grades 1–2 unless concrete product evidence supports it.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 states of matter: track what changes and what remains using diagrams and observations. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 states of matter: track what changes and what remains using diagrams and observations.",
            intentDescriptionEn:
              "Grade 3–4 states of matter: track what changes and what remains using diagrams and observations.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 matter changes and conservation reasoning using particle diagrams or before/after tables. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 matter changes and conservation reasoning using particle diagrams or before/after tables.",
            intentDescriptionEn:
              "Grade 5–6 matter changes and conservation reasoning using particle diagrams or before/after tables.",
          },
        },
      },
    },
    "S-05": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-05 default: use bucketOverrides (materials) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-05 default: use bucketOverrides (materials) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-05 default: use bucketOverrides (materials) or engine fallback.",
        },
      },
      bucketOverrides: {
        materials: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 unit conversion with reference table and unit choice justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 unit conversion with reference table and unit choice justification.",
            intentDescriptionEn: "Grade 3–4 unit conversion with reference table and unit choice justification.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 multi-step unit conversion with reasonableness checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 multi-step unit conversion with reasonableness checks.",
            intentDescriptionEn: "Grade 5–6 multi-step unit conversion with reasonableness checks.",
          },
        },
      },
    },
    "S-06": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-06 default: use bucketOverrides (earth_space, experiments) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-06 default: use bucketOverrides (earth_space, experiments) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-06 default: use bucketOverrides (earth_space, experiments) or engine fallback.",
        },
      },
      bucketOverrides: {
        earth_space: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 graph reading: axes, point location, value extraction. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 graph reading: axes, point location, value extraction.",
            intentDescriptionEn: "Grade 3–4 graph reading: axes, point location, value extraction.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 graph comparison and axis-based reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 graph comparison and axis-based reasoning.",
            intentDescriptionEn: "Grade 5–6 graph comparison and axis-based reasoning.",
          },
        },
        experiments: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 experiment data table/graph reading. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 experiment data table/graph reading.",
            intentDescriptionEn: "Grade 3–4 experiment data table/graph reading.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 experiment graph analysis and variable-result link. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 experiment graph analysis and variable-result link.",
            intentDescriptionEn: "Grade 5–6 experiment graph analysis and variable-result link.",
          },
        },
      },
    },
    "S-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-08 default: use bucketOverrides (animals, experiments) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-08 default: use bucketOverrides (animals, experiments) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-08 default: use bucketOverrides (animals, experiments) or engine fallback.",
        },
      },
      bucketOverrides: {
        animals: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 evidence/source grounding for animal-science claims. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 evidence/source grounding for animal-science claims.",
            intentDescriptionEn: "Grade 3–4 evidence/source grounding for animal-science claims.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 claim-evidence distinction in science texts. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 claim-evidence distinction in science texts.",
            intentDescriptionEn: "Grade 5–6 claim-evidence distinction in science texts.",
          },
        },
        experiments: {
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 experiment evidence sourcing from observation/logs. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 experiment evidence sourcing from observation/logs.",
            intentDescriptionEn: "Grade 3–4 experiment evidence sourcing from observation/logs.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 data-backed conclusions vs speculation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 data-backed conclusions vs speculation.",
            intentDescriptionEn: "Grade 5–6 data-backed conclusions vs speculation.",
          },
        },
      },
    },
    "S-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-07 default: use bucketOverrides (environment) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-07 default: use bucketOverrides (environment) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn: "S-07 default: use bucketOverrides (environment) or engine fallback.",
        },
      },
      bucketOverrides: {
        environment: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep ecosystem/food-web recommendations null for grades 1–2 unless product evidence explicitly supports simple food-chain work.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 simple food-chain reasoning: who eats whom, what arrows show, and using diagram evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 simple food-chain reasoning: who eats whom, what arrows show, and using diagram evidence.",
            intentDescriptionEn:
              "Grade 3–4 simple food-chain reasoning: who eats whom, what arrows show, and using diagram evidence.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 ecosystem reasoning with food webs, producers/consumers, energy flow, and system effects. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 ecosystem reasoning with food webs, producers/consumers, energy flow, and system effects.",
            intentDescriptionEn:
              "Grade 5–6 ecosystem reasoning with food webs, producers/consumers, energy flow, and system effects.",
          },
        },
      },
    },
  },
  "moledet-geography": {
    "MG-01": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-01 default: no approved parent copy; use bucketOverrides (maps, geography, mixed) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-01 default: no approved parent copy; use bucketOverrides (maps, geography, mixed) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-01 default: no approved parent copy; use bucketOverrides (maps, geography, mixed) or engine fallback.",
        },
      },
      bucketOverrides: {
        maps: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep map scale recommendations null for grades 1–2 until concrete early-map copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 map scale and distance comparison using scale bars, map units, and simple measurement. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 map scale and distance comparison using scale bars, map units, and simple measurement.",
            intentDescriptionEn:
              "Grade 3–4 map scale and distance comparison using scale bars, map units, and simple measurement.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 map scale reasoning: convert and compare distances, track units, and check reasonableness. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 map scale reasoning: convert and compare distances, track units, and check reasonableness.",
            intentDescriptionEn:
              "Grade 5–6 map scale reasoning: convert and compare distances, track units, and check reasonableness.",
          },
        },
        geography: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep geography scale/distance recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 geography distance comparison between places on a map using scale or map units. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 geography distance comparison between places on a map using scale or map units.",
            intentDescriptionEn:
              "Grade 3–4 geography distance comparison between places on a map using scale or map units.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 geography map-distance reasoning using scale, units, and evidence from the map. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 geography map-distance reasoning using scale, units, and evidence from the map.",
            intentDescriptionEn:
              "Grade 5–6 geography map-distance reasoning using scale, units, and evidence from the map.",
          },
        },
        mixed: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep mixed map-scale recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 mixed map questions: identify the relevant map data before solving distance or comparison tasks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 mixed map questions: identify the relevant map data before solving distance or comparison tasks.",
            intentDescriptionEn:
              "Grade 3–4 mixed map questions: identify the relevant map data before solving distance or comparison tasks.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 mixed map reasoning using scale, distances, visual data, and justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 mixed map reasoning using scale, distances, visual data, and justification.",
            intentDescriptionEn:
              "Grade 5–6 mixed map reasoning using scale, distances, visual data, and justification.",
          },
        },
      },
    },
    "MG-02": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-02 default: no approved parent copy; use bucketOverrides (maps, geography) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-02 default: no approved parent copy; use bucketOverrides (maps, geography) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-02 default: no approved parent copy; use bucketOverrides (maps, geography) or engine fallback.",
        },
      },
      bucketOverrides: {
        maps: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep map orientation recommendations null for grades 1–2 until concrete orientation copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 map orientation using north arrow, direction choice, and rotated map checks. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 map orientation using north arrow, direction choice, and rotated map checks.",
            intentDescriptionEn:
              "Grade 3–4 map orientation using north arrow, direction choice, and rotated map checks.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 map orientation with north reference, rotated maps, and spatial justification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 map orientation with north reference, rotated maps, and spatial justification.",
            intentDescriptionEn:
              "Grade 5–6 map orientation with north reference, rotated maps, and spatial justification.",
          },
        },
        geography: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep geography orientation recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 geography orientation: describe relative directions between places using north reference. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 geography orientation: describe relative directions between places using north reference.",
            intentDescriptionEn:
              "Grade 3–4 geography orientation: describe relative directions between places using north reference.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 geographic orientation using north as a stable reference, not page-left/page-right. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 geographic orientation using north as a stable reference, not page-left/page-right.",
            intentDescriptionEn:
              "Grade 5–6 geographic orientation using north as a stable reference, not page-left/page-right.",
          },
        },
      },
    },
    "MG-03": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-03 default: no approved parent copy; use bucketOverrides (citizenship) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-03 default: no approved parent copy; use bucketOverrides (citizenship) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-03 default: no approved parent copy; use bucketOverrides (citizenship) or engine fallback.",
        },
      },
      bucketOverrides: {
        citizenship: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep citizenship rights/responsibilities recommendations null for grades 1–2 until concrete early-civics copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 citizenship reasoning: sort short scenarios into rights, responsibilities, or rules using evidence from the situation. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 citizenship reasoning: sort short scenarios into rights, responsibilities, or rules using evidence from the situation.",
            intentDescriptionEn:
              "Grade 3–4 citizenship reasoning: sort short scenarios into rights, responsibilities, or rules using evidence from the situation.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 civic concepts through scenario classification, justification, and evidence from text. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 civic concepts through scenario classification, justification, and evidence from text.",
            intentDescriptionEn:
              "Grade 5–6 civic concepts through scenario classification, justification, and evidence from text.",
          },
        },
      },
    },
    "MG-04": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-04 default: no approved parent copy; use bucketOverrides (homeland) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-04 default: no approved parent copy; use bucketOverrides (homeland) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-04 default: no approved parent copy; use bucketOverrides (homeland) or engine fallback.",
        },
      },
      bucketOverrides: {
        homeland: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep timeline/order recommendations null for grades 1–2 until early sequence copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 timeline and event order using dates, before/after clues, and evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 timeline and event order using dates, before/after clues, and evidence.",
            intentDescriptionEn:
              "Grade 3–4 timeline and event order using dates, before/after clues, and evidence.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 timeline construction, chronological justification, and understanding event relationships. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 timeline construction, chronological justification, and understanding event relationships.",
            intentDescriptionEn:
              "Grade 5–6 timeline construction, chronological justification, and understanding event relationships.",
          },
        },
      },
    },
    "MG-05": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-05 default: no approved parent copy; use bucketOverrides (geography) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-05 default: no approved parent copy; use bucketOverrides (geography) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-05 default: no approved parent copy; use bucketOverrides (geography) or engine fallback.",
        },
      },
      bucketOverrides: {
        geography: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep climate/region map recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 climate/region map reading using map key colors and symbols. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 climate/region map reading using map key colors and symbols.",
            intentDescriptionEn:
              "Grade 3–4 climate/region map reading using map key colors and symbols.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 comparing geographic or climate regions using legend, colors, symbols, and evidence from maps/text. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 comparing geographic or climate regions using legend, colors, symbols, and evidence from maps/text.",
            intentDescriptionEn:
              "Grade 5–6 comparing geographic or climate regions using legend, colors, symbols, and evidence from maps/text.",
          },
        },
      },
    },
    "MG-06": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-06 default: no approved parent copy; use bucketOverrides (homeland, values) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-06 default: no approved parent copy; use bucketOverrides (homeland, values) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-06 default: no approved parent copy; use bucketOverrides (homeland, values) or engine fallback.",
        },
      },
      bucketOverrides: {
        homeland: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep homeland cause/effect recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 homeland cause-effect reasoning using two explanations and evidence from text or map. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 homeland cause-effect reasoning using two explanations and evidence from text or map.",
            intentDescriptionEn:
              "Grade 3–4 homeland cause-effect reasoning using two explanations and evidence from text or map.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 population/settlement cause-effect reasoning using evidence and avoiding unsupported generalizations. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 population/settlement cause-effect reasoning using evidence and avoiding unsupported generalizations.",
            intentDescriptionEn:
              "Grade 5–6 population/settlement cause-effect reasoning using evidence and avoiding unsupported generalizations.",
          },
        },
        values: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn: "Keep values/social explanation recommendations null for grades 1–2.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 values/community reasoning: distinguish fact from opinion and support explanations with evidence. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 values/community reasoning: distinguish fact from opinion and support explanations with evidence.",
            intentDescriptionEn:
              "Grade 3–4 values/community reasoning: distinguish fact from opinion and support explanations with evidence.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 values/social reasoning: use evidence carefully and avoid unsupported generalizations. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 values/social reasoning: use evidence carefully and avoid unsupported generalizations.",
            intentDescriptionEn:
              "Grade 5–6 values/social reasoning: use evidence carefully and avoid unsupported generalizations.",
          },
        },
      },
    },
    "MG-07": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-07 default: no approved parent copy; use bucketOverrides (community) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-07 default: no approved parent copy; use bucketOverrides (community) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-07 default: no approved parent copy; use bucketOverrides (community) or engine fallback.",
        },
      },
      bucketOverrides: {
        community: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep community-institution recommendations null for grades 1–2 until concrete community copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 community institutions: match institutions to roles and explain who uses them and what service they provide. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 community institutions: match institutions to roles and explain who uses them and what service they provide.",
            intentDescriptionEn:
              "Grade 3–4 community institutions: match institutions to roles and explain who uses them and what service they provide.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 community institutions: roles, responsibilities, services, and impact on residents. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 community institutions: roles, responsibilities, services, and impact on residents.",
            intentDescriptionEn:
              "Grade 5–6 community institutions: roles, responsibilities, services, and impact on residents.",
          },
        },
      },
    },
    "MG-08": {
      defaultBands: {
        g1_g2: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-08 default: no approved parent copy; use bucketOverrides (maps) or engine fallback.",
        },
        g3_g4: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-08 default: no approved parent copy; use bucketOverrides (maps) or engine fallback.",
        },
        g5_g6: {
          actionTextHe: null,
          goalTextHe: null,
          intentDescriptionEn:
            "MG-08 default: no approved parent copy; use bucketOverrides (maps) or engine fallback.",
        },
      },
      bucketOverrides: {
        maps: {
          g1_g2: {
            actionTextHe: null,
            goalTextHe: null,
            intentDescriptionEn:
              "Keep map-symbol recommendations null for grades 1–2 until concrete legend copy is approved.",
          },
          g3_g4: {
            actionTextHe:
              "It helps to practice grade 3–4 map symbols and legend reading: match symbols to meanings and explain their role. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 3–4 map symbols and legend reading: match symbols to meanings and explain their role.",
            intentDescriptionEn:
              "Grade 3–4 map symbols and legend reading: match symbols to meanings and explain their role.",
          },
          g5_g6: {
            actionTextHe:
              "It helps to practice grade 5–6 map-symbol interpretation using legends, multiple symbols, and landscape/region reasoning. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe:
              "This week, focus on grade 5–6 map-symbol interpretation using legends, multiple symbols, and landscape/region reasoning.",
            intentDescriptionEn:
              "Grade 5–6 map-symbol interpretation using legends, multiple symbols, and landscape/region reasoning.",
          },
        },
      },
    },
  },
  history: {
    "H-01": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-01: G6-only history; lower bands null." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-01: G6-only history; lower bands null." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-01 default: use bucketOverrides or engine fallback." },
      },
      bucketOverrides: {
        what_is_history: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 historical concepts and source terminology. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 historical concepts and source terminology.",
            intentDescriptionEn: "Grade 6 historical concepts and source terminology.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed historical concept identification. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed historical concept identification.",
            intentDescriptionEn: "Grade 6 mixed historical concept identification.",
          },
        },
      },
    },
    "H-02": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-02: G6-only." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-02: G6-only." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-02 default: use bucketOverrides." },
      },
      bucketOverrides: {
        hasmonaeans: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Hasmonaean timeline sequencing. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Hasmonaean timeline sequencing.",
            intentDescriptionEn: "Grade 6 Hasmonaean timeline sequencing.",
          },
        },
        rome_jews: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Rome/Judea timeline sequencing. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Rome/Judea timeline sequencing.",
            intentDescriptionEn: "Grade 6 Rome/Judea timeline sequencing.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed timeline sequencing. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed timeline sequencing.",
            intentDescriptionEn: "Grade 6 mixed timeline sequencing.",
          },
        },
      },
    },
    "H-03": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-03: G6-only." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-03: G6-only." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-03 default: use bucketOverrides." },
      },
      bucketOverrides: {
        hellenism_jews: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Hellenism/Judaism cause-effect. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Hellenism/Judaism cause-effect.",
            intentDescriptionEn: "Grade 6 Hellenism/Judaism cause-effect.",
          },
        },
        hasmonaeans: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Hasmonaean cause-effect. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Hasmonaean cause-effect.",
            intentDescriptionEn: "Grade 6 Hasmonaean cause-effect.",
          },
        },
        rome_jews: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Rome/Judea cause-effect. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Rome/Judea cause-effect.",
            intentDescriptionEn: "Grade 6 Rome/Judea cause-effect.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed cause-effect. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed cause-effect.",
            intentDescriptionEn: "Grade 6 mixed cause-effect.",
          },
        },
      },
    },
    "H-04": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-04: G6-only." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-04: G6-only." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-04 default: use bucketOverrides." },
      },
      bucketOverrides: {
        classical_greece: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Athens/Sparta comparison. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Athens/Sparta comparison.",
            intentDescriptionEn: "Grade 6 Athens/Sparta comparison.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed historical comparison. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed historical comparison.",
            intentDescriptionEn: "Grade 6 mixed historical comparison.",
          },
        },
      },
    },
    "H-05": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-05: G6-only." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-05: G6-only." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-05 default: use bucketOverrides." },
      },
      bucketOverrides: {
        hellenism_jews: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Hellenism figures and roles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Hellenism figures and roles.",
            intentDescriptionEn: "Grade 6 Hellenism figures and roles.",
          },
        },
        rome_jews: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Rome/Judea figures and roles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Rome/Judea figures and roles.",
            intentDescriptionEn: "Grade 6 Rome/Judea figures and roles.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed figures and roles. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed figures and roles.",
            intentDescriptionEn: "Grade 6 mixed figures and roles.",
          },
        },
      },
    },
    "H-06": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-06: G6-only." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-06: G6-only." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-06 default: use bucketOverrides." },
      },
      bucketOverrides: {
        classical_greece: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 classical Greece governance. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 classical Greece governance.",
            intentDescriptionEn: "Grade 6 classical Greece governance.",
          },
        },
        hasmonaeans: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Hasmonaean governance. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Hasmonaean governance.",
            intentDescriptionEn: "Grade 6 Hasmonaean governance.",
          },
        },
        rome_jews: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Roman/Judean governance. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Roman/Judean governance.",
            intentDescriptionEn: "Grade 6 Roman/Judean governance.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed governance institutions. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed governance institutions.",
            intentDescriptionEn: "Grade 6 mixed governance institutions.",
          },
        },
      },
    },
    "H-07": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-07: G6-only." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-07: G6-only." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-07 default: use bucketOverrides." },
      },
      bucketOverrides: {
        classical_greece: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Greek culture and legacy. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Greek culture and legacy.",
            intentDescriptionEn: "Grade 6 Greek culture and legacy.",
          },
        },
        rome_jews: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 Roman culture and legacy. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 Roman culture and legacy.",
            intentDescriptionEn: "Grade 6 Roman culture and legacy.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed culture and heritage. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed culture and heritage.",
            intentDescriptionEn: "Grade 6 mixed culture and heritage.",
          },
        },
      },
    },
    "H-08": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-08: G6-only." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-08: G6-only." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-08 default: use bucketOverrides." },
      },
      bucketOverrides: {
        what_is_history: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 simple historical source reading. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 simple historical source reading.",
            intentDescriptionEn: "Grade 6 simple historical source reading.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed source comprehension. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed source comprehension.",
            intentDescriptionEn: "Grade 6 mixed source comprehension.",
          },
        },
      },
    },
    "H-09": {
      defaultBands: {
        g1_g2: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-09: G6-only." },
        g3_g4: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-09: G6-only." },
        g5_g6: { actionTextHe: null, goalTextHe: null, intentDescriptionEn: "H-09 default: use bucketOverrides." },
      },
      bucketOverrides: {
        rome_jews: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 past-present link in Rome/Judea period. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 past-present link in Rome/Judea period.",
            intentDescriptionEn: "Grade 6 past-present link in Rome/Judea period.",
          },
        },
        mixed: {
          g5_g6: {
            actionTextHe: "It helps to practice grade 6 mixed past-present link. After each exercise, ask your child to explain how they got the answer.",
            goalTextHe: "This week, focus on grade 6 mixed past-present link.",
            intentDescriptionEn: "Grade 6 mixed past-present link.",
          },
        },
      },
    },
  },
};
