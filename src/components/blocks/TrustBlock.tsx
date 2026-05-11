"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export interface TrustQuote {
  quote?: string;
  author?: string;
  role?: string;
}

export interface TrustLogo {
  name?: string;
  /** Optional image URL from Sanity image builder */
  imageUrl?: string;
}

export interface TrustBlockProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  quotes?: TrustQuote[];
  logos?: TrustLogo[];
}

const defaultQuotes: TrustQuote[] = [
  {
    quote:
      "Професійний супровід і зрозумілі пояснення: звітність здана вчасно, без зайвих клопотів.",
    author: "Прізвище І.",
    role: "Підприємець, сфера послуг",
  },
  {
    quote:
      "Швидка комунікація та впевненість у документах — рекомендую колегам, які ведуть ФОП.",
    author: "Прізвище О.",
    role: "ФОП, торгівля",
  },
];

const defaultLogos: TrustLogo[] = [
  { name: "Клієнт" },
  { name: "Клієнт" },
  { name: "Клієнт" },
  { name: "Клієнт" },
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

export default function TrustBlock({
  eyebrow = "Довіра",
  heading = "Відгуки клієнтів",
  intro = "Що про нас кажуть підприємці",
  quotes = defaultQuotes,
  logos = defaultLogos,
}: TrustBlockProps) {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
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
          id="trust-heading"
          className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/75">
          {intro}
        </p>

        <motion.div
          className="mt-12 grid gap-8 lg:gap-10 lg:grid-cols-2"
          variants={cardListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {quotes.map((q, i) => (
            <motion.blockquote
              key={i}
              variants={cardItemVariants}
              className="rounded-3xl border-transparent bg-white p-8 shadow-lg shadow-acg-blue/5 sm:p-10"
            >
              <p className="text-base leading-relaxed text-foreground/90">
                “{q.quote}”
              </p>
              <footer className="mt-4 text-sm text-foreground/60">
                <cite className="not-italic font-medium text-acg-blue">
                  {q.author}
                </cite>
                {q.role ? <span className="block">{q.role}</span> : null}
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>

        <div className="mt-14 border-t border-foreground/10 pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
            Логотипи партнерів
          </p>
          <motion.ul
            className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6"
            variants={cardListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {logos.map((logo, i) => (
              <motion.li
                key={i}
                variants={cardItemVariants}
                className="text-sm font-medium text-foreground/45"
              >
                {logo.imageUrl ? (
                  <Image
                    src={logo.imageUrl}
                    alt={logo.name ?? "Логотип клієнта"}
                    width={160}
                    height={40}
                    className="h-8 w-auto object-contain opacity-80"
                    unoptimized
                  />
                ) : (
                  <span>{logo.name}</span>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
