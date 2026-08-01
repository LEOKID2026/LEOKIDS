/**
 * Authoritative Geometry /  page → diagram mapping.
 * `null` = intentionally no diagram (topic too vague or no safe visual).
 *
 * @typedef {{ diagramType: string || null, topicHe: string, conceptHe: string }} GeometryPageDiagramSpec
 */

/** @type {Record<string, Record<string, GeometryPageDiagramSpec>>} */
export const GEOMETRY_PAGE_DIAGRAM_BY_GRADE = Object.freeze({
  g1: Object.freeze({
    shapes_basic_square: {
      diagramType: "square_sides",
      topicHe: "",
      conceptHe: "",
    },
    shapes_basic_rectangle: {
      diagramType: "rectangle_sides",
      topicHe: "",
      conceptHe: "",
    },
    transformations: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
  }),
  g2: Object.freeze({
    solids: {
      diagramType: "cube_basic",
      topicHe: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topicHe: "",
      conceptHe: "",
    },
    transformations: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
  }),
  g3: Object.freeze({
    triangles: {
      diagramType: "triangle_parts",
      topicHe: "",
      conceptHe: "",
    },
    quadrilaterals: {
      diagramType: "quadrilateral_parts",
      topicHe: "",
      conceptHe: "",
    },
    parallel_perpendicular: {
      diagramType: "parallel_lines",
      topicHe: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topicHe: "",
      conceptHe: "",
    },
    square_perimeter: {
      diagramType: "square_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    triangle_perimeter: {
      diagramType: "triangle_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    triangle_angles: {
      diagramType: "angle_basic",
      topicHe: "",
      conceptHe: "",
    },
    rotation: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
    solids: {
      diagramType: "cube_basic",
      topicHe: "",
      conceptHe: "",
    },
  }),
  g4: Object.freeze({
    shapes_basic_properties_square: {
      diagramType: "square_sides",
      topicHe: "",
      conceptHe: "",
    },
    shapes_basic_properties_rectangle: {
      diagramType: "rectangle_sides",
      topicHe: "",
      conceptHe: "",
    },
    shapes_basic_properties_angles: {
      diagramType: "right_angle",
      topicHe: "",
      conceptHe: "",
    },
    symmetry: {
      diagramType: "symmetry_line",
      topicHe: "",
      conceptHe: "",
    },
    quadrilaterals: {
      diagramType: "quadrilateral_parts",
      topicHe: "",
      conceptHe: "",
    },
    parallel_perpendicular: {
      diagramType: "parallel_lines",
      topicHe: "",
      conceptHe: "",
    },
    square_perimeter: {
      diagramType: "square_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topicHe: "",
      conceptHe: "",
    },
    triangle_perimeter: {
      diagramType: "triangle_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    triangle_angles: {
      diagramType: "angle_basic",
      topicHe: "",
      conceptHe: "",
    },
    diagonal_square: {
      diagramType: "square_diagonal",
      topicHe: "",
      conceptHe: "",
    },
    diagonal_rectangle: {
      diagramType: "rectangle_diagonal",
      topicHe: "",
      conceptHe: "",
    },
    solids: {
      diagramType: "cube_basic",
      topicHe: "",
      conceptHe: "",
    },
    rectangular_prism_volume: {
      diagramType: "box_basic",
      topicHe: "",
      conceptHe: "",
    },
  }),
  g5: Object.freeze({
    parallel_perpendicular: {
      diagramType: "parallel_lines",
      topicHe: "",
      conceptHe: "",
    },
    quadrilaterals: {
      diagramType: "quadrilateral_parts",
      topicHe: "",
      conceptHe: "",
    },
    triangle_angles: {
      diagramType: "angle_basic",
      topicHe: "",
      conceptHe: "",
    },
    square_perimeter: {
      diagramType: "square_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    triangle_perimeter: {
      diagramType: "triangle_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topicHe: "",
      conceptHe: "",
    },
    triangle_area: {
      diagramType: "triangle_height",
      topicHe: "",
      conceptHe: "",
    },
    parallelogram_area: {
      diagramType: "parallelogram_area",
      topicHe: "",
      conceptHe: "",
    },
    trapezoid_area: {
      diagramType: "trapezoid_area",
      topicHe: "",
      conceptHe: "",
    },
    heights_triangle: {
      diagramType: "triangle_height",
      topicHe: "",
      conceptHe: "",
    },
    heights_parallelogram: {
      diagramType: "parallelogram_height",
      topicHe: "",
      conceptHe: "",
    },
    heights_trapezoid: {
      diagramType: "trapezoid_height",
      topicHe: "",
      conceptHe: "",
    },
    diagonal_square: {
      diagramType: "square_diagonal",
      topicHe: "",
      conceptHe: "",
    },
    diagonal_rectangle: {
      diagramType: "rectangle_diagonal",
      topicHe: "",
      conceptHe: "",
    },
    diagonal_parallelogram: {
      diagramType: "parallelogram_diagonal",
      topicHe: "",
      conceptHe: "",
    },
    solids: {
      diagramType: "cube_basic",
      topicHe: "",
      conceptHe: "",
    },
    rectangular_prism_volume: {
      diagramType: "box_basic",
      topicHe: "",
      conceptHe: "",
    },
    tiling: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
  }),
  g6: Object.freeze({
    square_perimeter: {
      diagramType: "square_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    triangle_perimeter: {
      diagramType: "triangle_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topicHe: "",
      conceptHe: "",
    },
    parallelogram_area: {
      diagramType: "parallelogram_area",
      topicHe: "",
      conceptHe: "",
    },
    trapezoid_area: {
      diagramType: "trapezoid_area",
      topicHe: "",
      conceptHe: "",
    },
    triangle_angles: {
      diagramType: "angle_basic",
      topicHe: "",
      conceptHe: "",
    },
    circle_perimeter: {
      diagramType: "circle_perimeter",
      topicHe: "",
      conceptHe: "",
    },
    circle_area: {
      diagramType: "circle_area",
      topicHe: "",
      conceptHe: "",
    },
    pythagoras_hyp: {
      diagramType: "right_triangle",
      topicHe: "",
      conceptHe: "",
    },
    pythagoras_leg: {
      diagramType: "right_triangle",
      topicHe: "",
      conceptHe: "",
    },
    solids: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
    rectangular_prism_volume: {
      diagramType: "box_basic",
      topicHe: "",
      conceptHe: "",
    },
    prism_volume_rectangular: {
      diagramType: "box_basic",
      topicHe: "",
      conceptHe: "",
    },
    prism_volume_triangle: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
    pyramid_volume_square: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
    pyramid_volume_rectangular: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
    cylinder_volume: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
    cone_volume: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
    sphere_volume: {
      diagramType: null,
      topicHe: "",
      conceptHe: "",
    },
  }),
});

