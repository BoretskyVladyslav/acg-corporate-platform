import { defineField, defineType } from "sanity";

export const landingSeoSectionType = defineType({
  name: "landingSeoSection",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Title сторінки",
      type: "string",
      description: "Відображається у вкладці браузера та в пошуковій видачі.",
      validation: (Rule) => Rule.max(70).warning("Коротший title краще індексується"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Короткий опис для пошукових систем та соцмереж.",
      validation: (Rule) => Rule.max(180).warning("Оптимально ~150–160 символів"),
    }),
    defineField({
      name: "ogImage",
      title: "Зображення для превью (OG)",
      type: "image",
      description: "Картинка при шарінгу посилання у соцмережах.",
      options: { hotspot: true },
    }),
  ],
});
