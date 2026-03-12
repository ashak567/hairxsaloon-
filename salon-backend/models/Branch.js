const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: 'Ballari',
  },
  state: {
    type: String,
    default: 'Karnataka',
  },
  pinCode: {
    type: String,
    default: '583103',
  },
  phone: {
    type: String,
    required: true,
  },
  operatingHours: {
    openTime: { type: String, default: '09:00' },
    closeTime: { type: String, default: '21:00' }
  },
  totalChairs: {
    type: Number,
    required: true,
    default: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);
