const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { Appointment, Service, Barber, User } = require('../models/dbAdapter');
const { protect } = require('../middleware/authMiddleware');

// Standard business day slot generator (09:00 AM to 08:30 PM in 30-min increments)
const ALL_DAY_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
];

// Helper to convert time string (e.g., "10:30 AM") to minutes from midnight
const timeToMinutes = (timeStr) => {
  const parts = timeStr.trim().split(' ');
  const [hourStr, minStr] = parts[0].split(':');
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);
  const isPM = parts[1] === 'PM';
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  return hour * 60 + min;
};

// Check available time slots for a given barber and date
router.get('/availability', async (req, res) => {
  try {
    const { barberId, date, duration } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const totalDuration = parseInt(duration, 10) || 30;

    // Find all existing non-cancelled appointments for this date (and barber if specified)
    const query = {
      date,
      status: { $ne: 'Cancelled' },
    };
    if (barberId && barberId !== 'any') {
      query['barber.barberId'] = barberId;
    }

    const existingAppointments = await Appointment.find(query);

    // Map booked intervals: [startMin, endMin]
    const bookedIntervals = existingAppointments.map((appt) => {
      const start = timeToMinutes(appt.timeSlot);
      return {
        start,
        end: start + (appt.totalDuration || 30),
      };
    });

    // Determine availability of each candidate slot
    const slots = ALL_DAY_SLOTS.map((slot) => {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + totalDuration;

      // Check overlap with any existing booked interval
      const isConflict = bookedIntervals.some((interval) => {
        return slotStart < interval.end && slotEnd > interval.start;
      });

      return {
        time: slot,
        available: !isConflict,
      };
    });

    res.json({ success: true, date, totalDuration, slots });
  } catch (error) {
    res.status(500).json({ message: 'Error checking slot availability', error: error.message });
  }
});

// Book appointment
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      serviceIds,
      barberId,
      date,
      timeSlot,
      paymentMethod,
      transactionId,
      notes,
    } = req.body;

    if (!customerPhone || !customerName || !serviceIds || !serviceIds.length || !date || !timeSlot) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    // Auto find or create customer
    const cleanedPhone = customerPhone.trim().replace(/\s+/g, '');
    let user = await User.findOne({ phone: cleanedPhone });
    if (!user) {
      user = await User.create({
        name: customerName.trim(),
        phone: cleanedPhone,
        role: 'customer',
      });
    }

    // Fetch services to compute totals
    const servicesData = await Service.find({ _id: { $in: serviceIds } });
    if (!servicesData.length) {
      return res.status(400).json({ message: 'No valid services selected' });
    }

    const totalAmount = servicesData.reduce((acc, s) => acc + s.price, 0);
    const totalDuration = servicesData.reduce((acc, s) => acc + s.duration, 0);

    // Fetch or assign barber
    let barberName = 'Any Available Stylist';
    let assignedBarberId = null;

    if (barberId && barberId !== 'any') {
      const barberDoc = await Barber.findById(barberId);
      if (barberDoc) {
        barberName = barberDoc.name;
        assignedBarberId = barberDoc._id;
      }
    } else {
      // Pick first active barber
      const anyBarber = await Barber.findOne({ isActive: true });
      if (anyBarber) {
        barberName = anyBarber.name;
        assignedBarberId = anyBarber._id;
      }
    }

    // Generate unique Booking ID (e.g. Z2H-7B29A)
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const bookingId = `Z2H-${randomHex}`;

    const appointment = await Appointment.create({
      bookingId,
      customer: {
        userId: user._id,
        name: customerName.trim(),
        phone: cleanedPhone,
      },
      services: servicesData.map((s) => ({
        serviceId: s._id,
        name: s.name,
        price: s.price,
        duration: s.duration,
      })),
      barber: {
        barberId: assignedBarberId,
        name: barberName,
      },
      date,
      timeSlot,
      totalDuration,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: paymentMethod === 'UPI' && transactionId ? 'Paid' : 'Pending',
      transactionId: transactionId || '',
      status: 'Scheduled',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      appointment,
      message: 'Appointment booked successfully',
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
});

// Customer appointment history by user / phone
router.get('/my-history', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const cleanedPhone = phone.trim().replace(/\s+/g, '');
    const appointments = await Appointment.find({ 'customer.phone': cleanedPhone }).sort({
      createdAt: -1,
    });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving history', error: error.message });
  }
});

// Lookup by bookingId
router.get('/lookup/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const appointment = await Appointment.findOne({
      bookingId: bookingId.toUpperCase().trim(),
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error looking up appointment', error: error.message });
  }
});

// Cancel appointment (Customer or Admin)
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: 'Cancelled',
        cancellationReason: cancellationReason || 'Cancelled by customer',
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true, appointment, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
});

// Reschedule appointment
router.put('/:id/reschedule', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, timeSlot } = req.body;

    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'Date and time slot are required' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        date,
        timeSlot,
        status: 'Scheduled',
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true, appointment, message: 'Appointment rescheduled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error rescheduling appointment', error: error.message });
  }
});

// Update payment status (e.g. after UPI confirmation or Cash received)
router.put('/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, paymentMethod } = req.body;

    const updateFields = {};
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;
    if (transactionId) updateFields.transactionId = transactionId;
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;

    const appointment = await Appointment.findByIdAndUpdate(id, updateFields, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
});

module.exports = router;
