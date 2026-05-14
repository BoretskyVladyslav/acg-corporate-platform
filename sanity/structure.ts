import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Лендинг")
        .id("singletonLandingPage")
        .child(S.document().schemaType("landingPage").documentId("landingPageSingleton")),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "landingPage",
      ),
    ]);
