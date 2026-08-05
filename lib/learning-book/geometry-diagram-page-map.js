/**
 * Authoritative Geometry /  page → diagram mapping.
 * `null` = intentionally no diagram (topic too vague or no safe visual).
 *
 * @typedef {{ diagramType: string || null, topic: string, conceptHe: string }} GeometryPageDiagramSpec
 */

/** @type {Record<string, Record<string, GeometryPageDiagramSpec>>} */
export const GEOMETRY_PAGE_DIAGRAM_BY_GRADE = Object.freeze({
  g1: Object.freeze({
    shapes_basic_square: {
      diagramType: "square_sides",
      topic: "",
      conceptHe: "",
    },
    shapes_basic_rectangle: {
      diagramType: "rectangle_sides",
      topic: "",
      conceptHe: "",
    },
    transformations: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
  }),
  g2: Object.freeze({
    solids: {
      diagramType: "cube_basic",
      topic: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topic: "",
      conceptHe: "",
    },
    transformations: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
  }),
  g3: Object.freeze({
    triangles: {
      diagramType: "triangle_parts",
      topic: "",
      conceptHe: "",
    },
    quadrilaterals: {
      diagramType: "quadrilateral_parts",
      topic: "",
      conceptHe: "",
    },
    parallel_perpendicular: {
      diagramType: "parallel_lines",
      topic: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topic: "",
      conceptHe: "",
    },
    square_perimeter: {
      diagramType: "square_perimeter",
      topic: "",
      conceptHe: "",
    },
    triangle_perimeter: {
      diagramType: "triangle_perimeter",
      topic: "",
      conceptHe: "",
    },
    triangle_angles: {
      diagramType: "angle_basic",
      topic: "",
      conceptHe: "",
    },
    rotation: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
    solids: {
      diagramType: "cube_basic",
      topic: "",
      conceptHe: "",
    },
  }),
  g4: Object.freeze({
    shapes_basic_properties_square: {
      diagramType: "square_sides",
      topic: "",
      conceptHe: "",
    },
    shapes_basic_properties_rectangle: {
      diagramType: "rectangle_sides",
      topic: "",
      conceptHe: "",
    },
    shapes_basic_properties_angles: {
      diagramType: "right_angle",
      topic: "",
      conceptHe: "",
    },
    symmetry: {
      diagramType: "symmetry_line",
      topic: "",
      conceptHe: "",
    },
    quadrilaterals: {
      diagramType: "quadrilateral_parts",
      topic: "",
      conceptHe: "",
    },
    parallel_perpendicular: {
      diagramType: "parallel_lines",
      topic: "",
      conceptHe: "",
    },
    square_perimeter: {
      diagramType: "square_perimeter",
      topic: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topic: "",
      conceptHe: "",
    },
    triangle_perimeter: {
      diagramType: "triangle_perimeter",
      topic: "",
      conceptHe: "",
    },
    triangle_angles: {
      diagramType: "angle_basic",
      topic: "",
      conceptHe: "",
    },
    diagonal_square: {
      diagramType: "square_diagonal",
      topic: "",
      conceptHe: "",
    },
    diagonal_rectangle: {
      diagramType: "rectangle_diagonal",
      topic: "",
      conceptHe: "",
    },
    solids: {
      diagramType: "cube_basic",
      topic: "",
      conceptHe: "",
    },
    rectangular_prism_volume: {
      diagramType: "box_basic",
      topic: "",
      conceptHe: "",
    },
  }),
  g5: Object.freeze({
    parallel_perpendicular: {
      diagramType: "parallel_lines",
      topic: "",
      conceptHe: "",
    },
    quadrilaterals: {
      diagramType: "quadrilateral_parts",
      topic: "",
      conceptHe: "",
    },
    triangle_angles: {
      diagramType: "angle_basic",
      topic: "",
      conceptHe: "",
    },
    square_perimeter: {
      diagramType: "square_perimeter",
      topic: "",
      conceptHe: "",
    },
    triangle_perimeter: {
      diagramType: "triangle_perimeter",
      topic: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topic: "",
      conceptHe: "",
    },
    triangle_area: {
      diagramType: "triangle_height",
      topic: "",
      conceptHe: "",
    },
    parallelogram_area: {
      diagramType: "parallelogram_area",
      topic: "",
      conceptHe: "",
    },
    trapezoid_area: {
      diagramType: "trapezoid_area",
      topic: "",
      conceptHe: "",
    },
    heights_triangle: {
      diagramType: "triangle_height",
      topic: "",
      conceptHe: "",
    },
    heights_parallelogram: {
      diagramType: "parallelogram_height",
      topic: "",
      conceptHe: "",
    },
    heights_trapezoid: {
      diagramType: "trapezoid_height",
      topic: "",
      conceptHe: "",
    },
    diagonal_square: {
      diagramType: "square_diagonal",
      topic: "",
      conceptHe: "",
    },
    diagonal_rectangle: {
      diagramType: "rectangle_diagonal",
      topic: "",
      conceptHe: "",
    },
    diagonal_parallelogram: {
      diagramType: "parallelogram_diagonal",
      topic: "",
      conceptHe: "",
    },
    solids: {
      diagramType: "cube_basic",
      topic: "",
      conceptHe: "",
    },
    rectangular_prism_volume: {
      diagramType: "box_basic",
      topic: "",
      conceptHe: "",
    },
    tiling: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
  }),
  g6: Object.freeze({
    square_perimeter: {
      diagramType: "square_perimeter",
      topic: "",
      conceptHe: "",
    },
    triangle_perimeter: {
      diagramType: "triangle_perimeter",
      topic: "",
      conceptHe: "",
    },
    square_area: {
      diagramType: "square_area_grid",
      topic: "",
      conceptHe: "",
    },
    parallelogram_area: {
      diagramType: "parallelogram_area",
      topic: "",
      conceptHe: "",
    },
    trapezoid_area: {
      diagramType: "trapezoid_area",
      topic: "",
      conceptHe: "",
    },
    triangle_angles: {
      diagramType: "angle_basic",
      topic: "",
      conceptHe: "",
    },
    circle_perimeter: {
      diagramType: "circle_perimeter",
      topic: "",
      conceptHe: "",
    },
    circle_area: {
      diagramType: "circle_area",
      topic: "",
      conceptHe: "",
    },
    pythagoras_hyp: {
      diagramType: "right_triangle",
      topic: "",
      conceptHe: "",
    },
    pythagoras_leg: {
      diagramType: "right_triangle",
      topic: "",
      conceptHe: "",
    },
    solids: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
    rectangular_prism_volume: {
      diagramType: "box_basic",
      topic: "",
      conceptHe: "",
    },
    prism_volume_rectangular: {
      diagramType: "box_basic",
      topic: "",
      conceptHe: "",
    },
    prism_volume_triangle: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
    pyramid_volume_square: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
    pyramid_volume_rectangular: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
    cylinder_volume: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
    cone_volume: {
      diagramType: null,
      topic: "",
      conceptHe: "",
    },
    sphere_volume: {
      diagramType: null,
      topic: "",
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
