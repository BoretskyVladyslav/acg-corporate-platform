"use client";

import { motion } from "framer-motion";

export interface ServiceItem {
  title?: string;
  description?: string;
  note?: string;
}

export interface ServicesProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items?: ServiceItem[];
}

const defaultItems: ServiceItem[] = [
  {
    title: "ФОП - 1 група",
    description:
      "Супровід з обліку та звітності згідно з вимогами для першої групи спрощеної системи.",
    note: "Дані з CMS або уточнення для клієнта",
  },
  {
    title: "ФОП - 2 група",
    description:
      "Операційна підтримка, звітність і консультації для другої групи платників ЄП.",
    note: "Дані з CMS або уточнення для клієнта",
  },
  {
    title: "ФОП - 3 група",
    description:
      "Повний супровід ПДВ, документообігу та складніших облікових сценаріїв для третьої групи.",
    note: "Дані з CMS або уточнення для клієнта",
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

export default function Services({
  eyebrow = "Послуги",
  heading = "Наші послуги",
  intro = "Комплексні рішення для вашого бізнесу",
  items = defaultItems,
}: ServicesProps) {
  return (
    <section
      aria-labelledby="services-heading"
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
          id="services-heading"
          className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/75">
          {intro}
        </p>
        <motion.ul
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
          variants={cardListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {items.map((item, i) => (
            <motion.li
              key={i}
              variants={cardItemVariants}
              className="rounded-3xl border-transparent bg-white p-8 shadow-lg shadow-acg-blue/5 sm:p-10"
            >
              <h3 className="text-lg font-semibold text-acg-blue">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                {item.description}
              </p>
              {item.note ? (
                <p className="mt-4 text-xs text-foreground/50">{item.note}</p>
              ) : null}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
