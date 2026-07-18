import Link from "next/link";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Full-page lock when direct URL is blocked (parent lock or admin disabled).
 */
export default function GameLockedScreen({
  title,
  adminDisabled = false,
  backHref = "/games",
  backLabel,
}) {
  const { direction, locale, t } = useI18n();
  const resolvedTitle = title ?? t("ui.student.parentLocked");
  const resolvedBackLabel = backLabel ?? t("ui.games.locked.backToGames");
  const heading = adminDisabled ? t("ui.games.locked.unavailable") : resolvedTitle;

  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
      dir={direction}
      lang={locale}
    >
      <div className="text-5xl" aria-hidden>
        {adminDisabled ? "🚫" : "🔒"}
      </div>
      <h1 className="text-xl md:text-2xl font-bold">{heading}</h1>
      <Link
        href={backHref}
        className="mt-2 rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-bold text-black"
      >
        {resolvedBackLabel}
      </Link>
    </div>
  );
}
