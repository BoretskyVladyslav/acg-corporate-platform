import type { SanityImageSource } from "@sanity/image-url";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityClient } from "next-sanity";
import { cache } from "react";

import { createLandingSanityClient } from "./landingSanityClient";

import type { AboutCompanyProps } from "@/src/components/blocks/AboutCompany";
import type { AdvantagesProps } from "@/src/components/blocks/Advantages";
import type { FAQProps } from "@/src/components/blocks/FAQ";
import type { LeadCaptureFormProps } from "@/src/components/blocks/LeadCaptureForm";
import type { PricingProps, PricingTier } from "@/src/components/blocks/Pricing";
import type { ServiceItem } from "@/src/components/blocks/Services";
import type { ServicesProps } from "@/src/components/blocks/Services";
import type { TrustBlockProps } from "@/src/components/blocks/TrustBlock";

import {
  landingPageQuery,
  type LandingAboutQueryResult,
  type LandingAdditionalServicesQueryResult,
  type LandingAdvantagesQueryResult,
  type LandingContactQueryResult,
  type LandingFaqQueryResult,
  type LandingHeroQueryResult,
  type LandingPageQueryResult,
  type LandingPricingQueryResult,
  type LandingServicesQueryResult,
  type LandingSeoQueryResult,
  type LandingTrustQueryResult,
} from "./queries";

type SanityUrlBuilder = ReturnType<typeof createImageUrlBuilder>;

/** Поля OG / title для Next.js Metadata (береться разом із контентом з одного GROQ). */
export type LandingSeoResolved = {
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  ogImageAlt?: string;
};

export type LandingHeroCardResolved = {
  title: string;
  subtitle: string;
};

export type LandingHeroPageProps = {
  heading?: string;
  subheading?: string;
  heroCards?: LandingHeroCardResolved[];
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  backgroundImageUrl?: string;
};

/** Дані блоку контактної форми з Sanity; порожні поля доповнює LeadCaptureForm. */
export type LandingContactResolved = Partial<LeadCaptureFormProps>;

/** Після мапінгу з вкладки «Додаткові послуги» документа лендингу. */
export type LandingAdditionalItemResolved = {
  title: string;
  description?: string;
  price?: string;
};

export type LandingAdditionalServicesResolved = {
  title?: string;
  subtitle?: string;
  items?: LandingAdditionalItemResolved[];
};

export type LandingPageData = {
  hero: LandingHeroPageProps;
  about: AboutCompanyProps;
  services: ServicesProps;
  additionalServices: LandingAdditionalServicesResolved;
  pricing: PricingProps;
  advantages: AdvantagesProps;
  trust: TrustBlockProps;
  faq: FAQProps;
  contact: LandingContactResolved;
  seo: LandingSeoResolved;
};

export const EMPTY_LANDING_PAGE: LandingPageData = {
  hero: {},
  about: {},
  services: {},
  additionalServices: {},
  pricing: {},
  advantages: {},
  trust: {},
  faq: {},
  contact: {},
  seo: {},
};

export async function fetchLandingPageDocument(
  client: SanityClient,
): Promise<LandingPageQueryResult> {
  return client.fetch<LandingPageQueryResult>(landingPageQuery);
}

export function mapLandingPageDocToLandingData(
  doc: LandingPageQueryResult,
  urlBuilder: SanityUrlBuilder,
): LandingPageData {
  if (!doc) {
    return EMPTY_LANDING_PAGE;
  }
  return {
    hero: mapHero(doc.hero, urlBuilder),
    about: mapAbout(doc.about),
    services: mapServices(doc.services),
    additionalServices: mapAdditionalServices(doc.additionalServices),
    pricing: mapPricing(doc.pricing),
    advantages: mapAdvantages(doc.advantages, urlBuilder),
    trust: mapTrust(doc.trust),
    faq: mapFaq(doc.faq),
    contact: mapContact(doc.contact),
    seo: mapSeo(doc.seo, urlBuilder),
  };
}

function pickNonEmpty(value: string | null | undefined): string | undefined {
  const t = value?.trim();
  return t ? t : undefined;
}

function sanityImageToResolved(
  urlBuilder: SanityUrlBuilder,
  image: Record<string, unknown> | null | undefined,
  width: number,
  /** Alt для фронтенду/next/image; у Studio окремого поля alt немає. */
  altFallback = "",
): { url: string; alt: string } | null {
  const src = image as SanityImageSource | null | undefined;
  if (!src || typeof src !== "object" || !("asset" in src) || !src.asset) {
    return null;
  }
  const url = urlBuilder.image(src).width(width).auto("format").quality(88).url();
  const alt = typeof altFallback === "string" ? altFallback.trim() : "";
  return { url, alt };
}

