/**
 * Embedded Sanity Studio (catch-all under `/studio`).
 * Studio ренериться лише в браузері (`ssr: false`), щоб уникнути `window is not defined` під час SSR.
 */

import StudioClient from "./StudioClient";

export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <StudioClient />;
}
