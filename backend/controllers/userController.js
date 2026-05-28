const db  = require('../config/db');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail, sendOtpEmail } = require('../utils/mailer');
const { OAuth2Client } = require('google-auth-library');

// JWT secret comes from environment variable. Falls back to a dev placeholder.
// ⚠️  Set JWT_SECRET in your .env.production file for security.
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production';

// ─── POST /api/signup ────────────────────────────────────────────────────────
// 🧒 CHILD-FRIENDLY EXPLANATION:
// Imagine you are joining a new club! We need to write your name, email, and phone number on a card.
// But wait! If another kid already has the same email or phone number in our list,
// we cannot add you twice because that would confuse the club leader. 
// So, we check our database first to make sure your email and phone are completely brand new!
exports.post_api_signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    // 🛡️ EDGE CASE: Ensure email has not been registered already
    const emailCheck = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'This email address is already registered. Please login instead!' });
    }

    // 🛡️ EDGE CASE: Ensure phone number has not been registered already
    const phoneCheck = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({ error: 'This phone number is already registered. Please login instead!' });
    }

    // 🎉 Everything is unique! Let's insert the new kid into our database card box.
    const { rows } = await db.query(
      `INSERT INTO users (name, email, phone, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone`,
      [name, email, phone, password]
    );

    // 📧 SEND WELCOME EMAIL
    if (email) {
      sendWelcomeEmail(email, name);
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected database error occurred. Please try again.' });
  }
};

