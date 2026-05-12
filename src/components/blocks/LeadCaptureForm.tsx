"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { type FormEvent, useCallback, useState } from "react";

import {
  LEAD_EMAIL_INVALID_MESSAGE,
  filterLeadEmailInput,
  isValidLeadEmail,
} from "@/src/lib/leadEmail";
import {
  UA_PHONE_ERROR,
  UA_PHONE_HINT,
  UA_PHONE_INPUT_DEFAULT,
  filterPhoneInput,
  isValidUaPhone,
  normalizeUaPhone,
} from "@/src/lib/uaPhone";

export interface LeadCaptureFormProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  submitLabel?: string;
  addressLine?: string;
  phoneDisplay?: string;
  phoneHref?: string;
  service?: string;
}

function mapSubmitError(code: string | undefined): string {
  switch (code) {
    case "required_fields":
      return "Заповніть усі обов'язкові поля.";
    case "invalid_phone":
      return UA_PHONE_ERROR;
    case "invalid_email":
      return LEAD_EMAIL_INVALID_MESSAGE;
    case "invalid_name":
      return "Вкажіть коректне ім'я.";
    case "auth_failed":
    case "no_responsible":
    case "no_delivery_channel":
      return "Сервіс тимчасово недоступний. Спробуйте пізніше.";
    case "crm_rejected":
      return "Не вдалося зберегти заявку. Спробуйте ще раз.";
    case "bad_json":
      return "Некоректні дані форми.";
    default:
      return "Щось пішло не так. Спробуйте ще раз.";
  }
}

