#!/usr/bin/env node
import assert from "node:assert/strict";
import {
  assertGlobalDataWritesEnabled,
  GLOBAL_WRITE_DISABLED_CODE,
  isGlobalDataWritesEnabled,
  isGlobalMockModeEnabled,
} from "../../lib/global/write-barrier.js";

process.env.GLOBAL_DATA_WRITES_ENABLED = "false";
assert.equal(isGlobalDataWritesEnabled(), false);
assert.equal(isGlobalMockModeEnabled(), true);

const soft = assertGlobalDataWritesEnabled({ throwOnDisabled: false });
assert.equal(soft.ok, false);
assert.equal(soft.code, GLOBAL_WRITE_DISABLED_CODE);

let threw = false;
try {
  assertGlobalDataWritesEnabled();
} catch (e) {
  threw = true;
  assert.equal(e.code, GLOBAL_WRITE_DISABLED_CODE);
}
assert.equal(threw, true);

process.env.GLOBAL_DATA_WRITES_ENABLED = "true";
assert.equal(isGlobalDataWritesEnabled(), true);
assert.equal(assertGlobalDataWritesEnabled().ok, true);

console.log("[write-barrier] OK");
