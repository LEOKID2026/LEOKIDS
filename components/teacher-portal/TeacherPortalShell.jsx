import Link from "next/link";
import { SC_NAV_SCHOOL_MESSAGES_TEACHER } from "../../lib/school-portal/school-communication.js";

export default function TeacherPortalShell({
  children,
  title,
  titleClassName = "text-2xl font-bold mb-6",
  backHref,
  backLabel = "← Back to dashboard",
  schoolMembership = null,
  schoolMessageUnreadCount = 0,
}) {
  const showSchoolLink = schoolMembership?.isSchoolManager === true;
  const showSchoolInbox = Boolean(schoolMembership?.schoolId);
  const schoolLabel = schoolMembership?.schoolName;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir="ltr" lang="en">
      {(showSchoolLink || showSchoolInbox || schoolLabel) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          {schoolLabel ? (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-200">
              School: {schoolLabel}
            </span>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap gap-3">
            {showSchoolInbox ? (
              <Link href="/teacher/school-messages" className="text-sky-300 hover:underline font-medium">
                {SC_NAV_SCHOOL_MESSAGES_TEACHER}
                {schoolMessageUnreadCount > 0 ? ` (${schoolMessageUnreadCount})` : ""}
              </Link>
            ) : null}
            {showSchoolLink ? (
              <Link href="/school/dashboard" className="text-emerald-300 hover:underline font-medium">
                School management
              </Link>
            ) : null}
          </div>
        </div>
      )}
      {backHref ? (
        <a href={backHref} className="text-sm text-amber-300 hover:underline mb-4 inline-block">
          {backLabel}
        </a>
      ) : null}
      {title ? <h1 className={titleClassName}>{title}</h1> : null}
      {children}
    </div>
  );
}
