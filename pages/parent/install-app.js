import ParentPwaInstallLauncher from "../../components/parent/ParentPwaInstallLauncher";
import PwaInstallPageShell from "../../components/pwa/PwaInstallPageShell";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/** SSR so manifest-parent is chosen in _app Head from the first HTML byte. */
export async function getServerSideProps() {
  return { props: {} };
}

export default function ParentPwaInstallPage() {
  const t = useT();
  return (
    <PwaInstallPageShell
      portal="parent"
      badge="P LEO KIDS"
      title={t("ui.pwa.titleParent")}
      pageTitle={t("ui.pwa.pageTitleParent")}
      appleTitle="P LEO KIDS"
      appleTouchIcon="/icons/parent/apple-touch-icon.png"
      launcher={ParentPwaInstallLauncher}
    />
  );
}
