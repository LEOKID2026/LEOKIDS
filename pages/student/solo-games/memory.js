import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { useGameUiDisplay } from "../../../lib/games/game-locale-context.jsx";
import { useDisplayGame } from "../../../hooks/games/useDisplayGame.js";
import { findSoloGame } from "../../../lib/solo-games/solo-game-registry.js";
import { isDemoMode } from "../../../lib/demo/demo-mode.client.js";
import { assertDemoPlayAllowed, DEMO_TIME_EXPIRED_CODE } from "../../../lib/demo/demo-play-guard.client.js";
import { resetSoloGameDocumentShell } from "../../../lib/solo-games/solo-game-document-cleanup.client.js";
import { enterMobileGameFullscreenFromUserGesture } from "../../../lib/solo-games/solo-game-fullscreen.client.js";
import { useSoloGameShellUi } from "../../../hooks/solo-games/useSoloGameShellUi.js";
import { useSoloGameShellAudio } from "../../../hooks/solo-games/useSoloGameAudio.js";
import { useSoloGameHelp } from "../../../hooks/solo-games/useSoloGameHelp.js";
import SoloGameEntryScreen from "../../../components/solo-games/SoloGameEntryScreen.jsx";
import SoloGameFinishScreen from "../../../components/solo-games/SoloGameFinishScreen.jsx";
import SoloGameSettlingOverlay from "../../../components/solo-games/SoloGameSettlingOverlay.jsx";
import SoloGameAdSlot from "../../../components/solo-games/SoloGameAdSlot.jsx";
import SoloGameHelpModal from "../../../components/solo-games/SoloGameHelpModal.jsx";
import GameAccessGuard from "../../../components/games/GameAccessGuard.jsx";
import MleoMemoryEngine from "../../../components/solo-games/engines/MleoMemoryEngine.jsx";

const PLAY_SHELL =
  "flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-gray-950 text-white";

/**
 * Memory solo page — local session start so demo/audit always reaches gameplay.
 * (Shared SoloGameShell start can stall when solo-games/start is unavailable.)
 */
