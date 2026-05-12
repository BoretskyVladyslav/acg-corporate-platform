"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export interface TrustQuote {
  quote?: string;
  author?: string;
  role?: string;
}

export interface TrustLogo {
  name?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface TrustBlockProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  logosSectionTitle?: string;
  quotes?: TrustQuote[];
  logos?: TrustLogo[];
  googleRatingScore?: string;
  googleReviewsLabel?: string;
}

const defaultQuotes: TrustQuote[] = [
  {
    author: "Nataliia Melnychenko",
    quote:
      "Чудовий сервіс для ФОПів, працівники компанії завжди на зв'язку.",
  },
  {
    author: "Олександр",
    quote:
      "Професійний підхід до ведення бухгалтерії. Зняли з мене весь головний біль щодо податків.",
  },
  {
    author: "Ірина",
    quote:
      "Працюємо вже більше року, жодних нарікань. Швидко, чітко, прозоро.",
  },
  {
    author: "Марія",
    quote:
      "Зручний кабінет і зрозумілі звіти. Рекомую всім, хто цінує час і спокій.",
  },
];

const cardListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function GoogleGlyphCompact({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="fill-yellow-400"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.2-6.2 7.2-11.3 7.2-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.9 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"
      />
      <path
        className="fill-red-500"
        d="m6.3 14.7 6.6 4.8C14.4 15 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.9 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        className="fill-green-600"
        d="M24 44c5.4 0 10.3-2 14-5.3l-6.5-5.5c-2 1.4-4.5 2.3-7.5 2.3-5 0-9.3-3.2-10.8-7.6l-6.6 5.1C9.8 39.2 16.5 44 24 44z"
      />
      <path
        className="fill-blue-600"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.1-2.2 3.9-4 5.1l.1-.1 6.5 5.5c-.5.4-1 .8-1.5 1.2 2.5-1.8 4.5-4.3 5.7-7.3l.3-1.3c.4-1.3.6-2.7.6-4.1 0-1.4-.2-2.7-.5-4z"
      />
    </svg>
  );
}

function GoogleRatingBadge({
  score,
  reviewsLabel,
}: {
  score: string;
  reviewsLabel: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full border border-acg-border bg-white px-4 py-2 shadow-sm ring-1 ring-foreground/[0.03]"
      role="status"
    >
      <GoogleGlyphCompact className="size-5 shrink-0" aria-hidden />
      <p className="text-sm font-medium tracking-tight text-foreground/85">
        <span className="text-foreground/55">Рейтинг Google</span>{" "}
        <span className="tabular-nums text-foreground">{score}</span>
        <span className="text-foreground/35"> / </span>
        <span className="font-normal text-foreground/70">{reviewsLabel}</span>
      </p>
    </div>
  );
}

function ReviewStars({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-label="5 з 5 зірок"
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-3 fill-yellow-400 text-yellow-400"
          strokeWidth={0}
          aria-hidden
        />
      ))}
    </div>
  );
}

function quoteInitial(author: string | undefined, quote: string | undefined) {
  const a = author?.trim();
  if (a) return a.slice(0, 1).toUpperCase();
  const q = quote?.trim();
  if (q) return q.slice(0, 1).toUpperCase();
  return "?";
}

function normalizeQuote(row: TrustQuote): {
  authorLabel: string;
  body: string;
} {
  const raw = row.quote?.trim() ?? "";
  const named = row.author?.trim();
  if (named && raw) return { authorLabel: named, body: raw };
  const m = raw.match(/^([^:]+):\s*([\s\S]+)$/);
  if (m) return { authorLabel: m[1].trim(), body: m[2].trim() };
  return { authorLabel: "Клієнт", body: raw };
}

export default function TrustBlock({
  eyebrow = "Довіра",
  heading = "Відгуки клієнтів",
  intro = "Що про нас кажуть підприємці",
  logosSectionTitle = "Логотипи партнерів",
  quotes,
  logos,
  googleRatingScore = "4.9",
  googleReviewsLabel = "107 відгуків",
}: TrustBlockProps) {
  const filteredQuotes =
    quotes?.filter((q) => Boolean(q.quote?.trim())) ?? [];
  const resolvedQuotes =
    filteredQuotes.length > 0 ? filteredQuotes : defaultQuotes;

  const filteredLogos =
    logos?.filter(
      (row) => Boolean(row.name?.trim()) || Boolean(row.imageUrl?.trim()),
    ) ?? [];

  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="bg-acg-light text-foreground"
    >
      <motion.div
        className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:py-32"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
            {eyebrow}
          </p>
          <h2
            id="trust-heading"
            className="mt-3 text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
          >
            {heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/75">
            {intro}
          </p>
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1] as const,
              delay: 0.05,
            }}
          >
            <GoogleRatingBadge
              score={googleRatingScore}
              reviewsLabel={googleReviewsLabel}
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={cardListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {resolvedQuotes.map((q, i) => {
            const { authorLabel, body } = normalizeQuote(q);
            const initial = quoteInitial(
              q.author ?? authorLabel,
              body,
            );
            return (
              <motion.article
                key={`${authorLabel}-${i}`}
                variants={cardItemVariants}
                className="flex flex-col rounded-2xl border-[0.5px] border-acg-border bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-7"
              >
                <header className="flex gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-acg-blue/10 text-sm font-medium text-acg-blue"
                    aria-hidden
                  >
                    {initial}
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {authorLabel}
                    </p>
                    <ReviewStars className="mt-1 flex gap-0.5" />
                    {q.role?.trim() ? (
                      <p className="mt-0.5 text-xs text-foreground/50">
                        {q.role.trim()}
                      </p>
                    ) : null}
                  </div>
                </header>
                <p className="mt-4 text-left text-sm leading-relaxed text-acg-body">
                  {body}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        {filteredLogos.length > 0 ? (
          <div className="mt-16 border-t border-foreground/10 pt-10">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
              {logosSectionTitle}
            </p>
            <motion.ul
              className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8"
              variants={cardListVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {filteredLogos.map((logo, i) => (
                <motion.li key={i} variants={cardItemVariants}>
                  {logo.imageUrl ? (
                    <Image
                      src={logo.imageUrl}
                      alt={
                        logo.imageAlt?.trim() ||
                        logo.name?.trim() ||
                        "Логотип партнера"
                      }
                      width={160}
                      height={40}
                      className="h-8 w-auto object-contain opacity-85"
                      unoptimized
                    />
                  ) : (
                    <span className="inline-flex h-9 min-w-[5.5rem] animate-pulse items-center justify-center rounded-lg bg-acg-border/50 px-4 text-xs font-medium tracking-wide text-foreground/45">
                      {logo.name?.trim()}
                    </span>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        ) : null}
      </motion.div>
    </section>
  );
}
