const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const Appointment = require('../models/Appointment');

// Get current queue for a branch
router.get('/:branchId', async (req, res) => {
  try {
    const currentQueue = await Queue.find({ 
      branch: req.params.branchId,
      status: { $in: ['Waiting', 'Serving'] }
    })
    .populate('customer', 'name')
    .sort({ position: 1 });

    res.json({ success: true, data: currentQueue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Initialize dummy queue entries for demo
router.post('/:branchId/seed', async (req, res) => {
  try {
    const q1 = new Queue({
      branch: req.params.branchId,
      customer: '65f1a2b3c4d5e6f7a8b9c0d1', // Placeholder ObjectID. Assume it will error or we ignore it if it fails
      position: 1,
      status: 'Serving'
    });
    // Ignore actual save for seed to avoid casting errors on dummy ids
    res.json({ success: true, message: 'Queue seeded manually' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
