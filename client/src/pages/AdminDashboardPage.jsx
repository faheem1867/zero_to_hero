import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Scissors,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Search,
  Printer,
  BarChart2,
  FileText,
  MessageSquare,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin, token, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'today', 'appointments', 'barbers', 'services', 'sales'

  // Data states
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [salesReport, setSalesReport] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState('week'); // 'today', 'week', 'month', 'all'
  const [loading, setLoading] = useState(true);

  // Filters for appointments tab
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals for adding/editing
  const [showAddBarberModal, setShowAddBarberModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [barberForm, setBarberForm] = useState({
    name: '',
    title: 'Senior Barber',
    specialties: 'Hair Cut, Beard Trim',
    experience: '3+ Years',
    avatar: '',
    rating: 4.9,
  });

  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Hair Styling',
    description: '',
    price: 250,
    duration: 30,
    image: '',
  });

  // Cancel modal
  const [cancelApptId, setCancelApptId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  // Headers for API calls
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Fetch initial dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, apptsRes, barbsRes, servsRes, salesRes] = await Promise.all([
        fetch('/api/admin/dashboard-stats', { headers: authHeaders }),
        fetch('/api/admin/appointments', { headers: authHeaders }),
        fetch('/api/barbers?all=true'),
        fetch('/api/services?all=true'),
        fetch(`/api/admin/sales-report?period=${salesPeriod}`, { headers: authHeaders }),
      ]);

      const statsData = await statsRes.json();
      const apptsData = await apptsRes.json();
      const barbsData = await barbsRes.json();
      const servsData = await servsRes.json();
      const salesData = await salesRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (apptsData.success) setAppointments(apptsData.appointments);
      if (barbsData.success) setBarbers(barbsData.barbers);
      if (servsData.success) setServices(servsData.services);
      if (salesData.success) setSalesReport(salesData.report);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) {
      loadDashboardData();
    }
  }, [isAdmin, token]);

  // Refetch sales report when period changes
  useEffect(() => {
    if (!isAdmin || !token) return;
    const fetchSales = async () => {
      try {
        const res = await fetch(`/api/admin/sales-report?period=${salesPeriod}`, { headers: authHeaders });
        const data = await res.json();
        if (data.success) setSalesReport(data.report);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSales();
  }, [salesPeriod]);

  // Update appointment status
  const handleUpdateStatus = async (id, status, paymentStatus) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ status, paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Cancel appointment with reason
  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!cancelApptId) return;
    try {
      const res = await fetch(`/api/admin/appointments/${cancelApptId}/status`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          status: 'Cancelled',
          cancellationReason: cancelReason || 'Cancelled by Admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCancelApptId(null);
        setCancelReason('');
        loadDashboardData();
      }
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  // Barber Actions
  const handleSaveBarber = async (e) => {
    e.preventDefault();
    try {
      const url = editingBarber ? `/api/barbers/${editingBarber._id}` : '/api/barbers';
      const method = editingBarber ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(barberForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddBarberModal(false);
        setEditingBarber(null);
        loadDashboardData();
      }
    } catch (err) {
      alert('Error saving barber');
    }
  };

  const handleDeleteBarber = async (id) => {
    if (!window.confirm('Are you sure you want to delete this barber?')) return;
    try {
      const res = await fetch(`/api/barbers/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) loadDashboardData();
    } catch (err) {
      alert('Error deleting barber');
    }
  };

  // Service Actions
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const url = editingService ? `/api/services/${editingService._id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(serviceForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddServiceModal(false);
        setEditingService(null);
        loadDashboardData();
      }
    } catch (err) {
      alert('Error saving service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) loadDashboardData();
    } catch (err) {
      alert('Error deleting service');
    }
  };

  // Send WhatsApp Notification link helper
  const openWhatsAppAlert = (appt, type = 'confirm') => {
    const cleanPhone = (appt.customer?.phone || '').replace(/\D/g, '');
    const sNames = (appt.services || []).map((s) => s.name).join(', ');
    
    let text = '';
    if (type === 'confirm') {
      text = `💈 *ZERO TO HERO SALON - APPOINTMENT UPDATE* 💈\nHello ${appt.customer?.name},\nYour booking *${appt.bookingId}* with stylist *${appt.barber?.name}* for *${sNames}* on *${appt.date}* at *${appt.timeSlot}* is confirmed!\nTotal: ₹${appt.totalAmount} (${appt.paymentMethod} - ${appt.paymentStatus}). See you soon!`;
    } else {
      text = `💈 *ZERO TO HERO SALON - APPOINTMENT CANCELLED* 💈\nHello ${appt.customer?.name},\nYour booking *${appt.bookingId}* on *${appt.date}* has been cancelled.\nReason: ${appt.cancellationReason || 'Admin updated'}. Please contact us if you wish to reschedule.`;
    }

    const waUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
    const searchLow = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      appt.bookingId?.toLowerCase().includes(searchLow) ||
      appt.customer?.name?.toLowerCase().includes(searchLow) ||
      appt.customer?.phone?.includes(searchLow) ||
      appt.barber?.name?.toLowerCase().includes(searchLow);
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ padding: '40px 0 100px' }}>
      <div className="container">
        
        {/* Admin Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '30px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          paddingBottom: '20px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge-gold">
                <ShieldCheck size={16} /> ADMINISTRATOR
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginTop: '4px' }}>
              SALON CONTROL <span className="gold-text">DASHBOARD</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={loadDashboardData} className="btn-dark" title="Refresh Data">
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="btn-dark"
              style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '10px',
            marginBottom: '30px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: BarChart2 },
            { id: 'today', label: `Today's Bookings (${stats?.todayCount || 0})`, icon: Clock },
            { id: 'appointments', label: `All Appointments (${appointments.length})`, icon: Calendar },
            { id: 'barbers', label: `Barbers (${barbers.length})`, icon: Users },
            { id: 'services', label: `Services & Pricing (${services.length})`, icon: Scissors },
            { id: 'sales', label: 'Sales & Revenue Report', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? 'btn-gold' : 'btn-dark'}
                style={{
                  padding: '10px 18px',
                  fontSize: '0.86rem',
                  borderRadius: '50px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW & KPIS ================= */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '35px',
            }}>
              <div className="glass-panel" style={{ padding: '22px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Today's Bookings</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--gold-light)', fontWeight: 800 }}>
                  {stats?.todayCount || 0}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>Scheduled for {stats?.todayStr}</span>
              </div>

              <div className="glass-panel" style={{ padding: '22px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Today's Revenue</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#10b981', fontWeight: 800 }}>
                  ₹{stats?.todayRevenue || 0}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#34d399' }}>From completed slots today</span>
              </div>

              <div className="glass-panel" style={{ padding: '22px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Gross Total Revenue</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--gold-light)', fontWeight: 800 }}>
                  ₹{stats?.totalRevenue || 0}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>All-time completed revenue</span>
              </div>

              <div className="glass-panel" style={{ padding: '22px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Active Appointments</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#3b82f6', fontWeight: 800 }}>
                  {stats?.scheduledCount || 0}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Pending service execution</span>
              </div>
            </div>

            {/* Quick Glimpse Today */}
            <div className="glass-panel" style={{ padding: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>
                  Today's Scheduled Clients ({stats?.todayAppointments?.length || 0})
                </h3>
                <button onClick={() => setActiveTab('today')} className="btn-outline-gold" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                  Open Today Manager
                </button>
              </div>

              {stats?.todayAppointments?.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No bookings scheduled for today.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(stats?.todayAppointments || []).map((appt) => (
                    <div
                      key={appt._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '14px 18px',
                        borderRadius: 'var(--radius-sm)',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--gold-light)' }}>{appt.timeSlot}</strong> —{' '}
                        <span style={{ color: '#fff' }}>{appt.customer?.name}</span> ({appt.customer?.phone})
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Barber: <strong>{appt.barber?.name}</strong> • Services: {(appt.services || []).map(s => s.name).join(', ')}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#fff' }}>
                          ₹{appt.totalAmount}
                        </span>
                        <span className={appt.status === 'Completed' ? 'badge-green' : appt.status === 'Cancelled' ? 'badge-red' : 'badge-gold'}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: TODAY'S APPOINTMENTS ================= */}
        {activeTab === 'today' && (
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '18px' }}>
              Today's Queue ({stats?.todayAppointments?.length || 0})
            </h3>

            {(stats?.todayAppointments || []).length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No appointments scheduled for today.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(stats?.todayAppointments || []).map((appt) => (
                  <div
                    key={appt._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ color: 'var(--gold-light)', fontSize: '1.1rem' }}>{appt.timeSlot}</strong>
                        <span className="badge-gold">{appt.bookingId}</span>
                        <span className={appt.paymentStatus === 'Paid' ? 'badge-green' : 'badge-gold'}>
                          {appt.paymentMethod}: {appt.paymentStatus}
                        </span>
                      </div>
                      <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
                        {appt.customer?.name} — {appt.customer?.phone}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Barber: <strong>{appt.barber?.name}</strong> | {(appt.services || []).map(s => s.name).join(', ')} ({appt.totalDuration} mins)
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {appt.status === 'Scheduled' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appt._id, 'Completed', 'Paid')}
                            className="btn-gold"
                            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                          >
                            <CheckCircle size={14} /> Complete & Mark Paid
                          </button>
                          <button
                            onClick={() => setCancelApptId(appt._id)}
                            className="btn-dark"
                            style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#f87171' }}
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => openWhatsAppAlert(appt, 'confirm')}
                        className="btn-dark"
                        style={{ padding: '8px 12px', fontSize: '0.82rem', color: '#25D366' }}
                      >
                        <MessageSquare size={14} /> WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: ALL APPOINTMENTS ================= */}
        {activeTab === 'appointments' && (
          <div className="glass-panel" style={{ padding: '26px' }}>
            {/* Filters bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['all', 'Scheduled', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={statusFilter === st ? 'btn-gold' : 'btn-dark'}
                    style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '50px' }}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder="Search by client, ID, barber..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
                />
                <Search size={16} color="var(--gold-primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--gold-border)', textAlign: 'left', color: 'var(--gold-light)' }}>
                    <th style={{ padding: '12px 10px' }}>Booking ID</th>
                    <th style={{ padding: '12px 10px' }}>Client</th>
                    <th style={{ padding: '12px 10px' }}>Date & Slot</th>
                    <th style={{ padding: '12px 10px' }}>Stylist</th>
                    <th style={{ padding: '12px 10px' }}>Amount</th>
                    <th style={{ padding: '12px 10px' }}>Status</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt) => (
                    <tr key={appt._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', fontWeight: 700 }}>
                        {appt.bookingId}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ color: '#fff', fontWeight: 600 }}>{appt.customer?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{appt.customer?.phone}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div>{appt.date}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>{appt.timeSlot}</div>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#fff' }}>{appt.barber?.name}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <strong style={{ color: '#fff' }}>₹{appt.totalAmount}</strong>
                        <div style={{ fontSize: '0.74rem', color: appt.paymentStatus === 'Paid' ? '#10b981' : 'var(--warning)' }}>
                          {appt.paymentMethod} ({appt.paymentStatus})
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className={appt.status === 'Completed' ? 'badge-green' : appt.status === 'Cancelled' ? 'badge-red' : 'badge-gold'}>
                          {appt.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          {appt.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appt._id, 'Completed', 'Paid')}
                                className="btn-dark"
                                style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#10b981' }}
                                title="Mark Completed"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => setCancelApptId(appt._id)}
                                className="btn-dark"
                                style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#f87171' }}
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openWhatsAppAlert(appt, appt.status === 'Cancelled' ? 'cancel' : 'confirm')}
                            className="btn-dark"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#25D366' }}
                            title="WhatsApp"
                          >
                            WA
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: BARBER MANAGEMENT ================= */}
        {activeTab === 'barbers' && (
          <div className="glass-panel" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Salon Barbers & Stylists</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add, update, or remove styling personnel.</p>
              </div>

              <button
                onClick={() => {
                  setEditingBarber(null);
                  setBarberForm({
                    name: '',
                    title: 'Senior Barber',
                    specialties: 'Hair Cut, Beard Trim',
                    experience: '3+ Years',
                    avatar: '',
                    rating: 4.9,
                  });
                  setShowAddBarberModal(true);
                }}
                className="btn-gold"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add New Barber
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}>
              {barbers.map((b) => (
                <div
                  key={b._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={b.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                    alt={b.name}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      margin: '0 auto 10px',
                      border: '2px solid var(--gold-primary)',
                    }}
                  />
                  <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>{b.name}</h4>
                  <div style={{ color: 'var(--gold-light)', fontSize: '0.8rem', marginBottom: '6px' }}>{b.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '14px' }}>
                    Exp: {b.experience} • Rating: {b.rating}★
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        setEditingBarber(b);
                        setBarberForm({
                          name: b.name,
                          title: b.title,
                          specialties: Array.isArray(b.specialties) ? b.specialties.join(', ') : b.specialties,
                          experience: b.experience,
                          avatar: b.avatar || '',
                          rating: b.rating,
                        });
                        setShowAddBarberModal(true);
                      }}
                      className="btn-dark"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBarber(b._id)}
                      className="btn-dark"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#f87171' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: SERVICE MANAGEMENT ================= */}
        {activeTab === 'services' && (
          <div className="glass-panel" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Salon Services & Pricing</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Update service pricing, duration, and descriptions.</p>
              </div>

              <button
                onClick={() => {
                  setEditingService(null);
                  setServiceForm({
                    name: '',
                    category: 'Hair Styling',
                    description: '',
                    price: 250,
                    duration: 30,
                    image: '',
                  });
                  setShowAddServiceModal(true);
                }}
                className="btn-gold"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add New Service
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '18px',
            }}>
              {services.map((s) => (
                <div
                  key={s._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1.15rem' }}>{s.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>{s.category}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--gold-light)', fontWeight: 800 }}>
                        ₹{s.price}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '12px' }}>
                      {s.description || 'Premium salon grooming service.'}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      Duration: <strong>{s.duration} minutes</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <button
                      onClick={() => {
                        setEditingService(s);
                        setServiceForm({
                          name: s.name,
                          category: s.category,
                          description: s.description || '',
                          price: s.price,
                          duration: s.duration,
                          image: s.image || '',
                        });
                        setShowAddServiceModal(true);
                      }}
                      className="btn-dark"
                      style={{ flex: 1, padding: '6px', fontSize: '0.8rem' }}
                    >
                      <Edit size={14} /> Edit Price/Time
                    </button>
                    <button
                      onClick={() => handleDeleteService(s._id)}
                      className="btn-dark"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#f87171' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SALES & REVENUE REPORT ================= */}
        {activeTab === 'sales' && salesReport && (
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '26px' }}>
              <div>
                <span className="badge-gold">SALON FINANCIALS</span>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', marginTop: '4px' }}>
                  Sales & Performance <span className="gold-text">Report</span>
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {['today', 'week', 'month', 'all'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSalesPeriod(p)}
                    className={salesPeriod === p ? 'btn-gold' : 'btn-dark'}
                    style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '50px' }}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
                <button onClick={() => window.print()} className="btn-dark" style={{ padding: '6px 12px' }}>
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>

            {/* Sales Summary Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '30px',
            }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gross Realized Revenue</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#10b981', fontWeight: 800 }}>
                  ₹{salesReport.grossRevenue}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Bookings in Period</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>
                  {salesReport.totalBookings}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>UPI Payments Revenue</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--gold-light)', fontWeight: 800 }}>
                  ₹{salesReport.paymentBreakdown?.upi?.revenue || 0}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {salesReport.paymentBreakdown?.upi?.count || 0} UPI transactions
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cash Payments Revenue</span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#f59e0b', fontWeight: 800 }}>
                  ₹{salesReport.paymentBreakdown?.cash?.revenue || 0}
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {salesReport.paymentBreakdown?.cash?.count || 0} Cash counter sales
                </span>
              </div>
            </div>

            {/* Stylist Performance & Top Services Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Stylist Breakdown */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ color: 'var(--gold-light)', marginBottom: '14px', fontSize: '1.1rem' }}>
                  Stylist Performance
                </h4>
                {(salesReport.barberPerformance || []).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No completed appointments yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {salesReport.barberPerformance.map((bp) => (
                      <div key={bp.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <span style={{ color: '#fff' }}>{bp.name} ({bp.appointmentsCount} bookings)</span>
                        <strong style={{ color: 'var(--gold-light)' }}>₹{bp.revenue}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Services */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ color: 'var(--gold-light)', marginBottom: '14px', fontSize: '1.1rem' }}>
                  Top Services
                </h4>
                {(salesReport.topServices || []).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No completed services yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {salesReport.topServices.map((ts) => (
                      <div key={ts.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <span style={{ color: '#fff' }}>{ts.name} ({ts.count} times)</span>
                        <strong style={{ color: 'var(--gold-light)' }}>₹{ts.revenue}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add/Edit Barber */}
        {showAddBarberModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}>
            <div className="glass-panel" style={{ maxWidth: '460px', width: '100%', padding: '26px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '16px' }}>
                {editingBarber ? 'Edit Barber Details' : 'Add New Barber'}
              </h3>
              <form onSubmit={handleSaveBarber} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={barberForm.name}
                    onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Title</label>
                  <input
                    type="text"
                    required
                    value={barberForm.title}
                    onChange={(e) => setBarberForm({ ...barberForm, title: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Specialties (Comma-separated)</label>
                  <input
                    type="text"
                    value={barberForm.specialties}
                    onChange={(e) => setBarberForm({ ...barberForm, specialties: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Experience</label>
                  <input
                    type="text"
                    value={barberForm.experience}
                    onChange={(e) => setBarberForm({ ...barberForm, experience: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowAddBarberModal(false)} className="btn-dark">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold">
                    Save Barber
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add/Edit Service */}
        {showAddServiceModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}>
            <div className="glass-panel" style={{ maxWidth: '460px', width: '100%', padding: '26px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '16px' }}>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Service Name</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Category</label>
                  <input
                    type="text"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Duration (mins)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Description</label>
                  <textarea
                    rows={2}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowAddServiceModal(false)} className="btn-dark">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold">
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Admin Cancel Appointment with Reason */}
        {cancelApptId && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}>
            <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '26px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '10px' }}>Admin Cancel Appointment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                Enter the reason for cancellation:
              </p>
              <form onSubmit={handleConfirmCancel}>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Barber emergency, customer requested, etc."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="form-textarea"
                  style={{ marginBottom: '16px' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setCancelApptId(null)} className="btn-dark">
                    Back
                  </button>
                  <button type="submit" className="btn-gold" style={{ background: '#ef4444', color: '#fff' }}>
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
