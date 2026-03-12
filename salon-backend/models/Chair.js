const mongoose = require('mongoose');

const ChairSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  chairNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Busy', 'Finishing Soon', 'Maintenance'],
    default: 'Available',
  },
  currentStylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stylist',
  },
  currentCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  currentAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  estimatedFreeTime: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('Chair', ChairSchema);
