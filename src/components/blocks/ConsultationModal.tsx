"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";

import { useIsMdUp } from "@/src/hooks/useIsMdUp";

import {
  clearLeadIntent,
  getConsultationModalCopy,
  getLeadIntent,
  isTierlessConsultationIntent,
} from "@/src/lib/leadIntent";
import { ACG_SELECTED_PRICING_TIER_KEY } from "@/src/lib/selectedPricingTier";
import {
  UA_PHONE_ERROR,
  UA_PHONE_HINT,
  UA_PHONE_INPUT_DEFAULT,
  filterPhoneInput,
  isValidUaPhone,
  normalizeUaPhone,
} from "@/src/lib/uaPhone";

type ConsultationModalProps = {
  open: boolean;
  onClose: () => void;
  /** Якщо не задано — береться з sessionStorage (`leadIntent`). */
  title?: string;
  /** Якщо не задано — береться з sessionStorage (`leadIntent`). */
  description?: string;
};

function mapSubmitError(code: string | undefined): string {
  switch (code) {
    case "required_fields":
      return "Заповніть усі обов'язкові поля.";
    case "invalid_phone":
      return UA_PHONE_ERROR;
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

export default function ConsultationModal({
  open,
  onClose,
  title: titleProp,
  description: descriptionProp,
}: ConsultationModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [headerCopy, setHeaderCopy] = useState(() =>
    getConsultationModalCopy(undefined),
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(UA_PHONE_INPUT_DEFAULT);
  const [callTime, setCallTime] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isMdUp = useIsMdUp();

  useEffect(() => {
    if (!open) return;
    const fromIntent = getConsultationModalCopy(getLeadIntent());
    setHeaderCopy({
      title: titleProp?.trim() || fromIntent.title,
      description: descriptionProp?.trim() || fromIntent.description,
    });
  }, [open, titleProp, descriptionProp]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      setPhoneError(null);

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

      setIsSubmitting(true);
      try {
        let tierFromPricing: string | undefined;
        try {
          if (typeof window !== "undefined") {
            const stored = sessionStorage
              .getItem(ACG_SELECTED_PRICING_TIER_KEY)
              ?.trim();
            if (stored) tierFromPricing = stored;
          }
        } catch {
          /* ignore */
        }

        const leadIntent = getLeadIntent();
        const tierlessConsultation = isTierlessConsultationIntent(leadIntent);

        const res = await fetch("/api/sendpulse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            phone: phoneE164,
            website: honeypot,
            ...(callTime.trim() ? { callTime: callTime.trim() } : {}),
            ...(!tierlessConsultation && tierFromPricing
              ? { tier: tierFromPricing }
              : {}),
            ...(leadIntent ? { leadIntent } : {}),
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
        setCallTime("");
        setHoneypot("");
        clearLeadIntent();
      } catch {
        setSubmitError(mapSubmitError(undefined));
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, phone, callTime, honeypot],
  );

  const inputClass =
    "mt-2 block h-12 w-full rounded-xl border border-acg-border bg-acg-surface-subtle px-3 text-base text-foreground outline-none transition duration-200 placeholder:text-foreground/40 focus:border-acg-blue focus:ring-2 focus:ring-acg-blue/20";

  const phoneInputClass = `${inputClass} ${
    phoneError ? "border-acg-red/80 focus:border-acg-red focus:ring-acg-red/25" : ""
  }`;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Закрити"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-[1] flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-acg-border bg-acg-light shadow-2xl shadow-acg-blue/15 sm:max-h-[min(88vh,640px)] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-foreground/10 px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <p
              id={titleId}
              className="text-lg font-semibold tracking-tight text-acg-blue sm:text-xl"
            >
              {headerCopy.title}
            </p>
            <p
              id={descriptionId}
              className="mt-1 text-sm leading-relaxed text-foreground/70"
            >
              {headerCopy.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-foreground/50 outline-none transition hover:bg-white/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-acg-blue/25"
            aria-label="Закрити вікно"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          {isSuccess ? (
            <motion.div
              initial={isMdUp ? { opacity: 0, y: 12 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-8 text-center"
              role="status"
            >
              <CheckCircle2
                className="size-14 text-acg-success"
                strokeWidth={1.35}
                aria-hidden
              />
              <p className="mt-5 text-xl font-semibold text-foreground">
                Заявку прийнято!
              </p>
              <p className="mt-2 max-w-sm text-sm text-foreground/65">
                Ми зв&apos;яжемося з вами найближчим часом.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 rounded-full border border-acg-blue/25 bg-white px-6 py-2.5 text-sm font-medium text-acg-blue transition hover:bg-acg-blue/5"
              >
                Закрити
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
              <div
                className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
                aria-hidden
              >
                <input
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
                  htmlFor="modal-lead-name"
                  className="block text-sm font-medium text-foreground/80"
                >
                  Ім&apos;я
                </label>
                <input
                  id="modal-lead-name"
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
                  htmlFor="modal-lead-phone"
                  className="block text-sm font-medium text-foreground/80"
                >
                  Телефон
                </label>
                <input
                  id="modal-lead-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(ev) => {
                    const next = filterPhoneInput(ev.target.value);
                    setPhone(next);
                    if (phoneError && isValidUaPhone(next)) setPhoneError(null);
                  }}
                  onBlur={() => {
                    const digits = phone.replace(/\D/g, "");
                    if (digits.length <= 3) {
                      setPhoneError(null);
                      return;
                    }
                    setPhoneError(isValidUaPhone(phone) ? null : UA_PHONE_ERROR);
                  }}
                  required
                  aria-invalid={phoneError ? true : undefined}
                  className={phoneInputClass}
                />
                <p
                  className={`mt-1 text-xs ${phoneError ? "text-foreground/40" : "text-foreground/50"}`}
                >
                  {UA_PHONE_HINT}
                </p>
                {phoneError ? (
                  <p className="mt-2 text-sm font-medium text-acg-red" role="alert">
                    {phoneError}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="modal-lead-call-time"
                  className="block text-sm font-medium text-foreground/80"
                >
                  Зручний час для дзвінка{" "}
                  <span className="font-normal text-foreground/50">
                    (необов&apos;язково)
                  </span>
                </label>
                <input
                  id="modal-lead-call-time"
                  name="callTime"
                  type="text"
                  autoComplete="off"
                  value={callTime}
                  onChange={(ev) => setCallTime(ev.target.value)}
                  placeholder="Наприклад: після 18:00 або з 10 до 12"
                  className={inputClass}
                />
              </div>
              <div className="pt-1">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-acg-blue px-5 py-3 text-base font-medium text-white shadow-md shadow-acg-blue/20 transition hover:bg-acg-blue/95 disabled:pointer-events-none disabled:opacity-65"
                  whileHover={
                    isSubmitting || !isMdUp ? undefined : { scale: 1.01 }
                  }
                  whileTap={isSubmitting || !isMdUp ? undefined : { scale: 0.99 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />
                      <span>Надсилання…</span>
                    </>
                  ) : (
                    "Відправити заявку"
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
