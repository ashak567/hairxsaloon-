const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Queue = require('../models/Queue');

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const { customerId, branchId, stylistId, services, date, startTime, totalDurationMinutes, totalPriceMin, isWalkIn, name, phone, gender } = req.body;

    let custId = customerId;

    // Handle walk-in creation where user might not be in DB yet
    if (isWalkIn && !custId) {
      let customer = await Customer.findOne({ phone });
      if (!customer) {
        customer = new Customer({ name, phone, gender });
        await customer.save();
      }
      custId = customer._id;
    }

    const appointmentDate = new Date(date);
    
    // Calculate approximate end time
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTotalMins = hours * 60 + minutes + totalDurationMinutes;
    const endHours = String(Math.floor(endTotalMins / 60)).padStart(2, '0');
    const endMins = String(endTotalMins % 60).padStart(2, '0');
    const endTime = `${endHours}:${endMins}`;

    const appointment = new Appointment({
      customer: custId,
      branch: branchId,
      stylist: stylistId,
      services,
      date: appointmentDate,
      startTime,
      endTime,
      totalDurationMinutes,
      totalPriceMin,
      isWalkIn
    });

    await appointment.save();

    // Notify via Socket.io
    if (req.io) {
      req.io.emit('booking:new', { appointmentId: appointment._id, branchId });
    }

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin: Get all appointments
router.get('/', async (req, res) => {
  try {
    const { branchId, date } = req.query;
    let query = {};
    if (branchId) query.branch = branchId;
    if (date) {
      const d = new Date(date);
      query.date = { 
        $gte: new Date(d.setHours(0,0,0)), 
        $lt: new Date(d.setHours(23,59,59)) 
      };
    }

    const appointments = await Appointment.find(query)
      .populate('customer', 'name phone')
      .populate('stylist', 'name')
      .populate('services', 'name')
      .sort({ date: 1, startTime: 1 });
      
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
