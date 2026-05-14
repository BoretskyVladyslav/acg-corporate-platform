import { type SchemaTypeDefinition } from "sanity";

import { aboutCompanyMetricType, landingAboutSectionType } from "./landingAbout";
import {
  advantageItemType,
  landingAdvantagesSectionType,
} from "./landingAdvantages";
import { featureItemType } from "./featureItem";
import { faqItemType, landingFaqSectionType } from "./landingFaq";
import { heroCardItemType, landingHeroSectionType } from "./hero";
import { landingContactSectionType } from "./landingContact";
import { landingPageType } from "./landingPage";
import {
  landingPricingSectionType,
  pricingTierSchemaType,
} from "./landingPricing";
import { landingServicesSectionType } from "./landingServices";
import { landingSeoSectionType } from "./landingSeo";
import { landingTrustSectionType, trustQuoteType } from "./landingTrust";

/**
 * Спочатку вкладені object-типи та секційні блоки, потім документ `landingPage`.
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    aboutCompanyMetricType,
    featureItemType,
    pricingTierSchemaType,
    advantageItemType,
    trustQuoteType,
    faqItemType,
    heroCardItemType,
    landingHeroSectionType,
    landingAboutSectionType,
    landingServicesSectionType,
    landingPricingSectionType,
    landingAdvantagesSectionType,
    landingTrustSectionType,
    landingContactSectionType,
    landingFaqSectionType,
    landingSeoSectionType,
    landingPageType,
  ],
};
