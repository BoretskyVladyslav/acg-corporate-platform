import { defineField, defineType } from "sanity";

/** Тексти збігаються з дефолтами в `resolveHeroProps` / `HeroClient`. */
const HEADING_DEFAULT =
  "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.";

const PRIMARY_CTA_DEFAULT = "ОТРИМАТИ ПЕРВИННУ КОНСУЛЬТАЦІЮ БЕЗКОШТОВНО";
const SECONDARY_CTA_DEFAULT = "ШВИДКА ВІДПОВІДЬ У TELEGRAM";

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
      initialValue: HEADING_DEFAULT,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Підзаголовок",
      type: "text",
      rows: 4,
      initialValue: "",
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Текст основної кнопки",
      type: "string",
      initialValue: PRIMARY_CTA_DEFAULT,
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Текст другої кнопки",
      type: "string",
      initialValue: SECONDARY_CTA_DEFAULT,
    }),
    defineField({
      name: "telegramLink",
      title: "Посилання на Telegram бота/менеджера",
      type: "url",
      description:
        "Відкривається в новій вкладці (кнопка «Швидка відповідь у Telegram»).",
    }),
    defineField({
      name: "primaryCtaHref",
      title: "Посилання основної кнопки",
      type: "string",
      description: "Наприклад #contact",
      initialValue: "#contact",
    }),
    defineField({
      name: "secondaryCtaHref",
      title: "Посилання другої кнопки",
      type: "string",
      description:
        "Telegram або інше посилання; у продакшені часто береться з NEXT_PUBLIC_TELEGRAM_URL.",
      initialValue: "#contact",
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
          initialValue: "Експерт бухгалтерського супроводу",
        }),
      ],
    }),
  ],
});
