import Link from "next/link";
import { useStudentActivityUi } from "../../hooks/useStudentActivityUi.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";

/**
 * Unified assigned-activity page shell — header, progress, card grid, footer.
 * Used by parent / teacher-individual / classroom scopes (single play page).
 *
 * @param {{
 *   title: string,
 *   subtitle: string,
 *   progressPct: number,
 *   visual: React.ReactNode,
 *   actions: React.ReactNode,
 *   footer?: React.ReactNode,
 *   singleColumn?: boolean,
 *   overlayTopRef?: React.RefObject<HTMLElement|null>,
 *   overlayWidthRef?: React.RefObject<HTMLElement|null>,
 *   scratchpadDockAnchorRef?: React.RefObject<HTMLElement|null>,
 *   scratchpadDock?: React.ReactNode,
 *   usesScratchpadDock?: boolean,
 * }} props
 */
export default function StudentAssignedActivityShell({
  title,
  subtitle,
  progressPct,
  visual,
  actions,
  footer = null,
  singleColumn = false,
  overlayTopRef,
  overlayWidthRef,
  scratchpadDockAnchorRef,
  scratchpadDock = null,
  usesScratchpadDock = false,
}) {
  const { L, textualAssigned } = useStudentActivityUi();
  const { direction, locale } = useI18n();
  const footerOffset = L.layoutFooterOffsetPx;
  const backLabel = globalBurnDownCopy(
    "components__student__StudentAssignedActivityShell",
    "back_to_home"
  );

  return (
    <div
      className={L.page}
      dir={direction}
      lang={locale}
      data-scratchpad-dock={usesScratchpadDock ? "true" : undefined}
      data-activity-layout={textualAssigned ? "textual-assigned" : "default"}
    >
      <div ref={overlayTopRef}>
        <div className={L.headerRow} dir={direction}>
          <div className={L.headerNavGroup}>
            <Link href="/student/home" className={L.backLink}>
              {backLabel}
            </Link>
          </div>
          <div className={L.titleBlock} dir={direction}>
            <h1 className={L.title}>{title}</h1>
            <p className={L.subtitle}>{subtitle}</p>
          </div>
        </div>

        <div className={L.progressTrack} aria-hidden>
          <div className={L.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div ref={overlayWidthRef} className={L.card}>
        <div className={singleColumn ? "flex flex-col gap-3 min-w-0" : L.cardGrid}>
          <div
            className={
              singleColumn
                ? "min-w-0 overflow-visible"
                : usesScratchpadDock
                  ? `${L.questionStage} ${L.scratchpadOpenQuestionStage}`
                  : L.questionStage
            }
            data-testid="activity-question-stage"
          >
            {visual}
          </div>
          {!usesScratchpadDock ? (
            <div className={L.actionsPanel} data-testid="activity-actions-panel">
              {actions}
            </div>
          ) : null}
        </div>
      </div>

      {footer && !usesScratchpadDock ? <div className={L.footerNav}>{footer}</div> : null}

      {scratchpadDock ? (
        <div
          className={L.scratchpadDockShell}
          style={{ bottom: `${footerOffset}px` }}
          data-testid="activity-scratchpad-bottom-dock"
        >
          <div ref={scratchpadDockAnchorRef} className="h-0 w-full shrink-0" aria-hidden />
          <div className={L.scratchpadDockInner}>{scratchpadDock}</div>
        </div>
      ) : null}
    </div>
  );
}
