import HelpLayoutShell from "./HelpLayoutShell";
import HelpTOC from "./HelpTOC";
import HelpArticleBody from "./HelpArticleBody";
import HelpSearchClient from "./HelpSearchClient";
import { getArticle, getHelpSections, listArticles } from "../../data/help-center";
import { useSharedShellUi } from "../../hooks/useSharedShellUi.js";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";

function helpCenterLabel(locale, t) {
  const fromUi = t?.("nav.helpCenter");
  if (fromUi && fromUi !== "nav.helpCenter") return fromUi;
  const id = String(locale || "");
  if (id === "es-419" || id.startsWith("es-")) return "Centro de ayuda";
  if (id === "pt-BR" || id.startsWith("pt-")) return "Central de ajuda";
  return "Help center";
}

function updatedLabel(locale, date) {
  const id = String(locale || "");
  if (id === "es-419" || id.startsWith("es-")) return `Actualizado: ${date}`;
  if (id === "pt-BR" || id.startsWith("pt-")) return `Atualizado: ${date}`;
  return `Updated: ${date}`;
}

export function buildSectionHubPage(sectionKey) {
  return function SectionHubPage() {
    const { contentLocale, t } = useI18n();
    const sections = getHelpSections(contentLocale);
    const section = sections[sectionKey];
    const articles = listArticles(sectionKey, contentLocale);

    return (
      <HelpLayoutShell
        title={section.title}
        summary={section.description}
        breadcrumbs={[
          { href: "/help", label: helpCenterLabel(contentLocale, t) },
          { label: section.title },
        ]}
      >
        <HelpSearchClient articles={articles} sectionBase={section.href} />
      </HelpLayoutShell>
    );
  };
}

function ArticleUpdatedAt({ date, locale }) {
  const { SP } = useSharedShellUi();
  return <p className={SP.updatedAt}>{updatedLabel(locale, date)}</p>;
}

export function buildArticlePage(sectionKey) {
  return function HelpArticlePage({ article: articleProp }) {
    const { contentLocale, t } = useI18n();
    const sections = getHelpSections(contentLocale);
    const section = sections[sectionKey];
    const article =
      getArticle(sectionKey, articleProp?.slug, contentLocale) || articleProp;

    return (
      <HelpLayoutShell
        title={article.title}
        summary={article.summary}
        article
        breadcrumbs={[
          { href: "/help", label: helpCenterLabel(contentLocale, t) },
          { href: section.href, label: section.title },
          { label: article.title },
        ]}
        tocSlot={<HelpTOC toc={article.toc} />}
      >
        <article lang={contentLocale === "es-419" ? "es" : "en"}>
          <HelpArticleBody blocks={article.blocks} audience={article.audience} />
          <ArticleUpdatedAt date={article.updatedAt} locale={contentLocale} />
        </article>
      </HelpLayoutShell>
    );
  };
}
