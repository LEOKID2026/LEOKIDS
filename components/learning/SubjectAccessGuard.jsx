import LockedSubjectCard from "./LockedSubjectCard.jsx";

/**
 * @param {{
 *   permissionKey: string,
 *   title?: string,
 *   isLocked: boolean,
 *   enforced?: boolean,
 *   children: React.ReactNode,
 * }} props
 */
export default function SubjectAccessGuard({
  permissionKey,
  title,
  isLocked,
  enforced = true,
  children,
}) {
  if (enforced && isLocked) {
    return <LockedSubjectCard title={title || permissionKey} />;
  }
  return children;
}
