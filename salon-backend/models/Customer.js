const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Kids'],
  },
  email: {
    type: String,
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  lastVisit: {
    type: Date,
  },
  totalSpent: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
