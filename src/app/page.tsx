import { createImageUrlBuilder } from "@sanity/image-url";

import AboutCompany from "@/src/components/blocks/AboutCompany";
import Advantages from "@/src/components/blocks/Advantages";
import FAQ from "@/src/components/blocks/FAQ";
import Hero from "@/src/components/blocks/Hero";
import LeadCaptureForm from "@/src/components/blocks/LeadCaptureForm";
import Pricing from "@/src/components/blocks/Pricing";
import Services from "@/src/components/blocks/Services";
import TrustBlock from "@/src/components/blocks/TrustBlock";
import SiteHeader from "@/src/components/SiteHeader";
import { createLandingSanityClient } from "@/sanity/lib/landingSanityClient";
import {
  EMPTY_LANDING_PAGE,
  fetchAllLandingDocuments,
  mapDocumentsToLandingPageData,
  type LandingPageData,
} from "@/sanity/lib/loadLandingPage";

/** Свіжі дані з Sanity при кожному запиті (без знімка збірки). */
export const dynamic = "force-dynamic";

export default async function Home() {
  let landing: LandingPageData = EMPTY_LANDING_PAGE;
  const client = createLandingSanityClient();

  if (client) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    if (projectId && dataset) {
      try {
        const urlBuilder = createImageUrlBuilder({ projectId, dataset });
        const docs = await fetchAllLandingDocuments(client);
        landing = mapDocumentsToLandingPageData(docs, urlBuilder);
      } catch {
        landing = EMPTY_LANDING_PAGE;
      }
    }
  }

  const { hero, about, services, pricing, advantages, trust, faq } = landing;

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <SiteHeader />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <Hero {...hero} />
        <AboutCompany {...about} />
        <Services {...services} />
        <Pricing {...pricing} />
        <Advantages {...advantages} />
        <TrustBlock {...trust} />
        <LeadCaptureForm />
        <FAQ {...faq} />
      </main>
    </div>
  );
}
