"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Layers,
  ShieldCheck,
  Users,
  type LucideIcon,
  CalendarRange,
} from "lucide-react";
import { useMemo } from "react";

import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import {
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

type AboutMetricConfig = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const DEFAULT_ABOUT_METRICS: AboutMetricConfig[] = [
  { value: "900+", label: "клієнтів", icon: Users },
  { value: "10+", label: "років досвіду", icon: CalendarRange },
  { value: "100%", label: "звітність", icon: Layers },
  { value: "3", label: "рівні контролю", icon: ShieldCheck },
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

function resolveMetricPresentation(
  m: { label?: string; value?: string },
  fallback: AboutMetricConfig,
): AboutMetricConfig {
  const labelLine = typeof m.label === "string" ? m.label.trim() : "";
  const valueLine = typeof m.value === "string" ? m.value.trim() : "";

  if (labelLine && valueLine) {
    return { value: valueLine, label: labelLine, icon: fallback.icon };
  }
  if (valueLine) {
    const split = splitMetricFigure(valueLine);
    return {
      value: split.figure,
      label: split.caption.trim() || fallback.label,
      icon: fallback.icon,
    };
  }
  if (labelLine) {
    const split = splitMetricFigure(labelLine);
    return {
      value: split.figure,
      label: split.caption.trim() || fallback.label,
      icon: fallback.icon,
    };
  }
  return fallback;
}

function resolveAboutMetrics(
  metrics: AboutCompanyProps["metrics"],
): AboutMetricConfig[] {
  const cleaned = metrics?.filter(
    (m) => Boolean(m?.label?.trim()) || Boolean(m?.value?.trim()),
  );
  if (!cleaned?.length) return DEFAULT_ABOUT_METRICS;

  return DEFAULT_ABOUT_METRICS.map((fallback, index) => {
    const cmsMetric = cleaned[index];
    if (!cmsMetric) return fallback;
    return resolveMetricPresentation(cmsMetric, fallback);
  });
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

function MetricIconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative z-10 mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-acg-blue/25 bg-slate-50 shadow-sm ring-4 ring-slate-50 sm:mb-4 sm:size-14 md:size-16">
      <Icon
        className="size-5 text-acg-blue sm:size-[1.35rem] md:size-6"
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  );
}

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
        <motion.p variants={itemVariants} className={LANDING_SECTION_EYEBROW}>
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
          className="relative mt-10 md:mt-14"
        >
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 border-t border-dashed border-acg-blue/35 sm:top-7 md:top-8"
            aria-hidden
          />

          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {resolvedMetrics.map((metric, i) => {
              const Icon = metric.icon;

              return (
                <motion.article
                  key={`${metric.value}__${metric.label}__${i}`}
                  role="listitem"
                  variants={itemVariants}
                  className="relative flex min-w-0 flex-col items-center px-0.5 text-center sm:px-1"
                >
                  <MetricIconBadge icon={Icon} />
                  <p className="text-xl font-bold leading-none tracking-tight text-acg-blue sm:text-3xl md:text-[2rem] lg:text-[2.125rem]">
                    {metric.value}
                  </p>
                  <p className="mt-1.5 text-[0.6875rem] leading-snug text-foreground/50 sm:mt-2 sm:text-sm">
                    {metric.label}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
