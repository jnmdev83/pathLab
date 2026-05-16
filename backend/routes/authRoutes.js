const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/admin-login', userController.post_api_admin_login);

module.exports = router;
