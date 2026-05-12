export interface HeroProps {
  heading?: string;
  subheading?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
}

export default function Hero({
  heading = "Повний супровід ФОП: від реєстрації до складного обліку",
  subheading =
    "Оптимізуємо ваші податки та забезпечимо 100% порядок у звітності та документах. Довірте рутину професіоналам.",
  primaryCtaLabel = "Консультація",
  secondaryCtaLabel = "Наші послуги",
  primaryCtaHref = "#contact",
  secondaryCtaHref = "#about",
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-foreground/10 bg-background text-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <h1
          id="hero-heading"
          className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-acg-blue sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          {heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75">
          {subheading}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={primaryCtaHref}
            className="inline-flex items-center justify-center rounded-full bg-acg-red px-6 py-3 text-sm font-medium text-white hover:bg-red-800"
          >
            {primaryCtaLabel}
          </a>
          <a
            href={secondaryCtaHref}
            className="inline-flex items-center justify-center rounded-full border border-acg-blue bg-transparent px-6 py-3 text-sm font-medium text-acg-blue hover:bg-acg-blue/10"
          >
            {secondaryCtaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
