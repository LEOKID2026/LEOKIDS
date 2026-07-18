/**
 * Global learning book browser speech text.
 * Run: node --test tests/learning/global-book-speech-text.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseLearningPageMarkdown } from "../../lib/learning-book/parse-learning-page-markdown.js";
import { prepareGlobalBookSectionSpeechText } from "../../lib/learning-book/audio/prepare-global-book-speech-text.js";

test("prepareGlobalBookSectionSpeechText returns English section copy", () => {
  const raw = fs.readFileSync("docs/learning-book/math/g3/drafts/ns_place_hundreds.md", "utf8");
  const page = parseLearningPageMarkdown(raw, "ns_place_hundreds");
  const spoken = prepareGlobalBookSectionSpeechText(page, 1);
  assert.match(spoken, /learn/i);
  assert.match(spoken, /hundreds/i);
  assert.doesNotMatch(spoken, /learning_page_id|owner-approved|DRAFT/i);
});

test("prepareGlobalBookSectionSpeechText returns empty for missing section", () => {
  assert.equal(prepareGlobalBookSectionSpeechText({ sections: [] }, 1), "");
});
