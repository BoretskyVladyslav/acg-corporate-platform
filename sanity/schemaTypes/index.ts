import { type SchemaTypeDefinition } from "sanity";

import { aboutCompanyMetricType, landingAboutType } from "./landingAbout";
import { advantageItemType, landingAdvantagesType } from "./landingAdvantages";
import { faqFooterLinkType, faqItemType, landingFaqType } from "./landingFaq";
import { landingHeroType } from "./hero";
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

/**
 * Усі object-типи першими, потім document-типи — стабільніша реєстрація в Studio.
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    aboutCompanyMetricType,
    servicesCardType,
    pricingFeatureLineType,
    pricingTierSchemaType,
    advantageItemType,
    trustQuoteType,
    trustPartnerLogoType,
    faqItemType,
    faqFooterLinkType,
    landingHeroType,
    landingAboutType,
    landingServicesType,
    landingPricingType,
    landingAdvantagesType,
    landingTrustType,
    landingFaqType,
  ],
};
