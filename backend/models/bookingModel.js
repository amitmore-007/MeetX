const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  },
  groupName: {
    type: String
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
