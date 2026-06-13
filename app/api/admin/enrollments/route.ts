import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== "cherubim-admin-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pool = await getPool();
  const [rows] = await pool.query(
    "SELECT * FROM summercamp_sy ORDER BY created_at ASC"
  );
  return NextResponse.json({ enrollments: rows });
}
