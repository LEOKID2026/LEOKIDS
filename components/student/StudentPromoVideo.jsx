import PromoVideoClickablePreview from "../promo/PromoVideoClickablePreview.jsx";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

export const STUDENT_PROMO_DESKTOP_SRC = "/videos/promo/leo-kids-children-desktop.mp4";
export const STUDENT_PROMO_MOBILE_SRC = "/videos/promo/leo-kids-children-mobile.mp4";

/**
 * Responsive student promo — desktop 16:9 on md+; below md uses the same desktop asset in 16:9 (not the mobile file).
 * @param {{
 *   desktopSrc?: string,
 *   mobileSrc?: string,
 *   title?: string,
 *   description?: string,
 *   isBright?: boolean,
 *   compact?: boolean,
 *   compactHome?: boolean,
 *   className?: string,
 *   titleClassName?: string,
 * }} props
 */
export default function StudentPromoVideo({
  desktopSrc = STUDENT_PROMO_DESKTOP_SRC,
  mobileSrc = STUDENT_PROMO_MOBILE_SRC,
  title,
  description,
  isBright = false,
  compact = false,
  compactHome = false,
  className = "",
  titleClassName = "",
}) {
  const t = useT();
  const resolvedTitle = title ?? t("ui.student.promoTitle");
  const resolvedDescription = description ?? t("ui.student.promoDescription");
  const titleClass =
    titleClassName || (isBright ? "text-slate-900" : "text-white");
  const textClass = isBright ? "text-slate-600" : "text-white/75";
  const frameClass = isBright
    ? "border-slate-200/80 bg-slate-900/5 shadow-sm"
    : "border-white/15 bg-black/30 shadow-lg shadow-black/20";

  if (compactHome) {
    return (
      <section
        className={`shrink min-w-0 ${className}`}
        aria-label={resolvedTitle}
        data-testid="student-promo-video"
      >
        <PromoVideoClickablePreview
          src={desktopSrc}
          wrapClassName={`w-[min(46vw,180px)] md:w-[clamp(280px,22vw,360px)] aspect-video overflow-hidden rounded-xl border ${frameClass}`}
          videoClassName="h-full w-full bg-black object-contain"
          ariaLabel={resolvedTitle}
          testId="student-promo-video-compact-home"
        />
      </section>
    );
  }

  const wrapClass = compact
    ? "w-full overflow-hidden rounded-xl border"
    : "mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border";

  return (
    <section
      className={`space-y-3 text-center ${className}`}
      aria-label={resolvedTitle}
      data-testid="student-promo-video"
    >
      <h2 className={`text-lg font-bold md:text-xl ${titleClass}`}>{resolvedTitle}</h2>
      {resolvedDescription ? (
        <p className={`mx-auto max-w-xl text-sm leading-relaxed ${textClass}`}>{resolvedDescription}</p>
      ) : null}

      <PromoVideoClickablePreview
        src={desktopSrc}
        wrapClassName={`${wrapClass} ${frameClass}`}
        videoClassName="block h-auto w-full aspect-video bg-black object-contain"
        ariaLabel={t("ui.student.promoVideoAria")}
        testId="student-promo-video-desktop"
      />
    </section>
  );
}
