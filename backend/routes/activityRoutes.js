const express = require('express');
const { 
  listActivities, 
  getActivityById,
  createActivity,
  updateActivity,
  getPublisherActivities,
  seedActivities 
} = require('../controllers/activityController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', listActivities);
router.get('/:id', getActivityById);
router.post('/seed', seedActivities);

// Protected routes
router.post('/', auth, createActivity);
router.put('/:id', auth, updateActivity);
router.get('/publisher/my-activities', auth, getPublisherActivities);

module.exports = router;
