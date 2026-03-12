const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET /api/services — Get services with optional gender/category filter
router.get('/', async (req, res) => {
  try {
    const { gender, category } = req.query;
    const query = { isActive: true };

    if (gender) query.genderCategory = gender;
    if (category && category !== 'All') query.category = category;

    const services = await Service.find(query).sort({ category: 1, name: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/services/categories — Get distinct categories for a gender
router.get('/categories', async (req, res) => {
  try {
    const { gender } = req.query;
    const match = { isActive: true };
    if (gender) match.genderCategory = gender;

    const categories = await Service.distinct('category', match);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/services — Add new service (admin)
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/services/:id — Update service (admin)
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/services/:id — Soft delete (admin)
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deactivated' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/services/seed — Seed the full catalog
router.post('/seed', async (req, res) => {
  try {
    await Service.deleteMany({});

    const allServices = [
      // Male Hair
      { name: 'Haircut', category: 'Hair', genderCategory: 'Male', priceRange: '₹150 - ₹250', duration: '30 mins' },
      { name: 'Hair Wash', category: 'Hair', genderCategory: 'Male', priceRange: '₹100 - ₹150', duration: '15 mins' },
      { name: 'Hair Styling', category: 'Hair', genderCategory: 'Male', priceRange: '₹150 - ₹300', duration: '20 mins' },
      { name: 'Hair Spa', category: 'Hair', genderCategory: 'Male', priceRange: '₹500 - ₹900', duration: '45 mins' },
      { name: 'Hair Mask Treatment', category: 'Hair', genderCategory: 'Male', priceRange: '₹300 - ₹600', duration: '30 mins' },
      { name: 'Hair Nourishing Mask', category: 'Hair', genderCategory: 'Male', priceRange: '₹350 - ₹650', duration: '30 mins' },
      { name: 'Hair Repair Mask', category: 'Hair', genderCategory: 'Male', priceRange: '₹400 - ₹700', duration: '35 mins' },
      { name: 'Hair Coloring', category: 'Hair', genderCategory: 'Male', priceRange: '₹500 - ₹1,500', duration: '60 mins' },
      { name: 'Hair Smoothening', category: 'Hair', genderCategory: 'Male', priceRange: '₹1,500 - ₹3,000', duration: '120 mins' },
      { name: 'Keratin Treatment', category: 'Hair', genderCategory: 'Male', priceRange: '₹2,000 - ₹4,000', duration: '120 mins' },
      // Male Beard
      { name: 'Beard Trim', category: 'Beard', genderCategory: 'Male', priceRange: '₹100 - ₹200', duration: '15 mins' },
      { name: 'Beard Styling', category: 'Beard', genderCategory: 'Male', priceRange: '₹150 - ₹300', duration: '20 mins' },
      { name: 'Beard Coloring', category: 'Beard', genderCategory: 'Male', priceRange: '₹300 - ₹600', duration: '30 mins' },
      { name: 'Beard Conditioning Treatment', category: 'Beard', genderCategory: 'Male', priceRange: '₹250 - ₹500', duration: '25 mins' },
      // Male Skin
      { name: 'Face Cleanup', category: 'Skin', genderCategory: 'Male', priceRange: '₹300 - ₹600', duration: '30 mins' },
      { name: 'Facial', category: 'Skin', genderCategory: 'Male', priceRange: '₹800 - ₹1,500', duration: '60 mins' },
      { name: 'Charcoal Face Mask', category: 'Skin', genderCategory: 'Male', priceRange: '₹400 - ₹600', duration: '30 mins' },
      { name: 'Hydrating Face Mask', category: 'Skin', genderCategory: 'Male', priceRange: '₹350 - ₹550', duration: '30 mins' },
      { name: 'Anti-Acne Face Mask', category: 'Skin', genderCategory: 'Male', priceRange: '₹450 - ₹700', duration: '35 mins' },
      { name: 'Skin Brightening Mask', category: 'Skin', genderCategory: 'Male', priceRange: '₹500 - ₹800', duration: '35 mins' },
      // Male Waxing
      { name: 'Chest Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹300 - ₹600', duration: '30 mins' },
      { name: 'Back Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹400 - ₹800', duration: '40 mins' },
      { name: 'Shoulder Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹200 - ₹400', duration: '20 mins' },
      { name: 'Stomach Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹300 - ₹500', duration: '30 mins' },
      { name: 'Full Body Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹2,000 - ₹4,000', duration: '90 mins' },
      // Male Massage
      { name: 'Head Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹200 - ₹400', duration: '20 mins' },
      { name: 'Shoulder Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹250 - ₹450', duration: '25 mins' },
      { name: 'Back Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹400 - ₹800', duration: '30 mins' },
      { name: 'Full Body Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹1,500 - ₹3,000', duration: '60 mins' },
      { name: 'Aromatherapy Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹2,000 - ₹4,000', duration: '60 mins' },
      { name: 'Deep Tissue Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹2,500 - ₹4,500', duration: '60 mins' },
      { name: 'Hot Oil Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹1,800 - ₹3,500', duration: '60 mins' },
      // Groom
      { name: 'Groom Makeup', category: 'Groom', genderCategory: 'Male', priceRange: '₹3,000 - ₹8,000', duration: '60 mins' },
      { name: 'Groom Facial', category: 'Groom', genderCategory: 'Male', priceRange: '₹1,500 - ₹3,500', duration: '60 mins' },
      { name: 'Premium Beard Styling', category: 'Groom', genderCategory: 'Male', priceRange: '₹500 - ₹1,000', duration: '45 mins' },
      { name: 'Hair Styling for Groom', category: 'Groom', genderCategory: 'Male', priceRange: '₹800 - ₹1,500', duration: '45 mins' },
      { name: 'Pre-Groom Package', category: 'Groom', genderCategory: 'Male', priceRange: '₹5,000 - ₹12,000', duration: '180 mins' },
      { name: 'Hair Coloring for Groom', category: 'Groom', genderCategory: 'Male', priceRange: '₹1,000 - ₹2,500', duration: '60 mins' },
      // Female Hair
      { name: 'Haircut', category: 'Hair', genderCategory: 'Female', priceRange: '₹300 - ₹700', duration: '45 mins' },
      { name: 'Hair Wash', category: 'Hair', genderCategory: 'Female', priceRange: '₹200 - ₹400', duration: '20 mins' },
      { name: 'Hair Styling', category: 'Hair', genderCategory: 'Female', priceRange: '₹400 - ₹1,000', duration: '45 mins' },
      { name: 'Hair Spa', category: 'Hair', genderCategory: 'Female', priceRange: '₹800 - ₹1,500', duration: '60 mins' },
      { name: 'Hair Mask Treatment', category: 'Hair', genderCategory: 'Female', priceRange: '₹500 - ₹1,000', duration: '40 mins' },
      { name: 'Hair Nourishing Mask', category: 'Hair', genderCategory: 'Female', priceRange: '₹600 - ₹1,200', duration: '40 mins' },
      { name: 'Hair Repair Mask', category: 'Hair', genderCategory: 'Female', priceRange: '₹700 - ₹1,400', duration: '45 mins' },
      { name: 'Hair Strengthening Mask', category: 'Hair', genderCategory: 'Female', priceRange: '₹800 - ₹1,500', duration: '45 mins' },
      { name: 'Hair Coloring', category: 'Hair', genderCategory: 'Female', priceRange: '₹1,500 - ₹5,000', duration: '90 mins' },
      { name: 'Hair Smoothening', category: 'Hair', genderCategory: 'Female', priceRange: '₹3,000 - ₹6,000', duration: '120 mins' },
      { name: 'Keratin Treatment', category: 'Hair', genderCategory: 'Female', priceRange: '₹4,000 - ₹9,000', duration: '150 mins' },
      // Female Skin
      { name: 'Facial', category: 'Skin', genderCategory: 'Female', priceRange: '₹1,000 - ₹3,000', duration: '60 mins' },
      { name: 'Face Cleanup', category: 'Skin', genderCategory: 'Female', priceRange: '₹500 - ₹1,000', duration: '40 mins' },
      { name: 'Threading', category: 'Skin', genderCategory: 'Female', priceRange: '₹50 - ₹150', duration: '15 mins' },
      { name: 'Charcoal Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹500 - ₹900', duration: '30 mins' },
      { name: 'Hydrating Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹600 - ₹1,000', duration: '35 mins' },
      { name: 'Gold Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹1,000 - ₹2,000', duration: '45 mins' },
      { name: 'Anti-Acne Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹800 - ₹1,500', duration: '40 mins' },
      { name: 'Skin Brightening Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹900 - ₹1,800', duration: '45 mins' },
      { name: 'Collagen Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹1,200 - ₹2,500', duration: '45 mins' },
      // Female Waxing
      { name: 'Eyebrow Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹100 - ₹200', duration: '15 mins' },
      { name: 'Upper Lip Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹50 - ₹150', duration: '10 mins' },
      { name: 'Chin Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹50 - ₹150', duration: '10 mins' },
      { name: 'Underarm Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹150 - ₹300', duration: '15 mins' },
      { name: 'Half Arm Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹250 - ₹500', duration: '20 mins' },
      { name: 'Full Arm Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹400 - ₹800', duration: '30 mins' },
      { name: 'Half Leg Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹350 - ₹700', duration: '30 mins' },
      { name: 'Full Leg Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹600 - ₹1,200', duration: '45 mins' },
      { name: 'Full Body Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹2,500 - ₹5,000', duration: '90 mins' },
      { name: 'Chocolate Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹800 - ₹1,500', duration: '45 mins' },
      { name: 'Rica Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹1,200 - ₹2,500', duration: '60 mins' },
      { name: 'Hard Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹1,000 - ₹2,000', duration: '60 mins' },
      // Female Massage
      { name: 'Head Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹300 - ₹600', duration: '20 mins' },
      { name: 'Shoulder Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹400 - ₹800', duration: '30 mins' },
      { name: 'Back Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹600 - ₹1,200', duration: '40 mins' },
      { name: 'Full Body Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹2,000 - ₹4,000', duration: '60 mins' },
      { name: 'Aromatherapy Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹2,500 - ₹5,000', duration: '60 mins' },
      { name: 'Deep Tissue Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹3,000 - ₹6,000', duration: '60 mins' },
      { name: 'Hot Oil Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹2,200 - ₹4,500', duration: '60 mins' },
      { name: 'Hair & Scalp Therapy Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹1,500 - ₹3,000', duration: '45 mins' },
      // Bridal
      { name: 'Bridal Makeup', category: 'Bridal', genderCategory: 'Female', priceRange: '₹8,000 - ₹25,000', duration: '150 mins' },
      { name: 'Bridal Hairstyle', category: 'Bridal', genderCategory: 'Female', priceRange: '₹2,500 - ₹6,000', duration: '90 mins' },
      { name: 'Bridal Facial Package', category: 'Bridal', genderCategory: 'Female', priceRange: '₹3,000 - ₹8,000', duration: '90 mins' },
      { name: 'Pre-Bridal Package', category: 'Bridal', genderCategory: 'Female', priceRange: '₹10,000 - ₹30,000', duration: '240 mins' },
      { name: 'Engagement Makeup', category: 'Bridal', genderCategory: 'Female', priceRange: '₹5,000 - ₹15,000', duration: '120 mins' },
      { name: 'Saree Draping', category: 'Bridal', genderCategory: 'Female', priceRange: '₹1,000 - ₹3,000', duration: '45 mins' },
      { name: 'Mehendi Application', category: 'Bridal', genderCategory: 'Female', priceRange: '₹2,000 - ₹8,000', duration: '120 mins' },
      // Kids
      { name: 'Kids Haircut', category: 'Hair', genderCategory: 'Kids', priceRange: '₹150 - ₹300', duration: '20 mins' },
      { name: 'Kids Hair Wash', category: 'Hair', genderCategory: 'Kids', priceRange: '₹100 - ₹200', duration: '15 mins' },
    ];

    const inserted = await Service.insertMany(allServices);
    res.json({ success: true, count: inserted.length, message: 'Service catalog seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
