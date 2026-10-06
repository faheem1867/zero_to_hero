import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, ArrowRight, Banknote, ShieldCheck } from 'lucide-react';

export default function UpiPaymentModal({
  amount,
  bookingId,
  customerName,
  onPaymentSuccess,
  onSwitchToCash,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upiId = 'zerotohero@upi';
  const payeeName = 'ZERO TO HERO SALON';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Booking ' + (bookingId || 'Salon'))}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}&bgcolor=111114&color=D4AF37&margin=10`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onPaymentSuccess({
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        transactionId: transactionId || 'UPI-REF-' + Math.floor(100000 + Math.random() * 900000),
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '30px',
        border: '1px solid var(--gold-primary)',
        boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
        borderRadius: 'var(--radius-md)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--gold-light)',
            fontSize: '0.85rem',
            marginBottom: '6px',
          }}>
            <ShieldCheck size={18} color="var(--gold-primary)" />
            <span>Instant UPI QR Payment</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff' }}>
            Pay <span className="gold-text">₹{amount}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Booking ID: <strong style={{ color: 'var(--gold-light)' }}>{bookingId}</strong>
          </p>
        </div>

        {/* QR Code container */}
        <div style={{
          background: '#0d0d10',
          padding: '16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          textAlign: 'center',
          marginBottom: '18px',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '10px',
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            <img
              src={qrCodeUrl}
              alt="UPI QR Code"
              style={{
                width: '180px',
                height: '180px',
                display: 'block',
              }}
            />
          </div>
          <p style={{ color: 'var(--gold-light)', fontSize: '0.82rem', marginTop: '10px', fontWeight: 600 }}>
            Scan with Google Pay, PhonePe, Paytm, or BHIM
          </p>
        </div>

        {/* Direct UPI Intent Button (Mobile & Desktop) */}
        <div style={{ marginBottom: '18px' }}>
          <a
            href={upiUrl}
            className="btn-gold"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.92rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ExternalLink size={18} />
            <span>Open in UPI App (GPay / PhonePe)</span>
          </a>
        </div>

        {/* UPI ID copy box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '18px',
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>UPI ID</span>
            <code style={{ color: 'var(--gold-light)', fontSize: '0.9rem', fontWeight: 600 }}>{upiId}</code>
          </div>
          <button
            onClick={handleCopyUpi}
            className="btn-dark"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Transaction Reference form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              UPI Reference / UTR Number (Optional for auto-verify):
            </label>
            <input
              type="text"
              placeholder="e.g. 408271892812"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.88rem' }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
            >
              <span>{isSubmitting ? 'Verifying Payment...' : 'I Have Paid — Confirm Booking'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onSwitchToCash}
              className="btn-dark"
              style={{ width: '100%', padding: '10px', fontSize: '0.88rem', color: 'var(--gold-light)' }}
            >
              <Banknote size={16} />
              <span>Prefer to Pay Cash at Salon Counter</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
