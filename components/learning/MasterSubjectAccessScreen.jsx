import LockedSubjectCard from "./LockedSubjectCard.jsx";
import { useStudentSubjectAccess } from "../../hooks/useStudentSubjectAccess.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Blocks master page content when parent locked the subject.
 */
export default function MasterSubjectAccessScreen({ permissionKey, titleHe, title, children }) {
  const { isSubjectLocked, enforced } = useStudentSubjectAccess(permissionKey);
  const t = useT();
  const resolvedTitle = title ?? titleHe ?? t(`learning.subjects.${permissionKey}`);
  if (enforced && isSubjectLocked) {
    return <LockedSubjectCard title={resolvedTitle} />;
  }
  return children;
}
