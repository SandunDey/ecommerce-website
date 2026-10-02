const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'db.json');

// Initial seed data with high-resolution Unsplash images and realistic specs
const getInitialData = () => {
  const hashedPasswordAdmin = bcrypt.hashSync('admin123', 10);
  const hashedPasswordUser = bcrypt.hashSync('user123', 10);

  return {
    users: [
      {
        id: 'usr_admin',
        name: 'Auspify Admin',
        email: 'admin@auspify.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        phone: '+1 (555) 019-2834',
        address: '100 Innovation Way, Tech Park, CA',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_demo',
        name: 'Alex Johnson',
        email: 'demo@example.com',
        password: hashedPasswordUser,
        role: 'customer',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Springfield, OR',
        createdAt: new Date().toISOString()
      }
    ],
    products: [
      {
        id: 'prod_1',
        name: 'Aura Wireless Noise-Cancelling Headphones',
        category: 'Electronics',
        price: 249.99,
        originalPrice: 299.99,
        rating: 4.8,
        reviewsCount: 142,
        stock: 25,
        featured: true,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        badge: 'Bestseller',
        description: 'Immerse yourself in rich, high-fidelity audio with active noise cancellation, 40-hour battery life, and plush memory foam earcups.',
        tags: ['audio', 'wireless', 'bluetooth', 'premium'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_2',
        name: 'Chronos Smart Fitness Watch Series 5',
        category: 'Electronics',
        price: 189.99,
        originalPrice: 229.99,
        rating: 4.7,
        reviewsCount: 98,
        stock: 18,
        featured: true,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        badge: 'Popular',
        description: 'Track your vitals, sleep, workouts, and notifications with an edge-to-edge AMOLED display, 5ATM water resistance, and 7-day battery.',
        tags: ['smartwatch', 'fitness', 'tech', 'waterproof'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_3',
        name: 'Tactile RGB Mechanical Gaming Keyboard',
        category: 'Electronics',
        price: 119.99,
        originalPrice: 149.99,
        rating: 4.9,
        reviewsCount: 76,
        stock: 12,
        featured: false,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        badge: 'Hot Deal',
        description: 'Hot-swappable switches, PBT double-shot keycaps, aluminum frame, and customizable per-key dynamic RGB backlighting.',
        tags: ['gaming', 'keyboard', 'rgb', 'peripherals'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_4',
        name: 'Apex 4K Ultra HD Waterproof Action Cam',
        category: 'Electronics',
        price: 279.99,
        originalPrice: 320.00,
        rating: 4.6,
        reviewsCount: 53,
        stock: 9,
        featured: false,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        badge: null,
        description: 'Capture smooth 4K 60fps video with dual touchscreens, advanced gyro stabilization, and waterproof housing up to 30 meters.',
        tags: ['camera', 'action', 'video', '4k'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_5',
        name: 'Classic Vintage Denim Overshirt',
        category: 'Fashion',
        price: 79.99,
        originalPrice: 95.00,
        rating: 4.5,
        reviewsCount: 64,
        stock: 30,
        featured: true,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
        badge: 'Trending',
        description: 'Durable 100% heavyweight cotton denim crafted with vintage wash styling, reinforced stitching, and dual chest pockets.',
        tags: ['denim', 'casual', 'jacket', 'cotton'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_6',
        name: 'Everyday Minimalist Organic Cotton Hoodie',
        category: 'Fashion',
        price: 64.99,
        originalPrice: 79.99,
        rating: 4.8,
        reviewsCount: 110,
        stock: 45,
        featured: true,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        badge: 'Eco Friendly',
        description: 'Ultra-soft brushed fleece interior made with sustainably sourced organic cotton. Designed with clean drop shoulders and ribbed trims.',
        tags: ['hoodie', 'apparel', 'cozy', 'minimalist'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_7',
        name: 'Urban Streetwear Relaxed Cargo Pants',
        category: 'Fashion',
        price: 69.99,
        originalPrice: 85.00,
        rating: 4.4,
        reviewsCount: 38,
        stock: 22,
        featured: false,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        badge: null,
        description: 'Engineered for comfort and utility with deep multi-pocket layout, elasticated waist with drawstring, and premium ripstop fabric.',
        tags: ['pants', 'cargo', 'streetwear', 'utility'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_8',
        name: 'Tailored Italian Wool Blend Blazer',
        category: 'Fashion',
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.9,
        reviewsCount: 41,
        stock: 15,
        featured: false,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        badge: 'Premium',
        description: 'Sophisticated single-breasted blazer woven from soft wool blend, featuring notched lapels, horn buttons, and silky cupro lining.',
        tags: ['blazer', 'formal', 'wool', 'luxury'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_9',
        name: 'AeroStride Pro Running Sneakers',
        category: 'Footwear',
        price: 139.99,
        originalPrice: 165.00,
        rating: 4.8,
        reviewsCount: 88,
        stock: 28,
        featured: true,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        badge: 'Top Rated',
        description: 'Breathable engineered mesh upper paired with energy-returning nitrogen-infused foam midsole for maximum cushion and responsiveness.',
        tags: ['shoes', 'sneakers', 'running', 'sport'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_10',
        name: 'Handcrafted Full-Grain Chelsea Boots',
        category: 'Footwear',
        price: 179.99,
        originalPrice: 219.99,
        rating: 4.7,
        reviewsCount: 52,
        stock: 14,
        featured: false,
        image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
        badge: 'Crafted',
        description: 'Hand-burnished full grain leather with elastic side gussets, Goodyear welted construction, and shock-absorbing rubber outsole.',
        tags: ['boots', 'leather', 'chelsea', 'footwear'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_11',
        name: 'Polarized Titanium Aviator Sunglasses',
        category: 'Accessories',
        price: 89.99,
        originalPrice: 110.00,
        rating: 4.6,
        reviewsCount: 71,
        stock: 35,
        featured: false,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        badge: null,
        description: 'Ultra-lightweight titanium frame with anti-reflective UV400 polarized glass lenses offering 100% UVA/UVB protection.',
        tags: ['sunglasses', 'accessories', 'eyewear', 'summer'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_12',
        name: 'Artisan Vegetable-Tanned Bifold Wallet',
        category: 'Accessories',
        price: 49.99,
        originalPrice: 65.00,
        rating: 4.9,
        reviewsCount: 115,
        stock: 40,
        featured: true,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        badge: 'Bestseller',
        description: 'Slimline wallet made with genuine Tuscan vegetable-tanned leather that develops a rich natural patina over time. Includes RFID protection.',
        tags: ['wallet', 'leather', 'accessories', 'rfid'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_13',
        name: 'Thermal Double-Walled Travel Tumbler',
        category: 'Home & Living',
        price: 34.99,
        originalPrice: 42.00,
        rating: 4.7,
        reviewsCount: 83,
        stock: 50,
        featured: false,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        badge: null,
        description: 'Keeps liquids hot for 12 hours or iced for 24 hours. Food-grade 18/8 stainless steel with leakproof 360-degree sipping lid.',
        tags: ['tumbler', 'kitchen', 'home', 'coffee'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'prod_14',
        name: 'Aroma Diffuser & Ambient Warm Lamp',
        category: 'Home & Living',
        price: 45.99,
        originalPrice: 58.00,
        rating: 4.8,
        reviewsCount: 67,
        stock: 20,
        featured: true,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        badge: 'Trending',
        description: 'Ultrasonic whisper-quiet mist diffuser with soothing breathing LED light, auto shut-off safety sensor, and natural ceramic finish.',
        tags: ['diffuser', 'wellness', 'home', 'lighting'],
        createdAt: new Date().toISOString()
      }
    ],
    orders: [
      {
        id: 'ord_1001',
        orderNumber: 'ORD-98231',
        userId: 'usr_demo',
        customerName: 'Alex Johnson',
        customerEmail: 'demo@example.com',
        phone: '+1 (555) 234-5678',
        shippingAddress: {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          zip: '97477',
          country: 'United States'
        },
        items: [
          {
            productId: 'prod_1',
            name: 'Aura Wireless Noise-Cancelling Headphones',
            price: 249.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
          },
          {
            productId: 'prod_12',
            name: 'Artisan Vegetable-Tanned Bifold Wallet',
            price: 49.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 299.98,
        discount: 30.00,
        couponCode: 'WELCOME10',
        shippingFee: 0,
        total: 269.98,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        trackingNumber: 'TRK-USPS-8291402',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ord_1002',
        orderNumber: 'ORD-98245',
        userId: 'usr_demo',
        customerName: 'Alex Johnson',
        customerEmail: 'demo@example.com',
        phone: '+1 (555) 234-5678',
        shippingAddress: {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          zip: '97477',
          country: 'United States'
        },
        items: [
          {
            productId: 'prod_2',
            name: 'Chronos Smart Fitness Watch Series 5',
            price: 189.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
          }
        ],
        subtotal: 189.99,
        discount: 0,
        couponCode: null,
        shippingFee: 10.00,
        total: 199.99,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Processing',
        trackingNumber: 'TRK-FDX-3829104',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ],
    coupons: [
      { code: 'AUSPIFY20', discountPercent: 20, description: '20% off all products' },
      { code: 'WELCOME10', discountAmount: 30, minOrder: 100, description: '$30 off orders above $100' },
      { code: 'FREESHIP', freeShipping: true, description: 'Free shipping on any order' }
    ]
  };
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(path.dirname(DB_PATH))) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      this.data = initial;
    } else {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db.json, recreating initial data:', err);
        const initial = getInitialData();
        fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
        this.data = initial;
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // User methods
  getUsers() {
    return this.data.users;
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  findUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  // Product methods
  getProducts() {
    return this.data.products;
  }

  findProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(product) {
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  updateProduct(id, updates) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.save();
      return this.data.products[idx];
    }
    return null;
  }

  deleteProduct(id) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const deleted = this.data.products.splice(idx, 1)[0];
      this.save();
      return deleted;
    }
    return null;
  }

  // Order methods
  getOrders() {
    return this.data.orders;
  }

  findOrderById(id) {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  findOrdersByUserId(userId) {
    return this.data.orders.filter(o => o.userId === userId);
  }

  addOrder(order) {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  updateOrderStatus(id, status, trackingNumber) {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (order) {
      order.orderStatus = status;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      order.updatedAt = new Date().toISOString();
      this.save();
      return order;
    }
    return null;
  }

  // Coupon methods
  getCoupon(code) {
    if (!code) return null;
    return this.data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  }
}

module.exports = new Database();
