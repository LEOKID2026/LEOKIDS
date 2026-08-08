import { requireParentApiContext } from "../../../../lib/auth/persona-guard.server.js";
import {
  transferGuestCoinsAndCards,
  findActiveGuestByLeoNumber,
} from "../../../../lib/guest/guest-transfer.server.js";
import { normalizeLeoNumber } from "../../../../lib/guest/guest-leo-number.server.js";
import {
  checkGuestLinkRateLimit,
  recordGuestLinkAttempt,
  hashIpForGuestLink,
  hashLeoNumberForGuestLink,
} from "../../../../lib/guest/guest-link-rate-limit.server.js";
import { clientIpFromRequest } from "../../../../lib/security/in-memory-rate-limit.js";

/**
 * @param {import("next").NextApiResponse} res
 * @param {number} status
 * @param {string} code
 */
function fail(res, status, code) {
  return res.status(status).json({ ok: false, error: code, code });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return fail(res, 405, "method_not_allowed");
  }

  const leoNumber = normalizeLeoNumber(req.body?.leoNumber);
  const targetStudentId = String(
    req.body?.targetStudentId || req.body?.studentId || ""
  ).trim();

  if (!leoNumber) {
    return fail(res, 400, "invalid_leo_number");
  }
  if (!targetStudentId) {
    return fail(res, 400, "missing_student_id");
  }

  try {
    const ctx = await requireParentApiContext(
      res,
      req.headers.authorization || ""
    );
    if (ctx.stopped) return undefined;

    const ip = clientIpFromRequest(req);
    const ipHash = hashIpForGuestLink(ip);
    const leoHash = hashLeoNumberForGuestLink(leoNumber);

    // Rate limit check — must happen before any guest DB lookup.
    const rl = await checkGuestLinkRateLimit(ctx.serviceRole, ctx.parentUserId);
    if (!rl.allowed) {
      // Await so the block row is written before we return.
      await recordGuestLinkAttempt(ctx.serviceRole, {
        parentUserId: ctx.parentUserId,
        ipHash,
        leoNumberHash: leoHash,
        outcome: "blocked",
        shouldBlock: rl.shouldBlock === true,
      });
      return fail(res, 429, "rate_limited");
    }

    const guest = await findActiveGuestByLeoNumber(ctx.serviceRole, leoNumber);

    // Determine the guest state without exposing enumeration hints.
    let guestOutcome = null;
    if (!guest?.id) {
      guestOutcome = "not_found";
    } else if (guest.guest_status === "linked") {
      guestOutcome = "already_linked";
    } else if (guest.guest_status !== "active" || guest.is_active !== true) {
      guestOutcome = "not_found";
    }

    if (guestOutcome) {
      await recordGuestLinkAttempt(ctx.serviceRole, {
        parentUserId: ctx.parentUserId,
        ipHash,
        leoNumberHash: leoHash,
        outcome: guestOutcome,
      });
      return fail(res, 404, "guest_link_failed");
    }

    const result = await transferGuestCoinsAndCards(ctx.serviceRole, {
      guestStudentId: guest.id,
      targetStudentId,
      parentId: ctx.parentUserId,
      leoNumber,
    });

    if (!result.ok) {
      await recordGuestLinkAttempt(ctx.serviceRole, {
        parentUserId: ctx.parentUserId,
        ipHash,
        leoNumberHash: leoHash,
        outcome: "error",
      });
      return fail(res, result.status || 500, "guest_link_failed");
    }

    await recordGuestLinkAttempt(ctx.serviceRole, {
      parentUserId: ctx.parentUserId,
      ipHash,
      leoNumberHash: leoHash,
      outcome: "success",
    });

    return res.status(200).json({
      ok: true,
      coinsTransferred: result.coinsTransferred,
      cardsTransferred: result.cardsTransferred,
    });
  } catch (_e) {
    return fail(res, 500, "unexpected_server_error");
  }
}
