import StudentThemePicker from "../student/StudentThemePicker";
import LearningMasterAudioButton from "./LearningMasterAudioButton.jsx";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Integrated desktop top row: back + title + curriculum (md+ only).
 * Side controls use the same physical left/right placement as LearningMasterNavBar
 * so RTL page dir does not flip back vs curriculum on desktop.
 */
export default function LearningMasterDesktopHeader({
  MB,
  desktopHeaderRef,
  titleAnchorRef,
  title,
  subtitle,
  onBack,
  onCurriculumClick,
  curriculumLabel,
  audio,
}) {
  const t = useT();
  const resolvedCurriculumLabel = curriculumLabel ?? t("learning.master.curriculum");
  const audioOn =
    audio?.settings?.masterEnabled &&
    audio?.settings?.sfxEnabled;

  return (
    <div
      ref={desktopHeaderRef}
      className="hidden md:block shrink-0 relative z-50 pointer-events-none"
    >
      <div className="relative px-2 md:px-4 min-h-[2.25rem]">
        {onCurriculumClick ? (
          <div className="absolute right-2 md:right-4 top-0 flex gap-2 pointer-events-auto">
            <button type="button" onClick={onCurriculumClick} className={MB.navBtn}>
              {resolvedCurriculumLabel}
            </button>
          </div>
        ) : null}
        <div className="absolute left-2 md:left-4 top-0 flex gap-2 pointer-events-auto items-center">
          <StudentThemePicker variant="icon" iconSize="nav" />
          <button type="button" onClick={onBack} className={MB.backBtn}>
            {t("learning.master.back")}
          </button>
        </div>
        <div
          ref={titleAnchorRef}
          className="text-center pointer-events-auto px-[clamp(6.5rem,22vw,12rem)]"
        >
          <div className="flex items-center justify-center gap-2">
            <h1 className={`${MB.pageTitle} md:text-2xl lg:text-3xl`}>{title}</h1>
            {audio ? (
              <LearningMasterAudioButton
                audioOn={audioOn}
                buttonClassOn={MB.btnSoundOn}
                buttonClassOff={MB.btnSoundOff}
              />
            ) : null}
          </div>
        </div>
      </div>
      {subtitle ? (
        <p className={`${MB.pageSub} text-center mb-1.5 px-2 md:px-4`}>{subtitle}</p>
      ) : null}
    </div>
  );
}
