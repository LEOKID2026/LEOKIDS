import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStudentMeClient } from "../../lib/learning-client/studentMeClient.js";
import { STUDENT_HOME_HREF } from "../../lib/pwa/scoped-student-path.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

const STUDENT_LOGIN_HREF = "/student/login";

/**
 * Parent portal — navigate to student world when a child session exists, else student login.
 * @param {{ className?: string, testId?: string }} props
 */
export default function ParentStudentWorldButton({
  className = "",
  testId = "parent-student-world-entry",
}) {
  const t = useT();
  const [href, setHref] = useState(STUDENT_LOGIN_HREF);

  useEffect(() => {
    let mounted = true;
    void fetchStudentMeClient().then(({ ok }) => {
      if (mounted) setHref(ok ? STUDENT_HOME_HREF : STUDENT_LOGIN_HREF);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Link
      href={href}
      prefetch={false}
      className={className}
      aria-label={t("parent.studentWorldAriaLabel")}
      data-testid={testId}
    >
      {t("parent.studentWorld")}
    </Link>
  );
}
