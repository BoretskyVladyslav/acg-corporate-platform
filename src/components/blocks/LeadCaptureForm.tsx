"use client";

import { motion } from "framer-motion";

export interface LeadCaptureFormProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  /** Placeholder for future server action or route handler URL */
  action?: string;
  submitLabel?: string;
}

export default function LeadCaptureForm({
  id = "contact",
  eyebrow = "Контакти",
  heading = "Замовити консультацію",
  description =
    "Залишіть заявку, і наші спеціалісти зв'яжуться з вами",
  action,
  submitLabel = "Відправити",
}: LeadCaptureFormProps) {
  return (
    <section
      id={id}
      aria-labelledby="lead-form-heading"
      className="border-t border-foreground/10 bg-white text-foreground"
    >
      <motion.div
        className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:py-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
          {eyebrow}
        </p>
        <h2
          id="lead-form-heading"
          className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-foreground/75">
          {description}
        </p>

        <form
          className="mt-10 max-w-3xl space-y-6 rounded-3xl border-transparent bg-white p-8 shadow-lg shadow-acg-blue/5 sm:p-10"
          method="post"
          action={action}
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
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
                className="mt-2 w-full rounded-xl border border-acg-blue/15 bg-white px-4 py-3 text-sm text-foreground outline-none ring-acg-blue/20 placeholder:text-foreground/40 focus:ring-2"
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
                className="mt-2 w-full rounded-xl border border-acg-blue/15 bg-white px-4 py-3 text-sm text-foreground outline-none ring-acg-blue/20 placeholder:text-foreground/40 focus:ring-2"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
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
                className="mt-2 w-full rounded-xl border border-acg-blue/15 bg-white px-4 py-3 text-sm text-foreground outline-none ring-acg-blue/20 placeholder:text-foreground/40 focus:ring-2"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <motion.button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-acg-red px-6 py-3 text-sm font-medium text-white hover:bg-red-800"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitLabel}
            </motion.button>
            <p className="text-xs text-foreground/50">
              Інтеграції надсилання заявки буде налаштовано окремо.
            </p>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
