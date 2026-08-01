// Geometry page constants

export const LEVELS = {
  easy: {
    name: "Easy",
    maxSide: 10,
    decimals: false,
  },
  medium: {
    name: "Medium",
    maxSide: 20,
    decimals: true,
  },
  hard: {
    name: "Hard",
    maxSide: 50,
    decimals: true,
  },
};

export const PI = 3.14;

export const TOPICS = {
  shapes_basic: { name: "Basic shapes", description: "Introducing polygons", icon: "🔷" },
  /** Default subtitles — detailed grades 1–3 use `topicDescriptionForCurriculumPage` on the curriculum page */
  area: { name: "Area", description: "Calculate area", icon: "📐" },
  perimeter: { name: "Perimeter", description: "Calculate perimeter", icon: "📏" },
  volume: { name: "Volume", description: "Calculate volume", icon: "📦" },
  angles: { name: "Angles", description: "Angles", icon: "📐" },
  parallel_perpendicular: { name: "Parallel & perpendicular", description: "Parallel and perpendicular lines", icon: "📐" },
  triangles: { name: "Triangles", description: "Classify triangles", icon: "🔺" },
  quadrilaterals: { name: "Quadrilaterals", description: "Classify quadrilaterals", icon: "⬜" },
  transformations: { name: "Transformations", description: "Translation, reflection, rotation", icon: "🔄" },
  rotation: { name: "Rotation", description: "Rotation", icon: "🔄" },
  symmetry: { name: "Symmetry", description: "Symmetry", icon: "✨" },
  diagonal: { name: "Diagonal", description: "Diagonal", icon: "📐" },
  heights: { name: "Heights", description: "Heights", icon: "📏" },
  tiling: { name: "Tiling", description: "Tiling", icon: "🔲" },
  circles: { name: "Circles", description: "Circles and disks", icon: "⭕" },
  solids: { name: "Solids", description: "3D solids", icon: "📦" },
  pythagoras: { name: "Pythagoras", description: "Pythagorean theorem", icon: "🔺" },
  mixed: { name: "Mixed", description: "Mixed", icon: "🎲" },
};

/**
 * Subtitles for grades 1–3 on the curriculum transparency page (measurement & geometry).
 * Phrasing: intro / identify / compare / measure — not “formal calculation only”.
 */
export const TOPIC_DESCRIPTION_LOW_GRADES = {
  g1: {
    shapes_basic: "Introducing polygons — identify square and rectangle, basic comparison",
    transformations: "Translation and reflection — introduction (Grade 1 level, no separate rotation)",
  },
  g2: {
    shapes_basic: "Plane shapes — identification and comparison",
    area: "Area measurement — intro, comparison, and covering (by product difficulty)",
    solids: "Polygons and solids — intro and 3D solid names",
    transformations: "Reflection and translation — continued introduction",
  },
  g3: {
    shapes_basic: "Plane shapes — expanded identification",
    angles: "Angles — classification and introduction",
    parallel_perpendicular: "Parallel and perpendicular lines in the plane",
    triangles: "Triangles — classification and introduction",
    quadrilaterals: "Quadrilaterals — classification and introduction",
    area: "Area — measurement and comparison (depth by level)",
    perimeter: "Perimeter — measuring polygons",
    rotation: "Rotation in the plane — basic introduction",
    solids: "3D solids — introduction and names",
  },
};

/** Grades 4–6 — richer phrasing than “calculation only” on the transparency page */
export const TOPIC_DESCRIPTION_MID_HIGH_GRADES = {
  g4: {
    shapes_basic: "Plane shapes — square/rectangle properties and extension",
    angles: "Angles — classification and further development",
    parallel_perpendicular: "Parallel and perpendicular — applied in polygons",
    triangles: "Triangles — properties and classification",
    quadrilaterals: "Quadrilaterals — properties and classification",
    diagonal: "Diagonals in polygons — introduction and practice",
    symmetry: "Symmetry in the plane",
    area: "Area — measurement, comparison, and calculations by level",
    perimeter: "Perimeter — measuring and calculating polygons",
    volume: "Box volume — introduction and basic measurement",
    solids: "3D solids — introduction before volume",
  },
  g5: {
    angles: "Angles — applied in polygons",
    parallel_perpendicular: "Parallel and perpendicular — linked to shapes",
    quadrilaterals: "Quadrilaterals — properties, classification, inclusion",
    solids: "3D solids — introduction and surface area",
    diagonal: "Diagonals — including relationships in quadrilaterals",
    heights: "Heights — linked to area in triangles and quadrilaterals",
    tiling: "Tiling the plane — introduction and examples",
    area: "Area — calculations and comparisons by shape",
    perimeter: "Perimeter — calculating more complex polygons",
    volume: "Volume — boxes and familiar solids",
  },
  g6: {
    solids: "Regular solids — volume and surface area by level",
    circles: "Circles — circumference and area",
    volume: "Volume — various solids by level",
    area: "Area — applications including complex shapes",
    perimeter: "Perimeter — applications including circles",
    angles: "Angles — applied in polygons and problems",
    pythagoras: "Pythagorean theorem — right triangles",
  },
};

/**
 * @param {string} gradeKey g1..g6
 * @param {string} topicKey
 */
export function topicDescriptionForCurriculumPage(gradeKey, topicKey) {
  const low = TOPIC_DESCRIPTION_LOW_GRADES[gradeKey]?.[topicKey];
  if (low) return low;
  const mid = TOPIC_DESCRIPTION_MID_HIGH_GRADES[gradeKey]?.[topicKey];
  if (mid) return mid;
  return TOPICS[topicKey]?.description || "";
}

