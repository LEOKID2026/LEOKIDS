/**
 * Client-side mock / preview mode for the global product.
 * Default OFF — mock only when NEXT_PUBLIC_GLOBAL_MOCK_MODE is explicitly enabled.
 */

function envTruthy(name) {
  const raw = String(process.env[name] ?? "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

/**
 * @returns {boolean}
 */
export function isMockModeClient() {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GLOBAL_MOCK_MODE !== undefined) {
    return envTruthy("NEXT_PUBLIC_GLOBAL_MOCK_MODE");
  }
  return false;
}

export default isMockModeClient;
