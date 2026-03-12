const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  stylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stylist',
    required: true,
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  }],
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // '14:30'
    required: true,
  },
  endTime: {
    type: String, // '15:30'
    required: true,
  },
  totalDurationMinutes: {
    type: Number,
    required: true,
  },
  totalPriceMin: {
    type: Number,
  },
  totalPriceMax: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show', 'In Progress'],
    default: 'Confirmed', // Or Pending if payment is required first
  },
  isWalkIn: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
