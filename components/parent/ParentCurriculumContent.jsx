import { burnDownCopy } from "../../lib/learning/burn-down-copy.js";
import {
  ENGLISH_GENERAL_GOALS,
  ENGLISH_GRADES,
  ENGLISH_GRADE_ORDER,
} from "../../data/english-curriculum";
import {
  SCIENCE_GENERAL_GOALS,
  SCIENCE_GRADES,
  SCIENCE_GRADE_ORDER,
} from "../../data/science-curriculum";
import {
  TOPICS,
  TOPIC_SHAPES,
  topicDescriptionForCurriculumPage,
  GRADES,
} from "../../utils/geometry-constants";

const GRADE_KEYS = ["g1", "g2", "g3", "g4", "g5", "g6"];

const GRADE_LABEL = {
  g1: "1",
  g2: "2",
  g3: "3",
  g4: "4",
  g5: "5",
  g6: "6",
};


export const PARENT_CURRICULUM_SUBJECTS = [
  { key: "math", title: "Math" },
  { key: "geometry", title: "Geometry" },
  { key: "english", title: "English" },
  { key: "science", title: "Science" },
];

const subjectTitles = {
  math: "Math",
  geometry: "Geometry",
  english: "English",
  science: "Science",
};

const subjectDescriptions = {
  math:
    "Tailored by grade, topic, and practice level (regular / advanced) - as shown on the Math page. Aligned with the topics commonly taught in elementary schools.",
  english:
    "Tailored by grade, topic, and practice level (regular / advanced) - as shown on the English page. Aligned with the topics commonly taught in elementary schools.",
  science:
    "Tailored by grade, topic, and practice level (regular only) - as shown on the Science page. Aligned with the topics commonly taught in elementary schools.",
  geometry:
    "Tailored by grade, topic, and practice level (regular / advanced) - as shown on the Geometry page. Aligned with the topics commonly taught in elementary schools.",
};

