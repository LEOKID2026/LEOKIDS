import test from "node:test";
import assert from "node:assert/strict";
import {
  boundaryCopilotAnswerBlock,
  resolveCopilotAnswerBlockText,
  resolveCopilotAnswerBlocksText,
  resolveCopilotReportMessage,
} from "../../lib/parent-copilot/copilot-response-resolver.js";
import { GENERAL_OFF_TOPIC_RESPONSE_HE } from "../../utils/parent-copilot/question-classifier.js";

const LOCALE_MATRIX = [
  { interfaceLocale: "en", reportLocale: "en" },
  { interfaceLocale: "en-XA", reportLocale: "en" },
  { interfaceLocale: "en", reportLocale: "ar-XB" },
  { interfaceLocale: "en-XA", reportLocale: "ar-XB" },
  { interfaceLocale: "ar-XB", reportLocale: "en-XA" },
  { interfaceLocale: "ar-XB", reportLocale: "ar-XB" },
];

test("structured boundary block resolves via reportLocale without raw keys", () => {
  const block = boundaryCopilotAnswerBlock("generalOffTopic");
  const text = resolveCopilotAnswerBlockText(block, "en");
  assert.match(text, /I can only help here/);
  assert.doesNotMatch(text, /copilot\.boundary/);
  assert.doesNotMatch(text, /[\u0590-\u05FF]/);
});

test("legacy textHe still resolves during migration", () => {
  const text = resolveCopilotAnswerBlockText({ textHe: GENERAL_OFF_TOPIC_RESPONSE_HE }, "en");
  assert.match(text, /I can only help here/);
});

test("resolveCopilotAnswerBlocksText joins structured blocks", () => {
  const joined = resolveCopilotAnswerBlocksText(
    [boundaryCopilotAnswerBlock("ambiguous"), boundaryCopilotAnswerBlock("noDataForRequest")],
    "en"
  );
  assert.match(joined, /couldn't tell exactly/i);
  assert.match(joined, /does not have enough information/i);
});

for (const row of LOCALE_MATRIX) {
  test(`copilot report locale matrix ${row.interfaceLocale}/${row.reportLocale}`, () => {
    const text = resolveCopilotReportMessage(row.reportLocale, "copilot.boundary.generalOffTopic");
    assert.ok(text && text.length > 20);
    assert.doesNotMatch(text, /copilot\.boundary/);
    if (row.reportLocale === "en-XA" || row.reportLocale === "ar-XB") {
      assert.ok(text.length > 40, "pseudo locale should expand copy");
    }
  });
}
