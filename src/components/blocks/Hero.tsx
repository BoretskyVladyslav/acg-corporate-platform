import HeroClient, { type HeroCardContent, type HeroProps } from "./HeroClient";

export type { HeroCardContent, HeroProps };

const HEADING_FALLBACK =
  "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.";

const FREE_CTA_LABEL_FALLBACK = "Безкоштовна консультація";
const PAID_CTA_LABEL_FALLBACK = "Платна консультація";

function pickNonEmptyText(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/** Герой із Sanity: `landingPageSingleton` → вкладена секція Hero. Для скриптів або тестів. */
export { fetchHeroFromSanity } from "@/sanity/lib/loadLandingPage";

/**
 * Підставляє захардкоджені значення, якщо з Sanity нічого не прийшло або рядок порожній.
 */
export function resolveHeroProps(partial: Partial<HeroProps> = {}): HeroProps {
  const subheading =
    partial.subheading === undefined || partial.subheading === null
      ? ""
      : partial.subheading.trim();

  const bgUrl = partial.backgroundImageUrl?.trim();

  const heroCards =
    partial.heroCards?.filter(
      (c) => Boolean(c.title?.trim()) && Boolean(c.subtitle?.trim()),
    ) ?? undefined;

  return {
    heading: pickNonEmptyText(partial.heading, HEADING_FALLBACK),
    subheading,
    primaryCtaLabel: pickNonEmptyText(
      partial.primaryCtaLabel,
      FREE_CTA_LABEL_FALLBACK,
    ),
    secondaryCtaLabel: pickNonEmptyText(
      partial.secondaryCtaLabel,
      PAID_CTA_LABEL_FALLBACK,
    ),
    ...(heroCards?.length ? { heroCards } : {}),
    ...(bgUrl ? { backgroundImageUrl: bgUrl } : {}),
  };
}

export default function Hero(partial: Partial<HeroProps>) {
  return <HeroClient {...resolveHeroProps(partial)} />;
}
