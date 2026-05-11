"use client";

import { motion } from "framer-motion";

export interface PricingTier {
  name?: string;
  price?: string;
  cadence?: string;
  description?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  highlighted?: boolean;
}

export interface PricingProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  {
    name: "Базовий",
    price: "—",
    cadence: " / міс.",
    description: "Стартовий пакет супроводу для малого обсягу операцій.",
    features: ["Пункт включено", "Пункт включено", "Пункт включено"],
    ctaLabel: "Обрати пакет",
    ctaHref: "#contact",
    highlighted: false,
  },
  {
    name: "Стандарт",
    price: "—",
    cadence: " / міс.",
    description: "Збалансоване співвідношення обсягу послуг і індивідуальної уваги.",
    features: [
      "Пункт включено",
      "Пункт включено",
      "Пункт включено",
      "Пункт включено",
    ],
    ctaLabel: "Обрати пакет",
    ctaHref: "#contact",
    highlighted: true,
  },
  {
    name: "Під ключ",
    price: "—",
    cadence: "за домовленістю",
    description: "Розширений супровід для складного обліку та інтеграцій.",
    features: ["Пункт включено", "Пункт включено", "Пункт включено"],
    ctaLabel: "Запитати умови",
    ctaHref: "#contact",
    highlighted: false,
  },
];

const cardListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Pricing({
  eyebrow = "Тарифи",
  heading = "Пакети послуг",
  intro =
    "Прозоре ціноутворення без прихованих платежів",
  tiers = defaultTiers,
}: PricingProps) {
  return (
    <section
      aria-labelledby="pricing-heading"
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
          id="pricing-heading"
          className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/75">
          {intro}
        </p>
        <motion.div
          className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-10"
          variants={cardListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {tiers.map((tier, i) => (
            <motion.article
              key={i}
              variants={cardItemVariants}
              className="flex flex-col rounded-3xl bg-white p-8 shadow-lg shadow-acg-blue/5 sm:p-10"
            >
              <h3 className="text-lg font-semibold text-acg-blue">{tier.name}</h3>
              <p className="mt-2 text-sm text-foreground/70">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {tier.price}
                </span>
                <span className="text-sm text-foreground/60">{tier.cadence}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-foreground/80">
                {(tier.features ?? []).map((f, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-foreground/40" aria-hidden>
                      •
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <motion.a
                href={tier.ctaHref ?? "#contact"}
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium ${
                  tier.highlighted
                    ? "bg-acg-red text-white hover:bg-red-800"
                    : "border border-acg-blue bg-transparent text-acg-blue hover:bg-acg-blue/10"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tier.ctaLabel ?? "Почати"}
              </motion.a>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
