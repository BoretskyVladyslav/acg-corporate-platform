import { defineArrayMember, defineField, defineType } from "sanity";

/** Тексти збігаються з дефолтами в `resolveHeroProps` / `HeroClient`. */
const HEADING_DEFAULT =
  "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.";

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
      description: "Коротка назва послуги",
    }),
    defineField({
      name: "subtitle",
      title: "Підзаголовок",
      type: "string",
      description: "Опис під назвою",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare({ title, subtitle }) {
      return { title: title || "Без назви", subtitle };
    },
  },
});

// ─── Кнопки ──────────────────────────────────────────────────────────────────
const mainButtonObject = defineType({
  name: "mainButton",
  title: "Кнопка Hero",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Основний текст",
      type: "string",
      description: "Напис на кнопці",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Підказка (опціонально)",
      type: "string",
      description: "Маленький текст під основним написом",
    }),
    defineField({
      name: "price",
      title: "Ціна (опціонально)",
      type: "string",
      description: "Ціна послуги",
    }),
    defineField({
      name: "buttonStyle",
      title: "Стиль кнопки",
      type: "string",
      options: {
        list: [
          { title: "Червона (Primary)", value: "primary" },
          { title: "Біла (Secondary)", value: "secondary" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
    defineField({
      name: "actionType",
      title: "Тип дії",
      type: "string",
      options: {
        list: [
          { title: "Форма (Безкоштовна)", value: "free_consultation" },
          { title: "Форма (Платна)", value: "paid_consultation" },
        ],
        layout: "radio",
      },
      initialValue: "free_consultation",
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
  fields: [
    defineField({
      name: "heading",
      title: "Головний заголовок",
      type: "string",
      description: "Символ «—» розбиває заголовок на два рядки",
      initialValue: HEADING_DEFAULT,
    }),
    defineField({
      name: "subheading",
      title: "Підзаголовок (опціонально)",
      type: "text",
      rows: 3,
      description: "Короткий текст під заголовком",
      initialValue: "",
    }),
    defineField({
      name: "heroCards",
      title: "Картки-навігатори",
      type: "array",
      of: [defineArrayMember({ type: heroCardItemObject.name })],
      description: "Картки під заголовком",
    }),
    defineField({
      name: "mainButtons",
      title: "Головні кнопки",
      type: "array",
      of: [defineArrayMember({ type: mainButtonObject.name })],
      description: "Кнопки під текстом",
    }),
    defineField({
      name: "backgroundImage",
      title: "Зображення команди",
      type: "image",
      description: "Квадратне фото праворуч",
      options: { hotspot: true },
    }),
  ],
});

export const heroCardItemType = heroCardItemObject;
export const mainButtonType = mainButtonObject;
