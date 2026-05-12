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

export const landingAdvantagesType = defineType({
  name: "landingAdvantages",
  title: "Переваги",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Заголовок",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sideImage",
      title: "Зображення біля заголовка",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-текст",
          type: "string",
        }),
      ],
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
