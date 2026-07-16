import Link from "next/link";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";

export default function NotFoundPage() {
  const { t, direction, locale } = useI18n();
  return (
    <main className="min-h-screen flex items-center justify-center px-4" dir={direction} lang={locale}>
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-3">{t("common.notFound")}</h1>
        <p className="text-slate-600 mb-6">{t("common.errorGeneric")}</p>
        <Link href="/" className="text-teal-700 font-semibold underline">
          {t("common.home")}
        </Link>
      </div>
    </main>
  );
}
