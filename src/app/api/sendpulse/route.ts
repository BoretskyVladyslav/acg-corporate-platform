import { NextResponse } from "next/server";

import { isValidLeadEmail } from "@/src/lib/leadEmail";
import { normalizeUaPhone } from "@/src/lib/uaPhone";

const OAUTH_URL = "https://api.sendpulse.com/oauth/access_token";
const CRM_BASE = "https://api.sendpulse.com/crm/v1";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  /** Зручний час для дзвінка (опціонально). */
  callTime?: string;
  service?: string;
  /** Останній обраний тариф з блоку Pricing (sessionStorage). */
  tier?: string;
  /** Людська назва тарифу/послуги для Telegram-сповіщення. */
  tierDisplayName?: string;
  /** Якщо `general_consultation` — лід без тарифу та (за замовчуванням) без послуги з форми. */
  leadIntent?: string;
  /** Honeypot: must stay empty; bots often fill “website” fields. */
  website?: string;
};

function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type LeadIntentKind =
  | "free_consultation"
  | "paid_consultation"
  | "general_consultation";

function parseLeadIntent(raw: string): LeadIntentKind | undefined {
  if (
    raw === "free_consultation" ||
    raw === "paid_consultation" ||
    raw === "general_consultation"
  ) {
    return raw;
  }
  return undefined;
}

function isTierlessConsultationIntent(
  intent: LeadIntentKind | undefined,
): boolean {
  return intent === "free_consultation" || intent === "general_consultation";
}

function leadIntentStatusLabel(intent: LeadIntentKind): string {
  switch (intent) {
    case "free_consultation":
      return "Безкоштовна консультація";
    case "paid_consultation":
      return "Платна консультація";
    case "general_consultation":
      return "Запит на загальну консультацію";
  }
}

function buildTelegramLeadText(input: {
  name: string;
  phone: string;
  email?: string;
  callTime?: string;
  service?: string;
  tier?: string;
  tierDisplayName?: string;
  leadIntent?: LeadIntentKind;
}): string {
  const name = escapeTelegramHtml(input.name);
  const phone = escapeTelegramHtml(input.phone);

  // Беремо tierDisplayName сирим — саме те, що прийшло з фронтенду.
  // Не змішуємо з `tier`, щоб не підставляти технічні значення типу "Консультація".
  const rawDisplay = input.tierDisplayName?.trim() ?? "";

  const GENERIC_LABELS = ["загальна консультація", "без тарифу", ""];
  const isGeneric = GENERIC_LABELS.includes(rawDisplay.toLowerCase());

  const lines = [
    "🟢 <b>НОВИЙ ЛІД (Лендінг ACG)</b>",
    `👤 <b>Ім'я:</b> ${name}`,
    `📞 <b>Телефон:</b> ${phone}`,
  ];

  if (isGeneric) {
    lines.push(`💼 <b>Запит:</b> Загальна консультація`);
  } else {
    lines.push(`📊 <b>Обраний пакет:</b> ${escapeTelegramHtml(rawDisplay)}`);
    lines.push(`💼 <b>Запит:</b> Консультація по пакету`);
  }

  if (input.callTime?.trim()) {
    lines.push(
      `🕐 <b>Зручний час:</b> ${escapeTelegramHtml(input.callTime.trim())}`,
    );
  }
  if (input.email?.trim()) {
    lines.push(
      `✉️ <b>Email:</b> ${escapeTelegramHtml(input.email.trim())}`,
    );
  }
  return lines.join("\n");
}

function getSendPulseClientCredentials(): {
  clientId: string;
  clientSecret: string;
} | null {
  const clientId =
    process.env.SENDPULSE_CLIENT_ID?.trim() ??
    process.env.SENDPULSE_API_ID?.trim() ??
    process.env.SENDPULSE_ID?.trim();
  const clientSecret =
    process.env.SENDPULSE_CLIENT_SECRET?.trim() ??
    process.env.SENDPULSE_API_SECRET?.trim() ??
    process.env.SENDPULSE_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

async function getAccessToken(): Promise<string | null> {
  const creds = getSendPulseClientCredentials();
  if (!creds) return null;

  try {
    const res = await fetch(OAUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("[sendpulse] OAuth failed", res.status, err.slice(0, 500));
      return null;
    }
    const json = (await res.json()) as { access_token?: string };
    return json.access_token ?? null;
  } catch (e) {
    console.error("[sendpulse] OAuth request error", e);
    return null;
  }
}

/** Returns true if Telegram accepted the message. */
async function sendTelegramLead(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.error(
      "[sendpulse] telegram: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID",
    );
    return false;
  }
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const threadRaw = process.env.TELEGRAM_THREAD_ID?.trim();
  try {
    const telegramBody: {
      chat_id: string;
      text: string;
      parse_mode: "HTML";
      message_thread_id?: number;
    } = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    };
    if (threadRaw) {
      telegramBody.message_thread_id = Number.parseInt(threadRaw, 10);
    }
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telegramBody),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error(
        "[sendpulse] telegram sendMessage failed",
        res.status,
        errBody.slice(0, 500),
      );
      return false;
    }
    return true;
  } catch (e) {
    console.error("[sendpulse] telegram sendMessage error", e);
    return false;
  }
}