export default function LeadCaptureForm({
  id = "contact",
  eyebrow = "Контакти",
  heading = "Замовити консультацію",
  description =
    "Залишіть заявку, і наші спеціалісти зв'яжуться з вами найближчим часом.",
  submitLabel = "Відправити заявку",
  addressLine = "М. КИЇВ, ВУЛ. САКСАГАНСЬКОГО 28.",
  phoneDisplay = "+38 097 505 86 86",
  phoneHref = "tel:+380975058686",
  service,
}: LeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(UA_PHONE_INPUT_DEFAULT);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      setPhoneError(null);
      setEmailError(null);

      if (!name.trim()) {
        setSubmitError("Заповніть ім'я.");
        return;
      }
      const digits = phone.replace(/\D/g, "");
      if (digits.length <= 3) {
        setPhoneError("Вкажіть номер телефону.");
        return;
      }
      if (!isValidUaPhone(phone)) {
        setPhoneError(UA_PHONE_ERROR);
        return;
      }
      const phoneE164 = normalizeUaPhone(phone);
      if (!phoneE164) {
        setPhoneError(UA_PHONE_ERROR);
        return;
      }

      const emailTrim = email.trim();
      if (emailTrim && !isValidLeadEmail(emailTrim)) {
        setEmailError(LEAD_EMAIL_INVALID_MESSAGE);
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch("/api/sendpulse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            phone: phoneE164,
            website: honeypot,
            ...(email.trim() ? { email: email.trim() } : {}),
            ...(service?.trim() ? { service: service.trim() } : {}),
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          setSubmitError(mapSubmitError(data.error));
          return;
        }
        setIsSuccess(true);
        setName("");
        setPhone(UA_PHONE_INPUT_DEFAULT);
        setEmail("");
        setHoneypot("");
        setEmailError(null);
      } catch {
        setSubmitError(mapSubmitError(undefined));
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, phone, email, honeypot, service],
  );

  const inputClass =
    "mt-2 block h-14 w-full rounded-xl border border-acg-border bg-acg-surface-subtle px-4 text-base text-foreground outline-none transition duration-200 placeholder:text-foreground/40 focus:border-acg-blue focus:ring-2 focus:ring-acg-blue/20";

  const phoneInputClass = `${inputClass} ${
    phoneError
      ? "border-acg-red/80 focus:border-acg-red focus:ring-acg-red/25"
      : ""
  }`;

  const emailInputClass = `${inputClass} ${
    emailError
      ? "border-acg-red/80 focus:border-acg-red focus:ring-acg-red/25"
      : ""
  }`;

  return (
    <section
      id={id}
      aria-labelledby="lead-form-heading"
      className="border-t border-foreground/10 bg-acg-light text-foreground"
    >
      <motion.div
        className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:py-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl lg:pt-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
              {eyebrow}
            </p>
            <h2
              id="lead-form-heading"
              className="mt-4 text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
            >
              {heading}
            </h2>
            <p className="mt-6 text-lg leading-[1.75] text-foreground/75">
              {description}
            </p>
            <dl className="mt-12 space-y-10">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">
                  Адреса
                </dt>
                <dd className="mt-3 text-base leading-relaxed text-foreground/85">
                  {addressLine}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">
                  Телефон
                </dt>
                <dd className="mt-3">
                  <a
                    href={phoneHref}
                    className="text-lg font-medium text-acg-blue underline-offset-[6px] transition hover:underline"
                  >
                    {phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-acg-border bg-white p-8 shadow-xl shadow-acg-blue/[0.06] sm:p-10">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center py-10 text-center sm:py-14"
                role="status"
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 24,
                    delay: 0.05,
                  }}
                >
                  <CheckCircle2
                    className="size-[4.5rem] text-acg-success"
                    strokeWidth={1.35}
                    aria-hidden
                  />
                </motion.div>
                <p className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
                  Заявку прийнято!
                </p>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-foreground/65">
                  Наші спеціалісти зв&apos;яжуться з вами найближчим часом.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="relative space-y-6"
              >
                <div
                  className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <input
                    id="lead-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(ev) => setHoneypot(ev.target.value)}
                  />
                </div>
                {submitError ? (
                  <p
                    className="rounded-xl border border-acg-red/25 bg-acg-red/5 px-4 py-3 text-sm text-acg-red"
                    role="alert"
                  >
                    {submitError}
                  </p>
                ) : null}
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block text-sm font-medium text-foreground/80"
                  >
                    Ім&apos;я
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-phone"
                    className="block text-sm font-medium text-foreground/80"
                  >
                    Телефон
                  </label>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(ev) => {
                      const next = filterPhoneInput(ev.target.value);
                      setPhone(next);
                      if (phoneError && isValidUaPhone(next)) {
                        setPhoneError(null);
                      }
                    }}
                    onBlur={() => {
                      const digits = phone.replace(/\D/g, "");
                      if (digits.length <= 3) {
                        setPhoneError(null);
                        return;
                      }
                      setPhoneError(
                        isValidUaPhone(phone) ? null : UA_PHONE_ERROR,
                      );
                    }}
                    required
                    aria-invalid={phoneError ? true : undefined}
                    aria-describedby={
                      phoneError
                        ? "lead-phone-error lead-phone-hint"
                        : "lead-phone-hint"
                    }
                    className={phoneInputClass}
                  />
                  <p
                    id="lead-phone-hint"
                    className={`mt-1.5 text-xs ${phoneError ? "text-foreground/40" : "text-foreground/50"}`}
                  >
                    {UA_PHONE_HINT}
                  </p>
                  {phoneError ? (
                    <p
                      id="lead-phone-error"
                      className="mt-2 text-sm font-medium text-acg-red"
                      role="alert"
                    >
                      {phoneError}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-sm font-medium text-foreground/80"
                  >
                    Email
                  </label>
                  <input
                    id="lead-email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(ev) => {
                      const next = filterLeadEmailInput(ev.target.value);
                      setEmail(next);
                      if (
                        emailError &&
                        (!next.trim() || isValidLeadEmail(next))
                      ) {
                        setEmailError(null);
                      }
                    }}
                    onBlur={() => {
                      const t = email.trim();
                      if (!t) {
                        setEmailError(null);
                        return;
                      }
                      setEmailError(
                        isValidLeadEmail(t)
                          ? null
                          : LEAD_EMAIL_INVALID_MESSAGE,
                      );
                    }}
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={
                      emailError
                        ? "lead-email-error lead-email-hint"
                        : "lead-email-hint"
                    }
                    className={emailInputClass}
                  />
                  <p
                    id="lead-email-hint"
                    className={`mt-1.5 text-xs ${emailError ? "text-foreground/40" : "text-foreground/50"}`}
                  >
                    Латиниця, цифри та символи @ . _ + -
                  </p>
                  {emailError ? (
                    <p
                      id="lead-email-error"
                      className="mt-2 text-sm font-medium text-acg-red"
                      role="alert"
                    >
                      {emailError}
                    </p>
                  ) : null}
                </div>
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-acg-blue px-6 py-3 text-lg font-medium text-white shadow-md shadow-acg-blue/20 transition hover:bg-acg-blue/95 disabled:pointer-events-none disabled:opacity-65"
                    whileHover={
                      isSubmitting ? undefined : { scale: 1.01 }
                    }
                    whileTap={
                      isSubmitting ? undefined : { scale: 0.99 }
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="size-5 shrink-0 animate-spin"
                          aria-hidden
                        />
                        <span>Надсилання…</span>
                      </>
                    ) : (
                      submitLabel
                    )}
                  </motion.button>
                  <p className="mt-4 text-center text-xs text-acg-muted-light">
                    Ваші дані надійно захищені
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
