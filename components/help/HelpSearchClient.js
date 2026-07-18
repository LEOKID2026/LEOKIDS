import { useMemo, useState } from "react";
import Link from "next/link";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import { useSharedShellUi } from "../../hooks/useSharedShellUi.js";

function normalize(s) {
  return String(s || "")
    .trim()
    .toLowerCase();
}

export default function HelpSearchClient({ articles, sectionBase }) {
  const t = useT();
  const { SP } = useSharedShellUi();
  const [query, setQuery] = useState("");
  const id = "help-search-input";

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return articles;
    return articles.filter((a) => {
      const hay = [a.title, a.summary, ...(a.keywords || [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [articles, query]);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={id} className="sr-only">
          {t("ui.help.searchLabel")}
        </label>
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("ui.help.searchPlaceholder")}
          className={SP.searchInput}
          aria-controls="help-search-results"
        />
      </div>
      <ul id="help-search-results" className="grid gap-3 sm:grid-cols-2">
        {filtered.map((a) => (
          <li key={a.slug}>
            <Link href={`${sectionBase}/${a.slug}`} className={SP.searchResult}>
              <span className={SP.searchResultTitle}>{a.title}</span>
              <p className={SP.searchResultSummary}>{a.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 ? (
        <p className={SP.searchEmpty}>{t("ui.help.noResults")}</p>
      ) : null}
    </div>
  );
}
