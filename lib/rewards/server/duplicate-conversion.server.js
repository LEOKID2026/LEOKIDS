/**
 * Legacy bulk duplicate conversion — disabled in favor of manual shop sellback.
 */

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} _supabase
 * @param {string} _studentId
 * @param {string} _cardId
 */
export async function convertDuplicates(_supabase, _studentId, _cardId) {
  return {
    ok: false,
    code: "feature_disabled",
    message: "Duplicate conversion was removed — you can sell a duplicate in the shop.",
  };
}
