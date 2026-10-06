const express = require('express');
const router = express.Router();
const { Barber } = require('../models/dbAdapter');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all barbers
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const barbers = await Barber.find(filter).sort({ name: 1 });
    res.json({ success: true, count: barbers.length, barbers });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving barbers', error: error.message });
  }
});

// Admin: Add new barber
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, title, specialties, experience, avatar, rating, isActive } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Barber name is required' });
    }

    const barber = await Barber.create({
      name,
      title: title || 'Professional Stylist',
      specialties: Array.isArray(specialties) ? specialties : (specialties ? specialties.split(',').map(s => s.trim()) : ['Hair Cut']),
      experience: experience || '3+ Years',
      avatar: avatar || '',
      rating: rating ? Number(rating) : 4.9,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, barber });
  } catch (error) {
    res.status(500).json({ message: 'Error creating barber', error: error.message });
  }
});

// Admin: Update barber
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (typeof updateData.specialties === 'string') {
      updateData.specialties = updateData.specialties.split(',').map(s => s.trim()).filter(Boolean);
    }

    const barber = await Barber.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }

    res.json({ success: true, barber });
  } catch (error) {
    res.status(500).json({ message: 'Error updating barber', error: error.message });
  }
});

// Admin: Delete barber
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const barber = await Barber.findByIdAndDelete(id);
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }
    res.json({ success: true, message: 'Barber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting barber', error: error.message });
  }
});

module.exports = router;