function mapHero(
  doc: LandingHeroQueryResult | undefined,
  urlBuilder: SanityUrlBuilder,
): LandingHeroPageProps {
  if (!doc) return {};
  let backgroundImageUrl: string | undefined;
  const resolved = sanityImageToResolved(
    urlBuilder,
    doc.backgroundImage ?? undefined,
    1600,
    "",
  );
  if (resolved) {
    backgroundImageUrl = resolved.url;
  }
  const heroCards = doc.heroCards
    ?.map((row) => ({
      title: pickNonEmpty(row.title),
      subtitle: pickNonEmpty(row.subtitle),
    }))
    .filter(
      (row): row is LandingHeroCardResolved =>
        Boolean(row.title) && Boolean(row.subtitle),
    );
  return {
    heading: pickNonEmpty(doc.heading),
    subheading: pickNonEmpty(doc.subheading),
    heroCards: heroCards?.length ? heroCards : undefined,
    primaryCtaLabel: pickNonEmpty(doc.primaryCtaLabel),
    secondaryCtaLabel: pickNonEmpty(doc.secondaryCtaLabel),
    backgroundImageUrl,
  };
}

function mapAbout(doc: LandingAboutQueryResult | undefined): AboutCompanyProps {
  if (!doc) return {};
  const metrics = doc.metrics
    ?.map((m) => ({
      label: pickNonEmpty(m.label),
      value: pickNonEmpty(m.value),
    }))
    .filter((m) => m.label !== undefined || m.value !== undefined);
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    body: pickNonEmpty(doc.body),
    metrics: metrics?.length ? metrics : undefined,
  };
}

function mapServices(doc: LandingServicesQueryResult | undefined): ServicesProps {
  if (!doc) return {};
  const items = doc.items
    ?.map((it) => ({
      title: pickNonEmpty(it.title),
      description: pickNonEmpty(it.description),
      note: pickNonEmpty(it.note),
      icon: pickNonEmpty(it.icon),
    }))
    .filter((it) => Boolean(it.title));
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    intro: pickNonEmpty(doc.intro),
    items: items?.length ? items : undefined,
  };
}

function mapAdditionalServices(
  doc: LandingAdditionalServicesQueryResult | undefined,
): LandingAdditionalServicesResolved {
  if (!doc) return {};
  const rawItems =
    doc.items?.map((it) => ({
      title: pickNonEmpty(it.title),
      description: pickNonEmpty(it.description),
      price: pickNonEmpty(it.price),
    })) ?? [];
  const items: LandingAdditionalItemResolved[] = [];
  for (const row of rawItems) {
    if (!row.title) continue;
    items.push({
      title: row.title,
      ...(row.description ? { description: row.description } : {}),
      ...(row.price ? { price: row.price } : {}),
    });
  }
  return {
    title: pickNonEmpty(doc.title),
    subtitle: pickNonEmpty(doc.subtitle),
    items: items.length ? items : undefined,
  };
}

/** Нові масиви `features` як картки; сумісність зі старими рядками / `{text}`. */
function normalizePricingFeatureItems(raw: unknown): ServiceItem[] {
  if (!Array.isArray(raw)) return [];
  const out: ServiceItem[] = [];
  for (const item of raw) {
    if (item == null) continue;
    if (typeof item === "string") {
      const t = item.trim();
      if (t) out.push({ title: t });
      continue;
    }
    if (typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if ("text" in o) {
      const line = pickNonEmpty(
        typeof o.text === "string"
          ? o.text
          : String(o.text ?? ""),
      );
      if (line) out.push({ title: line });
      continue;
    }
    const title = pickNonEmpty(o.title as string | null | undefined);
    const description = pickNonEmpty(o.description as string | null | undefined);
    const note = pickNonEmpty(o.note as string | null | undefined);
    const icon = pickNonEmpty(o.icon as string | null | undefined);
    const isHeader = o.isHeader === true;
    if (!title && !description && note) {
      out.push({ title: note });
      continue;
    }
    const head = title ?? description ?? note;
    if (!head) continue;
    out.push({
      title: title ?? description ?? note,
      description: title && description ? description : undefined,
      note: note ?? undefined,
      ...(icon ? { icon } : {}),
      ...(isHeader ? { isHeader: true } : {}),
    });
  }
  return out;
}

function mapPricing(doc: LandingPricingQueryResult | undefined): PricingProps {
  if (!doc) return {};
  const tiers: PricingTier[] = [];
  for (const tier of doc.tiers ?? []) {
    const name = pickNonEmpty(tier.name);
    if (!name) continue;
    const featuresRaw = normalizePricingFeatureItems(tier.features);
    const priceText = pickNonEmpty(tier.priceText);
    tiers.push({
      name,
      priceText,
      description: pickNonEmpty(tier.description),
      features: featuresRaw.length ? featuresRaw : undefined,
      isPopular: tier.isPopular === true,
    });
  }
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    intro: pickNonEmpty(doc.intro),
    ctaText: pickNonEmpty(doc.ctaText),
    globalButtonLabel: pickNonEmpty(doc.globalButtonLabel),
    tiers: tiers.length ? tiers : undefined,
  };
}

