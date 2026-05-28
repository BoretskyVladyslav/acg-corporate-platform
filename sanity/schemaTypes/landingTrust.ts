import { defineArrayMember, defineField, defineType } from "sanity";

const trustQuoteObject = defineType({
  name: "trustQuote",
  title: "Відгук клієнта",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Текст відгуку",
      type: "text",
      rows: 5,
      description:
        "Повний текст відгуку від клієнта. Відображається у картці на сайті. Мінімум 2–3 речення — короткі відгуки виглядають менш переконливо.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Ім'я автора",
      type: "string",
      description:
        "Ім'я або ПІБ клієнта (наприклад «Марія К.» або «ФОП Іваненко О.»). Якщо порожньо — показується «Клієнт».",
    }),
    defineField({
      name: "avatar",
      title: "Фото автора (необов'язково)",
      type: "image",
      options: { hotspot: true },
      description:
        "Квадратне фото 96×96 px або більше. Якщо не завантажено — на сайті показується ініціал імені на кольоровому фоні.",
    }),
    defineField({
      name: "rating",
      title: "Оцінка (зірочки, 1–5)",
      type: "number",
      description:
        "Рейтинг клієнта: від 1 до 5. За замовчуванням — 5. Відображається зірочками під ім'ям автора.",
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
  ],
  preview: {
    select: {
      title: "author",
      subtitle: "quote",
      media: "avatar",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Без імені",
        subtitle:
          typeof subtitle === "string" ? subtitle.slice(0, 60) + "…" : "",
        media,
      };
    },
  },
});

export const landingTrustSectionType = defineType({
  name: "landingTrustSection",
  title: "Відгуки та довіра",
  type: "object",
  fieldsets: [
    {
      name: "googleRating",
      title: "Рейтинг Google",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Позначка над заголовком (eyebrow)",
      type: "string",
      description:
        "Маленький рядок над заголовком (наприклад «Довіра»). Якщо порожньо — показується дефолт.",
    }),
    defineField({
      name: "heading",
      title: "Заголовок секції",
      type: "string",
      description:
        "Головний заголовок блоку (наприклад «Відгуки клієнтів»). Якщо порожньо — показується дефолт.",
    }),
    defineField({
      name: "intro",
      title: "Вступний текст",
      type: "text",
      rows: 2,
      description:
        "Короткий підзаголовок під основним заголовком (наприклад «Що про нас кажуть підприємці»). Якщо порожньо — показується дефолт.",
    }),
    defineField({
      name: "googleRatingScore",
      title: "Оцінка Google",
      type: "string",
      fieldset: "googleRating",
      description:
        "Числова оцінка для бейджа рейтингу (наприклад «4.9»). Якщо порожньо — показується «4.9».",
    }),
    defineField({
      name: "googleReviewsLabel",
      title: "Підпис до кількості відгуків",
      type: "string",
      fieldset: "googleRating",
      description:
        "Текст поруч з оцінкою (наприклад «110 відгуків»). Якщо порожньо — показується дефолт.",
    }),
    defineField({
      name: "quotes",
      title: "Відгуки клієнтів",
      type: "array",
      of: [defineArrayMember({ type: trustQuoteObject.name })],
      description:
        "Список відгуків для карусельного відображення. Рекомендовано 4–8 відгуків. Порядок змінюється перетягуванням. Якщо список порожній — відгуки не відображаються.",
    }),
  ],
});

export const trustQuoteType = trustQuoteObject;
