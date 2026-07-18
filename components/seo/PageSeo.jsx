import Head from "next/head";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { CANONICAL_PUBLIC_SITE_ORIGIN } from "../../lib/site/canonical-public-site-origin.js";
import { buildCanonicalUrl, buildHreflangAlternates, resolveOgLocale } from "../../lib/seo/locale-seo.js";

/** Default share image — 512×512 brand icon (suitable for og:image). */
export const DEFAULT_SHARE_IMAGE_PATH = "/icons/child/android-chrome-512x512.png";

function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return `${CANONICAL_PUBLIC_SITE_ORIGIN}${DEFAULT_SHARE_IMAGE_PATH}`;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${CANONICAL_PUBLIC_SITE_ORIGIN}${path}`;
}

/**
 * Shared page metadata with locale-aware canonical + hreflang.
 */
export default function PageSeo({
  title,
  description,
  canonicalPath,
  shareTitle,
  shareDescription,
  shareImagePath = DEFAULT_SHARE_IMAGE_PATH,
  noindex = false,
  locale: localeProp,
  hreflang = true,
}) {
  const { locale: ctxLocale, selectableLocales } = useI18n();
  const locale = localeProp || ctxLocale;
  const canonicalUrl = buildCanonicalUrl(canonicalPath, locale);
  const ogTitle = shareTitle || title;
  const ogDescription = shareDescription || description;
  const ogImage = toAbsoluteUrl(shareImagePath);

  const enabledIds =
    selectableLocales?.length > 0 ? selectableLocales.map((l) => l.id) : undefined;
  const alternates = hreflang ? buildHreflangAlternates(canonicalPath, enabledIds) : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {alternates.map((alt) => (
        <link
          key={`hreflang-${alt.locale}`}
          rel="alternate"
          hrefLang={alt.locale}
          href={alt.href}
        />
      ))}
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={resolveOgLocale(locale)} />
      {alternates
        .filter((a) => a.locale !== "x-default")
        .filter((a) => a.locale.replace("-", "_") !== resolveOgLocale(locale))
        .slice(0, 5)
        .map((alt) => (
          <meta
            key={`og-alt-${alt.locale}`}
            property="og:locale:alternate"
            content={alt.locale.replace("-", "_")}
          />
        ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
