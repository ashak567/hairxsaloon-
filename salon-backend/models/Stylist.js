const mongoose = require('mongoose');

const StylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  specializations: [{
    type: String, // e.g., 'Haircut', 'Coloring', 'Bridal Makeup'
  }],
  experienceYears: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  schedule: [{
    dayOfWeek: { type: Number }, // 0-6 (Sunday-Saturday)
    startTime: { type: String }, // '09:00'
    endTime: { type: String }, // '20:00'
    isWorking: { type: Boolean, default: true }
  }],
  currentStatus: {
    type: String,
    enum: ['Available', 'Busy', 'On Leave'],
    default: 'Available',
  }
}, { timestamps: true });

module.exports = mongoose.model('Stylist', StylistSchema);
