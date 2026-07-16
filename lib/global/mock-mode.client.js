/**
 * Client-side mock / preview mode for the global product.
 * Defaults to enabled unless NEXT_PUBLIC_GLOBAL_MOCK_MODE is explicitly "false".
 */

/**
 * @returns {boolean}
 */
export function isMockModeClient() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GLOBAL_MOCK_MODE !== undefined) {
    return String(process.env.NEXT_PUBLIC_GLOBAL_MOCK_MODE).trim().toLowerCase() !== "false";
  }
  return true;
}

export default isMockModeClient;
