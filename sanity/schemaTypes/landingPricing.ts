import { defineArrayMember, defineField, defineType } from "sanity";

const pricingFeatureObject = defineType({
  name: "pricingFeatureLine",
  title: "Пункт списку",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Текст",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { text: "text" },
    prepare({ text }) {
      return { title: text ?? "" };
    },
  },
});

const pricingTierObject = defineType({
  name: "pricingTier",
  title: "Тарифний пакет",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Назва пакета",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "price", title: "Оплата", type: "string" }),
    defineField({
      name: "cadence",
      title: "Період",
      type: "string",
      description: "Наприклад « / міс.»",
    }),
    defineField({ name: "description", title: "Короткий опис", type: "text", rows: 3 }),
    defineField({
      name: "features",
      title: "Переваги",
      type: "array",
      of: [defineArrayMember({ type: pricingFeatureObject.name })],
    }),
    defineField({ name: "ctaLabel", title: "Текст кнопки", type: "string" }),
    defineField({ name: "ctaHref", title: "Посилання кнопки", type: "string" }),
    defineField({
      name: "highlighted",
      title: "Акцентний пакет",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const landingPricingType = defineType({
  name: "landingPricing",
  title: "Тарифи",
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
      name: "tiers",
      title: "Пакети",
      type: "array",
      of: [defineArrayMember({ type: pricingTierObject.name })],
    }),
  ],
});

export const pricingFeatureLineType = pricingFeatureObject;
export const pricingTierSchemaType = pricingTierObject;
