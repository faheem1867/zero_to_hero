import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageSquare, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#050507',
      borderTop: '1px solid rgba(212, 175, 55, 0.25)',
      paddingTop: '60px',
      paddingBottom: '30px',
      marginTop: '80px',
      position: 'relative',
    }}>
      {/* Decorative top accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '2px',
        background: 'var(--gold-gradient)',
        boxShadow: '0 0 15px var(--gold-primary)',
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}>
          {/* Column 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <img
                src="/logo_z2h.jpeg"
                alt="ZERO TO HERO"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--gold-primary)',
                }}
              />
              <div>
                <h3 className="gold-text" style={{ fontSize: '1.25rem', letterSpacing: '0.05em' }}>ZERO TO HERO</h3>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.25em', color: 'var(--gold-light)', textTransform: 'uppercase' }}>
                  Luxury Grooming
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Redefining masculine and contemporary salon elegance. Experience precision scissor craft, master beard sculpting, and rejuvenating skin therapies.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge-gold">
                <Sparkles size={14} /> Premium Experience
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', fontSize: '1.05rem', marginBottom: '18px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>Home Experience</Link>
              </li>
              <li>
                <Link to="/services" style={{ color: 'var(--text-muted)' }}>Services & Pricing</Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-muted)' }}>About Our Stylists</Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-muted)' }}>Location & Directions</Link>
              </li>
              <li>
                <Link to="/book" style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>Instant Booking</Link>
              </li>
              <li>
                <Link to="/admin/login" style={{ color: '#666', fontSize: '0.8rem' }}>Admin / Staff Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Timing */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', fontSize: '1.05rem', marginBottom: '18px' }}>
              Salon Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="var(--gold-primary)" />
                <span>Monday - Sunday: <strong>9:00 AM - 9:00 PM</strong></span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(212,175,55,0.06)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--gold-primary)' }}>
                Walk-ins welcomed, online reservations given VIP priority.
              </p>
              <div style={{ marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>Payment Options:</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span className="badge-gold" style={{ fontSize: '0.75rem' }}>UPI QR (Instant)</span>
                  <span className="badge-gold" style={{ fontSize: '0.75rem' }}>GPay / PhonePe</span>
                  <span className="badge-gold" style={{ fontSize: '0.75rem' }}>Cash at Counter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & WhatsApp */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', fontSize: '1.05rem', marginBottom: '18px' }}>
              Reach Us Directly
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--gold-primary)" />
                <a href="tel:+919876543210" style={{ color: 'var(--text-main)' }}>+91 98765 43210</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="var(--gold-primary)" />
                <span>104 Luxury Boulevard, Central Arcade</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--gold-primary)" />
                <span>contact@zerotohero.com</span>
              </div>

              {/* Direct WhatsApp button */}
              <a
                href="https://wa.me/919876543210?text=Hello%20Zero%20To%20Hero%20Salon,%20I%20would%20like%20to%20inquire%20about%20booking"
                target="_blank"
                rel="noreferrer"
                style={{
                  marginTop: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  color: '#25D366',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                <MessageSquare size={16} />
                WhatsApp Us Directly
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} <strong>ZERO TO HERO SALON</strong>. Crafted with Black & Gold Luxury Precision.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Cleanliness Certified</span>
            <span>Master Stylists</span>
            <span>100% Satisfaction</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
