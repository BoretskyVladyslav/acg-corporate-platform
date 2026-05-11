"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface AdvantageItem {
  title: string;
  description: string;
}

const ADVANTAGES_ITEMS: AdvantageItem[] = [
  {
    title: "ПРОЗОРЕ ЦІНОУТВОРЕННЯ",
    description:
      "Вартість послуг визначається відповідно до об'єму роботи в поточному місяці на підставі тарифів, закріплених у договорі. Все прозоро та зрозуміло.",
  },
  {
    title: "ТРИ РІВНЯ КОНТРОЛЮ",
    description:
      "Проводимо внутрішній аудит, в якому перевіряємо самі себе і унеможливлюємо настання негативних наслідків для вашого підприємства.",
  },
  {
    title: "ОПЕРАТИВНІСТЬ",
    description:
      "За вами буде закріплений окремий бухгалтер, який оперативно надає відповідь на ваші питання.",
  },
  {
    title: "ЮРИДИЧНИЙ ЗАХИСТ",
    description:
      "В нашому штаті працює команда юристів, яка допоможе в вирішенні будь-якої ситуації.",
  },
];

export default function Advantages() {
  return (
    <section
      id="advantages"
      aria-labelledby="advantages-heading"
      className="bg-white text-foreground"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
        <div className="col-span-1 h-fit pb-12 pt-24 lg:sticky lg:top-24 lg:col-span-5 lg:pb-0 lg:pt-32">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
            Переваги
          </p>
          <h2
            id="advantages-heading"
            className="mt-3 bg-gradient-to-b from-[#1a3a63] via-[#245494] to-[#1a3a63] bg-clip-text text-5xl font-black uppercase leading-[0.9] tracking-tighter text-transparent lg:text-7xl"
          >
            ЧОМУ НАС ОБИРАЮТЬ ?
          </h2>
          <Image
            src="/images/team-transparent.png"
            alt="Команда ACG"
            width={900}
            height={700}
            priority
            className="mt-12 h-auto w-full object-contain [filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.12))]"
          />
        </div>

        <div className="col-span-1 flex flex-col pb-24 pt-12 lg:col-span-7 lg:pb-[30vh] lg:pt-[40vh]">
          {ADVANTAGES_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mb-[25vh] last:mb-0"
            >
              <span className="mb-4 block text-5xl font-black text-acg-blue/75 sm:text-7xl sm:text-acg-blue/65">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-3xl font-bold text-acg-blue">{item.title}</h3>
              <p className="mt-4 text-xl leading-relaxed text-foreground/75">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
