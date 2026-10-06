import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Award, Scissors, CheckCircle, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ padding: '60px 0 100px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="badge-gold" style={{ marginBottom: '12px' }}>
            <Award size={14} /> OUR HERITAGE
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', marginBottom: '16px' }}>
            THE <span className="gold-text">ZERO TO HERO</span> STORY
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.8 }}>
            Born from a vision to elevate everyday salon visits into luxurious personal retreats, ZERO TO HERO SALON blends old-world gentleman craftsmanship with modern aesthetic innovation.
          </p>
        </div>

        {/* Story Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '80px',
        }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '12px' }}>OUR PHILOSOPHY</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', color: '#fff' }}>
              Precision in Every Blade, <br />
              <span className="gold-text">Luxury in Every Detail</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: '16px' }}>
              We believe a haircut is never just a cut—it is the signature you present to the world. Every client who walks through our doors is treated with royal attentiveness.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: '24px' }}>
              Our barbers are rigorous artisans trained in advanced face-mapping scissor techniques, hot towel straight-razor shaving, and organic revitalizing facials tailored specifically to urban gentlemen.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>Bespoke Styling</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>100% Sanitized Tools</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>Complimentary Lounge</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>Instant UPI & Cash</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80"
              alt="Salon Interior"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--gold-border)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.2)',
                display: 'block',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '20px',
              background: 'rgba(10, 10, 14, 0.95)',
              border: '1px solid var(--gold-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 22px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gold-light)', fontWeight: 800 }}>
                10,000+
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Satisfied Clients Groomed</div>
            </div>
          </div>
        </div>

        {/* Hygiene Standards Card */}
        <div className="glass-panel" style={{ padding: '40px', border: '1px solid var(--gold-border)', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span className="badge-gold">
              <ShieldCheck size={14} /> HOSPITAL-GRADE HYGIENE
            </span>
            <h3 style={{ fontSize: '1.8rem', marginTop: '10px', color: '#fff' }}>
              Your Safety Is <span className="gold-text">Our Highest Priority</span>
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            textAlign: 'center',
          }}>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✂️</div>
              <h4 style={{ color: 'var(--gold-light)', marginBottom: '6px' }}>UV & Autoclave Sterilization</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>All metal shears, guards, and straight razor handles undergo high-grade UV sterilization between each guest.</p>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🪒</div>
              <h4 style={{ color: 'var(--gold-light)', marginBottom: '6px' }}>Single-Use Sealed Blades</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Every shave and razor outline uses a brand-new platinum blade unsealed right before your eyes.</p>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🧖</div>
              <h4 style={{ color: 'var(--gold-light)', marginBottom: '6px' }}>Fresh Sanitized Towels</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Individually laundered hot and cold towels infused with essential eucalyptus and lavender oils.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/book" className="btn-gold" style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: '50px' }}>
            <Scissors size={18} /> Book Your Transformation
          </Link>
        </div>
      </div>
    </div>
  );
}
