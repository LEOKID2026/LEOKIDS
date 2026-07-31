#!/usr/bin/env node
/**
 * Write-barrier contract selftest.
 *
 * Product contract (canonical: lib/global/write-barrier.js + apply-write-barrier.js):
 * - GLOBAL_DATA_WRITES_ENABLED controls mutating writes (default ON).
 * - GLOBAL_MOCK_MODE is independent (default OFF).
 * - Disabling writes must NOT auto-enable mock mode.
 * - Mock responses are only used when writes are off AND mock is explicitly on.
 */
import assert from "node:assert/strict";
import {
  assertGlobalDataWritesEnabled,
  GLOBAL_WRITE_DISABLED_CODE,
  isGlobalDataWritesEnabled,
  isGlobalMockModeEnabled,
} from "../../lib/global/write-barrier.js";
import { gateMutatingApi } from "../../lib/global/apply-write-barrier.js";

const prevWrites = process.env.GLOBAL_DATA_WRITES_ENABLED;
const prevMock = process.env.GLOBAL_MOCK_MODE;

function restoreEnv() {
  if (prevWrites !== undefined) process.env.GLOBAL_DATA_WRITES_ENABLED = prevWrites;
  else delete process.env.GLOBAL_DATA_WRITES_ENABLED;
  if (prevMock !== undefined) process.env.GLOBAL_MOCK_MODE = prevMock;
  else delete process.env.GLOBAL_MOCK_MODE;
}

try {
  // --- Separation: writes off does not imply mock on ---
  process.env.GLOBAL_DATA_WRITES_ENABLED = "false";
  delete process.env.GLOBAL_MOCK_MODE;
  assert.equal(isGlobalDataWritesEnabled(), false);
  assert.equal(isGlobalMockModeEnabled(), false, "writes=false must not auto-enable mock mode");

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

  // --- Explicit mock stays independent ---
  process.env.GLOBAL_MOCK_MODE = "true";
  assert.equal(isGlobalDataWritesEnabled(), false);
  assert.equal(isGlobalMockModeEnabled(), true);

  process.env.GLOBAL_MOCK_MODE = "false";
  assert.equal(isGlobalMockModeEnabled(), false);

  // --- Writes on: barrier allows; mock still independent ---
  process.env.GLOBAL_DATA_WRITES_ENABLED = "true";
  process.env.GLOBAL_MOCK_MODE = "false";
  assert.equal(isGlobalDataWritesEnabled(), true);
  assert.equal(isGlobalMockModeEnabled(), false);
  assert.equal(assertGlobalDataWritesEnabled().ok, true);

  process.env.GLOBAL_MOCK_MODE = "true";
  assert.equal(isGlobalDataWritesEnabled(), true);
  assert.equal(isGlobalMockModeEnabled(), true);

  // --- gateMutatingApi: mock branch only when writes off AND mock on ---
  let mockHits = 0;
  let handlerHits = 0;
  const gated = gateMutatingApi(
    async (_req, res) => {
      handlerHits += 1;
      res.statusCode = 200;
      res.end("ok");
    },
    {
      onMock: async (_req, res) => {
        mockHits += 1;
        res.statusCode = 200;
        res.end("mock");
      },
    }
  );

  function fakeRes() {
    return {
      statusCode: 0,
      headers: {},
      body: "",
      setHeader(k, v) {
        this.headers[k] = v;
      },
      end(b) {
        this.body = String(b ?? "");
      },
    };
  }

  process.env.GLOBAL_DATA_WRITES_ENABLED = "false";
  process.env.GLOBAL_MOCK_MODE = "false";
  {
    const res = fakeRes();
    await gated({ method: "POST" }, res);
    assert.equal(mockHits, 0);
    assert.equal(handlerHits, 0);
    assert.equal(res.statusCode, 503);
    assert.match(res.body, /GLOBAL_DATA_WRITES_DISABLED/);
  }

  process.env.GLOBAL_MOCK_MODE = "true";
  {
    const res = fakeRes();
    await gated({ method: "POST" }, res);
    assert.equal(mockHits, 1);
    assert.equal(handlerHits, 0);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, "mock");
  }

  process.env.GLOBAL_DATA_WRITES_ENABLED = "true";
  process.env.GLOBAL_MOCK_MODE = "true";
  {
    const res = fakeRes();
    await gated({ method: "POST" }, res);
    assert.equal(handlerHits, 1);
    assert.equal(mockHits, 1);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, "ok");
  }

  console.log("[write-barrier] OK — writes and mock mode are independent; barrier intact");
} finally {
  restoreEnv();
}
