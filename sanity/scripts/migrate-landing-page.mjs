#!/usr/bin/env node
/**
 * Переність дані семи старих singleton-ів у документ landingPageSingleton
 * (`_type`: landingPage).
 *
 * Потрібно:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID (або SANITY_PROJECT_ID)
 *   NEXT_PUBLIC_SANITY_DATASET (або SANITY_DATASET)
 *   SANITY_API_WRITE_TOKEN — токен з правами запису
 *
 * Запуск з кореня репозиторію:
 *   node sanity/scripts/migrate-landing-page.mjs
 */

import { createClient } from "next-sanity";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-09";
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

const OLD_IDS = {
  hero: "landingHeroSingleton",
  about: "landingAboutSingleton",
  services: "landingServicesSingleton",
  pricing: "landingPricingSingleton",
  advantages: "landingAdvantagesSingleton",
  trust: "landingTrustSingleton",
  faq: "landingFaqSingleton",
};
const TARGET_ID = "landingPageSingleton";

/**
 * Прибирає системні ключі Sanity; вкладені зображення залишаються як є.
 * @param {Record<string, unknown> | null | undefined} doc
 */
function strip(doc) {
  if (!doc) return {};
  const {
    _id,
    _type,
    _rev,
    _createdAt,
    _updatedAt,
    _originalId,
    ...fields
  } = doc;
  return fields;
}

async function main() {
  if (!projectId || !dataset) {
    console.error(
      "Встановіть NEXT_PUBLIC_SANITY_PROJECT_ID та NEXT_PUBLIC_SANITY_DATASET.",
    );
    process.exitCode = 1;
    return;
  }
  if (!token?.trim()) {
    console.error("Встановіть SANITY_API_WRITE_TOKEN для запису.");
    process.exitCode = 1;
    return;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token: token.trim(),
    useCdn: false,
  });

  console.info("Отримуємо старі документи…");

  const [hero, about, services, pricing, advantages, trust, faq] =
    await Promise.all([
      client.getDocument(OLD_IDS.hero),
      client.getDocument(OLD_IDS.about),
      client.getDocument(OLD_IDS.services),
      client.getDocument(OLD_IDS.pricing),
      client.getDocument(OLD_IDS.advantages),
      client.getDocument(OLD_IDS.trust),
      client.getDocument(OLD_IDS.faq),
    ]);

  /** @type {Record<string, unknown>} */
  const payload = {
    hero: strip(hero),
    about: strip(about),
    services: strip(services),
    pricing: strip(pricing),
    advantages: strip(advantages),
    trust: strip(trust),
    faq: strip(faq),
    contact: {},
    seo: {},
  };

  await client.createOrReplace({
    _id: TARGET_ID,
    _type: "landingPage",
    ...payload,
  });

  console.info(
    `Готово: оновлено «${TARGET_ID}» з вкладок hero, about, services, pricing, advantages, trust, faq. Секції contact та seo порожні — заповніть у Studio.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
