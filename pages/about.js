import Layout from "../components/Layout";
import PageSeo from "../components/seo/PageSeo";
import { getPublicPageSeo } from "../lib/site/public-page-seo.js";
import { useStudentTheme } from "../contexts/StudentThemeContext.jsx";
import { useSharedShellUi } from "../hooks/useSharedShellUi.js";
import { useI18n, useT } from "../lib/i18n/I18nProvider.jsx";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const aboutSeo = getPublicPageSeo("about");

export default function About() {
  const { theme } = useStudentTheme();
  const { SP } = useSharedShellUi();
  const { direction, locale } = useI18n();
  const t = useT();

  const funGamesCards = useMemo(
    () =>
      [0, 1, 2].map((i) => ({
        title: t(`ui.public.about.funGames.${i}.title`),
        text: t(`ui.public.about.funGames.${i}.text`),
      })),
    [t]
  );

  const whyCards = useMemo(
    () =>
      [0, 1, 2].map((i) => ({
        title: t(`ui.public.about.whyCards.${i}.title`),
        text: t(`ui.public.about.whyCards.${i}.text`),
      })),
    [t]
  );

  const siteFeatures = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => ({
        phase: t(`ui.public.about.siteFeatures.${i}.phase`),
        text: t(`ui.public.about.siteFeatures.${i}.text`),
      })),
    [t]
  );

  return (
    <Layout page="about" studentTheme={theme} studentShell="home">
      <PageSeo
        title={aboutSeo.title}
        description={aboutSeo.description}
        canonicalPath={aboutSeo.canonicalPath}
      />
      {SP.showVideoBg ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/about-bg.mp4" type="video/mp4" />
        </video>
      ) : null}

      <motion.main
        className={SP.aboutMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {SP.aboutVideoOverlay ? (
          <div className={SP.aboutVideoOverlay} aria-hidden />
        ) : null}

        <div dir={direction} lang={locale} className="relative z-20 w-full max-w-6xl p-4 sm:p-6 rounded-xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            <div className="flex-shrink-0">
              <Image
                src="/images/lio.png"
                alt={t("ui.public.about.imageAlt")}
                width={300}
                height={300}
                className={SP.imageBorder}
              />
            </div>

            <div className="text-center md:text-left max-w-xl flex-1">
              <motion.h1
                className={SP.h1}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {t("ui.public.about.title")}
              </motion.h1>

              <p className={SP.body}>{t("ui.public.about.intro0")}</p>

              <p className={SP.body}>{t("ui.public.about.intro1")}</p>

              <p className={SP.bodyLast}>{t("ui.public.about.intro2")}</p>
            </div>
          </div>

          <section className="mb-12 text-center">
            <h2 className={SP.h2}>{t("ui.public.about.missionTitle")}</h2>
            <p className={SP.bodyCenter}>{t("ui.public.about.missionBody")}</p>
            <p className={SP.bodyCenterMuted}>{t("ui.public.about.missionMuted")}</p>
          </section>

          <section className="mb-12">
            <h2 className={SP.h2Teal}>{t("ui.public.about.learnEnjoyTitle")}</h2>
            <p className={SP.bodyCenter}>{t("ui.public.about.learnEnjoyBody")}</p>
            <p className={`${SP.bodyCenterMuted} mb-6`}>{t("ui.public.about.learnEnjoyMuted")}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {funGamesCards.map((item, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} className={SP.card}>
                  <h3 className={SP.cardTitle}>{item.title}</h3>
                  <p className={SP.cardText}>{item.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className={SP.h2AmberTeal}>{t("ui.public.about.whyTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {whyCards.map((item, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} className={SP.card}>
                  <h3 className={SP.cardTitle}>{item.title}</h3>
                  <p className={SP.cardText}>{item.text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className={SP.h2TealAmber}>{t("ui.public.about.featuresTitle")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-8">
              {siteFeatures.map((phase, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} className={SP.card}>
                  <h3 className={SP.cardTitle}>{phase.phase}</h3>
                  <p className={SP.cardText}>{phase.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 text-center">
              <Link href="/student/login">
                <button
                  type="button"
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 px-8 py-4 rounded-xl text-base sm:text-lg font-bold text-black hover:scale-105 transition w-full sm:w-auto min-w-[200px]"
                >
                  {t("ui.public.about.kidsWorldCta")}
                </button>
              </Link>
              <Link href="/parent/login">
                <button type="button" className={SP.secondaryCta}>
                  {t("ui.public.about.parentLoginCta")}
                </button>
              </Link>
            </div>
          </section>
        </div>
      </motion.main>
    </Layout>
  );
}