function mapAdvantages(
  doc: LandingAdvantagesQueryResult | undefined,
  urlBuilder: SanityUrlBuilder,
): AdvantagesProps {
  if (!doc) return {};
  const items = doc.items
    ?.map((row) => ({
      title: pickNonEmpty(row.title) ?? "",
      description: pickNonEmpty(row.description) ?? "",
    }))
    .filter((row) => row.title && row.description);
  let sideImageUrl: string | undefined;
  let sideImageAlt: string | undefined;
  const sectionImageAlt =
    pickNonEmpty(doc.heading) ?? pickNonEmpty(doc.eyebrow) ?? "";
  const img = sanityImageToResolved(
    urlBuilder,
    doc.sideImage ?? undefined,
    1200,
    sectionImageAlt,
  );
  if (img) {
    sideImageUrl = img.url;
    sideImageAlt = img.alt;
  }
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    items: items?.length ? items : undefined,
    sideImageUrl,
    sideImageAlt,
  };
}

function mapTrust(doc: LandingTrustQueryResult | undefined): TrustBlockProps {
  if (!doc) return {};
  const quotes = doc.quotes
    ?.map((q) => {
      let rating: number | undefined;
      if (typeof q.rating === "number" && Number.isFinite(q.rating)) {
        rating = Math.min(5, Math.max(1, Math.round(q.rating)));
      }
      return {
        quote: pickNonEmpty(q.quote),
        author: pickNonEmpty(q.author),
        ...(rating !== undefined ? { rating } : {}),
      };
    })
    .filter((q) => Boolean(q.quote));
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    intro: pickNonEmpty(doc.intro),
    googleRatingScore: pickNonEmpty(doc.googleRatingScore),
    googleReviewsLabel: pickNonEmpty(doc.googleReviewsLabel),
    quotes: quotes?.length ? quotes : undefined,
  };
}

function mapFaq(doc: LandingFaqQueryResult | undefined): FAQProps {
  if (!doc) return {};
  const items = doc.items
    ?.map((row) => ({
      question: pickNonEmpty(row.question),
      answer: pickNonEmpty(row.answer),
    }))
    .filter((row) => Boolean(row.question) && Boolean(row.answer));
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    intro: pickNonEmpty(doc.intro),
    items: items?.length ? items : undefined,
    footerButtonText: pickNonEmpty(doc.footerButtonText),
    footerNote: pickNonEmpty(doc.footerNote),
  };
}

function mapContact(doc: LandingContactQueryResult | undefined): LandingContactResolved {
  if (!doc) return {};
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    description: pickNonEmpty(doc.description),
    submitLabel: pickNonEmpty(doc.submitLabel),
    addressLine: pickNonEmpty(doc.addressLine),
    phoneDisplay: pickNonEmpty(doc.phoneDisplay),
    service: pickNonEmpty(doc.service),
  };
}

function mapSeo(
  doc: LandingSeoQueryResult | undefined,
  urlBuilder: SanityUrlBuilder,
): LandingSeoResolved {
  if (!doc) return {};
  const metaTitle = pickNonEmpty(doc.metaTitle);
  const metaDescription = pickNonEmpty(doc.metaDescription);
  const ogResolved = sanityImageToResolved(
    urlBuilder,
    doc.ogImage ?? undefined,
    1200,
    pickNonEmpty(doc.metaTitle) ?? "",
  );
  return {
    metaTitle,
    metaDescription,
    ogImageUrl: ogResolved?.url,
    ogImageAlt: ogResolved?.alt,
  };
}

/** Один GROQ-запит + мапінг; без кешування (для скриптів). */
export async function loadLandingPageDataUncached(): Promise<LandingPageData> {
  const client = createLandingSanityClient();
  if (!client) {
    return EMPTY_LANDING_PAGE;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) {
    return EMPTY_LANDING_PAGE;
  }

  try {
    const urlBuilder = createImageUrlBuilder({ projectId, dataset });
    const doc = await fetchLandingPageDocument(client);
    return mapLandingPageDocToLandingData(doc, urlBuilder);
  } catch {
    return EMPTY_LANDING_PAGE;
  }
}

/** Дедуплікація між `generateMetadata` і кореневою сторінкою в одному запиті. */
export const loadLandingPageForHome = cache(loadLandingPageDataUncached);

/** Поля Героя з вкладки Hero документа `landingPageSingleton`. */
export async function fetchHeroFromSanity(): Promise<LandingHeroPageProps> {
  const client = createLandingSanityClient();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!client || !projectId || !dataset) {
    return {};
  }

  try {
    const urlBuilder = createImageUrlBuilder({ projectId, dataset });
    const doc = await fetchLandingPageDocument(client);
    return mapHero(doc?.hero ?? null, urlBuilder);
  } catch {
    return {};
  }
}
