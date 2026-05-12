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

export default async function Home() {
  const { hero, about, services, pricing, advantages, trust, faq } =
    await loadLandingPageForHome();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main>
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
