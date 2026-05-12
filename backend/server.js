// ============================================
// ✅ FIX: Force DNS to use Google's servers
// ============================================
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

// ============================================
// REST OF YOUR SERVER CODE
// ============================================
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

console.log('📁 Environment variables check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ NOT LOADED');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ NOT LOADED');

const app = express();
app.use(express.json());
app.use(cors());

// ============================================
// HEALTH CHECK ROUTES
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to LearnHub API' });
});

// ============================================
// MONGODB CONNECTION
// ============================================

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// ============================================
// IMPORT ROUTES
// ============================================

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

// ============================================
// MOUNT ROUTES (Connect URLs to their handlers)
// ============================================

// Auth routes - for user registration and login
// Example: POST /api/auth/register
app.use('/api/auth', authRoutes);

// Course routes - for browsing, creating, and managing courses
// Example: GET /api/courses
app.use('/api/courses', courseRoutes);

// Enrollment routes - for students enrolling in courses
// Example: POST /api/enroll
app.use('/api/enroll', enrollmentRoutes);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`📚 Courses API: http://localhost:${PORT}/api/courses`);
    console.log(`📝 Enrollment API: http://localhost:${PORT}/api/enroll`);
  });
};

startServer();