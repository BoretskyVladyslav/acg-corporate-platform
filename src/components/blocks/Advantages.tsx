"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

import {
  LANDING_SECTION_EYEBROW,
  LANDING_SECTION_H2_GRADIENT,
  LANDING_SECTION_H2_SIZE,
} from "@/src/lib/landingSectionRhythm";

export interface AdvantageItem {
  title: string;
  description: string;
}

export interface AdvantagesProps {
  eyebrow?: string;
  heading?: string;
  items?: AdvantageItem[];
  sideImageUrl?: string;
  sideImageAlt?: string;
}

const DEFAULT_ADVANTAGES_EYEBROW = "Переваги";
const DEFAULT_ADVANTAGES_HEADING = "Чому нас обирають";
const DEFAULT_SIDE_IMAGE = "/images/team-transparent.png";
const DEFAULT_SIDE_IMAGE_ALT = "Команда ACG";

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

function mergeAdvantageItems(
  cms: AdvantageItem[] | undefined,
  defaults: AdvantageItem[],
): AdvantageItem[] {
  if (!cms?.length) return defaults;
  return cms.map((row, i) => {
    const d = defaults[Math.min(i, defaults.length - 1)];
    return {
      title: textOr(row.title, d.title),
      description: textOr(row.description, d.description),
    };
  });
}

const DEFAULT_ADVANTAGES_ITEMS: AdvantageItem[] = [
  {
    title: "Прозоре ціноутворення",
    description:
      "Вартість послуг визначається відповідно до об'єму роботи в поточному місяці на підставі тарифів, закріплених у договорі. Все прозоро та зрозуміло.",
  },
  {
    title: "Три рівні контролю",
    description:
      "Проводимо внутрішній аудит, в якому перевіряємо самі себе і унеможливлюємо настання негативних наслідків для вашого підприємства.",
  },
  {
    title: "Оперативність",
    description:
      "За вами буде закріплений окремий бухгалтер, який оперативно надає відповідь на ваші питання.",
  },
  {
    title: "Юридичний захист",
    description:
      "В нашому штаті працює команда юристів, яка допоможе в вирішенні будь-якої ситуації.",
  },
];

const ADVANTAGES_SECTION_SHELL =
  "mx-auto w-full min-w-0 max-w-7xl px-6 py-12 md:py-16 lg:px-8";

const advantageIndexOutlineStyle = {
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1px rgb(36 84 148)",
} as const;

const SECTION_ITEM_EASE_OUT = [0, 0, 0.2, 1] as const;

const SECTION_ITEM_TRANSITION = {
  duration: 0.5,
  ease: SECTION_ITEM_EASE_OUT,
} as const;

export default function Advantages({
  eyebrow,
  heading,
  items,
  sideImageUrl,
  sideImageAlt,
}: AdvantagesProps) {
  const reduceMotionPreferred = useReducedMotion();
  const displayEyebrow = textOr(eyebrow, DEFAULT_ADVANTAGES_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_ADVANTAGES_HEADING);
  const resolvedItems = mergeAdvantageItems(items, DEFAULT_ADVANTAGES_ITEMS);

  const resolvedImageSrc = textOr(sideImageUrl, DEFAULT_SIDE_IMAGE);
  const resolvedImageAlt = textOr(sideImageAlt, DEFAULT_SIDE_IMAGE_ALT);

  const containerVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            hidden: {},
            show: {
              transition: { staggerChildren: 0, delayChildren: 0 },
            },
          }
        : {
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15, delayChildren: 0 },
            },
          },
    [reduceMotionPreferred],
  );

  const listColumnVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            hidden: {},
            show: {
              transition: { staggerChildren: 0, delayChildren: 0 },
            },
          }
        : {
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15, delayChildren: 0 },
            },
          },
    [reduceMotionPreferred],
  );

  const itemVariants = useMemo(
    () =>
      reduceMotionPreferred
        ? {
            hidden: { opacity: 1, y: 0 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0 },
            },
          }
        : {
            hidden: { opacity: 0, y: 50 },
            show: {
              opacity: 1,
              y: 0,
              transition: SECTION_ITEM_TRANSITION,
            },
          },
    [reduceMotionPreferred],
  );

  return (
    <section
      id="advantages"
      aria-labelledby="advantages-heading"
      className="overflow-x-clip bg-white text-foreground"
    >
      <motion.div
        className={`${ADVANTAGES_SECTION_SHELL} relative grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8`}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          variants={itemVariants}
          className="col-span-1 flex min-h-0 flex-col lg:col-span-5 lg:h-full"
        >
          <div className="relative isolate w-full max-w-none min-w-0 shrink-0 break-words lg:sticky lg:top-32 lg:z-10 lg:flex lg:max-h-[calc(100dvh-8rem)] lg:min-h-0 lg:flex-col lg:self-start">
            <div className="shrink-0">
              <p className={LANDING_SECTION_EYEBROW}>
                {displayEyebrow}
              </p>
              <h2
                id="advantages-heading"
                className={`${LANDING_SECTION_H2_GRADIENT} ${LANDING_SECTION_H2_SIZE} mt-3`}
              >
                {displayHeading}
              </h2>
            </div>
            <div className="relative mt-6 min-h-0 w-full flex-1 overflow-x-clip lg:mt-8">
              <div
                className="pointer-events-none absolute left-[-14%] top-[6%] -z-10 h-[76%] w-[92%] rounded-[54%_46%_40%_60%] bg-gradient-to-tr from-acg-blue/[0.09] via-acg-light to-white blur-3xl max-lg:max-w-[110%]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-[4%] right-[-10%] -z-10 h-[58%] w-[74%] rounded-[42%_58%_52%_48%] bg-gradient-to-br from-white via-acg-blue/[0.05] to-acg-light opacity-90 blur-2xl max-lg:max-w-[110%]"
                aria-hidden
              />
              <Image
                src={resolvedImageSrc}
                alt={resolvedImageAlt}
                width={900}
                height={700}
                priority
                className="relative z-[1] mt-0 h-auto max-h-full min-h-0 w-full object-contain [filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.1))]"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={listColumnVariants}
          className="col-span-1 flex min-h-0 flex-col lg:col-span-7"
        >
          {resolvedItems.map((item, i) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className={`py-5 md:py-6 ${i > 0 ? "border-t border-acg-border" : ""}`}
            >
              <span
                style={advantageIndexOutlineStyle}
                className="mb-3 block text-5xl font-light tabular-nums opacity-[0.52] sm:text-6xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-3xl font-bold tracking-wide text-acg-blue">
                {item.title}
              </h3>
              <p className="mt-3 w-full text-xl leading-relaxed text-foreground/75">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
