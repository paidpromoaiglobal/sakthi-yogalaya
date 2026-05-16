import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPool } from "@/lib/db";
import { sendEnrollmentEmails } from "@/lib/emails";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
}

async function getWebhookSecret(): Promise<string> {
  // Prefer env var (manual config), fall back to DB-stored secret from auto-registration
  if (process.env.STRIPE_WEBHOOK_SECRET) return process.env.STRIPE_WEBHOOK_SECRET;

  const pool = await getPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT config_value FROM summercamp_sy_config WHERE config_key = 'webhook_secret'"
  );
  if (!rows.length) throw new Error("Webhook secret not configured");
  return rows[0].config_value as string;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let webhookSecret: string;
  try {
    webhookSecret = await getWebhookSecret();
  } catch {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta    = session.metadata as Record<string, string>;
    const total   = meta.totalCharged || String((session.amount_total ?? 0) / 100);

    if (session.payment_status === "paid") {
      await processPaymentConfirmation(session.id, meta, total);
    }
  }

  return NextResponse.json({ received: true });
}

async function processPaymentConfirmation(
  sessionId: string,
  meta: Record<string, string>,
  totalCharged: string
) {
  try {
    const pool = await getPool();

    // Atomic update — only the first caller (webhook or success page) wins
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE summercamp_sy
       SET status = 'paid'
       WHERE stripe_session_id = ? AND status != 'paid'`,
      [sessionId]
    );

    if (result.affectedRows === 0) return; // Already processed

    await sendEnrollmentEmails(meta, totalCharged);
  } catch (err) {
    console.error("Payment confirmation error:", err);
  }
}
