require('dotenv').config({ path: './.env.development' });
const { sendWelcomeEmail } = require('./utils/mailer');

async function test() {
  console.log("Sending test email to dgahlot39@gmail.com...");
  const success = await sendWelcomeEmail('dgahlot39@gmail.com', 'Divyansh');
  if (success) {
    console.log("✅ Test email sent successfully!");
  } else {
    console.log("❌ Test email failed.");
  }
}

test();
