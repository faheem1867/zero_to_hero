const express = require('express');
const router = express.Router();
const { Service } = require('../models/dbAdapter');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all services
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving services', error: error.message });
  }
});

// Admin: Add new service
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, description, price, duration, image, isActive } = req.body;
    if (!name || price === undefined || duration === undefined) {
      return res.status(400).json({ message: 'Name, price and duration are required' });
    }

    const service = await Service.create({
      name,
      category: category || 'General Grooming',
      description: description || '',
      price: Number(price),
      duration: Number(duration),
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
});

// Admin: Edit service
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
});

// Admin: Delete service
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
});

module.exports = router;
