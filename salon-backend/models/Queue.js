const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  position: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Waiting', 'Serving', 'Completed', 'Skipped'],
    default: 'Waiting',
  },
  enteredAt: {
    type: Date,
    default: Date.now,
  },
  servedAt: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('Queue', QueueSchema);
