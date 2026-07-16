import Link from "next/link";

/** @param {{ className?: string }} props */
export default function ArcadeGuestUpgradeBanner({ className = "" }) {
  return (
    <div
      className={`rounded-xl border border-amber-400/30 bg-gradient-to-l from-amber-500/15 to-transparent p-3 text-left ${className}`}
      dir="ltr"
    >
      <p className="text-sm font-semibold text-amber-100">Upgrade to a Leo profile for the full experience</p>
      <p className="mt-1 text-xs text-amber-100/75">
        Linking with a parent keeps coins, cards, and display name — without blocking games.
      </p>
      <Link
        href="/student/home"
        className="mt-2 inline-block rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black"
      >
        Home screen
      </Link>
    </div>
  );
}
