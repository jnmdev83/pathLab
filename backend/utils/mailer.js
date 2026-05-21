const nodemailer = require('nodemailer');

// ─── REAL EMAIL TRANSPORTER ──────────────────────────────────────────────────
// To send REAL emails to actual inboxes, we must use a real email provider.
// We are configuring this to use Gmail. You need to provide your Gmail address
// and a special "App Password" in your .env file!
async function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ [EMAIL SYSTEM] Missing EMAIL_USER or EMAIL_PASS in .env file. Real emails cannot be sent.");
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the real email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendWelcomeEmail(userEmail, userName) {
  try {
    const transporter = await getTransporter();
    if (!transporter) return false;

    // Write our beautiful industry-standard welcome email
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #84cc16; margin: 0; font-size: 28px;">ChooseMyLab.</h1>
          <p style="color: #666; margin-top: 5px; font-size: 14px;">Affordable & Reliable Health Diagnostics</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">Welcome, ${userName}! 🎉</h2>
          <p style="color: #555; line-height: 1.5;">
            We are thrilled to have you join ChooseMyLab. Your account has been successfully created.
          </p>
          <p style="color: #555; line-height: 1.5;">
            With ChooseMyLab, you can easily find the best diagnostic labs near you, compare prices, and book tests from the comfort of your home.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pathlab-5ktj.onrender.com" style="background-color: #84cc16; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Explore Tests Now
            </a>
          </div>
          
          <p style="color: #555; line-height: 1.5;">
            If you have any questions or need assistance, our support team is always here to help.
          </p>
          <p style="color: #555; line-height: 1.5; margin-bottom: 0;">
            Stay Healthy,<br>
            <strong>The ChooseMyLab Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} ChooseMyLab. All rights reserved.
        </div>
      </div>
    `;

    // Send the REAL email
    await transporter.sendMail({
      from: `"ChooseMyLab Support" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Welcome to ChooseMyLab! 🎉",
      html: htmlContent,
    });

    console.log(`\n✅ [EMAIL SYSTEM] Real welcome email successfully delivered to ${userEmail}\n`);
    return true;
  } catch (error) {
    console.error("❌ [EMAIL SYSTEM] Error sending real welcome email:", error);
    return false;
  }
}

// Function to send REAL OTP via Email
async function sendOtpEmail(userEmail, otpCode) {
  try {
    const transporter = await getTransporter();
    if (!transporter) return false;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; text-align: center;">
        <h2 style="color: #333;">ChooseMyLab Verification</h2>
        <p style="color: #555; font-size: 16px;">Your One-Time Password (OTP) for login/signup is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #84cc16; margin: 20px 0;">
          ${otpCode}
        </div>
        <p style="color: #888; font-size: 12px;">This code will expire in 5 minutes. Do not share this code with anyone.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"ChooseMyLab Auth" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your ChooseMyLab Login Code",
      html: htmlContent,
    });

    console.log(`\n✅ [EMAIL SYSTEM] Real OTP email successfully delivered to ${userEmail}\n`);
    return true;
  } catch (error) {
    console.error("❌ [EMAIL SYSTEM] Error sending real OTP email:", error);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail
};
