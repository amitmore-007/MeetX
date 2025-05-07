const express = require('express');
const { listActivities, seedActivities } = require('../controllers/activityController');

const router = express.Router();

router.get('/', listActivities);
router.post('/seed', seedActivities); // 👈 temp route to add dummy data

module.exports = router;
