"use client";

import { motion, useReducedMotion } from "framer-motion";

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

export default function Services({
  eyebrow = "Послуги",
  heading = "Бухгалтерія для ФОП",
  intro =
    "Чотири напрями супроводу: три групи ЄП та загальна система оподаткування",
  items,
}: ServicesProps) {
  const reduceMotionPreferred = useReducedMotion();
  const resolvedItems = items?.length ? items : defaultItems;

  const listVariants = reduceMotionPreferred
    ? { hidden: {}, visible: { transition: { staggerChildren: 0 } } }
    : cardListVariants;

  const itemVariants = reduceMotionPreferred
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0 } },
      }
    : cardItemVariants;

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="border-y border-foreground/10 bg-white text-foreground"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-6 sm:py-28 lg:py-32">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
          {eyebrow}
        </p>
        <h2
          id="services-title"
          className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-acg-blue sm:text-5xl lg:text-6xl"
        >
          {heading}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground/75">
          {intro}
        </p>
        <motion.ul
          className="mt-14 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-9 lg:grid-cols-4 lg:gap-12 xl:gap-14"
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
                className="relative isolate h-full w-full overflow-hidden rounded-3xl border-[0.5px] border-acg-border bg-gradient-to-br from-white to-acg-surface-subtle/50 p-8 shadow-[0_8px_30px_-18px_rgba(36,84,148,0.08)] transition-[border-color,box-shadow] duration-300 ease-out hover:border-acg-blue/30 hover:shadow-[0_14px_44px_-22px_rgba(36,84,148,0.14)] sm:p-9 lg:p-8 xl:p-10"
              >
                <span
                  className="pointer-events-none absolute right-3 top-2 select-none font-light tabular-nums text-acg-light text-[clamp(3.5rem,12vw,5.5rem)] leading-none tracking-tighter sm:right-4 sm:top-3"
                  aria-hidden
                >
                  {ordinal}
                </span>
                <div className="relative z-[1] flex h-full flex-col">
                  <h3 className="text-lg font-medium tracking-[0.06em] text-acg-blue">
                    {item.title}
                  </h3>
                  {bullets.length ? (
                    <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                      {bullets.map((line, j) => (
                        <li
                          key={j}
                          className="flex gap-2.5 text-sm leading-relaxed text-foreground/75"
                        >
                          <span
                            className="mt-[0.55em] h-px w-2 shrink-0 bg-acg-blue/35"
                            aria-hidden
                          />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.note ? (
                    <p className="mt-5 text-xs italic leading-loose text-foreground/45">
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
