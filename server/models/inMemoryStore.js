const bcrypt = require('bcryptjs');

// Default initial state
const defaultServices = [
  {
    _id: 'srv_1',
    name: 'Hair Cut',
    category: 'Hair Styling',
    description: 'Precision scissor and clipper cut tailored to your face structure, finished with styling tonic.',
    price: 250,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'srv_2',
    name: 'Trim',
    category: 'Hair & Beard',
    description: 'Quick cleanup and edge trimming for hair line or beard to maintain your crisp look.',
    price: 150,
    duration: 20,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'srv_3',
    name: 'Shave',
    category: 'Beard & Shave',
    description: 'Traditional hot towel straight-razor shave with soothing aftershave balm massage.',
    price: 120,
    duration: 20,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'srv_4',
    name: 'Facial',
    category: 'Skin Care',
    description: 'Deep pore cleansing, exfoliation, herbal massage, and gold glow skin mask.',
    price: 650,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'srv_5',
    name: 'D-Tan',
    category: 'Skin Care',
    description: 'Instant tan removal treatment with active fruit peptides and cooling moisture lock.',
    price: 400,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1512290900672-1f486443bdc0?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'srv_6',
    name: 'Hair Spa',
    category: 'Hair Care',
    description: 'Intense keratin conditioning, hot steam therapy, and relaxing scalp acupressure.',
    price: 750,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    _id: 'srv_7',
    name: 'Colouring',
    category: 'Hair Styling',
    description: 'Premium ammonia-free root touch-up, global color, or custom highlights.',
    price: 850,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
];

const defaultBarbers = [
  {
    _id: 'barb_1',
    name: 'Faheem S.',
    title: 'Master Grooming Director',
    specialties: ['Hair Cut', 'Hair Spa', 'Colouring'],
    experience: '8+ Years',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    isActive: true,
  },
  {
    _id: 'barb_2',
    name: 'Vikram Sharma',
    title: 'Senior Hair & Beard Artist',
    specialties: ['Hair Cut', 'Trim', 'Shave'],
    experience: '6+ Years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    isActive: true,
  },
  {
    _id: 'barb_3',
    name: 'Arun Raj',
    title: 'Facial & Skin Therapy Specialist',
    specialties: ['Facial', 'D-Tan', 'Shave'],
    experience: '5+ Years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    isActive: true,
  },
  {
    _id: 'barb_4',
    name: 'Karan Mehra',
    title: 'Executive Stylist & Colorist',
    specialties: ['Colouring', 'Hair Cut', 'Hair Spa'],
    experience: '4+ Years',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    isActive: true,
  },
];

const hashedAdminPw = bcrypt.hashSync('admin123', 10);

const defaultUsers = [
  {
    _id: 'usr_admin',
    name: 'Super Admin',
    email: 'admin@zerotohero.com',
    phone: '+919999999999',
    password: hashedAdminPw,
    role: 'admin',
  },
];

const todayDate = new Date().toISOString().split('T')[0];

const defaultAppointments = [
  {
    _id: 'appt_1',
    bookingId: 'Z2H-A89E1',
    customer: {
      userId: 'usr_1',
      name: 'Rahul Verma',
      phone: '9876543210',
    },
    services: [
      { serviceId: 'srv_1', name: 'Hair Cut', price: 250, duration: 30 },
      { serviceId: 'srv_3', name: 'Shave', price: 120, duration: 20 },
    ],
    barber: { barberId: 'barb_1', name: 'Faheem S.' },
    date: todayDate,
    timeSlot: '11:00 AM',
    totalDuration: 50,
    totalAmount: 370,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    transactionId: 'UPI9872635411',
    status: 'Completed',
    notes: 'Customer requested low fade with hot towel finish.',
    createdAt: new Date(),
  },
  {
    _id: 'appt_2',
    bookingId: 'Z2H-C24B9',
    customer: {
      name: 'Suresh Kumar',
      phone: '9123456789',
    },
    services: [
      { serviceId: 'srv_4', name: 'Facial', price: 650, duration: 45 },
    ],
    barber: { barberId: 'barb_2', name: 'Vikram Sharma' },
    date: todayDate,
    timeSlot: '02:30 PM',
    totalDuration: 45,
    totalAmount: 650,
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    status: 'Scheduled',
    notes: 'First time visit for gold facial.',
    createdAt: new Date(),
  },
  {
    _id: 'appt_3',
    bookingId: 'Z2H-F71D3',
    customer: {
      name: 'Mohammed Tariq',
      phone: '9845123456',
    },
    services: [
      { serviceId: 'srv_6', name: 'Hair Spa', price: 750, duration: 50 },
    ],
    barber: { barberId: 'barb_3', name: 'Arun Raj' },
    date: todayDate,
    timeSlot: '04:00 PM',
    totalDuration: 50,
    totalAmount: 750,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    transactionId: 'UPI7788992211',
    status: 'Scheduled',
    notes: 'Keratin hair spa booking.',
    createdAt: new Date(),
  },
];

// In-Memory Database store instance
const memoryStore = {
  users: [...defaultUsers],
  services: [...defaultServices],
  barbers: [...defaultBarbers],
  appointments: [...defaultAppointments],
};

module.exports = memoryStore;
