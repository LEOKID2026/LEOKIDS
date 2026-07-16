import StudentPwaInstallLauncher from "../../components/student/StudentPwaInstallLauncher";
import PwaInstallPageShell from "../../components/pwa/PwaInstallPageShell";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/** SSR so manifest-student is chosen in _app Head from the first HTML byte. */
export async function getServerSideProps() {
  return { props: {} };
}

export default function StudentPwaInstallPage() {
  const t = useT();
  return (
    <PwaInstallPageShell
      portal="student"
      badge="LEO KIDS"
      title={t("ui.pwa.titleStudent")}
      pageTitle={t("ui.pwa.pageTitleStudent")}
      appleTouchIcon="/icons/child/apple-touch-icon.png"
      launcher={StudentPwaInstallLauncher}
    />
  );
}
