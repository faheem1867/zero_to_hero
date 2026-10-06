import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WhatsAppNotificationModal from '../components/WhatsAppNotificationModal';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Scissors,
  MessageSquare,
  Search,
  RefreshCw,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user, loginCustomer } = useAuth();
  const [phoneSearch, setPhoneSearch] = useState(user?.phone || '');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Cancellation modal
  const [cancelModalAppt, setCancelModalAppt] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Reschedule modal
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  const fetchHistory = async (phone) => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/my-history?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.phone) {
      setPhoneSearch(user.phone);
      fetchHistory(user.phone);
    }
  }, [user]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    fetchHistory(phoneSearch);
  };

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    if (!cancelModalAppt) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/appointments/${cancelModalAppt._id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancellationReason: cancelReason || 'Customer requested cancellation' }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === cancelModalAppt._id ? data.appointment : a))
        );
        setCancelModalAppt(null);
        setCancelReason('');
      }
    } catch (err) {
      alert('Error cancelling appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRescheduleBooking = async (e) => {
    e.preventDefault();
    if (!rescheduleAppt || !newDate || !newSlot) return;
    setIsRescheduling(true);
    try {
      const res = await fetch(`/api/appointments/${rescheduleAppt._id}/reschedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, timeSlot: newSlot }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === rescheduleAppt._id ? data.appointment : a))
        );
        setRescheduleAppt(null);
      }
    } catch (err) {
      alert('Error rescheduling appointment');
    } finally {
      setIsRescheduling(false);
    }
  };

  return (
    <div style={{ padding: '50px 0 100px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge-gold">CUSTOMER PORTAL</span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginTop: '4px' }}>
              MY <span className="gold-text">BOOKINGS & HISTORY</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Track scheduled slots, reschedule, view receipts, and launch WhatsApp vouchers.
            </p>
          </div>

          <Link to="/book" className="btn-gold" style={{ fontSize: '0.88rem', padding: '10px 22px' }}>
            <Scissors size={16} /> Book New Appointment
          </Link>
        </div>

        {/* Search by phone if not logged in or looking up another number */}
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
          <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number to view bookings..."
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px' }}
              />
              <Phone size={16} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <button type="submit" className="btn-gold" style={{ padding: '11px 22px', fontSize: '0.88rem' }}>
              <Search size={16} /> Find Bookings
            </button>
          </form>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gold-light)' }}>
            Loading your salon bookings...
          </div>
        ) : appointments.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Calendar size={48} color="var(--gold-primary)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '8px' }}>No Appointments Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              {phoneSearch ? `No booking records found for phone ${phoneSearch}.` : 'Enter your mobile number above or make a new booking.'}
            </p>
            <Link to="/book" className="btn-gold">
              <Scissors size={16} /> Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {appointments.map((appt) => {
              const isScheduled = appt.status === 'Scheduled';
              const isCompleted = appt.status === 'Completed';
              const isCancelled = appt.status === 'Cancelled';

              return (
                <div
                  key={appt._id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    border: isScheduled ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--gold-light)', fontWeight: 800 }}>
                          {appt.bookingId}
                        </span>
                        {isScheduled && <span className="badge-gold">Scheduled</span>}
                        {isCompleted && <span className="badge-green">Completed</span>}
                        {isCancelled && <span className="badge-red">Cancelled</span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Client: <strong style={{ color: '#fff' }}>{appt.customer?.name}</strong> ({appt.customer?.phone})
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', fontWeight: 800 }}>
                        ₹{appt.totalAmount}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: appt.paymentStatus === 'Paid' ? '#10b981' : 'var(--warning)' }}>
                        {appt.paymentMethod} • {appt.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Booking details grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '18px',
                    fontSize: '0.86rem',
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Date & Slot</span>
                      <strong style={{ color: '#fff' }}>{appt.date} at {appt.timeSlot}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Barber</span>
                      <strong style={{ color: 'var(--gold-light)' }}>{appt.barber?.name}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Services Booked</span>
                      <span style={{ color: '#ddd' }}>
                        {(appt.services || []).map((s) => s.name).join(', ')} ({appt.totalDuration}m)
                      </span>
                    </div>
                  </div>

                  {isCancelled && appt.cancellationReason && (
                    <div style={{ fontSize: '0.82rem', color: '#f87171', marginBottom: '14px' }}>
                      Reason: {appt.cancellationReason}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* View voucher / WhatsApp modal */}
                    <button
                      onClick={() => setSelectedAppointment(appt)}
                      className="btn-dark"
                      style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                    >
                      <MessageSquare size={14} color="#25D366" />
                      <span>WhatsApp Voucher</span>
                    </button>

                    {isScheduled && (
                      <>
                        <button
                          onClick={() => {
                            setRescheduleAppt(appt);
                            setNewDate(appt.date);
                            setNewSlot(appt.timeSlot);
                          }}
                          className="btn-outline-gold"
                          style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                        >
                          <RefreshCw size={14} /> Reschedule
                        </button>

                        <button
                          onClick={() => setCancelModalAppt(appt)}
                          className="btn-dark"
                          style={{ fontSize: '0.82rem', padding: '8px 14px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WhatsApp & Print Receipt Modal */}
        {selectedAppointment && (
          <WhatsAppNotificationModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}

        {/* Cancellation Dialog Modal */}
        {cancelModalAppt && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}>
            <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '26px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>Cancel Appointment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                Are you sure you want to cancel booking <strong>{cancelModalAppt.bookingId}</strong>?
              </p>
              <form onSubmit={handleCancelBooking}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Reason for cancellation:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Schedule conflict, feeling unwell..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="form-textarea"
                  style={{ marginBottom: '18px' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setCancelModalAppt(null)} className="btn-dark">
                    Keep Appointment
                  </button>
                  <button
                    type="submit"
                    disabled={isCancelling}
                    className="btn-gold"
                    style={{ background: '#ef4444', color: '#fff' }}
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reschedule Dialog Modal */}
        {rescheduleAppt && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}>
            <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '26px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>Reschedule Appointment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                Select a new date and time slot for <strong>{rescheduleAppt.bookingId}</strong>.
              </p>
              <form onSubmit={handleRescheduleBooking}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    New Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="form-input"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    New Time Slot
                  </label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="form-select"
                  >
                    {[
                      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
                      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
                      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
                      '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
                    ].map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setRescheduleAppt(null)} className="btn-dark">
                    Cancel
                  </button>
                  <button type="submit" disabled={isRescheduling} className="btn-gold">
                    {isRescheduling ? 'Updating...' : 'Save New Slot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
