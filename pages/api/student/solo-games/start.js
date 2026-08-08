import { getLearningSupabaseServiceRoleClient } from "../../../../lib/learning-supabase/server";
import {
  clearStudentSessionCookie,
  getAuthenticatedStudentSession,
} from "../../../../lib/learning-supabase/student-auth";
import { guardCookieMutationOrigin } from "../../../../lib/security/api-guards.js";
import { economyUnavailableHttpResponse } from "../../../../lib/rewards/economy-errors.js";
import { guardEconomyAvailable } from "../../../../lib/rewards/guards.server.js";
import { readJsonBody } from "../../../../lib/learning-supabase/learning-activity";
import { createSoloGameSession } from "../../../../lib/solo-games/server/solo-game-session.server.js";
import { assertStudentCanPlayGame } from "../../../../lib/games/server/game-access.server.js";
import { isValidSoloDifficulty, isValidSoloGameKey } from "../../../../lib/solo-games/solo-game-registry.js";

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
    const gameKey = String(body?.gameKey || "").trim().toLowerCase();
    const difficulty =
      body?.difficulty != null ? String(body.difficulty).trim().toLowerCase() : null;

    if (!isValidSoloGameKey(gameKey)) {
      return res.status(400).json({ ok: false, error: "invalid_game", code: "invalid_game" });
    }
    if (difficulty && !isValidSoloDifficulty(difficulty)) {
      return res.status(400).json({ ok: false, error: "invalid_difficulty", code: "invalid_difficulty" });
    }

    const supabase = getLearningSupabaseServiceRoleClient();

    const access = await assertStudentCanPlayGame(supabase, auth.studentId, gameKey);
    if (!access.ok) {
      const code = access.code || "forbidden";
      return res.status(access.status || 403).json({
        ok: false,
        error: code,
        code,
        category: access.category,
      });
    }

    const result = await createSoloGameSession(supabase, {
      studentId: auth.studentId,
      gameKey,
      difficulty,
    });

    if (!result.ok) {
      const code = result.code || "start_failed";
      return res.status(400).json({ ok: false, error: code, code });
    }

    return res.status(200).json({
      ok: true,
      sessionId: result.sessionId,
      startedAt: result.startedAt,
      gameKey: result.gameKey,
      difficulty: result.difficulty,
    });
  } catch (e) {
    if (e?.name === "EconomyUnavailableError") {
      return res.status(503).json(economyUnavailableHttpResponse(e));
    }
    return res.status(500).json({ ok: false, error: "server_error", code: "server_error" });
  }
}
