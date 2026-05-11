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
    name: "ФОП - 1 ГРУПА",
    price: "1000 грн",
    cadence: " / міс.",
    description: "Оптимальне рішення для першої групи спрощеної системи.",
    features: [
      "Подання звітності (річна, ЄСВ та ПДФО)",
      "Формування реквізитів на сплату",
      "Відслідковування своєчасності оплат",
      "Консультування з питань діяльності",
      "Формування книги обліку доходів",
      "Відслідковування лімітів доходів",
      "Складання рахунків та актів",
      "Допомога в створенні ЕЦП",
    ],
    ctaLabel: "Отримати консультацію",
    ctaHref: "#contact",
    highlighted: false,
  },
  {
    name: "ФОП - 2 ГРУПА",
    price: "від 1500 грн",
    cadence: " / міс.",
    description: "Повний супровід з окремим функціоналом по ПРРО.",
    features: [
      "Всі послуги з 1-ї групи",
      "Подання заяв до податкової",
      "Взаємодія з контролюючими органами",
      "Перевірка даних Z-звіту з кабінетом (ПРРО)",
      "Інформування про помилки (ПРРО)",
      "Акти виправлення помилок (ПРРО)",
    ],
    ctaLabel: "Отримати консультацію",
    ctaHref: "#contact",
    highlighted: true,
  },
  {
    name: "ФОП - 3 ГРУПА",
    price: "від 1500 грн",
    cadence: " / міс.",
    description: "Розширений супровід для третьої групи платників ЄП.",
    features: [
      "Подання квартальної звітності",
      "Формування реквізитів на сплату",
      "Взаємодія з контролюючими органами",
      "Складання первинних документів",
      "Перевірка Z-звіту та ПРРО",
      "Допомога в створенні ЕЦП",
    ],
    ctaLabel: "Отримати консультацію",
    ctaHref: "#contact",
    highlighted: false,
  },
];

const springEnter = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
};

const springHover = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

const springHeader = {
  type: "spring" as const,
  stiffness: 105,
  damping: 20,
  mass: 1,
};

const headingGradientClass =
  "bg-gradient-to-b from-[#1a3a63] via-[#245494] to-[#1a3a63] bg-clip-text text-transparent [background-clip:text] [-webkit-background-clip:text] font-black uppercase tracking-tighter leading-[0.95]";

const headerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springHeader,
  },
};

const cardGridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...springEnter,
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
};

const headlineBlockVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springEnter,
  },
};

const featuresListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.08,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springEnter,
  },
};

const ctaAppearVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springEnter,
  },
};

function hoverShadowExpressive(highlighted: boolean): string {
  const baseLift =
    "0 25px 50px -12px rgba(36, 84, 148, 0.1), 0 8px 20px -6px rgba(36, 84, 148, 0.06)";
  if (highlighted) {
    return `${baseLift}, 0 0 0 2px rgba(200, 35, 51, 0.36)`;
  }
  return baseLift;
}

function hoverBorderColor(highlighted: boolean): string {
  if (highlighted) return "rgba(200, 35, 51, 0.28)";
  return "rgba(36, 84, 148, 0.14)";
}

export default function Pricing({
  eyebrow = "Тарифи",
  heading = "Пакети послуг",
  intro = "Прозоре ціноутворення без прихованих платежів",
  tiers = defaultTiers,
}: PricingProps) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-acg-light text-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:py-32">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={headerItemVariants}
            className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60"
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            id="pricing-heading"
            variants={headerItemVariants}
            className={`${headingGradientClass} mt-3 max-w-[min(100%,28rem)] text-4xl sm:text-5xl lg:text-6xl`}
          >
            {heading}
          </motion.h2>
          <motion.p
            variants={headerItemVariants}
            className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/75"
          >
            {intro}
          </motion.p>
        </motion.div>
        <motion.div
          className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-10"
          variants={cardGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {tiers.map((tier, i) => (
            <motion.article
              key={i}
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: hoverShadowExpressive(Boolean(tier.highlighted)),
                borderColor: hoverBorderColor(Boolean(tier.highlighted)),
                transition: springHover,
              }}
              whileTap={{ scale: 0.99, transition: springHover }}
              className={`relative flex flex-col overflow-hidden rounded-3xl border border-acg-blue/5 bg-linear-to-br from-white via-white to-acg-blue/4 p-8 shadow-lg shadow-acg-blue/5 sm:p-10 ${
                tier.highlighted ? "ring-2 ring-acg-red/20" : ""
              }`}
            >
              {tier.highlighted ? (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-4 top-4 z-0 max-w-[min(100%,240px)] select-none text-right text-4xl font-black uppercase leading-[0.9] tracking-tighter text-acg-blue/5.5 sm:text-5xl"
                  >
                    {tier.name}
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-1 rounded-3xl bg-linear-to-tr from-transparent via-white/30 to-transparent opacity-80"
                  />
                </>
              ) : null}
              <div className="relative z-10 flex flex-1 flex-col">
                <motion.div variants={headlineBlockVariants}>
                  <h3 className="text-lg font-semibold text-acg-blue">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70">
                    {tier.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-sm text-foreground/60">
                      {tier.cadence}
                    </span>
                  </p>
                </motion.div>
                <motion.ul
                  variants={featuresListVariants}
                  className={`mt-6 flex flex-col text-sm text-foreground/80 ${
                    (tier.features ?? []).length > 5 ? "gap-2.5" : "gap-3"
                  }`}
                >
                  {(tier.features ?? []).map((f, j) => (
                    <motion.li
                      key={j}
                      variants={featureItemVariants}
                      className="flex gap-2"
                    >
                      <span className="text-foreground/40" aria-hidden>
                        •
                      </span>
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.a
                  variants={ctaAppearVariants}
                  href={tier.ctaHref ?? "#contact"}
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium ${
                    tier.highlighted
                      ? "bg-acg-red text-white hover:bg-red-800"
                      : "border border-acg-blue bg-transparent text-acg-blue hover:bg-acg-blue/10"
                  }`}
                  whileHover={{ scale: 1.02, transition: springHover }}
                  whileTap={{ scale: 0.98, transition: springHover }}
                >
                  {tier.ctaLabel ?? "Почати"}
                </motion.a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
