"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import { useIsMdUp } from "@/src/hooks/useIsMdUp";

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

const DEFAULT_SERVICES_EYEBROW = "Послуги";
const DEFAULT_SERVICES_HEADING = "Бухгалтерія для ФОП";
const DEFAULT_SERVICES_INTRO =
  "Чотири напрями супроводу: три групи ЄП та загальна система оподаткування";

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

function mergeServiceItems(
  cms: ServiceItem[] | undefined,
  defaults: ServiceItem[],
): ServiceItem[] {
  if (!cms?.length) return defaults;
  return cms.map((item, i) => {
    const d = defaults[Math.min(i, defaults.length - 1)];
    return {
      title: textOr(item.title, d.title ?? ""),
      description: textOr(item.description, d.description ?? ""),
      note: textOr(item.note, d.note ?? ""),
    };
  });
}

const defaultItems: ServiceItem[] = [
  {
    title: "ФОП 1 група",
    description:
      "Дохід до 1 млн грн. Без найманих працівників. Облік доходів, звітність та консультації відповідно до першої групи ЄП.",
    note: "Спрощена система; наймані особи не залучаються.",
  },
  {
    title: "ФОП 2 група",
    description:
      "Дохід до 5 млн грн. До 10 найманих працівників. Операційний супровід, звітність і підтримка з ПРРО.",
    note: "Ліміти та штат у межах норм другої групи ЄП.",
  },
  {
    title: "ФОП 3 група",
    description:
      "Дохід до 7 млн грн. Без обмежень щодо найму працівників. ПДВ, документообіг та розширений бухгалтерський супровід.",
    note: "Третя група платників ЄП з повним супроводом операцій.",
  },
  {
    title: "Загальна система",
    description:
      "Повний облік та звітність для ФОП та юридичних осіб на загальній системі оподаткування: ПДВ, податок на прибуток, первинні документи.",
    note: "Індивідуальний масштаб послуг залежно від обороту та штату.",
  },
];

function splitDescriptionToLines(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const chunks = trimmed
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : `${s}.`));
  return chunks.length ? chunks : [trimmed];
}

const cardListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardItemVariantsMobile = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardListVariantsMobile = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0,
    },
  },
};

export default function Services({
  eyebrow,
  heading,
  intro,
  items,
}: ServicesProps) {
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
  const displayEyebrow = textOr(eyebrow, DEFAULT_SERVICES_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_SERVICES_HEADING);
  const displayIntro = textOr(intro, DEFAULT_SERVICES_INTRO);
  const resolvedItems = mergeServiceItems(items, defaultItems);

  const listVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
        : isMdUp
          ? cardListVariants
          : cardListVariantsMobile,
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
          ? cardItemVariants
          : cardItemVariantsMobile,
    [reduceMotionPreferred, isMdUp],
  );

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="border-y border-foreground/[0.07] bg-white text-foreground"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/45">
          {displayEyebrow}
        </p>
        <h2
          id="services-title"
          className="mt-5 max-w-4xl text-4xl font-light leading-[1.08] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06]"
        >
          {displayHeading}
        </h2>
        <p className="mt-7 max-w-2xl text-[1.0625rem] font-light leading-[1.75] text-foreground/65">
          {displayIntro}
        </p>
        <motion.ul
          className="mt-16 grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:mt-20 lg:gap-x-14 lg:gap-y-14"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {resolvedItems.map((item, i) => {
            const bullets = item.description
              ? splitDescriptionToLines(item.description)
              : [];
            const ordinal = String(i + 1).padStart(2, "0");

            return (
              <motion.li
                key={i}
                variants={itemVariants}
                className="group relative isolate flex h-full min-h-0 w-full overflow-hidden rounded-2xl border border-foreground/[0.08] bg-white p-10 shadow-none transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-11 lg:min-h-[19rem] lg:p-12 xl:p-14 hover:border-foreground/[0.14] hover:shadow-[0_24px_64px_-40px_rgba(15,23,42,0.18)]"
              >
                <span
                  className="pointer-events-none absolute -right-2 top-6 select-none font-extralight tabular-nums text-foreground/[0.055] text-[clamp(4.5rem,14vw,8.5rem)] leading-none tracking-[-0.04em] transition-opacity duration-500 group-hover:text-foreground/[0.07] sm:right-2 sm:top-8"
                  aria-hidden
                >
                  {ordinal}
                </span>
                <div className="pointer-events-none absolute left-0 top-10 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-foreground/12 via-foreground/6 to-transparent" />
                <div className="relative z-[1] flex min-h-0 flex-1 flex-col pl-8 sm:pl-9 lg:pl-10">
                  <h3 className="text-[1.375rem] font-normal leading-snug tracking-[-0.015em] text-foreground sm:text-2xl lg:text-[1.625rem] lg:leading-tight">
                    {item.title}
                  </h3>
                  {bullets.length ? (
                    <ul className="mt-6 flex flex-1 flex-col gap-3.5">
                      {bullets.map((line, j) => (
                        <li
                          key={j}
                          className="flex gap-3.5 text-[0.9375rem] font-light leading-[1.7] text-foreground/68"
                        >
                          <span
                            className="mt-[0.62rem] h-px w-3 shrink-0 bg-foreground/20"
                            aria-hidden
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.note ? (
                    <p className="mt-8 border-t border-foreground/[0.08] pt-6 text-[11px] font-normal uppercase tracking-[0.2em] text-foreground/40">
                      {item.note}
                    </p>
                  ) : null}
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
