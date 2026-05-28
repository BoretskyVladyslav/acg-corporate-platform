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
      description: "Текст відгуку",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Ім'я автора",
      type: "string",
      description: "Ім'я клієнта",
    }),
    defineField({
      name: "avatar",
      title: "Фото автора (необов'язково)",
      type: "image",
      options: { hotspot: true },
      description: "Фото автора",
    }),
    defineField({
      name: "rating",
      title: "Оцінка (зірочки, 1–5)",
      type: "number",
      description: "Оцінка (1-5)",
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
      description: "Маленький текст над заголовком",
    }),
    defineField({
      name: "heading",
      title: "Заголовок секції",
      type: "string",
      description: "Основний заголовок",
    }),
    defineField({
      name: "intro",
      title: "Вступний текст",
      type: "text",
      rows: 2,
      description: "Вступний текст під заголовком",
    }),
    defineField({
      name: "googleRatingScore",
      title: "Оцінка Google",
      type: "string",
      fieldset: "googleRating",
      description: "Оцінка (наприклад «4.9»)",
    }),
    defineField({
      name: "googleReviewsLabel",
      title: "Підпис до кількості відгуків",
      type: "string",
      fieldset: "googleRating",
      description: "Підпис (наприклад «110 відгуків»)",
    }),
    defineField({
      name: "quotes",
      title: "Відгуки клієнтів",
      type: "array",
      of: [defineArrayMember({ type: trustQuoteObject.name })],
      description: "Список відгуків",
    }),
  ],
});

export const trustQuoteType = trustQuoteObject;
