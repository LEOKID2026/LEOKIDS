import Layout from "../components/Layout";
import PageSeo from "../components/seo/PageSeo";
import { getPublicPageSeo } from "../lib/site/public-page-seo.js";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStudentTheme } from "../contexts/StudentThemeContext.jsx";
import { useSharedShellUi } from "../hooks/useSharedShellUi.js";
import { useI18n } from "../lib/i18n/I18nProvider.jsx";
import {
  CONTACT_EMAIL,
  LEGAL_CONTACT_PAGE_LINKS,
} from "../data/legal/sitePolicies.js";
import { validateContactForm } from "../lib/contact/contact-form.js";

const INSTAGRAM_URL = "https://www.instagram.com/leotheshiba21";
const YOUTUBE_URL = "https://www.youtube.com/@LEO-KIDS-2026";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61590778462277";

const btnBase =
  "px-5 py-2.5 rounded-xl transition hover:scale-105 text-center shadow-md text-sm sm:text-base font-semibold";

const socialBtnBase =
  "w-full h-full px-3 py-2.5 rounded-xl transition hover:scale-105 text-center shadow-md text-sm font-semibold leading-tight flex items-center justify-center";

const contactSeo = getPublicPageSeo("contact");

/** Contact form hidden until mail delivery is configured for production. */
const CONTACT_FORM_VISIBLE = false;

const FAQ_KEYS = ["whoFor", "subjects", "parentsSee", "reinforcement", "games", "reportBug"];

