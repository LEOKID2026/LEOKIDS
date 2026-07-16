import Head from "next/head";
import Link from "next/link";
import Layout from "../Layout";
import {
  CONTACT_EMAIL,
  LEGAL_CROSS_LINKS,
  POLICY_LAST_UPDATED,
} from "../../data/legal/sitePolicies.js";

/**
 * Renders a legal/policy page from SITE_POLICIES content.
 * @param {{ policy: import("../../data/legal/sitePolicies").SITE_POLICIES[string] }} props
 */
export default function SitePolicyPage({ policy }) {
  const { pageTitle, metaDescription, intro, sections, route } = policy;

  return (
    <Layout>
      <Head>
        <title>{`${pageTitle} · LEO KIDS`}</title>
        <meta name="description" content={metaDescription} />
      </Head>
      <article dir="ltr" lang="en" className="max-w-3xl mx-auto px-4 py-10 sm:py-12 text-left">
        <header className="mb-8 space-y-3">
          <p className="text-xs text-white/50">Last updated: {POLICY_LAST_UPDATED}</p>
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-amber-200 to-rose-300 bg-clip-text text-transparent">
            {pageTitle}
          </h1>
          {intro ? <p className="text-base sm:text-lg text-white/75 leading-relaxed">{intro}</p> : null}
        </header>

        <PolicySections sections={sections} />

        <footer className="mt-10 pt-6 border-t border-white/10 space-y-4 text-sm text-white/65">
          <p>
            Questions:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-300 hover:text-amber-200 underline">
              {CONTACT_EMAIL}
            </a>
          </p>
          <nav aria-label="Legal document links">
            <p className="mb-2 font-semibold text-white/80">Additional documents</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {LEGAL_CROSS_LINKS.filter((l) => l.href !== route).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-amber-300/90 hover:text-amber-200 underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </article>
    </Layout>
  );
}

/** @param {{ sections: import("../../data/legal/sitePolicies").PolicySection[] }} props */
function PolicySections({ sections }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="bg-black/50 border border-white/10 rounded-xl p-5 sm:p-6 shadow-md"
        >
          <h2 className="text-lg sm:text-xl font-bold text-amber-200/95 mb-3">{section.title}</h2>
          {section.paragraphs?.map((p) => (
            <p key={p.slice(0, 40)} className="text-sm sm:text-base text-white/80 leading-relaxed mb-2 last:mb-0">
              {p}
            </p>
          ))}
          {section.bullets?.length ? (
            <ul className="list-disc list-outside me-5 mt-2 space-y-1.5 text-sm sm:text-base text-white/80">
              {section.bullets.map((b) => (
                <li key={b.slice(0, 48)}>{b}</li>
              ))}
            </ul>
          ) : null}
          {section.links?.length ? (
            <ul className="mt-3 space-y-1 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("mailto:") ? (
                    <a href={link.href} className="text-amber-300 hover:text-amber-200 underline">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-amber-300 hover:text-amber-200 underline">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
