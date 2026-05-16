import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import nodemailer from "nodemailer";
import type { RowDataPacket } from "mysql2";

interface Enrollment extends RowDataPacket {
  id: number;
  enrollment_id: string;
  plan: string;
  kids_name: string;
  dob: string;
  grade: string;
  experience: string;
  parents_name: string;
  whatsapp: string;
  email: string;
  address: string;
  timing: string;
  amount_total: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const transporter = nodemailer.createTransport({
  host: "103.235.104.154",
  port: 465,
  secure: true,
  tls: { rejectUnauthorized: false },
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function GET(req: NextRequest) {
  // Protect endpoint — only Vercel cron or manual trigger with secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pool = await getPool();

    const [allRows] = await pool.query<Enrollment[]>(
      `SELECT * FROM summercamp_sy ORDER BY created_at DESC`
    );

    const paid = allRows.filter((r) => r.status === "paid");
    const droppedAtCheckout = allRows.filter((r) => r.status === "pending_payment" || r.status === "failed");
    const inProgress = allRows.filter((r) =>
      ["step_plan", "step_child", "step_parent", "step_timing"].includes(r.status)
    );

    // Batch breakdown
    const batchMap: Record<string, number> = {};
    for (const r of paid) {
      batchMap[r.timing] = (batchMap[r.timing] || 0) + 1;
    }

    // Plan breakdown
    const planMap: Record<string, number> = {};
    for (const r of paid) {
      const label = r.plan === "2months" ? "2 Months" : "1 Month";
      planMap[label] = (planMap[label] || 0) + 1;
    }

    const totalRevenue = paid.reduce((sum, r) => sum + Number(r.amount_total || 0), 0);

    const weekLabel = getWeekLabel();

    const html = buildReportHtml({
      weekLabel,
      paid,
      droppedAtCheckout,
      inProgress,
      batchMap,
      planMap,
      totalRevenue,
    });

    await transporter.sendMail({
      from: `"Sakthi Yogalaya Reports" <${process.env.SMTP_USER}>`,
      to: ["summercamp@sakthiyogalaya.com", "sakthiyogalaya@gmail.com"],
      cc: ["mtmvivek@gmail.com"],
      subject: `📊 Weekly Enrollment Report – ${weekLabel}`,
      html,
    });

    return NextResponse.json({ ok: true, sent: true, totalEnrollments: allRows.length });
  } catch (err) {
    console.error("Weekly report error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function getWeekLabel() {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    step_plan: "Started – Plan",
    step_child: "Started – Child Info",
    step_parent: "Started – Parent Info",
    step_timing: "Started – Timing",
    pending_payment: "Reached Checkout",
    paid: "Paid ✅",
    failed: "Payment Failed",
  };
  return map[status] || status;
}

function rowStyle(i: number) {
  return i % 2 === 0 ? "background:#FAF5FF;" : "background:#ffffff;";
}

function buildReportHtml({
  weekLabel,
  paid,
  droppedAtCheckout,
  inProgress,
  batchMap,
  planMap,
  totalRevenue,
}: {
  weekLabel: string;
  paid: Enrollment[];
  droppedAtCheckout: Enrollment[];
  inProgress: Enrollment[];
  batchMap: Record<string, number>;
  planMap: Record<string, number>;
  totalRevenue: number;
}) {
  const allStarted = [...paid, ...droppedAtCheckout, ...inProgress];

  const summaryRows = [
    ["Total Started Enrollment", allStarted.length],
    ["Completed Payments (Paid)", paid.length],
    ["Reached Checkout (Not Paid)", droppedAtCheckout.length],
    ["Still In Form", inProgress.length],
    ["Total Revenue", `$${totalRevenue.toFixed(2)}`],
  ];

  const enrollmentTable = (rows: Enrollment[]) =>
    rows.length === 0
      ? `<p style="color:#6B7280;font-size:14px;margin:0;">None this period.</p>`
      : `<table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#5E1F8A;color:white;">
              <th style="padding:10px 8px;text-align:left;">Child</th>
              <th style="padding:10px 8px;text-align:left;">Grade</th>
              <th style="padding:10px 8px;text-align:left;">Plan</th>
              <th style="padding:10px 8px;text-align:left;">Timing</th>
              <th style="padding:10px 8px;text-align:left;">Parent</th>
              <th style="padding:10px 8px;text-align:left;">WhatsApp</th>
              <th style="padding:10px 8px;text-align:left;">Email</th>
              <th style="padding:10px 8px;text-align:left;">Status</th>
              <th style="padding:10px 8px;text-align:left;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r, i) => `
              <tr style="${rowStyle(i)}">
                <td style="padding:8px;color:#1F2937;font-weight:600;">${r.kids_name || "—"}</td>
                <td style="padding:8px;color:#374151;">${r.grade || "—"}</td>
                <td style="padding:8px;color:#374151;">${r.plan === "2months" ? "2 Months" : r.plan === "1month" ? "1 Month" : r.plan || "—"}</td>
                <td style="padding:8px;color:#C41E8C;font-weight:600;">${r.timing || "—"}</td>
                <td style="padding:8px;color:#374151;">${r.parents_name || "—"}</td>
                <td style="padding:8px;color:#374151;">${r.whatsapp || "—"}</td>
                <td style="padding:8px;color:#374151;">${r.email || "—"}</td>
                <td style="padding:8px;color:#374151;">${statusLabel(r.status)}</td>
                <td style="padding:8px;color:#6B7280;">${new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:900px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(94,31,138,0.12);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#5E1F8A,#C41E8C,#F97316);padding:36px 32px;text-align:center;">
      <img src="https://www.sakthiyogalaya.com/images/WebLogo.png" alt="Sakthi Yogalaya" style="height:52px;margin-bottom:14px;filter:brightness(10);">
      <h1 style="color:white;margin:0;font-size:26px;font-weight:800;">Weekly Enrollment Report 📊</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Kids Yoga Summer Workshop – Season 6 &nbsp;|&nbsp; ${weekLabel}</p>
    </div>

    <div style="padding:36px 32px;">

      <!-- Summary -->
      <h2 style="color:#5E1F8A;font-size:15px;font-weight:800;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Summary</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:36px;">
        ${summaryRows
          .map(
            ([label, value], i) => `
          <tr style="${rowStyle(i)}">
            <td style="padding:12px 16px;color:#374151;font-size:15px;font-weight:500;border-radius:8px;">${label}</td>
            <td style="padding:12px 16px;color:#5E1F8A;font-size:18px;font-weight:800;text-align:right;">${value}</td>
          </tr>`
          )
          .join("")}
      </table>

      <!-- Batch Breakdown -->
      <h2 style="color:#5E1F8A;font-size:15px;font-weight:800;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Batch-wise (Paid)</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:36px;">
        ${Object.entries(batchMap).length === 0
          ? `<tr><td style="padding:12px 16px;color:#6B7280;font-size:14px;">No paid enrollments yet.</td></tr>`
          : Object.entries(batchMap)
              .map(
                ([timing, count], i) => `
            <tr style="${rowStyle(i)}">
              <td style="padding:10px 16px;color:#C41E8C;font-size:14px;font-weight:600;">${timing}</td>
              <td style="padding:10px 16px;color:#5E1F8A;font-size:16px;font-weight:800;text-align:right;">${count} enrolled</td>
            </tr>`
              )
              .join("")}
      </table>

      <!-- Plan Breakdown -->
      <h2 style="color:#5E1F8A;font-size:15px;font-weight:800;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Plan Breakdown (Paid)</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:36px;">
        ${Object.entries(planMap).length === 0
          ? `<tr><td style="padding:12px 16px;color:#6B7280;font-size:14px;">No paid enrollments yet.</td></tr>`
          : Object.entries(planMap)
              .map(
                ([plan, count], i) => `
            <tr style="${rowStyle(i)}">
              <td style="padding:10px 16px;color:#374151;font-size:14px;font-weight:600;">${plan} Plan</td>
              <td style="padding:10px 16px;color:#5E1F8A;font-size:16px;font-weight:800;text-align:right;">${count} enrolled</td>
            </tr>`
              )
              .join("")}
      </table>

      <!-- All Enrollments Table -->
      <h2 style="color:#5E1F8A;font-size:15px;font-weight:800;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">All Enrollments (${allStarted.length})</h2>
      <div style="overflow-x:auto;margin-bottom:36px;border-radius:12px;border:1px solid #EDD9FF;">
        ${enrollmentTable(allStarted)}
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#3D1259;padding:20px 32px;text-align:center;">
      <p style="color:#C4B5FD;font-size:12px;margin:0;">© 2026 Sakthi Yogalaya · Automated Weekly Report · summercamp.sakthiyogalaya.com</p>
    </div>
  </div>
</body>
</html>`;
}
