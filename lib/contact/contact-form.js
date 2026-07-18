const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {{ name: string, email: string, message: string }} fields
 * @param {(key: string) => string} t
 */
export function validateContactForm({ name, email, message }, t) {
  const errors = {};
  if (!name.trim()) errors.name = t("ui.public.contact.form.errors.name");
  if (!email.trim()) {
    errors.email = t("ui.public.contact.form.errors.email");
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = t("ui.public.contact.form.errors.emailInvalid");
  }
  if (!message.trim()) errors.message = t("ui.public.contact.form.errors.message");
  return errors;
}
