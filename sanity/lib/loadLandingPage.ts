import type { SanityImageSource } from "@sanity/image-url";
import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";

import type { AboutCompanyProps } from "@/src/components/blocks/AboutCompany";
import type { AdvantagesProps } from "@/src/components/blocks/Advantages";
import type { FAQProps } from "@/src/components/blocks/FAQ";
import type { PricingProps, PricingTier } from "@/src/components/blocks/Pricing";
import type { ServicesProps } from "@/src/components/blocks/Services";
import type { TrustBlockProps } from "@/src/components/blocks/TrustBlock";

import {
  landingAboutQuery,
  landingAdvantagesQuery,
  landingFaqQuery,
  landingHeroQuery,
  landingPricingQuery,
  landingServicesQuery,
  landingTrustQuery,
  type LandingAboutQueryResult,
  type LandingAdvantagesQueryResult,
  type LandingFaqQueryResult,
  type LandingHeroQueryResult,
  type LandingPricingQueryResult,
  type LandingServicesQueryResult,
  type LandingTrustQueryResult,
} from "./queries";

type SanityUrlBuilder = ReturnType<typeof createImageUrlBuilder>;

const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-09";

export type LandingHeroPageProps = {
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
};

export type LandingPageData = {
  hero: LandingHeroPageProps;
  about: AboutCompanyProps;
  services: ServicesProps;
  pricing: PricingProps;
  advantages: AdvantagesProps;
  trust: TrustBlockProps;
  faq: FAQProps;
};

function pickNonEmpty(value: string | null | undefined): string | undefined {
  const t = value?.trim();
  return t ? t : undefined;
}

function sanityImageToResolved(
  urlBuilder: SanityUrlBuilder,
  image: Record<string, unknown> | null | undefined,
  width: number,
): { url: string; alt?: string } | null {
  const src = image as SanityImageSource | null | undefined;
  if (!src || typeof src !== "object" || !("asset" in src) || !src.asset) {
    return null;
  }
  const url = urlBuilder
    .image(src)
    .width(width)
    .auto("format")
    .quality(88)
    .url();
  const alt = pickNonEmpty((src as { alt?: string | null }).alt);
  return alt !== undefined ? { url, alt } : { url };
}

function mapHero(
  doc: LandingHeroQueryResult,
  urlBuilder: SanityUrlBuilder,
): LandingHeroPageProps {
  if (!doc) return {};
  let backgroundImageUrl: string | undefined;
  let backgroundImageAlt: string | undefined;
  const resolved = sanityImageToResolved(
    urlBuilder,
    doc.backgroundImage ?? undefined,
    1600,
  );
  if (resolved) {
    backgroundImageUrl = resolved.url;
    backgroundImageAlt = resolved.alt;
  }
  return {
    heading: pickNonEmpty(doc.heading),
    subheading: pickNonEmpty(doc.subheading),
    primaryCtaLabel: pickNonEmpty(doc.primaryCtaLabel),
    secondaryCtaLabel: pickNonEmpty(doc.secondaryCtaLabel),
    primaryCtaHref: pickNonEmpty(doc.primaryCtaHref),
    secondaryCtaHref: pickNonEmpty(doc.secondaryCtaHref),
    backgroundImageUrl,
    backgroundImageAlt,
  };
}

function mapAbout(doc: LandingAboutQueryResult): AboutCompanyProps {
  if (!doc) return {};
  const metrics = doc.metrics
    ?.map((m) => ({
      label: pickNonEmpty(m.label),
      value: pickNonEmpty(m.value),
    }))
    .filter((m) => m.label !== undefined || m.value !== undefined);
  return {
    id: pickNonEmpty(doc.sectionId),
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    body: pickNonEmpty(doc.body),
    metrics: metrics?.length ? metrics : undefined,
  };
}

function mapServices(doc: LandingServicesQueryResult): ServicesProps {
  if (!doc) return {};
  const items = doc.items
    ?.map((it) => ({
      title: pickNonEmpty(it.title),
      description: pickNonEmpty(it.description),
      note: pickNonEmpty(it.note),
    }))
    .filter((it) => Boolean(it.title));
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    intro: pickNonEmpty(doc.intro),
    items: items?.length ? items : undefined,
  };
}