/** Which shape family each diagram type represents (for mismatch detection). */
export const GEOMETRY_DIAGRAM_SHAPE_FAMILY = Object.freeze({
  triangle_parts: "triangle",
  triangle_perimeter: "triangle",
  triangle_height: "triangle",
  angle_basic: "angle",
  right_angle: "angle",
  right_triangle: "triangle",
  quadrilateral_parts: "quadrilateral",
  rectangle_sides: "rectangle",
  rectangle_diagonal: "rectangle",
  square_sides: "square",
  square_perimeter: "square",
  square_area_grid: "square",
  square_diagonal: "square",
  parallelogram_area: "parallelogram",
  parallelogram_height: "parallelogram",
  parallelogram_diagonal: "parallelogram",
  trapezoid_area: "trapezoid",
  trapezoid_height: "trapezoid",
  symmetry_line: "triangle",
  parallel_lines: "lines",
  circle_radius: "circle",
  circle_perimeter: "circle",
  circle_area: "circle",
  cube_basic: "solid",
  box_basic: "solid",
  perimeter_path: "rectangle",
  area_grid: "square",
});

/** Page IDs that must use a given shape family when a diagram is present. */
export const GEOMETRY_PAGE_SHAPE_REQUIREMENT = Object.freeze({
  triangle_perimeter: "triangle",
  heights_triangle: "triangle",
  square_perimeter: "square",
  square_area: "square",
  shapes_basic_square: "square",
  shapes_basic_properties_square: "square",
  diagonal_square: "square",
  shapes_basic_rectangle: "rectangle",
  shapes_basic_properties_rectangle: "rectangle",
  diagonal_rectangle: "rectangle",
  parallelogram_area: "parallelogram",
  heights_parallelogram: "parallelogram",
  diagonal_parallelogram: "parallelogram",
  trapezoid_area: "trapezoid",
  heights_trapezoid: "trapezoid",
  circle_perimeter: "circle",
  circle_area: "circle",
  triangles: "triangle",
  symmetry: "triangle",
});

/**
 * @param {string} grade
 * @param {string} pageId
 * @returns {GeometryPageDiagramSpec || null}
 */
export function getGeometryPageDiagramSpec(grade, pageId) {
  return GEOMETRY_PAGE_DIAGRAM_BY_GRADE[String(grade)]?.[String(pageId)] ?? null;
}

/**
 * @param {string} grade
 * @param {string} pageId
 * @returns {string || null}
 */
export function getRequiredGeometryDiagramType(grade, pageId) {
  return getGeometryPageDiagramSpec(grade, pageId)?.diagramType ?? null;
}

/**
 * @param {string} pageId
 * @param {string} diagramType
 * @returns {boolean}
 */
export function isDiagramShapeMismatch(pageId, diagramType) {
  if (!diagramType) return false;
  const required = GEOMETRY_PAGE_SHAPE_REQUIREMENT[pageId];
  if (!required) return false;
  const family = GEOMETRY_DIAGRAM_SHAPE_FAMILY[diagramType];
  if (!family) return true;
  if (required === "triangle" && family !== "triangle" && family !== "angle") {
    return true;
  }
  return family !== required && !(required === "angle" && family === "angle");
}
