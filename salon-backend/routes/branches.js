const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const Chair = require('../models/Chair');

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true });
    
    // Seed initial branches if none exist
    if (branches.length === 0) {
      const b1 = new Branch({
        name: 'Parvatinagar Branch',
        address: 'Beside Basua Bhawan, Parvatinagar, Police Gymkhana',
        phone: '07899711400',
        totalChairs: 6
      });
      const b2 = new Branch({
        name: 'Ashok Nagar Branch',
        address: 'Infantry Road, Near Wine World, Opp Levi\'s Showroom',
        phone: '07259375492',
        totalChairs: 8
      });
      await b1.save();
      await b2.save();
      
      const newBranches = await Branch.find();
      return res.json({ success: true, data: newBranches });
    }

    res.json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get chairs for a branch
router.get('/:id/chairs', async (req, res) => {
  try {
    const chairs = await Chair.find({ branch: req.params.id }).populate('currentStylist', 'name');
    res.json({ success: true, data: chairs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
