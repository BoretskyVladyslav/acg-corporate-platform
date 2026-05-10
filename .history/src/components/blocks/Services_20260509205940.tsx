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
    title: "ФОП - 1 група",
    description:
      "Супровід реєстрації, звітність та базовий облік відповідно до вимог законодавства для першої групи.",
    note: "",
  },
  {
    title: "ФОП - 2 група",
    description:
      "Оптимізація податкового навантаження та повний документальний контроль для другої групи платників ЄП.",
    note: "",
  },
  {
    title: "ФОП - 3 група",
    description:
      "Складний облік для третьої групи з ПДВ: звітність, контроль платежів і консультації на кожному етапі.",
    note: "",
  },
];

export default function Services({
  eyebrow = "Послуги",
  heading = "Наші послуги",
  intro = "Комплексні рішення для вашого бізнесу",
  items = defaultItems,
}: ServicesProps) {
  return (
    <section
      aria-labelledby="services-heading"
      className="border-y border-foreground/10 bg-background text-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
          {eyebrow}
        </p>
        <h2
          id="services-heading"
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75">
          {intro}
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="rounded-2xl border border-foreground/10 p-6"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                {item.description}
              </p>
              {item.note ? (
                <p className="mt-4 text-xs text-foreground/50">{item.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
