import type { StructureResolver } from "sanity/structure";

const LANDING_DOCUMENT_IDS = new Set([
  "landingHero",
  "landingAbout",
  "landingServices",
  "landingPricing",
  "landingAdvantages",
  "landingTrust",
  "landingFaq",
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Лендинг")
        .id("landingEditorGroup")
        .child(
          S.list()
            .title("Лендинг")
            .items([
              S.listItem()
                .title("Hero")
                .id("singletonLandingHero")
                .child(
                  S.document()
                    .schemaType("landingHero")
                    .documentId("landingHeroSingleton"),
                ),
              S.listItem()
                .title("Про компанію")
                .id("singletonLandingAbout")
                .child(
                  S.document()
                    .schemaType("landingAbout")
                    .documentId("landingAboutSingleton"),
                ),
              S.listItem()
                .title("Послуги")
                .id("singletonLandingServices")
                .child(
                  S.document()
                    .schemaType("landingServices")
                    .documentId("landingServicesSingleton"),
                ),
              S.listItem()
                .title("Тарифи")
                .id("singletonLandingPricing")
                .child(
                  S.document()
                    .schemaType("landingPricing")
                    .documentId("landingPricingSingleton"),
                ),
              S.listItem()
                .title("Переваги")
                .id("singletonLandingAdvantages")
                .child(
                  S.document()
                    .schemaType("landingAdvantages")
                    .documentId("landingAdvantagesSingleton"),
                ),
              S.listItem()
                .title("Довіра та відгуки")
                .id("singletonLandingTrust")
                .child(
                  S.document()
                    .schemaType("landingTrust")
                    .documentId("landingTrustSingleton"),
                ),
              S.listItem()
                .title("FAQ та футер")
                .id("singletonLandingFaq")
                .child(
                  S.document()
                    .schemaType("landingFaq")
                    .documentId("landingFaqSingleton"),
                ),
            ]),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !LANDING_DOCUMENT_IDS.has(item.getId() ?? ""),
      ),
    ]);
