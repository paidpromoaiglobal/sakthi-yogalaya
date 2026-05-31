import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

const STEP_STATUS = ["step_plan", "step_parent", "step_child", "step_timing"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enrollment_id, step, ...fields } = body as {
      enrollment_id: string;
      step: number;
      plan?: string;
      kidsName?: string;
      dob?: string;
      grade?: string;
      experience?: string;
      parentsName?: string;
      whatsapp?: string;
      email?: string;
      address?: string;
    };

    if (!enrollment_id) {
      return NextResponse.json({ error: "enrollment_id required" }, { status: 400 });
    }

    const status = STEP_STATUS[step] ?? "step_plan";
    const pool = await getPool();

    // Check if record exists
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT enrollment_id FROM summercamp_sy WHERE enrollment_id = ?",
      [enrollment_id]
    );

    if (rows.length === 0) {
      // Insert new record
      await pool.query(
        `INSERT INTO summercamp_sy
           (enrollment_id, plan, kids_name, dob, grade, experience,
            parents_name, whatsapp, email, address, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          enrollment_id,
          fields.plan ?? null,
          fields.kidsName ?? null,
          fields.dob ?? null,
          fields.grade ?? null,
          fields.experience ?? null,
          fields.parentsName ?? null,
          fields.whatsapp ?? null,
          fields.email ?? null,
          fields.address ?? null,
          status,
        ]
      );
    } else {
      // Update existing record — only overwrite non-null incoming fields
      const updates: string[] = ["status = ?"];
      const values: unknown[] = [status];

      const fieldMap: Record<string, string> = {
        plan: "plan",
        kidsName: "kids_name",
        dob: "dob",
        grade: "grade",
        experience: "experience",
        parentsName: "parents_name",
        whatsapp: "whatsapp",
        email: "email",
        address: "address",
      };

      for (const [jsKey, colName] of Object.entries(fieldMap)) {
        const val = fields[jsKey as keyof typeof fields];
        if (val !== undefined && val !== null) {
          updates.push(`${colName} = ?`);
          values.push(val);
        }
      }

      values.push(enrollment_id);
      await pool.query(
        `UPDATE summercamp_sy SET ${updates.join(", ")} WHERE enrollment_id = ?`,
        values
      );
    }

    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("Enrollment save error:", err);
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}
