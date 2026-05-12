"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

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
  eyebrow = "Переваги",
  heading = "Чому нас обирають",
  items,
  sideImageUrl,
  sideImageAlt,
}: AdvantagesProps) {
  const reduceMotionPreferred = useReducedMotion();
  const filteredItems =
    items?.filter(
      (row) => Boolean(row.title?.trim()) && Boolean(row.description?.trim()),
    ) ?? [];
  const resolvedItems =
    filteredItems.length > 0 ? filteredItems : DEFAULT_ADVANTAGES_ITEMS;

  const resolvedImageSrc =
    sideImageUrl?.trim() ? sideImageUrl : "/images/team-transparent.png";
  const resolvedImageAlt =
    sideImageAlt?.trim() ? sideImageAlt : "Команда ACG";

  const itemTransition = {
    duration: reduceMotionPreferred ? 0 : 0.56,
    ease: itemRevealEase,
  };

  return (
    <section
      id="advantages"
      aria-labelledby="advantages-heading"
      className="overflow-x-hidden bg-white text-foreground"
    >
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <div className="col-span-1 lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
            {eyebrow}
          </p>
          <h2
            id="advantages-heading"
            className="mt-3 bg-gradient-to-b from-acg-blue via-acg-blue to-acg-blue/80 bg-clip-text text-5xl font-black leading-[0.92] tracking-tighter text-transparent [background-clip:text] [-webkit-background-clip:text] lg:text-7xl"
          >
            {heading}
          </h2>
          <div className="relative isolate mt-10 lg:mt-12">
            <div
              className="pointer-events-none absolute left-[-14%] top-[6%] -z-10 h-[76%] w-[92%] rounded-[54%_46%_40%_60%] bg-gradient-to-tr from-acg-blue/[0.09] via-acg-light to-white blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-[4%] right-[-10%] -z-10 h-[58%] w-[74%] rounded-[42%_58%_52%_48%] bg-gradient-to-br from-white via-acg-blue/[0.05] to-acg-light opacity-90 blur-2xl"
              aria-hidden
            />
            <Image
              src={resolvedImageSrc}
              alt={resolvedImageAlt}
              width={900}
              height={700}
              priority
              className="relative z-[1] mt-0 h-auto w-full object-contain [filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.1))]"
            />
          </div>
        </div>

        <div className="col-span-1 flex flex-col lg:col-span-7 lg:min-h-0">
          {resolvedItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={
                reduceMotionPreferred
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={itemTransition}
              className={`py-12 ${i > 0 ? "border-t border-acg-border" : ""}`}
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