export default function Contact() {
  const { theme } = useStudentTheme();
  const { SP } = useSharedShellUi();
  const { direction, locale, t } = useI18n();
  const [activeAnswer, setActiveAnswer] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formPendingNotice, setFormPendingNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const handleClose = () => setActiveAnswer(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormPendingNotice("");

    const errors = validateContactForm({ name, email, message }, t);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setBusy(true);
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || null,
          message: message.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));

      if (res.status === 429 || body?.code === "rate_limited") {
        setFormError(t("ui.public.contact.form.errors.rateLimit"));
        return;
      }
      if (res.status === 503 && body?.code === "delivery_not_configured") {
        setFormPendingNotice(t("ui.public.contact.form.deliveryPending"));
        return;
      }
      if (res.ok && body?.ok && body?.delivered) {
        setFormSuccess(t("ui.public.contact.form.success"));
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setFieldErrors({});
        return;
      }
      if (body?.code === "invalid_email") {
        setFieldErrors((prev) => ({ ...prev, email: t("ui.public.contact.form.errors.emailInvalid") }));
        return;
      }
      if (body?.code === "validation_failed") {
        setFormError(t("ui.public.contact.form.errors.generic"));
        return;
      }
      setFormError(t("ui.public.contact.form.errors.generic"));
    } catch {
      setFormError(t("ui.public.contact.form.errors.network"));
    } finally {
      setBusy(false);
    }
  };

  const socialLinks = [
    {
      key: "email",
      href: `mailto:${CONTACT_EMAIL}`,
      label: t("ui.public.contact.social.email"),
      ariaLabel: t("ui.public.contact.social.emailAria", { email: CONTACT_EMAIL }),
      className: `${socialBtnBase} bg-amber-500/90 hover:bg-amber-400 border border-amber-300/40 text-black`,
      external: false,
    },
    {
      key: "instagram",
      href: INSTAGRAM_URL,
      label: t("ui.public.contact.social.instagram"),
      ariaLabel: t("ui.public.contact.social.instagramAria"),
      className: `${socialBtnBase} bg-pink-600/90 hover:bg-pink-500 border border-pink-400/30 text-white`,
      external: true,
    },
    {
      key: "youtube",
      href: YOUTUBE_URL,
      label: t("ui.public.contact.social.youtube"),
      ariaLabel: t("ui.public.contact.social.youtubeAria"),
      className: `${socialBtnBase} bg-red-600/90 hover:bg-red-500 border border-red-400/30 text-white`,
      external: true,
    },
    {
      key: "facebook",
      href: FACEBOOK_URL,
      label: t("ui.public.contact.social.facebook"),
      ariaLabel: t("ui.public.contact.social.facebookAria"),
      className: `${socialBtnBase} bg-blue-600/90 hover:bg-blue-500 border border-blue-400/30 text-white`,
      external: true,
    },
  ];

  return (
    <Layout page="contact" studentTheme={theme} studentShell="home">
      <PageSeo
        title={contactSeo.title}
        description={contactSeo.description}
        canonicalPath={contactSeo.canonicalPath}
      />
      {SP.showVideoBg ? (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none"
            aria-hidden
          >
            <source src="/videos/contact-bg.mp4" type="video/mp4" />
          </video>
          <div className={SP.contactVideoOverlay} aria-hidden />
        </>
      ) : null}

      <div dir={direction} lang={locale} className={SP.pageWrap}>
        <motion.h1
          className={SP.contactH1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t("ui.public.contact.title")}
        </motion.h1>

        <motion.p
          className={SP.intro}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {t("ui.public.contact.intro")}
        </motion.p>

        {CONTACT_FORM_VISIBLE && <motion.section
          className={SP.formSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          aria-label={t("ui.public.contact.formAriaLabel")}
        >
          {formSuccess ? (
            <p className="text-emerald-300 text-sm sm:text-base leading-relaxed" role="status">
              {formSuccess}
            </p>
          ) : (
            <form onSubmit={(ev) => void onSubmit(ev)} className="space-y-4" noValidate>
              {formPendingNotice ? (
                <p className="text-amber-200 text-sm sm:text-base leading-relaxed rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2" role="status">
                  {formPendingNotice}
                </p>
              ) : null}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm sm:text-base">
                  <span className={SP.formLabel}>{t("ui.public.contact.form.nameLabel")}</span>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    maxLength={80}
                    autoComplete="name"
                    className={SP.input}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                  />
                  {fieldErrors.name ? (
                    <p id="contact-name-error" className="mt-1 text-sm text-rose-300" role="alert">
                      {fieldErrors.name}
                    </p>
                  ) : null}
                </label>

                <label className="block text-sm sm:text-base">
                  <span className={SP.formLabel}>{t("ui.public.contact.form.emailLabel")}</span>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    className={SP.input}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                  />
                  {fieldErrors.email ? (
                    <p id="contact-email-error" className="mt-1 text-sm text-rose-300" role="alert">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </label>
              </div>

              <label className="block text-sm sm:text-base">
                <span className={SP.formLabel}>{t("ui.public.contact.form.subjectLabel")}</span>
                <input
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={(ev) => setSubject(ev.target.value)}
                  maxLength={120}
                  className={SP.input}
                />
              </label>

              <label className="block text-sm sm:text-base">
                <span className={SP.formLabel}>{t("ui.public.contact.form.messageLabel")}</span>
                <textarea
                  name="message"
                  value={message}
                  onChange={(ev) => setMessage(ev.target.value)}
                  rows={5}
                  maxLength={4000}
                  className={`${SP.input} resize-y min-h-[120px]`}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                />
                {fieldErrors.message ? (
                  <p id="contact-message-error" className="mt-1 text-sm text-rose-300" role="alert">
                    {fieldErrors.message}
                  </p>
                ) : null}
              </label>

              <p className="text-xs text-white/55 leading-relaxed">{t("ui.public.contact.form.hint")}</p>

              {formError ? (
                <p className="text-sm text-rose-300" role="alert">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={busy}
                className={`${btnBase} w-full sm:w-auto bg-teal-600/90 hover:bg-teal-500 border border-teal-400/30 text-white disabled:opacity-60 disabled:hover:scale-100`}
              >
                {busy ? t("ui.public.contact.form.submitting") : t("ui.public.contact.form.submit")}
              </button>
            </form>
          )}
        </motion.section>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10 w-full max-w-md lg:max-w-3xl mx-auto">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.key}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label={link.ariaLabel}
              className={link.className}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              whileHover={{ scale: 1.05 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        <motion.h2
          className={SP.h2Teal}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t("ui.public.contact.faqHeading")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pb-8">
          {FAQ_KEYS.map((key, i) => (
            <motion.button
              key={key}
              type="button"
              onClick={() => setActiveAnswer(t(`ui.public.contact.faq.${key}.a`))}
              className={SP.faqBtn}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
            >
              {t(`ui.public.contact.faq.${key}.q`)}
            </motion.button>
          ))}
        </div>

        <motion.nav
          className="w-full max-w-2xl mx-auto pb-8 text-center space-y-3"
          aria-label={t("ui.public.contact.legalNavAria")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className={SP.navLabel}>{t("ui.public.contact.legalHeading")}</p>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            {LEGAL_CONTACT_PAGE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={SP.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className={SP.linkMuted}>
            <a href={`mailto:${CONTACT_EMAIL}`} className={SP.link}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </motion.nav>
      </div>

      {activeAnswer && (
        <div className={SP.faqModalOverlay} dir={direction} onClick={handleClose}>
          <motion.div
            className={SP.faqModalPanel}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
              style={{ backgroundImage: "url('/images/faq.png')" }}
              aria-hidden
            />
            <div className={SP.faqModalInner}>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t("ui.common.close")}
                className="self-start mb-4 bg-amber-500/90 hover:bg-amber-400 text-black px-3 py-1.5 text-sm rounded-lg font-bold"
              >
                {t("ui.common.close")}
              </button>
              <p className={SP.faqModalText}>{activeAnswer}</p>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
