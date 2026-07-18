import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import PageSeo from "../../components/seo/PageSeo";
import { getPublicPageSeo } from "../../lib/site/public-page-seo.js";
import PortalLoginHeading from "../../components/auth/PortalLoginHeading";
import ParentGoogleSignInButton from "../../components/auth/ParentGoogleSignInButton";
import { getLearningSupabaseBrowserClient } from "../../lib/learning-supabase/client";
import { mapParentAuthError } from "../../lib/parent-client/parent-auth-errors.js";
import {
  completeParentGoogleSession,
  postParentSessionReady,
  signInParentWithGoogleIdToken,
} from "../../lib/auth/parent-google-oauth.client.js";
import GuardianChildSelectForm from "../../components/parent/GuardianChildSelectForm";
import {
  mapParentTeacherCodeLoginError,
  parseGuardianMultipleStudents,
  postParentTeacherCodeLogin,
  redirectAfterParentTeacherCodeLogin,
} from "../../lib/parent-client/parent-teacher-code-access.js";
import PasswordField from "../../components/auth/PasswordField";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import PortalLoadingPanel from "../../components/ui/PortalLoadingPanel.jsx";
import { getParentPortalTheme } from "../../lib/parent-ui/parent-portal-theme.client.js";
import { AUTH_FORGOT_PASSWORD_LINK } from "../../lib/auth/auth-reset.js";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";
import { trackProductEvent } from "../../lib/analytics/track-event.client.js";
import { resolveParentBearerSession } from "../../lib/parent-client/parent-bearer-session.client.js";

const parentLoginSeo = getPublicPageSeo("parent-login");

function ParentPassivePolicyNotice({ bright, className = "", t }) {
  const T = getParentPortalTheme(bright);
  return (
    <p className={`text-xs leading-relaxed ${T.faint} ${className}`}>
      {t("auth.parentPolicyPrefix")}{" "}
      <Link href="/terms" className={T.linkInline}>
        {t("auth.termsLink")}
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className={T.linkInline}>
        {t("auth.privacyLink")}
      </Link>
      {t("auth.parentPolicySuffix")}
    </p>
  );
}
function isEmailIdentifier(value) {
  return String(value || "").includes("@");
}

