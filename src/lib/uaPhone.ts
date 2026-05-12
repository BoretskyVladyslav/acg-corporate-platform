/**
 * Ukrainian phone helpers: normalize to E.164 (+380XXXXXXXXX) and validate.
 */

const UA_E164 = /^\+380\d{9}$/;

/** Початкове значення поля (міжнародний код UA). */
export const UA_PHONE_INPUT_DEFAULT = "+380";

/** Після «+»: 380 та 9 національних цифр. */
const MAX_DIGITS_AFTER_PLUS = 12;

/** Без «+»: до 12 цифр (наприклад 380… або 0…). */
const MAX_DIGITS_LOCAL = 12;

/**
 * Дозволяє лише «+» (лише на першій позиції) та цифри.
 * Порожнє або лише «+» → префікс за замовчуванням.
 */
export function filterPhoneInput(raw: string): string {
  let out = "";
  for (const ch of raw) {
    if (ch === "+" && out.length === 0) {
      out += "+";
    } else if (/\d/.test(ch)) {
      out += ch;
    }
  }
  if (out === "" || out === "+") {
    return UA_PHONE_INPUT_DEFAULT;
  }
  if (out.startsWith("+")) {
    const rest = out.slice(1);
    const capped =
      rest.length > MAX_DIGITS_AFTER_PLUS
        ? rest.slice(0, MAX_DIGITS_AFTER_PLUS)
        : rest;
    return `+${capped}`;
  }
  if (out.length > MAX_DIGITS_LOCAL) {
    return out.slice(0, MAX_DIGITS_LOCAL);
  }
  return out;
}

export function normalizeUaPhone(raw: string): string | null {
  const digitsOnly = raw.replace(/\D/g, "");
  if (digitsOnly.length === 0) return null;

  let national: string;
  if (digitsOnly.length === 12 && digitsOnly.startsWith("380")) {
    national = digitsOnly.slice(3);
  } else if (digitsOnly.length === 10 && digitsOnly.startsWith("0")) {
    national = digitsOnly.slice(1);
  } else if (digitsOnly.length === 9) {
    national = digitsOnly;
  } else {
    return null;
  }

  if (!/^\d{9}$/.test(national)) return null;
  return `+380${national}`;
}

export function isValidUaPhone(raw: string): boolean {
  const n = normalizeUaPhone(raw);
  return n !== null && UA_E164.test(n);
}

export const UA_PHONE_HINT =
  "Формат: +380 XX XXX XX XX або 0XX XXX XX XX";

export const UA_PHONE_ERROR =
  "Вкажіть коректний номер (9 цифр після коду 380 або 0 на початку).";
