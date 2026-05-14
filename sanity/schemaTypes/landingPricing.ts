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
      description:
        "Назва картки на табах та у заголовку всередині блоку.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceText",
      title: "Ціна",
      type: "string",
      fieldset: "tariffMain",
      description:
        "Цінник як єдиний рядок: символи, суми, «від», період (місяць / разово).",
    }),
    defineField({
      name: "description",
      title: "Підзаголовок",
      type: "text",
      rows: 3,
      fieldset: "tariffMain",
      description:
        "Короткий текст під назвою тарифу над списком. Не дублюйте пункти з «Пунктів» — це окреме поле.",
    }),
    defineField({
      name: "isPopular",
      title: "Хіт продажу",
      type: "boolean",
      fieldset: "tariffMain",
      description:
        "Підсвічує картку як рекомендовану; краще обрати лише один тариф.",
      initialValue: false,
    }),
    defineField({
      name: "features",
      title: "Пункти",
      type: "array",
      fieldset: "tariffPackage",
      description:
        "Чек-лист послуг цього тарифу; порядок змінюється перетягуванням.",
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

export const landingPricingSectionType = defineType({
  name: "landingPricingSection",
  title: "Тарифи",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Текст над заголовком (eyebrow)",
      type: "string",
      description:
        "Мітка над заголовком секції дрібним верхнім регістром.",
    }),
    defineField({
      name: "heading",
      title: "Заголовок секції",
      type: "string",
      description:
        "Головний заголовок блоку «Тарифи».",
    }),
    defineField({
      name: "intro",
      title: "Вступний текст",
      type: "text",
      rows: 3,
      description:
        "Параграф під заголовком до перемикача тарифів.",
    }),
    defineField({
      name: "ctaText",
      title: "Текст над нижньою кнопкою",
      type: "text",
      rows: 3,
      description:
        "Текст над червоною кнопкою консультації внизу секції.",
    }),
    defineField({
      name: "globalButtonLabel",
      title: "Універсальний текст кнопок замовлення",
      type: "string",
      description:
        "Підпис на синіх кнопках «Замовити» біля ціни у кожній картці тарифу.",
    }),
    defineField({
      name: "tiers",
      title: "Пакети",
      type: "array",
      description:
        "Усі тарифні картки та їхні списки послуг.",
      of: [defineArrayMember({ type: pricingTierObject.name })],
    }),
  ],
});

export const pricingTierSchemaType = pricingTierObject;
