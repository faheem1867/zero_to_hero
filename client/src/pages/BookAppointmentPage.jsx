import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UpiPaymentModal from '../components/UpiPaymentModal';
import WhatsAppNotificationModal from '../components/WhatsAppNotificationModal';
import {
  Scissors,
  User,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Star,
  ShieldCheck,
} from 'lucide-react';

export default function BookAppointmentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loginCustomer } = useAuth();

  // Wizard Steps: 1: Customer Details (Auto-login), 2: Services, 3: Barber, 4: Date & Slot, 5: Payment
  const [currentStep, setCurrentStep] = useState(user ? 2 : 1);

  // Customer form
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Booking Data
  const [servicesList, setServicesList] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [barbersList, setBarbersList] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState('any');

  // Today's date YYYY-MM-DD
  const getTodayDateStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Payment & Modal states
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' or 'Cash'
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Services & Barbers on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servRes, barbRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/barbers'),
        ]);
        const servData = await servRes.json();
        const barbData = await barbRes.json();

        if (servData.success) {
          setServicesList(servData.services);
          // Check query params for pre-selected service
          const preServiceId = searchParams.get('serviceId');
          const preServiceIds = searchParams.get('serviceIds');
          if (preServiceIds) {
            setSelectedServiceIds(preServiceIds.split(','));
          } else if (preServiceId) {
            setSelectedServiceIds([preServiceId]);
          } else if (servData.services.length > 0) {
            setSelectedServiceIds([servData.services[0]._id]);
          }
        }

        if (barbData.success) {
          setBarbersList(barbData.barbers);
          const preBarberId = searchParams.get('barberId');
          if (preBarberId) {
            setSelectedBarberId(preBarberId);
          }
        }
      } catch (err) {
        console.error('Failed to load services or barbers', err);
      }
    };
    fetchInitialData();
  }, [searchParams]);

  // Sync if user logged in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Calculate totals
  const selectedServices = servicesList.filter((s) => selectedServiceIds.includes(s._id));
  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0) || 30;

  // Fetch dynamic slot availability when date, barber, or totalDuration changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const url = `/api/appointments/availability?date=${selectedDate}&barberId=${selectedBarberId}&duration=${totalDuration}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setAvailableSlots(data.slots);
          // Auto select first available slot if current not available
          const isCurrentAvailable = data.slots.some((s) => s.time === selectedSlot && s.available);
          if (!isCurrentAvailable) {
            const firstAvail = data.slots.find((s) => s.available);
            if (firstAvail) setSelectedSlot(firstAvail.time);
          }
        }
      } catch (err) {
        console.error('Failed to fetch availability', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedBarberId, totalDuration]);

  // Step 1: Customer fast auto-login / account creation handler
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!customerPhone || customerPhone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!customerName || !customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    try {
      await loginCustomer(customerName.trim(), customerPhone.trim());
      setCurrentStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'Error creating customer account');
    }
  };

  // Toggle service selection
  const toggleService = (id) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter((sId) => sId !== id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Submit appointment to backend
  const executeBooking = async (paymentDetails = {}) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        serviceIds: selectedServiceIds,
        barberId: selectedBarberId,
        date: selectedDate,
        timeSlot: selectedSlot,
        paymentMethod: paymentDetails.paymentMethod || paymentMethod,
        transactionId: paymentDetails.transactionId || '',
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Booking submission failed');
      }

      setConfirmedAppointment(data.appointment);
      setShowUpiModal(false);
    } catch (err) {
      setErrorMessage(err.message || 'Error confirming appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle final checkout click
  const handleProceedToPayment = () => {
    if (paymentMethod === 'UPI') {
      setShowUpiModal(true);
    } else {
      // Cash payment confirmed directly
      executeBooking({ paymentMethod: 'Cash', paymentStatus: 'Pending' });
    }
  };

  return (
    <div style={{ padding: '40px 0 100px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Progress Step Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <span className="badge-gold" style={{ marginBottom: '8px' }}>
            <Sparkles size={14} /> VIP APPOINTMENT CONCIERGE
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>
            BOOK YOUR <span className="gold-text">TRANSFORMATION</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px' }}>
            Seamless 5-step instant reservation with live barber slot sync
          </p>

          {/* Responsive Stepper Indicator */}
          {/* Desktop Stepper */}
          <div className="stepper-desktop" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '24px',
            flexWrap: 'wrap',
          }}>
            {[
              { num: 1, label: 'Identity' },
              { num: 2, label: 'Services' },
              { num: 3, label: 'Stylist' },
              { num: 4, label: 'Slot' },
              { num: 5, label: 'Payment' },
            ].map((st) => (
              <div
                key={st.num}
                onClick={() => {
                  if (st.num < currentStep || (st.num === 1 && user)) setCurrentStep(st.num);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: currentStep === st.num
                    ? 'var(--gold-gradient)'
                    : currentStep > st.num
                    ? 'rgba(212, 175, 55, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: currentStep === st.num ? '#000' : currentStep > st.num ? 'var(--gold-light)' : '#888',
                  padding: '6px 14px',
                  borderRadius: '50px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: st.num <= currentStep ? 'pointer' : 'default',
                  border: currentStep === st.num ? '1px solid #fff' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <span>{st.num}.</span>
                <span>{st.label}</span>
              </div>
            ))}
          </div>

          {/* Mobile Stepper Bar */}
          <div className="stepper-mobile" style={{ display: 'none', marginTop: '18px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '0.85rem',
            }}>
              <span style={{ color: 'var(--gold-light)', fontWeight: 700 }}>
                Step {currentStep} of 5:
              </span>
              <span style={{ color: '#fff', fontWeight: 600 }}>
                {['Your Details', 'Select Services', 'Choose Stylist', 'Pick Date & Slot', 'Review & Pay'][currentStep - 1]}
              </span>
            </div>
            {/* Progress track */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${(currentStep / 5) * 100}%`,
                height: '100%',
                background: 'var(--gold-gradient)',
                borderRadius: '3px',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            fontSize: '0.88rem',
            textAlign: 'center',
          }}>
            {errorMessage}
          </div>
        )}

        {/* ================= STEP 1: CUSTOMER IDENTITY (AUTO SIGNUP/LOGIN) ================= */}
        {currentStep === 1 && (
          <div className="glass-panel" style={{ padding: '36px', maxWidth: '520px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <User size={26} color="var(--gold-primary)" />
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Step 1: Your Details</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                Enter your name & mobile number. Your account is automatically created with zero passwords needed.
              </p>
            </div>

            <form onSubmit={handleCustomerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Your Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                  <User size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  10-Digit Mobile Number (For WhatsApp / SMS Confirmation)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                  <Phone size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                <span>Continue to Select Services</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: SELECT SERVICES ================= */}
        {currentStep === 2 && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="badge-gold">Step 2 of 5</span>
                <h2 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '4px' }}>Choose Services</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Select one or multiple grooming therapies.</p>
              </div>

              {/* Running Total Indicator */}
              <div style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid var(--gold-border)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'right',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Total:</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--gold-light)' }}>
                  ₹{totalAmount} <span style={{ fontSize: '0.8rem', color: '#fff' }}>({totalDuration} mins)</span>
                </strong>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '30px',
            }}>
              {servicesList.map((service) => {
                const isSelected = selectedServiceIds.includes(service._id);
                return (
                  <div
                    key={service._id}
                    onClick={() => toggleService(service._id)}
                    style={{
                      background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(20, 20, 26, 0.6)',
                      border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <h4 style={{ color: isSelected ? 'var(--gold-light)' : '#fff', fontSize: '1.1rem' }}>
                          {service.name}
                        </h4>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? 'none' : '1px solid #666',
                          background: isSelected ? 'var(--gold-primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {isSelected && <CheckCircle size={14} color="#000" />}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.4, marginBottom: '12px' }}>
                        {service.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {service.duration} mins
                      </span>
                      <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold-light)' }}>
                        ₹{service.price}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(1)} className="btn-dark">
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={selectedServiceIds.length === 0}
                className="btn-gold"
                style={{ opacity: selectedServiceIds.length === 0 ? 0.5 : 1 }}
              >
                <span>Continue to Select Stylist</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: SELECT BARBER ================= */}
        {currentStep === 3 && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span className="badge-gold">Step 3 of 5</span>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '4px' }}>Choose Your Stylist</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                Select a specific master barber or pick "Any Available Stylist" for optimal slot speed.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '30px',
            }}>
              {/* Option: Any Available Stylist */}
              <div
                onClick={() => setSelectedBarberId('any')}
                style={{
                  background: selectedBarberId === 'any' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(20, 20, 26, 0.6)',
                  border: selectedBarberId === 'any' ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  border: '1px solid var(--gold-primary)',
                }}>
                  <Scissors size={28} color="var(--gold-primary)" />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>Any Available Stylist</h4>
                <p style={{ color: 'var(--gold-light)', fontSize: '0.78rem' }}>Fastest slot availability</p>
              </div>

              {/* Specific Barbers */}
              {barbersList.map((barber) => {
                const isSelected = selectedBarberId === barber._id;
                return (
                  <div
                    key={barber._id}
                    onClick={() => setSelectedBarberId(barber._id)}
                    style={{
                      background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(20, 20, 26, 0.6)',
                      border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img
                      src={barber.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                      alt={barber.name}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        margin: '0 auto 10px',
                        border: '2px solid var(--gold-primary)',
                      }}
                    />
                    <h4 style={{ color: isSelected ? 'var(--gold-light)' : '#fff', fontSize: '1.05rem', marginBottom: '2px' }}>
                      {barber.name}
                    </h4>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {barber.title}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--gold-light)' }}>
                      <Star size={12} fill="#d4af37" color="#d4af37" />
                      <span>{barber.rating} ({barber.experience})</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(2)} className="btn-dark">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => setCurrentStep(4)} className="btn-gold">
                <span>Continue to Select Date & Slot</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SELECT DATE & TIME SLOT ================= */}
        {currentStep === 4 && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span className="badge-gold">Step 4 of 5</span>
              <h2 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '4px' }}>Date & Available Slot</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                Slots are calculated in real time based on your total service duration ({totalDuration} mins).
              </p>
            </div>

            {/* Date Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Select Appointment Date
              </label>
              <input
                type="date"
                min={getTodayDateStr()}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input"
                style={{ maxWidth: '280px', colorScheme: 'dark' }}
              />
            </div>

            {/* Slots Grid */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Available Time Slots for {selectedDate}:
              </label>

              {loadingSlots ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gold-light)' }}>
                  Calculating live barber availability...
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '10px',
                }}>
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        style={{
                          background: !slot.available
                            ? 'rgba(255, 255, 255, 0.03)'
                            : isSelected
                            ? 'var(--gold-gradient)'
                            : 'rgba(20, 20, 26, 0.8)',
                          color: !slot.available ? '#555' : isSelected ? '#000' : '#fff',
                          border: isSelected
                            ? '1px solid #fff'
                            : !slot.available
                            ? '1px solid rgba(255, 255, 255, 0.05)'
                            : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 6px',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: slot.available ? 'pointer' : 'not-allowed',
                          textDecoration: !slot.available ? 'line-through' : 'none',
                          transition: 'all 0.15s',
                        }}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(3)} className="btn-dark">
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                disabled={!selectedSlot}
                className="btn-gold"
                style={{ opacity: !selectedSlot ? 0.5 : 1 }}
              >
                <span>Continue to Payment & Review</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: REVIEW & PAYMENT METHOD ================= */}
        {currentStep === 5 && (
          <div className="glass-panel" style={{ padding: '36px', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '26px' }}>
              <span className="badge-gold">Step 5 of 5</span>
              <h2 style={{ fontSize: '1.7rem', color: '#fff', marginTop: '6px' }}>
                Review & Confirm <span className="gold-text">Appointment</span>
              </h2>
            </div>

            {/* Summary Ticket */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--gold-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              marginBottom: '26px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Guest</span>
                  <strong style={{ color: '#fff' }}>{customerName}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Mobile</span>
                  <strong style={{ color: '#fff' }}>{customerPhone}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Date & Slot</span>
                  <strong style={{ color: 'var(--gold-light)' }}>{selectedDate} at {selectedSlot}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Stylist</span>
                  <strong style={{ color: '#fff' }}>
                    {selectedBarberId === 'any' ? 'Any Available Stylist' : barbersList.find((b) => b._id === selectedBarberId)?.name}
                  </strong>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Selected Services</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedServices.map((s) => (
                    <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: '#ddd' }}>{s.name} ({s.duration}m)</span>
                      <strong style={{ color: '#fff' }}>₹{s.price}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--gold-border)', paddingTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Payable</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>Includes Salon VIP Amenities</div>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                  ₹{totalAmount}
                </div>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--gold-light)', marginBottom: '12px', fontWeight: 600 }}>
                Select Payment Mode:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    background: paymentMethod === 'UPI' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(20, 20, 26, 0.6)',
                    border: paymentMethod === 'UPI' ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <QrCode size={28} color="var(--gold-primary)" style={{ margin: '0 auto 8px' }} />
                  <strong style={{ display: 'block', color: '#fff', fontSize: '0.95rem' }}>UPI QR & Deep Link</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPay / PhonePe / Paytm</span>
                </div>

                {/* Cash Option */}
                <div
                  onClick={() => setPaymentMethod('Cash')}
                  style={{
                    background: paymentMethod === 'Cash' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(20, 20, 26, 0.6)',
                    border: paymentMethod === 'Cash' ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <Banknote size={28} color="var(--gold-primary)" style={{ margin: '0 auto 8px' }} />
                  <strong style={{ display: 'block', color: '#fff', fontSize: '0.95rem' }}>Cash at Salon</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay at Counter</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <button onClick={() => setCurrentStep(4)} className="btn-dark" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleProceedToPayment}
                disabled={isSubmitting}
                className="btn-gold"
                style={{ flex: 2, padding: '14px', fontSize: '0.95rem' }}
              >
                <span>{paymentMethod === 'UPI' ? 'Proceed to UPI Pay (QR / App)' : 'Confirm Booking with Cash'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* UPI Payment Modal */}
        {showUpiModal && (
          <UpiPaymentModal
            amount={totalAmount}
            bookingId="PENDING-CONFIRM"
            customerName={customerName}
            onPaymentSuccess={(details) => executeBooking(details)}
            onSwitchToCash={() => {
              setShowUpiModal(false);
              setPaymentMethod('Cash');
              executeBooking({ paymentMethod: 'Cash', paymentStatus: 'Pending' });
            }}
            onClose={() => setShowUpiModal(false)}
          />
        )}

        {/* WhatsApp & SMS Confirmation Modal */}
        {confirmedAppointment && (
          <WhatsAppNotificationModal
            appointment={confirmedAppointment}
            onClose={() => {
              setConfirmedAppointment(null);
              navigate('/customer-dashboard');
            }}
          />
        )}

        {/* Mobile Media Queries */}
        <style>{`
          @media (max-width: 650px) {
            .stepper-desktop {
              display: none !important;
            }
            .stepper-mobile {
              display: block !important;
            }
          }
        `}</style>

      </div>
    </div>
  );
}
