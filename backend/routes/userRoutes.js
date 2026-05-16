const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/signup', controller.post_api_signup);
router.post('/login', controller.post_api_login);
router.get('/user/:id/dashboard', controller.get_api_user_id_dashboard);
router.put('/user/:id', controller.put_api_user_id);

// Admin Routes
router.get('/admin/users', controller.get_api_admin_users);
router.post('/admin/users', controller.post_api_admin_users);
router.put('/admin/users/:id', controller.put_api_admin_users_id);
router.delete('/admin/users/:id', controller.delete_api_admin_users_id);

module.exports = router;
