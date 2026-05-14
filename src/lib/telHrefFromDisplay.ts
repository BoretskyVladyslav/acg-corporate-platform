/**
 * Посилання `tel:` з тексту номера для сайту (лише цифри та ведучий `+`).
 */
export function telHrefFromDisplay(
  phoneDisplay: string | undefined | null,
): string | null {
  const raw = typeof phoneDisplay === "string" ? phoneDisplay.trim() : "";
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : null;
}
