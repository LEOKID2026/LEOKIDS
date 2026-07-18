import { useState } from "react";
import { LEARNING_SUBJECT_ALLOWLIST } from "../../lib/learning-supabase/learning-activity.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import { getTeacherPortalTheme } from "../../lib/teacher-ui/teacher-portal-theme.client.js";
import {
  REG_NETWORK_ERROR_KEY,
  REG_REQUEST_INTENT_OPTIONS,
  REG_SUBMIT_FAILED_KEY,
  REG_TEACHER_ALREADY_PENDING,
  REG_TEACHER_EMAIL_LABEL,
  REG_TEACHER_EXPLANATION_HINT,
  REG_TEACHER_EXPLANATION_LABEL,
  REG_TEACHER_INTENT_LABEL,
  REG_TEACHER_NAME_LABEL,
  REG_TEACHER_PHONE_LABEL,
  REG_TEACHER_SUBJECTS_LABEL,
  REG_TEACHER_SUBMIT,
  REG_TEACHER_SUCCESS,
  REG_TEACHER_TITLE,
  SUBJECT_LABEL_KEYS,
} from "../../lib/auth/auth-registration.js";

export default function TeacherRegistrationRequestForm({ bright = false }) {
  const t = useT();
  const T = getTeacherPortalTheme(bright);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestIntent, setRequestIntent] = useState(REG_REQUEST_INTENT_OPTIONS[0].id);
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const toggleSubject = (key) => {
    setSubjects((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const explanationReady = description.trim().length >= 10;

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/teacher-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          requestIntent,
          description: description.trim(),
          requestedSubjects: subjects,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 409 && body?.error?.code === "request_already_pending") {
        setError(t(REG_TEACHER_ALREADY_PENDING));
        return;
      }
      if (res.status === 201 || res.status === 200) {
        setMessage(t(REG_TEACHER_SUCCESS));
        return;
      }
      setError(t(REG_SUBMIT_FAILED_KEY));
    } catch {
      setError(t(REG_NETWORK_ERROR_KEY));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="teacher-registration-request-form">
      <h2 className={T.regTitle}>{t(REG_TEACHER_TITLE)}</h2>
      {message ? (
        <p className={`${T.regSuccess} mb-1`} role="status">
          {message}
        </p>
      ) : (
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-1.5 md:space-y-3">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 md:flex md:flex-row md:gap-x-4 md:gap-y-0">
            <label className="block text-sm min-w-0 col-span-1 order-1 md:flex-1">
              <span className={T.loginLabel}>{t(REG_TEACHER_NAME_LABEL)}</span>
              <input
                type="text"
                value={fullName}
                onChange={(ev) => setFullName(ev.target.value)}
                required
                maxLength={120}
                className={T.loginInputMt}
                data-testid="teacher-reg-full-name"
              />
            </label>
            <label className="block text-sm min-w-0 col-span-1 order-2 md:flex-1">
              <span className={T.loginLabel}>{t(REG_TEACHER_INTENT_LABEL)}</span>
              <select
                value={requestIntent}
                onChange={(ev) => setRequestIntent(ev.target.value)}
                required
                className={T.loginInputMt}
                data-testid="teacher-reg-intent"
              >
                {REG_REQUEST_INTENT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm col-span-2 order-3 md:order-3 md:flex-none md:w-full md:max-w-md md:shrink-0">
              <span className={T.loginLabel}>{t(REG_TEACHER_EMAIL_LABEL)}</span>
              <input
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
                className={T.loginInputMt}
                data-testid="teacher-reg-email"
              />
            </label>
            <label className="block text-sm col-span-2 order-4 md:order-4 md:flex-none md:w-full md:max-w-md md:shrink-0">
              <span className={T.loginLabel}>{t(REG_TEACHER_PHONE_LABEL)}</span>
              <input
                type="tel"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                required
                inputMode="tel"
                autoComplete="tel"
                maxLength={30}
                className={T.loginInputMt}
                data-testid="teacher-reg-phone"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className={T.loginLabel}>{t(REG_TEACHER_EXPLANATION_LABEL)}</span>
            <span className={`block ${T.regHint}`}>{t(REG_TEACHER_EXPLANATION_HINT)}</span>
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              required
              minLength={10}
              maxLength={1000}
              rows={3}
              className={T.regTextarea}
              data-testid="teacher-reg-description"
            />
          </label>

          <fieldset className="text-sm pt-0">
            <legend className={T.regLegend}>{t(REG_TEACHER_SUBJECTS_LABEL)}</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-1.5">
              {[...LEARNING_SUBJECT_ALLOWLIST].map((key) => (
                <label key={key} className={T.regSubjectChip}>
                  <input
                    type="checkbox"
                    checked={subjects.includes(key)}
                    onChange={() => toggleSubject(key)}
                    data-testid={`teacher-reg-subject-${key}`}
                    className="shrink-0"
                  />
                  <span>{t(SUBJECT_LABEL_KEYS[key] || key)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={busy || !explanationReady}
            className={`${T.submitBtn} md:w-auto md:px-6 md:py-2`}
            data-testid="teacher-reg-submit"
          >
            {busy ? t("auth.sending") : t(REG_TEACHER_SUBMIT)}
          </button>
        </form>
      )}
      {error ? (
        <p className={`mt-1.5 ${T.error}`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
