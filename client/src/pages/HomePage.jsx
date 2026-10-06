import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoHeroCarousel from '../components/VideoHeroCarousel';
import {
  Scissors,
  Star,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, barbRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/barbers'),
        ]);
        const servData = await servRes.json();
        const barbData = await barbRes.json();
        if (servData.success) setServices(servData.services.slice(0, 6));
        if (barbData.success) setBarbers(barbData.barbers);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Video Hero Carousel with Floating Book CTA */}
      <VideoHeroCarousel />

      {/* Brand Intro / Value Proposition */}
      <section style={{ padding: '80px 0 40px', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="badge-gold" style={{ marginBottom: '14px' }}>
              <Award size={14} /> WHERE EVERY MAN BECOMES A HERO
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', lineHeight: 1.2, marginBottom: '18px' }}>
              CRAFTED FOR <span className="gold-text">DISTINCTION</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              At <strong>ZERO TO HERO SALON</strong>, grooming is not a routine—it is an art of confidence.
              From razor-sharp precision fades and classic beard trims to restorative gold facials and scalp therapies,
              every experience is curated in an opulent black and gold sanctuary.
            </p>
          </div>

          {/* 3 Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '50px',
            textAlign: 'left',
          }}>
            <div className="glass-panel glass-panel-hover" style={{ padding: '30px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}>
                <Scissors size={26} color="var(--gold-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>Master Artistry</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Our barbers possess years of specialized craft, executing personalized styling adapted to your unique facial profile.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover" style={{ padding: '30px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}>
                <Sparkles size={26} color="var(--gold-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>Royal Ambience</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Immerse in black leather recliners, gold accents, bespoke espresso, and curated soothing acoustic lounge atmosphere.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover" style={{ padding: '30px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}>
                <Clock size={26} color="var(--gold-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fff' }}>Zero Wait Time</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Direct online slot reservation ensures your seat and chosen stylist are prepared the moment you step through our doors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <section style={{ padding: '60px 0', background: 'rgba(12, 12, 16, 0.5)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: '10px' }}>POPULAR CHOICES</span>
              <h2 style={{ fontSize: '2.4rem' }}>
                SIGNATURE <span className="gold-text">SERVICES</span>
              </h2>
            </div>
            <Link to="/services" className="btn-outline-gold" style={{ fontSize: '0.88rem' }}>
              View All Services Menu <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {services.map((service) => (
              <div
                key={service._id}
                className="glass-panel glass-panel-hover"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                {/* Service Image with Dark Filter */}
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={service.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80'}
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.7) contrast(1.1)',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid var(--gold-border)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    color: 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Clock size={12} /> {service.duration} mins
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{service.name}</h3>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                      ₹{service.price}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, flex: 1, marginBottom: '20px' }}>
                    {service.description}
                  </p>
                  <Link
                    to={`/book?serviceId=${service._id}`}
                    className="btn-gold"
                    style={{ width: '100%', padding: '10px 16px', fontSize: '0.88rem' }}
                  >
                    <Scissors size={15} /> Book This Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Master Barbers Showcase */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge-gold" style={{ marginBottom: '10px' }}>MEET OUR ARTISTS</span>
            <h2 style={{ fontSize: '2.4rem' }}>
              MASTER <span className="gold-text">BARBERS & STYLISTS</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '10px auto 0' }}>
              Each stylist brings precision, heritage craft, and contemporary mastery to every appointment.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {barbers.map((barber) => (
              <div
                key={barber._id}
                className="glass-panel glass-panel-hover"
                style={{ textAlign: 'center', padding: '26px 20px' }}
              >
                <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 16px' }}>
                  <img
                    src={barber.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                    alt={barber.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--gold-primary)',
                      boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#0d0d10',
                    border: '1px solid var(--gold-primary)',
                    borderRadius: '50%',
                    padding: '3px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '0.72rem',
                    color: 'var(--gold-light)',
                  }}>
                    <Star size={10} fill="#d4af37" color="#d4af37" />
                    <span>{barber.rating}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.18rem', color: '#fff', marginBottom: '4px' }}>{barber.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--gold-light)', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  {barber.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Experience: <strong>{barber.experience}</strong>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
                  {(barber.specialties || []).map((spec, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        background: 'rgba(255,255,255,0.06)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        color: '#d1d1d6',
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/book?barberId=${barber._id}`}
                  className="btn-outline-gold"
                  style={{ width: '100%', padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  Book with {barber.name.split(' ')[0]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section style={{ padding: '60px 0', background: 'rgba(15, 15, 20, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-gold">TESTIMONIALS</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px' }}>
              WHAT OUR <span className="gold-text">CLIENTS SAY</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {[
              {
                name: 'Karthik Raman',
                role: 'Tech Lead & Regular Guest',
                text: 'The best fade and beard sculpting in town. The black and gold salon vibe is straight out of a luxury film. Booking online and scanning UPI made it effortless.',
                rating: 5,
              },
              {
                name: 'Arjun Nambiar',
                role: 'Entrepreneur',
                text: 'Took the Gold Facial and Hair Spa combo before my wedding. The results were unreal. My skin looked so refreshed and alive. Master Faheem knows his craft.',
                rating: 5,
              },
              {
                name: 'Sameer Sheikh',
                role: 'Creative Director',
                text: 'Zero waiting time. Arrived at 4 PM, Faheem had the hot towels ready. Clean tools, relaxing music, and high precision styling. 10/10.',
                rating: 5,
              },
            ].map((review, i) => (
              <div key={i} className="glass-panel" style={{ padding: '26px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} size={16} fill="#d4af37" color="#d4af37" />
                  ))}
                </div>
                <p style={{ color: '#e0e0e0', fontSize: '0.92rem', fontStyle: 'italic', marginBottom: '18px', lineHeight: 1.6 }}>
                  "{review.text}"
                </p>
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block' }}>{review.name}</strong>
                  <span style={{ color: 'var(--gold-light)', fontSize: '0.78rem' }}>{review.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big VIP Booking CTA Banner */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              padding: '60px 30px',
              textAlign: 'center',
              border: '2px solid var(--gold-primary)',
              boxShadow: '0 0 50px rgba(212, 175, 55, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-100px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '16px' }}>
              READY FOR YOUR <span className="gold-text">HERO MAKEOVER?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto 35px' }}>
              Select your services, choose your preferred stylist, and secure your time slot in under 60 seconds with instant WhatsApp confirmation.
            </p>

            <Link
              to="/book"
              className="btn-gold floating-pulse"
              style={{
                padding: '16px 44px',
                fontSize: '1.1rem',
                borderRadius: '50px',
                border: '2px solid #fff',
              }}
            >
              <Scissors size={20} />
              <span>BOOK APPOINTMENT TODAY</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
