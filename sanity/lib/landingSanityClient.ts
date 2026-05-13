import { createClient, type SanityClient } from "next-sanity";

const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-09";

/** Клієнт без assert у `sanity/env` — якщо змінних немає, повертає null (сторінка показує fallback). */
export function createLandingSanityClient(): SanityClient | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;
  // CDN кешує відповіді GROQ — після Publish посилання можуть затримуватися.
  // Для лендингу за замовчуванням звертаємось до API напряму; увімкнути CDN: NEXT_PUBLIC_SANITY_USE_CDN=true
  const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN === "true";
  return createClient({ projectId, dataset, apiVersion, useCdn });
}
