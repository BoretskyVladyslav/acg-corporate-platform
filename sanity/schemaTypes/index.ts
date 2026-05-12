import { type SchemaTypeDefinition } from "sanity";

import { aboutCompanyMetricType, landingAboutType } from "./landingAbout";
import { advantageItemType, landingAdvantagesType } from "./landingAdvantages";
import { faqFooterLinkType, faqItemType, landingFaqType } from "./landingFaq";
import { landingHeroType } from "./landingHero";
import {
  landingPricingType,
  pricingFeatureLineType,
  pricingTierSchemaType,
} from "./landingPricing";
import { landingServicesType, servicesCardType } from "./landingServices";
import {
  landingTrustType,
  trustPartnerLogoType,
  trustQuoteType,
} from "./landingTrust";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    aboutCompanyMetricType,
    landingAboutType,
    servicesCardType,
    landingServicesType,
    pricingFeatureLineType,
    pricingTierSchemaType,
    landingPricingType,
    advantageItemType,
    landingAdvantagesType,
    trustQuoteType,
    trustPartnerLogoType,
    landingTrustType,
    faqItemType,
    faqFooterLinkType,
    landingFaqType,
    landingHeroType,
  ],
};
