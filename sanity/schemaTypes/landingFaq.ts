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
      description: "Запитання клієнта",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Відповідь",
      type: "text",
      rows: 6,
      description: "Відповідь",
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
      title: "Вступний підзаголовок",
      type: "text",
      rows: 2,
      description: "Короткий текст під заголовком",
    }),
    defineField({
      name: "items",
      title: "Запитання та відповіді",
      type: "array",
      of: [defineArrayMember({ type: faqItemObject.name })],
      description: "Список запитань",
    }),
    defineField({
      name: "footerButtonText",
      title: "Текст кнопки «Отримати консультацію»",
      type: "string",
      fieldset: "cta",
      description: "Підпис кнопки під списком",
    }),
    defineField({
      name: "footerNote",
      title: "Текст у підвалі сторінки",
      type: "text",
      rows: 2,
      fieldset: "footer",
      description: "Текст у футері (можна використовувати {year})",
    }),
  ],
});

export const faqItemType = faqItemObject;
