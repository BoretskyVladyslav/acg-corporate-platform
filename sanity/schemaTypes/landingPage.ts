import { defineField, defineType } from "sanity";

/** Єдиний документ лендингу; секції збігаються з блоками на сайті й вирівняні вкладками (groups). */
export const landingPageType = defineType({
  name: "landingPage",
  title: "Головна сторінка (лендинг)",
  type: "document",
  groups: [
    { name: "hero", title: "Головний екран (Hero)", default: true },
    { name: "about", title: "Про компанію" },
    { name: "services", title: "Послуги" },
    { name: "pricing", title: "Тарифи" },
    { name: "advantages", title: "Переваги" },
    { name: "trust", title: "Довіра та відгуки" },
    { name: "contact", title: "Форма / контакти" },
    { name: "faq", title: "FAQ" },
    { name: "seo", title: "SEO та налаштування" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "landingHeroSection",
      group: "hero",
      description:
        "Перший екран із заголовком, кнопками та зображенням — відповідає блоку Hero на сайті.",
    }),
    defineField({
      name: "about",
      title: "Про компанію",
      type: "landingAboutSection",
      group: "about",
    }),
    defineField({
      name: "services",
      title: "Послуги",
      type: "landingServicesSection",
      group: "services",
    }),
    defineField({
      name: "pricing",
      title: "Тарифи",
      type: "landingPricingSection",
      group: "pricing",
    }),
    defineField({
      name: "advantages",
      title: "Переваги",
      type: "landingAdvantagesSection",
      group: "advantages",
    }),
    defineField({
      name: "trust",
      title: "Довіра та відгуки",
      type: "landingTrustSection",
      group: "trust",
    }),
    defineField({
      name: "contact",
      title: "Блок із формою замовлення",
      type: "landingContactSection",
      group: "contact",
      description:
        "Тексти та контакти біля форми («контактний блок», телефон, адреса) — як на сайті над формою.",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "landingFaqSection",
      group: "faq",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "landingSeoSection",
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Лендинг (головна)" };
    },
  },
});
