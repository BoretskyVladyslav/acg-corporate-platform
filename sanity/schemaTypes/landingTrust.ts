import { defineArrayMember, defineField, defineType } from "sanity";

const trustQuoteObject = defineType({
  name: "trustQuote",
  title: "Відгук",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Текст відгуку",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "author", title: "Автор", type: "string" }),
    defineField({
      name: "avatar",
      title: "Фото автора",
      type: "image",
      options: { hotspot: true },
      description:
        "Необов'язково. Якщо не завантажено — на сайті показується ініціал імені.",
    }),
    defineField({
      name: "rating",
      title: "Оцінка (зірочки)",
      type: "number",
      description: "Ціле число від 1 до 5.",
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
  ],
});

export const landingTrustSectionType = defineType({
  name: "landingTrustSection",
  title: "Довіра та відгуки",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Текст над заголовком (eyebrow)",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Заголовок секції",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Вступний текст",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "googleRatingScore",
      title: "Оцінка Google (текст)",
      type: "string",
      description: "Наприклад 4.9",
    }),
    defineField({
      name: "googleReviewsLabel",
      title: "Підпис до відгуків Google",
      type: "string",
      description: "Наприклад «100+ відгуків»",
    }),
    defineField({
      name: "quotes",
      title: "Відгуки",
      type: "array",
      of: [defineArrayMember({ type: trustQuoteObject.name })],
    }),
  ],
});

export const trustQuoteType = trustQuoteObject;
