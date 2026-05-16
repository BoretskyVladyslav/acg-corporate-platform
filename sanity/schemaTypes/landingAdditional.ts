import { defineArrayMember, defineField, defineType } from "sanity";

const DEFAULT_SECTION_TITLE = "Додаткові послуги";

/** Один пункт списку в секції «Додаткові послуги». */
export const landingAdditionalItemType = defineType({
  name: "landingAdditionalItem",
  title: "Додаткова послуга",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Назва послуги",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Обовʼязково вкажіть назву послуги"),
      description:
        'Коротка назва на картці. Наприклад: «Кадровий облік» або «Юридичний супровід».',
    }),
    defineField({
      name: "description",
      title: "Короткий опис",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Вартість",
      type: "string",
      description:
        "Необовʼязково. Короткий рядок для відображення на сайті. Приклади форматів: «від 500 грн», «від 1000 грн / міс.», «По домовленості», «оферта по запиту».",
    }),
  ],
});

/** Секція лендингу: додаткові платні або супровідні послуги поза основними пакетами. */
export const landingAdditionalSectionType = defineType({
  name: "landingAdditional",
  title: "Додаткові послуги",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок секції",
      type: "string",
      initialValue: DEFAULT_SECTION_TITLE,
    }),
    defineField({
      name: "subtitle",
      title: "Підзаголовок секції",
      type: "string",
      description:
        "Короткий пояснювальний рядок під заголовком (можна лишити порожнім).",
    }),
    defineField({
      name: "items",
      title: "Список послуг",
      type: "array",
      of: [defineArrayMember({ type: landingAdditionalItemType.name })],
      validation: (Rule) => Rule.min(0),
    }),
  ],
});
