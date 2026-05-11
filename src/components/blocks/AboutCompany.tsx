"use client";

import { motion } from "framer-motion";

export interface AboutCompanyProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  metrics?: Array<{ label?: string; value?: string }>;
}

const defaultMetrics: NonNullable<AboutCompanyProps["metrics"]> = [
  { label: "Показник", value: "—" },
  { label: "Показник", value: "—" },
  { label: "Показник", value: "—" },
];

export default function AboutCompany({
  id = "about",
  eyebrow = "Про нас",
  heading = "Про компанію",
  body = "Ваш надійний партнер у сфері фінансів та права",
  metrics = defaultMetrics,
}: AboutCompanyProps) {
  return (
    <section
      id={id}
      aria-labelledby="about-heading"
      className="bg-acg-light text-foreground"
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
          id="about-heading"
          className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
        >
          {heading}
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/75">
          {body}
        </p>
        <dl className="mt-12 grid gap-8 sm:grid-cols-3 lg:gap-10">
          {metrics.slice(0, 3).map((m, i) => (
            <div
              key={i}
              className="rounded-3xl border-transparent bg-white p-8 shadow-lg shadow-acg-blue/5 sm:p-10"
            >
              <dt className="text-sm text-foreground/60">{m?.label}</dt>
              <dd className="mt-2 text-2xl font-semibold tracking-tight text-acg-blue">
                {m?.value}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