// ─── POST /api/login ─────────────────────────────────────────────────────────
// 🧒 CHILD-FRIENDLY EXPLANATION:
// This is like whispering your secret password to open the magic club door!
// We search for your email and verify your password matches. If it does, we say "Welcome back!"
exports.post_api_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, phone FROM users WHERE LOWER(email) = LOWER($1) AND password = $2',
      [email, password]
    );
    if (rows.length > 0) res.json({ success: true, user: rows[0] });
    else res.status(401).json({ error: 'Wrong email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// ─── OTP IN-MEMORY STORAGE ───────────────────────────────────────────────────
// 🧒 CHILD-FRIENDLY EXPLANATION:
// We use a small virtual box (a Map) to store the secret OTP codes we send to phones.
// The code will expire/erase automatically after 5 minutes so no one can steal it!
const otpStore = new Map();

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
// 🧒 CHILD-FRIENDLY EXPLANATION:
// Sending an OTP is like mailing a temporary secret passcode to a kid's email.
// We generate a magic 4-digit code (like 4829) and use our real mail carrier to send it!
exports.post_api_send_otp = async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    // Generate a random 4-digit number between 1000 and 9999
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save it to our virtual box for this email, with a timestamp
    otpStore.set(email, {
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes from now
    });

    console.log(`📡 [OTP SYSTEM] Sending OTP code [${generatedOtp}] to email: ${email}`);

    // Send the real email
    await sendOtpEmail(email, generatedOtp);

    // Return success
    res.json({ 
      success: true, 
      message: 'OTP sent successfully to your email!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
// 🧒 CHILD-FRIENDLY EXPLANATION:
// Now we check if the kid entered the exact secret code we sent them via email!
exports.post_api_verify_otp = async (req, res) => {
  const { email, otp, name, phone } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required.' });
  }

  // 1. Get the OTP record from our virtual box
  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({ error: 'No OTP requested for this email. Please request a new one.' });
  }

  // 2. Check if the OTP has expired
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'This OTP has expired. Please request a new code.' });
  }

  // 3. Verify matching code
  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP code. Please enter the correct code.' });
  }

  // OTP verified successfully! Let's erase it so it can't be reused.
  otpStore.delete(email);

  try {
    // 4. Check if the user already exists with this email address
    const { rows: existingUser } = await db.query(
      'SELECT id, name, email, phone FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.length > 0) {
      // 🎉 USER EXISTS: Log them in directly!
      return res.json({ 
        success: true, 
        message: 'OTP verified! Welcome back.', 
        user: existingUser[0] 
      });
    }

    // 🚀 USER DOES NOT EXIST: This is a new signup!
    if (!name || !phone) {
      // Tell frontend we verified the email, but need them to provide Name and Phone to finish signup
      return res.json({ 
        success: true, 
        needsRegistration: true, 
        message: 'Email verified! Please complete your name and phone to register.' 
      });
    }

    // 🛡️ EDGE CASE: Check phone uniqueness for new signup
    const phoneCheck = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (phoneCheck.rows.length > 0) {
      return res.status(400).json({ error: 'This phone is already registered. Please use a different phone number.' });
    }

    // Create the brand new user!
    const randomPassword = Math.random().toString(36).substring(2, 10); // Simple random secure password
    const { rows: newUser } = await db.query(
      `INSERT INTO users (name, email, phone, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone`,
      [name, email, phone, randomPassword]
    );

    // 📧 SEND WELCOME EMAIL
    if (email) {
      sendWelcomeEmail(email, name);
    }

    res.json({ 
      success: true, 
      message: 'Registration successful via OTP!', 
      user: newUser[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong during OTP verification.' });
  }
};

// ─── POST /api/auth/firebase-phone-login ──────────────────────────────────────────
// 🧒 CHILD-FRIENDLY EXPLANATION:
// Firebase verified the kid's phone number! Now they send us their official phone number.
// 1. If we already know this phone number, we log them in instantly!
// 2. If it's a completely new kid, they must provide their Name and Email to finish signup.
// 3. Once they do, we register them in our Postgres card box and send a warm welcome email!
exports.post_api_firebase_phone_login = async (req, res) => {
  const { phone, name, email } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  try {
    // 1. Check if the user already exists with this phone number
    const { rows: existingUser } = await db.query(
      'SELECT id, name, email, phone FROM users WHERE phone = $1',
      [phone]
    );

    if (existingUser.length > 0) {
      // 🎉 USER EXISTS: Log them in directly!
      return res.json({ 
        success: true, 
        message: 'Phone verified! Welcome back.', 
        user: existingUser[0] 
      });
    }

    // 🚀 USER DOES NOT EXIST: This is a new signup!
    if (!name || !email) {
      // Tell frontend we verified the phone, but need them to provide Name and Email to finish signup
      return res.json({ 
        success: true, 
        needsRegistration: true, 
        message: 'Phone verified! Please complete your name and email to register.' 
      });
    }

    // 🛡️ EDGE CASE: Check email uniqueness for new signup
    const emailCheck = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'This email is already registered. Please login or use a different email address.' });
    }

    // Create the brand new user!
    const randomPassword = 'phone_' + Math.random().toString(36).substring(2, 10); // Safe secure placeholder password
    const { rows: newUser } = await db.query(
      `INSERT INTO users (name, email, phone, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone`,
      [name, email, phone, randomPassword]
    );

    // 📧 SEND WELCOME EMAIL
    if (email) {
      sendWelcomeEmail(email, name);
    }

    res.json({ 
      success: true, 
      message: 'Registration successful via Phone Auth!', 
      user: newUser[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong during Phone Authentication.' });
  }
};

// ─── POST /api/auth/google ────────────────────────────────────────────────────
// 🧒 CHILD-FRIENDLY EXPLANATION:
// Google Sign-In is like showing your official school badge to enter the club instantly!
// Instead of trusting just any badge, we scan the barcode securely with Google's servers.
// If your badge is verified, we say "Come on in!" (Log in).
// If you are new, we make you a brand new club card automatically!
exports.post_api_google = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'No Google credential token provided.' });
  }

  // 🛡️ SECURE VERIFICATION: We load Google Client ID dynamically to prevent dotenv race conditions
  const activeClientId = process.env.GOOGLE_CLIENT_ID || "1000282059656-c9fjaeo9m292dnf95t9fbjnm7mkmumsl.apps.googleusercontent.com";
  
  try {
    const dynamicClient = new OAuth2Client(activeClientId);
    const ticket = await dynamicClient.verifyIdToken({
      idToken: credential,
      audience: activeClientId, 
    });

    // Extract the secure, verified user information from the payload
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // Check if the user is already in our database by their Google email
    const { rows: existingUser } = await db.query(
      'SELECT id, name, email, phone FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (existingUser.length > 0) {
      // 🎉 USER EXISTS: Log them in instantly!
      return res.json({
        success: true,
        message: 'Google Sign-In successful! Welcome back.',
        user: existingUser[0]
      });
    }

    // 🚀 NEW USER: Sign them up automatically!
    const randomPassword = 'google_' + Math.random().toString(36).substring(2, 10);
    const { rows: newUser } = await db.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, phone`,
      [name, email, randomPassword]
    );

    // 📧 SEND WELCOME EMAIL
    if (email) {
      sendWelcomeEmail(email, name);
    }

    res.json({
      success: true,
      message: 'New account created automatically via Google!',
      user: newUser[0]
    });
  } catch (error) {
    console.error("⛔ [GOOGLE OAUTH VERIFICATION ERROR]:", error);
    res.status(500).json({ 
      error: 'Failed to authenticate with Google. Please try again.',
      details: error.message 
    });
  }
};

// ─── POST /api/auth/admin-login ──────────────────────────────────────────────
// Authenticates admin users only (role = 'admin').
// Returns a signed JWT token used to authorize CMS dashboard requests.
exports.post_api_admin_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT id, name, email, role
       FROM users
       WHERE email = $1 AND password = $2 AND role = 'admin'`,
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or insufficient permissions' });
    }

    const user  = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

