const nodemailer = require('nodemailer');

// ─── IN-MEMORY EMAIL DEBUG LOGS ──────────────────────────────────────────────
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
  if (emailLogs.length > 100) {
    emailLogs.pop();
  }
}

// ─── NODEMAILER TRANSPORTER ───────────────────────────────────────────────────
// Uses Gmail SMTP via App Password — works locally & on most hosted servers.
// To generate an App Password: https://myaccount.google.com/apppasswords
// Set EMAIL_USER and EMAIL_PASS in your .env file.
function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('⚠️  [EMAIL SYSTEM] Missing EMAIL_USER or EMAIL_PASS in environment variables.');
    addEmailLog('system', 'all', 'warning', 'Missing EMAIL_USER or EMAIL_PASS.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

// ─── WELCOME EMAIL ────────────────────────────────────────────────────────────
// Sent automatically when a user successfully registers on the platform.
async function sendWelcomeEmail(userEmail, userName) {
  const transporter = getTransporter();
  if (!transporter) return false;

  const senderEmail = process.env.EMAIL_USER || 'noreply@choosemylab.com';
  const senderName  = 'ChooseMyLab';

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); padding: 36px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">ChooseMyLab</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">Affordable &amp; Reliable Health Diagnostics</p>
      </div>

      <!-- Body -->
      <div style="padding: 36px 32px;">
        <h2 style="color: #1a1a1a; margin: 0 0 12px; font-size: 24px;">Welcome, ${userName}! 🎉</h2>
        <p style="color: #555; line-height: 1.7; font-size: 15px; margin: 0 0 16px;">
          We're thrilled to have you on board. Your account has been successfully created on <strong>ChooseMyLab</strong> — your one-stop destination for trusted health diagnostics.
        </p>
        <p style="color: #555; line-height: 1.7; font-size: 15px; margin: 0 0 28px;">
          You can now easily discover diagnostic labs near you, compare prices, and book tests from the comfort of your home.
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 0 0 32px;">
          <a href="https://pathlab-5ktj.onrender.com"
             style="background-color: #84cc16; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block;">
            Explore Tests Now →
          </a>
        </div>

        <!-- What's next section -->
        <div style="background: #f8fafc; border-left: 4px solid #84cc16; padding: 16px 20px; border-radius: 6px; margin: 0 0 28px;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #333; font-size: 14px;">✅ What you can do now:</p>
          <ul style="margin: 0; padding-left: 18px; color: #555; font-size: 14px; line-height: 1.8;">
            <li>Browse 100+ available diagnostic tests</li>
            <li>Compare prices across multiple labs</li>
            <li>Book a test and get results at home</li>
          </ul>
        </div>

        <p style="color: #888; font-size: 14px; line-height: 1.6; margin: 0;">
          Need help? Just reply to this email — our support team is always ready to assist you.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9f9f9; border-top: 1px solid #eaeaea; padding: 20px 32px; text-align: center;">
        <p style="color: #555; margin: 0 0 4px; font-size: 14px;">Stay Healthy,</p>
        <p style="color: #333; font-weight: 700; margin: 0 0 16px; font-size: 14px;">The ChooseMyLab Team</p>
        <p style="color: #bbb; font-size: 12px; margin: 0;">
          &copy; ${new Date().getFullYear()} ChooseMyLab. All rights reserved.<br>
          You are receiving this email because you just signed up at choosemylab.com.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: userEmail,
      subject: 'Welcome to ChooseMyLab! 🎉',
      html: htmlContent,
    });

    console.log(`\n✅ [EMAIL SYSTEM] Welcome email delivered to ${userEmail} (MessageId: ${info.messageId})\n`);
    addEmailLog('welcome', userEmail, 'success', `Delivered via Nodemailer. ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ [EMAIL SYSTEM] Error sending welcome email:', error.message);
    addEmailLog('welcome', userEmail, 'error', `Nodemailer Error: ${error.message}`);
    return false;
  }
}

// ─── OTP EMAIL ────────────────────────────────────────────────────────────────
async function sendOtpEmail(userEmail, otpCode) {
  const transporter = getTransporter();
  if (!transporter) return false;

  const senderEmail = process.env.EMAIL_USER || 'noreply@choosemylab.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; text-align: center;">
      <h2 style="color: #333;">ChooseMyLab Verification</h2>
      <p style="color: #555; font-size: 16px;">Your One-Time Password (OTP) for login/signup is:</p>
      <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; color: #84cc16;">
        ${otpCode}
      </div>
      <p style="color: #777; font-size: 13px;">This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #bbb; font-size: 12px;">ChooseMyLab &mdash; Affordable &amp; Reliable Health Diagnostics</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"ChooseMyLab" <${senderEmail}>`,
      to: userEmail,
      subject: 'Your ChooseMyLab Login Code',
      html: htmlContent,
    });

    console.log(`\n✅ [EMAIL SYSTEM] OTP email delivered to ${userEmail} (MessageId: ${info.messageId})\n`);
    addEmailLog('otp', userEmail, 'success', `Delivered via Nodemailer. ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ [EMAIL SYSTEM] Error sending OTP email:', error.message);
    addEmailLog('otp', userEmail, 'error', `Nodemailer Error: ${error.message}`);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail,
  getEmailLogs
};
