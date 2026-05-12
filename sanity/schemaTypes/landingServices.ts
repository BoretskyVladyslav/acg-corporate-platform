import { defineArrayMember, defineField, defineType } from "sanity";

const servicesCardObject = defineType({
  name: "servicesCard",
  title: "Картка послуги",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Назва",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "description", title: "Опис", type: "text", rows: 4 }),
    defineField({
      name: "note",
      title: "Примітка",
      type: "text",
      rows: 2,
    }),
  ],
});

export const landingServicesType = defineType({
  name: "landingServices",
  title: "Послуги",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Заголовок",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "intro", title: "Вступний текст", type: "text", rows: 3 }),
    defineField({
      name: "items",
      title: "Картки послуг",
      type: "array",
      of: [defineArrayMember({ type: servicesCardObject.name })],
    }),
  ],
});

export const servicesCardType = servicesCardObject;
