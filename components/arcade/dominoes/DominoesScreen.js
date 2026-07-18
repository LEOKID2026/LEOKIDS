"use client";

import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDominoesSession } from "../../../hooks/arcade/useDominoesSession";
import { useArcadeRoomExit } from "../../../hooks/arcade/useArcadeRoomExit";
import ArcadeGameSocialDock from "../club/ArcadeGameSocialDock.jsx";
import StudentAdSlot from "../../student/StudentAdSlot.jsx";

const GAME_TITLE = gamePackCopy("components__arcade__dominoes__DominoesScreen", "dominoes");

const HUD_CONTROL_H = "h-9";
const HUD_CHIP =
  "rounded-lg border border-white/20 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:bg-white/[0.11] active:scale-[0.97]";
const HUD_BTN_BASE = `flex ${HUD_CONTROL_H} shrink-0 items-center justify-center ${HUD_CHIP}`;
const HUD_BTN_SQUARE = `${HUD_BTN_BASE} w-9`;

/** @param {{ onLeave: () => void, disabled?: boolean, busy?: boolean }} props */
function LeaveRow({ onLeave, disabled = false, busy = false }) {
  return (
    <div className="mt-0 flex w-full shrink-0 justify-center border-t border-white/10 px-1 pb-1 pt-2">
      <button
        type="button"
        onClick={onLeave}
        disabled={disabled || busy}
        className="min-h-[2.5rem] w-full max-w-xs rounded-xl border border-rose-500/35 bg-rose-950/35 px-4 py-2 text-sm font-extrabold text-rose-100 disabled:opacity-50 sm:max-w-sm"
      >
        {busy ? "Leaving…" : "Leave"}
      </button>
    </div>
  );
}

/** @param {{ onBack: () => void, balance: number | null, onOpenHelp: () => void }} props */
function Hud({ onBack, balance, onOpenHelp }) {
  return (
    <header
      dir="ltr"
      className="relative z-20 flex w-full shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.14] bg-gradient-to-b from-zinc-700/90 via-zinc-900/95 to-black/90 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_28px_rgba(0,0,0,0.45)] sm:gap-2 sm:px-2.5 sm:py-2"
    >
      <button type="button" onClick={onBack} className={`${HUD_BTN_BASE} min-w-[3.75rem] px-2 sm:min-w-[4rem]`}>
        <span className="text-xs font-extrabold text-white sm:text-sm">Back</span>
      </button>
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-base font-extrabold text-white sm:text-lg">{GAME_TITLE}</h1>
      </div>
      <div
        className={`flex ${HUD_CONTROL_H} min-w-[4.75rem] shrink-0 items-center gap-1 rounded-lg border border-amber-500/35 bg-black/55 px-2`}
      >
        <img src="/images/coin.png" alt="" className="h-6 w-6 object-contain sm:h-7 sm:w-7" />
        <span className="font-mono text-sm font-bold text-amber-100 sm:text-base">{balance === null ? "…" : balance}</span>
      </div>
      <button type="button" onClick={onOpenHelp} className={HUD_BTN_SQUARE} aria-label="Help">
        <span className="text-lg text-white/95">?</span>
      </button>
    </header>
  );
}

/** @param {{ open: boolean, onClose: () => void }} props */
function HowToModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog">
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div
        dir="ltr"
        className="relative z-[1] max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/15 bg-zinc-900 p-4 shadow-2xl"
      >
        <div className="mb-3 flex justify-between border-b border-white/10 pb-2">
          <h2 className="text-lg font-bold text-white">How to play</h2>
          <button type="button" onClick={onClose} className="text-sm text-zinc-300">
            Close
          </button>
        </div>
        <ul className="list-disc space-y-2 pr-5 text-sm text-zinc-200">
          <li>{gamePackCopy("components__arcade__dominoes__DominoesScreen", "double_6_set_two_players_seven_tiles_each")}</li>
          <li>{gamePackCopy("components__arcade__dominoes__DominoesScreen", "opener_is_the_highest_double_or_highest_pip_total")}</li>
          <li>{gamePackCopy("components__arcade__dominoes__DominoesScreen", "play_a_tile_matching_an_open_end_of_the_chain")}</li>
          <li>{gamePackCopy("components__arcade__dominoes__DominoesScreen", "no_legal_move_pass_two_passes_in_a_row_end_in_a_block_lowest_pip_total_w")}</li>
          <li>{gamePackCopy("components__arcade__dominoes__DominoesScreen", "empty_your_hand_to_win")}</li>
        </ul>
      </div>
    </div>
  );
}

