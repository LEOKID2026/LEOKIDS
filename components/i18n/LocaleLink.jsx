import Link from "next/link";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { localizeHref } from "../../lib/i18n/locale-path.js";

/**
 * next/link wrapper that keeps the active interface locale prefix on internal hrefs.
 * @param {import('next/link').LinkProps & { children?: React.ReactNode }} props
 */
export default function LocaleLink({ href, ...rest }) {
  const { locale } = useI18n();
  const localizedHref = localizeHref(locale, href);
  return <Link href={localizedHref} {...rest} />;
}
