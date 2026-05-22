const nodemailer = require('nodemailer');
const { Resend }  = require('resend');

// ─── STRATEGY DETECTION ───────────────────────────────────────────────────────
// RESEND_API_KEY set → use Resend HTTP API (works on Render & all cloud hosts).
// Otherwise          → use Nodemailer via Gmail App Password (local dev).
function useResend() {
  return !!process.env.RESEND_API_KEY;
}

// ─── EMAIL TEMPLATES ──────────────────────────────────────────────────────────
function welcomeHtml(userName) {
  return `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #eaeaea;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#84cc16 0%,#65a30d 100%);padding:36px 24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:32px;font-weight:800;">ChooseMyLab</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Affordable &amp; Reliable Health Diagnostics</p>
      </div>
      <div style="padding:36px 32px;">
        <h2 style="color:#1a1a1a;margin:0 0 12px;font-size:24px;">Welcome, ${userName}! 🎉</h2>
        <p style="color:#555;line-height:1.7;font-size:15px;margin:0 0 16px;">
          We're thrilled to have you on board. Your account has been successfully created on <strong>ChooseMyLab</strong> — your one-stop destination for trusted health diagnostics.
        </p>
        <p style="color:#555;line-height:1.7;font-size:15px;margin:0 0 28px;">
          Discover diagnostic labs near you, compare prices, and book tests from the comfort of your home.
        </p>
        <div style="text-align:center;margin:0 0 32px;">
          <a href="https://pathlab-5ktj.onrender.com"
             style="background-color:#84cc16;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;display:inline-block;">
            Explore Tests Now →
          </a>
        </div>
        <div style="background:#f8fafc;border-left:4px solid #84cc16;padding:16px 20px;border-radius:6px;margin:0 0 28px;">
          <p style="margin:0 0 8px;font-weight:600;color:#333;font-size:14px;">✅ What you can do now:</p>
          <ul style="margin:0;padding-left:18px;color:#555;font-size:14px;line-height:1.8;">
            <li>Browse 100+ available diagnostic tests</li>
            <li>Compare prices across multiple labs</li>
            <li>Book a test and get results at home</li>
          </ul>
        </div>
        <p style="color:#888;font-size:14px;line-height:1.6;margin:0;">Need help? Just reply to this email — our support team is always ready.</p>
      </div>
      <div style="background:#f9f9f9;border-top:1px solid #eaeaea;padding:20px 32px;text-align:center;">
        <p style="color:#555;margin:0 0 4px;font-size:14px;">Stay Healthy,</p>
        <p style="color:#333;font-weight:700;margin:0 0 16px;font-size:14px;">The ChooseMyLab Team</p>
        <p style="color:#bbb;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} ChooseMyLab. All rights reserved.</p>
      </div>
    </div>`;
}

function otpHtml(otpCode) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:10px;text-align:center;">
      <h2 style="color:#333;">ChooseMyLab Verification</h2>
      <p style="color:#555;font-size:16px;">Your One-Time Password (OTP) for login/signup is:</p>
      <div style="background:#f4f4f4;padding:15px;border-radius:5px;font-size:32px;font-weight:bold;letter-spacing:8px;margin:20px 0;color:#84cc16;">
        ${otpCode}
      </div>
      <p style="color:#777;font-size:13px;">This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
      <p style="color:#bbb;font-size:12px;">ChooseMyLab &mdash; Affordable &amp; Reliable Health Diagnostics</p>
    </div>`;
}

// ─── SEND VIA RESEND (production / Render) ────────────────────────────────────
async function sendViaResend(to, subject, html) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from   = process.env.EMAIL_FROM || 'ChooseMyLab <onboarding@resend.dev>';

  const { data, error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    console.error('❌ [EMAIL] Resend error:', error.message);
    return false;
  }

  console.log(`\n✅ [EMAIL] Email sent to ${to} via Resend (id: ${data.id})\n`);
  return true;
}

// ─── SEND VIA NODEMAILER (local dev) ─────────────────────────────────────────
async function sendViaNodemailer(to, subject, html) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('⚠️  [EMAIL] Missing EMAIL_USER or EMAIL_PASS.');
    return false;
  }

  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  const info = await transporter.sendMail({ from: `"ChooseMyLab" <${user}>`, to, subject, html });

  console.log(`\n✅ [EMAIL] Email sent to ${to} via Nodemailer (id: ${info.messageId})\n`);
  return true;
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────
async function sendWelcomeEmail(userEmail, userName) {
  try {
    const subject = 'Welcome to ChooseMyLab! 🎉';
    const html    = welcomeHtml(userName);
    if (useResend()) return await sendViaResend(userEmail, subject, html);
    return await sendViaNodemailer(userEmail, subject, html);
  } catch (error) {
    console.error('❌ [EMAIL] sendWelcomeEmail error:', error.message);
    return false;
  }
}

async function sendOtpEmail(userEmail, otpCode) {
  try {
    const subject = 'Your ChooseMyLab Login Code';
    const html    = otpHtml(otpCode);
    if (useResend()) return await sendViaResend(userEmail, subject, html);
    return await sendViaNodemailer(userEmail, subject, html);
  } catch (error) {
    console.error('❌ [EMAIL] sendOtpEmail error:', error.message);
    return false;
  }
}

module.exports = { sendWelcomeEmail, sendOtpEmail };
