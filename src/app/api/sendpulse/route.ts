import { NextResponse } from "next/server";

const CRM_BASE = "https://api.sendpulse.com/crm/v1";
const AUTH_URL = "https://api.sendpulse.com/oauth/access_token";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
};

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SENDPULSE_ID?.trim();
  const clientSecret = process.env.SENDPULSE_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

async function resolveResponsibleId(token: string): Promise<number | null> {
  const envId = process.env.SENDPULSE_RESPONSIBLE_ID?.trim();
  if (envId) {
    const parsed = Number.parseInt(envId, 10);
    if (!Number.isNaN(parsed)) return parsed;
  }

  const res = await fetch(`${CRM_BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as { data?: unknown };
  const rows = Array.isArray(json.data)
    ? json.data
    : json.data && typeof json.data === "object"
      ? [json.data]
      : [];
  const id = (rows[0] as { id?: number } | undefined)?.id;
  return typeof id === "number" ? id : null;
}

function splitName(full: string): { firstName: string; lastName?: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const rest = parts.slice(1).join(" ").trim();
  return rest ? { firstName, lastName: rest } : { firstName };
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!name || !phone || !email) {
    return NextResponse.json({ ok: false, error: "required_fields" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: "auth_failed" }, { status: 503 });
  }

  const responsibleId = await resolveResponsibleId(token);
  if (responsibleId === null) {
    return NextResponse.json({ ok: false, error: "no_responsible" }, { status: 503 });
  }

  const { firstName, lastName } = splitName(name);
  if (!firstName) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  const payload: Record<string, unknown> = {
    responsibleId,
    firstName,
    phones: [phone],
    emails: [email],
  };
  if (lastName) payload.lastName = lastName;

  const crmRes = await fetch(`${CRM_BASE}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!crmRes.ok) {
    return NextResponse.json({ ok: false, error: "crm_rejected" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
