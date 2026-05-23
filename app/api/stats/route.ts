import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

interface StatusRow extends RowDataPacket {
  status: string;
  count: number;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pool = await getPool();
    const days = req.nextUrl.searchParams.get("days");
    const where = days ? `WHERE created_at >= NOW() - INTERVAL ${parseInt(days)} DAY` : "";

    const [rows] = await pool.query<StatusRow[]>(
      `SELECT status, COUNT(*) as count FROM summercamp_sy ${where} GROUP BY status ORDER BY count DESC`
    );

    const total = rows.reduce((sum, r) => sum + r.count, 0);
    const paid = rows.find((r) => r.status === "paid")?.count || 0;
    const pendingPayment = rows.find((r) => r.status === "pending_payment")?.count || 0;
    const inProgress = rows
      .filter((r) => ["step_plan", "step_child", "step_parent", "step_timing"].includes(r.status))
      .reduce((sum, r) => sum + r.count, 0);

    return NextResponse.json({ total, paid, pendingPayment, inProgress, breakdown: rows, period: days ? `Last ${days} days` : "All time" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
