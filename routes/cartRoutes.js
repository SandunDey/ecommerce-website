const express = require('express');
const router = express.Router();
const db = require('../data/db');

// POST /api/cart/validate - Validate an array of items [{ productId, quantity }], compute totals, check stock, apply coupon
router.post('/validate', (req, res) => {
  try {
    const { items = [], couponCode = '' } = req.body;

    const validatedItems = [];
    let subtotal = 0;
    let hasOutOfStock = false;

    for (const item of items) {
      const product = db.findProductById(item.productId);
      if (!product) {
        continue;
      }

      const requestedQty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const isAvailable = product.stock >= requestedQty;
      if (!isAvailable) {
        hasOutOfStock = true;
      }

      const itemTotal = Number((product.price * requestedQty).toFixed(2));
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: requestedQty,
        stock: product.stock,
        itemTotal,
        inStock: isAvailable
      });
    }

    subtotal = Number(subtotal.toFixed(2));

    // Handle Coupons
    let discount = 0;
    let appliedCoupon = null;
    let couponMessage = '';

    if (couponCode) {
      const coupon = db.getCoupon(couponCode);
      if (coupon) {
        if (coupon.minOrder && subtotal < coupon.minOrder) {
          couponMessage = `Minimum order amount of $${coupon.minOrder} required for ${coupon.code}`;
        } else {
          appliedCoupon = coupon;
          if (coupon.discountPercent) {
            discount = Number(((subtotal * coupon.discountPercent) / 100).toFixed(2));
          } else if (coupon.discountAmount) {
            discount = Math.min(subtotal, coupon.discountAmount);
          }
          couponMessage = `Coupon "${coupon.code}" applied! ${coupon.description}`;
        }
      } else {
        couponMessage = 'Invalid promo code.';
      }
    }

    // Shipping: Free if subtotal > 150 or if coupon provides free shipping, else $9.99
    let shippingFee = 9.99;
    if (subtotal === 0 || subtotal >= 150 || (appliedCoupon && appliedCoupon.freeShipping)) {
      shippingFee = 0;
    }

    const estimatedTax = Number(((subtotal - discount) * 0.05).toFixed(2));
    const grandTotal = Number(Math.max(0, subtotal - discount + shippingFee + estimatedTax).toFixed(2));

    return res.json({
      success: true,
      items: validatedItems,
      itemCount: validatedItems.reduce((acc, i) => acc + i.quantity, 0),
      subtotal,
      discount,
      shippingFee,
      estimatedTax,
      total: grandTotal,
      coupon: appliedCoupon ? { code: appliedCoupon.code, description: appliedCoupon.description } : null,
      couponMessage,
      hasOutOfStock
    });
  } catch (err) {
    console.error('Cart validation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to calculate cart.' });
  }
});

module.exports = router;
