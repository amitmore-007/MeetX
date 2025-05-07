const express = require('express');
const { bookActivity, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', auth, bookActivity);
router.get('/', auth, getMyBookings);
router.delete('/:id', auth, cancelBooking); // Add this line

module.exports = router;