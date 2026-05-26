import { defineArrayMember, defineField, defineType } from "sanity";

const aboutMetricObject = defineType({
  name: "aboutCompanyMetric",
  title: "Показник",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Підпис",
      type: "string",
      description:
        "Короткий текст під великим значенням на сайті (наприклад «клієнтів у різних сферах»). Заповнюйте разом із «Значення».",
    }),
    defineField({
      name: "value",
      title: "Значення",
      type: "string",
      description:
        "Великий акцент на картці: число або короткий рядок (наприклад «900+» або «100%»). Або один довгий рядок на кшталт «900+ клієнтів…» — тоді підпис можна не вказувати.",
    }),
  ],
});

export const landingAboutSectionType = defineType({
  name: "landingAboutSection",
  title: "Про компанію",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Текст над заголовком (eyebrow)",
      type: "string",
      description: "Коротка підводка перед основним заголовком секції.",
    }),
    defineField({
      name: "heading",
      title: "Заголовок секції",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Текст",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "metrics",
      title: "Показники (до 4)",
      type: "array",
      of: [defineArrayMember({ type: aboutMetricObject.name })],
      validation: (Rule) => Rule.max(4),
    }),
  ],
});

export const aboutCompanyMetricType = aboutMetricObject;
