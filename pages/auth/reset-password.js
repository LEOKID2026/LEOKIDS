import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import PasswordField from "../../components/auth/PasswordField";
import { resolvePostPasswordResetPath } from "../../lib/auth/auth-post-reset-redirect";
import {
  clearRecoveryActive,
  establishRecoverySession,
} from "../../lib/auth/auth-recovery-session.client";
import {
  createPasswordResetErrorMappers,
  sanitizeAuthErrorForLog,
} from "../../lib/auth/auth-reset-errors";
import { getLearningSupabaseBrowserClient } from "../../lib/learning-supabase/client";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";

const AUTH_RESET_MIN_PASSWORD_LENGTH = 6;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabaseRef = useRef(null);
  const recoverySessionRef = useRef(false);
  const { direction, locale } = useI18n();
  const t = useT();
  const { mapRecoveryEstablishError, mapSupabasePasswordUpdateError } = useMemo(
    () => createPasswordResetErrorMappers(t),
    [t]
  );
  const [clientReady, setClientReady] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionInvalid, setSessionInvalid] = useState(false);
  const [establishError, setEstablishError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const portal = router.query?.portal === "teacher" ? "teacher" : "parent";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!supabaseRef.current) {
      supabaseRef.current = getLearningSupabaseBrowserClient();
    }
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!clientReady || !supabaseRef.current) return;
    let cancelled = false;
    const supabase = supabaseRef.current;

    (async () => {
      const result = await establishRecoverySession(supabase, router);
      if (cancelled) return;

      recoverySessionRef.current = Boolean(result.recoverySession && result.ok);

      if (result.error) {
        console.error("[auth-reset-password] recovery establish failed", sanitizeAuthErrorForLog(result.error), {
          reason: result.reason,
          recoverySession: recoverySessionRef.current,
          urlInfo: result.urlInfo ?? null,
        });
      } else if (result.ok) {
        console.info("[auth-reset-password] recovery session ready", {
          reason: result.reason,
          recoverySession: recoverySessionRef.current,
          hasSession: Boolean(result.session),
          urlInfo: result.urlInfo ?? null,
        });
      } else {
        console.warn("[auth-reset-password] recovery establish incomplete", {
          reason: result.reason,
          urlInfo: result.urlInfo ?? null,
        });
      }

      if (result.ok && result.session) {
        setSessionReady(true);
        setSessionInvalid(false);
        setEstablishError("");
        return;
      }

      setSessionInvalid(true);
      setSessionReady(false);
      setEstablishError(mapRecoveryEstablishError(result.error));
    })();

    return () => {
      cancelled = true;
    };
  }, [clientReady, router, mapRecoveryEstablishError]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < AUTH_RESET_MIN_PASSWORD_LENGTH) {
      setError(t("auth.passwordTooShort", { min: AUTH_RESET_MIN_PASSWORD_LENGTH }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("auth.resetPasswordErrorMismatch"));
      return;
    }
    if (!supabaseRef.current) {
      setError(t("auth.resetPasswordErrorGeneric"));
      return;
    }

    setBusy(true);
    try {
      const { data: preSubmit, error: preSubmitError } = await supabaseRef.current.auth.getSession();
      const hasSession = Boolean(preSubmit?.session);
      const recoverySession = recoverySessionRef.current;

      console.info("[auth-reset-password] before password update", {
        hasSession,
        recoverySession,
        sessionKind: recoverySession ? "recovery" : hasSession ? "normal" : "none",
        preSubmitError: sanitizeAuthErrorForLog(preSubmitError),
      });

      if (!hasSession) {
        setError(t("auth.resetPasswordErrorNoSession"));
        return;
      }
      if (!recoverySession) {
        setError(t("auth.resetPasswordErrorNoSession"));
        return;
      }

      const { error: updateError } = await supabaseRef.current.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        console.error("[auth-reset-password] password update failed", sanitizeAuthErrorForLog(updateError), {
          hasSession,
          recoverySession,
          sessionKind: recoverySession ? "recovery" : "normal",
        });
        setError(
          mapSupabasePasswordUpdateError(updateError, {
            hasRecoverySession: recoverySession,
          })
        );
        return;
      }

      clearRecoveryActive();
      setSuccess(true);
      const destination = await resolvePostPasswordResetPath(supabaseRef.current);
      await new Promise((r) => setTimeout(r, 800));
      router.replace(destination);
    } catch (caught) {
      console.error("[auth-reset-password] password update threw", sanitizeAuthErrorForLog(caught));
      setError(
        mapSupabasePasswordUpdateError(caught, {
          hasRecoverySession: recoverySessionRef.current,
        })
      );
    } finally {
      setBusy(false);
    }
  };

  if (!clientReady) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-10 text-white/60 text-sm" dir={direction} lang={locale}>
          {t("auth.loading")}
        </div>
      </Layout>
    );
  }

  if (sessionInvalid) {
    return (
      <Layout>
        <div
          className="max-w-md mx-auto px-4 py-10"
          dir={direction}
          lang={locale}
          data-testid="auth-reset-password-expired"
        >
          <h1 className="text-2xl font-bold mb-4">{t("auth.resetPasswordTitle")}</h1>
          <p className="text-red-300 text-sm mb-6" role="alert">
            {establishError || t("auth.resetPasswordErrorExpired")}
          </p>
          <Link
            href={`/auth/forgot-password?portal=${portal}`}
            className="text-amber-300 underline text-sm"
            data-testid="auth-reset-password-request-new"
          >
            {t("auth.resetPasswordRequestNew")}
          </Link>
        </div>
      </Layout>
    );
  }

  if (!sessionReady) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 py-10 text-white/60 text-sm" dir={direction} lang={locale}>
          {t("auth.loading")}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="max-w-md mx-auto px-4 py-10"
        dir={direction}
        lang={locale}
        data-testid="auth-reset-password-page"
      >
        <h1 className="text-2xl font-bold mb-4">{t("auth.resetPasswordTitle")}</h1>

        {success ? (
          <p className="text-emerald-300 text-sm" role="status">
            {t("auth.resetPasswordSuccess")}
          </p>
        ) : (
          <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
            <PasswordField
              label={t("auth.resetPasswordNewLabel")}
              value={newPassword}
              onChange={(ev) => setNewPassword(ev.target.value)}
              required
              minLength={AUTH_RESET_MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              testId="auth-reset-password-new"
            />
            <PasswordField
              label={t("auth.confirmPassword")}
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
              required
              minLength={AUTH_RESET_MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              testId="auth-reset-password-confirm"
            />
            {error ? (
              <p className="text-red-300 text-sm" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded bg-amber-500 text-black font-semibold py-2 disabled:opacity-60"
              data-testid="auth-reset-password-submit"
            >
              {busy ? t("auth.saving") : t("auth.resetPasswordSubmit")}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
