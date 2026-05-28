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
      description: "Значення (наприклад «500+»)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Підпис під числом",
      type: "string",
      description: "Підпис (наприклад «задоволених клієнтів»)",
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
      description: "Маленький текст над заголовком",
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
      title: "Плашки-показники",
      type: "array",
      of: [defineArrayMember({ type: aboutMetricObject.name })],
      description: "Картки зі статистикою",
    }),
  ],
});

export const aboutCompanyMetricType = aboutMetricObject;
