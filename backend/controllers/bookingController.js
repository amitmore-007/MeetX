const Booking = require('../models/bookingModel');
const Activity = require('../models/activityModel');
const User = require('../models/userModel');


const bookActivity = async (req, res) => {
  try {
    const { activityId, scheduleIndex, selectedSeats, contactInfo } = req.body;
    
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    const schedule = activity.schedule[scheduleIndex];
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    // Check seat availability
    const unavailableSeats = [];
    selectedSeats.forEach(seat => {
      const venueSeats = activity.venue.layout.seats;
      const seatIndex = venueSeats.findIndex(s => s.row === seat.row && s.number === seat.number);
      if (seatIndex !== -1 && venueSeats[seatIndex].isBooked) {
        unavailableSeats.push(seat);
      }
    });
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked', 
        unavailableSeats 
      });
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const tickets = selectedSeats.map(seat => {
      const price = schedule.price[seat.type] || schedule.price.regular;
      totalAmount += price;
      return {
        row: seat.row,
        seatNumber: seat.number,
        seatType: seat.type,
        price
      };
    });
    
    // Create booking
    const booking = new Booking({
      user: req.user.id,
      activity: activityId,
      schedule: {
        date: schedule.date,
        time: schedule.time
      },
      tickets,
      totalAmount,
      contactInfo,
      status: 'confirmed' // In real app, this would be 'pending' until payment
    });
    
    await booking.save();
    
    // Mark seats as booked
    selectedSeats.forEach(seat => {
      const seatIndex = activity.venue.layout.seats.findIndex(s => s.row === seat.row && s.number === seat.number);
      if (seatIndex !== -1) {
        activity.venue.layout.seats[seatIndex].isBooked = true;
      }
    });
    await activity.save();
    
    await booking.populate('activity');
    
    res.status(201).json({ 
      message: 'Booking successful', 
      booking 
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
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
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('activity')
      .sort({ bookingDate: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('activity');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check cancellation policy
    const activityDate = new Date(booking.schedule.date);
    const now = new Date();
    const timeDiff = activityDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 24) {
      return res.status(400).json({ 
        message: 'Cannot cancel booking less than 24 hours before the event' 
      });
    }

    // Free up the seats
    const activity = await Activity.findById(booking.activity._id);
    booking.tickets.forEach(ticket => {
      const seatIndex = activity.venue.layout.seats.findIndex(
        s => s.row === ticket.row && s.number === ticket.seatNumber
      );
      if (seatIndex !== -1) {
        activity.venue.layout.seats[seatIndex].isBooked = false;
      }
    });
    await activity.save();

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('activity');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
};

module.exports = {
  bookActivity,
  getMyBookings,
  cancelBooking,
  getBookingById,
  bookGroupActivity
};