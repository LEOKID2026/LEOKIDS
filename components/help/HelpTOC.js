import { useSharedShellUi } from "../../hooks/useSharedShellUi.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

export default function HelpTOC({ toc }) {
  const t = useT();
  const { SP } = useSharedShellUi();
  const tocLabel = t("ui.help.tableOfContents");
  if (!toc?.length) return null;

  const list = (
    <ul className="space-y-2 text-sm">
      {toc.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className={SP.tocLink}>
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <details className={SP.tocMobile}>
        <summary className={SP.tocMobileSummary}>{tocLabel}</summary>
        <nav aria-label={tocLabel} className="mt-3 text-start">
          {list}
        </nav>
      </details>
      <nav aria-label={tocLabel} className={SP.tocDesktop}>
        <h2 className={SP.tocTitle}>{tocLabel}</h2>
        {list}
      </nav>
    </>
  );
}
