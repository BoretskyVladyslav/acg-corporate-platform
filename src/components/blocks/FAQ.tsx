"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Plus } from "lucide-react";
import { useCallback, useId, useState } from "react";

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
    question: "Як відбувається співпраця (якщо я в іншому місті)?",
    answer:
      "Ми працюємо дистанційно по всій Україні. Наш офіс знаходиться в Києві, якщо є необхідність, то можемо призначити зустріч в Києві. Обмін документами відбувається через сервіс електронного документообігу 'Вчасно' або Новою поштою.",
  },
  {
    question: "Що робити, якщо прийде податкова перевірка?",
    answer:
      "Ми супроводжуємо вас на всіх етапах: від підготовки відповідей на запити контролюючих органів до представництва ваших інтересів у податковій нашими юристами та бухгалтерами.",
  },
  {
    question: "Чи маєте ви досвід роботи саме з моєю сферою діяльності?",
    answer:
      "Ми обслуговуємо понад 900 клієнтів з різних сфер бізнесу: від IT та фрілансу до роздрібної торгівлі та виробництва. Ми закріплюємо за вами фахівця, який найкраще розуміє специфіку саме вашого виду діяльності.",
  },
  {
    question: "Як швидко я буду отримувати відповіді на свої запитання?",
    answer:
      "Ми на зв’язку в робочий час. За вами закріплюється особистий бухгалтер, який надає відповіді оперативно, щоб ви могли приймати рішення вчасно.",
  },
];

const defaultFooterLinks: NonNullable<FAQProps["footerLinks"]> = [
  { label: "Конфіденційність", href: "#" },
  { label: "Умови", href: "#" },
];

const headingGradientClass =
  "bg-gradient-to-b from-[#1a3a63] via-[#245494] to-[#1a3a63] bg-clip-text text-transparent [background-clip:text] [-webkit-background-clip:text] font-black uppercase tracking-tighter leading-[0.95]";

const answerEase = [0.22, 1, 0.36, 1] as const;
const answerTransition = {
  duration: 0.32,
  ease: answerEase,
};

function formatItemIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotionPreferred = useReducedMotion();
  const reactId = useId();
  const faqIdPrefix = reactId.replace(/:/g, "");

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-acg-light text-foreground"
    >
      <motion.div
        className="py-24 sm:py-28 lg:py-32"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.55, ease: answerEase }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:h-fit lg:pb-0 pb-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
              {eyebrow}
            </p>
            <h2
              id="faq-heading"
              className={`${headingGradientClass} mt-4 max-w-[min(100%,20ch)] text-5xl lg:text-7xl`}
            >
              {heading}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/75">
              {intro}
            </p>
          </div>

          <div className="lg:col-span-7">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              const questionId = `faq-q-${faqIdPrefix}-${i}`;
              const answerId = `faq-a-${faqIdPrefix}-${i}`;
              const q = item.question ?? "";
              const a = item.answer ?? "";

              return (
                <div
                  key={`${q}-${i}`}
                  className="border-b border-foreground/10 py-8 first:pt-0"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span
                      className="shrink-0 text-right text-5xl font-black tabular-nums leading-[0.9] text-acg-blue/75 sm:text-7xl sm:text-acg-blue/65"
                      aria-hidden
                    >
                      {formatItemIndex(i)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="m-0 text-base font-normal leading-snug">
                        <button
                          type="button"
                          id={questionId}
                          aria-expanded={isOpen}
                          aria-controls={answerId}
                          onClick={() => toggle(i)}
                          className="flex w-full items-start gap-4 text-left outline-none focus-visible:outline-none sm:gap-6"
                        >
                          <span className="min-w-0 flex-1 text-2xl font-medium text-acg-blue transition-colors hover:text-acg-blue/85 sm:text-3xl">
                            {q}
                          </span>
                          <span
                            className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full border border-acg-blue/20 bg-acg-light text-acg-blue"
                            aria-hidden
                          >
                            <Plus
                              className={`size-4.5 transition-transform duration-300 ease-out motion-reduce:transition-none ${
                                isOpen ? "rotate-45" : "rotate-0"
                              }`}
                              strokeWidth={2}
                            />
                          </span>
                        </button>
                      </h3>

                      {reduceMotionPreferred ? (
                        isOpen ? (
                          <div
                            id={answerId}
                            role="region"
                            aria-labelledby={questionId}
                            className="overflow-hidden"
                          >
                            <p className="max-w-3xl pt-6 text-lg leading-relaxed text-foreground/70">
                              {a}
                            </p>
                          </div>
                        ) : null
                      ) : (
                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div
                              key={answerId}
                              id={answerId}
                              role="region"
                              aria-labelledby={questionId}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={answerTransition}
                              className="overflow-hidden"
                            >
                              <p className="max-w-3xl pt-6 text-lg leading-relaxed text-foreground/70">
                                {a}
                              </p>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="mx-auto mt-20 max-w-7xl border-t border-foreground/10 px-4 pt-10 sm:px-6">
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
      </motion.div>
    </section>
  );
}
