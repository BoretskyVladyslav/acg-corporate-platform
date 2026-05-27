import { Phone, Send } from "lucide-react";

import { externalLinkProps } from "@/src/lib/externalLink";
import { telHrefFromDisplay } from "@/src/lib/telHrefFromDisplay";
import { ACG_TELEGRAM_LEADS_URL } from "@/src/lib/telegram";

export interface SiteFooterProps {
  footerNote?: string;
  phoneDisplay?: string;
}

const DEFAULT_FOOTER_NOTE = "© {year} Назва компанії. Усі права захищені.";

const STATIC_FOOTER_NAV_LINKS: Array<{ label: string; href: string }> = [
  { label: "Конфіденційність", href: "#" },
  { label: "Умови", href: "#" },
];

function textOr(value: string | undefined | null, fallback: string): string {
  const t = typeof value === "string" ? value.trim() : "";
  return t || fallback;
}

export default function SiteFooter({
  footerNote,
  phoneDisplay,
}: SiteFooterProps) {
  const footerPhoneHref = telHrefFromDisplay(phoneDisplay);
  const year = new Date().getFullYear();
  const footerNoteTemplate = textOr(footerNote, DEFAULT_FOOTER_NOTE);
  const resolvedNote = footerNoteTemplate.replace("{year}", String(year));

  return (
    <footer
      id="site-footer"
      className="border-t border-acg-border bg-white text-foreground"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="min-w-0 text-xs text-foreground/50 sm:text-sm">
              {resolvedNote}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-6">
              <a
                href={ACG_TELEGRAM_LEADS_URL}
                {...externalLinkProps(ACG_TELEGRAM_LEADS_URL)}
                className="inline-flex items-center gap-2 text-foreground/70 transition hover:text-[#229ED9]"
                aria-label="Telegram @acg_leads_bot"
              >
                <Send className="size-5 shrink-0 text-[#229ED9]" aria-hidden />
                <span className="text-sm font-medium">Telegram</span>
              </a>
              {phoneDisplay?.trim() && footerPhoneHref ? (
                <a
                  href={footerPhoneHref}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground/75 transition hover:text-acg-blue"
                >
                  <Phone className="size-4 shrink-0 text-acg-blue" aria-hidden />
                  <span>{phoneDisplay.trim()}</span>
                </a>
              ) : null}
            </div>
          </div>
          <nav
            aria-label="Додаткові посилання"
            className="border-t border-foreground/[0.06] pt-4"
          >
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-foreground/45">
              {STATIC_FOOTER_NAV_LINKS.map((link, i) => {
                const href = link.href;
                return (
                  <li key={i}>
                    <a
                      href={href}
                      {...externalLinkProps(href)}
                      className="underline-offset-2 hover:text-acg-blue/90 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
