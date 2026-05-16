"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import {
  LANDING_SECTION_EYEBROW,
  LANDING_SECTION_H2_GRADIENT,
  LANDING_SECTION_H2_SIZE,
  LANDING_SECTION_SHELL,
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

const advantageIndexOutlineStyle = {
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1px rgb(36 84 148)",
} as const;

const itemRevealEase = [0.22, 1, 0.36, 1] as const;

export default function Advantages({
  eyebrow,
  heading,
  items,
  sideImageUrl,
  sideImageAlt,
}: AdvantagesProps) {
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
  const displayEyebrow = textOr(eyebrow, DEFAULT_ADVANTAGES_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_ADVANTAGES_HEADING);
  const resolvedItems = mergeAdvantageItems(items, DEFAULT_ADVANTAGES_ITEMS);

  const resolvedImageSrc = textOr(sideImageUrl, DEFAULT_SIDE_IMAGE);
  const resolvedImageAlt = textOr(sideImageAlt, DEFAULT_SIDE_IMAGE_ALT);

  const itemTransition = {
    duration:
      reduceMotionPreferred ? 0 : isMdUp ? 0.56 : 0.38,
    ease: itemRevealEase,
  };

  const itemInitial =
    reduceMotionPreferred
      ? { opacity: 1, y: 0 }
      : isMdUp
        ? { opacity: 0, y: 20 }
        : { opacity: 0, y: 10 };

  return (
    <section
      id="advantages"
      aria-labelledby="advantages-heading"
      className="overflow-x-clip bg-white text-foreground"
    >
      <div className={`${LANDING_SECTION_SHELL} relative grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12`}>
        <div className="col-span-1 flex min-h-0 flex-col lg:col-span-5 lg:h-full">
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
            <div className="relative mt-10 min-h-0 w-full flex-1 overflow-x-clip lg:mt-12">
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
        </div>

        <div className="col-span-1 flex min-h-0 flex-col lg:col-span-7">
          {resolvedItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={itemInitial}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={itemTransition}
              className={`py-8 ${i > 0 ? "border-t border-acg-border" : ""}`}
            >
              <span
                style={advantageIndexOutlineStyle}
                className="mb-5 block text-5xl font-light tabular-nums opacity-[0.52] sm:text-6xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-3xl font-bold tracking-wide text-acg-blue">
                {item.title}
              </h3>
              <p className="mt-5 max-w-2xl text-xl leading-relaxed text-foreground/75">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
