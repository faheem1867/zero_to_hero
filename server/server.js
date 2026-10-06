const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const barberRoutes = require('./routes/barberRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend dev server and network access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (supports both /api/* and direct /* for flexible Vercel service rewrites)
const routes = [
  ['/auth', authRoutes],
  ['/services', serviceRoutes],
  ['/barbers', barberRoutes],
  ['/appointments', appointmentRoutes],
  ['/admin', adminRoutes],
];

routes.forEach(([path, handler]) => {
  app.use(`/api${path}`, handler);
  app.use(path, handler);
});

// Health check
const healthCheck = (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'ZERO TO HERO SALON API',
  });
};

app.get('/api/health', healthCheck);
app.get('/health', healthCheck);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Zero To Hero Server] Running on http://localhost:${PORT}`);
  });
}

module.exports = app;
