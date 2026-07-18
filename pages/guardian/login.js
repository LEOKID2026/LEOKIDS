import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import GuardianChildSelectForm from "../../components/parent/GuardianChildSelectForm";
import TeacherPortalShell from "../../components/teacher-portal/TeacherPortalShell";
import {
  mapGuardianAccessErrorKey,
  parseGuardianMultipleStudents,
} from "../../lib/parent-client/parent-teacher-code-access.js";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";

export async function getServerSideProps(context) {
  return {
    props: {
      inviteToken: typeof context.query?.invite === "string" ? context.query.invite : null,
    },
  };
}

async function postGuardianLogin(payload, inviteToken) {
  const qs = inviteToken ? `?invite=${encodeURIComponent(inviteToken)}` : "";
  const res = await fetch(`/api/guardian/login${qs}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(payload || {}),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, body: json };
}

export default function GuardianLoginPage({ inviteToken }) {
  const router = useRouter();
  const { direction, locale, withLocalePath } = useI18n();
  const t = useT();
  const [loginUsername, setLoginUsername] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState("idle");
  const [errorKey, setErrorKey] = useState("");
  const [multiStudents, setMultiStudents] = useState(null);
  const autoInviteRan = useRef(false);

  const guardianViewPath = withLocalePath("/guardian/view");

  useEffect(() => {
    let mounted = true;
    fetch("/api/guardian/me", { credentials: "same-origin", cache: "no-store" })
      .then(async (res) => {
        if (!mounted) return;
        if (res.status === 200) {
          router.replace(guardianViewPath);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [router, guardianViewPath]);

  useEffect(() => {
    if (!inviteToken || autoInviteRan.current) return;
    autoInviteRan.current = true;
    setBusy(true);
    setState("invite_loading");
    postGuardianLogin({}, inviteToken).then(({ status, body }) => {
      setBusy(false);
      if (status === 200) {
        router.replace(guardianViewPath);
        return;
      }
      setState("invite_failed");
      setErrorKey(mapGuardianAccessErrorKey(body, "invite"));
    });
  }, [inviteToken, router, guardianViewPath]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setState("idle");
    setErrorKey("");
    setMultiStudents(null);
    const result = await postGuardianLogin({ loginUsername, pin }, null);
    setBusy(false);
    if (result.status === 200) {
      router.replace(guardianViewPath);
      return;
    }
    if (result.status === 409 && result.body?.error?.code === "guardian_multiple_students") {
      setMultiStudents(parseGuardianMultipleStudents(result.body));
      setState("select_child");
      setErrorKey(mapGuardianAccessErrorKey(result.body, "login"));
      return;
    }
    setState("login_failed");
    setErrorKey(mapGuardianAccessErrorKey(result.body, "login"));
  };

  const errorMsg = errorKey ? t(errorKey) : "";

  return (
    <Layout>
      <TeacherPortalShell title={t("auth.guardian.loginTitle")}>
        <div data-testid="guardian-login-root" data-state={state} dir={direction} lang={locale}>
          <p className="text-white/70 text-sm mb-6">{t("auth.guardian.intro")}</p>

          {inviteToken ? (
            <div data-testid="guardian-login-invite" data-busy={busy ? "1" : "0"}>
              {state === "invite_loading" || busy ? (
                <p className="text-white/70">{t("auth.guardian.signingInViaLink")}</p>
              ) : null}
              {state === "invite_failed" && errorMsg ? (
                <p className="text-red-300 text-sm" role="alert">
                  {errorMsg}
                </p>
              ) : null}
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-4 max-w-md"
              data-testid="guardian-login-form"
            >
              <label className="block text-sm">
                <span className="text-white/80">{t("auth.guardian.usernameLabel")}</span>
                <input
                  data-testid="guardian-login-username"
                  className="mt-1 w-full rounded bg-black/40 border border-white/20 px-3 py-2"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  autoComplete="username"
                  placeholder={t("auth.guardian.usernamePlaceholder")}
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="text-white/80">{t("auth.guardian.accessCodeLabel")}</span>
                <input
                  data-testid="guardian-login-pin"
                  className="mt-1 w-full rounded bg-black/40 border border-white/20 px-3 py-2"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  inputMode="numeric"
                  autoComplete="current-password"
                  placeholder={t("auth.guardian.accessCodePlaceholder")}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                data-testid="guardian-login-submit"
                className="rounded bg-amber-500 text-black font-semibold px-6 py-2 disabled:opacity-60"
              >
                {busy ? t("auth.guardian.signingIn") : t("auth.guardian.signIn")}
              </button>
            </form>
          )}

          {multiStudents?.length ? (
            <div className="mt-4">
              <GuardianChildSelectForm
                students={multiStudents}
                busy={busy}
                onSelect={async (studentId) => {
                  setBusy(true);
                  const r = await postGuardianLogin({ loginUsername, pin, studentId }, null);
                  setBusy(false);
                  if (r.status === 200) {
                    router.replace(guardianViewPath);
                  } else {
                    setState("login_failed");
                    setErrorKey(mapGuardianAccessErrorKey(r.body, "login"));
                  }
                }}
              />
            </div>
          ) : null}

          {errorMsg && (state === "login_failed" || state === "select_child") ? (
            <p className="mt-4 text-red-300 text-sm" role="alert">
              {errorMsg}
            </p>
          ) : null}
        </div>
      </TeacherPortalShell>
    </Layout>
  );
}
