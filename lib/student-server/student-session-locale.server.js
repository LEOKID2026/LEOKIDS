/**
 * Student interface locale stored in student_sessions.client_meta.interface_locale.
 * No new DB column — uses existing jsonb client_meta.
 */

import { normalizeMembershipLocale } from "../global/product-membership.server.js";

export const STUDENT_SESSION_LOCALE_META_KEY = "interface_locale";

/**
 * @param {unknown} clientMeta
 * @returns {string|null}
 */
export function readInterfaceLocaleFromClientMeta(clientMeta) {
  if (!clientMeta || typeof clientMeta !== "object" || Array.isArray(clientMeta)) return null;
  const raw = clientMeta[STUDENT_SESSION_LOCALE_META_KEY];
  if (typeof raw !== "string" || !raw.trim()) return null;
  return normalizeMembershipLocale(raw.trim(), "en");
}

/**
 * @param {Record<string, unknown>|null|undefined} clientMeta
 * @param {string} localeId
 */
export function withInterfaceLocaleInClientMeta(clientMeta, localeId) {
  const base =
    clientMeta && typeof clientMeta === "object" && !Array.isArray(clientMeta)
      ? { ...clientMeta }
      : {};
  base[STUDENT_SESSION_LOCALE_META_KEY] = normalizeMembershipLocale(localeId, "en");
  return base;
}

/**
 * Most recent interface_locale for this student across prior sessions.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @returns {Promise<string|null>}
 */
export async function loadPriorStudentInterfaceLocale(supabase, studentId) {
  if (!studentId) return null;
  const { data, error } = await supabase
    .from("student_sessions")
    .select("client_meta, created_at")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(12);
  if (error || !Array.isArray(data)) return null;
  for (const row of data) {
    const loc = readInterfaceLocaleFromClientMeta(row?.client_meta);
    if (loc) return loc;
  }
  return null;
}