function isSendPulseAddressBookConfigured(): boolean {
  const listId = process.env.SENDPULSE_LIST_ID?.trim();
  return Boolean(getSendPulseClientCredentials() && listId);
}

function isSendPulseCrmConfigured(): boolean {
  if (!getSendPulseClientCredentials()) return false;
  const pipelineId = Number(process.env.SENDPULSE_CRM_PIPELINE_ID);
  const stepId = Number(process.env.SENDPULSE_CRM_STEP_ID);
  const responsibleId = Number(process.env.SENDPULSE_CRM_RESPONSIBLE_ID);
  return [pipelineId, stepId, responsibleId].every(
    (n) => Number.isFinite(n) && n > 0,
  );
}

function isTelegramConfigured(): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN?.trim() &&
      process.env.TELEGRAM_CHAT_ID?.trim(),
  );
}

function parseCrmIds(): {
  pipelineId: number;
  stepId: number;
  responsibleId: number;
} | null {
  const pipelineId = Number(process.env.SENDPULSE_CRM_PIPELINE_ID);
  const stepId = Number(process.env.SENDPULSE_CRM_STEP_ID);
  const responsibleId = Number(process.env.SENDPULSE_CRM_RESPONSIBLE_ID);
  if (
    ![pipelineId, stepId, responsibleId].every(
      (n) => Number.isFinite(n) && n > 0,
    )
  ) {
    return null;
  }
  return { pipelineId, stepId, responsibleId };
}

async function createCrmContactAndDeal(input: {
  token: string;
  name: string;
  phone: string;
  email?: string;
  callTime?: string;
  tier?: string;
  service?: string;
  leadIntent?: LeadIntentKind;
}): Promise<boolean> {
  try {
    const ids = parseCrmIds();
    if (!ids) return false;

    const parts = input.name.trim().split(/\s+/);
    const firstName = (parts[0] ?? input.name).slice(0, 120);
    const lastName = parts.slice(1).join(" ").slice(0, 120);

    const attributes: Array<{ name: string; value: string; type: number }> =
      [];
    if (input.tier?.trim() && !isTierlessConsultationIntent(input.leadIntent)) {
      attributes.push({
        name: "Тариф",
        value: input.tier.trim().slice(0, 500),
        type: 0,
      });
    }
    if (input.service?.trim() && !isTierlessConsultationIntent(input.leadIntent)) {
      attributes.push({
        name: "Послуга",
        value: input.service.trim().slice(0, 500),
        type: 0,
      });
    }
    if (input.callTime?.trim()) {
      attributes.push({
        name: "Зручний час для дзвінка",
        value: input.callTime.trim().slice(0, 500),
        type: 0,
      });
    }

    const contactBody: Record<string, unknown> = {
      responsibleId: ids.responsibleId,
      firstName,
      lastName: lastName || firstName,
      phones: [input.phone],
    };
    if (input.email?.trim()) {
      contactBody.emails = [input.email.trim()];
    }
    if (attributes.length) {
      contactBody.attributes = attributes;
    }

    const contactRes = await fetch(`${CRM_BASE}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactBody),
    });

    if (!contactRes.ok) {
      const err = await contactRes.text().catch(() => "");
      console.error(
        "[sendpulse] CRM POST /contacts failed",
        contactRes.status,
        err.slice(0, 800),
      );
      return false;
    }
    const contactJson = (await contactRes.json()) as {
      data?: { id?: number };
    };
    const contactId = contactJson.data?.id;
    if (!contactId) {
      console.error(
        "[sendpulse] CRM contact response missing data.id",
        contactJson,
      );
      return false;
    }

    const dealNameBase = input.leadIntent
      ? `${input.name} — ${leadIntentStatusLabel(input.leadIntent)}`
      : input.tier?.trim()
        ? `${input.name} — ${input.tier.trim()}`
        : input.name;
    const dealName = `Заявка: ${dealNameBase}`.slice(0, 255);

    const dealRes = await fetch(`${CRM_BASE}/deals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pipelineId: ids.pipelineId,
        stepId: ids.stepId,
        responsibleId: ids.responsibleId,
        name: dealName,
        contact: [contactId],
      }),
    });

    if (!dealRes.ok) {
      const err = await dealRes.text().catch(() => "");
      console.error(
        "[sendpulse] CRM POST /deals failed",
        dealRes.status,
        err.slice(0, 800),
      );
      return false;
    }

    return true;
  } catch (e) {
    console.error("[sendpulse] CRM request error", e);
    return false;
  }
}

