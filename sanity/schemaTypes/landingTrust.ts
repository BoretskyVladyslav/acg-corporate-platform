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
    defineField({ name: "role", title: "Посада / контекст", type: "string" }),
  ],
});

const trustPartnerLogoObject = defineType({
  name: "trustPartnerLogo",
  title: "Логотип партнера",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Назва", type: "string" }),
    defineField({
      name: "logo",
      title: "Зображення логотипу",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-текст",
          type: "string",
        }),
      ],
    }),
  ],
});

export const landingTrustType = defineType({
  name: "landingTrust",
  title: "Довіра та відгуки",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Заголовок",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "intro", title: "Вступний текст", type: "text", rows: 3 }),
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
    defineField({
      name: "logosSectionTitle",
      title: "Заголовок блоку логотипів",
      type: "string",
    }),
    defineField({
      name: "logos",
      title: "Логотипи",
      type: "array",
      of: [defineArrayMember({ type: trustPartnerLogoObject.name })],
    }),
  ],
});

export const trustQuoteType = trustQuoteObject;
export const trustPartnerLogoType = trustPartnerLogoObject;
