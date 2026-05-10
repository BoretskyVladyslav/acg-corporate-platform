export interface TrustQuote {
  quote?: string;
  author?: string;
  role?: string;
}

import Image from "next/image";

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

export default function TrustBlock({
  eyebrow = "Довіра",
  heading = "Відгуки клієнтів",
  intro = "Що про нас кажуть підприємці",
  quotes = defaultQuotes,
  logos = defaultLogos,
}: TrustBlockProps) {
  return (
    <section
      aria-labelledby="trust-heading"
      className="bg-acg-light text-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
          {eyebrow}
        </p>
        <h2
          id="trust-heading"
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-acg-blue sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75">
          {intro}
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {quotes.map((q, i) => (
            <blockquote
              key={i}
              className="rounded-3xl border-transparent bg-white p-6 shadow-lg shadow-acg-blue/5"
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
            </blockquote>
          ))}
        </div>

        <div className="mt-14 border-t border-foreground/10 pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
            Логотипи партнерів
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
            {logos.map((logo, i) => (
              <li
                key={i}
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
