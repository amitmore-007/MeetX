const express = require('express');
const {
  bookActivity,
  getMyBookings,
  cancelBooking,
  bookGroupActivity
} = require('../controllers/bookingController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', auth, bookActivity);
router.post('/group', auth, bookGroupActivity); // ✅ New route
router.get('/', auth, getMyBookings);
router.delete('/:id', auth, cancelBooking);

module.exports = router;
