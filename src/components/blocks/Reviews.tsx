"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  LANDING_CARD_BASE,
  LANDING_CARD_BODY,
  LANDING_CARD_HOVER,
  LANDING_CARD_PADDING,
} from "@/src/lib/landingSectionRhythm";

export type GoogleReviewItem = {
  id: string;
  authorName: string;
  text: string;
  /** Кількість зірочок 1–5. */
  rating: number;
};

export const GOOGLE_REVIEWS_COUNT = 110;
export const GOOGLE_REVIEWS_URL =
  "https://maps.app.goo.gl/jkYbLAmDTHjdr4Lb6";

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

const reviewsData = [
  {
    id: 1,
    authorName: "Ivan Vysitskyi",
    text: "Скажу просто. 67 грн на день за бухгалтера і можливість отримати консультацію юриста — це супер.",
    rating: 5,
  },
  {
    id: 2,
    authorName: "Ірина Гураль",
    text: "Відкрила ФОП 3 група через ACG і тепер користуюсь їхнім бухгалтерським супроводом. Дуже зручно. Для мене це велика економія часу.",
    rating: 5,
  },
  {
    id: 3,
    authorName: "Марія Савченко",
    text: "Ми з чоловіком вирішили відкрити компанію (ТОВ) з пошиття жіночого одягу. Шукали нормального юриста і по рекомендації звернулися до ACG.",
    rating: 5,
  },
  {
    id: 4,
    authorName: "Петро Ісько",
    text: "Мав неприємний досвід із бухгалтером, який просто зник — виявляється, так буває )) Після цього вирішив працювати тільки офіційно, за договором, і з цією компанією.",
    rating: 5,
  },
  {
    id: 5,
    authorName: "Катерина Аврамишин",
    text: "Вже не перший рік з ACG — і кожного разу переконуюсь, що звернулась у правильну компанію. Професіоналізм, людяне ставлення, терпіння до всіх моїх “а якщо…” 😅",
    rating: 5,
  },
  {
    id: 6,
    authorName: "Victor _G",
    text: "Вже скоро 10 років, як співпрацюємо з АКГ. Професійна команда + якісний сервіс = багаторічна співпраця.",
    rating: 5,
  },
  {
    id: 7,
    authorName: "Rool. ik",
    text: "Уже рік ця компанія допомагає мені вільно працювати і не думати про бухгалтерські завдання. Все на вищому рівні, допомагають і в інших питаннях де потрібний юрист.",
    rating: 5,
  },
  {
    id: 8,
    authorName: "Анна Сильчук",
    text: "Дуже відповідальна компанія! Всі процеси під контролем, миттєво надають інформацію і вирішують любі питання, повʼязані з діяльністю.",
    rating: 5,
  },
];

const MIN_ITEMS_PER_ROW = 6;

const carouselReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * Один плоский масив відгуків із Sanity ділиться навпіл для двох рядів маркіза;
 * ярус у CMS не задається.
 */
function splitIntoTwoRows(
  items: GoogleReviewItem[],
): [GoogleReviewItem[], GoogleReviewItem[]] {
  if (items.length === 0) {
    return [[], []];
  }
  const mid = Math.ceil(items.length / 2);
  const top = items.slice(0, mid);
  let bottom = items.slice(mid);
  if (bottom.length === 0) {
    bottom = top.map((r, i) => ({
      ...r,
      id: `${r.id}-mirror-${i}`,
    }));
  }
  return [top, bottom];
}

/** Дублюємо вміст ряду, доки карток не буде достатньо для плавного marquee. */
function expandRowForMarquee(row: GoogleReviewItem[]): GoogleReviewItem[] {
  if (row.length === 0) return [];
  const out: GoogleReviewItem[] = [];
  let cycle = 0;
  while (out.length < MIN_ITEMS_PER_ROW) {
    for (let i = 0; i < row.length; i++) {
      const r = row[i];
      out.push({ ...r, id: `${r.id}-marquee-${cycle}-${i}` });
    }
    cycle++;
  }
  return out;
}

/** Обмежує оцінку для відображення зірок (1–5). */
function clampReviewRating(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 5;
  return Math.min(5, Math.max(1, Math.round(value)));
}

/** Як у Google Maps: зірка #F4B400 (amber). */
function GoogleStar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function GoogleGlyphButton({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.2-6.2 7.2-11.3 7.2-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.9 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.4 15 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.9 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2 14-5.3l-6.5-5.5c-2 1.4-4.5 2.3-7.5 2.3-5 0-9.3-3.2-10.8-7.6l-6.6 5.1C9.8 39.2 16.5 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.1-2.2 3.9-4 5.1l.1-.1 6.5 5.5c-.5.4-1 .8-1.5 1.2 2.5-1.8 4.5-4.3 5.7-7.3l.3-1.3c.4-1.3.6-2.7.6-4.1 0-1.4-.2-2.7-.5-4z"
      />
    </svg>
  );
}

