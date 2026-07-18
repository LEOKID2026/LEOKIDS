"use client";

import { useRouter } from "next/router";
import DominoesScreen from "../../../components/arcade/dominoes/DominoesScreen";
import ArcadeRouteHoldShell from "../../../components/arcade/ArcadeRouteHoldShell.jsx";
import ArcadeRoomMissingShell from "../../../components/arcade/ArcadeRoomMissingShell.jsx";
import ArcadeStudentGamePageHead from "../../../components/arcade/ArcadeStudentGamePageHead.jsx";

const GAME_TITLE_KEY = "ui.student.arcadeGames.dominoes";

export default function StudentDominoesPage() {
  const router = useRouter();
  const roomId = router.isReady ? String(router.query.roomId || "").trim() : "";

  if (!router.isReady) {
    return <ArcadeRouteHoldShell />;
  }

  if (!roomId) {
    return <ArcadeRoomMissingShell gameTitleKey={GAME_TITLE_KEY} />;
  }

  return (
    <>
      <ArcadeStudentGamePageHead gameTitleKey={GAME_TITLE_KEY} />
      <div
        className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden bg-zinc-950 text-zinc-100"
        dir="ltr"
      >
        <div
          className="game-page-mobile learning-master-fill relative flex w-full flex-1 min-h-0 flex-col overflow-hidden max-md:pl-0 max-md:pr-0 md:pl-[clamp(8px,2vw,32px)] md:pr-[clamp(8px,2vw,32px)]"
          style={{
            maxWidth: "1200px",
            width: "min(1200px, 100vw)",
            margin: "0 auto",
          }}
        >
          <DominoesScreen roomId={roomId} />
        </div>
      </div>
    </>
  );
}
