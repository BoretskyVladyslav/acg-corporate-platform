import type { LandingAdditionalServicesResolved } from "@/sanity/lib/loadLandingPage";
import {
  LANDING_CARD_BASE,
  LANDING_CARD_BODY,
  LANDING_CARD_HOVER,
  LANDING_CARD_PADDING,
  LANDING_CARD_TITLE,
  LANDING_SECTION_AFTER_HEADER,
  LANDING_SECTION_EYEBROW,
  LANDING_SECTION_H2_GRADIENT,
  LANDING_SECTION_H2_SIZE,
  LANDING_SECTION_LEDE,
  LANDING_SECTION_SHELL,
} from "@/src/lib/landingSectionRhythm";

export type AdditionalServicesProps = LandingAdditionalServicesResolved;

/** Секція «Додаткові послуги» з Sanity (`additionalServices`). */
export default function AdditionalServices({
  title,
  subtitle,
  items,
}: AdditionalServicesProps) {
  if (!items?.length) return null;

  const headingId = "additional-services-heading";
  const displayTitle = title?.trim() ?? "Додаткові послуги";

  return (
    <section
      id="additional-services"
      aria-labelledby={headingId}
      className="bg-acg-light text-foreground"
    >
      <div className={LANDING_SECTION_SHELL}>
        <header className="mx-auto max-w-3xl text-center">
          <p className={LANDING_SECTION_EYEBROW}>Додаткові послуги</p>
          <h2
            id={headingId}
            className={`${LANDING_SECTION_H2_GRADIENT} ${LANDING_SECTION_H2_SIZE} mt-3`}
          >
            {displayTitle}
          </h2>
          {subtitle?.trim() ? (
            <p className={`mx-auto mt-4 max-w-3xl ${LANDING_SECTION_LEDE}`}>
              {subtitle.trim()}
            </p>
          ) : null}
        </header>
        <div
          className={`${LANDING_SECTION_AFTER_HEADER} grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-9`}
        >
          {items.map((item, i) => (
            <article
              key={`${item.title}-${i}`}
              className={`group relative flex flex-col ${LANDING_CARD_BASE} ${LANDING_CARD_HOVER} ${LANDING_CARD_PADDING}`}
            >
              <h3 className={`${LANDING_CARD_TITLE} transition-colors duration-300 group-hover:text-acg-blue`}>
                {item.title}
              </h3>
              {item.description ? (
                <p className={`relative mt-4 whitespace-pre-line ${LANDING_CARD_BODY}`}>
                  {item.description}
                </p>
              ) : null}
              {item.price?.trim() ? (
                <div className="relative mt-auto w-full">
                  <div className="mt-8 border-t border-foreground/[0.06] pt-5">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-acg-blue/[0.12] to-acg-blue/[0.07] px-4 py-2 text-sm font-semibold tracking-tight text-acg-blue ring-1 ring-acg-blue/25">
                      {item.price.trim()}
                    </span>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
