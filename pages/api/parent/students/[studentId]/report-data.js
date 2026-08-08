import { getLearningSupabaseServiceRoleClient } from "../../../../../lib/learning-supabase/server";
import { requireParentApiContext } from "../../../../../lib/auth/persona-guard.server.js";
import {
  aggregateParentReportPayload,
  parseIsoDateParam,
  safeString,
  stripInternalReportPayloadFields,
} from "../../../../../lib/parent-server/report-data-aggregate.server.js";
import { attachStudentLearningAccountToParentReportPayload } from "../../../../../lib/parent-server/parent-report-account-attachment.server.js";
import { enrichPayloadWithParentFacing } from "../../../../../lib/parent-server/parent-report-parent-facing.server.js";
import { loadGlobalProductMembershipLocales } from "../../../../../lib/global/product-membership.server.js";
import {
  attachReportLocaleMeta,
  resolveProductionReportLocale,
} from "../../../../../lib/reports/report-locale.js";

const DEFAULT_RANGE_DAYS = 30;
/** Short-lived in-memory cache — same parent/student/range within TTL skips re-aggregation. */
const REPORT_DATA_CACHE_TTL_MS = 90_000;

/** @type {Map<string, { expiresAt: number, payload: unknown }>} */
const reportDataResponseCache = new Map();

function reportDataCacheKey(parentUserId, studentId, fromYmd, toYmd, reportLocale) {
  return `${parentUserId}|${studentId}|${fromYmd}|${toYmd}|${reportLocale || "en"}`;
}

function buildDefaultRange() {
  const toDate = new Date();
  toDate.setUTCHours(0, 0, 0, 0);
  const fromDate = new Date(toDate);
  fromDate.setUTCDate(fromDate.getUTCDate() - (DEFAULT_RANGE_DAYS - 1));
  return {
    from: fromDate.toISOString().slice(0, 10),
    to: toDate.toISOString().slice(0, 10),
  };
}

/**
 * @param {import("next").NextApiResponse} res
 * @param {number} status
 * @param {string} code
 */
function fail(res, status, code) {
  return res.status(status).json({ ok: false, error: code, code });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return fail(res, 405, "method_not_allowed");
  }

  const authHeader = req.headers.authorization || "";

  const studentId = safeString(req.query?.studentId, 64);
  if (!studentId) {
    return fail(res, 400, "student_id_required");
  }

  const defaultRange = buildDefaultRange();
  const fromRaw = safeString(req.query?.from, 10);
  const toRaw = safeString(req.query?.to, 10);

  const fromDate = fromRaw ? parseIsoDateParam(fromRaw) : parseIsoDateParam(defaultRange.from);
  const toDate = toRaw ? parseIsoDateParam(toRaw) : parseIsoDateParam(defaultRange.to);
  if (!fromDate || !toDate) {
    return fail(res, 400, "invalid_date_params");
  }
  if (fromDate.getTime() > toDate.getTime()) {
    return fail(res, 400, "invalid_date_params");
  }

  try {
    const ctx = await requireParentApiContext(res, authHeader, { requireFeature: "reports_enabled" });
    if (ctx.stopped) return undefined;

    const { loadOwnedGlobalStudent } = await import("../../../../../lib/global/product-student.server.js");
    const owned = await loadOwnedGlobalStudent(ctx.serviceRole, {
      studentId,
      parentUserId: ctx.parentUserId,
      select: "id,full_name,grade_level,is_active,parent_id,account_kind,product_id",
    });
    if (!owned.ok) {
      const code =
        (typeof owned.error === "string" && owned.error) || "student_not_found";
      return res.status(owned.status || 403).json({
        ok: false,
        error: code,
        code,
        message: owned.message,
      });
    }
    const student = owned.student;
    if (student.account_kind === "guest") {
      return fail(res, 403, "guest_not_eligible");
    }

    const membershipLocales = await loadGlobalProductMembershipLocales(
      ctx.serviceRole,
      ctx.parentUserId
    );
    const reportLocale = resolveProductionReportLocale({
      membershipLocales,
      reportLocaleHint: safeString(req.query?.reportLocale, 16),
    });
    const interfaceLocale = membershipLocales.ok
      ? membershipLocales.interfaceLanguage
      : "en";

    const fromYmd = fromDate.toISOString().slice(0, 10);
    const toYmd = toDate.toISOString().slice(0, 10);
    const cacheKey = reportDataCacheKey(
      ctx.parentUserId,
      studentId,
      fromYmd,
      toYmd,
      reportLocale
    );
    const cached = reportDataResponseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      return res.status(200).json(cached.payload);
    }

    const serviceClient = getLearningSupabaseServiceRoleClient();
    const analytics = await aggregateParentReportPayload(serviceClient, student, fromDate, toDate, {
      includeParentActivities: true,
      includePrivateTeacherActivities: true,
    });
    const payload = await attachStudentLearningAccountToParentReportPayload(serviceClient, student, analytics);
    const enriched = await enrichPayloadWithParentFacing(serviceClient, payload, studentId, {
      reportLocale,
    });
    const withLocaleMeta = attachReportLocaleMeta(enriched, {
      reportLocale,
      interfaceLocale,
    });
    const responseBody = stripInternalReportPayloadFields(withLocaleMeta);
    reportDataResponseCache.set(cacheKey, {
      expiresAt: Date.now() + REPORT_DATA_CACHE_TTL_MS,
      payload: responseBody,
    });
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    return res.status(200).json(responseBody);
  } catch {
    return fail(res, 500, "unexpected_server_error");
  }
}
