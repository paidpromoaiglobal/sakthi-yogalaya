import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
}

const BASE_PRICES: Record<string, number> = {
  "1month":  60,
  "2months": 110,
};

function grossUp(base: number): number {
  return Math.ceil(((base + 0.30) / (1 - 0.029)) * 100) / 100;
}

const PLAN_NAMES: Record<string, string> = {
  "1month":  "Kids Yoga Summer Workshop — 1 Month",
  "2months": "Kids Yoga Summer Workshop — 2 Months",
};

async function ensureWebhookRegistered(stripe: Stripe, baseUrl: string) {
  try {
    const pool = await getPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT config_value FROM summercamp_sy_config WHERE config_key = 'webhook_id'"
    );

    if (rows.length > 0) return; // Already registered

    const webhookUrl = `${baseUrl}/api/webhook`;
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: ["checkout.session.completed"],
    });

    await pool.query(
      `INSERT INTO summercamp_sy_config (config_key, config_value) VALUES
       ('webhook_id', ?), ('webhook_secret', ?)
       ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)`,
      [webhook.id, webhook.secret]
    );
  } catch (err) {
    // Non-fatal — success URL verification still handles payment confirmation
    console.error("Webhook auto-registration error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      enrollment_id,
      plan, kidsName, dob, grade, parentsName,
      whatsapp, email, address, experience, timing,
    } = body;

    if (!plan || !BASE_PRICES[plan]) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    const basePrice  = BASE_PRICES[plan];
    const totalPrice = grossUp(basePrice);
    const fee        = +(totalPrice - basePrice).toFixed(2);
    const totalCents = Math.round(totalPrice * 100);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://summercamp.sakthiyogalaya.com";
    const stripe  = getStripe();

    // Register webhook on first checkout (non-blocking in background)
    ensureWebhookRegistered(stripe, baseUrl).catch(() => {});

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: totalCents,
            product_data: {
              name: PLAN_NAMES[plan],
              description: `Program fee $${basePrice} + processing fee $${fee} | Timing: ${timing} | Kid: ${kidsName} (${grade})`,
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        enrollment_id: enrollment_id || "",
        plan,
        basePriceDollars: String(basePrice),
        processingFeeDollars: String(fee),
        totalCharged: String(totalPrice),
        kidsName,
        dob,
        grade,
        parentsName,
        whatsapp,
        email,
        address: address.substring(0, 500),
        experience: experience || "not specified",
        timing,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/cancel`,
    });

    // Update DB with Stripe session ID and payment amounts
    if (enrollment_id) {
      try {
        const pool = await getPool();
        await pool.query(
          `UPDATE summercamp_sy
           SET stripe_session_id = ?, amount_base = ?, amount_fee = ?,
               amount_total = ?, timing = ?, status = 'pending_payment'
           WHERE enrollment_id = ?`,
          [session.id, basePrice, fee, totalPrice, timing, enrollment_id]
        );
      } catch (dbErr) {
        console.error("DB update error after checkout:", dbErr);
      }
    }

    return NextResponse.json({ url: session.url, fee, total: totalPrice });
  } catch (err: unknown) {
    console.error("Stripe error:", err);
    const message = err instanceof Error ? err.message : "Payment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
