import { defineArrayMember, defineField, defineType } from "sanity";

/** Тексти збігаються з дефолтами в `resolveHeroProps` / `HeroClient`. */
const HEADING_DEFAULT =
  "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.";

// ─── Дефолти кнопок (синхронізовані з HeroClient.tsx) ───────────────────────
const FREE_BTN_TITLE_DEFAULT = "ОТРИМАТИ ПЕРВИНУ КОНСУЛЬТАЦІЮ БЕЗКОШТОВНО";
const FREE_BTN_HINT_DEFAULT = "ШВИДКА ВІДПОВІДЬ У TELEGRAM";
const PAID_BTN_TITLE_DEFAULT = "КОНСУЛЬТАЦІЯ";
const PAID_BTN_HINT_DEFAULT = "ТРИВАЛІСТЬ 1 ГОД. З БУХГАЛТЕРОМ ТА ЮРИСТОМ";
const PAID_BTN_PRICE_DEFAULT = "2000 грн";

// ─── Картка-навігатор під заголовком ────────────────────────────────────────
const heroCardItemObject = defineType({
  name: "heroCardItem",
  title: "Картка-навігатор",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок картки",
      type: "string",
      description:
        "Назва послуги (наприклад «Реєстрація ФОП»). Якщо порожньо — береться дефолт з коду.",
    }),
    defineField({
      name: "subtitle",
      title: "Підзаголовок картки",
      type: "string",
      description:
        "Короткий опис під назвою (наприклад «Пакет послуг: Реєстрація ФОП»). Якщо порожньо — береться дефолт з коду.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare({ title, subtitle }) {
      return { title: title || "Без назви", subtitle };
    },
  },
});

// ─── Головна секція Hero ─────────────────────────────────────────────────────
export const landingHeroSectionType = defineType({
  name: "landingHeroSection",
  title: "Hero секція",
  type: "object",
  fieldsets: [
    {
      name: "primaryCta",
      title: "Кнопка 1 — Безкоштовна консультація (червона)",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "secondaryCta",
      title: "Кнопка 2 — Платна консультація (біла)",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    // ── Заголовок та підзаголовок ──
    defineField({
      name: "heading",
      title: "Головний заголовок",
      type: "string",
      description:
        "Рядок із розділювачем «—» для двох рядків заголовка. Крапка-пробіл відокремлює підтримуючий текст внизу.",
      initialValue: HEADING_DEFAULT,
    }),
    defineField({
      name: "subheading",
      title: "Підзаголовок (опціонально)",
      type: "text",
      rows: 3,
      description: "Короткий текст під заголовком. Залишіть порожнім, якщо не потрібен.",
      initialValue: "",
    }),

    // ── Навігаційні картки ──
    defineField({
      name: "heroCards",
      title: "Картки-навігатори під заголовком (4 шт.)",
      type: "array",
      of: [defineArrayMember({ type: heroCardItemObject.name })],
      description:
        "Рівно 4 картки. Порядок: 1 — Реєстрація ФОП, 2 — Бухгалтерія ФОП, 3 — Бухгалтерія ТОВ, 4 — Інші послуги. Якір #pricing та іконка задаються в коді. Порожні поля → дефолт.",
      validation: (Rule) => Rule.max(4),
    }),

    // ── Кнопка 1: Безкоштовна консультація ──
    defineField({
      name: "primaryButtonTitle",
      title: "Текст кнопки",
      type: "string",
      fieldset: "primaryCta",
      description: "Основний напис великими літерами. Порожньо → дефолт.",
      initialValue: FREE_BTN_TITLE_DEFAULT,
    }),
    defineField({
      name: "primaryButtonHint",
      title: "Підказка під текстом",
      type: "string",
      fieldset: "primaryCta",
      description: "Маленький текст під основним написом (наприклад «ШВИДКА ВІДПОВІДЬ У TELEGRAM»).",
      initialValue: FREE_BTN_HINT_DEFAULT,
    }),

    // ── Кнопка 2: Платна консультація ──
    defineField({
      name: "secondaryButtonTitle",
      title: "Текст кнопки",
      type: "string",
      fieldset: "secondaryCta",
      description: "Основний напис (наприклад «КОНСУЛЬТАЦІЯ»). Порожньо → дефолт.",
      initialValue: PAID_BTN_TITLE_DEFAULT,
    }),
    defineField({
      name: "secondaryButtonHint",
      title: "Підказка (тривалість/деталі)",
      type: "string",
      fieldset: "secondaryCta",
      description: "Маленький текст під назвою (наприклад «ТРИВАЛІСТЬ 1 ГОД. З БУХГАЛТЕРОМ ТА ЮРИСТОМ»).",
      initialValue: PAID_BTN_HINT_DEFAULT,
    }),
    defineField({
      name: "secondaryButtonPrice",
      title: "Ціна",
      type: "string",
      fieldset: "secondaryCta",
      description: "Ціна платної консультації (наприклад «2000 грн»). Порожньо → дефолт.",
      initialValue: PAID_BTN_PRICE_DEFAULT,
    }),

    // ── Зображення ──
    defineField({
      name: "backgroundImage",
      title: "Зображення команди",
      type: "image",
      description: "Квадратне фото команди у правій колонці Hero.",
      options: { hotspot: true },
    }),
  ],
});

export const heroCardItemType = heroCardItemObject;
