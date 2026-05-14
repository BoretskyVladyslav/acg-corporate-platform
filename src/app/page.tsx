import type { Metadata } from "next";

import AboutCompany from "@/src/components/blocks/AboutCompany";
import Advantages from "@/src/components/blocks/Advantages";
import FAQ from "@/src/components/blocks/FAQ";
import Hero from "@/src/components/blocks/Hero";
import LeadCaptureForm from "@/src/components/blocks/LeadCaptureForm";
import Pricing from "@/src/components/blocks/Pricing";
import Services from "@/src/components/blocks/Services";
import TrustBlock from "@/src/components/blocks/TrustBlock";
import SiteHeader from "@/src/components/SiteHeader";
import { loadLandingPageForHome } from "@/sanity/lib/loadLandingPage";

/** Свіжі дані з Sanity при кожному запиті (без знімка збірки). */
export const dynamic = "force-dynamic";

const FALLBACK_SITE_TITLE = "ACG";
const FALLBACK_SITE_DESCRIPTION = "Landing page";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await loadLandingPageForHome();
  const title = seo.metaTitle?.trim() ?? FALLBACK_SITE_TITLE;
  const description = seo.metaDescription?.trim() ?? FALLBACK_SITE_DESCRIPTION;
  const meta: Metadata = { title, description };
  const ogUrl = seo.ogImageUrl?.trim();
  if (ogUrl) {
    meta.openGraph = {
      title,
      description,
      images: [
        {
          url: ogUrl,
          ...(seo.ogImageAlt?.trim()
            ? { alt: seo.ogImageAlt.trim() }
            : {}),
        },
      ],
    };
  }
  return meta;
}

export default async function Home() {
  const { hero, about, services, pricing, advantages, trust, faq, contact } =
    await loadLandingPageForHome();

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <SiteHeader />
      <main className="min-w-0 flex-1 overflow-x-clip">
        <Hero {...hero} />
        <AboutCompany {...about} />
        <Services {...services} />
        <Pricing {...pricing} /> 
        <Advantages {...advantages} />
        <TrustBlock {...trust} />
        <LeadCaptureForm {...contact} />
        <FAQ {...faq} phoneDisplay={contact.phoneDisplay} />
      </main>
    </div>
  );
}
