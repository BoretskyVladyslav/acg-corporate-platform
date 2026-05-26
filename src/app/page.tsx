import type { Metadata } from "next";

import AboutCompany from "@/src/components/blocks/AboutCompany";
import AdditionalServices from "@/src/components/blocks/AdditionalServices";
import Advantages from "@/src/components/blocks/Advantages";
import FAQ from "@/src/components/blocks/FAQ";
import Hero from "@/src/components/blocks/Hero";
import LeadCaptureForm from "@/src/components/blocks/LeadCaptureForm";
import Pricing from "@/src/components/blocks/Pricing";
import Services from "@/src/components/blocks/Services";
import TrustBlock from "@/src/components/blocks/TrustBlock";
import SiteHeader from "@/src/components/SiteHeader";
import { loadLandingPageForHome } from "@/sanity/lib/loadLandingPage";
import {
  OG_IMAGE_DEFAULT_ALT,
  OG_IMAGE_PATH,
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
} from "@/src/lib/siteMetadata";

/** Свіжі дані з Sanity при кожному запиті (без знімка збірки). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await loadLandingPageForHome();
  const title = seo.metaTitle?.trim() ?? SITE_DEFAULT_TITLE;
  const description = seo.metaDescription?.trim() ?? SITE_DEFAULT_DESCRIPTION;
  const cmsOg = seo.ogImageUrl?.trim();
  const imageUrl = cmsOg ?? OG_IMAGE_PATH;
  const imageAlt = cmsOg
    ? seo.ogImageAlt?.trim() || title
    : OG_IMAGE_DEFAULT_ALT;

  const meta: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/",
      siteName: "ACG",
      locale: "uk_UA",
      type: "website",
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };

  return meta;
}

export default async function Home() {
  const {
    hero,
    about,
    services,
    additionalServices,
    pricing,
    advantages,
    trust,
    faq,
    contact,
  } = await loadLandingPageForHome();

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <SiteHeader />
      <main className="min-w-0 flex-1 overflow-x-clip">
        <Hero {...hero} />
        <AboutCompany {...about} />
        <Advantages {...advantages} />
        <Pricing {...pricing} />
        <Services {...services} />
        <TrustBlock {...trust} />
        <LeadCaptureForm {...contact} />
        <AdditionalServices {...additionalServices} />
        <FAQ {...faq} phoneDisplay={contact.phoneDisplay} />
      </main>
    </div>
  );
}
