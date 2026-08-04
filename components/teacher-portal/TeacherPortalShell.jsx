import Link from "next/link";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";
import { bindSchoolCommunicationLocale } from "../../lib/school-portal/school-communication.js";
import { bindTeacherUiLocale } from "../../lib/teacher-portal/teacher-ui.js";

export default function TeacherPortalShell({
  children,
  title,
  titleClassName = "text-2xl font-bold mb-6",
  backHref,
  backLabel,
  schoolMembership = null,
  schoolMessageUnreadCount = 0,
}) {
  const t = useT();
  const { direction, locale } = useI18n();
  bindTeacherUiLocale(locale);
  bindSchoolCommunicationLocale(locale);
  const resolvedBackLabel = backLabel ?? t("ui.teacherShell.backToDashboard");
  const showSchoolLink = schoolMembership?.isSchoolManager === true;
  const showSchoolInbox = Boolean(schoolMembership?.schoolId);
  const schoolLabel = schoolMembership?.schoolName;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={direction} lang={locale}>
      {(showSchoolLink || showSchoolInbox || schoolLabel) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          {schoolLabel ? (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-200">
              {t("ui.teacherShell.schoolLabel", { name: schoolLabel })}
            </span>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap gap-3">
            {showSchoolInbox ? (
              <Link href="/teacher/school-messages" className="text-sky-300 hover:underline font-medium">
                {t("school.communication.navSchoolMessagesTeacher")}
                {schoolMessageUnreadCount > 0 ? ` (${schoolMessageUnreadCount})` : ""}
              </Link>
            ) : null}
            {showSchoolLink ? (
              <Link href="/school/dashboard" className="text-emerald-300 hover:underline font-medium">
                {t("school.portal.navSchool")}
              </Link>
            ) : null}
          </div>
        </div>
      )}
      {backHref ? (
        <a href={backHref} className="text-sm text-amber-300 hover:underline mb-4 inline-block">
          {resolvedBackLabel}
        </a>
      ) : null}
      {title ? <h1 className={titleClassName}>{title}</h1> : null}
      {children}
    </div>
  );
}
