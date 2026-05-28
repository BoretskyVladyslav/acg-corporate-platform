import { defineField, defineType } from "sanity";

/** Тексти та контакти для блоку з формою замовлення (LeadCaptureForm). */
export const landingContactSectionType = defineType({
  name: "landingContactSection",
  title: "Форма / контакти",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Текст над заголовком (eyebrow)",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Заголовок форми",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Опис під заголовком",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "submitLabel",
      title: "Текст кнопки відправки",
      type: "string",
    }),
    defineField({
      name: "addressLine",
      title: "Адреса (рядок для відображення)",
      type: "string",
    }),
    defineField({
      name: "phoneDisplay",
      title: "Телефон (як показати на сайті)",
      type: "string",
      description:
        "Номер для відображення та для дзвінка; посилання tel: збирається автоматично.",
    }),
  ],
});
