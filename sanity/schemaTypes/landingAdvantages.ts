import { defineArrayMember, defineField, defineType } from "sanity";

const advantageItemObject = defineType({
  name: "advantageItem",
  title: "Перевага",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок переваги",
      type: "string",
      description: "Коротка назва (2-4 слова)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Детальний опис",
      type: "text",
      rows: 4,
      description: "Детальний опис переваги",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Без заголовка",
        subtitle:
          typeof subtitle === "string" ? subtitle.slice(0, 60) + "…" : "",
      };
    },
  },
});

export const landingAdvantagesSectionType = defineType({
  name: "landingAdvantagesSection",
  title: "Переваги",
  type: "object",
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
      name: "sideImage",
      title: "Зображення поруч зі списком",
      type: "image",
      options: { hotspot: true },
      description: "Зображення ліворуч (PNG)",
    }),
    defineField({
      name: "items",
      title: "Список переваг",
      type: "array",
      of: [defineArrayMember({ type: advantageItemObject.name })],
      description: "Список переваг",
    }),
  ],
});

export const advantageItemType = advantageItemObject;