async function addEmailToSendPulseAddressBook(input: {
  token: string;
  email: string;
  name: string;
  phone: string;
  service?: string;
  tier?: string;
  leadIntent?: LeadIntentKind;
}): Promise<boolean> {
  try {
    const listId = process.env.SENDPULSE_LIST_ID?.trim();
    if (!listId) return true;

    const variables: Record<string, string> = {
      name: input.name,
      phone: input.phone,
    };
    if (input.service?.trim() && !isTierlessConsultationIntent(input.leadIntent)) {
      variables.service = input.service.trim();
    }
    if (input.tier?.trim() && !isTierlessConsultationIntent(input.leadIntent)) {
      variables.tier = input.tier.trim();
    }

    const url = `https://api.sendpulse.com/addressbooks/${listId}/emails`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: [
          {
            email: input.email,
            variables,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error(
        "[sendpulse] address book",
        res.status,
        errBody.slice(0, 500),
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("[sendpulse] address book error:", error);
    return false;
  }
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
  const emailRaw =
    typeof body.email === "string" ? body.email.trim() : "";
  const callTime =
    typeof body.callTime === "string" ? body.callTime.trim() : undefined;
  const service =
    typeof body.service === "string" ? body.service.trim() : undefined;
  const tier =
    typeof body.tier === "string" ? body.tier.trim() : undefined;
  const tierDisplayName =
    typeof body.tierDisplayName === "string" ? body.tierDisplayName.trim() : undefined;
  const leadIntentRaw =
    typeof body.leadIntent === "string" ? body.leadIntent.trim() : "";
  const leadIntent = parseLeadIntent(leadIntentRaw);
  const tierlessConsultation = isTierlessConsultationIntent(leadIntent);
  const honeypot =
    typeof body.website === "string" ? body.website.trim() : "";

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const phone = phoneRaw ? normalizeUaPhone(phoneRaw) : null;
  if (!phoneRaw) {
    return NextResponse.json(
      { ok: false, error: "required_fields" },
      { status: 400 },
    );
  }
  if (!phone) {
    return NextResponse.json(
      { ok: false, error: "invalid_phone" },
      { status: 400 },
    );
  }

  if (!name) {
    return NextResponse.json({ ok: false, error: "required_fields" }, { status: 400 });
  }

  const crmReady = isSendPulseCrmConfigured();
  const listReady = isSendPulseAddressBookConfigured();
  const telegramReady = isTelegramConfigured();

  if (!crmReady && !listReady && !telegramReady) {
    console.error(
      "[sendpulse] no delivery channel: configure CRM, address book, or Telegram",
    );
    return NextResponse.json(
      { ok: false, error: "no_delivery_channel" },
      { status: 503 },
    );
  }

  if (emailRaw && !isValidLeadEmail(emailRaw)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const needSendPulseToken = crmReady || listReady;
  let token: string | null = null;
  if (needSendPulseToken) {
    token = await getAccessToken();
    if (!token) {
      console.warn(
        "[sendpulse] SendPulse OAuth unavailable; continuing with Telegram or partial delivery",
      );
    }
  }

  let crmOk = false;
  if (crmReady && token) {
    crmOk = await createCrmContactAndDeal({
      token,
      name,
      phone,
      ...(emailRaw ? { email: emailRaw } : {}),
      ...(callTime ? { callTime } : {}),
      ...(!tierlessConsultation && tier ? { tier } : {}),
      ...(!tierlessConsultation && service ? { service } : {}),
      ...(leadIntent ? { leadIntent } : {}),
    });
    if (!crmOk) {
      console.warn("[sendpulse] CRM save failed; trying list sync / Telegram");
    }
  }

  const listEmailOk =
    Boolean(emailRaw) && isValidLeadEmail(emailRaw);
  let listOk = false;
  if (listReady && token && listEmailOk) {
    listOk = await addEmailToSendPulseAddressBook({
      token,
      email: emailRaw,
      name,
      phone,
      ...(!tierlessConsultation && service ? { service } : {}),
      ...(!tierlessConsultation && tier ? { tier } : {}),
      ...(leadIntent ? { leadIntent } : {}),
    });
    if (!listOk && crmOk) {
      console.warn(
        "[sendpulse] address book sync failed; CRM already saved the lead",
      );
    } else if (!listOk && !crmReady) {
      console.warn(
        "[sendpulse] address book sync failed; may rely on Telegram fallback",
      );
    }
  }

  let telegramOk = false;
  if (telegramReady) {
    telegramOk = await sendTelegramLead(
      buildTelegramLeadText({
        name,
        phone,
        ...(emailRaw ? { email: emailRaw } : {}),
        ...(callTime ? { callTime } : {}),
        ...(!tierlessConsultation && service ? { service } : {}),
        ...(!tierlessConsultation && tier ? { tier } : {}),
        ...(tierDisplayName ? { tierDisplayName } : {}),
        ...(leadIntent ? { leadIntent } : {}),
      }),
    );
    if (!telegramOk && (crmOk || listOk)) {
      console.warn(
        "[sendpulse] Telegram delivery failed; lead saved via SendPulse",
      );
    }
  }

  const delivered =
    (crmReady && Boolean(token) && crmOk) ||
    (listReady && Boolean(token) && listEmailOk && listOk) ||
    (telegramReady && telegramOk);

  if (!delivered) {
    return NextResponse.json(
      { ok: false, error: "no_delivery_channel" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