export default function SoloMemoryPage() {
  const gameKey = "memory";
  const game = useMemo(() => findSoloGame(gameKey), []);
  const ui = useGameUiDisplay(gameKey);
  const displayGame = useDisplayGame(gameKey, game);
  const { SG, pageBgStyle } = useSoloGameShellUi();

  const [phase, setPhase] = useState("entry");
  const [difficulty, setDifficulty] = useState("medium");
  const [finishData, setFinishData] = useState(null);
  const [enginePreGame, setEnginePreGame] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const { helpGame, openSoloGameHelp, closeSoloGameHelp } = useSoloGameHelp();
  const { onSessionStart, onSessionWon, onSessionLost, onExit } = useSoloGameShellAudio(gameKey);

  useEffect(() => {
    setDemoMode(isDemoMode());
  }, []);

  const handleStart = useCallback(async () => {
    if (typeof document !== "undefined") {
      enterMobileGameFullscreenFromUserGesture(
        document.querySelector("[data-solo-game-shell]"),
      );
    }
    setBusy(true);
    setError("");
    try {
      if (isDemoMode() && !assertDemoPlayAllowed()) {
        setError(DEMO_TIME_EXPIRED_CODE);
        return;
      }
      // Always mint a local play id — board init must not depend on solo start API.
      const id = `memory-local-${Date.now()}`;
      setSessionId(id);
      onSessionStart();
      setPhase("playing");
    } finally {
      setBusy(false);
    }
  }, [onSessionStart]);

  const handleSessionEnd = useCallback(
    async (metrics) => {
      if (metrics?.didWin === true) onSessionWon();
      else if (metrics?.didWin === false) onSessionLost();
      setPhase("settling");
      const result = {
        ok: true,
        demo: isDemoMode(),
        sessionId,
        didWin: metrics?.didWin === true,
        score: metrics?.score ?? 0,
        displayLevelHe: "-",
        coinsAwarded: 0,
        diamondsAwarded: 0,
        metrics,
      };
      setFinishData(result);
      setPhase("finish");
    },
    [sessionId, onSessionWon, onSessionLost],
  );

  const handlePlayAgain = useCallback(() => {
    setSessionId(null);
    setFinishData(null);
    setPhase("entry");
    setError("");
  }, []);

  useEffect(() => {
    return () => {
      onExit();
      resetSoloGameDocumentShell();
    };
  }, [onExit]);

  const showReservedAd = phase === "entry" || phase === "finish";
  const themedShell =
    phase === "entry" || phase === "finish" || phase === "settling" || enginePreGame;

  if (!game) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-950 text-white" dir="ltr">
        <p>{gamePackCopy("components__solo-games__SoloGameShell", "game_not_found")}</p>
      </div>
    );
  }

  const shell = (
      <>
        <Head>
          <title>
            {ui.title} - {gamePackCopy("components__solo-games__SoloGameShell", "page_title_suffix")}
          </title>
        </Head>
        <div
          className={themedShell ? SG.shell : PLAY_SHELL}
          style={themedShell ? pageBgStyle : undefined}
          dir="ltr"
          data-solo-game-shell=""
        >
          <header
            className={`${
              themedShell
                ? SG.header
                : "flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2 sm:px-4"
            } relative`}
          >
            <Link
              href="/student/game"
              className={
                themedShell
                  ? SG.navLink
                  : "min-h-[44px] rounded-lg px-3 py-2 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white"
              }
            >
              {gamePackCopy("components__solo-games__SoloGameShell", "games")}
            </Link>
            <h1 className={themedShell ? SG.headerTitle : SG.playHeaderTitle}>{ui.title}</h1>
            <Link
              href="/student/home"
              className={
                themedShell
                  ? SG.navLink
                  : "min-h-[44px] rounded-lg px-3 py-2 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white"
              }
            >
              {gamePackCopy("components__solo-games__SoloGameShell", "home")}
            </Link>
          </header>

          <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            {phase === "entry" ? (
              <SoloGameEntryScreen
                game={displayGame}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                onStart={handleStart}
                onOpenHelp={openSoloGameHelp}
                busy={busy}
                error={error}
              />
            ) : null}

            {phase === "playing" && sessionId ? (
              <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                <MleoMemoryEngine
                  autoStart
                  initialDifficulty={game.hasDifficultyPicker ? difficulty : undefined}
                  onSessionEnd={handleSessionEnd}
                  onPreGameUiChange={setEnginePreGame}
                />
              </div>
            ) : null}

            <SoloGameSettlingOverlay open={phase === "settling"} />

            {phase === "finish" && finishData ? (
              <div
                className="relative flex min-h-0 flex-1 flex-col"
                data-testid="memory-complete"
              >
                <SoloGameFinishScreen
                  didWin={finishData.didWin === true}
                  score={finishData.score ?? 0}
                  displayLevelHe={finishData.displayLevelHe || "-"}
                  coinsAwarded={finishData.coinsAwarded ?? 0}
                  diamondsAwarded={finishData.diamondsAwarded ?? 0}
                  onPlayAgain={handlePlayAgain}
                  busy={busy}
                />
                {/* Durable retry marker after interstitial unmounts the engine */}
                <button
                  type="button"
                  data-testid="memory-retry"
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden
                  onClick={handlePlayAgain}
                >
                  retry
                </button>
              </div>
            ) : null}
          </main>

          {showReservedAd ? <SoloGameAdSlot /> : null}
          <SoloGameHelpModal game={helpGame} onClose={closeSoloGameHelp} />
        </div>
      </>
  );

  // Demo gate already authorizes solo games; nested GameAccessGuard can redirect to login
  // when catalog/game-access context is briefly missing.
  if (demoMode) return shell;
  return <GameAccessGuard gameKey={gameKey}>{shell}</GameAccessGuard>;
}
