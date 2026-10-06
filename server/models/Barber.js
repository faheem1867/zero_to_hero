const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: 'Senior Stylist',
    },
    specialties: {
      type: [String],
      default: ['Hair Cut', 'Beard Trim'],
    },
    experience: {
      type: String,
      default: '4+ Years',
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Barber', barberSchema);
