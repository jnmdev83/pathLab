const nodemailer = require('nodemailer');

// 🧒 CHILD-FRIENDLY EXPLANATION:
// This is our magic mail carrier! 
// When a new kid joins the club (signs up), we use this mail carrier to send them a beautiful Welcome Email.
// Because we are running locally and don't want to spam real inboxes by accident,
// we use "Ethereal Email" which creates a fake inbox just for testing!
// It gives us a magic URL where we can see the exact email that was sent.

async function sendWelcomeEmail(userEmail, userName) {
  try {
    // 1. Create a test account on Ethereal (fake SMTP for testing)
    const testAccount = await nodemailer.createTestAccount();

    // 2. Create the transporter using the test account
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 3. Write our beautiful industry-standard welcome email
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
            <a href="http://localhost:5173" style="background-color: #84cc16; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
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

    // 4. Send the email
    const info = await transporter.sendMail({
      from: '"ChooseMyLab Support" <welcome@choosemylab.com>',
      to: userEmail,
      subject: "Welcome to ChooseMyLab! 🎉",
      html: htmlContent,
    });

    // 5. Log the preview URL so the developer can see the email in their browser!
    console.log(`\n📧 [EMAIL SYSTEM] Welcome email sent to ${userEmail}`);
    console.log(`✨ Preview your email here: ${nodemailer.getTestMessageUrl(info)}\n`);
    
    return true;
  } catch (error) {
    console.error("❌ [EMAIL SYSTEM] Error sending welcome email:", error);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail
};
