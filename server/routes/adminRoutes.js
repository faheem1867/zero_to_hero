const express = require('express');
const router = express.Router();
const { Appointment, Service, Barber, User } = require('../models/dbAdapter');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect, adminOnly);

// Helper to get formatted today string (YYYY-MM-DD)
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Admin Dashboard Summary Stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const todayStr = getTodayString();

    const [
      todayAppointments,
      totalAppointments,
      scheduledCount,
      completedCount,
      cancelledCount,
      totalRevenueDocs,
      todayRevenueDocs,
      barberCount,
      serviceCount,
    ] = await Promise.all([
      Appointment.find({ date: todayStr }).sort({ timeSlot: 1 }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Scheduled' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.countDocuments({ status: 'Cancelled' }),
      Appointment.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Appointment.aggregate([
        { $match: { date: todayStr, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Barber.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
    ]);

    const totalRevenue = totalRevenueDocs[0]?.total || 0;
    const todayRevenue = todayRevenueDocs[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        todayStr,
        todayCount: todayAppointments.length,
        totalAppointments,
        scheduledCount,
        completedCount,
        cancelledCount,
        totalRevenue,
        todayRevenue,
        barberCount,
        serviceCount,
        todayAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard stats', error: error.message });
  }
});

// Admin All Appointments with filters
router.get('/appointments', async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (date) {
      query.date = date;
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { bookingId: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.phone': searchRegex },
        { 'barber.name': searchRegex },
      ];
    }

    const appointments = await Appointment.find(query).sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
});

// Admin Update Appointment Status
router.put('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, cancellationReason } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (cancellationReason) updateData.cancellationReason = cancellationReason;

    // Auto mark payment as Paid if completed and payment method was Cash or verified
    if (status === 'Completed' && !paymentStatus) {
      updateData.paymentStatus = 'Paid';
    }

    const appointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true, appointment, message: `Status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
});

// Admin Detailed Sales & Revenue Report
router.get('/sales-report', async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    const matchFilter = {};

    const today = new Date();
    const todayStr = getTodayString();

    if (period === 'today') {
      matchFilter.date = todayStr;
    } else if (period === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const weekStartStr = sevenDaysAgo.toISOString().split('T')[0];
      matchFilter.date = { $gte: weekStartStr, $lte: todayStr };
    } else if (period === 'month') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthStartStr = thirtyDaysAgo.toISOString().split('T')[0];
      matchFilter.date = { $gte: monthStartStr, $lte: todayStr };
    } else if (startDate && endDate) {
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }

    // Filter appointments in period
    const appointments = await Appointment.find(matchFilter).sort({ date: -1 });

    const totalBookings = appointments.length;
    const completedBookings = appointments.filter((a) => a.status === 'Completed');
    const cancelledBookings = appointments.filter((a) => a.status === 'Cancelled');
    const scheduledBookings = appointments.filter((a) => a.status === 'Scheduled');

    // Revenue calculations (from completed bookings and paid bookings)
    const grossRevenue = completedBookings.reduce((sum, a) => sum + (a.totalAmount || 0), 0);
    const potentialRevenue = appointments
      .filter((a) => a.status !== 'Cancelled')
      .reduce((sum, a) => sum + (a.totalAmount || 0), 0);

    // Payment method breakdown
    const upiRevenue = completedBookings
      .filter((a) => a.paymentMethod === 'UPI')
      .reduce((sum, a) => sum + (a.totalAmount || 0), 0);
    const cashRevenue = completedBookings
      .filter((a) => a.paymentMethod === 'Cash')
      .reduce((sum, a) => sum + (a.totalAmount || 0), 0);

    // Barber performance
    const barberMap = {};
    completedBookings.forEach((a) => {
      const bName = a.barber?.name || 'Unassigned';
      if (!barberMap[bName]) {
        barberMap[bName] = { name: bName, appointmentsCount: 0, revenue: 0 };
      }
      barberMap[bName].appointmentsCount += 1;
      barberMap[bName].revenue += a.totalAmount || 0;
    });

    // Top services breakdown
    const serviceMap = {};
    completedBookings.forEach((a) => {
      (a.services || []).forEach((s) => {
        if (!serviceMap[s.name]) {
          serviceMap[s.name] = { name: s.name, count: 0, revenue: 0 };
        }
        serviceMap[s.name].count += 1;
        serviceMap[s.name].revenue += s.price || 0;
      });
    });

    res.json({
      success: true,
      report: {
        filter: { period: period || 'all', startDate, endDate },
        totalBookings,
        completedCount: completedBookings.length,
        cancelledCount: cancelledBookings.length,
        scheduledCount: scheduledBookings.length,
        grossRevenue,
        potentialRevenue,
        paymentBreakdown: {
          upi: { count: completedBookings.filter((a) => a.paymentMethod === 'UPI').length, revenue: upiRevenue },
          cash: { count: completedBookings.filter((a) => a.paymentMethod === 'Cash').length, revenue: cashRevenue },
        },
        barberPerformance: Object.values(barberMap),
        topServices: Object.values(serviceMap).sort((a, b) => b.count - a.count),
        appointments,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating sales report', error: error.message });
  }
});

module.exports = router;
