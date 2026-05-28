import { type SchemaTypeDefinition } from "sanity";

import { aboutCompanyMetricType, landingAboutSectionType } from "./landingAbout";
import {
  advantageItemType,
  landingAdvantagesSectionType,
} from "./landingAdvantages";
import { featureItemType } from "./featureItem";
import { faqItemType, landingFaqSectionType } from "./landingFaq";
import { heroCardItemType, landingHeroSectionType, mainButtonType } from "./hero";
import { landingContactSectionType } from "./landingContact";
import { landingPageType } from "./landingPage";
import {
  landingPricingSectionType,
  pricingCategorySchemaType,
  pricingTierSchemaType,
} from "./landingPricing";
import { landingSeoSectionType } from "./landingSeo";
import { landingTrustSectionType, trustQuoteType } from "./landingTrust";

/**
 * Порядок: спочатку вкладені object-типи (без document),
 * потім секційні блоки, в кінці — документ `landingPage`.
 *
 * Секції Services та AdditionalServices видалено — вони не рендеряться
 * на фронтенді (src/app/page.tsx).
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // ── Вкладені об'єкти (підтипи масивів) ──────────────────────────────────
    aboutCompanyMetricType,
    featureItemType,
    pricingCategorySchemaType,
    pricingTierSchemaType,
    advantageItemType,
    trustQuoteType,
    faqItemType,
    heroCardItemType,
    mainButtonType,

    // ── Секції лендингу ──────────────────────────────────────────────────────
    landingHeroSectionType,
    landingAboutSectionType,
    landingAdvantagesSectionType,
    landingPricingSectionType,
    landingTrustSectionType,
    landingContactSectionType,
    landingFaqSectionType,
    landingSeoSectionType,

    // ── Головний документ ────────────────────────────────────────────────────
    landingPageType,
  ],
};
