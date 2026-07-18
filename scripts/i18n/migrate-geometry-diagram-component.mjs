/**
 * Migrate GeometryDiagram.js to book pack copy (safe codemod).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const componentPath = path.join(root, "components/learning-book/GeometryDiagram.js");

/** @type {[string, string][]} */
const ariaReplacements = [
  ["Triangle with sides and vertices", "triangle_parts"],
  ["Triangle perimeter", "triangle_perimeter"],
  ["Height in a triangle", "triangle_height"],
  ["Right triangle", "right_triangle"],
  ["Quadrilateral with sides and vertices", "quadrilateral_parts"],
  ["Rectangle with length and width", "rectangle_sides"],
  ["Rectangle with a diagonal", "rectangle_diagonal"],
  ["Square with sides", "square_sides"],
  ["Square perimeter", "square_perimeter"],
  ["Square with a diagonal", "square_diagonal"],
  ["Square area - unit squares", "square_area_grid"],
  ["Height in a parallelogram", "parallelogram_height"],
  ["Parallelogram area", "parallelogram_area"],
  ["Parallelogram with a diagonal", "parallelogram_diagonal"],
  ["Height in a trapezoid", "trapezoid_height"],
  ["Trapezoid area", "trapezoid_area"],
  ["Right angle", "right_angle"],
  ["Angle with two rays", "angle_basic"],
  ["Line of symmetry", "symmetry_line"],
  ["Parallel lines", "parallel_lines"],
  ["Circle with radius", "circle_radius"],
  ["Circle perimeter", "circle_perimeter"],
  ["Circle area", "circle_area"],
  ["Cube", "cube_basic"],
  ["Rectangular prism", "box_basic"],
];

let src = fs.readFileSync(componentPath, "utf8");

src = src.replace(
  /\/\*\* Child-facing diagram labels \(US English\)\. \*\/\s*const GEOMETRY_DIAGRAM_LABELS = Object\.freeze\(\{[\s\S]*?\}\);\s*\n/,
  "",
);

if (!src.includes("useBookUiCopy")) {
  src = src.replace(
    'import { useBookGradeTheme } from "./BookGradeThemeContext";',
    'import { useMemo } from "react";\nimport { useBookGradeTheme } from "./BookGradeThemeContext";\nimport { useBookUiCopy } from "../../lib/learning-book/book-locale-context.jsx";',
  );
}

src = src.replace(/function (\w+Diagram)\(\{ theme \}\)/g, "function $1({ theme, d })");
src = src.replace(/GEOMETRY_DIAGRAM_LABELS\.(\w+)/g, 'd.label("$1")');

for (const [text, key] of ariaReplacements) {
  src = src.replace(
    `<DiagramSvg label="${text}"`,
    `<DiagramSvg label={d.aria("${key}")}`,
  );
}

src = src.replace(
  /export default function GeometryDiagram\(\{ type, options = \{\} \}\) \{\s*const theme = useBookGradeTheme\(\)\.classes;/,
  `export default function GeometryDiagram({ type, options = {} }) {
  const theme = useBookGradeTheme().classes;
  const copy = useBookUiCopy();
  const d = useMemo(
    () => ({
      label: (key) => copy("diagramLabels", key),
      aria: (key) => copy("diagramAria", key),
    }),
    [copy],
  );`,
);

src = src.replace(/<Renderer theme=\{theme\} \/>/g, "<Renderer theme={theme} d={d} />");

fs.writeFileSync(componentPath, src, "utf8");
console.log("migrate-geometry-diagram-component v2: OK");
