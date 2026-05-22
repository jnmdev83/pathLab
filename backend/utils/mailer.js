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

// ─── BREVO (SENDINBLUE) HTTP EMAIL API ───────────────────────────────────────
// Sends emails over HTTPS (port 443) — works on ALL hosting platforms.
// Free tier: 300 emails/day, no domain verification required.
// No SMTP ports needed — completely bypasses Render's port blocking.
async function sendEmailViaBrevo(to, toName, subject, htmlContent) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ [EMAIL SYSTEM] Missing BREVO_API_KEY in environment.");
    addEmailLog('system', to, 'warning', 'Missing BREVO_API_KEY configuration.');
    return false;
  }

  const senderEmail = process.env.EMAIL_USER || 'noreply@choosemylab.com';
  
  const body = JSON.stringify({
    sender: { name: 'ChooseMyLab', email: senderEmail },
    to: [{ email: to, name: toName || 'User' }],
    subject: subject,
    htmlContent: htmlContent,
  });

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Brevo API returned ${response.status}`);
  }

  return data;
}

// ─── WELCOME EMAIL ───────────────────────────────────────────────────────────
async function sendWelcomeEmail(userEmail, userName) {
  try {
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

    const result = await sendEmailViaBrevo(userEmail, userName, 'Welcome to ChooseMyLab! 🎉', htmlContent);
    console.log(`\n✅ [EMAIL SYSTEM] Welcome email delivered to ${userEmail} (ID: ${result.messageId})\n`);
    addEmailLog('welcome', userEmail, 'success', `Delivered via Brevo. ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ [EMAIL SYSTEM] Error sending welcome email:", error);
    addEmailLog('welcome', userEmail, 'error', `Brevo Error: ${error.message}`);
    return false;
  }
}

// ─── OTP EMAIL ───────────────────────────────────────────────────────────────
async function sendOtpEmail(userEmail, otpCode) {
  try {
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

    const result = await sendEmailViaBrevo(userEmail, 'User', 'Your ChooseMyLab Login Code', htmlContent);
    console.log(`\n✅ [EMAIL SYSTEM] OTP email delivered to ${userEmail} (ID: ${result.messageId})\n`);
    addEmailLog('otp', userEmail, 'success', `Delivered via Brevo. ID: ${result.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ [EMAIL SYSTEM] Error sending OTP email:", error);
    addEmailLog('otp', userEmail, 'error', `Brevo Error: ${error.message}`);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail,
  getEmailLogs
};