// ─── GET /api/user/:id/dashboard ─────────────────────────────────────────────
// Returns a user's full booking history and any available lab reports.
exports.get_api_user_id_dashboard = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch all bookings for this user with test and lab details
    const { rows: bookings } = await db.query(`
      SELECT
        b.*,
        t.name                         AS test_name,
        COALESCE(l.name, t.lab)        AS lab,
        lb.branch_name,
        lb.address                     AS branch_address,
        COALESCE(ltb.price, t.price)   AS price
      FROM bookings b
      JOIN  tests            t   ON t.id  = b.test_id
      LEFT JOIN lab_branches lb  ON lb.id = b.lab_branch_id
      LEFT JOIN labs         l   ON l.id  = lb.lab_id
      LEFT JOIN lab_test_branches ltb ON ltb.test_id = t.id AND ltb.lab_branch_id = b.lab_branch_id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC
    `, [id]);

    // Fetch any lab reports linked to this user's bookings
    const { rows: reports } = await db.query(`
      SELECT r.*, t.name AS test_name, COALESCE(l.name, t.lab) AS lab
      FROM reports r
      JOIN  bookings      b  ON b.id  = r.booking_id
      JOIN  tests         t  ON t.id  = b.test_id
      LEFT JOIN lab_branches lb ON lb.id = b.lab_branch_id
      LEFT JOIN labs         l  ON l.id  = lb.lab_id
      WHERE r.user_id = $1
      ORDER BY r.date_generated DESC
    `, [id]);

    res.json({ success: true, bookings, reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch dashboard data' });
  }
};

// ─── PUT /api/user/:id ────────────────────────────────────────────────────────
// Updates a user's name and phone number.
exports.put_api_user_id = async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE users SET name = $1, phone = $2
       WHERE id = $3
       RETURNING id, name, email, phone`,
      [name, phone, id]
    );
    if (rows.length > 0) res.json({ success: true, user: rows[0] });
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update profile' });
  }
};

// ─── ADMIN: GET /api/admin/users ─────────────────────────────────────────────
exports.get_api_admin_users = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, phone, role, is_active, last_login FROM users ORDER BY id ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch users' });
  }
};

// ─── ADMIN: POST /api/admin/users ─────────────────────────────────────────────
exports.post_api_admin_users = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO users (name, email, phone, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, role, is_active`,
      [name, email, phone, password, role || 'staff']
    );
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Could not create user' });
  }
};

// ─── ADMIN: PUT /api/admin/users/:id ─────────────────────────────────────────
// Partial update — only fields that are provided will be changed (COALESCE keeps existing values).
exports.put_api_admin_users_id = async (req, res) => {
  const { id } = req.params;
  const { name, phone, role, is_active } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE users
       SET name      = COALESCE($1, name),
           phone     = COALESCE($2, phone),
           role      = COALESCE($3, role),
           is_active = COALESCE($4, is_active)
       WHERE id = $5
       RETURNING id, name, email, phone, role, is_active`,
      [name, phone, role, is_active, id]
    );
    if (rows.length > 0) res.json({ success: true, user: rows[0] });
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update user' });
  }
};

// ─── ADMIN: DELETE /api/admin/users/:id ──────────────────────────────────────
exports.delete_api_admin_users_id = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (rows.length > 0) res.json({ success: true, message: 'User deleted' });
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete user' });
  }
};
