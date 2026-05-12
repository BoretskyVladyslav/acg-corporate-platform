/**
 * Строга валідація email для лід-форми: латиниця в інпуті + перевірка формату.
 */

export const LEAD_EMAIL_INVALID_MESSAGE = "Введіть коректний email";

/** Локальна частина, @, принаймні один піддомен/домен і зона (TLD) ≥ 2 літер. */
const LEAD_EMAIL_RE =
  /^[a-zA-Z0-9._+-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

/** Лише латиниця, цифри та символи email (без пробілів і кирилиці). */
export function filterLeadEmailInput(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9@._+-]/g, "");
}

export function isValidLeadEmail(value: string): boolean {
  const s = value.trim();
  if (!s) return false;
  return LEAD_EMAIL_RE.test(s);
}
