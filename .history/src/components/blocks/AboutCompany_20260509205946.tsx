export interface AboutCompanyProps {
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  metrics?: Array<{ label?: string; value?: string }>;
}

const defaultMetrics: NonNullable<AboutCompanyProps["metrics"]> = [
  { label: "Metric label", value: "—" },
  { label: "Metric label", value: "—" },
  { label: "Metric label", value: "—" },
];

export default function AboutCompany({
  id = "about",
  eyebrow = "About",
  heading = "Company overview",
  body = "Describe your company mission, experience, and what makes the offer credible. This block is structured for portable text or plain strings from Sanity.",
  metrics = defaultMetrics,
}: AboutCompanyProps) {
  return (
    <section
      id={id}
      aria-labelledby="about-heading"
      className="bg-background text-foreground"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60">
          {eyebrow}
        </p>
        <h2
          id="about-heading"
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/75">
          {body}
        </p>
        <dl className="mt-12 grid gap-8 sm:grid-cols-3">
          {metrics.slice(0, 3).map((m, i) => (
            <div key={i} className="border-t border-foreground/10 pt-6">
              <dt className="text-sm text-foreground/60">{m?.label}</dt>
              <dd className="mt-2 text-2xl font-semibold tracking-tight">
                {m?.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
