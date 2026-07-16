import { useSharedShellUi } from "../../hooks/useSharedShellUi.js";

export default function HelpTOC({ toc }) {
  const { SP } = useSharedShellUi();
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
        <summary className={SP.tocMobileSummary}>Table of contents</summary>
        <nav aria-label="Table of contents" className="mt-3 text-left">
          {list}
        </nav>
      </details>
      <nav aria-label="Table of contents" className={SP.tocDesktop}>
        <h2 className={SP.tocTitle}>Table of contents</h2>
        {list}
      </nav>
    </>
  );
}