export interface ReviewsProps {
  items?: GoogleReviewItem[];
  googleReviewsUrl?: string;
  googleReviewsCount?: number;
}

function ReviewCardGoogleStyle({ review }: { review: GoogleReviewItem }) {
  return (
    <article className="w-[320px] shrink-0 md:w-[400px]">
      <div
        className={`flex h-full flex-col ${LANDING_CARD_BASE} ${LANDING_CARD_HOVER} ${LANDING_CARD_PADDING}`}
      >
        <h3 className="text-left text-sm font-semibold leading-tight tracking-tight text-foreground">
          {review.authorName}
        </h3>
        <div
          className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5"
          aria-label={`Оцінка ${review.rating} з 5`}
          role="img"
        >
          <div className="flex items-center gap-px text-[#f4b400]">
            {Array.from({ length: review.rating }).map((_, i) => (
              <GoogleStar key={i} className="size-[14px]" />
            ))}
          </div>
        </div>
        <p className={`mt-3 text-left ${LANDING_CARD_BODY}`}>
          {review.text}
        </p>
      </div>
    </article>
  );
}

function InfiniteMarqueeRow({
  items,
  direction,
}: {
  items: GoogleReviewItem[];
  direction: "left" | "right";
}) {
  const trackClass =
    direction === "left"
      ? "reviews-marquee-track-left"
      : "reviews-marquee-track-right";

  return (
    <div className="overflow-hidden py-2">
      <div
        className={`group flex w-max gap-4 ${trackClass} hover:[animation-play-state:paused]`}
      >
        <div className="flex shrink-0 gap-4">
          {items.map((r) => (
            <ReviewCardGoogleStyle key={r.id} review={r} />
          ))}
        </div>
        <div className="flex shrink-0 gap-4" aria-hidden>
          {items.map((r) => (
            <ReviewCardGoogleStyle key={`${r.id}__loop`} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Reviews({
  items,
  googleReviewsUrl,
  googleReviewsCount,
}: ReviewsProps) {
  const resolvedUrl = textOr(googleReviewsUrl, GOOGLE_REVIEWS_URL);
  const resolvedCount =
    typeof googleReviewsCount === "number" &&
    Number.isFinite(googleReviewsCount) &&
    googleReviewsCount > 0
      ? googleReviewsCount
      : GOOGLE_REVIEWS_COUNT;

  const rawList = items?.length ? items : reviewsData;
  const list: GoogleReviewItem[] = rawList.map((r) => ({
    ...r,
    id: String(r.id),
    rating: clampReviewRating(r.rating),
  }));
  const reduceMotion = useReducedMotion();
  const [rawTop, rawBottom] = splitIntoTwoRows(list);
  const topRow = expandRowForMarquee(rawTop);
  const bottomRow = expandRowForMarquee(rawBottom);
  const ctaLabel = `Читати всі ${resolvedCount} відгуків на Google`;

  return (
    <motion.div
      className="mt-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={carouselReveal}
    >
      <div className="space-y-4 sm:space-y-5">
        {reduceMotion ? (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-center gap-4">
              {topRow.map((r) => (
                <ReviewCardGoogleStyle key={r.id} review={r} />
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {bottomRow.map((r) => (
                <ReviewCardGoogleStyle key={r.id} review={r} />
              ))}
            </div>
          </div>
        ) : (
          <div className="-mx-6 lg:-mx-8">
            <div aria-label="Відгуки клієнтів, верхній ряд">
              <InfiniteMarqueeRow items={topRow} direction="left" />
            </div>
            <div aria-label="Відгуки клієнтів, нижній ряд">
              <InfiniteMarqueeRow items={bottomRow} direction="right" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-center px-0 sm:mt-12">
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex max-w-full items-center justify-center gap-3 px-8 py-4 text-center text-base font-normal tracking-wide text-foreground sm:px-10 sm:py-5 ${LANDING_CARD_BASE} ${LANDING_CARD_HOVER}`}
        >
          <GoogleGlyphButton className="size-6 shrink-0 transition-transform duration-300 group-hover:scale-105 sm:size-7" />
          <span className="min-w-0 leading-snug">{ctaLabel}</span>
        </a>
      </div>
    </motion.div>
  );
}
