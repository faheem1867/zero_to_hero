const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Service = require('../models/Service');
const Barber = require('../models/Barber');
const Appointment = require('../models/Appointment');

const initialServices = [
  {
    name: 'Hair Cut',
    category: 'Hair Styling',
    description: 'Precision scissor and clipper cut tailored to your face structure, finished with styling tonic.',
    price: 250,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Trim',
    category: 'Hair & Beard',
    description: 'Quick cleanup and edge trimming for hair line or beard to maintain your crisp look.',
    price: 150,
    duration: 20,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Shave',
    category: 'Beard & Shave',
    description: 'Traditional hot towel straight-razor shave with soothing aftershave balm massage.',
    price: 120,
    duration: 20,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Facial',
    category: 'Skin Care',
    description: 'Deep pore cleansing, exfoliation, herbal massage, and gold glow skin mask.',
    price: 650,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'D-Tan',
    category: 'Skin Care',
    description: 'Instant tan removal treatment with active fruit peptides and cooling moisture lock.',
    price: 400,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1512290900672-1f486443bdc0?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Hair Spa',
    category: 'Hair Care',
    description: 'Intense keratin conditioning, hot steam therapy, and relaxing scalp acupressure.',
    price: 750,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
  {
    name: 'Colouring',
    category: 'Hair Styling',
    description: 'Premium ammonia-free root touch-up, global color, or custom highlights.',
    price: 850,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80',
    isActive: true,
  },
];

const initialBarbers = [
  {
    name: 'Faheem S.',
    title: 'Master Grooming Director',
    specialties: ['Hair Cut', 'Hair Spa', 'Colouring'],
    experience: '8+ Years',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    isActive: true,
  },
  {
    name: 'Vikram Sharma',
    title: 'Senior Hair & Beard Artist',
    specialties: ['Hair Cut', 'Trim', 'Shave'],
    experience: '6+ Years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    isActive: true,
  },
  {
    name: 'Arun Raj',
    title: 'Facial & Skin Therapy Specialist',
    specialties: ['Facial', 'D-Tan', 'Shave'],
    experience: '5+ Years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    isActive: true,
  },
  {
    name: 'Karan Mehra',
    title: 'Executive Stylist & Colorist',
    specialties: ['Colouring', 'Hair Cut', 'Hair Spa'],
    experience: '4+ Years',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/zero_to_hero_salon';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // 1. Seed or update Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@zerotohero.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        phone: '+919999999999',
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`[Seed] Admin created: ${adminEmail} (password: ${adminPassword})`);
    } else {
      admin.password = hashedPassword;
      await admin.save();
      console.log(`[Seed] Admin password verified for: ${adminEmail}`);
    }

    // 2. Seed Services
    for (const s of initialServices) {
      const exists = await Service.findOne({ name: s.name });
      if (!exists) {
        await Service.create(s);
        console.log(`[Seed] Service added: ${s.name} (₹${s.price})`);
      }
    }

    // 3. Seed Barbers
    for (const b of initialBarbers) {
      const exists = await Barber.findOne({ name: b.name });
      if (!exists) {
        await Barber.create(b);
        console.log(`[Seed] Barber added: ${b.name}`);
      }
    }

    // 4. Seed sample appointments if none exist
    const countAppt = await Appointment.countDocuments();
    if (countAppt === 0) {
      const today = new Date().toISOString().split('T')[0];
      const barbers = await Barber.find();
      const services = await Service.find();

      const sampleCustomer = await User.create({
        name: 'Rahul Verma',
        phone: '9876543210',
        role: 'customer',
      });

      await Appointment.create([
        {
          bookingId: 'Z2H-A89E1',
          customer: {
            userId: sampleCustomer._id,
            name: 'Rahul Verma',
            phone: '9876543210',
          },
          services: [
            {
              serviceId: services[0]._id,
              name: services[0].name,
              price: services[0].price,
              duration: services[0].duration,
            },
            {
              serviceId: services[2]._id,
              name: services[2].name,
              price: services[2].price,
              duration: services[2].duration,
            },
          ],
          barber: {
            barberId: barbers[0]._id,
            name: barbers[0].name,
          },
          date: today,
          timeSlot: '11:00 AM',
          totalDuration: 50,
          totalAmount: 370,
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          transactionId: 'UPI9872635411',
          status: 'Completed',
          notes: 'Customer requested low fade with hot towel finish.',
        },
        {
          bookingId: 'Z2H-C24B9',
          customer: {
            name: 'Suresh Kumar',
            phone: '9123456789',
          },
          services: [
            {
              serviceId: services[3]._id,
              name: services[3].name,
              price: services[3].price,
              duration: services[3].duration,
            },
          ],
          barber: {
            barberId: barbers[1]._id,
            name: barbers[1].name,
          },
          date: today,
          timeSlot: '02:30 PM',
          totalDuration: 45,
          totalAmount: 650,
          paymentMethod: 'Cash',
          paymentStatus: 'Pending',
          status: 'Scheduled',
          notes: 'First time visit for gold facial.',
        },
        {
          bookingId: 'Z2H-F71D3',
          customer: {
            name: 'Mohammed Tariq',
            phone: '9845123456',
          },
          services: [
            {
              serviceId: services[5]._id,
              name: services[5].name,
              price: services[5].price,
              duration: services[5].duration,
            },
          ],
          barber: {
            barberId: barbers[2]._id,
            name: barbers[2].name,
          },
          date: today,
          timeSlot: '04:00 PM',
          totalDuration: 50,
          totalAmount: 750,
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          transactionId: 'UPI7788992211',
          status: 'Scheduled',
          notes: 'Keratin hair spa booking.',
        },
      ]);
      console.log('[Seed] Sample appointments created for demo dashboard.');
    }

    console.log('[Seed] Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
