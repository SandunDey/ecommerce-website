const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

// POST /api/orders - Place a new order
router.post('/', optionalAuth, (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      phone,
      shippingAddress,
      paymentMethod = 'Credit Card',
      items = [],
      couponCode = ''
    } = req.body;

    if (!customerName || !customerEmail || !shippingAddress || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, shipping address, and at least one item are required.'
      });
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address (street, city, country) is required.'
      });
    }

    // Validate inventory and prepare purchased items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = db.findProductById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product "${item.name || item.productId}" not found.` });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${qty}.`
        });
      }

      // Decrement stock in real-time
      product.stock -= qty;
      const itemTotal = Number((product.price * qty).toFixed(2));
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
        itemTotal
      });
    }

    subtotal = Number(subtotal.toFixed(2));

    // Calculate discounts
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = db.getCoupon(couponCode);
      if (coupon && (!coupon.minOrder || subtotal >= coupon.minOrder)) {
        appliedCoupon = coupon;
        if (coupon.discountPercent) {
          discount = Number(((subtotal * coupon.discountPercent) / 100).toFixed(2));
        } else if (coupon.discountAmount) {
          discount = Math.min(subtotal, coupon.discountAmount);
        }
      }
    }

    let shippingFee = 9.99;
    if (subtotal >= 150 || (appliedCoupon && appliedCoupon.freeShipping)) {
      shippingFee = 0;
    }

    const estimatedTax = Number(((subtotal - discount) * 0.05).toFixed(2));
    const grandTotal = Number((subtotal - discount + shippingFee + estimatedTax).toFixed(2));

    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = 'TRK-' + (paymentMethod === 'Cash on Delivery' ? 'COD' : 'EXP') + '-' + Math.floor(1000000 + Math.random() * 9000000);

    const newOrder = {
      id: 'ord_' + Date.now(),
      orderNumber,
      userId: req.user ? req.user.id : 'guest_' + Date.now(),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      shippingAddress: {
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state ? shippingAddress.state.trim() : '',
        zip: shippingAddress.zip ? shippingAddress.zip.trim() : '',
        country: shippingAddress.country.trim()
      },
      items: orderItems,
      subtotal,
      discount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      shippingFee,
      tax: estimatedTax,
      total: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Processing',
      trackingNumber,
      createdAt: new Date().toISOString()
    };

    db.addOrder(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
});

// GET /api/orders/my-orders - Logged in customer orders
router.get('/my-orders', authenticate, (req, res) => {
  const orders = db.findOrdersByUserId(req.user.id);
  res.json({
    success: true,
    count: orders.length,
    orders
  });
});

// GET /api/orders/track/:identifier - Lookup order by Order # or Tracking #
router.get('/track/:identifier', (req, res) => {
  const q = req.params.identifier.trim();
  const all = db.getOrders();
  const order = all.find(o => o.orderNumber.toLowerCase() === q.toLowerCase() || (o.trackingNumber && o.trackingNumber.toLowerCase() === q.toLowerCase()));
  if (!order) {
    return res.status(404).json({ success: false, message: 'No order found with the provided identifier.' });
  }
  return res.json({ success: true, order });
});

// GET /api/orders/:id - Single order details
router.get('/:id', optionalAuth, (req, res) => {
  const order = db.findOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Security check: if not admin, ensure order belongs to user
  if (req.user && req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  return res.json({ success: true, order });
});

// GET /api/orders - Admin list all orders
router.get('/', authenticate, requireAdmin, (req, res) => {
  let orders = db.getOrders();
  const { status, search } = req.query;

  if (status && status !== 'All') {
    orders = orders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
  }

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    orders = orders.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }

  return res.json({
    success: true,
    total: orders.length,
    orders
  });
});

// PATCH /api/orders/:id/status - Admin update order status
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
  const { status, trackingNumber } = req.body;
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const updated = db.updateOrderStatus(req.params.id, status, trackingNumber);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  return res.json({
    success: true,
    message: `Order status updated to ${status}.`,
    order: updated
  });
});

module.exports = router;
