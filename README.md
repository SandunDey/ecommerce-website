# 🛒 Auspify E-Commerce Platform

> **Full Stack Development Internship Program — Task 4 (Medium)**  
> Developed for **Auspify Technologies**  
> Built with Node.js, Express.js, Vanilla CSS, Modern JavaScript, and RESTful Architecture.

---

## 🌟 Overview

The **Auspify E-Commerce Platform** is a full-stack, responsive web application engineered for modern product browsing, cart handling, order fulfillment, and catalog inventory management. It combines a client-side storefront with an Express backend, complete with JWT-based role authentication, a slide-out shopping drawer, multi-step checkout with live stock updates, order tracking, and an Admin Management Portal.

---

## 🚀 Key Features

### 1. 🛍️ Product Catalog & Discovery
- **Multi-Category Navigation**: Quick-filter by *Electronics*, *Fashion*, *Footwear*, *Accessories*, and *Home & Living*.
- **Live Debounced Search**: Instant search by title, description, category, or tags.
- **Sorting & Filtering**: Sort by Featured, Price (Low to High, High to Low), Top Rated, Most Reviewed, and Newest Arrivals.
- **Price Brackets**: Filter by custom price intervals.
- **Quick View Modal**: Interactive modal with high-res photography, verified star ratings, inventory count, tags, and direct bag addition.

### 2. 👜 Smart Shopping Cart Drawer
- **Slide-out Cart**: Accessible from any view without losing browsing context.
- **Real-Time Price & Inventory Calculations**: Subtotal, 5% estimated tax, shipping calculation, and grand total.
- **Free Shipping Progress Tracker**: Visual progress bar unlocking Free Shipping on orders over $150.
- **Promo Coupon System**:
  - `AUSPIFY20` — 20% discount storewide
  - `WELCOME10` — $30 discount on orders over $100
  - `FREESHIP` — 100% Free Shipping on any order amount

### 3. 🔐 User Accounts & Role-Based Authentication
- **Secure Authentication**: Password hashing with `bcryptjs` and session issuance via signed JSON Web Tokens (`jsonwebtoken`).
- **Role-Based Access Control**: Separate privileges for **Customers** and **Store Administrators**.
- **1-Click Demo Logins**: Pre-configured buttons to sign in as Admin or Demo Customer with one click.
- **Customer Portal**: View past orders with itemized lists, totals, and live fulfillment statuses.

### 4. 📦 Multi-Step Checkout & Order Management
- **Step 1: Shipping Destination**: Address details form with auto-fill for logged-in accounts.
- **Step 2: Payment Authorization**: Support for simulated Credit/Debit Card, Cash on Delivery (COD), and PayPal Express.
- **Step 3: Receipt & Confirmation**: Real-time stock decrement, unique Order Number generation (`ORD-XXXXXX`), and tracking code assignment (`TRK-XXXXXXX`).
- **Dedicated Package Tracker**: Enter any order or tracking code to view an interactive visual timeline (*Pending* → *Processing* → *Shipped* → *Delivered*).

### 5. 🛡️ Admin Management Portal
- **Key Metrics Dashboard**: Total Revenue, Total Orders, Active Catalog Items, and Low-Stock Warnings.
- **Product Inventory CRUD**: Add new products, edit specifications/pricing/stock, and delete items from the catalog.
- **Order Fulfillment**: Filter orders by status, change status (*Pending*, *Processing*, *Shipped*, *Delivered*, *Cancelled*), and assign tracking numbers.

### 6. 🎨 Modern Design & Aesthetics
- **Theme Switcher**: Instant Dark Mode and Light Mode with system persistence.
- **Glassmorphism & Micro-Animations**: Smooth transitions, backdrop filters, glowing accents, and animated toast notifications.
- **Responsive Layout**: Designed for mobile phones, tablets, laptops, and ultra-wide desktops.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, Modern Vanilla CSS (CSS Variables, Flexbox, Grid), JavaScript (ES6+), FontAwesome Icons |
| **Backend** | Node.js, Express.js |
| **Authentication** | JWT (`jsonwebtoken`), Password encryption (`bcryptjs`) |
| **Data Persistence** | Zero-config atomic JSON storage (`data/db.json`) |
| **Architecture** | RESTful APIs, Clean MVC Separation, SPA Client Routing |

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Admin** | `admin@auspify.com` | `admin123` | Full access to Admin Portal, Inventory CRUD, Order Status Management |
| **Customer** | `demo@example.com` | `user123` | Product browsing, Cart, Checkout, Order History |

*(You can also use the **1-Click Demo Login** buttons inside the Sign In modal).*

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- npm (v7.0.0 or higher)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SandunDey/ecommerce-website.git
cd ecommerce-website
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will start at:
👉 **`http://localhost:3000`**

### 3. Run Automated Tests
```bash
npm test
```
Executes all 9 full-stack integration tests covering catalog filtering, cart calculations, coupon discounts, order placement, tracking lookup, and admin operations.

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch active user profile | Authenticated |
| `PUT` | `/api/auth/profile` | Update profile information | Authenticated |

### 🛍️ Products (`/api/products`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Query products with search, category, sort, price filters | Public |
| `GET` | `/api/products/categories` | List product categories with item counts | Public |
| `GET` | `/api/products/:id` | Get individual product details | Public |
| `POST` | `/api/products` | Create a new catalog product | Admin Only |
| `PUT` | `/api/products/:id` | Update product details | Admin Only |
| `DELETE` | `/api/products/:id` | Remove product from catalog | Admin Only |

### 👜 Cart & Pricing (`/api/cart`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/cart/validate` | Validate items, check stock, apply promo code, compute totals | Public |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/orders` | Place a new order & decrement stock | Public / Auth |
| `GET` | `/api/orders/my-orders` | Get order history of logged-in customer | Authenticated |
| `GET` | `/api/orders/track/:id` | Look up order status by Order # or Tracking # | Public |
| `GET` | `/api/orders` | List all orders with status/search filtering | Admin Only |
| `PATCH` | `/api/orders/:id/status`| Update order status & tracking number | Admin Only |

### 📊 Admin Analytics (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Retrieve revenue, orders, inventory, and low-stock alerts | Admin Only |

---

## 📁 Project Structure

```
ecommerce-website/
├── data/
│   ├── db.js              # Database helper & seed definitions
│   └── db.json            # Persistent JSON database
├── middleware/
│   └── auth.js            # JWT verification & role-based access guard
├── public/
│   ├── css/
│   │   └── style.css      # Design system, glassmorphism, responsive styles
│   ├── js/
│   │   ├── api.js         # Client-side REST API library
│   │   └── app.js         # State management & UI workflow controllers
│   └── index.html         # Single-Page Storefront & Admin Portal
├── routes/
│   ├── adminRoutes.js     # Admin statistics & metrics routes
│   ├── authRoutes.js      # Register, login, profile routes
│   ├── cartRoutes.js      # Cart pricing & discount calculation routes
│   ├── orderRoutes.js     # Order placement & fulfillment routes
│   └── productRoutes.js   # Product catalog CRUD routes
├── .gitignore
├── package.json           # Project metadata & npm scripts
├── server.js              # Express application server entry point
├── test_workflow.js       # Automated end-to-end integration test suite
└── README.md              # Project documentation
```

---

## 📜 Internship Attribution
- **Organization**: Auspify Technologies
- **Program**: 4-Week Practical Learning Internship Program (Full Stack Development)
- **Task**: Task 4 (Medium) — E-Commerce Website