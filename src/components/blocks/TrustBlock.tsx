"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import Reviews from "@/src/components/blocks/Reviews";
import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import type { GoogleReviewItem } from "@/src/components/blocks/Reviews";

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

const DEFAULT_TRUST_EYEBROW = "Довіра";
const DEFAULT_TRUST_HEADING = "Відгуки клієнтів";
const DEFAULT_TRUST_INTRO = "Що про нас кажуть підприємці";
const DEFAULT_LOGOS_SECTION_TITLE = "Логотипи партнерів";
const DEFAULT_GOOGLE_SCORE = "4.9";
const DEFAULT_GOOGLE_REVIEWS_LABEL = "110 відгуків";
const DEFAULT_QUOTE_AUTHOR = "Клієнт";

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
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
  return { authorLabel: DEFAULT_QUOTE_AUTHOR, body: raw };
}

function mapTrustQuotesToReviews(quotes: TrustQuote[]): GoogleReviewItem[] {
  const datePool = [
    "січень 2025",
    "грудень 2024",
    "лютий 2025",
    "листопад 2024",
    "березень 2025",
  ];
  return quotes.map((q, i) => {
    const { authorLabel, body } = normalizeQuote(q);
    const nameSrc = q.author?.trim() || authorLabel;
    const initial =
      nameSrc.trim().slice(0, 1).toUpperCase() ||
      body.trim().slice(0, 1).toUpperCase() ||
      "?";
    return {
      id: `g-review-${i}-${nameSrc.replace(/\W/g, "").slice(0, 28) || "client"}`,
      authorName: authorLabel,
      authorInitial: initial,
      text: body,
      date: datePool[i % datePool.length] ?? "2025",
      rating: 5 as const,
    };
  });
}

const logoListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const logoItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const logoListVariantsMobile = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const logoItemVariantsMobile = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
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

export default function TrustBlock({
  eyebrow,
  heading,
  intro,
  logosSectionTitle,
  quotes,
  logos,
  googleRatingScore,
  googleReviewsLabel,
}: TrustBlockProps) {
  const displayEyebrow = textOr(eyebrow, DEFAULT_TRUST_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_TRUST_HEADING);
  const displayIntro = textOr(intro, DEFAULT_TRUST_INTRO);
  const displayLogosTitle = textOr(
    logosSectionTitle,
    DEFAULT_LOGOS_SECTION_TITLE,
  );
  const displayGoogleScore = textOr(googleRatingScore, DEFAULT_GOOGLE_SCORE);
  const displayGoogleReviewsLabel = textOr(
    googleReviewsLabel,
    DEFAULT_GOOGLE_REVIEWS_LABEL,
  );
  const filteredQuotes =
    quotes?.filter((q) => Boolean(q.quote?.trim())) ?? [];
  const reviewsFromCms =
    filteredQuotes.length > 0
      ? mapTrustQuotesToReviews(filteredQuotes)
      : undefined;

  const filteredLogos =
    logos?.filter(
      (row) => Boolean(row.name?.trim()) || Boolean(row.imageUrl?.trim()),
    ) ?? [];

  const isMdUp = useIsMdUp();

  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="overflow-x-hidden bg-acg-light text-foreground"
    >
      <motion.div
        className="mx-auto max-w-6xl overflow-x-hidden px-4 py-24 sm:px-6 sm:py-28 lg:py-32"
        initial={
          isMdUp ? { opacity: 0, y: 28 } : { opacity: 0, y: 10 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: isMdUp ? 0.65 : 0.4,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
            {displayEyebrow}
          </p>
          <h2
            id="trust-heading"
            className="mt-3 text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
          >
            {displayHeading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/75">
            {displayIntro}
          </p>
          <motion.div
            className="mt-8 flex justify-center"
            initial={isMdUp ? { opacity: 0, y: 12 } : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: isMdUp ? 0.5 : 0.36,
              ease: [0.22, 1, 0.36, 1] as const,
              delay: isMdUp ? 0.05 : 0,
            }}
          >
            <GoogleRatingBadge
              score={displayGoogleScore}
              reviewsLabel={displayGoogleReviewsLabel}
            />
          </motion.div>
        </div>

        <Reviews items={reviewsFromCms} />

        {filteredLogos.length > 0 ? (
          <div className="mt-16 border-t border-foreground/10 pt-10">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
              {displayLogosTitle}
            </p>
            <motion.ul
              className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8"
              variants={isMdUp ? logoListVariants : logoListVariantsMobile}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {filteredLogos.map((logo, i) => (
                <motion.li
                  key={i}
                  variants={isMdUp ? logoItemVariants : logoItemVariantsMobile}
                >
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
