import Layout from "../../components/Layout";
import PageSeo from "../../components/seo/PageSeo";
import { usePublicPageSeo } from "../../hooks/usePublicPageSeo.js";
import HelpHubCard from "../../components/help/HelpHubCard";
import { useIOSViewportFix } from "../../hooks/useIOSViewportFix";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import { useSharedShellUi } from "../../hooks/useSharedShellUi.js";
import { getHelpSections } from "../../data/help-center";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";


export default function HelpCenterHome() {
  useIOSViewportFix();
  const helpSeo = usePublicPageSeo("help");
  const { theme } = useStudentTheme();
  const { SP, isBright } = useSharedShellUi();
  const { contentLocale, t } = useI18n();
  const sections = getHelpSections(contentLocale);
  const hubSections = [
    sections.parents,
    sections.students,
    sections["parent-report"],
    sections.subjects,
  ];

  const title = t("ui.nav.helpCenter");
  const badge = t("ui.help.hubBadge");
  const subtitle = t("ui.help.hubSubtitle");

  return (
    <Layout studentTheme={theme} studentShell="home">
      <PageSeo
        title={helpSeo.title}
        description={helpSeo.description}
        canonicalPath={helpSeo.canonicalPath}
      />
      <div className={SP.helpWrap}>
        <header className="text-center space-y-4">
          <p className={SP.badge}>{badge}</p>
          <h1 className={SP.helpH1}>{title}</h1>
          <p className={SP.helpSubtitle}>{subtitle}</p>
        </header>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hubSections.map((s) => (
            <HelpHubCard
              key={s.key}
              href={s.href}
              title={s.title}
              description={s.description}
              emoji={s.emoji}
              sectionKey={s.hubGradientKey}
              isBright={isBright}
            />
          ))}
        </section>
      </div>
    </Layout>
  );
}
