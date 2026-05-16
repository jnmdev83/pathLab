const express = require('express');
const router = express.Router();
const controller = require('../controllers/labController');

router.get('/labs', controller.get_api_labs);
router.post('/labs', controller.post_api_labs);
router.put('/labs/:id', controller.put_api_labs_id);
router.delete('/labs/:id', controller.delete_api_labs_id);
router.put('/labs/:id/toggle-verify', controller.put_api_labs_id_toggle_verify);
router.get('/labs/nearby', controller.get_api_labs_nearby);
router.post('/dev/seed-nearby-lab', controller.post_api_dev_seed_nearby_lab);
router.get('/labs/city', controller.get_api_labs_city);
router.get('/labs/:labId/branches', controller.get_api_labs_labId_branches);
router.get('/branches', controller.get_api_branches);
router.post('/branches', controller.post_api_branches);
router.put('/branches/:id', controller.put_api_branches_id);
router.put('/branches/:id/status', controller.put_api_branches_id_status);
router.delete('/branches/:id', controller.delete_api_branches_id);
router.get('/branches/popular', controller.get_api_branches_popular);
router.get('/branches/:branchId/tests', controller.get_api_branches_branchId_tests);

// Lab-Test Mappings (Pricing)
router.post('/lab-test-branches', controller.post_api_lab_test_branches);
router.put('/lab-test-branches/:id', controller.put_api_lab_test_branches_id);

module.exports = router;
