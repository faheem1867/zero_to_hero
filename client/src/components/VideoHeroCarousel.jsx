import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, ChevronLeft, ChevronRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'THE PINNACLE OF GROOMING MASTERY',
    subtitle: 'BESPOKE HAIRCUTS & BEARD SCULPTING',
    description: 'Transform your style with razor-sharp fades, classic executive cuts, and signature beard detailing delivered by master barbers.',
    badge: 'ESTABLISHED LUXURY',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barber-cutting-a-mans-hair-in-a-barbershop-42525-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80',
    highlight: 'Precision Cuts from ₹250',
  },
  {
    id: 2,
    title: 'LUXURY SKIN REVIVAL & GOLD FACIALS',
    subtitle: 'INSTANT RADIANCE & DETOXIFYING D-TAN',
    description: 'Reclaim your youthful glow. Deep pore cleansing, gold glow peptide facial, and refreshing hot steam acupressure rituals.',
    badge: 'SIGNATURE THERAPY',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barber-shaving-a-clients-beard-with-a-razor-42524-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1600&q=80',
    highlight: 'Herbal & Gold Facials from ₹400',
  },
  {
    id: 3,
    title: 'KERATIN HAIR SPAS & COLOR ARTISTRY',
    subtitle: 'REVITALIZE. RESTORE. REDEFINE.',
    description: 'Restore vitality with intensive nourishing spa treatments and ammonia-free rich hair coloring formulated for distinguished results.',
    badge: 'ROYAL TREATMENT',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barber-shampooing-a-clients-hair-42526-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
    highlight: 'Intensive Hair Spa from ₹750',
  },
];

export default function VideoHeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const slide = SLIDES[current];

  return (
    <div className="hero-carousel-container">
      {/* Background Video with Smooth Fade */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <video
          key={slide.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster={slide.posterUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.38) contrast(1.15)',
            transform: 'scale(1.04)',
            transition: 'transform 8s ease-out',
          }}
        >
          <source src={slide.videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Dark & Gold Gradient Overlays */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        background: `
          linear-gradient(180deg, rgba(8, 8, 10, 0.75) 0%, rgba(8, 8, 10, 0.4) 50%, rgba(8, 8, 10, 0.95) 100%),
          radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%)
        `,
      }} />

      {/* Gold Ambient Glow Spotlight */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Hero Content */}
      <div className="container hero-content-wrapper">
        {/* Luxury Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 16px',
          borderRadius: '50px',
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          marginBottom: '16px',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
        }}>
          <Sparkles size={14} color="var(--gold-light)" />
          <span style={{
            fontSize: '0.74rem',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '0.2em',
            color: 'var(--gold-light)',
            fontWeight: 700,
          }}>
            {slide.badge}
          </span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          letterSpacing: '0.25em',
          color: '#d1d1d6',
          textTransform: 'uppercase',
          marginBottom: '10px',
          fontWeight: 500,
        }}>
          {slide.subtitle}
        </div>

        {/* Main Title with Gold Lettering */}
        <h1 className="hero-main-title">
          <span className="shimmer-text">{slide.title}</span>
        </h1>

        {/* Description */}
        <p className="hero-description">
          {slide.description}
        </p>

        {/* Large Floating Book Button & Secondary CTA */}
        <div className="hero-btn-group">
          <Link
            to="/book"
            className="btn-gold floating-pulse hero-btn-primary"
          >
            <Scissors size={18} />
            <span>BOOK APPOINTMENT NOW</span>
          </Link>

          <Link
            to="/services"
            className="btn-outline-gold hero-btn-secondary"
          >
            Explore Services & Menu
          </Link>
        </div>

        {/* Feature Highlights beneath Hero */}
        <div className="hero-highlights">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="var(--gold-primary)" /> Instant Slot Confirmation
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={15} color="var(--gold-primary)" /> UPI & Cash Accepted
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={15} color="var(--gold-primary)" /> 100% Sanitized Tools
          </span>
        </div>
      </div>

      {/* Carousel Slide Navigation Controls */}
      <button
        onClick={() => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
        className="carousel-arrow arrow-left"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
        className="carousel-arrow arrow-right"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide Indicators Dots */}
      <div className="carousel-dots">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrent(idx)}
            style={{
              width: current === idx ? '30px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: current === idx ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: current === idx ? '0 0 10px var(--gold-primary)' : 'none',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <style>{`
        .hero-carousel-container {
          position: relative;
          height: 85vh;
          min-height: 600px;
          max-height: 850px;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 3;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 60px 16px 40px;
        }

        .hero-main-title {
          font-size: clamp(1.85rem, 5vw, 4rem);
          line-height: 1.15;
          max-width: 920px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .hero-description {
          max-width: 650px;
          font-size: clamp(0.9rem, 1.6vw, 1.15rem);
          color: rgba(245, 245, 247, 0.85);
          margin-bottom: 28px;
          line-height: 1.6;
        }

        .hero-btn-group {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 520px;
        }

        .hero-btn-primary {
          padding: 14px 32px;
          font-size: 0.98rem;
          border-radius: 50px;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .hero-btn-secondary {
          padding: 13px 26px;
          font-size: 0.92rem;
          border-radius: 50px;
        }

        .hero-highlights {
          margin-top: 35px;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
          color: var(--gold-light);
          font-size: 0.82rem;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--gold-border);
          color: var(--gold-light);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
        }

        .arrow-left { left: 16px; }
        .arrow-right { right: 16px; }

        .carousel-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 4;
          display: flex;
          gap: 8px;
        }

        @media (max-width: 600px) {
          .hero-carousel-container {
            height: auto;
            min-height: 540px;
            padding: 50px 0 60px;
          }
          .hero-main-title {
            font-size: 1.8rem;
            margin-bottom: 12px;
          }
          .hero-description {
            font-size: 0.88rem;
            margin-bottom: 22px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .hero-btn-group {
            flex-direction: column;
            width: 100%;
          }
          .hero-btn-primary, .hero-btn-secondary {
            width: 100%;
            text-align: center;
          }
          .carousel-arrow {
            display: none; /* Swipe & dots for mobile */
          }
          .hero-highlights {
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin-top: 24px;
          }
        }
      `}</style>
    </div>
  );
}
