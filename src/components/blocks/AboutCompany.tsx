"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { useIsMdUp } from "@/src/hooks/useIsMdUp";

export interface AboutCompanyProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  metrics?: Array<{ label?: string; value?: string }>;
}

export const DEFAULT_ABOUT_METRICS: NonNullable<AboutCompanyProps["metrics"]> = [
  { value: "900+ клієнтів у різних сферах" },
  { value: "10+ років досвіду" },
  { value: "100% захист від штрафів" },
];

const DEFAULT_EYEBROW = "Про нас";
const DEFAULT_HEADING =
  "ВАШ НАДІЙНИЙ ПАРТНЕР У СВІТІ БУХГАЛТЕРІЇ ТА ПРАВА";
const DEFAULT_BODY =
  "Ми супроводжуємо вас на всіх етапах: від підготовки матеріалів до представлення ваших інтересів у податкових та інших органах. Наша мета — ваш юридичний та фінансовий спокій.";

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

function resolveAboutMetrics(
  metrics: AboutCompanyProps["metrics"],
): NonNullable<AboutCompanyProps["metrics"]> {
  const cleaned = metrics?.filter(
    (m) => Boolean(m?.label?.trim()) || Boolean(m?.value?.trim()),
  );
  if (!cleaned?.length) return DEFAULT_ABOUT_METRICS;
  return cleaned.slice(0, 3).map((m, i) => {
    const d = DEFAULT_ABOUT_METRICS[i] ?? DEFAULT_ABOUT_METRICS[2];
    return {
      label: textOr(m?.label, d?.label ?? ""),
      value: textOr(m?.value, d?.value ?? ""),
    };
  });
}

function splitMetricFigure(value: string): { figure: string; caption: string } {
  const trimmed = value.trim();
  const m = trimmed.match(/^(\d+(?:\+|%))\s+(.+)$/);
  if (m) {
    return { figure: m[1], caption: m[2].trim() };
  }
  return { figure: trimmed, caption: "" };
}

const sectionReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeUpItemMobile = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const sectionRevealMobile = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

const metricsGridRevealMobile = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

const metricsGridReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

export default function AboutCompany({
  id,
  eyebrow,
  heading,
  body,
  metrics,
}: AboutCompanyProps) {
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
  const resolvedId = id?.trim() ? id : "about";
  const displayEyebrow = textOr(eyebrow, DEFAULT_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_HEADING);
  const displayBody = textOr(body, DEFAULT_BODY);
  const resolvedMetrics = resolveAboutMetrics(metrics);

  const revealVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
        : isMdUp
          ? sectionReveal
          : sectionRevealMobile,
    [reduceMotionPreferred, isMdUp],
  );

  const metricsRevealVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
        : isMdUp
          ? metricsGridReveal
          : metricsGridRevealMobile,
    [reduceMotionPreferred, isMdUp],
  );

  const itemVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            hidden: { opacity: 1, y: 0 },
            visible: { opacity: 1, y: 0, transition: { duration: 0 } },
          }
        : isMdUp
          ? fadeUpItem
          : fadeUpItemMobile,
    [reduceMotionPreferred, isMdUp],
  );

  const viewportOpts = { once: true, amount: 0.22 } as const;

  return (
    <section
      id={resolvedId}
      aria-labelledby="about-heading"
      className="bg-acg-light text-foreground"
    >
      <motion.div
        className="mx-auto max-w-6xl px-6 py-24 sm:px-6 sm:py-28 lg:py-32"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOpts}
      >
        <motion.p
          variants={itemVariants}
          className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/55"
        >
          {displayEyebrow}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10 flex gap-6 md:mt-12 md:gap-8">
          <div
            className="mt-1 hidden h-[40px] w-px shrink-0 bg-foreground/12 sm:block"
            aria-hidden
          />
          <h2
            id="about-heading"
            className="max-w-2xl text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
          >
            {displayHeading}
          </h2>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-10 max-w-3xl text-lg leading-relaxed text-acg-body sm:pl-[calc(1px+1.5rem)] md:mt-12"
        >
          {displayBody}
        </motion.p>

        <motion.div
          variants={metricsRevealVariants}
          role="list"
          aria-label="Ключові показники"
          className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-9 lg:mt-16 lg:grid-cols-3 lg:gap-10"
        >
          {resolvedMetrics.slice(0, 3).map((m, i) => {
            const labelLine = m?.label?.trim() ?? "";
            const valueLine = m?.value?.trim() ?? "";
            const primaryText = valueLine || labelLine;
            const { figure, caption } = splitMetricFigure(primaryText);
            const showSplit = Boolean(caption);

            return (
              <motion.article
                key={i}
                role="listitem"
                variants={itemVariants}
                className="rounded-3xl border border-white/20 bg-white/40 p-8 shadow-none backdrop-blur-md transition-[background-color,box-shadow] duration-500 ease-out hover:bg-white/55 hover:shadow-sm sm:p-10"
              >
                {labelLine && valueLine ? (
                  <p className="text-sm text-foreground/55">{labelLine}</p>
                ) : null}
                <div className={labelLine && valueLine ? "mt-2" : ""}>
                  {showSplit ? (
                    <>
                      <p className="text-2xl font-semibold tracking-tighter text-acg-blue sm:text-[1.65rem]">
                        {figure}
                      </p>
                      <p className="mt-2 text-base font-normal leading-snug tracking-normal text-foreground/70">
                        {caption}
                      </p>
                    </>
                  ) : (
                    <p className="text-2xl font-semibold tracking-tighter text-acg-blue sm:text-[1.65rem]">
                      {figure}
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
