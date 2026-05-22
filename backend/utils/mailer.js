const nodemailer = require('nodemailer');

// ─── IN-MEMORY EMAIL DEBUG LOGS ──────────────────────────────────────────────
// This lets the user open /api/auth/email-logs in the browser to inspect
// the exact Nodemailer connection errors live on Render!
const emailLogs = [];

function getEmailLogs() {
  return emailLogs;
}

function addEmailLog(type, to, status, detail = null) {
  emailLogs.unshift({
    timestamp: new Date().toISOString(),
    type,
    to,
    status,
    detail
  });
  // Keep only the most recent 100 logs
  if (emailLogs.length > 100) {
    emailLogs.pop();
  }
}

// ─── REAL EMAIL TRANSPORTER ──────────────────────────────────────────────────
async function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ [EMAIL SYSTEM] Missing EMAIL_USER or EMAIL_PASS in .env file. Real emails cannot be sent.");
    addEmailLog('system', 'all', 'warning', 'Missing EMAIL_USER or EMAIL_PASS configuration.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendWelcomeEmail(userEmail, userName) {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      addEmailLog('welcome', userEmail, 'failed', 'Transporter not initialized. Missing environment keys.');
      return false;
    }

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
    addEmailLog('welcome', userEmail, 'success', 'Welcome email delivered successfully.');
    return true;
  } catch (error) {
    console.error("❌ [EMAIL SYSTEM] Error sending real welcome email:", error);
    addEmailLog('welcome', userEmail, 'error', `Nodemailer Error: ${error.message}`);
    return false;
  }
}

// Function to send REAL OTP via Email
async function sendOtpEmail(userEmail, otpCode) {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      addEmailLog('otp', userEmail, 'failed', 'Transporter not initialized. Missing environment keys.');
      return false;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; text-align: center;">
        <h2 style="color: #333;">ChooseMyLab Verification</h2>
        <p style="color: #555; font-size: 16px;">Your One-Time Password (OTP) for login/signup is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; color: #84cc16;">
          ${otpCode}
        </div>
        <p style="color: #777; font-size: 12px;">This code is valid for 10 minutes. Please do not share it with anyone.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"ChooseMyLab Auth" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your ChooseMyLab Login Code",
      html: htmlContent,
    });

    console.log(`\n✅ [EMAIL SYSTEM] Real OTP email successfully delivered to ${userEmail}\n`);
    addEmailLog('otp', userEmail, 'success', 'OTP email delivered successfully.');
    return true;
  } catch (error) {
    console.error("❌ [EMAIL SYSTEM] Error sending real OTP email:", error);
    addEmailLog('otp', userEmail, 'error', `Nodemailer Error: ${error.message}`);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail,
  getEmailLogs
};
