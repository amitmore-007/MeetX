const Activity = require('../models/activityModel');

const listActivities = async (req, res) => {
  const activities = await Activity.find();
  res.json(activities);
};

const seedActivities = async (req, res) => {
  const sampleActivities = [
    {
      title: "Yoga Class",
      description: "A relaxing yoga session.",
      location: "Community Center",
      date: new Date("2025-06-01T09:00:00")
    },
    {
        title: 'Cricket Match',
        description: 'Friendly cricket match at the local ground.',
        location: 'City Stadium',
        date: new Date('2025-05-15T10:00:00'),
      },
    {
        title: 'Movie Night',
        description: 'Watch the latest blockbuster.',
        location: 'PVR Cinema',
        date: new Date('2025-05-20T18:30:00'),
      },
    {
      title: "HIIT Workout",
      description: "High-Intensity Interval Training for 30 mins.",
      location: "Gym Hall 2",
      date: new Date("2025-06-03T18:00:00")
    },
    {
      title: "Zumba Dance",
      description: "Fun Zumba dance session to get your energy up.",
      location: "Room A1",
      date: new Date("2025-06-02T17:00:00")
    },
    {
      title: "Strength Training",
      description: "Weight training and muscle-building session.",
      location: "Fitness Center",
      date: new Date("2025-06-04T10:30:00")
    },
    {
      title: "Morning Jog",
      description: "Light group jogging in the park.",
      location: "City Park",
      date: new Date("2025-06-05T06:30:00")
    },
    {
      title: "Pilates",
      description: "Improve flexibility and core strength with Pilates.",
      location: "Studio 3",
      date: new Date("2025-06-06T08:00:00")
    },
    {
      title: "Boxing Basics",
      description: "Learn basic boxing techniques and get fit.",
      location: "Boxing Arena",
      date: new Date("2025-06-07T16:00:00")
    },
    {
      title: "CrossFit Challenge",
      description: "Intense full-body CrossFit workout session.",
      location: "CrossFit Zone",
      date: new Date("2025-06-08T19:00:00")
    }
  ];

  try {
    await Activity.insertMany(sampleActivities);
    res.status(201).json({ success: true, message: '8 Dummy activities seeded.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to seed activities.', error: err.message });
  }
};

module.exports = {
  listActivities,
  seedActivities,
};
