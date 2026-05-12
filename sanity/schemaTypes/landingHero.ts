import { defineField, defineType } from "sanity";

export const landingHeroType = defineType({
  name: "landingHero",
  title: "Hero лендингу",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Головний заголовок",
      type: "string",
      description:
        "Рядок або текст із розділювачем «—» для двох рядків заголовка (як у поточному макеті).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Підзаголовок",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Текст основної кнопки",
      type: "string",
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Текст другої кнопки",
      type: "string",
    }),
    defineField({
      name: "primaryCtaHref",
      title: "Посилання основної кнопки",
      type: "string",
      description: "Наприклад #contact",
    }),
    defineField({
      name: "secondaryCtaHref",
      title: "Посилання другої кнопки",
      type: "string",
      description: "Наприклад #about",
    }),
    defineField({
      name: "backgroundImage",
      title: "Фонове зображення",
      type: "image",
      description:
        "Основне візуальне зображення в колонці Hero (замість статичного файлу). Рекомендовано PNG/WebP з прозорістю або фото на світлому тлі.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-текст",
          type: "string",
          description: "Короткий опис для скрінрідерів і SEO.",
        }),
      ],
    }),
  ],
});
