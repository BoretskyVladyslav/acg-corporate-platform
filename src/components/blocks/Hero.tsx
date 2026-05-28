import HeroClient, { type HeroCardContent, type HeroProps } from "./HeroClient";

export type { HeroCardContent, HeroProps };

// ─── Дефолти (fallback, якщо CMS порожній) ────────────────────────────────────
const HEADING_FALLBACK =
  "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.";

function pickNonEmptyText(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/** Герой із Sanity: `landingPageSingleton` → вкладена секція Hero. */
export { fetchHeroFromSanity } from "@/sanity/lib/loadLandingPage";

/**
 * Підставляє захардкоджені значення для обов'язкових полів, якщо CMS порожній.
 * Поля кнопок (primaryButtonTitle/Hint, secondaryButton*) передаються as-is —
 * HeroClient сам застосує дефолти якщо undefined.
 */
export function resolveHeroProps(partial: Partial<HeroProps> = {}): HeroProps {
  const subheading =
    partial.subheading === undefined || partial.subheading === null
      ? ""
      : partial.subheading.trim();

  const bgUrl = partial.backgroundImageUrl?.trim();

  // Картки: передаємо як є — HeroClient сам замінить порожні на дефолти по позиції
  const heroCards = partial.heroCards?.filter(
    (c) => Boolean(c.title?.trim()) || Boolean(c.subtitle?.trim()),
  ) ?? undefined;

  return {
    heading: pickNonEmptyText(partial.heading, HEADING_FALLBACK),
    subheading,
    // CTA-поля: передаємо undefined якщо порожньо — HeroClient застосує дефолт
    ...(partial.primaryButtonTitle ? { primaryButtonTitle: partial.primaryButtonTitle } : {}),
    ...(partial.primaryButtonHint ? { primaryButtonHint: partial.primaryButtonHint } : {}),
    ...(partial.secondaryButtonTitle ? { secondaryButtonTitle: partial.secondaryButtonTitle } : {}),
    ...(partial.secondaryButtonHint ? { secondaryButtonHint: partial.secondaryButtonHint } : {}),
    ...(partial.secondaryButtonPrice ? { secondaryButtonPrice: partial.secondaryButtonPrice } : {}),
    ...(heroCards?.length ? { heroCards } : {}),
    ...(bgUrl ? { backgroundImageUrl: bgUrl } : {}),
  };
}

export default function Hero(partial: Partial<HeroProps>) {
  return <HeroClient {...resolveHeroProps(partial)} />;
}
