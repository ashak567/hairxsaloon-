const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
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
  stylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stylist',
    required: true,
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  gstAmount: { // Assuming 18% GST for salon services in India
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'UPI', 'Pending'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Refunded'],
    default: 'Unpaid',
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
  }
}, { timestamps: true });

// Pre-save hook to generate invoice number
InvoiceSchema.pre('validate', function(next) {
  if (!this.invoiceNumber) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV-${dateStr}-${randomStr}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
