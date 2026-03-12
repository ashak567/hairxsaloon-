const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hair_x_studio_super_secret_jwt_key_change_in_production';

// ─── SEED DEFAULT ADMIN ────────────────────────────
// Creates default admin on first-ever login if DB is empty
async function ensureDefaultAdmin() {
  const exists = await User.findOne({ username: 'admin' });
  if (!exists) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Super Admin',
      username: 'admin',
      phone: '0000000000',
      password: hashed,
      role: 'super_admin',
    });
    console.log('✅ Default admin created: admin / admin123');
  }
}
ensureDefaultAdmin().catch(console.error);

// ─── ADMIN LOGIN ──────────────────────────────────
// POST /api/auth/admin/login
// Body: { username, password }
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, branch: user.branch },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── CUSTOMER SEND OTP ────────────────────────────
// POST /api/auth/customer/send-otp
// Body: { phone }
router.post('/customer/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit phone number required' });
    }

    // In production: integrate Twilio / MSG91 here
    const mockOtp = '123456';
    console.log(`[DEV-OTP] Phone: ${phone} → OTP: ${mockOtp}`);

    res.json({ success: true, message: 'OTP sent successfully. Use 123456 in development.' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── CUSTOMER VERIFY OTP ─────────────────────────
// POST /api/auth/customer/verify-otp
// Body: { phone, otp, name?, gender? }
router.post('/customer/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name, gender } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    // Mock OTP check — replace with real verification in production
    if (otp !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    let customer = await Customer.findOne({ phone });

    if (!customer) {
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required for new customers' });
      }
      customer = await Customer.create({ phone, name, gender: gender || 'Male' });
    }

    const token = jwt.sign(
      { id: customer._id, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ success: true, token, customer });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET CUSTOMER BY PHONE ───────────────────────
// GET /api/auth/customer/lookup?phone=xxx
router.get('/customer/lookup', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone required' });

    const customer = await Customer.findOne({ phone })
      .populate('appointments')
      .select('-__v');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Customer lookup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
