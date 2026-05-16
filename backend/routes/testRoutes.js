const express = require('express');
const router = express.Router();
const controller = require('../controllers/testController');

router.get('/tests', controller.get_api_tests);
router.get('/tests/popular', controller.get_api_tests_popular);
router.get('/tests/:testId/prices', controller.get_api_tests_testId_prices);

// Admin Routes
router.get('/admin/tests', controller.get_api_admin_tests);
router.post('/admin/tests', controller.post_api_admin_tests);
router.put('/admin/tests/:id', controller.put_api_admin_tests_id);
router.delete('/admin/tests/:id', controller.delete_api_admin_tests_id);
router.get('/admin/tests/:id/branches', controller.get_api_admin_tests_id_branches);

module.exports = router;
