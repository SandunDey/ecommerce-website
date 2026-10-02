const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/admin/stats - Overview metrics
router.get('/stats', authenticate, requireAdmin, (req, res) => {
  try {
    const products = db.getProducts();
    const orders = db.getOrders();
    const users = db.getUsers();

    // Financial calculations
    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;

    // Inventory status
    const lowStockThreshold = 15;
    const lowStockProducts = products.filter(p => p.stock <= lowStockThreshold);

    // Category breakdown
    const categoryStats = {};
    products.forEach(p => {
      categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
    });

    return res.json({
      success: true,
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        totalProducts: products.length,
        totalCustomers: users.filter(u => u.role === 'customer').length,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts: lowStockProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        stock: p.stock,
        price: p.price,
        image: p.image
      })),
      recentOrders: orders.slice(0, 5)
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute admin statistics.' });
  }
});

module.exports = router;
