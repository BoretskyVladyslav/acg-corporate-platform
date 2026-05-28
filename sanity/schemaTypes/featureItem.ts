import {
  Briefcase,
  Building2,
  Calculator,
  Calendar,
  Check,
  FileSpreadsheet,
  FileText,
  Heading,
  Landmark,
  Mail,
  Phone,
  PiggyBank,
  Receipt,
  Scale,
  Shield,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";
import { defineField, defineType } from "sanity";

/** Значення мають збігатися з ключами у `src/lib/featureIcons.tsx`. */
const ICON_OPTIONS = [
  { title: "За замовчуванням", value: "" },
  { title: "Галочка", value: "check" },
  { title: "Документ", value: "fileText" },
  { title: "Калькулятор", value: "calculator" },
  { title: "Будівля / компанія", value: "building2" },
  { title: "Команда", value: "users" },
  { title: "Портфель", value: "briefcase" },
  { title: "Захист", value: "shield" },
  { title: "Рахунок / чек", value: "receipt" },
  { title: "Банк", value: "landmark" },
  { title: "Вага / юридичне", value: "scale" },
  { title: "Таблиця", value: "fileSpreadsheet" },
  { title: "Гаманець", value: "wallet" },
  { title: "Накопичення", value: "piggyBank" },
  { title: "Календар", value: "calendar" },
  { title: "Телефон", value: "phone" },
  { title: "Пошта", value: "mail" },
] as const;

/** Для прев’ю в масиві Studio (порядок ключів як у ICON_OPTIONS). */
const PREVIEW_ICON_BY_VALUE: Record<string, LucideIcon> = {
  "": Check,
  check: Check,
  fileText: FileText,
  calculator: Calculator,
  building2: Building2,
  users: Users,
  briefcase: Briefcase,
  shield: Shield,
  receipt: Receipt,
  landmark: Landmark,
  scale: Scale,
  fileSpreadsheet: FileSpreadsheet,
  wallet: Wallet,
  piggyBank: PiggyBank,
  calendar: Calendar,
  phone: Phone,
  mail: Mail,
};

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
      name: "icon",
      title: "Іконка",
      type: "string",
      description: "Опціональна іконка",
      options: {
        layout: "dropdown",
        list: [...ICON_OPTIONS],
      },
      initialValue: "",
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
    select: { title: "title", icon: "icon", isHeader: "isHeader", isSubheading: "isSubheading" },
    prepare({ title, icon, isHeader, isSubheading }) {
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
      const key = typeof icon === "string" ? icon.trim() : "";
      const Icon = PREVIEW_ICON_BY_VALUE[key] ?? Check;

      return {
        title: label,
        media: () =>
          createElement(Icon, {
            width: 22,
            height: 22,
            strokeWidth: 2,
            "aria-hidden": true,
          }),
      };
    },
  },
});
