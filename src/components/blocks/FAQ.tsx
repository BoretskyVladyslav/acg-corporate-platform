"use client";

import { motion, useReducedMotion } from "framer-motion";
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
    question:
      "Як відбувається співпраця якщо я в іншому місті",
    answer:
      "Ми працюємо дистанційно по всій Україні. Наш офіс знаходиться в Києві, якщо є необхідність, то можемо призначити зустріч в Києві. Обмін документами відбувається через сервіс електронного документообігу 'Вчасно' або Новою поштою; первинні документи та узгодження ви можете вести дистанційно без щоденної присутності в офісі.",
  },
  {
    question: "Що робити якщо прийде податкова перевірка",
    answer:
      "Ми супроводжуємо вас на всіх етапах: від підготовки відповідей на запити контролюючих органів до представництва ваших інтересів у податковій нашими юристами та бухгалтерами. Юристи компанії допомагають підготувати документи та вибудувати позицію для взаємодії з контролерами.",
  },
  {
    question:
      "Чи маєте ви досвід роботи саме з моєю сферою діяльності",
    answer:
      "Ми обслуговуємо понад 900 клієнтів з різних сфер бізнесу: від IT та фрілансу до роздрібної торгівлі та виробництва. Ми закріплюємо за вами фахівця, який найкраще розуміє специфіку саме вашого виду діяльності. Широкий досвід по галузях дає змогу швидше підлаштувати облік під ваші операції.",
  },
  {
    question:
      "Як швидко я буду отримувати відповіді на свої запитання",
    answer:
      "Ми на зв’язку в робочий час. За вами закріплюється особистий бухгалтер, який надає відповіді оперативно, щоб ви могли приймати рішення вчасно. Це стосується і звітності, і узгодження документів у робочому ритмі.",
  },
];

const defaultFooterLinks: NonNullable<FAQProps["footerLinks"]> = [
  { label: "Конфіденційність", href: "#" },
  { label: "Умови", href: "#" },
];

const revealEase = [0.22, 1, 0.36, 1] as const;

function formatItemIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

export default function FAQ({
  eyebrow = "FAQ",
  heading = "Популярні запитання",
  intro = "Відповіді на часті питання наших клієнтів",
  items,
  footerNote = "© {year} Назва компанії. Усі права захищені.",
  footerLinks,
}: FAQProps) {
  const filteredItems =
    items?.filter(
      (row) =>
        Boolean(row.question?.trim()) && Boolean(row.answer?.trim()),
    ) ?? [];
  const resolvedItems =
    filteredItems.length > 0 ? filteredItems : defaultItems;

  const filteredFooterLinks =
    footerLinks?.filter(
      (link) =>
        Boolean(link.label?.trim()) && Boolean(link.href?.trim()),
    ) ?? [];
  const resolvedFooterLinks =
    filteredFooterLinks.length > 0 ? filteredFooterLinks : defaultFooterLinks;

  const year = new Date().getFullYear();
  const resolvedNote = footerNote.replace("{year}", String(year));
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotionPreferred = useReducedMotion();
  const reactId = useId();
  const faqIdPrefix = reactId.replace(/:/g, "");

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const revealTransition = reduceMotionPreferred
    ? { duration: 0 }
    : {
        duration: 0.38,
        ease: revealEase,
      };

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
        transition={{ duration: 0.55, ease: revealEase }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="pb-12 lg:col-span-5 lg:sticky lg:top-32 lg:h-fit lg:pb-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
              {eyebrow}
            </p>
            <h2
              id="faq-heading"
              className="mt-5 max-w-[min(100%,18ch)] text-4xl font-semibold tracking-tight text-acg-blue lg:text-5xl lg:leading-[1.12]"
            >
              {heading}
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-foreground/65">
              {intro}
            </p>
          </div>

          <div className="lg:col-span-7">
            {resolvedItems.map((item, i) => {
              const isOpen = openIndex === i;
              const questionId = `faq-q-${faqIdPrefix}-${i}`;
              const answerId = `faq-a-${faqIdPrefix}-${i}`;
              const q = item.question ?? "";
              const a = item.answer ?? "";

              return (
                <div
                  key={`${q}-${i}`}
                  className="border-b border-acg-border first:border-t first:border-acg-border"
                >
                  <div className="flex gap-5 sm:gap-6">
                    <span
                      className="w-9 shrink-0 pt-6 text-right text-3xl font-light tabular-nums leading-none text-acg-blue/20 sm:w-10 sm:text-4xl"
                      aria-hidden
                    >
                      {formatItemIndex(i)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        id={questionId}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => toggle(i)}
                        className="flex w-full cursor-pointer items-start gap-4 py-6 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-acg-blue/25 focus-visible:ring-offset-2 focus-visible:ring-offset-acg-light sm:gap-5"
                      >
                        <span
                          className={`min-w-0 flex-1 text-[1.0625rem] font-medium leading-snug tracking-tight transition-all duration-300 sm:text-lg sm:leading-snug ${
                            isOpen
                              ? "translate-x-0 text-foreground"
                              : "translate-x-0 text-foreground/85 hover:translate-x-1 hover:text-foreground"
                          }`}
                        >
                          {q}
                        </span>
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                            isOpen
                              ? "bg-acg-blue/10 text-acg-blue"
                              : "bg-acg-surface-subtle text-foreground/45"
                          }`}
                          aria-hidden
                        >
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{
                              duration: reduceMotionPreferred ? 0 : 0.32,
                              ease: revealEase,
                            }}
                            className="flex items-center justify-center"
                          >
                            <Plus className="size-4" strokeWidth={2} />
                          </motion.span>
                        </span>
                      </button>

                      <motion.div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        initial={false}
                        animate={{
                          height: isOpen ? "auto" : 0,
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{
                          height: revealTransition,
                          opacity: {
                            duration: reduceMotionPreferred ? 0 : 0.28,
                            ease: revealEase,
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-3xl pb-6 pt-2 text-base leading-relaxed text-acg-muted sm:text-[1.0625rem]">
                          {a}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="mx-auto mt-20 max-w-7xl border-t border-acg-border px-4 pt-10 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground/55">{resolvedNote}</p>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {resolvedFooterLinks.map((link, i) => (
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
