/**
 * Central write barrier for LEO-KIDS-GLOBAL.
 * Default: GLOBAL_DATA_WRITES_ENABLED=false — no production writes.
 */

export const GLOBAL_WRITE_DISABLED_CODE = "GLOBAL_DATA_WRITES_DISABLED";

/**
 * @returns {boolean}
 */
export function isGlobalDataWritesEnabled() {
  const raw = String(process.env.GLOBAL_DATA_WRITES_ENABLED ?? "false").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

/**
 * @returns {boolean}
 */
export function isGlobalMockModeEnabled() {
  const raw = String(process.env.GLOBAL_MOCK_MODE ?? "true").trim().toLowerCase();
  // Mock on by default while writes are disabled
  if (raw === "0" || raw === "false" || raw === "no" || raw === "off") return false;
  if (raw === "1" || raw === "true" || raw === "yes" || raw === "on") return true;
  return !isGlobalDataWritesEnabled();
}

/**
 * Throw or return a structured error when writes are blocked.
 * @param {{ throwOnDisabled?: boolean }} [opts]
 */
export function assertGlobalDataWritesEnabled(opts = {}) {
  if (isGlobalDataWritesEnabled()) return { ok: true };

  const error = {
    ok: false,
    code: GLOBAL_WRITE_DISABLED_CODE,
    message:
      "Global data writes are disabled. Enable GLOBAL_DATA_WRITES_ENABLED=true only after SQL isolation is approved and applied.",
  };

  if (opts.throwOnDisabled !== false) {
    const err = new Error(error.message);
    err.code = GLOBAL_WRITE_DISABLED_CODE;
    err.writeBarrier = error;
    throw err;
  }
  return error;
}

/**
 * API helper: send disabled-write JSON response.
 * @param {import('http').ServerResponse} res
 * @param {number} [status]
 */
export function respondGlobalWritesDisabled(res, status = 503) {
  const body = assertGlobalDataWritesEnabled({ throwOnDisabled: false });
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(
    JSON.stringify({
      ok: false,
      error: body.code,
      message: body.message,
      mockMode: isGlobalMockModeEnabled(),
    })
  );
}

/**
 * Wrap an async API handler so mutating verbs are blocked when writes are off.
 * GET/HEAD always pass; POST/PUT/PATCH/DELETE require writes or an explicit allowlist.
 *
 * @param {(req: any, res: any) => any|Promise<any>} handler
 * @param {{ allowMethodsWhenDisabled?: string[] }} [opts]
 */
export function withGlobalWriteBarrier(handler, opts = {}) {
  const allow = new Set(
    (opts.allowMethodsWhenDisabled || ["GET", "HEAD", "OPTIONS"]).map((m) => m.toUpperCase())
  );

  return async function globalWriteBarrierWrapped(req, res) {
    const method = String(req?.method || "GET").toUpperCase();
    if (!allow.has(method) && !isGlobalDataWritesEnabled()) {
      return respondGlobalWritesDisabled(res);
    }
    return handler(req, res);
  };
}
