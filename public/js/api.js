/**
 * Auspify Store - API Client Wrapper
 * Handles JWT storage, authorization headers, and REST communication
 */

const API = {
  BASE_URL: '/api',

  getToken() {
    return localStorage.getItem('auspify_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('auspify_token', token);
    } else {
      localStorage.removeItem('auspify_token');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('auspify_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('auspify_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auspify_user');
    }
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  },

  // Auth Endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      this.setToken(data.token);
      this.setCurrentUser(data.user);
    }
    return data;
  },

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) {
      this.setToken(data.token);
      this.setCurrentUser(data.user);
    }
    return data;
  },

  async getMe() {
    return await this.request('/auth/me');
  },

  async updateProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  logout() {
    this.setToken(null);
    this.setCurrentUser(null);
  },

  // Products Endpoints
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.featured) query.append('featured', 'true');

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await this.request(`/products${qs}`);
  },

  async getCategories() {
    return await this.request('/products/categories');
  },

  async getProductById(id) {
    return await this.request(`/products/${id}`);
  },

  async createProduct(productData) {
    return await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, productData) {
    return await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  // Cart Validation
  async validateCart(items, couponCode = '') {
    return await this.request('/cart/validate', {
      method: 'POST',
      body: JSON.stringify({ items, couponCode })
    });
  },

  // Orders Endpoints
  async placeOrder(orderData) {
    return await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getMyOrders() {
    return await this.request('/orders/my-orders');
  },

  async trackOrder(identifier) {
    return await this.request(`/orders/track/${encodeURIComponent(identifier)}`);
  },

  async getAllOrders(status = '', search = '') {
    const query = new URLSearchParams();
    if (status && status !== 'All') query.append('status', status);
    if (search) query.append('search', search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return await this.request(`/orders${qs}`);
  },

  async updateOrderStatus(id, status, trackingNumber) {
    return await this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, trackingNumber })
    });
  },

  // Admin Analytics Endpoints
  async getAdminStats() {
    return await this.request('/admin/stats');
  }
};

window.API = API;
