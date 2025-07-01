const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  row: String,
  number: Number,
  type: {
    type: String,
    enum: ['regular', 'premium', 'vip'],
    default: 'regular'
  },
  price: Number,
  isBooked: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }
});

const venueSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  capacity: Number,
  layout: {
    rows: Number,
    seatsPerRow: Number,
    seats: [seatSchema]
  }
});

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['movie', 'sports', 'concert', 'travel', 'workshop', 'theater', 'comedy', 'dance'],
    required: true
  },
  subcategory: String, // e.g., 'cricket', 'bollywood', 'bus', etc.
  images: [String],
  venue: venueSchema,
  schedule: [{
    date: Date,
    time: String,
    duration: String,
    price: {
      regular: Number,
      premium: Number,
      vip: Number
    }
  }],
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  tags: [String],
  ageRestriction: String,
  language: String,
  cast: [String], // for movies
  director: String, // for movies
  genre: [String],
  rating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  bookingPolicy: {
    cancellationAllowed: { type: Boolean, default: true },
    refundPolicy: String,
    maxTicketsPerUser: { type: Number, default: 10 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
