import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
/**
 * Permanent delete of a student owned by a parent (service-role API).
 * Cleans arcade rows with ON DELETE RESTRICT (or legacy RESTRICT FKs) before students delete.
 * Other child tables use ON DELETE CASCADE on students(id).
 */

/** @typedef {{ ok: true }} DeleteOk */
/** @typedef {{ ok: false, status: number, code: string, error: string, step?: string, detail?: string }} DeleteFail */

const SKIPPABLE_DB_CODES = new Set(["42P01", "42703", "PGRST205"]);

/**
 * @param {import('@supabase/supabase-js').PostgrestError|null|undefined} error
 */
function formatDbError(error) {
  if (!error) return "";
  return [error.message, error.details, error.hint].filter(Boolean).join(" - ");
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} db
 * @param {string} step
 * @param {string} table
 * @param {() => Promise<{ error?: import('@supabase/supabase-js').PostgrestError|null }>} run
 */
async function runDeleteStep(db, step, table, run) {
  const { error } = await run();
  if (!error) return null;
  if (SKIPPABLE_DB_CODES.has(String(error.code || ""))) return null;
  return {
    step,
    table,
    code: error.code || "db_error",
    message: formatDbError(error),
  };
}

/**
 * @param {{ code?: string, message?: string }} failure
 */
function isStatementTimeoutFailure(failure) {
  return failure.code === "57014" || /statement timeout/i.test(failure.message || "");
}

/**
 * Ordered cleanup before students delete.
 * Arcade: hosted rooms before player rows so room CASCADE clears co-players safely.
 * Classroom: explicit delete avoids CASCADE full-scan on classroom_activity_attempts (~3M rows)
 * when student_id index is missing (fixed in migration 085).
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} db
 * @param {string} studentId
 */
export async function cleanupStudentDependenciesBeforeDelete(db, studentId) {
  const steps = [
    {
      step: "arcade_results",
      table: "arcade_results",
      run: () => db.from("arcade_results").delete().eq("student_id", studentId),
    },
    {
      step: "arcade_quick_match_queue",
      table: "arcade_quick_match_queue",
      run: () => db.from("arcade_quick_match_queue").delete().eq("student_id", studentId),
    },
    {
      step: "arcade_rooms_hosted",
      table: "arcade_rooms",
      run: () => db.from("arcade_rooms").delete().eq("host_student_id", studentId),
    },
    {
      step: "arcade_room_players",
      table: "arcade_room_players",
      run: () => db.from("arcade_room_players").delete().eq("student_id", studentId),
    },
    {
      step: "arcade_results_final",
      table: "arcade_results",
      run: () => db.from("arcade_results").delete().eq("student_id", studentId),
    },
    {
      step: "classroom_activity_attempts",
      table: "classroom_activity_attempts",
      run: () => db.from("classroom_activity_attempts").delete().eq("student_id", studentId),
    },
    {
      step: "classroom_activity_student_status",
      table: "classroom_activity_student_status",
      run: () => db.from("classroom_activity_student_status").delete().eq("student_id", studentId),
    },
  ];

  for (const item of steps) {
    const failure = await runDeleteStep(db, item.step, item.table, item.run);
    if (failure) return failure;
  }

  return null;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} db
 * @param {string} parentUserId
 * @param {string} studentId
 * @returns {Promise<DeleteOk|DeleteFail>}
 */
export async function deleteParentOwnedStudent(db, parentUserId, studentId) {
  const { loadOwnedGlobalStudent } = await import("../global/product-student.server.js");
  const ownedResult = await loadOwnedGlobalStudent(db, {
    studentId,
    parentUserId,
    select: "id,full_name,product_id,parent_id",
  });

  if (!ownedResult.ok) {
    if (ownedResult.schemaMissing) {
      return {
        ok: false,
        status: 503,
        code: ownedResult.error || "product_schema_not_ready",
        error: ownedResult.message || "Product isolation schema is not ready",
      };
    }
    return {
      ok: false,
      status: ownedResult.status || 403,
      code: ownedResult.error || "student_not_owned",
      error: ownedResult.message || "Cannot delete this child or permission denied",
    };
  }

  const owned = ownedResult.student;

  const cleanupFailure = await cleanupStudentDependenciesBeforeDelete(db, studentId);
  if (cleanupFailure) {
    console.error("[delete-student] dependency cleanup failed", { studentId, ...cleanupFailure });
    if (isStatementTimeoutFailure(cleanupFailure)) {
      return {
        ok: false,
        status: 504,
        code: "delete_student_timeout",
        error:
          "Deleting this child is taking too long - there may be a lot of class data. Please try again in a minute; if the problem persists, contact support.",
        step: cleanupFailure.step,
        detail: cleanupFailure.message,
      };
    }
    return {
      ok: false,
      status: 409,
      code: "delete_student_dependency_failed",
      error: `Could not delete the data for ${owned.full_name || "the child"} (${cleanupFailure.table}): ${cleanupFailure.message}`,
      step: cleanupFailure.step,
      detail: cleanupFailure.message,
    };
  }

  const { getServerProductId } = await import("../global/product-context.server.js");
  const productId = getServerProductId();
  const { error: deleteErr } = await db
    .from("students")
    .delete()
    .eq("id", studentId)
    .eq("parent_id", parentUserId)
    .eq("product_id", productId);

  if (deleteErr) {
    const msg = formatDbError(deleteErr);
    console.error("[delete-student] students delete failed", {
      studentId,
      code: deleteErr.code,
      message: msg,
    });

    if (/violates foreign key|foreign key/i.test(msg)) {
      return {
        ok: false,
        status: 409,
        code: "delete_student_fk_blocked",
        error: `Found a database dependency that prevents deletion: ${msg}`,
        step: "students",
        detail: msg,
      };
    }

    if (deleteErr.code === "57014" || /statement timeout/i.test(msg)) {
      return {
        ok: false,
        status: 504,
        code: "delete_student_timeout",
        error:
          "Deleting this child is taking too long - there may be a lot of class data. Please try again in a minute; if the problem persists, contact support.",
        step: "students",
        detail: msg,
      };
    }

    return {
      ok: false,
      status: 500,
      code: "delete_student_failed",
      error: globalBurnDownCopy("lib__parent-server__delete-parent-owned-student.server", "deleting_the_child_failed_please_try_again_or_contact_support"),
      step: "students",
      detail: msg,
    };
  }

  return { ok: true };
}
