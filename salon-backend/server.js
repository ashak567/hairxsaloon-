require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const setupSocketHandlers = require('./socket/handlers');

const app = express();
const server = http.createServer(app);

// ─── CORS ──────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001', // Next.js fallback port
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// ─── MIDDLEWARE ────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// ─── Socket.io injection ──────────────────────────
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// ─── DATABASE ─────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hair_x_studio';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB:', MONGO_URI.split('@').pop()))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit process if DB can't connect — avoids silent failures
  });

// ─── ROUTES ──────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Hair X Studio API is running', timestamp: new Date() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/services', require('./routes/services'));
app.use('/api/stylists', require('./routes/stylists'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/queue', require('./routes/queue'));
app.use('/api/invoices', require('./routes/invoices'));

// ─── SOCKET.IO ────────────────────────────────────
setupSocketHandlers(io);

// ─── 404 & ERROR HANDLERS ────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Express 4 global error handler (4 args)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── START ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