export const GRADES = {
  g1: {
    name: "Grade 1",
    topics: ["shapes_basic", "transformations"],
    shapes: ["square", "rectangle"],
  },
  g2: {
    name: "Grade 2",
    topics: ["shapes_basic", "area", "solids", "transformations"],
    shapes: ["square", "rectangle", "cube", "rectangular_prism", "cylinder", "pyramid", "cone", "sphere"],
  },
  g3: {
    name: "Grade 3",
    topics: ["shapes_basic", "angles", "parallel_perpendicular", "triangles", "quadrilaterals", "area", "perimeter", "rotation", "solids"],
    shapes: ["triangle", "square", "rectangle", "cube", "rectangular_prism", "cylinder", "pyramid", "cone", "sphere"],
  },
  g4: {
    name: "Grade 4",
    topics: [
      "shapes_basic",
      "angles",
      "parallel_perpendicular",
      "triangles",
      "quadrilaterals",
      "diagonal",
      "symmetry",
      "area",
      "perimeter",
      "volume",
      "solids",
    ],
    shapes: ["square", "rectangle", "triangle", "circle", "rectangular_prism", "cube"],
  },
  g5: {
    name: "Grade 5",
    topics: ["angles", "parallel_perpendicular", "quadrilaterals", "solids", "diagonal", "heights", "tiling", "area", "perimeter", "volume", "mixed"],
    shapes: ["square", "rectangle", "triangle", "circle", "parallelogram", "trapezoid", "rectangular_prism", "cube"],
  },
  g6: {
    name: "Grade 6",
    topics: ["solids", "circles", "volume", "area", "perimeter", "angles", "triangles", "pythagoras", "mixed"],
    shapes: ["square", "rectangle", "triangle", "circle", "parallelogram", "trapezoid", "cylinder", "sphere", "cube", "rectangular_prism", "pyramid", "cone", "prism"],
  },
};

export const TOPIC_SHAPES = {
  shapes_basic: {
    g1: ["square", "rectangle"],
    g2: ["square", "rectangle"],
    g3: ["square", "rectangle", "triangle"],
    g4: ["square", "rectangle"],
  },
  area: {
    g2: ["square", "rectangle"],
    g3: ["square", "rectangle"], // triangle area formula gated to G5+ (geometry-curriculum-gates.js)
    g4: ["square", "rectangle"],
    g5: ["square", "rectangle", "triangle", "parallelogram", "trapezoid"],
    g6: ["square", "rectangle", "triangle", "parallelogram", "trapezoid", "circle"],
  },
  perimeter: {
    g3: ["square", "rectangle", "triangle"],
    g4: ["square", "rectangle", "triangle"],
    g5: ["square", "rectangle", "triangle"],
    g6: ["square", "rectangle", "triangle", "circle"],
  },
  volume: {
    g4: ["rectangular_prism", "cube"],
    g5: ["rectangular_prism", "cube"],
    g6: ["rectangular_prism", "cube", "cylinder", "sphere", "pyramid", "cone", "prism"],
  },
  angles: {
    g3: ["triangle", "quadrilateral"],
    g5: ["triangle", "quadrilateral"],
    g6: ["triangle"],
  },
  parallel_perpendicular: {
    g3: ["square", "rectangle", "quadrilateral"],
    g5: ["square", "rectangle", "parallelogram", "trapezoid"],
  },
  triangles: {
    g3: ["triangle"],
    g6: ["triangle"],
  },
  quadrilaterals: {
    g3: ["square", "rectangle", "quadrilateral"],
    g5: ["square", "rectangle", "parallelogram", "trapezoid"],
  },
  transformations: {
    g1: ["square", "rectangle"],
    g2: ["square", "rectangle"],
  },
  rotation: {
    g3: ["square", "rectangle", "triangle"],
  },
  symmetry: {
    g4: ["square", "rectangle", "triangle"],
    g6: ["square", "rectangle", "triangle"],
  },
  diagonal: {
    g4: ["square", "rectangle"],
    g5: ["square", "rectangle", "parallelogram"],
  },
  heights: {
    g5: ["triangle", "parallelogram", "trapezoid"],
  },
  tiling: {
    g5: ["square", "triangle"],
  },
  circles: {
    g6: ["circle"],
  },
  solids: {
    g2: ["cube", "rectangular_prism", "cylinder", "pyramid", "cone", "sphere"],
    g3: ["cube", "rectangular_prism", "cylinder", "pyramid", "cone", "sphere"],
    g4: ["cube", "rectangular_prism", "cylinder", "pyramid", "cone", "sphere"],
    g5: ["cube", "rectangular_prism", "cylinder", "pyramid", "cone", "sphere"],
    g6: ["cube", "rectangular_prism", "cylinder", "pyramid", "cone", "sphere"],
  },
  pythagoras: {
    g6: ["triangle"],
  },
};

export function getShapesForTopic(gradeKey, topicKey) {
  const cfg = TOPIC_SHAPES[topicKey];
  if (cfg && cfg[gradeKey] && cfg[gradeKey].length > 0) {
    return cfg[gradeKey];
  }
  return GRADES[gradeKey]?.shapes || [];
}

export const MODES = {
  learning: { name: "Learning", description: "No game over — practice at your own pace" },
  challenge: { name: "Challenge", description: "Timer + lives, high-score race" },
  speed: { name: "Speed", description: "Faster answers = more points! ⚡" },
  marathon: { name: "Marathon", description: "How many questions can you solve? 🏃" },
  practice: { name: "Practice", description: "Focus on one topic 📚" },
};

export const STORAGE_KEY = "mleo_geometry_master";

