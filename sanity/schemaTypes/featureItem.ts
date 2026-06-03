import {
  Check,
  Heading,
} from "lucide-react";
import { createElement } from "react";
import { defineField, defineType } from "sanity";

export const featureItemType = defineType({
  name: "featureItem",
  title: "Пункт",
  type: "object",
  fieldsets: [
    {
      name: "extras",
      title: "Додаткові деталі",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Назва",
      type: "string",
      description: "Назва послуги або заголовка",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isHeader",
      title: "Це заголовок підсекції?",
      type: "boolean",
      description: "Робить цей рядок підзаголовком у списку",
      initialValue: false,
    }),
    defineField({
      name: "isSubheading",
      title: "Це підзаголовок?",
      type: "boolean",
      description: "Увімкніть, щоб цей пункт виглядав як заголовок групи послуг (без галочки, жирним шрифтом)",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Опис",
      type: "text",
      rows: 4,
      fieldset: "extras",
      description: "Додатковий опис під назвою",
    }),
    defineField({
      name: "note",
      title: "Примітка",
      type: "text",
      rows: 2,
      fieldset: "extras",
      description: "Примітка (відображається над рискою)",
    }),
  ],
  preview: {
    select: { title: "title", isHeader: "isHeader", isSubheading: "isSubheading" },
    prepare({ title, isHeader, isSubheading }) {
      const label = title || "Без назви";
      if (isHeader === true || isSubheading === true) {
        return {
          title: label,
          media: () =>
            createElement(Heading, {
              width: 22,
              height: 22,
              strokeWidth: 2,
              "aria-hidden": true,
            }),
        };
      }

      return {
        title: label,
        media: () =>
          createElement(Check, {
            width: 22,
            height: 22,
            strokeWidth: 2,
            "aria-hidden": true,
          }),
      };
    },
  },
});
