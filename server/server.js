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

// Static frontend assets resolution (prevents Cannot GET / on all deployment types)
const path = require('path');
const fs = require('fs');

const possibleStaticDirs = [
  path.join(__dirname, 'public'),
  path.join(__dirname, '../server/public'),
  path.join(__dirname, '../client/dist'),
  path.join(process.cwd(), 'server/public'),
  path.join(process.cwd(), 'client/dist'),
  path.join(process.cwd(), 'public'),
];

let staticDir = null;
for (const dir of possibleStaticDirs) {
  if (fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.html'))) {
    staticDir = dir;
    break;
  }
}

if (staticDir) {
  console.log(`[Zero To Hero] Serving frontend assets from: ${staticDir}`);
  app.use(express.static(staticDir));
}

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

// Root path handler
app.get('/', (req, res) => {
  if (staticDir && fs.existsSync(path.join(staticDir, 'index.html'))) {
    return res.sendFile(path.join(staticDir, 'index.html'));
  }

  // Standalone API portal fallback
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZERO TO HERO SALON - API Service</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #08080a;
      color: #f5f5f7;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #111115;
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 20px;
      padding: 40px 32px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.12);
      color: #4ade80;
      border: 1px solid rgba(74, 222, 128, 0.25);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 10px #4ade80;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: #d4af37;
      letter-spacing: 2px;
      margin-bottom: 6px;
    }
    .tagline {
      color: #a1a1aa;
      font-size: 0.95rem;
      margin-bottom: 24px;
    }
    .endpoints {
      display: grid;
      gap: 10px;
      margin-bottom: 24px;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      transition: all 0.2s ease;
    }
    .btn-gold {
      background: linear-gradient(135deg, #d4af37, #f3e5ab);
      color: #08080a;
    }
    .btn-outline {
      background: rgba(255, 255, 255, 0.03);
      color: #d4af37;
      border: 1px solid rgba(212, 175, 55, 0.25);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> API SERVICE OPERATIONAL</div>
    <h1>ZERO TO HERO</h1>
    <p class="tagline">Luxury Barber & Grooming Engine</p>
    <div class="endpoints">
      <a href="/api/health" class="btn btn-gold"><span>Check API Health</span><span>→</span></a>
      <a href="/api/services" class="btn btn-outline"><span>Services Catalog</span><span>GET</span></a>
      <a href="/api/barbers" class="btn btn-outline"><span>Master Barbers</span><span>GET</span></a>
    </div>
  </div>
</body>
</html>`);
});

// SPA Catchall: Serves index.html for client-side routing on any non-API path
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path === '/api') {
    return res.status(404).json({
      error: 'API endpoint not found',
      method: req.method,
      path: req.path,
    });
  }

  if (staticDir && fs.existsSync(path.join(staticDir, 'index.html'))) {
    return res.sendFile(path.join(staticDir, 'index.html'));
  }

  res.redirect('/');
});

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
