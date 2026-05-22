const express = require('express');
const router  = express.Router();
const userController = require('../controllers/userController');

router.post('/admin-login',         userController.post_api_admin_login);
router.post('/send-otp',            userController.post_api_send_otp);
router.post('/verify-otp',          userController.post_api_verify_otp);
router.post('/google',              userController.post_api_google);
router.post('/firebase-phone-login',userController.post_api_firebase_phone_login);

module.exports = router;
