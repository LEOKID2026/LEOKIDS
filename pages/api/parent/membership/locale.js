import { requireParentApiContext } from "../../../../lib/auth/persona-guard.server.js";
import { getLearningSupabaseServiceRoleClient } from "../../../../lib/learning-supabase/server.js";
import {
  loadGlobalProductMembershipLocales,
  updateGlobalProductMembershipLocales,
} from "../../../../lib/global/product-membership.server.js";
import { getServerProductId } from "../../../../lib/global/product-context.server.js";
import { serializeLocaleCookie } from "../../../../lib/i18n/locale-cookie.js";

export default async function handler(req, res) {
  const ctx = await requireParentApiContext(res, req.headers.authorization || "");
  if (ctx.stopped) return undefined;

  const db = getLearningSupabaseServiceRoleClient();

  if (req.method === "GET") {
    const loaded = await loadGlobalProductMembershipLocales(db, ctx.parentUserId);
    if (!loaded.ok) {
      return res.status(loaded.status || 500).json({
        ok: false,
        error: loaded.error || "membership_load_failed",
        schemaMissing: Boolean(loaded.schemaMissing),
      });
    }
    return res.status(200).json({
      ok: true,
      productId: getServerProductId(),
      found: loaded.found,
      interfaceLanguage: loaded.interfaceLanguage,
      preferredReportLanguage: loaded.preferredReportLanguage,
    });
  }

  if (req.method === "PATCH") {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const updated = await updateGlobalProductMembershipLocales(db, ctx.parentUserId, {
      interfaceLanguage:
        body.interfaceLanguage !== undefined ? body.interfaceLanguage : undefined,
      preferredReportLanguage:
        body.preferredReportLanguage !== undefined ? body.preferredReportLanguage : undefined,
    });
    if (!updated.ok) {
      return res.status(updated.status || 500).json({
        ok: false,
        error: updated.error || "membership_update_failed",
      });
    }
    const membership = updated.membership || {};
    const interfaceLanguage = membership.interface_language || "en";
    if (body.interfaceLanguage !== undefined) {
      res.setHeader("Set-Cookie", serializeLocaleCookie(interfaceLanguage));
    }
    return res.status(200).json({
      ok: true,
      interfaceLanguage: membership.interface_language || "en",
      preferredReportLanguage:
        membership.preferred_report_language || membership.interface_language || "en",
    });
  }

  return res.status(405).json({ ok: false, error: "method_not_allowed" });
}