function GeometryCurriculumBody() {
  const getTopicName = (topicKey) => {
    return TOPICS[topicKey]?.name || topicKey;
  };

  const shapeNames = {
    square: burnDownCopy("components__parent__ParentCurriculumContent", "square"),
    rectangle: burnDownCopy("components__parent__ParentCurriculumContent", "rectangle"),
    triangle: burnDownCopy("components__parent__ParentCurriculumContent", "triangle"),
    quadrilateral: burnDownCopy("components__parent__ParentCurriculumContent", "quadrilateral"),
    circle: burnDownCopy("components__parent__ParentCurriculumContent", "circle"),
    parallelogram: burnDownCopy("components__parent__ParentCurriculumContent", "parallelogram"),
    trapezoid: burnDownCopy("components__parent__ParentCurriculumContent", "trapezoid"),
    rectangular_prism: burnDownCopy("components__parent__ParentCurriculumContent", "rectangular_prism"),
    cube: "Cube",
    cylinder: burnDownCopy("components__parent__ParentCurriculumContent", "cylinder"),
    sphere: burnDownCopy("components__parent__ParentCurriculumContent", "sphere"),
    cone: "Cone",
    pyramid: burnDownCopy("components__parent__ParentCurriculumContent", "pyramid"),
    prism: "Prism",
  };

  const getShapesForGradeTopic = (gradeKey, topicKey) => {
    const shapes = TOPIC_SHAPES[topicKey]?.[gradeKey] || [];
    return shapes.map((s) => shapeNames[s] || s).join(", ");
  };

  const topicKeysForProduct = Object.keys(TOPICS).filter((k) => k !== "mixed");
  const topicCountLabel = String(topicKeysForProduct.length);

  return (
<div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 md:p-6">
            <div className="max-w-none text-slate-800">
              <div className="bg-teal-50 border border-teal-200 border-r-4 border-r-teal-600 shadow-sm p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-2">General structure</h3>
                <ul className="list-disc pr-6 space-y-2">
                  <li>
                    <strong>6 grades</strong>: 1st, 2nd, 3rd, 4th, 5th, 6th
                  </li>
                  <li>
                    <strong>{burnDownCopy("components__parent__ParentCurriculumContent", "two_practice_levels_regular_and_advanced")}</strong> for every grade
                  </li>
                  <li>
                    <strong>{topicCountLabel} geometry topics</strong> (not counting &quot;Mixed&quot; as a separate topic in this count)
                  </li>
                </ul>
                <p className="text-sm text-slate-600 mt-3">
                  Aligned with the topics commonly taught in elementary schools.
                </p>
              </div>

              {GRADE_KEYS.map((gradeKey) => {
                const topics = GRADES[gradeKey]?.topics || [];
                return (
                  <div
                    key={gradeKey}
                    className="bg-sky-100/70 border border-sky-200 border-r-4 border-r-sky-600 shadow-sm p-4 rounded-lg mb-6"
                  >
                    <h2 className="text-2xl font-bold mb-3">Grade {GRADE_LABEL[gradeKey]}</h2>
                    <h3 className="text-lg font-semibold mb-2">Topics for this grade:</h3>
                    <ol className="list-decimal pr-6 space-y-1 mb-4">
                      {topics.map((tk) => {
                        const desc = topicDescriptionForCurriculumPage(gradeKey, tk);
                        return (
                        <li key={tk}>
                          <span className="font-semibold">{getTopicName(tk)}</span>
                          {desc ? (
                            <span className="text-slate-700"> - {desc}</span>
                          ) : null}
                        </li>
                      );
                      })}
                    </ol>
                    <div className="bg-white/80 border border-slate-200 p-3 rounded-lg mb-3 shadow-sm">
                      <h4 className="font-semibold mb-2">Shapes and examples by topic:</h4>
                      <div className="text-sm space-y-1">
                        {topics.map((tk) => {
                          const shapesLine = getShapesForGradeTopic(gradeKey, tk);
                          if (!shapesLine) return null;
                          return (
                            <div key={`${gradeKey}-${tk}`}>
                              <strong>{getTopicName(tk)}:</strong> {shapesLine}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="bg-teal-50 border border-teal-200 border-r-4 border-r-teal-600 shadow-sm p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-center">General summary</h3>
                <p className="text-center mb-3">
                  The system covers <strong>{topicCountLabel} geometry topics</strong> (plus a mixed mode where available), across
                  <strong>{burnDownCopy("components__parent__ParentCurriculumContent", "six_grades")}</strong> and <strong>{burnDownCopy("components__parent__ParentCurriculumContent", "two_practice_levels_regular_and_advanced_2")}</strong>.
                </p>
                <p className="text-center text-sm text-slate-700">
                  Aligned with the topics commonly taught in elementary schools.
                </p>
              </div>
            </div>
          </div>
  );
}

/**
 * Full site curriculum browse content for the parent portal.
 * Data-driven subjects import the same catalogs as /learning/curriculum;
 * math body is copied from that page; geometry body mirrors geometry-curriculum.js.
 * Cross-subject links call onSelectSubject instead of student-protected routes.
 */
export default function ParentCurriculumContent({ subject, onSelectSubject }) {
  const englishGrades = ENGLISH_GRADE_ORDER.map((key) => ENGLISH_GRADES[key]);
  const scienceGrades = SCIENCE_GRADE_ORDER.map((key) => SCIENCE_GRADES[key]);

  const subjectTitle = subjectTitles[subject] || subjectTitles.math;
  const subjectDescription = subjectDescriptions[subject] || subjectDescriptions.math;

  const isEnglish = subject === "english";
  const isScience = subject === "science";
  const isGeometry = subject === "geometry";

  return (
    <div className="space-y-4">
      <header className="text-center space-y-2">
        <h3 className="text-xl md:text-2xl font-black text-sky-800">
          Site curriculum - {subjectTitle}
        </h3>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          {subjectDescription}
        </p>
      </header>

      {isEnglish ? (
<div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 md:p-6">
              <div className="bg-sky-100/70 border border-sky-200 border-r-4 border-r-sky-600 shadow-sm p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-2">General goals</h3>
                <ul className="list-disc pr-6 space-y-2">
                  {ENGLISH_GENERAL_GOALS.map((goal, idx) => (
                    <li key={`goal-${idx}`}>{goal}</li>
                  ))}
                </ul>
              </div>
              {englishGrades.map((grade) => (
                <div
                  key={grade.key}
                  className="bg-sky-50 border border-sky-200 border-r-4 border-r-sky-500 shadow-sm p-4 rounded-lg mb-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <h2 className="text-2xl font-bold">{grade.name}</h2>
                    <span className="text-sm text-slate-600">{grade.stage}</span>
                  </div>
                  {grade.curriculum?.summary && (
                    <p className="text-sm text-slate-700 mb-3">
                      {grade.curriculum.summary}
                    </p>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">Learning focus areas</h4>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                        {grade.curriculum?.focus?.map((item, idx) => (
                          <li key={`focus-${grade.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">Key skills</h4>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                        {grade.curriculum?.skills?.map((item, idx) => (
                          <li key={`skills-${grade.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">Grammar and structures</h4>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                        {grade.curriculum?.grammar?.map((item, idx) => (
                          <li key={`grammar-${grade.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">Vocabulary topics</h4>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                        {grade.curriculum?.vocabulary?.map((item, idx) => (
                          <li key={`vocab-${grade.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold mb-1 text-slate-900">Benchmark goals</h4>
                    <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                      {grade.curriculum?.benchmark?.map((item, idx) => (
                        <li key={`benchmark-${grade.key}-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
      ) : isScience ? (
<div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 md:p-6">
              <div className="bg-teal-50 border border-teal-200 border-r-4 border-r-teal-600 shadow-sm p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-2">General goals</h3>
                <ul className="list-disc pr-6 space-y-2">
                  {SCIENCE_GENERAL_GOALS.map((goal, idx) => (
                    <li key={`science-goal-${idx}`}>{goal}</li>
                  ))}
                </ul>
              </div>

              {scienceGrades.map((grade) => (
                <div
                  key={grade.key}
                  className="bg-teal-50 border border-teal-200 border-r-4 border-r-teal-500 shadow-sm p-4 rounded-lg mb-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <h2 className="text-2xl font-bold">{grade.name}</h2>
                    <span className="text-sm text-slate-600">{grade.stage}</span>
                  </div>
                  {grade.curriculum?.summary && (
                    <p className="text-sm text-slate-700 mb-3">
                      {grade.curriculum.summary}
                    </p>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">Core topics</h4>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                        {grade.curriculum?.focus?.map((item, idx) => (
                          <li key={`science-focus-${grade.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">Skills</h4>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                        {grade.curriculum?.skills?.map((item, idx) => (
                          <li key={`science-skills-${grade.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">Inquiry and hands-on exploration</h4>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                        {grade.curriculum?.inquiry?.map((item, idx) => (
                          <li key={`science-inquiry-${grade.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">Technology connections</h4>
                      <ul className="list-disc pr-5 space-y-1 text-sm text-slate-700">
                        {grade.curriculum?.technology?.map((item, idx) => (
                          <li key={`science-tech-${grade.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
      ) : isGeometry ? (
        <GeometryCurriculumBody />
      ) : (
<div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4 md:p-6">
              <div className="max-w-none text-slate-800">
                <div className="bg-teal-50 border border-teal-200 border-r-4 border-r-teal-600 shadow-sm p-4 rounded-lg mb-6">
                  <h3 className="text-xl font-bold mb-2">General structure</h3>
                  <ul className="list-disc pr-6 space-y-2">
                    <li><strong>6 grades</strong>: 1st, 2nd, 3rd, 4th, 5th, 6th</li>
                    <li><strong>2 practice levels</strong>{burnDownCopy("components__parent__ParentCurriculumContent", "per_grade_regular_advanced")}</li>
                    <li><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "topics_by_grade")}</strong> - as shown on the Math page</li>
                  </ul>
                </div>

                {/* */}
                <div className="bg-sky-100/70 border border-sky-200 border-r-4 border-r-sky-600 shadow-sm p-4 rounded-lg mb-6">
                  <h2 className="text-2xl font-bold mb-3">Grade 1</h2>
                  <h3 className="text-lg font-semibold mb-2">Available topics:</h3>
                  <ol className="list-decimal pr-6 space-y-1 mb-4">
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "addition_including_addition_with_whole_tens_and_crossing_into_the_second")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "subtraction_including_subtraction_with_whole_tens_and_crossing_into_the_")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "multiplication_up_to_20")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "comparison")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "number_sense_neighboring_numbers_even_odd_making_10")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "word_problems_addition_and_subtraction_problems_money_time_quantities")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "mixed_mixed_exercises_drawn_from_the_topics_above")}</li>
                  </ol>
                  <div className="bg-white/80 border border-slate-200 p-3 rounded-lg mb-3 shadow-sm">
                    <h4 className="font-semibold mb-2">Practice levels (regular / advanced):</h4>
                    <div className="text-sm space-y-2">
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "regular")}</strong> addition from 10 to 20 (including addition with whole tens and crossing into the second ten), subtraction from 10 to 20, multiplication up to 5×5, comparison from 10 to 20, number sense from 10 to 20 (number line, counting), word problems up to 20, mixed</div>
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "advanced")}</strong>{burnDownCopy("components__parent__ParentCurriculumContent", "addition_up_to_30_subtraction_up_to_30_multiplication_up_to_5_5_comparis")}</div>
                    </div>
                  </div>
                </div>

                {/* */}
                <div className="bg-sky-100/70 border border-sky-200 border-r-4 border-r-sky-600 shadow-sm p-4 rounded-lg mb-6">
                  <h2 className="text-2xl font-bold mb-3">Grade 2</h2>
                  <h3 className="text-lg font-semibold mb-2">Available topics:</h3>
                  <ol className="list-decimal pr-6 space-y-1 mb-4">
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "addition")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "subtraction")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "multiplication_times_tables_up_to_10_10")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "division_based_on_the_times_tables")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "fractions_half_quarter_and_parts_of_a_whole_basic_introduction_only")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "comparison")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "number_sense")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "word_problems_addition_subtraction_multiplication_and_division_problems_")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "mixed_mixed_exercises_within_the_range_of_1_000")}</li>
                  </ol>
                  <div className="bg-white/80 border border-slate-200 p-3 rounded-lg mb-3 shadow-sm">
                    <h4 className="font-semibold mb-2">Practice levels (regular / advanced):</h4>
                    <div className="text-sm space-y-2">
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "regular")}</strong> addition/subtraction from 50 to 100, multiplication from 5×5 to 10×10, division from 50 to 100, half/quarter fractions, comparison up to 1,000, word problems up to 100</div>
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "advanced")}</strong>{burnDownCopy("components__parent__ParentCurriculumContent", "addition_subtraction_up_to_100_multiplication_up_to_10_10_division_up_to")}</div>
                    </div>
                  </div>
                </div>

                {/* */}
                <div className="bg-sky-100/70 border border-sky-200 border-r-4 border-r-sky-600 shadow-sm p-4 rounded-lg mb-6">
                  <h2 className="text-2xl font-bold mb-3">Grade 3</h2>
                  <h3 className="text-lg font-semibold mb-2">Available topics:</h3>
                  <ol className="list-decimal pr-6 space-y-1 mb-4">
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "addition")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "subtraction")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "multiplication_including_multiplication_with_whole_tens_and_whole_hundre")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "division_including_division_with_remainders")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "fractions_introduction_to_fractions_as_part_of_a_whole")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "sequences")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "decimals_basic_decimals")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "divisibility_rules_by_2_5_10")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "order_of_operations_and_using_parentheses")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "comparison")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "number_sense_including_simple_number_completion_balancing_not_algebraic_")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "word_problems")}</li>
                    <li>{burnDownCopy("components__parent__ParentCurriculumContent", "mixed")}</li>
                  </ol>
                  <div className="bg-white/80 border border-slate-200 p-3 rounded-lg mb-3 shadow-sm">
                    <h4 className="font-semibold mb-2">Practice levels (regular / advanced):</h4>
                    <div className="text-sm space-y-2">
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "regular")}</strong> addition/subtraction from 200 to 500, multiplication from 10 to 12 (including multiplication with tens and hundreds), division from 100 to 144 (with remainders), fractions with denominators from 4 to 6, sequences starting from 20 to 50, decimals up to a base of 50, divisibility rules by 2, 5, 10, order of operations with parentheses, comparison up to 10,000, word problems</div>
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "advanced")}</strong> addition/subtraction up to 1,000, multiplication up to 12 (including multiplication with tens and hundreds), division up to 200 (with remainders), fractions with denominators up to 6, sequences starting up to 50, decimals up to a base of 50, divisibility rules by 2, 5, 10, order of operations with parentheses, comparison up to 10,000, word problems</div>
                    </div>
                  </div>
                </div>

              {/* */}
              <div className="bg-sky-100/70 border border-sky-200 border-r-4 border-r-sky-600 shadow-sm p-4 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-3">Grade 4</h2>
                <h3 className="text-lg font-semibold mb-2">Available topics:</h3>
                <ol className="list-decimal pr-6 space-y-1 mb-4">
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "addition")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "subtraction")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "multiplication_including_column_vertical_multiplication_multi_digit_fact")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "division_including_long_division_single_digit_divisor_or_a_whole_ten")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "fractions_simple_fractions_meaning_and_comparison")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "decimals")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "sequences")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "rounding")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "divisibility_rules_by_3_6_9")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "prime_and_composite_numbers")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "powers_exponents")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "estimation_and_developing_number_sense")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "properties_of_0_and_1")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "equations")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "comparison")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "number_sense")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "factors_and_multiples")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "mixed")}</li>
                </ol>
                <div className="bg-white/80 border border-slate-200 p-3 rounded-lg mb-3 shadow-sm">
                  <h4 className="font-semibold mb-2">Practice levels (regular / advanced):</h4>
                  <div className="text-sm space-y-2">
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "regular")}</strong> addition/subtraction from 1,000 to 5,000, multiplication from 20×20 to 30×30 (including column multiplication), division from 200 to 500 (including long division), fractions with denominators from 6 to 8, rounding from 999 to the nearest ten and up to 9,999 to the nearest hundred, divisibility rules by 3, 6, 9, prime numbers from 100 to 200, powers with base up to 10^3, estimation, properties of 0 and 1, factors/multiples from 100 to 200, comparison up to one million</div>
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "advanced")}</strong> addition/subtraction up to 10,000, multiplication up to 25×25 (including column multiplication), division up to 1,000 (including long division), fractions with denominators up to 8, rounding up to 9,999 to the nearest hundred, divisibility rules by 3, 6, 9, prime numbers up to 500, powers with base up to 10^3, estimation, properties of 0 and 1, factors/multiples up to 500, comparison up to one million</div>
                    </div>
                </div>
              </div>

              {/* */}
              <div className="bg-sky-100/70 border border-sky-200 border-r-4 border-r-sky-600 shadow-sm p-4 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-3">Grade 5</h2>
                <h3 className="text-lg font-semibold mb-2">Available topics:</h3>
                <ol className="list-decimal pr-6 space-y-1 mb-4">
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "addition")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "subtraction")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "multiplication")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "division_including_division_by_a_two_digit_number")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "fractions_including_simplifying_expanding_addition_and_subtraction_mixed")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "percentages")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "sequences")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "decimals")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "rounding")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "estimating_the_results_of_operations")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "equations")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "comparison")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "number_sense")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "factors_and_multiples")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "word_problems_including_averages")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "mixed")}</li>
                </ol>
                <div className="bg-white/80 border border-slate-200 p-3 rounded-lg mb-3 shadow-sm">
                  <h4 className="font-semibold mb-2">Practice levels (regular / advanced):</h4>
                  <div className="text-sm space-y-2">
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "regular")}</strong> addition/subtraction from 10,000 to 50,000, multiplication from 30×30 to 50×50, fractions (including mixed numbers), percentages with a base from 400 to 1,000, estimation, word problems from 10,000 to 50,000</div>
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "advanced")}</strong> addition/subtraction up to 100,000, multiplication up to 99×99, fractions (including mixed numbers), percentages with a base up to 2,000, estimation, word problems up to 100,000, negative numbers</div>
                    </div>
                </div>
              </div>

              {/* */}
              <div className="bg-sky-100/70 border border-sky-200 border-r-4 border-r-sky-600 shadow-sm p-4 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-3">Grade 6</h2>
                <h3 className="text-lg font-semibold mb-2">Available topics:</h3>
                <ol className="list-decimal pr-6 space-y-1 mb-4">
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "addition")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "subtraction")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "multiplication")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "division")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "fractions_including_multiplying_and_dividing_fractions_fractions_as_divi")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "percentages")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "ratio")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "sequences")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "decimals_including_multiplying_and_dividing_by_10_100_repeating_decimals")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "rounding")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "scale_on_maps_and_models")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "equations")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "comparison")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "number_sense")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "factors_and_multiples")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "word_problems")}</li>
                  <li>{burnDownCopy("components__parent__ParentCurriculumContent", "mixed")}</li>
                </ol>
                <div className="bg-white/80 border border-slate-200 p-3 rounded-lg mb-3 shadow-sm">
                  <h4 className="font-semibold mb-2">Practice levels (regular / advanced):</h4>
                  <div className="text-sm space-y-2">
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "regular")}</strong> addition/subtraction from 50,000 to 100,000, multiplication from 100×100 to 200×200, division by a two-digit number, fractions (including multiplication/division, fractions as division quotients), percentages with a base from 1,000 to 2,000, decimals (including multiplication/division by 10/100, repeating decimals), scale, word problems from 50,000 to 100,000</div>
                      <div><strong>{burnDownCopy("components__parent__ParentCurriculumContent", "advanced")}</strong> addition/subtraction up to 200,000, multiplication up to 500×500, division by a two-digit number, fractions (including multiplication/division, fractions as division quotients), percentages with a base up to 5,000, decimals (including multiplication/division by 10/100, repeating decimals), scale, word problems up to 200,000, negative numbers</div>
                    </div>
                </div>
              </div>

              {/* */}
              <div className="bg-teal-50 border border-teal-200 border-r-4 border-r-teal-600 shadow-sm p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-center">General summary</h3>
                <p className="text-center">
                  The system is tailored by grade, topic, and practice level: <strong>6 grades</strong>, <strong>{burnDownCopy("components__parent__ParentCurriculumContent", "regular_advanced")}</strong>, and the topics shown above and on the Math page. Aligned with the topics commonly taught in elementary schools.
                </p>
              </div>
            </div>
            </div>
      )}
    </div>
  );
}

