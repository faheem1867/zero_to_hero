import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MessageSquare, Bell, Clock, Calendar, CheckCircle, Share2, Download, Printer } from 'lucide-react';

export default function WhatsAppNotificationModal({
  appointment,
  onClose,
}) {
  useEffect(() => {
    // Luxury gold & white confetti explosion on booking confirmation!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF3A7', '#FFFFFF', '#AA7A1E'],
      });
    } catch {
      // safe fallback if canvas-confetti unavailable
    }
  }, []);

  if (!appointment) return null;

  const {
    bookingId,
    customer,
    services,
    barber,
    date,
    timeSlot,
    totalDuration,
    totalAmount,
    paymentMethod,
    paymentStatus,
  } = appointment;

  const serviceNames = (services || []).map((s) => s.name).join(', ');

  // Formatted WhatsApp message text
  const waMessage = 
`💈 *ZERO TO HERO SALON - APPOINTMENT CONFIRMED* 💈
━━━━━━━━━━━━━━━━━━━━
✨ *Booking ID:* ${bookingId}
👤 *Client:* ${customer?.name || 'Valued Guest'}
✂️ *Stylist:* ${barber?.name || 'Any Stylist'}
💇 *Services:* ${serviceNames}
📅 *Date:* ${date}
⏰ *Time Slot:* ${timeSlot} (${totalDuration} Mins)
💳 *Payment:* ${paymentMethod} (${paymentStatus})
💰 *Total Amount:* ₹${totalAmount}
━━━━━━━━━━━━━━━━━━━━
📍 *Location:* ZERO TO HERO SALON, 104 Luxury Boulevard, Central Arcade
📞 *Phone:* +91 98765 43210
🔔 *Reminder:* Please arrive 5 minutes prior to your slot. See you soon!`;

  // WhatsApp click-to-chat URL
  // If customer has a phone number, target their phone, or general salon dispatch
  const cleanPhone = (customer?.phone || '').replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '32px',
        border: '2px solid var(--gold-primary)',
        boxShadow: '0 0 50px rgba(212, 175, 55, 0.35)',
        borderRadius: 'var(--radius-md)',
        position: 'relative',
        maxHeight: '92vh',
        overflowY: 'auto',
      }}>
        {/* Success Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <CheckCircle size={36} color="#10b981" />
          </div>
          <span className="badge-gold" style={{ marginBottom: '8px' }}>
            APPOINTMENT CONFIRMED
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff', marginTop: '6px' }}>
            You're All <span className="gold-text">Booked!</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Booking Reference: <strong style={{ color: 'var(--gold-light)' }}>{bookingId}</strong>
          </p>
        </div>

        {/* Appointment Summary Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          fontSize: '0.88rem',
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Date & Time</span>
            <strong style={{ color: '#fff' }}>{date} @ {timeSlot}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Barber / Stylist</span>
            <strong style={{ color: 'var(--gold-light)' }}>{barber?.name}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Services</span>
            <span style={{ color: '#fff' }}>{serviceNames}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Total Paid / Mode</span>
            <strong style={{ color: '#10b981' }}>₹{totalAmount}</strong> ({paymentMethod} - {paymentStatus})
          </div>
        </div>

        {/* WhatsApp Notification Action */}
        <div style={{
          background: 'rgba(37, 211, 102, 0.08)',
          border: '1px solid rgba(37, 211, 102, 0.35)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <MessageSquare size={20} color="#25D366" />
            <strong style={{ color: '#25D366', fontSize: '0.95rem' }}>WhatsApp Appointment Alert</strong>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>
            Click below to receive your digital confirmation voucher directly on WhatsApp or share it with the salon.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: '#25D366',
              color: '#000',
              fontWeight: 700,
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'transform 0.2s',
            }}
          >
            <MessageSquare size={18} />
            <span>Open WhatsApp Confirmation</span>
          </a>
        </div>

        {/* In-App SMS & 30-Minute Reminder Simulation Banner */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <Bell size={16} color="var(--gold-primary)" />
            <span>SMS Confirmation & 30-Minute Reminder</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>
            📱 Confirmation SMS successfully dispatched to <strong>{customer?.phone}</strong>.<br />
            ⏰ An automated reminder alert will be triggered <strong>30 minutes before your slot</strong> at {timeSlot}.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handlePrint}
            className="btn-dark"
            style={{ flex: 1, padding: '12px', fontSize: '0.88rem' }}
          >
            <Printer size={16} /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="btn-gold"
            style={{ flex: 1, padding: '12px', fontSize: '0.88rem' }}
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}
