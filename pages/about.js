import Layout from "../components/Layout";
import PageSeo from "../components/seo/PageSeo";
import { getPublicPageSeo } from "../lib/site/public-page-seo.js";
import { useStudentTheme } from "../contexts/StudentThemeContext.jsx";
import { useSharedShellUi } from "../hooks/useSharedShellUi.js";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const whyCards = [
  {
    title: "Learning at your own pace",
    text: "Every child moves according to their ability, with practice matched to their level and the topics they need to reinforce.",
  },
  {
    title: "A clear picture for parents",
    text: "Reports help you understand where your child succeeds, where they struggle, and what to practice next.",
  },
  {
    title: "A friendly experience for kids",
    text: "The site combines practice, games, coins, cards, and a welcoming design to encourage persistence and positive learning.",
  },
];

const funGamesCards = [
  {
    title: "Engaging games",
    text: "Games that add interest and fun, encouraging kids to keep practicing.",
  },
  {
    title: "Social experiences",
    text: "Play with friends and social experiences where available — in a positive, friendly way.",
  },
  {
    title: "Motivation to learn",
    text: "A mix of practice, coins, cards, games, and challenges that encourage kids to continue.",
  },
];

const siteFeatures = [
  { phase: "Practice by subject", text: "Math, geometry, English, and science." },
  { phase: "Grades and difficulty levels", text: "Practice matched by age band, topic, and level for gradual, clear progress." },
  { phase: "Reports for parents", text: "A clear summary of performance, mistakes, strengths, and areas to improve." },
  { phase: "Games and social play", text: "Solo games, educational games, play with friends, coins, and cards." },
];

const aboutSeo = getPublicPageSeo("about");

export default function About() {
  const { theme } = useStudentTheme();
  const { SP } = useSharedShellUi();
  const { direction, locale } = useI18n();

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
                alt="Leo — smart learning environment for kids"
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
                About Leo — learn, practice, and progress
              </motion.h1>

              <p className={SP.body}>
                Welcome to Leo — a smart learning environment built to help children practice, understand, and progress at a pace that fits them.
              </p>

              <p className={SP.body}>
                The site is designed for elementary learners with practice by subject, grade, topic, and difficulty level. Every child can start where it makes sense, move forward gradually, and reinforce the topics where they need more confidence.
              </p>

              <p className={SP.bodyLast}>
                Our goal is to make learning clearer, friendlier, and more accurate: less guessing, less frustration, and a better understanding of what your child already knows and what still needs reinforcement.
              </p>
            </div>
          </div>

          <section className="mb-12 text-center">
            <h2 className={SP.h2}>Our mission</h2>
            <p className={SP.bodyCenter}>
              We help children build confidence in learning, strengthen foundational and advanced skills, and give parents a clearer picture of their child's progress.
            </p>
            <p className={SP.bodyCenterMuted}>
              The system combines practice, playfulness, parent reports, and progress summaries to create a learning process that feels personal, organized, and encouraging.
            </p>
          </section>

          <section className="mb-12">
            <h2 className={SP.h2Teal}>Learn and enjoy</h2>
            <p className={SP.bodyCenter}>
              Beyond academic practice, the site includes educational games, engaging play, coins, and cards designed to add fun, motivation, and enjoyment to learning. The goal is for kids not to feel they are only "doing homework," but entering a colorful kids world where they can learn, play, and progress with a good feeling.
            </p>
            <p className={`${SP.bodyCenterMuted} mb-6`}>
              There are solo games, educational games, and opportunities to play with friends — depending on what is open and available on the site.
            </p>
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
            <h2 className={SP.h2AmberTeal}>Why does it matter?</h2>
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
            <h2 className={SP.h2TealAmber}>What will you find on the site?</h2>
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
                  Kids world
                </button>
              </Link>
              <Link href="/parent/login">
                <button type="button" className={SP.secondaryCta}>
                  Parent login
                </button>
              </Link>
            </div>
          </section>
        </div>
      </motion.main>
    </Layout>
  );
}
