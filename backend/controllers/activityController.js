const Activity = require('../models/activityModel');

const listActivities = async (req, res) => {
  try {
    const { category, city, date, search, page = 1, limit = 12 } = req.query;
    
    let filter = { status: 'published' };
    
    if (category) filter.category = category;
    if (city) filter['venue.city'] = new RegExp(city, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }
    
    const activities = await Activity.find(filter)
      .populate('publisher', 'name publisherInfo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Activity.countDocuments(filter);
    
    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activities', error: error.message });
  }
};

const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('publisher', 'name publisherInfo')
      .populate('reviews.user', 'name');
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activity', error: error.message });
  }
};

const createActivity = async (req, res) => {
  try {
    const activityData = {
      ...req.body,
      publisher: req.user.id
    };
    
    // Generate initial seat layout if venue capacity is provided
    if (activityData.venue && activityData.venue.capacity) {
      const rows = activityData.venue.layout?.rows || 10;
      const seatsPerRow = activityData.venue.layout?.seatsPerRow || Math.ceil(activityData.venue.capacity / rows);
      
      const seats = [];
      for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= seatsPerRow; j++) {
          seats.push({
            row: String.fromCharCode(64 + i), // A, B, C...
            number: j,
            type: i <= 3 ? 'premium' : i <= 7 ? 'regular' : 'vip',
            price: activityData.schedule[0]?.price?.regular || 0
          });
        }
      }
      
      activityData.venue.layout = {
        rows,
        seatsPerRow,
        seats
      };
    }
    
    const activity = new Activity(activityData);
    await activity.save();
    
    res.status(201).json({ message: 'Activity created successfully', activity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create activity', error: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      publisher: req.user.id
    });
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found or unauthorized' });
    }
    
    Object.assign(activity, req.body);
    activity.updatedAt = new Date();
    await activity.save();
    
    res.json({ message: 'Activity updated successfully', activity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update activity', error: error.message });
  }
};

const getPublisherActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ publisher: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch publisher activities', error: error.message });
  }
};

const seedActivities = async (req, res) => {
  const sampleActivities = [
    {
      title: "Avengers: Endgame",
      description: "The epic conclusion to the Infinity Saga.",
      category: "movie",
      subcategory: "action",
      images: ["https://via.placeholder.com/400x600"],
      venue: {
        name: "PVR Cinema Mall",
        address: "Mall Road",
        city: "Mumbai",
        state: "Maharashtra",
        capacity: 200
      },
      schedule: [{
        date: new Date("2025-06-15T18:30:00"),
        time: "6:30 PM",
        duration: "3h 1m",
        price: { regular: 250, premium: 350, vip: 500 }
      }],
      publisher: "6756a123456789012345678a",
      status: "published",
      language: "English",
      genre: ["Action", "Adventure", "Drama"],
      ageRestriction: "13+",
      director: "Anthony Russo, Joe Russo"
    },
    {
      title: "IPL 2025: Mumbai vs Chennai",
      description: "Thrilling cricket match between MI and CSK",
      category: "sports",
      subcategory: "cricket",
      images: ["https://via.placeholder.com/400x300"],
      venue: {
        name: "Wankhede Stadium",
        address: "Churchgate",
        city: "Mumbai",
        state: "Maharashtra",
        capacity: 33000
      },
      schedule: [{
        date: new Date("2025-07-20T19:30:00"),
        time: "7:30 PM",
        duration: "4 hours",
        price: { regular: 800, premium: 1500, vip: 3000 }
      }],
      publisher: "6756a123456789012345678a",
      status: "published",
      tags: ["cricket", "ipl", "mumbai", "chennai"]
    },
    {
      title: "Mumbai to Delhi Express",
      description: "Comfortable AC bus journey",
      category: "travel",
      subcategory: "bus",
      images: ["https://via.placeholder.com/400x250"],
      venue: {
        name: "Mumbai Central Bus Terminal",
        address: "Central Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        capacity: 45
      },
      schedule: [{
        date: new Date("2025-06-10T22:00:00"),
        time: "10:00 PM",
        duration: "12 hours",
        price: { regular: 1200, premium: 1800, vip: 2500 }
      }],
      publisher: "6756a123456789012345678a",
      status: "published",
      tags: ["travel", "bus", "mumbai", "delhi"]
    }
  ];

  try {
    await Activity.insertMany(sampleActivities);
    res.status(201).json({ success: true, message: 'Sample activities seeded.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to seed activities.', error: err.message });
  }
};

module.exports = {
  listActivities,
  getActivityById,
  createActivity,
  updateActivity,
  getPublisherActivities,
  seedActivities
};
