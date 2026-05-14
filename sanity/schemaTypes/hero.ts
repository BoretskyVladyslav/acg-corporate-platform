import { defineArrayMember, defineField, defineType } from "sanity";

/** Тексти збігаються з дефолтами в `resolveHeroProps` / `HeroClient`. Дії кнопок задаються в коді. */
const HEADING_DEFAULT =
  "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.";

const PRIMARY_CTA_DEFAULT = "ОТРИМАТИ ПЕРВИННУ КОНСУЛЬТАЦІЮ БЕЗКОШТОВНО";
const SECONDARY_CTA_DEFAULT = "ШВИДКА ВІДПОВІДЬ У TELEGRAM";

const heroCardItemObject = defineType({
  name: "heroCardItem",
  title: "Картка-кнопка",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Підзаголовок",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const landingHeroSectionType = defineType({
  name: "landingHeroSection",
  title: "Hero секція",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Головний заголовок",
      type: "string",
      description:
        "Рядок або текст із розділювачем «—» для двох рядків заголовка (як у поточному макеті).",
      initialValue: HEADING_DEFAULT,
    }),
    defineField({
      name: "subheading",
      title: "Підзаголовок",
      type: "text",
      rows: 4,
      initialValue: "",
    }),
    defineField({
      name: "heroCards",
      title: "Картки-кнопки під заголовком",
      type: "array",
      of: [defineArrayMember({ type: heroCardItemObject.name })],
      description:
        "Тільки текст; дії при кліку (тарифи / послуги) задаються на сайті по порядку карток.",
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Текст основної кнопки",
      type: "string",
      description: "Наприклад: отримати консультацію.",
      initialValue: PRIMARY_CTA_DEFAULT,
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Текст другої кнопки (Telegram)",
      type: "string",
      description: "Текст посилання на Telegram; URL задається в коді / env.",
      initialValue: SECONDARY_CTA_DEFAULT,
    }),
    defineField({
      name: "backgroundImage",
      title: "Основне зображення",
      type: "image",
      description: "Візуальне зображення в секції Hero.",
      options: { hotspot: true },
    }),
  ],
});

export const heroCardItemType = heroCardItemObject;
