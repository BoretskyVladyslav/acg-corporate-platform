import { defineArrayMember, defineField, defineType } from "sanity";

const faqItemObject = defineType({
  name: "faqItem",
  title: "Питання та відповідь",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Питання",
      type: "string",
      description:
        "Формулюйте як реальне запитання клієнта. Починайте з великої літери, крапку в кінці можна не ставити (наприклад «Як відбувається співпраця дистанційно»).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Відповідь",
      type: "text",
      rows: 6,
      description:
        "Детальна відповідь: 2–4 речення. Відображається при розкритті картки. Уникайте жаргону — пишіть зрозуміло для підприємця.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Без питання",
        subtitle:
          typeof subtitle === "string" ? subtitle.slice(0, 60) + "…" : "",
      };
    },
  },
});

export const landingFaqSectionType = defineType({
  name: "landingFaqSection",
  title: "FAQ — Часті запитання",
  type: "object",
  fieldsets: [
    {
      name: "cta",
      title: "Кнопка консультації під FAQ",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "footer",
      title: "Нотатка у футері сторінки",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Позначка над заголовком (eyebrow)",
      type: "string",
      description:
        "Маленький рядок над заголовком (зазвичай «FAQ»). Якщо порожньо — показується дефолт.",
    }),
    defineField({
      name: "heading",
      title: "Заголовок секції",
      type: "string",
      description:
        "Головний заголовок FAQ (наприклад «Популярні запитання»). Якщо порожньо — показується дефолт.",
    }),
    defineField({
      name: "intro",
      title: "Вступний підзаголовок",
      type: "text",
      rows: 2,
      description:
        "Короткий текст під заголовком (наприклад «Відповіді на часті питання наших клієнтів»). Якщо порожньо — показується дефолт.",
    }),
    defineField({
      name: "items",
      title: "Запитання та відповіді",
      type: "array",
      of: [defineArrayMember({ type: faqItemObject.name })],
      description:
        "Список питань-відповідей. Рекомендовано 4–8 пунктів. Порядок змінюється перетягуванням. Якщо список порожній — показуються 4 дефолтних питання.",
    }),
    defineField({
      name: "footerButtonText",
      title: "Текст кнопки «Отримати консультацію»",
      type: "string",
      fieldset: "cta",
      description:
        "Підпис кнопки під списком питань (наприклад «Отримати консультацію»). Якщо ПОРОЖНЬО — кнопка взагалі не з'являється на сайті. Кнопка відкриває модальне вікно консультації.",
    }),
    defineField({
      name: "footerNote",
      title: "Текст у підвалі сторінки",
      type: "text",
      rows: 2,
      fieldset: "footer",
      description:
        "Коротка нотатка у самому низу сторінки (наприклад: рік заснування, копірайт). Використовуйте плейсхолдер {year} для автоматичного підстановки поточного року. Приклад: «© {year} ACG Accounting. Усі права захищено.»",
    }),
  ],
});

export const faqItemType = faqItemObject;
