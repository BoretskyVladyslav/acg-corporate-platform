"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Phone, Plus, Send } from "lucide-react";
import { useCallback, useId, useState } from "react";

import ConsultationModal from "./ConsultationModal";
import { useIsMdUp } from "@/src/hooks/useIsMdUp";
import { externalLinkProps } from "@/src/lib/externalLink";
import { prepareConsultationGeneral } from "@/src/lib/leadIntent";
import { telHrefFromDisplay } from "@/src/lib/telHrefFromDisplay";
import { ACG_TELEGRAM_LEADS_URL } from "@/src/lib/telegram";

export interface FaqItem {
  question?: string;
  answer?: string;
}

export interface FAQProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items?: FaqItem[];
  /** Якщо порожньо або лише пробіли — картка з кнопкою під FAQ не показується. Кнопка лише відкриває ConsultationModal (як у тарифах). */
  footerButtonText?: string;
  footerNote?: string;
  /** З [LeadCaptureForm / Sanity `contact`]: для футера. */
  phoneDisplay?: string;
}

const DEFAULT_FAQ_EYEBROW = "FAQ";
const DEFAULT_FAQ_HEADING = "Популярні запитання";
const DEFAULT_FAQ_INTRO = "Відповіді на часті питання наших клієнтів";
const DEFAULT_FAQ_FOOTER_NOTE = "© {year} Назва компанії. Усі права захищені.";

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

