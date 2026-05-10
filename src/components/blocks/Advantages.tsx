import { BadgeCheck, Shield, Sparkles } from "lucide-react";

export interface AdvantageItem {
  title?: string;
  description?: string;
}

export interface AdvantagesProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items?: AdvantageItem[];
}

const icons = [Sparkles, Shield, BadgeCheck] as const;

const defaultItems: AdvantageItem[] = [
  {
    title: "Досвідена команда",
    description:
      "Працюємо з ФОП різних груп та надаємо перевірені юридичні та бухгалтерські рішення.",
  },
  {
    title: "Прозорий процес",
    description:
      "Чіткі етапи супроводу, передбачувані терміни та зрозуміла комунікація без зайвої бюрократії.",
  },
  {
    title: "Індивідуальний підхід",
    description:
      "Підбираємо формат співпраці під ваші цілі й масштаб бізнесу, без шаблонних рішень.",
  },
];

export default function Advantages({
  eyebrow = "Переваги",
  heading = "Чому обирають нас",
  intro = "Наші ключові переваги",
  items = defaultItems,
}: AdvantagesProps) {
  return (
    <section
      aria-labelledby="advantages-heading"
      className="border-y border-foreground/10 bg-white text-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
          {eyebrow}
        </p>
        <h2
          id="advantages-heading"
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-acg-blue sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75">
          {intro}
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li
                key={i}
                className="flex flex-col gap-3 rounded-3xl border-transparent bg-white p-6 shadow-lg shadow-acg-blue/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-acg-blue/20 bg-acg-blue/5">
                  <Icon className="h-5 w-5 text-acg-blue" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-acg-blue">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/75">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
