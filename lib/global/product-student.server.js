/**
 * Student ownership + product_id verification for Global APIs.
 */

import {
  getServerProductId,
  PRODUCT_ERRORS,
  PRODUCT_GLOBAL,
} from "./product-context.server.js";
import { isProductColumnSchemaMissing } from "./product-membership.server.js";

/**
 * Load a student owned by parent on the Global product.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} db
 * @param {{
 *   studentId: string,
 *   parentUserId: string,
 *   select?: string,
 * }} params
 */
export async function loadOwnedGlobalStudent(db, params) {
  const productId = getServerProductId();
  const select =
    params.select ||
    "id,parent_id,full_name,grade_level,is_active,product_id,account_kind,created_at";

  const { data, error } = await db
    .from("students")
    .select(select)
    .eq("id", params.studentId)
    .eq("parent_id", params.parentUserId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    if (isProductColumnSchemaMissing(error)) {
      return {
        ok: false,
        status: 503,
        ...PRODUCT_ERRORS.schema_not_ready,
        schemaMissing: true,
      };
    }
    return { ok: false, status: 403, ...PRODUCT_ERRORS.student_not_found };
  }

  if (!data?.id) {
    return { ok: false, status: 403, ...PRODUCT_ERRORS.student_not_found };
  }

  if (data.product_id != null && data.product_id !== PRODUCT_GLOBAL) {
    return { ok: false, status: 403, ...PRODUCT_ERRORS.student_wrong_product };
  }

  return { ok: true, student: data, productId };
}

/**
 * Load student by id and require Global product (student login / learning).
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} db
 * @param {string} studentId
 * @param {string} [select]
 */
export async function loadGlobalStudentById(db, studentId, select) {
  const productId = getServerProductId();
  const cols = select || "id,parent_id,full_name,grade_level,is_active,product_id,account_kind";

  const { data, error } = await db
    .from("students")
    .select(cols)
    .eq("id", studentId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    if (isProductColumnSchemaMissing(error)) {
      return {
        ok: false,
        status: 503,
        ...PRODUCT_ERRORS.schema_not_ready,
        schemaMissing: true,
      };
    }
    return { ok: false, status: 403, ...PRODUCT_ERRORS.student_wrong_product };
  }

  if (!data?.id) {
    return { ok: false, status: 403, ...PRODUCT_ERRORS.student_wrong_product };
  }

  return { ok: true, student: data, productId };
}

/**
 * Count registered children for a parent within the Global product only.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} db
 * @param {string} parentUserId
 */
export async function countGlobalParentStudents(db, parentUserId) {
  const productId = getServerProductId();
  const { count, error } = await db
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", parentUserId)
    .eq("product_id", productId)
    .or("account_kind.eq.registered,account_kind.is.null");

  if (error) {
    if (isProductColumnSchemaMissing(error)) {
      return {
        ok: false,
        status: 503,
        ...PRODUCT_ERRORS.schema_not_ready,
        schemaMissing: true,
      };
    }
    return { ok: false, status: 403, error: "student_count_failed" };
  }

  return { ok: true, count: count ?? 0, productId };
}
