import { after, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const START_REPLY =
  "Вітаю! Я бот компанії ACG Accounting. Я тут, щоб оперативно сповіщати вас про нові заявки з сайту. Очікуйте на нові ліди!";

type IncomingMessage = {
  message_id?: number;
  text?: string;
  chat?: { id?: number };
};

type TelegramUpdate = {
  update_id?: number;
  message?: IncomingMessage;
  edited_message?: IncomingMessage;
};

function extractStartChatId(update: TelegramUpdate): number | null {
  const msg = update.message ?? update.edited_message;
  const text = msg?.text?.trim() ?? "";
  const chatId = msg?.chat?.id;
  if (chatId == null || !Number.isFinite(chatId)) return null;
  if (!text.startsWith("/start")) return null;
  return chatId;
}

async function sendStartReply(chatId: number): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    console.error(
      "[telegram/webhook] TELEGRAM_BOT_TOKEN missing; cannot answer /start",
    );
    return;
  }
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: START_REPLY,
      }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error(
        "[telegram/webhook] sendMessage failed",
        res.status,
        errBody.slice(0, 500),
      );
    }
  } catch (e) {
    console.error("[telegram/webhook] sendMessage error", e);
  }
}

/**
 * Webhook для Bot API: відповідь на /start + швидке 200 OK для Telegram.
 * Налаштування: setWebhook з url `.../api/telegram/webhook` та (рекомендовано)
 * secret — `TELEGRAM_WEBHOOK_SECRET` (той самий, що в setWebhook secret_token).
 */
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (secret) {
    const hdr = req.headers.get("x-telegram-bot-api-secret-token");
    if (hdr !== secret) {
      return new NextResponse(null, { status: 401 });
    }
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const chatId = extractStartChatId(update);
  if (chatId !== null) {
    after(async () => {
      await sendStartReply(chatId);
    });
  }

  return NextResponse.json({ ok: true });
}
