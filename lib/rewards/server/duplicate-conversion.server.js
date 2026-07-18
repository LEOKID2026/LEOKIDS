/**
 * Legacy bulk duplicate conversion — disabled in favor of manual shop sellback.
 */
import { rewardUiCopy } from "../reward-pack-copy.js";

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} _supabase
 * @param {string} _studentId
 * @param {string} _cardId
 */
export async function convertDuplicates(_supabase, _studentId, _cardId) {
  return {
    ok: false,
    code: "feature_disabled",
    message: rewardUiCopy("server", "duplicateConversionRemoved"),
  };
}
