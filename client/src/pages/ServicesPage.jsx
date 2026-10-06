import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Clock, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) {
          setServices(data.services);
        }
      } catch (err) {
        console.error('Error fetching services', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const categories = ['All', 'Hair Styling', 'Hair & Beard', 'Beard & Shave', 'Skin Care', 'Hair Care'];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((s) => s.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(s.category.toLowerCase()));

  const toggleSelect = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((sId) => sId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleProceedToBook = () => {
    if (selectedServices.length > 0) {
      navigate(`/book?serviceIds=${selectedServices.join(',')}`);
    } else {
      navigate('/book');
    }
  };

  const totalPrice = services
    .filter((s) => selectedServices.includes(s._id))
    .reduce((sum, s) => sum + s.price, 0);

  const totalDuration = services
    .filter((s) => selectedServices.includes(s._id))
    .reduce((sum, s) => sum + s.duration, 0);

  return (
    <div style={{ padding: '60px 0 100px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge-gold" style={{ marginBottom: '12px' }}>
            <Sparkles size={14} /> EXCLUSIVE MENU
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', marginBottom: '16px' }}>
            SALON SERVICES & <span className="gold-text">PRICING</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
            Indulge in precision grooming, classic wet shaving, restorative botanical facials, and deep keratin treatments. Choose single services or create your custom package.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '40px',
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn-gold' : 'btn-dark'}
              style={{
                padding: '8px 20px',
                fontSize: '0.86rem',
                borderRadius: '50px',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sticky floating bottom selection bar if user selects services */}
        {selectedServices.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
            background: 'rgba(12, 12, 16, 0.95)',
            border: '2px solid var(--gold-primary)',
            borderRadius: '50px',
            padding: '12px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(212, 175, 55, 0.4)',
            backdropFilter: 'blur(16px)',
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>
                {selectedServices.length} Selected ({totalDuration} mins)
              </span>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>
                Total: <span className="gold-text">₹{totalPrice}</span>
              </div>
            </div>
            <button
              onClick={handleProceedToBook}
              className="btn-gold"
              style={{ padding: '10px 24px', borderRadius: '50px', fontSize: '0.9rem' }}
            >
              Proceed to Book <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}>
          {filteredServices.map((service) => {
            const isSelected = selectedServices.includes(service._id);
            return (
              <div
                key={service._id}
                className="glass-panel"
                style={{
                  border: isSelected ? '2px solid var(--gold-primary)' : '1px solid rgba(212, 175, 55, 0.25)',
                  boxShadow: isSelected ? '0 0 25px rgba(212, 175, 55, 0.3)' : 'none',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Image */}
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={service.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80'}
                    alt={service.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.7) contrast(1.1)',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid var(--gold-border)',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    color: 'var(--gold-light)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {service.category}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid var(--gold-border)',
                    padding: '4px 10px',
                    borderRadius: '50px',
                    fontSize: '0.78rem',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Clock size={12} color="var(--gold-primary)" /> {service.duration} mins
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>{service.name}</h3>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                      ₹{service.price}
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1, marginBottom: '22px' }}>
                    {service.description}
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => toggleSelect(service._id)}
                      style={{
                        flex: 1,
                        background: isSelected ? 'var(--gold-primary)' : 'transparent',
                        color: isSelected ? '#000' : 'var(--gold-light)',
                        border: '1px solid var(--gold-primary)',
                        padding: '11px 16px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isSelected ? <Check size={16} /> : null}
                      <span>{isSelected ? 'Selected' : 'Select'}</span>
                    </button>

                    <button
                      onClick={() => navigate(`/book?serviceId=${service._id}`)}
                      className="btn-gold"
                      style={{ padding: '11px 18px', fontSize: '0.86rem' }}
                      title="Direct Checkout"
                    >
                      <Scissors size={15} /> Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
