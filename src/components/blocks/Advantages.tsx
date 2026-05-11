"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Shield, Sparkles } from "lucide-react";

export interface AdvantageItem {
  title?: string;
  description?: string;
}

export interface AdvantagesProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items?: AdvantageItem[];
}

const icons = [Sparkles, Shield, BadgeCheck] as const;

const defaultItems: AdvantageItem[] = [
  {
    title: "Досвідена команда",
    description:
      "Працюємо з ФОП різних груп та надаємо перевірені юридичні та бухгалтерські рішення.",
  },
  {
    title: "Прозорий процес",
    description:
      "Чіткі етапи супроводу, передбачувані терміни та зрозуміла комунікація без зайвої бюрократії.",
  },
  {
    title: "Індивідуальний підхід",
    description:
      "Підбираємо формат співпраці під ваші цілі й масштаб бізнесу, без шаблонних рішень.",
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

export default function Advantages({
  eyebrow = "Переваги",
  heading = "Чому обирають нас",
  intro = "Наші ключові переваги",
  items = defaultItems,
}: AdvantagesProps) {
  return (
    <section
      aria-labelledby="advantages-heading"
      className="border-y border-foreground/10 bg-white text-foreground"
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
          id="advantages-heading"
          className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/75">
          {intro}
        </p>
        <motion.ul
          className="mt-12 grid gap-8 sm:grid-cols-3 lg:gap-10"
          variants={cardListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.li
                key={i}
                variants={cardItemVariants}
                className="flex flex-col gap-3 rounded-3xl border-transparent bg-white p-8 shadow-lg shadow-acg-blue/5 sm:p-10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-acg-blue/20 bg-acg-blue/5">
                  <Icon className="h-5 w-5 text-acg-blue" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-acg-blue">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/75">
                  {item.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.div>
    </section>
  );
}
