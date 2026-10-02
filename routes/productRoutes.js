const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET /api/products - List products with filter, search, sort
router.get('/', (req, res) => {
  try {
    let products = db.getProducts();
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;

    // Filter by Category
    if (category && category.toLowerCase() !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Featured
    if (featured === 'true') {
      products = products.filter(p => p.featured === true);
    }

    // Search query
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Price range
    if (minPrice && !isNaN(Number(minPrice))) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'reviews':
          products.sort((a, b) => b.reviewsCount - a.reviewsCount);
          break;
        default:
          break;
      }
    }

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
});

// GET /api/products/categories - Distinct categories with counts
router.get('/categories', (req, res) => {
  const all = db.getProducts();
  const counts = {};
  all.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  const categories = Object.keys(counts).map(name => ({
    name,
    count: counts[name]
  }));

  res.json({
    success: true,
    totalProducts: all.length,
    categories
  });
});

// GET /api/products/:id - Single product details
router.get('/:id', (req, res) => {
  const product = db.findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json({ success: true, product });
});

// POST /api/products - Admin create product
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, category, price, originalPrice, description, image, stock, featured, badge, tags } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product name, category, and price are required.' });
    }

    const newProduct = {
      id: 'prod_' + Date.now(),
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      description: description ? description.trim() : 'High-quality crafted product.',
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      stock: stock !== undefined ? parseInt(stock, 10) : 10,
      rating: 5.0,
      reviewsCount: 1,
      featured: Boolean(featured),
      badge: badge ? badge.trim() : null,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      createdAt: new Date().toISOString()
    };

    db.addProduct(newProduct);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: newProduct
    });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

// PUT /api/products/:id - Admin update product
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const existing = db.findProductById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const { name, category, price, originalPrice, description, image, stock, featured, badge, tags } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (category) updates.category = category.trim();
    if (price !== undefined) updates.price = parseFloat(price);
    if (originalPrice !== undefined) updates.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (description !== undefined) updates.description = description.trim();
    if (image) updates.image = image.trim();
    if (stock !== undefined) updates.stock = parseInt(stock, 10);
    if (featured !== undefined) updates.featured = Boolean(featured);
    if (badge !== undefined) updates.badge = badge ? badge.trim() : null;
    if (tags !== undefined) {
      updates.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }

    const updated = db.updateProduct(req.params.id, updates);

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

// DELETE /api/products/:id - Admin delete product
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  return res.json({
    success: true,
    message: 'Product deleted successfully.',
    product: deleted
  });
});

module.exports = router;
