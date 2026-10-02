require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Initialize database
require('./data/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Auspify E-Commerce Platform',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for SPA-style client routing (compatible with Express 4 and 5)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Auspify E-Commerce Server is running on:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log('----------------------------------------------------');
  console.log('🔑 Demo Credentials:');
  console.log('   Admin:    admin@auspify.com  / admin123');
  console.log('   Customer: demo@example.com   / user123');
  console.log('====================================================');
});
