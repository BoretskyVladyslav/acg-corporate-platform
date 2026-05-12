import { defineArrayMember, defineField, defineType } from "sanity";

const aboutMetricObject = defineType({
  name: "aboutCompanyMetric",
  title: "Показник",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Підпис", type: "string" }),
    defineField({ name: "value", title: "Значення", type: "string" }),
  ],
});

export const landingAboutType = defineType({
  name: "landingAbout",
  title: "Про компанію",
  type: "document",
  fields: [
    defineField({
      name: "sectionId",
      title: "ID секції (anchor)",
      type: "string",
      initialValue: "about",
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Заголовок",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "body", title: "Текст", type: "text", rows: 5 }),
    defineField({
      name: "metrics",
      title: "Показники",
      type: "array",
      of: [defineArrayMember({ type: aboutMetricObject.name })],
      validation: (Rule) => Rule.max(3),
    }),
  ],
});

export const aboutCompanyMetricType = aboutMetricObject;
