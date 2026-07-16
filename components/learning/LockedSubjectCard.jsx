import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";

export default function LockedSubjectCard({ title }) {
  const { direction } = useI18n();
  const t = useT();
  const resolvedTitle = title ?? t("learning.master.subjectLocked");
  return (
    <div
      className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-6 text-center"
      dir={direction}
    >
      <p className="text-lg font-bold text-amber-100">{resolvedTitle}</p>
      <p className="mt-2 text-sm text-white/80">{t("ui.student.parentLocked")}</p>
    </div>
  );
}
