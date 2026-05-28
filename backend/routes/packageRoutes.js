const express = require('express');
const router = express.Router();
const controller = require('../controllers/packageController');

router.get('/packages', controller.get_api_packages);
router.get('/packages/:id/comparison', controller.get_api_package_comparison);
router.get('/packages/:id/tests', controller.get_api_package_tests);
router.get('/packages/:packageId/prices', controller.get_api_packages_packageId_prices);
router.get('/packages/:packageId', controller.get_api_package_by_id); // NEW
router.get('/packages-landing/data', controller.get_api_packages_landing_data); // NEW
router.get('/packages-listing/metadata', controller.get_api_packages_listing_metadata); // NEW
router.get('/packages-listing/offers', controller.get_api_packages_listing_offers); // NEW
router.get('/packages/:packageId/branches/:branchId', controller.get_api_package_branch_details); // NEW
router.get('/packages/:packageId/branches/:branchId/other-packages', controller.get_api_package_branch_other_packages); // NEW
router.get('/packages/:packageId/branches/:branchId/competitors', controller.get_api_package_branch_competitors); // NEW
router.get('/nav-menu', controller.get_api_nav_menu); // NEW


// Admin Routes
router.get('/admin/packages', controller.get_api_admin_packages);
router.post('/admin/packages', controller.post_api_admin_packages);
router.put('/admin/packages/:id', controller.put_api_admin_packages_id);
router.delete('/admin/packages/:id', controller.delete_api_admin_packages_id);

router.get('/admin/package-mappings', controller.get_api_admin_package_mappings);
router.post('/admin/package-mappings', controller.post_api_admin_package_mappings);
router.delete('/admin/package-mappings/:id', controller.delete_api_admin_package_mappings_id);

module.exports = router;
