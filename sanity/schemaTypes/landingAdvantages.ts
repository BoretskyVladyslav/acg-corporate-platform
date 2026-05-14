import { defineArrayMember, defineField, defineType } from "sanity";

const advantageItemObject = defineType({
  name: "advantageItem",
  title: "Перевага",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Опис",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const landingAdvantagesSectionType = defineType({
  name: "landingAdvantagesSection",
  title: "Переваги",
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
      name: "sideImage",
      title: "Зображення біля списку",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "items",
      title: "Список переваг",
      type: "array",
      of: [defineArrayMember({ type: advantageItemObject.name })],
    }),
  ],
});

export const advantageItemType = advantageItemObject;
