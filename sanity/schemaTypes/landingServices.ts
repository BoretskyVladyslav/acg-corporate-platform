import { defineArrayMember, defineField, defineType } from "sanity";

import { featureItemType } from "./featureItem";

export const landingServicesSectionType = defineType({
  name: "landingServicesSection",
  title: "Послуги",
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
      title: "Картки послуг",
      type: "array",
      description:
        "Кожна картка: назва, опис, необов’язкова примітка та іконка (спільна структура зі списками в тарифах).",
      of: [defineArrayMember({ type: featureItemType.name })],
    }),
  ],
});
