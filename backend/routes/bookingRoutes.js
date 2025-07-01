const express = require('express');
const {
  bookActivity,
  getMyBookings,
  cancelBooking,
  getBookingById
} = require('../controllers/bookingController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', auth, bookActivity);
router.get('/', auth, getMyBookings);
router.get('/:id', auth, getBookingById);
router.delete('/:id', auth, cancelBooking);

module.exports = router;
