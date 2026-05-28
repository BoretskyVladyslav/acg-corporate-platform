import { defineField, defineType } from "sanity";

/**
 * Єдиний документ лендингу; секції збігаються з блоками на сайті.
 * Порядок вкладок відповідає порядку відображення секцій на сторінці.
 */
export const landingPageType = defineType({
  name: "landingPage",
  title: "Головна сторінка (лендинг)",
  type: "document",
  groups: [
    { name: "hero", title: "🏠 Hero — Перший екран", default: true },
    { name: "about", title: "📊 Про компанію" },
    { name: "advantages", title: "✅ Переваги" },
    { name: "pricing", title: "💰 Тарифи" },
    { name: "trust", title: "⭐ Відгуки" },
    { name: "contact", title: "📞 Форма / Контакти" },
    { name: "faq", title: "❓ FAQ" },
    { name: "seo", title: "🔍 SEO та метатеги" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Перший екран (Hero)",
      type: "landingHeroSection",
      group: "hero",
      description:
        "Заголовок, підзаголовок, навігаційні картки та кнопки консультації.",
    }),
    defineField({
      name: "about",
      title: "Про компанію",
      type: "landingAboutSection",
      group: "about",
      description:
        "Текст про компанію та 4 плашки-показники (клієнти, роки, послуги, контроль).",
    }),
    defineField({
      name: "advantages",
      title: "Переваги",
      type: "landingAdvantagesSection",
      group: "advantages",
      description:
        "Список переваг компанії з заголовком та зображенням праворуч.",
    }),
    defineField({
      name: "pricing",
      title: "Тарифи",
      type: "landingPricingSection",
      group: "pricing",
      description:
        "Тарифні пакети: Консультація, Реєстрація ФОП, Бухгалтерія ФОП/ТОВ, Інші послуги.",
    }),
    defineField({
      name: "trust",
      title: "Відгуки клієнтів",
      type: "landingTrustSection",
      group: "trust",
      description:
        "Рейтинг Google, відгуки клієнтів у вигляді карток.",
    }),
    defineField({
      name: "contact",
      title: "Форма замовлення та контакти",
      type: "landingContactSection",
      group: "contact",
      description:
        "Тексти для форми зворотнього зв'язку, адреса та телефон для відображення.",
    }),
    defineField({
      name: "faq",
      title: "Часті запитання (FAQ)",
      type: "landingFaqSection",
      group: "faq",
      description:
        "Список питань і відповідей, кнопка консультації та нотатка у підвалі.",
    }),
    defineField({
      name: "seo",
      title: "SEO та метатеги",
      type: "landingSeoSection",
      group: "seo",
      description:
        "Заголовок вкладки браузера, мета-опис та OG-зображення для соцмереж.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Лендинг ACG Accounting" };
    },
  },
});
