export interface FaqItem {
  question?: string;
  answer?: string;
}

export interface FAQProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items?: FaqItem[];
  footerNote?: string;
  footerLinks?: Array<{ label?: string; href?: string }>;
}

const defaultItems: FaqItem[] = [
  {
    question: "Які документи потрібні для старту співпраці?",
    answer:
      "Перелік документів залежить від формату супроводу. На консультації уточнюємо вашу ситуацію й надаємо чіткий чекліст без зайвих кроків.",
  },
  {
    question: "Який строк підключення до супроводу?",
    answer:
      "Термін узгоджуємо індивідуально й фіксуємо його в договорі. Типові сценарії проходимо поетапно, щоб забезпечити якість із першого дня співпраці.",
  },
  {
    question: "Як узгоджується формат звітності та комунікації?",
    answer:
      "Формат ретельної звітності, канали звʼязку та регулярність нагадувань погоджуємо на старті. За потреби коригуємо процес узгоджено з вашим робочим графіком.",
  },
];

const defaultFooterLinks: NonNullable<FAQProps["footerLinks"]> = [
  { label: "Конфіденційність", href: "#" },
  { label: "Умови", href: "#" },
];

export default function FAQ({
  eyebrow = "FAQ",
  heading = "Популярні запитання",
  intro = "Відповіді на часті питання наших клієнтів",
  items = defaultItems,
  footerNote = "© {year} Назва компанії. Усі права захищені.",
  footerLinks = defaultFooterLinks,
}: FAQProps) {
  const year = new Date().getFullYear();
  const resolvedNote = footerNote.replace("{year}", String(year));

  return (
    <section
      aria-labelledby="faq-heading"
      className="bg-acg-light text-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
          {eyebrow}
        </p>
        <h2
          id="faq-heading"
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-acg-blue sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75">
          {intro}
        </p>

        <dl className="mt-12 space-y-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border-transparent bg-white p-6 shadow-lg shadow-acg-blue/5 sm:p-8"
            >
              <dt className="text-lg font-semibold text-acg-blue">
                {item.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-foreground/75">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>

        <footer className="mt-20 border-t border-foreground/10 pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground/55">{resolvedNote}</p>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {footerLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href ?? "#"}
                      className="text-acg-blue/80 underline-offset-4 hover:text-acg-blue hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </footer>
      </div>
    </section>
  );
}
