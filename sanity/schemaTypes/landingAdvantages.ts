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
      description:
        "Коротка назва: 2–4 слова. Відображається жирним над описом (наприклад «Прозоре ціноутворення»).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Детальний опис",
      type: "text",
      rows: 4,
      description:
        "2–3 речення, що розкривають суть переваги. Відображається звичайним текстом під заголовком.",
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
      description:
        "Маленький рядок над основним заголовком: 1–2 слова (наприклад «Переваги»). Якщо порожньо — показується дефолт «Переваги».",
    }),
    defineField({
      name: "heading",
      title: "Заголовок секції",
      type: "string",
      description:
        "Головний заголовок блоку (наприклад «Чому нас обирають»). Якщо порожньо — показується дефолт.",
    }),
    defineField({
      name: "sideImage",
      title: "Зображення поруч зі списком",
      type: "image",
      options: { hotspot: true },
      description:
        "Фото або ілюстрація, що відображається ліворуч від списку переваг. Рекомендований розмір: 900×700 px, прозорий фон (PNG). Якщо не завантажено — використовується дефолтне зображення команди.",
    }),
    defineField({
      name: "items",
      title: "Список переваг (до 6)",
      type: "array",
      of: [defineArrayMember({ type: advantageItemObject.name })],
      description:
        "Кожна перевага відображається як окремий блок із порядковим номером, заголовком та описом. Порядок змінюється перетягуванням. Якщо список порожній — показуються 4 дефолтних пункти.",
      validation: (Rule) => Rule.max(6),
    }),
  ],
});

export const advantageItemType = advantageItemObject;
