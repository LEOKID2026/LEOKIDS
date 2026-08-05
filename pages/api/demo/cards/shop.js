import { getLearningSupabaseServiceRoleClient } from "../../../../lib/learning-supabase/server";
import { getDemoCardsShopView } from "../../../../lib/rewards/server/reward-cards.server.js";
import { normalizePracticeGradeKey } from "../../../../lib/learning-supabase/practice-grade-resolution.js";
import { isCardRewardsEnabled } from "../../../../lib/rewards/reward-feature-flags.js";
import { buildDemoCardsShopFixture } from "../../../../lib/demo/demo-cards-shop-fixture.js";
import { DEMO_COIN_BALANCE } from "../../../../components/demo/demo-display-fixtures.js";
import { resolveCardApiLocales } from "../../../../lib/rewards/server/card-api-locale.server.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.setHeader("Vary", "Cookie, Accept-Language, x-lk-interface-locale");

  let contentLocale = "en";
  try {
    contentLocale = resolveCardApiLocales(req).contentLocale;
  } catch {
    contentLocale = "en";
  }

  // Demo shop must stay open even when card-rewards flag/DB is unavailable.
  if (!isCardRewardsEnabled()) {
    return res.status(200).json({
      ok: true,
      contentLocale,
      ...buildDemoCardsShopFixture(DEMO_COIN_BALANCE),
      demo: true,
      fixture: true,
    });
  }

  try {
    const gradeLevel =
      normalizePracticeGradeKey(String(req.query.gradeLevel || "g3")) || "g3";
    const supabase = getLearningSupabaseServiceRoleClient();
    const view = await getDemoCardsShopView(supabase, gradeLevel, DEMO_COIN_BALANCE, contentLocale);
    const shop = Array.isArray(view?.shop) ? view.shop : [];
    if (shop.length === 0) {
      return res.status(200).json({
        ok: true,
        contentLocale,
        ...buildDemoCardsShopFixture(DEMO_COIN_BALANCE),
        demo: true,
        fixture: true,
      });
    }
    return res.status(200).json({ ok: true, contentLocale, ...view, demo: true });
  } catch (_err) {
    return res.status(200).json({
      ok: true,
      contentLocale,
      ...buildDemoCardsShopFixture(DEMO_COIN_BALANCE),
      demo: true,
      fixture: true,
    });
  }
}
