const Booking = require('../models/bookingModel');
const Activity = require('../models/activityModel');

const bookActivity = async (req, res) => {
  const booking = await Booking.create({
    user: req.user.id,
    activity: req.body.activityId
  });
  res.status(201).json(booking);
};


const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('activity');
  res.json(bookings);
};

const cancelBooking = async (req, res) => {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user.id
      });
  
      if (!booking) {
        return res.status(404).json({ 
          success: false, 
          message: 'Booking not found or you are not authorized to cancel this booking' 
        });
      }
  
      // Check if the activity has already occurred
      const activity = await Activity.findById(booking.activity);
      if (new Date(activity.date) < new Date()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot cancel booking for past activities' 
        });
      }
  
      await Booking.deleteOne({ _id: req.params.id });
      
      res.json({ 
        success: true, 
        message: 'Booking cancelled successfully' 
      });
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to cancel booking', 
        error: err.message 
      });
    }
  };
  
  module.exports = {
    bookActivity,
    getMyBookings,
    cancelBooking
  };