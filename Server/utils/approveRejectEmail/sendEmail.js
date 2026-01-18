const nodemailer = require("nodemailer");
const navbarModel = require("../../models/navbar/navbar");

/* 🔥 Reuse transporter (BEST PRACTICE) */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const sendEmail = async ({ to, subject, bodyHtml }) => {
  try {
    /* ================= SCHOOL DATA ================= */
    let schoolTitle = "School Admission";
    let schoolSubtitle = "";
    let schoolLogo = "";

    try {
      const navbar = await navbarModel.findOne({ isActive: true }).lean();
      if (navbar?.brand) {
        schoolTitle = navbar.brand.title || schoolTitle;
        schoolSubtitle = navbar.brand.subtitle || "";
        schoolLogo = navbar.brand.logoImage?.url || "";
      }
    } catch {
      console.warn("Navbar not found, fallback used");
    }

    /* ================= VERIFY SMTP (SAFE) ================= */
    await transporter.verify();

    /* ================= EMAIL HTML ================= */
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:650px;margin:20px auto;background:#ffffff;border-radius:12px;overflow:hidden">
    
    <div style="background:#0f172a;padding:24px;text-align:center">
      ${
        schoolLogo
          ? `<img src="${schoolLogo}" alt="logo" style="height:60px;margin-bottom:10px"/>`
          : ""
      }
      <h1 style="color:#ffffff;margin:0;font-size:24px">${schoolTitle}</h1>
      ${
        schoolSubtitle
          ? `<p style="color:#c7d2fe;margin:6px 0 0;font-size:13px">${schoolSubtitle}</p>`
          : ""
      }
    </div>

    <div style="padding:28px;color:#1f2937;font-size:15px;line-height:1.7">
      ${bodyHtml}
    </div>

    <div style="background:#f1f5f9;padding:14px;text-align:center">
      <p style="margin:0;font-size:12px;color:#4b5563">
        © ${new Date().getFullYear()} ${schoolTitle}. All rights reserved.
      </p>
      <p style="margin:6px 0 0;font-size:11px;color:#9ca3af">
        This is an automated email. Please do not reply.
      </p>
    </div>

  </div>
</body>
</html>`;

    /* ================= SEND MAIL ================= */
    await transporter.sendMail({
      from: `"${schoolTitle}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

  } catch (error) {
    console.error("❌ SEND EMAIL ERROR:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
