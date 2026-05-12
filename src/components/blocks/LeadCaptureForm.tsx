"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { type FormEvent, useCallback, useState } from "react";

export interface LeadCaptureFormProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  submitLabel?: string;
  addressLine?: string;
  phoneDisplay?: string;
  phoneHref?: string;
}

function mapSubmitError(code: string | undefined): string {
  switch (code) {
    case "required_fields":
      return "Заповніть усі обов'язкові поля.";
    case "invalid_email":
      return "Перевірте формат email.";
    case "invalid_name":
      return "Вкажіть коректне ім'я.";
    case "auth_failed":
    case "no_responsible":
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
}: LeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/sendpulse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email }),
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
        setPhone("");
        setEmail("");
      } catch {
        setSubmitError(mapSubmitError(undefined));
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, phone, email],
  );

  const inputClass =
    "mt-2 block h-14 w-full rounded-xl border border-acg-border bg-acg-surface-subtle px-4 text-base text-foreground outline-none transition duration-200 placeholder:text-foreground/40 focus:border-acg-blue focus:ring-2 focus:ring-acg-blue/20";

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
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                    autoComplete="tel"
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                    required
                    className={inputClass}
                  />
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
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    required
                    className={inputClass}
                  />
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
