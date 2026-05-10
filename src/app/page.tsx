import AboutCompany from "@/src/components/blocks/AboutCompany";
import Advantages from "@/src/components/blocks/Advantages";
import FAQ from "@/src/components/blocks/FAQ";
import Hero from "@/src/components/blocks/Hero";
import LeadCaptureForm from "@/src/components/blocks/LeadCaptureForm";
import Pricing from "@/src/components/blocks/Pricing";
import Services from "@/src/components/blocks/Services";
import TrustBlock from "@/src/components/blocks/TrustBlock";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main>
        <Hero />
        <AboutCompany />
        <Services />
        <Pricing />
        <Advantages />
        <TrustBlock />
        <LeadCaptureForm />
        <FAQ />
      </main>
    </div>
  );
}
