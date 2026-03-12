const express = require('express');
const router = express.Router();
const Stylist = require('../models/Stylist');

// Get all stylists
router.get('/', async (req, res) => {
  try {
    const { branchId } = req.query;
    let query = { isAvailable: true };
    if (branchId) query.branch = branchId;

    const stylists = await Stylist.find(query).populate('branch', 'name');
    res.json({ success: true, count: stylists.length, data: stylists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Add new stylist
router.post('/', async (req, res) => {
  try {
    const stylist = new Stylist(req.body);
    await stylist.save();
    res.status(201).json({ success: true, data: stylist });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get stylist availability for a specific date
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ success: false, message: 'Stylist not found' });

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 (Sun) - 6 (Sat)
    
    // Find schedule for this day
    const daySchedule = stylist.schedule.find(s => s.dayOfWeek === dayOfWeek);

    if (!daySchedule || !daySchedule.isWorking) {
      return res.json({ success: true, available: false, message: 'Stylist not working on this day', slots: [] });
    }

    // Mock implementation for time slots - in practice we'd check Appointments table
    // to remove booked slots.
    const slots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    res.json({ 
      success: true, 
      available: true,
      data: {
        stylist: { id: stylist._id, name: stylist.name },
        workingHours: { start: daySchedule.startTime, end: daySchedule.endTime },
        availableSlots: slots
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
