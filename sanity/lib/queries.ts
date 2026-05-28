import { groq } from "next-sanity";

/** Один документ із усіма секціями лендингу та вкладками Studio. */
export const landingPageQuery = groq`
  *[_type == "landingPage" && _id == "landingPageSingleton"][0]{
    hero{
      heading,
      subheading,
      heroCards[]{title, subtitle},
      primaryCtaLabel,
      secondaryCtaLabel,
      backgroundImage
    },
    about{
      eyebrow,
      heading,
      body,
      metrics[]{label, value}
    },
    services{
      eyebrow,
      heading,
      intro,
      items[]{title, description, note, icon}
    },
    additionalServices{
      title,
      subtitle,
      items[]{title, description, price}
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
    advantages{
      eyebrow,
      heading,
      sideImage,
      items[]{title, description}
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

/** Плоскі форми вкладених блоків збігаються з минулими одиночними запитами для маперів. */

export type LandingHeroQueryResult = {
  heading?: string | null;
  subheading?: string | null;
  heroCards?: Array<{ title?: string | null; subtitle?: string | null }> | null;
  primaryCtaLabel?: string | null;
  secondaryCtaLabel?: string | null;
  backgroundImage?: Record<string, unknown> | null;
} | null;

export type LandingAboutQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  metrics?: Array<{ label?: string | null; value?: string | null }> | null;
} | null;

export type LandingServicesQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  items?: Array<{
    title?: string | null;
    description?: string | null;
    note?: string | null;
    icon?: string | null;
  }> | null;
} | null;

export type LandingAdditionalServicesQueryResult = {
  title?: string | null;
  subtitle?: string | null;
  items?: Array<{
    title?: string | null;
    description?: string | null;
    price?: string | null;
  }> | null;
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

export type LandingAdvantagesQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  sideImage?: Record<string, unknown> | null;
  items?: Array<{ title?: string | null; description?: string | null }> | null;
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

export type LandingFaqQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  items?: Array<{ question?: string | null; answer?: string | null }> | null;
  footerButtonText?: string | null;
  footerNote?: string | null;
} | null;

export type LandingContactQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  submitLabel?: string | null;
  addressLine?: string | null;
  phoneDisplay?: string | null;
} | null;

export type LandingSeoQueryResult = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: Record<string, unknown> | null;
} | null;

export type LandingPageQueryResult = {
  hero?: LandingHeroQueryResult;
  about?: LandingAboutQueryResult;
  services?: LandingServicesQueryResult;
  additionalServices?: LandingAdditionalServicesQueryResult;
  pricing?: LandingPricingQueryResult;
  advantages?: LandingAdvantagesQueryResult;
  trust?: LandingTrustQueryResult;
  contact?: LandingContactQueryResult;
  faq?: LandingFaqQueryResult;
  seo?: LandingSeoQueryResult;
} | null;
