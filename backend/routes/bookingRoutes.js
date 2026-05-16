const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');

router.post('/bookings', controller.post_api_bookings);
router.get('/bookings', controller.get_api_bookings);
router.put('/bookings/:id/reschedule', controller.put_api_bookings_id_reschedule);
router.put('/bookings/:id/status', controller.put_api_bookings_id_status);
router.put('/bookings/:id/notes', controller.put_api_bookings_id_notes);
router.get('/bookings/stats', controller.get_api_bookings_stats);
router.get('/bookings/daily', controller.get_api_bookings_daily);
router.get('/bookings/recent', controller.get_api_bookings_recent);

module.exports = router;
