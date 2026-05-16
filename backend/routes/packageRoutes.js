const express = require('express');
const router = express.Router();
const controller = require('../controllers/packageController');

router.get('/packages', controller.get_api_packages);
router.get('/packages/:id/comparison', controller.get_api_package_comparison);
router.get('/packages/:id/tests', controller.get_api_package_tests);

// Admin Routes
router.get('/admin/packages', controller.get_api_admin_packages);
router.post('/admin/packages', controller.post_api_admin_packages);
router.put('/admin/packages/:id', controller.put_api_admin_packages_id);
router.delete('/admin/packages/:id', controller.delete_api_admin_packages_id);

router.get('/admin/package-mappings', controller.get_api_admin_package_mappings);
router.post('/admin/package-mappings', controller.post_api_admin_package_mappings);

module.exports = router;
