import { getLearningSupabaseServiceRoleClient } from "../../../../lib/learning-supabase/server";
import {
  clearStudentSessionCookie,
  getAuthenticatedStudentSession,
} from "../../../../lib/learning-supabase/student-auth";
import { guardCookieMutationOrigin } from "../../../../lib/security/api-guards.js";
import { economyUnavailableHttpResponse } from "../../../../lib/rewards/economy-errors.js";
import { guardEconomyAvailable } from "../../../../lib/rewards/guards.server.js";
import { readJsonBody } from "../../../../lib/learning-supabase/learning-activity";
import {
  computeServerDurationMs,
  loadActiveSoloGameSession,
  validatePlayDurationMs,
} from "../../../../lib/solo-games/server/solo-game-session.server.js";
import { finalizeSoloGameSession } from "../../../../lib/solo-games/server/solo-game-payout.server.js";
import { assertStudentCanPlayGame } from "../../../../lib/games/server/game-access.server.js";

/** Metrics persisted for smart-blocks finish validation + metrics_json. */
const SMART_BLOCKS_METRIC_KEYS = Object.freeze([
  "moves",
  "placedBlocks",
  "clearedRows",
  "clearedColumns",
  "clearedLinesTotal",
  "combos",
  "bestCombo",
  "durationSec",
  "accuracy",
]);

/** Metrics persisted for fruit-slice finish validation + metrics_json. */
const FRUIT_SLICE_METRIC_KEYS = Object.freeze([
  "slicedFruits",
  "missedFruits",
  "bombHits",
  "strikes",
  "combos",
  "bestCombo",
  "durationSec",
  "accuracy",
]);

function normalizeMetrics(raw) {
  if (!raw || typeof raw !== "object") return null;
  const metrics = {
    score: Number(raw.score),
    didWin: raw.didWin === true,
    difficulty: raw.difficulty != null ? String(raw.difficulty).trim().toLowerCase() : null,
    levelReached: raw.levelReached != null ? Number(raw.levelReached) : null,
    mistakes: raw.mistakes != null ? Number(raw.mistakes) : null,
    timeRemainingSec: raw.timeRemainingSec != null ? Number(raw.timeRemainingSec) : null,
    durationMs: raw.durationMs != null ? Number(raw.durationMs) : null,
  };

  for (const key of SMART_BLOCKS_METRIC_KEYS) {
    if (raw[key] != null) {
      metrics[key] = Number(raw[key]);
    }
  }

  for (const key of FRUIT_SLICE_METRIC_KEYS) {
    if (raw[key] != null) {
      metrics[key] = Number(raw[key]);
    }
  }

  return metrics;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed", code: "method_not_allowed" });
  }

  if (guardCookieMutationOrigin(req, res)) return;
  if (!guardEconomyAvailable(res)) return;

  try {
    const auth = await getAuthenticatedStudentSession(req);
    if (!auth) {
      clearStudentSessionCookie(res);
      return res.status(401).json({ ok: false, error: "not_authenticated", code: "not_authenticated" });
    }

    const body = await readJsonBody(req);
    const sessionId = String(body?.sessionId || "").trim();
    const metrics = normalizeMetrics(body?.metrics);

    if (!sessionId) {
      return res.status(400).json({ ok: false, error: "missing_game_id", code: "missing_game_id" });
    }
    if (!metrics || !Number.isFinite(metrics.score)) {
      return res.status(400).json({ ok: false, error: "invalid_game_data", code: "invalid_game_data" });
    }

    const supabase = getLearningSupabaseServiceRoleClient();
    const loaded = await loadActiveSoloGameSession(supabase, sessionId, auth.studentId);
    if (!loaded.ok) {
      const code = loaded.code || "not_found";
      return res.status(404).json({ ok: false, error: code, code });
    }

    const access = await assertStudentCanPlayGame(supabase, auth.studentId, loaded.session.game_key);
    if (!access.ok) {
      const code = access.code || "forbidden";
      return res.status(access.status || 403).json({
        ok: false,
        error: code,
        code,
        category: access.category,
      });
    }

    const finishedAt = new Date().toISOString();
    const serverDurationMs = computeServerDurationMs(loaded.session.started_at, finishedAt);
    const durationCheck = validatePlayDurationMs(serverDurationMs);
    if (!durationCheck.ok) {
      const code = durationCheck.code || "invalid_game_data";
      return res.status(400).json({ ok: false, error: code, code });
    }

    metrics.durationMs = serverDurationMs;

    const result = await finalizeSoloGameSession(supabase, {
      session: loaded.session,
      studentId: auth.studentId,
      metrics,
      finishedAt,
    });

    if (!result.ok) {
      const status =
        result.code === "invalid_metrics" ? 400 : result.code === "coin_failed" ? 500 : 400;
      const code = result.code || "finish_failed";
      return res.status(status).json({ ok: false, error: code, code });
    }

    return res.status(200).json({
      ok: true,
      coinsAwarded: result.coinsAwarded,
      breakdownHe: result.breakdownHe,
      balanceAfter: result.balanceAfter,
      diamondsAwarded: result.diamondsAwarded,
      diamondBreakdownHe: result.diamondBreakdownHe,
      diamondBalanceAfter: result.diamondBalanceAfter,
      didWin: result.didWin,
      score: result.score,
      displayLevelHe: result.displayLevelHe,
      duplicate: result.duplicate === true,
      diamondDuplicate: result.diamondDuplicate === true,
    });
  } catch (e) {
    if (e?.name === "EconomyUnavailableError") {
      return res.status(503).json(economyUnavailableHttpResponse(e));
    }
    return res.status(500).json({ ok: false, error: "server_error", code: "server_error" });
  }
}
