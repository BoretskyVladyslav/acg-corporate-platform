import { defineArrayMember, defineField, defineType } from "sanity";

const aboutMetricObject = defineType({
  name: "aboutCompanyMetric",
  title: "Показник (плашка)",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Значення (велике число)",
      type: "string",
      description:
        "Великий акцент на картці: число або рядок (наприклад «1000 +» або «14»). Обов'язкове для відображення плашки.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Підпис під числом",
      type: "string",
      description:
        "Короткий текст під великим значенням (наприклад «клієнтів», «років досвіду»). Обов'язкове для відображення плашки.",
      validation: (Rule) => Rule.required(),
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
      title: "Плашки-показники (рівно 4)",
      type: "array",
      of: [defineArrayMember({ type: aboutMetricObject.name })],
      description:
        "Рівно 4 плашки з числом та підписом. Іконки підбираються автоматично за порядком: 1 — клієнти, 2 — роки досвіду, 3 — послуги, 4 — рівні контролю. Якщо залишити порожнім — показуються дефолтні значення.",
      validation: (Rule) => Rule.max(4),
    }),
  ],
});

export const aboutCompanyMetricType = aboutMetricObject;
