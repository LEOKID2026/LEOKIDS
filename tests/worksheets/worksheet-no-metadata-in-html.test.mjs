/**
 * No metadata / diagnostic keys in worksheet HTML — Wave A.
 * Run: node --test tests/worksheets/worksheet-no-metadata-in-html.test.mjs
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  buildWorksheetPayload,
  worksheetPayloadToPreviewHtml,
  auditWorksheetPayloadForMetadataLeaks,
} from "../../lib/worksheets/worksheet-payload-build.server.js";

const META = {
  titleHe: "  - ",
  subject: "",
  grade: " ",
  topic: "",
  level: "",
  inkSave: false,
  subjectId: "geometry",
  gradeKey: "g4",
  topicKey: "area",
  levelKey: "medium",
};

const RAW = [
  {
    question: "  ·  area -   ?",
    skillId: "geo_area_rect",
    diagnosticSkillId: "diag_geo_area",
    patternFamily: "area_word",
    seedId: 123456,
    generatorKind: "geometry_v1",
    subSkill: "rectangle",
    answers: ["10", "12", "14", "16"],
    correctIndex: 1,
    diagramSpec: { kind: "rectangle", labels: { width: 4, height: 3 } },
  },
];

describe("worksheet-no-metadata-in-html", () => {
  test("HTML and JSON have no internal metadata keys", () => {
    const payload = buildWorksheetPayload(RAW, META, { subjectId: "geometry" });
    const html = worksheetPayloadToPreviewHtml(payload);
    assert.equal(html.includes("skillId"), false);
    assert.equal(html.includes("diagnosticSkillId"), false);
    assert.equal(html.includes("patternFamily"), false);
    assert.equal(html.includes("seedId"), false);
    assert.equal(html.includes("generatorKind"), false);
    assert.equal(html.includes("123456"), false);
    assert.equal(html.includes("geo_area_rect"), false);
    const audit = auditWorksheetPayloadForMetadataLeaks(payload);
    assert.equal(audit.pass, true, `metadata leaks: ${audit.hits.join(", ")}`);
  });

  test("stem does not retain grade/topic metadata prefix", () => {
    const payload = buildWorksheetPayload(RAW, META, { subjectId: "geometry" });
    const stem = payload.questions[0]?.stemHe || "";
    assert.equal(/\s+area/i.test(stem), false);
    assert.equal(/\s+/i.test(stem), false);
  });
});
