const nodemailer = require("nodemailer");
const navbarModel = require("../../models/navbar/navbar");

const sendEmail = async ({ to, subject, bodyHtml }) => {
  try {
    /* ================= NAVBAR FETCH (SAFE) ================= */
    let schoolTitle = "School Admission";
    let schoolSubtitle = "";
    let schoolLogo = "";

    try {
      const navbar = await navbarModel.findOne({ isActive: true });
      if (navbar?.brand) {
        schoolTitle = navbar.brand.title || schoolTitle;
        schoolSubtitle = navbar.brand.subtitle || "";
        schoolLogo = navbar.brand.logoImage?.url || "";
      }
    } catch {
      console.warn("Navbar not found, fallback used");
    }

    /* ================= TRANSPORTER ================= */
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    /* ================= PREMIUM RESPONSIVE EMAIL ================= */
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:20px 0">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,0.08)">

          <!-- HEADER -->
          <tr>
            <td style="background:#0f172a;padding:30px;text-align:center">
              ${schoolLogo
        ? `<img src="${schoolLogo}" alt="logo" style="height:70px;margin-bottom:12px;max-width:100%"/>`
        : ""
      }
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700">${schoolTitle}</h1>
              ${schoolSubtitle
        ? `<p style="color:#c7d2fe;margin:6px 0 0;font-size:14px">${schoolSubtitle}</p>`
        : ""
      }
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 26px;color:#1f2937;font-size:15px;line-height:1.7">
              ${bodyHtml}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1f5f9;padding:18px;text-align:center">
              <p style="margin:0;font-size:12px;color:#4b5563">
                © ${new Date().getFullYear()} ${schoolTitle}. All Rights Reserved.
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:#9ca3af">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

    /* ================= SEND ================= */
    await transporter.sendMail({
      from: `"${schoolTitle}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to:", to);

  } catch (error) {
    console.error("❌ SEND EMAIL ERROR:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
