const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/dbAdapter');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'zero_to_hero_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// Customer fast login or auto-registration
router.post('/customer-login', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!phone || !phone.trim()) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const cleanedPhone = phone.trim().replace(/\s+/g, '');
    let user = await User.findOne({ phone: cleanedPhone });

    if (user) {
      // If name was provided and user name was default, optionally update
      if (name && name.trim() && user.name !== name.trim()) {
        user.name = name.trim();
        await user.save();
      }
    } else {
      user = await User.create({
        name: name && name.trim() ? name.trim() : 'Valued Customer',
        phone: cleanedPhone,
        role: 'customer',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ message: 'Server error during customer login' });
  }
});

// Admin login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await User.findOne({ email: email.toLowerCase().trim(), role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Get current profile
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
