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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Відповідь",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
  ],
});

const faqFooterLinkObject = defineType({
  name: "faqFooterLink",
  title: "Посилання у футері",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Текст",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const landingFaqType = defineType({
  name: "landingFaq",
  title: "FAQ та футер",
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
      name: "items",
      title: "Питання та відповіді",
      type: "array",
      of: [defineArrayMember({ type: faqItemObject.name })],
    }),
    defineField({
      name: "footerNote",
      title: "Текст футера",
      type: "text",
      rows: 2,
      description: "Використайте плейсхолдер {year} для поточного року.",
    }),
    defineField({
      name: "footerLinks",
      title: "Посилання футера",
      type: "array",
      of: [defineArrayMember({ type: faqFooterLinkObject.name })],
    }),
  ],
});

export const faqItemType = faqItemObject;
export const faqFooterLinkType = faqFooterLinkObject;
