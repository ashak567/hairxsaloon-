import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  genderCategory: { type: String, required: true, enum: ['Male', 'Female', 'Kids', 'Bridal', 'Both'] },
  priceRange: { type: String, required: true },
  duration: { type: String }, // e.g. "45 mins"
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
