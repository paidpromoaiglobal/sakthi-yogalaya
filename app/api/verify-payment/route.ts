import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPool } from "@/lib/db";
import { sendEnrollmentEmails } from "@/lib/emails";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  try {
    const pool = await getPool();

    // Check if already processed (idempotency)
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT status FROM summercamp_sy WHERE stripe_session_id = ?",
      [sessionId]
    );

    if (existing[0]?.status === "paid") {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // Verify with Stripe
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ success: false, reason: "payment_not_completed" });
    }

    // Atomic update — races safely with the webhook handler
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE summercamp_sy
       SET status = 'paid'
       WHERE stripe_session_id = ? AND status != 'paid'`,
      [sessionId]
    );

    if (result.affectedRows > 0) {
      // We won the race — send emails
      const meta  = session.metadata as Record<string, string>;
      const total = meta.totalCharged || String((session.amount_total ?? 0) / 100);
      await sendEnrollmentEmails(meta, total);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
