import { defineArrayMember, defineField, defineType } from "sanity";

import { featureItemType } from "./featureItem";

const pricingTierObject = defineType({
  name: "pricingTier",
  title: "Тарифний пакет",
  type: "object",
  fieldsets: [
    {
      name: "tariffMain",
      title: "Тариф",
      options: { collapsible: false },
    },
    {
      name: "tariffPackage",
      title: "Пакет",
      options: { collapsible: false },
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Назва",
      type: "string",
      fieldset: "tariffMain",
      description: "Назва тарифу (наприклад «ФОП 1 група»)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceText",
      title: "Ціна",
      type: "string",
      fieldset: "tariffMain",
      description: "Вартість (наприклад «1000 грн / міс.»)",
    }),
    defineField({
      name: "description",
      title: "Підзаголовок",
      type: "text",
      rows: 3,
      fieldset: "tariffMain",
      description: "Короткий текст під назвою тарифу",
    }),
    defineField({
      name: "isPopular",
      title: "Хіт продажу",
      type: "boolean",
      fieldset: "tariffMain",
      description: "Підсвічує тариф як рекомендований",
      initialValue: false,
    }),
    defineField({
      name: "features",
      title: "Пункти",
      type: "array",
      fieldset: "tariffPackage",
      description: "Чек-лист послуг у тарифі",
      of: [
        defineArrayMember({
          type: featureItemType.name,
          title: "Пункт",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", priceText: "priceText" },
    prepare({ title, priceText }) {
      const p = typeof priceText === "string" ? priceText.trim() : "";
      return {
        title: title || "Без назви",
        ...(p ? { subtitle: p } : {}),
      };
    },
  },
});

const pricingCategoryObject = defineType({
  name: "pricingCategory",
  title: "Категорія тарифів",
  type: "object",
  fields: [
    defineField({
      name: "categoryName",
      title: "Назва категорії",
      type: "string",
      description: "Наприклад «Бухгалтерія для ФОП»",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tariffs",
      title: "Тарифи в цій категорії",
      type: "array",
      of: [defineArrayMember({ type: pricingTierObject.name })],
      description: "Саб-таби цієї категорії (ФОП 1, ФОП 2 тощо)",
    }),
  ],
  preview: {
    select: { title: "categoryName", tariffs: "tariffs" },
    prepare({ title, tariffs }) {
      const count = tariffs?.length || 0;
      return {
        title: title || "Без назви",
        subtitle: `Тарифів: ${count}`,
      };
    },
  },
});

export const landingPricingSectionType = defineType({
  name: "landingPricingSection",
  title: "Тарифи",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Позначка над заголовком (eyebrow)",
      type: "string",
      description: "Маленький рядок над заголовком",
    }),
    defineField({
      name: "heading",
      title: "Заголовок секції",
      type: "string",
      description: "Основний заголовок блоку",
    }),
    defineField({
      name: "intro",
      title: "Вступний текст",
      type: "text",
      rows: 3,
      description: "Текст під заголовком",
    }),
    defineField({
      name: "ctaText",
      title: "Текст над кнопкою",
      type: "text",
      rows: 3,
      description: "Текст у футері секції (над кнопкою)",
    }),
    defineField({
      name: "globalButtonLabel",
      title: "Текст кнопки замовлення",
      type: "string",
      description: "Напис на синіх кнопках у тарифах",
    }),
    defineField({
      name: "categories",
      title: "Категорії тарифів (Таби)",
      type: "array",
      description: "Головні таби (наприклад «Консультація», «Бухгалтерія для ФОП»)",
      of: [defineArrayMember({ type: pricingCategoryObject.name })],
    }),
  ],
});

export const pricingTierSchemaType = pricingTierObject;
export const pricingCategorySchemaType = pricingCategoryObject;
