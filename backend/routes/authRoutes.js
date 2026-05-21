const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/admin-login', userController.post_api_admin_login);

// 🧒 CHILD-FRIENDLY EXPLANATION:
// These are our magic auth postbox routes!
// Whenever someone wants to send an OTP, check an OTP, or log in with Google,
// they drop their request letter in one of these postbox slots!
router.post('/send-otp', userController.post_api_send_otp);
router.post('/verify-otp', userController.post_api_verify_otp);
router.post('/google', userController.post_api_google);

module.exports = router;
