const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  // Gender category: Male / Female / Kids / Bridal
  genderCategory: {
    type: String,
    enum: ['Male', 'Female', 'Kids', 'Bridal', 'Both'],
    required: true,
  },
  // Service type category: Hair, Beard, Skin, Waxing, Massage, etc.
  category: {
    type: String,
    required: true,
    trim: true,
  },
  priceRange: {
    type: String, // e.g. "₹150 - ₹300"
    required: true,
  },
  duration: {
    type: String, // e.g. "30 mins"
    default: '30 mins',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Composite index for fast gender+category lookups
ServiceSchema.index({ genderCategory: 1, category: 1 });

module.exports = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