/** @param {{ a: number, b: number, compact?: boolean, highlight?: boolean }} props */
function DominoGlyph({ a, b, compact = false, highlight = false }) {
  return (
    <div
      className={`inline-flex select-none items-stretch overflow-hidden rounded-md border ${
        highlight ? "border-emerald-400/90 ring-2 ring-emerald-400/50" : "border-white/25"
      } bg-gradient-to-b from-zinc-700/95 to-zinc-900/95 shadow-inner`}
      style={{ minWidth: compact ? "3.25rem" : "4.25rem", minHeight: compact ? "2.25rem" : "2.75rem" }}
    >
      <div className="flex flex-1 items-center justify-center border-l border-white/15 font-mono text-xs font-bold text-amber-100 sm:text-sm">
        {a}
      </div>
      <div className="flex flex-1 items-center justify-center font-mono text-xs font-bold text-amber-100 sm:text-sm">{b}</div>
    </div>
  );
}

/** @param {{ roomId: string }} props */
export default function DominoesScreen({ roomId }) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const session = useDominoesSession({ roomId });
  const { snapshot, vm, busy, err, setErr, submitPlay, submitPass, room, players, gameSession, bundleLoaded, bundleError, stopPolling } =
    session;

  const [balance, setBalance] = useState(/** @type {number|null} */ (null));
  const [helpOpen, setHelpOpen] = useState(false);
  const { exitToLobby, leaveBusy } = useArcadeRoomExit({ roomId, stopPolling });
  const onLeaveRoom = exitToLobby;
  const [sidePickTileId, setSidePickTileId] = useState(/** @type {number|null} */ (null));

  useEffect(() => {
    setSidePickTileId(null);
  }, [vm.revision, vm.phase]);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/arcade/balance", { credentials: "same-origin" });
        const j = await res.json().catch(() => ({}));
        if (cancelled || !j?.ok || j.balance == null) return;
        setBalance(Number(j.balance));
      } catch {
        if (!cancelled) setBalance(null);
      }
    };
    void tick();
    const id = setInterval(() => void tick(), 25000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const goBack = useCallback(() => {
    const r = routerRef.current;
    if (typeof window !== "undefined" && window.history.length > 1) r.back();
    else void r.replace("/student/arcade");
  }, []);

  const showLobbyWait = room?.status === "waiting";
  const showSessionInitError = bundleLoaded && room?.status === "active" && !snapshot && !gameSession;
  const showBoardLoading = !showLobbyWait && room?.status === "active" && !snapshot && !showSessionInitError;

  const seatLabels = useMemo(() => {
    const out = ["", ""];
    for (const m of players || []) {
      const si = Number(m?.seat_index);
      if (si !== 0 && si !== 1) continue;
      out[si] = String(m?.display_name ?? "").trim() || `Player ${si + 1}`;
    }
    return [out[0] || "Player 1", out[1] || "Player 2"];
  }, [players]);

  const playsForTile = useCallback(
    (tileId) => vm.legalPlays.filter((p) => p.tileId === tileId),
    [vm.legalPlays],
  );

  const onHandTileClick = useCallback(
    async (tileId) => {
      if (busy || vm.phase !== "playing" || !vm.canClientAct) return;
      if (vm.mustPass) return;
      const plays = playsForTile(tileId);
      if (plays.length === 0) return;
      setErr("");
      if (plays.length === 1) {
        await submitPlay(plays[0].tileId, plays[0].side);
        return;
      }
      setSidePickTileId((prev) => (prev === tileId ? null : tileId));
    },
    [busy, vm.phase, vm.canClientAct, vm.mustPass, playsForTile, submitPlay, setErr],
  );

  const onPickSide = useCallback(
    async (side) => {
      if (sidePickTileId == null) return;
      setErr("");
      await submitPlay(sidePickTileId, side);
      setSidePickTileId(null);
    },
    [sidePickTileId, submitPlay, setErr],
  );

  const onPassClick = useCallback(async () => {
    if (busy || !vm.canClientAct || !vm.mustPass) return;
    setErr("");
    await submitPass();
  }, [busy, vm.canClientAct, vm.mustPass, submitPass, setErr]);

  const finished = vm.phase === "finished";
  const didIWin = vm.mySeat != null && vm.winnerSeat != null && vm.winnerSeat === vm.mySeat;
  const isDraw = finished && (vm.winnerSeat === null || vm.winnerSeat === undefined);

  const endsLine =
    vm.openEnds && typeof vm.openEnds === "object"
      ? `Open ends: ${vm.openEnds.left} · ${vm.openEnds.right}`
      : null;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-zinc-950 px-2 pt-2">
      <Hud onBack={goBack} balance={balance} onOpenHelp={() => setHelpOpen(true)} />
      <HowToModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      <div className="min-h-0 flex flex-1 flex-col overflow-y-auto pb-2">
        {bundleError ? (
          <p className="mt-2 rounded border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-100">{bundleError}</p>
        ) : null}

        {showLobbyWait ? (
          <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/25 px-4 py-6 text-center text-amber-100">
            <p className="text-lg font-bold">Waiting for a player…</p>
            <p className="mt-2 text-sm text-amber-200/90">Dominoes — two players required</p>
          </div>
        ) : null}

        {showSessionInitError ? (
          <p className="mt-4 text-center text-sm text-rose-200">Couldn't load the game — try refreshing</p>
        ) : null}
        {showBoardLoading ? <p className="mt-6 text-center text-zinc-400">Loading…</p> : null}

        {!showLobbyWait && snapshot ? (
          <>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-zinc-400 sm:text-sm">
              <span className="max-w-[48%] truncate font-semibold text-amber-100/90">
                {seatLabels[0]} · tiles: {vm.mySeat === 0 ? vm.myHand.length : vm.opponentHandCount}
              </span>
              <span className="max-w-[48%] truncate font-semibold text-zinc-200">
                {seatLabels[1]} · tiles: {vm.mySeat === 1 ? vm.myHand.length : vm.opponentHandCount}
              </span>
            </div>

            <div className="mt-3 rounded-xl border border-amber-900/35 bg-zinc-900/40 p-2">
              <p className="mb-2 text-center text-[11px] font-semibold text-zinc-500">Chain</p>
              <div className="flex min-h-[3.5rem] flex-wrap items-center justify-center gap-1.5 overflow-x-auto py-1">
                {vm.chain.length === 0 ? (
                  <span className="text-sm text-zinc-500">The first tile goes here</span>
                ) : (
                  vm.chain.map((seg) => (
                    <DominoGlyph key={`${seg.tileId}-${seg.leftPip}-${seg.rightPip}`} a={seg.leftPip} b={seg.rightPip} />
                  ))
                )}
              </div>
              {endsLine ? <p className="mt-1 text-center text-[11px] text-zinc-500">{endsLine}</p> : null}
            </div>

            <div className="mx-auto mt-4 w-full max-w-[min(96vw,520px)] space-y-3">
              <p className="text-center text-xs font-semibold text-zinc-500">My hand</p>
              <div className="flex flex-wrap items-end justify-center gap-2">
                {vm.myHand.map((t) => {
                  const plays = playsForTile(t.id);
                  const canTap = vm.phase === "playing" && vm.canClientAct && !vm.mustPass && plays.length > 0;
                  const hl = sidePickTileId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={!canTap || busy}
                      onClick={() => void onHandTileClick(t.id)}
                      className={`rounded-lg p-0.5 transition ${canTap ? "hover:scale-[1.03] active:scale-[0.98]" : "opacity-60"}`}
                    >
                      <DominoGlyph a={t.a} b={t.b} compact highlight={hl} />
                    </button>
                  );
                })}
              </div>

              {sidePickTileId != null && playsForTile(sidePickTileId).length > 1 ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="w-full text-center text-xs text-zinc-400">Choose which end to play:</span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onPickSide("left")}
                    className="rounded-lg border border-emerald-500/40 bg-emerald-950/35 px-4 py-2 text-sm font-bold text-emerald-100"
                  >
                    Left end
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onPickSide("right")}
                    className="rounded-lg border border-sky-500/40 bg-sky-950/35 px-4 py-2 text-sm font-bold text-sky-100"
                  >
                    Right end
                  </button>
                </div>
              ) : null}

              {vm.mustPass && vm.canClientAct ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onPassClick()}
                    className="rounded-xl border border-amber-500/45 bg-amber-950/40 px-8 py-3 text-base font-extrabold text-amber-100"
                  >
                    Pass (no move)
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-4 space-y-2 text-center">
              {err ? <p className="text-sm text-rose-300">{err}</p> : null}
              {finished ? (
                <div className="space-y-1">
                  <p className="text-lg font-bold text-amber-200">
                    {isDraw ? "Draw (blocked)" : didIWin ? "You won!" : `You lost — ${seatLabels[vm.winnerSeat ?? -1] ?? ""} won`}
                  </p>
                  {vm.mySettlementAmount != null ? (
                    <p className="text-sm text-zinc-400">
                      Coin settlement: {vm.mySettlementAmount}
                      {vm.prizePoolAmount != null ? ` (pot: ${vm.prizePoolAmount})` : ""}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">
                  {busy
                    ? "Sending…"
                    : vm.canClientAct
                      ? vm.mustPass
                        ? "No legal move — pass"
                        : gamePackCopy("components__arcade__dominoes__DominoesScreen", "pick_a_tile_or_an_end_if_shown")
                      : "Wait for your turn"}
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>

      {room ? (
        <>
          <ArcadeGameSocialDock roomId={roomId} gameSession={gameSession} />
          <LeaveRow onLeave={onLeaveRoom} busy={leaveBusy} disabled={!String(roomId || "").trim()} />
        </>
      ) : null}
      <StudentAdSlot variant="dvh" dataAdSlot="arcade-ad-reserved" />
    </div>
  );
}
