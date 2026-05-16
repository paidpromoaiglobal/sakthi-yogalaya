import nodemailer from "nodemailer";

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

export async function sendEnrollmentEmails(meta: Record<string, string>, totalCharged: string) {
  await Promise.all([
    sendCustomerEmail(meta, totalCharged),
    sendAdminEmail(meta, totalCharged),
  ]);
}

async function sendCustomerEmail(meta: Record<string, string>, totalCharged: string) {
  const planLabel = meta.plan === "2months" ? "2 Months" : "1 Month";

  await transporter.sendMail({
    from: `"Sakthi Yogalaya Summer Camp" <${process.env.SMTP_USER}>`,
    to: meta.email,
    subject: "🎉 You're Enrolled! Kids Yoga Summer Workshop – Season 6",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(94,31,138,0.12);">
    <div style="background:linear-gradient(135deg,#5E1F8A,#C41E8C,#F97316);padding:40px 32px;text-align:center;">
      <img src="https://www.sakthiyogalaya.com/images/WebLogo.png" alt="Sakthi Yogalaya" style="height:56px;margin-bottom:16px;filter:brightness(10);">
      <h1 style="color:white;margin:0;font-size:28px;font-weight:800;">You're Enrolled! 🎉</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">Kids Yoga Summer Workshop – Season 6</p>
    </div>
    <div style="padding:36px 32px;">
      <p style="font-size:16px;color:#374151;margin:0 0 24px;">Dear <strong>${meta.parentsName}</strong>,</p>
      <p style="font-size:15px;color:#6B7280;line-height:1.7;margin:0 0 28px;">
        We're thrilled to welcome <strong style="color:#5E1F8A;">${meta.kidsName}</strong> to our Summer Workshop Season 6!
        Get ready for a summer full of fun, flexibility, and mindfulness 🧘‍♀️
      </p>
      <div style="background:#FAF5FF;border-radius:14px;padding:24px;margin-bottom:28px;border:1px solid #EDD9FF;">
        <h2 style="color:#5E1F8A;font-size:15px;font-weight:800;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em;">Enrollment Details</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:7px 0;color:#6B7280;font-size:14px;width:45%;">Child's Name</td><td style="padding:7px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.kidsName}</td></tr>
          <tr><td style="padding:7px 0;color:#6B7280;font-size:14px;">Grade</td><td style="padding:7px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.grade}</td></tr>
          <tr><td style="padding:7px 0;color:#6B7280;font-size:14px;">Plan</td><td style="padding:7px 0;color:#1F2937;font-weight:700;font-size:14px;">${planLabel}</td></tr>
          <tr><td style="padding:7px 0;color:#6B7280;font-size:14px;">Class Timing</td><td style="padding:7px 0;color:#C41E8C;font-weight:800;font-size:14px;">${meta.timing}</td></tr>
          <tr style="border-top:1px solid #EDD9FF;"><td style="padding:12px 0 7px;color:#6B7280;font-size:14px;">Amount Paid</td><td style="padding:12px 0 7px;color:#5E1F8A;font-weight:800;font-size:16px;">$${totalCharged}</td></tr>
        </table>
      </div>
      <div style="background:#FFF9F0;border-radius:14px;padding:24px;margin-bottom:28px;border:1px solid #FDE68A;">
        <h2 style="color:#92400E;font-size:15px;font-weight:800;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.05em;">What Happens Next?</h2>
        <ul style="margin:0;padding-left:0;list-style:none;">
          <li style="padding:6px 0;font-size:14px;color:#374151;">📧 &nbsp;A detailed confirmation will be sent to this email</li>
          <li style="padding:6px 0;font-size:14px;color:#374151;">💬 &nbsp;WhatsApp group invite will be sent within 24 hours</li>
          <li style="padding:6px 0;font-size:14px;color:#374151;">🔗 &nbsp;Zoom link will be shared before the first class</li>
          <li style="padding:6px 0;font-size:14px;color:#374151;">🧘 &nbsp;Your child's yoga journey begins!</li>
        </ul>
      </div>
      <p style="font-size:14px;color:#6B7280;line-height:1.7;margin:0 0 8px;">If you have any questions, reach us at:</p>
      <p style="font-size:14px;color:#5E1F8A;font-weight:700;margin:0 0 4px;">📞 +1 (727) 415-5308 &nbsp;|&nbsp; +1 (804) 300-7141</p>
      <p style="font-size:14px;color:#5E1F8A;font-weight:700;margin:0 0 28px;">📧 summercamp@sakthiyogalaya.com</p>
      <p style="font-size:15px;color:#374151;margin:0;">Warm regards,<br><strong style="color:#5E1F8A;">Sakthi Yogalaya Team</strong></p>
    </div>
    <div style="background:#3D1259;padding:20px 32px;text-align:center;">
      <p style="color:#C4B5FD;font-size:12px;margin:0;">© 2026 Sakthi Yogalaya · summercamp.sakthiyogalaya.com</p>
    </div>
  </div>
</body>
</html>`,
  });
}

async function sendAdminEmail(meta: Record<string, string>, totalCharged: string) {
  const planLabel = meta.plan === "2months" ? "2 Months" : "1 Month";

  await transporter.sendMail({
    from: `"Sakthi Yogalaya Enrollments" <${process.env.SMTP_USER}>`,
    to: [process.env.SMTP_USER!, "sakthiyogalaya@gmail.com"],
    subject: `New Enrollment: ${meta.kidsName} – ${planLabel} Plan`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(94,31,138,0.12);">
    <div style="background:linear-gradient(135deg,#5E1F8A,#C41E8C);padding:28px 32px;">
      <h1 style="color:white;margin:0;font-size:22px;font-weight:800;">New Enrollment Received 📋</h1>
      <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Summer Workshop Season 6</p>
    </div>
    <div style="padding:32px;">
      <div style="background:#FAF5FF;border-radius:14px;padding:24px;margin-bottom:20px;border:1px solid #EDD9FF;">
        <h2 style="color:#5E1F8A;font-size:13px;font-weight:800;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.05em;">Child Details</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;width:40%;">Name</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.kidsName}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;">Date of Birth</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.dob}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;">Grade</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.grade}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;">Yoga Experience</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.experience}</td></tr>
        </table>
      </div>
      <div style="background:#F0FFF4;border-radius:14px;padding:24px;margin-bottom:20px;border:1px solid #BBF7D0;">
        <h2 style="color:#065F46;font-size:13px;font-weight:800;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.05em;">Parent / Guardian</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;width:40%;">Name</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.parentsName}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;">WhatsApp</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.whatsapp}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;">Email</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.email}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;">Address</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${meta.address}</td></tr>
        </table>
      </div>
      <div style="background:#FFF9F0;border-radius:14px;padding:24px;border:1px solid #FDE68A;">
        <h2 style="color:#92400E;font-size:13px;font-weight:800;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.05em;">Enrollment & Payment</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;width:40%;">Plan</td><td style="padding:6px 0;color:#1F2937;font-weight:700;font-size:14px;">${planLabel}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;">Class Timing</td><td style="padding:6px 0;color:#C41E8C;font-weight:800;font-size:14px;">${meta.timing}</td></tr>
          <tr><td style="padding:6px 0;color:#6B7280;font-size:14px;">Amount Charged</td><td style="padding:6px 0;color:#5E1F8A;font-weight:800;font-size:16px;">$${totalCharged}</td></tr>
        </table>
      </div>
    </div>
    <div style="background:#3D1259;padding:16px 32px;text-align:center;">
      <p style="color:#C4B5FD;font-size:12px;margin:0;">Sakthi Yogalaya · Summer Camp Season 6 Enrollments</p>
    </div>
  </div>
</body>
</html>`,
  });
}
