import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '60px 0 100px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge-gold" style={{ marginBottom: '12px' }}>GET IN TOUCH</span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', marginBottom: '16px' }}>
            VISIT & <span className="gold-text">CONTACT US</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Have a special event inquiry, groom squad booking, or need directions? We are always here to assist.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          marginBottom: '60px',
        }}>
          {/* Contact Details Card */}
          <div className="glass-panel" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '24px' }}>
              Salon <span className="gold-text">Headquarters</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <MapPin size={22} color="var(--gold-primary)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--gold-light)', fontSize: '1rem', marginBottom: '4px' }}>Address</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    ZERO TO HERO SALON<br />
                    104 Luxury Boulevard, Central Arcade<br />
                    Near Grand Metro Station, Landmark Galleria
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Phone size={22} color="var(--gold-primary)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--gold-light)', fontSize: '1rem', marginBottom: '4px' }}>Telephone</h4>
                  <a href="tel:+919876543210" style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
                    +91 98765 43210
                  </a>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Call for VIP table bookings & concierge</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Clock size={22} color="var(--gold-primary)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--gold-light)', fontSize: '1rem', marginBottom: '4px' }}>Salon Timings</h4>
                  <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                    Monday – Sunday: 9:00 AM – 9:00 PM
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Open 7 Days a Week</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div style={{ marginTop: '30px' }}>
              <a
                href="https://wa.me/919876543210?text=Hello%20Zero%20To%20Hero%20Salon,%20I%20would%20like%20to%20connect"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#25D366',
                  color: '#000',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                }}
              >
                <MessageSquare size={18} /> Chat on WhatsApp Now
              </a>
            </div>
          </div>

          {/* Quick Message / Inquiry Form */}
          <div className="glass-panel" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '10px' }}>
              Send an <span className="gold-text">Inquiry</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
              We respond promptly to all private grooming events and special service requests.
            </p>

            {submitted ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: 'var(--radius-sm)',
                padding: '30px 20px',
                textAlign: 'center',
              }}>
                <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>Thank You!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Your message has been received. Our salon manager will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Message or Special Request
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn-gold" style={{ padding: '12px', fontSize: '0.95rem' }}>
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