function mapPricing(doc: LandingPricingQueryResult): PricingProps {
  if (!doc) return {};
  const tiers: PricingTier[] = [];
  for (const tier of doc.tiers ?? []) {
    const name = pickNonEmpty(tier.name);
    if (!name) continue;
    const features = (tier.features ?? [])
      .map((f) => pickNonEmpty(f?.text))
      .filter(Boolean) as string[];
    tiers.push({
      name,
      price: pickNonEmpty(tier.price),
      cadence: pickNonEmpty(tier.cadence),
      description: pickNonEmpty(tier.description),
      features: features.length ? features : undefined,
      ctaLabel: pickNonEmpty(tier.ctaLabel),
      ctaHref: pickNonEmpty(tier.ctaHref),
      highlighted: Boolean(tier.highlighted),
    });
  }
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    intro: pickNonEmpty(doc.intro),
    tiers: tiers.length ? tiers : undefined,
  };
}

function mapAdvantages(
  doc: LandingAdvantagesQueryResult,
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
  const img = sanityImageToResolved(
    urlBuilder,
    doc.sideImage ?? undefined,
    1200,
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

function mapTrust(
  doc: LandingTrustQueryResult,
  urlBuilder: SanityUrlBuilder,
): TrustBlockProps {
  if (!doc) return {};
  const quotes = doc.quotes
    ?.map((q) => ({
      quote: pickNonEmpty(q.quote),
      author: pickNonEmpty(q.author),
      role: pickNonEmpty(q.role),
    }))
    .filter((q) => Boolean(q.quote));
  const logos = doc.logos
    ?.map((row) => {
      const resolved = sanityImageToResolved(
        urlBuilder,
        row.logo ?? undefined,
        320,
      );
      return {
        name: pickNonEmpty(row.name),
        imageUrl: resolved?.url,
        imageAlt: resolved?.alt,
      };
    })
    .filter((logo) => Boolean(logo.name) || Boolean(logo.imageUrl));
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    intro: pickNonEmpty(doc.intro),
    googleRatingScore: pickNonEmpty(doc.googleRatingScore),
    googleReviewsLabel: pickNonEmpty(doc.googleReviewsLabel),
    logosSectionTitle: pickNonEmpty(doc.logosSectionTitle),
    quotes: quotes?.length ? quotes : undefined,
    logos: logos?.length ? logos : undefined,
  };
}

function mapFaq(doc: LandingFaqQueryResult): FAQProps {
  if (!doc) return {};
  const items = doc.items
    ?.map((row) => ({
      question: pickNonEmpty(row.question),
      answer: pickNonEmpty(row.answer),
    }))
    .filter((row) => Boolean(row.question) && Boolean(row.answer));
  const footerLinks = doc.footerLinks
    ?.map((link) => ({
      label: pickNonEmpty(link.label),
      href: pickNonEmpty(link.href),
    }))
    .filter((link) => Boolean(link.label) && Boolean(link.href));
  return {
    eyebrow: pickNonEmpty(doc.eyebrow),
    heading: pickNonEmpty(doc.heading),
    intro: pickNonEmpty(doc.intro),
    items: items?.length ? items : undefined,
    footerNote: pickNonEmpty(doc.footerNote),
    footerLinks: footerLinks?.length ? footerLinks : undefined,
  };
}

export async function loadLandingPageForHome(): Promise<LandingPageData> {
  const empty: LandingPageData = {
    hero: {},
    about: {},
    services: {},
    pricing: {},
    advantages: {},
    trust: {},
    faq: {},
  };

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return empty;
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });

    const urlBuilder = createImageUrlBuilder({ projectId, dataset });

    const [
      heroDoc,
      aboutDoc,
      servicesDoc,
      pricingDoc,
      advantagesDoc,
      trustDoc,
      faqDoc,
    ] = await Promise.all([
      client.fetch<LandingHeroQueryResult>(landingHeroQuery),
      client.fetch<LandingAboutQueryResult>(landingAboutQuery),
      client.fetch<LandingServicesQueryResult>(landingServicesQuery),
      client.fetch<LandingPricingQueryResult>(landingPricingQuery),
      client.fetch<LandingAdvantagesQueryResult>(landingAdvantagesQuery),
      client.fetch<LandingTrustQueryResult>(landingTrustQuery),
      client.fetch<LandingFaqQueryResult>(landingFaqQuery),
    ]);

    return {
      hero: mapHero(heroDoc, urlBuilder),
      about: mapAbout(aboutDoc),
      services: mapServices(servicesDoc),
      pricing: mapPricing(pricingDoc),
      advantages: mapAdvantages(advantagesDoc, urlBuilder),
      trust: mapTrust(trustDoc, urlBuilder),
      faq: mapFaq(faqDoc),
    };
  } catch {
    return empty;
  }
}
