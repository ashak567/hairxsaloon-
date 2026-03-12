const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET /api/invoices — Get all invoices (admin)
router.get('/', async (req, res) => {
  try {
    const { branchId, customerId, startDate, endDate } = req.query;
    const query = {};

    if (branchId) query.branch = branchId;
    if (customerId) query.customer = customerId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(query)
      .populate('customer', 'name phone')
      .populate('appointment')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/invoices — Create invoice
router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();

    // Notify via Socket.io
    if (req.io) {
      req.io.emit('invoice:new', { invoiceId: invoice._id });
    }

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/invoices/:id — Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name phone')
      .populate('appointment');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/invoices/:id/status — Update payment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status, paidAt: status === 'Paid' ? new Date() : undefined },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
