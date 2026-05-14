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

export const landingFaqSectionType = defineType({
  name: "landingFaqSection",
  title: "FAQ",
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
      name: "items",
      title: "Питання та відповіді",
      type: "array",
      of: [defineArrayMember({ type: faqItemObject.name })],
    }),
    defineField({
      name: "footerNote",
      title: "Текст футера секції FAQ",
      type: "text",
      rows: 2,
      description: "Використайте плейсхолдер {year} для поточного року.",
    }),
    defineField({
      name: "footerButtonText",
      title: "Текст кнопки після списку FAQ",
      type: "string",
      description:
        "Заповніть останнім. Кнопка відкриває форму консультації (без посилання). Якщо поле порожнє — кнопка на сайті не з’являється.",
    }),
  ],
});

export const faqItemType = faqItemObject;
