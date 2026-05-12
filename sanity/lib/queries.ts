import { groq } from "next-sanity";

export const landingHeroQuery = groq`
  *[_type == "landingHero" && _id == "landingHeroSingleton"][0]{
    heading,
    subheading,
    primaryCtaLabel,
    secondaryCtaLabel,
    primaryCtaHref,
    secondaryCtaHref,
    backgroundImage
  }
`;

export const landingAboutQuery = groq`
  *[_type == "landingAbout" && _id == "landingAboutSingleton"][0]{
    sectionId,
    eyebrow,
    heading,
    body,
    metrics[]{label, value}
  }
`;

export const landingServicesQuery = groq`
  *[_type == "landingServices" && _id == "landingServicesSingleton"][0]{
    eyebrow,
    heading,
    intro,
    items[]{title, description, note}
  }
`;

export const landingPricingQuery = groq`
  *[_type == "landingPricing" && _id == "landingPricingSingleton"][0]{
    eyebrow,
    heading,
    intro,
    tiers[]{
      name,
      price,
      cadence,
      description,
      features[]{text},
      ctaLabel,
      ctaHref,
      highlighted
    }
  }
`;

export const landingAdvantagesQuery = groq`
  *[_type == "landingAdvantages" && _id == "landingAdvantagesSingleton"][0]{
    eyebrow,
    heading,
    sideImage,
    items[]{title, description}
  }
`;

export const landingTrustQuery = groq`
  *[_type == "landingTrust" && _id == "landingTrustSingleton"][0]{
    eyebrow,
    heading,
    intro,
    googleRatingScore,
    googleReviewsLabel,
    logosSectionTitle,
    quotes[]{quote, author, role},
    logos[]{name, logo}
  }
`;

export const landingFaqQuery = groq`
  *[_type == "landingFaq" && _id == "landingFaqSingleton"][0]{
    eyebrow,
    heading,
    intro,
    items[]{question, answer},
    footerNote,
    footerLinks[]{label, href}
  }
`;

export type LandingHeroQueryResult = {
  heading?: string | null;
  subheading?: string | null;
  primaryCtaLabel?: string | null;
  secondaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  secondaryCtaHref?: string | null;
  backgroundImage?: Record<string, unknown> | null;
} | null;

export type LandingAboutQueryResult = {
  sectionId?: string | null;
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
  }> | null;
} | null;

export type LandingPricingQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  tiers?: Array<{
    name?: string | null;
    price?: string | null;
    cadence?: string | null;
    description?: string | null;
    features?: Array<{ text?: string | null }> | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    highlighted?: boolean | null;
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
  logosSectionTitle?: string | null;
  quotes?: Array<{
    quote?: string | null;
    author?: string | null;
    role?: string | null;
  }> | null;
  logos?: Array<{
    name?: string | null;
    logo?: Record<string, unknown> | null;
  }> | null;
} | null;

export type LandingFaqQueryResult = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  items?: Array<{ question?: string | null; answer?: string | null }> | null;
  footerNote?: string | null;
  footerLinks?: Array<{ label?: string | null; href?: string | null }> | null;
} | null;