export default function ParentLoginPage() {
  const router = useRouter();
  const { theme, isBright } = useStudentTheme();
  const { direction, locale } = useI18n();
  const t = useT();
  const T = getParentPortalTheme(isBright);
  const layoutProps = { studentTheme: theme, studentShell: "home" };
  const supabaseRef = useRef(null);
  const oauthErrorShownRef = useRef(false);

  const [identifier, setIdentifier] = useState("");
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState("account");
  const [clientReady, setClientReady] = useState(false);
  const [sessionCheckPending, setSessionCheckPending] = useState(true);
  const [multiStudents, setMultiStudents] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!supabaseRef.current) {
      supabaseRef.current = getLearningSupabaseBrowserClient();
    }
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!clientReady || !supabaseRef.current) return;
    let mounted = true;
    const supabase = supabaseRef.current;
    resolveParentBearerSession(supabase).then((session) => {
      if (!mounted) return;
      if (!session) {
        setSessionCheckPending(false);
        return;
      }
      const meta = session.user?.app_metadata;
      const role =
        meta && typeof meta === "object" && typeof meta.role === "string"
          ? meta.role.trim().toLowerCase()
          : "";
      if (role === "teacher" || role === "admin") {
        setSessionCheckPending(false);
        return;
      }
      router.replace("/parent/dashboard");
    });
    return () => {
      mounted = false;
    };
  }, [clientReady, router]);

  useEffect(() => {
    if (!router.isReady || oauthErrorShownRef.current) return;
    if (router.query.oauth_error !== "1") return;
    oauthErrorShownRef.current = true;
    const messageKey =
      typeof router.query.oauth_message_key === "string"
        ? router.query.oauth_message_key.trim()
        : "";
    setMessage(messageKey ? t(messageKey) : t("auth.googleSignInFailed"));
    setMessageKind("account");
    router.replace("/parent/login");
  }, [router, t]);

  const runAccountAction = async (action) => {
    if (busy || googleBusy) return;
    setBusy(true);
    setMessage("");
    setMessageKind("account");

    try {
      if (action === "login" && !isEmailIdentifier(identifier)) {
        setMultiStudents(null);
        const result = await postParentTeacherCodeLogin(identifier.trim(), secret);
        if (result.status === 200) {
          redirectAfterParentTeacherCodeLogin();
          return;
        }
        if (result.status === 409 && result.body?.error?.code === "guardian_multiple_students") {
          setMultiStudents(parseGuardianMultipleStudents(result.body));
          setMessageKind("teacher_code");
          setMessage(t(mapParentTeacherCodeLoginError(result.body)));
          return;
        }
        setMessageKind("teacher_code");
        setMessage(t(mapParentTeacherCodeLoginError(result.body)));
        return;
      }

      if (!supabaseRef.current) {
        setMessage(t("auth.systemLoading"));
        return;
      }

      if (action === "signup" && !isEmailIdentifier(identifier)) {
        setMessage(t("auth.emailRequiredSignup"));
        return;
      }

      if (action === "signup" && String(secret || "").length < 6) {
        setMessage(t("auth.passwordTooShort", { min: 6 }));
        return;
      }

      const supabase = supabaseRef.current;

      if (action === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: identifier.trim(),
          password: secret,
        });
        if (error) {
          setMessage(t(mapParentAuthError(error, "signup")));
        } else if (data?.session?.access_token) {
          const ready = await postParentSessionReady(data.session.access_token, "signup");
          if (!ready.ok) {
            setMessage(ready.messageKey ? t(ready.messageKey) : t("auth.signupSetupFailed"));
            return;
          }
          router.push("/parent/dashboard");
        } else {
          setMessage(t("auth.signupCompleteVerify"));
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier.trim(),
          password: secret,
        });
        if (error) {
          setMessage(t(mapParentAuthError(error, "login")));
        } else if (data?.session?.access_token) {
          const ready = await postParentSessionReady(data.session.access_token, "login");
          if (!ready.ok) {
            setMessage(ready.messageKey ? t(ready.messageKey) : t("auth.loginSetupFailed"));
            return;
          }
          void trackProductEvent({
            eventName: "parent_login",
            actorType: "parent",
            idempotencyKey: `parent_login:${Date.now()}`,
          });
          router.push("/parent/dashboard");
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    void runAccountAction("login");
  };

  const onSelectGuardianChild = async (studentId) => {
    if (busy || googleBusy) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await postParentTeacherCodeLogin(identifier.trim(), secret, studentId);
      if (result.status === 200) {
        redirectAfterParentTeacherCodeLogin();
        return;
      }
      setMessageKind("teacher_code");
      setMessage(t(mapParentTeacherCodeLoginError(result.body)));
    } finally {
      setBusy(false);
    }
  };

  const onGoogleCredential = async ({ credential, nonce }) => {
    if (busy || googleBusy || sessionCheckPending || !supabaseRef.current) return;
    setGoogleBusy(true);
    setMessage("");
    setMessageKind("account");
    try {
      const signedIn = await signInParentWithGoogleIdToken(
        supabaseRef.current,
        credential,
        nonce
      );
      if (!signedIn.ok || !signedIn.session?.access_token) {
        setMessage(t(mapParentAuthError(signedIn.error, "login")));
        return;
      }

      const finished = await completeParentGoogleSession(signedIn.session);
      if (!finished.ok) {
        await supabaseRef.current.auth.signOut();
        setMessage(
          finished.messageKey ? t(finished.messageKey) : t("auth.googleSignInFailed")
        );
        return;
      }

      router.push(finished.redirectTo || "/parent/dashboard");
    } catch (error) {
      setMessage(t(mapParentAuthError(error, "login")));
    } finally {
      setGoogleBusy(false);
    }
  };

  const formDisabled = busy || googleBusy || sessionCheckPending;

  if (sessionCheckPending) {
    return (
      <Layout {...layoutProps}>
        <PageSeo
          title={parentLoginSeo.title}
          description={parentLoginSeo.description}
          canonicalPath={parentLoginSeo.canonicalPath}
          noindex={parentLoginSeo.noindex}
        />
        <div className="max-w-md mx-auto px-4 py-3 md:py-10" dir={direction} lang={locale}>
          <PortalLoginHeading
            title={t("auth.parentLoginTitle")}
            subtitle={t("auth.parentLoginSubtitle")}
            bright={isBright}
            homeHref="/parents"
          />
          <PortalLoadingPanel isBright={isBright} message={t("auth.checkingSession")} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout {...layoutProps}>
      <PageSeo
        title={parentLoginSeo.title}
        description={parentLoginSeo.description}
        canonicalPath={parentLoginSeo.canonicalPath}
        noindex={parentLoginSeo.noindex}
      />
      <div className="max-w-md mx-auto px-4 py-3 md:py-10" dir={direction} lang={locale}>
        <PortalLoginHeading
          title={t("auth.parentLoginTitle")}
          subtitle={t("auth.parentLoginSubtitle")}
          bright={isBright}
          homeHref="/parents"
        />

        <section className={T.infoBox} aria-label="Parent account information">
          <h2 className={T.infoTitle}>{t("auth.parentWelcomeTitle")} 👋</h2>
          <p className={T.infoText}>{t("auth.parentWelcomeBody")}</p>
          <p className={T.infoText}>{t("auth.parentWelcomeAfter")}</p>
          <p className={T.infoText}>{t("auth.parentWelcomeBenefits")}</p>
        </section>

        {googleBusy ? (
          <PortalLoadingPanel isBright={isBright} message={t("auth.signingInGoogle")} />
        ) : (
          <ParentGoogleSignInButton
            disabled={formDisabled}
            onCredential={(payload) => void onGoogleCredential(payload)}
            onError={(messageKey) => {
              setMessageKind("account");
              setMessage(t(messageKey));
            }}
          />
        )}

        <form onSubmit={onFormSubmit} className="space-y-3 mt-4">
          <label className="block text-sm">
            <span className={T.label}>{t("auth.emailOrUsername")}</span>
            <input
              data-testid="parent-login-identifier"
              className={T.inputMt}
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t("auth.identifierPlaceholderParent")}
              required
              autoComplete="username"
              disabled={busy}
            />
          </label>
          <PasswordField
            bright={isBright}
            label={t("auth.passwordOrCode")}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={t("auth.secretPlaceholderParent")}
            required
            autoComplete="current-password"
            testId="parent-login-secret"
            disabled={busy}
          />

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              data-testid="parent-login-submit"
              className={`${T.submit} flex-1`}
              disabled={formDisabled}
            >
              {busy ? t("auth.working") : t("auth.signIn")}
            </button>
            <button
              type="button"
              data-testid="parent-signup-submit"
              className={`${T.secondaryBtn} flex-1 font-semibold py-2 disabled:opacity-60`}
              disabled={formDisabled}
              onClick={() => void runAccountAction("signup")}
            >
              {t("auth.signUp")}
            </button>
          </div>

          <p className="text-sm text-center">
            <Link
              href="/auth/forgot-password?portal=parent"
              className={T.link}
              data-testid="parent-forgot-password-link"
            >
              {t(AUTH_FORGOT_PASSWORD_LINK)}
            </Link>
          </p>
        </form>

        <ParentPassivePolicyNotice bright={isBright} className="mt-4" t={t} />

        {multiStudents?.length ? (
          <div className="mt-4">
            <GuardianChildSelectForm
              bright={isBright}
              students={multiStudents}
              busy={busy}
              onSelect={(id) => void onSelectGuardianChild(id)}
            />
          </div>
        ) : null}

        {message ? (
          <p
            className={`mt-3 text-sm ${messageKind === "teacher_code" ? T.error : T.message}`}
            role="alert"
          >
            {message}
          </p>
        ) : null}
      </div>
    </Layout>
  );
}
