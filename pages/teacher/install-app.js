import TeacherPwaInstallLauncher from "../../components/teacher/TeacherPwaInstallLauncher";
import PwaInstallPageShell from "../../components/pwa/PwaInstallPageShell";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/** SSR so manifest-teacher is chosen in _app Head from the first HTML byte. */
export async function getServerSideProps() {
  return { props: {} };
}

export default function TeacherPwaInstallPage() {
  const t = useT();
  return (
    <PwaInstallPageShell
      portal="teacher"
      badge="T LEO KIDS"
      title={t("ui.pwa.titleTeacher")}
      pageTitle={t("ui.pwa.pageTitleTeacher")}
      appleTitle="T LEO KIDS"
      appleTouchIcon="/icons/teacher/apple-touch-icon.png"
      launcher={TeacherPwaInstallLauncher}
    />
  );
}
