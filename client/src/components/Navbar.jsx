import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Calendar, User, ShieldCheck, LogOut, Scissors } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 8, 10, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
        
        {/* Brand Logo & Title */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <img
            src="/logo_z2h.jpeg"
            alt="ZERO TO HERO SALON Logo"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--gold-primary)',
              boxShadow: '0 0 12px rgba(212, 175, 55, 0.35)',
            }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              lineHeight: 1.1,
            }}>
              <span className="gold-text">ZERO TO HERO</span>
            </div>
            <div style={{
              fontSize: '0.68rem',
              letterSpacing: '0.3em',
              color: 'var(--gold-light)',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              Luxury Saloon & Spa
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '26px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.92rem',
                fontWeight: isActive(link.path) ? 700 : 500,
                color: isActive(link.path) ? 'var(--gold-light)' : 'var(--text-main)',
                letterSpacing: '0.05em',
                transition: 'color var(--transition-fast)',
                borderBottom: isActive(link.path) ? '2px solid var(--gold-primary)' : '2px solid transparent',
                paddingBottom: '4px',
              }}
            >
              {link.name}
            </Link>
          ))}

          {/* Customer History / Dashboard Link */}
          {user && !isAdmin && (
            <Link
              to="/customer-dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                color: isActive('/customer-dashboard') ? 'var(--gold-light)' : 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
              }}
            >
              <Calendar size={16} color="var(--gold-primary)" />
              My Bookings
            </Link>
          )}

          {/* Admin Dashboard Link */}
          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="badge-gold"
              style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.85rem' }}
            >
              <ShieldCheck size={16} />
              Admin Portal
            </Link>
          ) : (
            <Link
              to="/admin/login"
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
              title="Admin Staff Access"
            >
              Staff Login
            </Link>
          )}

          {/* User profile / Logout if logged in */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                fontSize: '0.82rem',
                color: 'var(--gold-light)',
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
              }}>
                {user.name.split(' ')[0]}
              </div>
              <button
                onClick={logout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : null}

          {/* Book Now Button */}
          <Link to="/book" className="btn-gold" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
            <Scissors size={16} />
            Book Appointment
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu-btn" style={{ display: 'none' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--gold-border)',
              borderRadius: '6px',
              padding: '8px',
              color: 'var(--gold-light)',
              cursor: 'pointer',
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--gold-border)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem',
                color: isActive(link.path) ? 'var(--gold-light)' : '#fff',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {link.name}
            </Link>
          ))}
          {user && !isAdmin && (
            <Link
              to="/customer-dashboard"
              onClick={() => setIsOpen(false)}
              style={{ color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={18} /> My Bookings
            </Link>
          )}
          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="badge-gold"
              style={{ width: 'fit-content' }}
            >
              <ShieldCheck size={18} /> Admin Dashboard
            </Link>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}
            >
              Staff / Admin Portal
            </Link>
          )}
          {user && (
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="btn-dark"
              style={{ width: 'fit-content', gap: '6px' }}
            >
              <LogOut size={16} /> Log Out ({user.name})
            </button>
          )}
          <Link
            to="/book"
            onClick={() => setIsOpen(false)}
            className="btn-gold"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <Scissors size={18} /> Book Appointment
          </Link>
        </div>
      )}

      {/* Responsive CSS styling */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
