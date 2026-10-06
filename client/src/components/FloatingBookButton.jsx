import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors } from 'lucide-react';

export default function FloatingBookButton() {
  const location = useLocation();

  // Hide on booking page itself or admin pages to avoid redundancy
  if (location.pathname === '/book' || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div className="floating-book-wrapper">
        <Link
          to="/book"
          className="floating-pulse floating-book-btn"
        >
          <Scissors size={20} strokeWidth={2.5} />
          <span>BOOK APPOINTMENT</span>
        </Link>
      </div>

      <style>{`
        .floating-book-wrapper {
          position: fixed;
          bottom: calc(24px + env(safe-area-inset-bottom, 0px));
          right: 24px;
          zIndex: 999;
        }

        .floating-book-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--gold-gradient);
          color: #000;
          padding: 15px 26px;
          borderRadius: 50px;
          font-family: var(--font-serif);
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          text-decoration: none;
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5), 0 0 10px rgba(255, 255, 255, 0.4);
          border: 2px solid #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @media (max-width: 600px) {
          .floating-book-wrapper {
            bottom: calc(16px + env(safe-area-inset-bottom, 0px));
            right: 14px;
          }
          .floating-book-btn {
            padding: 11px 18px;
            font-size: 0.82rem;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
}
