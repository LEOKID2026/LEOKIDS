/**
 * Geometry text renderer / enrichment — Wave C.
 * Run: node --test tests/worksheets/geometry-text-renderer.test.mjs
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { toPrintableWorksheetQuestion } from "../../lib/worksheets/worksheet-question-sanitize.server.js";
import { enrichGeometryPrintableQuestion } from "../../lib/worksheets/worksheet-geometry-display.server.js";
import {
  buildWorksheetPayload,
  worksheetPayloadToPreviewHtml,
} from "../../lib/worksheets/worksheet-payload-build.server.js";
import { WORKSHEET_PRINTABILITY } from "../../lib/worksheets/worksheet-question-types.js";

const CONCEPT_RAW = {
  question: "    ?",
  answers: ["   ", "   ", "   ", " "],
  correctAnswer: "   ",
  topic: "parallel_perpendicular",
  params: { kind: "concept_lines", isParallel: true },
};

const META = {
  titleHe: " ",
  subject: "",
  grade: " ",
  topic: "",
  level: "",
  inkSave: false,
  subjectId: "geometry",
};

describe("geometry-text-renderer", () => {
  test("conceptual geometry question enriches as diagram or text MCQ", () => {
    const printable = toPrintableWorksheetQuestion(CONCEPT_RAW, {
      displayIndex: 1,
      subject: "geometry",
    });
    assert.ok(["mcq", "diagram_mcq"].includes(printable.questionType));
    assert.ok(printable.stemHe.includes(""));
    assert.ok(printable.optionsHe?.length);
    assert.equal(printable.printability, WORKSHEET_PRINTABILITY.printable);
  });

  test("transformations without numeric diagram stay text printable", () => {
    const raw = {
      question: "  ?",
      answers: ["", "", "", ""],
      correctAnswer: "",
      topic: "transformations",
      params: { kind: "concept_transform", type: "" },
    };
    const enriched = enrichGeometryPrintableQuestion(raw, {
      displayIndex: 1,
      subject: "geometry",
      questionType: "mcq",
      stemHe: raw.question,
      optionsHe: raw.answers,
      printability: WORKSHEET_PRINTABILITY.printable,
    });
    assert.equal(enriched.printability, WORKSHEET_PRINTABILITY.printable);
    assert.ok(enriched.stemHe);
  });

  test("text geometry appears in HTML without internal fields", () => {
    const payload = buildWorksheetPayload([CONCEPT_RAW], META, {
      subjectId: "geometry",
    });
    const html = worksheetPayloadToPreviewHtml(payload);
    assert.ok(html.includes("worksheet-stem"));
    assert.ok(html.includes("worksheet-options"));
    assert.equal(html.includes("skillId"), false);
    assert.equal(html.includes("patternFamily"), false);
    assert.equal(html.includes("correctAnswer"), false);
    assert.equal(html.includes("generatorKind"), false);
  });

  test("solid cylinder volume is printable with SVG", () => {
    const raw = {
      question: "   5   10 .     (π = 3.14).",
      answers: ["100", "200", "314", "400"],
      correctAnswer: "314",
      topic: "volume",
      shape: "cylinder",
      params: { kind: "cylinder_volume", radius: 5, height: 10, answerMode: "mcq" },
      answerMode: "mcq",
    };
    const printable = toPrintableWorksheetQuestion(raw, {
      displayIndex: 1,
      subject: "geometry",
    });
    assert.equal(printable.printability, WORKSHEET_PRINTABILITY.printable);
    assert.equal(printable.diagramSpec?.kind, "solid_cylinder");
    const payload = buildWorksheetPayload([raw], {
      ...META,
      topic: "",
      grade: "",
    }, { subjectId: "geometry" });
    const html = worksheetPayloadToPreviewHtml(payload);
    assert.ok(html.includes("worksheet-geometry-svg"));
    assert.ok(html.includes("<ellipse") || html.includes("<circle") || html.includes("<line"));
  });
});
