import type { Metadata } from "next";

import AboutCompany from "@/src/components/blocks/AboutCompany";
import Advantages from "@/src/components/blocks/Advantages";
import FAQ from "@/src/components/blocks/FAQ";
import Hero from "@/src/components/blocks/Hero";
import LeadCaptureForm from "@/src/components/blocks/LeadCaptureForm";
import Pricing from "@/src/components/blocks/Pricing";
import TrustBlock from "@/src/components/blocks/TrustBlock";
import SiteFooter from "@/src/components/SiteFooter";
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
  const { hero, about, advantages, pricing, trust, faq, contact } =
    await loadLandingPageForHome();

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <SiteHeader />
      <main className="min-w-0 flex-1 overflow-x-clip">
        {/* Hero — перший екран із заголовком та кнопками */}
        <Hero {...hero} />

        {/* Про компанію — текст та показники */}
        <AboutCompany {...about} />

        {/* Переваги — список із зображенням */}
        <Advantages {...advantages} />

        {/* Тарифи — навігація по пакетах */}
        <Pricing {...pricing} />

        {/* Відгуки клієнтів */}
        <TrustBlock {...trust} />

        {/* Форма «Швидкий дзвінок» */}
        <LeadCaptureForm
          {...contact}
          sectionId="quick-call"
          title="Швидкий дзвінок"
          subtitle="Залиште номер, і ми зателефонуємо у зручний для вас час"
        />

        {/* Часті запитання */}
        <FAQ {...faq} />

        {/* Форма «Замовити консультацію» */}
        <LeadCaptureForm
          {...contact}
          sectionId="contact"
          title="Замовити консультацію"
          subtitle="Залишіть заявку, і наші спеціалісти зв'яжуться з вами"
        />
      </main>
      <SiteFooter
        phoneDisplay={contact.phoneDisplay}
        footerNote={faq.footerNote}
      />
    </div>
  );
}
