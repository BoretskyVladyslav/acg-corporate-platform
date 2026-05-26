/**
 * Єдиний візуальний ритм секцій лендингу (відступи, контейнер, типографіка h2 та eyebrow).
 * Не торкається Hero — він має власну сітку.
 */

/** Основний внутрішній короб: max ширини, симетричні px, однакове «повітря» по вертикалі. */
export const LANDING_SECTION_SHELL =
  "mx-auto w-full min-w-0 max-w-7xl px-6 py-16 md:py-24 lg:px-8";

/** Eyebrow — над основним заголовком секції. */
export const LANDING_SECTION_EYEBROW =
  "text-xs font-medium uppercase tracking-[0.2em] text-foreground/60";

/** Масштаб і базова «вага» секційних h2 (розмір і жирність збігаються по всій сторінці). */
export const LANDING_SECTION_H2_SIZE =
  "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl";

/** Градієнтний варіант заголовка (тарифи, додаткові послуги тощо). */
export const LANDING_SECTION_H2_GRADIENT =
  "bg-linear-to-b from-acg-blue via-acg-blue to-acg-blue/75 bg-clip-text font-bold uppercase leading-[0.95] tracking-tighter text-transparent [background-clip:text] [-webkit-background-clip:text]";

/** Тіло-підводка під h2 довшим текстом. */
export const LANDING_SECTION_LEDE =
  "text-lg leading-relaxed text-foreground/75";

/** Від заголовкового блоку до основної сітки / списків. */
export const LANDING_SECTION_AFTER_HEADER = "mt-10 md:mt-12";

/** --- Базові картки на світлому фоні (послуги, метрики, відгуки, FAQ) --- */

export const LANDING_CARD_BASE =
  "rounded-2xl border border-slate-200/90 bg-white shadow-sm";

export const LANDING_CARD_HOVER =
  "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl";

/** Типові внутрішні відступи картки. */
export const LANDING_CARD_PADDING = "p-6 sm:p-8";

/** Заголовок у картці (назва послуги, пункт). */
export const LANDING_CARD_TITLE =
  "text-xl font-semibold tracking-tight text-foreground";

/** Опис / основний текст у картці. */
export const LANDING_CARD_BODY =
  "text-base font-normal leading-relaxed text-slate-600";

/** Для карток з більшим контентом (наприклад, «Послуги»). */
export const LANDING_CARD_PADDING_COMFORTABLE =
  "p-8 sm:p-10 lg:p-11 xl:p-12";

/** --- Секція «Тарифи» (фірмовий синій, як у «Контактах») --- */

export const LANDING_PRICING_SECTION_CLASS =
  "relative overflow-x-hidden border-t border-white/10 bg-gradient-to-br from-[#1a4f9c] via-[#245494] to-slate-950 text-white";

/** Glow поверх синього фону Pricing (не текст). */
export const LANDING_PRICING_SECTION_GLOW =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(255,255,255,0.14)_0%,transparent_50%)]";

/** Eyebrow на синьому тлі секції тарифів. */
export const LANDING_PRICING_EYEBROW_ON_DARK =
  "text-xs font-medium uppercase tracking-[0.2em] text-white/70";

/** Заголовок h2 на синьому фоні. */
export const LANDING_PRICING_H2_ON_DARK =
  "text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.25)]";

/** Підводка під заголовком тарифів. */
export const LANDING_PRICING_LEDE_ON_DARK =
  "text-lg leading-relaxed text-white/90";

/** Неактивна вкладка тарифів (синій фон секції). */
export const LANDING_PRICING_TAB_IDLE =
  "border-white/25 bg-white/10 text-white/90 hover:border-white/40 hover:bg-white/15 hover:text-white";

/** Активна головна вкладка тарифів. */
export const LANDING_PRICING_TAB_ACTIVE =
  "border-white bg-white text-acg-blue shadow-lg shadow-black/20 ring-1 ring-white/80";

/** Неактивна підвкладка «Бухгалтерія для ФОП». */
export const LANDING_PRICING_SUBTAB_IDLE =
  "border-white/20 bg-white/5 text-white/85 hover:border-white/35 hover:bg-white/10 hover:text-white";

/** Активна підвкладка «Бухгалтерія для ФОП». */
export const LANDING_PRICING_SUBTAB_ACTIVE =
  "border-sky-200/80 bg-white/95 text-acg-blue shadow-md shadow-black/15 ring-1 ring-white/60";

/** --- Акцентна секція форми захоплення лидів --- */

export const LANDING_LEAD_SECTION_CLASS =
  "relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-[#1a4f9c] via-[#245494] to-slate-950 text-white";

export const LANDING_LEAD_SECTION_GLOW =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(255,255,255,0.14)_0%,transparent_50%)]";

export const LANDING_LEAD_EYEBROW_ON_ACCENT =
  "text-xs font-medium uppercase tracking-[0.2em] text-white/70";

/** Заголовок форми на градієнті без clip — максимум контрасту. */
export const LANDING_LEAD_H2_ON_ACCENT =
  "text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.25)]";

export const LANDING_LEAD_LEDE_ON_ACCENT =
  "text-lg leading-relaxed text-white/90";

/** Мітки контактної інформації (dl dt). */
export const LANDING_LEAD_META_DT =
  "text-xs font-semibold uppercase tracking-[0.18em] text-white/55";

export const LANDING_LEAD_META_DD = "mt-3 text-base leading-relaxed text-white/90";

export const LANDING_LEAD_LINK =
  "text-lg font-medium text-white underline-offset-[6px] transition hover:text-sky-200 hover:underline";
