import Link from "next/link";

/**
 * Full-page lock when direct URL is blocked (parent lock or admin disabled).
 */
export default function GameLockedScreen({
  title = "Locked by parents",
  adminDisabled = false,
  backHref = "/games",
  backLabel = "Back to games",
}) {
  const heading = adminDisabled ? "This game is unavailable right now" : title;

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center" dir="ltr" lang="en">
      <div className="text-5xl" aria-hidden>
        {adminDisabled ? "🚫" : "🔒"}
      </div>
      <h1 className="text-xl md:text-2xl font-bold">{heading}</h1>
      <Link
        href={backHref}
        className="mt-2 rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-bold text-black"
      >
        {backLabel}
      </Link>
    </div>
  );
}
