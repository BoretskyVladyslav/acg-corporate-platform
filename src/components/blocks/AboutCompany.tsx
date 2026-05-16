"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import {
  LANDING_CARD_BASE,
  LANDING_CARD_BODY,
  LANDING_CARD_HOVER,
  LANDING_CARD_PADDING,
  LANDING_SECTION_EYEBROW,
  LANDING_SECTION_H2_SIZE,
  LANDING_SECTION_SHELL,
} from "@/src/lib/landingSectionRhythm";

export interface AboutCompanyProps {
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
  const digitsPlusRest = trimmed.match(/^(\d+)\+\s+(.+)/);
  if (digitsPlusRest) {
    return { figure: `${digitsPlusRest[1]}+`, caption: digitsPlusRest[2].trim() };
  }
  const pctRest = trimmed.match(/^(\d+)%\s*(.+)/);
  if (pctRest) {
    return { figure: `${pctRest[1]}%`, caption: pctRest[2].trim() };
  }
  const digitSpaceWord = trimmed.match(/^(\d+)\s+(.+)/);
  if (digitSpaceWord) {
    return { figure: digitSpaceWord[1], caption: digitSpaceWord[2].trim() };
  }
  return { figure: trimmed, caption: "" };
}

/** Одне поле тексту або явна пара «Значення + Підпис» з CMS. */
function resolveMetricPresentation(
  m: NonNullable<AboutCompanyProps["metrics"]>[number],
) {
  const labelLine = typeof m.label === "string" ? m.label.trim() : "";
  const valueLine = typeof m.value === "string" ? m.value.trim() : "";

  if (labelLine && valueLine) {
    return { figure: valueLine, caption: labelLine };
  }
  if (valueLine) {
    const split = splitMetricFigure(valueLine);
    return { figure: split.figure, caption: split.caption.trim() };
  }
  const splitLabel = splitMetricFigure(labelLine);
  return { figure: splitLabel.figure, caption: splitLabel.caption.trim() };
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
  eyebrow,
  heading,
  body,
  metrics,
}: AboutCompanyProps) {
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
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
      id="about"
      aria-labelledby="about-heading"
      className="bg-slate-50 text-foreground"
    >
      <motion.div
        className={LANDING_SECTION_SHELL}
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOpts}
      >
        <motion.p
          variants={itemVariants}
          className={LANDING_SECTION_EYEBROW}
        >
          {displayEyebrow}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-3 flex gap-6 sm:mt-4 md:gap-8">
          <div
            className="mt-1 hidden h-[40px] w-px shrink-0 bg-foreground/12 sm:block"
            aria-hidden
          />
          <h2
            id="about-heading"
            className={`${LANDING_SECTION_H2_SIZE} max-w-2xl text-acg-blue`}
          >
            {displayHeading}
          </h2>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-3xl text-lg leading-relaxed whitespace-pre-line text-acg-body sm:mt-8 sm:pl-[calc(1px+1.5rem)] md:mt-10"
        >
          {displayBody}
        </motion.p>

        <motion.div
          variants={metricsRevealVariants}
          role="list"
          aria-label="Ключові показники"
          className="mt-10 grid min-w-0 grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-5 sm:gap-y-5 md:mt-12 md:gap-x-8 md:gap-y-10 lg:mt-14 lg:grid-cols-3 lg:gap-x-10"
        >
          {resolvedMetrics.slice(0, 3).map((m, i) => {
            const { figure, caption } = resolveMetricPresentation(m);

            return (
              <motion.article
                key={`${figure}__${caption}__${i}`}
                role="listitem"
                variants={itemVariants}
                className={`min-w-0 overflow-hidden ${LANDING_CARD_BASE} ${LANDING_CARD_HOVER} ${LANDING_CARD_PADDING} ${i === 2 ? "max-md:col-span-2 max-md:mx-auto max-md:w-full max-md:max-w-[min(100%,17.5rem)]" : ""}`}
              >
                <div className="flex min-w-0 flex-col gap-2 sm:gap-2.5 md:gap-3">
                  <p className="break-words text-[1.35rem] font-bold leading-[1.12] tracking-tight text-acg-blue sm:text-[2rem] lg:text-[2.25rem]">
                    {figure}
                  </p>
                  {caption ? (
                    <p className={LANDING_CARD_BODY}>
                      {caption}
                    </p>
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
