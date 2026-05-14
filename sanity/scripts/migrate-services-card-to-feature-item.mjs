#!/usr/bin/env node
/**
 * Перейменовує вкладені об'єкти `_type: "servicesCard"` → `featureItem`
 * у `landingPageSingleton` (services.items, pricing.tiers[].features).
 *
 * Потрібно: SANITY_API_WRITE_TOKEN та змінні проєкту/dataset (як у migrate-landing-page.mjs).
 *
 *   node sanity/scripts/migrate-services-card-to-feature-item.mjs
 */

import { createClient } from "next-sanity";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-09";
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const DOC_ID = "landingPageSingleton";

/**
 * @param {unknown} row
 */
function mapRow(row) {
  if (!row || typeof row !== "object") return row;
  const o = { ...row };
  if (o._type === "servicesCard") {
    o._type = "featureItem";
    if (o.icon === undefined) o.icon = "";
  }
  return o;
}

/**
 * @param {unknown[] | null | undefined} arr
 */
function mapArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((x) => mapRow(x));
}

async function main() {
  if (!projectId || !dataset) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
    process.exit(1);
  }
  if (!token) {
    console.error("Missing SANITY_API_WRITE_TOKEN");
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const doc = await client.getDocument(DOC_ID);
  if (!doc || typeof doc !== "object") {
    console.error(`Document ${DOC_ID} not found`);
    process.exit(1);
  }

  const next = { ...doc };

  if (next.services && typeof next.services === "object") {
    next.services = {
      ...next.services,
      items: mapArray(next.services.items),
    };
  }

  if (next.pricing && typeof next.pricing === "object") {
    const tiers = Array.isArray(next.pricing.tiers)
      ? next.pricing.tiers.map((t) => {
          if (!t || typeof t !== "object") return t;
          return {
            ...t,
            features: mapArray(t.features),
          };
        })
      : next.pricing.tiers;
    next.pricing = { ...next.pricing, tiers };
  }

  await client.createOrReplace(next);
  console.log("OK: servicesCard → featureItem у landingPageSingleton.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
