import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadRewardCardCatalog,
  resolveRewardCardEntry,
  rewardUiCopyForLocale,
} from "../../lib/rewards/reward-pack-copy.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("reward catalog validator passes for 136 cards", () => {
  const out = execFileSync("node", ["scripts/i18n/validate-reward-content-packs.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.match(out, /136 cards/);
});

describe("reward pseudo locales", () => {
  for (const locale of ["en", "en-XA", "ar-XB"]) {
    test(`card title @ ${locale}`, () => {
      const entry = resolveRewardCardEntry("leo_scientist", locale);
      assert.ok(entry?.title);
      if (locale === "en-XA") assert.match(entry.title, /^\[\[\[/);
      if (locale === "ar-XB") assert.equal(entry.title.charCodeAt(0), 0x202b);
    });

    test(`shop copy @ ${locale}`, () => {
      const text = rewardUiCopyForLocale(locale, "shop", "alreadyOwned");
      assert.ok(text);
      if (locale === "en-XA") assert.match(text, /^\[\[\[/);
    });

    test(`requirement copy @ ${locale}`, () => {
      const text = rewardUiCopyForLocale(locale, "requirements", "total_questions", {
        minQuestions: 20,
      });
      assert.match(text, /20/);
    });
  }
});

test("loadRewardCardCatalog returns 136 entries", () => {
  assert.equal(Object.keys(loadRewardCardCatalog("en")).length, 136);
});
