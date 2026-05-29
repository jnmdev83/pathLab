const express = require('express');
const router = express.Router();
const controller = require('../controllers/testController');

router.get('/tests', controller.get_api_tests);
router.get('/tests/popular', controller.get_api_tests_popular);
router.get('/tests/search', controller.get_api_tests_search);           // NEW — must be before /:testId routes
router.get('/tests/:testId/prices', controller.get_api_tests_testId_prices);
router.get('/tests/:testId/top-picks', controller.get_api_tests_testId_top_picks); // NEW
router.get('/tests/:testId', controller.get_api_test_by_id); // NEW
router.get('/category-previews', controller.get_api_category_previews);
router.get('/categories/:categoryName/metadata', controller.get_api_category_metadata);
router.get('/scans-landing/data', controller.get_api_scans_landing_data);
router.get('/scans/listing', controller.get_api_scans_listing);
router.get('/labs/:labId/profile', controller.get_api_labs_labId_profile);


// Admin Routes
router.get('/admin/tests', controller.get_api_admin_tests);
router.post('/admin/tests', controller.post_api_admin_tests);
router.put('/admin/tests/:id', controller.put_api_admin_tests_id);
router.delete('/admin/tests/:id', controller.delete_api_admin_tests_id);
router.get('/admin/tests/:id/branches', controller.get_api_admin_tests_id_branches);

module.exports = router;
