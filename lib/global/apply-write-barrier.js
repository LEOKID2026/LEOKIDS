import {
  isGlobalDataWritesEnabled,
  isGlobalMockModeEnabled,
  respondGlobalWritesDisabled,
  withGlobalWriteBarrier,
} from "./write-barrier.js";

export { withGlobalWriteBarrier };

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Gate a mutating API handler. When writes are disabled, optionally serve a mock
 * response (mock mode only) before falling back to the standard 503 payload.
 *
 * @param {(req: any, res: any) => any|Promise<any>} handler
 * @param {{ onMock?: (req: any, res: any) => any|Promise<any> }} [opts]
 */
export function gateMutatingApi(handler, opts = {}) {
  return async function globalGatedApiHandler(req, res) {
    const method = String(req?.method || "GET").toUpperCase();
    if (!SAFE_METHODS.has(method) && !isGlobalDataWritesEnabled()) {
      if (opts.onMock && isGlobalMockModeEnabled()) {
        return opts.onMock(req, res);
      }
      return respondGlobalWritesDisabled(res);
    }
    return handler(req, res);
  };
}

/**
 * Standard write barrier wrap (no mock branch).
 * @param {(req: any, res: any) => any|Promise<any>} handler
 */
export function wrapMutatingApi(handler) {
  return withGlobalWriteBarrier(handler);
}
