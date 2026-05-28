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
  { value: "1000 +", label: "клієнтів", icon: Users },
  { value: "14", label: "років досвіду", icon: CalendarRange },
  { value: "50 +", label: "видів послуг", icon: Layers },
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

function resolveAboutMetrics(
  metrics: AboutCompanyProps["metrics"],
): AboutMetricConfig[] {
  /**
   * Якщо в Sanity є хоча б 1 метрик із value або label — використовуємо
   * дані з CMS (до 4), підставляючи іконки з дефолтного набору по позиції.
   * Якщо CMS порожній або не переданий — повертаємо повний набір дефолтів.
   */
  const filled = (metrics ?? []).filter(
    (m) => (m.value?.trim() ?? "") || (m.label?.trim() ?? ""),
  );
  if (!filled.length) return DEFAULT_ABOUT_METRICS;

  return filled.slice(0, 4).map((m, i) => ({
    value: m.value?.trim() ?? DEFAULT_ABOUT_METRICS[i]?.value ?? "",
    label: m.label?.trim() ?? DEFAULT_ABOUT_METRICS[i]?.label ?? "",
    icon: DEFAULT_ABOUT_METRICS[i]?.icon ?? Users,
  }));
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

/** Висота зони іконки — для вирівнювання пунктирної лінії по центру кілець. */
const METRIC_ICON_ZONE_CLASS =
  "relative z-10 mx-auto mb-4 flex size-[4.25rem] items-center justify-center sm:mb-5 sm:size-[4.75rem] md:size-20";

const METRIC_CONNECTOR_LINE_TOP =
  "top-[2.125rem] sm:top-[2.375rem] md:top-10";

function MetricIconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className={METRIC_ICON_ZONE_CLASS}>
      <div
        className="flex size-full items-center justify-center rounded-full border-2 border-r-transparent border-acg-blue bg-white shadow-sm"
        aria-hidden
      >
        <div className="flex size-[74%] items-center justify-center rounded-full border-2 border-r-transparent border-acg-blue/75 bg-white">
          <Icon
            className="size-5 text-acg-blue sm:size-[1.35rem] md:size-6"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
      </div>
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
            className={`pointer-events-none absolute left-[12.5%] right-[12.5%] z-0 border-t-2 border-dashed border-gray-200 ${METRIC_CONNECTOR_LINE_TOP}`}
            aria-hidden
          />

          <div className="relative z-[1] grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-x-4 md:gap-x-6 lg:gap-x-8">
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
                  <p className="text-2xl font-bold leading-none tracking-tight text-foreground sm:text-3xl md:text-[2rem] lg:text-[2.125rem]">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-xs leading-snug text-foreground/50 sm:text-sm">
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