function mergeFaqItems(cms: FaqItem[] | undefined, defaults: FaqItem[]): FaqItem[] {
  const filtered =
    cms?.filter(
      (row) =>
        Boolean(row.question?.trim()) && Boolean(row.answer?.trim()),
    ) ?? [];
  if (!filtered.length) return defaults;
  return filtered.map((item, i) => {
    const d = defaults[Math.min(i, defaults.length - 1)];
    return {
      question: textOr(item.question, d.question ?? ""),
      answer: textOr(item.answer, d.answer ?? ""),
    };
  });
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

const FAQ_INDIVIDUAL_CTA_COPY =
  "Маєте індивідуальне запитання? Наші експерти готові допомогти.";

/** Додаткові посилання під FAQ не редагуються в Sanity — лише в коді. */
const STATIC_FOOTER_NAV_LINKS: Array<{ label: string; href: string }> = [
  { label: "Конфіденційність", href: "#" },
  { label: "Умови", href: "#" },
];

const revealEase = [0.22, 1, 0.36, 1] as const;

function formatItemIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

export default function FAQ({
  eyebrow,
  heading,
  intro,
  items,
  footerButtonText,
  footerNote,
  phoneDisplay,
}: FAQProps) {
  const displayEyebrow = textOr(eyebrow, DEFAULT_FAQ_EYEBROW);
  const displayHeading = textOr(heading, DEFAULT_FAQ_HEADING);
  const displayIntro = textOr(intro, DEFAULT_FAQ_INTRO);
  const resolvedItems = mergeFaqItems(items, defaultItems);

  const trimmedFooterButtonText =
    typeof footerButtonText === "string" ? footerButtonText.trim() : "";
  const showFaqConsultCta = Boolean(trimmedFooterButtonText);

  const footerPhoneHref = telHrefFromDisplay(phoneDisplay);

  const year = new Date().getFullYear();
  const footerNoteTemplate = textOr(footerNote, DEFAULT_FAQ_FOOTER_NOTE);
  const resolvedNote = footerNoteTemplate.replace("{year}", String(year));
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultModalKey, setConsultModalKey] = useState(0);
  const reduceMotionPreferred = useReducedMotion();
  const isMdUp = useIsMdUp();
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
        className="py-16 sm:py-20 lg:py-24"
        initial={
          isMdUp ? { opacity: 0, y: 24 } : { opacity: 0, y: 10 }
        }
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{
          duration: isMdUp ? 0.55 : 0.38,
          ease: revealEase,
        }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="pb-8 lg:col-span-5 lg:sticky lg:top-32 lg:h-fit lg:pb-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
              {displayEyebrow}
            </p>
            <h2
              id="faq-heading"
              className="mt-4 max-w-[min(100%,18ch)] text-4xl font-semibold tracking-tight text-acg-blue lg:mt-5 lg:text-5xl lg:leading-[1.12]"
            >
              {displayHeading}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/65 md:mt-8 md:text-lg">
              {displayIntro}
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
                  <div className="flex gap-3 sm:gap-5">
                    <span
                      className="w-8 shrink-0 pt-4 text-right text-2xl font-light tabular-nums leading-none text-acg-blue/20 sm:w-10 sm:pt-4 sm:text-4xl"
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
                        className="flex min-h-11 w-full cursor-pointer items-start gap-3 py-3.5 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-acg-blue/25 focus-visible:ring-offset-2 focus-visible:ring-offset-acg-light sm:min-h-0 sm:gap-4 sm:py-4 md:gap-5"
                      >
                        <span
                          className={`min-w-0 flex-1 text-[1.0625rem] font-medium leading-snug tracking-tight sm:text-lg sm:leading-snug md:transition-all md:duration-300 ${
                            isOpen
                              ? "translate-x-0 text-foreground"
                              : "translate-x-0 text-foreground/85 md:hover:translate-x-1 md:hover:text-foreground"
                          }`}
                        >
                          {q}
                        </span>
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-8 sm:w-8 ${
                            isOpen
                              ? "bg-acg-blue/10 text-acg-blue"
                              : "bg-acg-surface-subtle text-foreground/45"
                          }`}
                          aria-hidden
                        >
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{
                              duration:
                                reduceMotionPreferred ? 0 : isMdUp ? 0.32 : 0.12,
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
                        <p className="max-w-3xl pb-4 pt-1.5 text-sm leading-relaxed text-acg-muted sm:pb-4 sm:pt-2 sm:text-[1.0625rem]">
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

        {showFaqConsultCta ? (
          <>
            <div className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6">
              <div className="rounded-2xl border border-acg-border bg-white/90 px-4 py-5 shadow-sm sm:px-6 sm:py-6">
                <p className="text-center text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {FAQ_INDIVIDUAL_CTA_COPY}
                </p>
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      prepareConsultationGeneral();
                      setConsultModalKey((k) => k + 1);
                      setConsultModalOpen(true);
                    }}
                    className="inline-flex min-h-11 w-full max-w-sm items-center justify-center rounded-full bg-acg-blue px-6 py-3 text-sm font-semibold text-white shadow-md ring-1 ring-acg-blue/20 transition hover:bg-acg-blue/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acg-blue/35 sm:w-auto"
                  >
                    {trimmedFooterButtonText}
                  </button>
                </div>
              </div>
            </div>

            <ConsultationModal
              key={consultModalKey}
              open={consultModalOpen}
              onClose={() => setConsultModalOpen(false)}
            />
          </>
        ) : null}

        <footer className="mx-auto mt-10 max-w-7xl border-t border-acg-border px-4 pt-8 sm:mt-12 sm:px-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="min-w-0 text-xs text-foreground/50 sm:text-sm">
                {resolvedNote}
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-6">
                <a
                  href={ACG_TELEGRAM_LEADS_URL}
                  {...externalLinkProps(ACG_TELEGRAM_LEADS_URL)}
                  className="inline-flex items-center gap-2 text-foreground/70 transition hover:text-[#229ED9]"
                  aria-label="Telegram @acg_leads_bot"
                >
                  <Send className="size-5 shrink-0 text-[#229ED9]" aria-hidden />
                  <span className="text-sm font-medium">Telegram</span>
                </a>
                {phoneDisplay?.trim() && footerPhoneHref ? (
                  <a
                    href={footerPhoneHref}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground/75 transition hover:text-acg-blue"
                  >
                    <Phone className="size-4 shrink-0 text-acg-blue" aria-hidden />
                    <span>{phoneDisplay.trim()}</span>
                  </a>
                ) : null}
              </div>
            </div>
            <nav aria-label="Додаткові посилання" className="border-t border-foreground/[0.06] pt-4">
              <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-foreground/45">
                {STATIC_FOOTER_NAV_LINKS.map((link, i) => {
                  const href = link.href;
                  return (
                    <li key={i}>
                      <a
                        href={href}
                        {...externalLinkProps(href)}
                        className="underline-offset-2 hover:text-acg-blue/90 hover:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </footer>
      </motion.div>
    </section>
  );
}
