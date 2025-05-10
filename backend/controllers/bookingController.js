const Booking = require('../models/bookingModel');
const Activity = require('../models/activityModel');
const User = require('../models/userModel');


const bookActivity = async (req, res) => {
  const booking = await Booking.create({
    user: req.user.id,
    activity: req.body.activityId
  });
  res.status(201).json(booking);
};

const bookGroupActivity = async (req, res) => {
  try {
    const { activityId, userIds, groupName } = req.body;

    // Validate activity
    const activity = await Activity.findById(activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    // Validate user IDs
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) return res.status(400).json({ message: 'One or more users not found' });

    // Prevent duplicate bookings
    const existingBooking = await Booking.findOne({ activity: activityId, users: { $in: userIds } });
    if (existingBooking) return res.status(400).json({ message: 'Some users already booked this activity' });

    const booking = new Booking({
      users: userIds,
      activity: activityId,
      groupName: groupName || null
    });

    await booking.save();

    res.status(201).json({ message: 'Group booking successful', booking });

  } catch (error) {
    console.error('Group Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
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
    cancelBooking,
    bookGroupActivity
  };