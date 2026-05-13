import HeroClient, { type HeroProps } from "./HeroClient";

export type { HeroProps };

const HEADING_FALLBACK =
  "ВИ ЗАЙМАЄТЕСЬ БІЗНЕСОМ — МИ БУХГАЛТЕРІЄЮ. ПОВНИЙ СУПРОВІД ФОП ТА ТОВ: ВІД ПЕРШОЇ РЕЄСТРАЦІЇ ДО СКЛАДНОГО ОБЛІКУ. ЛЕГАЛІЗУЄМО ВАШІ ДОХОДИ ТА ЗАХИСТИМО АКТИВИ ВІД ШТРАФІВ.";

const PRIMARY_CTA_LABEL_FALLBACK =
  "ОТРИМАТИ ПЕРВИННУ КОНСУЛЬТАЦІЮ БЕЗКОШТОВНО";

const SECONDARY_CTA_LABEL_FALLBACK = "ШВИДКА ВІДПОВІДЬ У TELEGRAM";

function pickNonEmptyText(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/** URL для кнопки Telegram: основне поле `telegramLink`, інакше `secondaryCtaHref`, якщо це http(s). */
function pickTelegramHref(partial: Partial<HeroProps>): string | undefined {
  const fromTelegram = partial.telegramLink?.trim();
  if (fromTelegram) return fromTelegram;

  const secondary = partial.secondaryCtaHref?.trim();
  if (secondary && /^https?:\/\//i.test(secondary)) return secondary;

  return undefined;
}

/**
 * Завантажує поля Hero з Sanity (документ `landingHeroSingleton`).
 * Повертає лише наявні з CMS поля; порожні рядки з API відкидаються в мапері.
 */
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
  const bgAlt = partial.backgroundImageAlt?.trim();

  const telegramUrl = pickTelegramHref(partial);

  return {
    heading: pickNonEmptyText(partial.heading, HEADING_FALLBACK),
    subheading,
    primaryCtaLabel: pickNonEmptyText(
      partial.primaryCtaLabel,
      PRIMARY_CTA_LABEL_FALLBACK,
    ),
    secondaryCtaLabel: pickNonEmptyText(
      partial.secondaryCtaLabel,
      SECONDARY_CTA_LABEL_FALLBACK,
    ),
    primaryCtaHref: pickNonEmptyText(partial.primaryCtaHref, "#contact"),
    secondaryCtaHref: telegramUrl || "#",
    ...(bgUrl ? { backgroundImageUrl: bgUrl } : {}),
    ...(bgAlt ? { backgroundImageAlt: bgAlt } : {}),
  };
}

export default function Hero(partial: Partial<HeroProps>) {
  return <HeroClient {...resolveHeroProps(partial)} />;
}
