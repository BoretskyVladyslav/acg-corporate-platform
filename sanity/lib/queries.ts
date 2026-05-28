import { groq } from "next-sanity";

/**
 * Один GROQ-запит для всього лендингу.
 * Структура відповідає секціям у src/app/page.tsx.
 *
 * Видалені секції: services, additionalServices
 * (вони не рендеряться на фронтенді).
 */
export const landingPageQuery = groq`
  *[_type == "landingPage" && _id == "landingPageSingleton"][0]{
    hero{
      heading,
      subheading,
      heroCards[]{title, subtitle},
      primaryButtonTitle,
      primaryButtonHint,
      secondaryButtonTitle,
      secondaryButtonHint,
      secondaryButtonPrice,
      backgroundImage
    },
    about{
      eyebrow,
      heading,
      body,
      metrics[]{value, label}
    },
    advantages{
      eyebrow,
      heading,
      sideImage,
      items[]{title, description}
    },
    pricing{
      eyebrow,
      heading,
      intro,
      ctaText,
      globalButtonLabel,
      tiers[]{
        name,
        priceText,
        description,
        features[]{title, description, note, icon, isHeader},
        isPopular
      }
    },
    trust{
      eyebrow,
      heading,
      intro,
      googleRatingScore,
      googleReviewsLabel,
      quotes[]{quote, author, rating, avatar}
    },
    contact{
      eyebrow,
      heading,
      description,
      submitLabel,
      addressLine,
      phoneDisplay
    },
    faq{
      eyebrow,
      heading,
      intro,
      items[]{question, answer},
      footerButtonText,
      footerNote
    },
    seo{
      metaTitle,
      metaDescription,
      ogImage
    }
  }
`;

// ─── TypeScript-типи відповідей GROQ ──────────────────────────────────────────

export type LandingHeroQueryResult = {
  heading?: string | null;
  subheading?: string | null;
  heroCards?: Array<{ title?: string | null; subtitle?: string | null }> | null;
  /** Кнопка 1 — Безкоштовна консультація */
  primaryButtonTitle?: string | null;
  primaryButtonHint?: string | null;
  /** Кнопка 2 — Платна консультація */
  secondaryButtonTitle?: string | null;
  secondaryButtonHint?: string | null;
  secondaryButtonPrice?: string | null;
  backgroundImage?: Record<string, unknown> | null;
} | null;

export type LandingAboutQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  metrics?: Array<{ value?: string | null; label?: string | null }> | null;
} | null;

export type LandingAdvantagesQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  sideImage?: Record<string, unknown> | null;
  items?: Array<{ title?: string | null; description?: string | null }> | null;
} | null;

export type LandingPricingQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  ctaText?: string | null;
  globalButtonLabel?: string | null;
  tiers?: Array<{
    name?: string | null;
    /** Повне відображення ціни (єдине поле в Studio). */
    priceText?: string | null;
    description?: string | null;
    features?:
      | Array<{
          title?: string | null;
          description?: string | null;
          note?: string | null;
          icon?: string | null;
          isHeader?: boolean | null;
        }>
      | null;
    isPopular?: boolean | null;
  }> | null;
} | null;

export type LandingTrustQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  googleRatingScore?: string | null;
  googleReviewsLabel?: string | null;
  quotes?: Array<{
    quote?: string | null;
    author?: string | null;
    rating?: number | null;
    avatar?: Record<string, unknown> | null;
  }> | null;
} | null;

export type LandingContactQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  submitLabel?: string | null;
  addressLine?: string | null;
  phoneDisplay?: string | null;
} | null;

export type LandingFaqQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  items?: Array<{ question?: string | null; answer?: string | null }> | null;
  footerButtonText?: string | null;
  footerNote?: string | null;
} | null;

export type LandingSeoQueryResult = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: Record<string, unknown> | null;
} | null;

export type LandingPageQueryResult = {
  hero?: LandingHeroQueryResult;
  about?: LandingAboutQueryResult;
  advantages?: LandingAdvantagesQueryResult;
  pricing?: LandingPricingQueryResult;
  trust?: LandingTrustQueryResult;
  contact?: LandingContactQueryResult;
  faq?: LandingFaqQueryResult;
  seo?: LandingSeoQueryResult;
} | null;
