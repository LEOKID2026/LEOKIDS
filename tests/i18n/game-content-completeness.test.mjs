import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("all active games have English content packs with required keys", () => {
  const out = execFileSync("node", ["scripts/i18n/validate-game-content-packs.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.match(out, /Validated 33 active game content packs/);
});
