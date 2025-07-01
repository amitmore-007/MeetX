const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  row: String,
  seatNumber: Number,
  seatType: String,
  price: Number
});

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  schedule: {
    date: Date,
    time: String
  },
  tickets: [ticketSchema],
  totalAmount: Number,
  bookingId: {
    type: String,
    unique: true,
    default: function() {
      return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    method: String,
    transactionId: String,
    paidAt: Date
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  bookingDate: { type: Date, default: Date.now },
  qrCode: String
});

module.exports = mongoose.model('Booking', bookingSchema);
