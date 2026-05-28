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
      description: "Заголовок, картки та кнопки",
    }),
    defineField({
      name: "about",
      title: "Про компанію",
      type: "landingAboutSection",
      group: "about",
      description: "Текст та статистика",
    }),
    defineField({
      name: "advantages",
      title: "Переваги",
      type: "landingAdvantagesSection",
      group: "advantages",
      description: "Список переваг",
    }),
    defineField({
      name: "pricing",
      title: "Тарифи",
      type: "landingPricingSection",
      group: "pricing",
      description: "Категорії та пакети тарифів",
    }),
    defineField({
      name: "trust",
      title: "Відгуки клієнтів",
      type: "landingTrustSection",
      group: "trust",
      description: "Google рейтинг та відгуки",
    }),
    defineField({
      name: "contact",
      title: "Форма замовлення та контакти",
      type: "landingContactSection",
      group: "contact",
      description: "Тексти форми та контакти",
    }),
    defineField({
      name: "faq",
      title: "Часті запитання (FAQ)",
      type: "landingFaqSection",
      group: "faq",
      description: "Питання, відповіді та CTA",
    }),
    defineField({
      name: "seo",
      title: "SEO та метатеги",
      type: "landingSeoSection",
      group: "seo",
      description: "Метатеги та OG зображення",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Лендинг ACG Accounting" };
    },
  },
});
