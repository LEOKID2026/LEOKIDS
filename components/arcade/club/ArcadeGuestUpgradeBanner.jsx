import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import Link from "next/link";

const SLUG = "components__arcade__club__ArcadeGuestUpgradeBanner";

/** @param {{ className?: string }} props */
export default function ArcadeGuestUpgradeBanner({ className = "" }) {
  return (
    <div
      className={`rounded-xl border border-amber-400/30 bg-gradient-to-l from-amber-500/15 to-transparent p-3 text-left ${className}`}
      dir="ltr"
    >
      <p className="text-sm font-semibold text-amber-100">{gamePackCopy(SLUG, "title")}</p>
      <p className="mt-1 text-xs text-amber-100/75">{gamePackCopy(SLUG, "body")}</p>
      <Link
        href="/student/home"
        className="mt-2 inline-block rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black"
      >
        {gamePackCopy(SLUG, "home_screen")}
      </Link>
    </div>
  );
}
