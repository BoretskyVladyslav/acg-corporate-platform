import { defineArrayMember, defineField, defineType } from "sanity";

/** Тексти збігаються з дефолтами в `resolveHeroProps` / `HeroClient`. Дії кнопок задаються в коді. */
const HEADING_DEFAULT =
  "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.";

const PRIMARY_CTA_DEFAULT = "ОТРИМАТИ ПЕРВИНУ КОНСУЛЬТАЦІЮ БЕЗКОШТОВНО";
const SECONDARY_CTA_DEFAULT = "КОНСУЛЬТАЦІЯ";

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
        "Лише підзаголовок картки (subtitle) підмінюється з CMS. Заголовок (title) та якір прокрутки (#pricing) зафіксовані в коді. Порядок: 1 — Реєстрація ФОП, 2 — Бухгалтерія ФОП, 3 — Бухгалтерія ТОВ, 4 — Інші послуги.",
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Текст основної кнопки (безкоштовна консультація)",
      type: "string",
      description:
        "Кнопка відкриває модалку «Безкоштовна консультація». Якщо порожньо — використовується захардкоджений текст.",
      initialValue: PRIMARY_CTA_DEFAULT,
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Текст другої кнопки (платна консультація)",
      type: "string",
      description:
        "Кнопка відкриває модалку «Платна консультація». Якщо порожньо — використовується захардкоджений текст.",
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
